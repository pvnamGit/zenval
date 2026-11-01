# Zenval agent harness

The harness turns product intent into a bounded, inspectable delivery loop. It combines native ADLC
evidence and rails with repository-local knowledge, an explicit execution graph, deterministic
quality gates, project skills, and independent checker roles.

## Operating model

```text
intent -> spec/ticket -> explore -> plan -> build -> deterministic gates
                                               ^              |
                                               | revise (<= 3) |
                                               +--------------+
                                                              |
                                                        independent review
                                                              |
                                                   human accept or escalate
```

The machine-readable graph is [`graph.json`](graph.json). `pnpm harness:validate` rejects missing
node contracts, cycles, invalid dependencies, unbounded retries, missing knowledge links, and invalid
project skills.

## Native ADLC

Zenval uses the native Codex ADLC integration. `.adlc/` is the lifecycle source of truth and
`.codex/agents/` contains the project-scoped explorer, reviewer, verifier, five prosecution lenses,
and prosecution verifier created by `adlc init --harness codex`.

Bootstrap a new machine with:

```bash
npm install -g @adlc/cli@1.12.0
codex plugin marketplace add voodootikigod/adlc --ref main
codex plugin add adlc-codex@adlc
adlc init --root /absolute/path/to/zenval --harness codex
```

Start a fresh Codex task after installing or upgrading the plugin. Upgrade the CLI and plugin
together. Hooks give immediate feedback, while the pull-request `rails-guard` job is the committed
diff backstop.

## Graph and loop contracts

Every graph node declares one bounded purpose, named inputs and outputs, allowed tools, evidence,
acceptance, a retry ceiling, a stop condition, idempotency behavior, and an escalation owner.
Independent nodes may run in parallel only when their outputs and write scopes do not overlap.

State lives in artifacts rather than an unbounded transcript:

- accepted intent and rails in `.adlc/`;
- resumable work in `docs/exec-plans/active/`;
- architecture decisions in `architecture/adr/`;
- code, tests, gate output, and concise decision records in the worktree.

Do not record private chain-of-thought. Record inputs, decisions, assumptions, commands, observable
results, approvals, and remaining risks.

## Gate profiles

| Profile   | Command                            | Use                                          |
| --------- | ---------------------------------- | -------------------------------------------- |
| Structure | `pnpm harness:validate`            | After harness, docs, skill, or graph changes |
| Quick     | `pnpm harness:quick`               | Inner implementation loop                    |
| Full      | `pnpm harness:full`                | Handoff and pull request                     |
| Rails     | `adlc rails-guard-ci --base <ref>` | Pull-request frozen-rail backstop            |

A failed gate starts a bounded repair loop. If the same failure persists for three attempts without
new evidence, stop and escalate; do not weaken the assertion, delete the test, or broaden scope.

## Human gates

Human approval is required before release/deploy, external communication, destructive or
irreversible data work, security-policy exceptions, spending money, and changes to financial
classification or user-facing calculation meaning. Approval is a durable decision artifact, not a
chat assumption.

## Design sources

This harness applies the native [ADLC Codex integration](https://www.agenticlifecycle.ai/docs/integrations/codex),
OpenAI's [harness engineering](https://openai.com/index/harness-engineering/) repository-as-system-of-record
approach, the artifact and node-contract model from [graph engineering](https://www.ai.joaoqueiros.com/blog/graph-engineering-claude-codex-agent-workflows),
and IBM's bounded goal/action/observation/adjustment [loop engineering](https://www.ibm.com/think/topics/loop-engineering).
