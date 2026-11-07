# Cập nhật product features và tasks từ PRD, technical docs và UI

Status: active — documentation updated; scoped review PASS; full repository gate blocked
Owner: Codex
ADLC ticket: none; documentation reconciliation requested by user

## Goal and stop condition

Cập nhật Features và spec-kit tasks/truy vết theo worktree ngày 07/11/2026; phân biệt requirement, proposed model, UI/demo và production. Dừng khi tài liệu nhất quán, có gate/review evidence và handoff trung thực.

## Scope, non-goals, and rails

- In scope: docs/FEATURES.md, docs/spec-kit/{README,spec,tasks,traceability}.md, plan và handoff.
- Not in scope: code, financial policy/formula, FR/phase/priority changes, release, external tracker writes.
- Preserve existing worktree changes. Không đánh dấu task production hoàn tất vì có prototype/model.

## Acceptance and verification

| Acceptance criterion                         | Verification command or observation                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| Sources và current/proposed/demo tách rõ     | Compare technical README, encryption contract, design README, web API adapter |
| Missing work có task/dependencies/acceptance | T32–T34, Features §8 và traceability                                          |
| Giữ FR/phase/priority và existing task IDs   | Diff review; all original FR checklist/task entries retained                  |
| Links/format/gates có evidence               | Focused link check, harness:validate, harness:full, independent review        |

## Impact map

PRD/Architecture requirements; technical-docs target/current diagrams + encryption contract; design prototype; apps/web README + lib/api/types.ts/http-api.ts. Changes are documentation only.

## Steps

- [x] Đối chiếu sources và code boundary.
- [x] Cập nhật features, tasks, spec và traceability.
- [x] Run verification và independent review; full-gate limitation recorded.
- [x] Record handoff và gate limitations.

## Decisions

| Date       | Decision                                                         | Evidence / consequence                                                           |
| ---------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 2026-11-07 | Reuse existing backlog; no new FR                                | docs/FEATURES.md and docs/spec-kit/tasks.md already authoritative Markdown lists |
| 2026-11-07 | Add T32–T34 cross-cutting tasks; no production completion claims | technical encryption contract and web HTTP/mock adapter                          |

## Progress and observations

Documentation updated. Scoped format/link/ID checks and harness validation passed. Independent review PASS after monetization repair. harness:full stopped at out-of-scope formatting errors; see handoff.

## Handoff

[Task memory](../../task-memory/2026-11-07-product-backlog-refresh.md).
