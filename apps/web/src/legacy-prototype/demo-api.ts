import {
  type CreateDemoTransactionRequest,
  type CreateDemoTransactionResponse,
  createDemoTransactionResponseSchema,
  type DashboardSnapshot,
  type DemoFinanceSnapshot,
  dashboardSnapshotSchema,
  demoFinanceSnapshotSchema,
} from "@zenval/contracts";

export const demoApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/v1";

async function readJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`Demo API request failed with ${response.status}`);
  }
  return response.json();
}

export async function getDemoDashboard(signal?: AbortSignal): Promise<DashboardSnapshot> {
  const response = await fetch(`${demoApiBaseUrl}/demo/dashboard`, signal ? { signal } : undefined);
  return dashboardSnapshotSchema.parse(await readJson(response));
}

export async function getDemoFinance(signal?: AbortSignal): Promise<DemoFinanceSnapshot> {
  const response = await fetch(`${demoApiBaseUrl}/demo/finance`, signal ? { signal } : undefined);
  return demoFinanceSnapshotSchema.parse(await readJson(response));
}

export async function createDemoTransaction(
  request: CreateDemoTransactionRequest,
  idempotencyKey: string,
  demoSessionId: string,
): Promise<CreateDemoTransactionResponse> {
  const response = await fetch(`${demoApiBaseUrl}/demo/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Demo-Session-Id": demoSessionId,
      "X-Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(request),
  });
  return createDemoTransactionResponseSchema.parse(await readJson(response));
}
