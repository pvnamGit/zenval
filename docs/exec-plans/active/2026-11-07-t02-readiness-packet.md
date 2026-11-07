# T02 readiness packet (preparation)

Status: active
Owner: Security/Legal (cần chỉ định); chuẩn bị: agent
ADLC ticket: none — backlog T02 (#9) là Draft, chưa accepted.

## Goal and stop condition

Soạn data-flow/threat map và decision packet từ code hiện có để Security/Legal review. Dừng khi packet được kiểm tra và có review độc lập; T02 chỉ xong khi owner ghi quyết định.

## Scope, non-goals, and rails

- In scope: `docs/security/t02-readiness-packet.md` và plan này.
- Not in scope: quyết định pháp lý, chọn vendor/KMS, DPIA, code/schema thay đổi, accept T02.
- Frozen rails / human approvals: Security/Legal phải ký mọi OQ; không có PII hoặc dữ liệu tài chính thật.

## Acceptance and verification

| Acceptance criterion                         | Verification command or observation          |
| -------------------------------------------- | -------------------------------------------- |
| Mọi khẳng định hiện trạng có đường dẫn nguồn | Đối chiếu §1–2 với file được trích           |
| Quyết định để Open, không tự chốt            | Đọc §4 và Handoff                            |
| Gate                                         | `pnpm harness:validate`, `pnpm format:check` |

## Steps

- [x] Kiểm kê API/DB/web/worker data path
- [x] Soạn gap, threat map, decision packet
- [ ] Independent checker review
- [ ] Security/Legal review (con người)

## Handoff

Packet nháp đã soạn; chưa có owner decision. Bước an toàn tiếp theo: Security/Legal review §4.
