import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { AppModule } from "./app.module";
import { DatabaseService } from "./database.service";

describe("database readiness HTTP API", () => {
  let app: NestFastifyApplication;
  let database: DatabaseService;

  beforeAll(async () => {
    app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
      logger: false,
    });
    app.setGlobalPrefix("v1");
    await app.init();
    database = app.get(DatabaseService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("reports readiness only when PostgreSQL is reachable", async () => {
    const check = vi.spyOn(database, "isReady");
    check.mockResolvedValueOnce(true).mockResolvedValueOnce(false);
    const server = app.getHttpAdapter().getInstance();
    const ready = await server.inject({ method: "GET", url: "/v1/health/ready" });
    const unavailable = await server.inject({ method: "GET", url: "/v1/health/ready" });
    expect(ready.statusCode).toBe(200);
    expect(ready.json()).toEqual({ status: "ok" });
    expect(unavailable.statusCode).toBe(503);
    expect(unavailable.json().message).toBe("Database unavailable");
    check.mockRestore();
  });
});
