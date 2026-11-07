import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { apiEnvironmentSchema } from "@zenval/config";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const environment = apiEnvironmentSchema.parse(process.env);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  app.enableCors({
    origin: environment.WEB_ORIGIN,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "X-Demo-Session-Id", "X-Idempotency-Key"],
    credentials: false,
  });
  app.setGlobalPrefix("v1");
  app.enableShutdownHooks();
  await app.listen(environment.API_PORT, environment.API_HOST);
}

void bootstrap();
