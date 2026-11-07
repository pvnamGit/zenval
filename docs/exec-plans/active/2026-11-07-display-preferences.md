# Tùy chọn hiển thị cục bộ

Status: active — implementation and code review complete; browser verification and full gate blocked
Owner: Codex (implementation); Product/Engineering (acceptance pending)
ADLC ticket: none

## Goal and stop condition

Giữ ngôn ngữ và giao diện đã chọn trên thiết bị, theo theme thiết bị khi không override, cho phép quay lại theme thiết bị. Dừng khi có kiểm thử, review độc lập và ghi rõ gate còn thiếu; không coi đây là T10 hoàn chỉnh.

## Scope, non-goals, and rails

- Phạm vi: tùy chọn hiển thị cục bộ của web demo, không gửi API và không lưu dữ liệu tài chính.
- Ngoài phạm vi: preferences phía server, identity, signup, currency, financial policy và human acceptance.
- Giữ nguyên code demo web/API đã có trong worktree; browser storage có thể bị từ chối, UI vẫn phải hoạt động trong phiên.

## Acceptance and verification

| Kiểm tra                                                     | Bằng chứng                                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Lưu/khôi phục locale, theme; mặc định hợp lệ khi storage lỗi | `pnpm --filter @zenval/web test`                                          |
| Theo thay đổi OS khi chưa override; reset từ desktop/mobile  | Review mã và browser journey khi môi trường cho phép                      |
| Types/format và gate                                         | Web typecheck, Biome scoped, `pnpm harness:validate`, `pnpm harness:full` |
| Review độc lập                                               | Fresh checker; không tự ghi human acceptance                              |

## Impact map

- `apps/web/src/app/page.tsx`: state, theme listener, controls và sidebar.
- `apps/web/src/app/display-preferences.ts` và test: lưu tùy chọn trên thiết bị, validate và xử lý storage lỗi.
- API, contracts và financial records không đổi trong slice này; worktree đã có thay đổi demo chưa commit trước khi bắt đầu.

## Steps

- [x] Kiểm tra worktree và code demo hiện tại.
- [x] Implement, chạy test và sửa findings của checker.
- [ ] Kiểm tra browser desktop/mobile, reload và thay đổi OS khi môi trường hỗ trợ.
- [ ] Full gate và human acceptance theo quy trình repo.

## Decisions

| Date       | Decision                                                  | Evidence / consequence                                     |
| ---------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| 2026-11-07 | Chỉ lưu locale/theme cục bộ, không coi T10 đã hoàn thành. | Không cần chọn auth, privacy policy hay financial meaning. |

## Progress and observations

- Web tests 10/10 và typecheck PASS; Biome scoped và `git diff --check` PASS. Web build PASS trước thay đổi nhỏ kết nối nút Settings; test/typecheck chạy lại sau thay đổi đó.
- `pnpm harness:validate` PASS; `pnpm harness:full` FAIL tại format: 113 lỗi trong worktree, gồm `.agent/skills/impeccable`; các bước tiếp theo không chạy. Node v25.9.0 ngoài engine >=24 <25.
- Browser không khả dụng; `pnpm --filter @zenval/web dev` FAIL `listen EPERM 0.0.0.0:3000`. Chưa kiểm chứng hành trình reload, keyboard, viewport hay đổi theme OS thực tế.
- Checker ban đầu REVISE về theo dõi OS và reset; vòng tiếp REVISE do desktop không truy cập reset. Sau sửa, checker PASS cho review mã có giới hạn; browser và full/ADLC gates chưa pass. Không ghi human acceptance.

## Handoff

Tiếp tục xác nhận UI trong browser và chạy full gate sau khi lỗi format ngoài scope được xử lý. Đây chỉ là slice preferences cục bộ; API demo, T10, xác thực và các quyết định tài chính vẫn cần xử lý riêng.
