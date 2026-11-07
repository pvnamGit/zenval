import { describe, expect, it } from "vitest";
import {
  createDemoTransactionRequestSchema,
  demoReviewItemSchema,
  demoTransactionSchema,
} from "./index";

const amount = {
  value: { amount: "100000", currency: "VND" },
  display: "100.000 ₫",
};

describe("demo finance contracts", () => {
  it("rejects current P&L impact on a transfer or non-posted transaction", () => {
    const transfer = demoTransactionSchema.safeParse({
      id: "transfer",
      workspaceId: "demo-workspace",
      occurredAt: "2026-11-05T03:00:00.000Z",
      kind: "transfer",
      status: "posted",
      title: "Transfer",
      category: null,
      amount,
      pnlImpact: true,
      sourceAccountId: "account-a",
      destinationAccountId: "account-b",
      note: "",
      source: "mock-json",
    });
    const draft = demoTransactionSchema.safeParse({
      id: "draft",
      workspaceId: "demo-workspace",
      occurredAt: "2026-11-05T03:00:00.000Z",
      kind: "expense",
      status: "draft",
      title: "Expense",
      category: "Food",
      amount,
      pnlImpact: true,
      sourceAccountId: "account-a",
      destinationAccountId: null,
      note: "",
      source: "mock-json",
    });

    expect(transfer.success).toBe(false);
    expect(draft.success).toBe(false);
  });

  it("rejects P&L impact on transfer and pending review items", () => {
    const base = {
      id: "review-item",
      workspaceId: "demo-workspace" as const,
      title: "Review",
      amount,
      detail: "Synthetic review item",
    };

    expect(
      demoReviewItemSchema.safeParse({
        ...base,
        bucket: "review",
        kind: "transfer",
        pnlImpact: true,
      }).success,
    ).toBe(false);
    expect(
      demoReviewItemSchema.safeParse({
        ...base,
        bucket: "pending",
        kind: "expected",
        pnlImpact: true,
      }).success,
    ).toBe(false);
  });

  it("rejects free-form notes at the unauthenticated demo capture boundary", () => {
    const result = createDemoTransactionRequestSchema.safeParse({
      workspaceId: "demo-workspace",
      kind: "expense",
      amount: { amount: "100000", currency: "VND" },
      sourceAccountId: "account-vcb",
      destinationAccountId: null,
      category: "Ăn uống",
      note: "private note",
    });

    expect(result.success).toBe(false);
  });
});
