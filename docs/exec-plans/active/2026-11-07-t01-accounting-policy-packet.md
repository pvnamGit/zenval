# T01 accounting policy packet (preparation)

Status: active
Owner: Product/Finance/Engineering (cần chỉ định); chuẩn bị: agent
ADLC ticket: none — backlog T01 (#8) là Draft, chưa accepted.

## Goal and stop condition

Kiểm kê Money/BusinessEvent tests hiện có, lập golden-case coverage cho PRD §20.4/§20.5, bảng phương trình
kế toán theo movement và decision packet OQ-02/03/04/06 + rounding/FX để Finance/Product review. Dừng khi
packet được kiểm tra và có review độc lập; T01 chỉ xong khi owner ghi quyết định và golden suite chạy được.

## Scope, non-goals, and rails

- In scope: `docs/accounting/t01-accounting-policy-packet.md`, plan này, task memory.
- Not in scope: chốt công thức/classification/policy, sửa code Money/Ledger/schema, viết expected value cho
  case phụ thuộc quyết định Open, accept T01.
- Frozen rails / human approvals: Product/Finance ký mọi thay đổi ý nghĩa tài chính; chỉ dùng số liệu tổng hợp
  từ PRD; không dữ liệu người dùng thật.

## Acceptance and verification

| Acceptance criterion                                  | Verification command or observation          |
| ----------------------------------------------------- | -------------------------------------------- |
| Mọi khẳng định hiện trạng có đường dẫn nguồn          | Đối chiếu §1 với file được trích             |
| Mỗi movement có Δ assets/liabilities/equity cân bằng  | Đọc §2, kiểm tra A = L + E từng dòng         |
| Coverage đủ 60 case + 8 ví dụ, mỗi case có task/owner | Đọc §3                                       |
| Quyết định để Open, không tự chốt                     | Đọc §4 và Handoff                            |
| Gate                                                  | `pnpm harness:validate`, `pnpm format:check` |

## Impact map

Chỉ tài liệu. Nguồn đọc: `packages/shared-kernel/src/money/*`, `packages/contexts/ledger/src/domain/*`,
`packages/database/src/schema.ts`, `migrations/0001–0002`, PRD §6.5, §6.7, §12.3–12.4, §18, §20.

## Steps

- [x] Kiểm kê Money/BusinessEvent/DB và tests
- [x] Soạn phương trình kế toán, coverage matrix, decision packet, định dạng fixture
- [ ] Independent checker review
- [ ] Product/Finance/Engineering review (con người)

## Decisions

| Date       | Decision                                        | Evidence / consequence                                        |
| ---------- | ----------------------------------------------- | ------------------------------------------------------------- |
| 2026-11-07 | Docs-only; không viết golden test trước signoff | Expected value phụ thuộc OQ/R chưa chốt; tránh tự chốt policy |

## Progress and observations

Xem task memory `docs/task-memory/2026-11-07-t01-accounting-policy-packet.md`.

## Handoff

Packet nháp đã soạn; chưa có owner decision. Bước an toàn tiếp theo: Finance/Product review §2 và §4.
