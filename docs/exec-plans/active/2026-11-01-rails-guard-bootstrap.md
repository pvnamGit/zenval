# Complete rails-guard protected-base bootstrap

Status: active
Owner: Codex + repository owner
ADLC ticket: GitHub issue #26

## Goal and stop condition

Establish a self-protected ADLC rails-guard workflow and record the approved one-time base
acknowledgement. Stop when the bootstrap diff is reviewed, local post-merge-shape checks pass, the
repository owner confirms branch/ruleset protection, and the ceremony commit lands on `main` so PR
#25 can pass rails-guard without a feature-PR bypass.

## Scope, non-goals, and rails

- In scope: dedicated rails-guard workflow, CODEOWNERS coverage, ADLC acknowledgement/attestation,
  removal of the duplicate unbootstrapped CI job, durable ceremony guidance, and verification.
- Not in scope: issue #3 implementation, product behavior, financial logic, migrations, signed ADLC
  runner mode, or weakening required checks.
- Frozen rails / human approvals: `.adlc/config.json`, CODEOWNERS, and the dedicated workflow are
  trust roots. The owner must configure/confirm protected-base settings before merge. This branch
  cannot self-authorize its expected pre-bootstrap rails-guard failure.

## Acceptance and verification

| Acceptance criterion                                                   | Verification command or observation                      |
| ---------------------------------------------------------------------- | -------------------------------------------------------- |
| Initializer and repository readiness pass                              | `adlc init --json`; `adlc preflight --json`              |
| Dedicated workflow is pinned and runs bootstrap plus rail-freeze gates | Diff review and fresh checker                            |
| Effective CODEOWNERS covers the deployed workflow                      | `adlc rails-guard-ci bootstrap --base HEAD` after commit |
| Post-merge configuration shape is valid                                | `adlc rails-guard-ci bootstrap --base HEAD`              |
| Harness remains valid                                                  | `pnpm harness:validate`                                  |
| Protected base is authoritative                                        | Owner confirms settings and merges the ceremony          |
| Blocked feature PR recovers                                            | Re-run PR #25 rails-guard after merge                    |

## Impact map

- `.adlc/config.json`: protected-base acknowledgement and trusted-owner attestation.
- `.github/CODEOWNERS`: ownership for immutable ADLC trust roots.
- `.github/workflows/adlc-rails-guard.yml`: dedicated pinned enforcement workflow.
- `.github/workflows/ci.yml`: quality-only workflow after removing the duplicate guard job.
- `docs/agent-harness/rails-guard-bootstrap.md`: durable limitation and ceremony procedure.

## Steps

- [x] Reproduce PR #25 failure and trace it to missing base acknowledgement.
- [x] Run idempotent ADLC init and preflight.
- [ ] Add the dedicated self-protected workflow and CODEOWNERS.
- [ ] Record the approved acknowledgement and conditional trusted-owner attestation.
- [ ] Run local deterministic gates and independent Codex review.
- [ ] Open a draft ceremony PR with explicit repository-setting preconditions.
- [ ] After owner confirmation/merge, verify origin/main and rerun PR #25.

## Decisions

| Date       | Decision                                                                            | Evidence / consequence                                                                     |
| ---------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 2026-11-01 | Use the upstream v1.12.0 rails-guard workflow contract with Node 24 and CLI 1.12.0. | Keeps enforcement aligned with the audited CLI version already pinned by Zenval.           |
| 2026-11-01 | Separate rails-guard from the quality workflow.                                     | The deployed immutable path matches the ADLC bootstrap contract and avoids duplicate jobs. |
| 2026-11-01 | Keep the bootstrap PR draft until repository protection is confirmed.               | `trustedCodeownersAttested` must be evidence-backed, not inferred from file presence.      |

## Progress and observations

- PR #25 quality passed; rails-guard failed before diff evaluation because `main` lacks
  `acknowledgedNewRailBypass: true`.
- GitHub MCP reported no repository rulesets. Classic branch protection could not be inspected with
  the connector's permission, so owner confirmation remains mandatory before merge.
- `adlc init --json` made no changes. `adlc preflight --json` passed after granting the sandbox the
  ability to create and delete its temporary probe branch.

## Handoff

Pending deterministic verification, independent review, and repository-owner protection evidence.
