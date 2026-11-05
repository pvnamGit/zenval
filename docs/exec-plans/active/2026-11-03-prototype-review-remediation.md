# Remediate confirmed prototype review findings

Status: complete
Owner: Codex
ADLC ticket: none

## Goal and stop condition

Recheck the reported acceptance concerns against the standalone design source and `docs/FEATURES.md`,
then repair only findings that still reproduce. Stop when the receivable preview uses the entered
principal and recovery probability, internal requirement codes are absent from the customer-facing
UI, focused checks and repository gates pass, and a fresh checker returns a verdict.

## Scope, non-goals, and rails

- In scope: browser reproduction; receivable ERV live preview; customer-facing Vietnamese copy;
  focused model/source checks; browser re-verification.
- Not in scope: real Google OAuth, production email/push delivery, provider market-price APIs,
  backend persistence, migrations, or changing the accepted financial formulas.
- Frozen rails / human approvals: exact integer money arithmetic; receivable ERV remains principal ×
  recovery probability; principal and transfers remain outside income/expense; sample/in-session
  behavior must remain explicitly disclosed.

## Acceptance and verification

| Acceptance criterion                                       | Verification command or observation                              |
| ---------------------------------------------------------- | ---------------------------------------------------------------- |
| ERV preview updates from entered principal and probability | Browser: 10.000.000 × 40% displays 4.000.000 before save         |
| Saved receivable preserves the same ERV                    | Browser: saved row displays Gross 10.000.000, 40%, ERV 4.000.000 |
| Internal IA/FR/PRD markers are absent from rendered UI     | `node design/tests/verify.mjs`; browser review                   |
| Existing financial golden cases remain valid               | `node design/tests/model.test.mjs`                               |
| Repository quality gates remain healthy                    | `pnpm harness:validate`; `pnpm harness:full`                     |

## Impact map

- `design/app.js`: dialog preview behavior and rendered customer copy.
- `design/model.mjs`: exact ERV and shared financial fixture; no formula change expected.
- `design/tests/model.test.mjs`: exact financial golden cases.
- `design/tests/verify.mjs`: rendered/source contract checks.
- `design/README.md`: prototype limitations and repaired review journeys.

## Steps

- [x] Reproduce each reported concern in the in-app browser.
- [x] Repair the confirmed ERV preview and UI-copy findings.
- [x] Run focused checks and repeat affected browser journeys.
- [x] Run repository gates and independent review.

## Decisions

| Date       | Decision                                                                                        | Evidence / consequence                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-11-03 | Keep real OAuth, notifications, and provider APIs explicitly out of this prototype remediation. | The standalone source has no backend and already labels these surfaces as previews; faking them would make acceptance evidence less truthful. |
| 2026-11-03 | Treat the stale pre-save ERV preview as a valid defect even though the saved value is correct.  | Browser input 10.000.000 and 40% continued to display the default 12.000.000 until save.                                                      |

## Progress and observations

- Browser review confirmed distinct investment handlers, unit-price/total modes, form-state
  preservation, quick-add insertion, separated income/expense categories, reconciled financial
  fixtures, separate Settings sections, reminder configuration, and honest sample-data disclosures.
- The saved receivable correctly calculated 4.000.000 ₫ from 10.000.000 ₫ × 40%, but the live
  preview remained at the default 12.000.000 ₫. Internal `IA`, `FR`, and `PRD` labels also remained
  visible in several customer screens.
- 2026-11-03: `node design/tests/model.test.mjs` passed exact financial golden cases;
  `node design/tests/verify.mjs` passed 44 standalone checks. Browser recheck confirmed the ERV
  preview updates to 4.000.000 ₫ before save and Reports no longer renders internal requirement
  codes. A versioned local script URL prevents the browser from retaining an older prototype module.
- Independent review returned `REVISE`: clearing the probability field still triggered a hidden 80%
  fallback in preview and save, while the source-only check could not catch it. Repair loop 1 makes
  80% an explicit visible default, treats a cleared value as invalid, and moves blank/cleared/40%
  cases into executable model tests.
- 2026-11-03: Browser repair recheck confirmed blank principal → `—`; visible 80% default with
  10.000.000 ₫ → 8.000.000 ₫; clearing probability → `—` plus blocked save; 40% → 4.000.000 ₫ in
  both preview and saved row. `pnpm harness:full` exited 0 with clean format/lint/architecture,
  12/12 typecheck tasks, 12/12 test tasks, and 8/8 build tasks. The environment still reports the
  non-blocking Node engine warning: repository expects Node >=24 <25, current runtime is 25.9.0.
- Fresh independent verifier returned `PASS`, reproducing the browser journey and exact `BigInt`
  golden cases with no browser runtime errors.

## Handoff

Completed the confirmed prototype remediation. The original review is now stale for investment,
category, quick-add, reconciliation, Settings, and saved ERV behavior. Real Google OAuth,
notification delivery, provider market-price APIs, and persistence remain intentionally outside this
standalone prototype and are still required before production feature acceptance.
