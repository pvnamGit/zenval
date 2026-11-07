---

name: zenval-financial-correctness
description: Design, implement, or review Zenval financial behavior and data paths, including money, transactions, assets, debt, reports, financial persistence, encryption, projections, jobs, imports, exports, and caches. Use whenever financial meaning, confidentiality, auditability, or calculation lineage can change.
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

## Mandatory financial encryption

Read the [financial encryption contract](../../../technical-docs/financial-data-encryption.md)
before implementing or reviewing financial data paths. Encrypt private financial content
before database or side-store persistence: amounts/sign/currency, income/expense/transfer
types, categories, transactions, accounts/assets/holdings, debt/receivables and derived values.
This includes projections, outbox/job/idempotency payloads, imports/OCR, attachments,
exports and persistent caches. Managed disk encryption alone does not satisfy this rule.

Only the common server infrastructure `FinancialCryptoGateway` implements encrypt/decrypt.
Keys stay outside DB/client/logs; use authenticated envelope encryption per the contract.
Check actor, workspace, resource and purpose before decrypting. Plaintext may exist in
authorized runtime memory for exact calculations and permitted responses; UI formats money
without keys. Keep domain/application framework-free and dependent on inward-owned ports.

Allowlist only technical metadata; never expose business subtype through routing/indexes
or unkeyed low-entropy hashes. Do not introduce plaintext SQL aggregates/read models as a
shortcut. Key/tag/version failures fail closed; never fall back to raw storage or zero.
Preserve exact decimals, balanced posting, atomicity, idempotency and lineage through crypto.
Existing raw schema remains noncompliant until a separately verified migration is delivered;
never claim the documented gateway exists without source and test evidence.

## Verification design

For each affected rule, add a golden example that asserts both sides of the accounting effect and
the negative case that would double-count or misclassify it. Include zero, sign, rounding, currency,
timezone/date-boundary, duplicate/idempotency, authorization, and stale/missing-data cases where
applicable.

For changed financial persistence or disclosure paths, verify ciphertext at the DB-driver/storage
boundary and absence of raw values in affected side stores/logs. Test exact-decimal round-trip,
wrong actor/workspace, tamper/AAD/key failures, authorized output fields, transaction rollback
and retries. For key lifecycle or migration changes also verify rotation, dedup replay and restore.
Use synthetic data only. A test of the crypto helper alone does not prove end-to-end coverage.

Prefer domain tests for invariants, application tests for transaction/idempotency behavior, contract
tests at context boundaries, and integration tests for persistence semantics. UI snapshots alone do
not prove financial correctness.

Require explicit human acceptance for a change to classification meaning, calculation formulas,
historical recomputation, destructive migration, or user-visible financial claims. In the handoff,
state the accounting equation before and after, the golden cases run, and any remaining uncertainty.
