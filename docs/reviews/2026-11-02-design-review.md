# Review design Zenval — 02/11/2026

## Kết luận và phạm vi bằng chứng

**REVISE — đủ khung IA để thảo luận sản phẩm; chưa đủ luồng tương tác để nghiệm thu feature.**

Nguồn thực tế là `design/`, không có `apps/design` trong worktree này. Đã rà cấu trúc, render functions, forms, handlers, model và CSS cho toàn bộ nhóm màn hình. Đối chiếu [PRD](../PRD.md) và [feature checklist](../FEATURES.md), bao gồm ADD-01–06.

**Chưa walkthrough bằng trình duyệt:** browser discovery trả danh sách rỗng; HTTP HEAD tới `http://localhost:4173/` thất bại kết nối từ môi trường review. Vì vậy không xác nhận được screenshot, bố cục render thực tế, click, contrast, overflow, bàn phím mobile hoặc responsive. Các nhận xét UI dưới đây dựa trên markup/CSS và nội dung, không phải quan sát màn hình đã render.

Không sửa prototype hoặc chính sách tài chính trong lần review này.

## Coverage theo màn hình

“Có” bên dưới chỉ xác nhận cấu trúc/nội dung trong source; không có nghĩa tính năng backend hoàn thành.

| Màn hình / tab đã rà                                             | Hiện có                                                                  | Khoảng trống chính                                                                                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Home: All / Today / Picture / Plan summary                       | Thu/chi ngày, STS, chart, due soon, review, net worth, goals, suggestion | Ngày/số tiền cố định; thiếu empty/stale/error scenarios; số tổng không nhất quán với Accounts; chưa tùy chỉnh cards                     |
| Inbox: Review / Pending / Posted                                 | Chuyển bucket, mẫu transfer/duplicate/variance                           | Inspect/Confirm chỉ toast demo; thiếu compare, approve/edit/split/link, batch và undo                                                   |
| Transactions: Ledger                                             | Danh sách thu/chi/transfer, phân biệt trạng thái                         | Filter `demo-filter` không có handler; không có transaction detail/edit/refund/split; quick-add không ghi vào danh sách                 |
| Transactions: Commitments                                        | Bộ lọc thu/chi/transfer; tạo item trong phiên                            | KPI không cập nhật theo item mới; thiếu version/edit/pause/skip/match/undo và liên kết installment                                      |
| Transactions: Imports                                            | Hai import history mẫu, nút nhập                                         | Chưa có file picker, mapping, preview/errors, duplicate resolution hoặc rollback flow                                                   |
| Accounts: Cash / Savings / Reconciliation                        | Danh sách, số dư, đối chiếu mẫu                                          | Add/detail/confirm chỉ demo; thiếu opening balance/date, archive, adjustment reason và nhập statement thực                              |
| Investments: Holdings / Activity / Performance                   | Mẫu FPT/DCDS/gold/cash, nguồn giá, bridge, XIRR; modal thêm              | Handler các activity dùng chung sai; thiếu đơn giá↔tổng, instrument search, ngày/currency, form theo asset; totals cố định              |
| Debts: Payables / Receivables / Simulation                       | Phân biệt gốc/lãi, gross/ERV; tạo trong phiên; ba preset what-if         | ERV mới sai, không nhập due date/schedule/minimum due; thiếu log payment/collection và cài lịch nhắc                                    |
| Plan: STS / Goals / Forecast / Suggestions                       | STS breakdown, goals liên kết mẫu, đổi preset scenario, explanation card | Không chỉnh plan/goal; apply/remind/dismiss là demo; thiếu eligibility-failed, input diff/confirm/undo và negative STS                  |
| Reports: P&L / Net-worth bridge / Monthly close                  | Nội dung báo cáo và checklist đóng sổ                                    | Thiếu period/filter/export/drill-down thật; số P&L không reconcile với bridge; close khi vẫn có critical items chưa rõ policy           |
| Settings: Profile / Categories / Sources / Privacy / Security    | Đổi theme/locale; mẫu privacy/export/delete/audit                        | Categories và Sources dùng lại nội dung chung; thiếu taxonomy editor/provider health; không có notification settings/session management |
| UI System                                                        | Token/status/component showcase                                          | Hữu ích cho review nội bộ; nên tách khỏi navigation sản phẩm                                                                            |
| Mobile More                                                      | Hub tới module, language/theme                                           | Chưa xác nhận render/hit-target/scroll và back navigation trên máy thật                                                                 |
| Quick-add / Commitment / Investment / Debt / Explanation dialogs | Có markup dialog, backdrop, Escape, focus trap/inert                     | Rerender làm mất dữ liệu chưa lưu khi đổi loại; chưa có validation/error/unsaved-change flow; nhiều disclosure chỉ hiện source IDs      |
| Auth / Onboarding / Notification center                          | Chưa có màn hình tương ứng                                               | Thiếu journey đăng nhập Google, first value và quản lý nhắc hạn/21:00                                                                   |

## Finding ưu tiên cao — sửa trước usability test số liệu

### F-01 — Bán, cổ tức và định giá đều tạo holding mới

Bằng chứng: `design/app.js:2281` (`save-investment`). Handler luôn `customHoldings.unshift(...)` bất kể activity type. Sell không giảm vị thế; dividend tạo vị thế mới; valuation cũng thêm holding. Giá thị trường được gán bằng amount nhập, P&L luôn bằng 0 và gắn nhãn provider ngay khi chưa lấy giá. Fee/tax và settlement account không được đọc.

Cần làm: tách flow theo activity. Nếu chưa mô phỏng được hiệu ứng đúng, chỉ tạo draft activity với trạng thái rõ ràng, không tuyên bố cost basis/holdings đã cập nhật. Hiển thị loại tác động theo activity thay vì cùng một lời giải thích “Mua tài sản…” cho tất cả tab.

### F-02 — Giá trị thu hồi khoản phải thu mới luôn bằng gốc

Bằng chứng: `design/app.js:2324` (`save-debt`), `estimatedRecoverable: principal`. Nhập gốc 10 triệu và xác suất 65% vẫn cho ERV 10 triệu, trái với mẫu và công thức UI hiển thị.

Cần làm: mô phỏng chính xác 6,5 triệu bằng decimal hoặc giữ trạng thái chưa tính; kiểm tra range xác suất 0–100%. Default rate đang dùng `80%` cho cả payable khi bỏ trống; due date bị cố định 30/11/2026.

### F-03 — Net worth lệch 8 triệu so với số dư Accounts

Bằng chứng: `accountsView` tại `design/app.js:1001` cho cash ngoài brokerage = 26,48 + 3,62 + 1,5 + 180 = **211,6 triệu**. Home tại `design/app.js:696` lại dùng **203,6 triệu** tiền + 108 triệu investments + 6,5 triệu ERV − 33,5 triệu liabilities = 284,6 triệu. Nếu dùng Accounts, kết quả là **292,6 triệu**. Brokerage cash 4 triệu đã loại khỏi tổng Accounts và nằm trong portfolio nên không giải thích phần lệch 8 triệu.

Cần làm: một fixture thống nhất và reconcile giữa màn hình; không thêm adjustment tùy tiện để khớp số.

### F-04 — Cùng kỳ tháng 10 nhưng P&L và net-worth bridge không khớp

Bằng chứng: `reportsPnlSection` tại `design/app.js:1566` cho income 35,475 triệu − expense 21,85 triệu = **13,625 triệu**. Bridge tại `design/app.js:1601` chỉ dùng earned/saved cash flow 5,4 triệu + investment income 0,475 triệu − interest 0,7 triệu = **5,175 triệu**, chênh **8,45 triệu** với P&L. Chưa có giải thích/reconciliation residual.

Cần làm: chung nguồn dữ liệu/cùng kỳ và scope; định nghĩa từng component tránh double-count, giải thích residual.

### F-05 — Lưu thành công nhưng tổng không đổi hoặc không lưu gì

Bằng chứng: `prototype-save` tại `design/app.js:2367` chỉ đóng dialog và toast, không đọc form. Commitment/debt/holding có thêm vào array phiên nhưng KPI Home, baseline, portfolio và debt total vẫn hardcode. Refresh mất các records mới; README có nói session-only nhưng phản hồi sau save chưa truyền đạt đủ giới hạn.

Cần làm: hoặc hoàn thiện local demo state nhất quán, hoặc ghi rõ “Đã thêm bản nháp demo trong phiên; chưa cập nhật số tổng”. Quick-add cần tối thiểu tạo item để test được capture → list → Home.

### F-06 — Chuyển loại trong modal làm mất các trường user vừa nhập

Bằng chứng: handlers `transaction-type`, `commitment-direction`, `inv-activity-type`, `debt-direction` gọi `render()`; `render` tại `design/app.js:2086` thay toàn bộ `root.innerHTML`; giá trị form chưa được lưu vào state.

Cần làm: form state riêng; giữ amount/account/note và các trường tương thích khi đổi loại; không mất dữ liệu khi đổi locale/theme. Xác minh click thực tế khi browser khả dụng.

## Review riêng 6 yêu cầu vừa bổ sung

| Yêu cầu                                | Đánh giá hiện tại                         | Việc cần bổ sung                                                                                                                                                                                                       |
| -------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ADD-01 Google signup/login             | **Chưa có**                               | Auth screen, Google entry point, cancel/error, returning user và onboarding                                                                                                                                            |
| ADD-02 nhiều danh mục thu/chi          | **Chưa đạt**                              | `quickAddDialog` tại `app.js:1860` chỉ có Ăn uống/Nhà ở cho cả Income và Expense; cần bộ danh mục riêng, search/recent/custom                                                                                          |
| ADD-03 đơn giá ↔ tổng                  | **Chưa có**                               | Investment form chỉ quantity + total; thiếu unit price, mode selector, phép tính và rounding preview                                                                                                                   |
| ADD-04 nguồn giá VN, gồm bạc/kim cương | **Mẫu hiển thị một phần**                 | FPT/DCDS/gold là fixture; chưa có market request/provider adapter trong prototype. Thiếu silver/diamond và form theo sản phẩm. API/license research nằm ở FEATURES §8, không được suy ra đã tích hợp từ badge provider |
| ADD-05 nhắc trả nợ                     | **Có due list, thiếu luồng notification** | Cài lịch nhắc/kênh, due vs statement date, minimum due, đã trả/còn nợ, permission/delivery states                                                                                                                      |
| ADD-06 nhắc 21:00                      | **Chưa có**                               | Settings giờ/timezone/kênh, opt-in/opt-out, hoàn tất ngày và preview reminder                                                                                                                                          |

## Review UI/UX theo cấu trúc hiện có

Điểm có cơ sở tốt trong source:

- Navigation chia đúng domain; mobile bottom nav 5 mục, More cho module phụ.
- Token light/dark, locale, focus-visible, reduced-motion, safe-area, modal scroll và background inert đã được chuẩn bị.
- Thu/chi hằng ngày ở đầu Home; transfer được tách khỏi P&L; manual valuation và estimate có nhãn.
- Có đường vào commitments/investments từ Home và cơ chế explanation drawer.

Các điểm nên chỉnh:

1. **Giảm copy kỹ thuật trong UI chính:** các tiêu đề chứa FR-xxx, PRD, IA, P&L, ERV, immutable, idempotent và source_ids làm tăng tải đọc. Dùng tiếng Việt ngắn, giải thích thuật ngữ trong drawer chi tiết; source IDs không thay thế danh sách giao dịch có thể mở.
2. **Home cần phân tầng ưu tiên:** tab All đưa cả nhiều KPI, giao dịch, obligations, portfolio/goals và suggestion lên cùng trang; nên thử Today mặc định, ẩn breakdown khi chưa cần. Chưa kết luận độ dài/độ cân đối hình ảnh khi chưa render.
3. **Đổi trạng thái theo bản chất:** giá thị trường không nên gắn Posted như trạng thái ghi sổ; dùng freshness/quality cho quote và Posted cho activity. Kỳ commitment dùng Paid/Due/Overdue/Skipped, không dùng Pending làm thay thế mọi trạng thái.
4. **Settings phải có nội dung riêng:** chọn Sources vẫn render quy tắc phân loại; chọn Categories chưa có danh sách danh mục. Label tab đang hứa nhiều hơn nội dung.
5. **Nút chưa hoạt động cần được nhận biết:** Import/Add account/Review/Apply/Export/Delete/Close hiện là toast demo. Làm flow demo tối thiểu hoặc label “Xem trước” để tester không nhầm đã hoàn tất.
6. **Quick-add cần ngày và validation:** hiện amount không có required/type validation, không chọn ngày, không có inline error hoặc split/refund flow; lưu bản nháp chỉ đóng modal.
7. **Investment form theo activity/asset:** cổ tức không cần chung quantity với mua; valuation cần quote/unit/as-of/source; trái phiếu không gộp form với tiền gửi; đơn vị vàng cần chọn riêng. Phí và thuế tách trường.
8. **Credit card cần màn hình riêng cho sao kê:** credit limit không dùng như original principal; tách dư nợ/sao kê/minimum/payment due, CTA “Ghi nhận thanh toán”, lịch nhắc.
9. **Giải thích số phải mở được nguồn:** đa số drawer ngoài STS/Today chỉ liệt kê IDs; các dòng assumption lại dẫn toast. Thêm formula + input amounts + liên kết record.
10. **ST​S breakdown cần cùng scope/horizon:** Home hiển thị 24,95 − 11,75 − 5 = 8,2 triệu nhưng hero là 12,4 triệu; drawer dùng +12,2 inflow và −19,75 full commitments ra đúng 12,4. Cần hiển thị reconciliation giữa committed đã trả/còn phải giữ và inflow, không trộn hai cơ sở.
11. **Search hiện chỉ có input và shortcut focus:** chưa có kết quả, empty result, selection hoặc scope; chưa kiểm chứng được global search.
12. **Bổ sung state scenarios:** onboarding/empty, amount invalid, shortfall âm, stale prices, provider outage, import lỗi một phần, debt overdue, denied notification, suggestion ineligible. Dữ liệu fixture hiện thiên về trường hợp thành công.

## Kiểm tra đã chạy

- `node design/tests/verify.mjs`: **PASS, 30 checks**.
- `node design/tests/model.test.mjs`: **PASS, 44 assertions**.
- `curl -I --max-time 5 http://localhost:4173/`: **không kết nối được** từ môi trường review.
- Browser discovery: **không có browser khả dụng**.

Các test hiện chủ yếu kiểm tra contract/model fixtures và sự hiện diện chuỗi trong source, không thực hiện DOM click hoặc xác minh save handlers/độ khớp các tổng. PASS không bác bỏ các finding phía trên. Không chạy full repository gate vì chỉ tạo tài liệu review, không thay code.

## Thứ tự xử lý đề xuất

1. Sửa F-01–06 và thống nhất fixture số liệu, trạng thái demo.
2. Hoàn thiện 3 journey có thể test: log thu/chi → chọn danh mục → lưu → Home/list; đầu tư đơn giá/tổng → activity đúng loại; nợ/thẻ → lịch trả → cấu hình nhắc.
3. Thêm Google/onboarding và Settings notification 21:00; đánh dấu rõ feature P1/P2.
4. Hoàn thiện review/import/account/detail và nguồn giá theo coverage đã xác minh; ưu tiên P1 trước suggestion/monthly-close P2.
5. Khi browser kết nối được: walkthrough tất cả tab/dialog ở desktop và mobile, light/dark, VI/EN; kiểm tra keyboard, zoom 200%, overflow, contrast, màn hình nhỏ, unsaved state và return focus. Chỉ khi đó mới kết luận chất lượng visual/responsive.
