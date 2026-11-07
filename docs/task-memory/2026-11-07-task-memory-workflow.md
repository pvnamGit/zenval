# Task memory workflow — handoff

Status: **in progress**, pending fresh-session agent discovery and repository full gate. See the
[execution plan](../exec-plans/active/2026-11-07-task-memory-workflow.md) for scope and evidence.

The workflow requires completed tasks to update their authoritative tracker and a durable handoff;
partial work stays open. The new project agent is configured in `.codex/config.toml` and
`.codex/agents/zenval-memory-handoff.toml`. The existing preferences slice has a
[partial handoff](2026-11-07-display-preferences.md); T10 is not complete.

`pnpm harness:validate` and scoped formatting passed in this worktree. `pnpm harness:full` failed at
format with 113 existing errors in the worktree; downstream checks did not run. The reviewer found
no false acceptance in the guidance and requested verification that the new agent can be discovered;
this session's role list does not refresh. Next: start a fresh Codex session, check role discovery and
invocation, then rerun the full gate after its unrelated format failures are resolved. No human
acceptance has been recorded.
