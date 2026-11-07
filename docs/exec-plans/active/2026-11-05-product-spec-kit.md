# Chuẩn bị spec kit và backlog Zenval

Status: active
Owner: Codex
ADLC ticket: none

## Goal and stop condition

Tạo spec kit Markdown dựa trên PRD, Features và UI prototype, có truy vết, tasks, dependency, verification và quyết định mở. Dừng khi tài liệu review được, kiểm tra cấu trúc/gates và có independent review hoặc ghi rõ blocker.

## Scope, non-goals, and rails

- In scope: `docs/spec-kit/` và plan này.
- Not in scope: implementation, thay đổi yêu cầu nguồn, duyệt scope MVP, tài chính hoặc release.
- Rails: giữ phase/priority và open questions; không coi prototype là production; human approval cho financial meaning.

## Acceptance and verification

| Acceptance criterion                                     | Verification command or observation           |
| -------------------------------------------------------- | --------------------------------------------- |
| Mỗi FR trong Features có task và phase                   | So sánh mã FR bằng script và đọc traceability |
| Spec phản ánh prototype, giới hạn, invariants, UX states | Review nguồn PRD/Features/design và spec      |
| Tasks có thứ tự, đầu ra/kiểm chứng, điều kiện chốt       | Review tasks và dependencies                  |
| Harness và full gate                                     | `pnpm harness:validate`, `pnpm harness:full`  |
| Review độc lập                                           | Fresh checker trả verdict hoặc ghi blocker    |

## Impact map

- `docs/PRD.md`, `docs/FEATURES.md`, `docs/ARCHITECTURE.md`: nguồn yêu cầu, phase, financial rules và boundaries.
- `design/README.md`, `design/app.js`, `design/model.mjs`, `design/tests/`: prototype và review journeys; mock, không phải backend.
- `packages/shared-kernel/src/money/money.test.ts`, `packages/contexts/ledger/src/domain/business-event.test.ts`: primitive và domain tests hiện hữu; API/worker hiện có health skeleton.
- `docs/spec-kit/`: các tài liệu mới; không thay đổi source hiện có và công việc chưa commit của người dùng.

## Steps

- [x] Đọc nguồn và xác định phạm vi, mâu thuẫn, prototype limitations.
- [x] Viết spec, task backlog và ma trận truy vết.
- [x] Chạy kiểm tra truy vết và gates; ghi nhận gate bị chặn bởi worktree hiện tại.
- [x] Nhận independent review và ghi handoff.

## Decisions

| Date       | Decision                                                               | Evidence / consequence                                           |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 2026-11-05 | Để spec kit ở `docs/spec-kit/` dưới dạng draft.                        | PRD chưa cho phép build MVP; không giả lập accepted ADLC ticket. |
| 2026-11-05 | Giữ bảng FR làm phase/priority gốc; liệt kê mâu thuẫn thay vì tự chốt. | Features §6 và prototype gồm feature phase sau.                  |

## Progress and observations

- Worktree có nhiều thay đổi sẵn; chỉ tạo tài liệu mới trong phạm vi task.
- Kiểm tra truy vết: 53 FR trong Features đều có trong traceability; không có local link hỏng.
- `pnpm harness:validate`: pass. `pnpm exec biome format docs/spec-kit docs/exec-plans/active/2026-11-05-product-spec-kit.md`: pass.
- `pnpm harness:full`: exit 1 ở `format:check` do 115 lỗi format trong worktree, gồm `.agent/skills/impeccable/`; các bước lint/typecheck/test/build sau đó không chạy. Node 25.9.0 ngoài engine yêu cầu >=24 <25. Không sửa các file có sẵn ngoài phạm vi.
- Independent checker ban đầu REVISE: hai vòng dependency, native phụ thuộc broker và thiếu optional P1. Đã sửa; checker re-review PASS cho scoped draft, không phải human acceptance.

## Handoff

Spec kit sẵn sàng để review; full gate chưa pass do format trong worktree. Product/Finance/Design/Security cần chốt các quyết định liên quan trước từng ticket; không ghi human acceptance.
