import {
  applyManualValuationsToHoldings,
  type DebtObligation,
  debtObligations,
  type GoalRecordTuple,
  type InvestmentActivityRecord,
  type InvestmentHolding,
  investmentActivities,
  investmentHoldings,
} from "./prototype-model";
import {
  Assumption,
  type Ctx,
  derivedAttrs,
  ExplainButton,
  FilterRow,
  Heading,
  Icon,
  KpiBox,
  Row,
  Status,
  SubNav,
} from "./prototype-ui";

/* 5. INVESTMENTS — holdings, activity, performance */
export function InvestmentsView({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const holdings = applyManualValuationsToHoldings<InvestmentHolding>(
    [...investmentHoldings, ...s.customHoldings],
    s.customValuations,
    s.locale,
  );
  const activities = [...s.customActivities, ...investmentActivities];
  return (
    <>
      <Heading
        title={t("investmentsTitle")}
        subtitle={t("investmentsSubtitle")}
        actions={
          <button
            className="primary-button"
            id="open-investment-main"
            type="button"
            data-action="investment-add"
            onClick={() => ctx.openDialog("investment-add", "main")}
          >
            <Icon name="plus" />
            <span>{t("logInvestmentBtn")}</span>
          </button>
        }
      />
      <SubNav
        ctx={ctx}
        items={[
          ["holdings", t("invTabHoldings"), String(holdings.length)],
          ["activity", t("invTabActivity"), String(activities.length)],
          ["performance", t("invTabPerformance")],
        ]}
        active={s.invSub}
        onSelect={(value) => ctx.patch({ invSub: value })}
      />
      <article className="card investment-summary-card" {...derivedAttrs(ctx, "portfolioTotal")}>
        <div className="card-top">
          <div>
            <span className="card-label">
              {vi ? "Tổng giá trị danh mục đầu tư" : "Total portfolio market value"}
            </span>
            <Status ctx={ctx} kind="estimated" />
          </div>
          <div className="inline-actions">
            <ExplainButton
              ctx={ctx}
              id="explain-portfolio"
              derived="portfolioTotal"
              surface="portfolio"
            />
          </div>
        </div>
        <div className="today-kpi-grid">
          <KpiBox
            label={vi ? "Giá trị thị trường hiện tại" : "Current market value"}
            amount="108.000.000 ₫"
          >
            <small>
              {vi ? "Giá vốn bình quân: 96.500.000 ₫" : "Weighted-avg cost basis: 96,500,000 ₫"}
            </small>
          </KpiBox>
          <KpiBox
            label={vi ? "Lãi/lỗ theo giá hiện tại, chưa bán" : "Unrealized P&L"}
            amount="+11.500.000 ₫"
            amountClass="positive-text"
            boxClass="inflow-box"
          >
            <small>
              {vi ? "+11,9% trên giá vốn còn nắm giữ" : "+11.9% vs remaining cost basis"}
            </small>
          </KpiBox>
          <KpiBox
            label={vi ? "Cổ tức & Lãi đã chốt năm nay" : "Dividends & Realized P&L YTD"}
            amount="+3.050.000 ₫"
            amountClass="accent-text"
          >
            <small>
              {vi
                ? "Lãi chốt: +1,8tr · Cổ tức ròng: +1,25tr"
                : "Realized: +1.8m · Net dividend: +1.25m"}
            </small>
          </KpiBox>
          <KpiBox
            label={
              vi
                ? "Tỷ suất sinh lời có tính thời điểm nạp/rút tiền"
                : "Money-weighted return (XIRR)"
            }
            amount={vi ? "+12,8%/năm" : "+12.8%/yr"}
            boxClass="excluded-box"
          >
            <small>
              {vi
                ? "Đã điều chỉnh dòng tiền nạp/rút & phí"
                : "Adjusted for dated cash flows & fees"}
            </small>
          </KpiBox>
        </div>
      </article>
      {s.invSub === "activity" ? (
        <ActivitySection ctx={ctx} activities={activities} />
      ) : s.invSub === "performance" ? (
        <PerformanceSection ctx={ctx} />
      ) : (
        <HoldingsSection ctx={ctx} holdings={holdings} />
      )}
    </>
  );
}

function HoldingsSection({ ctx, holdings }: { ctx: Ctx; holdings: InvestmentHolding[] }) {
  const { vi } = ctx;
  return (
    <section className="review-list" id="investment-holdings-list">
      {holdings.map((h) => (
        <article
          className="review-item holding-row"
          data-asset-class={h.assetClass}
          data-valuation-mode={h.valuationMode}
          data-double-count-protected={h.doubleCountProtected ? "true" : undefined}
          key={h.id ?? h.symbol}
        >
          <span className="account-logo">{h.symbol.slice(0, 4)}</span>
          <div className="review-content">
            <div className="badge-group">
              <Status ctx={ctx} kind={h.state} />
              <span className="tag-pill">{vi ? h.assetLabelVi : h.assetLabelEn}</span>
              <span className="tag-pill">
                {h.valuationMode === "manual"
                  ? vi
                    ? "Định giá thủ công"
                    : "Manual valuation"
                  : h.valuationMode === "provider"
                    ? vi
                      ? "Giá đóng cửa / Giá quỹ"
                      : "Provider EOD / NAV"
                    : vi
                      ? "Sổ cái liên kết"
                      : "Linked ledger"}
              </span>
            </div>
            <h2>
              {h.symbol} · {h.portfolio} ({h.quantity})
            </h2>
            <p>
              {vi ? "Giá vốn:" : "Cost basis:"} {h.costBasis} · {vi ? "Giá hiện tại:" : "Price:"}{" "}
              {h.marketPrice} · {vi ? h.sourceVi : h.sourceEn}
            </p>
          </div>
          <div className="holding-metrics">
            <strong className="review-amount">{h.marketValue}</strong>
            <small className="positive-text">{h.unrealizedPnl}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

function ActivitySection({
  ctx,
  activities,
}: {
  ctx: Ctx;
  activities: InvestmentActivityRecord[];
}) {
  const { vi } = ctx;
  return (
    <section className="review-list" id="investment-activity-list">
      {activities.map((act) => (
        <article
          className="review-item"
          data-activity-kind={act.kind}
          data-pnl-impact={String(act.pnlImpact)}
          key={act.id}
        >
          <span className="review-icon">
            <Icon name="trend" />
          </span>
          <div className="review-content">
            <div className="badge-group">
              <Status ctx={ctx} kind={act.state} />
              <span className="tag-pill">
                {act.symbol} · {act.date}
              </span>
            </div>
            <h2>{vi ? act.titleVi : act.titleEn}</h2>
            <p>{vi ? act.metaVi : act.metaEn}</p>
          </div>
          <strong className="review-amount">{act.amount}</strong>
        </article>
      ))}
    </section>
  );
}

function PerformanceSection({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  return (
    <div className="plan-grid">
      <article className="card">
        <h2>{vi ? "Giải thích thay đổi giá trị danh mục" : "Performance Attribution Bridge"}</h2>
        <p className="muted">
          {vi
            ? "Tách bạch đóng góp tiền mặt ròng khỏi lãi/lỗ thị trường và cổ tức."
            : "Separates external cash flows from market movement and investment income."}
        </p>
        <div className="formula-list" style={{ marginTop: 14 }}>
          <Row
            label={
              vi ? "Giá trị danh mục đầu kỳ (01/01/2026)" : "Opening portfolio value (Jan 01, 2026)"
            }
            value="68.000.000 ₫"
          />
          <Row
            label={
              vi
                ? "Vốn nạp ròng từ tài khoản ngân hàng (không tính thu/chi)"
                : "Net external contributions (Non-P&L transfer)"
            }
            value="+26.500.000 ₫"
          />
          <Row
            label={vi ? "Thu nhập cổ tức & lãi tiền gửi đã nhận" : "Dividends & interest received"}
            value="+1.320.000 ₫"
            valueClass="positive-text"
          />
          <Row
            label={vi ? "Phí giao dịch & Thuế khấu trừ" : "Trading fees & withholding taxes"}
            value="−1.120.000 ₫"
            valueClass="negative-text"
          />
          <Row
            label={
              vi ? "Lãi đã chốt + Lãi/lỗ theo giá hiện tại" : "Realized + Unrealized market gain"
            }
            value="+13.300.000 ₫"
            valueClass="positive-text"
          />
          <div className="formula-total">
            <span>
              {vi
                ? "Giá trị danh mục cuối kỳ (01/11/2026)"
                : "Ending portfolio value (Nov 01, 2026)"}
            </span>
            <strong>108.000.000 ₫</strong>
          </div>
        </div>
      </article>
      <article className="card">
        <h2>{vi ? "Phân bổ theo loại tài sản" : "Asset Class Allocation"}</h2>
        <div className="allocation-bar">
          <span />
          <i />
          <b />
        </div>
        <div className="allocation-list">
          <span>
            <i className="asset-dot" />
            {vi ? "Cổ phiếu niêm yết (FPT · HOSE)" : "Listed equity (FPT · HOSE)"}
            <strong>67.000.000 ₫ (62,0%)</strong>
          </span>
          <span>
            <i className="flex-dot" />
            {vi ? "Chứng chỉ quỹ mở (DCDS)" : "Mutual funds (DCDS)"}
            <strong>19.800.000 ₫ (18,3%)</strong>
          </span>
          <span>
            <i className="buffer-dot" />
            {vi ? "Vàng vật chất 9999 (Định giá thủ công)" : "Physical gold 9999 (Manual)"}
            <strong>17.200.000 ₫ (15,9%)</strong>
          </span>
          <span>
            <i className="liability-dot" />
            {vi ? "Tiền mặt chờ đầu tư TCBS" : "Brokerage cash TCBS"}
            <strong>4.000.000 ₫ (3,8%)</strong>
          </span>
        </div>
      </article>
    </div>
  );
}

/* 6. DEBTS & RECEIVABLES — payables, receivables, simulation */
export function DebtsView({ ctx }: { ctx: Ctx }) {
  const { s, t } = ctx;
  const all = [...debtObligations, ...s.customDebts];
  const payables = all.filter((d) => d.direction === "payable");
  const receivables = all.filter((d) => d.direction === "receivable");
  return (
    <>
      <Heading
        title={t("debtsTitle")}
        subtitle={t("debtsSubtitle")}
        actions={
          <button
            className="primary-button"
            id="open-debt-main"
            type="button"
            data-action="debt-add"
            onClick={() => ctx.openDialog("debt-add", "main")}
          >
            <Icon name="plus" />
            <span>{t("addDebtBtn")}</span>
          </button>
        }
      />
      <SubNav
        ctx={ctx}
        items={[
          ["payables", t("debtTabPayables"), String(payables.length)],
          ["receivables", t("debtTabReceivables"), String(receivables.length)],
          ["simulation", t("debtTabSimulation")],
        ]}
        active={s.debtSub}
        onSelect={(value) => ctx.patch({ debtSub: value })}
      />
      {s.debtSub === "receivables" ? (
        <ReceivablesSection ctx={ctx} receivables={receivables} />
      ) : s.debtSub === "simulation" ? (
        <SimulationSection ctx={ctx} />
      ) : (
        <PayablesSection ctx={ctx} payables={payables} />
      )}
    </>
  );
}

function reminderText(ctx: Ctx, schedule: string | undefined) {
  if (!schedule) return null;
  const { vi } = ctx;
  return (
    <p>
      {vi ? "Nhắc trước hạn" : "Reminder"}:{" "}
      {schedule === "off" ? (vi ? "Tắt" : "Off") : `${schedule} ${vi ? "ngày" : "days"}`}
    </p>
  );
}

function PayablesSection({ ctx, payables }: { ctx: Ctx; payables: DebtObligation[] }) {
  const { s, vi } = ctx;
  return (
    <>
      <article className="card">
        <div className="today-kpi-grid">
          <KpiBox
            label={vi ? "Tổng dư nợ gốc phải trả" : "Total payable principal outstanding"}
            amount="33.500.000 ₫"
            amountClass="negative-text"
            boxClass="outflow-box"
          >
            <small>
              {vi ? "Vay VIB 30,0tr · Thẻ tín dụng VCB 3,5tr" : "VIB loan 30.0m · VCB card 3.5m"}
            </small>
            {s.customDebts.some((d) => d.direction === "payable") ? (
              <small>
                {vi
                  ? "Bản nháp mới chưa cộng vào tổng cho đến khi có lịch tách gốc/lãi/phí."
                  : "New drafts are excluded until principal/interest/fee schedules are confirmed."}
              </small>
            ) : null}
          </KpiBox>
          <KpiBox
            label={vi ? "Kỳ trả tiếp theo (12/11)" : "Next installment (Nov 12)"}
            amount="3.500.000 ₫"
          >
            <small>
              {vi
                ? "Gốc 2.800.000 ₫ không tính chi tiêu + Lãi 700.000 ₫ tính chi phí"
                : "Principal 2.8m (Non-P&L) + Interest 700k (Expense)"}
            </small>
          </KpiBox>
          <KpiBox
            label={vi ? "Ngày sạch nợ dự kiến (Lịch chuẩn)" : "Projected debt-free date"}
            amount="12/09/2027"
            amountClass="accent-text"
          >
            <small>{vi ? "Còn 11 kỳ thanh toán" : "11 installments remaining"}</small>
          </KpiBox>
        </div>
      </article>
      <section className="review-list" style={{ marginTop: 14 }}>
        {payables.map((d) =>
          d.direction === "payable" ? (
            <article
              className="review-item"
              data-obligation-direction="payable"
              data-pnl-impact="false"
              key={d.id}
            >
              <span className="review-icon">
                <Icon name="scale" />
              </span>
              <div className="review-content">
                <Status ctx={ctx} kind={d.state} />
                <h2>{vi ? d.counterpartyVi : d.counterpartyEn}</h2>
                <p>
                  {vi ? "Dư nợ gốc:" : "Outstanding principal:"}{" "}
                  <strong>{d.outstandingPrincipal}</strong> ({vi ? "Ban đầu" : "Original"}:{" "}
                  {d.originalPrincipal}) · {d.rate}
                </p>
                <p>
                  {vi ? "Kỳ tới" : "Next"} ({d.dueDate}): {d.nextInstallment}
                </p>
                {reminderText(ctx, d.reminderSchedule)}
              </div>
              <strong className="review-amount">{d.outstandingPrincipal}</strong>
            </article>
          ) : null,
        )}
      </section>
    </>
  );
}

function ReceivablesSection({ ctx, receivables }: { ctx: Ctx; receivables: DebtObligation[] }) {
  const { vi } = ctx;
  return (
    <article className="card">
      <div className="notice">
        <Icon name="info" />
        <p>
          {vi
            ? "Tài sản ròng dùng giá trị dự kiến thu hồi = tiền gốc × xác suất thu hồi, không mặc định tính đủ 100% tiền gốc."
            : "Net worth uses estimated recoverable value = principal × recovery probability, rather than assuming full recovery."}
        </p>
      </div>
      <div className="review-list" style={{ marginTop: 14 }}>
        {receivables.map((r) =>
          r.direction === "receivable" ? (
            <article
              className="review-item"
              data-obligation-direction="receivable"
              data-pnl-impact="false"
              key={r.id}
            >
              <span className="review-icon">
                <Icon name="scale" />
              </span>
              <div className="review-content">
                <Status ctx={ctx} kind={r.state} />
                <h2>{vi ? r.counterpartyVi : r.counterpartyEn}</h2>
                <p>
                  {vi ? "Tiền gốc:" : "Gross principal:"} <strong>{r.grossPrincipal}</strong> ·{" "}
                  {vi ? "Xác suất thu hồi:" : "Recovery probability:"}{" "}
                  <strong>{r.recoveryProbability}</strong> · {vi ? "Đến hạn:" : "Due:"} {r.dueDate}
                </p>
                <p>
                  {vi
                    ? "Thu lại tiền gốc không phải thu nhập; chỉ phần lãi thu được mới được tính là thu nhập."
                    : "Principal collection is non-P&L; only collected interest counts as income."}
                </p>
                {reminderText(ctx, r.reminderSchedule)}
              </div>
              <div className="holding-metrics">
                <strong className="review-amount accent-text">
                  {vi ? "Dự kiến thu hồi" : "ERV"}: {r.estimatedRecoverable}
                </strong>
                <small className="muted">
                  {vi ? "Tiền gốc" : "Gross"}: {r.grossPrincipal}
                </small>
              </div>
            </article>
          ) : null,
        )}
      </div>
    </article>
  );
}

const simulationScenarios = {
  "0k": { freeDate: "12/09/2027", savedInterest: "0 ₫", monthsSaved: "0", impact: "0 ₫" },
  "1000k": {
    freeDate: "12/07/2027",
    savedInterest: "1.350.000 ₫",
    monthsSaved: "2",
    impact: "1.000.000 ₫",
  },
  "2000k": {
    freeDate: "12/05/2027",
    savedInterest: "2.450.000 ₫",
    monthsSaved: "4",
    impact: "2.000.000 ₫",
  },
} as const;

function SimulationSection({ ctx }: { ctx: Ctx }) {
  const { s, vi } = ctx;
  const current = simulationScenarios[s.simExtra];
  return (
    <article className="card">
      <div className="section-title">
        <div>
          <h2>{vi ? "Mô phỏng trả thêm gốc hàng tháng" : "What-if Extra Principal Simulation"}</h2>
          <p className="muted">
            {vi
              ? "Mô phỏng không tự động ghi vào sổ cái. Chọn 'Áp dụng vào kế hoạch' chỉ tạo bản nháp kế hoạch chi tiêu."
              : "Simulation does not mutate the ledger. 'Apply to plan' only creates a plan draft."}
          </p>
        </div>
        <Status ctx={ctx} kind="forecast" />
      </div>
      <div style={{ marginTop: 14 }}>
        <FilterRow
          items={[
            ["0k", vi ? "Theo lịch chuẩn (+0 ₫)" : "Standard schedule (+0 ₫)"],
            ["1000k", vi ? "Trả thêm 1.000.000 ₫/tháng" : "Extra 1,000,000 ₫/mo"],
            ["2000k", vi ? "Trả thêm 2.000.000 ₫/tháng" : "Extra 2,000,000 ₫/mo"],
          ]}
          active={s.simExtra}
          onSelect={(value) => ctx.patch({ simExtra: value as typeof s.simExtra })}
        />
      </div>
      <div className="today-kpi-grid">
        <KpiBox
          label={vi ? "Ngày sạch nợ dự kiến mới" : "New debt-free date"}
          amount={current.freeDate}
          amountClass="accent-text"
        >
          <small>
            {vi
              ? `Rút ngắn ${current.monthsSaved} tháng so với lịch gốc`
              : `${current.monthsSaved} months earlier than baseline`}
          </small>
        </KpiBox>
        <KpiBox
          label={vi ? "Tổng tiền lãi tiết kiệm được" : "Estimated interest saved"}
          amount={current.savedInterest}
          amountClass="positive-text"
          boxClass="inflow-box"
        >
          <small>
            {vi
              ? "Giả định lãi suất 9,2%/năm không đổi, phí trả trước 0%"
              : "Assumes 9.2% APR constant, 0% prepayment fee"}
          </small>
        </KpiBox>
        <KpiBox
          label={
            vi ? "Tác động lên Safe-to-spend tháng tới" : "Impact on next month's Safe-to-spend"
          }
          amount={`−${current.impact}`}
          boxClass="excluded-box"
        >
          <small>
            {vi
              ? "Vẫn giữ nguyên khoản đệm tối thiểu 5.000.000 ₫"
              : "Preserves 5,000,000 ₫ minimum cash buffer"}
          </small>
        </KpiBox>
      </div>
      <footer className="safe-footer">
        <span>
          <Icon name="info" />
          {vi
            ? "Chỉ tạo bản nháp kế hoạch, không tự thực hiện chuyển tiền."
            : "Creates a plan draft only; never executes a payment."}
        </span>
        <button className="primary-button" type="button" onClick={ctx.demo}>
          {vi ? "Áp dụng vào kế hoạch (Bản nháp)" : "Apply to plan (Draft)"}
        </button>
      </footer>
    </article>
  );
}

/* 7. PLAN — safe-to-spend, goals, forecast, suggestions */
export const stsAssumptions = [
  ["liquid", "24.950.000 ₫"],
  ["inflow", "+12.200.000 ₫"],
  ["commitments", "−19.750.000 ₫"],
  ["buffer", "−5.000.000 ₫"],
] as const;

export function PlanView({ ctx }: { ctx: Ctx }) {
  const { s, t } = ctx;
  return (
    <>
      <Heading title={t("planTitle")} subtitle={t("planSubtitle")} />
      <SubNav
        ctx={ctx}
        items={[
          ["sts", t("planTabSts")],
          ["goals", t("planTabGoals"), String(3 + s.customGoals.length)],
          ["forecast", t("planTabForecast")],
          ["suggestions", t("planTabSuggestions"), "1"],
        ]}
        active={s.planSub}
        onSelect={(value) => ctx.patch({ planSub: value })}
      />
      {s.planSub === "goals" ? (
        <GoalsSection ctx={ctx} />
      ) : s.planSub === "forecast" ? (
        <ForecastSection ctx={ctx} />
      ) : s.planSub === "suggestions" ? (
        <SuggestionsSection ctx={ctx} />
      ) : (
        <StsSection ctx={ctx} />
      )}
    </>
  );
}

const allocationFields = [
  ["allocation-needs", "Thiết yếu", "Needs", "50"],
  ["allocation-wants", "Mong muốn", "Wants", "20"],
  ["allocation-saving", "Tiết kiệm", "Saving", "15"],
  ["allocation-investing", "Đầu tư", "Investing", "10"],
  ["allocation-debt", "Trả nợ thêm", "Extra debt", "5"],
] as const;

export const allocationDefaults = allocationFields.map(([id, , , fallback]) => [id, fallback]);

function StsSection({ ctx }: { ctx: Ctx }) {
  const { t, vi } = ctx;
  return (
    <div className="plan-grid">
      <article className="card plan-overview" {...derivedAttrs(ctx, "safeToSpend")}>
        <div className="card-top">
          <span className="card-label">{t("safe")}</span>
          <ExplainButton ctx={ctx} id="explain-plan" derived="safeToSpend" surface="plan" />
        </div>
        <p className="hero-amount">
          12.400.000 <small>₫</small>
        </p>
        <div className="allocation-bar">
          <span />
          <i />
          <b />
        </div>
        <div className="allocation-list">
          <span>
            <i className="asset-dot" />
            {t("reserved")}
            <strong>11.750.000 ₫</strong>
          </span>
          <span>
            <i className="flex-dot" />
            {t("flexible")}
            <strong>12.400.000 ₫</strong>
          </span>
          <span>
            <i className="buffer-dot" />
            {t("buffer")}
            <strong>5.000.000 ₫</strong>
          </span>
        </div>
        <footer className="safe-footer">
          <span>{t("horizon")}</span>
          <span>{t("version")}</span>
        </footer>
      </article>
      <article className="card assumption-card">
        <div className="notice">
          <Icon name="info" />
          <p>{t("forecastNote")}</p>
        </div>
        <h2>{t("source")}</h2>
        {stsAssumptions.map(([label, value]) => (
          <Assumption ctx={ctx} label={label} value={value} key={label} />
        ))}
      </article>
      <article className="card">
        <div className="card-top">
          <div>
            <span className="card-label">
              {vi ? "Tỷ lệ cá nhân hóa · Bản nháp v1" : "Personal allocation · Draft v1"}
            </span>
            <h2>
              {vi ? "Chi tiêu · Tiết kiệm · Đầu tư · Nợ" : "Spending · Saving · Investing · Debt"}
            </h2>
          </div>
        </div>
        <p className="muted">
          {vi
            ? "50/30/20 chỉ là mẫu khởi đầu. Sửa mọi bucket; tổng phải bằng 100%. Lưu chỉ tạo plan draft có thể đổi lại."
            : "50/30/20 is only a starting template. Edit every bucket; the total must equal 100%. Saving creates an editable plan draft."}
        </p>
        <div className="form-grid" style={{ marginTop: 12 }}>
          {allocationFields.map(([id, labelVi, labelEn, fallback]) => (
            <label key={id}>
              <span className="form-label">{vi ? labelVi : labelEn}</span>
              <input
                id={id}
                type="number"
                min={0}
                max={100}
                value={ctx.draft(id, fallback)}
                onChange={(event) => ctx.setDraft(id, event.target.value)}
              />
            </label>
          ))}
          <label>
            <span className="form-label">{vi ? "Hiệu lực từ" : "Effective date"}</span>
            <input
              id="allocation-effective-date"
              type="date"
              value={ctx.draft("allocation-effective-date", "2026-12-01")}
              onChange={(event) => ctx.setDraft("allocation-effective-date", event.target.value)}
            />
          </label>
        </div>
        <div className="inline-note" style={{ marginTop: 16 }}>
          <Icon name="info" />
          <span>
            {vi
              ? "Preview: thay đổi tỷ lệ chỉ phân bổ thu nhập kế hoạch tương lai; không sửa giao dịch hoặc tự chuyển tiền."
              : "Preview: ratios allocate future planned income only; they do not edit transactions or move money."}
          </span>
        </div>
        <button
          className="secondary-button compact-btn"
          type="button"
          data-action="save-allocation"
          onClick={ctx.save.allocation}
        >
          <Icon name="check" />
          <span>{vi ? "Lưu bản nháp tỷ lệ" : "Save ratio draft"}</span>
        </button>
      </article>
    </div>
  );
}

function GoalsSection({ ctx }: { ctx: Ctx }) {
  const { s, vi } = ctx;
  const builtIn: GoalRecordTuple[] = [
    [
      vi ? "Quỹ dự phòng khẩn cấp (6 tháng chi thiết yếu)" : "Emergency Fund (6 months essential)",
      "90.000.000 ₫ / 120.000.000 ₫ (75%)",
      vi
        ? "Liên kết: Techcombank Savings (50% số dư = 90tr) · Đóng góp tự động 5tr/tháng"
        : "Linked: Techcombank Savings (50% share = 90m) · 5m/mo auto-plan",
      "posted",
    ],
    [
      vi ? "Quỹ mua nhà / Đặt cọc căn hộ 2028" : "Home Down-payment 2028",
      "157.000.000 ₫ / 500.000.000 ₫ (31,4%)",
      vi
        ? "Liên kết: Techcombank Savings (50% = 90tr) + Cổ phiếu FPT (67tr) · Tách gốc đóng góp 149tr & Lãi thị trường +8tr"
        : "Linked: TCB Savings (90m) + FPT Equity (67m) · Contributed 149m + Market gain 8m",
      "estimated",
    ],
    [
      vi ? "Quỹ học tập & Chứng chỉ chuyên môn" : "Education & Certification Fund",
      "19.800.000 ₫ / 30.000.000 ₫ (66%)",
      vi
        ? "Liên kết: Chứng chỉ quỹ DCDS (19,8tr) · Không trùng lặp phân bổ với mục tiêu khác"
        : "Linked: DCDS Fund (19.8m) · Zero allocation overlap with other goals",
      "posted",
    ],
  ];
  const goals = [...s.customGoals, ...builtIn];
  return (
    <>
      <div className="section-actions">
        <button
          className="primary-button"
          id="open-goal-main"
          type="button"
          data-action="goal-add"
          onClick={() => ctx.openDialog("goal-add", "main")}
        >
          <Icon name="plus" />
          <span>{vi ? "Thêm mục tiêu" : "Add goal"}</span>
        </button>
      </div>
      <section className="review-list">
        {goals.map(([title, progress, meta, state, id]) => (
          <article className="review-item" key={id ?? title}>
            <span className="review-icon">
              <Icon name="plan" />
            </span>
            <div className="review-content">
              <Status ctx={ctx} kind={state} />
              <h2>{title}</h2>
              <p>{meta}</p>
              {id ? (
                <div className="row-actions">
                  <button
                    className="text-button"
                    type="button"
                    data-action="goal-edit"
                    onClick={() => ctx.save.goalEdit(id)}
                  >
                    {vi ? "Chỉnh sửa" : "Edit"}
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    data-action="goal-pause"
                    onClick={() => ctx.save.goalPause(id)}
                  >
                    {vi ? "Tạm dừng" : "Pause"}
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    data-action="goal-archive"
                    onClick={() => ctx.save.goalArchive(id)}
                  >
                    {vi ? "Lưu trữ" : "Archive"}
                  </button>
                </div>
              ) : null}
            </div>
            <strong className="review-amount accent-text">{progress}</strong>
          </article>
        ))}
      </section>
    </>
  );
}

const forecastScenarios = {
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
} as const;

function ForecastSection({ ctx }: { ctx: Ctx }) {
  const { s, vi } = ctx;
  const sc = forecastScenarios[s.forecastScenario];
  return (
    <article className="card" {...derivedAttrs(ctx, "cashFlow")}>
      <div className="section-title">
        <div>
          <h2>
            {vi ? "Dự báo dòng tiền 30 ngày theo kịch bản" : "30-Day Scenario Cash-Flow Forecast"}
          </h2>
          <p className="muted">{vi ? sc.noteVi : sc.noteEn}</p>
        </div>
        <Status ctx={ctx} kind="forecast" />
      </div>
      <div style={{ marginTop: 14 }}>
        <FilterRow
          items={[
            ["conservative", vi ? "Thận trọng (Conservative)" : "Conservative"],
            ["base", vi ? "Cơ sở (Base)" : "Base"],
            ["optimistic", vi ? "Tích cực (Optimistic)" : "Optimistic"],
          ]}
          active={s.forecastScenario}
          onSelect={(value) => ctx.patch({ forecastScenario: value as typeof s.forecastScenario })}
        />
      </div>
      <div className="today-kpi-grid">
        <KpiBox
          label={vi ? "Điểm thấp nhất dự kiến (12/11)" : "Projected low point (Nov 12)"}
          amount={sc.low}
        >
          <small>
            {vi
              ? "Ngay sau kỳ trả góp VIB 3,5tr · Cao hơn mức đệm 5tr"
              : "Right after 3.5m VIB loan payment · Above 5m buffer"}
          </small>
        </KpiBox>
        <KpiBox
          label={
            vi
              ? "Số dư thanh khoản dự kiến cuối kỳ (30/11)"
              : "Projected ending liquid cash (Nov 30)"
          }
          amount={sc.end}
          amountClass="positive-text"
          boxClass="inflow-box"
        >
          <small>
            {vi
              ? "Đã trừ toàn bộ 19,75tr cam kết cố định tháng 11"
              : "After all 19.75m Nov fixed commitments"}
          </small>
        </KpiBox>
      </div>
    </article>
  );
}

function SuggestionsSection({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  return (
    <article className="card">
      <div className="notice">
        <Icon name="shield" />
        <p>
          {vi
            ? "Đủ dữ liệu để tạo gợi ý: 62 ngày lịch sử, 2 chu kỳ lương đầy đủ và 94% giao dịch đã phân loại. Gợi ý chỉ hỗ trợ quyết định, không tự động thực thi."
            : "Suggestion eligibility: 62 days history, 2 full income cycles, and 94% categorized. Suggestions never auto-execute."}
        </p>
      </div>
      <div className="review-list" style={{ marginTop: 14 }}>
        <article className="review-item suggestion-card">
          <span className="review-icon">
            <Icon name="scale" />
          </span>
          <div className="review-content">
            <div className="badge-group">
              <Status ctx={ctx} kind="estimated" />
              <span className="tag-pill">
                {vi ? "Độ tin cậy: Cao · Kịch bản trả nợ" : "Confidence: High · Debt plan"}
              </span>
            </div>
            <h2>
              {vi
                ? "Tăng trả gốc khoản vay VIB thêm 2.000.000 ₫/tháng sau ngày nhận lương 15/11"
                : "Increase VIB loan principal payment by 2,000,000 ₫/month after Nov 15 payday"}
            </h2>
            <p>
              <strong>1. {vi ? "Phát hiện" : "Detection"}:</strong>{" "}
              {vi
                ? "Dòng tiền ròng sau cam kết cố định trong 2 tháng qua dư trung bình 6.400.000 ₫/tháng."
                : "Net cash after fixed commitments averaged +6,400,000 ₫/mo over the last 2 cycles."}
            </p>
            <p>
              <strong>2. {vi ? "Vì sao" : "Reason"}:</strong>{" "}
              {vi
                ? "Lãi vay VIB (9,2%/năm) cao hơn lãi tiền gửi ngắn hạn (5,4%/năm), trong khi Quỹ dự phòng đã đạt 75%."
                : "VIB loan APR (9.2%) exceeds term-deposit yield (5.4%), while emergency fund is at 75%."}
            </p>
            <p>
              <strong>3. {vi ? "Tác động dự kiến" : "Expected impact"}:</strong>{" "}
              {vi
                ? "Tất toán sớm 4 tháng (12/05/2027), tiết kiệm ~2.450.000 ₫ tiền lãi, vẫn giữ nguyên đệm 5.000.000 ₫."
                : "Finish 4 months earlier (May 2027), save ~2,450,000 ₫ interest, keep 5m buffer intact."}
            </p>
            <p>
              <small>
                {vi
                  ? "Nguồn đối chiếu: Khoản vay VIB, Cam kết trả góp tháng, Công thức STS v1.0 · Cập nhật 08:30 01/11/2026"
                  : "Based on: VIB loan profile, Monthly installment commitment, STS v1.0 · Snapshot Nov 01, 2026 08:30"}
              </small>
            </p>
          </div>
          <div className="inline-actions">
            <button className="primary-button compact-btn" type="button" onClick={ctx.demo}>
              {vi ? "Áp dụng vào kế hoạch (Bản nháp)" : "Apply to plan (Draft)"}
            </button>
            <button className="secondary-button compact-btn" type="button" onClick={ctx.demo}>
              {vi ? "Nhắc lại sau" : "Remind later"}
            </button>
            <button className="secondary-button compact-btn" type="button" onClick={ctx.demo}>
              {vi ? "Không phù hợp" : "Not relevant"}
            </button>
          </div>
        </article>
      </div>
    </article>
  );
}
