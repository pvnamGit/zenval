# Repair design review findings

Status: complete
Owner: Codex implementer
ADLC ticket: none

## Goal and stop condition

Repair the material defects recorded in `docs/reviews/2026-11-02-design-review.md` so the standalone
`design/` prototype supports internally consistent, testable capture journeys for transactions,
investments, and obligations without misstating financial effects. Stop when the focused behavior
tests and repository full gate pass and an independent checker returns PASS, REVISE, or ESCALATE.

## Scope, non-goals, and rails

- In scope: F-01 through F-06; fixture reconciliation; separate income/expense categories; exact
  investment unit-price/total preview; receivable ERV; due-date/reminder settings; distinct Settings
  content; clear prototype feedback; deterministic behavior tests.
- In scope when bounded: ADD-05/06 notification configuration surfaces and clear coverage/status for
  market-source fixtures.
- Not in scope: backend persistence, real authentication/OAuth, real provider API calls, notification
  delivery, deployment, or modifying `apps/web`.
- Frozen rails: exact integer/decimal demo calculations; transfers and principal remain non-P&L;
  investment activity never invents provider data; valuation remains separate from cost basis;
  derived totals reconcile to their displayed inputs; preserve all unrelated user changes.
- Human approval: required before release or any later change to production financial meaning.

## Acceptance and verification

| Acceptance criterion                                                                                               | Verification command or observation                                      |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Buy/sell/dividend/valuation produce distinct effects and never create the same holding behavior                    | `node design/tests/model.test.mjs`; rendered contract checks             |
| Unit-price and gross-total modes round deterministically without binary float                                      | model golden tests for exact division, residual, zero, and invalid input |
| Receivable ERV equals principal × probability and is bounded to 0–100%                                             | model golden tests and rendered flow                                     |
| Account/net-worth and P&L/bridge fixtures reconcile                                                                | model assertions over shared fixture totals                              |
| Quick-add creates an in-session row with type-specific categories; switching form type preserves compatible values | model/render behavior checks                                             |
| Save feedback states that data is an in-session prototype and affected totals update or remain explicitly static   | source/render checks                                                     |
| Debt reminders and daily 21:00 reminder have configurable UI states                                                | rendered contract checks                                                 |
| Categories and Sources settings render distinct content                                                            | rendered contract checks                                                 |
| Existing financial and accessibility rails remain intact                                                           | `node design/tests/verify.mjs`; `node design/tests/model.test.mjs`       |
| Repository quality gates pass                                                                                      | `pnpm harness:validate`; `pnpm harness:full`                             |
| Fresh independent checker reviews the scoped diff                                                                  | checker verdict recorded in Handoff                                      |

## Impact map

- `design/model.mjs`: exact parsing/formatting and derived demo contracts.
- `design/app.js`: prototype state, forms, handlers, screens, and reconciled fixture display.
- `design/styles.css`: validation, reminder, and compact form states.
- `design/tests/model.test.mjs`: financial and state-transition golden cases.
- `design/tests/verify.mjs`: rendered contract coverage.
- `design/README.md`: honest supported-journey and prototype-limit documentation.
- `docs/PRD.md` §§6.2–6.10 and §20.2: financial behavior and notification source.
- `docs/FEATURES.md` §8: ADD-02 through ADD-06 acceptance intent.

## Steps

- [x] Read the accepted review, PRD rules, architecture boundaries, current prototype, and tests.
- [x] Add exact reusable model helpers and shared reconciled fixtures with golden tests.
- [x] Repair transaction, investment, and obligation forms and state transitions.
- [x] Repair display reconciliation, Settings content, and notification configuration surfaces.
- [x] Run focused checks, repair bounded findings, and update durable documentation.
- [x] Run full gates and obtain an independent verdict.

## Decisions

| Date       | Decision                                                                            | Evidence / consequence                                                                                                                       |
| ---------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-02 | Keep this repair in the standalone `design/` source of truth.                       | The review targeted `design/`; backend and `apps/web` are outside the authorized repair scope.                                               |
| 2026-11-02 | Use integer VND and scaled integer quantities in demo calculations.                 | Avoids binary floating point and preserves the user's entered gross amount when unit price has a remainder.                                  |
| 2026-11-02 | Represent unsupported real side effects as explicit prototype drafts/configuration. | Google OAuth, provider APIs, and notification delivery require backend/external integration and cannot be truthfully simulated as completed. |

## Progress and observations

- 2026-11-02: No active ADLC ticket exists; `.adlc/tickets` contains only its store file.
- 2026-11-02: Baseline `node design/tests/verify.mjs` passed 30 checks and
  `node design/tests/model.test.mjs` passed 44 assertions, but neither exercised the defective save
  handlers or cross-screen reconciliations identified in the review.
- 2026-11-02: Repaired exact amount parsing, investment calculations and valuation snapshots,
  transaction date filtering and lineage, commitment P&L/priority semantics, ERV, reminders,
  Settings separation, form preservation, and output escaping.
- 2026-11-02: Extracted the previously defective transitions into shared pure functions. Golden
  tests now execute past-date exclusion, dynamic totals/freshness, flexible commitment priority,
  repeated valuation upsert, unchanged cost basis, strict parsing, and escaped rendering.
- 2026-11-02: `node design/tests/model.test.mjs` passed; `node design/tests/verify.mjs` passed all 42
  checks; final `pnpm harness:full` passed format, lint/architecture, types, tests, and builds.
- 2026-11-02: Independent checker returned PASS after bounded repair loops; no material finding
  remains. Local HTTP preview returned 200, but interactive browser tooling was unavailable.

## Handoff

The scoped standalone prototype repair is complete. Real Google OAuth, market-provider adapters,
durable persistence, and notification delivery remain explicitly outside this prototype slice and
require separate backend implementation. Final checker verdict: PASS.
