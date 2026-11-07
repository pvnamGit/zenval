# Build the production React web app foundation (API-ready)

Status: active (partial — awaiting browser verification and human acceptance)
Owner: coding agent
ADLC ticket: none

## Goal and stop condition

`apps/web` is a real Next.js App Router application — not a port of the standalone prototype —
with file-based routes per module, a reusable design system (Tailwind v4 + design tokens, light/dark),
i18n (vi/en), and a typed API layer that can switch between an in-memory mock adapter and the HTTP
API without touching screens. The loop stops when web typecheck, tests, biome, depcruise, and the
production build pass, and a human accepts the UI in a browser.

## Scope, non-goals, and rails

- In scope: `apps/web/**` (routes, components, features, API client, mock adapter, messages, tests).
- Not in scope: API/database changes, auth/OAuth implementation, changes to `@zenval/contracts`,
  financial formulas. Modules without a backend endpoint use web-local **draft** schemas that must
  move to `@zenval/contracts` when the endpoint lands.
- Rails: money stays `{ amount: string, currency }` and is formatted from strings/BigInt only; the UI
  does not compute derived financial numbers (it displays server/mock values with source, as-of and
  calculation version); transfers and debt principal are shown as no-P&L; suggestions never execute
  actions; quick add creates a draft only.

## Acceptance and verification

| Acceptance criterion                                     | Verification                        |
| -------------------------------------------------------- | ----------------------------------- |
| Money formatting never uses binary floating point        | `src/lib/money.test.ts`             |
| HTTP client parses contracts, maps errors, sends headers | `src/lib/api/http-client.test.ts`   |
| Mock adapter honours idempotency and transfer/P&L rails  | `src/lib/api/mock/mock-api.test.ts` |
| Browser-safe imports only                                | `depcruise`                         |
| Production build                                         | `pnpm --filter @zenval/web build`   |

## Decisions

| Date       | Decision                                                                  | Evidence / consequence                                                |
| ---------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2026-11-07 | Prototype port moved to `src/legacy-prototype/` (not routed)              | `design/` remains the design source of truth; port kept for reference |
| 2026-11-07 | TanStack Query for server state; `ZenvalApi` port with mock/http adapters | `NEXT_PUBLIC_API_MODE=mock\|http`; screens depend only on the port    |
| 2026-11-07 | next-intl without locale routing; cookie `NEXT_LOCALE`                    | No URL prefix; preference persisted per browser                       |
| 2026-11-07 | Modules without endpoints stay on the mock adapter even in http mode      | UI shows a "sample data" badge whenever `source` is mock              |

## Progress and observations

- `pnpm --filter @zenval/web typecheck` — pass.
- `pnpm --filter @zenval/web test` — 9 files, 50 tests pass (24 new + 26 legacy prototype tests).
- `biome check apps/web` — clean (`biome.json`: enabled `css.parser.tailwindDirectives`).
- `depcruise apps/web` — no violations.
- `pnpm --filter @zenval/web build` — pass; 12 routes + 404.
- `pnpm harness:validate` — pass.
- Live smoke (temporary test, removed): HTTP adapter against a running `apps/api` — dashboard and
  finance parsed by contract; transfer capture returned `draft`, replay returned `replayed: true`,
  same-account transfer rejected with 400.
- Headless Chrome screenshots of /, /transactions, /review, /plan, /debts, /investments, /reports
  in light/dark at 1440px and 500px. Fixed: implicit grid columns overflowing on mobile.
  Headless Chrome cannot go below a 500px viewport; 320–390px still needs a real device check.

## Handoff

Done: route-per-module App Router app with shell (sidebar, top bar, mobile bottom nav, ⌘K),
Tailwind token design system with light/dark/system theme, vi/en i18n, typed `ZenvalApi` port with
mock and HTTP adapters, TanStack Query hooks, quick add (idempotent draft capture), review
resolution (optimistic), and read-only dashboard, transactions, accounts, plan, debts, investments,
reports, settings, and login screens. All loading/error/empty states are handled.

Open: human browser acceptance (quick-add dialog, keyboard/focus flows, 320px width); real auth;
moving draft schemas to `@zenval/contracts` as endpoints land; deleting `src/legacy-prototype/`
once the team no longer needs it.
