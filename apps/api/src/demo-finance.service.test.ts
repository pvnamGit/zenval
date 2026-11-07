import { describe, expect, it } from "vitest";
import { DemoCaptureCapacityError, DemoFinanceService } from "./demo-finance.service";

const expenseRequest = {
  workspaceId: "demo-workspace" as const,
  kind: "expense" as const,
  amount: { amount: "125000", currency: "VND" as const },
  sourceAccountId: "account-vcb",
  destinationAccountId: null,
  category: "Ăn uống",
};
const demoTabA = "demo-tab-a";

describe("DemoFinanceService", () => {
  it("loads workspace-owned accounts, transactions and review items from the JSON fixture", () => {
    const snapshot = new DemoFinanceService().getSnapshot();

    expect(snapshot.source).toBe("mock-json");
    expect(snapshot.accounts.length).toBeGreaterThan(0);
    expect(snapshot.transactions.every((item) => item.workspaceId === snapshot.workspaceId)).toBe(
      true,
    );
    expect(snapshot.reviewItems.filter((item) => item.bucket === "review")).toHaveLength(3);
  });

  it("keeps transfers out of P&L and creates only a process-local draft", () => {
    const service = new DemoFinanceService();
    const result = service.createTransaction(
      {
        ...expenseRequest,
        kind: "transfer",
        destinationAccountId: "account-momo",
        category: null,
      },
      "transfer-key",
      demoTabA,
    );

    expect(result.transaction).toMatchObject({
      kind: "transfer",
      status: "draft",
      pnlImpact: false,
      sourceAccountId: "account-vcb",
      destinationAccountId: "account-momo",
    });
  });

  it("returns the same capture when an idempotency key is replayed", () => {
    const service = new DemoFinanceService();
    const first = service.createTransaction(expenseRequest, "same-key", demoTabA);
    const second = service.createTransaction(expenseRequest, "same-key", demoTabA);

    expect(first.replayed).toBe(false);
    expect(first.transaction).toMatchObject({ status: "draft", pnlImpact: false });
    expect(second.replayed).toBe(true);
    expect(second.transaction.id).toBe(first.transaction.id);
    expect(
      service.getSnapshot().transactions.some((item) => item.id === first.transaction.id),
    ).toBe(false);
  });

  it("rejects reusing an idempotency key for a different capture", () => {
    const service = new DemoFinanceService();
    service.createTransaction(expenseRequest, "conflicting-key", demoTabA);

    expect(() =>
      service.createTransaction(
        { ...expenseRequest, amount: { amount: "126000", currency: "VND" } },
        "conflicting-key",
        demoTabA,
      ),
    ).toThrow("Idempotency key was already used for a different request");
  });

  it("rejects captures for an unknown account", () => {
    const service = new DemoFinanceService();

    expect(() =>
      service.createTransaction(
        { ...expenseRequest, sourceAccountId: "other-workspace-account" },
        "bad-key",
        demoTabA,
      ),
    ).toThrow("Unknown source account");
  });

  it("keeps idempotency stable after more than 256 captures in the same demo tab", () => {
    const service = new DemoFinanceService();
    const first = service.createTransaction(expenseRequest, "stable-key-0", demoTabA);

    for (let index = 1; index <= 256; index += 1) {
      service.createTransaction(expenseRequest, `stable-key-${index}`, demoTabA);
    }

    const replayAfterManyCaptures = service.createTransaction(
      expenseRequest,
      "stable-key-0",
      demoTabA,
    );
    expect(first.replayed).toBe(false);
    expect(replayAfterManyCaptures.replayed).toBe(true);
    expect(replayAfterManyCaptures.transaction.id).toBe(first.transaction.id);
  });

  it("does not replay a capture into another demo tab", () => {
    const service = new DemoFinanceService();
    const firstTab = service.createTransaction(expenseRequest, "same-key", demoTabA);
    const secondTab = service.createTransaction(expenseRequest, "same-key", "demo-tab-b");

    expect(firstTab.replayed).toBe(false);
    expect(secondTab.replayed).toBe(false);
    expect(secondTab.transaction.id).not.toBe(firstTab.transaction.id);
  });

  it("bounds runtime capture memory without evicting a replay key", () => {
    const service = new DemoFinanceService();

    for (let index = 0; index < 1024; index += 1) {
      service.createTransaction(expenseRequest, `capacity-key-${index}`, `demo-tab-${index}`);
    }

    expect(() =>
      service.createTransaction(expenseRequest, "capacity-key-overflow", "demo-tab-x"),
    ).toThrow(DemoCaptureCapacityError);
    expect(service.createTransaction(expenseRequest, "capacity-key-0", "demo-tab-0")).toMatchObject(
      {
        replayed: true,
      },
    );
  });
});
