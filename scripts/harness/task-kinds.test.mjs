import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateTaskKindRegistry, validateTaskKindSelection } from "./task-kinds.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const registry = JSON.parse(readFileSync(join(root, "docs/agent-harness/task-kinds.json"), "utf8"));
const knownSkills = new Set([
  "zenval-adlc-delivery",
  "zenval-financial-correctness",
  "zenval-change-verification",
]);
const availableScripts = new Set(["harness:validate", "harness:quick", "harness:full"]);

function mutate(callback) {
  const candidate = structuredClone(registry);
  callback(candidate);
  return validateTaskKindRegistry(candidate, { knownSkills, availableScripts });
}

test("accepts the committed task-kind registry", () => {
  assert.deepEqual(validateTaskKindRegistry(registry, { knownSkills, availableScripts }), []);
});

test("rejects an unknown task-kind selection", () => {
  assert.match(validateTaskKindSelection(registry, "issue-supplied-kind")[0], /unknown task kind/u);
});

test("rejects an unknown task kind stored in the registry", () => {
  const failures = mutate((candidate) => {
    candidate.taskKinds["issue-supplied-kind"] = structuredClone(
      candidate.taskKinds["product-code"],
    );
  });
  assert.ok(failures.some((failure) => failure.includes("unknown task kind")));
});

test("rejects unknown skills and gate profiles", () => {
  const skillFailures = mutate((candidate) => {
    candidate.taskKinds["product-code"].skills.push("issue-supplied-skill");
  });
  const gateFailures = mutate((candidate) => {
    candidate.taskKinds["product-code"].gateProfile = "issue-supplied-gate";
  });
  assert.ok(skillFailures.some((failure) => failure.includes("unknown skill")));
  assert.ok(gateFailures.some((failure) => failure.includes("unknown gate profile")));
});

test("rejects a trusted gate profile when its package script is missing", () => {
  const missingFullGate = new Set(["harness:validate", "harness:quick"]);
  const failures = validateTaskKindRegistry(registry, {
    knownSkills,
    availableScripts: missingFullGate,
  });
  assert.ok(failures.some((failure) => failure.includes("missing package script harness:full")));
});

test("rejects unbounded retries and invalid approval classes", () => {
  const retryFailures = mutate((candidate) => {
    candidate.taskKinds["product-code"].maxAttempts = 4;
  });
  const approvalFailures = mutate((candidate) => {
    candidate.taskKinds.release.approvalClasses = ["self-approved"];
  });
  assert.ok(retryFailures.some((failure) => failure.includes("integer from 1 through 3")));
  assert.ok(approvalFailures.some((failure) => failure.includes("invalid approval class")));
  assert.ok(approvalFailures.some((failure) => failure.includes("human approval class release")));
});

test("rejects command-like fields at any registry depth", () => {
  const failures = mutate((candidate) => {
    candidate.taskKinds["harness-operations"].command = "pnpm arbitrary";
  });
  assert.ok(failures.some((failure) => failure.includes("forbidden command-like field command")));
});

test("rejects non-canonical and contradictory write scopes", () => {
  const nonCanonicalFailures = mutate((candidate) => {
    candidate.taskKinds.release.writeScope.allowedPaths = ["docs/./exec-plans"];
  });
  const contradictoryFailures = mutate((candidate) => {
    candidate.taskKinds.release.writeScope.deniedPaths.push(".github");
  });
  assert.ok(nonCanonicalFailures.some((failure) => failure.includes("unsafe repository path")));
  assert.ok(
    contradictoryFailures.some((failure) => failure.includes("cannot both allow and deny .github")),
  );
});

test("requires the financial skill and sensitive human approval classes", () => {
  const financialFailures = mutate((candidate) => {
    candidate.taskKinds["financial-change"].skills = [
      "zenval-adlc-delivery",
      "zenval-change-verification",
    ];
    candidate.taskKinds["financial-change"].approvalClasses = [];
  });
  assert.ok(financialFailures.some((failure) => failure.includes("zenval-financial-correctness")));
  assert.ok(
    financialFailures.some((failure) => failure.includes("human approval class financial-meaning")),
  );

  for (const [kind, approval] of [
    ["migration", "destructive-migration"],
    ["external-effect", "external-effect"],
    ["release", "release"],
  ]) {
    const failures = mutate((candidate) => {
      candidate.taskKinds[kind].approvalClasses = [];
    });
    assert.ok(failures.some((failure) => failure.includes(`human approval class ${approval}`)));
  }
});
