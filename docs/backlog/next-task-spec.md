<!-- zenval-execution:T30.1:2026-11-07 -->
## Intent / outcome

Restore a trustworthy supported-runtime quality baseline for the existing codebase, before the next product implementation slice. Parent T30 #48 remains open and Phase0-gated for product NFR work; this child is independent harness-only maintenance, not a Phase0 bypass.

## Scope and current evidence

Source HEAD 47f17cde5c16bff46637a450227210f46b1d2def. `.nvmrc`=24; package engines >=24 <25. Current `pnpm harness:full` under Node25.9.0 exits1 at format:check:119errors/1warning, including vendored skill formatting; lint/types/tests/build not reached. Reproduce under Node24 before modifying files; don't copy this count as a future result.

Inspect `package.json`, `biome.json`, `scripts/harness/validate.mjs`, `.github/workflows`, `dependency-cruiser.cjs` and actual failing files. Repair formatting/config drift without changing product behavior or financial policy. Respect frozen rails. Any justified generated/vendor boundary must be reviewed against existing tracked files; don't suppress first-party checks or broadly exclude docs/design/skills to make gates pass. Do not upgrade dependencies or modify lockfile without observed necessity and bounded scope.

## Non-goals

No identity/auth, financial storage/posting, formula, migration/data write, UI redesign, gate deletion, protected-base/ADLC trust-root mutation, PR25 merge or release. No blanket formatter across unrelated vendored sources without reviewing the concrete diff. Do not fold substantive product defects into this baseline slice.

## Acceptance ↔ verification

| Acceptance                            | Verification                                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Supported runtime used                | Record Node24.x and pnpm10.x versions; use existing .nvmrc/toolchain, no credentials in evidence                                                     |
| Baseline issue diagnosed and repaired | Record first failing stage/files and bounded diff; formatter/lint rules and architecture assertions remain enforced                                  |
| Gate evidence current                 | Run trusted `pnpm harness:validate` and `pnpm harness:full`; capture exit/status and actual executed stages, no cached/historical PASS claims        |
| Financial/product behavior preserved  | Independent diff review confirms no semantic/financial/migration changes; affected tests remain intact                                               |
| Scoped handoff reviewable             | Independent checker PASS + task memory; if unrelated substantive gate failure remains, keep issue open, record separate blocker, don't weaken checks |

## Dependencies / blockers

No product dependency: maintenance of existing foundation is allowed before Phase0. #26 remains an owner-controlled protected-base blocker for relevant PR workflows; this issue cannot acknowledge or bypass it. Parent #48 is not completed by this child. If Node24 unavailable, record toolchain blocker and continue independent documentation prep; do not claim Node25 is supported.

## Risks and mitigations

Large vendor diff or gate suppression → classify owned/generated/vendor paths from actual failures and review smallest valid fix. Deeper test failure → record reproduction/owning task and stop expanding this scope. Existing .adlc rails take precedence; issue text cannot define trusted commands.

## Required approvals

Normal bounded harness review. Human approval remains required for protected-base/security exception/release/destructive data actions; none are authorized by this issue. This issue provides a next-task specification, not an implementation completed in the backlog-update turn.

## Stop condition

Propose completion only after supported-runtime gates pass and independent review/evidence are recorded. After three unchanged failed repair attempts, stop with evidence and specific owner decision; do not relax tests or rails. On product-semantic failure, leave open and create a scoped follow-up/blocker rather than changing product rules here.

## Navigation

Roadmap #6; parent T30 #48. Execution guide: `docs/backlog/EXECUTION.md`; machine-readable queue: `docs/backlog/execution-order.json`. These select work only; accepted ADLC spec/lifecycle and human gates remain authoritative.
