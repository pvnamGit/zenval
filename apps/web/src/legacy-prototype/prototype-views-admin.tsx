import {
  type Ctx,
  derivedAttrs,
  Heading,
  Icon,
  KpiBox,
  LocaleControl,
  Row,
  Status,
  SubNav,
} from "./prototype-ui";

/* 8. REPORTS & MONTHLY CLOSE */
export function ReportsView({ ctx }: { ctx: Ctx }) {
  const { s, t } = ctx;
  return (
    <>
      <Heading title={t("reportsTitle")} subtitle={t("reportsSubtitle")} />
      <SubNav
        ctx={ctx}
        items={[
          ["pnlCashflow", t("repTabPnl")],
          ["netWorthBridge", t("repTabBridge")],
          ["monthlyClose", t("repTabClose")],
        ]}
        active={s.repSub}
        onSelect={(value) => ctx.patch({ repSub: value })}
      />
      {s.repSub === "netWorthBridge" ? (
        <BridgeSection ctx={ctx} />
      ) : s.repSub === "monthlyClose" ? (
        <MonthlyCloseSection ctx={ctx} />
      ) : (
        <PnlSection ctx={ctx} />
      )}
    </>
  );
}

function PnlSection({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  return (
    <>
      <article className="card">
        <div className="section-title">
          <div>
            <h2>
              {vi
                ? "Báo cáo Thu nhập & Chi phí tháng 10/2026"
                : "October 2026 Income & Expense Report"}
            </h2>
            <p className="muted">
              {vi
                ? "Chuyển khoản nội bộ (12.000.000 ₫) và trả gốc nợ (2.800.000 ₫) không được tính vào thu nhập hoặc chi phí."
                : "Internal transfers (12,000,000 ₫) and debt principal repayments (2,800,000 ₫) are strictly excluded from P&L."}
            </p>
          </div>
          <Status ctx={ctx} kind="posted" />
        </div>
        <div className="today-kpi-grid">
          <KpiBox
            label={vi ? "Tổng thu nhập đã ghi sổ" : "Total posted income"}
            amount="+35.475.000 ₫"
            amountClass="positive-text"
            boxClass="inflow-box"
          >
            <small>
              {vi
                ? "Lương 30tr · Dự án 5tr · Cổ tức 475k"
                : "Salary 30m · Retainer 5m · Dividend 475k"}
            </small>
          </KpiBox>
          <KpiBox
            label={vi ? "Tổng chi phí thực tế" : "Total actual expenses (P&L)"}
            amount="−21.850.000 ₫"
            amountClass="negative-text"
            boxClass="outflow-box"
          >
            <small>
              {vi
                ? "Chi cố định 11,25tr · Lãi vay 700k · Linh hoạt 9,9tr"
                : "Fixed 11.25m · Loan interest 700k · Flexible 9.9m"}
            </small>
          </KpiBox>
          <KpiBox
            label={vi ? "Thặng dư thu/chi ròng" : "Net P&L savings"}
            amount="+13.625.000 ₫"
            amountClass="accent-text"
          >
            <small>{vi ? "Tỷ lệ tiết kiệm ròng: 38,4%" : "Net savings rate: 38.4%"}</small>
          </KpiBox>
          <KpiBox
            label={
              vi
                ? "Dịch chuyển tài sản/nghĩa vụ, không tính thu/chi"
                : "Balance-sheet movements (Non-P&L)"
            }
            amount="21.000.000 ₫"
            boxClass="excluded-box"
            pnlImpactFalse
          >
            <small>
              {vi
                ? "Trả gốc VIB 2,8tr · Mua FPT 13,2tr · Gửi tiết kiệm 5tr"
                : "Principal 2.8m · Equity buy 13.2m · Savings 5m"}
            </small>
          </KpiBox>
        </div>
      </article>
      <div className="plan-grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h2>
            {vi
              ? "Chi tiết nguồn thu & nhóm chi tháng 10/2026"
              : "October 2026 Income & Expense Breakdown"}
          </h2>
          <div className="formula-list" style={{ marginTop: 12 }}>
            <Row
              label={vi ? "Lương chính công ty" : "Primary monthly salary"}
              sub={vi ? "Vietcombank · Đã ghi sổ 15/10" : "Vietcombank · Posted Oct 15"}
              value="+30.000.000 ₫"
              valueClass="positive-text"
            />
            <Row
              label={
                vi
                  ? "Hợp đồng bảo trì & Cổ tức tiền mặt FPT"
                  : "Maintenance retainer & FPT cash dividend"
              }
              sub={
                vi
                  ? "Dự án 5.000.000 ₫ · Cổ tức ròng 475.000 ₫"
                  : "Retainer 5,000,000 ₫ · Net dividend 475,000 ₫"
              }
              value="+5.475.000 ₫"
              valueClass="positive-text"
            />
            <Row
              label={
                vi
                  ? "Cam kết cố định (Thuê nhà, Điện nước, Bảo hiểm)"
                  : "Fixed commitments (Rent, Utilities, Insurance)"
              }
              sub={vi ? "3 danh mục thiết yếu đã tất toán" : "3 essential categories settled"}
              value="−11.250.000 ₫"
              valueClass="negative-text"
            />
            <Row
              label={
                vi
                  ? "Chi tiêu sinh hoạt linh hoạt (Ăn uống, Di chuyển)"
                  : "Flexible daily living (Groceries, Transport)"
              }
              sub={vi ? "42 giao dịch đã phân loại" : "42 categorized transactions"}
              value="−9.900.000 ₫"
              valueClass="negative-text"
            />
            <Row
              label={vi ? "Chi phí lãi vay ngân hàng VIB" : "VIB bank loan interest expense"}
              sub={
                vi ? "Chỉ phần lãi tính vào chi phí P&L" : "Interest portion only counted in P&L"
              }
              value="−700.000 ₫"
              valueClass="negative-text"
            />
            <div className="formula-total">
              <span>{vi ? "Thặng dư thu/chi ròng tháng 10" : "October net P&L savings"}</span>
              <strong className="positive-text">+13.625.000 ₫</strong>
            </div>
          </div>
        </article>
        <article className="card" data-pnl-impact="false">
          <h2>
            {vi ? "Dịch chuyển Bảng cân đối tháng 10/2026" : "October 2026 Balance-Sheet Movements"}
          </h2>
          <div className="formula-list" style={{ marginTop: 12 }}>
            <Row
              label={vi ? "Mua tích sản 100 CP FPT" : "Accumulated 100 FPT shares"}
              sub={vi ? "Tăng giá vốn danh mục đầu tư" : "Increases portfolio cost basis"}
              value="13.200.000 ₫"
            />
            <Row
              label={vi ? "Trích lập Quỹ dự phòng khẩn cấp" : "Emergency fund auto-transfer"}
              sub="VCB → Techcombank Savings"
              value="5.000.000 ₫"
            />
            <Row
              label={vi ? "Trả nợ gốc khoản vay VIB" : "VIB loan principal repayment"}
              sub={vi ? "Giảm dư nợ gốc phải trả" : "Reduces payable principal liability"}
              value="2.800.000 ₫"
            />
            <Row
              label={vi ? "Chuyển khoản thanh khoản nội bộ" : "Internal liquidity transfers"}
              sub={vi ? "VCB ↔ MoMo · Không đổi tài sản ròng" : "VCB ↔ MoMo · Net-worth neutral"}
              value="12.000.000 ₫"
            />
            <Row
              label={vi ? "Thu hồi gốc khoản phải thu" : "Receivable principal collection"}
              sub={vi ? "Kỳ hạn thu hồi dự kiến 25/11/2026" : "Scheduled recovery due Nov 25, 2026"}
              value="0 ₫"
            />
            <div className="formula-total">
              <span>
                {vi ? "Tác động trực tiếp lên báo cáo Thu/Chi" : "Direct P&L income/expense impact"}
              </span>
              <strong>0 ₫</strong>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

function BridgeSection({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  return (
    <article className="card" {...derivedAttrs(ctx, "netWorth")}>
      <h2>{vi ? "Giải thích thay đổi Tài sản ròng" : "Net-Worth Bridge"}</h2>
      <div className="formula-list" style={{ marginTop: 14 }}>
        <Row
          label={vi ? "Tài sản ròng đầu tháng (01/10/2026)" : "Opening Net Worth (Oct 01, 2026)"}
          value="277.350.000 ₫"
        />
        <Row
          label={
            vi
              ? "Thặng dư thu/chi tháng (đã gồm cổ tức, lãi vay và phí)"
              : "Monthly net P&L (including dividends, interest and fees)"
          }
          value="+13.625.000 ₫"
          valueClass="positive-text"
        />
        <Row
          label={
            vi
              ? "Biến động giá trị thị trường (Cổ phiếu, Quỹ, Vàng)"
              : "Realized/unrealized market movement"
          }
          value="+1.625.000 ₫"
          valueClass="positive-text"
        />
        <Row
          label={
            vi
              ? "Thay đổi giá trị dự kiến thu hồi khoản phải thu"
              : "Receivable recovery estimate change"
          }
          value="0 ₫"
        />
        <div className="formula-total">
          <span>
            {vi ? "Tài sản ròng hiện tại (01/11/2026)" : "Current Net Worth (Nov 01, 2026)"}
          </span>
          <strong>292.600.000 ₫</strong>
        </div>
      </div>
    </article>
  );
}

function MonthlyCloseSection({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  const steps = [
    [
      vi
        ? "1. Xử lý các giao dịch quan trọng trong Cần xem lại"
        : "1. Review unresolved critical transactions",
      vi ? "Còn 3 mục (1 chuyển khoản, 1 nghi trùng, 1 lệch cam kết)" : "3 items remaining",
      "pending",
    ],
    [
      vi
        ? "2. Đối chiếu số dư các tài khoản thanh khoản chính"
        : "2. Reconcile selected liquid accounts",
      vi ? "Vietcombank & Techcombank đã khớp 100%" : "VCB & Techcombank 100% matched",
      "posted",
    ],
    [
      vi
        ? "3. Xác nhận lịch công nợ & định giá tài sản thủ công"
        : "3. Confirm debts/receivables and manual valuations",
      vi
        ? "Giá vàng nhẫn & ERV khoản phải thu đã cập nhật 01/11"
        : "Gold & receivable ERV updated Nov 01",
      "posted",
    ],
    [
      vi ? "4. Xem chênh lệch Thực tế vs Kế hoạch & ghi chú" : "4. Review actual vs plan variance",
      vi ? "Lệch 120.000 ₫ khoản vay ngân hàng đã có giải trình" : "120k loan variance explained",
      "posted",
    ],
    [
      vi
        ? "5. Khóa Snapshot tháng (Versioned) & chuyển tiếp cam kết"
        : "5. Generate versioned monthly snapshot & carry forward",
      vi ? "Sẵn sàng tạo snapshot close-2026-10-v1.0" : "Ready to generate close-2026-10-v1.0",
      "estimated",
    ],
  ] as const;
  return (
    <article className="card">
      <div className="section-title">
        <div>
          <h2>{vi ? "Quy trình Đóng sổ tháng" : "Monthly Close Checklist"}</h2>
          <p className="muted">
            {vi
              ? "Khóa snapshot có phiên bản và tự động mang các cam kết cố định đang hoạt động sang tháng mới."
              : "Generates a versioned snapshot and carries active fixed commitments forward."}
          </p>
        </div>
        <button className="primary-button" type="button" onClick={ctx.demo}>
          {vi ? "Khóa số liệu tháng 10 (v1.0)" : "Lock Oct Snapshot (v1.0)"}
        </button>
      </div>
      <div className="review-list" style={{ marginTop: 14 }}>
        {steps.map(([title, sub, state]) => (
          <article className="transaction-row" key={title}>
            <span className="transaction-icon">
              <Icon name="check" />
            </span>
            <span className="transaction-copy">
              <strong>{title}</strong>
              <small>{sub}</small>
            </span>
            <Status ctx={ctx} kind={state} />
            <strong className="transaction-amount">{state === "posted" ? "OK" : "..."}</strong>
          </article>
        ))}
      </div>
    </article>
  );
}

/* 9. SETTINGS & DATA RIGHTS */
export function SettingsView({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  return (
    <>
      <Heading title={t("settingsTitle")} subtitle={t("settingsSubtitle")} />
      <SubNav
        ctx={ctx}
        items={[
          ["profile", t("setTabProfile")],
          ["categories", t("setTabCategories")],
          ["sources", t("setTabSources")],
          ["notifications", vi ? "Thông báo & Nhắc lịch" : "Notifications & Reminders"],
          ["privacy", t("setTabPrivacy")],
          ["security", t("setTabSecurity")],
        ]}
        active={s.setSub}
        onSelect={(value) => ctx.patch({ setSub: value })}
      />
      {s.setSub === "privacy" ? (
        <PrivacySection ctx={ctx} />
      ) : s.setSub === "security" ? (
        <SecuritySection ctx={ctx} />
      ) : s.setSub === "categories" ? (
        <CategoriesSection ctx={ctx} />
      ) : s.setSub === "sources" ? (
        <SourcesSection ctx={ctx} />
      ) : s.setSub === "notifications" ? (
        <NotificationsSection ctx={ctx} />
      ) : (
        <ProfileSection ctx={ctx} />
      )}
    </>
  );
}

function effectiveTimezone(ctx: Ctx) {
  return ctx.s.timezoneMode === "device" ? ctx.s.deviceTimezone : ctx.s.timezoneMode;
}

function ProfileSection({ ctx }: { ctx: Ctx }) {
  const { s, t, vi, theme } = ctx;
  return (
    <div className="plan-grid">
      <article className="card">
        <h2>{t("setTabProfile")}</h2>
        <div className="formula-list" style={{ marginTop: 12 }}>
          <div className="assumption">
            <span>
              {t("language")}
              <small>
                {vi
                  ? "Tiếng Việt mặc định · Có tiếng Anh"
                  : "Vietnamese default · English available"}
              </small>
            </span>
            <LocaleControl ctx={ctx} />
          </div>
          <div className="assumption">
            <span>
              {t("appearance")}
              <small>
                {vi
                  ? "Mặc định theo hệ điều hành; có thể override"
                  : "Defaults to the operating system; override is optional"}
              </small>
            </span>
            <div className="inline-actions">
              <button
                className="secondary-button compact-btn"
                type="button"
                data-action="theme-system"
                onClick={ctx.resetTheme}
              >
                {vi ? "Theo thiết bị" : "Use device"}
              </button>
              <button
                className="secondary-button compact-btn"
                type="button"
                onClick={ctx.toggleTheme}
              >
                {theme === "light" ? t("dark") : t("light")}
              </button>
            </div>
          </div>
          <label className="assumption">
            <span>
              {vi ? "Tiền tệ chính" : "Base currency"}
              <small>
                {vi
                  ? "Bạn tự chọn; đổi tiền tệ chính không sửa số tiền gốc"
                  : "You choose; changing base currency never mutates original amounts"}
              </small>
            </span>
            <select
              id="base-currency-input"
              value={s.baseCurrency}
              onChange={(event) => ctx.setPreference("baseCurrency", event.target.value)}
            >
              <option value="VND">VND (₫)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="SGD">SGD (S$)</option>
            </select>
          </label>
          <label className="assumption">
            <span>
              {vi ? "Múi giờ & Chu kỳ ngân sách" : "Timezone & Budget cycle"}
              <small>
                {vi
                  ? "Theo thiết bị · Không dùng location/IP · Chu kỳ: tháng dương lịch"
                  : "From device · Never inferred from location/IP · Cycle: calendar month"}
              </small>
            </span>
            <select
              id="timezone-mode-input"
              value={s.timezoneMode}
              onChange={(event) => ctx.setPreference("timezoneMode", event.target.value)}
            >
              <option value="device">
                {vi ? `Theo thiết bị (${s.deviceTimezone})` : `Use device (${s.deviceTimezone})`}
              </option>
              <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="UTC">UTC</option>
            </select>
          </label>
        </div>
      </article>
      <article className="card">
        <h2>{vi ? "Không gian làm việc & Tài khoản" : "Workspace & Account Summary"}</h2>
        <div className="formula-list" style={{ marginTop: 12 }}>
          <Row
            label={vi ? "Không gian làm việc hiện tại" : "Active workspace"}
            sub={
              vi
                ? "Tách biệt hoàn toàn dữ liệu theo workspace_id"
                : "Strict workspace_id data isolation"
            }
            value="ws-personal-nam"
          />
          <Row
            label={vi ? "Tài khoản xác thực" : "Authenticated identity"}
            sub={
              vi
                ? "Google Account · Chỉ quyền đăng nhập cơ bản"
                : "Google Account · Basic sign-in scope only"
            }
            value="nam.vu@zenval.vn"
          />
          <Row
            label={vi ? "Múi giờ & Tiền tệ hiệu lực" : "Effective timezone & currency"}
            sub={
              vi ? "Áp dụng cho đóng sổ tháng và nhắc lịch" : "Used for monthly close and reminders"
            }
            value={`${s.baseCurrency} · ${effectiveTimezone(ctx)}`}
          />
          <Row
            label={vi ? "Trạng thái dữ liệu & Kiểm toán" : "Data portability & Audit status"}
            sub={
              vi
                ? "Sổ cái bất biến · Hỗ trợ xuất JSON/CSV"
                : "Immutable ledger · JSON/CSV export ready"
            }
            value="v1.0"
          />
        </div>
      </article>
    </div>
  );
}

function CategoriesSection({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  const expense = vi
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
  const income = vi
    ? ["Lương", "Thưởng", "Freelance", "Lãi tiết kiệm", "Cổ tức", "Quà tặng"]
    : ["Salary", "Bonus", "Freelance", "Savings interest", "Dividend", "Gift"];
  return (
    <div className="plan-grid">
      <article className="card">
        <h2>{vi ? "Danh mục chi tiêu" : "Expense categories"}</h2>
        <p className="muted">
          {vi
            ? "Danh mục không tự thay đổi loại giao dịch."
            : "A category never silently changes transaction type."}
        </p>
        <div className="category-cloud">
          {expense.map((item) => (
            <span className="tag-pill" key={item}>
              {item}
            </span>
          ))}
        </div>
        <button className="secondary-button compact-btn" type="button" onClick={ctx.demo}>
          <Icon name="plus" />
          <span>{vi ? "Tạo danh mục chi" : "Add expense category"}</span>
        </button>
      </article>
      <article className="card">
        <h2>{vi ? "Danh mục thu nhập" : "Income categories"}</h2>
        <p className="muted">
          {vi
            ? "Tiền vay, thu gốc và chuyển khoản không được coi là thu nhập."
            : "Borrowing, principal collection, and transfers are not income."}
        </p>
        <div className="category-cloud">
          {income.map((item) => (
            <span className="tag-pill" key={item}>
              {item}
            </span>
          ))}
        </div>
        <button className="secondary-button compact-btn" type="button" onClick={ctx.demo}>
          <Icon name="plus" />
          <span>{vi ? "Tạo danh mục thu" : "Add income category"}</span>
        </button>
      </article>
    </div>
  );
}

function SourcesSection({ ctx }: { ctx: Ctx }) {
  const { t, vi } = ctx;
  const rows = [
    [
      vi ? "Chứng khoán niêm yết Việt Nam" : "Vietnam listed securities",
      vi
        ? "Đang đánh giá SSI FastConnect · Chưa kết nối · Cần xác minh quyền sử dụng và giới hạn truy cập"
        : "SSI FastConnect candidate · Not connected · License/quota pending",
      "pending",
      vi ? "Đang tìm hiểu" : "Research",
    ],
    [
      vi ? "Quỹ mở / Trái phiếu" : "Mutual funds / Bonds",
      vi
        ? "Giá quỹ và trái phiếu cần nguồn được xác nhận; hiện nhập thủ công"
        : "NAV and bond prices need issuer/provider sources; manual fallback is active",
      "estimated",
      vi ? "Thủ công" : "Manual",
    ],
    [
      vi ? "Vàng, bạc, kim cương" : "Gold, silver, diamonds",
      vi
        ? "Vàng/bạc cần đúng loại sản phẩm và chiều mua/bán; kim cương cần định giá từng viên"
        : "Gold/silver need product and bid/ask mapping; diamonds require per-stone appraisal",
      "estimated",
      vi ? "Thủ công" : "Manual",
    ],
  ] as const;
  return (
    <article className="card">
      <h2>{t("setTabSources")}</h2>
      <p className="muted">
        {vi
          ? "Độ phủ dưới đây là dữ liệu mẫu; Zenval chưa kết nối nguồn giá dùng trong thực tế hoặc được cấp quyền phân phối."
          : "Coverage below is sample data; no production API or redistribution license is connected."}
      </p>
      <div className="review-list" style={{ marginTop: 14 }}>
        {rows.map(([title, sub, state, label]) => (
          <div className="transaction-row" key={title}>
            <span className="transaction-icon">
              <Icon name="trend" />
            </span>
            <span className="transaction-copy">
              <strong>{title}</strong>
              <small>{sub}</small>
            </span>
            <Status ctx={ctx} kind={state} />
            <strong>{label}</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

function NotificationsSection({ ctx }: { ctx: Ctx }) {
  const { s, vi } = ctx;
  const settings = s.notificationSettings;
  const tz = effectiveTimezone(ctx);
  return (
    <div className="plan-grid">
      <article className="card">
        <h2>{vi ? "Nhắc hạn trả nợ" : "Debt due reminders"}</h2>
        <p className="muted">
          {vi
            ? "Không hiển thị số tiền hoặc bên đối ứng trên màn hình khóa theo mặc định."
            : "Amounts and counterparties are hidden on the lock screen by default."}
        </p>
        <div className="formula-list">
          <label className="assumption">
            <span>
              {vi ? "Bật nhắc hạn" : "Enable due reminders"}
              <small>
                {vi
                  ? "Mặc định 7, 3, 1 ngày trước và ngày đến hạn"
                  : "Default: 7, 3, 1 days before and on due date"}
              </small>
            </span>
            <input
              id="notify-debt-enabled"
              type="checkbox"
              checked={settings.debtReminder}
              onChange={(event) => ctx.setNotification("debtReminder", event.target.checked)}
            />
          </label>
          <label className="assumption">
            <span>{vi ? "Kênh nhận" : "Delivery channel"}</span>
            <select
              id="notify-channel"
              value={settings.channel}
              onChange={(event) => ctx.setNotification("channel", event.target.value)}
            >
              <option value="in-app-email">In-app + Email</option>
              <option value="in-app">In-app</option>
            </select>
          </label>
        </div>
      </article>
      <article className="card">
        <h2>{vi ? "Nhắc ghi chi tiêu hằng ngày" : "Daily expense reminder"}</h2>
        <p className="muted">
          {vi
            ? `Theo múi giờ ${tz}; đổi múi giờ sẽ cập nhật lịch, không gửi bù.`
            : `Uses ${tz}; timezone changes reschedule without backfilling.`}
        </p>
        <div className="formula-list">
          <label className="assumption">
            <span>
              {vi ? "Bật lời nhắc" : "Enable reminder"}
              <small>
                {vi ? "Mỗi ngày địa phương tối đa một lần" : "At most once per local day"}
              </small>
            </span>
            <input
              id="notify-daily-enabled"
              type="checkbox"
              checked={settings.dailyCapture}
              onChange={(event) => ctx.setNotification("dailyCapture", event.target.checked)}
            />
          </label>
          <label className="assumption">
            <span>{vi ? "Giờ nhắc" : "Reminder time"}</span>
            <input
              id="notify-daily-time"
              type="time"
              value={settings.dailyCaptureTime}
              onChange={(event) => ctx.setNotification("dailyCaptureTime", event.target.value)}
            />
          </label>
        </div>
        <p className="prototype-notice">
          <Icon name="info" />
          {vi
            ? "Prototype chỉ lưu cấu hình trong phiên; chưa gửi email hoặc push thật."
            : "The prototype stores this setting in-session and sends no real email or push."}
        </p>
      </article>
    </div>
  );
}

function PrivacySection({ ctx }: { ctx: Ctx }) {
  const { t, vi } = ctx;
  return (
    <article className="card">
      <h2>{t("setTabPrivacy")}</h2>
      <p className="muted">
        {vi
          ? "Zenval không bán dữ liệu tài chính cá nhân, không yêu cầu mật khẩu ngân hàng và luôn đảm bảo quyền mang dữ liệu đi (Data portability)."
          : "Zenval never sells personal financial data, never asks for bank passwords, and guarantees full data portability."}
      </p>
      <div className="today-kpi-grid">
        <KpiBox
          label={vi ? "Xuất toàn bộ dữ liệu (Export Bundle)" : "Full machine-readable export"}
          amount="JSON + CSV + Manifest"
        >
          <small>
            {vi
              ? "SLA: Xác nhận ngay, hoàn tất <24h kèm phiên bản schema"
              : "SLA: Acknowledged immediately, completed <24h with schema version"}
          </small>
          <button
            className="secondary-button compact-btn"
            style={{ marginTop: 10 }}
            type="button"
            onClick={ctx.demo}
          >
            {vi ? "Yêu cầu xuất dữ liệu" : "Request data export"}
          </button>
        </KpiBox>
        <KpiBox
          label={vi ? "Xóa tài khoản & toàn bộ dữ liệu" : "Delete account & workspace data"}
          amount={
            vi
              ? "Soft-delete ngay · Hard-delete ≤30 ngày"
              : "Immediate soft-delete · Hard-delete ≤30d"
          }
          amountClass="negative-text"
          boxClass="outflow-box"
        >
          <small>
            {vi
              ? "Cấp biên nhận xóa không chứa thông tin nhạy cảm"
              : "Provides a redacted deletion receipt"}
          </small>
          <button
            className="secondary-button compact-btn"
            style={{ marginTop: 10 }}
            type="button"
            onClick={ctx.demo}
          >
            {vi ? "Xem phạm vi & Yêu cầu xóa" : "Preview scope & Delete"}
          </button>
        </KpiBox>
      </div>
    </article>
  );
}

function SecuritySection({ ctx }: { ctx: Ctx }) {
  const { t, vi } = ctx;
  const audit = [
    [
      "audit-0192 · ReconciliationConfirmed",
      "account: vcb-2486 · diff: 0 VND · actor: user:nam · 2026-11-01T08:30:00+07:00",
    ],
    [
      "audit-0191 · ManualPriceSnapshotRecorded",
      "instrument: GOLD-9999 · price: 8600000 VND · provider_history_preserved: true",
    ],
    [
      "audit-0190 · CommitmentVersionCreated",
      "commitment: commit-loan · split: principal 2.8m / interest 700k · effective: 2026-11",
    ],
  ] as const;
  return (
    <article className="card">
      <h2>{t("setTabSecurity")}</h2>
      <p className="muted">
        {vi
          ? "Nhật ký kiểm toán lưu lại mọi thay đổi số dư, đối chiếu, đóng sổ và phiên bản công thức để có thể kiểm tra lại."
          : "Immutable Audit Log records every balance adjustment, reconciliation, monthly close, and calculation version."}
      </p>
      <div className="notice" style={{ marginTop: 14 }}>
        <Icon name="shield" />
        <div>
          <p>
            <strong>{vi ? "Google Account đã liên kết" : "Google Account linked"}</strong>
          </p>
          <p>
            nam.vu@zenval.vn ·{" "}
            {vi
              ? "Chỉ quyền xác thực, không có quyền Gmail/Drive"
              : "Authentication scope only; no Gmail/Drive access"}
          </p>
          <button
            className="secondary-button compact-btn"
            style={{ marginTop: 10 }}
            type="button"
            onClick={() => ctx.go({ view: "auth" })}
          >
            {vi ? "Xem trước màn hình đăng nhập" : "Preview sign-in screen"}
          </button>
        </div>
      </div>
      <div className="review-list" style={{ marginTop: 14 }}>
        {audit.map(([title, sub]) => (
          <div className="transaction-row" key={title}>
            <span className="transaction-icon">
              <Icon name="shield" />
            </span>
            <span className="transaction-copy">
              <strong>{title}</strong>
              <small>{sub}</small>
            </span>
            <Status ctx={ctx} kind="posted" />
            <strong>v1.0</strong>
          </div>
        ))}
      </div>
    </article>
  );
}

/* Google sign-in prototype screen */
export function AuthView({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  return (
    <section className="auth-layout">
      <article className="card auth-card">
        <div className="brand auth-brand">
          <span className="brand-mark">Z</span>
          <span>Zenval</span>
        </div>
        <p className="page-meta">Calm numbers. Clear decisions.</p>
        <h1>{vi ? "Đăng nhập vào Zenval" : "Sign in to Zenval"}</h1>
        <p className="muted">
          {vi
            ? "Dùng Google Account để tiếp tục. Zenval chỉ yêu cầu thông tin xác thực cơ bản."
            : "Continue with your Google Account. Zenval requests basic authentication information only."}
        </p>
        <button
          className="primary-button google-button"
          type="button"
          data-action="google-sign-in"
          onClick={ctx.save.googleSignIn}
        >
          <span aria-hidden="true">G</span>
          {vi ? "Tiếp tục với Google" : "Continue with Google"}
        </button>
        <div className="inline-note">
          <Icon name="shield" />
          <span>
            {vi
              ? "Lần đầu đăng nhập sẽ tạo một personal workspace VND/Asia_Ho_Chi_Minh duy nhất. Tài khoản trùng email không tự liên kết."
              : "First sign-in creates one VND/Asia_Ho_Chi_Minh personal workspace. Matching emails are never auto-linked."}
          </span>
        </div>
        <button className="text-button" type="button" onClick={() => ctx.go({ view: "settings" })}>
          {vi ? "Quay lại bản demo đã đăng nhập" : "Return to signed-in demo"}
        </button>
      </article>
    </section>
  );
}

/* 10. UI SYSTEM */
export function SystemView({ ctx }: { ctx: Ctx }) {
  const { t } = ctx;
  return (
    <>
      <Heading title={t("foundation")} subtitle={t("foundationSubtitle")} />
      <section className="system-grid">
        <article className="card token-card">
          <h2>{t("colors")}</h2>
          <div className="swatches">
            {(
              [
                ["ink", "Ink", "#12352D"],
                ["accent", "Zen teal", "#13795B"],
                ["canvas", "Canvas", "#F5F7F3"],
                ["amber", "Uncertain", "#A4610A"],
                ["danger", "Risk", "#B94A48"],
              ] as const
            ).map(([className, label, value]) => (
              <span key={className}>
                <i className={`swatch ${className}`} />
                <small>{label}</small>
                <code>{value}</code>
              </span>
            ))}
          </div>
        </article>
        <article className="card type-card">
          <h2>{t("typography")}</h2>
          <p className="type-display">Calm numbers.</p>
          <p className="type-title">Clear decisions.</p>
          <p className="type-body">
            System sans keeps Vietnamese diacritics crisp and financial data easy to scan.
          </p>
          <p className="type-number">12.400.000 ₫</p>
        </article>
        <article className="card component-card">
          <h2>{t("components")}</h2>
          <div className="component-demo">
            <button className="primary-button" type="button">
              Primary action
            </button>
            <button className="secondary-button" type="button">
              Secondary
            </button>
            <label className="demo-input">
              <span>{t("amount")}</span>
              <input defaultValue="1.250.000" />
              <b>₫</b>
            </label>
            <div>
              <Status ctx={ctx} kind="posted" />
              <Status ctx={ctx} kind="pending" />
            </div>
          </div>
        </article>
        <article className="card state-card">
          <h2>{t("states")}</h2>
          <div className="state-matrix">
            {(
              [
                ["check", "complete", "posted"],
                ["clock", "stale", "14 days ago"],
                ["info", "missing", "Needs setup"],
                ["review", "pending", "Needs a decision"],
                ["arrows", "offline", "Draft queued"],
              ] as const
            ).map(([icon, label, sub]) => (
              <span key={label}>
                <Icon name={icon} />
                <b>{t(label)}</b>
                <small>{t(sub)}</small>
              </span>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

/* Mobile More hub */
export function MoreView({ ctx }: { ctx: Ctx }) {
  const { t, theme } = ctx;
  const links = [
    ["review", "review", "reviewSubtitle"],
    ["wallet", "accounts", "accountSubtitle"],
    ["trend", "investments", "investmentsSubtitle"],
    ["scale", "debts", "debtsSubtitle"],
    ["chart", "reports", "reportDesc"],
    ["settings", "settings", "privacy"],
    ["layers", "system", "foundationSubtitle"],
  ] as const;
  return (
    <>
      <Heading title={t("more")} subtitle={t("moreSubtitle")} />
      <section className="more-list">
        {links.map(([icon, view, description]) => (
          <button className="more-link" type="button" key={view} onClick={() => ctx.go({ view })}>
            <span className="more-icon">
              <Icon name={icon} />
            </span>
            <span>
              <strong>{t(view)}</strong>
              <small>{t(description)}</small>
            </span>
            <Icon name="chevron" />
          </button>
        ))}
      </section>
      <section className="mobile-preferences">
        <div>
          <span>
            <strong>{t("language")}</strong>
            <small>Tiếng Việt / English</small>
          </span>
          <LocaleControl ctx={ctx} />
        </div>
        <div>
          <span>
            <strong>{t("appearance")}</strong>
            <small>{theme === "light" ? t("light") : t("dark")}</small>
          </span>
          <button
            className="icon-button"
            type="button"
            aria-label={theme === "light" ? t("dark") : t("light")}
            onClick={ctx.toggleTheme}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} />
          </button>
        </div>
      </section>
    </>
  );
}
