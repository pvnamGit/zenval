# Task status and handoff memory

Each completed task needs both an accurate status update in its authoritative tracker and a durable,
concise handoff. A task is complete only when its own scope and acceptance checks are satisfied,
required gates and reviews have evidence, and any mandatory human approval has actually occurred.
A completed step or slice does not complete its parent task. Never infer approval from implementation,
review, a request to continue, or this document. Track skipped, blocked, and partial work explicitly.

## Procedure

1. Identify the authoritative task and exact scope, its acceptance checks, dependencies, and current
   evidence. For ADLC tickets use the canonical store service and respect frozen rails and the
   lifecycle; never edit store shards by hand. For a Markdown backlog check its own checkbox only
   when that whole task meets its completion conditions. Keep plan-step checkboxes scoped to steps.
2. Write or update one stable handoff in `docs/task-memory/`, named by ticket/task ID or a dated
   descriptive slug. Link the authoritative task and execution plan. Capture scope and outcome,
   changed files, commands and actual results, independent review, outstanding risks and decisions,
   relevant approval status, and the next safe action. A blocked or partial handoff is useful too,
   but must not claim completion. Update the same artifact on later sessions; avoid duplicate logs.
3. Update the task status with a link to the handoff, using the tracker’s supported mechanism. If
   the task or tracker cannot link directly, link both from the plan or handoff. Do not mark done if
   evidence, required review, or approval is missing; record the gap and leave it open.
4. The implementer may perform these steps directly, or delegate them to the project agent
   `zenval-memory-handoff` when delegation is available and appropriate. The agent does not replace
   independent review, human approval, or the ADLC evidence store.

Do not record secrets, raw personal finance data, private chain-of-thought, or invented results. A
memory is a navigation aid and handoff, not a substitute for the linked source evidence. Preserve
pre-existing worktree changes and do not claim that historical test results were run in this worktree.
