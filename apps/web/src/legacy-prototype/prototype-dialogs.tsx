import type { ReactNode } from "react";
import {
  buildReceivableDraft,
  calculateInvestmentAmounts,
  derivedValues,
  formatUnitPrice,
  formatVnd,
  instrumentsForAssetClass,
} from "./prototype-model";
import { Assumption, type Ctx, Icon, Row, Status } from "./prototype-ui";
import { stsAssumptions } from "./prototype-views-planning";

function Overlay({
  ctx,
  centered = true,
  children,
}: {
  ctx: Ctx;
  centered?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`overlay ${centered ? "centered" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <button
        className="overlay-backdrop"
        type="button"
        tabIndex={-1}
        aria-label={ctx.t("close")}
        onClick={ctx.closeDialog}
      />
      {children}
    </div>
  );
}

function DialogHeader({ ctx, children }: { ctx: Ctx; children: ReactNode }) {
  return (
    <header className="dialog-header">
      {children}
      <button
        className="icon-button"
        type="button"
        data-initial-focus
        aria-label={ctx.t("close")}
        onClick={ctx.closeDialog}
      >
        <Icon name="close" />
      </button>
    </header>
  );
}

function FormError({ ctx, id }: { ctx: Ctx; id: string }) {
  return (
    <div id={id} className="form-error" role="alert" tabIndex={-1} hidden={!ctx.s.formError}>
      {ctx.s.formError}
    </div>
  );
}

function Segmented<T extends string>({
  items,
  active,
  onSelect,
  action,
}: {
  items: ReadonlyArray<readonly [T, string]>;
  active: T;
  onSelect: (value: T) => void;
  action: string;
}) {
  return (
    <div className="segmented transaction-types">
      {items.map(([value, label]) => (
        <button
          className={active === value ? "selected" : ""}
          type="button"
          key={value}
          data-action={action}
          aria-pressed={active === value}
          onClick={() => onSelect(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Actions({
  ctx,
  saveLabel,
  onSave,
  action,
}: {
  ctx: Ctx;
  saveLabel: string;
  onSave: () => void;
  action: string;
}) {
  return (
    <footer className="modal-actions">
      <button className="secondary-button" type="button" onClick={ctx.closeDialog}>
        {ctx.t("close")}
      </button>
      <button className="primary-button" type="button" data-action={action} onClick={onSave}>
        {saveLabel}
      </button>
    </footer>
  );
}

function TextInput({
  ctx,
  id,
  fallback = "",
  placeholder,
  inputMode,
  type,
  readOnly,
  value,
  min,
  max,
}: {
  ctx: Ctx;
  id: string;
  fallback?: string;
  placeholder?: string;
  inputMode?: "numeric" | "decimal";
  type?: string;
  readOnly?: boolean;
  value?: string;
  min?: number;
  max?: number;
}) {
  return (
    <input
      id={id}
      type={type ?? "text"}
      inputMode={inputMode}
      placeholder={placeholder}
      readOnly={readOnly}
      min={min}
      max={max}
      value={value ?? ctx.draft(id, fallback)}
      onChange={(event) => ctx.setDraft(id, event.target.value)}
    />
  );
}

function SelectInput({
  ctx,
  id,
  fallback,
  options,
}: {
  ctx: Ctx;
  id: string;
  fallback: string;
  options: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <select
      id={id}
      value={ctx.draft(id, fallback)}
      onChange={(e) => ctx.setDraft(id, e.target.value)}
    >
      {options.map(([value, label]) => (
        <option value={value} key={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

export function PrototypeDialog({ ctx }: { ctx: Ctx }) {
  switch (ctx.s.dialog) {
    case "explain":
      return <ExplanationDialog ctx={ctx} />;
    case "commitment-add":
      return <CommitmentDialog ctx={ctx} />;
    case "investment-add":
      return <InvestmentDialog ctx={ctx} />;
    case "debt-add":
      return <DebtDialog ctx={ctx} />;
    case "goal-add":
      return <GoalDialog ctx={ctx} />;
    case "quick-add":
      return <QuickAddDialog ctx={ctx} />;
    default:
      return null;
  }
}

function ExplanationDialog({ ctx }: { ctx: Ctx }) {
  const { s, t, vi, todaySummary } = ctx;
  const key = s.derivedKey;
  const derived = derivedValues[key];
  const sources = vi
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
  let rows: ReactNode;
  if (key === "safeToSpend") {
    rows = stsAssumptions.map(([label, value], index) => (
      <Assumption ctx={ctx} label={label} value={value} source={sources[index] ?? ""} key={label} />
    ));
  } else if (key === "todayCashflow") {
    rows = (
      <>
        <Row
          label={t("todayInflow")}
          sub="posted income entries"
          value={todaySummary.inflowDisplay}
          valueClass="positive-text"
        />
        <Row
          label={t("todayOutflow")}
          sub="posted expense entries"
          value={todaySummary.outflowDisplay}
          valueClass="negative-text"
        />
        <Row
          label={t("todayExcluded")}
          sub="internal transfers (Non-P&L)"
          value={todaySummary.excludedTransferDisplay}
        />
      </>
    );
  } else if (key === "cashFlow") {
    rows = (
      <>
        <Row
          label={vi ? "Số dư thanh khoản hiện tại" : "Current liquid balance"}
          sub="Vietcombank + MoMo"
          value="24.950.000 ₫"
        />
        <Row
          label={vi ? "Thu nhập dự kiến 30 ngày" : "Expected 30-day inflows"}
          sub={vi ? "Đã áp dụng hệ số thận trọng" : "Confidence-adjusted"}
          value="+35.000.000 ₫"
          valueClass="positive-text"
        />
        <Row
          label={vi ? "Cam kết cố định & dự phòng chi" : "Fixed commitments & planned spend"}
          sub={vi ? "Bao gồm kỳ trả góp VIB 12/11" : "Includes Nov 12 VIB installment"}
          value="−51.750.000 ₫"
          valueClass="negative-text"
        />
      </>
    );
  } else if (key === "netWorth") {
    rows = (
      <>
        <Row
          label={vi ? "Tiền thanh khoản & Tiết kiệm" : "Liquid cash & Savings"}
          sub="VCB, MoMo, Techcombank"
          value="211.600.000 ₫"
        />
        <Row
          label={vi ? "Danh mục đầu tư & Phải thu (ERV)" : "Investments & Receivables (ERV)"}
          sub={vi ? "Đầu tư 108tr · Phải thu 6,5tr" : "Portfolio 108m · ERV 6.5m"}
          value="114.500.000 ₫"
        />
        <Row
          label={vi ? "Tổng dư nợ gốc phải trả" : "Total payable principal"}
          sub="VIB Loan + VCB Credit Card"
          value="−33.500.000 ₫"
          valueClass="negative-text"
        />
      </>
    );
  } else if (key === "commitmentBaseline") {
    rows = (
      <>
        <Row
          label={vi ? "Nhà ở, Tiện ích & Học tập" : "Housing, Utilities & Education"}
          sub={vi ? "3 khoản chi cố định" : "3 fixed expense items"}
          value="−11.250.000 ₫"
        />
        <Row
          label={vi ? "Kỳ trả góp khoản vay VIB" : "VIB loan monthly installment"}
          sub={vi ? "Gốc 2,8tr + Lãi 700k" : "Principal 2.8m + Interest 700k"}
          value="−3.500.000 ₫"
        />
        <Row
          label={vi ? "Trích lập Quỹ dự phòng định kỳ" : "Recurring Emergency Fund transfer"}
          sub={vi ? "Chuyển khoản nội bộ" : "Internal transfer"}
          value="−5.000.000 ₫"
        />
      </>
    );
  } else {
    rows = (
      <>
        <Row
          label={vi ? "Cổ phiếu & Chứng chỉ quỹ" : "Listed equity & Mutual funds"}
          sub={vi ? "FPT (67tr) + DCDS (19,8tr)" : "FPT (67m) + DCDS (19.8m)"}
          value="86.800.000 ₫"
        />
        <Row
          label={vi ? "Vàng vật chất 9999 (Thủ công)" : "Physical gold 9999 (Manual)"}
          sub={vi ? "2 chỉ · Snapshot 01/11" : "2 chỉ · Nov 01 snapshot"}
          value="17.200.000 ₫"
        />
        <Row
          label={vi ? "Tiền mặt chờ đầu tư TCBS" : "TCBS brokerage cash"}
          sub={vi ? "Đã chống tính trùng sổ cái" : "Double-count protected"}
          value="4.000.000 ₫"
        />
      </>
    );
  }
  const sourceIds =
    key === "todayCashflow" ? todaySummary.entries.map((entry) => entry.id) : derived.sourceIds;
  const display = key === "todayCashflow" ? todaySummary.netDisplay : derived.display;
  const asOf = key === "todayCashflow" ? todaySummary.asOf : derived.asOf;
  return (
    <Overlay ctx={ctx} centered={false}>
      <aside className="drawer">
        <DialogHeader ctx={ctx}>
          <div>
            <Status ctx={ctx} kind={derived.state} />
            <h2 id="dialog-title">{t(derived.titleKey)}</h2>
          </div>
        </DialogHeader>
        <p className="drawer-intro">{t("forecastNote")}</p>
        <div className="formula-list">
          {rows}
          <div className="formula-total">
            <span>{t(derived.titleKey)}</span>
            <strong>{display}</strong>
          </div>
        </div>
        <div className="provenance">
          <Icon name="clock" />
          <div>
            <strong>
              {vi ? "Phạm vi kết thúc" : "Horizon ends"}: {derived.horizonEnd}
            </strong>
            <small>
              {vi ? "Dữ liệu tại" : "Data as of"}: {asOf}
            </small>
            <small>
              {vi ? "Phiên bản tính" : "Calculation version"}: {derived.calculationVersion}
            </small>
            <small>
              {vi ? "Nguồn đối chiếu" : "Sources"}: {sourceIds.join(", ")}
            </small>
          </div>
        </div>
      </aside>
    </Overlay>
  );
}

const expenseCategoriesVi = [
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
];
const expenseCategoriesEn = [
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
const incomeCategoriesVi = [
  "Lương",
  "Thưởng",
  "Freelance",
  "Lãi tiết kiệm",
  "Cổ tức",
  "Quà tặng",
  "Khác",
];
const incomeCategoriesEn = [
  "Salary",
  "Bonus",
  "Freelance",
  "Savings interest",
  "Dividend",
  "Gift",
  "Other",
];

export function quickAddCategories(type: string, vi: boolean): string[] {
  if (type === "transfer") return ["MoMo · •• 0901", "Techcombank · Savings"];
  if (type === "income") return vi ? incomeCategoriesVi : incomeCategoriesEn;
  return vi ? expenseCategoriesVi : expenseCategoriesEn;
}

const cashAccounts = [
  ["Vietcombank · •• 2486", "Vietcombank · •• 2486"],
  ["MoMo · •• 0901", "MoMo · •• 0901"],
] as const;

function QuickAddDialog({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const transfer = s.transactionType === "transfer";
  const categories = quickAddCategories(s.transactionType, vi);
  return (
    <Overlay ctx={ctx}>
      <section className="modal">
        <DialogHeader ctx={ctx}>
          <h2 id="dialog-title">{t("addTitle")}</h2>
        </DialogHeader>
        <Segmented
          action="transaction-type"
          items={[
            ["expense", t("expense")],
            ["income", t("income")],
            ["transfer", t("transfer")],
          ]}
          active={s.transactionType}
          onSelect={(value) => ctx.patch({ transactionType: value })}
        />
        {transfer ? (
          <div className="inline-note" data-pnl-impact="false">
            <Icon name="info" />
            {t("transferRail")}
          </div>
        ) : null}
        <FormError ctx={ctx} id="quick-add-error" />
        <label className="amount-input" htmlFor="quick-amount-input">
          <span className="form-label">{t("amount")}</span>
          <span>
            <TextInput ctx={ctx} id="quick-amount-input" inputMode="numeric" placeholder="0" />
            <b>₫</b>
          </span>
        </label>
        <div className="form-grid">
          <label htmlFor="quick-account-input">
            <span className="form-label">{transfer ? t("from") : t("account")}</span>
            <SelectInput
              ctx={ctx}
              id="quick-account-input"
              fallback={cashAccounts[0][0]}
              options={cashAccounts}
            />
          </label>
          <label>
            <span className="form-label">{transfer ? t("to") : t("category")}</span>
            <select
              id="quick-category-input"
              value={
                categories.includes(ctx.draft("quick-category-input"))
                  ? ctx.draft("quick-category-input")
                  : (categories[0] ?? "")
              }
              onChange={(event) => ctx.setDraft("quick-category-input", event.target.value)}
            >
              {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <label htmlFor="quick-date-input">
            <span className="form-label">{vi ? "Ngày giao dịch" : "Transaction date"}</span>
            <TextInput ctx={ctx} id="quick-date-input" type="date" fallback="2026-11-01" />
          </label>
          <label htmlFor="quick-note-input">
            <span className="form-label">{t("note")}</span>
            <TextInput
              ctx={ctx}
              id="quick-note-input"
              placeholder={vi ? "Ví dụ: Bữa trưa" : "e.g. Lunch"}
            />
          </label>
        </div>
        <p className="prototype-notice">
          <Icon name="info" />
          {vi
            ? "Bản ghi chỉ tồn tại trong phiên prototype và sẽ cập nhật danh sách cùng tổng hôm nay."
            : "This entry exists only in the prototype session and updates the ledger and today's total."}
        </p>
        <Actions
          ctx={ctx}
          saveLabel={t("save")}
          onSave={ctx.save.transaction}
          action="save-transaction"
        />
      </section>
    </Overlay>
  );
}

function CommitmentDialog({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const direction = s.commitmentDirection;
  const isInflow = direction === "inflow";
  const isLoan = direction === "debt-installment";
  const isTransfer = direction === "saving-transfer";
  const note = isInflow
    ? vi
      ? "Khoản thu cố định được đưa vào dự báo dòng tiền theo hệ số thận trọng (haircut)."
      : "Recurring inflows feed cash-flow forecasts using conservative confidence weights."
    : isLoan
      ? vi
        ? "Khoản trả góp ngân hàng liên kết hồ sơ nợ: Gốc giảm nợ (Non-P&L), chỉ Lãi/Phí tính vào Chi phí."
        : "Linked to debt obligation: Principal reduces liability (Non-P&L); only interest/fees hit P&L."
      : isTransfer
        ? vi
          ? "Trích lập tiết kiệm giữ chỗ trước trong Safe-to-spend nhưng là chuyển khoản nội bộ (Non-P&L)."
          : "Reserves cash in Safe-to-spend but remains an internal transfer (Non-P&L)."
        : vi
          ? "Khoản chi cố định được trừ trước khỏi Safe-to-spend và tự gợi ý khớp khi có giao dịch thực tế."
          : "Reserved upfront from Safe-to-spend and auto-matched within tolerance.";
  return (
    <Overlay ctx={ctx}>
      <section className="modal">
        <DialogHeader ctx={ctx}>
          <h2 id="dialog-title">
            {vi ? "Tạo khoản thu / chi cố định hàng tháng" : "Create monthly fixed commitment"}
          </h2>
        </DialogHeader>
        <Segmented
          action="commitment-direction"
          items={[
            ["outflow", vi ? "Chi cố định" : "Fixed expense"],
            ["inflow", vi ? "Thu cố định" : "Fixed inflow"],
            ["debt-installment", vi ? "Trả góp nợ" : "Loan installment"],
            ["saving-transfer", vi ? "Tiết kiệm định kỳ" : "Savings transfer"],
          ]}
          active={direction}
          onSelect={(value) => ctx.patch({ commitmentDirection: value })}
        />
        <div className="inline-note" data-pnl-impact={isTransfer || isLoan ? "false" : undefined}>
          <Icon name="info" />
          <span>{note}</span>
        </div>
        <FormError ctx={ctx} id="commitment-error" />
        <label className="field" htmlFor="commit-name-input">
          <span className="form-label">
            {vi ? "Tên khoản cố định hàng tháng" : "Commitment name"}
          </span>
          <TextInput
            ctx={ctx}
            id="commit-name-input"
            placeholder={
              isInflow
                ? vi
                  ? "Ví dụ: Lương tháng / Thu cho thuê nhà"
                  : "e.g. Monthly salary"
                : vi
                  ? "Ví dụ: Phí quản lý chung cư / Học phí"
                  : "e.g. Condo management fee"
            }
          />
        </label>
        <label className="amount-input" htmlFor="commit-amount-input">
          <span className="form-label">
            {vi ? "Số tiền chuẩn mỗi kỳ" : "Standard monthly amount"}
          </span>
          <span>
            <TextInput
              ctx={ctx}
              id="commit-amount-input"
              inputMode="numeric"
              placeholder="1.500.000"
            />
            <b>₫</b>
          </span>
        </label>
        <div className="form-grid">
          <label htmlFor="commit-day-input">
            <span className="form-label">
              {vi ? "Tần suất & Ngày đến hạn" : "Cadence & Due day"}
            </span>
            <SelectInput
              ctx={ctx}
              id="commit-day-input"
              fallback="05"
              options={[
                ["05", vi ? "Hàng tháng · Ngày 05" : "Monthly · Day 05"],
                ["10", vi ? "Hàng tháng · Ngày 10" : "Monthly · Day 10"],
                ["15", vi ? "Hàng tháng · Ngày 15" : "Monthly · Day 15"],
                ["25", vi ? "Hàng tháng · Ngày 25" : "Monthly · Day 25"],
                ["30", vi ? "Cuối tháng (Xử lý tháng 2 tự động)" : "End of month (Feb-safe)"],
              ]}
            />
          </label>
          <label htmlFor="commit-tolerance-input">
            <span className="form-label">
              {vi ? "Biên độ dung sai khớp tự động" : "Auto-match tolerance"}
            </span>
            <SelectInput
              ctx={ctx}
              id="commit-tolerance-input"
              fallback="±0%"
              options={[
                ["±0%", vi ? "Cố định tuyệt đối (±0%)" : "Exact amount (±0%)"],
                ["±5%", vi ? "Biến động nhẹ (±5%)" : "Small variance (±5%)"],
                ["±15%", vi ? "Hóa đơn theo mùa (±15%)" : "Utility variance (±15%)"],
              ]}
            />
          </label>
        </div>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <label htmlFor="commit-account-input">
            <span className="form-label">
              {vi ? "Tài khoản thanh toán / nhận tiền" : "Account"}
            </span>
            <SelectInput
              ctx={ctx}
              id="commit-account-input"
              fallback="Vietcombank · •• 2486"
              options={[...cashAccounts, ["Techcombank · Savings", "Techcombank · Savings"]]}
            />
          </label>
          <label htmlFor="commit-priority-input">
            <span className="form-label">
              {vi ? "Mức ưu tiên giữ tiền (STS)" : "Reservation priority"}
            </span>
            <SelectInput
              ctx={ctx}
              id="commit-priority-input"
              fallback="essential"
              options={[
                [
                  "essential",
                  vi ? "Thiết yếu · Giữ tiền trước trong STS" : "Essential · Reserve in STS",
                ],
                ["flexible", vi ? "Linh hoạt · Chỉ nhắc lịch" : "Flexible · Reminder only"],
              ]}
            />
          </label>
        </div>
        <p className="prototype-notice">
          <Icon name="info" />
          {t("prototypeNotice")}
        </p>
        <Actions
          ctx={ctx}
          saveLabel={vi ? "Lưu khoản cố định" : "Save fixed item"}
          onSave={ctx.save.commitment}
          action="save-commitment"
        />
      </section>
    </Overlay>
  );
}

function InvestmentDialog({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const type = s.invActivityType;
  const trade = type === "buy" || type === "sell";
  const dividend = type === "dividend";
  const assetClass = ctx.draft("inv-class-input", "equity");
  const catalog = instrumentsForAssetClass(assetClass);
  const symbolDraft = ctx.draft("inv-symbol-input", catalog[0]?.id ?? "manual");
  const symbolValue =
    symbolDraft === "manual" || catalog.some((item) => item.id === symbolDraft)
      ? symbolDraft
      : (catalog[0]?.id ?? "manual");
  const manualInstrument = symbolValue === "manual";
  const quote = trade
    ? calculateInvestmentAmounts({
        quantity: ctx.draft("inv-qty-input", "100"),
        mode: s.investmentEntryMode,
        unitPrice: ctx.draft("inv-unit-price-input", "125.000"),
        gross: ctx.draft("inv-amount-input", "12.500.000"),
        fee: ctx.draft("inv-fee-input", "0") || "0",
      })
    : null;
  const impact = {
    buy: vi
      ? "Mua chuyển tiền thành tài sản và tăng giá vốn; không phải chi phí sinh hoạt."
      : "A buy converts cash into an asset and increases cost basis; it is not a living expense.",
    sell: vi
      ? "Bán giảm số lượng nắm giữ; chỉ lãi/lỗ đã chốt và phí/thuế tác động hiệu suất."
      : "A sale reduces quantity; only realized gain/loss and fees/taxes affect performance.",
    dividend: vi
      ? "Cổ tức/lãi là thu nhập đầu tư; thuế khấu trừ được ghi riêng."
      : "Dividends/interest are investment income; withholding tax is recorded separately.",
    valuation: vi
      ? "Định giá chỉ cập nhật giá thị trường và lãi/lỗ chưa chốt; không sửa giá mua."
      : "A valuation updates market value and unrealized P&L without changing purchase cost.",
  }[type];
  return (
    <Overlay ctx={ctx}>
      <section className="modal">
        <DialogHeader ctx={ctx}>
          <h2 id="dialog-title">
            {vi ? "Ghi nhật ký đầu tư / Thêm danh mục" : "Log investment activity / holding"}
          </h2>
        </DialogHeader>
        <Segmented
          action="inv-activity-type"
          items={[
            ["buy", vi ? "Mua (Buy)" : "Buy"],
            ["sell", vi ? "Bán (Sell)" : "Sell"],
            ["dividend", vi ? "Cổ tức / Lãi" : "Dividend"],
            ["valuation", vi ? "Định giá thủ công" : "Manual price"],
          ]}
          active={type}
          onSelect={(value) => ctx.patch({ invActivityType: value })}
        />
        <div className="inline-note" data-pnl-impact={String(dividend)}>
          <Icon name="info" />
          <span>{impact}</span>
        </div>
        <FormError ctx={ctx} id="investment-error" />
        <div className="form-grid">
          <label htmlFor="inv-class-input">
            <span className="form-label">{vi ? "Loại tài sản" : "Asset class"}</span>
            <SelectInput
              ctx={ctx}
              id="inv-class-input"
              fallback="equity"
              options={[
                ["equity", vi ? "Cổ phiếu niêm yết (HOSE/HNX)" : "Listed equity (HOSE/HNX)"],
                ["fund", vi ? "Chứng chỉ quỹ mở (Fund)" : "Mutual fund certificate"],
                ["gold", vi ? "Vàng vật chất (Chỉ / Lượng)" : "Physical gold"],
                ["bond", vi ? "Trái phiếu / Tiền gửi" : "Bond / Term deposit"],
                ["crypto", vi ? "Tài sản số (Crypto)" : "Crypto asset"],
              ]}
            />
          </label>
          <label>
            <span className="form-label">
              {vi ? "Mã tài sản & Danh mục" : "Symbol & Portfolio"}
            </span>
            <select
              id="inv-symbol-input"
              value={symbolValue}
              onChange={(event) => ctx.setDraft("inv-symbol-input", event.target.value)}
            >
              {catalog.map((instrument) => (
                <option value={instrument.id} key={instrument.id}>
                  {instrument.label} · provider catalog
                </option>
              ))}
              <option value="manual">
                {vi
                  ? "Không tìm thấy · Tạo tài sản thủ công"
                  : "Not found · Create manual instrument"}
              </option>
            </select>
            <small className="field-help">
              {vi
                ? "Prototype catalog: production sẽ tải danh sách mã qua Market Data adapter và hiển thị loading/error/stale."
                : "Prototype catalog: production loads symbols through the Market Data adapter with loading/error/stale states."}
            </small>
          </label>
        </div>
        {manualInstrument ? (
          <label className="field" htmlFor="inv-manual-name-input">
            <span className="form-label">
              {vi ? "Tên / mã tài sản thủ công" : "Manual asset name / symbol"}
            </span>
            <TextInput
              ctx={ctx}
              id="inv-manual-name-input"
              placeholder={vi ? "Ví dụ: Vàng SJC 9999" : "e.g. SJC Gold 9999"}
            />
            <small className="field-help">
              {vi
                ? "Tài sản sẽ mang nguồn Manual và vào Cần xem lại trước khi dùng trong báo cáo."
                : "The asset is marked Manual and routed to Review before reports use it."}
            </small>
          </label>
        ) : null}
        {trade ? (
          <>
            <div className="form-grid" style={{ marginTop: 12 }}>
              <label htmlFor="inv-qty-input">
                <span className="form-label">{vi ? "Số lượng (CP / CCQ / Chỉ)" : "Quantity"}</span>
                <TextInput
                  ctx={ctx}
                  id="inv-qty-input"
                  inputMode="decimal"
                  fallback="100"
                  placeholder="100"
                />
              </label>
              <label>
                <span className="form-label">{vi ? "Cách nhập giá" : "Price entry mode"}</span>
                <select
                  id="inv-entry-mode-input"
                  value={s.investmentEntryMode}
                  onChange={(event) =>
                    ctx.patch({
                      investmentEntryMode: event.target.value === "total" ? "total" : "unit",
                    })
                  }
                >
                  <option value="unit">{vi ? "Nhập đơn giá" : "Enter unit price"}</option>
                  <option value="total">{vi ? "Nhập tổng giá trị" : "Enter gross total"}</option>
                </select>
              </label>
            </div>
            <div className="form-grid" style={{ marginTop: 12 }}>
              <label htmlFor="inv-unit-price-input">
                <span className="form-label">
                  {vi ? "Đơn giá (₫ / đơn vị)" : "Unit price (₫ / unit)"}
                </span>
                <TextInput
                  ctx={ctx}
                  id="inv-unit-price-input"
                  inputMode="numeric"
                  fallback="125.000"
                  readOnly={s.investmentEntryMode === "total"}
                  {...(s.investmentEntryMode === "total" && quote?.ok
                    ? { value: formatUnitPrice(quote.unitPriceMilliVnd).replace(" ₫", "") }
                    : {})}
                />
              </label>
              <label htmlFor="inv-amount-input">
                <span className="form-label">
                  {vi ? "Tổng giá trị chưa phí/thuế" : "Gross total before fees/tax"}
                </span>
                <TextInput
                  ctx={ctx}
                  id="inv-amount-input"
                  inputMode="numeric"
                  fallback="12.500.000"
                  readOnly={s.investmentEntryMode === "unit"}
                  {...(s.investmentEntryMode === "unit" && quote?.ok
                    ? { value: formatVnd(quote.grossVnd).replace(" ₫", "") }
                    : {})}
                />
              </label>
            </div>
          </>
        ) : (
          <div className="form-grid" style={{ marginTop: 12 }}>
            <label htmlFor="inv-amount-input">
              <span className="form-label">
                {dividend
                  ? vi
                    ? "Số tiền cổ tức/lãi gộp"
                    : "Gross dividend/interest"
                  : vi
                    ? "Giá thị trường mỗi đơn vị"
                    : "Market price per unit"}
              </span>
              <TextInput
                ctx={ctx}
                id="inv-amount-input"
                inputMode="numeric"
                placeholder="1.000.000"
              />
            </label>
            <label htmlFor="inv-date-input">
              <span className="form-label">
                {vi ? "Ngày hiệu lực / định giá" : "Effective / valuation date"}
              </span>
              <TextInput ctx={ctx} id="inv-date-input" type="date" fallback="2026-11-01" />
            </label>
          </div>
        )}
        <div className="form-grid" style={{ marginTop: 12 }}>
          <label htmlFor="inv-settlement-input">
            <span className="form-label">
              {vi ? "Tài khoản tiền đối ứng" : "Settlement cash account"}
            </span>
            <SelectInput
              ctx={ctx}
              id="inv-settlement-input"
              fallback="TCBS Brokerage Cash"
              options={[
                ["TCBS Brokerage Cash", "TCBS Brokerage Cash"],
                ["Vietcombank · •• 2486", "Vietcombank · •• 2486"],
              ]}
            />
          </label>
          <label htmlFor="inv-fee-input">
            <span className="form-label">
              {dividend
                ? vi
                  ? "Thuế khấu trừ"
                  : "Withholding tax"
                : vi
                  ? "Phí & Thuế giao dịch"
                  : "Fee & Tax"}
            </span>
            <TextInput
              ctx={ctx}
              id="inv-fee-input"
              inputMode="numeric"
              fallback="0"
              placeholder="15.000"
            />
          </label>
        </div>
        {quote?.ok ? (
          <div className="calculation-preview" aria-live="polite">
            <span>
              {vi ? "Đơn giá" : "Unit price"}
              <strong>{formatUnitPrice(quote.unitPriceMilliVnd)}</strong>
            </span>
            <span>
              {vi ? "Giá trị gộp" : "Gross value"}
              <strong>{formatVnd(quote.grossVnd)}</strong>
            </span>
            <span>
              {type === "buy"
                ? vi
                  ? "Tiền thanh toán"
                  : "Cash paid"
                : vi
                  ? "Tiền thu sau phí/thuế"
                  : "Net proceeds"}
              <strong>
                {formatVnd(type === "sell" ? quote.grossVnd - quote.feeVnd : quote.cashVnd)}
              </strong>
            </span>
          </div>
        ) : null}
        <p className="prototype-notice">
          <Icon name="info" />
          {t("prototypeNotice")}
        </p>
        <Actions
          ctx={ctx}
          saveLabel={vi ? "Lưu vào danh mục đầu tư" : "Save investment entry"}
          onSave={ctx.save.investment}
          action="save-investment"
        />
      </section>
    </Overlay>
  );
}

export function goalLinkOptions(vi: boolean) {
  return [
    ["account:tcb-savings", "Techcombank Savings"],
    ["holding:FPT", "FPT · Holding market value"],
    ["tag:goal", vi ? "Giao dịch gắn thẻ #muctieu" : "Transactions tagged #goal"],
    [
      "plan:recurring",
      vi ? "Khoản đóng góp định kỳ trong kế hoạch" : "Recurring plan contribution",
    ],
  ] as const;
}

function GoalDialog({ ctx }: { ctx: Ctx }) {
  const { s, vi } = ctx;
  return (
    <Overlay ctx={ctx}>
      <section className="modal">
        <DialogHeader ctx={ctx}>
          <h2 id="dialog-title">
            {s.editingGoalId
              ? vi
                ? "Chỉnh sửa mục tiêu"
                : "Edit financial goal"
              : vi
                ? "Thêm mục tiêu tài chính"
                : "Add financial goal"}
          </h2>
        </DialogHeader>
        <FormError ctx={ctx} id="goal-error" />
        <label className="field" htmlFor="goal-name-input">
          <span className="form-label">{vi ? "Tên mục tiêu" : "Goal name"}</span>
          <TextInput
            ctx={ctx}
            id="goal-name-input"
            placeholder={vi ? "Ví dụ: Quỹ dự phòng" : "e.g. Emergency fund"}
          />
        </label>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <label htmlFor="goal-target-input">
            <span className="form-label">{vi ? "Số tiền mục tiêu" : "Target amount"}</span>
            <TextInput
              ctx={ctx}
              id="goal-target-input"
              inputMode="numeric"
              placeholder="120.000.000"
            />
          </label>
          <label htmlFor="goal-date-input">
            <span className="form-label">{vi ? "Ngày mục tiêu" : "Target date"}</span>
            <TextInput ctx={ctx} id="goal-date-input" type="date" fallback="2027-11-01" />
          </label>
          <label htmlFor="goal-priority-input">
            <span className="form-label">{vi ? "Ưu tiên" : "Priority"}</span>
            <SelectInput
              ctx={ctx}
              id="goal-priority-input"
              fallback="medium"
              options={[
                ["high", vi ? "Cao" : "High"],
                ["medium", vi ? "Trung bình" : "Medium"],
                ["low", vi ? "Thấp" : "Low"],
              ]}
            />
          </label>
          <label htmlFor="goal-allocation-input">
            <span className="form-label">
              {vi ? "Phần phân bổ nguồn (%)" : "Source allocation (%)"}
            </span>
            <TextInput
              ctx={ctx}
              id="goal-allocation-input"
              type="number"
              min={1}
              max={100}
              fallback="50"
            />
          </label>
        </div>
        <label className="field" htmlFor="goal-link-input">
          <span className="form-label">
            {vi ? "Liên kết nguồn theo dõi" : "Linked tracking source"}
          </span>
          <SelectInput
            ctx={ctx}
            id="goal-link-input"
            fallback="account:tcb-savings"
            options={goalLinkOptions(vi)}
          />
        </label>
        <label className="inline-note" style={{ marginTop: 16 }}>
          <input
            id="goal-overlap-input"
            type="checkbox"
            checked={ctx.draft("goal-overlap-input") === "true"}
            onChange={(event) => ctx.setDraft("goal-overlap-input", String(event.target.checked))}
          />
          <span>
            {vi
              ? "Cho phép nguồn này chồng lấp với mục tiêu khác sau cảnh báo"
              : "Allow this source to overlap another goal after warning"}
          </span>
        </label>
        <p className="prototype-notice">
          <Icon name="info" />
          {vi
            ? "Preview tạo plan draft: đóng góp thực tế, biến động thị trường, kế hoạch và gap được theo dõi riêng; không chuyển tiền."
            : "Preview creates a plan draft: actual contribution, market movement, planned contribution, and gap remain separate; no money moves."}
        </p>
        <Actions
          ctx={ctx}
          saveLabel={vi ? "Lưu mục tiêu" : "Save goal"}
          onSave={ctx.save.goal}
          action="save-goal"
        />
      </section>
    </Overlay>
  );
}

function DebtDialog({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const isRec = s.debtDirection === "receivable";
  const preview = buildReceivableDraft(
    ctx.draft("debt-principal-input"),
    ctx.draft("debt-rate-input", "80"),
  ).preview;
  return (
    <Overlay ctx={ctx}>
      <section className="modal">
        <DialogHeader ctx={ctx}>
          <h2 id="dialog-title">
            {vi ? "Thêm hồ sơ Công nợ / Khoản phải thu" : "Add Payable / Receivable Profile"}
          </h2>
        </DialogHeader>
        <Segmented
          action="debt-direction"
          items={[
            ["payable", vi ? "Khoản phải trả" : "Payable (Debt)"],
            ["receivable", vi ? "Khoản phải thu" : "Receivable (Loan to other)"],
          ]}
          active={s.debtDirection}
          onSelect={(value) => {
            const { "debt-rate-input": _removed, ...rest } = s.formDrafts;
            ctx.patch({ debtDirection: value, formDrafts: rest });
          }}
        />
        <div className="inline-note" data-pnl-impact="false">
          <Icon name="info" />
          <span>
            {vi
              ? "Giải ngân hoặc thu/trả tiền gốc chỉ làm thay đổi tài sản và nghĩa vụ, không tính vào Thu/Chi. Chỉ lãi và phí mới tác động Thu/Chi."
              : "Disbursement and principal repayment/collection are balance-sheet movements (Non-P&L)."}
          </span>
        </div>
        <FormError ctx={ctx} id="debt-error" />
        <label className="field" htmlFor="debt-title-input">
          <span className="form-label">
            {vi ? "Bên đối ứng / Tên khoản nợ" : "Counterparty / Obligation title"}
          </span>
          <TextInput
            ctx={ctx}
            id="debt-title-input"
            placeholder={
              isRec
                ? vi
                  ? "Ví dụ: Cho Hoàng vay ngắn hạn"
                  : "e.g. Personal loan to Hoang"
                : vi
                  ? "Ví dụ: Vay trả góp mua Macbook"
                  : "e.g. Laptop installment loan"
            }
          />
        </label>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <label htmlFor="debt-principal-input">
            <span className="form-label">{vi ? "Số tiền gốc" : "Principal amount"}</span>
            <TextInput
              ctx={ctx}
              id="debt-principal-input"
              inputMode="numeric"
              placeholder="15.000.000"
            />
          </label>
          <label htmlFor="debt-rate-input">
            <span className="form-label">
              {isRec
                ? vi
                  ? "Xác suất thu hồi ước tính (%)"
                  : "Estimated recovery probability (%)"
                : vi
                  ? "Lãi suất (%/năm)"
                  : "Interest rate (% APR)"}
            </span>
            <TextInput
              ctx={ctx}
              id="debt-rate-input"
              inputMode="decimal"
              fallback={isRec ? "80" : ""}
              placeholder={isRec ? "80%" : "8,5%/năm"}
            />
          </label>
        </div>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <label htmlFor="debt-due-date-input">
            <span className="form-label">{vi ? "Ngày đến hạn" : "Due date"}</span>
            <TextInput ctx={ctx} id="debt-due-date-input" type="date" fallback="2026-11-30" />
          </label>
          <label htmlFor="debt-reminder-input">
            <span className="form-label">{vi ? "Lịch nhắc" : "Reminder schedule"}</span>
            <SelectInput
              ctx={ctx}
              id="debt-reminder-input"
              fallback="7,3,1,0"
              options={[
                [
                  "7,3,1,0",
                  vi ? "7, 3, 1 ngày trước và ngày đến hạn" : "7, 3, 1 days before and on due date",
                ],
                [
                  "3,1,0",
                  vi ? "3, 1 ngày trước và ngày đến hạn" : "3, 1 days before and on due date",
                ],
                ["off", vi ? "Không nhắc" : "Off"],
              ]}
            />
          </label>
        </div>
        {isRec ? (
          <div className="calculation-preview" aria-live="polite">
            <span>
              {vi ? "Giá trị thu hồi ước tính" : "Estimated recoverable value"}
              <strong id="debt-erv-preview">{preview}</strong>
            </span>
          </div>
        ) : null}
        <p className="prototype-notice">
          <Icon name="info" />
          {t("prototypeNotice")}
        </p>
        <Actions
          ctx={ctx}
          saveLabel={vi ? "Lưu hồ sơ công nợ" : "Save obligation"}
          onSave={ctx.save.debt}
          action="save-debt"
        />
      </section>
    </Overlay>
  );
}
