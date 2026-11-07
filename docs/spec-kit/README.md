# Zenval spec kit

Trạng thái: **draft để review**, cập nhật 07/11/2026. Bộ tài liệu chuyển yêu cầu hiện có thành backlog có thể chia ticket; không phải phê duyệt scope, quyết định tài chính hay lệnh bắt đầu build MVP. PRD nói rõ Phase 0 và scope P1 phải được chốt trước build tương ứng.

1. [Spec sản phẩm và tiêu chí nghiệm thu](./spec.md) — hành vi, trạng thái, ranh giới và điều kiện kiểm chứng.
2. [Tasks và thứ tự thực hiện](./tasks.md) — backlog theo dependency, mỗi task có đầu ra và cách nghiệm thu.
3. [Ma trận truy vết và quyết định cần chốt](./traceability.md) — FR → task, prototype → phạm vi và các mâu thuẫn.

Nguồn: [PRD](../PRD.md), [Features](../FEATURES.md), [Architecture](../ARCHITECTURE.md), [prototype](../../design/README.md) và mã/tests trong `design/`; bổ sung [technical models](../../technical-docs/README.md), [encryption contract](../../technical-docs/financial-data-encryption.md), [web hiện tại](../../apps/web/README.md). Nếu có khác biệt, PRD/Features là nguồn yêu cầu; prototype chỉ minh họa UX, dữ liệu giả và có cả tính năng phase sau. Khi có ticket ADLC đã chấp nhận, spec/rails/evidence của ticket đó có hiệu lực trong phạm vi ticket. Không tự nâng một demo thành hành vi production đã duyệt.

Cách dùng: review quyết định mở → chọn một lát cắt theo dependency → tạo ticket/spec/rails ADLC và plan theo harness → thực hiện, kiểm thử, review độc lập → xin phê duyệt bắt buộc. Checkbox trong backlog biểu thị việc cần làm, không biểu thị tiến độ hiện tại. Ưu tiên M/S/C và phase lấy từ bảng FR của Features; các mục roadmap chưa có FR vẫn cần xác nhận scope.

GitHub backlog: [Project 4](https://github.com/users/pvnamGit/projects/4) và [roadmap/task-spec index #6](https://github.com/pvnamGit/zenval/issues/6). [Reconciliation snapshot](../backlog/README.md) lưu mapping Txx → issue; trạng thái live đọc từ GitHub, không suy từ thứ tự task hay từ checkbox trong tài liệu.

Để agent chọn việc tiếp theo theo codebase hiện tại, dùng [execution order](../backlog/EXECUTION.md) và [ranked queue](../backlog/execution-order.json), kiểm tra lại accepted dependencies trước implementation.
