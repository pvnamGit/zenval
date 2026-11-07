# Zenval schema models bằng PlantUML

Status: artifacts delivered; documentation review PASS; repository full gate blocked
Owner: Codex
ADLC ticket: none — yêu cầu tài liệu trực tiếp của user

## Goal and stop condition

Tạo bộ PlantUML trong `technical-docs` cho domain entities, application và infrastructure,
có chỉ dẫn đọc, nguồn và phân biệt mô hình đề xuất với code hiện có. Dừng khi kiểm tra
cú pháp, gates và review độc lập đã có kết quả được ghi nhận.

## Scope, non-goals, and rails

- In scope: 12 bounded contexts trong Architecture §5, các entity trong PRD §10,
  use cases/ports, adapters, transaction/outbox và schema PostgreSQL hiện có.
- Not in scope: triển khai classes/tables, thay đổi financial meaning, migration,
  API, dữ liệu thật, deploy hoặc cập nhật lifecycle ADLC khác.
- Giữ nguyên thay đổi có sẵn trong worktree. Target model là đề xuất thiết kế,
  không phải scope MVP được duyệt. Không chọn thay các policy tài chính còn mở.

## Acceptance and verification

| Acceptance criterion                                                                 | Verification command or observation                       |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Có domain, application, infrastructure và đủ 12 contexts                             | README coverage + independent review                      |
| Hiện trạng khớp source; đề xuất có nhãn rõ                                           | đối chiếu domain, services, schema và migrations          |
| PlantUML độc lập, không cần remote include                                           | syntax/render check toàn bộ `.puml` nếu renderer khả dụng |
| Tôn trọng dependency direction, tenant, exact money, lineage, draft-only suggestions | independent review against PRD/Architecture/AGENTS        |
| Không ảnh hưởng code sản phẩm                                                        | diff scoped; `pnpm harness:validate`; `pnpm harness:full` |

## Impact map

- Nguồn: `docs/PRD.md` §§6,10–12; `docs/ARCHITECTURE.md` §§5–10,12,15.
- Hiện trạng: `packages/contexts/ledger/src/domain/business-event.ts` và tests;
  `packages/shared-kernel/src/{money,time}`; `packages/contracts/src/index.ts`;
  `apps/api/src/*service.ts`, controllers; `apps/worker/src/worker.module.ts`.
- Persistence: `packages/database/src/schema.ts`, `index.ts`, `migrations/000*.sql`.
- Writes: chỉ `technical-docs/`, plan này và handoff tương ứng trong `docs/task-memory/`.

## Steps

- [x] Đọc nguồn và xác định ranh giới hiện trạng/target.
- [x] Viết README và 11 sơ đồ.
- [x] Kiểm tra cú pháp/render pass; chạy gates và ghi nhận full gate bị chặn bởi formatting có sẵn.
- [x] Review độc lập PASS; ghi handoff.

## Decisions

| Date       | Decision                               | Evidence / consequence                                                               |
| ---------- | -------------------------------------- | ------------------------------------------------------------------------------------ |
| 2026-11-07 | Tách target model và implemented model | Source hiện có chỉ là foundation/demo; tránh mô tả classes đề xuất như đã triển khai |
| 2026-11-07 | Không thay đổi công thức/policy        | PRD còn giả định/open questions; tài liệu chỉ biểu diễn boundary, dữ liệu và lineage |

## Progress and observations

- Worktree có nhiều thay đổi từ task khác; không chỉnh sửa các file đó.

## Handoff

Tài liệu đã tạo và review độc lập PASS. Cả 11 sơ đồ pass PlantUML syntax/render;
`harness:validate` pass. `harness:full` exit 1 ở formatting có sẵn ngoài scope;
không có bằng chứng lint/typecheck/test/build qua full gate. Không ghi human acceptance.
Xem [handoff](../../task-memory/2026-11-07-technical-schema-models.md) cho evidence,
phạm vi và bước tiếp theo.
