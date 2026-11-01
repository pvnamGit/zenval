---

name: zenval-adlc-delivery
description: Deliver non-trivial Zenval features, bugs, refactors, migrations, or cross-package changes through accepted scope, ADLC rails, a resumable graph, bounded repair loops, and evidence-backed handoff. Do not use for a read-only explanation or a tiny isolated edit.
---

# Zenval ADLC delivery

Read `AGENTS.md`, the accepted ADLC ticket when present, and the relevant PRD/architecture sections.
Treat `.adlc/` and the repository as durable state; never rely on chat history as the only source of
scope, decisions, or evidence.

## Shape the work

- Restate the observable goal, non-goals, scope, risks, rails, and stop condition.
- Pair every acceptance criterion with a command or observable check.
- For work that crosses packages, changes a contract/migration, or carries material risk, create a
  plan from `docs/exec-plans/TEMPLATE.md`.
- Explore before editing. Cite existing code, tests, and boundaries in the impact map.

If intent is materially ambiguous, a rail conflicts with the requested result, or a destructive or
external side effect lacks authorization, stop with a specific human decision request.

## Execute the graph

Follow `docs/agent-harness/graph.json`: specify, explore, plan, build, verify, review, then human
acceptance. Use independent branches only when their inputs and write scopes are disjoint and the
coordination cost is justified.

Implement the smallest coherent vertical slice. Keep domain rules out of controllers, UI, and ORM
adapters. Update behavior tests and durable documentation in the same change.

After an action, observe actual output before adjusting. Cap retries at the node's `maxAttempts`.
If the same failure persists through three build/verify attempts without new evidence, escalate; do
not weaken rails, tests, types, lint, or acceptance criteria.

## Handoff

Run `$zenval-change-verification`. Report the scoped outcome, changed behavior, commands and results,
unresolved risks, and any required human gate. The author may propose completion but may not record
human acceptance or the independent review verdict.
