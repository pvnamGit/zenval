/* Zenval standalone prototype. No framework, build step, or financial side effects. */
import {
  applyManualValuationsToHoldings,
  buildReceivableDraft,
  calculateInvestmentAmounts,
  commitmentPnlImpact,
  debtObligations,
  derivedValues,
  escapeHtml,
  financialStates,
  fixedCommitments,
  formatUnitPrice,
  formatVnd,
  investmentActivities,
  investmentActivityEffect,
  investmentHoldings,
  isEssentialCommitmentPriority,
  isTodayTransaction,
  parseVnd,
  prototypeViews,
  recordManualValuation,
  recordsForBucket,
  resolveView,
  returnFocusId,
  shouldOpenGlobalSearch,
  summarizeTodayCashflow,
  todayCashflowSummary,
} from "./model.mjs?v=2026-11-03-1";

(() => {
  const root = document.querySelector("#app");
  const stored = (key, fallback) => {
    try {
      return localStorage.getItem(`zenval-design:${key}`) || fallback;
    } catch {
      return fallback;
    }
  };
  const persist = (key, value) => {
    try {
      localStorage.setItem(`zenval-design:${key}`, value);
    } catch {
      // Private browsing may disable storage; the prototype remains usable in memory.
    }
  };

  const copy = {
    vi: {
      skip: "Bỏ qua đến nội dung chính",
      home: "Hôm nay",
      review: "Cần xem lại",
      transactions: "Giao dịch",
      accounts: "Tài khoản",
      investments: "Đầu tư",
      debts: "Công nợ & Phải thu",
      plan: "Kế hoạch",
      reports: "Báo cáo",
      settings: "Cài đặt",
      system: "Hệ thống UI",
      more: "Thêm",
      search: "Tìm giao dịch, tài khoản, mã đầu tư, công nợ...",
      quickAdd: "Ghi giao dịch",
      greeting: "Chào buổi sáng, Nam",
      calm: "Bức tranh tiền bạc của bạn đang ổn định.",
      date: "CHỦ NHẬT · 01 THÁNG 11, 2026",
      todaySummary: "Tổng thu / chi hôm nay",
      todayInflow: "Tổng thu hôm nay",
      todayOutflow: "Tổng chi hôm nay",
      todayNet: "Chênh lệch ròng hôm nay",
      todayExcluded: "Không tính vào Thu/Chi (Chuyển khoản nội bộ)",
      todayRailNote:
        "Chỉ tính các khoản thu và chi đã ghi sổ hôm nay. Chuyển khoản nội bộ (2.000.000 ₫) và trả gốc nợ không làm thay đổi kết quả thu/chi.",
      todayBreakdown: "Giao dịch phát sinh trong ngày hôm nay (01/11)",
      addTodayTx: "Ghi thu/chi hôm nay",
      viewAllTx: "Mở sổ giao dịch",
      homeSubAll: "Toàn bộ tổng quan",
      homeSubToday: "Hôm nay: Thu/chi & STS",
      homeSubPicture: "Bức tranh: Tài sản ròng",
      homeSubPlan: "Kế hoạch: Mục tiêu & Gợi ý",
      safe: "Có thể chi an toàn",
      estimate: "Ước tính",
      nextIncome: "đến kỳ thu nhập tiếp theo · 14 ngày",
      updated: "Cập nhật 08:30 hôm nay",
      explain: "Xem cách tính",
      cashFlow: "Dòng tiền 30 ngày",
      base: "Kịch bản cơ sở",
      low: "Điểm thấp nhất dự kiến",
      confidence: "Độ tin cậy: Trung bình",
      due: "Sắp đến hạn & Cam kết tháng",
      seeAll: "Quản lý cam kết",
      rent: "Tiền thuê nhà",
      internet: "Internet",
      loan: "Khoản vay ngân hàng",
      reviewCount: "3 mục cần bạn xác nhận",
      noCritical: "Không có mục khẩn cấp quá hạn.",
      reviewNow: "Xem lại ngay",
      netWorth: "Tài sản ròng",
      monthChange: "+2,4% tháng này (+6.800.000 ₫)",
      assets: "Tài sản & Đầu tư",
      receivablesNet: "Giá trị dự kiến thu hồi",
      liabilities: "Nghĩa vụ nợ",
      nwBridgeTitle: "Giải thích thay đổi tài sản ròng tháng này",
      source: "Nguồn & độ mới",
      liquid: "Tiền khả dụng",
      inflow: "Thu dự kiến (thận trọng)",
      commitments: "Cam kết & nghĩa vụ",
      buffer: "Khoản đệm tối thiểu",
      horizon: "Phạm vi: đến 15/11/2026",
      version: "Công thức STS v1.0 · Dữ liệu 08:30",
      forecastNote: "Dự báo không phải cam kết. Bạn có thể xem và đổi từng giả định.",
      close: "Đóng",
      reviewTitle: "Hộp thư Cần xem lại (To Review)",
      reviewSubtitle:
        "Xác nhận các mục chuyển khoản, nghi trùng hoặc lệch cam kết trước khi khóa sổ.",
      transferCandidate: "Có thể là chuyển khoản",
      transferHelp: "Giữa hai tài khoản của bạn — không phải thu nhập hay chi tiêu.",
      duplicate: "Có thể trùng lặp",
      duplicateHelp: "Hai giao dịch cùng số tiền và thời điểm gần nhau.",
      variance: "Khác cam kết dự kiến",
      varianceHelp: "Khoản trả ngân hàng cao hơn dự kiến 120.000 ₫.",
      confirmTransfer: "Xác nhận chuyển khoản",
      inspect: "Kiểm tra",
      pending: "Chờ xác nhận",
      posted: "Đã ghi sổ",
      forecast: "Dự báo",
      all: "Tất cả",
      expected: "Dự kiến",
      transactionSubtitle:
        "Sổ giao dịch, cấu hình khoản thu/chi cố định hàng tháng và lịch sử nhập dữ liệu.",
      txTabLedger: "Giao dịch",
      txTabCommitments: "Chi phí cố định, định kỳ & hóa đơn",
      txTabImports: "Lịch sử nhập (CSV/XLSX)",
      commitmentsTitle: "Khoản thu/chi cố định & Cam kết hàng tháng",
      commitmentsDesc:
        "Thiết lập các khoản thu định kỳ (lương, phụ cấp) và khoản chi cố định phải dành tiền trước (tiền nhà, hóa đơn, trả góp, tiết kiệm).",
      createCommitmentBtn: "+ Tạo khoản cố định hàng tháng",
      recurringInflowLabel: "Tổng thu cố định dự kiến/tháng",
      monthlyBaselineLabel: "Tổng cam kết chi & nghĩa vụ/tháng",
      paidThisMonthLabel: "Đã thanh toán kỳ này",
      remainingReservedLabel: "Còn phải giữ trước (Trừ vào STS)",
      filterAllCommitments: "Tất cả khoản định kỳ",
      filterInflows: "Khoản thu cố định",
      filterOutflows: "Chi phí & Trả góp cố định",
      filterTransfers: "Trích lập tiết kiệm",
      accountTitle: "Tài khoản & Đối chiếu",
      accountSubtitle:
        "Quản lý tiền mặt, ngân hàng, ví điện tử, tiền gửi tiết kiệm và đối chiếu sao kê.",
      accTabCash: "Tiền mặt / Ngân hàng / Ví",
      accTabSavings: "Tiết kiệm & Tiền gửi",
      accTabReconcile: "Đối chiếu số dư",
      totalAssets: "Tổng tiền & tiền gửi thanh khoản",
      everyday: "Tài khoản thanh toán",
      savings: "Tiết kiệm có kỳ hạn",
      wallet: "Ví điện tử",
      reconciled: "Đã đối chiếu",
      manual: "Nhập thủ công",
      investmentsTitle: "Danh mục Đầu tư",
      investmentsSubtitle:
        "Theo dõi cổ phiếu, chứng chỉ quỹ, vàng, tiền mặt chứng khoán với giá vốn bình quân và nguồn giá minh bạch.",
      invTabHoldings: "Danh mục & Tài sản (Holdings)",
      invTabActivity: "Nhật ký giao dịch & Quyền (Activity)",
      invTabPerformance: "Hiệu suất & Phân bổ",
      logInvestmentBtn: "+ Ghi nhật ký đầu tư / Thêm mã",
      debtsTitle: "Công nợ & Khoản phải thu",
      debtsSubtitle:
        "Quản lý khoản vay phải trả, khoản cho vay phải thu (tách Gốc – Lãi – Phí) và mô phỏng lộ trình sạch nợ.",
      debtTabPayables: "Khoản phải trả",
      debtTabReceivables: "Khoản phải thu",
      debtTabSimulation: "Lộ trình & Mô phỏng trả nợ",
      addDebtBtn: "+ Thêm khoản vay / phải thu",
      planTitle: "Kế hoạch, Mục tiêu & Gợi ý",
      planSubtitle:
        "Giữ đủ cho nghĩa vụ cố định trước khi phân bổ chi linh hoạt, mục tiêu dài hạn và xem gợi ý kiểm chứng.",
      planTabSts: "Chi an toàn & Kế hoạch chi",
      planTabGoals: "Mục tiêu tài chính (Goals)",
      planTabForecast: "Dự báo dòng tiền (Forecast)",
      planTabSuggestions: "Gợi ý kiểm chứng (Suggestions)",
      reserved: "Đã dành cho cam kết",
      flexible: "Chi linh hoạt còn lại",
      reportsTitle: "Báo cáo & Đóng sổ tháng",
      reportsSubtitle:
        "Báo cáo Thu/Chi (loại trừ chuyển khoản & gốc nợ), cầu nối Tài sản ròng và quy trình đóng sổ tháng.",
      repTabPnl: "Thu/Chi & Dòng tiền",
      repTabBridge: "Tài sản ròng & Cầu nối",
      repTabClose: "Đóng sổ tháng",
      settingsTitle: "Cài đặt & Quyền dữ liệu",
      settingsSubtitle:
        "Hồ sơ, danh mục, nguồn nhập liệu, quyền riêng tư (xuất/xóa dữ liệu) và nhật ký kiểm toán.",
      setTabProfile: "Hồ sơ, Ngôn ngữ & Tiền tệ",
      setTabCategories: "Danh mục & Quy tắc",
      setTabSources: "Nguồn dữ liệu & Import",
      setTabPrivacy: "Quyền riêng tư, Xuất & Xóa",
      setTabSecurity: "Bảo mật & Nhật ký kiểm toán",
      foundation: "Nền tảng giao diện",
      foundationSubtitle: "Token và component cho trải nghiệm bình tĩnh, rõ ràng.",
      colors: "Màu sắc",
      typography: "Kiểu chữ",
      components: "Component cốt lõi",
      states: "Trạng thái dữ liệu",
      complete: "Đầy đủ",
      stale: "Cũ",
      missing: "Thiếu dữ liệu",
      offline: "Ngoại tuyến",
      addTitle: "Ghi giao dịch",
      expense: "Chi tiêu",
      income: "Thu nhập",
      transfer: "Chuyển khoản",
      amount: "Số tiền",
      account: "Tài khoản",
      category: "Danh mục",
      note: "Ghi chú (không bắt buộc)",
      from: "Từ tài khoản",
      to: "Đến tài khoản",
      saveDraft: "Lưu bản nháp",
      save: "Lưu giao dịch",
      transferRail: "Chuyển khoản không được tính là thu nhập hoặc chi tiêu.",
      prototypeNotice: "Bản mẫu chỉ mô phỏng — không có giao dịch tài chính nào được thực hiện.",
      savedFeedback: "Đã mô phỏng lưu thành công trong phiên làm việc.",
      moreSubtitle: "Truy cập đầy đủ các phân hệ theo kiến trúc thông tin (IA) của Zenval.",
      appearance: "Giao diện",
      language: "Ngôn ngữ",
      light: "Sáng",
      dark: "Tối",
      privacy: "Quyền riêng tư, xuất dữ liệu và bảo mật",
      reportDesc: "Tài sản ròng, dòng tiền, P&L và đóng sổ tháng",
      personal: "Không gian cá nhân · VND",
    },
    en: {
      skip: "Skip to main content",
      home: "Today",
      review: "To review",
      transactions: "Transactions",
      accounts: "Accounts",
      investments: "Investments",
      debts: "Debts & Receivables",
      plan: "Plan",
      reports: "Reports",
      settings: "Settings",
      system: "UI system",
      more: "More",
      search: "Search transactions, accounts, holdings, debts...",
      quickAdd: "Add transaction",
      greeting: "Good morning, Nam",
      calm: "Your money picture looks steady today.",
      date: "SUNDAY · NOVEMBER 01, 2026",
      todaySummary: "Today's inflow & outflow",
      todayInflow: "Today's total inflow",
      todayOutflow: "Today's total outflow",
      todayNet: "Today's net cash flow",
      todayExcluded: "Excluded from P&L (Internal transfers)",
      todayRailNote:
        "Counts only posted income/expense today. Internal transfers (2,000,000 ₫) and debt principal never distort P&L.",
      todayBreakdown: "Today's activity breakdown (Nov 01)",
      addTodayTx: "Log today's item",
      viewAllTx: "Open ledger",
      homeSubAll: "Full overview",
      homeSubToday: "Today: P&L & STS",
      homeSubPicture: "Picture: Net worth",
      homeSubPlan: "Plan: Goals & Suggestions",
      safe: "Safe to spend",
      estimate: "Estimate",
      nextIncome: "until your next income · 14 days",
      updated: "Updated 08:30 today",
      explain: "See calculation",
      cashFlow: "30-day cash flow",
      base: "Base scenario",
      low: "Projected low point",
      confidence: "Confidence: Medium",
      due: "Due soon & Monthly commitments",
      seeAll: "Manage commitments",
      rent: "Home rent",
      internet: "Internet",
      loan: "Bank loan",
      reviewCount: "3 items need your confirmation",
      noCritical: "No overdue critical items.",
      reviewNow: "Review now",
      netWorth: "Net worth",
      monthChange: "+2.4% this month (+6,800,000 ₫)",
      assets: "Assets & Investments",
      receivablesNet: "Recoverable receivables (ERV)",
      liabilities: "Liabilities",
      nwBridgeTitle: "This month's net-worth change explanation",
      source: "Source & freshness",
      liquid: "Eligible liquid cash",
      inflow: "Expected income (conservative)",
      commitments: "Commitments & obligations",
      buffer: "Minimum cash buffer",
      horizon: "Horizon: until Nov 15, 2026",
      version: "STS formula v1.0 · Data at 08:30",
      forecastNote: "Forecasts are not promises. You can inspect and change every assumption.",
      close: "Close",
      reviewTitle: "To review inbox",
      reviewSubtitle:
        "Confirm transfer candidates, duplicates, and commitment variances before closing.",
      transferCandidate: "Possible transfer",
      transferHelp: "Between two of your accounts — not income or expense.",
      duplicate: "Possible duplicate",
      duplicateHelp: "Two transactions have the same amount and nearby times.",
      variance: "Different from commitment",
      varianceHelp: "The bank payment is 120,000 ₫ above the expected amount.",
      confirmTransfer: "Confirm transfer",
      inspect: "Inspect",
      pending: "Pending review",
      posted: "Posted",
      forecast: "Forecast",
      all: "All",
      expected: "Expected",
      transactionSubtitle:
        "Transaction ledger, monthly fixed income/expense commitments, and import history.",
      txTabLedger: "Transactions",
      txTabCommitments: "Fixed commitments, recurring & bills",
      txTabImports: "Import history (CSV/XLSX)",
      commitmentsTitle: "Monthly Fixed Income & Expense Commitments",
      commitmentsDesc:
        "Configure recurring monthly income (salary, retainers) and fixed expenses reserved upfront (rent, bills, loan installments, savings).",
      createCommitmentBtn: "+ Create monthly fixed item",
      recurringInflowLabel: "Expected monthly recurring inflow",
      monthlyBaselineLabel: "Monthly committed outflow baseline",
      paidThisMonthLabel: "Paid this cycle",
      remainingReservedLabel: "Remaining reserved (Deducted from STS)",
      filterAllCommitments: "All recurring items",
      filterInflows: "Fixed inflows",
      filterOutflows: "Fixed expenses & loans",
      filterTransfers: "Savings transfers",
      accountTitle: "Accounts & Reconciliation",
      accountSubtitle:
        "Manage cash, bank accounts, e-wallets, term deposits, and statement reconciliation.",
      accTabCash: "Cash / bank / e-wallet",
      accTabSavings: "Savings / deposits",
      accTabReconcile: "Reconciliation",
      totalAssets: "Total liquid cash & deposits",
      everyday: "Everyday account",
      savings: "Term deposit",
      wallet: "E-wallet",
      reconciled: "Reconciled",
      manual: "Manual",
      investmentsTitle: "Investment Portfolios",
      investmentsSubtitle:
        "Track equities, mutual funds, gold, and brokerage cash with weighted-average cost basis and price provenance.",
      invTabHoldings: "Portfolios / holdings",
      invTabActivity: "Activity / corporate actions",
      invTabPerformance: "Performance / allocation",
      logInvestmentBtn: "+ Log investment / holding",
      debtsTitle: "Debts & Receivables",
      debtsSubtitle:
        "Track payables and receivables with Principal–Interest–Fee splits, recoverable value, and payoff simulation.",
      debtTabPayables: "Payables",
      debtTabReceivables: "Receivables",
      debtTabSimulation: "Timeline / simulation",
      addDebtBtn: "+ Add payable / receivable",
      planTitle: "Plan, Goals & Suggestions",
      planSubtitle:
        "Reserve fixed obligations before planning flexible spending, financial goals, and explainable suggestions.",
      planTabSts: "Safe-to-spend / spending plan",
      planTabGoals: "Goals",
      planTabForecast: "Forecast",
      planTabSuggestions: "Suggestions",
      reserved: "Reserved for commitments",
      flexible: "Flexible spending left",
      reportsTitle: "Reports & Monthly Close",
      reportsSubtitle:
        "Income/expense reports (excluding transfers & principal), net-worth bridge, and monthly close.",
      repTabPnl: "P&L & Cash flow",
      repTabBridge: "Net-worth bridge",
      repTabClose: "Monthly close",
      settingsTitle: "Settings & Data Rights",
      settingsSubtitle:
        "Profile, localized categories, import sources, privacy center (export/delete), and immutable audit log.",
      setTabProfile: "Profile, locale, currency",
      setTabCategories: "Categories & rules",
      setTabSources: "Data sources / import",
      setTabPrivacy: "Privacy, export, delete",
      setTabSecurity: "Security & audit log",
      foundation: "Interface foundation",
      foundationSubtitle: "Tokens and components for a calm, clear experience.",
      colors: "Color",
      typography: "Typography",
      components: "Core components",
      states: "Data states",
      complete: "Complete",
      stale: "Stale",
      missing: "Missing data",
      offline: "Offline",
      addTitle: "Add transaction",
      expense: "Expense",
      income: "Income",
      transfer: "Transfer",
      amount: "Amount",
      account: "Account",
      category: "Category",
      note: "Note (optional)",
      from: "From account",
      to: "To account",
      saveDraft: "Save draft",
      save: "Save transaction",
      transferRail: "Transfers are not counted as income or expense.",
      prototypeNotice: "Prototype only — no financial transaction will be executed.",
      savedFeedback: "Simulated save completed in this session.",
      moreSubtitle: "Access all modules across Zenval's Information Architecture.",
      appearance: "Appearance",
      language: "Language",
      light: "Light",
      dark: "Dark",
      privacy: "Privacy, data export, and security",
      reportDesc: "Net worth, cash flow, P&L, and monthly close",
      personal: "Personal workspace · VND",
    },
  };

  const state = {
    locale: stored("locale", "vi") === "en" ? "en" : "vi",
    theme: stored("theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    view: resolveView(location.hash.slice(1), stored("view", "home")),
    homeSub: "all",
    reviewBucket: "review",
    txSub: "ledger",
    commitmentFilter: "all",
    commitmentDirection: "outflow",
    accSub: "cashBank",
    invSub: "holdings",
    invActivityType: "buy",
    debtSub: "payables",
    debtDirection: "payable",
    simExtra: "2000k",
    planSub: "sts",
    forecastScenario: "base",
    repSub: "pnlCashflow",
    setSub: "profile",
    transactionType: "expense",
    dialog: null,
    derivedKey: "safeToSpend",
    returnFocusId: null,
    toast: null,
    customCommitments: [],
    customHoldings: [],
    customActivities: [],
    customDebts: [],
    customTransactions: [],
    customValuations: {},
    investmentEntryMode: "unit",
    formDrafts: {},
    notificationSettings: {
      debtReminder: true,
      debtLeadDays: "7,3,1,0",
      dailyCapture: true,
      dailyCaptureTime: "21:00",
      channel: "in-app-email",
    },
  };

  const escapeAttr = escapeHtml;
  const draft = (id, fallback = "") => escapeAttr(state.formDrafts[id] ?? fallback);
  const selected = (id, value) => (state.formDrafts[id] === value ? "selected" : "");
  const signedVnd = (amount, positive) =>
    `${positive ? "+" : "−"}${formatVnd(amount).replace(/^−/, "")}`;

  function currentTodaySummary() {
    return summarizeTodayCashflow(state.customTransactions, {
      ...todayCashflowSummary,
      asOf: derivedValues.todayCashflow.asOf,
    });
  }

  const icons = {
    home: '<path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6"/>',
    review: '<path d="M6 3h12l2 4v13H4V7l2-4ZM4 8h5l1.5 3h3L15 8h5"/>',
    arrows: '<path d="M7 7h11l-3-3m3 3-3 3m2 7H6l3 3m-3-3 3-3"/>',
    wallet:
      '<path d="M3 6h15a2 2 0 0 1 2 2v10H3V6Zm0 0V5a2 2 0 0 1 2-2h12m-1 8h4v4h-4a2 2 0 0 1 0-4Z"/>',
    trend: '<path d="M3 17 9 11l4 4 8-8M14 7h7v7"/>',
    scale: '<path d="M12 3v18M5 7h14M5 7l-3 6h6L5 7Zm14 0-3 6h6l-3-6Z"/>',
    plan: '<path d="M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h5"/>',
    layers: '<path d="m12 3-9 5 9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
    chart: '<path d="M4 19V5m0 14h16M7 15l4-4 3 2 5-7"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    moon: '<path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    shield: '<path d="M12 3 4 7v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V7l-8-4Z"/>',
  };
  const icon = (name) =>
    `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24">${icons[name] || icons.info}</svg>`;
  const t = (key) => copy[state.locale][key] ?? key;
  const vi = () => state.locale === "vi";
  const status = (kind) => {
    const item = financialStates[kind] || financialStates.estimated;
    return `<span class="status ${item.className}" data-financial-state="${kind}"><i></i>${t(item.key)}</span>`;
  };
  const derivedAttrs = (key) => {
    const value = derivedValues[key];
    const sourceIds =
      key === "todayCashflow"
        ? currentTodaySummary().entries.map((entry) => entry.id)
        : value.sourceIds;
    const asOf = key === "todayCashflow" ? currentTodaySummary().asOf : value.asOf;
    return `data-derived-value="${key}" data-source-ids="${sourceIds.join(" ")}" data-as-of="${asOf}" data-version="${value.calculationVersion}" data-horizon-end="${value.horizonEnd}"`;
  };
  const heading = (title, subtitle, eyebrow = "", actionHtml = "") => `
    <header class="page-heading page-heading-bar">
      <div>${eyebrow && !eyebrow.startsWith("IA ·") ? `<p class="eyebrow">${eyebrow}</p>` : ""}<h1>${title}</h1><p>${subtitle}</p></div>
      ${actionHtml ? `<div class="heading-actions">${actionHtml}</div>` : ""}
    </header>`;

  function shell() {
    const primaryNav = [
      ["home", "home"],
      ["review", "review"],
      ["transactions", "arrows"],
      ["accounts", "wallet"],
      ["investments", "trend"],
      ["debts", "scale"],
      ["plan", "plan"],
      ["reports", "chart"],
    ];
    const bottomNav = [["settings", "settings"]];
    return `
      <div class="app-shell">
        <aside class="sidebar" ${state.dialog ? "inert" : ""} aria-label="${vi() ? "Điều hướng chính" : "Main navigation"}">
          <button class="brand" data-view="home" aria-label="Zenval home"><span class="brand-mark">Z</span><span>ZENVAL</span></button>
          <nav class="side-nav">${primaryNav.map(([id, ico]) => navButton(id, ico)).join("")}</nav>
          <div class="sidebar-bottom">
            ${bottomNav.map(([id, ico]) => navButton(id, ico)).join("")}
            <div class="user-card"><span class="avatar">NV</span><span><strong>Nam Vu</strong><small>${t("personal")}</small></span></div>
          </div>
        </aside>
        <div class="app-main" ${state.dialog ? "inert" : ""}>
          <header class="topbar">
            <button class="mobile-brand" data-view="home" aria-label="Zenval home"><span class="brand-mark">Z</span><span>ZENVAL</span></button>
            <label class="search-box">${icon("search")}<span class="sr-only">${t("search")}</span><input type="search" placeholder="${t("search")}"/><kbd>⌘ K</kbd></label>
            <div class="top-actions">${localeControl()}<button class="icon-button" data-action="theme" aria-label="${state.theme === "light" ? t("dark") : t("light")}">${icon(state.theme === "light" ? "moon" : "sun")}</button>
              <button class="primary-button quick-add" id="top-quick-add" data-action="quick-add" data-surface="top">${icon("plus")}<span>${t("quickAdd")}</span></button>
            </div>
          </header>
          <main class="content" id="main-content" tabindex="-1">${renderView()}</main>
        </div>
        <nav class="mobile-nav" ${state.dialog ? "inert" : ""} aria-label="${vi() ? "Điều hướng di động" : "Mobile navigation"}">
          ${mobileButton("home", "home")}${mobileButton("transactions", "arrows", "3")}
          <button class="mobile-add" id="mobile-quick-add" data-action="quick-add" data-surface="mobile" aria-label="${t("quickAdd")}">${icon("plus")}</button>
          ${mobileButton("plan", "plan")}${mobileButton("more", "more")}
        </nav>
        ${state.dialog ? renderDialog() : ""}${state.toast ? `<div class="toast" role="status">${icon("check")}${state.toast}</div>` : ""}
      </div>`;
  }

  function navButton(id, ico) {
    return `<button class="nav-item ${state.view === id ? "active" : ""}" data-view="${id}" ${state.view === id ? 'aria-current="page"' : ""}>${icon(ico)}<span>${t(id)}</span>${id === "review" ? '<b class="nav-badge">3</b>' : ""}</button>`;
  }
  function mobileButton(id, ico, badge = "") {
    const label = id === "more" ? t("more") : t(id);
    return `<button class="${state.view === id ? "active" : ""}" data-view="${id}"><span class="mobile-icon-wrap">${icon(ico)}${badge ? `<i>${badge}</i>` : ""}</span><span>${label}</span></button>`;
  }
  function localeControl() {
    return `<div class="segmented compact" aria-label="${t("language")}">${["vi", "en"].map((locale) => `<button class="${state.locale === locale ? "selected" : ""}" data-locale="${locale}" aria-pressed="${state.locale === locale}">${locale.toUpperCase()}</button>`).join("")}</div>`;
  }
  function subNav(items, active, action) {
    return `<nav class="subnav-bar" aria-label="${vi() ? "Điều hướng phân mục" : "Section navigation"}">${items
      .map(
        ([val, label, badge]) =>
          `<button class="subnav-pill ${active === val ? "active" : ""}" data-action="${action}" data-value="${val}" ${active === val ? 'aria-current="true"' : ""}>${label}${badge ? `<span class="pill-badge">${badge}</span>` : ""}</button>`,
      )
      .join("")}</nav>`;
  }

  function renderView() {
    switch (state.view) {
      case "review":
        return reviewView();
      case "transactions":
        return transactionsView();
      case "accounts":
        return accountsView();
      case "investments":
        return investmentsView();
      case "debts":
        return debtsView();
      case "plan":
        return planView();
      case "reports":
        return reportsView();
      case "settings":
        return settingsView();
      case "system":
        return systemView();
      case "auth":
        return authView();
      case "more":
        return moreView();
      default:
        return homeView();
    }
  }

  /* ==========================================================================
   * 1. HOME VIEW (#home) — First dashboard has Today's Inflow/Outflow + IA sections
   * ========================================================================== */
  function homeView() {
    const todaySummary = currentTodaySummary();
    const subItems = [
      ["all", t("homeSubAll")],
      ["today", t("homeSubToday")],
      ["picture", t("homeSubPicture")],
      ["planSummary", t("homeSubPlan")],
    ];
    const showToday = state.homeSub === "all" || state.homeSub === "today";
    const showPicture = state.homeSub === "all" || state.homeSub === "picture";
    const showPlan = state.homeSub === "all" || state.homeSub === "planSummary";

    return `${heading(
      t("greeting"),
      t("calm"),
      t("date"),
      `<button class="secondary-button" id="open-commitment-home" data-action="open-commitments">${icon("calendar")}<span>${vi() ? "Khoản cố định tháng" : "Monthly commitments"}</span></button>
       <button class="secondary-button" id="open-investment-home" data-view="investments">${icon("trend")}<span>${t("investments")}</span></button>`,
    )}
    ${subNav(subItems, state.homeSub, "home-sub")}
    <section class="dashboard-grid" aria-label="${vi() ? "Tổng quan tài chính" : "Financial overview"}">
      ${
        showToday
          ? `
      <!-- FIRST DASHBOARD ON #HOME: TODAY'S INFLOW & OUTFLOW SUMMARY -->
      <article class="card today-flow-card" id="home-today-cashflow" ${derivedAttrs("todayCashflow")}>
        <div class="card-top">
          <div>
            <span class="card-label">${t("todaySummary")} · 01/11/2026</span>
            ${status("posted")}
          </div>
          <div class="card-top-actions">
            <button class="secondary-button compact-btn" data-action="quick-add" data-surface="top">${icon("plus")}<span>${t("addTodayTx")}</span></button>
            <button class="icon-button subtle" id="explain-today" data-action="explain" data-derived="todayCashflow" data-surface="today" aria-label="${t("explain")}">${icon("info")}</button>
          </div>
        </div>
        <div class="today-kpi-grid">
          <div class="today-kpi inflow-box" data-today-metric="inflow">
            <span class="kpi-label">${t("todayInflow")}</span>
            <strong class="kpi-amount positive-text">${todaySummary.inflowDisplay}</strong>
            <small>${vi() ? "Các khoản thu đã ghi trong phiên" : "Income items logged in this session"}</small>
          </div>
          <div class="today-kpi outflow-box" data-today-metric="outflow">
            <span class="kpi-label">${t("todayOutflow")}</span>
            <strong class="kpi-amount negative-text">${todaySummary.outflowDisplay}</strong>
            <small>${vi() ? "Các khoản chi đã ghi trong phiên" : "Expense items logged in this session"}</small>
          </div>
          <div class="today-kpi net-box" data-today-metric="net">
            <span class="kpi-label">${t("todayNet")}</span>
            <strong class="kpi-amount accent-text">${todaySummary.netDisplay}</strong>
            <small>${vi() ? "Cập nhật 12:15 · Đã đối chiếu" : "Updated 12:15 · Reconciled"}</small>
          </div>
          <div class="today-kpi excluded-box" data-pnl-impact="false">
            <span class="kpi-label">${t("todayExcluded")}</span>
            <strong class="kpi-amount">${todaySummary.excludedTransferDisplay}</strong>
            <small>${vi() ? "VCB → MoMo · Không tính là thu/chi" : "VCB → MoMo · Not P&L"}</small>
          </div>
        </div>
        <div class="today-entries-wrap">
          <div class="section-title">
            <h3>${t("todayBreakdown")}</h3>
            <button class="text-button" data-view="transactions">${t("viewAllTx")}${icon("chevron")}</button>
          </div>
          <div class="today-entry-list">
            ${todaySummary.entries
              .map(
                (entry) => `
              <div class="today-entry-row" data-record-kind="${entry.kind}" data-pnl-impact="${entry.pnlImpact}">
                <span class="entry-time">${entry.time}</span>
                <div class="entry-main">
                  <strong>${vi() ? entry.titleVi : entry.titleEn}</strong>
                  <small>${entry.account} · ${vi() ? entry.categoryVi : entry.categoryEn}</small>
                </div>
                ${status(entry.state)}
                <strong class="entry-amount ${entry.kind === "income" ? "positive-text" : entry.kind === "expense" ? "negative-text" : ""}">${entry.amount}</strong>
              </div>`,
              )
              .join("")}
          </div>
        </div>
        <footer class="safe-footer">
          <span>${icon("info")}${t("todayRailNote")}</span>
          <button class="text-button" id="explain-today-footer" data-action="explain" data-derived="todayCashflow" data-surface="today-footer">${t("explain")}${icon("chevron")}</button>
        </footer>
      </article>

      <article class="card safe-card" ${derivedAttrs("safeToSpend")}>
        <div class="card-top"><div><span class="card-label">${t("safe")}</span>${status("estimated")}</div><button class="icon-button subtle" id="explain-safe" data-action="explain" data-derived="safeToSpend" data-surface="safe" aria-label="${t("explain")}">${icon("info")}</button></div>
        <p class="hero-amount">12.400.000 <small>₫</small></p><p class="muted">${t("nextIncome")}</p>
        <div class="mini-breakdown">
          <span><small>${vi() ? "Tiền khả dụng" : "Liquid cash"}</small><strong>24,95tr ₫</strong></span>
          <span><small>${vi() ? "Thu dự kiến thận trọng" : "Conservative inflows"}</small><strong>+12,2tr ₫</strong></span>
          <span><small>${vi() ? "Cam kết trong kỳ" : "Committed outflows"}</small><strong>−19,75tr ₫</strong></span>
          <span><small>${vi() ? "Đệm an toàn" : "Safety buffer"}</small><strong>−5,0tr ₫</strong></span>
        </div>
        <footer class="safe-footer"><span>${icon("clock")}${t("updated")}</span><button class="text-button" id="explain-safe-footer" data-action="explain" data-derived="safeToSpend" data-surface="safe-footer">${t("explain")}${icon("chevron")}</button></footer>
      </article>

      <article class="card flow-card" ${derivedAttrs("cashFlow")}>
        <div class="card-top"><div><span class="card-label">${t("cashFlow")}</span>${status("forecast")}</div><button class="icon-button subtle" id="explain-cashflow" data-action="explain" data-derived="cashFlow" data-surface="cashflow" aria-label="${t("explain")}">${icon("info")}</button></div>
        <div class="chart-wrap"><svg class="line-chart" viewBox="0 0 500 150" preserveAspectRatio="none" role="img" aria-label="${t("cashFlow")}"><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".24"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs><path class="grid-line" d="M0 30H500M0 80H500M0 130H500"/><path class="area" d="M0 96C40 90 50 48 95 55s60 29 100 17 55-46 100-32 55 80 105 65 55-37 100-29v74H0Z"/><path class="chart-line" d="M0 96C40 90 50 48 95 55s60 29 100 17 55-46 100-32 55 80 105 65 55-37 100-29"/><circle cx="400" cy="105" r="5"/></svg><div class="chart-labels"><span>01/11</span><span>08/11</span><span>15/11</span><span>30/11</span></div></div>
        <footer class="chart-summary"><span>${t("low")}<strong>8.200.000 ₫</strong></span><b>${t("confidence")}</b></footer>
      </article>

      <article class="card due-card">
        <div class="section-title">
          <h2>${t("due")}</h2>
          <div class="inline-actions">
            <button class="text-button" id="open-commitment-due" data-action="commitment-add" data-surface="due">${t("createCommitmentBtn")}</button>
            <button class="text-button" data-action="open-commitments">${t("seeAll")}${icon("chevron")}</button>
          </div>
        </div>
        <div class="due-list">
          ${dueItem("05", "TH11", t("rent"), "8.000.000 ₫", vi() ? "Đã khớp · Chi phí cố định" : "Matched · Fixed expense")}
          ${dueItem("08", "TH11", t("internet"), "1.250.000 ₫", vi() ? "7 ngày nữa · Dung sai ±15%" : "in 7 days · Tolerance ±15%")}
          ${dueItem("12", "TH11", t("loan"), "3.500.000 ₫", vi() ? "Gốc 2,8tr không tính vào chi tiêu · Lãi 700k" : "Principal 2.8m (Non-P&L) · Interest 700k")}
          ${dueItem("15", "TH11", vi() ? "Lương chính công ty (Thu cố định)" : "Primary salary (Fixed inflow)", "+30.000.000 ₫", vi() ? "Dự kiến · Độ tin cậy 95%" : "Expected · 95% confidence")}
        </div>
      </article>

      <article class="card review-card">
        <div class="review-illustration">${icon("review")}</div>
        <div>${status("pending")}<h2>${t("reviewCount")}</h2><p>${t("noCritical")}</p></div>
        <button class="secondary-button" data-view="review">${t("reviewNow")}${icon("chevron")}</button>
      </article>`
          : ""
      }

      ${
        showPicture
          ? `
      <article class="card worth-card" ${derivedAttrs("netWorth")}>
        <div class="card-top">
          <div><span class="card-label">${t("netWorth")}</span><span class="positive">${t("monthChange")}</span></div>
          <button class="icon-button subtle" id="explain-networth" data-action="explain" data-derived="netWorth" data-surface="networth" aria-label="${t("explain")}">${icon("info")}</button>
        </div>
        <p class="large-amount">292.600.000 <small>₫</small></p>
        <div class="worth-bar" role="img" aria-label="${t("assets")} 319,6tr; ${t("receivablesNet")} 6,5tr; ${t("liabilities")} 33,5tr"><span></span><i></i></div>
        <div class="worth-legend">
          <span><i class="asset-dot"></i>${t("assets")} (Tiền 211,6tr + Đầu tư 108,0tr)<strong>319,6tr ₫</strong></span>
          <span><i class="flex-dot"></i>${t("receivablesNet")} (Gốc 10tr × 65%)<strong>6,5tr ₫</strong></span>
          <span><i class="liability-dot"></i>${t("liabilities")} (Vay VIB 30tr + Thẻ 3,5tr)<strong>−33,5tr ₫</strong></span>
        </div>
        <div class="bridge-strip">
          <strong>${t("nwBridgeTitle")}:</strong>
          <span>${vi() ? "Thặng dư thu/chi tháng" : "Monthly net P&L"}: <b>+13.625.000 ₫</b></span>
          <span>${vi() ? "Biến động giá đầu tư" : "Investment market move"}: <b>+1.625.000 ₫</b></span>
        </div>
        <footer class="safe-footer">
          <div class="inline-actions">
            <button class="secondary-button compact-btn" data-view="investments">${icon("trend")}<span>${vi() ? "Xem danh mục đầu tư (108tr)" : "View investments (108m)"}</span></button>
            <button class="secondary-button compact-btn" data-view="debts">${icon("scale")}<span>${vi() ? "Xem công nợ & phải thu" : "View debts & receivables"}</span></button>
          </div>
          <button class="text-button" data-view="reports">${vi() ? "Báo cáo cầu nối tài sản" : "Net-worth bridge report"}${icon("chevron")}</button>
        </footer>
      </article>`
          : ""
      }

      ${
        showPlan
          ? `
      <article class="card home-plan-card">
        <div class="section-title">
          <h2>${vi() ? "Kế hoạch, Mục tiêu & Gợi ý kiểm chứng" : "Plan, Goals & Explainable Suggestions"}</h2>
          <button class="text-button" data-view="plan">${vi() ? "Mở Kế hoạch" : "Open Plan"}${icon("chevron")}</button>
        </div>
        <div class="home-plan-columns">
          <div class="mini-panel">
            <h3>${vi() ? "Tiến độ mục tiêu (Goals)" : "Goals progress"}</h3>
            <p class="muted">${vi() ? "Liên kết tài khoản thật · Không tính trùng số dư" : "Linked to real accounts · Overlap guarded"}</p>
            <div class="goal-mini-row"><span>${vi() ? "Quỹ dự phòng 6 tháng" : "6-month emergency fund"}</span><strong>90tr / 120tr ₫ (75%)</strong></div>
            <div class="goal-mini-row"><span>${vi() ? "Quỹ tích sản đầu tư FPT/DCDS" : "Long-term investment goal"}</span><strong>86,8tr / 150tr ₫ (58%)</strong></div>
          </div>
          <div class="mini-panel">
            <h3>${vi() ? "Gợi ý có thể kiểm chứng (Suggestion)" : "Explainable suggestion"}</h3>
            <p class="muted">${vi() ? "Phát hiện: Dòng tiền sau ngày 16/11 dư 4,2tr trên mức đệm." : "Detection: Post-Nov 16 cash exceeds buffer by 4.2m ₫."}</p>
            <p class="muted"><strong>${vi() ? "Đề xuất:" : "Action:"}</strong> ${vi() ? "Trả thêm 2.000.000 ₫ gốc vay VIB để rút ngắn 4 tháng trả nợ (Tiết kiệm ~2,45tr lãi)." : "Add 2,000,000 ₫ extra principal to VIB loan to finish 4 months earlier."}</p>
            <button class="secondary-button compact-btn" data-action="jump-suggestions">${vi() ? "Xem bằng chứng & Tạo bản nháp" : "Inspect evidence & Draft"}</button>
          </div>
        </div>
      </article>`
          : ""
      }
    </section>`;
  }

  function dueItem(day, month, title, amount, meta) {
    return `<div class="due-item"><span class="date-tile"><strong>${day}</strong><small>${month}</small></span><span><strong>${title}</strong><small>${meta}</small></span><strong class="due-amount">${amount}</strong></div>`;
  }

  /* ==========================================================================
   * 2. TO REVIEW INBOX (#review)
   * ========================================================================== */
  function reviewView() {
    const items = recordsForBucket(state.reviewBucket);
    return `${heading(t("reviewTitle"), t("reviewSubtitle"))}${filters(["review", "pending", "posted"], state.reviewBucket, "review-filter")}
      <section class="review-list">${items.map(reviewItem).join("")}</section>`;
  }
  function reviewItem(item) {
    const configs = {
      transfer: [
        t("transferCandidate"),
        t("transferHelp"),
        "estimated",
        t("confirmTransfer"),
        "arrows",
      ],
      duplicate: [t("duplicate"), t("duplicateHelp"), "pending", t("inspect"), "info"],
      variance: [t("variance"), t("varianceHelp"), "pending", t("inspect"), "info"],
      expected: [t("base"), t("forecastNote"), "forecast", t("inspect"), "clock"],
      expense: [t("posted"), t("updated"), "posted", t("inspect"), "check"],
    };
    const [, help, kind, action, ico] = configs[item.kind];
    const name =
      item.merchant === "loan" || item.merchant === "rent" ? t(item.merchant) : item.merchant;
    return `<article class="review-item" data-record-kind="${item.kind}" ${item.kind === "transfer" ? 'data-pnl-impact="false"' : ""}><span class="review-icon">${icon(ico)}</span><div class="review-content">${status(kind)}<h2>${name}</h2><p>${help}</p></div><strong class="review-amount">${item.amount}</strong><button class="secondary-button" data-demo="${item.id}">${action}</button></article>`;
  }
  function filters(items, active, action) {
    return `<div class="filter-row">${items.map((item) => `<button class="filter ${active === item ? "active" : ""}" data-action="${action}" data-value="${item}">${t(item)}${item === "review" ? " <span>3</span>" : ""}</button>`).join("")}</div>`;
  }

  /* ==========================================================================
   * 3. TRANSACTIONS (#transactions): Ledger + Fixed Commitments + Import History
   * ========================================================================== */
  function transactionsView() {
    const tabs = [
      ["ledger", t("txTabLedger")],
      [
        "commitments",
        t("txTabCommitments"),
        String(fixedCommitments.length + state.customCommitments.length),
      ],
      ["imports", t("txTabImports"), "2"],
    ];
    return `${heading(
      t("transactions"),
      t("transactionSubtitle"),
      "IA · TRANSACTIONS",
      `<button class="secondary-button" id="open-commitment-main" data-action="commitment-add" data-surface="main">${icon("calendar")}<span>${t("createCommitmentBtn")}</span></button>
       <button class="primary-button" data-action="quick-add" data-surface="top">${icon("plus")}<span>${t("quickAdd")}</span></button>`,
    )}
    ${subNav(tabs, state.txSub, "tx-sub")}
    ${state.txSub === "commitments" ? commitmentsSection() : state.txSub === "imports" ? importsSection() : ledgerSection()}`;
  }

  function ledgerSection() {
    const rows = [
      ...state.customTransactions.map((entry) => [
        entry.titleVi,
        `${entry.categoryVi} · ${entry.date} · ${vi() ? "Vừa ghi trong phiên" : "Logged this session"} · ${entry.account}`,
        entry.amount,
        entry.state,
        String(entry.pnlImpact),
      ]),
      [
        vi() ? "Thanh toán thiết kế UI freelance" : "Freelance UI design payout",
        vi() ? "Thu nhập phụ · Hôm nay, 08:15 · VCB" : "Side income · Today, 08:15 · VCB",
        "+2.500.000 ₫",
        "posted",
        "true",
      ],
      [
        "WinMart",
        vi() ? "Ăn uống · Hôm nay, 09:42 · VCB" : "Food · Today, 09:42 · VCB",
        "−486.000 ₫",
        "posted",
        "true",
      ],
      [
        vi() ? "Grab & Cà phê sáng" : "Grab & morning coffee",
        vi() ? "Di chuyển · Hôm nay, 12:10 · MoMo" : "Transport · Today, 12:10 · MoMo",
        "−150.000 ₫",
        "posted",
        "true",
      ],
      [
        "VCB → MoMo",
        vi()
          ? "Chuyển khoản nội bộ · Không ảnh hưởng thu/chi"
          : "Internal transfer · No income/expense impact",
        "2.000.000 ₫",
        "posted",
        "false",
      ],
      [
        t("rent"),
        vi() ? "Cam kết cố định · Đến hạn 05/11" : "Fixed commitment · Due Nov 05",
        "−8.000.000 ₫",
        "pending",
        "true",
      ],
      [
        vi()
          ? "Trả góp vay VIB (Gốc 2,8tr · Lãi 700k)"
          : "VIB loan installment (Principal 2.8m · Interest 700k)",
        vi()
          ? "Dự kiến 12/11 · Chỉ 700.000 ₫ lãi tính vào chi phí P&L"
          : "Expected Nov 12 · Only 700,000 ₫ interest affects P&L",
        "−3.500.000 ₫",
        "forecast",
        "false",
      ],
    ];
    return `${filters(["all", "posted", "pending"], "all", "demo-filter")}
      <section class="review-list">${rows
        .map(
          ([name, meta, amount, kind, pnl]) =>
            `<article class="transaction-row" data-pnl-impact="${pnl}"><span class="transaction-icon">${icon("arrows")}</span><span class="transaction-copy"><strong>${name}</strong><small>${meta}</small></span>${status(kind)}<strong class="transaction-amount">${amount}</strong></article>`,
        )
        .join("")}</section>`;
  }

  function commitmentsSection() {
    const allItems = [...fixedCommitments, ...state.customCommitments];
    const filtered = allItems.filter((item) => {
      if (state.commitmentFilter === "inflow") return item.direction === "inflow";
      if (state.commitmentFilter === "outflow")
        return item.direction === "outflow" && item.kind !== "saving-transfer";
      if (state.commitmentFilter === "transfer") return item.kind === "saving-transfer";
      return true;
    });

    return `
      <section class="commitments-view" id="fixed-commitments-screen" ${derivedAttrs("commitmentBaseline")}>
        <article class="card commitment-hero">
          <div class="card-top">
            <div>
              <span class="card-label">${t("commitmentsTitle")}</span>
              ${status("estimated")}
            </div>
            <div class="inline-actions">
              <button class="primary-button" id="open-commitment-card" data-action="commitment-add" data-surface="card">${icon("plus")}<span>${t("createCommitmentBtn")}</span></button>
              <button class="icon-button subtle" id="explain-commitments" data-action="explain" data-derived="commitmentBaseline" data-surface="commitments" aria-label="${t("explain")}">${icon("info")}</button>
            </div>
          </div>
          <p class="muted">${t("commitmentsDesc")}</p>
          <div class="today-kpi-grid">
            <div class="today-kpi inflow-box">
              <span class="kpi-label">${t("recurringInflowLabel")}</span>
              <strong class="kpi-amount positive-text">+35.000.000 ₫</strong>
              <small>${vi() ? "Thận trọng đưa vào dự báo: +34.500.000 ₫" : "Conservative forecast: +34,500,000 ₫"}</small>
            </div>
            <div class="today-kpi outflow-box">
              <span class="kpi-label">${t("monthlyBaselineLabel")}</span>
              <strong class="kpi-amount">19.750.000 ₫</strong>
              <small>${vi() ? "Chi cố định 11,25tr · Trả nợ 3,5tr · Tiết kiệm 5,0tr" : "Fixed 11.25m · Debt 3.5m · Savings 5.0m"}</small>
              ${state.customCommitments.length ? `<small>${vi() ? "Bản nháp mới chưa cộng vào tổng cho đến khi được xác nhận và tách đúng ảnh hưởng thu/chi." : "New drafts are excluded from KPIs until confirmed and correctly split for P&L."}</small>` : ""}
            </div>
            <div class="today-kpi">
              <span class="kpi-label">${t("paidThisMonthLabel")}</span>
              <strong class="kpi-amount accent-text">8.000.000 ₫</strong>
              <small>${vi() ? "1/5 khoản chi đã khớp giao dịch thực tế" : "1/5 outflow items matched"}</small>
            </div>
            <div class="today-kpi excluded-box">
              <span class="kpi-label">${t("remainingReservedLabel")}</span>
              <strong class="kpi-amount negative-text">−11.750.000 ₫</strong>
              <small>${vi() ? "Đã khóa trước để bảo vệ Safe-to-spend" : "Reserved upfront in Safe-to-spend"}</small>
            </div>
          </div>
        </article>

        <div class="filter-row">
          ${[
            ["all", t("filterAllCommitments")],
            ["inflow", t("filterInflows")],
            ["outflow", t("filterOutflows")],
            ["transfer", t("filterTransfers")],
          ]
            .map(
              ([val, label]) =>
                `<button class="filter ${state.commitmentFilter === val ? "active" : ""}" data-action="commitment-filter" data-value="${val}">${label}</button>`,
            )
            .join("")}
        </div>

        <div class="review-list">
          ${filtered
            .map(
              (item) => `
            <article class="review-item commitment-row" data-commitment-kind="${item.kind}" data-direction="${item.direction}" data-pnl-impact="${item.pnlImpact}">
              <span class="date-tile"><strong>${item.dueDay}</strong><small>${vi() ? "HÀNG THÁNG" : "MONTHLY"}</small></span>
              <div class="review-content">
                <div class="badge-group">
                  ${status(item.state)}
                  <span class="tag-pill">${item.direction === "inflow" ? (vi() ? "Khoản thu cố định" : "Fixed inflow") : item.kind === "debt-installment" ? (vi() ? "Trả góp nợ (Tách Gốc/Lãi)" : "Loan split") : item.kind === "saving-transfer" ? (vi() ? "Chuyển khoản tiết kiệm · Không tính chi tiêu" : "Savings transfer (Non-P&L)") : vi() ? "Chi phí cố định" : "Fixed expense"}</span>
                  ${item.essential ? `<span class="tag-pill essential">${vi() ? "Thiết yếu" : "Essential"}</span>` : ""}
                </div>
                <h2>${vi() ? item.titleVi : item.titleEn}</h2>
                <p>${item.account} · ${vi() ? item.cadenceVi : item.cadenceEn} · ${item.tolerance}</p>
              </div>
              <strong class="review-amount ${item.direction === "inflow" ? "positive-text" : ""}">${item.amount}</strong>
              <div class="inline-actions">
                <button class="secondary-button compact-btn" data-demo="edit-occurrence-${item.id}">${vi() ? "Đổi kỳ này" : "Edit this"}</button>
                <button class="secondary-button compact-btn" data-demo="edit-future-${item.id}">${vi() ? "Từ kỳ này trở đi" : "This & future"}</button>
              </div>
            </article>`,
            )
            .join("")}
        </div>
      </section>`;
  }

  function importsSection() {
    const jobs = [
      [
        "vcb-oct-2026.csv",
        vi()
          ? "Sao kê Vietcombank · 142 dòng · Đã khớp 139, 3 vào Cần xem lại"
          : "Vietcombank CSV · 142 rows · 139 committed, 3 in To Review",
        "01/11/2026 08:10",
        "posted",
      ],
      [
        "momo-wallet-export.xlsx",
        vi()
          ? "Ví MoMo · 38 dòng · Phát hiện 4 cặp chuyển khoản & 1 nghi trùng"
          : "MoMo XLSX · 38 rows · 4 transfer pairs & 1 duplicate candidate",
        "30/10/2026 21:05",
        "posted",
      ],
    ];
    return `
      <article class="card">
        <div class="section-title">
          <div>
            <h2>${t("txTabImports")}</h2>
            <p class="muted">${vi() ? "Kiểm tra ánh xạ cột, phát hiện trùng lặp idempotent và hỗ trợ hoàn tác (Rollback window 24h)." : "Column mapping preview, idempotent duplicate detection, and 24h rollback window."}</p>
          </div>
          <button class="primary-button" data-demo="import-csv">${icon("plus")}<span>${vi() ? "Nhập CSV / XLSX" : "Import CSV / XLSX"}</span></button>
        </div>
        <div class="review-list" style="margin-top:16px">
          ${jobs
            .map(
              ([file, meta, time, st]) =>
                `<article class="transaction-row"><span class="transaction-icon">${icon("layers")}</span><span class="transaction-copy"><strong>${file}</strong><small>${meta}</small></span>${status(st)}<strong class="transaction-amount">${time}</strong></article>`,
            )
            .join("")}
        </div>
      </article>`;
  }

  /* ==========================================================================
   * 4. ACCOUNTS (#accounts): Cash/Bank/E-wallet + Savings + Reconciliation
   * ========================================================================== */
  function accountsView() {
    const tabs = [
      ["cashBank", t("accTabCash")],
      ["savings", t("accTabSavings")],
      ["reconciliation", t("accTabReconcile")],
    ];
    const cashAccounts = [
      ["everyday", "Vietcombank · •• 2486 · Thanh khoản cao", "26.480.000 ₫", "VC", "posted"],
      ["wallet", "MoMo · •• 0901 · Ví điện tử", "3.620.000 ₫", "MO", "estimated"],
      [
        vi() ? "Tiền mặt tại ví" : "Cash on hand",
        vi() ? "Nhập thủ công · Cập nhật 2 ngày trước" : "Manual · Updated 2 days ago",
        "1.500.000 ₫",
        "TM",
        "estimated",
      ],
      [
        vi() ? "Tiền mặt chờ đầu tư TCBS" : "TCBS Brokerage Cash",
        vi()
          ? "Liên kết Danh mục đầu tư · Không tính trùng vào Tài sản ròng"
          : "Linked to Portfolio · Not double-counted in Net Worth",
        "4.000.000 ₫",
        "TC",
        "posted",
      ],
    ];
    const savingsAccounts = [
      [
        "savings",
        vi()
          ? "Techcombank · Kỳ hạn 6 tháng (5,4%/năm) · Đáo hạn 15/02/2027"
          : "Techcombank · 6-month term (5.4% p.a.) · Matures Feb 15, 2027",
        "180.000.000 ₫",
        "TC",
        "posted",
      ],
    ];

    return `${heading(
      t("accountTitle"),
      t("accountSubtitle"),
      "IA · ACCOUNTS",
      `<button class="primary-button" data-demo="add-account">${icon("plus")}<span>${vi() ? "Thêm tài khoản" : "Add account"}</span></button>`,
    )}
    ${subNav(tabs, state.accSub, "acc-sub")}
    <article class="total-card"><span>${t("totalAssets")}</span><strong>211.600.000 ₫</strong><small>${vi() ? "Đã loại trừ tính trùng 4.000.000 ₫ tiền mặt chứng khoán TCBS" : "Deduplicated 4,000,000 ₫ linked TCBS brokerage cash"}</small></article>
    ${
      state.accSub === "reconciliation"
        ? reconciliationSection()
        : `<section class="accounts-list">${(state.accSub === "savings"
            ? savingsAccounts
            : cashAccounts
          )
            .map(
              ([name, institution, amount, logo, kind]) =>
                `<article class="account-row"><span class="account-logo">${logo}</span><span class="account-info"><strong>${t(name)}</strong><small>${institution}</small></span>${status(kind)}<strong class="account-amount">${amount}</strong><button class="icon-button subtle" data-demo="account">${icon("chevron")}</button></article>`,
            )
            .join("")}</section>`
    }`;
  }

  function reconciliationSection() {
    return `
      <article class="card">
        <div class="section-title">
          <div>
            <h2>${vi() ? "Đối chiếu số dư sao kê" : "Statement Balance Reconciliation"}</h2>
            <p class="muted">${vi() ? "So sánh số dư sổ cái (Ledger balance) với sao kê ngân hàng thực tế. Mọi bút toán điều chỉnh bắt buộc ghi lý do kiểm toán." : "Compare calculated ledger balance against actual bank statement. Adjustments require an audit reason."}</p>
          </div>
          ${status("posted")}
        </div>
        <div class="today-kpi-grid" style="margin-top:16px">
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Tài khoản đối chiếu" : "Selected account"}</span>
            <strong class="kpi-amount">Vietcombank •• 2486</strong>
            <small>${vi() ? "Ngày chốt sao kê: 01/11/2026" : "Statement date: 2026-11-01"}</small>
          </div>
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Số dư sổ sách (Calculated)" : "Calculated ledger balance"}</span>
            <strong class="kpi-amount">26.480.000 ₫</strong>
            <small>${vi() ? "Từ số dư đầu kỳ + 48 giao dịch posted" : "Opening balance + 48 posted events"}</small>
          </div>
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Số dư thực tế (Expected)" : "Expected statement balance"}</span>
            <strong class="kpi-amount accent-text">26.480.000 ₫</strong>
            <small>${vi() ? "Khớp 100% · Chênh lệch: 0 ₫" : "100% matched · Difference: 0 ₫"}</small>
          </div>
          <div class="today-kpi excluded-box">
            <span class="kpi-label">${vi() ? "Ví MoMo •• 0901 (Cần đối chiếu)" : "MoMo •• 0901 (Needs check)"}</span>
            <strong class="kpi-amount negative-text">−15.000 ₫</strong>
            <small>${vi() ? "Lệch phí rút tiền chưa ghi sổ" : "Unrecorded withdrawal fee variance"}</small>
          </div>
        </div>
        <footer class="safe-footer">
          <span>${icon("shield")}${vi() ? "Lịch sử đối chiếu được lưu để có thể kiểm tra lại." : "Reconciliation records are retained in the audit log."}</span>
          <button class="primary-button" data-demo="reconcile-confirm">${vi() ? "Xác nhận đối chiếu kỳ này" : "Confirm reconciliation"}</button>
        </footer>
      </article>`;
  }

  /* ==========================================================================
   * 5. INVESTMENTS (#investments): Holdings + Activity + Performance & Logger
   * ========================================================================== */
  function investmentsView() {
    const allHoldings = applyManualValuationsToHoldings(
      [...investmentHoldings, ...state.customHoldings],
      state.customValuations,
      state.locale,
    );
    const allActivities = [...state.customActivities, ...investmentActivities];
    const tabs = [
      ["holdings", t("invTabHoldings"), String(allHoldings.length)],
      ["activity", t("invTabActivity"), String(allActivities.length)],
      ["performance", t("invTabPerformance")],
    ];

    return `${heading(
      t("investmentsTitle"),
      t("investmentsSubtitle"),
      "IA · INVESTMENTS",
      `<button class="primary-button" id="open-investment-main" data-action="investment-add" data-surface="main">${icon("plus")}<span>${t("logInvestmentBtn")}</span></button>`,
    )}
    ${subNav(tabs, state.invSub, "inv-sub")}
    <article class="card investment-summary-card" ${derivedAttrs("portfolioTotal")}>
      <div class="card-top">
        <div>
          <span class="card-label">${vi() ? "Tổng giá trị danh mục đầu tư" : "Total portfolio market value"}</span>
          ${status("estimated")}
        </div>
        <div class="inline-actions">
          <button class="secondary-button compact-btn" id="open-investment-card" data-action="investment-add" data-surface="card">${t("logInvestmentBtn")}</button>
          <button class="icon-button subtle" id="explain-portfolio" data-action="explain" data-derived="portfolioTotal" data-surface="portfolio" aria-label="${t("explain")}">${icon("info")}</button>
        </div>
      </div>
      <div class="today-kpi-grid">
        <div class="today-kpi">
          <span class="kpi-label">${vi() ? "Giá trị thị trường hiện tại" : "Current market value"}</span>
          <strong class="kpi-amount">108.000.000 ₫</strong>
          <small>${vi() ? "Giá vốn bình quân: 96.500.000 ₫" : "Weighted-avg cost basis: 96,500,000 ₫"}</small>
        </div>
        <div class="today-kpi inflow-box">
          <span class="kpi-label">${vi() ? "Lãi/lỗ theo giá hiện tại, chưa bán" : "Unrealized P&L"}</span>
          <strong class="kpi-amount positive-text">+11.500.000 ₫</strong>
          <small>${vi() ? "+11,9% trên giá vốn còn nắm giữ" : "+11.9% vs remaining cost basis"}</small>
        </div>
        <div class="today-kpi">
          <span class="kpi-label">${vi() ? "Cổ tức & Lãi đã chốt năm nay" : "Dividends & Realized P&L YTD"}</span>
          <strong class="kpi-amount accent-text">+3.050.000 ₫</strong>
          <small>${vi() ? "Lãi chốt: +1,8tr · Cổ tức ròng: +1,25tr" : "Realized: +1.8m · Net dividend: +1.25m"}</small>
        </div>
        <div class="today-kpi excluded-box">
          <span class="kpi-label">${vi() ? "Tỷ suất sinh lời có tính thời điểm nạp/rút tiền" : "Money-weighted return (XIRR)"}</span>
          <strong class="kpi-amount">+12,8%/năm</strong>
          <small>${vi() ? "Đã điều chỉnh dòng tiền nạp/rút & phí" : "Adjusted for dated cash flows & fees"}</small>
        </div>
      </div>
    </article>
    ${state.invSub === "activity" ? investmentActivitySection(allActivities) : state.invSub === "performance" ? investmentPerformanceSection() : investmentHoldingsSection(allHoldings)}`;
  }

  function investmentHoldingsSection(holdings) {
    return `
      <section class="review-list" id="investment-holdings-list">
        ${holdings
          .map(
            (h) => `
          <article class="review-item holding-row" data-asset-class="${h.assetClass}" data-valuation-mode="${h.valuationMode}" ${h.doubleCountProtected ? 'data-double-count-protected="true"' : ""}>
            <span class="account-logo">${h.symbol.slice(0, 4)}</span>
            <div class="review-content">
              <div class="badge-group">
                ${status(h.state)}
                <span class="tag-pill">${vi() ? h.assetLabelVi : h.assetLabelEn}</span>
                <span class="tag-pill">${h.valuationMode === "manual" ? (vi() ? "Định giá thủ công" : "Manual valuation") : h.valuationMode === "provider" ? (vi() ? "Giá đóng cửa / Giá quỹ" : "Provider EOD / NAV") : vi() ? "Sổ cái liên kết" : "Linked ledger"}</span>
              </div>
              <h2>${h.symbol} · ${h.portfolio} (${h.quantity})</h2>
              <p>${vi() ? "Giá vốn:" : "Cost basis:"} ${h.costBasis} · ${vi() ? "Giá hiện tại:" : "Price:"} ${h.marketPrice} · ${vi() ? h.sourceVi : h.sourceEn}</p>
            </div>
            <div class="holding-metrics">
              <strong class="review-amount">${h.marketValue}</strong>
              <small class="positive-text">${h.unrealizedPnl}</small>
            </div>
          </article>`,
          )
          .join("")}
      </section>`;
  }

  function investmentActivitySection(activities) {
    return `
      <section class="review-list" id="investment-activity-list">
        ${activities
          .map(
            (act) => `
          <article class="review-item" data-activity-kind="${act.kind}" data-pnl-impact="${act.pnlImpact}">
            <span class="review-icon">${icon("trend")}</span>
            <div class="review-content">
              <div class="badge-group">
                ${status(act.state)}
                <span class="tag-pill">${act.symbol} · ${act.date}</span>
              </div>
              <h2>${vi() ? act.titleVi : act.titleEn}</h2>
              <p>${vi() ? act.metaVi : act.metaEn}</p>
            </div>
            <strong class="review-amount">${act.amount}</strong>
          </article>`,
          )
          .join("")}
      </section>`;
  }

  function investmentPerformanceSection() {
    return `
      <div class="plan-grid">
        <article class="card">
          <h2>${vi() ? "Giải thích thay đổi giá trị danh mục" : "Performance Attribution Bridge"}</h2>
          <p class="muted">${vi() ? "Tách bạch đóng góp tiền mặt ròng khỏi lãi/lỗ thị trường và cổ tức." : "Separates external cash flows from market movement and investment income."}</p>
          <div class="formula-list" style="margin-top:14px">
            <div class="assumption"><span>${vi() ? "Giá trị danh mục đầu kỳ (01/01/2026)" : "Opening portfolio value (Jan 01, 2026)"}</span><strong>68.000.000 ₫</strong></div>
            <div class="assumption"><span>${vi() ? "Vốn nạp ròng từ tài khoản ngân hàng (không tính thu/chi)" : "Net external contributions (Non-P&L transfer)"}</span><strong>+26.500.000 ₫</strong></div>
            <div class="assumption"><span>${vi() ? "Thu nhập cổ tức & lãi tiền gửi đã nhận" : "Dividends & interest received"}</span><strong class="positive-text">+1.320.000 ₫</strong></div>
            <div class="assumption"><span>${vi() ? "Phí giao dịch & Thuế khấu trừ" : "Trading fees & withholding taxes"}</span><strong class="negative-text">−1.120.000 ₫</strong></div>
            <div class="assumption"><span>${vi() ? "Lãi đã chốt + Lãi/lỗ theo giá hiện tại" : "Realized + Unrealized market gain"}</span><strong class="positive-text">+13.300.000 ₫</strong></div>
            <div class="formula-total"><span>${vi() ? "Giá trị danh mục cuối kỳ (01/11/2026)" : "Ending portfolio value (Nov 01, 2026)"}</span><strong>108.000.000 ₫</strong></div>
          </div>
        </article>
        <article class="card">
          <h2>${vi() ? "Phân bổ theo loại tài sản" : "Asset Class Allocation"}</h2>
          <div class="allocation-bar"><span></span><i></i><b></b></div>
          <div class="allocation-list">
            <span><i class="asset-dot"></i>${vi() ? "Cổ phiếu niêm yết (FPT · HOSE)" : "Listed equity (FPT · HOSE)"}<strong>67.000.000 ₫ (62,0%)</strong></span>
            <span><i class="flex-dot"></i>${vi() ? "Chứng chỉ quỹ mở (DCDS)" : "Mutual funds (DCDS)"}<strong>19.800.000 ₫ (18,3%)</strong></span>
            <span><i class="buffer-dot"></i>${vi() ? "Vàng vật chất 9999 (Định giá thủ công)" : "Physical gold 9999 (Manual)"}<strong>17.200.000 ₫ (15,9%)</strong></span>
            <span><i class="liability-dot"></i>${vi() ? "Tiền mặt chờ đầu tư TCBS" : "Brokerage cash TCBS"}<strong>4.000.000 ₫ (3,8%)</strong></span>
          </div>
        </article>
      </div>`;
  }

  /* ==========================================================================
   * 6. DEBTS & RECEIVABLES (#debts): Payables + Receivables + Simulation
   * ========================================================================== */
  function debtsView() {
    const allDebts = [...debtObligations, ...state.customDebts];
    const payables = allDebts.filter((d) => d.direction === "payable");
    const receivables = allDebts.filter((d) => d.direction === "receivable");
    const tabs = [
      ["payables", t("debtTabPayables"), String(payables.length)],
      ["receivables", t("debtTabReceivables"), String(receivables.length)],
      ["simulation", t("debtTabSimulation")],
    ];

    return `${heading(
      t("debtsTitle"),
      t("debtsSubtitle"),
      "IA · DEBTS & RECEIVABLES",
      `<button class="primary-button" id="open-debt-main" data-action="debt-add" data-surface="main">${icon("plus")}<span>${t("addDebtBtn")}</span></button>`,
    )}
    ${subNav(tabs, state.debtSub, "debt-sub")}
    ${
      state.debtSub === "receivables"
        ? receivablesSection(receivables)
        : state.debtSub === "simulation"
          ? debtSimulationSection()
          : payablesSection(payables)
    }`;
  }

  function payablesSection(payables) {
    return `
      <article class="card">
        <div class="today-kpi-grid">
          <div class="today-kpi outflow-box">
            <span class="kpi-label">${vi() ? "Tổng dư nợ gốc phải trả" : "Total payable principal outstanding"}</span>
            <strong class="kpi-amount negative-text">33.500.000 ₫</strong>
            <small>${vi() ? "Vay VIB 30,0tr · Thẻ tín dụng VCB 3,5tr" : "VIB loan 30.0m · VCB card 3.5m"}</small>
            ${state.customDebts.some((d) => d.direction === "payable") ? `<small>${vi() ? "Bản nháp mới chưa cộng vào tổng cho đến khi có lịch tách gốc/lãi/phí." : "New drafts are excluded until principal/interest/fee schedules are confirmed."}</small>` : ""}
          </div>
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Kỳ trả tiếp theo (12/11)" : "Next installment (Nov 12)"}</span>
            <strong class="kpi-amount">3.500.000 ₫</strong>
            <small>${vi() ? "Gốc 2.800.000 ₫ không tính chi tiêu + Lãi 700.000 ₫ tính chi phí" : "Principal 2.8m (Non-P&L) + Interest 700k (Expense)"}</small>
          </div>
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Ngày sạch nợ dự kiến (Lịch chuẩn)" : "Projected debt-free date"}</span>
            <strong class="kpi-amount accent-text">12/09/2027</strong>
            <small>${vi() ? "Còn 11 kỳ thanh toán" : "11 installments remaining"}</small>
          </div>
        </div>
      </article>
      <section class="review-list" style="margin-top:14px">
        ${payables
          .map(
            (d) => `
          <article class="review-item" data-obligation-direction="payable" data-pnl-impact="false">
            <span class="review-icon">${icon("scale")}</span>
            <div class="review-content">
              ${status(d.state)}
              <h2>${vi() ? d.counterpartyVi : d.counterpartyEn}</h2>
              <p>${vi() ? "Dư nợ gốc:" : "Outstanding principal:"} <strong>${d.outstandingPrincipal}</strong> (${vi() ? "Ban đầu" : "Original"}: ${d.originalPrincipal}) · ${d.rate}</p>
              <p>${vi() ? "Kỳ tới" : "Next"} (${d.dueDate}): ${d.nextInstallment}</p>
              ${d.reminderSchedule ? `<p>${vi() ? "Nhắc trước hạn" : "Reminder"}: ${d.reminderSchedule === "off" ? (vi() ? "Tắt" : "Off") : `${d.reminderSchedule} ${vi() ? "ngày" : "days"}`}</p>` : ""}
            </div>
            <strong class="review-amount">${d.outstandingPrincipal}</strong>
          </article>`,
          )
          .join("")}
      </section>`;
  }

  function receivablesSection(receivables) {
    return `
      <article class="card">
        <div class="notice">${icon("info")}<p>${vi() ? "Tài sản ròng dùng giá trị dự kiến thu hồi = tiền gốc × xác suất thu hồi, không mặc định tính đủ 100% tiền gốc." : "Net worth uses estimated recoverable value = principal × recovery probability, rather than assuming full recovery."}</p></div>
        <div class="review-list" style="margin-top:14px">
          ${receivables
            .map(
              (r) => `
            <article class="review-item" data-obligation-direction="receivable" data-pnl-impact="false">
              <span class="review-icon">${icon("scale")}</span>
              <div class="review-content">
                ${status(r.state)}
                <h2>${vi() ? r.counterpartyVi : r.counterpartyEn}</h2>
                <p>${vi() ? "Tiền gốc:" : "Gross principal:"} <strong>${r.grossPrincipal}</strong> · ${vi() ? "Xác suất thu hồi:" : "Recovery probability:"} <strong>${r.recoveryProbability}</strong> · ${vi() ? "Đến hạn:" : "Due:"} ${r.dueDate}</p>
                <p>${vi() ? "Thu lại tiền gốc không phải thu nhập; chỉ phần lãi thu được mới được tính là thu nhập." : "Principal collection is non-P&L; only collected interest counts as income."}</p>
                ${r.reminderSchedule ? `<p>${vi() ? "Nhắc trước hạn" : "Reminder"}: ${r.reminderSchedule === "off" ? (vi() ? "Tắt" : "Off") : `${r.reminderSchedule} ${vi() ? "ngày" : "days"}`}</p>` : ""}
              </div>
              <div class="holding-metrics">
                <strong class="review-amount accent-text">${vi() ? "Dự kiến thu hồi" : "ERV"}: ${r.estimatedRecoverable}</strong>
                <small class="muted">${vi() ? "Tiền gốc" : "Gross"}: ${r.grossPrincipal}</small>
              </div>
            </article>`,
            )
            .join("")}
        </div>
      </article>`;
  }

  function debtSimulationSection() {
    const scenarios = {
      "0k": { freeDate: "12/09/2027", savedInterest: "0 ₫", monthsSaved: "0" },
      "1000k": { freeDate: "12/07/2027", savedInterest: "1.350.000 ₫", monthsSaved: "2" },
      "2000k": { freeDate: "12/05/2027", savedInterest: "2.450.000 ₫", monthsSaved: "4" },
    };
    const current = scenarios[state.simExtra] || scenarios["2000k"];
    return `
      <article class="card">
        <div class="section-title">
          <div>
            <h2>${vi() ? "Mô phỏng trả thêm gốc hàng tháng" : "What-if Extra Principal Simulation"}</h2>
            <p class="muted">${vi() ? "Mô phỏng không tự động ghi vào sổ cái. Chọn 'Áp dụng vào kế hoạch' chỉ tạo bản nháp kế hoạch chi tiêu." : "Simulation does not mutate the ledger. 'Apply to plan' only creates a plan draft."}</p>
          </div>
          ${status("forecast")}
        </div>
        <div class="filter-row" style="margin-top:14px">
          ${[
            ["0k", vi() ? "Theo lịch chuẩn (+0 ₫)" : "Standard schedule (+0 ₫)"],
            ["1000k", vi() ? "Trả thêm +1.000.000 ₫/tháng" : "Extra +1,000,000 ₫/mo"],
            ["2000k", vi() ? "Trả thêm +2.000.000 ₫/tháng" : "Extra +2,000,000 ₫/mo"],
          ]
            .map(
              ([val, label]) =>
                `<button class="filter ${state.simExtra === val ? "active" : ""}" data-action="sim-extra" data-value="${val}">${label}</button>`,
            )
            .join("")}
        </div>
        <div class="today-kpi-grid">
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Ngày sạch nợ dự kiến mới" : "New debt-free date"}</span>
            <strong class="kpi-amount accent-text">${current.freeDate}</strong>
            <small>${vi() ? `Rút ngắn ${current.monthsSaved} tháng so với lịch gốc` : `${current.monthsSaved} months earlier than baseline`}</small>
          </div>
          <div class="today-kpi inflow-box">
            <span class="kpi-label">${vi() ? "Tổng tiền lãi tiết kiệm được" : "Estimated interest saved"}</span>
            <strong class="kpi-amount positive-text">${current.savedInterest}</strong>
            <small>${vi() ? "Giả định lãi suất 9,2%/năm không đổi, phí trả trước 0%" : "Assumes 9.2% APR constant, 0% prepayment fee"}</small>
          </div>
          <div class="today-kpi excluded-box">
            <span class="kpi-label">${vi() ? "Tác động lên Safe-to-spend tháng tới" : "Impact on next month's Safe-to-spend"}</span>
            <strong class="kpi-amount">−${state.simExtra === "0k" ? "0 ₫" : state.simExtra === "1000k" ? "1.000.000 ₫" : "2.000.000 ₫"}</strong>
            <small>${vi() ? "Vẫn giữ nguyên khoản đệm tối thiểu 5.000.000 ₫" : "Preserves 5,000,000 ₫ minimum cash buffer"}</small>
          </div>
        </div>
        <footer class="safe-footer">
          <span>${icon("info")}${vi() ? "Chỉ tạo bản nháp kế hoạch, không tự thực hiện chuyển tiền." : "Creates a plan draft only; never executes a payment."}</span>
          <button class="primary-button" data-demo="apply-debt-plan">${vi() ? "Áp dụng vào kế hoạch (Bản nháp)" : "Apply to plan (Draft)"}</button>
        </footer>
      </article>`;
  }

  /* ==========================================================================
   * 7. PLAN (#plan): Safe-to-spend + Goals + Forecast + Suggestions
   * ========================================================================== */
  const assumptions = () => [
    ["liquid", "24.950.000 ₫"],
    ["inflow", "+12.200.000 ₫"],
    ["commitments", "−19.750.000 ₫"],
    ["buffer", "−5.000.000 ₫"],
  ];

  function planView() {
    const tabs = [
      ["sts", t("planTabSts")],
      ["goals", t("planTabGoals"), "3"],
      ["forecast", t("planTabForecast")],
      ["suggestions", t("planTabSuggestions"), "2"],
    ];
    return `${heading(t("planTitle"), t("planSubtitle"), "IA · PLAN")}
      ${subNav(tabs, state.planSub, "plan-sub")}
      ${
        state.planSub === "goals"
          ? planGoalsSection()
          : state.planSub === "forecast"
            ? planForecastSection()
            : state.planSub === "suggestions"
              ? planSuggestionsSection()
              : planStsSection()
      }`;
  }

  function planStsSection() {
    return `<div class="plan-grid"><article class="card plan-overview" ${derivedAttrs("safeToSpend")}><div class="card-top"><span class="card-label">${t("safe")}</span><button class="icon-button subtle" id="explain-plan" data-action="explain" data-derived="safeToSpend" data-surface="plan" aria-label="${t("explain")}">${icon("info")}</button></div><p class="hero-amount">12.400.000 <small>₫</small></p><div class="allocation-bar"><span></span><i></i><b></b></div><div class="allocation-list"><span><i class="asset-dot"></i>${t("reserved")}<strong>11.750.000 ₫</strong></span><span><i class="flex-dot"></i>${t("flexible")}<strong>12.400.000 ₫</strong></span><span><i class="buffer-dot"></i>${t("buffer")}<strong>5.000.000 ₫</strong></span></div></article><article class="card assumption-card"><div class="notice">${icon("info")}<p>${t("forecastNote")}</p></div><h2>${t("source")}</h2>${assumptions()
      .map(([label, value]) => assumption(label, value))
      .join("")}</article></div>`;
  }

  function planGoalsSection() {
    const goals = [
      [
        vi()
          ? "Quỹ dự phòng khẩn cấp (6 tháng chi thiết yếu)"
          : "Emergency Fund (6 months essential)",
        "90.000.000 ₫ / 120.000.000 ₫ (75%)",
        vi()
          ? "Liên kết: Techcombank Savings (50% số dư = 90tr) · Đóng góp tự động 5tr/tháng"
          : "Linked: Techcombank Savings (50% share = 90m) · +5m/mo auto-plan",
        "posted",
      ],
      [
        vi() ? "Quỹ mua nhà / Đặt cọc căn hộ 2028" : "Home Down-payment 2028",
        "157.000.000 ₫ / 500.000.000 ₫ (31,4%)",
        vi()
          ? "Liên kết: Techcombank Savings (50% = 90tr) + Cổ phiếu FPT (67tr) · Tách gốc đóng góp 149tr & Lãi thị trường +8tr"
          : "Linked: TCB Savings (90m) + FPT Equity (67m) · Contributed 149m + Market gain +8m",
        "estimated",
      ],
      [
        vi() ? "Quỹ học tập & Chứng chỉ chuyên môn" : "Education & Certification Fund",
        "19.800.000 ₫ / 30.000.000 ₫ (66%)",
        vi()
          ? "Liên kết: Chứng chỉ quỹ DCDS (19,8tr) · Không trùng lặp phân bổ với mục tiêu khác"
          : "Linked: DCDS Fund (19.8m) · Zero allocation overlap with other goals",
        "posted",
      ],
    ];
    return `<section class="review-list">${goals
      .map(
        ([title, progress, meta, st]) =>
          `<article class="review-item"><span class="review-icon">${icon("plan")}</span><div class="review-content">${status(st)}<h2>${title}</h2><p>${meta}</p></div><strong class="review-amount accent-text">${progress}</strong></article>`,
      )
      .join("")}</section>`;
  }

  function planForecastSection() {
    const sc = {
      conservative: {
        low: "6.400.000 ₫",
        end: "19.200.000 ₫",
        noteVi: "Thu nhập phụ tính 80%, giữ 100% dự phòng hóa đơn ở biên độ cao nhất.",
        noteEn: "Side income haircut to 80%, bills reserved at max tolerance.",
      },
      base: {
        low: "8.200.000 ₫",
        end: "22.450.000 ₫",
        noteVi: "Kịch bản cơ sở theo lịch sử 3 chu kỳ lương và cam kết cố định hiện hành.",
        noteEn: "Base scenario from 3 confirmed income cycles and active fixed commitments.",
      },
      optimistic: {
        low: "9.800.000 ₫",
        end: "26.100.000 ₫",
        noteVi: "Thu nhập phụ về đúng hạn 100% và thu hồi được 3.000.000 ₫ khoản phải thu.",
        noteEn: "100% side income on time plus partial receivable collection.",
      },
    }[state.forecastScenario];

    return `
      <article class="card" ${derivedAttrs("cashFlow")}>
        <div class="section-title">
          <div>
            <h2>${vi() ? "Dự báo dòng tiền 30 ngày theo kịch bản" : "30-Day Scenario Cash-Flow Forecast"}</h2>
            <p class="muted">${vi() ? sc.noteVi : sc.noteEn}</p>
          </div>
          ${status("forecast")}
        </div>
        <div class="filter-row" style="margin-top:14px">
          ${[
            ["conservative", vi() ? "Thận trọng (Conservative)" : "Conservative"],
            ["base", vi() ? "Cơ sở (Base)" : "Base"],
            ["optimistic", vi() ? "Tích cực (Optimistic)" : "Optimistic"],
          ]
            .map(
              ([val, label]) =>
                `<button class="filter ${state.forecastScenario === val ? "active" : ""}" data-action="forecast-scenario" data-value="${val}">${label}</button>`,
            )
            .join("")}
        </div>
        <div class="today-kpi-grid">
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Điểm thấp nhất dự kiến (12/11)" : "Projected low point (Nov 12)"}</span>
            <strong class="kpi-amount">${sc.low}</strong>
            <small>${vi() ? "Ngay sau kỳ trả góp VIB 3,5tr · Cao hơn mức đệm 5tr" : "Right after 3.5m VIB loan payment · Above 5m buffer"}</small>
          </div>
          <div class="today-kpi inflow-box">
            <span class="kpi-label">${vi() ? "Số dư thanh khoản dự kiến cuối kỳ (30/11)" : "Projected ending liquid cash (Nov 30)"}</span>
            <strong class="kpi-amount positive-text">${sc.end}</strong>
            <small>${vi() ? "Đã trừ toàn bộ 19,75tr cam kết cố định tháng 11" : "After all 19.75m Nov fixed commitments"}</small>
          </div>
        </div>
      </article>`;
  }

  function planSuggestionsSection() {
    return `
      <article class="card">
        <div class="notice">${icon("shield")}<p>${vi() ? "Đủ dữ liệu để tạo gợi ý: 62 ngày lịch sử, 2 chu kỳ lương đầy đủ và 94% giao dịch đã phân loại. Gợi ý chỉ hỗ trợ quyết định, không tự động thực thi." : "Suggestion eligibility: 62 days history, 2 full income cycles, and 94% categorized. Suggestions never auto-execute."}</p></div>
        <div class="review-list" style="margin-top:14px">
          <article class="review-item suggestion-card">
            <span class="review-icon">${icon("scale")}</span>
            <div class="review-content">
              <div class="badge-group">
                ${status("estimated")}
                <span class="tag-pill">${vi() ? "Độ tin cậy: Cao · Кịch bản trả nợ" : "Confidence: High · Debt plan"}</span>
              </div>
              <h2>${vi() ? "Tăng trả gốc khoản vay VIB thêm 2.000.000 ₫/tháng sau ngày nhận lương 15/11" : "Increase VIB loan principal payment by 2,000,000 ₫/month after Nov 15 payday"}</h2>
              <p><strong>1. ${vi() ? "Phát hiện" : "Detection"}:</strong> ${vi() ? "Dòng tiền ròng sau cam kết cố định trong 2 tháng qua dư trung bình 6.400.000 ₫/tháng." : "Net cash after fixed commitments averaged +6,400,000 ₫/mo over the last 2 cycles."}</p>
              <p><strong>2. ${vi() ? "Vì sao" : "Reason"}:</strong> ${vi() ? "Lãi vay VIB (9,2%/năm) cao hơn lãi tiền gửi ngắn hạn (5,4%/năm), trong khi Quỹ dự phòng đã đạt 75%." : "VIB loan APR (9.2%) exceeds term-deposit yield (5.4%), while emergency fund is at 75%."}</p>
              <p><strong>3. ${vi() ? "Tác động dự kiến" : "Expected impact"}:</strong> ${vi() ? "Tất toán sớm 4 tháng (12/05/2027), tiết kiệm ~2.450.000 ₫ tiền lãi, vẫn giữ nguyên đệm 5.000.000 ₫." : "Finish 4 months earlier (May 2027), save ~2,450,000 ₫ interest, keep 5m buffer intact."}</p>
              <p><small>source_ids: obl-vib-loan, commit-loan, sts-v1.0 · snapshot: 2026-11-01T08:30</small></p>
            </div>
            <div class="inline-actions">
              <button class="primary-button compact-btn" data-demo="apply-suggestion">${vi() ? "Áp dụng vào kế hoạch (Bản nháp)" : "Apply to plan (Draft)"}</button>
              <button class="secondary-button compact-btn" data-demo="remind-suggestion">${vi() ? "Nhắc lại sau" : "Remind later"}</button>
              <button class="secondary-button compact-btn" data-demo="dismiss-suggestion">${vi() ? "Không phù hợp" : "Not relevant"}</button>
            </div>
          </article>
        </div>
      </article>`;
  }

  function assumption(label, value, source = "") {
    return `<button class="assumption" data-demo="assumption"><span>${t(label)}${source ? `<small>${source}</small>` : ""}</span><strong>${value}</strong>${icon("chevron")}</button>`;
  }

  /* ==========================================================================
   * 8. REPORTS & MONTHLY CLOSE (#reports)
   * ========================================================================== */
  function reportsView() {
    const tabs = [
      ["pnlCashflow", t("repTabPnl")],
      ["netWorthBridge", t("repTabBridge")],
      ["monthlyClose", t("repTabClose")],
    ];
    return `${heading(t("reportsTitle"), t("reportsSubtitle"), "IA · REPORTS")}
      ${subNav(tabs, state.repSub, "rep-sub")}
      ${
        state.repSub === "netWorthBridge"
          ? reportsBridgeSection()
          : state.repSub === "monthlyClose"
            ? reportsMonthlyCloseSection()
            : reportsPnlSection()
      }`;
  }

  function reportsPnlSection() {
    return `
      <article class="card">
        <div class="section-title">
          <div>
            <h2>${vi() ? "Báo cáo Thu nhập & Chi phí tháng 10/2026" : "October 2026 Income & Expense Report"}</h2>
            <p class="muted">${vi() ? "Chuyển khoản nội bộ (12.000.000 ₫) và trả gốc nợ (2.800.000 ₫) không được tính vào thu nhập hoặc chi phí." : "Internal transfers (12,000,000 ₫) and debt principal repayments (2,800,000 ₫) are strictly excluded from P&L."}</p>
          </div>
          ${status("posted")}
        </div>
        <div class="today-kpi-grid" style="margin-top:14px">
          <div class="today-kpi inflow-box">
            <span class="kpi-label">${vi() ? "Tổng thu nhập đã ghi sổ" : "Total posted income"}</span>
            <strong class="kpi-amount positive-text">+35.475.000 ₫</strong>
            <small>${vi() ? "Lương 30tr · Dự án 5tr · Cổ tức 475k" : "Salary 30m · Retainer 5m · Dividend 475k"}</small>
          </div>
          <div class="today-kpi outflow-box">
            <span class="kpi-label">${vi() ? "Tổng chi phí thực tế" : "Total actual expenses (P&L)"}</span>
            <strong class="kpi-amount negative-text">−21.850.000 ₫</strong>
            <small>${vi() ? "Chi cố định 11,25tr · Lãi vay 700k · Linh hoạt 9,9tr" : "Fixed 11.25m · Loan interest 700k · Flexible 9.9m"}</small>
          </div>
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Thặng dư thu/chi ròng" : "Net P&L savings"}</span>
            <strong class="kpi-amount accent-text">+13.625.000 ₫</strong>
            <small>${vi() ? "Tỷ lệ tiết kiệm ròng: 38,4%" : "Net savings rate: 38.4%"}</small>
          </div>
          <div class="today-kpi excluded-box" data-pnl-impact="false">
            <span class="kpi-label">${vi() ? "Dịch chuyển tài sản/nghĩa vụ, không tính thu/chi" : "Balance-sheet movements (Non-P&L)"}</span>
            <strong class="kpi-amount">21.000.000 ₫</strong>
            <small>${vi() ? "Trả gốc VIB 2,8tr · Mua FPT 13,2tr · Gửi tiết kiệm 5tr" : "Principal 2.8m · Equity buy 13.2m · Savings 5m"}</small>
          </div>
        </div>
      </article>`;
  }

  function reportsBridgeSection() {
    return `
      <article class="card" ${derivedAttrs("netWorth")}>
        <h2>${vi() ? "Giải thích thay đổi Tài sản ròng" : "Net-Worth Bridge"}</h2>
        <div class="formula-list" style="margin-top:14px">
          <div class="assumption"><span>${vi() ? "Tài sản ròng đầu tháng (01/10/2026)" : "Opening Net Worth (Oct 01, 2026)"}</span><strong>277.350.000 ₫</strong></div>
          <div class="assumption"><span>${vi() ? "+ Thặng dư thu/chi tháng (đã gồm cổ tức, lãi vay và phí)" : "+ Monthly net P&L (including dividends, interest and fees)"}</span><strong class="positive-text">+13.625.000 ₫</strong></div>
          <div class="assumption"><span>${vi() ? "+ Biến động giá trị thị trường (Cổ phiếu, Quỹ, Vàng)" : "+ Realized/unrealized market movement"}</span><strong class="positive-text">+1.625.000 ₫</strong></div>
          <div class="assumption"><span>${vi() ? "± Thay đổi giá trị dự kiến thu hồi khoản phải thu" : "± Receivable recovery estimate change"}</span><strong>0 ₫</strong></div>
          <div class="formula-total"><span>${vi() ? "Tài sản ròng hiện tại (01/11/2026)" : "Current Net Worth (Nov 01, 2026)"}</span><strong>292.600.000 ₫</strong></div>
        </div>
      </article>`;
  }

  function reportsMonthlyCloseSection() {
    const steps = [
      [
        vi()
          ? "1. Xử lý các giao dịch quan trọng trong Cần xem lại"
          : "1. Review unresolved critical transactions",
        vi() ? "Còn 3 mục (1 chuyển khoản, 1 nghi trùng, 1 lệch cam kết)" : "3 items remaining",
        "pending",
      ],
      [
        vi()
          ? "2. Đối chiếu số dư các tài khoản thanh khoản chính"
          : "2. Reconcile selected liquid accounts",
        vi() ? "Vietcombank & Techcombank đã khớp 100%" : "VCB & Techcombank 100% matched",
        "posted",
      ],
      [
        vi()
          ? "3. Xác nhận lịch công nợ & định giá tài sản thủ công"
          : "3. Confirm debts/receivables and manual valuations",
        vi()
          ? "Giá vàng nhẫn & ERV khoản phải thu đã cập nhật 01/11"
          : "Gold & receivable ERV updated Nov 01",
        "posted",
      ],
      [
        vi()
          ? "4. Xem chênh lệch Thực tế vs Kế hoạch & ghi chú"
          : "4. Review actual vs plan variance",
        vi()
          ? "Lệch +120.000 ₫ khoản vay ngân hàng đã có giải trình"
          : "120k loan variance explained",
        "posted",
      ],
      [
        vi()
          ? "5. Khóa Snapshot tháng (Versioned) & chuyển tiếp cam kết"
          : "5. Generate versioned monthly snapshot & carry forward",
        vi() ? "Sẵn sàng tạo snapshot close-2026-10-v1.0" : "Ready to generate close-2026-10-v1.0",
        "estimated",
      ],
    ];
    return `
      <article class="card">
        <div class="section-title">
          <div>
            <h2>${vi() ? "Quy trình Đóng sổ tháng" : "Monthly Close Checklist"}</h2>
            <p class="muted">${vi() ? "Khóa snapshot có phiên bản và tự động mang các cam kết cố định đang hoạt động sang tháng mới." : "Generates a versioned snapshot and carries active fixed commitments forward."}</p>
          </div>
          <button class="primary-button" data-demo="close-month">${vi() ? "Khóa số liệu tháng 10 (v1.0)" : "Lock Oct Snapshot (v1.0)"}</button>
        </div>
        <div class="review-list" style="margin-top:14px">
          ${steps
            .map(
              ([title, sub, st]) =>
                `<article class="transaction-row"><span class="transaction-icon">${icon("check")}</span><span class="transaction-copy"><strong>${title}</strong><small>${sub}</small></span>${status(st)}<strong class="transaction-amount">${st === "posted" ? "OK" : "..."}</strong></article>`,
            )
            .join("")}
        </div>
      </article>`;
  }

  /* ==========================================================================
   * 9. SETTINGS & DATA RIGHTS (#settings)
   * ========================================================================== */
  function settingsView() {
    const tabs = [
      ["profile", t("setTabProfile")],
      ["categories", t("setTabCategories")],
      ["sources", t("setTabSources")],
      ["notifications", vi() ? "Thông báo & Nhắc lịch" : "Notifications & Reminders"],
      ["privacy", t("setTabPrivacy")],
      ["security", t("setTabSecurity")],
    ];
    return `${heading(t("settingsTitle"), t("settingsSubtitle"), "IA · SETTINGS")}
      ${subNav(tabs, state.setSub, "set-sub")}
      ${
        state.setSub === "privacy"
          ? settingsPrivacySection()
          : state.setSub === "security"
            ? settingsSecuritySection()
            : state.setSub === "categories"
              ? settingsCategoriesSection()
              : state.setSub === "sources"
                ? settingsSourcesSection()
                : state.setSub === "notifications"
                  ? settingsNotificationsSection()
                  : settingsGeneralSection()
      }`;
  }

  function settingsGeneralSection() {
    return `
      <div class="plan-grid">
        <article class="card">
          <h2>${t("setTabProfile")}</h2>
          <div class="formula-list" style="margin-top:12px">
            <div class="assumption"><span>${t("language")}<small>${vi() ? "Tiếng Việt mặc định · Có tiếng Anh" : "Vietnamese default · English available"}</small></span><div>${localeControl()}</div></div>
            <div class="assumption"><span>${t("appearance")}<small>${state.theme === "light" ? t("light") : t("dark")}</small></span><button class="secondary-button compact-btn" data-action="theme">${state.theme === "light" ? t("dark") : t("light")}</button></div>
            <div class="assumption"><span>${vi() ? "Tiền tệ chính" : "Base currency"}<small>${vi() ? "Đổi tiền tệ chính không sửa số tiền gốc của giao dịch" : "Changing base currency never mutates original amounts"}</small></span><strong>VND (₫)</strong></div>
            <div class="assumption"><span>${vi() ? "Múi giờ & Chu kỳ ngân sách" : "Timezone & Budget cycle"}<small>Asia/Ho_Chi_Minh (UTC+7)</small></span><strong>${vi() ? "Theo tháng dương lịch" : "Calendar month"}</strong></div>
          </div>
        </article>
      </div>`;
  }

  function settingsCategoriesSection() {
    const expense = vi()
      ? ["Ăn uống", "Đi chợ", "Nhà ở", "Điện / Nước", "Đi lại", "Sức khỏe", "Giáo dục", "Lãi / Phí"]
      : [
          "Dining",
          "Groceries",
          "Housing",
          "Utilities",
          "Transport",
          "Health",
          "Education",
          "Interest / Fees",
        ];
    const income = vi()
      ? ["Lương", "Thưởng", "Freelance", "Lãi tiết kiệm", "Cổ tức", "Quà tặng"]
      : ["Salary", "Bonus", "Freelance", "Savings interest", "Dividend", "Gift"];
    return `<div class="plan-grid"><article class="card"><h2>${vi() ? "Danh mục chi tiêu" : "Expense categories"}</h2><p class="muted">${vi() ? "Danh mục không tự thay đổi loại giao dịch." : "A category never silently changes transaction type."}</p><div class="category-cloud">${expense.map((item) => `<span class="tag-pill">${item}</span>`).join("")}</div><button class="secondary-button compact-btn" data-demo="category-expense">${vi() ? "+ Tạo danh mục chi" : "+ Add expense category"}</button></article><article class="card"><h2>${vi() ? "Danh mục thu nhập" : "Income categories"}</h2><p class="muted">${vi() ? "Tiền vay, thu gốc và chuyển khoản không được coi là thu nhập." : "Borrowing, principal collection, and transfers are not income."}</p><div class="category-cloud">${income.map((item) => `<span class="tag-pill">${item}</span>`).join("")}</div><button class="secondary-button compact-btn" data-demo="category-income">${vi() ? "+ Tạo danh mục thu" : "+ Add income category"}</button></article></div>`;
  }

  function settingsSourcesSection() {
    return `<article class="card">
      <h2>${t("setTabSources")}</h2>
      <p class="muted">${vi() ? "Độ phủ dưới đây là dữ liệu mẫu; Zenval chưa kết nối nguồn giá dùng trong thực tế hoặc được cấp quyền phân phối." : "Coverage below is sample data; no production API or redistribution license is connected."}</p>
      <div class="review-list" style="margin-top:14px">
        <div class="transaction-row">
          <span class="transaction-icon">${icon("trend")}</span>
          <span class="transaction-copy"><strong>${vi() ? "Chứng khoán niêm yết Việt Nam" : "Vietnam listed securities"}</strong><small>${vi() ? "Đang đánh giá SSI FastConnect · Chưa kết nối · Cần xác minh quyền sử dụng và giới hạn truy cập" : "SSI FastConnect candidate · Not connected · License/quota pending"}</small></span>
          ${status("pending")}<strong>${vi() ? "Đang tìm hiểu" : "Research"}</strong>
        </div>
        <div class="transaction-row">
          <span class="transaction-icon">${icon("trend")}</span>
          <span class="transaction-copy"><strong>${vi() ? "Quỹ mở / Trái phiếu" : "Mutual funds / Bonds"}</strong><small>${vi() ? "Giá quỹ và trái phiếu cần nguồn được xác nhận; hiện nhập thủ công" : "NAV and bond prices need issuer/provider sources; manual fallback is active"}</small></span>
          ${status("estimated")}<strong>${vi() ? "Thủ công" : "Manual"}</strong>
        </div>
        <div class="transaction-row">
          <span class="transaction-icon">${icon("trend")}</span>
          <span class="transaction-copy"><strong>${vi() ? "Vàng, bạc, kim cương" : "Gold, silver, diamonds"}</strong><small>${vi() ? "Vàng/bạc cần đúng loại sản phẩm và chiều mua/bán; kim cương cần định giá từng viên" : "Gold/silver need product and bid/ask mapping; diamonds require per-stone appraisal"}</small></span>
          ${status("estimated")}<strong>${vi() ? "Thủ công" : "Manual"}</strong>
        </div>
      </div>
    </article>`;
  }

  function settingsNotificationsSection() {
    const settings = state.notificationSettings;
    return `<div class="plan-grid"><article class="card"><h2>${vi() ? "Nhắc hạn trả nợ" : "Debt due reminders"}</h2><p class="muted">${vi() ? "Không hiển thị số tiền hoặc bên đối ứng trên màn hình khóa theo mặc định." : "Amounts and counterparties are hidden on the lock screen by default."}</p><div class="formula-list"><label class="assumption"><span>${vi() ? "Bật nhắc hạn" : "Enable due reminders"}<small>${vi() ? "Mặc định 7, 3, 1 ngày trước và ngày đến hạn" : "Default: 7, 3, 1 days before and on due date"}</small></span><input id="notify-debt-enabled" type="checkbox" ${settings.debtReminder ? "checked" : ""}/></label><label class="assumption"><span>${vi() ? "Kênh nhận" : "Delivery channel"}</span><select id="notify-channel"><option value="in-app-email" ${settings.channel === "in-app-email" ? "selected" : ""}>In-app + Email</option><option value="in-app" ${settings.channel === "in-app" ? "selected" : ""}>In-app</option></select></label></div></article><article class="card"><h2>${vi() ? "Nhắc ghi chi tiêu hằng ngày" : "Daily expense reminder"}</h2><p class="muted">${vi() ? "Theo múi giờ Asia/Ho_Chi_Minh; đổi múi giờ sẽ cập nhật lịch, không gửi bù." : "Uses Asia/Ho_Chi_Minh; timezone changes reschedule without backfilling."}</p><div class="formula-list"><label class="assumption"><span>${vi() ? "Bật lời nhắc" : "Enable reminder"}<small>${vi() ? "Mỗi ngày địa phương tối đa một lần" : "At most once per local day"}</small></span><input id="notify-daily-enabled" type="checkbox" ${settings.dailyCapture ? "checked" : ""}/></label><label class="assumption"><span>${vi() ? "Giờ nhắc" : "Reminder time"}</span><input id="notify-daily-time" type="time" value="${settings.dailyCaptureTime}"/></label></div><p class="prototype-notice">${icon("info")}${vi() ? "Prototype chỉ lưu cấu hình trong phiên; chưa gửi email hoặc push thật." : "The prototype stores this setting in-session and sends no real email or push."}</p></article></div>`;
  }

  function settingsPrivacySection() {
    return `
      <article class="card">
        <h2>${t("setTabPrivacy")}</h2>
        <p class="muted">${vi() ? "Zenval không bán dữ liệu tài chính cá nhân, không yêu cầu mật khẩu ngân hàng và luôn đảm bảo quyền mang dữ liệu đi (Data portability)." : "Zenval never sells personal financial data, never asks for bank passwords, and guarantees full data portability."}</p>
        <div class="today-kpi-grid" style="margin-top:14px">
          <div class="today-kpi">
            <span class="kpi-label">${vi() ? "Xuất toàn bộ dữ liệu (Export Bundle)" : "Full machine-readable export"}</span>
            <strong class="kpi-amount">JSON + CSV + Manifest</strong>
            <small>${vi() ? "SLA: Xác nhận ngay, hoàn tất <24h kèm phiên bản schema" : "SLA: Acknowledged immediately, completed <24h with schema version"}</small>
            <button class="secondary-button compact-btn" style="margin-top:10px" data-demo="export-data">${vi() ? "Yêu cầu xuất dữ liệu" : "Request data export"}</button>
          </div>
          <div class="today-kpi outflow-box">
            <span class="kpi-label">${vi() ? "Xóa tài khoản & toàn bộ dữ liệu" : "Delete account & workspace data"}</span>
            <strong class="kpi-amount negative-text">${vi() ? "Soft-delete ngay · Hard-delete ≤30 ngày" : "Immediate soft-delete · Hard-delete ≤30d"}</strong>
            <small>${vi() ? "Cấp biên nhận xóa không chứa thông tin nhạy cảm" : "Provides a redacted deletion receipt"}</small>
            <button class="secondary-button compact-btn" style="margin-top:10px" data-demo="delete-data">${vi() ? "Xem phạm vi & Yêu cầu xóa" : "Preview scope & Delete"}</button>
          </div>
        </div>
      </article>`;
  }

  function settingsSecuritySection() {
    return `
      <article class="card">
        <h2>${t("setTabSecurity")}</h2>
        <p class="muted">${vi() ? "Nhật ký kiểm toán lưu lại mọi thay đổi số dư, đối chiếu, đóng sổ và phiên bản công thức để có thể kiểm tra lại." : "Immutable Audit Log records every balance adjustment, reconciliation, monthly close, and calculation version."}</p>
        <div class="notice" style="margin-top:14px">${icon("shield")}<p><strong>${vi() ? "Google Account đã liên kết" : "Google Account linked"}</strong><br/>nam@example.com · ${vi() ? "Chỉ quyền xác thực, không có quyền Gmail/Drive" : "Authentication scope only; no Gmail/Drive access"}<br/><button class="secondary-button compact-btn" style="margin-top:10px" data-view="auth">${vi() ? "Xem trước màn hình đăng nhập" : "Preview sign-in screen"}</button></p></div>
        <div class="review-list" style="margin-top:14px">
          <div class="transaction-row"><span class="transaction-icon">${icon("shield")}</span><span class="transaction-copy"><strong>audit-0192 · ReconciliationConfirmed</strong><small>account: vcb-2486 · diff: 0 VND · actor: user:nam · 2026-11-01T08:30:00+07:00</small></span>${status("posted")}<strong>v1.0</strong></div>
          <div class="transaction-row"><span class="transaction-icon">${icon("shield")}</span><span class="transaction-copy"><strong>audit-0191 · ManualPriceSnapshotRecorded</strong><small>instrument: GOLD-9999 · price: 8600000 VND · provider_history_preserved: true</small></span>${status("posted")}<strong>v1.0</strong></div>
          <div class="transaction-row"><span class="transaction-icon">${icon("shield")}</span><span class="transaction-copy"><strong>audit-0190 · CommitmentVersionCreated</strong><small>commitment: commit-loan · split: principal 2.8m / interest 700k · effective: 2026-11</small></span>${status("posted")}<strong>v1.0</strong></div>
        </div>
      </article>`;
  }

  function authView() {
    return `<section class="auth-layout"><article class="card auth-card"><div class="brand auth-brand"><span class="brand-mark">Z</span><span>ZENVAL</span></div><p class="eyebrow">Calm numbers. Clear decisions.</p><h1>${vi() ? "Đăng nhập vào Zenval" : "Sign in to Zenval"}</h1><p class="muted">${vi() ? "Dùng Google Account để tiếp tục. Zenval chỉ yêu cầu thông tin xác thực cơ bản." : "Continue with your Google Account. Zenval requests basic authentication information only."}</p><button class="primary-button google-button" data-action="google-sign-in"><span aria-hidden="true">G</span>${vi() ? "Tiếp tục với Google" : "Continue with Google"}</button><div class="inline-note">${icon("shield")}<span>${vi() ? "Lần đầu đăng nhập sẽ tạo một personal workspace VND/Asia_Ho_Chi_Minh duy nhất. Tài khoản trùng email không tự liên kết." : "First sign-in creates one VND/Asia_Ho_Chi_Minh personal workspace. Matching emails are never auto-linked."}</span></div><button class="text-button" data-view="settings">${vi() ? "Quay lại bản demo đã đăng nhập" : "Return to signed-in demo"}</button></article></section>`;
  }

  /* ==========================================================================
   * 10. UI SYSTEM (#system) & MOBILE MORE HUB (#more)
   * ========================================================================== */
  function systemView() {
    return `${heading(t("foundation"), t("foundationSubtitle"))}<section class="system-grid">
      <article class="card token-card"><h2>${t("colors")}</h2><div class="swatches">${[
        ["ink", "Ink", "#12352D"],
        ["accent", "Zen teal", "#13795B"],
        ["canvas", "Canvas", "#F5F7F3"],
        ["amber", "Uncertain", "#A4610A"],
        ["danger", "Risk", "#B94A48"],
      ]
        .map(
          ([className, label, value]) =>
            `<span><i class="swatch ${className}"></i><small>${label}</small><code>${value}</code></span>`,
        )
        .join("")}</div></article>
      <article class="card type-card"><h2>${t("typography")}</h2><p class="type-display">Calm numbers.</p><p class="type-title">Clear decisions.</p><p class="type-body">System sans keeps Vietnamese diacritics crisp and financial data easy to scan.</p><p class="type-number">12.400.000 ₫</p></article>
      <article class="card component-card"><h2>${t("components")}</h2><div class="component-demo"><button class="primary-button">Primary action</button><button class="secondary-button">Secondary</button><label class="demo-input"><span>${t("amount")}</span><input value="1.250.000"/><b>₫</b></label><div>${status("posted")}${status("pending")}</div></div></article>
      <article class="card state-card"><h2>${t("states")}</h2><div class="state-matrix">${[
        ["check", "complete", "posted"],
        ["clock", "stale", "14 days ago"],
        ["info", "missing", "Needs setup"],
        ["review", "pending", "Needs a decision"],
        ["arrows", "offline", "Draft queued"],
      ]
        .map(
          ([ico, label, sub]) =>
            `<span>${icon(ico)}<b>${t(label)}</b><small>${t(sub)}</small></span>`,
        )
        .join("")}</div></article>
    </section>`;
  }

  function moreView() {
    return `${heading(t("more"), t("moreSubtitle"))}
      <section class="more-list">
        ${moreLink("review", "review", "reviewSubtitle", "review")}
        ${moreLink("wallet", "accounts", "accountSubtitle", "accounts")}
        ${moreLink("trend", "investments", "investmentsSubtitle", "investments")}
        ${moreLink("scale", "debts", "debtsSubtitle", "debts")}
        ${moreLink("chart", "reports", "reportDesc", "reports")}
        ${moreLink("settings", "settings", "privacy", "settings")}
        ${moreLink("layers", "system", "foundationSubtitle", "system")}
      </section>
      <section class="mobile-preferences"><div><span><strong>${t("language")}</strong><small>Tiếng Việt / English</small></span>${localeControl()}</div><div><span><strong>${t("appearance")}</strong><small>${state.theme === "light" ? t("light") : t("dark")}</small></span><button class="icon-button" data-action="theme">${icon(state.theme === "light" ? "moon" : "sun")}</button></div></section>`;
  }
  function moreLink(ico, title, description, target = "") {
    return `<button class="more-link" ${target ? `data-view="${target}"` : `data-demo="${title}"`}><span class="more-icon">${icon(ico)}</span><span><strong>${t(title)}</strong><small>${t(description)}</small></span>${icon("chevron")}</button>`;
  }

  /* ==========================================================================
   * DIALOGS: Explain Drawer, Quick-Add, Create Fixed Commitment, Log Investment, Add Debt
   * ========================================================================== */
  function renderDialog() {
    switch (state.dialog) {
      case "explain":
        return explanationDialog();
      case "commitment-add":
        return commitmentAddDialog();
      case "investment-add":
        return investmentAddDialog();
      case "debt-add":
        return debtAddDialog();
      default:
        return quickAddDialog();
    }
  }

  function explanationDialog() {
    const derived = derivedValues[state.derivedKey] || derivedValues.safeToSpend;
    const todaySummary = currentTodaySummary();
    const sources = vi()
      ? [
          "VCB, MoMo · đối chiếu hôm nay",
          "2 kỳ thu nhập đã xác nhận",
          "5 cam kết cố định đang hoạt động",
          "Cài đặt kế hoạch của bạn",
        ]
      : [
          "VCB, MoMo · reconciled today",
          "2 confirmed income occurrences",
          "5 active fixed commitments",
          "Your plan setting",
        ];
    const detailRows =
      state.derivedKey === "safeToSpend"
        ? assumptions()
            .map(([label, value], index) => assumption(label, value, sources[index]))
            .join("")
        : state.derivedKey === "todayCashflow"
          ? `
            <div class="assumption"><span>${t("todayInflow")}<small>posted income entries</small></span><strong class="positive-text">${todaySummary.inflowDisplay}</strong></div>
            <div class="assumption"><span>${t("todayOutflow")}<small>posted expense entries</small></span><strong class="negative-text">${todaySummary.outflowDisplay}</strong></div>
            <div class="assumption"><span>${t("todayExcluded")}<small>internal transfers (Non-P&L)</small></span><strong>${todaySummary.excludedTransferDisplay}</strong></div>`
          : `<div class="derived-summary"><span>${t("source")}</span><strong>${derived.sourceIds.join(" · ")}</strong></div>`;
    const horizonLabel = vi() ? "Phạm vi kết thúc" : "Horizon ends";
    const asOfLabel = vi() ? "Dữ liệu tại" : "Data as of";
    const versionLabel = vi() ? "Phiên bản tính" : "Calculation version";
    const sourceIds =
      state.derivedKey === "todayCashflow"
        ? todaySummary.entries.map((entry) => entry.id)
        : derived.sourceIds;
    const display =
      state.derivedKey === "todayCashflow" ? todaySummary.netDisplay : derived.display;
    const asOf = state.derivedKey === "todayCashflow" ? todaySummary.asOf : derived.asOf;
    return `<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><button class="overlay-backdrop" data-action="close" tabindex="-1" aria-label="${t("close")}"></button><aside class="drawer"><header class="dialog-header"><div>${status(derived.state)}<h2 id="dialog-title">${t(derived.titleKey)}</h2></div><button class="icon-button" data-action="close" data-initial-focus aria-label="${t("close")}">${icon("close")}</button></header><p class="drawer-intro">${t("forecastNote")}</p><div class="formula-list">${detailRows}<div class="formula-total"><span>${t(derived.titleKey)}</span><strong>${display}</strong></div></div><div class="provenance">${icon("clock")}<div><strong>${horizonLabel}: ${derived.horizonEnd}</strong><small>${asOfLabel}: ${asOf}</small><small>${versionLabel}: ${derived.calculationVersion}</small><small>source_ids: ${sourceIds.join(", ")}</small></div></div></aside></div>`;
  }

  function quickAddDialog() {
    const transfer = state.transactionType === "transfer";
    const categories =
      state.transactionType === "income"
        ? vi()
          ? ["Lương", "Thưởng", "Freelance", "Lãi tiết kiệm", "Cổ tức", "Quà tặng", "Khác"]
          : ["Salary", "Bonus", "Freelance", "Savings interest", "Dividend", "Gift", "Other"]
        : vi()
          ? [
              "Ăn uống",
              "Đi chợ",
              "Nhà ở",
              "Điện / Nước",
              "Internet / Điện thoại",
              "Đi lại",
              "Sức khỏe",
              "Giáo dục",
              "Mua sắm",
              "Giải trí",
              "Gia đình",
              "Bảo hiểm",
              "Lãi / Phí",
              "Khác",
            ]
          : [
              "Dining",
              "Groceries",
              "Housing",
              "Utilities",
              "Internet / Phone",
              "Transport",
              "Health",
              "Education",
              "Shopping",
              "Entertainment",
              "Family",
              "Insurance",
              "Interest / Fees",
              "Other",
            ];
    return `<div class="overlay centered" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button class="overlay-backdrop" data-action="close" tabindex="-1" aria-label="${t("close")}"></button>
      <section class="modal">
        <header class="dialog-header"><h2 id="dialog-title">${t("addTitle")}</h2><button class="icon-button" data-action="close" data-initial-focus aria-label="${t("close")}">${icon("close")}</button></header>
        <div class="segmented transaction-types">${["expense", "income", "transfer"].map((type) => `<button class="${state.transactionType === type ? "selected" : ""}" data-action="transaction-type" data-value="${type}" aria-pressed="${state.transactionType === type}">${t(type)}</button>`).join("")}</div>
        ${transfer ? `<div class="inline-note" data-pnl-impact="false">${icon("info")}${t("transferRail")}</div>` : ""}
        <div id="quick-add-error" class="form-error" role="alert" hidden></div>
        <label class="amount-input"><span class="form-label">${t("amount")}</span><span><input id="quick-amount-input" inputmode="numeric" value="${draft("quick-amount-input")}" placeholder="0" required/><b>₫</b></span></label>
        <div class="form-grid">
          <label><span class="form-label">${transfer ? t("from") : t("account")}</span><select id="quick-account-input"><option ${selected("quick-account-input", "Vietcombank · •• 2486")}>Vietcombank · •• 2486</option><option ${selected("quick-account-input", "MoMo · •• 0901")}>MoMo · •• 0901</option></select></label>
          <label><span class="form-label">${transfer ? t("to") : t("category")}</span><select id="quick-category-input">${transfer ? "<option>MoMo · •• 0901</option><option>Techcombank · Savings</option>" : categories.map((category) => `<option>${category}</option>`).join("")}</select></label>
        </div>
        <div class="form-grid" style="margin-top:12px">
          <label><span class="form-label">${vi() ? "Ngày giao dịch" : "Transaction date"}</span><input id="quick-date-input" type="date" value="${draft("quick-date-input", "2026-11-01")}"/></label>
          <label><span class="form-label">${t("note")}</span><input id="quick-note-input" value="${draft("quick-note-input")}" placeholder="${vi() ? "Ví dụ: Bữa trưa" : "e.g. Lunch"}"/></label>
        </div>
        <p class="prototype-notice">${icon("info")}${vi() ? "Bản ghi chỉ tồn tại trong phiên prototype và sẽ cập nhật danh sách cùng tổng hôm nay." : "This entry exists only in the prototype session and updates the ledger and today's total."}</p>
        <footer class="modal-actions"><button class="secondary-button" data-action="close">${t("close")}</button><button class="primary-button" data-action="save-transaction">${t("save")}</button></footer>
      </section>
    </div>`;
  }

  function commitmentAddDialog() {
    const isInflow = state.commitmentDirection === "inflow";
    const isLoan = state.commitmentDirection === "debt-installment";
    const isTransfer = state.commitmentDirection === "saving-transfer";
    return `<div class="overlay centered" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button class="overlay-backdrop" data-action="close" tabindex="-1" aria-label="${t("close")}"></button>
      <section class="modal">
        <header class="dialog-header">
          <h2 id="dialog-title">${vi() ? "Tạo khoản thu / chi cố định hàng tháng" : "Create monthly fixed commitment"}</h2>
          <button class="icon-button" data-action="close" data-initial-focus aria-label="${t("close")}">${icon("close")}</button>
        </header>
        <div class="segmented transaction-types">
          ${[
            ["outflow", vi() ? "Chi cố định" : "Fixed expense"],
            ["inflow", vi() ? "Thu cố định" : "Fixed inflow"],
            ["debt-installment", vi() ? "Trả góp nợ" : "Loan installment"],
            ["saving-transfer", vi() ? "Tiết kiệm định kỳ" : "Savings transfer"],
          ]
            .map(
              ([val, label]) =>
                `<button class="${state.commitmentDirection === val ? "selected" : ""}" data-action="commitment-direction" data-value="${val}" aria-pressed="${state.commitmentDirection === val}">${label}</button>`,
            )
            .join("")}
        </div>
        <div class="inline-note" ${isTransfer || isLoan ? 'data-pnl-impact="false"' : ""}>
          ${icon("info")}
          <span>${
            isInflow
              ? vi()
                ? "Khoản thu cố định được đưa vào dự báo dòng tiền theo hệ số thận trọng (haircut)."
                : "Recurring inflows feed cash-flow forecasts using conservative confidence weights."
              : isLoan
                ? vi()
                  ? "Khoản trả góp ngân hàng liên kết hồ sơ nợ: Gốc giảm nợ (Non-P&L), chỉ Lãi/Phí tính vào Chi phí."
                  : "Linked to debt obligation: Principal reduces liability (Non-P&L); only interest/fees hit P&L."
                : isTransfer
                  ? vi()
                    ? "Trích lập tiết kiệm giữ chỗ trước trong Safe-to-spend nhưng là chuyển khoản nội bộ (Non-P&L)."
                    : "Reserves cash in Safe-to-spend but remains an internal transfer (Non-P&L)."
                  : vi()
                    ? "Khoản chi cố định được trừ trước khỏi Safe-to-spend và tự gợi ý khớp khi có giao dịch thực tế."
                    : "Reserved upfront from Safe-to-spend and auto-matched within tolerance."
          }</span>
        </div>
        <label class="field">
          <span class="form-label">${vi() ? "Tên khoản cố định hàng tháng" : "Commitment name"}</span>
          <input id="commit-name-input" value="${draft("commit-name-input")}" placeholder="${isInflow ? (vi() ? "Ví dụ: Lương tháng / Thu cho thuê nhà" : "e.g. Monthly salary") : vi() ? "Ví dụ: Phí quản lý chung cư / Học phí" : "e.g. Condo management fee"}"/>
        </label>
        <label class="amount-input">
          <span class="form-label">${vi() ? "Số tiền chuẩn mỗi kỳ" : "Standard monthly amount"}</span>
          <span><input id="commit-amount-input" inputmode="numeric" value="${draft("commit-amount-input")}" placeholder="1.500.000"/><b>₫</b></span>
        </label>
        <div class="form-grid">
          <label>
            <span class="form-label">${vi() ? "Tần suất & Ngày đến hạn" : "Cadence & Due day"}</span>
            <select id="commit-day-input">
              <option value="05" ${selected("commit-day-input", "05")}>${vi() ? "Hàng tháng · Ngày 05" : "Monthly · Day 05"}</option>
              <option value="10" ${selected("commit-day-input", "10")}>${vi() ? "Hàng tháng · Ngày 10" : "Monthly · Day 10"}</option>
              <option value="15" ${selected("commit-day-input", "15")}>${vi() ? "Hàng tháng · Ngày 15" : "Monthly · Day 15"}</option>
              <option value="25" ${selected("commit-day-input", "25")}>${vi() ? "Hàng tháng · Ngày 25" : "Monthly · Day 25"}</option>
              <option value="30" ${selected("commit-day-input", "30")}>${vi() ? "Cuối tháng (Xử lý tháng 2 tự động)" : "End of month (Feb-safe)"}</option>
            </select>
          </label>
          <label>
            <span class="form-label">${vi() ? "Biên độ dung sai khớp tự động" : "Auto-match tolerance"}</span>
            <select id="commit-tolerance-input">
              <option value="±0%" ${selected("commit-tolerance-input", "±0%")}>${vi() ? "Cố định tuyệt đối (±0%)" : "Exact amount (±0%)"}</option>
              <option value="±5%" ${selected("commit-tolerance-input", "±5%")}>${vi() ? "Biến động nhẹ (±5%)" : "Small variance (±5%)"}</option>
              <option value="±15%" ${selected("commit-tolerance-input", "±15%")}>${vi() ? "Hóa đơn theo mùa (±15%)" : "Utility variance (±15%)"}</option>
            </select>
          </label>
        </div>
        <div class="form-grid" style="margin-top:12px">
          <label>
            <span class="form-label">${vi() ? "Tài khoản thanh toán / nhận tiền" : "Account"}</span>
            <select id="commit-account-input">
              <option ${selected("commit-account-input", "Vietcombank · •• 2486")}>Vietcombank · •• 2486</option>
              <option ${selected("commit-account-input", "MoMo · •• 0901")}>MoMo · •• 0901</option>
              <option ${selected("commit-account-input", "Techcombank · Savings")}>Techcombank · Savings</option>
            </select>
          </label>
          <label>
            <span class="form-label">${vi() ? "Mức ưu tiên giữ tiền (STS)" : "Reservation priority"}</span>
            <select id="commit-priority-input">
              <option value="essential" ${selected("commit-priority-input", "essential")}>${vi() ? "Thiết yếu — Giữ tiền trước trong STS" : "Essential — Reserve in STS"}</option>
              <option value="flexible" ${selected("commit-priority-input", "flexible")}>${vi() ? "Linh hoạt — Chỉ nhắc lịch" : "Flexible — Reminder only"}</option>
            </select>
          </label>
        </div>
        <p class="prototype-notice">${icon("info")}${t("prototypeNotice")}</p>
        <footer class="modal-actions">
          <button class="secondary-button" data-action="close">${t("close")}</button>
          <button class="primary-button" data-action="save-commitment">${vi() ? "Lưu khoản cố định" : "Save fixed item"}</button>
        </footer>
      </section>
    </div>`;
  }

  function investmentAddDialog() {
    const trade = state.invActivityType === "buy" || state.invActivityType === "sell";
    const dividend = state.invActivityType === "dividend";
    const quote = trade
      ? calculateInvestmentAmounts({
          quantity: state.formDrafts["inv-qty-input"] || "100",
          mode: state.investmentEntryMode,
          unitPrice: state.formDrafts["inv-unit-price-input"] || "125000",
          gross: state.formDrafts["inv-amount-input"] || "12500000",
          fee: state.formDrafts["inv-fee-input"] || "0",
        })
      : null;
    const impactCopy = {
      buy: vi()
        ? "Mua chuyển tiền thành tài sản và tăng giá vốn; không phải chi phí sinh hoạt."
        : "A buy converts cash into an asset and increases cost basis; it is not a living expense.",
      sell: vi()
        ? "Bán giảm số lượng nắm giữ; chỉ lãi/lỗ đã chốt và phí/thuế tác động hiệu suất."
        : "A sale reduces quantity; only realized gain/loss and fees/taxes affect performance.",
      dividend: vi()
        ? "Cổ tức/lãi là thu nhập đầu tư; thuế khấu trừ được ghi riêng."
        : "Dividends/interest are investment income; withholding tax is recorded separately.",
      valuation: vi()
        ? "Định giá chỉ cập nhật giá thị trường và lãi/lỗ chưa chốt; không sửa giá mua."
        : "A valuation updates market value and unrealized P&L without changing purchase cost.",
    };
    return `<div class="overlay centered" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button class="overlay-backdrop" data-action="close" tabindex="-1" aria-label="${t("close")}"></button>
      <section class="modal">
        <header class="dialog-header">
          <h2 id="dialog-title">${vi() ? "Ghi nhật ký đầu tư / Thêm danh mục" : "Log investment activity / holding"}</h2>
          <button class="icon-button" data-action="close" data-initial-focus aria-label="${t("close")}">${icon("close")}</button>
        </header>
        <div class="segmented transaction-types">
          ${[
            ["buy", vi() ? "Mua (Buy)" : "Buy"],
            ["sell", vi() ? "Bán (Sell)" : "Sell"],
            ["dividend", vi() ? "Cổ tức / Lãi" : "Dividend"],
            ["valuation", vi() ? "Định giá thủ công" : "Manual price"],
          ]
            .map(
              ([val, label]) =>
                `<button class="${state.invActivityType === val ? "selected" : ""}" data-action="inv-activity-type" data-value="${val}" aria-pressed="${state.invActivityType === val}">${label}</button>`,
            )
            .join("")}
        </div>
        <div class="inline-note" data-pnl-impact="${dividend}">
          ${icon("info")}
          <span>${impactCopy[state.invActivityType]}</span>
        </div>
        <div id="investment-error" class="form-error" role="alert" hidden></div>
        <div class="form-grid">
          <label>
            <span class="form-label">${vi() ? "Loại tài sản" : "Asset class"}</span>
            <select id="inv-class-input">
              <option value="equity" ${selected("inv-class-input", "equity")}>${vi() ? "Cổ phiếu niêm yết (HOSE/HNX)" : "Listed equity (HOSE/HNX)"}</option>
              <option value="fund" ${selected("inv-class-input", "fund")}>${vi() ? "Chứng chỉ quỹ mở (Fund)" : "Mutual fund certificate"}</option>
              <option value="gold" ${selected("inv-class-input", "gold")}>${vi() ? "Vàng vật chất (Chỉ / Lượng)" : "Physical gold"}</option>
              <option value="bond" ${selected("inv-class-input", "bond")}>${vi() ? "Trái phiếu / Tiền gửi" : "Bond / Term deposit"}</option>
              <option value="crypto" ${selected("inv-class-input", "crypto")}>${vi() ? "Tài sản số (Crypto)" : "Crypto asset"}</option>
            </select>
          </label>
          <label>
            <span class="form-label">${vi() ? "Mã tài sản & Danh mục" : "Symbol & Portfolio"}</span>
            <input id="inv-symbol-input" value="${draft("inv-symbol-input")}" placeholder="${vi() ? "Ví dụ: VNM, MWG, VESAF, SJC" : "e.g. VNM, MWG, VESAF"}"/>
          </label>
        </div>
        ${
          trade
            ? `<div class="form-grid" style="margin-top:12px">
                <label><span class="form-label">${vi() ? "Số lượng (CP / CCQ / Chỉ)" : "Quantity"}</span><input id="inv-qty-input" inputmode="decimal" value="${draft("inv-qty-input", "100")}" placeholder="100"/></label>
                <label><span class="form-label">${vi() ? "Cách nhập giá" : "Price entry mode"}</span><select id="inv-entry-mode-input" data-action-change="investment-entry-mode"><option value="unit" ${state.investmentEntryMode === "unit" ? "selected" : ""}>${vi() ? "Nhập đơn giá" : "Enter unit price"}</option><option value="total" ${state.investmentEntryMode === "total" ? "selected" : ""}>${vi() ? "Nhập tổng giá trị" : "Enter gross total"}</option></select></label>
              </div>
              <div class="form-grid" style="margin-top:12px">
                <label><span class="form-label">${vi() ? "Đơn giá (₫ / đơn vị)" : "Unit price (₫ / unit)"}</span><input id="inv-unit-price-input" inputmode="numeric" value="${state.investmentEntryMode === "total" && quote?.ok ? escapeAttr(formatUnitPrice(quote.unitPriceMilliVnd).replace(" ₫", "")) : draft("inv-unit-price-input", "125.000")}" ${state.investmentEntryMode === "total" ? "readonly" : ""}/></label>
                <label><span class="form-label">${vi() ? "Tổng giá trị chưa phí/thuế" : "Gross total before fees/tax"}</span><input id="inv-amount-input" inputmode="numeric" value="${state.investmentEntryMode === "unit" && quote?.ok ? escapeAttr(formatVnd(quote.grossVnd).replace(" ₫", "")) : draft("inv-amount-input", "12.500.000")}" ${state.investmentEntryMode === "unit" ? "readonly" : ""}/></label>
              </div>`
            : `<div class="form-grid" style="margin-top:12px">
                <label><span class="form-label">${dividend ? (vi() ? "Số tiền cổ tức/lãi gộp" : "Gross dividend/interest") : vi() ? "Giá thị trường mỗi đơn vị" : "Market price per unit"}</span><input id="inv-amount-input" inputmode="numeric" value="${draft("inv-amount-input")}" placeholder="1.000.000"/></label>
                <label><span class="form-label">${vi() ? "Ngày hiệu lực / định giá" : "Effective / valuation date"}</span><input id="inv-date-input" type="date" value="${draft("inv-date-input", "2026-11-01")}"/></label>
              </div>`
        }
        <div class="form-grid" style="margin-top:12px">
          <label>
            <span class="form-label">${vi() ? "Tài khoản tiền đối ứng" : "Settlement cash account"}</span>
            <select id="inv-settlement-input">
              <option ${selected("inv-settlement-input", "TCBS Brokerage Cash")}>TCBS Brokerage Cash</option>
              <option ${selected("inv-settlement-input", "Vietcombank · •• 2486")}>Vietcombank · •• 2486</option>
            </select>
          </label>
          <label>
            <span class="form-label">${dividend ? (vi() ? "Thuế khấu trừ" : "Withholding tax") : vi() ? "Phí & Thuế giao dịch" : "Fee & Tax"}</span>
            <input id="inv-fee-input" inputmode="numeric" value="${draft("inv-fee-input", "0")}" placeholder="15.000"/>
          </label>
        </div>
        ${
          quote?.ok
            ? `<div class="calculation-preview" aria-live="polite"><span>${vi() ? "Đơn giá" : "Unit price"}<strong>${formatUnitPrice(quote.unitPriceMilliVnd)}</strong></span><span>${vi() ? "Giá trị gộp" : "Gross value"}<strong>${formatVnd(quote.grossVnd)}</strong></span><span>${state.invActivityType === "buy" ? (vi() ? "Tiền thanh toán" : "Cash paid") : vi() ? "Tiền thu sau phí/thuế" : "Net proceeds"}<strong>${formatVnd(state.invActivityType === "sell" ? quote.grossVnd - quote.feeVnd : quote.cashVnd)}</strong></span></div>`
            : ""
        }
        <p class="prototype-notice">${icon("info")}${t("prototypeNotice")}</p>
        <footer class="modal-actions">
          <button class="secondary-button" data-action="close">${t("close")}</button>
          <button class="primary-button" data-action="save-investment">${vi() ? "Lưu vào danh mục đầu tư" : "Save investment entry"}</button>
        </footer>
      </section>
    </div>`;
  }

  function debtAddDialog() {
    const isRec = state.debtDirection === "receivable";
    return `<div class="overlay centered" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <button class="overlay-backdrop" data-action="close" tabindex="-1" aria-label="${t("close")}"></button>
      <section class="modal">
        <header class="dialog-header">
          <h2 id="dialog-title">${vi() ? "Thêm hồ sơ Công nợ / Khoản phải thu" : "Add Payable / Receivable Profile"}</h2>
          <button class="icon-button" data-action="close" data-initial-focus aria-label="${t("close")}">${icon("close")}</button>
        </header>
        <div class="segmented transaction-types">
          ${[
            ["payable", vi() ? "Khoản phải trả" : "Payable (Debt)"],
            ["receivable", vi() ? "Khoản phải thu" : "Receivable (Loan to other)"],
          ]
            .map(
              ([val, label]) =>
                `<button class="${state.debtDirection === val ? "selected" : ""}" data-action="debt-direction" data-value="${val}" aria-pressed="${state.debtDirection === val}">${label}</button>`,
            )
            .join("")}
        </div>
        <div class="inline-note" data-pnl-impact="false">
          ${icon("info")}
          <span>${vi() ? "Giải ngân hoặc thu/trả tiền gốc chỉ làm thay đổi tài sản và nghĩa vụ, không tính vào Thu/Chi. Chỉ lãi và phí mới tác động Thu/Chi." : "Disbursement and principal repayment/collection are balance-sheet movements (Non-P&L)."}</span>
        </div>
        <div id="debt-error" class="form-error" role="alert" hidden></div>
        <label class="field">
          <span class="form-label">${vi() ? "Bên đối ứng / Tên khoản nợ" : "Counterparty / Obligation title"}</span>
          <input id="debt-title-input" value="${draft("debt-title-input")}" placeholder="${isRec ? (vi() ? "Ví dụ: Cho Hoàng vay ngắn hạn" : "e.g. Personal loan to Hoang") : vi() ? "Ví dụ: Vay trả góp mua Macbook" : "e.g. Laptop installment loan"}"/>
        </label>
        <div class="form-grid" style="margin-top:12px">
          <label>
            <span class="form-label">${vi() ? "Số tiền gốc" : "Principal amount"}</span>
            <input id="debt-principal-input" inputmode="numeric" value="${draft("debt-principal-input")}" placeholder="15.000.000 ₫"/>
          </label>
          <label>
            <span class="form-label">${isRec ? (vi() ? "Xác suất thu hồi ước tính (%)" : "Estimated recovery probability (%)") : vi() ? "Lãi suất (%/năm)" : "Interest rate (% APR)"}</span>
            <input id="debt-rate-input" inputmode="decimal" value="${draft("debt-rate-input", isRec ? "80" : "")}" placeholder="${isRec ? "80%" : "8,5%/năm"}"/>
          </label>
        </div>
        <div class="form-grid" style="margin-top:12px">
          <label><span class="form-label">${vi() ? "Ngày đến hạn" : "Due date"}</span><input id="debt-due-date-input" type="date" value="${draft("debt-due-date-input", "2026-11-30")}"/></label>
          <label><span class="form-label">${vi() ? "Lịch nhắc" : "Reminder schedule"}</span><select id="debt-reminder-input"><option value="7,3,1,0" ${selected("debt-reminder-input", "7,3,1,0")}>${vi() ? "7, 3, 1 ngày trước và ngày đến hạn" : "7, 3, 1 days before and on due date"}</option><option value="3,1,0" ${selected("debt-reminder-input", "3,1,0")}>${vi() ? "3, 1 ngày trước và ngày đến hạn" : "3, 1 days before and on due date"}</option><option value="off" ${selected("debt-reminder-input", "off")}>${vi() ? "Không nhắc" : "Off"}</option></select></label>
        </div>
        ${
          isRec
            ? `<div class="calculation-preview"><span>${vi() ? "Giá trị thu hồi ước tính" : "Estimated recoverable value"}<strong id="debt-erv-preview">${(() => {
                const result = buildReceivableDraft(
                  state.formDrafts["debt-principal-input"] ?? "",
                  state.formDrafts["debt-rate-input"] ?? "80",
                );
                return result.preview;
              })()}</strong></span></div>`
            : ""
        }
        <p class="prototype-notice">${icon("info")}${t("prototypeNotice")}</p>
        <footer class="modal-actions">
          <button class="secondary-button" data-action="close">${t("close")}</button>
          <button class="primary-button" data-action="save-debt">${vi() ? "Lưu hồ sơ công nợ" : "Save obligation"}</button>
        </footer>
      </section>
    </div>`;
  }

  /* ==========================================================================
   * RENDER, FOCUS MANAGEMENT & EVENT HANDLERS
   * ========================================================================== */
  function render({ focusMain = false } = {}) {
    document.documentElement.lang = state.locale;
    document.documentElement.dataset.theme = state.theme;
    document.querySelector('meta[name="theme-color"]').content =
      state.theme === "dark" ? "#0d1714" : "#f5f7f3";
    document.querySelector(".skip-link").textContent = t("skip");
    root.innerHTML = shell();
    if (state.dialog)
      requestAnimationFrame(() => root.querySelector("[data-initial-focus]")?.focus());
    if (focusMain) requestAnimationFrame(() => document.querySelector("#main-content")?.focus());
  }
  function setView(view) {
    state.view = view;
    persist("view", view);
    if (view !== "more") location.hash = view;
    render({ focusMain: true });
  }
  function focusReturnControl() {
    if (!state.returnFocusId) return;
    requestAnimationFrame(() => document.getElementById(state.returnFocusId)?.focus());
  }
  function openDialog(dialog, control) {
    state.returnFocusId = returnFocusId(dialog, control.dataset.surface);
    if (control.dataset.derived) state.derivedKey = control.dataset.derived;
    state.dialog = dialog;
    render();
  }
  function closeDialog() {
    state.dialog = null;
    render();
    focusReturnControl();
  }
  function toast(message, restoreFocus = false) {
    state.toast = message;
    render();
    if (restoreFocus) focusReturnControl();
    window.setTimeout(() => {
      state.toast = null;
      render();
      if (restoreFocus) focusReturnControl();
    }, 2600);
  }

  function showFormError(id, message) {
    const error = root.querySelector(`#${id}`);
    if (!error) return;
    error.hidden = false;
    error.textContent = message;
    error.focus?.();
  }

  root.addEventListener("input", (event) => {
    const control = event.target;
    if (control?.id) state.formDrafts[control.id] = control.value;
    if (["debt-principal-input", "debt-rate-input"].includes(control?.id)) {
      const preview = root.querySelector("#debt-erv-preview");
      if (!preview) return;
      const result = buildReceivableDraft(
        root.querySelector("#debt-principal-input")?.value ?? "",
        root.querySelector("#debt-rate-input")?.value ?? "",
      );
      preview.textContent = result.preview;
    }
  });

  root.addEventListener("change", (event) => {
    const control = event.target;
    if (control?.id) state.formDrafts[control.id] = control.value;
    if (control?.dataset.actionChange === "investment-entry-mode") {
      state.formDrafts["inv-unit-price-input"] =
        root.querySelector("#inv-unit-price-input")?.value || "";
      state.formDrafts["inv-amount-input"] = root.querySelector("#inv-amount-input")?.value || "";
      state.investmentEntryMode = control.value;
      render();
      return;
    }
    if (
      [
        "inv-qty-input",
        "inv-unit-price-input",
        "inv-amount-input",
        "inv-fee-input",
        "debt-principal-input",
        "debt-rate-input",
      ].includes(control?.id)
    ) {
      render();
      return;
    }
    if (control?.id === "notify-debt-enabled")
      state.notificationSettings.debtReminder = control.checked;
    if (control?.id === "notify-daily-enabled")
      state.notificationSettings.dailyCapture = control.checked;
    if (control?.id === "notify-daily-time")
      state.notificationSettings.dailyCaptureTime = control.value;
    if (control?.id === "notify-channel") state.notificationSettings.channel = control.value;
    if (control?.id?.startsWith("notify-"))
      toast(
        vi()
          ? "Đã lưu cấu hình nhắc trong phiên prototype."
          : "Reminder setting saved for this prototype session.",
      );
  });

  root.addEventListener("click", (event) => {
    const control = event.target.closest("button");
    if (!control) return;
    if (control.dataset.view) return setView(control.dataset.view);
    if (control.dataset.locale) {
      state.locale = control.dataset.locale;
      persist("locale", state.locale);
      return render();
    }
    switch (control.dataset.action) {
      case "theme":
        state.theme = state.theme === "light" ? "dark" : "light";
        persist("theme", state.theme);
        render();
        break;
      case "home-sub":
        state.homeSub = control.dataset.value;
        render();
        break;
      case "tx-sub":
        state.txSub = control.dataset.value;
        render();
        break;
      case "open-commitments":
        state.txSub = "commitments";
        setView("transactions");
        break;
      case "commitment-filter":
        state.commitmentFilter = control.dataset.value;
        render();
        break;
      case "commitment-direction":
        state.commitmentDirection = control.dataset.value;
        render();
        break;
      case "acc-sub":
        state.accSub = control.dataset.value;
        render();
        break;
      case "inv-sub":
        state.invSub = control.dataset.value;
        render();
        break;
      case "inv-activity-type":
        state.invActivityType = control.dataset.value;
        render();
        break;
      case "debt-sub":
        state.debtSub = control.dataset.value;
        render();
        break;
      case "debt-direction":
        state.debtDirection = control.dataset.value;
        delete state.formDrafts["debt-rate-input"];
        render();
        break;
      case "sim-extra":
        state.simExtra = control.dataset.value;
        render();
        break;
      case "plan-sub":
        state.planSub = control.dataset.value;
        render();
        break;
      case "jump-suggestions":
        state.planSub = "suggestions";
        setView("plan");
        break;
      case "forecast-scenario":
        state.forecastScenario = control.dataset.value;
        render();
        break;
      case "rep-sub":
        state.repSub = control.dataset.value;
        render();
        break;
      case "set-sub":
        state.setSub = control.dataset.value;
        render();
        break;
      case "quick-add":
        openDialog("quick-add", control);
        break;
      case "commitment-add":
        openDialog("commitment-add", control);
        break;
      case "investment-add":
        openDialog("investment-add", control);
        break;
      case "debt-add":
        openDialog("debt-add", control);
        break;
      case "explain":
        openDialog("explain", control);
        break;
      case "close":
        closeDialog();
        break;
      case "review-filter":
        state.reviewBucket = control.dataset.value;
        render();
        break;
      case "transaction-type":
        state.transactionType = control.dataset.value;
        render();
        break;
      case "save-transaction": {
        const amount = parseVnd(root.querySelector("#quick-amount-input")?.value);
        if (amount === null || amount <= 0n) {
          showFormError(
            "quick-add-error",
            vi() ? "Nhập số tiền lớn hơn 0." : "Enter an amount greater than zero.",
          );
          break;
        }
        const account =
          root.querySelector("#quick-account-input")?.value || "Vietcombank · •• 2486";
        const category = root.querySelector("#quick-category-input")?.value || "Khác";
        const note = escapeHtml(root.querySelector("#quick-note-input")?.value?.trim());
        const date = root.querySelector("#quick-date-input")?.value || todayCashflowSummary.date;
        const isIncome = state.transactionType === "income";
        const isTransfer = state.transactionType === "transfer";
        state.customTransactions.unshift({
          id: `session-tx-${Date.now()}`,
          kind: state.transactionType,
          pnlImpact: !isTransfer,
          state: "posted",
          date,
          time: "21:00",
          titleVi:
            note ||
            (isTransfer
              ? "Chuyển khoản nội bộ"
              : isIncome
                ? "Khoản thu vừa ghi"
                : "Khoản chi vừa ghi"),
          titleEn:
            note ||
            (isTransfer ? "Internal transfer" : isIncome ? "Logged income" : "Logged expense"),
          account: isTransfer ? `${account} → ${category}` : account,
          categoryVi: isTransfer ? "Chuyển khoản nội bộ (Không tính Thu/Chi)" : category,
          categoryEn: isTransfer ? "Internal transfer (Excluded from P&L)" : category,
          amount: isTransfer ? formatVnd(amount) : signedVnd(amount, isIncome),
        });
        state.formDrafts = {};
        state.dialog = null;
        state.txSub = "ledger";
        state.view = "transactions";
        location.hash = "transactions";
        toast(
          isTodayTransaction(date, todayCashflowSummary.date)
            ? vi()
              ? "Đã thêm giao dịch vào phiên prototype và cập nhật tổng hôm nay."
              : "Transaction added to this prototype session and today's total updated."
            : vi()
              ? "Đã thêm giao dịch ngày trước vào sổ; tổng hôm nay không thay đổi."
              : "Past-date transaction added to the ledger; today's total is unchanged.",
          true,
        );
        break;
      }
      case "save-commitment": {
        const nameInput = root.querySelector("#commit-name-input")?.value?.trim();
        const amountInput =
          root.querySelector("#commit-amount-input")?.value?.trim() || "1.500.000";
        const dueDay = root.querySelector("#commit-day-input")?.value || "10";
        const tolerance = root.querySelector("#commit-tolerance-input")?.value || "±5%";
        const account =
          root.querySelector("#commit-account-input")?.value || "Vietcombank · •• 2486";
        const priority = root.querySelector("#commit-priority-input")?.value || "essential";
        const parsedAmount = parseVnd(amountInput);
        if (parsedAmount === null || parsedAmount <= 0n) {
          toast(
            vi() ? "Nhập số tiền chuẩn lớn hơn 0." : "Enter a standard amount greater than zero.",
          );
          break;
        }
        const isInflow = state.commitmentDirection === "inflow";
        const title = escapeHtml(
          nameInput ||
            (isInflow
              ? vi()
                ? "Khoản thu định kỳ mới"
                : "New recurring inflow"
              : vi()
                ? "Khoản chi cố định mới"
                : "New fixed commitment"),
        );
        state.customCommitments.unshift({
          id: `custom-commit-${Date.now()}`,
          direction: isInflow ? "inflow" : "outflow",
          kind:
            state.commitmentDirection === "inflow"
              ? "recurring-income"
              : state.commitmentDirection === "outflow"
                ? "fixed-expense"
                : state.commitmentDirection,
          pnlImpact: commitmentPnlImpact(state.commitmentDirection),
          essential: isEssentialCommitmentPriority(priority),
          dueDay,
          cadenceVi: `Hàng tháng · Ngày ${dueDay}`,
          cadenceEn: `Monthly · Day ${dueDay}`,
          titleVi: title,
          titleEn: title,
          account,
          tolerance: `${tolerance} · Vừa tạo trong phiên`,
          amount: signedVnd(parsedAmount, isInflow),
          statusKey: "forecast",
          state: "forecast",
        });
        state.formDrafts = {};
        state.dialog = null;
        state.txSub = "commitments";
        state.view = "transactions";
        location.hash = "transactions";
        toast(
          vi()
            ? "Đã thêm bản nháp cam kết vào phiên; chưa post giao dịch thật."
            : "Commitment draft added for this session; no real transaction was posted.",
          true,
        );
        break;
      }
      case "save-investment": {
        const symbol =
          root.querySelector("#inv-symbol-input")?.value?.trim().toUpperCase() || "VNM";
        if (!/^[A-Z0-9._-]{1,30}$/.test(symbol)) {
          showFormError(
            "investment-error",
            vi()
              ? "Mã tài sản chỉ được gồm chữ, số, dấu chấm, gạch ngang hoặc gạch dưới."
              : "Symbol may contain only letters, numbers, dots, hyphens, or underscores.",
          );
          break;
        }
        const assetClass = root.querySelector("#inv-class-input")?.value || "equity";
        const qty = root.querySelector("#inv-qty-input")?.value?.trim() || "";
        const amountInput = root.querySelector("#inv-amount-input")?.value?.trim() || "";
        const feeInput = root.querySelector("#inv-fee-input")?.value?.trim() || "0";
        const trade = state.invActivityType === "buy" || state.invActivityType === "sell";
        const quote = trade
          ? calculateInvestmentAmounts({
              quantity: qty,
              mode: state.investmentEntryMode,
              unitPrice: root.querySelector("#inv-unit-price-input")?.value,
              gross: amountInput,
              fee: feeInput,
            })
          : null;
        const simpleAmount = parseVnd(amountInput);
        const simpleFee = parseVnd(feeInput) ?? 0n;
        if (
          (trade &&
            (!quote?.ok || (state.invActivityType === "sell" && quote.feeVnd > quote.grossVnd))) ||
          (!trade &&
            (simpleAmount === null ||
              simpleAmount <= 0n ||
              simpleFee < 0n ||
              simpleFee > simpleAmount))
        ) {
          showFormError(
            "investment-error",
            vi()
              ? "Kiểm tra số lượng, giá trị và phí. Các giá trị phải hợp lệ và lớn hơn 0."
              : "Check quantity, value, and fees. Values must be valid and greater than zero.",
          );
          break;
        }
        const activityEffect = investmentActivityEffect(state.invActivityType);
        const effectiveDate = root.querySelector("#inv-date-input")?.value || "2026-11-01";
        if (activityEffect?.createsHoldingDraft) {
          state.customHoldings.unshift({
            id: `custom-hold-${Date.now()}`,
            symbol,
            assetClass,
            assetLabelVi: "Vị thế chờ xác nhận giá thị trường",
            assetLabelEn: "Position awaiting market-price confirmation",
            portfolio: "TCBS Tích sản",
            quantity: qty,
            costBasis: `${formatVnd(quote.grossVnd)} + phí ${formatVnd(quote.feeVnd)}`,
            marketPrice: "Chưa có giá thị trường",
            marketValue: "Chưa định giá",
            unrealizedPnl: "Chưa tính",
            sourceVi: "Bản nháp trong phiên · Chưa có provider snapshot",
            sourceEn: "Session draft · No provider snapshot",
            valuationMode: "manual",
            doubleCountProtected: false,
            state: "pending",
          });
        }
        if (state.invActivityType === "valuation") {
          state.customValuations = recordManualValuation(
            state.customValuations,
            symbol,
            simpleAmount,
            effectiveDate,
          );
          const hasHolding = [...investmentHoldings, ...state.customHoldings].some(
            (holding) => holding.symbol === symbol,
          );
          if (!hasHolding) {
            state.customHoldings.unshift({
              id: `custom-valuation-${Date.now()}`,
              symbol,
              assetClass,
              assetLabelVi: "Snapshot định giá chờ ghép vị thế",
              assetLabelEn: "Valuation snapshot awaiting position match",
              portfolio: "Chưa ghép danh mục",
              quantity: "Chưa xác nhận",
              costBasis: "Không thay đổi",
              marketPrice: formatVnd(simpleAmount),
              marketValue: "Chờ đối chiếu số lượng",
              unrealizedPnl: "Chưa tính",
              sourceVi: `Snapshot thủ công ${effectiveDate} · Chờ xác nhận`,
              sourceEn: `Manual snapshot ${effectiveDate} · Awaiting confirmation`,
              valuationMode: "manual",
              doubleCountProtected: false,
              state: "estimated",
            });
          }
        }
        const gross = trade ? quote.grossVnd : simpleAmount;
        const net =
          state.invActivityType === "sell" || state.invActivityType === "dividend"
            ? gross - simpleFee
            : state.invActivityType === "buy"
              ? gross + simpleFee
              : gross;
        const activityTitles = {
          buy: [
            `MUA ${qty} ${symbol} @ ${formatUnitPrice(quote?.unitPriceMilliVnd ?? 0n)}`,
            `BUY ${qty} ${symbol}`,
          ],
          sell: [
            `BÁN ${qty} ${symbol} @ ${formatUnitPrice(quote?.unitPriceMilliVnd ?? 0n)}`,
            `SELL ${qty} ${symbol}`,
          ],
          dividend: [`CỔ TỨC / LÃI ${symbol}`, `DIVIDEND / INTEREST ${symbol}`],
          valuation: [`ĐỊNH GIÁ THỦ CÔNG ${symbol}`, `MANUAL VALUATION ${symbol}`],
        };
        state.customActivities.unshift({
          id: `custom-act-${Date.now()}`,
          kind: state.invActivityType,
          pnlImpact: activityEffect?.pnlImpact ?? false,
          symbol,
          date: effectiveDate.split("-").reverse().join("/"),
          titleVi: activityTitles[state.invActivityType][0],
          titleEn: activityTitles[state.invActivityType][1],
          metaVi:
            state.invActivityType === "buy"
              ? `Giá trị ${formatVnd(gross)} · Phí ${formatVnd(simpleFee)} · Bản nháp chờ xác nhận`
              : state.invActivityType === "sell"
                ? `Tiền thu ròng ${formatVnd(net)} · Chưa tính realized P&L cho đến khi khớp vị thế`
                : state.invActivityType === "dividend"
                  ? `Thu nhập đầu tư ròng ${formatVnd(net)} · Thuế ${formatVnd(simpleFee)}`
                  : "Snapshot giá thủ công đang chờ ghép số lượng; không sửa giá vốn",
          metaEn:
            state.invActivityType === "valuation"
              ? "Manual price snapshot awaits quantity matching; cost basis is unchanged"
              : "Session draft with separate gross value and fees/tax",
          amount: formatVnd(net),
          state: "pending",
        });
        state.formDrafts = {};
        state.dialog = null;
        state.invSub = "activity";
        state.view = "investments";
        location.hash = "investments";
        toast(t("savedFeedback"), true);
        break;
      }
      case "save-debt": {
        const title = escapeHtml(
          root.querySelector("#debt-title-input")?.value?.trim() ||
            (state.debtDirection === "receivable" ? "Khoản phải thu mới" : "Khoản vay mới"),
        );
        const principalInput = root.querySelector("#debt-principal-input")?.value?.trim();
        const principalVnd = parseVnd(principalInput);
        const rate = root.querySelector("#debt-rate-input")?.value?.trim();
        const dueDate = root.querySelector("#debt-due-date-input")?.value || "2026-11-30";
        const dueDisplay = dueDate.split("-").reverse().join("/");
        const reminderSchedule = root.querySelector("#debt-reminder-input")?.value || "7,3,1,0";
        if (principalVnd === null || principalVnd <= 0n) {
          showFormError(
            "debt-error",
            vi() ? "Nhập số tiền gốc lớn hơn 0." : "Enter principal greater than zero.",
          );
          break;
        }
        const principal = formatVnd(principalVnd);
        if (state.debtDirection === "receivable") {
          const erv = buildReceivableDraft(principalInput, rate);
          if (!erv.ok) {
            showFormError(
              "debt-error",
              vi()
                ? "Xác suất thu hồi phải từ 0% đến 100%."
                : "Recovery probability must be between 0% and 100%.",
            );
            break;
          }
          state.customDebts.unshift({
            id: `custom-rec-${Date.now()}`,
            direction: "receivable",
            counterpartyVi: title,
            counterpartyEn: title,
            grossPrincipal: principal,
            recoveryProbability: `${Number(erv.probabilityBps) / 100}%`,
            estimatedRecoverable: formatVnd(erv.estimatedRecoverable),
            dueDate: dueDisplay,
            reminderSchedule,
            principalPnlImpact: false,
            state: "estimated",
          });
          state.debtSub = "receivables";
        } else {
          state.customDebts.unshift({
            id: `custom-pay-${Date.now()}`,
            direction: "payable",
            counterpartyVi: title,
            counterpartyEn: title,
            originalPrincipal: principal,
            outstandingPrincipal: principal,
            rate: escapeHtml(rate || "Chưa nhập lãi suất"),
            nextInstallment: "Bản nháp — cần nhập lịch và tách Gốc/Lãi/Phí trước khi post",
            dueDate: dueDisplay,
            reminderSchedule,
            principalPnlImpact: false,
            state: "pending",
          });
          state.debtSub = "payables";
        }
        state.formDrafts = {};
        state.dialog = null;
        state.view = "debts";
        location.hash = "debts";
        toast(t("savedFeedback"), true);
        break;
      }
      case "google-sign-in":
        state.view = "home";
        location.hash = "home";
        toast(
          vi()
            ? "Đăng nhập Google thành công trong prototype; không có OAuth thật được gọi."
            : "Google sign-in succeeded in the prototype; no real OAuth request was made.",
          true,
        );
        break;
      default:
        if (control.dataset.demo)
          toast(
            vi()
              ? "Đây là hành động xem trước; prototype chưa thực hiện thay đổi thật."
              : "This is a preview action; the prototype made no real change.",
          );
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (shouldOpenGlobalSearch(Boolean(state.dialog))) {
        document.querySelector(".search-box input")?.focus();
      }
    }
    if (event.key === "Escape" && state.dialog) closeDialog();
    if (event.key === "Tab" && state.dialog) {
      const focusable = [
        ...root.querySelectorAll(
          '.overlay button:not([tabindex="-1"]), .overlay input, .overlay select',
        ),
      ];
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window.addEventListener("hashchange", () => {
    const target = location.hash.slice(1);
    if (prototypeViews.includes(target) && target !== state.view) {
      state.view = target;
      render();
    }
  });

  render();
})();
