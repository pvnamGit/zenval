# PostgreSQL-backed dashboard

Status: active — PostgreSQL connected; real-data dashboard remains pending
Owner: Engineering
ADLC ticket: none

## Goal and stop condition

Replace the synthetic dashboard with a dashboard backed by real workspace data through the API and PostgreSQL. Stop when its scope, isolation, accounting semantics, and relevant checks are satisfied, or when an unresolved decision prevents safe implementation.

## Scope, non-goals, and rails

- In scope: identify the smallest usable database-backed API and dashboard slice, preserve existing work, and verify against PostgreSQL.
- Not in scope: release or destructive data changes.
- Rails: every financial record is workspace-scoped; posted facts go through Ledger application services; calculations require provenance and must not represent missing data as zero. Human approval is required for financial meaning and other gates identified in the harness.
- User selected a multi-user application with login and workspace authorization; avoid exposing real records through an unauthenticated shared endpoint.

## Acceptance and verification

| Acceptance criterion                                                                       | Verification command or observation                         |
| ------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| PostgreSQL connection is configured without exposing credentials                           | Local connection check; no credentials in output            |
| Dashboard uses real authorized workspace data and handles empty/unavailable states         | API integration and browser journey                         |
| Financial figures are derived from correctly classified posted facts and retain provenance | Ledger golden cases and projection tests                    |
| Other users cannot read or modify another workspace                                        | Authorization integration tests                             |
| Required deterministic gates and independent review are recorded                           | `pnpm harness:validate`, `pnpm harness:full`, fresh checker |

## Impact map

- `apps/api/src/demo-dashboard.service.ts` and `demo-finance.service.ts`: synthetic fixture only; no persistent write.
- `apps/web/src/app/page.tsx` and `demo-api.ts`: demo contracts and fallback sample.
- `packages/database/src/schema.ts`, `migrations/0001_ledger_foundation.sql`: ledger foundation only; no account, workspace, identity, or reporting tables.
- `packages/contexts/ledger/src`: balanced event domain object only; no application posting layer.
- `docs/spec-kit/tasks.md`: T10 identity, T11 Ledger, T12 accounts, and T20 dashboard remain open with dependency and approval requirements.

## Steps

- [x] Inspect existing dashboard, database, ledger, and task dependencies.
- [x] Resolve user tenancy model.
- [x] Configure local database connection.
- [x] Add and verify a forward-only, repeatable migration runner before applying the existing ledger foundation.
- [ ] Define scoped behavior and required financial decisions before implementation.
- [ ] Implement and verify the authorized slice; obtain independent review.

## Decisions

| Date       | Decision                                                                      | Evidence / consequence                                                                |
| ---------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 2026-11-07 | Do not treat the demo fixture as real data or bypass workspace authorization. | Existing demo endpoints have no identity and ledger has no application posting layer. |
| 2026-11-07 | Build for multiple users with login and workspace authorization.              | User selected this model.                                                             |

## Progress and observations

- Existing worktree contains extensive pre-existing changes; preserve them.
- Default PostgreSQL URL connection attempt reached a server but returned authentication error `28000`; actual local credentials are needed through an environment file, not chat.
- The sandbox blocks localhost directly; an escalated read-only `SELECT 1` was used for the connection check.
- An escalated `docker ps` returned no running containers in the current Docker context. No `.env` or `.env.local` file was found. The API does not currently load an env file itself.
- `pnpm harness:validate` passed; the installed Node version is 25.9.0, outside the repository's supported range `>=24 <25`.
- The PostgreSQL container was found stopped; its log reports initialization failed because its password was not configured.
- Added API connection ownership and `GET /v1/health/ready`; focused API typecheck, 14 tests, build and scoped Biome checks passed. The readiness endpoint is not a real-data dashboard.
- `pnpm harness:full` failed during formatting, including pre-existing `.agent/skills/impeccable` files. Independent review returned `ESCALATE` pending a live PostgreSQL integration check; the initial service-test and malformed-URL findings were repaired.
- User switched to local PostgreSQL. The configured database connection succeeds; a read-only inspection found no application tables. API startup using root `.env`, HTTP readiness, and an opt-in PostgreSQL integration test passed. The local `.env` is ignored by Git; do not record its contents.
- A fresh checker returned PASS for the readiness slice, while keeping the full objective open because identity, workspace authorization, real financial data and full-gate evidence remain incomplete.
- User authorized continuing implementation. Start with migration infrastructure: preserve existing database content, use a transaction and checksum history, and refuse modified previously applied migrations.
- Applied migrations `0001` and `0002` to local PostgreSQL; repeat runs applied zero changes. Integration tests covered replay, modified checksum, failure rollback, advisory lock contention and cross-workspace foreign-key rejection. Fresh review passed each migration for local application.
- Replaced demo figures on the home overview with an unavailable state; other remaining demo views and capture identify their sample data. Web checker passed the scoped change; browser rendering was not checked because no browser was available.
- Better Auth synthetic in-memory signup/session spike succeeded in an isolated temporary directory. It is not integrated into the API and is not evidence of PostgreSQL auth, workspace authorization, recovery, or production security.
- `pnpm harness:full` still fails at the existing 113 format errors in `.agent/skills/impeccable`; focused database and web checks passed.

## Handoff

Work remains open. Resolve database configuration and required identity, security, accounting and scope decisions, then implement against the existing backlog; no acceptance has been recorded. See [handoff](../../task-memory/2026-11-07-postgresql-dashboard.md).
