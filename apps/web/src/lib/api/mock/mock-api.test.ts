import {
  createDemoTransactionResponseSchema,
  dashboardSnapshotSchema,
  demoFinanceSnapshotSchema,
} from "@zenval/contracts";
import { describe, expect, it } from "vitest";
import {
  debtsSnapshotSchema,
  investmentsSnapshotSchema,
  planningSnapshotSchema,
  reportsSnapshotSchema,
} from "../draft-schemas";
import { ApiError } from "../errors";
import { createMockApi } from "./mock-api";

const now = () => new Date("2026-11-05T03:00:00.000Z");

const expense = {
  workspaceId: "demo-workspace",
  kind: "expense",
  amount: { amount: "86000", currency: "VND" },
  sourceAccountId: "account-momo",
  destinationAccountId: null,
  category: "Ăn uống",
} as const;

describe("createMockApi", () => {
  it("serves snapshots that satisfy the shared and draft contracts", async () => {
    const api = createMockApi({ now });
    dashboardSnapshotSchema.parse(await api.dashboard.get());
    demoFinanceSnapshotSchema.parse(await api.finance.get());
    planningSnapshotSchema.parse(await api.planning.get());
    debtsSnapshotSchema.parse(await api.debts.get());
    investmentsSnapshotSchema.parse(await api.investments.get());
    reportsSnapshotSchema.parse(await api.reports.get());
  });

  it("creates draft captures with no P&L impact and replays the same idempotency key", async () => {
    const api = createMockApi({ now });

    const first = await api.transactions.create(expense, { idempotencyKey: "k1" });
    const replay = await api.transactions.create(expense, { idempotencyKey: "k1" });

    createDemoTransactionResponseSchema.parse(first);
    expect(first.replayed).toBe(false);
    expect(first.transaction).toMatchObject({ status: "draft", pnlImpact: false });
    expect(replay).toEqual({ transaction: first.transaction, replayed: true });
  });

  it("rejects reusing an idempotency key for a different request", async () => {
    const api = createMockApi({ now });
    await api.transactions.create(expense, { idempotencyKey: "k1" });

    await expect(
      api.transactions.create(
        { ...expense, amount: { amount: "1", currency: "VND" } },
        { idempotencyKey: "k1" },
      ),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("keeps transfers out of income/expense and requires a different destination", async () => {
    const api = createMockApi({ now });
    const transfer = await api.transactions.create(
      {
        ...expense,
        kind: "transfer",
        category: null,
        destinationAccountId: "account-vcb",
      },
      { idempotencyKey: "t1" },
    );
    expect(transfer.transaction).toMatchObject({ category: null, pnlImpact: false });

    await expect(
      api.transactions.create(
        { ...expense, kind: "transfer", category: null, destinationAccountId: "account-momo" },
        { idempotencyKey: "t2" },
      ),
    ).rejects.toMatchObject({ code: "validation" });
  });

  it("does not list drafts in the finance snapshot, matching the API", async () => {
    const api = createMockApi({ now });
    const before = (await api.finance.get()).transactions.length;
    await api.transactions.create(expense, { idempotencyKey: "k1" });
    expect((await api.finance.get()).transactions).toHaveLength(before);
  });

  it("resolves review items idempotently and updates the dashboard count", async () => {
    const api = createMockApi({ now });
    expect((await api.dashboard.get()).reviewCount).toBe(3);

    await api.review.resolve("transfer-candidate", "approve", { idempotencyKey: "r1" });
    await api.review.resolve("transfer-candidate", "approve", { idempotencyKey: "r1" });
    await api.review.resolve("duplicate-candidate", "approve", { idempotencyKey: "r2" });

    const finance = await api.finance.get();
    const transfer = finance.reviewItems.find((item) => item.id === "transfer-candidate");
    expect(transfer).toMatchObject({ bucket: "posted", pnlImpact: false });
    expect(finance.reviewItems.some((item) => item.id === "duplicate-candidate")).toBe(false);
    expect((await api.dashboard.get()).reviewCount).toBe(1);
  });

  it("isolates callers from internal state", async () => {
    const api = createMockApi({ now });
    const snapshot = await api.finance.get();
    snapshot.accounts.length = 0;
    expect((await api.finance.get()).accounts.length).toBeGreaterThan(0);
  });

  it("honours abort signals", async () => {
    const api = createMockApi({ latencyMs: 50 });
    const controller = new AbortController();
    const pending = api.finance.get({ signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ code: "aborted" });
  });

  it("keeps the debt installment split consistent (principal + interest + fee = total)", async () => {
    const { debts } = await createMockApi().debts.get();
    for (const debt of debts) {
      const installment = debt.nextInstallment;
      if (!installment) continue;
      const sum =
        BigInt(installment.principal.value.amount) +
        BigInt(installment.interest.value.amount) +
        BigInt(installment.fee.value.amount);
      expect(sum).toBe(BigInt(installment.total.value.amount));
    }
  });
});
