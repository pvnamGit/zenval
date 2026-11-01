const KNOWN_TASK_KINDS = new Set([
  "product-code",
  "financial-change",
  "harness-operations",
  "migration",
  "external-effect",
  "release",
]);

export const TRUSTED_GATE_PROFILES = new Map([
  ["structure", ["harness:validate"]],
  ["quick", ["harness:validate", "harness:quick"]],
  ["full", ["harness:validate", "harness:quick", "harness:full"]],
]);
const APPROVAL_CLASSES = new Set([
  "financial-meaning",
  "destructive-migration",
  "external-effect",
  "release",
  "security-exception",
]);
const UNSAFE_FIELD_NAMES = new Set([
  "arg",
  "args",
  "command",
  "commands",
  "executable",
  "script",
  "scripts",
  "shell",
]);
const TASK_KIND_FIELDS = new Set([
  "description",
  "skills",
  "gateProfile",
  "approvalClasses",
  "writeScope",
  "maxAttempts",
]);
const REQUIRED_APPROVALS = new Map([
  ["financial-change", "financial-meaning"],
  ["migration", "destructive-migration"],
  ["external-effect", "external-effect"],
  ["release", "release"],
]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function findUnsafeFields(value, path = "registry", failures = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      findUnsafeFields(item, `${path}[${index}]`, failures);
    });
    return failures;
  }
  if (!isPlainObject(value)) return failures;
  for (const [key, item] of Object.entries(value)) {
    if (UNSAFE_FIELD_NAMES.has(key.toLowerCase())) {
      failures.push(`${path} contains forbidden command-like field ${key}`);
    }
    findUnsafeFields(item, `${path}.${key}`, failures);
  }
  return failures;
}

function validateStringArray(value, path, { allowEmpty = false } = {}) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0)) {
    return [`${path} must be ${allowEmpty ? "an" : "a non-empty"} array`];
  }
  const failures = [];
  const seen = new Set();
  for (const item of value) {
    if (typeof item !== "string" || item.length === 0) {
      failures.push(`${path} must contain non-empty strings`);
      continue;
    }
    if (seen.has(item)) failures.push(`${path} contains duplicate value ${item}`);
    seen.add(item);
  }
  return failures;
}

function validateScopePath(path, field) {
  const segments = typeof path === "string" ? path.split("/") : [];
  if (
    typeof path !== "string" ||
    path.length === 0 ||
    path === "." ||
    path.startsWith("/") ||
    path.includes("\\") ||
    segments.some((segment) => segment === "" || segment === "." || segment === "..") ||
    /[*?[\]{}]/u.test(path)
  ) {
    return [`${field} contains unsafe repository path ${String(path)}`];
  }
  return [];
}

export function validateTaskKindRegistry(registry, { knownSkills, availableScripts }) {
  const failures = findUnsafeFields(registry);
  if (!isPlainObject(registry)) return [...failures, "registry must be an object"];
  if (registry.version !== 1) failures.push("registry version must equal 1");
  for (const key of Object.keys(registry)) {
    if (!new Set(["version", "taskKinds"]).has(key))
      failures.push(`registry has unknown field ${key}`);
  }
  if (!isPlainObject(registry.taskKinds)) {
    failures.push("registry.taskKinds must be an object");
    return failures;
  }

  if (availableScripts) {
    for (const [profile, scripts] of TRUSTED_GATE_PROFILES) {
      for (const packageScript of scripts) {
        if (!availableScripts.has(packageScript)) {
          failures.push(
            `trusted gate profile ${profile} requires missing package script ${packageScript}`,
          );
        }
      }
    }
  }

  for (const requiredKind of KNOWN_TASK_KINDS) {
    if (!Object.hasOwn(registry.taskKinds, requiredKind)) {
      failures.push(`registry is missing task kind ${requiredKind}`);
    }
  }

  for (const [kind, config] of Object.entries(registry.taskKinds)) {
    const path = `taskKinds.${kind}`;
    if (!KNOWN_TASK_KINDS.has(kind)) failures.push(`registry has unknown task kind ${kind}`);
    if (!isPlainObject(config)) {
      failures.push(`${path} must be an object`);
      continue;
    }
    for (const field of Object.keys(config)) {
      if (!TASK_KIND_FIELDS.has(field)) failures.push(`${path} has unknown field ${field}`);
    }
    if (typeof config.description !== "string" || config.description.length === 0) {
      failures.push(`${path}.description must be a non-empty string`);
    }

    failures.push(...validateStringArray(config.skills, `${path}.skills`));
    for (const skill of Array.isArray(config.skills) ? config.skills : []) {
      if (!knownSkills.has(skill)) failures.push(`${path} references unknown skill ${skill}`);
    }
    if (kind === "financial-change" && !config.skills?.includes("zenval-financial-correctness")) {
      failures.push(`${path} must require zenval-financial-correctness`);
    }

    if (!TRUSTED_GATE_PROFILES.has(config.gateProfile)) {
      failures.push(`${path} references unknown gate profile ${String(config.gateProfile)}`);
    }

    failures.push(
      ...validateStringArray(config.approvalClasses, `${path}.approvalClasses`, {
        allowEmpty: true,
      }),
    );
    for (const approval of Array.isArray(config.approvalClasses) ? config.approvalClasses : []) {
      if (!APPROVAL_CLASSES.has(approval)) {
        failures.push(`${path} references invalid approval class ${approval}`);
      }
    }
    const requiredApproval = REQUIRED_APPROVALS.get(kind);
    if (requiredApproval && !config.approvalClasses?.includes(requiredApproval)) {
      failures.push(`${path} must require human approval class ${requiredApproval}`);
    }

    if (!isPlainObject(config.writeScope)) {
      failures.push(`${path}.writeScope must be an object`);
    } else {
      for (const field of Object.keys(config.writeScope)) {
        if (!new Set(["allowedPaths", "deniedPaths"]).has(field)) {
          failures.push(`${path}.writeScope has unknown field ${field}`);
        }
      }
      failures.push(
        ...validateStringArray(config.writeScope.allowedPaths, `${path}.writeScope.allowedPaths`),
        ...validateStringArray(config.writeScope.deniedPaths, `${path}.writeScope.deniedPaths`, {
          allowEmpty: true,
        }),
      );
      for (const scopePath of [
        ...(Array.isArray(config.writeScope.allowedPaths) ? config.writeScope.allowedPaths : []),
        ...(Array.isArray(config.writeScope.deniedPaths) ? config.writeScope.deniedPaths : []),
      ]) {
        failures.push(...validateScopePath(scopePath, `${path}.writeScope`));
      }
      const allowedPaths = new Set(
        Array.isArray(config.writeScope.allowedPaths) ? config.writeScope.allowedPaths : [],
      );
      for (const deniedPath of Array.isArray(config.writeScope.deniedPaths)
        ? config.writeScope.deniedPaths
        : []) {
        if (allowedPaths.has(deniedPath)) {
          failures.push(`${path}.writeScope cannot both allow and deny ${deniedPath}`);
        }
      }
    }

    if (!Number.isInteger(config.maxAttempts) || config.maxAttempts < 1 || config.maxAttempts > 3) {
      failures.push(`${path}.maxAttempts must be an integer from 1 through 3`);
    }
  }

  return failures;
}

export function validateTaskKindSelection(registry, kind) {
  if (typeof kind !== "string" || !KNOWN_TASK_KINDS.has(kind)) {
    return [`unknown task kind ${String(kind)}`];
  }
  if (!isPlainObject(registry?.taskKinds) || !Object.hasOwn(registry.taskKinds, kind)) {
    return [`task kind ${kind} is not present in the trusted registry`];
  }
  return [];
}
