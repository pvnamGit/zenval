# Backlog triển khai theo spec kit

Cập nhật đối chiếu: **07/11/2026**. Nguồn bổ sung: [technical models](../../technical-docs/README.md), [encryption contract](../../technical-docs/financial-data-encryption.md), [prototype](../../design/README.md), [web/API hiện trạng](../../apps/web/README.md).

Trạng thái: draft; checkbox chỉ được đánh dấu hoàn tất khi toàn bộ tiêu chí của task có bằng chứng, review và phê duyệt bắt buộc; phần triển khai từng lát cắt không đồng nghĩa task đã hoàn tất. Ghi handoff theo [task memory](../agent-harness/task-memory.md). Mỗi dòng là ứng viên ticket; trước build phải thu hẹp thành lát cắt có owner, spec/rails, dữ liệu mẫu synthetic, acceptance và evidence. `Phụ thuộc` là task phải có đầu ra được chấp nhận trước khi bắt đầu phần phụ thuộc; task Phase 0 là điều kiện readiness, không hàm ý mọi hạng mục foundation phải hoàn thành trước discovery. M/S/C theo [Features](../FEATURES.md), không tự chuyển Should/Could thành Must.

## Phase 0 · Discovery và quyết định

- [ ] **T00** — Xác thực 15–20 user, diary 2–4 tuần và prototype quick-add/transfer/gốc–lãi–phí/STS. Đầu ra: kết quả tổng hợp không có dữ liệu cá nhân, rủi ro và thay đổi scope. Kiểm tra: Product/Design review evidence. Phụ thuộc: không.
- [ ] **T01** — Chốt kế toán, Money/FX/rounding, golden cases, STS horizon, interest và allocation payment; có Finance/Product signoff. Kiểm tra: decision record + ví dụ hai phía và edge cases PRD §20.4. Phụ thuộc: không.
- [ ] **T02** — Threat/privacy/data map, tuổi/consent/retention/residency, provider/license/chi phí và export/delete SLA. Kiểm tra: Security/Legal review và quyết định lưu trong repo. Phụ thuộc: không.
- [ ] **T03** — Chốt P1 scope, phase mâu thuẫn và Phase 0 exit; review ADR/spikes theo Architecture §23. Kiểm tra: scope/owner/date và danh sách blocker được Product/Engineering chấp nhận. Phụ thuộc: T00–T02 và T04 (pricing/cost evidence đưa vào scope).

## Foundation và Phase 1 · MVP

- [ ] **T10** — Thiết lập identity/session, workspace authorization, preferences và signup/onboarding (FR-001–003). Kiểm tra: E2E signup/skip, preference reset, policy matrix cross-tenant. Phụ thuộc: T02, T03.
- [ ] **T11** — Money exact, currency/FX/time primitives và Ledger application posting: balanced legs, transaction, idempotency, audit/outbox. Kiểm tra: golden/invariant/concurrency và PostgreSQL integration; không ghi trực tiếp từ context khác. Phụ thuộc: T01, T03.
- [ ] **T12** — Account/opening balance/archive và quick capture income/expense/transfer (FR-010–013). Kiểm tra: E2E signup → first account + golden opening/transfer/FX và retry, tenant isolation. Phụ thuộc: T10, T11, T32; real-user persistence cần T33 cho slice tương ứng.
- [ ] **T13** — Split/refund, categories/tags và audit (FR-014–015). Kiểm tra: split sum/rounding, refund liên kết, không đổi type ngầm, history. Phụ thuộc: T12.
- [ ] **T14** — Recurring và fixed commitment lifecycle, expected occurrences, reminders, edits/versioning (FR-016, 022, 024). Kiểm tra: cadence/timezone, edit future không đổi paid, expected không post; occurrence version/idempotency. Phụ thuộc: T12.
- [ ] **T15** — Match/undo và To Review, batch review an toàn (FR-018, 023). Kiểm tra: tolerance, outside-tolerance, due/overdue, undo, batch preview và concurrent review. Phụ thuộc: T14.
- [ ] **T16** — CSV/XLSX import mapping/preview/commit, duplicate và rollback window (FR-017). Kiểm tra: row errors, retry/chunk duplicate, rollback/partial failure và isolation. Phụ thuộc: T12, T15.
- [ ] **T17** — Reconciliation statement/difference/adjustment có reason và audit (FR-019, S). Kiểm tra: đối chiếu, adjustment qua Ledger, history và isolation. Phụ thuộc: T12.
- [ ] **T18** — Payable/receivable, disbursement, payment/collection split, schedule/history (FR-040–044). Kiểm tra: golden principal/interest/fee hai chiều, partial/extra/reversal, overdue timezone, ERV gross vs recoverable. Phụ thuộc: T01, T12.
- [ ] **T19** — Link installment commitment với payable (FR-025). Kiểm tra: payment split, projected obligation chỉ tính một lần, retry/undo và paid history. Phụ thuộc: T14, T18.
- [ ] **T20** — Projections, dashboard và net-worth/P&L/cash-flow reports (FR-030, 035–036). Kiểm tra: drill-down/as-of, net-worth bridge, transfer/principal exclusion, rebuild vs incremental và double-count. Phụ thuộc: T12, T18.
- [ ] **T21** — Commitment baseline, safe-to-spend và cash-flow forecast/scenarios (FR-031–032, 039). Kiểm tra: approved formula/horizon, lineage, missing/stale, shortfall, commitment changes recompute idempotently, không đếm trùng. Phụ thuộc: T01, T14, T19, T20.
- [ ] **T22** — Spending plan optional và policy allocation/carry-over (FR-033, S). Kiểm tra: editable buckets tổng 100%, bỏ qua không chặn dashboard, carry-over theo policy đã duyệt. Phụ thuộc: T21.
- [ ] **T23** — Goals lifecycle và link nguồn (FR-034). Kiểm tra: overlap warning, progress components, source identity ổn định, apply chỉ tạo draft. Phụ thuộc: T20; các nguồn plan/holding chỉ bật khi T22/T25 sẵn sàng.
- [ ] **T24** — Market catalog/price/FX adapter, license decision, manual fallback/override (FR-052, 057). Kiểm tra: provenance, source timestamp, stale/missing/outage, catalog mapping và không dùng zero; không tích hợp provider chưa có quyền. Phụ thuộc: T02, T03.
- [ ] **T25** — Portfolio/holding/activity, nhập activity thủ công/import và attribution (FR-050–051, 053). Kiểm tra: buy/sell/income/fee, stable instrument identity, rebuild quantity/cost basis, bridge, XIRR fallback và brokerage cash không trùng. Phụ thuộc: T01, T12, T24.
- [ ] **T26** — Debt-free what-if (FR-045, S); giải quyết ranh giới basic simulation trước. Kiểm tra: scenario không ghi ledger, apply chỉ draft, impact và assumptions hiển thị. Phụ thuộc: T18, T21, quyết định trong T03.
- [ ] **T27** — Notifications, preferences/quiet hours và privacy-safe payload (FR-065). Kiểm tra: timezone, channel, due/security priority, không lộ nội dung nhạy cảm và retry. Phụ thuộc: T10, T14.
- [ ] **T28** — Export/delete, privacy/consent, session management (FR-004–005). Kiểm tra: recent auth, snapshot cutoff, manifest, scope/retention, soft/hard delete, attachments, receipt và SLA. Phụ thuộc: T02, T10; tích hợp các entity khi từng slice hoàn tất.
- [ ] **T29** — Responsive shell, navigation/search, localization, accessibility và UX states theo từng journey. Kiểm tra: keyboard/screen reader, mobile/tablet/desktop, empty/loading/error/stale, chart text/table; đối chiếu prototype không hard-code mock thành dữ liệu thật. Phụ thuộc: T10; triển khai cùng các slice.
- [ ] **T30** — Observability, security, privacy analytics, backup/restore, performance và release readiness. Kiểm tra: PRD §§9, 15, 19, 20.6; load/security/restore drills, golden suite và runbooks có evidence. Phụ thuộc: T02, T03; thực hiện dần và tổng kiểm trước release.

- [ ] **T31** — Email digest và nhắc định giá manual (P1 Should); receipt attachment không OCR, PWA cài đặt được/offline local draft và PDF report (P1 Could), tách ticket theo scope được duyệt. Kiểm tra: quiet hours/privacy, attachment lifecycle, cài đặt và khôi phục local draft, PDF khớp report. Local draft không hàm ý queue sync/conflict của FR-021 P2. Phụ thuộc: T02, T20, T24, T27–T29 tùy tính năng.

## Monetization theo PRD §16 / ADD-12

Các giá, quota, provider fee và cost assumptions giữ trạng thái giả thuyết cần kiểm chứng; không tự phê duyệt pricing hay chuyển phase của FR.

- [ ] **T04 — Phase 0 pricing và unit economics research.** Van Westendorp hai nấc Plus/Pro, MaxDiff trong T00, báo giá B2B market data và mô hình cost-to-serve/OCR/connector. Kiểm tra: evidence tổng hợp privacy-safe, assumptions/sensitivity, license và Product/Finance review; không coi giá niêm yết draft là giá launch. Phụ thuộc: T00, T02; đầu ra vào scope T03.
- [ ] **T35 — Phase 1 beta feature labels và measurement.** Gắn badge Plus/Pro “Miễn phí trong bản Beta” đúng các tính năng P1 đã có, đo activation theo phân khúc bằng analytics tối thiểu, không thu nội dung tài chính. Không xây billing/paywall phức tạp trong P1. Kiểm tra: badge không khóa Core/accounting/export/delete, consent/privacy-safe events, đối chiếu phase từng FR. Phụ thuộc: T03, T04, T29, T30 và task feature tương ứng.
- [ ] **T48 — Phase 2 entitlement/billing, reverse trial và downgrade.** Tách ticket theo accepted scope cho Plus/Pro, ưu tiên VietQR sau review provider/fees; trial 45 ngày không yêu cầu thẻ, expiry/downgrade giữ transaction/snapshot history và export/delete, holdings chuyển manual/last-known + stale. Quota OCR, shared market-price jobs theo instrument và cost controls theo policy được duyệt, không provider-call trên mỗi dashboard request. Kiểm tra: entitlement matrix, payment webhook auth/idempotency/replay, trial clock/expiry, quota/retry/concurrency, no data loss, conversion/retention/refund/churn và kill criteria PRD §16.4. Phụ thuộc: T02–T04, T10, T24, T28, T30, T32–T33, T35, T41, T42, T44, T45; chưa kích hoạt thu tiền/provider side effects khi thiếu human approval.

## Công việc bổ sung từ technical docs và UI hiện tại

T32–T34 là task xuyên suốt, không phải phase sản phẩm mới. T32/T33 được chia theo slice; không cần chờ mọi context phase sau hoàn tất mới triển khai một slice đã an toàn. Hiện trạng tham khảo [Features §8](../FEATURES.md#8-hiện-trạng-tính-năng-và-công-việc-tiếp-theo--07112026); chưa có task nào được nghiệm thu chỉ vì có prototype, PUML hoặc API demo.

- [ ] **T32 — Crypto foundation và policy boundary.** Owner đề xuất: Platform/Security; scope cần xác nhận khi tạo ticket. Inventory dữ liệu/store và metadata allowlist; application ports cho crypto/response policy, server-only `FinancialCryptoGateway` dùng chung API/worker, AEAD envelope + managed KMS, key separation, scoped authorization trước decrypt và fail-closed. Kiểm tra: exact decimal round-trip, actor/tenant/purpose denial, substituted AAD/ciphertext, tamper/unknown key-version/KMS outage, key không vào client/log/DB; rotation/rewrap và restore có evidence. Không tự chốt vendor hoặc mở rộng plaintext indexes. Phụ thuộc: T02, T03; accounting fixtures dùng quyết định T01.
- [ ] **T33 — Encrypted persistence và reliable processing theo context.** Owner đề xuất: Platform + owner context. Lập data map từ các domain/application/infrastructure PUML; forward-only schema/envelope, repositories và encrypted projections, idempotency/outbox/inbox/jobs, audit, import/OCR, attachments/export/cache/temp. Ledger là writer posted duy nhất; obligation + Ledger + idempotency + outbox atomic; consumer inbox + effects atomic. Query/filter/pagination trên đủ tập đã giải mã; reports có source/cutoff/version và bounded rebuild jobs. Kiểm tra: DB dump/driver binds/side stores không lộ raw financial data, golden/rebuild reconcile, retry/concurrency/rollback, tenant-safe references, benchmark và restore. Rollout: inventory → encrypt/backfill → verify → switch read/write → xử lý legacy theo recovery/retention plan; không fallback plaintext. Bất kỳ loại bỏ dữ liệu cũ/destructive step cần human approval riêng. Phụ thuộc: T32, T11 và task domain tương ứng; là điều kiện trước real-user persistence của từng slice, không phụ thuộc T34.
- [ ] **T34 — Nối UI sang production contracts/API theo vertical slice.** Owner đề xuất: Web + API/context owner. Dùng `ZenvalApi` port và shared runtime contracts; hiện HTTP có demo dashboard/finance/draft capture, review resolution trả not-implemented, planning/debts/investments/reports fallback mock. Tạo contract và endpoint có authorization/response policy; lần lượt nối accounts/capture/review → commitments/planning/goals → debt/investment/report theo dependency. Mỗi endpoint mới chuyển source tương ứng từ mock sang HTTP; demo giữ nhãn dữ liệu mẫu, phân biệt draft/pending/expected/posted và không dùng demo-session làm production identity. Kiểm tra: contract/negative authorization, intent idempotency/retry, E2E read/write/reload qua encrypted store, provenance, lỗi không giả thành thành công, loading/empty/error/stale, keyboard/mobile và vi/en. Phụ thuộc: T10, T29, T32–T33 và task domain tương ứng; prototype không tự định nghĩa financial policy.

### Gợi ý chọn ticket kế tiếp

1. Review T00–T03 và các quyết định mở; tài liệu/model không thay bằng chứng discovery hoặc signoff.
2. Chọn slice T32 + T10/T11, rồi T33 + T12 + T34: user được authorize → account/capture → encrypted storage → reload đúng; chỉ post qua Ledger application.
3. Tiếp tục T14–T19 trước baseline/STS T21; T20 làm nguồn report/lineage, T23/T25 theo dependency riêng. Giữ T42/T44/T45 ở phase hiện có dù prototype đã có UI.

## Phase 2 · Adaptive planning

- [ ] **T40** — Module opt-in/pin (FR-006, S); không xóa data, navigation đồng bộ. Kiểm tra: toggle/pin web/mobile và khôi phục data. Phụ thuộc: T10, T29.
- [ ] **T41** — Receipt OCR draft/review (FR-020, S) và offline sync/conflict (FR-021, C) thành ticket riêng. Kiểm tra: OCR chỉ post sau xác nhận; offline retry idempotent, conflict rõ. Phụ thuộc: T12, T15, T02.
- [ ] **T42** — Monthly close/version/reopen (FR-037, S), custom cycle (FR-038, S). Kiểm tra: readiness, snapshot, reason/recompute, ledger dates không đổi. Phụ thuộc: T20, T21.
- [ ] **T43** — Receivable write-off/recovery (FR-046, S). Kiểm tra: reason, claim history, recovery link, reports reconcile. Phụ thuộc: T18, T20, T01.
- [ ] **T44** — Corporate actions và lot/TWR/benchmark (FR-054–055, S). Kiểm tra: unsupported vào review, không tạo gain giả, cùng currency/period và disclosure. Phụ thuộc: T25, quyết định corporate-action P1.
- [ ] **T45** — Suggestion eligibility, evidence/explainability, controls, guardrails và feedback (FR-060–064, M/P2). Kiểm tra: dưới ngưỡng 30 ngày không phát hành personalized allocation, stale/invalidation, liquidity conflict, diff/confirm, undo, feedback deletion và kill switch; không execute. Phụ thuộc: T21, T23, T30 và Product/Finance duyệt policy.
- [ ] **T46** — Review rules có preview, kịch bản/amortization mở rộng, PWA push/offline-first và pilot read-only integration theo readiness. Kiểm tra: từng ticket có scope/phase/consent được duyệt, permission/retry/conflict test. Phụ thuộc: T02, T15, T21, T30; xác nhận scope T03.
- [ ] **T47** — MFA bắt buộc cho admin/thao tác rủi ro cao theo P2. Kiểm tra: policy matrix, recovery và negative authorization. Phụ thuộc: T10, T02.

## Phase 3 · Connected/native

- [ ] **T50** — Broker/crypto read-only integration (FR-056, C): consent/revoke, provenance, sync idempotency. Kiểm tra: provider contract, credential protection, revoke và retry. Phụ thuộc: T02, T24, T30, readiness review.
- [ ] **T51** — Native/wrapper, biometric/session, widget/share sheet. Kiểm tra: cùng API, permission/session và accessibility. Phụ thuộc: T10, T29, T30 và scope được duyệt.
- [ ] **T53** — Mở rộng connectors bank/broker/e-wallet theo tổ chức. Kiểm tra: consent/revoke, pending→posted, dedup/reconciliation, provider contract và retry. Phụ thuộc: T02, T30, readiness review và scope được duyệt; dùng T50 khi tái sử dụng adapter broker.
- [ ] **T52** — Advanced multi-currency/portfolio analytics, tax data export, household/shared planning và partner ecosystem thành các ticket riêng. Kiểm tra: disclosure, permission/consent, domestic safety, privacy/conflict-of-interest; không cung cấp khai/tư vấn thuế. Phụ thuộc: T02, T25, quyết định Product/Legal theo từng mục.

## Hoàn tất mỗi ticket

Dẫn FR/spec và screen/flow, nêu non-goals, acceptance + command/observation, các dependencies/decisions, model/port/API/schema/migration cần thiết, golden và negative cases, UX states, security/tenant/privacy, observability/recovery, rollout và bằng chứng. Chạy gate theo harness, review độc lập và không tự ghi human acceptance. Human approval bắt buộc cho release, side effects, security exception, destructive migration và thay đổi financial meaning.
