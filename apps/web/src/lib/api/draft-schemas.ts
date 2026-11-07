/**
 * DRAFT contracts for modules whose API endpoints do not exist yet.
 *
 * These describe what the web app expects so the mock adapter and screens can be built ahead of
 * the backend. When an endpoint lands, move the schema to `@zenval/contracts` (the single
 * browser-safe source of truth shared with `apps/api`) and delete it here. Do not add financial
 * calculations to the web app to fill gaps: every derived amount below is produced server-side and
 * carries `asOf`, `source`, and `calculationVersion`.
 */
import { dashboardAmountSchema } from "@zenval/contracts";
import { z } from "zod";

const amount = dashboardAmountSchema;
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/);
const decimalString = z.string().regex(/^-?\d+(\.\d+)?$/);

const derivedMeta = {
  workspaceId: z.string().min(1),
  asOf: z.iso.datetime(),
  source: z.string().min(1),
  calculationVersion: z.string().min(1),
};

export const commitmentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(["fixed-expense", "debt-installment", "saving", "income"]),
  cadence: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  amount,
  tolerance: amount.nullable(),
  nextDueOn: calendarDate,
  status: z.enum(["scheduled", "due", "paid", "overdue", "skipped"]),
  priority: z.enum(["essential", "flexible"]),
  accountId: z.string().min(1),
  /** Debt installments only affect P&L through interest and fees. */
  pnlImpact: z.enum(["full", "interest-only", "none"]),
});

export const goalSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  target: amount,
  contributed: amount,
  targetDate: calendarDate.nullable(),
  status: z.enum(["active", "paused", "achieved"]),
  linkedTo: z.string().min(1),
  /** Server-computed progress in basis points (0–10000). */
  progressBps: z.number().int().min(0).max(10_000),
});

export const planningSnapshotSchema = z.object({
  ...derivedMeta,
  monthCommitted: amount,
  monthPaid: amount,
  commitments: z.array(commitmentSchema),
  goals: z.array(goalSchema),
});

export const debtSchema = z.object({
  id: z.string().min(1),
  direction: z.enum(["payable", "receivable"]),
  name: z.string().min(1),
  counterparty: z.string().min(1),
  originalPrincipal: amount,
  outstandingPrincipal: amount,
  interestRateBps: z.number().int().nonnegative(),
  status: z.enum(["active", "overdue", "settled"]),
  nextInstallment: z
    .object({
      dueOn: calendarDate,
      principal: amount,
      interest: amount,
      fee: amount,
      total: amount,
    })
    .nullable(),
  /** Receivables only: user-estimated recovery probability (basis points). */
  recoveryProbabilityBps: z.number().int().min(0).max(10_000).nullable(),
  repaidBps: z.number().int().min(0).max(10_000),
});

export const debtsSnapshotSchema = z.object({
  ...derivedMeta,
  totalPayable: amount,
  totalReceivable: amount,
  expectedRecoverable: amount,
  debts: z.array(debtSchema),
});

export const holdingSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  assetClass: z.enum(["equity", "fund", "gold", "crypto", "bond"]),
  quantity: decimalString,
  price: amount,
  priceAsOf: z.iso.datetime(),
  priceSource: z.enum(["provider", "manual"]),
  stale: z.boolean(),
  costBasis: amount,
  marketValue: amount,
  /** Signed decimal: negative is an unrealized loss. */
  unrealizedPnl: amount,
  allocationBps: z.number().int().min(0).max(10_000),
});

export const investmentActivitySchema = z.object({
  id: z.string().min(1),
  occurredOn: calendarDate,
  kind: z.enum(["buy", "sell", "dividend", "valuation"]),
  holdingId: z.string().min(1),
  title: z.string().min(1),
  amount,
});

export const investmentsSnapshotSchema = z.object({
  ...derivedMeta,
  totalMarketValue: amount,
  totalCostBasis: amount,
  unrealizedPnl: amount,
  holdings: z.array(holdingSchema),
  activities: z.array(investmentActivitySchema),
});

export const reportsSnapshotSchema = z.object({
  ...derivedMeta,
  monthly: z.array(z.object({ month: yearMonth, income: amount, expense: amount, net: amount })),
  netWorth: z.array(
    z.object({ month: yearMonth, assets: amount, liabilities: amount, netWorth: amount }),
  ),
  spendingByCategory: z.array(
    z.object({
      category: z.string().min(1),
      amount,
      shareBps: z.number().int().min(0).max(10_000),
    }),
  ),
});

export const reviewResolutionSchema = z.object({
  itemId: z.string().min(1),
  action: z.enum(["approve", "dismiss"]),
  resolvedAt: z.iso.datetime(),
});

export type Commitment = z.infer<typeof commitmentSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type PlanningSnapshot = z.infer<typeof planningSnapshotSchema>;
export type Debt = z.infer<typeof debtSchema>;
export type DebtsSnapshot = z.infer<typeof debtsSnapshotSchema>;
export type Holding = z.infer<typeof holdingSchema>;
export type InvestmentActivity = z.infer<typeof investmentActivitySchema>;
export type InvestmentsSnapshot = z.infer<typeof investmentsSnapshotSchema>;
export type ReportsSnapshot = z.infer<typeof reportsSnapshotSchema>;
export type ReviewResolution = z.infer<typeof reviewResolutionSchema>;
export type ReviewAction = ReviewResolution["action"];
