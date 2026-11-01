import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { workerEnvironmentSchema } from "@zenval/config";
import { WorkerModule } from "./worker.module";

async function bootstrap(): Promise<void> {
  const environment = workerEnvironmentSchema.parse(process.env);
  const app = await NestFactory.create<NestFastifyApplication>(WorkerModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  app.setGlobalPrefix("internal");
  app.enableShutdownHooks();
  await app.listen(environment.WORKER_PORT, environment.WORKER_HOST);
}

void bootstrap();
