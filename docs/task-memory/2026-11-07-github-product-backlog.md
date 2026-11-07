# GitHub Project 4 product backlog reconciliation · 07/11/2026

Status: published, read-back verified and independent scoped review PASS. Repository-wide full gate still fails at out-of-scope formatting; no implementation acceptance, release or financial-policy approval recorded.

## Authorized scope and outcome

User explicitly requested reviewing [Project 4](https://github.com/users/pvnamGit/projects/4), closing no-longer-valid objectives, and adding individual tasks with specifications. This authorizes backlog administration only. No product implementation, protected-base mutation, PR merge/closure, research recruitment, payment/provider activation or release performed.

- Read all 24 original board items and all 27 repository issue/PR records; no additional pagination.
- Created 40 task/spec issues #28–#67; reused and updated #7–#10 for T00–T03. All 44 task issues are open, on the board in Backlog, and children of roadmap #6.
- Specs embed scope/acceptance snapshots from the current worktree because some source docs are uncommitted. They include dependencies by actual issue links, verification observations, non-goals, risks, human approvals and stop condition. Lifecycle remains Draft/Backlog; large workstreams need bounded child slices before Ready.
- Closed #11–#18, #20, #21, #23 and #27 as `not_planned`/superseded only after replacement specs were published. Preserved original body after supersession explanation and replacement mapping; archived those 12 from active board. No claim of product completion.
- Refreshed roadmap/spec index #6 and dependency inputs to phase gates #19/#22. Kept ADLC #1/#2/#3/#4/#26 body/state unchanged; #2 remains previously closed, #3 remains in progress. PR #25 untouched.
- Reconciled local T03 dependency on T04 pricing/cost evidence; linked spec-kit to the live GitHub index.

## Durable artifacts

- [Execution plan](../exec-plans/active/2026-11-07-github-product-backlog.md).
- [Live roadmap/task-spec index](https://github.com/pvnamGit/zenval/issues/6).
- [Snapshot manifest](../backlog/project-4-reconciliation.json): all 44 exact published issue bodies, task/issue/project IDs, dependency DAG, old→new mapping.
- [Read-back summary](../backlog/project-4-verification.json).
- [Navigation](../backlog/README.md).

## Verification and review

- Pre-publication independent checker `review_project_migration`: PASS for 44/44 unique task coverage, complete draft objective contracts, acyclic hard dependency graph and justified reuse/supersession. Recommended inherited acceptance details were embedded for capture latency, multi-payment matching, confidence/reserve policy, overpayment/ERV, investment transfer/cash legs, net-worth bridge and accessibility/state matrix.
- Authenticated GraphQL/REST read-back script: exit 0, 44 open specs match saved bodies/title, no dependency placeholders, all tasks Backlog, all replacements closed with `not_planned` and replacement references, active board has 52 items, #6/#19/#22 refreshed, harness issues preserved. Separate sub-issue read-back confirmed 44/44 belong to #6.
- Focused `pnpm exec biome check --write docs/backlog docs/spec-kit/README.md docs/spec-kit/tasks.md docs/exec-plans/active/2026-11-07-github-product-backlog.md`: exit 0, 6 files; formatter fixed 2 artifacts.
- `pnpm harness:validate`: exit 0 on final published state, 8 nodes / 3 skills / 7 knowledge artifacts.
- `pnpm harness:full`: exit 1 at repo `format:check`, 162 errors / 2 warnings including `.agent/skills/impeccable/` outside this change. Lint/types/tests/build not reached. Node v25.9.0 warns against required >=24 <25. No unrelated formatting fixes made.
- Connector `create_issue` failed with transport error; authenticated read-back confirmed no issue had been created, avoiding a duplicate. Issue/project mutations then used authenticated GitHub CLI; connected tools lack Projects V2 operations. Each mutation result observed, final state re-read.

## Remaining work and next safe action

Final checker `review_project_migration` returned **PASS — scoped backlog publication**, confirming manifest/remote equality, resolved dependencies, hierarchy, closure reasons, gate updates and unchanged harness issues. This does not assert production or global full-gate acceptance. All product tasks remain open; prototypes, proposed PUML and demo API do not constitute production acceptance. Select and approve bounded slices via existing ADLC rails and Phase 0 decisions. T32/T33 encryption compliance is required for affected real-user persistence; financial meaning, security exceptions, destructive migration and release remain human-gated. Pricing/quota/provider costs remain hypotheses. Global formatting cleanup is separate from this authorized backlog reconciliation.
