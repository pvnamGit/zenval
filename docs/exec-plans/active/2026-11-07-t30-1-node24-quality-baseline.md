# T30.1 — Restore the Node 24 quality baseline

Status: active (awaiting PR review)
Owner: implementation agent
ADLC ticket: none (GitHub issue [#68](https://github.com/pvnamGit/zenval/issues/68); parent T30
[#48](https://github.com/pvnamGit/zenval/issues/48); roadmap [#6](https://github.com/pvnamGit/zenval/issues/6))

## Goal and stop condition

`pnpm harness:validate` and `pnpm harness:full` exit 0 on the supported runtime (Node 24.x,
pnpm 10.x) without weakening formatter, lint, type, test, build or architecture rules. Stop when the
gates pass and an independent checker returns PASS, or after three unchanged failed repair attempts.

## Scope, non-goals, and rails

- In scope: reproduce the format failure on Node 24, classify failing paths into first-party versus
  vendored third-party, apply formatter-only fixes to first-party files, and declare a narrow,
  evidenced vendor boundary in `biome.json`.
- Not in scope: identity/auth, financial storage/posting, formulas, migrations, UI redesign,
  dependency/lockfile changes, gate deletion, ADLC trust-root or protected-base changes, release.
- Frozen rails / human approvals: no rule relaxation; no broad exclusion of `docs/`, `design/`,
  `.codex/skills` or app code. Parent T30 #48 stays open.

## Acceptance and verification

| Acceptance criterion                 | Verification command or observation                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Supported runtime used               | `node -v` → v24.22.2 (nvm, `.nvmrc`=24); `pnpm --version` → 10.22.0                                        |
| Baseline diagnosed and repaired      | First failing stage `format:check` (119 errors, 1 warning); bounded diff below                             |
| Gate evidence current                | `pnpm harness:validate` exit 0; `TURBO_FORCE=true pnpm harness:full` exit 0                                |
| Financial/product behavior preserved | `git diff -w` shows only formatter reflow/trailing newlines; tests unchanged                               |
| Scoped handoff reviewable            | Independent checker verdict + [task memory](../../task-memory/2026-11-07-t30-1-node24-quality-baseline.md) |

## Impact map

- `biome.json` — `files.includes` adds three force-ignores for vendored third-party skills.
- 39 first-party files reformatted by `biome format --write` (apps/web, design, docs,
  `.impeccable/critique`). No source logic change.
- CI (`.github/workflows/ci.yml`) already uses Node 24 + `pnpm check`; unchanged.

## Steps

- [x] Create worktree `../zenval-t30-1` on branch `chore/t30-1-node24-quality-baseline` from
  `origin/main` (`47f17cd`).
- [x] Install Node 24 via nvm; `pnpm install --frozen-lockfile` (lockfile unchanged).
- [x] Reproduce: `harness:validate` exit 0; `format:check` exit 1 (119 errors, 1 warning).
- [x] Classify 118 failing files: 79 under `.agents/skills/{design-taste-frontend,impeccable,react-expert}`,
  39 first-party.
- [x] Add vendor boundary; format first-party; review `git diff -w`.
- [x] Run full gate on Node 24.
- [x] Independent checker verdict (PASS on run 2).
- [ ] PR into `main`; human review and merge.

## Decisions

| Date       | Decision                                                                                                                   | Evidence / consequence                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-11-07 | Exclude only `.agents/skills/design-taste-frontend`, `.agents/skills/impeccable`, `.agents/skills/react-expert` from Biome | Third-party provenance: `skills-lock.json` pins design-taste-frontend (`Leonxlnx/taste-skill`) with a `computedHash` that reformatting would invalidate; impeccable declares upstream `metadata.version: 4.8.0`; react-expert declares `license: MIT`, `author: Jeffallan`. First-party project skills live in `.codex/skills` and remain checked. Updates come from upstream, so local reformatting would create drift. |
| 2026-11-07 | Reformat first-party files with the existing formatter config rather than relaxing it                                      | Changes are whitespace, trailing newlines, Markdown table separator padding and `*x*`→`_x_` emphasis; no semantic change.                                                                                                                                                                                                                                                                                                |

## Progress and observations

- Node 24.22.2, pnpm 10.22.0. Repro matched the snapshot in issue #68 (119 errors / 1 warning).
- After fix: format 238 files clean; lint 239 files clean; depcruise no violations (208 modules);
  typecheck 13/13; tests 13/13 tasks (web 50, api 14 + 1 skipped, database 3 + 2 skipped, contracts 3,
  ledger 2, shared-kernel 2); build 8/8. Skipped tests are pre-existing DB integration tests that
  require a database URL; not changed here.
- Uncached rerun `TURBO_FORCE=true pnpm harness:full`: exit 0, `Cached: 0` for typecheck, test and
  build.
- Independent checker run 1: REVISE. A trailing blank line had been added to the task-memory file
  after the gate run, so `format:check` failed. Fixed it and reran the gates (retry 1).
- Final uncached rerun: exit 0 (format 240 / lint 241 files, including the two new docs).
  Independent checker run 2: PASS.

## Handoff

See [task memory](../../task-memory/2026-11-07-t30-1-node24-quality-baseline.md). Next safe action:
independent review of the PR, then human merge. Parent T30 #48 remains open.
