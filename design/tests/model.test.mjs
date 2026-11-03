import assert from "node:assert/strict";
import {
  applyManualValuationsToHoldings,
  buildReceivableDraft,
  calculateInvestmentAmounts,
  calculateRecoverableValue,
  commitmentPnlImpact,
  debtObligations,
  derivedValues,
  escapeHtml,
  financialFixture,
  financialStates,
  fixedCommitments,
  fixtureBridgeEnding,
  fixtureMonthlyPnl,
  fixtureNetWorth,
  formatUnitPrice,
  formatVnd,
  iaSubViews,
  investmentActivities,
  investmentActivityEffect,
  investmentHoldings,
  isEssentialCommitmentPriority,
  isTodayTransaction,
  mobileTopbarMinHeight,
  parsePercentageBps,
  parseScaledDecimal,
  parseVnd,
  prototypeViews,
  recordManualValuation,
  recordsForBucket,
  resolveView,
  returnFocusId,
  shouldOpenGlobalSearch,
  summarizeTodayCashflow,
  todayCashflowSummary,
} from "../model.mjs";

assert.equal(parseVnd("2.500.000 ₫"), 2500000n);
assert.equal(parseVnd("−486.000 ₫"), -486000n);
assert.equal(parseVnd(""), null);
assert.equal(parseVnd("12abc"), null);
assert.equal(parseVnd("1.2"), null);
assert.equal(parseScaledDecimal("2,5", 3), 2500n);
assert.equal(parseScaledDecimal("2.1234", 3), null);
assert.equal(parsePercentageBps("65%"), 6500n);
assert.equal(parsePercentageBps("100,01%"), null);
assert.equal(parsePercentageBps("6%5"), null);
assert.equal(formatVnd(2500000n), "2.500.000 ₫");
assert.equal(
  escapeHtml('<img src=x onerror="alert(1)">'),
  "&lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
);
assert.equal(commitmentPnlImpact("debt-installment"), "interest-only");
assert.equal(commitmentPnlImpact("saving-transfer"), false);
assert.equal(commitmentPnlImpact("outflow"), true);
assert.equal(isEssentialCommitmentPriority("essential"), true);
assert.equal(isEssentialCommitmentPriority("flexible"), false);

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
assert.equal(isTodayTransaction("2026-10-31", todayCashflowSummary.date), false);
assert.equal(
  todayWithCustom.entries.some((entry) => entry.id === "past"),
  false,
);
assert.equal(
  todayWithCustom.entries.some((entry) => entry.id === "today-new"),
  true,
);
assert.equal(todayWithCustom.outflowDisplay, "−736.000 ₫");
assert.equal(todayWithCustom.netDisplay, "+1.764.000 ₫");
assert.equal(todayWithCustom.asOf, "2026-11-01T21:00:00+07:00");

let valuationState = recordManualValuation({}, "XYZ", 100n, "2026-11-01");
valuationState = recordManualValuation(valuationState, "XYZ", 200n, "2026-11-02");
const valuedHolding = applyManualValuationsToHoldings(
  [{ symbol: "XYZ", costBasis: "unchanged", state: "pending" }],
  valuationState,
  "en",
)[0];
assert.equal(valuedHolding.marketPrice, "200 ₫");
assert.equal(valuedHolding.costBasis, "unchanged");
assert.equal(valuedHolding.state, "estimated");
assert.match(valuedHolding.sourceEn, /2026-11-02/);

const unitMode = calculateInvestmentAmounts({
  quantity: "100",
  mode: "unit",
  unitPrice: "25.000",
  gross: "",
  fee: "10.000",
});
assert.equal(unitMode.ok, true);
assert.equal(unitMode.grossVnd, 2500000n);
assert.equal(unitMode.cashVnd, 2510000n);
assert.equal(formatUnitPrice(unitMode.unitPriceMilliVnd), "25.000 ₫");

const totalMode = calculateInvestmentAmounts({
  quantity: "100",
  mode: "total",
  unitPrice: "",
  gross: "2.500.000",
  fee: "10.000",
});
assert.equal(totalMode.ok, true);
assert.equal(totalMode.unitPriceMilliVnd, 25000000n);
assert.equal(totalMode.grossVnd, 2500000n, "User-entered gross must remain the source value");
assert.equal(calculateInvestmentAmounts({ quantity: "0", mode: "unit", unitPrice: "1" }).ok, false);

const repeatingUnitPrice = calculateInvestmentAmounts({
  quantity: "3",
  mode: "total",
  unitPrice: "",
  gross: "10.000",
});
assert.equal(repeatingUnitPrice.grossVnd, 10000n);
assert.equal(formatUnitPrice(repeatingUnitPrice.unitPriceMilliVnd), "3.333,333 ₫");

const erv = calculateRecoverableValue("10.000.000 ₫", "65%");
assert.equal(erv.ok, true);
assert.equal(erv.estimatedRecoverable, 6500000n);
assert.equal(calculateRecoverableValue("10.000.000", "101%").ok, false);
assert.equal(calculateRecoverableValue("10.000.000", "0%").estimatedRecoverable, 0n);

assert.deepEqual(buildReceivableDraft("", "80"), {
  ok: false,
  error: "invalid-recoverability",
  preview: "—",
});
assert.deepEqual(buildReceivableDraft("10.000.000", ""), {
  ok: false,
  error: "invalid-recoverability",
  preview: "—",
});
const receivableDraft = buildReceivableDraft("10.000.000", "40");
assert.equal(receivableDraft.ok, true);
assert.equal(receivableDraft.probabilityBps, 4000n);
assert.equal(receivableDraft.estimatedRecoverable, 4000000n);
assert.equal(receivableDraft.preview, "4.000.000 ₫");

assert.equal(investmentActivityEffect("buy").createsHoldingDraft, true);
assert.equal(investmentActivityEffect("buy").pnlImpact, false);
assert.equal(investmentActivityEffect("sell").createsHoldingDraft, false);
assert.equal(investmentActivityEffect("sell").quantityDirection, -1);
assert.equal(investmentActivityEffect("dividend").pnlImpact, true);
assert.equal(investmentActivityEffect("valuation").changesCostBasis, false);
assert.equal(investmentActivityEffect("valuation").changesMarketValueOnly, true);

assert.equal(fixtureNetWorth(financialFixture), 292600000n);
assert.equal(fixtureMonthlyPnl(financialFixture), 13625000n);
assert.equal(fixtureBridgeEnding(financialFixture), fixtureNetWorth(financialFixture));

assert.notEqual(financialStates.posted.className, financialStates.pending.className);
assert.notEqual(financialStates.posted.className, financialStates.forecast.className);
assert.notEqual(financialStates.estimated.className, financialStates.forecast.className);

const transfer = recordsForBucket("review").find((record) => record.kind === "transfer");
assert.equal(transfer?.pnlImpact, false);
assert.equal(recordsForBucket("review").length, 3);
assert.equal(recordsForBucket("pending").length, 1);
assert.equal(recordsForBucket("posted").length, 1);

// Verify Today's Cashflow Summary on #home
assert.ok(todayCashflowSummary.inflowDisplay.startsWith("+"));
assert.ok(todayCashflowSummary.outflowDisplay.startsWith("−"));
assert.equal(
  todayCashflowSummary.entries.find((e) => e.kind === "transfer")?.pnlImpact,
  false,
  "Today's internal transfer must not affect P&L",
);

// Verify Fixed Commitments cover monthly inflows, expenses, loan splits, and savings transfers
assert.ok(fixedCommitments.some((c) => c.direction === "inflow" && c.kind === "recurring-income"));
assert.ok(fixedCommitments.some((c) => c.direction === "outflow" && c.kind === "fixed-expense"));
assert.ok(
  fixedCommitments.some((c) => c.kind === "debt-installment" && c.pnlImpact === "interest-only"),
);
assert.ok(fixedCommitments.some((c) => c.kind === "saving-transfer" && c.pnlImpact === false));

// Verify Investment Holdings & Activities
assert.ok(investmentHoldings.length >= 4);
assert.ok(
  investmentHoldings.some((h) => h.assetClass === "cash" && h.doubleCountProtected === true),
  "Brokerage cash must be marked double-count protected",
);
assert.ok(
  investmentActivities.some((a) => a.kind === "buy" && a.pnlImpact === false),
  "Buying an investment asset is a cost-basis movement, not P&L expense",
);

// Verify Debts & Receivables
assert.ok(debtObligations.some((d) => d.direction === "payable" && d.principalPnlImpact === false));
assert.ok(
  debtObligations.some(
    (d) =>
      d.direction === "receivable" &&
      d.principalPnlImpact === false &&
      d.estimatedRecoverable !== d.grossPrincipal,
  ),
);

// Verify PRD §5.1 Information Architecture views & sub-views
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
]) {
  assert.ok(prototypeViews.includes(view), `Missing top-level IA view: ${view}`);
  assert.ok(
    Array.isArray(iaSubViews[view]) && iaSubViews[view].length > 0,
    `Missing sub-views for ${view}`,
  );
}

for (const [key, value] of Object.entries(derivedValues)) {
  assert.ok(value.sourceIds.length > 0, `${key} needs source IDs`);
  assert.match(value.asOf, /^\d{4}-\d{2}-\d{2}T/);
  assert.ok(value.horizonEnd, `${key} needs a horizon`);
  assert.match(value.calculationVersion, /-v\d+\.\d+$/);
}

assert.equal(resolveView("accounts", "home"), "accounts");
assert.equal(resolveView("investments", "home"), "investments");
assert.equal(resolveView("debts", "home"), "debts");
assert.equal(resolveView("reports", "home"), "reports");
assert.equal(resolveView("settings", "home"), "settings");
assert.equal(resolveView("unknown", "more"), "more");
assert.equal(resolveView("unknown", "unknown"), "home");
assert.equal(shouldOpenGlobalSearch(true), false);
assert.equal(shouldOpenGlobalSearch(false), true);
assert.equal(returnFocusId("quick-add", "mobile"), "mobile-quick-add");
assert.equal(returnFocusId("explain", "cashflow"), "explain-cashflow");
assert.equal(returnFocusId("commitment-add", "main"), "open-commitment-main");
assert.equal(returnFocusId("investment-add", "main"), "open-investment-main");
assert.equal(returnFocusId("debt-add", "main"), "open-debt-main");
assert.equal(mobileTopbarMinHeight(47), 107);

console.log("PASS model behavior, exact financial golden cases, IA, and lineage assertions.");
