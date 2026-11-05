"use client";

import { useEffect, useRef, useState } from "react";
import {
  desktopNavigationIds,
  financialStateClass,
  getReviewRecords,
  prototypeLocales,
  type ReviewBucket,
} from "./prototype-model";

type Locale = "vi" | "en";
type View = "home" | "review" | "transactions" | "accounts" | "plan" | "system" | "more";
type Theme = "light" | "dark";

const copy = {
  vi: {
    greeting: "Chào buổi sáng, Nam",
    calm: "Bức tranh tiền bạc của bạn đang ổn định.",
    search: "Tìm giao dịch, tài khoản...",
    quickAdd: "Ghi giao dịch",
    home: "Hôm nay",
    review: "Cần xem lại",
    transactions: "Giao dịch",
    accounts: "Tài khoản",
    plan: "Kế hoạch",
    reports: "Báo cáo",
    system: "Hệ thống UI",
    settings: "Cài đặt",
    safe: "Có thể chi an toàn",
    estimate: "Ước tính",
    nextIncome: "đến kỳ thu nhập tiếp theo",
    updated: "Cập nhật 08:30 hôm nay",
    explain: "Xem cách tính",
    cashFlow: "Dòng tiền 30 ngày",
    baseScenario: "Kịch bản cơ sở",
    lowest: "Điểm thấp nhất dự kiến",
    upcoming: "Sắp đến hạn",
    seeAll: "Xem tất cả",
    rent: "Tiền thuê nhà",
    internet: "Internet",
    debt: "Khoản vay ngân hàng",
    days: "ngày nữa",
    inbox: "3 mục cần bạn xác nhận",
    inboxHint: "Không có mục khẩn cấp quá hạn.",
    reviewNow: "Xem lại ngay",
    netWorth: "Tài sản ròng",
    thisMonth: "+2,4% tháng này",
    source: "Nguồn & độ mới",
    liquid: "Tiền khả dụng",
    inflow: "Thu dự kiến (thận trọng)",
    commitments: "Cam kết & nghĩa vụ",
    buffer: "Khoản đệm tối thiểu",
    horizon: "Phạm vi: đến 15/11/2026",
    version: "Công thức STS v1.0 · Dữ liệu 08:30",
    close: "Đóng",
    reviewTitle: "Cần xem lại",
    reviewSubtitle: "Xác nhận những mục có thể ảnh hưởng đến bức tranh tài chính.",
    transferCandidate: "Có thể là chuyển khoản",
    transferHelp: "Chuyển giữa hai tài khoản của bạn — không phải chi tiêu.",
    duplicate: "Có thể trùng lặp",
    duplicateHelp: "Hai giao dịch cùng số tiền và thời điểm gần nhau.",
    variance: "Khác cam kết dự kiến",
    varianceHelp: "Khoản trả ngân hàng cao hơn dự kiến 120.000 ₫.",
    confirmTransfer: "Xác nhận chuyển khoản",
    inspect: "Kiểm tra",
    accountsTitle: "Tài khoản",
    accountsSubtitle: "Số dư có nguồn và thời điểm rõ ràng.",
    totalAssets: "Tổng tài sản",
    bankAccount: "Tài khoản thanh toán",
    savings: "Tiết kiệm",
    wallet: "Ví điện tử",
    reconciled: "Đã đối chiếu",
    manual: "Nhập thủ công",
    planTitle: "Kế hoạch an toàn",
    planSubtitle: "Giữ đủ cho nghĩa vụ trước khi lên kế hoạch chi linh hoạt.",
    reserved: "Đã dành cho cam kết",
    flexible: "Chi linh hoạt còn lại",
    forecast: "Dự báo không phải cam kết. Bạn có thể xem và đổi từng giả định.",
    foundationTitle: "Nền tảng giao diện",
    foundationSubtitle: "Token và component dùng chung cho trải nghiệm bình tĩnh, rõ ràng.",
    colors: "Màu sắc",
    typography: "Kiểu chữ",
    components: "Component cốt lõi",
    states: "Trạng thái dữ liệu",
    complete: "Đầy đủ",
    stale: "Cũ",
    missing: "Thiếu dữ liệu",
    pending: "Chờ xác nhận",
    posted: "Đã ghi sổ",
    offline: "Ngoại tuyến",
    addTitle: "Ghi giao dịch",
    expense: "Chi tiêu",
    income: "Thu nhập",
    transfer: "Chuyển khoản",
    amount: "Số tiền",
    account: "Tài khoản",
    category: "Danh mục",
    note: "Ghi chú (không bắt buộc)",
    saveDraft: "Lưu bản nháp",
    save: "Lưu giao dịch",
    transferRail: "Chuyển khoản không được tính là thu nhập hoặc chi tiêu.",
  },
  en: {
    greeting: "Good morning, Nam",
    calm: "Your money picture looks steady today.",
    search: "Search transactions, accounts...",
    quickAdd: "Add transaction",
    home: "Today",
    review: "To review",
    transactions: "Transactions",
    accounts: "Accounts",
    plan: "Plan",
    reports: "Reports",
    system: "UI system",
    settings: "Settings",
    safe: "Safe to spend",
    estimate: "Estimate",
    nextIncome: "until your next income",
    updated: "Updated 08:30 today",
    explain: "See calculation",
    cashFlow: "30-day cash flow",
    baseScenario: "Base scenario",
    lowest: "Projected low point",
    upcoming: "Due soon",
    seeAll: "See all",
    rent: "Home rent",
    internet: "Internet",
    debt: "Bank loan",
    days: "days",
    inbox: "3 items need your confirmation",
    inboxHint: "No overdue critical items.",
    reviewNow: "Review now",
    netWorth: "Net worth",
    thisMonth: "+2.4% this month",
    source: "Source & freshness",
    liquid: "Eligible liquid cash",
    inflow: "Expected income (conservative)",
    commitments: "Commitments & obligations",
    buffer: "Minimum cash buffer",
    horizon: "Horizon: until Nov 15, 2026",
    version: "STS formula v1.0 · Data at 08:30",
    close: "Close",
    reviewTitle: "To review",
    reviewSubtitle: "Confirm items that may affect your financial picture.",
    transferCandidate: "Possible transfer",
    transferHelp: "Between two of your accounts — not an expense.",
    duplicate: "Possible duplicate",
    duplicateHelp: "Two transactions have the same amount and nearby times.",
    variance: "Different from commitment",
    varianceHelp: "The bank payment is 120,000 ₫ above the expected amount.",
    confirmTransfer: "Confirm transfer",
    inspect: "Inspect",
    accountsTitle: "Accounts",
    accountsSubtitle: "Balances with a clear source and timestamp.",
    totalAssets: "Total assets",
    bankAccount: "Everyday account",
    savings: "Savings",
    wallet: "E-wallet",
    reconciled: "Reconciled",
    manual: "Manual",
    planTitle: "A safer plan",
    planSubtitle: "Reserve obligations before planning flexible spending.",
    reserved: "Reserved for commitments",
    flexible: "Flexible spending left",
    forecast: "Forecasts are not promises. You can inspect and change every assumption.",
    foundationTitle: "Interface foundation",
    foundationSubtitle: "Shared tokens and components for a calm, clear experience.",
    colors: "Color",
    typography: "Typography",
    components: "Core components",
    states: "Data states",
    complete: "Complete",
    stale: "Stale",
    missing: "Missing data",
    pending: "Pending review",
    posted: "Posted",
    offline: "Offline",
    addTitle: "Add transaction",
    expense: "Expense",
    income: "Income",
    transfer: "Transfer",
    amount: "Amount",
    account: "Account",
    category: "Category",
    note: "Note (optional)",
    saveDraft: "Save draft",
    save: "Save transaction",
    transferRail: "Transfers are not counted as income or expense.",
  },
} as const;

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    review: (
      <>
        <path d="M6 3h12l2 4v13H4V7l2-4Z" />
        <path d="M4 8h5l1.5 3h3L15 8h5" />
      </>
    ),
    arrows: (
      <>
        <path d="M7 7h11l-3-3" />
        <path d="m18 7-3 3" />
        <path d="M17 17H6l3 3" />
        <path d="m6 17 3-3" />
      </>
    ),
    wallet: (
      <>
        <path d="M3 6h15a2 2 0 0 1 2 2v10H3V6Z" />
        <path d="M3 6V5a2 2 0 0 1 2-2h12" />
        <path d="M16 11h4v4h-4a2 2 0 0 1 0-4Z" />
      </>
    ),
    plan: (
      <>
        <path d="M5 3h14v18H5z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    chart: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="m7 15 4-4 3 2 5-7" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3-9 5 9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("vi");
  const [theme, setTheme] = useState<Theme>("light");
  const [view, setView] = useState<View>("home");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"expense" | "income" | "transfer">(
    "expense",
  );
  const t = copy[locale];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = locale;
  }, [theme, locale]);

  const navConfig = {
    home: { label: t.home, icon: "home", badge: undefined },
    review: { label: t.review, icon: "review", badge: "3" },
    transactions: { label: t.transactions, icon: "arrows", badge: undefined },
    accounts: { label: t.accounts, icon: "wallet", badge: undefined },
    plan: { label: t.plan, icon: "plan", badge: undefined },
    system: { label: t.system, icon: "layers", badge: undefined },
  } as const;
  const navItems = desktopNavigationIds.map((id) => ({ id, ...navConfig[id] }));

  return (
    <div className="app-shell">
      <aside
        className="sidebar"
        aria-label={locale === "vi" ? "Điều hướng chính" : "Main navigation"}
      >
        <button
          className="brand"
          type="button"
          onClick={() => setView("home")}
          aria-label="Zenval home"
        >
          <span className="brand-mark">Z</span>
          <span className="brand-word">ZENVAL</span>
        </button>

        <nav className="side-nav">
          {navItems.map((item) => (
            <button
              className={`nav-item ${view === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => setView(item.id)}
              type="button"
              aria-current={view === item.id ? "page" : undefined}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
            </button>
          ))}
          <button className="nav-item" type="button">
            <Icon name="chart" />
            <span>{t.reports}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" type="button">
            <Icon name="settings" />
            <span>{t.settings}</span>
          </button>
          <div className="user-card">
            <span className="avatar">NV</span>
            <div className="user-info">
              <strong>Nam Vu</strong>
              <small>Personal workspace</small>
            </div>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button
            className="mobile-brand"
            type="button"
            onClick={() => setView("home")}
            aria-label="Zenval home"
          >
            <span className="brand-mark">Z</span>
            <span>ZENVAL</span>
          </button>
          <label className="search-box">
            <Icon name="search" />
            <span className="sr-only">{t.search}</span>
            <input placeholder={t.search} type="search" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="top-actions">
            <div className="segmented compact">
              {prototypeLocales.map((supportedLocale) => (
                <button
                  className={locale === supportedLocale ? "selected" : ""}
                  onClick={() => setLocale(supportedLocale)}
                  type="button"
                  aria-label={supportedLocale === "vi" ? "Tiếng Việt" : "English"}
                  key={supportedLocale}
                >
                  {supportedLocale.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="icon-button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              type="button"
              aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} />
            </button>
            <button
              className="primary-button quick-add"
              onClick={() => setQuickAddOpen(true)}
              type="button"
            >
              <Icon name="plus" />
              {t.quickAdd}
            </button>
          </div>
        </header>

        <main className="content" id="main-content">
          {view === "home" && (
            <HomeView
              t={t}
              locale={locale}
              onExplain={() => setExplanationOpen(true)}
              onReview={() => setView("review")}
            />
          )}
          {view === "review" && <ReviewView t={t} />}
          {view === "transactions" && <TransactionsView t={t} locale={locale} />}
          {view === "accounts" && <AccountsView t={t} />}
          {view === "plan" && <PlanView t={t} />}
          {view === "system" && <SystemView t={t} />}
          {view === "more" && (
            <MoreView
              t={t}
              locale={locale}
              theme={theme}
              setLocale={setLocale}
              setTheme={setTheme}
              setView={setView}
            />
          )}
        </main>
      </div>

      <nav
        className="mobile-nav"
        aria-label={locale === "vi" ? "Điều hướng di động" : "Mobile navigation"}
      >
        <button
          className={view === "home" ? "active" : ""}
          onClick={() => setView("home")}
          type="button"
        >
          <Icon name="home" />
          <span>{t.home}</span>
        </button>
        <button
          className={view === "transactions" ? "active" : ""}
          onClick={() => setView("transactions")}
          type="button"
        >
          <span className="mobile-icon-wrap">
            <Icon name="arrows" />
            <i>3</i>
          </span>
          <span>{t.transactions}</span>
        </button>
        <button
          className="mobile-add"
          onClick={() => setQuickAddOpen(true)}
          type="button"
          aria-label={t.quickAdd}
        >
          <Icon name="plus" />
        </button>
        <button
          className={view === "plan" ? "active" : ""}
          onClick={() => setView("plan")}
          type="button"
        >
          <Icon name="plan" />
          <span>{t.plan}</span>
        </button>
        <button
          className={view === "more" ? "active" : ""}
          onClick={() => setView("more")}
          type="button"
        >
          <Icon name="layers" />
          <span>{locale === "vi" ? "Thêm" : "More"}</span>
        </button>
      </nav>

      {explanationOpen ? (
        <ExplanationPanel t={t} locale={locale} onClose={() => setExplanationOpen(false)} />
      ) : null}
      {quickAddOpen ? (
        <QuickAddModal
          t={t}
          locale={locale}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          onClose={() => setQuickAddOpen(false)}
        />
      ) : null}
    </div>
  );
}

type T = (typeof copy)[Locale];

function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="page-heading">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function HomeView({
  t,
  locale,
  onExplain,
  onReview,
}: {
  t: T;
  locale: Locale;
  onExplain: () => void;
  onReview: () => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow={locale === "vi" ? "CHỦ NHẬT · 01 THÁNG 11" : "SUNDAY · NOVEMBER 01"}
        title={t.greeting}
        subtitle={t.calm}
      />
      <section
        className="dashboard-grid"
        aria-label={locale === "vi" ? "Tổng quan tài chính" : "Financial overview"}
      >
        <article className="card safe-card">
          <div className="card-top">
            <div className="card-top-left">
              <span className="card-label">{t.safe}</span>
              <span className="status estimated">
                <span />
                {t.estimate}
              </span>
            </div>
            <button
              className="icon-button subtle"
              type="button"
              onClick={onExplain}
              aria-label={t.explain}
            >
              <Icon name="info" />
            </button>
          </div>
          <p className="hero-amount">
            12.400.000 <small>₫</small>
          </p>
          <p className="muted">
            {t.nextIncome} · 14 {locale === "vi" ? "ngày" : "days"}
          </p>
          <div className="safe-footer">
            <span className="safe-footer-info">
              <Icon name="clock" />
              {t.updated}
            </span>
            <button className="text-button" onClick={onExplain} type="button">
              {t.explain}
              <Icon name="chevron" />
            </button>
          </div>
        </article>

        <article className="card flow-card">
          <div className="card-top">
            <div className="card-top-left">
              <span className="card-label">{t.cashFlow}</span>
              <span className={`status ${financialStateClass.forecast}`}>
                <span />
                {t.baseScenario}
              </span>
            </div>
            <button className="icon-button subtle" type="button" aria-label={t.seeAll}>
              <Icon name="chevron" />
            </button>
          </div>
          <div className="chart-wrap">
            <svg
              aria-hidden="true"
              className="line-chart"
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity=".24" />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="grid-line" d="M0 30H500M0 80H500M0 130H500" />
              <path
                className="area"
                d="M0 96 C40 90 50 48 95 55 S155 84 195 72 S250 26 295 40 S350 120 400 105 S455 68 500 76 L500 150 L0 150Z"
              />
              <path
                className="chart-line"
                d="M0 96 C40 90 50 48 95 55 S155 84 195 72 S250 26 295 40 S350 120 400 105 S455 68 500 76"
              />
              <circle cx="400" cy="105" r="5" />
            </svg>
            <div className="chart-labels">
              <span>01/11</span>
              <span>15/11</span>
              <span>30/11</span>
            </div>
          </div>
          <div className="chart-summary">
            <span className="chart-low">
              {t.lowest}
              <strong>8.200.000 ₫</strong>
            </span>
            <span className="confidence">
              {locale === "vi" ? "Độ tin cậy: Trung bình" : "Confidence: Medium"}
            </span>
          </div>
          <p className="sr-only">
            {locale === "vi"
              ? "Dự báo 30 ngày, điểm thấp nhất 8.200.000 đồng, độ tin cậy trung bình."
              : "30-day forecast, projected low point 8,200,000 VND, medium confidence."}
          </p>
        </article>

        <article className="card due-card">
          <div className="section-title">
            <h2>{t.upcoming}</h2>
            <button className="text-button" type="button">
              {t.seeAll}
            </button>
          </div>
          <div className="due-list">
            <DueItem
              date="05"
              month="TH11"
              title={t.rent}
              amount="8.000.000 ₫"
              meta={`4 ${t.days}`}
            />
            <DueItem
              date="08"
              month="TH11"
              title={t.internet}
              amount="250.000 ₫"
              meta={`7 ${t.days}`}
            />
            <DueItem
              date="12"
              month="TH11"
              title={t.debt}
              amount="3.500.000 ₫"
              meta={locale === "vi" ? "Gốc 2,8tr · Lãi 700k" : "Principal 2.8m · Interest 700k"}
            />
          </div>
        </article>

        <article className="card review-card">
          <div className="review-illustration" aria-hidden="true">
            <span>
              <Icon name="review" />
            </span>
            <i />
            <i />
          </div>
          <div>
            <span className="status pending">
              <span />
              {t.review}
            </span>
            <h2>{t.inbox}</h2>
            <p>{t.inboxHint}</p>
          </div>
          <button className="secondary-button review-action" type="button" onClick={onReview}>
            {t.reviewNow}
            <Icon name="chevron" />
          </button>
        </article>

        <article className="card worth-card">
          <div className="card-top">
            <span className="card-label">{t.netWorth}</span>
            <span className="positive">{t.thisMonth}</span>
          </div>
          <p className="large-amount">
            284.600.000 <small>₫</small>
          </p>
          <div
            className="worth-bar"
            role="img"
            aria-label={
              locale === "vi"
                ? "Tài sản 318,1 triệu; nghĩa vụ 33,5 triệu"
                : "Assets 318.1 million; liabilities 33.5 million"
            }
          >
            <span />
            <i />
          </div>
          <div className="worth-legend">
            <span>
              <i className="asset-dot" />
              {locale === "vi" ? "Tài sản" : "Assets"}
              <strong>318,1tr ₫</strong>
            </span>
            <span>
              <i className="liability-dot" />
              {locale === "vi" ? "Nghĩa vụ" : "Liabilities"}
              <strong>33,5tr ₫</strong>
            </span>
          </div>
        </article>
      </section>
    </>
  );
}

function DueItem({
  date,
  month,
  title,
  amount,
  meta,
}: {
  date: string;
  month: string;
  title: string;
  amount: string;
  meta: string;
}) {
  return (
    <div className="due-item">
      <span className="date-tile">
        <strong>{date}</strong>
        <small>{month}</small>
      </span>
      <span className="due-copy">
        <strong>{title}</strong>
        <small>{meta}</small>
      </span>
      <strong className="due-amount">{amount}</strong>
    </div>
  );
}

function ReviewView({ t }: { t: T }) {
  const [activeTab, setActiveTab] = useState<ReviewBucket>("review");

  type ReviewItem = {
    status: string;
    help: string;
    merchant: string;
    amount: string;
    action: string;
    tone: string;
    statusClass: string;
  };
  const items = getReviewRecords(activeTab).map((record): ReviewItem => {
    switch (record.kind) {
      case "transfer":
        return {
          status: t.transferCandidate,
          help: record.pnlImpact === false ? t.transferHelp : t.inspect,
          merchant: "MOMO → VCB",
          amount: "2.000.000 ₫",
          action: t.confirmTransfer,
          tone: "info",
          statusClass: "estimated",
        };
      case "duplicate":
        return {
          status: t.duplicate,
          help: t.duplicateHelp,
          merchant: "WinMart",
          amount: "486.000 ₫",
          action: t.inspect,
          tone: "warning",
          statusClass: financialStateClass.pending,
        };
      case "variance":
        return {
          status: t.variance,
          help: t.varianceHelp,
          merchant: t.debt,
          amount: "3.620.000 ₫",
          action: t.inspect,
          tone: "warning",
          statusClass: financialStateClass.pending,
        };
      case "expected":
        return {
          status: t.baseScenario,
          help: t.forecast,
          merchant: t.rent,
          amount: "8.000.000 ₫",
          action: t.inspect,
          tone: "info",
          statusClass: financialStateClass.forecast,
        };
      case "expense":
        return {
          status: t.posted,
          help: t.updated,
          merchant: "WinMart",
          amount: "486.000 ₫",
          action: t.inspect,
          tone: "info",
          statusClass: financialStateClass.posted,
        };
    }
    const exhaustiveRecord: never = record;
    throw new Error(`Unsupported review record: ${String(exhaustiveRecord)}`);
  });

  return (
    <>
      <PageHeading title={t.reviewTitle} subtitle={t.reviewSubtitle} />
      <div className="filter-row">
        <button
          className={`filter ${activeTab === "review" ? "active" : ""}`}
          onClick={() => setActiveTab("review")}
          type="button"
        >
          {t.review} <span>3</span>
        </button>
        <button
          className={`filter ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
          type="button"
        >
          {t.pending}
        </button>
        <button
          className={`filter ${activeTab === "posted" ? "active" : ""}`}
          onClick={() => setActiveTab("posted")}
          type="button"
        >
          {t.posted}
        </button>
      </div>
      <section className="review-list">
        {items.map((item) => (
          <article className="review-item" key={item.merchant}>
            <div className={`review-icon ${item.tone}`}>
              <Icon name={item.tone === "info" ? "arrows" : "info"} />
            </div>
            <div className="review-content">
              <span className={`status ${item.statusClass}`}>
                <span />
                {item.status}
              </span>
              <h2>{item.merchant}</h2>
              <p>{item.help}</p>
            </div>
            <strong className="review-amount">{item.amount}</strong>
            <button className="secondary-button" type="button">
              {item.action}
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function TransactionsView({ t, locale }: { t: T; locale: Locale }) {
  const transactions = [
    {
      name: "WinMart",
      meta: locale === "vi" ? "Ăn uống · Hôm nay, 09:42" : "Food · Today, 09:42",
      amount: "−486.000 ₫",
      state: t.posted,
      tone: financialStateClass.posted,
    },
    {
      name: t.rent,
      meta: locale === "vi" ? "Dự kiến · Đến hạn 05/11" : "Expected · Due Nov 05",
      amount: "−8.000.000 ₫",
      state: t.pending,
      tone: financialStateClass.pending,
    },
    {
      name: "MOMO → VCB",
      meta:
        locale === "vi"
          ? "Chuyển khoản · Không ảnh hưởng thu/chi"
          : "Transfer · No income/expense impact",
      amount: "2.000.000 ₫",
      state: t.posted,
      tone: financialStateClass.posted,
    },
  ];

  return (
    <>
      <PageHeading
        title={t.transactions}
        subtitle={
          locale === "vi"
            ? "Phân biệt rõ giao dịch đã ghi sổ và khoản chỉ đang dự kiến."
            : "Clearly separate posted transactions from expected items."
        }
      />
      <div className="filter-row">
        <button className="filter active" type="button">
          {locale === "vi" ? "Tất cả" : "All"}
        </button>
        <button className="filter" type="button">
          {t.posted}
        </button>
        <button className="filter" type="button">
          {t.pending}
        </button>
      </div>
      <section className="review-list" aria-label={t.transactions}>
        {transactions.map((transaction) => (
          <article className="transaction-row" key={`${transaction.name}-${transaction.meta}`}>
            <span className="transaction-icon">
              <Icon name="arrows" />
            </span>
            <span className="transaction-copy">
              <strong>{transaction.name}</strong>
              <small>{transaction.meta}</small>
            </span>
            <span className={`status ${transaction.tone}`}>
              <span />
              {transaction.state}
            </span>
            <strong className="transaction-amount">{transaction.amount}</strong>
          </article>
        ))}
      </section>
    </>
  );
}

function AccountsView({ t }: { t: T }) {
  const accounts = [
    {
      name: t.bankAccount,
      institution: "Vietcombank · •• 2486",
      amount: "26.480.000 ₫",
      state: t.reconciled,
      icon: "VC",
    },
    {
      name: t.savings,
      institution: "Techcombank · 6 months",
      amount: "180.000.000 ₫",
      state: t.reconciled,
      icon: "TC",
    },
    {
      name: t.wallet,
      institution: "MoMo · •• 0901",
      amount: "3.620.000 ₫",
      state: t.manual,
      icon: "MO",
    },
  ];

  return (
    <>
      <PageHeading title={t.accountsTitle} subtitle={t.accountsSubtitle} />
      <article className="total-card">
        <span>{t.totalAssets}</span>
        <strong>210.100.000 ₫</strong>
        <small>{t.updated}</small>
      </article>
      <section className="accounts-list">
        {accounts.map((account) => (
          <article className="account-row" key={account.institution}>
            <span className="account-logo">{account.icon}</span>
            <div className="account-info">
              <strong className="account-name">{account.name}</strong>
              <small className="account-institution">{account.institution}</small>
            </div>
            <span className={`status ${account.state === t.manual ? "estimated" : "complete"}`}>
              <span />
              {account.state}
            </span>
            <strong className="account-amount">{account.amount}</strong>
            <button className="icon-button subtle" type="button" aria-label={account.name}>
              <Icon name="chevron" />
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

function PlanView({ t }: { t: T }) {
  return (
    <>
      <PageHeading title={t.planTitle} subtitle={t.planSubtitle} />
      <div className="plan-grid">
        <article className="card plan-overview">
          <span className="card-label">{t.safe}</span>
          <p className="hero-amount">
            12.400.000 <small>₫</small>
          </p>
          <div className="allocation-bar">
            <span style={{ width: "62%" }} />
            <i style={{ width: "23%" }} />
            <b style={{ width: "15%" }} />
          </div>
          <div className="allocation-list">
            <span>
              <i className="asset-dot" />
              {t.reserved}
              <strong>11.750.000 ₫</strong>
            </span>
            <span>
              <i className="flex-dot" />
              {t.flexible}
              <strong>12.400.000 ₫</strong>
            </span>
            <span>
              <i className="buffer-dot" />
              {t.buffer}
              <strong>5.000.000 ₫</strong>
            </span>
          </div>
        </article>
        <article className="card assumption-card">
          <div className="notice">
            <Icon name="info" />
            <p>{t.forecast}</p>
          </div>
          <h2>{t.source}</h2>
          <Assumption label={t.liquid} value="24.950.000 ₫" />
          <Assumption label={t.inflow} value="12.200.000 ₫" />
          <Assumption label={t.commitments} value="−19.750.000 ₫" />
          <Assumption label={t.buffer} value="−5.000.000 ₫" />
        </article>
      </div>
    </>
  );
}

function Assumption({ label, value, source }: { label: string; value: string; source?: string }) {
  return (
    <button className="assumption" type="button">
      <span>
        {label}
        {source ? <small className="assumption-source">{source}</small> : null}
      </span>
      <strong>{value}</strong>
      <Icon name="chevron" />
    </button>
  );
}

function SystemView({ t }: { t: T }) {
  return (
    <>
      <PageHeading title={t.foundationTitle} subtitle={t.foundationSubtitle} />
      <section className="system-grid">
        <article className="card token-card">
          <h2>{t.colors}</h2>
          <div className="swatches">
            <span>
              <i className="swatch ink" />
              <small>Ink</small>
              <code>#12352D</code>
            </span>
            <span>
              <i className="swatch accent" />
              <small>Zen teal</small>
              <code>#13795B</code>
            </span>
            <span>
              <i className="swatch canvas" />
              <small>Canvas</small>
              <code>#F5F7F3</code>
            </span>
            <span>
              <i className="swatch amber" />
              <small>Uncertain</small>
              <code>#A4610A</code>
            </span>
            <span>
              <i className="swatch danger" />
              <small>Risk</small>
              <code>#B94A48</code>
            </span>
          </div>
        </article>
        <article className="card type-card">
          <h2>{t.typography}</h2>
          <p className="type-display">Calm numbers.</p>
          <p className="type-title">Clear decisions.</p>
          <p className="type-body">
            Inter-like system sans keeps Vietnamese diacritics crisp and financial data easy to
            scan.
          </p>
          <p className="type-number">12.400.000 ₫</p>
        </article>
        <article className="card component-card">
          <h2>{t.components}</h2>
          <div className="component-demo">
            <button className="primary-button" type="button">
              Primary action
            </button>
            <button className="secondary-button" type="button">
              Secondary
            </button>
            <label className="demo-input">
              <span>{t.amount}</span>
              <input defaultValue="1.250.000" />
              <b>₫</b>
            </label>
            <div className="demo-tags">
              <span className="status complete">
                <span />
                {t.complete}
              </span>
              <span className="status pending">
                <span />
                {t.pending}
              </span>
            </div>
          </div>
        </article>
        <article className="card state-card">
          <h2>{t.states}</h2>
          <div className="state-matrix">
            <span>
              <Icon name="check" />
              <b>{t.complete}</b>
              <small>{t.posted}</small>
            </span>
            <span>
              <Icon name="clock" />
              <b>{t.stale}</b>
              <small>14 days ago</small>
            </span>
            <span>
              <Icon name="info" />
              <b>{t.missing}</b>
              <small>Needs setup</small>
            </span>
            <span>
              <Icon name="review" />
              <b>{t.pending}</b>
              <small>Needs a decision</small>
            </span>
            <span>
              <Icon name="arrows" />
              <b>{t.offline}</b>
              <small>Draft queued</small>
            </span>
          </div>
        </article>
      </section>
    </>
  );
}

function MoreView({
  t,
  locale,
  theme,
  setLocale,
  setTheme,
  setView,
}: {
  t: T;
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: Theme) => void;
  setView: (view: View) => void;
}) {
  return (
    <>
      <PageHeading
        title={locale === "vi" ? "Thêm" : "More"}
        subtitle={
          locale === "vi"
            ? "Tùy chỉnh Zenval và mở các khu vực ít dùng hơn."
            : "Customize Zenval and open less-frequent areas."
        }
      />
      <section
        className="more-list"
        aria-label={locale === "vi" ? "Các khu vực khác" : "More areas"}
      >
        <MoreLink
          icon="wallet"
          title={t.accounts}
          description={t.accountsSubtitle}
          onClick={() => setView("accounts")}
        />
        <MoreLink
          icon="layers"
          title={t.system}
          description={t.foundationSubtitle}
          onClick={() => setView("system")}
        />
        <MoreLink
          icon="chart"
          title={t.reports}
          description={
            locale === "vi" ? "Tài sản ròng, dòng tiền và P&L" : "Net worth, cash flow, and P&L"
          }
        />
        <MoreLink
          icon="settings"
          title={t.settings}
          description={
            locale === "vi"
              ? "Quyền riêng tư, xuất dữ liệu và bảo mật"
              : "Privacy, data export, and security"
          }
        />
      </section>
      <section
        className="mobile-preferences"
        aria-label={locale === "vi" ? "Tùy chọn hiển thị" : "Display preferences"}
      >
        <div>
          <span>
            <strong>{locale === "vi" ? "Ngôn ngữ" : "Language"}</strong>
            <small>Tiếng Việt / English</small>
          </span>
          <fieldset className="segmented compact">
            <legend className="sr-only">Language</legend>
            {prototypeLocales.map((supportedLocale) => (
              <button
                className={locale === supportedLocale ? "selected" : ""}
                onClick={() => setLocale(supportedLocale)}
                type="button"
                key={supportedLocale}
              >
                {supportedLocale.toUpperCase()}
              </button>
            ))}
          </fieldset>
        </div>
        <div>
          <span>
            <strong>{locale === "vi" ? "Giao diện" : "Appearance"}</strong>
            <small>
              {theme === "light"
                ? locale === "vi"
                  ? "Sáng"
                  : "Light"
                : locale === "vi"
                  ? "Tối"
                  : "Dark"}
            </small>
          </span>
          <button
            className="icon-button"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            type="button"
            aria-label={theme === "light" ? "Use dark theme" : "Use light theme"}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} />
          </button>
        </div>
      </section>
    </>
  );
}

function MoreLink({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <button className="more-link" type="button" onClick={onClick}>
      <span className="more-icon">
        <Icon name={icon} />
      </span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <Icon name="chevron" />
    </button>
  );
}

function useDialogFocus(onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const backgroundRegions = document.querySelectorAll<HTMLElement>(
      ".sidebar, .app-main, .mobile-nav",
    );
    backgroundRegions.forEach((region) => {
      region.inert = true;
    });

    const getFocusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);

    const animationFrame = window.requestAnimationFrame(() => {
      (
        dialog?.querySelector<HTMLElement>("[data-dialog-initial-focus]") ?? getFocusable()[0]
      )?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
      backgroundRegions.forEach((region) => {
        region.inert = false;
      });
      previousFocus?.focus();
    };
  }, [onClose]);

  return dialogRef;
}

function ExplanationPanel({ t, locale, onClose }: { t: T; locale: Locale; onClose: () => void }) {
  const dialogRef = useDialogFocus(onClose);

  return (
    <div
      ref={dialogRef}
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="explanation-title"
    >
      <button
        type="button"
        className="overlay-backdrop"
        onClick={onClose}
        aria-label={t.close}
        tabIndex={-1}
      />
      <aside className="drawer">
        <div className="drawer-header">
          <div>
            <span className="status estimated">
              <span />
              {t.estimate}
            </span>
            <h2 id="explanation-title">{t.safe}</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label={t.close}
            data-dialog-initial-focus
          >
            <Icon name="close" />
          </button>
        </div>
        <p className="drawer-intro">{t.forecast}</p>
        <div className="formula-list">
          <Assumption
            label={t.liquid}
            value="24.950.000 ₫"
            source={
              locale === "vi" ? "VCB, MoMo · đối chiếu hôm nay" : "VCB, MoMo · reconciled today"
            }
          />
          <Assumption
            label={t.inflow}
            value="+12.200.000 ₫"
            source={
              locale === "vi" ? "2 kỳ thu nhập đã xác nhận" : "2 confirmed income occurrences"
            }
          />
          <Assumption
            label={t.commitments}
            value="−19.750.000 ₫"
            source={locale === "vi" ? "3 cam kết đang hoạt động" : "3 active commitments"}
          />
          <Assumption
            label={t.buffer}
            value="−5.000.000 ₫"
            source={locale === "vi" ? "Cài đặt kế hoạch của bạn" : "Your plan setting"}
          />
          <div className="formula-total">
            <span>{t.safe}</span>
            <strong>12.400.000 ₫</strong>
          </div>
        </div>
        <div className="provenance">
          <Icon name="clock" />
          <div className="provenance-info">
            <strong>{t.horizon}</strong>
            <small>{t.version}</small>
          </div>
        </div>
      </aside>
    </div>
  );
}

function QuickAddModal({
  t,
  locale,
  transactionType,
  setTransactionType,
  onClose,
}: {
  t: T;
  locale: Locale;
  transactionType: "expense" | "income" | "transfer";
  setTransactionType: (type: "expense" | "income" | "transfer") => void;
  onClose: () => void;
}) {
  const dialogRef = useDialogFocus(onClose);

  return (
    <div
      ref={dialogRef}
      className="overlay centered"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-add-title"
    >
      <button
        type="button"
        className="overlay-backdrop"
        onClick={onClose}
        aria-label={t.close}
        tabIndex={-1}
      />
      <section className="modal">
        <div className="modal-header">
          <h2 id="quick-add-title">{t.addTitle}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            type="button"
            aria-label={t.close}
            data-dialog-initial-focus
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="segmented transaction-types">
          {(["expense", "income", "transfer"] as const).map((type) => (
            <button
              className={`type-btn ${transactionType === type ? "selected" : ""}`}
              onClick={() => setTransactionType(type)}
              type="button"
              key={type}
            >
              {t[type]}
            </button>
          ))}
        </div>
        {transactionType === "transfer" ? (
          <div className="inline-note">
            <Icon name="info" />
            {t.transferRail}
          </div>
        ) : null}
        <label className="amount-input">
          <span className="form-label">{t.amount}</span>
          <div className="amount-input-row">
            <input inputMode="decimal" placeholder="0" aria-label={t.amount} />
            <b>₫</b>
          </div>
        </label>
        <div className="form-grid">
          <label>
            <span className="form-label">
              {transactionType === "transfer"
                ? locale === "vi"
                  ? "Từ tài khoản"
                  : "From account"
                : t.account}
            </span>
            <select defaultValue="vcb">
              <option value="vcb">Vietcombank · •• 2486</option>
              <option value="momo">MoMo · •• 0901</option>
            </select>
          </label>
          <label>
            <span className="form-label">
              {transactionType === "transfer"
                ? locale === "vi"
                  ? "Đến tài khoản"
                  : "To account"
                : t.category}
            </span>
            <select defaultValue="food">
              <option value="food">{locale === "vi" ? "Ăn uống" : "Food & dining"}</option>
              <option value="home">{locale === "vi" ? "Nhà ở" : "Home"}</option>
            </select>
          </label>
        </div>
        <label className="field">
          <span className="form-label">{t.note}</span>
          <input placeholder={locale === "vi" ? "Ví dụ: Bữa trưa" : "e.g. Lunch"} />
        </label>
        <div className="modal-actions">
          <button className="secondary-button" type="button" onClick={onClose}>
            {t.saveDraft}
          </button>
          <button className="primary-button" type="button" onClick={onClose}>
            {t.save}
          </button>
        </div>
      </section>
    </div>
  );
}
