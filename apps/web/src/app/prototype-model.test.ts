import { describe, expect, it } from "vitest";
import {
  desktopNavigationIds,
  financialStateClass,
  getReviewRecords,
  prototypeLocales,
  reviewRecords,
} from "./prototype-model";

describe("prototype financial and navigation rails", () => {
  it("keeps forecast, posted, and pending states visually distinct", () => {
    expect(financialStateClass.forecast).not.toBe(financialStateClass.posted);
    expect(financialStateClass.forecast).not.toBe(financialStateClass.pending);
  });

  it("keeps transfer candidates out of profit and loss", () => {
    const transfer = reviewRecords.find((record) => record.kind === "transfer");
    expect(transfer?.pnlImpact).toBe(false);
  });

  it("filters review buckets into distinct datasets", () => {
    expect(getReviewRecords("review")).toHaveLength(3);
    expect(getReviewRecords("pending")).toHaveLength(1);
    expect(getReviewRecords("posted")).toHaveLength(1);
  });

  it("covers both inbox and transactions in desktop navigation", () => {
    expect(desktopNavigationIds).toContain("review");
    expect(desktopNavigationIds).toContain("transactions");
  });

  it("keeps Vietnamese and English as supported prototype locales", () => {
    expect(prototypeLocales).toEqual(["vi", "en"]);
  });
});
