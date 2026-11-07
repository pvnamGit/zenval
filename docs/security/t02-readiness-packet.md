# T02 — Security, privacy, legal và data-provider readiness: gói chuẩn bị

Status: DRAFT cho review · Verdict: **chưa có** (GO/REVISE/STOP thuộc Security/Legal) · Issue: [#9](https://github.com/pvnamGit/zenval/issues/9)
Nguồn code: `main@8475dac`, 07/11/2026. Đây là kiểm kê nguồn, không phải kết quả test, tư vấn pháp lý hay DPIA hoàn chỉnh.

> Tài liệu này chỉ chuẩn bị. Không chốt legal age, lawful basis, residency, vendor, license, SLA hay
> exception thay Security/Legal. Mọi quyết định bên dưới ở trạng thái **Open** cho tới khi owner ghi ngày + kết luận.

## 1. Data-flow hiện có (quan sát từ code)

| #   | Đường dữ liệu                                                           | Bằng chứng                                                                                                        | Trạng thái                                                            |
| --- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| D1  | Web → API (`GET/POST`, header `X-Demo-Session-Id`, `X-Idempotency-Key`) | `apps/api/src/main.ts` (CORS theo `WEB_ORIGIN`, `credentials: false`); controller demo yêu cầu header 1–128 ký tự | Demo, **không có authN/authZ thật**                                   |
| D2  | Demo finance/dashboard trong API                                        | `demo-finance.service.ts` giữ idempotency response trong `Map` bộ nhớ; fixture `demo-workspace.json`              | Dữ liệu tổng hợp, mất khi restart                                     |
| D3  | API/worker → PostgreSQL schema `ledger`                                 | `packages/database/src/schema.ts`, `migrations/0001`, `0002`                                                      | Có bảng `business_event`, `ledger_entry`; chưa nối API demo           |
| D4  | Browser local state                                                     | `theme-provider.tsx` (`localStorage` cho theme); `legacy-prototype/prototype-app.tsx` đọc `localStorage`          | Theme: không tài chính. Prototype: **cần xác nhận khóa nào được ghi** |
| D5  | Worker                                                                  | `apps/worker/src` chỉ có health controller                                                                        | Chưa có job/outbox/import/OCR                                         |
| D6  | Web mock API                                                            | `apps/web/src/lib/api/mock/*`                                                                                     | Fixture tổng hợp                                                      |

Chưa tồn tại trong repo: identity/session/workspace membership, KMS/crypto gateway, file/attachment storage,
export/delete, notification, provider market-data adapter, email/analytics vendor.

## 2. Khoảng cách so với ràng buộc đã nêu

| Gap | Hiện trạng                                                                             | Target (nguồn)                                                                                                                 | Hệ quả                                                           |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| G1  | `ledger_entry.amount`, `.currency`, `business_event.event_type` lưu **plaintext**      | [financial-data-encryption.md](../../technical-docs/financial-data-encryption.md): payload mã hóa qua `FinancialCryptoGateway` | Không dùng DB hiện tại cho dữ liệu người dùng thật trước T32/T33 |
| G2  | Danh tính = header tự khai `X-Demo-Session-Id`                                         | Workspace quyền do trusted boundary, không tin request                                                                         | Không thể coi là authN; không dùng cho dữ liệu thật              |
| G3  | Chưa có audit log, incident workflow, retention/deletion job                           | PRD privacy/NFR                                                                                                                | Cần thiết kế trước P1 persistence                                |
| G4  | Logs: chưa có chính sách redaction được kiểm thử                                       | AGENTS.md: log không chứa dữ liệu tài chính thô                                                                                | Cần test leakage khi có endpoint thật                            |
| G5  | CORS cho phép nhiều origin qua env, chưa có rate limit/headers bảo mật được kiểm chứng | —                                                                                                                              | Mở review khi thêm auth                                          |

## 3. Threat map sơ bộ (STRIDE, cần Security review)

| Tài sản               | Mối đe dọa chính                                             | Control đề xuất (chưa triển khai)                                              | Owner kiểm chứng |
| --------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ | ---------------- |
| Ledger/amount         | Tenant leakage (thiếu `workspace_id` filter), lộ qua DB dump | Workspace-scoped repository + encrypted payload; integration test cross-tenant | Eng + Security   |
| Session/identity      | Giả mạo header, session fixation, IDOR                       | Session server-side, membership check trong use-case; negative test            | Security         |
| Idempotency           | Replay/ghi trùng, lưu response plaintext                     | Key theo actor+workspace; payload mã hóa; TTL                                  | Eng              |
| Export/attachment     | Rò file tạm, link chia sẻ                                    | Mã hóa trước lưu, link ngắn hạn, không temp plaintext                          | Security         |
| Logs/analytics/errors | PII/số tiền lọt vào log/telemetry                            | Redaction + test leakage; allowlist field                                      | Eng              |
| Provider/vendor       | Rò dữ liệu sang bên thứ ba, license vi phạm                  | DPA + license review trước tích hợp                                            | Legal            |
| Secrets/keys          | Key trong repo/DB/client                                     | KMS ngoài DB; rotation/restore drill                                           | Security         |

## 4. Decision packet (Open — chờ owner)

| ID     | Câu hỏi                                                                      | Cần bởi    | Owner đề xuất  | Lựa chọn/ý kiến cần có                                                                     | Trạng thái |
| ------ | ---------------------------------------------------------------------------- | ---------- | -------------- | ------------------------------------------------------------------------------------------ | ---------- |
| OQ-01a | Độ tuổi tối thiểu và consent người chưa thành niên                           | P0 exit    | Legal          | Quy định VN hiện hành; chặn đăng ký dưới ngưỡng hay yêu cầu đồng ý                         | Open       |
| OQ-01b | Lawful basis từng mục đích (core service, analytics, notification, research) | P0 exit    | Legal          | Bảng purpose → basis → dữ liệu                                                             | Open       |
| OQ-01c | Data residency (VN/vùng khác) và chuyển dữ liệu xuyên biên giới              | P0 exit    | Legal/Security | Vùng DB/KMS/backup/log/vendor                                                              | Open       |
| OQ-01d | Retention + deletion schedule (tài khoản, ledger, attachment, backup, log)   | P0 exit    | Legal/Security | Thời hạn từng loại, xử lý backup khi xóa                                                   | Open       |
| OQ-05  | Provider/license cho chứng khoán/quỹ/vàng VN và chi phí                      | P1 vendor  | Data/Legal     | Ít nhất 2 phương án có license ghi rõ, quyền hiển thị/lưu cache; chi phí **chưa xác minh** | Open       |
| OQ-07  | Định dạng export và retention attachment                                     | P1 privacy | Security/Eng   | Định dạng (CSV/JSON/XLSX), phạm vi, SLA export/delete                                      | Open       |
| D-IDN  | Mô hình identity/session/workspace membership                                | Trước T10  | Security/Eng   | Phương thức đăng nhập, session store, revoke                                               | Open       |
| D-KMS  | KMS/allowlist, rotation, restore, key scope theo workspace                   | Trước T32  | Security       | Nhà cung cấp KMS, quyền principal                                                          | Open       |
| D-IR   | Incident workflow (phát hiện, thông báo người dùng/cơ quan, thời hạn)        | P0 exit    | Security/Legal | Runbook + owner on-call                                                                    | Open       |

## 5. Đầu ra T02 còn thiếu (theo issue) và người phụ trách

| Đầu ra                        | Trạng thái                              | Ghi chú                                                                 |
| ----------------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| Threat model                  | Bản nháp §3                             | Cần review Security, bổ sung trust boundary diagram                     |
| Data map / DPIA               | Bản nháp §1–2 (data map); DPIA **chưa** | DPIA cần Legal                                                          |
| Consent purposes              | Chưa                                    | Phụ thuộc OQ-01b                                                        |
| Retention/deletion schedule   | Chưa                                    | Phụ thuộc OQ-01d                                                        |
| Incident workflow             | Chưa                                    | D-IR                                                                    |
| Vendor DPA/license assessment | Chưa                                    | OQ-05, cần dữ liệu từ vendor                                            |
| Quyết định lưu trong repo     | Chưa                                    | Ghi vào `architecture/adr` hoặc decision log PRD §18.3 sau khi owner ký |

## 6. Việc cần con người

1. Chỉ định owner cá nhân cho Security và Legal (hiện chỉ là vai trò đề xuất).
2. Security/Legal review §2–§4, trả lời từng OQ với ngày + kết luận GO/REVISE/STOP.
3. Xác nhận khóa `localStorage` của `legacy-prototype` không chứa dữ liệu tài chính thật (D4).
4. Sau khi có quyết định: cập nhật PRD §18.3 và mở child slice (T10, T32, T33).

## Handoff

Đã làm: kiểm kê data path từ code, gap, threat map sơ bộ, decision packet. Chưa làm và **không được tự làm**:
quyết định pháp lý, chọn vendor/KMS, DPIA, chấp nhận T02. Issue #9 giữ nguyên Draft/In progress cho tới khi
owner review; không chuyển Done.
