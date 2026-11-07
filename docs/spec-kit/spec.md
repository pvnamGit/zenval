# Spec sản phẩm Zenval

Trạng thái: draft; nguồn và cách dùng ở [README](./README.md). Phạm vi là bản đồ sản phẩm nhiều phase, không phải scope MVP đã duyệt. Chi tiết công thức, NFR và ví dụ kế toán vẫn theo PRD §§6–12, 20; đặc tả này không thay thế chúng.

## Mục tiêu và giới hạn

Người dùng cá nhân tại Việt Nam có thể ghi nhận tiền, hiểu nghĩa vụ và tài sản ròng, xem dự báo có nguồn và tự quyết định kế hoạch. Web responsive/PWA là nền tảng đầu tiên; VND mặc định. Không chuyển tiền, trả nợ, giao dịch đầu tư hay áp dụng gợi ý tự động; không hứa lợi nhuận, thu hồi nợ hoặc độ chính xác dự báo. Không xây household/business hay kết nối bank/broker trong MVP.

Phase 0 xác thực nhu cầu, prototype, kế toán, bảo mật/pháp lý, nguồn giá và khóa scope. Phase 1 hướng tới bức tranh tài chính đáng tin cậy; Phase 2 thêm kế hoạch thích nghi/gợi ý; Phase 3 mở rộng kết nối/native. Phân loại chi tiết và mâu thuẫn xem [traceability](./traceability.md).

## Quy tắc xuyên suốt và nghiệm thu

- Tiền dùng biểu diễn chính xác kèm currency, rounding và FX rõ ràng; mọi dữ liệu tài chính gắn `workspace_id`, kiểm tra quyền ở use case và test cross-tenant. Không đưa secrets hay dữ liệu tài chính thô vào log/fixtures/evidence.
- Chỉ Ledger application layer ghi posted facts; event phải cân bằng, retry không ghi trùng, sửa sai có audit. Transfer và gốc vay/thu hồi gốc không phải thu/chi; lãi/phí theo đúng chiều P&L. Các context khác dùng port/contract ổn định.
- Số suy diễn có input/source, timestamp, assumptions, calculation version, freshness và drill-down; rebuild cho kết quả nhất quán. Không biến thiếu giá thành zero. Forecast, fact và suggestion có nhãn khác nhau.
- Mọi journey có loading, empty, error, stale/partial, keyboard và narrow-screen phù hợp; chart có text/table, i18n và WCAG 2.2 AA. Không lấy màu đơn lẻ để truyền đạt trạng thái.
- Với từng slice, chứng minh bằng domain/golden tests, test application/idempotency, integration với PostgreSQL và authorization nếu liên quan; thêm contract/E2E và accessibility theo rủi ro. PRD §20.6 và NFR §§9, 19 là điều kiện đầy đủ.

- Nội dung tài chính riêng phải mã hóa trước mọi persistence qua gateway server-only chung; authorize trước decrypt, key ngoài DB/client và response policy theo purpose. Schema plaintext hiện tại là gap; chưa bật financial-user writes cho slice chưa compliant. Kiểm chứng leakage/round-trip/tamper/rotation/restore theo [encryption contract](../../technical-docs/financial-data-encryption.md), T32–T33. Đây là yêu cầu thiết kế, chưa được triển khai.

## Hành trình và tiêu chí hành vi

### S01 · Thiết lập, quyền dữ liệu và điều hướng

Signup tạo workspace riêng; user chọn language/base currency, có thể bỏ qua mục tiêu/module, timezone/theme theo thiết bị và cho phép override/reset. Opening balance và ngày được nhập trước dashboard sơ bộ. Đổi base currency có preview, không sửa original amounts. Export có cutoff nhất quán, entities, attachment manifest và schema version; delete thông báo scope/retention, xác nhận và bảo vệ bằng recent authentication, ẩn ngay rồi hard-delete theo SLA. Session/consent có thể xem và thu hồi. Kiểm chứng bằng E2E signup → account → dashboard, đổi preferences, test isolation, export/delete và các trạng thái thất bại. Nguồn FR-001–005, PRD §§5, 6.1, 7.1, 9.

### S02 · Tài khoản, ledger và capture

Tạo account theo type/currency/opening balance; archive giữ lịch sử. User ghi/sửa income, expense, transfer; split tổng bằng total và refund liên kết original. Transfer paired, có rate/fee nếu FX, không đi vào P&L. Categories/tags giữ audit khi đổi; retry không duplicate. Quick-add amount-first với thông tin gần đây, phân biệt pending/expected/posted. Nghiệm thu bằng golden balanced legs, transfer không ảnh hưởng P&L, split/rounding, refund, concurrency/idempotency, workspace isolation và E2E capture → drill-down. Nguồn FR-010–015, PRD §§6.2–6.3, 7.2.

### S03 · Cam kết, import và review

Recurring tạo expected occurrences/reminders không tự post khoản variable. Fixed commitment có cadence, due date, account, tolerance, priority, reminder; user sửa this/this-and-future, pause/end mà không sửa occurrence đã paid. Match được đề xuất/undo; ngoài tolerance vào review; state paid/due/overdue/skipped/rescheduled có history. Debt installment link lịch nợ và tách gốc/lãi/phí không double-count. CSV/XLSX preview mapping, invalid rows, duplicate trước commit; retry an toàn, rollback trong window được duyệt. Inbox lọc reason/confidence/source, batch approve an toàn và preview thao tác destructive. Nghiệm thu bằng chuỗi expected → match/review → undo và import lỗi/duplicate/retry/rollback; xác nhận forecast thay đổi nhưng expected không tạo ledger fact. Nguồn FR-016–018, 022–025.

### S04 · Dashboard, forecast, plan và goals

Dashboard hiển thị card theo dữ liệu, as-of/status và drill-down. Prototype Home ưu tiên chi hôm nay, thu, net movement, danh sách cần chú ý và ba tín hiệu sức khỏe; các số/demo không là công thức production. Cash-flow dùng dữ liệu posted và expected với scenario, nguồn, assumptions và version; thiếu/stale giảm confidence. Safe-to-spend hiển thị horizon/components và shortfall nếu âm; commitments còn lại chỉ trừ một lần. Optional spending plan cho user sửa allocation, tổng percentage buckets 100%; không chặn dashboard nếu bỏ qua. Goal link nguồn thật, cảnh báo double allocation, tách contribution/market movement/planned/gap; apply chỉ tạo plan draft. Kiểm chứng golden cases ngưỡng rỗng/stale/âm, scenario, double-count, thay input và rebuild, UI drill-down. Công thức cụ thể và horizon cần duyệt theo PRD §20.2 và OQ-02. Nguồn FR-030–034, 039.

### S05 · Nợ, phải thu và báo cáo

Tạo payable/receivable, preview lịch và link disbursement/collection; principal là balance-sheet movement, lãi/phí theo P&L. Theo dõi partial/extra/reversal, due/overdue theo timezone/grace period và outstanding; receivable hiển thị gross và estimated recoverable. Reports cho phép lọc nhất quán, net worth = assets + recoverable receivables − liabilities, bridge giữa dates và không đếm trùng liên kết. Simulation chỉ tạo draft; phân loại ưu tiên còn mở. Kiểm chứng golden disbursement/payment/collection/credit-card, reverse/partial, báo cáo reconcile với ledger, timezone và double-count. Nguồn FR-035–036, 040–045.

### S06 · Đầu tư và giá

Portfolio chọn instrument qua provider catalog có stable mapping; không tìm thấy đi manual/review. Activity buy/sell/income/fee, quantity/cost basis và performance bridge có thể rebuild, đối chiếu ledger. Mỗi valuation/FX có source, timestamp, currency, freshness; manual override giữ provider value, outage dùng last-known/manual và nhãn stale. Không coi dữ liệu sample ở prototype là giá thật. Golden cases bao gồm trade, income, fee, price stale/missing, brokerage cash trùng, backdated và XIRR không có/nhiều nghiệm. Chốt license/provider và cost-basis trước slice tương ứng. Nguồn FR-050–053, 057, PRD §§6.8, 12, 20.2.

### S07 · Thông báo, bảo mật, vận hành

User cấu hình từng loại/kênh/quiet hours; mặc định không có thông tin nhạy cảm trên lock screen. Bảo vệ session, mã hóa, rate limit, audit, privacy/consent, export/delete, recovery, backup/restore và quan sát không lộ dữ liệu. Đo SLO/NFR, accessibility và privacy-safe analytics theo PRD, không dùng số liệu demo làm bằng chứng. Kiểm chứng policy matrix, IDOR, security tests, job retry, restore drill, data deletion và các ngưỡng PRD §§9, 15, 19.

### S08 · Các phase sau

P2: eligibility/explainability, user controls, conflict guardrails và feedback cho suggestion; apply tạo plan draft sau diff/confirm, không execute. Các module opt-in/pin, OCR xác nhận trước post, offline sync có conflict, monthly close version/reopen, custom cycle, write-off/recovery, corporate actions và advanced performance theo FR/ưu tiên ở Features. P3: broker/crypto read-only consent/revoke, connector mở rộng và native, các mục household/partner phụ thuộc quyết định riêng. Mỗi slice phải có spec/rails và nghiệm thu riêng trước build; prototype có màn hình không làm thay đổi phase.
