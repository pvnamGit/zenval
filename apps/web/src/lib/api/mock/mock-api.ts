import {
  type CreateDemoTransactionResponse,
  createDemoTransactionRequestSchema,
  type DemoFinanceSnapshot,
  type DemoTransaction,
  demoWorkspaceFixtureSchema,
} from "@zenval/contracts";
import type { ReviewResolution } from "../draft-schemas";
import { ApiError } from "../errors";
import type { RequestOptions } from "../http-client";
import type { ZenvalApiClient } from "../types";
import demoWorkspace from "./demo-workspace.json";
import {
  debtsFixture,
  extraTransactions,
  investmentsFixture,
  planningFixture,
  reportsFixture,
  vnd,
} from "./fixtures";

type MockApiOptions = {
  latencyMs?: number;
  now?: () => Date;
};

function wait(ms: number, signal: AbortSignal | undefined): Promise<void> {
  if (signal?.aborted) {
    return Promise.reject(new ApiError("aborted", "Request was cancelled"));
  }
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new ApiError("aborted", "Request was cancelled"));
      },
      { once: true },
    );
  });
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

/**
 * In-memory adapter that mirrors the API's observable behavior (contracts, idempotency, draft-only
 * captures) so the UI can be built and tested without a running backend.
 */
export function createMockApi(options: MockApiOptions = {}): ZenvalApiClient {
  const latency = options.latencyMs ?? 0;
  const now = options.now ?? (() => new Date());
  const seed = demoWorkspaceFixtureSchema.parse(demoWorkspace);

  const finance: DemoFinanceSnapshot = clone(seed.finance);
  finance.transactions = [...finance.transactions, ...clone(extraTransactions)].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  );

  const captures = new Map<string, { fingerprint: string; transaction: DemoTransaction }>();
  const resolutions = new Map<string, ReviewResolution>();
  let captureSequence = 0;

  async function read<T>(value: T, request?: RequestOptions): Promise<T> {
    await wait(latency, request?.signal);
    return clone(value);
  }

  return {
    sources: {
      dashboard: "mock",
      finance: "mock",
      transactions: "mock",
      review: "mock",
      planning: "mock",
      debts: "mock",
      investments: "mock",
      reports: "mock",
    },
    dashboard: {
      get: async (request) => {
        const reviewCount = finance.reviewItems.filter((item) => item.bucket === "review").length;
        return read({ ...seed.dashboard, reviewCount }, request);
      },
    },
    finance: {
      get: (request) => read(finance, request),
    },
    transactions: {
      create: async (rawRequest, request) => {
        await wait(latency, request.signal);
        const parsed = createDemoTransactionRequestSchema.safeParse(rawRequest);
        if (!parsed.success) {
          throw new ApiError("validation", "Invalid transaction", {
            status: 400,
            details: parsed.error.issues,
          });
        }
        const body = parsed.data;
        const fingerprint = JSON.stringify(body);
        const existing = captures.get(request.idempotencyKey);
        if (existing) {
          if (existing.fingerprint !== fingerprint) {
            throw new ApiError("http", "Idempotency key was already used for a different request", {
              status: 400,
            });
          }
          return { transaction: clone(existing.transaction), replayed: true };
        }

        const accountIds = new Set(finance.accounts.map((account) => account.id));
        if (!accountIds.has(body.sourceAccountId)) {
          throw new ApiError("http", "Unknown source account", { status: 400 });
        }
        if (body.destinationAccountId && !accountIds.has(body.destinationAccountId)) {
          throw new ApiError("http", "Unknown destination account", { status: 400 });
        }

        captureSequence += 1;
        const sign = body.kind === "expense" ? "−" : body.kind === "income" ? "+" : "";
        const transaction: DemoTransaction = {
          id: `mock-capture-${captureSequence}`,
          workspaceId: body.workspaceId,
          occurredAt: now().toISOString(),
          kind: body.kind,
          // Captures are drafts: never posted ledger facts, so no P&L impact yet.
          status: "draft",
          title:
            body.kind === "transfer"
              ? "Chuyển khoản"
              : body.kind === "income"
                ? (body.category ?? "Thu nhập")
                : (body.category ?? "Chi tiêu"),
          category: body.kind === "transfer" ? null : body.category,
          amount: vnd(body.amount.amount, sign),
          pnlImpact: false,
          sourceAccountId: body.sourceAccountId,
          destinationAccountId: body.kind === "transfer" ? body.destinationAccountId : null,
          note: "",
          source: "mock-json",
        };
        captures.set(request.idempotencyKey, { fingerprint, transaction });
        const response: CreateDemoTransactionResponse = { transaction, replayed: false };
        return clone(response);
      },
    },
    review: {
      resolve: async (itemId, action, request) => {
        await wait(latency, request.signal);
        const replay = resolutions.get(request.idempotencyKey);
        if (replay) return clone(replay);

        const index = finance.reviewItems.findIndex((item) => item.id === itemId);
        const item = finance.reviewItems[index];
        if (item?.bucket !== "review") {
          throw new ApiError("http", "Review item not found", { status: 404 });
        }
        if (action === "dismiss" || item.kind === "duplicate") {
          // Dismissing, or confirming a duplicate, removes the candidate from the inbox.
          finance.reviewItems.splice(index, 1);
        } else {
          finance.reviewItems[index] = { ...item, bucket: "posted" };
        }
        const resolution: ReviewResolution = {
          itemId,
          action,
          resolvedAt: now().toISOString(),
        };
        resolutions.set(request.idempotencyKey, resolution);
        return clone(resolution);
      },
    },
    planning: { get: (request) => read(planningFixture, request) },
    debts: { get: (request) => read(debtsFixture, request) },
    investments: { get: (request) => read(investmentsFixture, request) },
    reports: { get: (request) => read(reportsFixture, request) },
  };
}
