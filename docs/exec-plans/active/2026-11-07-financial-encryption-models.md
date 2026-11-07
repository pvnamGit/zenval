# Encrypted financial persistence model

Status: documentation delivered; runtime migration pending; full gate blocked
Owner: Codex
ADLC ticket: none — direct requirement following schema models task

## Goal and stop condition

Document mandatory no-raw-financial-data persistence and one infrastructure crypto
boundary in technical-docs/PUML. Stop after source consistency, syntax, scoped review
and gate evidence. Runtime implementation/migration remains separate and open.

## Scope, non-goals, and rails

- Update target architecture, PRD security requirement and model notes/diagram.
- No runtime, schema/migration, key provisioning, data changes or financial formula changes.
- Preserve pre-existing worktree edits; actual diagrams remain truthful with compliance gap.
- No claim of encryption implemented or data protected by these documentation changes.

## Acceptance and verification

| Criterion                                                                           | Verification                           |
| ----------------------------------------------------------------------------------- | -------------------------------------- |
| Amount/type/category/assets/debt plus derived/side stores encrypted                 | storage matrix + independent review    |
| Single infrastructure gateway; trusted in-memory calculations and authorized output | boundary PUML + independent review     |
| Key separation/AAD/fail-closed/query/migration limitations explicit                 | contract review                        |
| Existing vs target clearly distinguished                                            | source/schema cross-check              |
| PUML renders, Markdown checks, gates recorded                                       | PlantUML, biome, harness validate/full |

## Impact map

`technical-docs` target/current models, `docs/ARCHITECTURE.md` §§7,15,
`docs/PRD.md` §9.1; current `packages/database/src/schema.ts` stores raw fields.
References: OWASP Cryptographic Storage and Cloud KMS envelope encryption.

## Steps

- [x] Inspect current source and security architecture.
- [x] Update contract and models.
- [x] Run deterministic checks and independent review; record scoped results and full-gate limitation.
- [x] Record handoff and implementation gap.

## Decisions

| Date       | Decision                                                             | Evidence / consequence                                                   |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 2026-11-07 | Encrypt before DB through one server infrastructure module           | DB-only at-rest encryption does not meet user requirement                |
| 2026-11-07 | Plaintext in trusted memory for calculation and authorized responses | Ledger/report rules still need exact values; not E2EE                    |
| 2026-11-07 | Documentation only within active schema-model scope                  | Actual storage migration requires separate tested delivery/recovery plan |

## Progress and observations

12 diagrams pass PlantUML check/render; scoped Markdown and local links pass; harness validate pass. Full gate stops at existing formatting debt. Independent reviewer findings repaired; actual encryption remains unimplemented.

## Handoff

See [handoff](../../task-memory/2026-11-07-financial-encryption-models.md). Runtime protection is not implemented; no migration/data mutation or human production acceptance recorded.
