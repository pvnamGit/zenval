import { z } from "zod";

export const moneySchema = z.object({
  amount: z.string().regex(/^-?\d+(\.\d+)?$/),
  currency: z.string().regex(/^[A-Z]{3}$/),
});

export type MoneyDto = z.infer<typeof moneySchema>;

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.enum(["zenval.api", "zenval.worker"]),
  timestamp: z.iso.datetime(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
