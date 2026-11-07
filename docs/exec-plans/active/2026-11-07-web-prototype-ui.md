# Port the standalone prototype UI into apps/web

Status: active (partial — awaiting browser verification and human acceptance)
Owner: coding agent
ADLC ticket: none

## Goal and stop condition

`apps/web` renders the same information architecture, screens, dialogs, and financial rails as the
standalone design source of truth in `design/` (`app.js`, `model.mjs`, `styles.css`). The loop
stops when web tests, typecheck, lint, architecture rules, and production build pass, and a human
accepts the UI in a browser.

## Scope, non-goals, and rails

- In scope: `apps/web/src/app/*` UI, CSS, pure prototype model, and web tests.
- Not in scope: real ledger writes, auth/OAuth, server preferences, API/database changes, the
  `design/` source files.
- Rails: no binary floating point for money (BigInt model); transfers and debt/receivable principal
  carry `data-pnl-impact="false"`; brokerage cash is double-count protected; every derived value
  carries `data-source-ids`, `data-as-of`, `data-version`, `data-horizon-end` and an explanation
  drawer; suggestions and simulations never execute an action; all saves are in-session only.

## Acceptance and verification

| Acceptance criterion                                         | Verification                                              |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| Model golden cases match `design/tests/model.test.mjs`       | `prototype-model.test.ts` (8 tests)                       |
| All PRD §5.1 views, dialogs, provenance and P&L rails render | `home-state.test.ts` (7 tests)                            |
| Existing demo-API and display-preference behavior unchanged  | `demo-api`, `dashboard-demo`, `display-preferences` tests |
| Browser-safe imports only                                    | `depcruise` — no violations                               |
| Production build                                             | `pnpm --filter @zenval/web build`                         |

## Impact map

- `prototype-model.ts` — typed port of `design/model.mjs` (keeps old exports).
- `prototype-copy.ts`, `prototype-ui.tsx` — copy, state, context, shared primitives.
- `prototype-views-core.tsx` (home, review, transactions, accounts),
  `prototype-views-planning.tsx` (investments, debts, plan),
  `prototype-views-admin.tsx` (reports, settings, auth, system, more),
  `prototype-dialogs.tsx` (explain, quick add, commitment, investment, goal, debt).
- `prototype-app.tsx` — shell, hash routing, focus/keyboard management, save handlers.
- `page.tsx` renders `PrototypeApp`; `layout.tsx` adds viewport metadata; `globals.css` synced from
  `design/styles.css` (Tailwind import dropped — no Tailwind utilities were used).
- `vitest.config.ts` — automatic JSX runtime for SSR render tests.

## Decisions

| Date       | Decision                                                                              | Evidence / consequence                                                                                         |
| ---------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 2026-11-07 | Home renders prototype sample figures instead of the "overview not ready" empty state | User asked to implement the prototype; `home-state.test.ts` rewritten accordingly                              |
| 2026-11-07 | `page.tsx` no longer calls `demo-api.ts`; quick add is in-session like the prototype  | `demo-api.ts` and its tests are untouched; reconnecting is an open question                                    |
| 2026-11-07 | Net-worth explanation rows use 211.6m + 114.5m − 33.5m                                | Aligns with `financialFixture` (ERV 6.5m); prototype used 13.15m ERV which contradicted the receivable fixture |
| 2026-11-07 | React escapes text, so saved free text is stored raw (no `escapeHtml`)                | Avoids double-escaping; `escapeHtml` still exported and tested                                                 |

## Progress and observations

- `pnpm --filter @zenval/web typecheck` — pass.
- `pnpm --filter @zenval/web test` — 5 files, 20 tests pass.
- `biome check apps/web` — clean.
- `pnpm --filter @zenval/web build` — pass (static `/`).
- `pnpm harness:validate` — pass. Repo `typecheck`/`test` — 13/13 tasks pass. `depcruise` — no
  violations.
- `pnpm harness:quick` — fails at `format:check` and `biome lint` only on files outside this change
  (`.agent/skills/**`, `.agents/skills/**`, `.impeccable/**`, `design/*`, `docs/PRD.md`,
  `docs/FEATURES.md`).

## Handoff

UI port is implemented and gated as above. Open: browser check (desktop ≥1020px sidebar, mobile
nav, dark mode, keyboard focus trap/Escape/⌘K, quick-add amount formatting), decision on
reconnecting quick add to the demo API, and resolving pre-existing format/lint failures in vendored
skill files. No human acceptance is recorded.
