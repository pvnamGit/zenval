import {
  createDemoTransactionResponseSchema,
  dashboardSnapshotSchema,
  demoFinanceSnapshotSchema,
} from "@zenval/contracts";
import { ApiError } from "./errors";
import type { HttpClient } from "./http-client";
import type { ApiModule, ApiSource, ZenvalApi, ZenvalApiClient } from "./types";

/**
 * HTTP adapter for the endpoints that exist in `apps/api` today.
 *
 * Modules without an endpoint are explicitly delegated to `fallback` (the mock adapter) and are
 * reported as `mock` in `sources`; switch each one here when its endpoint and contract land.
 */
export function createHttpApi(client: HttpClient, fallback: ZenvalApi): ZenvalApiClient {
  const api: ZenvalApi = {
    dashboard: {
      get: (options) => client.get("/demo/dashboard", dashboardSnapshotSchema, options),
    },
    finance: {
      get: (options) => client.get("/demo/finance", demoFinanceSnapshotSchema, options),
    },
    transactions: {
      create: (request, options) =>
        client.post("/demo/transactions", request, createDemoTransactionResponseSchema, options),
    },
    review: {
      // Pending endpoint: POST /review-items/:id/resolution
      resolve: async () => {
        throw new ApiError("not-implemented", "Review resolution is not available yet", {
          status: 501,
        });
      },
    },
    // Pending endpoints — served by the mock adapter until the API exposes them.
    planning: fallback.planning,
    debts: fallback.debts,
    investments: fallback.investments,
    reports: fallback.reports,
  };

  const sources: Record<ApiModule, ApiSource> = {
    dashboard: "http",
    finance: "http",
    transactions: "http",
    review: "http",
    planning: "mock",
    debts: "mock",
    investments: "mock",
    reports: "mock",
  };

  return { ...api, sources };
}

const demoSessionKey = "zenval.demo-session-id";

/** A per-tab identifier required by the demo capture endpoint. Contains no user data. */
export function getDemoSessionId(): string {
  try {
    const existing = window.sessionStorage.getItem(demoSessionKey);
    if (existing) return existing;
    const created = crypto.randomUUID();
    window.sessionStorage.setItem(demoSessionKey, created);
    return created;
  } catch {
    return "ephemeral-demo-session";
  }
}

