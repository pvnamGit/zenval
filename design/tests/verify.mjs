import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  debtObligations,
  derivedValues,
  financialStates,
  fixedCommitments,
  iaSubViews,
  instrumentsForAssetClass,
  investmentHoldings,
  prototypeViews,
  resolveInstrumentSelection,
  reviewRecords,
  todayCashflowSummary,
} from "../model.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const css = readFileSync(resolve(root, "styles.css"), "utf8");
const js = readFileSync(resolve(root, "app.js"), "utf8");

const checks = [
  ["links local CSS", /href="styles\.css(?:\?[^"]+)?"/.test(html)],
  ["links local module JavaScript", /src="app\.js(?:\?[^"]+)?" type="module"/.test(html)],
  ["has mobile viewport-fit", html.includes("viewport-fit=cover")],
  ["has no framework/runtime CDN", !/(react|nextjs|vue|angular|svelte|cdn\.)/i.test(html)],
  ["defines light tokens", css.includes(":root {") && css.includes("--accent:")],
  ["defines dark tokens", css.includes(':root[data-theme="dark"]')],
  [
    "uses iPhone safe areas",
    css.includes("safe-area-inset-bottom") && css.includes("safe-area-inset-top"),
  ],
  ["supports a narrow viewport", css.includes("@media (max-width: 760px)")],
  ["supports reduced motion", css.includes("prefers-reduced-motion")],
  ["supports Vietnamese and English", js.includes("vi:") && js.includes("en:")],
  [
    "covers full PRD §5.1 top-level IA screens",
    [
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
    ].every((v) => prototypeViews.includes(v)),
  ],
  [
    "covers PRD §5.1 sub-views for every module",
    Object.keys(iaSubViews).length >= 10 &&
      iaSubViews.transactions.includes("commitments") &&
      iaSubViews.investments.includes("holdings") &&
      iaSubViews.debts.includes("payables") &&
      iaSubViews.plan.includes("suggestions"),
  ],
  [
    "keeps #home focused on today's spending and financial health",
    js.includes('class="home-minimal"') &&
      js.includes('class="card home-spending-card"') &&
      js.includes('class="card financial-health-card"') &&
      js.includes('derivedAttrs("cashFlow")') &&
      js.includes('derivedAttrs("netWorth")') &&
      !js.includes('id="home-today-cashflow"') &&
      !js.includes('const subItems = [\n      ["all", t("homeSubAll")]'),
  ],
  [
    "preserves today's transfer exclusion in the spending hero",
    js.includes('class="today-spending-facts"') &&
      js.includes('data-pnl-impact="false"') &&
      Boolean(todayCashflowSummary.inflowDisplay) &&
      Boolean(todayCashflowSummary.outflowDisplay) &&
      todayCashflowSummary.entries.some((e) => e.kind === "transfer" && e.pnlImpact === false),
  ],
  [
    "home signal links open their owning detail sections",
    js.includes('data-view="plan" data-plan-sub="forecast"') &&
      js.includes('data-view="reports" data-report-sub="netWorthBridge"') &&
      js.includes("resolveNavigationTarget(state, control.dataset)") &&
      js.includes('data-view="transactions" data-tx-sub="ledger"'),
  ],
  [
    "home derived values preserve state, freshness, evidence, explanation, and focus disclosure",
    js.includes("status(derivedValues.netWorth.state)") &&
      js.includes("status(derivedValues.todayCashflow.state)") &&
      js.includes("todaySummary.asOf.slice(11, 16)") &&
      js.includes('data-health-summary="positive-cash-low"') &&
      js.includes('data-based-on="cashFlow safeToSpend netWorth"') &&
      js.includes("status(derivedValues.cashFlow.state)") &&
      js.includes('id="explain-today"') &&
      js.includes('id="top-quick-add"') &&
      !js.includes('id="home-quick-add"'),
  ],
  [
    "quick add uses real local time and restores focus after routing to the ledger",
    js.includes("time: localTimeHHMM()") &&
      js.includes('state.returnFocusId = "main-content"') &&
      js.includes('state.txSub = "ledger"'),
  ],
  [
    "exposes monthly fixed commitments screen and creation dialog",
    js.includes('id="fixed-commitments-screen"') &&
      js.includes('data-action="commitment-add"') &&
      js.includes('data-action="save-commitment"') &&
      fixedCommitments.some((c) => c.direction === "inflow") &&
      fixedCommitments.some((c) => c.direction === "outflow"),
  ],
  [
    "exposes investment portfolio screen and logging dialog",
    js.includes('id="investment-holdings-list"') &&
      js.includes('data-action="investment-add"') &&
      js.includes('data-action="save-investment"') &&
      investmentHoldings.some((h) => h.doubleCountProtected === true),
  ],
  [
    "uses a provider catalog dropdown for investment instruments",
    js.includes('<select id="inv-symbol-input">') &&
      instrumentsForAssetClass("equity").some((instrument) => instrument.symbol === "FPT") &&
      resolveInstrumentSelection("ssi:FPT:HOSE", "equity").ok === true &&
      resolveInstrumentSelection("ssi:FPT:HOSE", "gold").ok === false,
  ],
  [
    "supports user-created linked goals and editable allocation ratios",
    js.includes('data-action="goal-add"') &&
      js.includes('data-action="save-goal"') &&
      js.includes('data-action="goal-edit"') &&
      js.includes('data-action="goal-pause"') &&
      js.includes('data-action="goal-archive"') &&
      js.includes('data-action="save-allocation"') &&
      js.includes("Allocation ratios must total 100%"),
  ],
  [
    "routes manual instruments to the rendered review inbox",
    js.includes("state.customReviews") &&
      js.includes("createManualInstrumentReview(instrument, state.locale)") &&
      js.includes('state.reviewBucket === "review"'),
  ],
  [
    "lets users choose language and base currency while device owns theme and timezone defaults",
    js.includes('id="base-currency-input"') &&
      js.includes('state.baseCurrency === "USD"') &&
      js.includes('id="timezone-mode-input"') &&
      js.includes('data-action="theme-system"') &&
      js.includes("From device · Never inferred from location/IP"),
  ],
  [
    "does not repeat a plus glyph in action labels",
    !/["'>]\+ (Tạo|Thêm|Ghi|Create|Add|Log)/.test(js),
  ],
  [
    "exposes debts & receivables screen with ERV and principal non-P&L rail",
    debtObligations.some((d) => d.direction === "payable" && d.principalPnlImpact === false) &&
      debtObligations.some((d) => d.direction === "receivable" && Boolean(d.estimatedRecoverable)),
  ],
  ["has distinct posted state", financialStates.posted.className === "complete"],
  ["has distinct pending state", financialStates.pending.className === "pending"],
  ["has distinct forecast state", financialStates.forecast.className === "forecast"],
  [
    "marks transfer P&L impact false",
    reviewRecords.find((record) => record.kind === "transfer")?.pnlImpact === false,
  ],
  ["never labels transfer as income/expense impact", js.includes('data-pnl-impact="false"')],
  [
    "every derived value carries sources",
    Object.values(derivedValues).every((v) => v.sourceIds.length),
  ],
  ["every derived value carries freshness", Object.values(derivedValues).every((v) => v.asOf)],
  [
    "every derived value carries a calculation version",
    Object.values(derivedValues).every((v) => v.calculationVersion),
  ],
  [
    "every derived value carries a horizon",
    Object.values(derivedValues).every((v) => v.horizonEnd),
  ],
  ["derived cards expose drill-down controls", /data-action="explain"/i.test(js)],
  ["dialog makes background inert", js.includes('state.dialog ? "inert" : ""')],
  ["dialog restores focus by stable ID", js.includes("focusReturnControl()")],
  ["global search is guarded while a dialog is open", js.includes("shouldOpenGlobalSearch")],
  [
    "quick add creates an in-session transaction",
    js.includes('data-action="save-transaction"') &&
      js.includes("state.customTransactions.unshift") &&
      js.includes("summarizeTodayCashflow(state.customTransactions"),
  ],
  [
    "quick add feedback and lineage follow the selected date",
    js.includes("Past-date transaction added to the ledger") &&
      js.includes("todaySummary.asOf") &&
      js.includes("isTodayTransaction(date, todayCashflowSummary.date)"),
  ],
  [
    "quick add separates income and expense categories",
    js.includes('state.transactionType === "income"') &&
      js.includes('"Lương"') &&
      js.includes('"Ăn uống"'),
  ],
  [
    "form-type switches preserve compatible draft values",
    js.includes("state.formDrafts[control.id] = control.value") &&
      js.includes('draft("quick-amount-input")') &&
      js.includes('draft("commit-name-input")') &&
      js.includes('selected("commit-priority-input", "flexible")'),
  ],
  [
    "commitment reservation priority is preserved and applied",
    js.includes("isEssentialCommitmentPriority(priority)") && js.includes('value="flexible"'),
  ],
  [
    "investment asset class survives activity rerenders",
    js.includes('selected("inv-class-input", "gold")'),
  ],
  [
    "investment entry supports unit-price and gross-total modes",
    js.includes('value="unit"') &&
      js.includes('value="total"') &&
      js.includes("calculateInvestmentAmounts"),
  ],
  [
    "investment activity handlers keep distinct effects",
    js.includes('state.invActivityType === "buy"') &&
      js.includes('state.invActivityType === "sell"') &&
      js.includes('state.invActivityType === "dividend"') &&
      js.includes('state.invActivityType === "valuation"'),
  ],
  [
    "manual valuation creates or updates a pending snapshot",
    js.includes("recordManualValuation(") &&
      js.includes("applyManualValuationsToHoldings(") &&
      js.includes("custom-valuation-") &&
      js.includes("Manual price snapshot awaits quantity matching"),
  ],
  [
    "saved free text is escaped before innerHTML rendering",
    js.includes("escapeHtml(root.querySelector") && js.includes("escapeHtml(rate"),
  ],
  [
    "debt and daily reminders are configurable",
    js.includes('id="notify-debt-enabled"') &&
      js.includes('id="notify-daily-time"') &&
      js.includes('dailyCaptureTime: "21:00"'),
  ],
  [
    "receivable ERV preview recalculates on input",
    js.includes('["debt-principal-input", "debt-rate-input"].includes(control?.id)') &&
      js.includes("preview.textContent = result.preview") &&
      js.includes("buildReceivableDraft(principalInput, rate)") &&
      !js.includes('rate || "80"'),
  ],
  [
    "customer UI hides internal IA and requirement markers",
    js.includes('!eyebrow.startsWith("IA ·")') &&
      !js.includes("P&L — FR-") &&
      !js.includes("Net-Worth Bridge — PRD") &&
      !js.includes("Monthly Close — PRD") &&
      !js.includes("(FR-004, FR-005)"),
  ],
  [
    "settings categories and sources use distinct sections",
    js.includes("settingsCategoriesSection") && js.includes("settingsSourcesSection"),
  ],
  [
    "Google sign-in has an honest prototype screen",
    js.includes('data-action="google-sign-in"') && js.includes("no real OAuth request"),
  ],
];

for (const [name, passed] of checks) {
  assert.equal(passed, true, `Failed: ${name}`);
  console.log(`PASS ${name}`);
}

console.log(`\n${checks.length} standalone design checks passed.`);
