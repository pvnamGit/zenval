# Financial encryption models — 2026-11-07

Status: documentation delivered; independent documentation review PASS; runtime implementation/migration not started.
Authoritative task: user requirement following schema models — no raw financial
amounts, direction, classification, transactions/assets/debt in DB and one
infrastructure crypto boundary.
Plan: [execution plan](../exec-plans/active/2026-11-07-financial-encryption-models.md).
Contract: [financial-data-encryption](../../technical-docs/financial-data-encryption.md).
Diagram: [boundary](../../technical-docs/infrastructure/04-financial-encryption-boundary.puml).

## Changes

- PRD NFR-SEC-09 records mandatory financial content encryption; Architecture §§7,
  15 removes raw numeric/query assumptions and requires common crypto gateway.
- Contract defines encrypted payload coverage for source/derived/side stores,
  metadata leakage limits, authorized in-memory calculations/output, KMS/key
  separation, AEAD/AAD, keyed fingerprints, failure/rotation/recovery and migration.
- New PUML shows application-owned ports, one infrastructure crypto implementation,
  KMS, encrypted envelope and response disclosure policy.
- Existing target diagrams explicitly describe in-memory values; adapters use
  encrypted payloads and generic routing. Current diagrams remain accurate and
  flag noncompliance of raw `amount`, `currency`, `event_type` in current schema.
- No product code, schema, migration, financial formula or data changed. Existing
  worktree changes from other tasks preserved. Unrelated PRD formatting preserved.

## Evidence

- PlantUML 1.2025.10 `-checkonly`: all 12 sources, exit 0.
- PlantUML `-failfast2 -tsvg`: exit 0; all 12 generated SVGs parse as XML;
  no syntax-error markers. Artifacts in `/private/tmp/zenval-encrypted-models`.
- README/contract local links resolve; scoped Markdown formatting passes for
  Architecture, README, contract and plan. PRD has pre-existing unrelated format
  debt; this task adds only the NFR bullet without reformatting other sections.
- `pnpm harness:validate`: exit 0, 8 graph nodes / 3 skills / 7 knowledge artifacts.
- `pnpm harness:full`: exit 1 at format:check, 115 errors and 2 warnings in broad
  worktree including existing `.agent/skills/impeccable` files; subsequent lint,
  typecheck, tests and build did not run through full gate. Log:
  `/private/tmp/zenval-encryption-harness-full.log`. Node v25.9.0 also emits engine
  warning against repository Node 24 requirement. Not a full-gate PASS.
- Independent read-only checker `/root/review_encryption_models` returned **PASS** for documentation and verified 12/12
  PlantUML syntax and reviewed source/target separation, auth, metadata, money,
  transaction and query constraints. Review findings repaired: mixed UML syntax,
  inward response-policy port, encrypted event time/type and keyed source uniqueness.

## Limits and next safe action

This is an architecture/model change only. No runtime encryption/KMS/gateway exists
as a result of this task; existing PostgreSQL foundation remains noncompliant.
Implementation requires a separately scoped vertical slice with executable leakage,
exact-decimal golden, cross-tenant, tamper, failure, atomicity, rotation/restore tests.
Legacy plaintext cleanup/destructive migration requires explicit human approval and
recovery plan. No financial meaning change or release performed; no human production
acceptance recorded. Do not enable real-user financial writes on the current storage.
