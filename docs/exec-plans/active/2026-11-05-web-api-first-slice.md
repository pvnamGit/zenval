# Chuẩn bị lát cắt web và API đầu tiên

Status: implementation complete — mock-JSON vertical slice verified by focused gates; independent checker confirms technical corrections, while human acceptance, identity and PostgreSQL remain pending
Owner: Product/Engineering/Security (cần chỉ định)
ADLC ticket: none

## Goal and stop condition

Chuyển từ prototype đã commit sang ứng dụng web và API thực theo thứ tự phụ thuộc trong [backlog](../../spec-kit/tasks.md). Product owner đã chỉ dẫn bỏ phỏng vấn, tiếp tục build theo spec và dùng mock JSON phía API cho tới khi tự thiết lập PostgreSQL; đây là ngoại lệ chủ động với T00 và persistence, không phải bằng chứng nghiên cứu hoặc Phase 0 exit. Slice hiện tại dừng khi Dashboard, Accounts, Transactions, Review và Quick Add demo đi qua browser-safe contracts và HTTP API thật, với JSON adapter có thể thay bằng PostgreSQL adapter sau này.

## Scope, non-goals, and rails

- Slice đang thực hiện: dashboard prototype read-only qua `GET /v1/demo/dashboard`, dùng synthetic snapshot được contract buộc nhãn `mode: "demo"`. Web hiển thị trạng thái API/loading/fallback; fallback vẫn nói rõ là dữ liệu mẫu.
- Mở rộng slice theo chỉ dẫn 05/11: Accounts, Transactions và Review đọc qua `GET /v1/demo/finance`; Quick Add gọi `POST /v1/demo/transactions`. GET được seed từ JSON synthetic và luôn immutable; POST trả một draft synthetic để tab hiện tại giữ tới khi reload, không chia sẻ capture giữa client. Cache replay idempotency dùng fingerprint và có giới hạn.
- Không dùng dữ liệu giả như dữ liệu người dùng, không tạo PostgreSQL persistence, auth hoặc posted ledger trong slice này. POST tạo demo capture record, không được tuyên bố là ledger fact production.
- Money trong JSON/contract dùng decimal string + currency; mọi record có `workspaceId`; transfer luôn `pnlImpact: false`; idempotency key không tạo record trùng trong cùng process.
- T10 phụ thuộc đầu ra được chấp nhận của T02 và T03 theo backlog. Bỏ phỏng vấn không tự giải quyết privacy/legal hoặc scope; không tự ghi chấp nhận.
- Mọi tài nguyên workspace cần kiểm tra authorization tại use case; không lưu secrets hoặc dữ liệu cá nhân thực trong evidence; domain không phụ thuộc framework/ORM.

## Acceptance and verification

| Acceptance criterion dự kiến, cần chốt trước build                                                                                              | Verification dự kiến                                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Signup tạo workspace riêng, session hợp lệ; user có thể bỏ qua mục tiêu/module                                                                  | E2E signup/skip và session expiration/revocation                                                   |
| Chọn language/base currency; timezone/theme mặc định theo thiết bị, override/reset; đổi base currency có preview và giữ nguyên original amounts | Test application, API contract và E2E reset                                                        |
| Không truy cập workspace người khác, kể cả qua ID do client cung cấp                                                                            | Policy matrix và integration tests cross-tenant/IDOR, cả negative cases                            |
| Màn hình onboarding có trạng thái loading, empty/error, keyboard và responsive                                                                  | Browser tests hành trình desktop/mobile, kiểm tra accessibility                                    |
| Không rò dữ liệu nhạy cảm vào logs; các failure có hành vi rõ                                                                                   | Security review, log assertions, negative tests                                                    |
| Harness, full gate và review độc lập                                                                                                            | `pnpm harness:validate`, `pnpm harness:full`, fresh checker; human acceptance không do tác giả ghi |
| Snapshot demo không thể bị nhầm với fact người dùng; amount có currency và metadata nguồn/phiên bản                                             | Contract test, API service test và HTTP `GET /v1/demo/dashboard`                                   |
| Accounts/Transactions/Review lấy từ mock JSON phía API, không còn hard-code list trong view                                                     | Contract/API tests; web source assertion; HTTP `GET /v1/demo/finance`                              |
| Quick Add gọi API thật, có loading/success/error; retry cùng idempotency key không tạo duplicate; capture không lộ sang client khác             | API service tests, web client/browser journey và immutable GET check                               |
| Transfer demo giữ `pnlImpact: false`, có hai account khác nhau; amount không dùng binary float                                                  | Contract refinement và golden/negative API service tests                                           |

## Impact map

- `design/README.md`, `design/app.js`: prototype standalone; form mô phỏng, không có auth thật hoặc backend.
- `apps/web/src/app/page.tsx`, `prototype-model.ts` và tests: UI Next.js còn hiển thị fixtures và state giả; cần tách các luồng thật theo slice.
- `apps/api/src/app.module.ts`, `health.controller.ts`: API Nest/Fastify hiện chỉ có health, chưa có session hay tenant policy.
- `packages/contracts`: schema dùng chung browser-safe; `packages/contexts/*`: nơi đặt application/domain theo boundaries. Database/migration cần được thiết kế sau khi xác định policy.
- `docs/PRD.md` §§6.1, 9, 14, 18–19, `docs/FEATURES.md` §1 và `docs/ARCHITECTURE.md`: yêu cầu, quyết định mở và ranh giới.

## Steps

- [x] Đối chiếu yêu cầu mới, prototype, web/API hiện tại và dependency.
- [x] Chuẩn bị scope, nghiệm thu và packet quyết định; không ghi accepted ticket.
- [x] Build dashboard demo API contract, read endpoint, CORS giới hạn GET tới `WEB_ORIGIN`, loading/fallback UX, và tests.
- [x] Build mock-JSON finance adapter, read/capture endpoints, web integration và tests.
- [ ] Product/Engineering quyết định scope và cách xử lý điều kiện exit khi bỏ phỏng vấn; Security/Legal quyết định điều kiện T02 áp dụng cho T10.
- [x] Hoàn thành mock-JSON vertical slice, focused gates và fresh checker; không suy diễn đây là acceptance cho T10.

## Decisions cần con người

| Quyết định                                                                                                     | Bằng chứng và tác động                                                                                                                                      | Trạng thái      |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Scope khởi đầu: T10 như đề xuất hay phạm vi khác trong prototype; cách ghi nhận ngoại lệ bỏ T00                | Prototype gồm P1/P2/P3; backlog yêu cầu T03 và T02 trước T10. Product/Engineering cần xác định scope, owner và điều kiện thay thế/ngoại lệ.                 | Chưa quyết định |
| Legal age, lawful basis, consent, residency, retention và xử lý dữ liệu/session cho slice                      | PRD OQ-01, §9, §19; T02 yêu cầu Security/Legal review. Không thể suy ra từ mock signup.                                                                     | Chưa quyết định |
| Auth/session, account recovery và phạm vi Google sign-in/account linking; threat model và authorization matrix | PRD FR-001–005 và architecture yêu cầu security/privacy; demo Google sign-in không gọi OAuth. Cần chọn thiết kế có thể kiểm chứng với Security/Engineering. | Chưa quyết định |
| Tài chính trước các slice tương ứng                                                                            | T01 cần Finance/Product signoff; OQ-02/03/04/06, rounding/FX và golden cases còn mở. Không chọn ngầm từ prototype.                                          | Chưa quyết định |

## Progress and observations

- Yêu cầu hiện tại cho phép bỏ phỏng vấn; không có kết quả phỏng vấn, diary hay Product/Design review để tuyên bố T00 pass.
- `adlc preflight --json` FAIL: branch check không thể tạo lock trong `.git`; sandbox từ chối ghi. Ticket store đã kiểm tra: 0 ticket. Không có frozen ticket rails.
- `pnpm harness:full` ở lượt trước thất bại tại format của worktree; Node v25.9.0 không thuộc engine yêu cầu >=24 <25. Cần chạy lại ở worktree hiện tại khi thực hiện slice; không ghi kết quả cũ như gate mới.
- Focused verification hiện tại: API/web typecheck PASS; API 1 test PASS, web 6 tests PASS; API và web production build PASS; `pnpm harness:validate` PASS. API HTTP request PASS và response được schema validate. Biome scoped check PASS với một warning `useImportType` trên Nest constructor metadata; import runtime được giữ để Nest resolve service.
- Mock-JSON slice verification (06/11): Biome scoped check và `git diff --check` PASS; contracts/API/web typecheck PASS; contracts 3 tests, API 11 tests và web 8 tests PASS; API/web production builds PASS. Build copy đúng `demo-workspace.json` vào `apps/api/dist/fixtures`.
- HTTP smoke trên API build PASS: `GET /v1/demo/finance`; `POST /v1/demo/transactions` với `X-Demo-Session-Id` và `X-Idempotency-Key`; retry trong cùng tab replay cùng draft, tab khác nhận draft riêng; GET sau POST vẫn là seed immutable. Draft expense giữ `pnlImpact: false`.
- `pnpm harness:validate` PASS. `pnpm harness:full` dừng ở `format:check` với 113 lỗi trong `.agent/skills/impeccable/**` có sẵn ngoài scope; lint/typecheck/test full repo chưa chạy vì gate này. Node v25.9.0 tiếp tục ngoài engine `>=24 <25`.
- Browser journey trước khi hardening PASS cho Accounts, Review, Quick Add → Transactions và viewport 375px không overflow; loading state quan sát được. Sau review, finance views giữ nhãn `DỮ LIỆU MẪU` ở ready state và Quick Add có success status; POST không ghi capture vào shared GET.

- Fresh checker: `ESCALATE` duy nhất về governance: chưa có accepted ADLC ticket, frozen rails hoặc human acceptance, nên không được ship/T10. Technical corrections PASS: idempotency namespaced theo demo tab, cache process-local giữ replay key với hard cap 1.024 và trả HTTP 503 khi đầy (không evict thành duplicate); controller-level Fastify injection tests cover CORS, required headers, replay và immutable GET. Chưa có human acceptance.

## Handoff

Packet này là đề xuất, không phải spec hoặc scope đã được duyệt. Cần quyết định cụ thể ở bảng trên trước khi build T10; các bước phụ thuộc tài chính tiếp tục chờ quyết định của Finance/Product. Không ghi human acceptance.
