export type ApiMode = "mock" | "http";

function readMode(value: string | undefined): ApiMode {
  return value === "http" ? "http" : "mock";
}

/**
 * Public, build-time API configuration. `NEXT_PUBLIC_*` values are inlined by Next.js, so nothing
 * secret may ever be configured here.
 */
export const apiConfig = {
  mode: readMode(process.env.NEXT_PUBLIC_API_MODE),
  baseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/v1").replace(/\/+$/, ""),
  /** Simulated latency for the mock adapter so loading states stay visible during development. */
  mockLatencyMs: Number.parseInt(process.env.NEXT_PUBLIC_API_MOCK_LATENCY_MS ?? "350", 10) || 0,
} as const;

