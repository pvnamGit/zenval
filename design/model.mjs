export const prototypeLocales = ["vi", "en"];
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
];

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
};

export const financialStates = {
  posted: { className: "complete", key: "posted" },
  pending: { className: "pending", key: "pending" },
  forecast: { className: "forecast", key: "forecast" },
  estimated: { className: "estimated", key: "estimate" },
};

const POW10 = [1n, 10n, 100n, 1000n, 10000n, 100000n, 1000000n];

export function parseVnd(input) {
  const normalized = String(input ?? "").trim();
  const match = normalized.match(/^([+−-]?)(\d+|\d{1,3}(?:[. ]\d{3})+)(?:\s*₫)?$/);
  if (!match) return null;
  const negative = match[1] === "-" || match[1] === "−";
  const digits = match[2].replace(/[. ]/g, "");
  const amount = BigInt(digits);
  return negative ? -amount : amount;
}

export function parseScaledDecimal(input, scale = 3) {
  const normalized = String(input ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(",", ".");
  if (!/^\d+(?:\.\d+)?$/.test(normalized) || scale < 0 || scale > 6) return null;
  const [whole, fraction = ""] = normalized.split(".");
  if (fraction.length > scale) return null;
  return BigInt(whole) * POW10[scale] + BigInt((fraction + "0".repeat(scale)).slice(0, scale));
}

export function parsePercentageBps(input) {
  const normalized = String(input ?? "").trim();
  if (!/^\d+(?:[.,]\d{1,2})?%?$/.test(normalized)) return null;
  const scaled = parseScaledDecimal(normalized.replace(/%$/, ""), 2);
  if (scaled === null || scaled < 0n || scaled > 10000n) return null;
  return scaled;
}

export function escapeHtml(input) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function commitmentPnlImpact(kind) {
  if (kind === "debt-installment") return "interest-only";
  if (kind === "saving-transfer") return false;
  return true;
}

export function formatVnd(amount) {
  const value = typeof amount === "bigint" ? amount : BigInt(amount);
  const sign = value < 0n ? "−" : "";
  const digits = (value < 0n ? -value : value).toString();
  return `${sign}${digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`;
}

function formatSignedVnd(amount, positive) {
  return `${positive ? "+" : "−"}${formatVnd(amount).replace(/^−/, "")}`;
}

export function isTodayTransaction(date, todayDate) {
  return date === todayDate;
}

export function summarizeTodayCashflow(customTransactions, baseline) {
  const todayCustomEntries = customTransactions.filter((entry) =>
    isTodayTransaction(entry.date, baseline.date),
  );
  const entries = [...todayCustomEntries, ...baseline.entries];
  let inflow = 0n;
  let outflow = 0n;
  let excludedTransfers = 0n;
  for (const entry of entries) {
    const amount = parseVnd(entry.amount) ?? 0n;
    if (entry.kind === "income") inflow += amount < 0n ? -amount : amount;
    if (entry.kind === "expense") outflow += amount < 0n ? -amount : amount;
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
    asOf: todayCustomEntries.length
      ? `${baseline.date}T${todayCustomEntries[0].time}:00+07:00`
      : baseline.asOf,
  };
}

export function isEssentialCommitmentPriority(priority) {
  return priority === "essential";
}

export function recordManualValuation(valuations, symbol, priceVnd, date) {
  return { ...valuations, [symbol]: { priceVnd, date } };
}

export function applyManualValuationsToHoldings(holdings, valuations, locale = "vi") {
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
      state: "estimated",
    };
  });
}

export function calculateInvestmentAmounts({ quantity, mode, unitPrice, gross, fee = "0" }) {
  const quantityMillis = parseScaledDecimal(quantity, 3);
  const feeVnd = parseVnd(fee);
  if (quantityMillis === null || quantityMillis <= 0n || feeVnd === null || feeVnd < 0n) {
    return { ok: false, error: "invalid-input" };
  }
  if (mode === "unit") {
    const unitPriceVnd = parseVnd(unitPrice);
    if (unitPriceVnd === null || unitPriceVnd <= 0n)
      return { ok: false, error: "invalid-unit-price" };
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

export function formatUnitPrice(unitPriceMilliVnd) {
  const whole = unitPriceMilliVnd / 1000n;
  const fraction = (unitPriceMilliVnd % 1000n).toString().padStart(3, "0").replace(/0+$/, "");
  return fraction ? `${formatVnd(whole).replace(" ₫", "")},${fraction} ₫` : formatVnd(whole);
}

export function calculateRecoverableValue(principalInput, probabilityInput) {
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

export function buildReceivableDraft(principalInput, probabilityInput) {
  const result = calculateRecoverableValue(principalInput, probabilityInput);
  if (!result.ok) return { ...result, preview: "—" };
  return { ...result, preview: formatVnd(result.estimatedRecoverable) };
}

export function investmentActivityEffect(kind) {
  const effects = {
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
};

export function fixtureNetWorth(fixture = financialFixture) {
  return (
    fixture.cashAccountsVnd +
    fixture.portfolioVnd +
    fixture.recoverableReceivablesVnd -
    fixture.liabilitiesVnd
  );
}

export function fixtureMonthlyPnl(fixture = financialFixture) {
  return fixture.monthlyIncomeVnd - fixture.monthlyExpensesVnd;
}

export function fixtureBridgeEnding(fixture = financialFixture) {
  return fixture.openingNetWorthVnd + fixtureMonthlyPnl(fixture) + fixture.monthlyMarketMovementVnd;
}

export const todayCashflowSummary = {
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
      titleVi: "WinMart — Thực phẩm gia đình",
      titleEn: "WinMart — Groceries",
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

export const derivedValues = {
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

export const fixedCommitments = [
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

export const investmentHoldings = [
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
    assetLabelEn: "Brokerage cash (Linked — no double-count)",
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

export const investmentActivities = [
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

export const debtObligations = [
  {
    id: "obl-vib-loan",
    direction: "payable",
    counterpartyVi: "Ngân hàng VIB — Vay mua xe",
    counterpartyEn: "VIB Bank — Auto loan",
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

export const reviewRecords = [
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

export function recordsForBucket(bucket) {
  return reviewRecords.filter((record) => record.bucket === bucket);
}

export function resolveView(hashView, storedView) {
  if (prototypeViews.includes(hashView)) return hashView;
  if ([...prototypeViews, "more"].includes(storedView)) return storedView;
  return "home";
}

export function shouldOpenGlobalSearch(dialogOpen) {
  return !dialogOpen;
}

export function returnFocusId(dialog, surface) {
  if (dialog === "explain") return `explain-${surface}`;
  if (dialog === "commitment-add") return `open-commitment-${surface || "main"}`;
  if (dialog === "investment-add") return `open-investment-${surface || "main"}`;
  if (dialog === "debt-add") return `open-debt-${surface || "main"}`;
  return surface === "mobile" ? "mobile-quick-add" : "top-quick-add";
}

export function mobileTopbarMinHeight(safeAreaTop, controlHeight = 44, verticalPadding = 16) {
  return safeAreaTop + controlHeight + verticalPadding;
}
