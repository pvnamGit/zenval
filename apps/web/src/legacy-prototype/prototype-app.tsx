"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  clearThemePreference,
  readDisplayPreferences,
  saveDisplayPreference,
} from "./display-preferences";
import { goalLinkOptions, PrototypeDialog, quickAddCategories } from "./prototype-dialogs";
import {
  allocatedGoalPercentage,
  buildReceivableDraft,
  calculateInvestmentAmounts,
  commitmentPnlImpact,
  createManualInstrumentReview,
  type DerivedValueKey,
  type DialogKind,
  derivedValues,
  formatSignedVnd,
  formatUnitPrice,
  formatVnd,
  formatVndInput,
  type GoalRecordTuple,
  type InvestmentActivityRecord,
  type InvestmentHolding,
  instrumentsForAssetClass,
  investmentActivityEffect,
  investmentHoldings,
  isEssentialCommitmentPriority,
  isTodayTransaction,
  localTimeHHMM,
  type PrototypeLocale,
  type PrototypeViewOrMore,
  parseVnd,
  prototypeViews,
  recordManualValuation,
  resolveInstrumentSelection,
  resolveNavigationTarget,
  resolveView,
  restoreGoalFormDraft,
  returnFocusId,
  shouldOpenGlobalSearch,
  summarizeTodayCashflow,
  todayCashflowSummary,
  validateAllocationPercentages,
} from "./prototype-model";
import {
  type Ctx,
  createInitialState,
  Icon,
  LocaleControl,
  type NavTarget,
  type PrototypeState,
  type Theme,
  translator,
} from "./prototype-ui";
import { AuthView, MoreView, ReportsView, SettingsView, SystemView } from "./prototype-views-admin";
import { AccountsView, HomeView, ReviewView, TransactionsView } from "./prototype-views-core";
import { DebtsView, InvestmentsView, PlanView } from "./prototype-views-planning";

const vndAmountInputs = new Set([
  "quick-amount-input",
  "commit-amount-input",
  "inv-unit-price-input",
  "inv-amount-input",
  "inv-fee-input",
  "goal-target-input",
  "debt-principal-input",
]);

const viewStorageKey = "zenval.prototype.view";
const baseCurrencyKey = "zenval.display.base-currency";
const timezoneModeKey = "zenval.display.timezone-mode";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing may disable storage; the session keeps working in memory.
  }
}

function deviceTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const primaryNav = [
  ["home", "home"],
  ["review", "review"],
  ["transactions", "arrows"],
  ["accounts", "wallet"],
  ["investments", "trend"],
  ["debts", "scale"],
  ["plan", "plan"],
  ["reports", "chart"],
] as const;

export function PrototypeApp({
  initialView = "home",
  initialState = {},
}: {
  initialView?: PrototypeViewOrMore;
  initialState?: Partial<PrototypeState>;
}) {
  const [s, setState] = useState<PrototypeState>(() =>
    createInitialState(initialView, initialState),
  );
  const [theme, setTheme] = useState<Theme>("light");
  const themeOverride = useRef(false);
  const stateRef = useRef(s);
  stateRef.current = s;
  const focusTarget = useRef<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const patch = useCallback((next: Partial<PrototypeState>) => {
    setState((current) => ({ ...current, ...next }));
  }, []);

  /* Device preferences, persisted view, and hash routing. */
  useEffect(() => {
    let storage: Storage | null = null;
    try {
      storage = window.localStorage;
    } catch {
      // Browser policy can deny storage.
    }
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    const saved = readDisplayPreferences(storage, media?.matches ?? false);
    themeOverride.current = saved.themeOverride;
    setTheme(saved.theme);
    setState((current) => ({
      ...current,
      locale: saved.locale,
      baseCurrency: readStorage(baseCurrencyKey) ?? current.baseCurrency,
      timezoneMode: readStorage(timezoneModeKey) ?? current.timezoneMode,
      deviceTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      view: resolveView(window.location.hash.slice(1), readStorage(viewStorageKey) ?? current.view),
    }));
    const onThemeChange = (event: MediaQueryListEvent) => {
      if (!themeOverride.current) setTheme(event.matches ? "dark" : "light");
    };
    const onHashChange = () => {
      const target = window.location.hash.slice(1);
      if ((prototypeViews as ReadonlyArray<string>).includes(target)) {
        setState((current) =>
          current.view === target ? current : { ...current, view: target as PrototypeViewOrMore },
        );
      }
    };
    media?.addEventListener("change", onThemeChange);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      media?.removeEventListener("change", onThemeChange);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = s.locale;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0d1714" : "#f5f7f3");
  }, [theme, s.locale]);

  /* Focus: dialog initial focus, return focus, form errors, and main content after navigation. */
  useEffect(() => {
    const id = focusTarget.current;
    if (!id) return;
    focusTarget.current = null;
    const frame = window.requestAnimationFrame(() => {
      const element =
        id === "[data-initial-focus]"
          ? document.querySelector<HTMLElement>(".overlay [data-initial-focus]")
          : document.getElementById(id);
      element?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  });

  const t = useMemo(() => translator(s.locale), [s.locale]);
  const vi = s.locale === "vi";

  const toast = useCallback(
    (message: string, restoreFocus = false) => {
      patch({ toast: message });
      if (restoreFocus && stateRef.current.returnFocusId) {
        focusTarget.current = stateRef.current.returnFocusId;
      }
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => patch({ toast: null }), 2600);
    },
    [patch],
  );

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

  const setView = useCallback(
    (view: PrototypeViewOrMore, extra: Partial<PrototypeState> = {}) => {
      writeStorage(viewStorageKey, view);
      if (view !== "more" && window.location.hash.slice(1) !== view) {
        window.history.replaceState(null, "", `#${view}`);
      }
      focusTarget.current = "main-content";
      patch({ view, ...extra });
    },
    [patch],
  );

  const go = useCallback(
    (target: NavTarget) => {
      const resolved = resolveNavigationTarget(stateRef.current, target);
      setView(resolved.view, {
        txSub: resolved.txSub,
        planSub: resolved.planSub,
        repSub: resolved.repSub,
      });
    },
    [setView],
  );

  const openDialog = useCallback(
    (dialog: DialogKind, surface?: string, derived?: DerivedValueKey) => {
      focusTarget.current = "[data-initial-focus]";
      patch({
        dialog,
        formError: null,
        returnFocusId: returnFocusId(dialog, surface),
        ...(derived ? { derivedKey: derived } : {}),
      });
    },
    [patch],
  );

  const closeDialog = useCallback(() => {
    focusTarget.current = stateRef.current.returnFocusId;
    patch({ dialog: null, editingGoalId: null, formError: null });
  }, [patch]);

  const showFormError = useCallback(
    (id: string, message: string) => {
      focusTarget.current = id;
      patch({ formError: message });
    },
    [patch],
  );

  /* Keyboard: ⌘K search, Escape, and Tab focus trap inside dialogs. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const dialogOpen = Boolean(stateRef.current.dialog);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (shouldOpenGlobalSearch(dialogOpen)) {
          document.querySelector<HTMLInputElement>(".search-box input")?.focus();
        }
      }
      if (event.key === "Escape" && dialogOpen) closeDialog();
      if (event.key === "Tab" && dialogOpen) {
        const focusable = Array.from(
          document.querySelectorAll<HTMLElement>(
            '.overlay button:not([tabindex="-1"]), .overlay input, .overlay select',
          ),
        );
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
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeDialog]);

  const todaySummary = useMemo(
    () =>
      summarizeTodayCashflow(s.customTransactions, {
        ...todayCashflowSummary,
        asOf: derivedValues.todayCashflow.asOf,
      }),
    [s.customTransactions],
  );

  const draft = useCallback(
    (id: string, fallback = "") => s.formDrafts[id] ?? fallback,
    [s.formDrafts],
  );
  const setDraft = useCallback((id: string, value: string) => {
    const next = vndAmountInputs.has(id) ? formatVndInput(value) : value;
    setState((current) => ({ ...current, formDrafts: { ...current.formDrafts, [id]: next } }));
  }, []);

  const demo = useCallback(
    () =>
      toast(
        stateRef.current.locale === "vi"
          ? "Đây là hành động xem trước; prototype chưa thực hiện thay đổi thật."
          : "This is a preview action; the prototype made no real change.",
      ),
    [toast],
  );

  const ctx: Ctx = {
    s,
    theme,
    vi,
    t,
    patch,
    go,
    openDialog,
    closeDialog,
    toast,
    demo,
    draft,
    setDraft,
    todaySummary,
    setLocale: (locale: PrototypeLocale) => {
      patch({ locale });
      try {
        saveDisplayPreference(window.localStorage, "locale", locale);
      } catch {
        /* storage unavailable */
      }
    },
    toggleTheme: () => {
      const next = theme === "light" ? "dark" : "light";
      themeOverride.current = true;
      setTheme(next);
      try {
        saveDisplayPreference(window.localStorage, "theme", next);
      } catch {
        /* storage unavailable */
      }
    },
    resetTheme: () => {
      themeOverride.current = false;
      setTheme(deviceTheme());
      try {
        clearThemePreference(window.localStorage);
      } catch {
        /* storage unavailable */
      }
    },
    setPreference: (key, value) => {
      patch({ [key]: value });
      if (key === "baseCurrency") {
        writeStorage(baseCurrencyKey, value);
        toast(
          vi
            ? "Đã lưu tiền tệ chính; số tiền gốc không thay đổi."
            : "Base currency saved; original amounts are unchanged.",
        );
      } else {
        writeStorage(timezoneModeKey, value);
        const zone = value === "device" ? s.deviceTimezone : value;
        toast(vi ? `Đã dùng múi giờ ${zone}.` : `Using timezone ${zone}.`);
      }
    },
    setNotification: (key, value) => {
      patch({ notificationSettings: { ...s.notificationSettings, [key]: value } });
      toast(
        vi
          ? "Đã lưu cấu hình nhắc trong phiên prototype."
          : "Reminder setting saved for this prototype session.",
      );
    },
    save: {
      allocation: () => {
        const ids = [
          ["allocation-needs", "50"],
          ["allocation-wants", "20"],
          ["allocation-saving", "15"],
          ["allocation-investing", "10"],
          ["allocation-debt", "5"],
        ] as const;
        const values = ids.map(([id, fallback]) => draft(id, fallback));
        if (!validateAllocationPercentages(values)) {
          toast(vi ? "Tổng tỷ lệ phải bằng 100%." : "Allocation ratios must total 100%.");
          return;
        }
        toast(
          vi
            ? "Đã lưu tỷ lệ cá nhân hóa trong phiên prototype."
            : "Personal ratios saved for this prototype session.",
        );
      },
      transaction: () => {
        const amount = parseVnd(draft("quick-amount-input"));
        if (amount === null || amount <= 0n) {
          showFormError(
            "quick-add-error",
            vi ? "Nhập số tiền lớn hơn 0." : "Enter an amount greater than zero.",
          );
          return;
        }
        const type = s.transactionType;
        const isIncome = type === "income";
        const isTransfer = type === "transfer";
        const account = draft("quick-account-input", "Vietcombank · •• 2486");
        const categories = quickAddCategories(type, vi);
        const categoryDraft = draft("quick-category-input");
        const category = categories.includes(categoryDraft) ? categoryDraft : (categories[0] ?? "");
        const note = draft("quick-note-input").trim();
        const date = draft("quick-date-input", todayCashflowSummary.date);
        const entry = {
          id: `session-tx-${Date.now()}`,
          kind: type,
          pnlImpact: !isTransfer,
          state: "posted" as const,
          date,
          time: localTimeHHMM(),
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
          amount: isTransfer ? formatVnd(amount) : formatSignedVnd(amount, isIncome),
        };
        writeStorage(viewStorageKey, "transactions");
        window.history.replaceState(null, "", "#transactions");
        patch({
          customTransactions: [entry, ...s.customTransactions],
          formDrafts: {},
          dialog: null,
          txSub: "ledger",
          view: "transactions",
          returnFocusId: "main-content",
        });
        focusTarget.current = "main-content";
        toast(
          isTodayTransaction(date, todayCashflowSummary.date)
            ? vi
              ? "Đã thêm giao dịch vào phiên prototype và cập nhật tổng hôm nay."
              : "Transaction added to this prototype session and today's total updated."
            : vi
              ? "Đã thêm giao dịch ngày trước vào sổ; tổng hôm nay không thay đổi."
              : "Past-date transaction added to the ledger; today's total is unchanged.",
        );
      },
      commitment: () => {
        const amount = parseVnd(draft("commit-amount-input"));
        if (amount === null || amount <= 0n) {
          showFormError(
            "commitment-error",
            vi ? "Nhập số tiền chuẩn lớn hơn 0." : "Enter a standard amount greater than zero.",
          );
          return;
        }
        const direction = s.commitmentDirection;
        const isInflow = direction === "inflow";
        const dueDay = draft("commit-day-input", "05");
        const title =
          draft("commit-name-input").trim() ||
          (isInflow
            ? vi
              ? "Khoản thu định kỳ mới"
              : "New recurring inflow"
            : vi
              ? "Khoản chi cố định mới"
              : "New fixed commitment");
        const commitment = {
          id: `custom-commit-${Date.now()}`,
          direction: isInflow ? ("inflow" as const) : ("outflow" as const),
          kind: isInflow
            ? "recurring-income"
            : direction === "outflow"
              ? "fixed-expense"
              : direction,
          pnlImpact: commitmentPnlImpact(direction),
          essential: isEssentialCommitmentPriority(draft("commit-priority-input", "essential")),
          dueDay,
          cadenceVi: `Hàng tháng · Ngày ${dueDay}`,
          cadenceEn: `Monthly · Day ${dueDay}`,
          titleVi: title,
          titleEn: title,
          account: draft("commit-account-input", "Vietcombank · •• 2486"),
          tolerance: `${draft("commit-tolerance-input", "±0%")} · ${vi ? "Vừa tạo trong phiên" : "Created this session"}`,
          amount: formatSignedVnd(amount, isInflow),
          statusKey: "forecast",
          state: "forecast" as const,
        };
        window.history.replaceState(null, "", "#transactions");
        patch({
          customCommitments: [commitment, ...s.customCommitments],
          formDrafts: {},
          dialog: null,
          txSub: "commitments",
          view: "transactions",
        });
        toast(
          vi
            ? "Đã thêm bản nháp cam kết vào phiên; chưa post giao dịch thật."
            : "Commitment draft added for this session; no real transaction was posted.",
          true,
        );
      },
      investment: () => {
        const assetClass = draft("inv-class-input", "equity");
        const catalog = instrumentsForAssetClass(assetClass);
        const symbolDraft = draft("inv-symbol-input", catalog[0]?.id ?? "manual");
        const selection =
          symbolDraft === "manual" || catalog.some((item) => item.id === symbolDraft)
            ? symbolDraft
            : (catalog[0]?.id ?? "manual");
        const instrument = resolveInstrumentSelection(
          selection,
          assetClass,
          draft("inv-manual-name-input"),
        );
        if (!instrument.ok) {
          showFormError(
            "investment-error",
            vi
              ? "Chọn mã phù hợp với loại tài sản hoặc nhập tên tài sản thủ công."
              : "Choose an instrument matching the asset class or enter a manual asset name.",
          );
          return;
        }
        const type = s.invActivityType;
        const trade = type === "buy" || type === "sell";
        const qty = draft("inv-qty-input", "100").trim();
        const amountInput = draft("inv-amount-input", trade ? "12.500.000" : "").trim();
        const feeInput = draft("inv-fee-input", "0").trim() || "0";
        const quote = trade
          ? calculateInvestmentAmounts({
              quantity: qty,
              mode: s.investmentEntryMode,
              unitPrice: draft("inv-unit-price-input", "125.000"),
              gross: amountInput,
              fee: feeInput,
            })
          : null;
        const simpleAmount = parseVnd(amountInput);
        const fee = parseVnd(feeInput) ?? 0n;
        const tradeInvalid =
          trade && (!quote?.ok || (type === "sell" && quote.feeVnd > quote.grossVnd));
        const simpleInvalid =
          !trade && (simpleAmount === null || simpleAmount <= 0n || fee < 0n || fee > simpleAmount);
        if (tradeInvalid || simpleInvalid) {
          showFormError(
            "investment-error",
            vi
              ? "Kiểm tra số lượng, giá trị và phí. Các giá trị phải hợp lệ và lớn hơn 0."
              : "Check quantity, value, and fees. Values must be valid and greater than zero.",
          );
          return;
        }
        const gross = quote?.ok ? quote.grossVnd : (simpleAmount ?? 0n);
        const effect = investmentActivityEffect(type);
        const effectiveDate = draft("inv-date-input", "2026-11-01");
        const symbol = instrument.symbol;
        const newHoldings: InvestmentHolding[] = [];
        let valuations = s.customValuations;
        if (effect?.createsHoldingDraft && quote?.ok) {
          newHoldings.push({
            id: `custom-hold-${Date.now()}`,
            symbol,
            assetClass,
            assetLabelVi: "Vị thế chờ xác nhận giá thị trường",
            assetLabelEn: "Position awaiting market-price confirmation",
            portfolio: "TCBS Tích sản",
            quantity: qty,
            costBasis: `${formatVnd(quote.grossVnd)} + ${vi ? "phí" : "fee"} ${formatVnd(quote.feeVnd)}`,
            marketPrice: vi ? "Chưa có giá thị trường" : "No market price yet",
            marketValue: vi ? "Chưa định giá" : "Not valued",
            unrealizedPnl: vi ? "Chưa tính" : "Not calculated",
            sourceVi: instrument.needsReview
              ? "Tài sản thủ công · Cần xem lại mapping và định giá"
              : "Bản nháp provider catalog · Chưa có price snapshot",
            sourceEn: instrument.needsReview
              ? "Manual instrument · Review mapping and valuation"
              : "Provider-catalog draft · No price snapshot",
            valuationMode: instrument.source,
            instrumentId: instrument.instrumentId,
            doubleCountProtected: false,
            state: "pending",
          });
        }
        if (type === "valuation" && simpleAmount !== null) {
          valuations = recordManualValuation(valuations, symbol, simpleAmount, effectiveDate);
          const hasHolding = [...investmentHoldings, ...s.customHoldings].some(
            (holding) => holding.symbol === symbol,
          );
          if (!hasHolding) {
            newHoldings.push({
              id: `custom-valuation-${Date.now()}`,
              symbol,
              assetClass,
              assetLabelVi: "Snapshot định giá chờ ghép vị thế",
              assetLabelEn: "Valuation snapshot awaiting position match",
              portfolio: vi ? "Chưa ghép danh mục" : "Not matched to a portfolio",
              quantity: vi ? "Chưa xác nhận" : "Unconfirmed",
              costBasis: vi ? "Không thay đổi" : "Unchanged",
              marketPrice: formatVnd(simpleAmount),
              marketValue: vi ? "Chờ đối chiếu số lượng" : "Awaiting quantity match",
              unrealizedPnl: vi ? "Chưa tính" : "Not calculated",
              sourceVi: `Snapshot thủ công ${effectiveDate} · Chờ xác nhận`,
              sourceEn: `Manual snapshot ${effectiveDate} · Awaiting confirmation`,
              valuationMode: "manual",
              doubleCountProtected: false,
              state: "estimated",
            });
          }
        }
        const net =
          type === "sell" || type === "dividend"
            ? gross - (quote?.ok ? quote.feeVnd : fee)
            : type === "buy" && quote?.ok
              ? quote.cashVnd
              : gross;
        const unitPrice = quote?.ok ? formatUnitPrice(quote.unitPriceMilliVnd) : "";
        const titles = {
          buy: [`MUA ${qty} ${symbol} @ ${unitPrice}`, `BUY ${qty} ${symbol} @ ${unitPrice}`],
          sell: [`BÁN ${qty} ${symbol} @ ${unitPrice}`, `SELL ${qty} ${symbol} @ ${unitPrice}`],
          dividend: [`CỔ TỨC / LÃI ${symbol}`, `DIVIDEND / INTEREST ${symbol}`],
          valuation: [`ĐỊNH GIÁ THỦ CÔNG ${symbol}`, `MANUAL VALUATION ${symbol}`],
        }[type];
        const feeShown = quote?.ok ? quote.feeVnd : fee;
        const activity: InvestmentActivityRecord = {
          id: `custom-act-${Date.now()}`,
          kind: type,
          pnlImpact: effect?.pnlImpact ?? false,
          symbol,
          instrumentId: instrument.instrumentId,
          date: effectiveDate.split("-").reverse().join("/"),
          titleVi: titles[0] ?? symbol,
          titleEn: titles[1] ?? symbol,
          metaVi:
            type === "buy"
              ? `Giá trị ${formatVnd(gross)} · Phí ${formatVnd(feeShown)} · Bản nháp chờ xác nhận`
              : type === "sell"
                ? `Tiền thu ròng ${formatVnd(net)} · Chưa tính realized P&L cho đến khi khớp vị thế`
                : type === "dividend"
                  ? `Thu nhập đầu tư ròng ${formatVnd(net)} · Thuế ${formatVnd(feeShown)}`
                  : "Snapshot giá thủ công đang chờ ghép số lượng; không sửa giá vốn",
          metaEn:
            type === "valuation"
              ? "Manual price snapshot awaits quantity matching; cost basis is unchanged"
              : `Session draft · Gross ${formatVnd(gross)} · Fees/tax ${formatVnd(feeShown)}`,
          amount: formatVnd(net),
          state: "pending",
          needsReview: instrument.needsReview,
        };
        const review = createManualInstrumentReview(instrument, s.locale);
        window.history.replaceState(null, "", "#investments");
        patch({
          customHoldings: [...newHoldings, ...s.customHoldings],
          customValuations: valuations,
          customActivities: [activity, ...s.customActivities],
          customReviews: review ? [review, ...s.customReviews] : s.customReviews,
          formDrafts: {},
          dialog: null,
          invSub: "activity",
          view: "investments",
        });
        toast(
          instrument.needsReview
            ? vi
              ? "Đã tạo tài sản thủ công và chuyển vào Cần xem lại; chưa dùng cho báo cáo."
              : "Manual instrument created and routed to Review; reports do not use it yet."
            : t("savedFeedback"),
          true,
        );
      },
      debt: () => {
        const isRec = s.debtDirection === "receivable";
        const title =
          draft("debt-title-input").trim() ||
          (isRec
            ? vi
              ? "Khoản phải thu mới"
              : "New receivable"
            : vi
              ? "Khoản vay mới"
              : "New loan");
        const principalInput = draft("debt-principal-input");
        const principal = parseVnd(principalInput);
        const rate = draft("debt-rate-input", isRec ? "80" : "").trim();
        const dueDisplay = draft("debt-due-date-input", "2026-11-30")
          .split("-")
          .reverse()
          .join("/");
        const reminderSchedule = draft("debt-reminder-input", "7,3,1,0");
        if (principal === null || principal <= 0n) {
          showFormError(
            "debt-error",
            vi ? "Nhập số tiền gốc lớn hơn 0." : "Enter principal greater than zero.",
          );
          return;
        }
        let record: PrototypeState["customDebts"][number];
        if (isRec) {
          const erv = buildReceivableDraft(principalInput, rate);
          if (!erv.ok) {
            showFormError(
              "debt-error",
              vi
                ? "Xác suất thu hồi phải từ 0% đến 100%."
                : "Recovery probability must be between 0% and 100%.",
            );
            return;
          }
          const bps = erv.probabilityBps;
          const fraction = bps % 100n;
          record = {
            id: `custom-rec-${Date.now()}`,
            direction: "receivable",
            counterpartyVi: title,
            counterpartyEn: title,
            grossPrincipal: formatVnd(principal),
            recoveryProbability: `${bps / 100n}${fraction ? `,${fraction.toString().padStart(2, "0").replace(/0$/, "")}` : ""}%`,
            estimatedRecoverable: formatVnd(erv.estimatedRecoverable),
            dueDate: dueDisplay,
            reminderSchedule,
            principalPnlImpact: false,
            state: "estimated",
          };
        } else {
          record = {
            id: `custom-pay-${Date.now()}`,
            direction: "payable",
            counterpartyVi: title,
            counterpartyEn: title,
            originalPrincipal: formatVnd(principal),
            outstandingPrincipal: formatVnd(principal),
            rate: rate || (vi ? "Chưa nhập lãi suất" : "No interest rate entered"),
            nextInstallment: vi
              ? "Bản nháp · cần nhập lịch và tách Gốc/Lãi/Phí trước khi post"
              : "Draft · schedule and Principal/Interest/Fee split required before posting",
            dueDate: dueDisplay,
            reminderSchedule,
            principalPnlImpact: false,
            state: "pending",
          };
        }
        window.history.replaceState(null, "", "#debts");
        patch({
          customDebts: [record, ...s.customDebts],
          debtSub: isRec ? "receivables" : "payables",
          formDrafts: {},
          dialog: null,
          view: "debts",
        });
        toast(t("savedFeedback"), true);
      },
      goal: () => {
        const name = draft("goal-name-input").trim();
        const target = parseVnd(draft("goal-target-input"));
        const allocation = Number(draft("goal-allocation-input", "50"));
        if (
          !name ||
          target === null ||
          target <= 0n ||
          !Number.isInteger(allocation) ||
          allocation < 1 ||
          allocation > 100
        ) {
          showFormError(
            "goal-error",
            vi
              ? "Nhập tên, số tiền mục tiêu lớn hơn 0 và tỷ lệ phân bổ từ 1–100%."
              : "Enter a name, a target greater than zero, and an allocation of 1–100%.",
          );
          return;
        }
        const link = draft("goal-link-input", "account:tcb-savings");
        const priority = draft("goal-priority-input", "medium");
        const overlap = draft("goal-overlap-input") === "true";
        const targetDate = draft("goal-date-input", "2027-11-01");
        const elsewhere = allocatedGoalPercentage(s.customGoals, link, s.editingGoalId);
        if (elsewhere + allocation > 100 && !overlap) {
          showFormError(
            "goal-error",
            vi
              ? `Nguồn đã phân bổ ${elsewhere}%. Hãy giảm tỷ lệ hoặc xác nhận overlap.`
              : `This source is already ${elsewhere}% allocated. Reduce it or confirm overlap.`,
          );
          return;
        }
        const linkLabel = goalLinkOptions(vi).find(([id]) => id === link)?.[1] ?? link;
        const goalId = s.editingGoalId ?? `session-goal-${Date.now()}`;
        const record: GoalRecordTuple = [
          name,
          `0 ₫ / ${formatVnd(target)} (0%)`,
          `${vi ? "Liên kết" : "Linked"}: ${linkLabel} (${allocation}%) · ${vi ? "Đích" : "Target"}: ${targetDate} · ${vi ? "Ưu tiên" : "Priority"}: ${priority} · ${overlap ? (vi ? "Overlap đã xác nhận" : "Overlap confirmed") : vi ? "Không overlap" : "No overlap"} · ${vi ? "Thực góp 0 · Thị trường 0 · Kế hoạch 0 · Gap" : "Actual 0 · Market 0 · Planned 0 · Gap"} ${formatVnd(target)}`,
          "estimated",
          goalId,
          link,
          allocation,
          targetDate,
          priority,
          overlap,
          target.toString(),
        ];
        const goals = s.editingGoalId
          ? s.customGoals.map((goal) => (goal[4] === s.editingGoalId ? record : goal))
          : [record, ...s.customGoals];
        patch({
          customGoals: goals,
          editingGoalId: null,
          formDrafts: {},
          dialog: null,
          planSub: "goals",
        });
        toast(
          vi
            ? "Đã lưu mục tiêu theo dõi trong phiên; không có tiền được chuyển."
            : "Goal saved for this session; no money was moved.",
          true,
        );
      },
      goalEdit: (id) => {
        const goal = s.customGoals.find((item) => item[4] === id);
        if (!goal) return;
        focusTarget.current = "[data-initial-focus]";
        patch({
          editingGoalId: id,
          formDrafts: restoreGoalFormDraft(goal),
          dialog: "goal-add",
          formError: null,
          returnFocusId: returnFocusId("goal-add", "main"),
        });
      },
      goalPause: (id) => {
        patch({
          customGoals: s.customGoals.map((goal) =>
            goal[4] === id
              ? ([
                  goal[0],
                  goal[1],
                  `${goal[2]} · ${vi ? "Đã tạm dừng" : "Paused"}`,
                  "pending",
                  ...goal.slice(4),
                ] as GoalRecordTuple)
              : goal,
          ),
        });
        toast(vi ? "Đã tạm dừng plan draft của mục tiêu." : "Goal plan draft paused.");
      },
      goalArchive: (id) => {
        patch({ customGoals: s.customGoals.filter((goal) => goal[4] !== id) });
        toast(
          vi
            ? "Đã lưu trữ mục tiêu; dữ liệu nguồn không bị xóa."
            : "Goal archived; source data was not deleted.",
        );
      },
      googleSignIn: () => {
        setView("home");
        toast(
          vi
            ? "Đăng nhập Google thành công trong prototype; không có OAuth thật được gọi."
            : "Google sign-in succeeded in the prototype; no real OAuth request was made.",
        );
      },
    },
  };

  const dialogOpen = Boolean(s.dialog);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t("skip")}
      </a>
      <div className="app-shell">
        <aside
          className="sidebar"
          inert={dialogOpen}
          aria-label={vi ? "Điều hướng chính" : "Main navigation"}
        >
          <button
            className="brand"
            type="button"
            aria-label="Zenval home"
            onClick={() => go({ view: "home" })}
          >
            <span className="brand-mark">Z</span>
            <span>ZENVAL</span>
          </button>
          <nav className="side-nav">
            {primaryNav.map(([id, icon]) => (
              <NavButton ctx={ctx} id={id} icon={icon} key={id} />
            ))}
          </nav>
          <div className="sidebar-bottom">
            <NavButton ctx={ctx} id="settings" icon="settings" />
            <div className="user-card">
              <span className="avatar">NV</span>
              <span>
                <strong>Nam Vu</strong>
                <small>{t("personal")}</small>
              </span>
            </div>
          </div>
        </aside>
        <div className="app-main" inert={dialogOpen}>
          <header className="topbar">
            <button
              className="mobile-brand"
              type="button"
              aria-label="Zenval home"
              onClick={() => go({ view: "home" })}
            >
              <span className="brand-mark">Z</span>
              <span>ZENVAL</span>
            </button>
            <label className="search-box">
              <Icon name="search" />
              <span className="sr-only">{t("search")}</span>
              <input type="search" placeholder={t("search")} />
              <kbd>⌘ K</kbd>
            </label>
            <div className="top-actions">
              <LocaleControl ctx={ctx} />
              <button
                className="icon-button"
                type="button"
                data-action="theme"
                aria-label={theme === "light" ? t("dark") : t("light")}
                onClick={ctx.toggleTheme}
              >
                <Icon name={theme === "light" ? "moon" : "sun"} />
              </button>
              <button
                className="primary-button quick-add"
                id="top-quick-add"
                type="button"
                data-action="quick-add"
                onClick={() => openDialog("quick-add", "top")}
              >
                <Icon name="plus" />
                <span>{t("quickAdd")}</span>
              </button>
            </div>
          </header>
          <main className="content" id="main-content" tabIndex={-1}>
            <CurrentView ctx={ctx} />
          </main>
        </div>
        <nav
          className="mobile-nav"
          inert={dialogOpen}
          aria-label={vi ? "Điều hướng di động" : "Mobile navigation"}
        >
          <MobileButton ctx={ctx} id="home" icon="home" />
          <MobileButton ctx={ctx} id="transactions" icon="arrows" />
          <button
            className="mobile-add"
            id="mobile-quick-add"
            type="button"
            data-action="quick-add"
            aria-label={t("quickAdd")}
            onClick={() => openDialog("quick-add", "mobile")}
          >
            <Icon name="plus" />
          </button>
          <MobileButton ctx={ctx} id="plan" icon="plan" />
          <MobileButton ctx={ctx} id="more" icon="more" badge="3" />
        </nav>
        {dialogOpen ? <PrototypeDialog ctx={ctx} /> : null}
        {s.toast ? (
          <output className="toast">
            <Icon name="check" />
            {s.toast}
          </output>
        ) : null}
      </div>
    </>
  );
}

function CurrentView({ ctx }: { ctx: Ctx }) {
  switch (ctx.s.view) {
    case "review":
      return <ReviewView ctx={ctx} />;
    case "transactions":
      return <TransactionsView ctx={ctx} />;
    case "accounts":
      return <AccountsView ctx={ctx} />;
    case "investments":
      return <InvestmentsView ctx={ctx} />;
    case "debts":
      return <DebtsView ctx={ctx} />;
    case "plan":
      return <PlanView ctx={ctx} />;
    case "reports":
      return <ReportsView ctx={ctx} />;
    case "settings":
      return <SettingsView ctx={ctx} />;
    case "system":
      return <SystemView ctx={ctx} />;
    case "auth":
      return <AuthView ctx={ctx} />;
    case "more":
      return <MoreView ctx={ctx} />;
    default:
      return <HomeView ctx={ctx} />;
  }
}

function NavButton({ ctx, id, icon }: { ctx: Ctx; id: PrototypeViewOrMore; icon: string }) {
  const active = ctx.s.view === id;
  return (
    <button
      className={`nav-item ${active ? "active" : ""}`}
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => ctx.go({ view: id })}
    >
      <Icon name={icon} />
      <span>{ctx.t(id)}</span>
      {id === "review" ? <b className="nav-badge">3</b> : null}
    </button>
  );
}

function MobileButton({
  ctx,
  id,
  icon,
  badge,
}: {
  ctx: Ctx;
  id: PrototypeViewOrMore;
  icon: string;
  badge?: string;
}) {
  const active = ctx.s.view === id;
  return (
    <button
      className={active ? "active" : ""}
      type="button"
      aria-current={active ? "page" : undefined}
      onClick={() => ctx.go({ view: id })}
    >
      <span className="mobile-icon-wrap">
        <Icon name={icon} />
        {badge ? <i>{badge}</i> : null}
      </span>
      <span>{ctx.t(id)}</span>
    </button>
  );
}
