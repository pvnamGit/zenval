# Issue #27 HTML UI prototype

Status: review
Owner: Codex
ADLC ticket: GitHub Issue #27

## Goal and stop condition

Create a responsive HTML/CSS prototype in `apps/web` that makes Zenval's calm visual direction,
implementation-ready tokens, component vocabulary, Vietnamese/English content, and primary P1
dashboard interactions observable without changing financial behavior.

Stop when the prototype renders at mobile/tablet/desktop widths, exposes the theme and component
inventory, demonstrates Home/To Review/Plan/Accounts plus quick-add, passes applicable repository
gates, and records the remaining Product/Design/Finance human review gates.

## Scope, non-goals, and rails

- In scope: responsive app shell, light/dark tokens, bilingual copy, theme/component showcase,
  dashboard, review queue, accounts, plan/STS explanation, quick-add interaction, required status
  treatments, keyboard/focus/reduced-motion behavior.
- Not in scope: backend persistence, production authentication, real financial calculations, complete
  implementation of every P1 issue, bank/broker sync, automated financial actions, or changing the
  accounting policy defined by PRD/#8.
- Frozen rails / human approvals: transfer and principal remain non-P&L; expected/forecast/posted
  states stay visually distinct; STS is labeled as an estimate with horizon/source/freshness; all
  financial meaning requires Product/Design/Engineering/Finance sign-off before implementation.

## Acceptance and verification

| Acceptance criterion                                                                   | Verification command or observation                                             |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Theme and implementation-ready tokens are explicit                                     | Inspect prototype Foundations view and CSS custom properties                    |
| Component inventory covers core navigation, data, form, feedback, and financial states | Inspect prototype Components view and source                                    |
| Vietnamese and English UI are both usable                                              | Toggle `VI` / `EN`; verify major navigation, dashboard, modal, and state labels |
| Mobile, tablet, and desktop navigation match PRD                                       | Inspect at 390px, 768px, and 1440px viewport widths                             |
| Financial rails are visible                                                            | Inspect STS source panel, transfer/review labels, and quick-add type copy       |
| Keyboard/focus/touch/reduced-motion basics are present                                 | Source review plus browser keyboard walkthrough                                 |
| Web implementation remains buildable                                                   | `pnpm --filter @zenval/web lint`, `typecheck`, `test`, and `build`              |
| Repository rails remain healthy                                                        | `pnpm harness:validate` and applicable handoff gate                             |

## Impact map

- `apps/web/src/app/page.tsx`: existing architecture-runway landing page; becomes interactive UI
  prototype only, with static/sample presentation data.
- `apps/web/src/app/globals.css`: current minimal colors; becomes the design-token and responsive
  layout layer.
- `apps/web/src/app/layout.tsx`: metadata and document shell only; no domain behavior.
- `docs/PRD.md` §5, §6, §9, §14: navigation, financial semantics, accessibility/localization, P1 scope.
- `docs/ARCHITECTURE.md` §11.2: Next.js, CSS variables/Tailwind, accessibility, next-intl direction,
  and no browser-owned financial rules.

## Steps

- [x] Read Issue #27, PRD, architecture, harness contract, and current web shell.
- [x] Define tokens, component vocabulary, bilingual content model, and responsive shell.
- [x] Implement core prototype views and interactions.
- [x] Run deterministic checks and visual/responsive inspection.
- [x] Obtain the final independent checker verdict and record remaining human gates.

## Decisions

| Date       | Decision                                                                               | Evidence / consequence                                                      |
| ---------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 2026-11-01 | Use HTML/CSS in `apps/web`; do not create Figma artifacts                              | Explicit user direction after Issue #27 was read                            |
| 2026-11-01 | Prototype a bounded vertical slice instead of claiming all Issue #27 journeys complete | Issue scope spans ten journey groups and requires cross-functional sign-off |
| 2026-11-01 | Use static string amounts and presentation-only state                                  | Financial values remain backend-owned; no client calculation is introduced  |
| 2026-11-02 | Treat forecast, pending, and posted as separate visual/behavioral states               | Prevents projections from appearing as completed ledger facts               |
| 2026-11-02 | Add keyboard isolation and restoration to prototype dialogs                            | Satisfies keyboard-complete modal behavior without adding a UI dependency   |

## Progress and observations

- `gh issue view 27 --repo pvnamGit/zenval ...` succeeded after network approval; Issue #27 is open
  and requires a responsive, bilingual, accessibility-aware design system and P1 flows.
- Implemented responsive HTML/CSS prototype in `apps/web/src/app/page.tsx` and `apps/web/src/app/globals.css`.
- Verified views: Home (STS card, 30-day cash flow chart, due soon with principal split, review inbox, net worth), To Review (transfers, duplicates, variance), Accounts (VCB, Techcombank, MoMo with provenance), Plan (spending breakdown, STS formula drill-down), and UI System (color tokens, typography, component demo, data states).
- Verified responsive layouts across desktop (1440px), tablet (768px), and mobile (390px) viewports
  with no horizontal overflow, bottom navigation, and touch targets >= 44px.
- Browser walkthrough verified quick-add, transfer non-P&L copy, VI/EN toggle, More hub, real
  Review/Pending/Posted filtering, STS driver sources, and distinct forecast styling.
- Keyboard walkthrough verified dialog initial focus, background `inert`, Tab wrap inside the
  dialog, Escape close, and focus restoration to the originating quick-add button.
- The first independent verdict was `REVISE`; all five findings were repaired: keyboard isolation,
  financial-state distinction, STS source provenance, desktop Transactions IA, and hollow web tests.
- The second verdict found backdrop focus and duplicate model/UI sources; backdrop was removed from
  the tab order and the tested model now directly drives navigation, locales, review records, and
  financial state classes. The final independent verdict is `PASS`.
- Added `prototype-model.test.ts`: 5 tests cover state separation, transfer P&L meaning, review
  datasets, desktop IA, and VI/EN locale support. Web tests no longer use `--passWithNoTests`.
- Deterministic gates all passed:
  - `pnpm harness:validate`: PASS (8 graph nodes, 3 skills, 7 knowledge artifacts)
  - `pnpm format:check`: PASS (Biome format verified)
  - `pnpm lint`: PASS (Biome lint + dependency-cruiser)
  - `pnpm typecheck`: PASS (TypeScript tsc --noEmit across monorepo)
  - `pnpm test`: PASS (web: 1 file, 5 tests; monorepo suites pass)
  - `pnpm harness:full`: PASS after the checker repair set (format, lint/architecture, typecheck,
    tests, and production builds)

## Handoff

Prototype implementation and deterministic gates complete. Independent checker verdict: `PASS`.
Product/Design/Engineering/Finance sign-off remains a human gate before this prototype defines
production financial UX; the wider Issue #27 journey inventory remains outside this bounded slice.
