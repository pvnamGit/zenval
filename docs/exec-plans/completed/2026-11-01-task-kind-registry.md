# Add trusted ADLC task-kind routing

Status: completed
Owner: Codex
ADLC ticket: GitHub issue #3

## Goal and stop condition

Add a repository-owned task-kind registry and deterministic fail-closed validation. Stop when the
committed registry passes focused tests, `pnpm harness:validate`, and `pnpm harness:quick`, and an
independent Codex checker returns PASS with no unresolved material finding.

## Scope, non-goals, and rails

- In scope: registry, reusable validator, focused tests, harness documentation, gate wiring.
- Not in scope: GitHub issue dispatcher (#4), product behavior, financial calculations, migrations,
  deployment, or release automation.
- Frozen rails / human approvals: issue text cannot define commands; gate profiles are code-owned;
  retry counts are bounded to 1..3; financial, destructive migration, external-effect, release, and
  security-exception routes fail closed to their required project skill and/or human approval.

## Acceptance and verification

| Acceptance criterion                                                                      | Verification command or observation |
| ----------------------------------------------------------------------------------------- | ----------------------------------- |
| Committed registry is valid                                                               | `pnpm harness:validate`             |
| Unknown kinds, skills, gates, approvals, unsafe fields, and unbounded retries fail closed | `pnpm harness:test`                 |
| Financial routes require the financial skill                                              | Focused validator test              |
| Sensitive routes require human approval classes                                           | Focused validator test              |
| Repository quick gate remains green                                                       | `pnpm harness:quick`                |

## Impact map

- `docs/agent-harness/task-kinds.json`: repository-owned routing data.
- `scripts/harness/task-kinds.mjs`: pure deterministic validator and selection guard.
- `scripts/harness/task-kinds.test.mjs`: focused fail-closed test matrix.
- `scripts/harness/validate.mjs`: committed-registry validation and reference resolution.
- `docs/agent-harness/README.md`, `docs/agent-harness/github-issue-control-plane.md`, `AGENTS.md`:
  authority and operating guidance.
- `package.json`: focused harness-test gate wiring.

## Steps

- [x] Confirm merged issue contract and inspect current harness.
- [x] Add registry and deterministic validator.
- [x] Add focused fail-closed tests and gate wiring.
- [x] Update control-plane documentation.
- [x] Run deterministic gates and repair within three attempts per unchanged failure.
- [x] Obtain independent Codex checker verdict and record handoff.

## Decisions

| Date       | Decision                                                                               | Evidence / consequence                                                  |
| ---------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 2026-11-01 | Keep trusted gate profile definitions in validator code; registry references IDs only. | Prevents issue or registry data from becoming arbitrary shell commands. |
| 2026-11-01 | Implement issue #3 locally with Codex and close Copilot PR #24 unmerged.               | Project owner requires Codex-only full-cycle development.               |

## Progress and observations

- PR #5 is merged on `main` at `9fc9299`; issue #2 terminology is the accepted baseline.
- Copilot PR #24 was closed unmerged with zero changed files before local implementation began.
- Initial quick-gate format/lint failures were repaired in one bounded iteration.
- Fresh checker returned REVISE for non-canonical and contradictory write scopes. The validator now
  rejects empty/dot/dotdot segments and exact allow/deny conflicts, with a focused regression test.
- `pnpm harness:full` passed under supported Node v24.22.1 with `TURBO_FORCE=true`; Turbo reported 0
  cached typecheck, test, and build tasks. The focused suite passed 9/9 tests.
- Fresh checker re-reviewed the repair and returned PASS with no unresolved material finding.

## Handoff

Issue #3 is implemented on `codex/issue-3-task-kind-registry`. Deterministic gates pass and the
independent Codex checker verdict is PASS. Human review/merge remains the next safe action; issue #4
must not start until this registry baseline is accepted on `main`.
