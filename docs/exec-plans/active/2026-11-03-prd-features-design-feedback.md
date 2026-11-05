# Incorporate product feedback into requirements and design prototype

Status: complete
Owner: Codex
ADLC ticket: none

## Goal and stop condition

Align the PRD, feature checklist, and standalone `design/` prototype with the eight product-feedback
items. Stop when requirements define market-priced asset discovery, editable goals and plans,
preference ownership, forecast formulas, and user-defined allocation ratios; the prototype exposes
the corresponding interactions; focused checks and repository gates pass; and an independent
checker returns a verdict.

## Scope, non-goals, and rails

- In scope: `docs/PRD.md`, `docs/FEATURES.md`, `design/`, focused tests, and this plan.
- Not in scope: production API integration, provider purchase, OAuth, migrations, real market-data
  delivery, personalized financial advice, or automatic financial execution.
- Frozen rails / human approvals: money remains exact; transfers/principal remain non-P&L; provider
  and manual prices retain provenance; forecasts and popular rules are decision-support defaults,
  never promises; Product/Finance approval is required before production calculation meaning ships.

## Acceptance and verification

| Acceptance criterion                                                                          | Verification command or observation              |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Action labels do not repeat a leading `+` when a plus icon is present                         | `node design/tests/verify.mjs`; source scan      |
| Listed-equity symbols use a provider-backed catalog contract with explicit fallback           | PRD/FEATURES review; prototype investment dialog |
| Market-priced asset classes and provider-selection policy are defined                         | PRD §6.8/§12; FEATURES review                    |
| User-created goals link to accounts, holdings, transactions, and plan contributions           | PRD/FEATURES review; prototype Goals journey     |
| Onboarding asks only language and base currency; OS supplies timezone/theme/location behavior | PRD/FEATURES review; Settings prototype          |
| Forecast formulas, versions, inputs, scenarios, and edge cases are explicit                   | PRD §6.5/§20.2; financial review                 |
| Popular rules are documented as optional starting points                                      | PRD appendix; FEATURES review                    |
| Spending/saving/investing ratios are user-editable and validated                              | Prototype plan journey; focused checks           |
| Repository gates remain healthy                                                               | `pnpm harness:validate`; `pnpm harness:full`     |
| Fresh checker challenges the scoped diff                                                      | Independent `PASS`, `REVISE`, or `ESCALATE`      |

## Impact map

- `docs/PRD.md`: product promises, onboarding, planning/forecast rules, goals, investments, providers,
  formulas, and open decisions.
- `docs/FEATURES.md`: phase-scoped acceptance requirements derived from the PRD.
- `design/app.js`: labels, investment instrument selector, goals, allocation preferences, settings.
- `design/model.mjs`: browser-safe prototype contracts and exact validation helpers.
- `design/tests/*.mjs`: executable prototype and financial invariants.
- `design/README.md`: supported review journeys and prototype limitations.

## Steps

- [x] Specify scope, rails, acceptance checks, and research questions.
- [x] Explore existing PRD, architecture, feature checklist, prototype, tests, and active plans.
- [x] Update durable requirements and research references.
- [x] Implement the smallest coherent prototype interactions and checks.
- [x] Run focused and repository gates; repair bounded findings.
- [x] Obtain independent review and record the handoff.

## Decisions

| Date       | Decision                                                                    | Evidence / consequence                                                                                          |
| ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 2026-11-03 | Treat popular ratios as editable templates, never product-prescribed truth. | User feedback requires personalization; PRD already rejects one-size-fits-all allocation.                       |
| 2026-11-03 | Model instrument selection as provider catalog plus manual fallback.        | SSI documents Vietnam exchange symbol lists and market data; coverage/license still require Phase 0 evaluation. |
| 2026-11-03 | Keep real provider calls outside the standalone prototype.                  | `design/` has no backend or secret-safe adapter boundary.                                                       |

## Progress and observations

- Read repository instructions, delivery/financial/verification skills, PRD, architecture, harness,
  feature checklist, standalone prototype, tests, and existing execution plans.
- Current worktree already contains unrelated and overlapping uncommitted work; edits preserve it.
- Official-source research found SSI market-data symbol/catalog endpoints, FiinGroup fund NAV APIs,
  CoinGecko crypto catalogs/prices, and licensed LBMA/ICE gold benchmarks. CFPB documents 50/30/20;
  Fidelity documents 50/15/5, 3–6 months emergency cash, and retirement milestones. These are inputs
  to optional templates, not guarantees or personalized advice.
- Updated PRD and feature requirements for provider-backed instrument catalogs, expanded asset-class
  coverage, user-owned language/base-currency selection, OS/browser theme and timezone defaults,
  linked goals, editable allocation policies, forecast lineage, robust historical expense estimates,
  and optional personal-finance templates.
- Updated the standalone prototype with provider-catalog instrument selection, manual fallback,
  user-created linked goals, editable spending/saving/investing ratios, selectable base currency,
  device-theme reset, and action labels that do not duplicate the plus icon.
- `node design/tests/model.test.mjs` exited 0; exact financial cases and allocation validation passed.
- `node design/tests/verify.mjs` exited 0 with 48 standalone checks.
- `pnpm harness:validate` exited 0: 8 graph nodes, 3 skills, and 7 knowledge artifacts valid.
- Final `pnpm harness:full` exited 0: clean format/lint/dependency checks, 12/12 typecheck tasks,
  12/12 test tasks, and 8/8 build tasks. Non-blocking environment warning: repository requests
  Node >=24 <25; current runtime is Node 25.9.0.
- First fresh-checker attempt could not start because the checker service reported a usage-limit
  error. No product finding was returned; a retry is pending and author acceptance is not inferred.
- Fresh checker returned `REVISE` and reproduced inconsistent onboarding FRs, preference reset,
  incomplete manual-instrument routing, goal/allocation gaps, and hollow source-only checks.
- Repair loop 1 aligned FR-001/003, persisted base currency, exposed device/override timezone,
  filtered provider catalogs by asset class, added manual identities/review semantics, expanded goal
  lifecycle/allocation fields, and moved critical cases into executable model tests.
- Repair loop 2 rendered manual instruments in To Review, fixed empty-catalog manual entry, enforced
  goal overlap, added goal editing, persisted timezone overrides, and applied effective timezone to
  notifications.
- Repair loop 3 preserved every goal-edit field (target/date/priority/source/overlap/allocation) and
  added a round-trip golden case. A final locale review found display text used as source identity;
  stable IDs now back all goal links so locale changes cannot bypass overlap or retarget a goal.
- Final focused evidence: `node design/tests/model.test.mjs` passed; `node design/tests/verify.mjs`
  passed 52 checks; `pnpm harness:full` exited 0 with format/lint/architecture, 12/12 typecheck,
  12/12 test, and 8/8 build tasks successful.
- Independent checker final verdict: `PASS`.

## Handoff

Implementation and deterministic verification are complete. Independent checker verdict: `PASS`.
Human Product/Design/Finance acceptance remains required before these calculation and financial UX
policies become production scope. Real market-data provider selection, licensing, and integration
remain explicitly outside this standalone prototype change.
