import { createHash } from "node:crypto";
import { Injectable } from "@nestjs/common";
import {
  type CreateDemoTransactionRequest,
  type CreateDemoTransactionResponse,
  createDemoTransactionRequestSchema,
  type DemoFinanceSnapshot,
  type DemoTransaction,
  demoFinanceSnapshotSchema,
  demoWorkspaceFixtureSchema,
} from "@zenval/contracts";
import demoWorkspaceFixture from "./fixtures/demo-workspace.json";

function formatVnd(amount: string, kind: CreateDemoTransactionRequest["kind"]): string {
  const formatted = new Intl.NumberFormat("vi-VN").format(BigInt(amount));
  const prefix = kind === "expense" ? "−" : kind === "income" ? "+" : "";
  return `${prefix}${formatted} ₫`;
}

export class DemoCaptureCapacityError extends Error {
  constructor() {
    super("Demo capture capacity reached; reload the demo and try again");
  }
}

/**
 * Temporary adapter used until PostgreSQL is configured. It starts from a
 * synthetic JSON fixture and keeps captures only for the lifetime of this
 * process. It does not post ledger facts.
 */
@Injectable()
export class DemoFinanceService {
  private readonly seed = demoWorkspaceFixtureSchema.parse(demoWorkspaceFixture).finance;
  private readonly maxRuntimeCaptures = 1024;
  /**
   * This is deliberately process-local (and lost on restart), but it must not
   * evict active demo-tab keys: eviction could turn a retry into a duplicate.
   * New keys are refused at a fixed capacity instead, which bounds memory.
   * The key contains only hashes of client-generated identifiers, never capture
   * content or a real user identifier.
   */
  private readonly responsesBySessionAndIdempotencyKey = new Map<
    string,
    { requestFingerprint: string; transaction: DemoTransaction }
  >();

  getSnapshot(): DemoFinanceSnapshot {
    return demoFinanceSnapshotSchema.parse(this.seed);
  }

  createTransaction(
    rawRequest: CreateDemoTransactionRequest,
    idempotencyKey: string,
    demoSessionId: string,
  ): CreateDemoTransactionResponse {
    const request = createDemoTransactionRequestSchema.parse(rawRequest);
    const idempotencyFingerprint = createHash("sha256")
      .update(`${demoSessionId}:${idempotencyKey}`)
      .digest("hex");
    const requestFingerprint = createHash("sha256").update(JSON.stringify(request)).digest("hex");
    const existing = this.responsesBySessionAndIdempotencyKey.get(idempotencyFingerprint);
    if (existing) {
      if (existing.requestFingerprint !== requestFingerprint) {
        throw new Error("Idempotency key was already used for a different request");
      }
      return { transaction: existing.transaction, replayed: true };
    }

    if (this.responsesBySessionAndIdempotencyKey.size >= this.maxRuntimeCaptures) {
      throw new DemoCaptureCapacityError();
    }

    const accountIds = new Set(this.seed.accounts.map((account) => account.id));
    if (!accountIds.has(request.sourceAccountId)) {
      throw new Error("Unknown source account");
    }
    if (request.destinationAccountId && !accountIds.has(request.destinationAccountId)) {
      throw new Error("Unknown destination account");
    }

    const transaction: DemoTransaction = {
      id: `demo-capture-${idempotencyFingerprint.slice(0, 16)}`,
      workspaceId: request.workspaceId,
      occurredAt: new Date().toISOString(),
      kind: request.kind,
      status: "draft",
      title:
        request.kind === "transfer"
          ? "Chuyển khoản demo"
          : request.kind === "income"
            ? "Thu nhập demo"
            : "Chi tiêu demo",
      category: request.kind === "transfer" ? null : request.category,
      amount: {
        value: request.amount,
        display: formatVnd(request.amount.amount, request.kind),
      },
      pnlImpact: false,
      sourceAccountId: request.sourceAccountId,
      destinationAccountId: request.kind === "transfer" ? request.destinationAccountId : null,
      note: "",
      source: "mock-json",
    };

    this.responsesBySessionAndIdempotencyKey.set(idempotencyFingerprint, {
      requestFingerprint,
      transaction,
    });
    return { transaction, replayed: false };
  }
}
