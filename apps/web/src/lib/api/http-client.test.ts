import { dashboardSnapshotSchema } from "@zenval/contracts";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { ApiError } from "./errors";
import { createHttpClient } from "./http-client";
import demoWorkspace from "./mock/demo-workspace.json";

async function failure(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (error) {
    if (error instanceof ApiError) return error;
    throw error;
  }
  throw new Error("Expected the request to fail");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("createHttpClient", () => {
  it("parses responses with the runtime contract", async () => {
    const fetch = vi.fn(async () => jsonResponse(demoWorkspace.dashboard));
    const client = createHttpClient({ baseUrl: "http://api.test/v1", fetch });

    const snapshot = await client.get("/demo/dashboard", dashboardSnapshotSchema);

    expect(snapshot.safeToSpend.amount.value).toEqual({ amount: "12400000", currency: "VND" });
    expect(fetch).toHaveBeenCalledWith(
      "http://api.test/v1/demo/dashboard",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("sends JSON, idempotency and custom headers on mutations", async () => {
    const fetch = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) =>
      jsonResponse({ ok: true }),
    );
    const client = createHttpClient({
      baseUrl: "http://api.test/v1",
      fetch,
      getHeaders: () => ({ "X-Demo-Session-Id": "session-1" }),
    });

    await client.post("/things", { a: 1 }, z.object({ ok: z.boolean() }), {
      idempotencyKey: "key-1",
    });

    const init = fetch.mock.calls[0]?.[1];
    expect(init?.method).toBe("POST");
    expect(init?.body).toBe('{"a":1}');
    expect(init?.headers).toMatchObject({
      "Content-Type": "application/json",
      "X-Idempotency-Key": "key-1",
      "X-Demo-Session-Id": "session-1",
    });
  });

  it("maps HTTP errors to ApiError with the server message and retryability", async () => {
    const client = createHttpClient({
      baseUrl: "http://api.test/v1",
      fetch: async () =>
        jsonResponse({ statusCode: 400, message: "Unknown source account", error: "Bad" }, 400),
    });

    const error = await failure(client.get("/x", z.unknown()));

    expect(error).toMatchObject({ code: "http", status: 400, message: "Unknown source account" });
    expect(error.isRetryable).toBe(false);
  });

  it("treats 5xx and network failures as retryable", async () => {
    const serverError = await failure(
      createHttpClient({
        baseUrl: "",
        fetch: async () => jsonResponse({ message: "down" }, 503),
      }).get("/x", z.unknown()),
    );
    expect(serverError.isRetryable).toBe(true);

    const networkError = await failure(
      createHttpClient({
        baseUrl: "",
        fetch: async () => {
          throw new TypeError("fetch failed");
        },
      }).get("/x", z.unknown()),
    );
    expect(networkError).toMatchObject({ code: "network" });
    expect(networkError.isRetryable).toBe(true);
  });

  it("rejects responses that violate the contract instead of rendering them", async () => {
    const client = createHttpClient({
      baseUrl: "",
      fetch: async () => jsonResponse({ ...demoWorkspace.dashboard, workspaceId: "other" }),
    });

    await expect(client.get("/demo/dashboard", dashboardSnapshotSchema)).rejects.toMatchObject({
      code: "invalid-response",
    });
  });
});
