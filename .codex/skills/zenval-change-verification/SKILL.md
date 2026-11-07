---

name: zenval-change-verification
description: Verify a Zenval implementation or diff before handoff using risk-based deterministic gates, independent maker-checker review, and explicit PASS, REVISE, or ESCALATE evidence. Use after code changes or when auditing whether work is actually complete.
---

# Zenval Change Verification

Start from the accepted brief or ADLC ticket, not the author's narrative. Inspect the diff and map
each acceptance criterion to evidence.

## Deterministic gates

Run the narrowest focused tests during iteration, then before handoff run:

```bash
pnpm harness:validate
pnpm harness:full
```

For an active railed ticket or pull request, also run the applicable ADLC rail/prosecution gates.
Never report a cached, historical, or unexecuted command as current evidence. Record the command,
exit status, and concise failure output.

Apply extra checks by risk:

- Financial behavior: invoke `$zenval-financial-correctness` and inspect golden cases.
- Financial data paths, even without formula changes: read the
  [financial encryption contract](../../../technical-docs/financial-data-encryption.md).
  Trace input through every affected database/side-store write and authorized output. Require
  ciphertext-only financial storage, the common infrastructure crypto gateway, keys outside DB,
  tenant/resource/purpose authorization before decrypt, and no raw logs/projections/caches.
  Check exact round-trip, tamper/key failure, atomicity/retry and disclosure evidence; include
  rotation/restore when affected. Return `REVISE` for raw financial persistence, a bypass decrypt
  path, plaintext fallback or missing acceptance evidence. Existing raw schema is not an exception;
  distinguish documented design from implemented and tested protection.
- Contract/schema/migration: check backward compatibility, idempotency, rollback/recovery, and data
  lineage.
- Security/privacy: check authorization at the use case, tenant isolation, secret/PII leakage, and
  least privilege.
- UI: exercise the affected journey and its loading, empty, error, keyboard, and narrow-screen states.

## Independent verdict

Use a fresh checker for non-trivial or risky work. Give it the brief, diff, tests, and rubric, but not
the author's self-justification. A finding must be reproducible and name the violated requirement or
invariant.

Return exactly one verdict:

- `PASS`: all applicable acceptance checks and gates pass with no material unresolved finding.
- `REVISE`: a bounded, actionable defect remains; include reproduction and expected behavior.
- `ESCALATE`: intent, evidence, authorization, rails, or retry bounds prevent a safe decision.

The checker does not edit product files or record human acceptance. Cap verification repair loops at
three attempts for the same unchanged failure.
