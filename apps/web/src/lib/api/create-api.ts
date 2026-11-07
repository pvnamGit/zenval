import { apiConfig } from "./config";
import { createHttpApi, getDemoSessionId } from "./http-api";
import { createHttpClient } from "./http-client";
import { createMockApi } from "./mock/mock-api";
import type { ZenvalApiClient } from "./types";

/** Composition root for the browser API client. */
export function createZenvalApi(config: typeof apiConfig = apiConfig): ZenvalApiClient {
  const mock = createMockApi({ latencyMs: config.mockLatencyMs });
  if (config.mode === "mock") return mock;

  const client = createHttpClient({
    baseUrl: config.baseUrl,
    getHeaders: () => ({ "X-Demo-Session-Id": getDemoSessionId() }),
  });
  return createHttpApi(client, mock);
}
