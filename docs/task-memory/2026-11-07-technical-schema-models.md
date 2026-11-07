# Technical schema models — 2026-11-07

Status: artifacts delivered; independent documentation review PASS; repository full gate blocked.
Authoritative task: yêu cầu trực tiếp của user tạo schema models domain/application/infrastructure
bằng `.puml` vào `technical-docs`.
Plan: [execution plan](../exec-plans/active/2026-11-07-technical-schema-models.md).
Deliverable: [technical-docs index](../../technical-docs/README.md).

## Scope and outcome

Tạo 11 sơ đồ PlantUML độc lập và README: context map, năm nhóm domain diagrams cho
12 bounded contexts, application handlers/ports và atomic payment sequence,
infrastructure adapters/durable records, database hiện tại và current code model.
Target được gắn nhãn đề xuất; hiện trạng được đối chiếu trực tiếp với source/migrations.
README ghi coverage, ownership proposals, policy còn mở và lệnh render.

Chỉ tạo tài liệu trong `technical-docs`, execution plan và handoff này. Không sửa
code, migrations, classifications, financial formulas hoặc dữ liệu. Không thay đổi
các chỉnh sửa có sẵn của user/task khác trong worktree.

## Verification evidence

- `pnpm harness:validate`: exit 0, 8 graph nodes, 3 skills, 7 knowledge artifacts.
- PlantUML 1.2025.10 (JAR tải từ Maven Central vào `/private/tmp/zenval-plantuml.jar`),
  Java 21: `-checkonly` trên toàn bộ 11 `.puml`: exit 0 sau sửa cú pháp declaration/label.
- Cùng renderer `-failfast2 -tsvg -o /private/tmp/zenval-models`: exit 0,
  11 SVG parse được bằng XML parser, không có syntax-error marker.
- Context map và current DB schema render PNG, quan sát trực tiếp. Context map đổi
  routing sang polyline/spacing để giảm chồng label; không thay nội dung dependencies.
- Reviewer độc lập `/root/review_models` (read-only `adlc-reviewer`) trả **PASS**
  cho scope tài liệu. Reviewer tự chạy `-syntax` qua stdin: 11/11 exit 0;
  kiểm tra coverage, target/current accuracy, tenant/money/lineage, inward dependencies,
  atomic payment và draft-only suggestions; không có material finding.
- `pnpm harness:full`: exit 1 ở `format:check`; lần cuối 116 errors, 2 warnings
  trên worktree rộng, có các file có sẵn trong `.agent/skills/impeccable/`.
  Lint/typecheck/test/build phía sau không chạy. Không sửa skill files ngoài scope.
  Log tạm: `/private/tmp/zenval-schema-harness-full.log`.
- Host Node v25.9.0 khác yêu cầu repo `>=24 <25`; pnpm phát engine warning.
- Markdown của task được format/check riêng; README local links được kiểm tra.

## Financial meaning and acceptance

Không có thay đổi phương trình kế toán trước/sau: transfer/principal vẫn là
balance-sheet movements; interest/fees theo policy; suggestions chỉ là draft.
Không chạy golden behavior tests vì không thay code/công thức. Sơ đồ không chốt
STS horizon, rounding/FX, allocation/accrual, cost basis hoặc provider license.
Không có release/external write/destructive migration hay financial-meaning change
cần phê duyệt trong task tài liệu này. Human acceptance chưa được ghi nhận.

## Next safe action

Mở README và `.puml` để sử dụng/review. Có thể render SVG bằng lệnh trong README.
Nếu cần repository-wide acceptance, xử lý formatting có sẵn trong task riêng, dùng
Node 24 rồi chạy lại full gate. Không coi scoped documentation PASS là full gate PASS.
