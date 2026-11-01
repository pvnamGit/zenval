---

name: zenval-financial-correctness
description: Design, implement, or review Zenval behavior that affects money, ledger entries, transfers, debt, receivables, FX, reconciliation, investments, forecasts, reports, or suggestions. Use whenever financial meaning, auditability, or calculation lineage can change.
---

# Zenval Financial Correctness

Read the relevant rules in `docs/PRD.md` and ownership boundaries in `docs/ARCHITECTURE.md`. Preserve
meaning before optimizing storage, API shape, or UI convenience.

## Invariants

- Represent money with an exact decimal/minor-unit type and an explicit currency; never binary float.
- Carry `workspace_id` through aggregates, repositories, commands, events, projections, and queries.
- A transfer has balanced legs and no P&L effect.
- Debt disbursement increases cash and liability; principal repayment reduces both. Only interest and
  fees are expenses. Apply the symmetric rule to receivables.
- A credit-card purchase is the expense; paying the card is principal transfer/repayment, not a
  second expense.
- Posted facts are mutated only through Ledger application use cases. Corrections remain auditable.
- Derived values expose source, freshness, assumptions, and calculation version and can be rebuilt.
- Suggestions remain explainable drafts and never execute a financial action.

## Verification design

For each affected rule, add a golden example that asserts both sides of the accounting effect and
the negative case that would double-count or misclassify it. Include zero, sign, rounding, currency,
timezone/date-boundary, duplicate/idempotency, authorization, and stale/missing-data cases where
applicable.

Prefer domain tests for invariants, application tests for transaction/idempotency behavior, contract
tests at context boundaries, and integration tests for persistence semantics. UI snapshots alone do
not prove financial correctness.

Require explicit human acceptance for a change to classification meaning, calculation formulas,
historical recomputation, destructive migration, or user-visible financial claims. In the handoff,
state the accounting equation before and after, the golden cases run, and any remaining uncertainty.
