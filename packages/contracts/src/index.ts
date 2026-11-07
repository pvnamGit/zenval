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

export const dashboardAmountSchema = z.object({
  value: moneySchema,
  display: z.string().min(1),
});

export const dashboardSnapshotSchema = z.object({
  mode: z.literal("demo"),
  workspaceId: z.literal("demo-workspace"),
  asOf: z.iso.datetime(),
  safeToSpend: z.object({
    amount: dashboardAmountSchema,
    horizon: z.string().min(1),
    sourceSummary: z.string().min(1),
    calculationVersion: z.string().min(1),
  }),
  cashFlow: z.object({
    projectedLow: dashboardAmountSchema,
    confidence: z.enum(["medium"]),
    scenario: z.literal("base"),
  }),
  dueSoon: z.array(
    z.object({
      id: z.string().min(1),
      dueOn: z.string().date(),
      kind: z.enum(["expense", "debt-installment"]),
      title: z.string().min(1),
      amount: dashboardAmountSchema,
      detail: z.string().min(1),
    }),
  ),
  reviewCount: z.number().int().nonnegative(),
  netWorth: z.object({
    amount: dashboardAmountSchema,
    assets: dashboardAmountSchema,
    liabilities: dashboardAmountSchema,
    monthChangeLabel: z.string().min(1),
  }),
});

export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;

export const demoAccountSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.literal("demo-workspace"),
  name: z.string().min(1),
  institution: z.string().min(1),
  maskedReference: z.string().min(1),
  kind: z.enum(["bank", "savings", "wallet"]),
  balance: dashboardAmountSchema,
  reconciliation: z.enum(["reconciled", "manual"]),
  asOf: z.iso.datetime(),
  icon: z.string().min(1).max(3),
});

export const demoTransactionSchema = z
  .object({
    id: z.string().min(1),
    workspaceId: z.literal("demo-workspace"),
    occurredAt: z.iso.datetime(),
    kind: z.enum(["expense", "income", "transfer"]),
    status: z.enum(["posted", "expected", "draft"]),
    title: z.string().min(1),
    category: z.string().min(1).nullable(),
    amount: dashboardAmountSchema,
    pnlImpact: z.boolean(),
    sourceAccountId: z.string().min(1),
    destinationAccountId: z.string().min(1).nullable(),
    note: z.string().max(240),
    source: z.literal("mock-json"),
  })
  .superRefine((transaction, context) => {
    if (transaction.status !== "posted" && transaction.pnlImpact) {
      context.addIssue({
        code: "custom",
        path: ["pnlImpact"],
        message: "Non-posted demo records have no current P&L impact",
      });
    }
    if (transaction.kind === "transfer") {
      if (transaction.pnlImpact) {
        context.addIssue({
          code: "custom",
          path: ["pnlImpact"],
          message: "Transfer has no P&L impact",
        });
      }
      if (
        !transaction.destinationAccountId ||
        transaction.destinationAccountId === transaction.sourceAccountId
      ) {
        context.addIssue({
          code: "custom",
          path: ["destinationAccountId"],
          message: "Transfer requires a different destination account",
        });
      }
    }
  });

export const demoReviewItemSchema = z
  .object({
    id: z.string().min(1),
    workspaceId: z.literal("demo-workspace"),
    bucket: z.enum(["review", "pending", "posted"]),
    kind: z.enum(["transfer", "duplicate", "variance", "expected", "expense"]),
    title: z.string().min(1),
    amount: dashboardAmountSchema,
    detail: z.string().min(1),
    pnlImpact: z.boolean().nullable(),
  })
  .superRefine((item, context) => {
    if (item.kind === "transfer" && item.pnlImpact !== false) {
      context.addIssue({
        code: "custom",
        path: ["pnlImpact"],
        message: "Transfer review items must explicitly have no P&L impact",
      });
    }
    if (item.bucket !== "posted" && item.pnlImpact) {
      context.addIssue({
        code: "custom",
        path: ["pnlImpact"],
        message: "Non-posted review items have no current P&L impact",
      });
    }
  });

export const demoFinanceSnapshotSchema = z.object({
  mode: z.literal("demo"),
  workspaceId: z.literal("demo-workspace"),
  asOf: z.iso.datetime(),
  source: z.literal("mock-json"),
  totalAssets: dashboardAmountSchema,
  accounts: z.array(demoAccountSchema),
  transactions: z.array(demoTransactionSchema),
  reviewItems: z.array(demoReviewItemSchema),
});

export const createDemoTransactionRequestSchema = z
  .strictObject({
    workspaceId: z.literal("demo-workspace"),
    kind: z.enum(["expense", "income", "transfer"]),
    amount: z.object({
      amount: z.string().regex(/^[1-9]\d*$/, "Demo VND amount must be a positive integer string"),
      currency: z.literal("VND"),
    }),
    sourceAccountId: z.string().min(1),
    destinationAccountId: z.string().min(1).nullable(),
    category: z.string().min(1).nullable(),
  })
  .superRefine((request, context) => {
    if (request.kind === "transfer") {
      if (
        !request.destinationAccountId ||
        request.destinationAccountId === request.sourceAccountId
      ) {
        context.addIssue({
          code: "custom",
          path: ["destinationAccountId"],
          message: "Transfer requires a different destination account",
        });
      }
    } else if (request.destinationAccountId) {
      context.addIssue({
        code: "custom",
        path: ["destinationAccountId"],
        message: "Only transfers can have a destination account",
      });
    }
  });

export const createDemoTransactionResponseSchema = z.object({
  transaction: demoTransactionSchema,
  replayed: z.boolean(),
});

export const demoWorkspaceFixtureSchema = z.object({
  dashboard: dashboardSnapshotSchema,
  finance: demoFinanceSnapshotSchema,
});

export type DemoAccount = z.infer<typeof demoAccountSchema>;
export type DemoTransaction = z.infer<typeof demoTransactionSchema>;
export type DemoReviewItem = z.infer<typeof demoReviewItemSchema>;
export type DemoFinanceSnapshot = z.infer<typeof demoFinanceSnapshotSchema>;
export type CreateDemoTransactionRequest = z.infer<typeof createDemoTransactionRequestSchema>;
export type CreateDemoTransactionResponse = z.infer<typeof createDemoTransactionResponseSchema>;
