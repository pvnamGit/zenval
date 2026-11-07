import { dashboardSnapshotSchema } from "@zenval/contracts";
import { describe, expect, it } from "vitest";

describe("demo dashboard contract", () => {
  it("requires the API response to identify a demo snapshot and retain monetary lineage", () => {
    const result = dashboardSnapshotSchema.safeParse({
      mode: "demo",
      workspaceId: "demo-workspace",
      asOf: "2026-11-05T01:30:00.000Z",
      safeToSpend: {
        amount: { value: { amount: "12400000", currency: "VND" }, display: "12.400.000 ₫" },
        horizon: "Đến kỳ thu nhập tiếp theo · 14 ngày",
        sourceSummary: "Dữ liệu mẫu",
        calculationVersion: "Demo presentation v1",
      },
      cashFlow: {
        projectedLow: { value: { amount: "8200000", currency: "VND" }, display: "8.200.000 ₫" },
        confidence: "medium",
        scenario: "base",
      },
      dueSoon: [],
      reviewCount: 0,
      netWorth: {
        amount: { value: { amount: "0", currency: "VND" }, display: "0 ₫" },
        assets: { value: { amount: "0", currency: "VND" }, display: "0 ₫" },
        liabilities: { value: { amount: "0", currency: "VND" }, display: "0 ₫" },
        monthChangeLabel: "0% tháng này",
      },
    });

    expect(result.success).toBe(true);
  });
});
