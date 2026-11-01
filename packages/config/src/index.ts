import { z } from "zod";

const runtimeEnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const apiEnvironmentSchema = runtimeEnvironmentSchema.extend({
  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().positive().default(3001),
});

export const workerEnvironmentSchema = runtimeEnvironmentSchema.extend({
  WORKER_HOST: z.string().default("0.0.0.0"),
  WORKER_PORT: z.coerce.number().int().positive().default(3002),
});
