/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "domain-is-pure",
      severity: "error",
      from: { path: "^packages/contexts/[^/]+/src/domain" },
      to: {
        path: "(^packages/contexts/[^/]+/src/(application|infrastructure|interface))|(@nestjs|drizzle-orm)",
      },
    },
    {
      name: "application-does-not-depend-on-outer-layers",
      severity: "error",
      from: { path: "^packages/contexts/[^/]+/src/application" },
      to: { path: "^packages/contexts/[^/]+/src/(infrastructure|interface)" },
    },
    {
      name: "web-does-not-import-server-contexts",
      severity: "error",
      from: { path: "^apps/web" },
      to: { path: "^packages/contexts" },
    },
    {
      name: "no-cross-context-infrastructure",
      severity: "error",
      from: { path: "^packages/contexts/([^/]+)/src" },
      to: { path: "^packages/contexts/([^/]+)/src/infrastructure" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.base.json" },
  },
};
