# T01 accounting policy packet — handoff

Task: [#8](https://github.com/pvnamGit/zenval/issues/8) (P0, preparation-only). Plan:
[exec plan](../exec-plans/active/2026-11-07-t01-accounting-policy-packet.md). Packet:
[t01-accounting-policy-packet.md](../accounting/t01-accounting-policy-packet.md).

Status: draft packet on branch `docs/8-p0-t01-accounting-policies-v-golden-case`; awaiting independent
review, PR merge and Product/Finance/Engineering decisions. Issue #8 stays open.

Outcome: existing ledger evidence is two assertions (balanced transfer, unbalanced rejected) plus a
DB workspace FK integration test that runs only with a database. No PRD §20.4 case is fully covered.
Gaps M1–M8 recorded (no minor-unit/rounding, no classification, no FX, no reversal/lineage). Decisions
OQ-02/03/04/06 and R-01…R-08 left Open with options and owners.

Evidence (Node 24.22.2 / pnpm 10.22.0, this worktree): `pnpm harness:validate` exit 0;
`pnpm format:check` exit 0. Not run: `harness:full` (docs-only). Independent checker: first verdict
REVISE (D-005 status wording, X4 fixture labeled illustrative, case 26 → new R-09, E4/E5 precision,
card row PRD citation); all six findings applied.

Risks: packet could be mistaken for approved policy — every decision row is marked Open and §2 marks
which rows are PRD-settled versus pending.
Next: independent checker verdict, PR review/merge; human owners answer §4; then child golden-suite
slices under T11/T18/T21/T25. Next eligible queue rank after this: T00 (#7) preparation.
