# Chuẩn bị nghiên cứu T00

Status: active
Owner: Product/Design (cần chỉ định); chuẩn bị: Codex
ADLC ticket: none — backlog T00 là draft, chưa có ticket được chấp nhận.

## Goal and stop condition

Chuẩn bị đề cương có thể review cho phỏng vấn, diary và usability T00 dựa trên nguồn repo; dừng tại handoff khi đã kiểm tra và review độc lập hoặc ghi rõ blocker. T00 chỉ hoàn tất sau nghiên cứu thực tế và Product/Design review evidence.

## Scope, non-goals, and rails

- In scope: đề cương nghiên cứu và plan này; nguồn PRD, Features, spec kit và prototype.
- Not in scope: tuyển/liên hệ người, thu thập dữ liệu, thay prototype hoặc code, chốt kết quả, scope P1 hay financial meaning.
- Rails: giữ nguyên các thay đổi có sẵn; không ghi thông tin cá nhân; không tự ghi human acceptance. T02 còn các quyết định privacy/legal trước khi thu thập.

## Acceptance and verification

| Acceptance criterion                                               | Verification command or observation                         |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Mẫu 15–20, diary 2–4 tuần, bốn hành trình và mục tiêu PRD có nguồn | Đối chiếu đề cương với PRD §§14.1, 15.4 và Features §1      |
| Phân biệt chuẩn bị với kết quả, nêu quyết định và review còn thiếu | Đọc trạng thái, điều kiện chạy và handoff                   |
| Giữ thay đổi cũ; không thu thập PII hay thay financial behavior    | `git status --short` và review file mới                     |
| Deterministic gates và independent review                          | `pnpm harness:validate`, `pnpm harness:full`, fresh checker |

## Impact map

- `docs/spec-kit/tasks.md`: dependency T00 và yêu cầu review; chưa có accepted ticket.
- `docs/PRD.md`, `docs/FEATURES.md`, `docs/ARCHITECTURE.md`: nguồn và ranh giới.
- `design/README.md`, `design/tests/`: prototype synthetic, không chứng minh usability hoặc production.
- `docs/research/2026-11-05-t00-discovery-protocol.md`: đề cương mới, không sửa spec kit đang untracked.

## Steps

- [x] Kiểm tra worktree, nguồn, trạng thái ticket và preflight.
- [x] Soạn đề cương và ghi các quyết định còn thiếu.
- [x] Chạy gates, nhận review độc lập và ghi kết quả; các blocker được giữ mở.

## Decisions

| Date       | Decision                                                | Evidence / consequence                                                          |
| ---------- | ------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 2026-11-05 | Chỉ chuẩn bị T00, không tuyên bố nghiên cứu hoàn thành. | PRD yêu cầu người tham gia thực và review; chưa có evidence trong ticket store. |
| 2026-11-05 | Không tạo ticket được chấp nhận hoặc ghi Phase 0 exit.  | Backlog/spec kit draft; Product/Design và các signoff khác còn thiếu.           |

## Progress and observations

- Worktree lúc bắt đầu: `?? docs/exec-plans/active/2026-11-05-product-spec-kit.md`, `?? docs/spec-kit/`; giữ nguyên.
- `adlc ticket store status --json`: directory store, 0 tickets, không có pending transaction; `adlc ticket list --json`: `[]`.
- `adlc preflight --json`: FAIL tại branch; sandbox từ chối tạo `.git/refs/heads/preflight-test-branch.lock`; bash, git status và write trong `.adlc/tmp` pass. Không có bằng chứng ADLC gate pass.

- `pnpm harness:validate`: PASS (exit 0); cảnh báo Node v25.9.0 ngoài yêu cầu >=24 <25.
- `pnpm harness:full`: FAIL (exit 1), dừng tại `format:check`: Biome báo 115 lỗi format trên toàn worktree, gồm `.agent/skills/impeccable/`; các bước sau chưa chạy. Không sửa các file ngoài scope.
- `pnpm exec biome format --write` trên hai file mới: PASS; `node design/tests/verify.mjs` và `node design/tests/model.test.mjs`: PASS (53 checks và model assertions); đây là kiểm tra prototype, không phải usability evidence.
- Fresh checker độc lập: PASS cho lát cắt chuẩn bị tài liệu, không có finding vật chất; xác nhận không có ticket/rails được chấp nhận, preflight FAIL và T00/Phase 0 chưa được nghiệm thu.

## Handoff

Đề cương sẵn sàng để review, nhưng full gate và ADLC preflight chưa pass; Product/Design cần chỉ định người phụ trách, phê duyệt phương pháp và thực hiện nghiên cứu; Security/Legal cần quyết định điều kiện xử lý dữ liệu trước thu thập. Không có human acceptance.
