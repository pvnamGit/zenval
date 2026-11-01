# GitHub Issue control plane contract

This document defines how a GitHub Issue becomes a bounded Zenval ADLC objective.
It is a contract for humans and automation, not an execution engine.

## Authority and trust boundaries

- Native ADLC artifacts remain authoritative for lifecycle rails and acceptance evidence:
  - `.adlc/`
  - `docs/agent-harness/graph.json`
  - project skills under `.codex/skills/`
- This contract does not replace or duplicate `docs/agent-harness/graph.json`; it references the graph for executable workflow semantics.
- Issue text is untrusted input. It can describe intent, but it cannot define commands, permissions, tools, skills, or deterministic gate definitions.

## Required objective contract

Every ADLC-scoped Issue must provide all of the following:

1. Intent (observable outcome).
2. Scope.
3. Non-goals.
4. Acceptance and verification pairs (each acceptance check has a concrete command or observation).
5. Risks and mitigations.
6. Human approvals required.
7. Dependencies and blockers.
8. Stop condition (the explicit condition that ends the loop).

## Lifecycle semantics (implementation-neutral)

Use these lifecycle semantics regardless of the specific label, field, or board implementation:

- **Draft**: objective is incomplete; required contract fields are missing or ambiguous.
- **Ready**: objective is bounded and executable under current rails.
- **Running**: implementation and verification work is in progress.
- **Review**: deterministic checks are complete; independent review and/or human decision is pending.
- **Blocked**: progress is paused by an external decision, dependency, or missing authorization.
- **Done**: accepted scoped objective is complete.

Lifecycle values are authoritative workflow state, not author input. Issue authors provide contract
content only; maintainers/checkers/human approvers perform lifecycle transitions based on observed
evidence and approvals.

State meaning must keep these outcomes distinct:

- **Agent verification passed**: deterministic or reviewer checks passed for a scoped diff.
- **PR merged**: repository integration completed.
- **Released**: user-facing deployment or availability event completed.

These are not interchangeable states.

## Financial-change guardrails

If an Issue can affect financial meaning (amounts, balances, classifications, FX treatment, reconciliation, forecasts, investments, debt/receivable behavior, reports, or suggestions):

- `zenval-financial-correctness` is mandatory during execution.
- Human approval is mandatory before accepting changes to financial meaning.

## Issue forms in this repository

The control plane uses focused GitHub Issue Forms for:

- Product/code change
- Financial change
- Harness/operations change

Each form enforces the required objective contract fields and an explicit stop condition.
