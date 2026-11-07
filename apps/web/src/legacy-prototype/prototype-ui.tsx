import type { ReactNode } from "react";
import { type CopyKey, prototypeCopy } from "./prototype-copy";
import {
  type CashflowEntry,
  type DebtObligation,
  type DerivedValueKey,
  type DialogKind,
  derivedValues,
  type FinancialStateKind,
  type FixedCommitment,
  financialStates,
  type GoalRecordTuple,
  type InvestmentActivityRecord,
  type InvestmentHolding,
  type ManualValuationMap,
  type PrototypeLocale,
  type PrototypeViewOrMore,
  type ReviewBucket,
  type ReviewRecord,
  type summarizeTodayCashflow,
} from "./prototype-model";

export type Theme = "light" | "dark";

export type PrototypeState = {
  locale: PrototypeLocale;
  baseCurrency: string;
  view: PrototypeViewOrMore;
  reviewBucket: ReviewBucket;
  txSub: string;
  ledgerFilter: string;
  commitmentFilter: string;
  commitmentDirection: string;
  accSub: string;
  invSub: string;
  invActivityType: "buy" | "sell" | "dividend" | "valuation";
  debtSub: string;
  debtDirection: "payable" | "receivable";
  simExtra: "0k" | "1000k" | "2000k";
  planSub: string;
  forecastScenario: "conservative" | "base" | "optimistic";
  repSub: string;
  setSub: string;
  transactionType: "expense" | "income" | "transfer";
  dialog: DialogKind | null;
  derivedKey: DerivedValueKey;
  returnFocusId: string | null;
  toast: string | null;
  formError: string | null;
  customCommitments: FixedCommitment[];
  customHoldings: InvestmentHolding[];
  customActivities: InvestmentActivityRecord[];
  customDebts: DebtObligation[];
  customGoals: GoalRecordTuple[];
  customReviews: ReviewRecord[];
  customTransactions: Array<CashflowEntry & { date: string }>;
  customValuations: ManualValuationMap;
  deviceTimezone: string;
  timezoneMode: string;
  editingGoalId: string | null;
  investmentEntryMode: "unit" | "total";
  formDrafts: Record<string, string>;
  notificationSettings: {
    debtReminder: boolean;
    debtLeadDays: string;
    dailyCapture: boolean;
    dailyCaptureTime: string;
    channel: string;
  };
};

export function createInitialState(
  view: PrototypeViewOrMore = "home",
  overrides: Partial<PrototypeState> = {},
): PrototypeState {
  return {
    locale: "vi",
    baseCurrency: "VND",
    view,
    reviewBucket: "review",
    txSub: "ledger",
    ledgerFilter: "all",
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
    formError: null,
    customCommitments: [],
    customHoldings: [],
    customActivities: [],
    customDebts: [],
    customGoals: [],
    customReviews: [],
    customTransactions: [],
    customValuations: {},
    deviceTimezone: "UTC",
    timezoneMode: "device",
    editingGoalId: null,
    investmentEntryMode: "unit",
    formDrafts: {},
    notificationSettings: {
      debtReminder: true,
      debtLeadDays: "7,3,1,0",
      dailyCapture: true,
      dailyCaptureTime: "21:00",
      channel: "in-app-email",
    },
    ...overrides,
  };
}

export type NavTarget = {
  view: PrototypeViewOrMore;
  txSub?: string;
  planSub?: string;
  reportSub?: string;
};

export type Ctx = {
  s: PrototypeState;
  theme: Theme;
  vi: boolean;
  t: (key: CopyKey | string) => string;
  patch: (next: Partial<PrototypeState>) => void;
  go: (target: NavTarget) => void;
  openDialog: (dialog: DialogKind, surface?: string, derived?: DerivedValueKey) => void;
  closeDialog: () => void;
  toast: (message: string, restoreFocus?: boolean) => void;
  demo: () => void;
  draft: (id: string, fallback?: string) => string;
  setDraft: (id: string, value: string) => void;
  setLocale: (locale: PrototypeLocale) => void;
  toggleTheme: () => void;
  resetTheme: () => void;
  todaySummary: ReturnType<typeof summarizeTodayCashflow>;
  setPreference: (key: "baseCurrency" | "timezoneMode", value: string) => void;
  setNotification: (
    key: keyof PrototypeState["notificationSettings"],
    value: string | boolean,
  ) => void;
  save: {
    transaction: () => void;
    commitment: () => void;
    investment: () => void;
    debt: () => void;
    goal: () => void;
    allocation: () => void;
    goalEdit: (id: string) => void;
    goalPause: (id: string) => void;
    goalArchive: (id: string) => void;
    googleSignIn: () => void;
  };
};

export function translator(locale: PrototypeLocale) {
  return (key: CopyKey | string): string =>
    (prototypeCopy[locale] as Record<string, string>)[key] ?? key;
}

const iconPaths: Record<string, ReactNode> = {
  home: <path d="m3 11 9-8 9 8M5 10v10h14V10M9 20v-6h6v6" />,
  review: <path d="M6 3h12l2 4v13H4V7l2-4ZM4 8h5l1.5 3h3L15 8h5" />,
  arrows: <path d="M7 7h11l-3-3m3 3-3 3m2 7H6l3 3m-3-3 3-3" />,
  wallet: (
    <path d="M3 6h15a2 2 0 0 1 2 2v10H3V6Zm0 0V5a2 2 0 0 1 2-2h12m-1 8h4v4h-4a2 2 0 0 1 0-4Z" />
  ),
  trend: <path d="M3 17 9 11l4 4 8-8M14 7h7v7" />,
  scale: <path d="M12 3v18M5 7h14M5 7l-3 6h6L5 7Zm14 0-3 6h6l-3-6Z" />,
  plan: <path d="M5 3h14v18H5zM8 8h8m-8 4h8m-8 4h5" />,
  layers: <path d="m12 3-9 5 9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5" />,
  chart: <path d="M4 19V5m0 14h16M7 15l4-4 3 2 5-7" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2" />
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
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  shield: <path d="M12 3 4 7v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V7l-8-4Z" />,
};

export function Icon({ name }: { name: string }) {
  return (
    <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
      {iconPaths[name] ?? iconPaths.info}
    </svg>
  );
}

export function Status({ ctx, kind }: { ctx: Ctx; kind: FinancialStateKind | string }) {
  const item = financialStates[kind as FinancialStateKind] ?? financialStates.estimated;
  return (
    <span className={`status ${item.className}`} data-financial-state={kind}>
      <i />
      {ctx.t(item.key)}
    </span>
  );
}

export type DataAttributes = Record<`data-${string}`, string>;

export function derivedAttrs(ctx: Ctx, key: DerivedValueKey): DataAttributes {
  const value = derivedValues[key];
  const sourceIds =
    key === "todayCashflow" ? ctx.todaySummary.entries.map((entry) => entry.id) : value.sourceIds;
  const asOf = key === "todayCashflow" ? ctx.todaySummary.asOf : value.asOf;
  return {
    "data-derived-value": key,
    "data-source-ids": sourceIds.join(" "),
    "data-as-of": asOf,
    "data-version": value.calculationVersion,
    "data-horizon-end": value.horizonEnd,
  };
}

export function Heading({
  title,
  subtitle,
  eyebrow,
  actions,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-heading page-heading-bar">
      <div>
        {eyebrow ? <p className="page-meta">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions ? <div className="heading-actions">{actions}</div> : null}
    </header>
  );
}

export function SubNav({
  ctx,
  items,
  active,
  onSelect,
}: {
  ctx: Ctx;
  items: ReadonlyArray<readonly [string, string, string?]>;
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <nav className="subnav-bar" aria-label={ctx.vi ? "Điều hướng phân mục" : "Section navigation"}>
      {items.map(([value, label, badge]) => (
        <button
          className={`subnav-pill ${active === value ? "active" : ""}`}
          type="button"
          key={value}
          aria-current={active === value ? "true" : undefined}
          onClick={() => onSelect(value)}
        >
          {label}
          {badge ? <span className="pill-badge">{badge}</span> : null}
        </button>
      ))}
    </nav>
  );
}

export function FilterRow({
  items,
  active,
  onSelect,
}: {
  items: ReadonlyArray<readonly [string, ReactNode]>;
  active: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="filter-row">
      {items.map(([value, label]) => (
        <button
          className={`filter ${active === value ? "active" : ""}`}
          type="button"
          key={value}
          aria-pressed={active === value}
          onClick={() => onSelect(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function Assumption({
  ctx,
  label,
  value,
  source,
  valueClass,
}: {
  ctx: Ctx;
  label: string;
  value: string;
  source?: string;
  valueClass?: string;
}) {
  return (
    <button className="assumption" type="button" onClick={ctx.demo}>
      <span>
        {ctx.t(label)}
        {source ? <small>{source}</small> : null}
      </span>
      <strong className={valueClass}>{value}</strong>
      <Icon name="chevron" />
    </button>
  );
}

/** Read-only formula row used inside cards and drawers (no click affordance). */
export function Row({
  label,
  sub,
  value,
  valueClass,
}: {
  label: ReactNode;
  sub?: ReactNode;
  value: ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="assumption">
      <span>
        {label}
        {sub ? <small>{sub}</small> : null}
      </span>
      <strong className={valueClass}>{value}</strong>
    </div>
  );
}

export function KpiBox({
  label,
  amount,
  amountClass,
  boxClass,
  children,
  pnlImpactFalse,
}: {
  label: ReactNode;
  amount: ReactNode;
  amountClass?: string;
  boxClass?: string;
  children?: ReactNode;
  pnlImpactFalse?: boolean;
}) {
  return (
    <div
      className={`today-kpi ${boxClass ?? ""}`}
      data-pnl-impact={pnlImpactFalse ? "false" : undefined}
    >
      <span className="kpi-label">{label}</span>
      <strong className={`kpi-amount ${amountClass ?? ""}`}>{amount}</strong>
      {children}
    </div>
  );
}

export function LocaleControl({ ctx }: { ctx: Ctx }) {
  return (
    <fieldset className="segmented compact" aria-label={ctx.t("language")}>
      {(["vi", "en"] as const).map((locale) => (
        <button
          className={ctx.s.locale === locale ? "selected" : ""}
          type="button"
          key={locale}
          aria-pressed={ctx.s.locale === locale}
          onClick={() => ctx.setLocale(locale)}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </fieldset>
  );
}

export function ExplainButton({
  ctx,
  id,
  derived,
  surface,
}: {
  ctx: Ctx;
  id: string;
  derived: DerivedValueKey;
  surface: string;
}) {
  return (
    <button
      className="icon-button subtle"
      id={id}
      type="button"
      data-action="explain"
      data-derived={derived}
      aria-label={ctx.t("explain")}
      onClick={() => ctx.openDialog("explain", surface, derived)}
    >
      <Icon name="info" />
    </button>
  );
}
