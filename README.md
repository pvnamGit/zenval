# ZENVAL

Zenval is a Vietnamese-first personal finance platform: **Calm numbers. Clear decisions.**

This repository is the Phase A architecture runway described in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): a pnpm/Turborepo modular monolith with a
Next.js client, NestJS/Fastify API and worker, and domain packages organized using layered,
hexagonal boundaries.

## Prerequisites

- Node.js 24 LTS (`.nvmrc`)
- pnpm 10
- Docker (for local PostgreSQL)

## Start locally

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev:infra
pnpm dev
```

- Web: http://localhost:3000
- API health: http://localhost:3001/v1/health
- Worker health: http://localhost:3002/internal/health

## Quality gates

```bash
pnpm check
```

`pnpm check` verifies formatting, Biome lint, architecture dependency rules, strict TypeScript,
tests, production builds, and the agent harness structure. For a faster inner loop use
`pnpm harness:quick`.

## Agent delivery

Start with [`AGENTS.md`](AGENTS.md). Zenval includes native ADLC project agents, repository-scoped
Codex skills, a machine-validated delivery graph, resumable execution-plan templates, bounded repair
loops, and a pull-request rail guard. See
[`docs/agent-harness/README.md`](docs/agent-harness/README.md) for setup and operation.

## Repository map

- `apps/web`: Next.js App Router UI; depends only on safe contracts/UI packages.
- `apps/api`: public REST composition root.
- `apps/worker`: internal jobs composition root.
- `packages/contexts/*`: bounded contexts with domain/application/infrastructure/interface layers.
- `packages/shared-kernel`: small, framework-free value objects and ports.
- `packages/contracts`: browser-safe runtime schemas and API DTOs.
- `packages/database`: Drizzle schema composition and migrations.
- `migrations`: forward-only SQL migrations.

The initial ledger slice intentionally proves the package and invariant boundaries. Product modules
should be added one vertical slice at a time after their ADR and financial golden cases are accepted.
