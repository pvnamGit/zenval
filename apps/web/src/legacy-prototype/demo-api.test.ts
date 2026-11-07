import { afterEach, describe, expect, it, vi } from "vitest";
import { createDemoTransaction, getDemoFinance } from "./demo-api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("demo API client", () => {
  it("validates finance data returned by the real HTTP boundary", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          mode: "demo",
          workspaceId: "demo-workspace",
          asOf: "2026-11-05T01:30:00.000Z",
          source: "mock-json",
          totalAssets: { value: { amount: "0", currency: "VND" }, display: "0 ₫" },
          accounts: [],
          transactions: [],
          reviewItems: [],
        }),
        { status: 200 },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getDemoFinance()).resolves.toMatchObject({ source: "mock-json" });
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3001/v1/demo/finance", undefined);
  });

  it("sends Quick Add through POST with an idempotency key", async () => {
    const transaction = {
      id: "demo-capture-4",
      workspaceId: "demo-workspace",
      occurredAt: "2026-11-05T03:00:00.000Z",
      kind: "expense",
      status: "draft",
      title: "Chi tiêu demo",
      category: "Ăn uống",
      amount: { value: { amount: "125000", currency: "VND" }, display: "−125.000 ₫" },
      pnlImpact: false,
      sourceAccountId: "account-vcb",
      destinationAccountId: null,
      note: "",
      source: "mock-json",
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ transaction, replayed: false }), { status: 201 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await createDemoTransaction(
      {
        workspaceId: "demo-workspace",
        kind: "expense",
        amount: { amount: "125000", currency: "VND" },
        sourceAccountId: "account-vcb",
        destinationAccountId: null,
        category: "Ăn uống",
      },
      "capture-key",
      "demo-tab-a",
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/v1/demo/transactions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-Demo-Session-Id": "demo-tab-a",
          "X-Idempotency-Key": "capture-key",
        }),
      }),
    );
  });
});
