# Standalone design source of truth

Status: active
Owner: Codex implementer
ADLC ticket: none

## Goal and stop condition

Create a top-level `design/` prototype that reproduces the current `apps/web` UI/UX as a fully
standalone, mobile-first HTML/CSS/JavaScript experience. It becomes the reviewable design source of
truth and runs locally without React, Next.js, Figma, a framework, a package install, or a build
step. Stop when the prototype is documented, its financial display rails have automated checks,
the key journeys have been exercised at desktop and iPhone-sized viewports, deterministic gates
pass, and an independent checker returns a verdict.

## Scope, non-goals, and rails

- In scope: top-level `design/`; theme tokens; responsive shell; light/dark; Vietnamese/English;
  full PRD §5.1 Information Architecture coverage across `#home`, `#review`, `#transactions`,
  `#accounts`, `#investments`, `#debts`, `#plan`, `#reports`, `#settings`, `#system`, and mobile
  `#more` views; sub-navigation for every multi-section module; today's total inflow/outflow on the
  first dashboard of `#home`; interactive creation of monthly fixed commitments/recurring items;
  interactive logging of investment holdings/activities; debt/receivable schedule & simulation;
  account reconciliation; monthly close & reports; settings & privacy/audit center; quick-add and
  derived-value explanation drawers; standalone local preview instructions and checks.
- In scope: demo-only states for posted, pending, forecast, and estimated; visible source,
  freshness, horizon, assumptions, and calculation version for derived values.
- Not in scope: changing `apps/web`, backend behavior, ledger facts, calculation formulas,
  classification meaning, persistence, authentication, real financial actions, or deployment.
- Frozen rails: preserve all uncommitted work; no binary floating-point financial calculation;
  transfers and debt/receivable principal are never income/expense; brokerage cash is never
  double-counted; pending/forecast items are not posted facts; derived figures disclose
  provenance/freshness/version; suggestions and buttons never execute a financial action.
- Human approval: still required for release/deploy or any future change to financial meaning.

## Acceptance and verification

| Acceptance criterion                                                                 | Verification command or observation                                                   |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `design/` runs with no build or framework                                            | `python3 -m http.server 4173 --bind 0.0.0.0 --directory design`; HTTP GET returns 200 |
| HTML, CSS, and JS are standalone and linked locally                                  | `node design/tests/verify.mjs`                                                        |
| `#home` first dashboard shows today's total inflow/outflow excluding transfers       | `node design/tests/verify.mjs` and `node design/tests/model.test.mjs`                 |
| Monthly fixed commitments screen & creation modal cover inflow/outflow/debt/transfer | `node design/tests/verify.mjs` and `node design/tests/model.test.mjs`                 |
| Investments screen & activity/holding logger cover holdings, activity, performance   | `node design/tests/verify.mjs` and `node design/tests/model.test.mjs`                 |
| Full PRD §5.1 IA screens & sub-views are navigable on desktop and mobile             | `node design/tests/verify.mjs` and `node design/tests/model.test.mjs`                 |
| Transfer & principal are excluded from P&L and states remain distinct                | `node design/tests/verify.mjs`                                                        |
| Derived figures expose source, freshness, horizon, and version                       | `node design/tests/verify.mjs`; inspect explanation drawer                            |
| Repository harness remains healthy                                                   | `pnpm harness:validate`; `pnpm harness:full`                                          |
| Fresh checker challenges the scoped diff                                             | Independent verdict: `PASS`, `REVISE`, or `ESCALATE`                                  |

## Impact map

- `apps/web/src/app/page.tsx`: current prototype screens, copy, and interactions; read-only source.
- `apps/web/src/app/globals.css`: current tokens, responsive behavior, and component styling;
  read-only source.
- `apps/web/src/app/prototype-model.ts`: current navigation, locale, state, and transfer rails;
  read-only source.
- `apps/web/src/app/prototype-model.test.ts`: existing prototype invariant checks; read-only source.
- `docs/PRD.md`: sections 5–6, FR-011/013/030/031/036, explainability and mobile requirements.
- `docs/ARCHITECTURE.md`: browser-safe UI boundary and Ledger/Planning/Reporting ownership.
- `design/`: new source of truth and its focused verification.

## Steps

- [x] Specify the observable outcome, rails, acceptance checks, and stop condition.
- [x] Explore the existing prototype, PRD, architecture, harness, and dirty worktree.
- [x] Build the standalone semantic HTML, tokenized CSS, and vanilla-JS state model.
- [x] Add local-preview documentation and focused invariant checks.
- [x] Verify server delivery and deterministic mobile/interaction contracts; record the unavailable
  managed-browser limitation instead of claiming a visual browser run.
- [x] Run repository gates and independent review; record evidence and handoff.

## Decisions

| Date       | Decision                                                                                            | Evidence / consequence                                                                                     |
| ---------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 2026-11-02 | Treat `apps/web` as read-only input and add only `design/` plus this plan.                          | Prototype files and other harness files are already modified/untracked; this avoids overwriting user work. |
| 2026-11-02 | Use static files with a data-driven render function, hash navigation, and localStorage preferences. | Preserves interactive parity without a runtime dependency or build step.                                   |
| 2026-11-02 | Use fixed display strings/minor-unit metadata for demo money, never JS arithmetic.                  | The prototype communicates financial meaning without introducing binary floating-point calculations.       |

## Progress and observations

- 2026-11-02: Read `AGENTS.md`, the three required project skills, `docs/PRD.md`,
  `docs/ARCHITECTURE.md`, harness README/graph/template, relevant prototype code/tests, and current
  `git status`. No active ADLC ticket was present. Existing uncommitted changes were identified and
  left untouched.
- 2026-11-02: `node --check design/app.js && node design/tests/verify.mjs` exited 0; all 20
  standalone, locale, responsive, interaction-hook, state-separation, transfer-P&L, and lineage
  checks passed.
- 2026-11-02: Started `python3 -m http.server 4173 --bind 0.0.0.0 --directory design`; an HTTP GET
  to `http://127.0.0.1:4173/` returned `200 OK`. Served HTML, CSS, and JS byte-matched their source
  files. Wi-Fi interface `en1` reported `192.168.1.83`.
- 2026-11-02: The Browser skill was read, but its required managed browser-control tool was not
  exposed in this session. No substitute browser automation was used. Visual desktop/390x844 click
  testing remains a human preview check; safe-area, viewport, overflow containment, breakpoints,
  focus trap, Escape, and interaction hooks have deterministic source checks/lint only.
- 2026-11-02: `pnpm harness:validate` exited 0: 8 graph nodes, 3 skills, and 7 knowledge artifacts
  valid.
- 2026-11-02: First `pnpm harness:full` attempt stopped at formatting for four new files. Scoped
  Biome formatting repaired the mechanical finding. A focused test initially depended on a
  pre-format single-line object and was changed to a whitespace-tolerant invariant check.
- 2026-11-02: Final `pnpm harness:full` exited 0 after cleanup: format, lint/dependency rules,
  typecheck (12/12 tasks), tests (12/12 tasks, including 5 web prototype and financial golden
  tests), and builds (8/8 tasks) passed. The environment emitted a non-blocking engine warning:
  repository requests Node >=24 <25, while the current runtime is Node 25.9.0.
- 2026-11-02: Independent checker returned `REVISE`: dialog focus restoration and background
  isolation were incomplete; cash-flow, net-worth, and Plan STS lacked full drill-down lineage;
  focused checks were overly static; the mobile topbar had a notch-height risk; and this plan needed
  formatting after its evidence update.
- 2026-11-02: Repair loop 1 moved financial/state contracts into the shared `design/model.mjs`,
  added executable model tests, added full lineage metadata and disclosure controls to every
  derived-value card, made dialog background regions inert, restored focus by stable control ID,
  guarded the global search shortcut while dialogs are open, and changed mobile topbar height to
  include `safe-area-inset-top`. `node design/tests/model.test.mjs` passed 20 behavior/lineage
  assertions; `node design/tests/verify.mjs` passed 24 asset/rendered-contract checks; scoped Biome
  format/lint and `git diff --check` exited 0. The local server returned HTTP 200 for `model.mjs`.
- 2026-11-02: Expanded `design/` to cover full PRD §5.1 Information Architecture:
  - `#home` first dashboard card now shows today's total inflow/outflow (`+2.500.000 ₫` / `−636.000 ₫`),
    net cash movement (`+1.864.000 ₫`), today's activity breakdown, and explicit non-P&L transfer
    exclusion (`2.000.000 ₫`), plus `Hôm nay`, `Bức tranh`, and `Kế hoạch` sub-views.
  - Added monthly fixed commitments & recurring items screen (`#transactions` → `Chi phí cố định, định kỳ & hóa đơn`)
    and interactive creation modal (`+ Tạo khoản cố định hàng tháng`) covering fixed inflows, fixed
    expenses, loan installment splits (Principal non-P&L vs Interest P&L), and savings transfers.
  - Added dedicated Investments module (`#investments` with `Holdings`, `Activity`, `Performance`,
    weighted-average cost basis, provider vs manual valuation provenance, brokerage cash double-count
    protection, and interactive `+ Ghi nhật ký đầu tư / Thêm mã` modal).
  - Added Debts & Receivables (`#debts` with `Payables`, `Receivables` Gross vs ERV, and extra-principal
    `Timeline / simulation`), Account `Reconciliation` (`#accounts`), Plan `Goals` / `Forecast` /
    `Suggestions` (`#plan`), `Reports` (`P&L`, `Net-Worth Bridge`, `Monthly Close` at `#reports`),
    and `Settings` (`Profile`, `Categories & rules`, `Data sources`, `Privacy/Export/Delete`,
    `Security & Audit Log` at `#settings`).
  - `node design/tests/verify.mjs` (30 checks), `node design/tests/model.test.mjs` (44 assertions),
    `pnpm harness:validate`, and `pnpm harness:full` all exited 0 with zero lint warnings.

## Handoff

Independent checker verdict: `PASS` (30 standalone design checks, 44 model/IA/lineage assertions,
and `pnpm harness:full` all passed with 0 lint/format/dependency warnings). Product/Design/Finance
sign-off remains a human gate before any future change to production financial UX or calculation
policy.
