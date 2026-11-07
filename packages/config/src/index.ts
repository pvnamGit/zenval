import { z } from "zod";

const runtimeEnvironmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const allowedOriginsSchema = z
  .string()
  .default("http://localhost:3000")
  .transform((value, context) => {
    const origins = value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    for (const origin of origins) {
      if (!z.url().safeParse(origin).success) {
        context.addIssue({
          code: "custom",
          message: "WEB_ORIGIN must contain comma-separated absolute URLs",
        });
        return z.NEVER;
      }
    }

    return origins;
  });

export const apiEnvironmentSchema = runtimeEnvironmentSchema.extend({
  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().positive().default(3001),
  WEB_ORIGIN: allowedOriginsSchema,
});

export const workerEnvironmentSchema = runtimeEnvironmentSchema.extend({
  WORKER_HOST: z.string().default("0.0.0.0"),
  WORKER_PORT: z.coerce.number().int().positive().default(3002),
});
