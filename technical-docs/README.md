# Zenval technical schema models

Bộ sơ đồ PlantUML cho domain entities, application và infrastructure. Nguồn được
đối chiếu ngày **07/11/2026** trên worktree hiện tại, bao gồm các thay đổi chưa commit.

Yêu cầu bảo mật bổ sung: **mọi nội dung tài chính riêng của user phải mã hóa trước
persistence**, qua một infrastructure crypto boundary chung. Xem
[encryption contract](financial-data-encryption.md) và
[boundary diagram](infrastructure/04-financial-encryption-boundary.puml).
Các thuộc tính domain là giá trị trong memory, không phải raw columns được phép lưu.
Schema hiện tại còn plaintext; tài liệu này chưa triển khai mã hóa.

## Đọc từ đâu

| File                                                                                               | Nội dung                                                                        | Trạng thái   |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------ |
| [00-context-map.puml](00-context-map.puml)                                                         | 12 bounded contexts và hướng tiêu thụ contract                                  | Đề xuất đích |
| [domain/01-identity-ledger.puml](domain/01-identity-ledger.puml)                                   | Identity, workspace, money, accounts, ledger và reconciliation                  | Đề xuất đích |
| [domain/02-classification-capture.puml](domain/02-classification-capture.puml)                     | Categories/tags, import, OCR, provenance và review                              | Đề xuất đích |
| [domain/03-planning-goals.puml](domain/03-planning-goals.puml)                                     | Recurring, commitments, occurrences, plans, forecast và goals                   | Đề xuất đích |
| [domain/04-obligations-investments-market.puml](domain/04-obligations-investments-market.puml)     | Nợ/phải thu, đầu tư, instrument catalog, giá và FX                              | Đề xuất đích |
| [domain/05-reporting-suggestions-operations.puml](domain/05-reporting-suggestions-operations.puml) | Reports, close, suggestions, notifications và audit/data rights                 | Đề xuất đích |
| [application/01-use-cases-ports.puml](application/01-use-cases-ports.puml)                         | Commands/queries, handlers, repository và integration ports                     | Đề xuất đích |
| [application/02-obligation-payment-sequence.puml](application/02-obligation-payment-sequence.puml) | Authorization, idempotency, ledger, obligation và outbox trong cùng transaction | Đề xuất đích |
| [infrastructure/01-adapters-persistence.puml](infrastructure/01-adapters-persistence.puml)         | Adapters, durable jobs, outbox/inbox, projections và tenant boundaries          | Đề xuất đích |
| [infrastructure/02-current-database-schema.puml](infrastructure/02-current-database-schema.puml)   | Đúng hai bảng ledger trong schema/migrations hiện có                            | Hiện trạng   |
| [infrastructure/03-current-code-model.puml](infrastructure/03-current-code-model.puml)             | BusinessEvent/Money, API demo, DB connection và worker health                   | Hiện trạng   |

Sơ đồ bổ sung [04-financial-encryption-boundary.puml](infrastructure/04-financial-encryption-boundary.puml)
mô tả gateway duy nhất, encrypted envelope, KMS và authorized output.

## Quy ước

- `PROPOSED TARGET`: phân rã thiết kế từ PRD/Architecture; tên handler/field/type được
  đề xuất để làm rõ trách nhiệm. Không có nghĩa các classes, tables hay API đã được
  triển khai hoặc scope MVP đã được duyệt. Bộ mô hình bao phủ nhiều phase.
- `IMPLEMENTED`: tóm tắt các kiểu và dependencies có trong source hiện tại; sơ đồ
  database thể hiện các columns/constraints thực tế. Không suy diễn domain từ UI demo.
- `aggregate`, `entity`, `value object`, `projection`, `port` là vai trò thiết kế.
  Composition chỉ mô tả ownership logic, không mặc định cascade delete hay ORM relation.
- Trong class diagrams, mũi tên liên context biểu diễn ID/contract/query/event;
  không cho phép import nội bộ hoặc query bảng của context khác từ domain.
- Domain diagrams liệt kê các field quan trọng, không phải DDL hoàn chỉnh. `id`,
  `workspaceId`, audit timestamps và optimistic `version` phải được bổ sung phù hợp
  cho từng persistent business entity; facts dùng immutable `recordedAt`.
- `Money`, `DecimalString`, `Percentage`, quantity và rate dùng số thập phân chính xác;
  không sử dụng binary floating point cho tiền. `Instant` tương ứng UTC/timestamptz;
  due date dùng `LocalDate` và timezone/policy rõ ràng.
- `SourceRef` là stable typed reference gồm context, entity ID, workspace khi áp dụng
  và version/cutoff; không phải ORM object. Derived snapshots giữ source IDs, as-of,
  freshness/assumptions khi áp dụng và calculation version để giải thích/rebuild.
- `ActorContext` phải đến từ authentication/authorization đáng tin cậy. Workspace ID
  trong request không đủ chứng minh quyền. Queries cũng kiểm tra quyền và tenant.

## Coverage và ownership

| Context trong Architecture §5 | Domain diagram | Application responsibilities                         |
| ----------------------------- | -------------- | ---------------------------------------------------- |
| Identity & Access             | 01             | Setup workspace, preferences, consent, authorization |
| Ledger                        | 01             | Post event/transfer, reconcile, facts queries        |
| Classification & Capture      | 02             | Preview/commit import, approve review                |
| Commitments & Planning        | 03             | Match occurrence, forecast, plan draft               |
| Goals                         | 03             | Link eligible assets, allocation checks, projection  |
| Obligations                   | 04             | Schedule, payment allocation/posting, simulation     |
| Investments                   | 04             | Activity/cost basis, holdings, cash-leg posting      |
| Market Data                   | 04             | Resolve instrument, provider/manual price và FX      |
| Reporting                     | 05             | Reports, metric snapshots, versioned period close    |
| Suggestions                   | 05             | Eligibility/evidence, feedback, apply to draft       |
| Notifications                 | 05             | Preferences, delivery và bounded retry               |
| Audit & Compliance            | 05             | Audit events, export/delete orchestration            |

Một số ownership cần chốt trước implementation: `RecurringRule` được đặt ở Planning
(Capture chỉ phát hiện/đề xuất); `MetricSnapshot` ở Reporting cung cấp read contract
cho Suggestions; `Instrument` ở Market Data, activity/position ở Investments.
`InvestmentActivity` thống nhất tên `Activity` trong PRD và `InstrumentActivity`
trong Architecture. `NotificationPreference` phân biệt với profile `Preference`.
`CalculationRun` là lineage logic theo context, không phải aggregate chung cho mọi nơi ghi.

Public instrument/provider catalog và public price/FX có thể là reference data dùng
chung; manual/private valuation và toàn bộ financial records của user phải gắn
workspace. Đây là đề xuất phân tách scope, chưa phải tenancy policy đã triển khai.

## Các ràng buộc giữ nguyên

Chỉ Ledger application ghi posted facts. Transfer và principal là balance-sheet
movements; interest/fee/tax được tách và phân loại theo approved policy. Obligation
update, Ledger posting, idempotency result và outbox cùng transaction; consumer
inbox và effects cũng phải atomic. Expected/pending/draft không làm thay đổi posted
balance. Match occurrence và portfolio cash links không được double-count.
Suggestions/simulations/goal allocations chỉ tạo hoặc sửa plan draft sau xác nhận,
không thực thi chuyển tiền, trả nợ hay giao dịch đầu tư.

Bộ sơ đồ không chốt STS horizon/formula, rounding/multi-currency balancing, payment
allocation order, accrual, cost-basis method, provider/license, queue vendor hoặc
physical schema cho các context mới. Các quyết định này cần accepted spec riêng.
DB hiện lưu raw `numeric(38,12)`, chưa compliant với yêu cầu mã hóa; đề xuất precision khác trong Architecture §7.2 không
được coi là migration. Current `BusinessEvent` chỉ kiểm tra same-currency sum zero;
chưa có application posting/repository/outbox. API demo đọc synthetic JSON và giữ
captures dạng draft trong memory; worker hiện chỉ có health endpoint.

## Render và kiểm tra

Mỗi `.puml` độc lập, không có remote include hoặc macro C4. Dùng PlantUML với Java
và Graphviz. Ví dụ từ repository root, sau khi cài PlantUML:

```bash
plantuml -checkonly technical-docs/00-context-map.puml 'technical-docs/domain/*.puml' 'technical-docs/application/*.puml' 'technical-docs/infrastructure/*.puml'
plantuml -tsvg -o /tmp/zenval-models technical-docs/00-context-map.puml 'technical-docs/domain/*.puml' 'technical-docs/application/*.puml' 'technical-docs/infrastructure/*.puml'
```

Có thể thay `plantuml` bằng `java -Djava.awt.headless=true -jar /path/to/plantuml.jar`.
SVG render để xem, `.puml` là nguồn chỉnh sửa. Không gửi dữ liệu cá nhân lên renderer công cộng.

## Nguồn và verification

- [PRD](../docs/PRD.md) §§6, 10–12, 20: entities, quan hệ, financial invariants và lineage.
- [Architecture](../docs/ARCHITECTURE.md) §§5–10, 12, 15: ownership, layers, ports, persistence, jobs và authorization.
- [Ledger domain](../packages/contexts/ledger/src/domain/business-event.ts),
  [domain tests](../packages/contexts/ledger/src/domain/business-event.test.ts),
  [shared kernel](../packages/shared-kernel/src/index.ts).
- [Contracts](../packages/contracts/src/index.ts), [API composition](../apps/api/src/app.module.ts),
  [demo finance adapter](../apps/api/src/demo-finance.service.ts),
  [database service](../apps/api/src/database.service.ts),
  [worker composition](../apps/worker/src/worker.module.ts).
- [Database schema](../packages/database/src/schema.ts),
  [foundation SQL](../migrations/0001_ledger_foundation.sql),
  [tenant-integrity SQL](../migrations/0002_ledger_workspace_integrity.sql).
- [Execution plan](../docs/exec-plans/active/2026-11-07-technical-schema-models.md) và
  [handoff/evidence](../docs/task-memory/2026-11-07-technical-schema-models.md).
