# Give agents a current-codebase execution queue

Status: active
Owner: Codex
ADLC ticket: none — authorized backlog planning, not product implementation

## Goal and stop condition

Provide one explicit ordered task queue, current-code evidence, the first bounded engineering task, and selection/stop rules so the next agent can act without guessing from task IDs. Stop after local validation, independent review and GitHub read-back.

## Scope, non-goals, and rails

- In scope: docs/backlog execution guide/JSON, navigation, one bounded baseline child issue, execution guidance on existing task issues and Project fields, roadmap #6.
- Not in scope: implementing queue tasks, replacing accepted financial policies, approving Phase 0/release, changing ADLC store/rails, closing parent tasks or setting blocked tasks Ready.
- Preserve existing 44 task objectives and hard dependencies. Preparation before Phase 0 means documents/gap inventory only, not MVP code. T30.1 is harness-only baseline maintenance independent of product readiness; parent T30 remains gated.

## Acceptance and verification

| Acceptance criterion                                                    | Verification command or observation                                                                                       |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Current code reuse/gaps proven                                          | Money/BusinessEvent, database schema, API composition/demo service, web adapter and research protocol reads; current HEAD |
| Every original Txx appears once with rank and next action               | Queue JSON validator: coverage/unique order, known dependency links and DAG                                               |
| First actionable task is bounded and approved only within backlog scope | Baseline child issue contract + explicit begin condition; no claim this turn executes it                                  |
| Agents know when to prepare, code, wait or switch lanes                 | Guide selection rules, approved dependencies and phase/crypto gates                                                       |
| Remote guidance matches local queue                                     | REST/GraphQL read-back; existing issue body retained after marked guidance block                                          |

## Impact map

Source HEAD 47f17cde5c16bff46637a450227210f46b1d2def. Existing Project 4 has 44 task/spec issues; original broad issues already superseded. Current harness:full exit 1 on format:check, 119 errors/1 warning; Node25.9.0 outside .nvmrc24. Existing Money/BusinessEvent/DB migrations/web shell must be reused. No runtime identity/authorization/crypto/posting application exists.

## Steps

- [x] Re-read source and live issues/Project; run current baseline.
- [ ] Write queue and baseline child spec; independent review.
- [ ] Publish ordering/action fields and issue guidance.
- [ ] Verify remote/local consistency and handoff.

## Decisions

| Date       | Decision                                         | Evidence / consequence                                                                                      |
| ---------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| 2026-11-07 | Baseline child before product tasks              | Current full gate fails before lint/types/tests/build; harness-only maintenance does not grant P1 readiness |
| 2026-11-07 | Explicit preparation lanes remain before Phase 0 | PRD draft + no research/financial/security acceptance evidence                                              |

## Progress and observations

Current repo clean at inspection. Connected GitHub used for issue reads; Projects V2 requires authenticated CLI fallback.

## Handoff

Pending publication and verification.
