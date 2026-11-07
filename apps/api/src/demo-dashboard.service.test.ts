import { describe, expect, it } from "vitest";
import { DemoDashboardService } from "./demo-dashboard.service";

describe("DemoDashboardService", () => {
  it("returns an explicitly labelled, exact VND demo snapshot with lineage", () => {
    const snapshot = new DemoDashboardService().getSnapshot();

    expect(snapshot.mode).toBe("demo");
    expect(snapshot.workspaceId).toBe("demo-workspace");
    expect(snapshot.safeToSpend.amount.value).toEqual({ amount: "12400000", currency: "VND" });
    expect(snapshot.safeToSpend.calculationVersion).toBeTruthy();
    expect(snapshot.safeToSpend.sourceSummary).toBeTruthy();
    expect(snapshot.dueSoon.find((item) => item.kind === "debt-installment")?.detail).toContain(
      "Gốc",
    );
  });
});
