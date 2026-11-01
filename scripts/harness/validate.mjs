import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateTaskKindRegistry } from "./task-kinds.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const failures = [];
const requiredKnowledge = [
  "AGENTS.md",
  "docs/PRD.md",
  "docs/ARCHITECTURE.md",
  "docs/agent-harness/README.md",
  "docs/agent-harness/graph.json",
  "docs/agent-harness/task-kinds.json",
  "docs/exec-plans/TEMPLATE.md",
  ".adlc/config.json",
];
const requiredSkills = [
  "zenval-adlc-delivery",
  "zenval-financial-correctness",
  "zenval-change-verification",
];
const knownSkills = new Set(requiredSkills);

for (const path of requiredKnowledge) {
  if (!existsSync(join(root, path))) failures.push(`missing knowledge artifact: ${path}`);
}

const agents = readFileSync(join(root, "AGENTS.md"), "utf8");
for (const path of requiredKnowledge.slice(1, 7)) {
  if (!agents.includes(path)) failures.push(`AGENTS.md does not map: ${path}`);
}

for (const skill of requiredSkills) {
  const base = join(root, ".codex/skills", skill);
  const skillFile = join(base, "SKILL.md");
  const uiFile = join(base, "agents/openai.yaml");
  if (!existsSync(skillFile) || !existsSync(uiFile)) {
    failures.push(`incomplete skill: ${skill}`);
    continue;
  }
  const text = readFileSync(skillFile, "utf8");
  if (!text.includes(`name: ${skill}`) || text.includes("[TODO:")) {
    failures.push(`invalid or unfinished skill: ${skill}`);
  }
}

try {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const taskKinds = JSON.parse(
    readFileSync(join(root, "docs/agent-harness/task-kinds.json"), "utf8"),
  );
  const availableScripts = new Set(Object.keys(packageJson.scripts ?? {}));
  for (const failure of validateTaskKindRegistry(taskKinds, { knownSkills, availableScripts })) {
    failures.push(`task-kind registry: ${failure}`);
  }
} catch (error) {
  failures.push(`task-kind registry is not readable JSON: ${error.message}`);
}

const graph = JSON.parse(readFileSync(join(root, "docs/agent-harness/graph.json"), "utf8"));
const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
const requiredNodeFields = [
  "purpose",
  "dependsOn",
  "inputs",
  "outputs",
  "allowedTools",
  "evidence",
  "acceptance",
  "maxAttempts",
  "stopCondition",
  "idempotency",
  "escalationOwner",
];

if (!nodes.has(graph.entry)) failures.push(`graph entry does not exist: ${graph.entry}`);
for (const terminal of graph.terminal) {
  if (!nodes.has(terminal)) failures.push(`graph terminal does not exist: ${terminal}`);
}
for (const [id, node] of nodes) {
  for (const field of requiredNodeFields) {
    const emptyCollection = field !== "dependsOn" && node[field]?.length === 0;
    if (node[field] === undefined || node[field] === "" || emptyCollection) {
      failures.push(`graph node ${id} is missing ${field}`);
    }
  }
  if (!Number.isInteger(node.maxAttempts) || node.maxAttempts < 1 || node.maxAttempts > 3) {
    failures.push(`graph node ${id} must bound maxAttempts to 1..3`);
  }
  for (const dependency of node.dependsOn) {
    if (!nodes.has(dependency))
      failures.push(`graph node ${id} has unknown dependency ${dependency}`);
  }
}

const visiting = new Set();
const visited = new Set();
function visit(id) {
  if (visiting.has(id)) {
    failures.push(`graph contains a dependency cycle at ${id}`);
    return;
  }
  if (visited.has(id)) return;
  visiting.add(id);
  for (const dependency of nodes.get(id)?.dependsOn ?? []) visit(dependency);
  visiting.delete(id);
  visited.add(id);
}
for (const id of nodes.keys()) visit(id);

if (failures.length > 0) {
  console.error("Harness validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Harness valid: ${nodes.size} graph nodes, ${requiredSkills.length} skills, ${requiredKnowledge.length} knowledge artifacts.`,
);
