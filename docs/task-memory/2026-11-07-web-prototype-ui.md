# Web prototype UI port — partial handoff

Status: **partial**, not accepted. Detailed record:
[execution plan](../exec-plans/active/2026-11-07-web-prototype-ui.md).

`apps/web` now renders the full standalone prototype (all PRD §5.1 views, sub-navigation, explain
drawer, quick add, commitment/investment/goal/debt dialogs) from `prototype-app.tsx` and the
`prototype-views-*`/`prototype-dialogs.tsx` modules, backed by a typed BigInt port of
`design/model.mjs` in `prototype-model.ts`. Saves are in-session only; nothing touches the API or
ledger.

Web typecheck, tests (20), Biome on `apps/web`, production build, harness validation, repo
typecheck/tests and dependency rules passed in this worktree on 2026-11-07. `harness:quick` still
fails on pre-existing format/lint issues in vendored skill files, `design/`, and two docs.

Next: browser verification on desktop/mobile/dark mode and keyboard, decide whether quick add should
call the demo API again, then request human acceptance.

