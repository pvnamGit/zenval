import { describe, expect, it } from "vitest";
import {
  allocatedGoalPercentage,
  applyManualValuationsToHoldings,
  applyPreferenceChange,
  buildReceivableDraft,
  calculateInvestmentAmounts,
  calculateRecoverableValue,
  commitmentPnlImpact,
  createManualInstrumentReview,
  debtObligations,
  derivedValues,
  desktopNavigationIds,
  escapeHtml,
  financialFixture,
  financialStateClass,
  financialStates,
  fixedCommitments,
  fixtureBridgeEnding,
  fixtureMonthlyPnl,
  fixtureNetWorth,
  formatUnitPrice,
  formatVnd,
  formatVndInput,
  getReviewRecords,
  type InvestmentHolding,
  iaSubViews,
  instrumentsForAssetClass,
  investmentActivities,
  investmentActivityEffect,
  investmentHoldings,
  isEssentialCommitmentPriority,
  isTodayTransaction,
  localTimeHHMM,
  mobileTopbarMinHeight,
  parsePercentageBps,
  parseScaledDecimal,
  parseVnd,
  prototypeLocales,
  prototypeViews,
  recordManualValuation,
  recordsForBucket,
  resolveInstrumentSelection,
  resolveNavigationTarget,
  resolveView,
  restoreGoalFormDraft,
  returnFocusId,
  reviewRecords,
  shouldOpenGlobalSearch,
  summarizeTodayCashflow,
  todayCashflowSummary,
  validateAllocationPercentages,
} from "./prototype-model";

describe("prototype financial and navigation rails", () => {
  it("keeps forecast, posted, pending, and estimated states visually distinct", () => {
    expect(financialStateClass.forecast).not.toBe(financialStateClass.posted);
    expect(financialStateClass.forecast).not.toBe(financialStateClass.pending);
    expect(financialStates.estimated.className).not.toBe(financialStates.forecast.className);
  });

  it("keeps transfer candidates out of profit and loss", () => {
    const transfer = reviewRecords.find((record) => record.kind === "transfer");
    expect(transfer?.pnlImpact).toBe(false);
    expect(todayCashflowSummary.entries.find((entry) => entry.kind === "transfer")?.pnlImpact).toBe(
      false,
    );
  });

  it("filters review buckets into distinct datasets", () => {
    expect(getReviewRecords("review")).toHaveLength(3);
    expect(getReviewRecords("pending")).toHaveLength(1);
    expect(getReviewRecords("posted")).toHaveLength(1);
    expect(recordsForBucket("review")).toHaveLength(3);
  });

  it("covers full PRD §5.1 top-level IA views and sub-views", () => {
    expect(desktopNavigationIds).toContain("review");
    expect(desktopNavigationIds).toContain("transactions");
    expect(desktopNavigationIds).toContain("investments");
    expect(desktopNavigationIds).toContain("debts");
    expect(desktopNavigationIds).toContain("reports");
    expect(prototypeLocales).toEqual(["vi", "en"]);
    for (const view of [
      "home",
      "review",
      "transactions",
      "accounts",
      "investments",
      "debts",
      "plan",
      "reports",
      "settings",
      "system",
    ] as const) {
      expect(prototypeViews).toContain(view);
      expect(iaSubViews[view].length).toBeGreaterThan(0);
    }
  });

  it("parses and formats VND, scaled decimals, percentages, and allocations without float drift", () => {
    expect(parseVnd("2.500.000 ₫")).toBe(2500000n);
    expect(parseVnd("−486.000 ₫")).toBe(-486000n);
    expect(parseVnd("")).toBeNull();
    expect(parseVnd("12abc")).toBeNull();
    expect(parseVnd("1.2")).toBeNull();
    expect(parseScaledDecimal("2,5", 3)).toBe(2500n);
    expect(parseScaledDecimal("2.1234", 3)).toBeNull();
    expect(parsePercentageBps("65%")).toBe(6500n);
    expect(parsePercentageBps("100,01%")).toBeNull();
    expect(validateAllocationPercentages([70, 20, 10])).toBe(true);
    expect(validateAllocationPercentages([50, 30, 30])).toBe(false);
    expect(formatVnd(2500000n)).toBe("2.500.000 ₫");
    expect(formatVndInput("3545545")).toBe("3.545.545");
    expect(formatVndInput("232323")).toBe("232.323");
    expect(escapeHtml('<img src=x onerror="alert(1)">')).toBe(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
    );
  });

  it("summarizes today's cashflow while excluding past dates, transfers, and principal repayments", () => {
    const todayWithCustom = summarizeTodayCashflow(
      [
        {
          id: "past",
          date: "2026-10-31",
          time: "20:00",
          kind: "income",
          amount: "+9.000.000 ₫",
        },
        {
          id: "today-new",
          date: "2026-11-01",
          time: "21:00",
          kind: "expense",
          amount: "−100.000 ₫",
        },
      ],
      { ...todayCashflowSummary, asOf: derivedValues.todayCashflow.asOf },
    );
    expect(isTodayTransaction("2026-10-31", todayCashflowSummary.date)).toBe(false);
    expect(localTimeHHMM(new Date("2026-11-01T13:07:00+07:00"))).toBe("13:07");
    expect(todayWithCustom.entries.some((entry) => entry.id === "past")).toBe(false);
    expect(todayWithCustom.entries.some((entry) => entry.id === "today-new")).toBe(true);
    expect(todayWithCustom.outflowDisplay).toBe("−736.000 ₫");
    expect(todayWithCustom.netDisplay).toBe("+1.764.000 ₫");
    expect(todayWithCustom.asOf).toBe("2026-11-01T21:00:00+07:00");

    const todayWithPrincipal = summarizeTodayCashflow(
      [
        {
          id: "principal-only",
          date: todayCashflowSummary.date,
          time: "13:00",
          kind: "expense",
          pnlImpact: false,
          amount: "−1.000.000 ₫",
        },
      ],
      todayCashflowSummary,
    );
    expect(todayWithPrincipal.outflowDisplay).toBe(todayCashflowSummary.outflowDisplay);
  });

  it("verifies investment unit/total quotes, manual instrument routing, and receivable ERV", () => {
    expect(instrumentsForAssetClass("equity").map((i) => i.symbol)).toEqual(["FPT", "VNM", "MWG"]);
    expect(resolveInstrumentSelection("ssi:FPT:HOSE", "gold").ok).toBe(false);
    const manualInstrument = resolveInstrumentSelection("manual", "gold", "Vàng SJC");
    expect(manualInstrument).toEqual({
      ok: true,
      instrumentId: "manual:v-ng-sjc",
      symbol: "VÀNG SJC",
      assetClass: "gold",
      source: "manual",
      needsReview: true,
    });
    expect(createManualInstrumentReview(manualInstrument, "vi")).toEqual({
      id: "review-manual:v-ng-sjc",
      kind: "manualInstrument",
      merchant: "VÀNG SJC",
      amount: "Chưa định giá",
      pnlImpact: false,
    });

    const unitMode = calculateInvestmentAmounts({
      quantity: "100",
      mode: "unit",
      unitPrice: "25.000",
      gross: "",
      fee: "10.000",
    });
    expect(unitMode.ok).toBe(true);
    if (unitMode.ok) {
      expect(unitMode.grossVnd).toBe(2500000n);
      expect(unitMode.cashVnd).toBe(2510000n);
      expect(formatUnitPrice(unitMode.unitPriceMilliVnd)).toBe("25.000 ₫");
    }

    const repeatingUnitPrice = calculateInvestmentAmounts({
      quantity: "3",
      mode: "total",
      unitPrice: "",
      gross: "10.000",
    });
    expect(repeatingUnitPrice.ok).toBe(true);
    if (repeatingUnitPrice.ok) {
      expect(repeatingUnitPrice.grossVnd).toBe(10000n);
      expect(formatUnitPrice(repeatingUnitPrice.unitPriceMilliVnd)).toBe("3.333,333 ₫");
    }

    const erv = calculateRecoverableValue("10.000.000 ₫", "65%");
    expect(erv.ok).toBe(true);
    if (erv.ok) {
      expect(erv.estimatedRecoverable).toBe(6500000n);
    }
    expect(buildReceivableDraft("10.000.000", "40").preview).toBe("4.000.000 ₫");
    expect(buildReceivableDraft("", "80").preview).toBe("—");
  });

  it("verifies net-worth bridge reconciliation, derived value lineage, and navigation helpers", () => {
    expect(fixtureNetWorth(financialFixture)).toBe(292600000n);
    expect(fixtureMonthlyPnl(financialFixture)).toBe(13625000n);
    expect(fixtureBridgeEnding(financialFixture)).toBe(fixtureNetWorth(financialFixture));
    expect(commitmentPnlImpact("debt-installment")).toBe("interest-only");
    expect(commitmentPnlImpact("saving-transfer")).toBe(false);
    expect(isEssentialCommitmentPriority("essential")).toBe(true);
    expect(investmentActivityEffect("buy")?.pnlImpact).toBe(false);
    expect(investmentActivityEffect("dividend")?.pnlImpact).toBe(true);
    expect(investmentHoldings.some((h) => h.assetClass === "cash" && h.doubleCountProtected)).toBe(
      true,
    );
    expect(investmentActivities.some((a) => a.kind === "buy" && a.pnlImpact === false)).toBe(true);
    expect(
      debtObligations.some((d) => d.direction === "payable" && d.principalPnlImpact === false),
    ).toBe(true);
    expect(
      fixedCommitments.some((c) => c.kind === "saving-transfer" && c.pnlImpact === false),
    ).toBe(true);

    const preferences = applyPreferenceChange(
      { baseCurrency: "VND", timezoneMode: "device" },
      "baseCurrency",
      "USD",
    );
    expect(preferences).toEqual({ baseCurrency: "USD", timezoneMode: "device" });

    let valuationState = recordManualValuation({}, "XYZ", 100n, "2026-11-01");
    valuationState = recordManualValuation(valuationState, "XYZ", 200n, "2026-11-02");
    const valuedHolding = applyManualValuationsToHoldings<InvestmentHolding>(
      [{ symbol: "XYZ", costBasis: "unchanged", state: "pending" }],
      valuationState,
      "en",
    )[0];
    expect(valuedHolding?.marketPrice).toBe("200 ₫");
    expect(valuedHolding?.state).toBe("estimated");

    expect(
      allocatedGoalPercentage(
        [
          ["Goal A", "", "", "estimated", "goal-a", "tag:goal", 60],
          ["Goal B", "", "", "estimated", "goal-b", "tag:goal", 30],
        ],
        "tag:goal",
        "goal-a",
      ),
    ).toBe(30);
    expect(
      restoreGoalFormDraft([
        "Mua nhà",
        "0 / 500m",
        "",
        "estimated",
        "goal-home",
        "holding:FPT",
        40,
        "2028-06-01",
        "low",
        true,
        "500000000",
      ])["goal-name-input"],
    ).toBe("Mua nhà");

    for (const value of Object.values(derivedValues)) {
      expect(value.sourceIds.length).toBeGreaterThan(0);
      expect(value.asOf).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(value.horizonEnd).toBeTruthy();
      expect(value.calculationVersion).toMatch(/-v\d+\.\d+$/);
    }

    expect(resolveView("accounts", "home")).toBe("accounts");
    expect(resolveView("unknown", "more")).toBe("more");
    expect(resolveView("unknown", "unknown")).toBe("home");
    expect(shouldOpenGlobalSearch(true)).toBe(false);
    expect(shouldOpenGlobalSearch(false)).toBe(true);
    expect(returnFocusId("explain", "cashflow")).toBe("explain-cashflow");
    expect(returnFocusId("quick-add", "mobile")).toBe("mobile-quick-add");
    expect(
      resolveNavigationTarget(
        { txSub: "commitments", planSub: "sts", repSub: "pnlCashflow" },
        { view: "transactions", txSub: "ledger" },
      ),
    ).toEqual({ view: "transactions", txSub: "ledger", planSub: "sts", repSub: "pnlCashflow" });
    expect(mobileTopbarMinHeight(47)).toBe(107);
  });
});
