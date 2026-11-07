import { createDemoTransactionRequestSchema, type DemoTransaction } from "@zenval/contracts";
import { describe, expect, it } from "vitest";
import { buildQuickAddRequest } from "./quick-add-form";
import { filterTransactions, groupByDay, mergeWithDrafts } from "./transaction-filters";

const base = {
  kind: "expense" as const,
  amount: "1.250.000",
  category: "Mua sắm",
  sourceAccountId: "account-vcb",
  destinationAccountId: "account-momo",
};

describe("buildQuickAddRequest", () => {
  it("maps an expense to a contract-valid request with an exact VND amount", () => {
    const result = buildQuickAddRequest(base);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(createDemoTransactionRequestSchema.parse(result.request)).toEqual(result.request);
    expect(result.request).toMatchObject({
      amount: { amount: "1250000", currency: "VND" },
      destinationAccountId: null,
    });
  });

  it("drops category and keeps destination for transfers", () => {
    const result = buildQuickAddRequest({ ...base, kind: "transfer" });
    expect(result.ok && result.request).toMatchObject({
      kind: "transfer",
      category: null,
      destinationAccountId: "account-momo",
    });
  });

  it("reports missing amount, category, and same-account transfers", () => {
    expect(buildQuickAddRequest({ ...base, amount: "0", category: null })).toEqual({
      ok: false,
      errors: { amount: true, category: true },
    });
    expect(
      buildQuickAddRequest({ ...base, kind: "transfer", destinationAccountId: "account-vcb" }),
    ).toEqual({ ok: false, errors: { destination: true } });
  });
});

function tx(id: string, occurredAt: string, extra: Partial<DemoTransaction> = {}): DemoTransaction {
  return {
    id,
    workspaceId: "demo-workspace",
    occurredAt,
    kind: "expense",
    status: "posted",
    title: id,
    category: "Ăn uống",
    amount: { value: { amount: "1000", currency: "VND" }, display: "1.000 ₫" },
    pnlImpact: true,
    sourceAccountId: "a",
    destinationAccountId: null,
    note: "",
    source: "mock-json",
    ...extra,
  };
}

describe("transaction list helpers", () => {
  const server = [tx("s1", "2026-11-05T10:00:00.000Z"), tx("s2", "2026-11-03T10:00:00.000Z")];

  it("merges session drafts newest-first without duplicating server rows", () => {
    const drafts = [tx("d1", "2026-11-05T12:00:00.000Z", { status: "draft" }), tx("s1", "x")];
    expect(mergeWithDrafts(server, drafts).map((item) => item.id)).toEqual(["d1", "s1", "s2"]);
  });

  it("filters by kind, account (either leg), and text", () => {
    const transfer = tx("t1", "2026-11-04T10:00:00.000Z", {
      kind: "transfer",
      category: null,
      pnlImpact: false,
      destinationAccountId: "b",
    });
    const all = [...server, transfer];
    expect(
      filterTransactions(all, { query: "", kind: "transfer", status: "all", accountId: "b" }),
    ).toEqual([transfer]);
    expect(
      filterTransactions(all, { query: "S2", kind: "all", status: "all", accountId: "all" }),
    ).toHaveLength(1);
  });

  it("groups consecutive rows by local day", () => {
    expect(groupByDay(server).map((group) => group.items.length)).toEqual([1, 1]);
  });
});

