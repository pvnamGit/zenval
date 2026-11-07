# Task lifecycle automation

| Step | How | Where |
| --- | --- | --- |
| Pick task → **In progress**, new worktree from `origin/main` | `pnpm task:start <issue> [prefix]` | local, `scripts/task/start.sh` → `.worktrees/<issue>-<slug>` |
| PR opened/ready → **In review** | automatic | `.github/workflows/task-lifecycle.yml` |
| PR merged → close issue, **Done** | automatic (needs `Closes #N` in PR body) | same workflow |
| Delete worktree + local branch | `pnpm task:cleanup [--dry-run]` | local, `scripts/task/cleanup.sh` |

Setup once: add repo secret `PROJECT_TOKEN` (classic PAT, scopes `project` + `repo`) so the workflow can
edit the "Zenval Board" user project. Without it, issues are still closed but the board is not updated.
Local use needs `gh auth refresh -s project`.

Worktree deletion is local by design: a GitHub Action cannot reach your machine. The cleanup skips
worktrees with uncommitted changes. This automation only changes issue/board state; it never merges,
releases, or bypasses ADLC rails or human gates.

## Parallel work

`pnpm task:ready` lists tasks that may run in parallel: board status **Ready**, issue open, no open
GitHub "blocked by" issues, and every `hard_dependencies` task in
`docs/backlog/execution-order.json` closed (unknown dependency = blocked). `pnpm task:start-ready [max=3]`
starts each in its own worktree up to the limit, counting tasks already In progress. After each merge the
workflow writes the same list to the job summary.

Only tasks a human moved to Ready qualify (ordering never grants Ready). The check does not detect
overlapping files or contracts; review the list before starting.
