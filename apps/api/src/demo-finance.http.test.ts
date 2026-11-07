import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "./app.module";

const requestBody = {
  workspaceId: "demo-workspace",
  kind: "expense",
  amount: { amount: "125000", currency: "VND" },
  sourceAccountId: "account-vcb",
  destinationAccountId: null,
  category: "Ăn uống",
};
const headers = {
  origin: "http://localhost:3000",
  "x-demo-session-id": "demo-http-tab-a",
  "x-idempotency-key": "demo-http-capture-a",
};

describe("demo finance HTTP API", () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
      logger: false,
    });
    app.enableCors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "X-Demo-Session-Id", "X-Idempotency-Key"],
      credentials: false,
    });
    app.setGlobalPrefix("v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("serves the immutable JSON fixture and CORS metadata", async () => {
    const response = await app
      .getHttpAdapter()
      .getInstance()
      .inject({
        method: "GET",
        url: "/v1/demo/finance",
        headers: { origin: "http://localhost:3000" },
      });

    expect(response.statusCode, response.body).toBe(200);
    expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(response.json()).toMatchObject({ source: "mock-json", transactions: expect.any(Array) });
  });

  it("validates session/idempotency headers and replays only within the same demo tab", async () => {
    const server = app.getHttpAdapter().getInstance();
    const missingSession = await server.inject({
      method: "POST",
      url: "/v1/demo/transactions",
      headers: { "x-idempotency-key": "missing-session" },
      payload: requestBody,
    });
    expect(missingSession.statusCode).toBe(400);

    const first = await server.inject({
      method: "POST",
      url: "/v1/demo/transactions",
      headers,
      payload: requestBody,
    });
    const replay = await server.inject({
      method: "POST",
      url: "/v1/demo/transactions",
      headers,
      payload: requestBody,
    });
    const otherTab = await server.inject({
      method: "POST",
      url: "/v1/demo/transactions",
      headers: { ...headers, "x-demo-session-id": "demo-http-tab-b" },
      payload: requestBody,
    });

    expect(first.statusCode, first.body).toBe(201);
    expect(first.json()).toMatchObject({ replayed: false, transaction: { pnlImpact: false } });
    expect(replay.statusCode).toBe(201);
    expect(replay.json()).toMatchObject({ replayed: true });
    expect(otherTab.statusCode).toBe(201);
    expect(otherTab.json()).toMatchObject({ replayed: false });

    const snapshotAfterCaptures = await server.inject({ method: "GET", url: "/v1/demo/finance" });
    expect(snapshotAfterCaptures.statusCode).toBe(200);
    expect(snapshotAfterCaptures.json().transactions).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: first.json().transaction.id })]),
    );
  });
});
