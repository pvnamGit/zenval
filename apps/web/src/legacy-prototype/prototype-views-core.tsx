import {
  derivedValues,
  fixedCommitments,
  type ReviewRecord,
  recordsForBucket,
} from "./prototype-model";
import {
  type Ctx,
  derivedAttrs,
  ExplainButton,
  FilterRow,
  Heading,
  Icon,
  KpiBox,
  Status,
  SubNav,
} from "./prototype-ui";

/* 1. HOME — today's spending and explainable financial health */
export function HomeView({ ctx }: { ctx: Ctx }) {
  const { vi, t, todaySummary } = ctx;
  const expenseCount = todaySummary.entries.filter(
    (entry) => entry.kind === "expense" && entry.pnlImpact !== false,
  ).length;
  const updatedAt = todaySummary.asOf.slice(11, 16);
  return (
    <>
      <Heading
        title={t("greeting")}
        subtitle={
          vi
            ? "Chi tiêu hôm nay và sức khỏe tài chính của bạn."
            : "Today's spending and your financial health."
        }
        eyebrow={t("date")}
      />
      <section
        className="home-minimal"
        aria-label={
          vi ? "Chi tiêu hôm nay và sức khỏe tài chính" : "Today's spending and financial health"
        }
      >
        <article className="card home-spending-card" {...derivedAttrs(ctx, "todayCashflow")}>
          <div className="card-top">
            <div>
              <span className="card-label">{vi ? "Đã chi hôm nay" : "Spent today"}</span>
              <Status ctx={ctx} kind={derivedValues.todayCashflow.state} />
            </div>
            <ExplainButton ctx={ctx} id="explain-today" derived="todayCashflow" surface="today" />
          </div>
          <p className="hero-amount">{todaySummary.outflowDisplay.replace(/^−/, "")}</p>
          <p className="home-hero-summary">
            {vi
              ? `${expenseCount} khoản chi đã ghi sổ · Cập nhật ${updatedAt}`
              : `${expenseCount} posted expenses · Updated ${updatedAt}`}
          </p>
          <div className="today-spending-facts">
            <span>
              <small>{vi ? "Thu vào hôm nay" : "Today's income"}</small>
              <strong className="positive-text">{todaySummary.inflowDisplay}</strong>
            </span>
            <span>
              <small>{vi ? "Chênh lệch ròng" : "Net movement"}</small>
              <strong className="accent-text">{todaySummary.netDisplay}</strong>
            </span>
            <span data-pnl-impact="false">
              <small>{vi ? "Chuyển khoản nội bộ" : "Internal transfers"}</small>
              <strong>{todaySummary.excludedTransferDisplay}</strong>
            </span>
          </div>
          <footer className="safe-footer">
            <span>
              <Icon name="info" />
              {vi
                ? "Chuyển khoản nội bộ và trả gốc nợ không tính là chi tiêu"
                : "Internal transfers and debt principal are not spending"}
            </span>
            <button
              className="text-button"
              type="button"
              onClick={() => ctx.go({ view: "transactions", txSub: "ledger" })}
            >
              {vi ? "Xem giao dịch" : "View transactions"}
              <Icon name="chevron" />
            </button>
          </footer>
        </article>

        <article
          className="card financial-health-card"
          data-health-summary="positive-cash-low"
          data-based-on="cashFlow safeToSpend netWorth"
        >
          <div className="health-heading">
            <span className="signal-icon calm">
              <Icon name="shield" />
            </span>
            <div>
              <span className="card-label">{vi ? "Sức khỏe tài chính" : "Financial health"}</span>
              <h2>{vi ? "Dòng tiền dự kiến vẫn dương" : "Projected cash stays positive"}</h2>
              <p>
                {vi
                  ? "Đáy dự kiến 8,2tr ₫ trong 30 ngày tới · Độ tin cậy trung bình."
                  : "Projected low of 8.2m ₫ over 30 days · Medium confidence."}
              </p>
            </div>
            <Status ctx={ctx} kind={derivedValues.cashFlow.state} />
          </div>
          <div className="health-evidence">
            <div {...derivedAttrs(ctx, "safeToSpend")}>
              <span>
                {vi ? "Có thể chi an toàn" : "Safe to spend"}
                <Status ctx={ctx} kind={derivedValues.safeToSpend.state} />
              </span>
              <strong>{derivedValues.safeToSpend.display}</strong>
              <ExplainButton ctx={ctx} id="explain-safe" derived="safeToSpend" surface="safe" />
            </div>
            <div {...derivedAttrs(ctx, "cashFlow")}>
              <span>
                {vi ? "Đáy dòng tiền 30 ngày" : "30-day cash low"}
                <Status ctx={ctx} kind={derivedValues.cashFlow.state} />
              </span>
              <strong>{derivedValues.cashFlow.display}</strong>
              <ExplainButton
                ctx={ctx}
                id="explain-cashflow"
                derived="cashFlow"
                surface="cashflow"
              />
            </div>
            <div {...derivedAttrs(ctx, "netWorth")}>
              <span>
                {vi ? "Tài sản ròng hiện tại" : "Current net worth"}
                <Status ctx={ctx} kind={derivedValues.netWorth.state} />
              </span>
              <strong>{derivedValues.netWorth.display}</strong>
              <ExplainButton
                ctx={ctx}
                id="explain-networth"
                derived="netWorth"
                surface="networth"
              />
            </div>
          </div>
          <footer className="health-actions">
            <button
              className="text-button"
              type="button"
              onClick={() => ctx.go({ view: "plan", planSub: "forecast" })}
            >
              {vi ? "Xem dự báo" : "View forecast"}
              <Icon name="chevron" />
            </button>
            <button
              className="text-button"
              type="button"
              onClick={() => ctx.go({ view: "reports", reportSub: "netWorthBridge" })}
            >
              {vi ? "Xem tài sản ròng" : "View net worth"}
              <Icon name="chevron" />
            </button>
          </footer>
        </article>

        <article className="card home-attention">
          <div className="attention-heading">
            <span className="signal-icon amber">
              <Icon name="review" />
            </span>
            <div>
              <span className="card-label">{vi ? "Cần chú ý" : "Needs attention"}</span>
              <h2>{vi ? "Hai việc, không có việc khẩn cấp" : "Two items, nothing urgent"}</h2>
              <p>
                {vi
                  ? "Xác nhận hộp thư và kiểm tra khoản cố định sắp đến hạn."
                  : "Confirm inbox items and review upcoming fixed commitments."}
              </p>
            </div>
            <span className="status pending">
              <i />
              {vi ? "2 mục" : "2 items"}
            </span>
          </div>
          <div className="attention-list">
            <button
              className="attention-item"
              type="button"
              onClick={() => ctx.go({ view: "review" })}
            >
              <span className="attention-icon amber">
                <Icon name="review" />
              </span>
              <span className="attention-copy">
                <strong>{t("reviewCount")}</strong>
                <small>{t("noCritical")}</small>
              </span>
              <span className="attention-meta">
                <span className="tag-pill essential">{vi ? "Hộp thư" : "Inbox"}</span>
                <small>{t("reviewNow")}</small>
              </span>
              <Icon name="chevron" />
            </button>
            <button
              className="attention-item"
              type="button"
              onClick={() => ctx.go({ view: "transactions", txSub: "commitments" })}
            >
              <span className="attention-icon">
                <Icon name="calendar" />
              </span>
              <span className="attention-copy">
                <strong>{vi ? "Internet đến hạn sau 7 ngày" : "Internet due in 7 days"}</strong>
                <small>
                  {vi
                    ? "Cam kết cố định · Đến hạn 08/11 · Đã giữ trong kế hoạch"
                    : "Fixed commitment · Due Nov 08 · Reserved in plan"}
                </small>
              </span>
              <span className="attention-meta">
                <strong>1.250.000 ₫</strong>
                <small>{vi ? "Còn 7 ngày" : "In 7 days"}</small>
              </span>
              <Icon name="chevron" />
            </button>
          </div>
        </article>
      </section>
    </>
  );
}

/* 2. TO REVIEW INBOX */
export function ReviewView({ ctx }: { ctx: Ctx }) {
  const { s, t } = ctx;
  const items = [
    ...(s.reviewBucket === "review" ? s.customReviews : []),
    ...recordsForBucket(s.reviewBucket),
  ];
  return (
    <>
      <Heading title={t("reviewTitle")} subtitle={t("reviewSubtitle")} />
      <FilterRow
        items={[
          [
            "review",
            <>
              {t("review")} <span>3</span>
            </>,
          ],
          ["pending", t("pending")],
          ["posted", t("posted")],
        ]}
        active={s.reviewBucket}
        onSelect={(value) => ctx.patch({ reviewBucket: value as typeof s.reviewBucket })}
      />
      <section className="review-list">
        {items.map((item) => (
          <ReviewItem ctx={ctx} item={item} key={item.id} />
        ))}
      </section>
    </>
  );
}

function ReviewItem({ ctx, item }: { ctx: Ctx; item: ReviewRecord }) {
  const { t, vi } = ctx;
  const configs: Record<ReviewRecord["kind"], [string, string, string, string]> = {
    transfer: [t("transferHelp"), "estimated", t("confirmTransfer"), "arrows"],
    duplicate: [t("duplicateHelp"), "pending", t("inspect"), "info"],
    variance: [t("varianceHelp"), "pending", t("inspect"), "info"],
    expected: [t("forecastNote"), "forecast", t("inspect"), "clock"],
    expense: [t("updated"), "posted", t("inspect"), "check"],
    manualInstrument: [
      vi
        ? "Xác nhận định danh, loại tài sản và nguồn giá trước khi dùng trong báo cáo."
        : "Confirm identity, asset class, and price source before reports use it.",
      "pending",
      t("inspect"),
      "info",
    ],
  };
  const [help, kind, action, icon] = configs[item.kind];
  const name =
    item.merchant === "loan" || item.merchant === "rent" ? t(item.merchant) : item.merchant;
  return (
    <article
      className="review-item"
      data-record-kind={item.kind}
      data-pnl-impact={item.kind === "transfer" ? "false" : undefined}
    >
      <span className="review-icon">
        <Icon name={icon} />
      </span>
      <div className="review-content">
        <Status ctx={ctx} kind={kind} />
        <h2>{name}</h2>
        <p>{help}</p>
      </div>
      <strong className="review-amount">{item.amount}</strong>
      <button className="secondary-button" type="button" onClick={ctx.demo}>
        {action}
      </button>
    </article>
  );
}

/* 3. TRANSACTIONS — ledger, fixed commitments, import history */
export function TransactionsView({ ctx }: { ctx: Ctx }) {
  const { s, t } = ctx;
  return (
    <>
      <Heading
        title={t("transactions")}
        subtitle={t("transactionSubtitle")}
        actions={
          <button
            className="secondary-button"
            id="open-commitment-main"
            type="button"
            data-action="commitment-add"
            onClick={() => ctx.openDialog("commitment-add", "main")}
          >
            <Icon name="calendar" />
            <span>{t("createCommitmentBtn")}</span>
          </button>
        }
      />
      <SubNav
        ctx={ctx}
        items={[
          ["ledger", t("txTabLedger")],
          [
            "commitments",
            t("txTabCommitments"),
            String(fixedCommitments.length + s.customCommitments.length),
          ],
          ["imports", t("txTabImports"), "2"],
        ]}
        active={s.txSub}
        onSelect={(value) => ctx.patch({ txSub: value })}
      />
      {s.txSub === "commitments" ? (
        <CommitmentsSection ctx={ctx} />
      ) : s.txSub === "imports" ? (
        <ImportsSection ctx={ctx} />
      ) : (
        <LedgerSection ctx={ctx} />
      )}
    </>
  );
}

function LedgerSection({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const rows: Array<[string, string, string, string, string, string]> = [
    ...s.customTransactions.map((entry): [string, string, string, string, string, string] => [
      entry.id,
      (vi ? entry.titleVi : entry.titleEn) ?? "",
      `${(vi ? entry.categoryVi : entry.categoryEn) ?? ""} · ${entry.date} · ${vi ? "Vừa ghi trong phiên" : "Logged this session"} · ${entry.account ?? ""}`,
      entry.amount,
      entry.state ?? "posted",
      String(entry.pnlImpact),
    ]),
    [
      "led-inc",
      vi ? "Thanh toán thiết kế UI freelance" : "Freelance UI design payout",
      vi ? "Thu nhập phụ · Hôm nay, 08:15 · VCB" : "Side income · Today, 08:15 · VCB",
      "+2.500.000 ₫",
      "posted",
      "true",
    ],
    [
      "led-winmart",
      "WinMart",
      vi ? "Ăn uống · Hôm nay, 09:42 · VCB" : "Food · Today, 09:42 · VCB",
      "−486.000 ₫",
      "posted",
      "true",
    ],
    [
      "led-grab",
      vi ? "Grab & Cà phê sáng" : "Grab & morning coffee",
      vi ? "Di chuyển · Hôm nay, 12:10 · MoMo" : "Transport · Today, 12:10 · MoMo",
      "−150.000 ₫",
      "posted",
      "true",
    ],
    [
      "led-transfer",
      "VCB → MoMo",
      vi
        ? "Chuyển khoản nội bộ · Không ảnh hưởng thu/chi"
        : "Internal transfer · No income/expense impact",
      "2.000.000 ₫",
      "posted",
      "false",
    ],
    [
      "led-rent",
      t("rent"),
      vi ? "Cam kết cố định · Đến hạn 05/11" : "Fixed commitment · Due Nov 05",
      "−8.000.000 ₫",
      "pending",
      "true",
    ],
    [
      "led-loan",
      vi
        ? "Trả góp vay VIB (Gốc 2,8tr · Lãi 700k)"
        : "VIB loan installment (Principal 2.8m · Interest 700k)",
      vi
        ? "Dự kiến 12/11 · Chỉ 700.000 ₫ lãi tính vào chi phí P&L"
        : "Expected Nov 12 · Only 700,000 ₫ interest affects P&L",
      "−3.500.000 ₫",
      "forecast",
      "false",
    ],
  ];
  const filtered = rows.filter(([, , , , kind]) => {
    if (s.ledgerFilter === "posted") return kind === "posted";
    if (s.ledgerFilter === "pending") return kind === "pending" || kind === "forecast";
    return true;
  });
  return (
    <>
      <FilterRow
        items={[
          ["all", t("all")],
          ["posted", t("posted")],
          ["pending", t("pending")],
        ]}
        active={s.ledgerFilter}
        onSelect={(value) => ctx.patch({ ledgerFilter: value })}
      />
      <section className="review-list" aria-label={t("transactions")}>
        {filtered.map(([id, name, meta, amount, kind, pnl]) => (
          <article className="transaction-row" data-pnl-impact={pnl} key={id}>
            <span className="transaction-icon">
              <Icon name="arrows" />
            </span>
            <span className="transaction-copy">
              <strong>{name}</strong>
              <small>{meta}</small>
            </span>
            <Status ctx={ctx} kind={kind} />
            <strong className="transaction-amount">{amount}</strong>
          </article>
        ))}
      </section>
    </>
  );
}

function CommitmentsSection({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const filtered = [...fixedCommitments, ...s.customCommitments].filter((item) => {
    if (s.commitmentFilter === "inflow") return item.direction === "inflow";
    if (s.commitmentFilter === "outflow") {
      return item.direction === "outflow" && item.kind !== "saving-transfer";
    }
    if (s.commitmentFilter === "transfer") return item.kind === "saving-transfer";
    return true;
  });
  return (
    <section
      className="commitments-view"
      id="fixed-commitments-screen"
      {...derivedAttrs(ctx, "commitmentBaseline")}
    >
      <article className="card commitment-hero">
        <div className="card-top">
          <div>
            <span className="card-label">{t("commitmentsTitle")}</span>
            <Status ctx={ctx} kind="estimated" />
          </div>
          <div className="inline-actions">
            <ExplainButton
              ctx={ctx}
              id="explain-commitments"
              derived="commitmentBaseline"
              surface="commitments"
            />
          </div>
        </div>
        <p className="muted">{t("commitmentsDesc")}</p>
        <div className="today-kpi-grid">
          <KpiBox
            label={t("recurringInflowLabel")}
            amount="+35.000.000 ₫"
            amountClass="positive-text"
            boxClass="inflow-box"
          >
            <small>
              {vi
                ? "Thận trọng đưa vào dự báo: +34.500.000 ₫"
                : "Conservative forecast: +34,500,000 ₫"}
            </small>
          </KpiBox>
          <KpiBox label={t("monthlyBaselineLabel")} amount="19.750.000 ₫" boxClass="outflow-box">
            <small>
              {vi
                ? "Chi cố định 11,25tr · Trả nợ 3,5tr · Tiết kiệm 5,0tr"
                : "Fixed 11.25m · Debt 3.5m · Savings 5.0m"}
            </small>
            {s.customCommitments.length ? (
              <small>
                {vi
                  ? "Bản nháp mới chưa cộng vào tổng cho đến khi được xác nhận và tách đúng ảnh hưởng thu/chi."
                  : "New drafts are excluded from KPIs until confirmed and correctly split for P&L."}
              </small>
            ) : null}
          </KpiBox>
          <KpiBox label={t("paidThisMonthLabel")} amount="8.000.000 ₫" amountClass="accent-text">
            <small>
              {vi ? "1/5 khoản chi đã khớp giao dịch thực tế" : "1/5 outflow items matched"}
            </small>
          </KpiBox>
          <KpiBox
            label={t("remainingReservedLabel")}
            amount="−11.750.000 ₫"
            amountClass="negative-text"
            boxClass="excluded-box"
          >
            <small>
              {vi ? "Đã khóa trước để bảo vệ Safe-to-spend" : "Reserved upfront in Safe-to-spend"}
            </small>
          </KpiBox>
        </div>
      </article>

      <FilterRow
        items={[
          ["all", t("filterAllCommitments")],
          ["inflow", t("filterInflows")],
          ["outflow", t("filterOutflows")],
          ["transfer", t("filterTransfers")],
        ]}
        active={s.commitmentFilter}
        onSelect={(value) => ctx.patch({ commitmentFilter: value })}
      />

      <div className="review-list">
        {filtered.map((item) => (
          <article
            className="review-item commitment-row"
            data-commitment-kind={item.kind}
            data-direction={item.direction}
            data-pnl-impact={String(item.pnlImpact)}
            key={item.id}
          >
            <span className="date-tile">
              <strong>{item.dueDay}</strong>
              <small>{vi ? "HÀNG THÁNG" : "MONTHLY"}</small>
            </span>
            <div className="review-content">
              <div className="badge-group">
                <Status ctx={ctx} kind={item.state} />
                <span className="tag-pill">
                  {item.direction === "inflow"
                    ? vi
                      ? "Khoản thu cố định"
                      : "Fixed inflow"
                    : item.kind === "debt-installment"
                      ? vi
                        ? "Trả góp nợ (Tách Gốc/Lãi)"
                        : "Loan split"
                      : item.kind === "saving-transfer"
                        ? vi
                          ? "Chuyển khoản tiết kiệm · Không tính chi tiêu"
                          : "Savings transfer (Non-P&L)"
                        : vi
                          ? "Chi phí cố định"
                          : "Fixed expense"}
                </span>
                {item.essential ? (
                  <span className="tag-pill essential">{vi ? "Thiết yếu" : "Essential"}</span>
                ) : null}
              </div>
              <h2>{vi ? item.titleVi : item.titleEn}</h2>
              <p>
                {item.account} · {vi ? item.cadenceVi : item.cadenceEn} · {item.tolerance}
              </p>
            </div>
            <strong
              className={`review-amount ${item.direction === "inflow" ? "positive-text" : ""}`}
            >
              {item.amount}
            </strong>
            <div className="inline-actions">
              <button className="secondary-button compact-btn" type="button" onClick={ctx.demo}>
                {vi ? "Đổi kỳ này" : "Edit this"}
              </button>
              <button className="secondary-button compact-btn" type="button" onClick={ctx.demo}>
                {vi ? "Từ kỳ này trở đi" : "This & future"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ImportsSection({ ctx }: { ctx: Ctx }) {
  const { t, vi } = ctx;
  const jobs = [
    [
      "vcb-oct-2026.csv",
      vi
        ? "Sao kê Vietcombank · 142 dòng · Đã khớp 139, 3 vào Cần xem lại"
        : "Vietcombank CSV · 142 rows · 139 committed, 3 in To Review",
      "01/11/2026 08:10",
    ],
    [
      "momo-wallet-export.xlsx",
      vi
        ? "Ví MoMo · 38 dòng · Phát hiện 4 cặp chuyển khoản & 1 nghi trùng"
        : "MoMo XLSX · 38 rows · 4 transfer pairs & 1 duplicate candidate",
      "30/10/2026 21:05",
    ],
  ] as const;
  return (
    <article className="card">
      <div className="section-title">
        <div>
          <h2>{t("txTabImports")}</h2>
          <p className="muted">
            {vi
              ? "Kiểm tra ánh xạ cột, phát hiện trùng lặp idempotent và hỗ trợ hoàn tác (Rollback window 24h)."
              : "Column mapping preview, idempotent duplicate detection, and 24h rollback window."}
          </p>
        </div>
        <button className="primary-button" type="button" onClick={ctx.demo}>
          <Icon name="plus" />
          <span>{vi ? "Nhập CSV / XLSX" : "Import CSV / XLSX"}</span>
        </button>
      </div>
      <div className="review-list" style={{ marginTop: 16 }}>
        {jobs.map(([file, meta, time]) => (
          <article className="transaction-row" key={file}>
            <span className="transaction-icon">
              <Icon name="layers" />
            </span>
            <span className="transaction-copy">
              <strong>{file}</strong>
              <small>{meta}</small>
            </span>
            <Status ctx={ctx} kind="posted" />
            <strong className="transaction-amount">{time}</strong>
          </article>
        ))}
      </div>
    </article>
  );
}

/* 4. ACCOUNTS — cash/bank/e-wallet, savings, reconciliation */
export function AccountsView({ ctx }: { ctx: Ctx }) {
  const { s, t, vi } = ctx;
  const cashAccounts = [
    ["everyday", "Vietcombank · •• 2486 · Thanh khoản cao", "26.480.000 ₫", "VC", "posted"],
    ["wallet", "MoMo · •• 0901 · Ví điện tử", "3.620.000 ₫", "MO", "estimated"],
    [
      vi ? "Tiền mặt tại ví" : "Cash on hand",
      vi ? "Nhập thủ công · Cập nhật 2 ngày trước" : "Manual · Updated 2 days ago",
      "1.500.000 ₫",
      "TM",
      "estimated",
    ],
    [
      vi ? "Tiền mặt chờ đầu tư TCBS" : "TCBS Brokerage Cash",
      vi
        ? "Liên kết Danh mục đầu tư · Không tính trùng vào Tài sản ròng"
        : "Linked to Portfolio · Not double-counted in Net Worth",
      "4.000.000 ₫",
      "TC",
      "posted",
    ],
  ] as const;
  const savingsAccounts = [
    [
      "savings",
      vi
        ? "Techcombank · Kỳ hạn 6 tháng (5,4%/năm) · Đáo hạn 15/02/2027"
        : "Techcombank · 6-month term (5.4% p.a.) · Matures Feb 15, 2027",
      "180.000.000 ₫",
      "TC",
      "posted",
    ],
  ] as const;
  const accounts = s.accSub === "savings" ? savingsAccounts : cashAccounts;
  return (
    <>
      <Heading
        title={t("accountTitle")}
        subtitle={t("accountSubtitle")}
        actions={
          <button className="primary-button" type="button" onClick={ctx.demo}>
            <Icon name="plus" />
            <span>{vi ? "Thêm tài khoản" : "Add account"}</span>
          </button>
        }
      />
      <SubNav
        ctx={ctx}
        items={[
          ["cashBank", t("accTabCash")],
          ["savings", t("accTabSavings")],
          ["reconciliation", t("accTabReconcile")],
        ]}
        active={s.accSub}
        onSelect={(value) => ctx.patch({ accSub: value })}
      />
      <article className="total-card">
        <span>{t("totalAssets")}</span>
        <strong>211.600.000 ₫</strong>
        <small>
          {vi
            ? "Đã loại trừ tính trùng 4.000.000 ₫ tiền mặt chứng khoán TCBS"
            : "Deduplicated 4,000,000 ₫ linked TCBS brokerage cash"}
        </small>
      </article>
      {s.accSub === "reconciliation" ? (
        <ReconciliationSection ctx={ctx} />
      ) : (
        <section className="accounts-list">
          {accounts.map(([name, institution, amount, logo, kind]) => (
            <article className="account-row" key={`${name}-${logo}`}>
              <span className="account-logo">{logo}</span>
              <span className="account-info">
                <strong>{t(name)}</strong>
                <small>{institution}</small>
              </span>
              <Status ctx={ctx} kind={kind} />
              <strong className="account-amount">{amount}</strong>
              <button
                className="icon-button subtle"
                type="button"
                aria-label={t(name)}
                onClick={ctx.demo}
              >
                <Icon name="chevron" />
              </button>
            </article>
          ))}
        </section>
      )}
    </>
  );
}

function ReconciliationSection({ ctx }: { ctx: Ctx }) {
  const { vi } = ctx;
  return (
    <article className="card">
      <div className="section-title">
        <div>
          <h2>{vi ? "Đối chiếu số dư sao kê" : "Statement Balance Reconciliation"}</h2>
          <p className="muted">
            {vi
              ? "So sánh số dư sổ cái (Ledger balance) với sao kê ngân hàng thực tế. Mọi bút toán điều chỉnh bắt buộc ghi lý do kiểm toán."
              : "Compare calculated ledger balance against actual bank statement. Adjustments require an audit reason."}
          </p>
        </div>
        <Status ctx={ctx} kind="posted" />
      </div>
      <div className="today-kpi-grid">
        <KpiBox
          label={vi ? "Tài khoản đối chiếu" : "Selected account"}
          amount="Vietcombank •• 2486"
        >
          <small>{vi ? "Ngày chốt sao kê: 01/11/2026" : "Statement date: 2026-11-01"}</small>
        </KpiBox>
        <KpiBox
          label={vi ? "Số dư sổ sách (Calculated)" : "Calculated ledger balance"}
          amount="26.480.000 ₫"
        >
          <small>
            {vi ? "Từ số dư đầu kỳ + 48 giao dịch posted" : "Opening balance + 48 posted events"}
          </small>
        </KpiBox>
        <KpiBox
          label={vi ? "Số dư thực tế (Expected)" : "Expected statement balance"}
          amount="26.480.000 ₫"
          amountClass="accent-text"
        >
          <small>{vi ? "Khớp 100% · Chênh lệch: 0 ₫" : "100% matched · Difference: 0 ₫"}</small>
        </KpiBox>
        <KpiBox
          label={vi ? "Ví MoMo •• 0901 (Cần đối chiếu)" : "MoMo •• 0901 (Needs check)"}
          amount="−15.000 ₫"
          amountClass="negative-text"
          boxClass="excluded-box"
        >
          <small>
            {vi ? "Lệch phí rút tiền chưa ghi sổ" : "Unrecorded withdrawal fee variance"}
          </small>
        </KpiBox>
      </div>
      <footer className="safe-footer">
        <span>
          <Icon name="shield" />
          {vi
            ? "Lịch sử đối chiếu được lưu để có thể kiểm tra lại."
            : "Reconciliation records are retained in the audit log."}
        </span>
        <button className="primary-button" type="button" onClick={ctx.demo}>
          {vi ? "Xác nhận đối chiếu kỳ này" : "Confirm reconciliation"}
        </button>
      </footer>
    </article>
  );
}
