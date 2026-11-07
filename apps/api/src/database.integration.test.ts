import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { describe, expect, it } from "vitest";
import { AppModule } from "./app.module";

// Opt in explicitly; this read-only check must not silently connect to a developer's database.
describe.skipIf(process.env.ZENVAL_DATABASE_INTEGRATION !== "1")("PostgreSQL integration", () => {
  it("serves readiness using the configured database", async () => {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
      logger: false,
    });
    try {
      app.setGlobalPrefix("v1");
      await app.init();
      const response = await app.getHttpAdapter().getInstance().inject({
        method: "GET",
        url: "/v1/health/ready",
      });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ status: "ok" });
    } finally {
      await app.close();
    }
  });
});
