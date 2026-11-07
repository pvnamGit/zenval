# Reconcile GitHub Project 4 with product tasks and specifications

Status: delivered — backlog read-back and independent scoped review PASS; full repository gate fails on out-of-scope formatting
Owner: Codex
ADLC ticket: none — authorized backlog administration, not implementation acceptance

## Goal and stop condition

Review all 24 Project items and repository issues. Reuse valid objectives, supersede obsolete grouped product issues with linked task specifications, and add every Txx backlog task to Project 4 in Backlog. Stop after read-back confirms coverage, correct closure reasons and dependency links.

## Scope, non-goals, and rails

- In scope: GitHub issues/project membership/status, local reconciliation manifest and handoff.
- Not in scope: implementation, release, financial policy decisions, ADLC store/rails changes, PR closure/merge, research execution.
- User explicitly authorized closing invalid backlog and creating task/spec issues. Superseded is not completed. Existing ADLC and release gates retained.
- Source worktree includes uncommitted requirements; embed spec snapshots in issue bodies rather than depend solely on remote doc links.

## Acceptance and verification

| Acceptance criterion                                               | Verification command or observation                                     |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| All existing items classified with reasons                         | Project GraphQL snapshot + reconciliation manifest                      |
| Each Txx has a unique issue with spec/acceptance/dependencies      | Manifest validation and issue read-back                                 |
| Superseded issues retain history and point to replacements         | Issue closed with not_planned; body preserved after supersession header |
| New/reused tasks are Backlog, no implementation acceptance implied | Project GraphQL read-back                                               |
| No current gate points solely to closed superseded modules         | Update #6/#19/#22 references                                            |

## Impact map

Project 4 (Zenval Board), repo pvnamGit/zenval. Sources: docs/spec-kit/{tasks,spec,traceability}.md, PRD, FEATURES, ARCHITECTURE, technical-docs, design/README.md, apps/web/README.md and API adapter. Preserve unrelated worktree changes.

## Steps

- [x] Read all Project items and current sources.
- [x] Prepare specifications and replacement map; independent review.
- [x] Create/reuse issues, link dependencies and add to Backlog.
- [x] Close replaced objectives; refresh roadmap/gates.
- [x] Read back all changes and record handoff.

## Decisions

| Date       | Decision                        | Evidence / consequence                                                                                |
| ---------- | ------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 2026-11-07 | Reuse #7–#10 for T00–T03        | Same discovery/accounting/privacy/scope outcomes                                                      |
| 2026-11-07 | Replace #11–#18/#20/#21/#23/#27 | Bundled scopes split across current Txx; #27 Figma requirement superseded by standalone design source |
| 2026-11-07 | Keep #1/#2/#3/#4/#6/#19/#22/#26 | Harness work or valid roadmap/acceptance gates; no evidence authorizes completion                     |

## Progress and observations

Read Project through authenticated gh GraphQL because connected GitHub tools do not expose Projects V2 operations. Issue mutations use connected GitHub tools. Initial snapshot: 24 items, no pagination remainder.

## Handoff

[Handoff and evidence](../../task-memory/2026-11-07-github-product-backlog.md). Published 40 new specs, reused 4, superseded/archived 12, updated #6/#19/#22. Live read-back and independent review PASS for backlog administration; product tasks remain open. Global harness:full stopped on out-of-scope formatting; no implementation/release acceptance claimed.
