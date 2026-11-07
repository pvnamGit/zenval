# Zenval agent map

This file is the table of contents for agents working in Zenval. Keep durable knowledge in the
linked repository files and keep this map short.

## Read before changing code

1. Read [`docs/PRD.md`](docs/PRD.md) for product intent, user promises, and non-goals.
2. Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for boundaries, ownership, and NFRs.
3. Read the relevant package and its tests. Do not infer financial behavior from UI copy.
4. For non-trivial work, use [`docs/agent-harness/README.md`](docs/agent-harness/README.md)
   and create an execution plan from [`docs/exec-plans/TEMPLATE.md`](docs/exec-plans/TEMPLATE.md).
   The executable workflow contract is [`docs/agent-harness/graph.json`](docs/agent-harness/graph.json).
5. For GitHub-Issue-scoped ADLC objectives, read
   [`docs/agent-harness/github-issue-control-plane.md`](docs/agent-harness/github-issue-control-plane.md)
   for the issue contract, lifecycle semantics, and trust boundaries.
6. If an ADLC ticket is active, its accepted spec, scope, rails, and evidence take precedence over
   an informal plan. Never weaken frozen rails to make a change pass.

To choose the next task, read [the agent execution order](docs/backlog/EXECUTION.md) and verify live issue/dependency evidence before starting. Queue rank does not override accepted ADLC rails or human gates.

## Product invariants

- Money is never represented with binary floating point.
- Every financial record belongs to a `workspace_id`.
- Transfers and debt/receivable principal are balance-sheet movements, not income or expense.
- Posted ledger facts are written only through the Ledger application layer.
- Derived balances, reports, forecasts, and suggestions retain source, timestamp, and calculation
  version so a user can explain the number.
- Suggestions support decisions; they never execute a financial action.
- Logs, fixtures, screenshots, and agent evidence must not contain secrets or raw personal finance
  data.

Use `$zenval-financial-correctness` whenever a change can affect amounts, balances, classifications,
FX, reconciliation, forecasts, investments, debt, reports, or suggestions.

## Architecture boundaries

- Domain code is framework- and ORM-free. Dependencies point inward.
- Cross-context access goes through an application port, stable contract, event, or projection.
- `apps/web` consumes browser-safe contracts and never imports server contexts.
- API and worker are composition roots; business rules live in domain/application packages.
- Migrations are forward-only. A destructive or irreversible data change requires explicit human
  approval and a recovery plan.

The executable dependency rules are in [`dependency-cruiser.cjs`](dependency-cruiser.cjs).

## Delivery loop

Use `$zenval-adlc-delivery` for feature, bug, refactor, schema, or cross-package work.

1. Define the observable goal, acceptance checks, scope, non-goals, risk, and stop condition.
2. Explore before editing; record decisions and open questions in a durable plan or ADLC evidence.
3. Implement the smallest vertical slice. Add or update tests with the behavior.
4. Observe deterministic gate output, fix the cause, and cap revision loops at three attempts per
   unchanged failure. Escalate with evidence after that.
5. Use a fresh checker for risky or non-trivial changes. The checker returns `PASS`, `REVISE`, or
   `ESCALATE`; the author does not declare its own work accepted.
6. Update task status and record a handoff using
   [`docs/agent-harness/task-memory.md`](docs/agent-harness/task-memory.md); keep partial work open.
7. Human approval remains mandatory for release, external side effects, security exceptions,
   destructive migrations, and changes to financial meaning.

## Commands

```bash
pnpm harness:validate  # validates graph, knowledge map, and project skills
pnpm harness:quick     # format, lint/architecture, types, and tests
pnpm harness:full      # full quality gate including production builds
pnpm dev               # all local apps through Turborepo
```

Do not claim a command passed unless it was run in the current worktree. Use
`$zenval-change-verification` before handoff.

## Repository map

- `apps/web` — Next.js UI/PWA.
- `apps/api` — public NestJS/Fastify API composition root.
- `apps/worker` — jobs and external-adapter composition root.
- `packages/contexts/*` — bounded contexts with layered/hexagonal boundaries.
- `packages/shared-kernel` — small framework-free primitives and ports.
- `packages/contracts` — browser-safe runtime schemas and DTOs.
- `packages/database` and `migrations` — schema composition and forward-only SQL.
- `architecture/adr` — durable architecture decisions.
- `docs/exec-plans` — resumable plans, decisions, progress, and outcomes.
- `.adlc` — accepted tickets/specs and lifecycle evidence.
- `.codex/skills` and `.codex/agents` — project workflows and independent agent roles.

## Keep the harness healthy

If the same failure happens twice, improve a deterministic test, lint rule, contract, skill, or
document instead of adding another reminder here. Update this map when a linked source moves, and
run `pnpm harness:validate` after changing harness knowledge.
