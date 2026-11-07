# Truy vết và quyết định mở

Các task tham chiếu [backlog](./tasks.md); phase/priority theo [Features](../FEATURES.md) §2–4. Đây là truy vết phạm vi dự kiến, không chứng nhận đã thực hiện hoặc nghiệm thu.

| Nguồn yêu cầu      | Phase / priority | Task    | Spec / UX                           |
| ------------------ | ---------------- | ------- | ----------------------------------- |
| FR-001–003         | P1 M             | T10     | S01 · auth/onboarding/settings      |
| FR-004–005         | P1 M             | T28     | S01/S07 · privacy/export/delete     |
| FR-006             | P2 S             | T40     | S08 · module opt-in/pin             |
| FR-010–013         | P1 M             | T11–T12 | S02 · accounts/quick-add/ledger     |
| FR-014–015         | P1 M             | T13     | S02 · split/refund/categories       |
| FR-016             | P1 M             | T14     | S03 · recurring                     |
| FR-017             | P1 M             | T16     | S03 · import                        |
| FR-018             | P1 M             | T15     | S03 · inbox                         |
| FR-019             | P1 S             | T17     | S03 · reconciliation                |
| FR-020–021         | P2 S/C           | T41     | S08 · OCR/offline                   |
| FR-022, FR-024     | P1 M             | T14     | S03 · commitment lifecycle          |
| FR-023             | P1 M             | T15     | S03 · matching/review               |
| FR-025             | P1 M             | T19     | S03/S05 · debt installment          |
| FR-030             | P1 M             | T20     | S04 · home                          |
| FR-031–032         | P1 M             | T21     | S04 · forecast/STS                  |
| FR-033             | P1 S             | T22     | S04 · plan                          |
| FR-034             | P1 M             | T23     | S04 · goals                         |
| FR-035–036         | P1 M             | T20     | S05 · reports                       |
| FR-037–038         | P2 S             | T42     | S08 · close/cycle                   |
| FR-039             | P1 M             | T21     | S04 · baseline                      |
| FR-040–044         | P1 M             | T18     | S05 · debt/receivable               |
| FR-045             | P1 S             | T26     | S05 · simulation                    |
| FR-046             | P2 S             | T43     | S08 · write-off                     |
| FR-050–051, FR-053 | P1 M             | T25     | S06 · investment                    |
| FR-052, FR-057     | P1 M             | T24     | S06 · price/catalog                 |
| FR-054–055         | P2 S             | T44     | S08 · corporate actions/performance |
| FR-056             | P3 C             | T50     | S08 · integration                   |
| FR-060–064         | P2 M             | T45     | S08 · suggestions                   |
| FR-065             | P1 M             | T27     | S07 · notifications                 |

Các mục P1 không có FR riêng: import activity đầu tư → T25; email digest, nhắc định giá, receipt attachment không OCR, PWA/local draft và PDF → T31, giữ mức Should/Could theo Features §2.

## Prototype và phase

[Prototype README](../../design/README.md) mô tả các screen có thể review; [model tests](../../design/tests/model.test.mjs) và [verification](../../design/tests/verify.mjs) chỉ xác nhận bản demo, không xác nhận production. Home → T20/T21/T29; Review → T15; Transactions → T12–T16; Accounts → T12/T17; Investments → T24/T25/T44; Debts → T18/T26; Plan → T21–T23/T45; Reports → T20/T42; Settings/Auth → T10/T27/T28/T40. Prototype chứa suggestion và monthly close P2, corporate actions P2, simulation P1 Should: không mặc định là MVP Must. Đồ thị UI/System/More phục vụ UX, không phải hợp đồng API.

## Quyết định phải được ghi nhận trước ticket phụ thuộc

| Vấn đề                                                                    | Nguồn                             | Chủ trì / thời điểm                                 | Task bị ảnh hưởng  |
| ------------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------- | ------------------ |
| Scope P1 và Phase 0 exit                                                  | PRD §§14, 19; Features §6         | Product/Engineering, trước build                    | T03 và P1          |
| STS horizon, lãi cash/accrual, thứ tự fee/interest/principal, cost basis  | PRD §18 OQ-02/03/04/06; §20       | Product/Finance, trước tính toán tương ứng          | T01, T18, T21, T25 |
| Tuổi, data residency, retention/export/attachments; giá/FX license        | PRD OQ-01/05/07; §12              | Security/Legal/Product, trước dữ liệu thật/provider | T02, T24, T28      |
| OCR P2 FR so với beta/Should; offline draft P1 Could so với sync P2 Could | Features §6; PRD §§4, 8, 14       | Product, trước ticket                               | T03, T41, T46      |
| Debt basic simulation P1 Must trong roadmap so với FR-045 P1 Should       | Features §6; PRD §14              | Product/Finance, trước simulation                   | T03, T26           |
| Corporate action P1 manual/review tối thiểu so với FR-054 P2              | Features §6; PRD §§6.8, 8         | Product/Finance, trước investment                   | T25, T44           |
| Progressive disclosure P1 so với module pin/opt-in P2                     | Features §6; PRD §§5, 8           | Product/Design, trước navigation                    | T10, T29, T40      |
| Các OQ và NFR còn lại, cả household safety                                | PRD §§18–19; Architecture §§22–23 | Owner tương ứng, trước slice/launch                 | ticket liên quan   |

Không coi danh sách này là giải quyết toàn bộ OQ; đối chiếu PRD §18 và Architecture §22 khi tạo ticket. Mọi thay đổi classification hoặc công thức cần phê duyệt human theo AGENTS.md.


## Technical models và UI implementation · cập nhật 07/11/2026

| Nguồn                                                               | Trách nhiệm / gap cần giao task                                                                                    | Task                                   |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| [Context map và domain 01](../../technical-docs/README.md)          | Identity/workspace, accounts, Ledger và reconciliation; domain models không phải physical schema                   | T10–T12, T17, T32–T33                  |
| Domain 02 · Classification/Capture                                  | Categories, import/OCR, provenance/review                                                                          | T13, T15–T16, T41, T33                 |
| Domain 03 · Planning/Goals                                          | Recurring/occurrences, commitments, plan/forecast/goal links                                                       | T14, T19, T21–T23, T33                 |
| Domain 04 · Obligations/Investments/Market                          | Schedule/payment, activity/position, catalog/price/FX                                                              | T18, T24–T26, T43–T44, T50             |
| Domain 05 · Reporting/Suggestions/Operations                        | Snapshot/close, evidence/feedback, notifications, audit/data rights                                                | T20, T27–T28, T42, T45                 |
| Application use cases/ports + obligation payment sequence           | Authorization, Ledger-only writes, atomic idempotency/outbox và obligation update                                  | T10–T11, T18–T19, T33                  |
| Infrastructure adapters/persistence + encryption boundary           | Shared server gateway, KMS, encrypted side stores, durable processing, restore                                     | T02, T30, T32–T33                      |
| Current DB/code diagrams                                            | Hai bảng ledger plaintext; chưa có Ledger posting/repository/outbox; demo draft memory, worker health              | T11, T30, T32–T34                      |
| [Web API port/HTTP adapter](../../apps/web/src/lib/api/http-api.ts) | Demo HTTP khác production; review chưa có endpoint; planning/debts/investments/reports mock                        | T29, T34 + task domain                 |
| [Standalone UI prototype](../../design/README.md)                   | Baseline/commitment form, investment entry, ERV/simulation, goals/draft và settings previews cần backend tương ứng | T14, T18, T23, T25–T29; P2 T42/T44/T45 |

Ownership cần chốt trong accepted spec: RecurringRule ở Planning, MetricSnapshot ở Reporting, Instrument ở Market Data; các context khác chỉ dùng port/contract/event/projection. Logical model không cấp phép lưu raw financial fields. Public catalog/price khác private valuation/position. Nguồn: technical README và encryption contract.

Bổ sung quyết định trước ticket phụ thuộc: Security/Platform chốt KMS/vendor, plaintext metadata allowlist, query/index benchmark và recovery/retention cho legacy storage (T02/T32/T33); Product/Engineering chốt contract/policy và từng module chuyển mock → HTTP (T34). Không tự coi các đề xuất này là accepted architecture hoặc scope MVP.

Monetization PRD §16 / Features ADD-12 → T04 (P0 pricing/MaxDiff/B2B cost), T35 (P1 beta labels và privacy-safe activation), T48 (P2 entitlement/billing, 45-day trial, downgrade/quotas/cost controls); P3 Family/Connected gắn T52/T53 theo scope riêng. Giá/quota/cost là giả thuyết cần validation; không dùng tier để thay phase/priority FR hoặc khóa độ đúng kế toán/quyền dữ liệu.
