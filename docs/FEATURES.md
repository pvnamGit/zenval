# Danh sách feature Zenval

Nguồn: [PRD v1.0 — 01/11/2026](./PRD.md), đặc biệt mục 6, 8, 9, 11, 12 và 14. Ngày tổng hợp: 02/11/2026.

Đây là checklist phạm vi sản phẩm rút từ PRD, chưa phải danh sách phần còn thiếu sau khi đối chiếu implementation. Tất cả ô để trống; chỉ đánh dấu sau khi triển khai và nghiệm thu. PRD đang ở trạng thái draft; danh sách này không thay thế scope được phê duyệt hay cho phép bắt đầu build MVP.

- **Must (M):** bắt buộc trong phase tương ứng.
- **Should (S):** nên có; cần cân đối scope khi chốt phase.
- **Could (C):** tùy chọn.
- Mã `FR-*` giữ nguyên từ mục 8 PRD. Hạng mục bổ sung có dẫn nguồn riêng và không tự gán mức ưu tiên khi PRD chưa chốt.

## 1. Phase 0 — Việc cần hoàn tất trước build

Nguồn: PRD §14.1, §18–19. Đây là điều kiện chuẩn bị, không phải feature người dùng.

- [ ] Phỏng vấn 15–20 người dùng, phủ các kiểu thu nhập và mức độ sử dụng nợ/đầu tư.
- [ ] Diary study 2–4 tuần về nhập liệu, lịch hóa đơn, vay và cho vay.
- [ ] Kiểm chứng prototype: quick-add, transfer, tách gốc–lãi–phí, giải thích safe-to-spend.
- [ ] Chốt quy tắc kế toán, golden cases và thử nghiệm mô hình dữ liệu.
- [ ] Đánh giá nguồn giá/FX, quyền sử dụng dữ liệu và chi phí provider.
- [ ] Hoàn tất threat/privacy assessment; chốt tuổi sử dụng, consent, retention và cơ sở pháp lý.
- [ ] Khóa scope P1 và đạt điều kiện exit Phase 0 trước build tương ứng.

## 2. Phase 1 — MVP: bức tranh tài chính đáng tin cậy

### Tài khoản người dùng, thiết lập và quyền dữ liệu

- [ ] **FR-001 · M — Tạo tài khoản và personal workspace:** Given user hợp lệ, when signup hoàn tất, then workspace riêng được tạo; user tự chọn language/base currency, theme và timezone hiệu lực ban đầu theo OS/browser, không tự set hoặc lưu location; không lộ dữ liệu cross-tenant.
- [ ] **FR-002 · M — Onboarding theo mục tiêu:** User có thể chọn/bỏ qua nhu cầu; chỉ module liên quan được ưu tiên; bỏ qua không chặn first value.
- [ ] **FR-003 · M — Preferences/locale:** Đổi language, timezone/theme override và base currency có preview tác động; base-currency change không sửa original amounts; timezone/theme có “Dùng theo thiết bị”.
- [ ] **FR-004 · M — Export dữ liệu:** User request export machine-readable; bundle chứa entities, attachments manifest, schema/version và hoàn thành theo SLA NFR.
- [ ] **FR-005 · M — Delete account/data:** UI hiển thị scope, retention ngoại lệ pháp lý và confirm; dữ liệu bị soft-delete ngay khỏi UI, hard-delete theo SLA, có receipt không chứa dữ liệu nhạy cảm.

### Ví, giao dịch, nhập liệu và cam kết cố định

- [ ] **FR-010 · M — CRUD account đa currency:** Tạo account với type/currency/opening balance; ledger tính đúng; archive giữ history; dependency được cảnh báo trước delete.
- [ ] **FR-011 · M — CRUD transaction:** Tạo/sửa income, expense, transfer với amount/date/account/category; save <2s p95 excluding upload; totals update idempotently.
- [ ] **FR-012 · M — Double-entry legs nội bộ:** Mọi posted event tạo legs cân bằng; nếu invariant không đạt, event không post và được log/alert.
- [ ] **FR-013 · M — Transfer pairing:** Transfer giữa accounts không xuất hiện trong income/expense; FX transfer lưu rate/fees và chênh lệch rõ ràng.
- [ ] **FR-014 · M — Split/refund:** Split sum bằng total theo rounding; refund link original và report net/gross tùy toggle.
- [ ] **FR-015 · M — Categories/tags:** System/local categories và custom category hoạt động; re-category lưu audit; category change không đổi type ngoài explicit action.
- [ ] **FR-016 · M — Recurring/bill:** Tạo expected item/reminder theo cadence; edit “this/this and future/all”; không auto-post variable amount mặc định.
- [ ] **FR-017 · M — CSV/XLSX import:** Preview mapping, validation, duplicate candidates và row errors trước commit; retry không tạo duplicate; import có rollback window.
- [ ] **FR-018 · M — To Review inbox:** Lọc theo reason/confidence/source; batch approve an toàn; destructive merge/delete cần preview.
- [ ] **FR-019 · S — Reconciliation:** Nhập statement balance/date, thấy difference, link/adjust; adjustment bắt buộc reason và audit.
- [ ] **FR-022 · M — Cấu hình fixed commitment:** User tạo tiền nhà/trả ngân hàng/chi phí cố định với amount, tolerance, cadence, due date, account, type, priority và reminder; occurrence tương lai xuất hiện trong plan/forecast mà không tạo posted transaction.
- [ ] **FR-023 · M — Theo dõi và match commitment:** Actual transaction được auto-suggest match trong tolerance nhưng user có thể undo; ngoài tolerance đi To Review; trạng thái paid/due/overdue/skipped/rescheduled và history phải đúng.
- [ ] **FR-024 · M — Version và ngoại lệ theo kỳ:** User có thể edit this occurrence/this and future, pause/end; change không sửa occurrence đã paid; audit lưu before/after và forecast recompute idempotently.
- [ ] **FR-025 · M — Debt-installment commitment:** Khoản trả ngân hàng link payable/installment; actual payment split principal/interest/fee và chỉ interest/fee tác động P&L; không double-count giữa commitment và debt schedule.

### Dashboard, kế hoạch, mục tiêu và báo cáo

- [ ] **FR-030 · M — Home dashboard:** Hiển thị core cards theo dữ liệu; card có as-of/freshness/status và drill-down đến drivers.
- [ ] **FR-031 · M — Projected cash flow:** Tính daily/weekly balance từ posted + weighted expected inflows − expected outflows; estimate chi phí theo committed/user plan/median lịch sử và P25/P50/P75 khi đủ dữ liệu; user xem source, assumptions, version và toggle scenarios; stale/missing data hạ confidence.
- [ ] **FR-032 · M — Safe-to-spend:** Áp công thức đã định; horizon và components hiển thị; số âm thành shortfall; recompute khi input đổi.
- [ ] **FR-033 · S — Spending plan optional:** Tạo commitments/flexible limits/buffer và allocation policy needs/wants/saving/investing/debt/custom; user tự sửa tỷ lệ/amount, percentage buckets phải tổng 100%; template chỉ là điểm bắt đầu; user không dùng budget vẫn có dashboard cơ bản; carry-over có policy rõ.
- [ ] **FR-034 · M — Goals:** User tạo/sửa/pause/archive target/date và link account/holding/tagged transaction/recurring contribution/plan bucket; cảnh báo double allocation; progress tách contributed/market movement/planned/gap; Apply chỉ tạo plan draft, không di chuyển tiền.
- [ ] **FR-035 · M — Net-worth report:** Assets + recoverable receivables − liabilities; drill-down và bridge giữa hai dates; tránh double-count known linked values.
- [ ] **FR-036 · M — Income/expense/cash-flow reports:** Filters nhất quán; transfer/principal excluded khỏi P&L; totals khớp transaction ledger.
- [ ] **FR-039 · M — Monthly commitment baseline:** Dashboard/plan hiển thị tổng fixed commitments, đã trả, sắp đến hạn và còn phải dành; STS trừ remaining committed amount; user drill-down tới từng occurrence và source.

### Khoản phải trả và khoản phải thu

- [ ] **FR-040 · M — Payable profile:** Tạo principal/rate/fees/schedule; preview schedule totals; disbursement link không tạo income.
- [ ] **FR-041 · M — Receivable profile:** Tạo/link cash outflow; set recoverability; net worth shows gross vs estimated recoverable.
- [ ] **FR-042 · M — Payment/collection split:** Một actual event tách principal/interest/fee; reports chỉ interest/fee ảnh hưởng P&L đúng direction.
- [ ] **FR-043 · M — Due/overdue/reminders:** Status đúng theo date/grace period/timezone; partial payment giữ remaining due; reminder privacy settings được tôn trọng.
- [ ] **FR-044 · M — Outstanding và history:** Sau extra/partial/reversal, outstanding/schedule/history reconcile; không âm ngoài explicit overpayment state.
- [ ] **FR-045 · S — Debt-free simulation:** User thay extra amount/date/rate và thấy date/interest/cash impact; scenario không ghi ledger; Apply chỉ tạo plan draft.

### Đầu tư và dữ liệu thị trường

- [ ] **FR-050 · M — Portfolio/instrument/holding:** Tạo portfolio, chọn instrument từ searchable provider catalog/dropdown và activity; lưu stable instrument/provider mapping; manual “không tìm thấy” đi review; quantity/cost basis rebuild từ ledger cho cùng kết quả.
- [ ] **FR-051 · M — Buy/sell/income/fees:** Realized/unrealized P&L theo formula; dividend/coupon/fee/tax tách; transaction totals reconcile.
- [ ] **FR-052 · M — Price snapshot/manual valuation:** Mọi valuation có source/observed timestamp/currency/staleness; manual override không xóa provider value.
- [ ] **FR-053 · M — Performance attribution cơ bản:** Overview tách external cash flows, investment income, fees, realized/unrealized change; period change khớp bridge trong tolerance.
- [ ] **FR-057 · M — Market-priced asset coverage:** Với equity/ETF/fund/NAV/bond/gold/crypto/FX/global security có giá niêm yết, đánh giá và tích hợp API có license theo adapter; snapshot giữ provenance/freshness; missing coverage dùng last-known/manual + stale, không dùng zero.

### Gợi ý và thông báo

- [ ] **FR-065 · M — Notifications:** Per-type/channel/quiet-hours; due/security priority; no sensitive lock-screen content by default.

### Trải nghiệm và năng lực bổ sung từ đặc tả module

Các mục sau bổ sung chi tiết ngoài bảng FR; phạm vi cuối cùng cần chốt theo roadmap.

- [ ] **Điều hướng responsive:** desktop rail, tablet drawer, mobile bottom nav; quick-add toàn cục, tìm kiếm transaction/account/asset/debt và hỗ trợ bàn phím. Nguồn: §5.
- [ ] **Onboarding đến first value:** account đầu tiên, opening balance/date, mẫu cam kết phổ biến, dashboard sơ bộ và một next best action; cho phép bỏ qua module chưa cần. Nguồn: §7.1.
- [ ] **Nhập nhanh:** amount-first, tài khoản/danh mục gần đây, duplicate last; đính kèm receipt chưa OCR là Could/P1. Nguồn: §5.3, §7.2, §14.2.
- [ ] **Daily review tùy chọn:** xử lý inbox quan trọng, xác nhận tín hiệu số dư và xem nghĩa vụ ngày mai. Nguồn: §6.4.2.
- [ ] **Privacy center và consent:** xem loại dữ liệu, nguồn, mục đích, retention, processors; consent có version và quyền thu hồi. Nguồn: §6.1, §9.2, §14.2.
- [ ] **Phiên đăng nhập và bảo mật:** danh sách thiết bị/phiên, thu hồi session, cảnh báo bất thường, recent authentication cho thao tác nhạy cảm; MFA tùy chọn P1. Nguồn: §9.1.
- [ ] **Định giá và FX:** nguồn/timestamp/chất lượng giá, giá lịch sử theo as-of, manual override có phạm vi, dữ liệu correction có revision; provider lỗi vẫn dùng last-known có nhãn stale. Nguồn: §12.
- [ ] **Lợi suất đầu tư cơ bản:** simple gain và XIRR khi đủ dữ liệu; không có nghiệm/nhiều nghiệm phải giải thích và fallback. Nguồn: §6.8, §20.2.
- [ ] **Tùy chọn trải nghiệm P1:** email digest và nhắc định giá manual (Should); PWA cài đặt được/offline draft và báo cáo PDF (Could). Nguồn: §14.2.

## 3. Phase 2 — Kế hoạch thích nghi và gợi ý có thể kiểm chứng

### Tài khoản người dùng, thiết lập và quyền dữ liệu

- [ ] **FR-006 · S — Module opt-in/pin:** Bật/tắt/pin module không xóa dữ liệu và navigation cập nhật trên web/mobile.

### Ví, giao dịch, nhập liệu và cam kết cố định

- [ ] **FR-020 · S — Receipt OCR:** OCR tạo draft với image/fields/confidence; user xác nhận trước posted; xóa image độc lập nếu được phép.
- [ ] **FR-021 · C — Offline quick capture:** Capture offline queue sync idempotent; conflict hiển thị, không âm thầm ghi đè.

### Dashboard, kế hoạch, mục tiêu và báo cáo

- [ ] **FR-037 · S — Monthly close:** Readiness checklist, versioned snapshot, reopen with reason và downstream recompute.
- [ ] **FR-038 · S — Custom cycle:** Payday/custom cycle affects plan/forecast without changing ledger dates.

### Khoản phải trả và khoản phải thu

- [ ] **FR-046 · S — Receivable write-off/recovery:** Write-off yêu cầu reason, giữ claim history; later recovery link được và report đúng.

### Đầu tư và dữ liệu thị trường

- [ ] **FR-054 · S — Corporate actions:** Split/bonus/right/merger supported hoặc routed to manual review; cost basis không tạo gain giả.
- [ ] **FR-055 · S — Lot-level/TWR/benchmark:** User chọn lot method; TWR/benchmark cùng period/currency và disclosure methodology.

### Gợi ý và thông báo

- [ ] **FR-060 · M — Eligibility gate:** Không phát hành personalized allocation suggestion trước min 30 ngày và đủ cycles/completeness; lý do chưa eligible được xem.
- [ ] **FR-061 · M — Explainable suggestion card:** Card có detection, reason, recommendation, expected impact, confidence, horizon, sources và assumptions.
- [ ] **FR-062 · M — User controls:** Apply to plan tạo diff/confirm; Remind later respects date; Not relevant captures optional reason và suppresses similar suggestion theo policy.
- [ ] **FR-063 · M — Conflict/guardrails:** Suggestion không làm projected liquidity dưới buffer/minimum obligations; conflict giữa goals/debt được nêu; không có execution CTA mơ hồ.
- [ ] **FR-064 · M — Feedback/outcome:** Log exposure/action/edit và evaluate outcome after horizon; user có thể xem/xóa feedback-linked personalization data.

### Phạm vi roadmap bổ sung

- [ ] **Engine gợi ý rule/scenario-first:** liquidity, cash timing, spending plan, debt plan, goal allocation và data-quality prompt; không áp tỷ lệ phân bổ cứng. Nguồn: §11.
- [ ] **Vòng đời gợi ý:** evidence snapshot, TTL, invalidate khi input thay đổi, undo thay đổi kế hoạch và kill switch theo class/version. Nguồn: §11.7–11.9.
- [ ] **Review thông minh:** rule có preview phạm vi, phân loại tự động tăng dần dựa trên xác nhận người dùng. Nguồn: §7.2, §14.3.
- [ ] **Kịch bản phong phú hơn và thêm phương pháp trả nợ/amortization.** Nguồn: §14.3.
- [ ] **Offline-first, PWA push và đánh giá/pilot native wrapper.** Nguồn: §14.3.
- [ ] **Pilot integration read-only giới hạn:** chỉ triển khai khi đạt readiness bảo mật, pháp lý và vận hành. Nguồn: §12.5, §14.3.
- [ ] **MFA bắt buộc cho admin và thao tác rủi ro cao.** Nguồn: §9.1.

## 4. Phase 3 — Kết nối và trải nghiệm native

### Đầu tư và dữ liệu thị trường

- [ ] **FR-056 · C — Broker/crypto integrations:** OAuth/API/token consent riêng; read-only; revoke works; sync provenance/idempotency đáp ứng NFR.

### Phạm vi roadmap bổ sung

- [ ] **Ứng dụng iOS/Android hoặc wrapper đã được kiểm chứng:** biometric/session controls, widget và share sheet. Nguồn: §14.4.
- [ ] **Mở rộng connector bank/broker/e-wallet theo tổ chức:** connection health, last sync, consent/revoke, dedup, pending→posted và reconciliation. Nguồn: §12.5, §14.4.
- [ ] **Multi-currency và portfolio analytics nâng cao; export dữ liệu phục vụ thuế**, không cung cấp tư vấn/khai thuế. Nguồn: §14.4.
- [ ] **Household/shared planning tùy chọn:** permission và consent riêng; cần chốt domestic safety model trước triển khai. Nguồn: §14.4, OQ-11.
- [ ] **Partner/API ecosystem có điều kiện:** chỉ khi bảo đảm privacy và quy tắc xung đột lợi ích. Nguồn: §14.4.

## 5. Nền tảng bắt buộc đi cùng feature

Nguồn: PRD §9–10, §13, §15, §19 và §20.6. Đây là checklist xuyên suốt, không phải scope tùy chọn để cắt khỏi feature tài chính.

- [ ] **Độ đúng tài chính:** money không dùng binary floating point; rounding/FX rõ ràng; ledger cân bằng; transfer và principal không bị ghi thành thu/chi; tránh double-count.
- [ ] **Cách ly workspace:** authorization và kiểm thử cross-tenant/IDOR cho mọi dữ liệu tài chính.
- [ ] **Nguồn gốc phép tính:** input IDs, source, timestamp, snapshot giá/FX, calculation version; recompute/rebuild và drill-down được.
- [ ] **Audit:** lịch sử thay đổi quan trọng cho user; before/after phù hợp, trace request/job; không lộ secrets hoặc dữ liệu tài chính thô trong log/analytics.
- [ ] **Độ tin cậy:** idempotency cho save/import/retry, dedup, job retry, import rollback, xử lý lỗi một phần và provider outage.
- [ ] **Bảo mật:** mã hóa, quản lý secrets, rate limit, quét dependency/SAST/DAST, pentest và incident response.
- [ ] **Export/delete đúng SLA:** export có cutoff nhất quán; xóa cả attachment và xử lý backup/retention theo policy; recent authentication cho thao tác nhạy cảm.
- [ ] **UX đầy đủ trạng thái:** empty, loading, error, partial, stale, offline, reversal và backdated; dữ kiện, dự báo và gợi ý được phân biệt rõ.
- [ ] **Tiếng Việt và accessibility:** WCAG 2.2 AA, keyboard/screen reader, chart có text/table, input tiền/ngày bản địa hóa, timezone và cấu trúc i18n.
- [ ] **Hiệu năng và khôi phục:** đạt chỉ tiêu dashboard/quick-add/import; backup, restore drill, RPO/RTO và runbook theo NFR.
- [ ] **Analytics bảo vệ privacy:** activation, WFC, capture/review, chất lượng dữ liệu, export/delete và feedback; pseudonymous IDs, không đưa raw amount/counterparty/note vào analytics mặc định.
- [ ] **Nghiệm thu:** accounting signoff, golden/property/invariant tests, content/accessibility QA, observability và rollback/kill switch khi cần.

## 6. Các điểm cần chốt trước khi biến thành ticket

- **Phase/priority có chỗ chưa thống nhất:** bảng FR §8 là cơ sở phân nhóm của danh sách này; không tự coi mâu thuẫn đã được giải quyết.
- **OCR:** §4.1 ghi beta/Should, nhưng FR-020 và roadmap đặt P2; danh sách đặt P2 theo FR.
- **Offline:** FR-021 là Could/P2, roadmap cho offline draft là Could/P1; cần phân biệt draft cục bộ với queue đồng bộ và xử lý conflict.
- **Debt simulation:** roadmap P1 Must có “basic simulation”, nhưng FR-045 và danh sách Should P1 đặt debt-free what-if là Should; cần chốt ranh giới hai mức.
- **Corporate actions:** §6.8 mô tả nhiều loại activity, FR-054 đặt P2; cần chốt xử lý manual/review tối thiểu ở P1 để performance không sai.
- **Module opt-in/pin:** nguyên tắc progressive disclosure đã có ở P1, FR-006 đặt quản lý bật/tắt/pin ở P2; cần chốt phần tối thiểu của onboarding/navigation P1.
- **Chính sách tính toán chưa khóa:** STS horizon (OQ-02), cash/accrual interest (OQ-03), thứ tự phân bổ fee/interest/principal (OQ-04), weighted-average hay lot-level cost basis (OQ-06).
- **Pháp lý và dữ liệu:** tuổi/retention/residency (OQ-01), license provider (OQ-05), export/attachment retention (OQ-07).
- **P2/P3:** threshold gợi ý theo cohort, ưu tiên nợ khi thiếu penalty/tax, wrapper hay native, quyền household (OQ-08–11).
- **Monetization:** §16 và `ADD-12` đã định nghĩa ranh giới chức năng theo mô hình 2 nấc trả phí **Zenval Plus (`39k VND/tháng` | `349k VND/năm` cho dòng tiền & kế hoạch)** và **Zenval Pro (`79k VND/tháng` | `690k VND/năm` cho nhà đầu tư đa tài sản)** bên cạnh **Zenval Core (Free)** và **Zenval Family/Connected (P3)**, cùng cơ chế **45-Day Reverse Trial** và ràng buộc Unit Economics; ở P1 mới dừng ở gắn nhãn `Plus` / `Pro (Miễn phí trong bản Beta)` để đo nhu cầu, chưa xây cổng thanh toán phức tạp cho đến P2.

## 7. Ngoài phạm vi đã định

Nguồn: PRD §3.2, §14.2, §14.5.

- Giữ tài sản, chuyển tiền, thanh toán, trả nợ hay mua/bán tự động.
- Tư vấn đầu tư/thuế/pháp lý/tín dụng cá nhân hóa như chuyên gia được cấp phép; cam kết lợi nhuận hoặc thu hồi nợ.
- Banking/broker sync, personalized allocation suggestions, household và native binary app trong MVP.
- Kế toán doanh nghiệp, hóa đơn điện tử, payroll, khai thuế hoặc tối ưu thuế trong ba phase hiện tại.
- Bán dữ liệu tài chính hoặc quảng cáo khai thác tình trạng dễ tổn thương.

## 8. Review yêu cầu bổ sung từ người dùng — 02/11/2026

Các mã `ADD-*` là yêu cầu bổ sung của người dùng, không phải mã FR có sẵn trong PRD. Checklist dưới đây làm rõ hành vi cần xây; chưa đánh dấu triển khai. Đề xuất đưa ADD-01/02/03/05/06 vào P1; ADD-04 là nghiên cứu nguồn giá trước khi chốt độ phủ tự động. PRD chưa được sửa trong lần review này.

### ADD-01 — Đăng ký / đăng nhập bằng Google

**Review:** FR-001 mới mô tả signup/workspace, chưa yêu cầu Google cụ thể. Bổ sung phương thức xác thực Google cho cả user mới và user quay lại.

- [ ] Có nút “Tiếp tục với Google” ở màn đăng ký và đăng nhập.
- [ ] Lần đầu xác thực thành công tạo đúng một user/personal workspace rồi vào onboarding; các lần sau vào đúng workspace hiện có.
- [ ] Hủy đăng nhập, lỗi provider, callback hết hạn hoặc bị lặp có thông báo và cho thử lại; không tạo user/workspace trùng.
- [ ] Không tự liên kết tài khoản hiện hữu chỉ vì trùng email; liên kết cần xác thực quyền sở hữu tài khoản. Không yêu cầu quyền Gmail/Drive khi chỉ dùng Google để đăng nhập.
- [ ] Có đăng xuất và quản lý phiên; dữ liệu giữa các tài khoản Google được cách ly.

### ADD-02 — Danh mục có sẵn khi ghi thu / chi

**Review:** đã có FR-011/015 và PRD §6.3, nhưng cần cụ thể hóa trải nghiệm chọn danh mục.

- [ ] Khi chọn Expense hoặc Income, hiển thị bộ danh mục đúng loại bằng tiếng Việt, có tìm kiếm, danh mục gần đây và tùy chọn tự tạo.
- [ ] Bộ chi tiêu khởi tạo đề xuất: ăn uống, đi chợ, nhà ở, điện/nước, internet/điện thoại, đi lại, sức khỏe, giáo dục, mua sắm, giải trí, gia đình, bảo hiểm, lãi/phí và khác.
- [ ] Bộ thu nhập khởi tạo đề xuất: lương, thưởng, freelance/thu nhập công việc, lãi tiết kiệm, cổ tức, quà tặng và khác. Các bộ này là đề xuất seed cần content review, không phải taxonomy đã khóa.
- [ ] Cho phép danh mục con, sửa danh mục, split một giao dịch cho nhiều danh mục và lưu lựa chọn gần đây.
- [ ] Vay tiền, thu hồi gốc, chuyển tiền giữa tài khoản và tiền bán tài sản không bị đưa toàn bộ vào danh mục Income; UI hướng tới đúng loại sự kiện. Trả gốc và mua tài sản cũng không mặc định là Expense.

### ADD-03 — Nhập đầu tư theo đơn giá hoặc tổng giá trị

**Review:** mở rộng FR-050/051; hai chế độ phải có cùng kết quả giao dịch và tách phí/thuế rõ ràng.

- [ ] User chọn tài sản/mã, ngày mua, tài khoản, currency, đơn vị và số lượng `q > 0`, sau đó chọn nhập theo “Đơn giá” hoặc “Tổng giá trị mua chưa phí/thuế”.
- [ ] Chế độ đơn giá: user nhập `p`, app tính `gross = q × p`. Chế độ tổng: user nhập `gross`, app tính `p = gross ÷ q`.
- [ ] Tổng tiền thanh toán được hiển thị riêng: `cash_paid = gross + phí + thuế` trong trường hợp cùng currency; nếu phí bằng currency khác phải giữ amount/FX riêng. Không tự hiểu “tổng” là đã bao gồm phí.
- [ ] Khi thay đổi số lượng, giữ trường user đang nhập làm giá trị gốc; trường còn lại được tính lại. Đổi chế độ không làm trôi tổng do làm tròn lặp.
- [ ] Dùng decimal chính xác; ghi chính sách precision/rounding và giữ gross user nhập khi phép chia không hữu hạn. Backend kiểm tra lại trước khi lưu.
- [ ] Ví dụ nghiệm thu: 100 cổ phiếu × 25.000 VND = 2.500.000 VND; nhập tổng 2.500.000 VND và 100 cổ phiếu cho đơn giá 25.000 VND; phí 10.000 VND làm tiền thanh toán thành 2.510.000 VND. Thử thêm quantity bằng 0, số lượng lẻ và tổng chia không hết.
- [ ] Giá mua đã ghi giữ nguyên khi giá thị trường thay đổi; định giá hiện tại và lãi/lỗ dùng snapshot thị trường riêng, theo cost-basis policy được chốt.

### ADD-04 — Research API giá thị trường Việt Nam

**Review:** đã có FR-052/053, PRD §12 và OQ-05. Bạc và kim cương mở rộng danh sách asset class được nêu cụ thể ở §6.8. Yêu cầu “tất cả” phải được đo bằng danh mục mã/sản phẩm và coverage matrix; nghiên cứu sơ bộ chưa chứng minh nguồn API có quyền phân phối bao phủ toàn bộ các nhóm này.

| Nhóm          | Nguồn ứng viên / bằng chứng chính thức                                                                                                                                                                                           | Kết luận và phần chưa xác minh                                                                                                                                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cổ phiếu      | [SSI FastConnect overview](https://developers.ssi.com.vn/docs/getting-started/overview), [Market Data FAQ](https://developers.ssi.com.vn/docs/faq/market-data) mô tả REST/WebSocket, danh sách mã HOSE/HNX/UPCOM và lịch sử giá. | Có API được tài liệu hóa; cần kiểm chứng coverage, mã ngừng giao dịch, đơn vị giá, quota và quyền hiển thị/cache/phân phối trong Zenval. Quyền truy cập API không tự chứng minh quyền tái phân phối.                                          |
| Trái phiếu    | [FiinGroup Financial Investment](https://fiingroup.vn/en/financial-investment.html) giới thiệu Bond Portal; [FiinPro API Datafeed](https://fiinpro.com/News/Detail/11153319?lang=en-US) xác nhận có dịch vụ datafeed.            | Ứng viên để yêu cầu dataset/schema và báo giá; chưa xác minh endpoint giá trái phiếu, độ phủ hoặc quyền phân phối. Phân biệt giá giao dịch, báo giá, mệnh giá, clean/dirty price và lãi tích lũy; không coi coupon/yield là giá.              |
| Chứng chỉ quỹ | [VinaCapital: định nghĩa quỹ mở/NAV](https://vinacapital.com/vi/investment-education/basic-definitions-when-investing-in-oefs/).                                                                                                 | Cần tách ETF niêm yết dùng giá sàn và quỹ mở dùng NAV/đơn vị quỹ theo ngày định giá. Chưa xác minh API hợp nhất có license cho tất cả công ty quản lý quỹ.                                                                                    |
| Vàng / bạc    | [DOJI thông báo bảng giá vàng và bạc chính thức](https://trangsuc.doji.vn/blogs/tin-trang-suc/thong-bao-chuyen-doi-website-bang-gia-vang-bac-doji).                                                                              | Có bảng giá công bố; chưa xác minh API công khai được cấp phép cho ứng dụng bên thứ ba. Phải map thương hiệu, loại sản phẩm, độ tinh khiết, khu vực, đơn vị và chiều mua/bán.                                                                 |
| Kim cương     | [GIA: Diamond Quality Factors](https://www.gia.edu/diamond-quality-factor) mô tả các yếu tố 4Cs ảnh hưởng giá trị.                                                                                                               | Suy luận thiết kế: không dùng một giá chung theo gram/carat cho mọi viên. Chưa xác minh API giá mua lại tại Việt Nam; ưu tiên valuation/báo giá theo từng viên và nguồn thẩm định. Bảng giá bán lẻ không mặc định là giá user có thể bán lại. |

Nghiên cứu sơ bộ qua tài liệu công khai ngày 02/11/2026; chưa gọi API có credential, thử dữ liệu production, liên hệ vendor hay xác nhận hợp đồng/license.

- [ ] Lập inventory instrument/sản phẩm cần hỗ trợ; báo cáo tỷ lệ coverage và missing codes theo từng nhóm. Tách cổ phiếu niêm yết/đăng ký giao dịch, chưa niêm yết; trái phiếu chính phủ/doanh nghiệp và từng thị trường.
- [ ] Với mỗi provider, xác minh API chính thức, auth, quyền thương mại/display/cache/derived analytics, chi phí, quota, SLA, lịch sử và freshness; thử mẫu có cả mã thiếu dữ liệu.
- [ ] Chốt mapping và đơn vị: mã/sàn/ISIN khi có, đồng/đơn vị hay nghìn đồng, chỉ/lượng/gram, purity, currency; kim cương có natural/lab-grown, chứng thư và đặc tính viên.
- [ ] Chốt policy định giá: last/close/bid/NAV/appraisal, giá mua vào hay bán ra theo góc nhìn dealer; hiển thị basis để user hiểu lãi/lỗ ước tính. Chưa có policy được duyệt thì không tự thay công thức định giá hiện tại.
- [ ] Snapshot giữ source, observed_at, fetched_at, currency, đơn vị và stale/manual flag; không có giá thì dùng manual hoặc last-known có cảnh báo, không thay bằng 0.
- [ ] Tính lãi/lỗ tách realized/unrealized, phí/thuế và cổ tức/coupon; thiếu corporate action hoặc giá đáng tin thì hạ confidence, không công bố return sai.
- [ ] Chốt danh sách nguồn được phép tích hợp và độ phủ P1 sau bake-off; không hứa tự động hóa 100% trước khi có bằng chứng.

### ADD-05 — Nhắc hạn trả nợ / thẻ tín dụng

**Review:** đã là Must/P1 ở FR-043/065; cần bổ sung lịch nhắc và xử lý credit card cụ thể để giảm nguy cơ bỏ lỡ hạn.

- [ ] Cấu hình hạn trả, timezone, lịch nhắc trước hạn; đề xuất mặc định 7 ngày, 3 ngày, 1 ngày và ngày đến hạn, cho phép user chỉnh.
- [ ] Thẻ tín dụng lưu riêng ngày chốt sao kê và payment due date; theo dõi statement balance, minimum due, đã trả và còn phải trả. Không suy ra hạn trả chỉ từ ngày mua.
- [ ] Thanh toán một phần chỉ giảm phần còn phải trả; đạt minimum due không đồng nghĩa đã trả hết sao kê hoặc chắc chắn không có lãi/phí. Mức phạt chỉ hiển thị khi có dữ liệu điều khoản và nguồn rõ ràng.
- [ ] Khi đã trả đủ, hủy các reminder tương lai của kỳ; khi đổi hạn hoặc reverse payment, cập nhật lại lịch nhắc, giữ audit và chống gửi trùng.
- [ ] Có in-app và email tùy chọn theo P1; để nhắc khi app đóng trên điện thoại cần push với quyền user và thiết bị hỗ trợ. Nếu đưa push vào P1 thì ghi nhận mở rộng scope so với roadmap PWA push P2.
- [ ] Delivery lỗi có retry và trạng thái theo dõi; nội dung ngoài màn hình khóa mặc định không chứa số tiền/counterparty. Không hứa notification bảo đảm tránh mọi khoản phạt.

### ADD-06 — Nhắc ghi chi tiêu lúc 21:00 hằng ngày

**Review:** yêu cầu mới cụ thể hóa FR-065; daily close hiện là tùy chọn, chưa có lịch nhắc 21:00 trong PRD.

- [ ] Có tùy chọn “Nhắc ghi chi tiêu mỗi ngày”, giờ mặc định **21:00 theo timezone user**, mặc định Việt Nam là Asia/Ho_Chi_Minh; user được bật/tắt, đổi giờ và chọn kênh.
- [ ] Nội dung đề xuất: “Bạn muốn ghi lại chi tiêu hôm nay không?”; mở trực tiếp form thêm chi tiêu hoặc review ngày hiện tại.
- [ ] Mặc định vẫn nhắc tổng kết dù user đã ghi một giao dịch; cho phép chọn “Chỉ nhắc khi hôm nay chưa có khoản chi” hoặc đánh dấu “Đã ghi đủ hôm nay” để bỏ nhắc kỳ đó. Không suy ra một giao dịch nghĩa là đã ghi đủ.
- [ ] Mỗi user chỉ nhận tối đa một lời nhắc logic cho mỗi ngày địa phương; retry không gửi trùng, đổi timezone/giờ nhắc phải cập nhật lịch, không gửi bù hàng loạt lời nhắc cũ.
- [ ] Tôn trọng quiet hours và quyền notification; nếu lịch bị chặn phải hiển thị để user chỉnh. In-app chỉ xuất hiện khi mở app; cần email hoặc push được cấp quyền để nhắc ngoài app.
- [ ] Nghiệm thu với timezone khác Việt Nam, đổi timezone, ngày đã đánh dấu hoàn tất, user opt-out, notification bị từ chối và job chạy lại.

## 9. Review yêu cầu bổ sung từ người dùng — 03/11/2026

### ADD-07 — CTA dùng icon cộng, không lặp ký tự “+” trong label

- [ ] Khi CTA đã có plus icon, accessible name và visible label là động từ/nội dung thuần, ví dụ `Tạo khoản cố định hàng tháng`, `Thêm mục tiêu`; không render thêm ký tự `+` đầu chuỗi.
- [ ] Scan desktop rail, mobile menu, card action, modal launcher, empty state và Settings ở cả tiếng Việt/Anh. Dấu cộng trong số tiền, công thức hoặc mô phỏng (`+1.000.000 ₫`) không thuộc rule này.

### ADD-08 — Catalog mã đầu tư và coverage API theo asset class

- [ ] Listed equity/ETF dùng searchable dropdown từ instrument catalog sau provider integration; record lưu internal ID + provider ID + symbol + exchange, không dùng symbol text làm identity duy nhất.
- [ ] Catalog có loading/empty/error/stale; “Không tìm thấy” cho phép tạo manual instrument có nhãn và vào review. Provider outage không xóa lựa chọn/holding đã lưu.
- [ ] Phase 0 bake-off SSI/nguồn tương đương cho HOSE/HNX/UPCoM, FiinGroup/nguồn tương đương cho fund NAV/bond, CoinGecko/nguồn tương đương cho crypto, và licensed benchmark feed cho gold; đánh giá coverage, history, corporate actions, license, cache/display rights, SLA, cost và security.
- [ ] Inventory mở rộng gồm equity, ETF, open/closed fund, government/corporate bond, gold/precious metal, crypto/tokenized asset, REIT, pension/insurance cash value, RSU/employee equity, collectibles, private business/equity và real estate. Chỉ nhóm có giá niêm yết mới bắt buộc tìm API; nhóm private/manual phải có valuation reminder và provenance.

### ADD-09 — Mục tiêu và kế hoạch do user tạo, có liên kết dữ liệu thật

- [ ] User CRUD/pause/archive goal với target amount/date/priority; link theo amount/percentage của account, holding quantity/value, tagged transactions, recurring contribution hoặc plan bucket.
- [ ] Progress tách actual contribution, market movement, planned contribution và gap; overlap giữa goals được detect, preview và chỉ cho phép sau explicit confirmation.
- [ ] User tạo/version allocation policy với needs/wants/saving/investing/debt/custom; tỷ lệ không bị hard-code, có validation tổng 100%, preview tác động và effective date. Template 50/30/20 hoặc khung khác luôn editable/skippable.
- [ ] Goal/plan link không sửa posted transaction, không chuyển tiền; Apply tạo draft diff có confirm/undo và lineage.

### ADD-10 — Onboarding preference ownership

- [ ] Sau đăng nhập chỉ yêu cầu user chọn language và base currency. Không tự chọn từ IP/location và không yêu cầu location.
- [ ] Theme/timezone theo OS/browser mặc định; Settings cho phép override hoặc quay về `Theo thiết bị`. Location permission chỉ xin đúng lúc cho một use case được giải thích.

### ADD-11 — Forecast formula và thư viện template tài chính

- [ ] Forecast daily balance = prior balance + confidence-weighted expected inflows − expected outflows; dedup pending/posted và loại transfer/principal khỏi expense projection.
- [ ] Category expense hierarchy: scheduled commitment → user plan → median 3–6 complete cycles; scenarios dùng P25/P50/P75 khi đủ dữ liệu, nếu thiếu dùng user range hoặc hiện insufficient-data.
- [ ] Mỗi output có as-of, horizon, source IDs, assumptions, confidence và calculation version; unrealized market gain không trở thành forecast cash.
- [ ] Thư viện template có 50/30/20, Fidelity 50/15/5, emergency fund 3–6 tháng, pay-yourself-first, zero-based, debt snowball/avalanche, retirement milestones và 4% withdrawal scenario. Mỗi template nêu denominator, assumptions, trade-off, market limitation, editable values và disclaimer; không dùng làm personalized advice hoặc guarantee.

### ADD-12 — Phân tầng Free / Plus / Pro, Reverse Trial 45 ngày và ràng buộc Unit Economics

**Review:** cụ thể hóa PRD §16 theo **Phương án B (tách 2 nấc trả phí Plus & Pro)** nhằm xóa rào cản tâm lý giá cho đại đa số người dùng Việt Nam cần quản lý dòng tiền/trả nợ (**Zenval Plus: `39.000 VND/tháng` | `349.000 VND/năm`**) trong khi phân bổ đúng chi phí bản quyền dữ liệu thị trường cho phân khúc nhà đầu tư đa tài sản (**Zenval Pro: `79.000 VND/tháng` | `690.000 VND/năm`**).

- [ ] **Zenval Core (Free Forever) — không khóa độ đúng kế toán và quyền dữ liệu:** Không giới hạn giao dịch nhập thủ công (`FR-011`), giữ nguyên double-entry (`FR-012`), tách transfer/split/refund (`FR-013`–`014`), danh mục tiếng Việt (`ADD-02`), cấu hình fixed commitments và hồ sơ nợ/phải thu tách gốc–lãi–phí (`FR-022`–`025`, `FR-040`–`044`), nhắc hạn nợ cơ bản (`ADD-05`), nhắc ghi chi tiêu 21:00 (`ADD-06`), Safe-to-spend cơ bản (`FR-032`), dự báo dòng tiền ngắn hạn 14–30 ngày (Base scenario), 1–2 mục tiêu hoạt động (`FR-034`), đầu tư cập nhật giá thủ công (`ADD-03`, `FR-052`), CSV/XLSX import cơ bản (`FR-017`) và full Export/Delete (`FR-004`–`005`).
- [ ] **Zenval Plus (`39.000 VND/tháng` | `349.000 VND/năm` ~ `29k/tháng`) — dòng tiền, trả nợ & kế hoạch thích nghi:** Bao gồm dự báo dòng tiền đa kịch bản `Conservative/Base/Optimistic` với dải `P25/P50/P75` tầm nhìn 3–12 tháng (`FR-031`, `ADD-11`), chu kỳ lương tùy chỉnh (`FR-038`), thư viện template tài chính (`ADD-11`), mô phỏng trả nợ What-If Snowball/Avalanche (`FR-045`), write-off/thu hồi nợ xấu (`FR-046`), không giới hạn Goals & kiểm tra overlap (`ADD-09`), Monthly Close khóa snapshot (`FR-037`), smart review rules & reconciliation nâng cao (`FR-019`), Explainable Suggestion Engine cho thanh khoản/dòng tiền/nợ/mục tiêu kèm 1-click *Apply to plan* (`FR-060`–`064`), và **Receipt OCR 50 hóa đơn/tháng** (`FR-020`).
- [ ] **Zenval Pro (`79.000 VND/tháng` | `690.000 VND/năm` ~ `57,5k/tháng`) — đầu tư đa tài sản & tự động hóa chuyên sâu:** Bao gồm toàn bộ quyền lợi gói Plus, cộng thêm **tự động cập nhật giá thị trường & FX từ provider catalog** (`FR-057`, `ADD-04`, `ADD-08`), phân tích danh mục **XIRR, TWR, Benchmark** và cầu nối phân rã hiệu suất (`FR-053`–`055`), corporate actions & lot-level/FIFO (`FR-054`–`055`), liên kết biến động giá tài sản đầu tư vào dự phóng Goals, **Receipt OCR mở rộng 150 hóa đơn/tháng**, và xuất báo cáo PDF định kỳ.
- [ ] **Zenval Family / Connected (Phase 3):** Tách riêng tính năng không gian tài chính hộ gia đình có phân quyền riêng tư (`OQ-11`) và đồng bộ tự động read-only với Bank/Broker/E-wallet (`FR-056`) vào gói nâng cao (`149.000–199.000 VND/tháng`) hoặc add-on để bù đắp chi phí aggregator/connector theo tài khoản kết nối.
- [ ] **Cơ chế 45-Day Reverse Trial và Graceful Downgrade:** User mới được mở khóa toàn bộ tính năng Plus/Pro trong 45 ngày đầu (không yêu cầu thẻ tín dụng trước) để đủ chu kỳ trải nghiệm kỳ `Monthly Close` đầu tiên (`FR-037`) và vượt ngưỡng 30 ngày của `Eligibility gate` gợi ý cá nhân hóa (`FR-060`). Khi hết hạn trial hoặc hết hạn thuê bao mà không gia hạn, hệ thống hạ về Core (Free) không mất dữ liệu: giữ toàn bộ lịch sử giao dịch/snapshot, chuyển holdings sang chế độ giá `manual/last-known + stale`, giữ nguyên quyền Export/Delete.
- [ ] **Kiến trúc kiểm soát Cost-to-Serve cho Market Data (`ADD-04`, `ADD-08`):** Chỉ gói Pro mới kích hoạt đồng bộ giá thị trường tự động đa tài sản. Worker chỉ gọi provider API ở cấp độ danh mục mã (`instrument_id`) theo lịch EOD hoặc 2–4 mốc/ngày và ghi vào bảng `PriceSnapshot` dùng chung cho mọi workspace; tuyệt đối không gọi external market-data API trực tiếp trên từng request xem dashboard của user và không dùng gói real-time tick streaming tính phí royalty theo từng user.
- [ ] **Tối ưu chi phí & Fair-Use Quota cho Receipt OCR (`FR-020`):** Ưu tiên trích xuất text trên thiết bị/trình duyệt (On-device OCR) hoặc nén ảnh WebP nhẹ kết hợp LLM text parser để kéo đơn giá xuống `~15–30 VND/hóa đơn`; áp dụng hạn mức **50 hóa đơn/tháng cho gói Plus** (trần chi phí `<1.500 VND/tháng`) và **150 hóa đơn/tháng cho gói Pro** (trần chi phí `<4.500 VND/tháng`).
- [ ] **Lộ trình triển khai theo Phase:** Phase 0 kiểm chứng độ nhạy giá (Van Westendorp cho cả mốc 39k và 79k), phân nhóm tính năng (MaxDiff) và chốt báo giá B2B datafeed; Phase 1 chưa xây cổng thanh toán, chỉ gắn badge `Plus` / `Pro (Miễn phí trong bản Beta)` lên các tính năng tương ứng ở P1 để đo tỷ lệ kích hoạt; Phase 2 tích hợp thanh toán Web/PWA ưu tiên **VietQR chuyển khoản định danh tự động** (phí `~0,5%–1,2%`, tránh phí cố định của thẻ quốc tế ăn mòn giao dịch 39k) và bật Reverse Trial 45 ngày.
