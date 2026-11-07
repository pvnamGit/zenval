# Task status and handoff memory workflow

Status: active
Owner: Codex
ADLC ticket: none

## Goal and stop condition

Make completed tasks visible in their authoritative tracker and preserve an evidence-backed handoff;
add a project agent for this responsibility. Stop after focused validation and independent review,
with any sandbox or gate blockers recorded. Do not mark incomplete product tasks done.

## Scope, non-goals, and rails

- In scope: task-memory guidance, project-agent definition, harness map, example partial handoff.
- Outside scope: product code, changing financial meaning, human acceptance, retroactive task completion.
- Preserve all pre-existing worktree changes and never edit ADLC store shards directly.

## Acceptance and verification

| Criterion                                                              | Verification                                                         |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Completion requires actual evidence and required approvals             | Review task-memory guidance against AGENTS and ADLC rules            |
| Partial slices stay open and have a useful handoff                     | Compare T10 and display-preferences plan to example memory           |
| Agent can maintain task status and memory without fabricating evidence | Inspect project agent definition and project discovery configuration |
| Harness and independent review                                         | `pnpm harness:validate`, `pnpm harness:full`, fresh checker          |

## Impact map

- `docs/spec-kit/tasks.md`: task tracker with draft task IDs and dependencies.
- `docs/exec-plans/`: authoritative execution plans and handoffs.
- `docs/agent-harness/`: workflow guidance; `.codex/agents/`: project agent roles.

## Steps

- [x] Inspect current worktree, workflow and project agents.
- [x] Add workflow, project agent and partial memory without falsely completing T10.
- [x] Run gates and obtain independent review; record the remaining verification gaps.
- [ ] Verify agent discovery in a new Codex session and clear the full gate.

## Decisions

| Date       | Decision                                                             | Evidence / consequence                     |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------ |
| 2026-11-07 | Use a durable handoff per task and preserve actual acceptance gates. | A partial slice cannot satisfy all of T10. |

## Progress and observations

- Pre-existing worktree includes web/API demo and untracked spec kit and plans; preserved.
- `pnpm harness:validate` and scoped Biome check PASS; `pnpm harness:full` FAIL at format with 113 errors in the existing worktree; downstream checks did not run. Node v25.9.0 is outside the required range.
- Independent review found no false acceptance; requested verification that the configured agent is discoverable in a fresh session. The role registry in this session does not refresh.
- Project role is registered through `.codex/config.toml` and its config layer; no invocation has yet been verified.

## Handoff

See [task memory](../../task-memory/2026-11-07-task-memory-workflow.md). Fresh-session agent discovery and the full gate remain open; human acceptance is not recorded.
