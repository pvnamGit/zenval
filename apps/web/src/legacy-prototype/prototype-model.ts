export type PrototypeLocale = "vi" | "en";
export type PrototypeView =
  | "home"
  | "review"
  | "transactions"
  | "accounts"
  | "investments"
  | "debts"
  | "plan"
  | "reports"
  | "settings"
  | "system"
  | "auth";

export type PrototypeViewOrMore = PrototypeView | "more";
export type ReviewBucket = "review" | "pending" | "posted";
export type FinancialStateKind = "posted" | "pending" | "forecast" | "estimated";
export type DerivedValueKey =
  | "todayCashflow"
  | "safeToSpend"
  | "cashFlow"
  | "netWorth"
  | "commitmentBaseline"
  | "portfolioTotal";

export type DialogKind =
  | "explain"
  | "quick-add"
  | "commitment-add"
  | "investment-add"
  | "debt-add"
  | "goal-add";

export const prototypeLocales = ["vi", "en"] as const;

export const prototypeViews = [
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
  "auth",
] as const satisfies ReadonlyArray<PrototypeView>;

export const desktopNavigationIds = [
  "home",
  "review",
  "transactions",
  "accounts",
  "investments",
  "debts",
  "plan",
  "reports",
] as const;

export const iaSubViews = {
  home: ["today", "picture", "planSummary"],
  review: ["review", "pending", "posted"],
  transactions: ["ledger", "commitments", "imports"],
  accounts: ["cashBank", "savings", "reconciliation"],
  investments: ["holdings", "activity", "performance"],
  debts: ["payables", "receivables", "simulation"],
  plan: ["sts", "goals", "forecast", "suggestions"],
  reports: ["pnlCashflow", "netWorthBridge", "monthlyClose"],
  settings: ["profile", "categories", "sources", "notifications", "privacy", "security"],
  system: ["tokens"],
} as const;

export const financialStates = {
  posted: { className: "complete", key: "posted" },
  pending: { className: "pending", key: "pending" },
  forecast: { className: "forecast", key: "forecast" },
  estimated: { className: "estimated", key: "estimate" },
} as const;

export const financialStateClass = {
  forecast: financialStates.forecast.className,
  posted: financialStates.posted.className,
  pending: financialStates.pending.className,
  estimated: financialStates.estimated.className,
} as const;

const POW10 = [1n, 10n, 100n, 1000n, 10000n, 100000n, 1000000n] as const;

export function parseVnd(input: unknown): bigint | null {
  const normalized = String(input ?? "").trim();
  const match = normalized.match(/^([+−-]?)(\d+|\d{1,3}(?:[. ]\d{3})+)(?:\s*₫)?$/);
  if (!match?.[2]) return null;
  const negative = match[1] === "-" || match[1] === "−";
  const digits = match[2].replace(/[. ]/g, "");
  const amount = BigInt(digits);
  return negative ? -amount : amount;
}

export function parseScaledDecimal(input: unknown, scale = 3): bigint | null {
  const normalized = String(input ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(normalized) || scale < 0 || scale > 6) return null;
  const [whole = "0", fraction = ""] = normalized.split(".");
  if (fraction.length > scale) return null;
  const factor = POW10[scale] ?? 1n;
  return BigInt(whole) * factor + BigInt((fraction + "0".repeat(scale)).slice(0, scale));
}

export function parsePercentageBps(input: unknown): bigint | null {
  const normalized = String(input ?? "").trim();
  if (!/^\d+(?:[.,]\d{1,2})?%?$/.test(normalized)) return null;
  const scaled = parseScaledDecimal(normalized.replace(/%$/, ""), 2);
  if (scaled === null || scaled < 0n || scaled > 10000n) return null;
  return scaled;
}

export function validateAllocationPercentages(values: ReadonlyArray<unknown>): boolean {
  const parsed = values.map((value) => Number(value));
  return (
    parsed.length > 0 &&
    parsed.every((value) => Number.isInteger(value) && value >= 0 && value <= 100) &&
    parsed.reduce((total, value) => total + value, 0) === 100
  );
}

export type InstrumentCatalogItem = {
  id: string;
  symbol: string;
  assetClass: string;
  label: string;
};

export const prototypeInstrumentCatalog: ReadonlyArray<InstrumentCatalogItem> = [
  { id: "ssi:FPT:HOSE", symbol: "FPT", assetClass: "equity", label: "FPT · HOSE" },
  { id: "ssi:VNM:HOSE", symbol: "VNM", assetClass: "equity", label: "VNM · HOSE" },
  { id: "ssi:MWG:HOSE", symbol: "MWG", assetClass: "equity", label: "MWG · HOSE" },
  { id: "fiin:DCDS", symbol: "DCDS", assetClass: "fund", label: "DCDS · Fund NAV" },
  { id: "coingecko:bitcoin", symbol: "BTC", assetClass: "crypto", label: "BTC · CoinGecko" },
];

export function instrumentsForAssetClass(assetClass: string): InstrumentCatalogItem[] {
  return prototypeInstrumentCatalog.filter((instrument) => instrument.assetClass === assetClass);
}

export type InstrumentSelectionResult =
  | {
      ok: true;
      instrumentId: string;
      symbol: string;
      assetClass: string;
      source: "manual" | "provider";
      needsReview: boolean;
      id?: string;
      label?: string;
    }
  | {
      ok: false;
      reason: "manual-name-required" | "catalog-class-mismatch";
    };

export function resolveInstrumentSelection(
  selectionId: string | undefined,
  assetClass: string,
  manualName = "",
): InstrumentSelectionResult {
  if (selectionId === "manual") {
    const normalizedName = String(manualName).trim();
    if (!normalizedName) return { ok: false, reason: "manual-name-required" };
    return {
      ok: true,
      instrumentId: `manual:${normalizedName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      symbol: normalizedName.toLocaleUpperCase(),
      assetClass,
      source: "manual",
      needsReview: true,
    };
  }
  const instrument = prototypeInstrumentCatalog.find((candidate) => candidate.id === selectionId);
  if (!instrument || instrument.assetClass !== assetClass) {
    return { ok: false, reason: "catalog-class-mismatch" };
  }
  return {
    ok: true,
    ...instrument,
    instrumentId: instrument.id,
    source: "provider",
    needsReview: false,
  };
}

export function applyPreferenceChange<T extends Record<string, unknown>>(
  preferences: T,
  key: string,
  value: unknown,
): T {
  if (!["baseCurrency", "timezoneMode"].includes(key)) return preferences;
  return { ...preferences, [key]: value };
}

export type ReviewRecord = {
  id: string;
  bucket?: ReviewBucket;
  kind: "transfer" | "duplicate" | "variance" | "expected" | "expense" | "manualInstrument";
  pnlImpact: boolean | null;
  merchant: string;
  amount: string;
};

export function createManualInstrumentReview(
  instrument: InstrumentSelectionResult | null | undefined,
  locale: PrototypeLocale = "vi",
): ReviewRecord | null {
  if (!instrument?.ok || !instrument.needsReview) return null;
  return {
    id: `review-${instrument.instrumentId}`,
    kind: "manualInstrument",
    merchant: instrument.symbol,
    amount: locale === "vi" ? "Chưa định giá" : "Not valued",
    pnlImpact: false,
  };
}

export type GoalRecordTuple = [
  title: string,
  progress: string,
  meta: string,
  state: FinancialStateKind,
  id?: string,
  link?: string,
  sourceAllocation?: number,
  targetDate?: string,
  priority?: string,
  overlap?: boolean,
  targetRaw?: string,
];

export function allocatedGoalPercentage(
  goals: ReadonlyArray<GoalRecordTuple>,
  link: string,
  editingGoalId: string | null = null,
): number {
  return goals
    .filter((goal) => goal[4] !== editingGoalId && goal[5] === link)
    .reduce((total, goal) => total + Number(goal[6] || 0), 0);
}

export function restoreGoalFormDraft(goal: GoalRecordTuple): Record<string, string> {
  return {
    "goal-name-input": goal[0] ?? "",
    "goal-target-input": goal[10] || "",
    "goal-allocation-input": String(goal[6] ?? ""),
    "goal-date-input": goal[7] ?? "",
    "goal-priority-input": goal[8] ?? "",
    "goal-link-input": goal[5] ?? "",
    "goal-overlap-input": String(goal[9] ?? false),
  };
}

export function escapeHtml(input: unknown): string {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function commitmentPnlImpact(kind: string): "interest-only" | boolean {
  if (kind === "debt-installment") return "interest-only";
  if (kind === "saving-transfer") return false;
  return true;
}

export function formatVnd(amount: bigint | number | string): string {
  const value = typeof amount === "bigint" ? amount : BigInt(amount);
  const sign = value < 0n ? "−" : "";
  const digits = (value < 0n ? -value : value).toString();
  return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`;
}

export function formatVndInput(raw: unknown): string {
  const value = String(raw ?? "");
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!/^[+−-]?\d[\d. ]*$/.test(trimmed)) return value;
  const sign =
    trimmed.startsWith("-") || trimmed.startsWith("−") ? "−" : trimmed.startsWith("+") ? "+" : "";
  const digits = trimmed
    .replace(/^[+−-]/, "")
    .replace(/[. ]/g, "")
    .replace(/^0+(?=\d)/, "");
  if (!digits) return "";
  return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export function formatSignedVnd(amount: bigint | number | string, positive: boolean): string {
  return `${positive ? "+" : "−"}${formatVnd(amount).replace(/^−/, "")}`;
}

export function isTodayTransaction(date: string, todayDate: string): boolean {
  return date === todayDate;
}

export function localTimeHHMM(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

export type CashflowEntry = {
  id: string;
  kind: "income" | "expense" | "transfer";
  pnlImpact?: boolean;
  state?: FinancialStateKind;
  date?: string;
  time: string;
  titleVi?: string;
  titleEn?: string;
  account?: string;
  categoryVi?: string;
  categoryEn?: string;
  amount: string;
};

export type TodayCashflowBaseline = {
  date: string;
  inflowDisplay: string;
  outflowDisplay: string;
  netDisplay: string;
  excludedTransferDisplay: string;
  asOf?: string;
  entries: ReadonlyArray<CashflowEntry>;
};

export function summarizeTodayCashflow(
  customTransactions: ReadonlyArray<CashflowEntry>,
  baseline: TodayCashflowBaseline,
) {
  const todayCustomEntries = customTransactions.filter((entry) =>
    isTodayTransaction(entry.date ?? "", baseline.date),
  );
  const entries = [...todayCustomEntries, ...baseline.entries];
  let inflow = 0n;
  let outflow = 0n;
  let excludedTransfers = 0n;
  for (const entry of entries) {
    const amount = parseVnd(entry.amount) ?? 0n;
    if (entry.kind === "income") inflow += amount < 0n ? -amount : amount;
    if (entry.kind === "expense" && entry.pnlImpact !== false) {
      outflow += amount < 0n ? -amount : amount;
    }
    if (entry.kind === "transfer") excludedTransfers += amount < 0n ? -amount : amount;
  }
  return {
    entries,
    inflowDisplay: formatSignedVnd(inflow, true),
    outflowDisplay: formatSignedVnd(outflow, false),
    netDisplay: formatSignedVnd(
      inflow - outflow < 0n ? outflow - inflow : inflow - outflow,
      inflow >= outflow,
    ),
    excludedTransferDisplay: formatVnd(excludedTransfers),
    asOf:
      todayCustomEntries.length && todayCustomEntries[0]
        ? `${baseline.date}T${todayCustomEntries[0].time}:00+07:00`
        : (baseline.asOf ?? "2026-11-01T12:15:00+07:00"),
  };
}

export function isEssentialCommitmentPriority(priority: string): boolean {
  return priority === "essential";
}

export type ManualValuationMap = Record<string, { priceVnd: bigint; date: string }>;

export function recordManualValuation(
  valuations: ManualValuationMap,
  symbol: string,
  priceVnd: bigint,
  date: string,
): ManualValuationMap {
  return { ...valuations, [symbol]: { priceVnd, date } };
}

export type InvestmentHolding = {
  id?: string;
  symbol: string;
  assetClass?: string;
  assetLabelVi?: string;
  assetLabelEn?: string;
  portfolio?: string;
  quantity?: string;
  costBasis: string;
  marketPrice?: string;
  marketValue?: string;
  unrealizedPnl?: string;
  sourceVi?: string;
  sourceEn?: string;
  valuationMode?: string;
  instrumentId?: string;
  doubleCountProtected?: boolean;
  state: FinancialStateKind;
};

export function applyManualValuationsToHoldings<T extends InvestmentHolding>(
  holdings: ReadonlyArray<T>,
  valuations: ManualValuationMap,
  locale: PrototypeLocale = "vi",
): T[] {
  return holdings.map((holding) => {
    const valuation = valuations[holding.symbol];
    if (!valuation) return holding;
    return {
      ...holding,
      marketPrice: formatVnd(valuation.priceVnd),
      marketValue: locale === "vi" ? "Chờ đối chiếu số lượng" : "Awaiting quantity match",
      unrealizedPnl: locale === "vi" ? "Chưa tính" : "Not calculated",
      sourceVi: `Snapshot thủ công ${valuation.date} · Chờ xác nhận`,
      sourceEn: `Manual snapshot ${valuation.date} · Awaiting confirmation`,
      valuationMode: "manual",
      state: "estimated" as const,
    };
  });
}

export type InvestmentCalculationResult =
  | {
      ok: true;
      quantityMillis: bigint;
      unitPriceMilliVnd: bigint;
      grossVnd: bigint;
      feeVnd: bigint;
      cashVnd: bigint;
      roundingResidualMilliVnd: bigint;
    }
  | {
      ok: false;
      error: "invalid-input" | "invalid-unit-price" | "invalid-gross";
    };

export function calculateInvestmentAmounts({
  quantity,
  mode,
  unitPrice,
  gross,
  fee = "0",
}: {
  quantity: unknown;
  mode: "unit" | "total" | string;
  unitPrice?: unknown;
  gross?: unknown;
  fee?: unknown;
}): InvestmentCalculationResult {
  const quantityMillis = parseScaledDecimal(quantity, 3);
  const feeVnd = parseVnd(fee);
  if (quantityMillis === null || quantityMillis <= 0n || feeVnd === null || feeVnd < 0n) {
    return { ok: false, error: "invalid-input" };
  }
  if (mode === "unit") {
    const unitPriceVnd = parseVnd(unitPrice);
    if (unitPriceVnd === null || unitPriceVnd <= 0n) {
      return { ok: false, error: "invalid-unit-price" };
    }
    const numerator = quantityMillis * unitPriceVnd;
    const grossVnd = (numerator + 500n) / 1000n;
    return {
      ok: true,
      quantityMillis,
      unitPriceMilliVnd: unitPriceVnd * 1000n,
      grossVnd,
      feeVnd,
      cashVnd: grossVnd + feeVnd,
      roundingResidualMilliVnd: numerator - grossVnd * 1000n,
    };
  }
  const grossVnd = parseVnd(gross);
  if (grossVnd === null || grossVnd <= 0n) return { ok: false, error: "invalid-gross" };
  return {
    ok: true,
    quantityMillis,
    unitPriceMilliVnd: (grossVnd * 1000000n + quantityMillis / 2n) / quantityMillis,
    grossVnd,
    feeVnd,
    cashVnd: grossVnd + feeVnd,
    roundingResidualMilliVnd: 0n,
  };
}

export function formatUnitPrice(unitPriceMilliVnd: bigint): string {
  const whole = unitPriceMilliVnd / 1000n;
  const fraction = (unitPriceMilliVnd % 1000n).toString().padStart(3, "0").replace(/0+$/, "");
  return fraction ? `${formatVnd(whole).replace(" ₫", "")},${fraction} ₫` : formatVnd(whole);
}

export type RecoverableValueResult =
  | {
      ok: true;
      principal: bigint;
      probabilityBps: bigint;
      estimatedRecoverable: bigint;
    }
  | {
      ok: false;
      error: "invalid-recoverability";
    };

export function calculateRecoverableValue(
  principalInput: unknown,
  probabilityInput: unknown,
): RecoverableValueResult {
  const principal = parseVnd(principalInput);
  const probabilityBps = parsePercentageBps(probabilityInput);
  if (principal === null || principal < 0n || probabilityBps === null) {
    return { ok: false, error: "invalid-recoverability" };
  }
  return {
    ok: true,
    principal,
    probabilityBps,
    estimatedRecoverable: (principal * probabilityBps + 5000n) / 10000n,
  };
}

export function buildReceivableDraft(principalInput: unknown, probabilityInput: unknown) {
  const result = calculateRecoverableValue(principalInput, probabilityInput);
  if (!result.ok) return { ...result, preview: "—" };
  return { ...result, preview: formatVnd(result.estimatedRecoverable) };
}

export type InvestmentActivityKind = "buy" | "sell" | "dividend" | "valuation";

export function investmentActivityEffect(kind: string) {
  const effects: Record<
    string,
    {
      createsHoldingDraft: boolean;
      quantityDirection: number;
      changesCostBasis: boolean;
      changesMarketValueOnly: boolean;
      pnlImpact: boolean | "realized-only";
    }
  > = {
    buy: {
      createsHoldingDraft: true,
      quantityDirection: 1,
      changesCostBasis: true,
      changesMarketValueOnly: false,
      pnlImpact: false,
    },
    sell: {
      createsHoldingDraft: false,
      quantityDirection: -1,
      changesCostBasis: true,
      changesMarketValueOnly: false,
      pnlImpact: "realized-only",
    },
    dividend: {
      createsHoldingDraft: false,
      quantityDirection: 0,
      changesCostBasis: false,
      changesMarketValueOnly: false,
      pnlImpact: true,
    },
    valuation: {
      createsHoldingDraft: false,
      quantityDirection: 0,
      changesCostBasis: false,
      changesMarketValueOnly: true,
      pnlImpact: false,
    },
  };
  return effects[kind] ?? null;
}

export const financialFixture = {
  cashAccountsVnd: 211600000n,
  portfolioVnd: 108000000n,
  recoverableReceivablesVnd: 6500000n,
  liabilitiesVnd: 33500000n,
  monthlyIncomeVnd: 35475000n,
  monthlyExpensesVnd: 21850000n,
  monthlyMarketMovementVnd: 1625000n,
  openingNetWorthVnd: 277350000n,
} as const;

export function fixtureNetWorth(fixture = financialFixture): bigint {
  return (
    fixture.cashAccountsVnd +
    fixture.portfolioVnd +
    fixture.recoverableReceivablesVnd -
    fixture.liabilitiesVnd
  );
}

export function fixtureMonthlyPnl(fixture = financialFixture): bigint {
  return fixture.monthlyIncomeVnd - fixture.monthlyExpensesVnd;
}

export function fixtureBridgeEnding(fixture = financialFixture): bigint {
  return fixture.openingNetWorthVnd + fixtureMonthlyPnl(fixture) + fixture.monthlyMarketMovementVnd;
}

export const todayCashflowSummary: TodayCashflowBaseline = {
  date: "2026-11-01",
  inflowDisplay: "+2.500.000 ₫",
  outflowDisplay: "−636.000 ₫",
  netDisplay: "+1.864.000 ₫",
  excludedTransferDisplay: "2.000.000 ₫",
  entries: [
    {
      id: "today-inc-1",
      kind: "income",
      pnlImpact: true,
      state: "posted",
      time: "08:15",
      titleVi: "Thanh toán thiết kế UI freelance",
      titleEn: "Freelance UI design payout",
      account: "Vietcombank · •• 2486",
      categoryVi: "Thu nhập phụ",
      categoryEn: "Side income",
      amount: "+2.500.000 ₫",
    },
    {
      id: "today-exp-1",
      kind: "expense",
      pnlImpact: true,
      state: "posted",
      time: "09:42",
      titleVi: "WinMart · Thực phẩm gia đình",
      titleEn: "WinMart · Groceries",
      account: "Vietcombank · •• 2486",
      categoryVi: "Ăn uống & Siêu thị",
      categoryEn: "Groceries & dining",
      amount: "−486.000 ₫",
    },
    {
      id: "today-exp-2",
      kind: "expense",
      pnlImpact: true,
      state: "posted",
      time: "12:10",
      titleVi: "Grab & Cà phê sáng",
      titleEn: "Grab & morning coffee",
      account: "MoMo · •• 0901",
      categoryVi: "Di chuyển & Ăn ngoài",
      categoryEn: "Transport & dining",
      amount: "−150.000 ₫",
    },
    {
      id: "today-trf-1",
      kind: "transfer",
      pnlImpact: false,
      state: "posted",
      time: "10:05",
      titleVi: "Nạp ví MoMo từ Vietcombank",
      titleEn: "Top up MoMo from Vietcombank",
      account: "VCB → MoMo",
      categoryVi: "Chuyển khoản nội bộ (Không tính Thu/Chi)",
      categoryEn: "Internal transfer (Excluded from P&L)",
      amount: "2.000.000 ₫",
    },
  ],
};

export const derivedValues: Record<
  DerivedValueKey,
  {
    display: string;
    sourceIds: string[];
    asOf: string;
    calculationVersion: string;
    horizonEnd: string;
    state: FinancialStateKind;
    titleKey: string;
  }
> = {
  todayCashflow: {
    display: "+1.864.000 ₫",
    sourceIds: ["today-inc-1", "today-exp-1", "today-exp-2", "excluded:today-trf-1"],
    asOf: "2026-11-01T12:15:00+07:00",
    calculationVersion: "daily-pnl-v1.0",
    horizonEnd: "2026-11-01",
    state: "posted",
    titleKey: "todaySummary",
  },
  safeToSpend: {
    display: "12.400.000 ₫",
    sourceIds: ["vcb-2486", "momo-0901", "commitments-active"],
    asOf: "2026-11-01T08:30:00+07:00",
    calculationVersion: "sts-v1.0",
    horizonEnd: "2026-11-15",
    state: "estimated",
    titleKey: "safe",
  },
  cashFlow: {
    display: "8.200.000 ₫",
    sourceIds: ["ledger-posted", "expected-occurrences", "active-commitments"],
    asOf: "2026-11-01T08:30:00+07:00",
    calculationVersion: "cashflow-v1.0",
    horizonEnd: "2026-11-30",
    state: "forecast",
    titleKey: "cashFlow",
  },
  netWorth: {
    display: "292.600.000 ₫",
    sourceIds: [
      "account-balances",
      "portfolio-holdings",
      "recoverable-receivables",
      "liability-balances",
    ],
    asOf: "2026-11-01T08:30:00+07:00",
    calculationVersion: "networth-v1.0",
    horizonEnd: "2026-11-01",
    state: "estimated",
    titleKey: "netWorth",
  },
  commitmentBaseline: {
    display: "19.750.000 ₫",
    sourceIds: ["commit-rent", "commit-internet", "commit-loan", "commit-insurance", "commit-save"],
    asOf: "2026-11-01T08:30:00+07:00",
    calculationVersion: "commitment-baseline-v1.0",
    horizonEnd: "2026-11-30",
    state: "estimated",
    titleKey: "commitmentsTitle",
  },
  portfolioTotal: {
    display: "108.000.000 ₫",
    sourceIds: ["hold-fpt", "hold-dcds", "hold-gold", "hold-cash-no-double-count"],
    asOf: "2026-11-01T08:30:00+07:00",
    calculationVersion: "portfolio-wavg-v1.0",
    horizonEnd: "2026-11-01",
    state: "estimated",
    titleKey: "investments",
  },
};

export type FixedCommitment = {
  id: string;
  direction: "inflow" | "outflow";
  kind: "recurring-income" | "fixed-expense" | "debt-installment" | "saving-transfer" | string;
  pnlImpact: "interest-only" | boolean;
  essential: boolean;
  dueDay: string;
  cadenceVi: string;
  cadenceEn: string;
  titleVi: string;
  titleEn: string;
  account: string;
  tolerance: string;
  amount: string;
  statusKey: string;
  state: FinancialStateKind;
};

export const fixedCommitments: ReadonlyArray<FixedCommitment> = [
  {
    id: "inc-salary",
    direction: "inflow",
    kind: "recurring-income",
    pnlImpact: true,
    essential: true,
    dueDay: "15",
    cadenceVi: "Hàng tháng · Ngày 15",
    cadenceEn: "Monthly · Day 15",
    titleVi: "Lương chính công ty",
    titleEn: "Primary monthly salary",
    account: "Vietcombank · •• 2486",
    tolerance: "±0% · Độ tin cậy 95%",
    amount: "+30.000.000 ₫",
    statusKey: "expected",
    state: "forecast",
  },
  {
    id: "inc-retainer",
    direction: "inflow",
    kind: "recurring-income",
    pnlImpact: true,
    essential: false,
    dueDay: "28",
    cadenceVi: "Hàng tháng · Ngày 28",
    cadenceEn: "Monthly · Day 28",
    titleVi: "Hợp đồng bảo trì sản phẩm",
    titleEn: "Product maintenance retainer",
    account: "Vietcombank · •• 2486",
    tolerance: "±10% · Thận trọng tính 4.500.000 ₫",
    amount: "+5.000.000 ₫",
    statusKey: "estimate",
    state: "estimated",
  },
  {
    id: "commit-rent",
    direction: "outflow",
    kind: "fixed-expense",
    pnlImpact: true,
    essential: true,
    dueDay: "05",
    cadenceVi: "Hàng tháng · Ngày 05",
    cadenceEn: "Monthly · Day 05",
    titleVi: "Tiền thuê nhà căn hộ",
    titleEn: "Apartment rent",
    account: "Vietcombank · •• 2486",
    tolerance: "±0% · Tự động khớp trong dung sai",
    amount: "−8.000.000 ₫",
    statusKey: "posted",
    state: "estimated",
  },
  {
    id: "commit-internet",
    direction: "outflow",
    kind: "fixed-expense",
    pnlImpact: true,
    essential: true,
    dueDay: "08",
    cadenceVi: "Hàng tháng · Ngày 08",
    cadenceEn: "Monthly · Day 08",
    titleVi: "Internet FPT & Điện nước",
    titleEn: "Fiber internet & utilities",
    account: "Vietcombank · •• 2486",
    tolerance: "±15% · Giữ chỗ tối đa 1.250.000 ₫",
    amount: "−1.250.000 ₫",
    statusKey: "pending",
    state: "pending",
  },
  {
    id: "commit-loan",
    direction: "outflow",
    kind: "debt-installment",
    pnlImpact: "interest-only",
    essential: true,
    dueDay: "12",
    cadenceVi: "Hàng tháng · Ngày 12",
    cadenceEn: "Monthly · Day 12",
    titleVi: "Khoản vay ngân hàng VIB (Gốc 2,8tr · Lãi 700k)",
    titleEn: "VIB bank loan (Principal 2.8m · Interest 700k)",
    account: "Vietcombank · •• 2486 → Hồ sơ nợ VIB",
    tolerance: "Gốc không tính chi tiêu P&L · Chỉ lãi/phí vào P&L",
    amount: "−3.500.000 ₫",
    statusKey: "pending",
    state: "pending",
  },
  {
    id: "commit-insurance",
    direction: "outflow",
    kind: "fixed-expense",
    pnlImpact: true,
    essential: true,
    dueDay: "20",
    cadenceVi: "Hàng tháng · Ngày 20",
    cadenceEn: "Monthly · Day 20",
    titleVi: "Bảo hiểm sức khỏe & Học phí",
    titleEn: "Health insurance & tuition",
    account: "Vietcombank · •• 2486",
    tolerance: "±5% · Đã trừ khỏi Safe-to-spend",
    amount: "−2.000.000 ₫",
    statusKey: "forecast",
    state: "forecast",
  },
  {
    id: "commit-save",
    direction: "outflow",
    kind: "saving-transfer",
    pnlImpact: false,
    essential: false,
    dueDay: "16",
    cadenceVi: "Hàng tháng · Ngày 16",
    cadenceEn: "Monthly · Day 16",
    titleVi: "Trích lập Quỹ dự phòng tự động",
    titleEn: "Emergency fund auto-transfer",
    account: "VCB → Techcombank Savings",
    tolerance: "Chuyển khoản nội bộ · Không tính là chi phí P&L",
    amount: "5.000.000 ₫",
    statusKey: "forecast",
    state: "forecast",
  },
];

export const investmentHoldings: ReadonlyArray<Required<Omit<InvestmentHolding, "instrumentId">>> =
  [
    {
      id: "hold-fpt",
      symbol: "FPT",
      assetClass: "equity",
      assetLabelVi: "Cổ phiếu niêm yết · HOSE",
      assetLabelEn: "Listed equity · HOSE",
      portfolio: "TCBS Tích sản",
      quantity: "500 CP",
      costBasis: "59.000.000 ₫ (TB 118.000 ₫/CP)",
      marketPrice: "134.000 ₫/CP",
      marketValue: "67.000.000 ₫",
      unrealizedPnl: "+8.000.000 ₫ (+13,5%)",
      sourceVi: "HOSE EOD · 31/10 15:00",
      sourceEn: "HOSE EOD · Oct 31 15:00",
      valuationMode: "provider",
      doubleCountProtected: false,
      state: "estimated",
    },
    {
      id: "hold-dcds",
      symbol: "DCDS",
      assetClass: "fund",
      assetLabelVi: "Chứng chỉ quỹ mở",
      assetLabelEn: "Open-ended mutual fund",
      portfolio: "Dragon Capital",
      quantity: "720 CCQ",
      costBasis: "18.000.000 ₫ (TB 25.000 ₫/CCQ)",
      marketPrice: "27.500 ₫/CCQ",
      marketValue: "19.800.000 ₫",
      unrealizedPnl: "+1.800.000 ₫ (+10,0%)",
      sourceVi: "NAV công bố · 30/10",
      sourceEn: "Published NAV · Oct 30",
      valuationMode: "provider",
      doubleCountProtected: false,
      state: "estimated",
    },
    {
      id: "hold-gold",
      symbol: "GOLD-9999",
      assetClass: "gold",
      assetLabelVi: "Vàng nhẫn 9999 vật chất",
      assetLabelEn: "Physical 9999 gold ring",
      portfolio: "Tài sản tích trữ",
      quantity: "2,0 chỉ",
      costBasis: "15.500.000 ₫ (TB 7.750.000 ₫/chỉ)",
      marketPrice: "8.600.000 ₫/chỉ",
      marketValue: "17.200.000 ₫",
      unrealizedPnl: "+1.700.000 ₫ (+10,9%)",
      sourceVi: "Định giá thủ công · 01/11 08:00",
      sourceEn: "Manual valuation · Nov 01 08:00",
      valuationMode: "manual",
      doubleCountProtected: false,
      state: "estimated",
    },
    {
      id: "hold-cash",
      symbol: "CASH-TCBS",
      assetClass: "cash",
      assetLabelVi: "Tiền mặt chờ đầu tư (Liên kết chống tính trùng)",
      assetLabelEn: "Brokerage cash (Linked, no double-count)",
      portfolio: "TCBS Tích sản",
      quantity: "VND",
      costBasis: "4.000.000 ₫",
      marketPrice: "1,00",
      marketValue: "4.000.000 ₫",
      unrealizedPnl: "0 ₫ (0,0%)",
      sourceVi: "Sổ cái TCBS · Đã loại trừ trùng ở Tài khoản",
      sourceEn: "TCBS ledger · Deduplicated from Accounts total",
      valuationMode: "ledger",
      doubleCountProtected: true,
      state: "posted",
    },
  ];

export type InvestmentActivityRecord = {
  id: string;
  kind: string;
  pnlImpact: boolean | "realized-only";
  symbol: string;
  instrumentId?: string;
  date: string;
  titleVi: string;
  titleEn: string;
  metaVi: string;
  metaEn: string;
  amount: string;
  state: FinancialStateKind;
  needsReview?: boolean;
};

export const investmentActivities: ReadonlyArray<InvestmentActivityRecord> = [
  {
    id: "act-buy-fpt",
    kind: "buy",
    pnlImpact: false,
    symbol: "FPT",
    date: "28/10/2026",
    titleVi: "Mua khớp lệnh 100 CP FPT @ 132.000 ₫",
    titleEn: "Bought 100 FPT shares @ 132,000 ₫",
    metaVi: "Phí 19.800 ₫ · Tăng giá vốn bình quân, không tính là chi tiêu P&L",
    metaEn: "Fee 19,800 ₫ · Increases weighted-avg cost basis, non-P&L principal",
    amount: "13.219.800 ₫",
    state: "posted",
  },
  {
    id: "act-div-fpt",
    kind: "dividend",
    pnlImpact: true,
    symbol: "FPT",
    date: "20/10/2026",
    titleVi: "Cổ tức tiền mặt FPT đợt 1/2026 (1.000 ₫/CP)",
    titleEn: "FPT cash dividend tranche 1/2026 (1,000 ₫/share)",
    metaVi: "Thuế TNCN khấu trừ 25.000 ₫ · Ghi nhận Thu nhập đầu tư ròng",
    metaEn: "Withholding tax 25,000 ₫ · Recorded as net investment income",
    amount: "+475.000 ₫",
    state: "posted",
  },
  {
    id: "act-corp-fpt",
    kind: "corporate-action",
    pnlImpact: false,
    symbol: "FPT",
    date: "12/09/2026",
    titleVi: "Cổ tức bằng cổ phiếu tỷ lệ 20:3 (+65 CP)",
    titleEn: "Stock dividend 20:3 (+65 shares)",
    metaVi: "Quyền cổ đông · Điều chỉnh lại giá vốn TB/CP, không tạo P&L giả",
    metaEn: "Corporate action · Adjusts per-share cost basis without fake P&L",
    amount: "+65 CP",
    state: "posted",
  },
  {
    id: "act-val-gold",
    kind: "valuation",
    pnlImpact: false,
    symbol: "GOLD-9999",
    date: "01/11/2026",
    titleVi: "Cập nhật giá vàng nhẫn thủ công (8.600.000 ₫/chỉ)",
    titleEn: "Manual gold ring price snapshot (8,600,000 ₫/chỉ)",
    metaVi: "Chỉ cập nhật Unrealized P&L · Giữ nguyên lịch sử giá nhà cung cấp",
    metaEn: "Updates unrealized P&L only · Preserves provider price history",
    amount: "17.200.000 ₫",
    state: "estimated",
  },
];

export type DebtObligation =
  | {
      id: string;
      direction: "payable";
      counterpartyVi: string;
      counterpartyEn: string;
      originalPrincipal: string;
      outstandingPrincipal: string;
      rate: string;
      nextInstallment: string;
      dueDate: string;
      reminderSchedule?: string;
      principalPnlImpact: false;
      state: FinancialStateKind;
    }
  | {
      id: string;
      direction: "receivable";
      counterpartyVi: string;
      counterpartyEn: string;
      grossPrincipal: string;
      recoveryProbability: string;
      estimatedRecoverable: string;
      dueDate: string;
      reminderSchedule?: string;
      principalPnlImpact: false;
      state: FinancialStateKind;
    };

export const debtObligations: ReadonlyArray<DebtObligation> = [
  {
    id: "obl-vib-loan",
    direction: "payable",
    counterpartyVi: "Ngân hàng VIB · Vay mua xe",
    counterpartyEn: "VIB Bank · Auto loan",
    originalPrincipal: "120.000.000 ₫",
    outstandingPrincipal: "30.000.000 ₫",
    rate: "9,2%/năm · Dư nợ giảm dần",
    nextInstallment: "3.500.000 ₫ (Gốc 2.800.000 ₫ · Lãi 700.000 ₫)",
    dueDate: "12/11/2026",
    principalPnlImpact: false,
    state: "posted",
  },
  {
    id: "obl-vcb-card",
    direction: "payable",
    counterpartyVi: "Thẻ tín dụng Vietcombank Visa",
    counterpartyEn: "Vietcombank Visa Credit Card",
    originalPrincipal: "Hạn mức 50.000.000 ₫",
    outstandingPrincipal: "3.500.000 ₫",
    rate: "Miễn lãi đến 20/11 · Đã ghi chi tiêu lúc quẹt thẻ",
    nextInstallment: "3.500.000 ₫ (Thanh toán sao kê = Chuyển khoản trả gốc, không tính chi lần 2)",
    dueDate: "20/11/2026",
    principalPnlImpact: false,
    state: "posted",
  },
  {
    id: "rec-brother-loan",
    direction: "receivable",
    counterpartyVi: "Cho Minh (bạn đại học) mượn ngắn hạn",
    counterpartyEn: "Personal loan to Minh",
    grossPrincipal: "10.000.000 ₫",
    recoveryProbability: "65%",
    estimatedRecoverable: "6.500.000 ₫",
    dueDate: "25/11/2026",
    principalPnlImpact: false,
    state: "estimated",
  },
];

export const reviewRecords: ReadonlyArray<ReviewRecord> = [
  {
    id: "transfer-candidate",
    bucket: "review",
    kind: "transfer",
    pnlImpact: false,
    merchant: "MoMo → VCB",
    amount: "2.000.000 ₫",
  },
  {
    id: "duplicate-candidate",
    bucket: "review",
    kind: "duplicate",
    pnlImpact: null,
    merchant: "WinMart",
    amount: "486.000 ₫",
  },
  {
    id: "commitment-variance",
    bucket: "review",
    kind: "variance",
    pnlImpact: null,
    merchant: "loan",
    amount: "3.620.000 ₫",
  },
  {
    id: "expected-rent",
    bucket: "pending",
    kind: "expected",
    pnlImpact: null,
    merchant: "rent",
    amount: "8.000.000 ₫",
  },
  {
    id: "posted-groceries",
    bucket: "posted",
    kind: "expense",
    pnlImpact: true,
    merchant: "WinMart",
    amount: "486.000 ₫",
  },
];

export function recordsForBucket(bucket: ReviewBucket): ReviewRecord[] {
  return reviewRecords.filter((record) => record.bucket === bucket);
}

export function getReviewRecords(bucket: ReviewBucket): ReviewRecord[] {
  return recordsForBucket(bucket);
}

export function resolveView(
  hashView: string | null | undefined,
  storedView: string | null | undefined,
): PrototypeViewOrMore {
  if (hashView && (prototypeViews as ReadonlyArray<string>).includes(hashView)) {
    return hashView as PrototypeView;
  }
  if (storedView && ([...prototypeViews, "more"] as ReadonlyArray<string>).includes(storedView)) {
    return storedView as PrototypeViewOrMore;
  }
  return "home";
}

export function shouldOpenGlobalSearch(dialogOpen: boolean): boolean {
  return !dialogOpen;
}

export function resolveNavigationTarget(
  current: { txSub: string; planSub: string; repSub: string },
  target: {
    view: PrototypeViewOrMore;
    txSub?: string;
    planSub?: string;
    reportSub?: string;
  },
) {
  return {
    view: target.view,
    txSub: target.view === "transactions" && target.txSub ? target.txSub : current.txSub,
    planSub: target.view === "plan" && target.planSub ? target.planSub : current.planSub,
    repSub: target.view === "reports" && target.reportSub ? target.reportSub : current.repSub,
  };
}

export function returnFocusId(dialog: string, surface?: string): string {
  if (dialog === "explain") return `explain-${surface}`;
  if (dialog === "commitment-add") return `open-commitment-${surface || "main"}`;
  if (dialog === "investment-add") return `open-investment-${surface || "main"}`;
  if (dialog === "goal-add") return `open-goal-${surface || "main"}`;
  if (dialog === "debt-add") return `open-debt-${surface || "main"}`;
  if (surface === "mobile") return "mobile-quick-add";
  if (surface === "home") return "home-quick-add";
  return "top-quick-add";
}

export function mobileTopbarMinHeight(
  safeAreaTop: number,
  controlHeight = 44,
  verticalPadding = 16,
): number {
  return safeAreaTop + controlHeight + verticalPadding;
}
