# Minimal Home design

Status: active
Owner: Codex
ADLC ticket: none

## Goal and stop condition

Reduce cognitive load on the standalone `design/#home` view so a user can understand today's
spending and overall financial health at a glance. Stop when Home presents posted spending today as
the visual priority, explains financial health with safe-to-spend, cash-flow risk, and net-worth
evidence, moves detailed exploration behind clear links, and focused checks pass.

## Scope, non-goals, and rails

- In scope: `design/app.js`, `design/styles.css`, `design/README.md`, focused design checks.
- Not in scope: production `apps/web`, formulas, fixtures, ledger facts, financial classification,
  persistence, or navigation outside Home.
- Frozen rails: derived values retain state, freshness, and explanation access; transfers and debt
  principal remain non-P&L; forecasts remain visibly distinct from posted facts.

## Acceptance and verification

| Acceptance criterion                                                                  | Verification command or observation |
| ------------------------------------------------------------------------------------- | ----------------------------------- |
| Home prioritizes today's posted spending                                              | Source contract and local preview   |
| Financial health remains evidence-backed rather than an opaque score                  | Source contract and local preview   |
| Detailed daily activity, commitments, goals, and suggestions move behind module links | Source contract                     |
| Home has no secondary sub-navigation                                                  | `node design/tests/verify.mjs`      |
| Financial model invariants remain unchanged                                           | `node design/tests/model.test.mjs`  |

## Impact map

- `design/app.js`: Home render structure and bilingual copy.
- `design/styles.css`: Home hierarchy, compact supporting cards, responsive layout.
- `design/tests/verify.mjs`: structural contract for the minimal Home.
- `design/README.md`: review journey description.

## Steps

- [x] Specify minimal information hierarchy and frozen financial rails.
- [x] Inspect current Home render, styles, tests, and active prototype plans.
- [x] Implement the minimal Home vertical slice.
- [x] Run focused checks and repository verification.
- [x] Obtain an independent checker verdict.

## Decisions

| Date       | Decision                                                             | Evidence / consequence                                                             |
| ---------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 2026-11-03 | Make safe-to-spend the only hero metric.                             | It directly answers the daily decision in PRD JTBD and WFC.                        |
| 2026-11-03 | Keep only cash-flow risk and net-worth change as supporting signals. | These complete the PRD's three core Home signals without reproducing full reports. |
| 2026-11-03 | Collapse due items and review count into one attention card.         | Urgent work remains discoverable without a second dashboard.                       |
| 2026-11-03 | Shift the hero from safe-to-spend to today's posted spending.        | User feedback prioritizes daily spending awareness over a planning-first Home.     |
| 2026-11-03 | Use a qualitative health summary backed by three visible signals.    | Avoids false precision while preserving explainability and drill-down.             |

## Progress and observations

- The existing Home rendered up to eight cards plus a four-item sub-navigation in its default state.
- No formula or financial fixture change is required; this is a presentation-only reduction.
- Replaced the default dashboard with one safe-to-spend hero, two supporting signals, one attention
  list, and a quiet daily-movement footer. Detail CTAs deep-link to Forecast and Net-Worth Bridge.
- `node design/tests/verify.mjs` exited 0 with 52 checks; `node design/tests/model.test.mjs` exited 0.
- Local preview served `index.html` and `app.js` with HTTP 200 on `127.0.0.1:4173`.
- `pnpm harness:validate` and `pnpm harness:full` exited 0: format, lint/dependency rules, 12/12
  typecheck tasks, 12/12 test tasks, and 8/8 build tasks passed. Node 25.9.0 emitted the existing
  non-blocking engine warning because the repository requests Node >=24 <25.
- First independent review returned `REVISE`: incorrect Net Worth state, incomplete daily lineage
  disclosure, shallow detail links, and broken quick-add focus restoration. The repair now derives
  every visible state/freshness value from model data, deep-links to the owning subsection, restores
  focus to the Home invoker, and covers navigation/focus behavior with pure model tests.
- Second review found a stale hard-coded `12:15` after in-session entries; Home now renders the
  visible time from `todaySummary.asOf`. Final independent checker verdict: `PASS`.

## Handoff

Implementation and verification complete. Independent checker verdict: `PASS`. Human
Product/Design acceptance remains required before release.
