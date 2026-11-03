# Zenval design source of truth

`design/` is the standalone, reviewable UI/UX prototype for Zenval. It uses semantic HTML,
tokenized CSS, and vanilla JavaScript only. There is no React, Next.js, Figma, framework, package
install, build step, or network dependency.

## Run locally

From the repository root:

```bash
python3 -m http.server 4173 --bind 0.0.0.0 --directory design
```

Open [http://localhost:4173](http://localhost:4173) on this computer. To preview on an iPhone on
the same Wi-Fi network, find the computer's LAN address and open `http://<LAN-IP>:4173` on the
phone. On macOS, the address is commonly available with:

```bash
ipconfig getifaddr en0
```

If macOS asks, allow incoming connections for Python. The server is for trusted local-network
preview only; stop it with `Ctrl+C` when finished.

## Information Architecture & Review Journeys (PRD §5.1)

- **Home (`#home`)**:
  - **First dashboard card**: **Today's total inflow & outflow (`Tổng thu / chi hôm nay`)**, net cash movement, today's transaction breakdown, and explicit exclusion of internal transfers (`2.000.000 ₫`) from P&L.
  - Sub-sections matching PRD §5.1: `Hôm nay` (Today's P&L, Safe-to-spend, 30-day Cash flow, Due soon, To Review), `Bức tranh` (Net worth, Assets/ERV Receivables/Liabilities, Net-worth bridge), and `Kế hoạch` (Goals & Explainable Suggestion summary).
- **Inbox / To Review (`#review`)**:
  - Switch between `Cần xem lại (Review)`, `Chờ xác nhận (Pending)`, and `Đã ghi sổ (Posted)` for transfer candidates, duplicates, and commitment variances.
- **Transactions (`#transactions`)**:
  - `Giao dịch (Ledger)`: Posted vs Pending vs Expected transactions with explicit non-P&L labels for transfers and loan principal.
  - `Chi phí cố định, định kỳ & hóa đơn (Fixed commitments & recurring)`: Full monthly baseline (`Tổng thu cố định dự kiến`, `Tổng cam kết chi & nghĩa vụ`, `Đã thanh toán`, `Còn phải giữ trước`), filterable by fixed inflows, fixed expenses/loans, and savings transfers, plus the **`+ Tạo khoản cố định hàng tháng` modal** to create new monthly fixed inflows/outflows/loan installments/savings transfers in-session.
  - `Lịch sử nhập (Import history)`: CSV/XLSX import runs, column mapping, duplicate detection, and rollback window.
- **Accounts (`#accounts`)**:
  - `Tiền mặt / Ngân hàng / Ví (Cash / bank / e-wallet)` including deduplicated TCBS brokerage cash.
  - `Tiết kiệm & Tiền gửi (Savings / deposits)`.
  - `Đối chiếu số dư (Reconciliation)` comparing calculated ledger balance vs statement balance with immutable audit logging.
- **Investments (`#investments`)**:
  - `Danh mục & Tài sản (Portfolios / holdings)`: Equities (`FPT`), Mutual Funds (`DCDS`), Physical Gold (`GOLD-9999` manual valuation), and Brokerage Cash (double-count protected).
  - `Nhật ký giao dịch & Quyền (Activity / corporate actions)`: Buy, dividend, stock dividend (20:3 corporate action), and manual valuation snapshots.
  - `Hiệu suất & Phân bổ (Performance / allocation)`: Performance Attribution Bridge (FR-053), XIRR, and asset allocation.
  - **`+ Ghi nhật ký đầu tư / Thêm mã` modal**: Log Buy, Sell, Dividend, or Manual Valuation directly in-session.
- **Debts & Receivables (`#debts`)**:
  - `Khoản phải trả (Payables)`: Auto loan & credit card with Principal (Non-P&L) vs Interest/Fee (P&L) splits.
  - `Khoản phải thu (Receivables)`: Gross principal vs Estimated Recoverable Value (`ERV = Principal × Recovery probability`).
  - `Lộ trình & Mô phỏng (Timeline / simulation)`: Interactive extra-principal payoff simulator (`+0 ₫`, `+1tr ₫`, `+2tr ₫/tháng`) with `Apply to plan (Draft)`.
- **Plan (`#plan`)**:
  - `Safe-to-spend / spending plan`, `Goals` (with overlap protection), `Forecast` (Conservative / Base / Optimistic scenarios), and `Suggestions` (Eligibility gate + Detection → Reason → Action → Impact + Draft apply).
- **Reports (`#reports`)**:
  - `Thu/Chi & Dòng tiền (P&L)` (excluding transfers & principal), `Tài sản ròng & Cầu nối (Net-Worth Bridge)`, and `Đóng sổ tháng (5-step Monthly Close checklist)`.
- **Settings (`#settings`)**:
  - `Hồ sơ, Ngôn ngữ & Tiền tệ`, `Danh mục & Quy tắc`, `Nguồn dữ liệu & Import`, `Quyền riêng tư, Xuất & Xóa (FR-004/005)`, and `Bảo mật & Nhật ký kiểm toán (Immutable Audit Log)`.
- **UI System (`#system`)** & **Mobile More Hub (`#more`)**.

Preferences and the last selected view are stored only in browser `localStorage`. Form actions are
in-session prototype simulations; they never create or post a real financial event.

## Repaired review journeys

- Quick-add now keeps compatible form values when switching type, uses separate Vietnamese
  income/expense category sets, validates amount, and updates the in-session ledger and today's
  displayed totals. Refreshing the page still clears these demo records.
- Investment entry supports exact unit-price or gross-total input. Buy creates a pending position;
  sell, dividend, and manual valuation create distinct activities and do not all add a holding.
  Provider prices remain sample data and are never presented as a live API connection.
- Receivable ERV preview and saved value use exact principal × recovery probability with a 0–100%
  bound. New payable and receivable records remain drafts until their schedules and accounting
  split are confirmed.
- Customer-facing screens hide internal IA/FR/PRD references and use plain Vietnamese for the
  primary financial explanation; technical lineage remains available in source/evidence only.
- Settings contains separate Categories, Data Sources, and Notifications screens. Debt reminders
  and the 21:00 daily capture reminder are configuration previews only; no email or push is sent.
- `#auth` previews Google sign-in scope and account-linking copy. It never calls Google OAuth or
  creates a real account.

The shared fixture now reconciles Accounts, Investments, recoverable receivables, liabilities,
monthly P&L, and the net-worth bridge. Calculations use integer VND and scaled integer quantities,
without binary floating-point money arithmetic.

## Focused verification

```bash
node design/tests/verify.mjs
node design/tests/model.test.mjs
```

## File map

- `index.html` — accessible document shell and local assets.
- `styles.css` — tokens, components, responsive/mobile-first layout, light/dark themes.
- `app.js` — bilingual copy, IA screens, rendering, navigation, dialogs, and interactions.
- `model.mjs` — shared, testable IA, state, commitment, investment, debt, and lineage contracts.
- `tests/verify.mjs` — dependency-free asset and rendered-contract checks.
- `tests/model.test.mjs` — executable behavior, IA completeness, state, focus-policy, and lineage assertions.
