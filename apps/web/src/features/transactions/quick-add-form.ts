import type { CreateDemoTransactionRequest } from "@zenval/contracts";
import { parseAmountInput } from "@/lib/money";

export type TransactionKind = CreateDemoTransactionRequest["kind"];

export type QuickAddDraft = {
  kind: TransactionKind;
  amount: string;
  category: string | null;
  sourceAccountId: string;
  destinationAccountId: string;
};

export type QuickAddErrors = Partial<Record<"amount" | "category" | "destination", true>>;

/**
 * Pure validation + mapping from form state to the API contract. Kept separate from the
 * component so the financial rules (positive integer VND, transfer pairing) are unit-tested.
 */
export function buildQuickAddRequest(
  draft: QuickAddDraft,
): { ok: true; request: CreateDemoTransactionRequest } | { ok: false; errors: QuickAddErrors } {
  const errors: QuickAddErrors = {};
  const amount = parseAmountInput(draft.amount, "VND");
  if (!amount) errors.amount = true;
  if (draft.kind === "transfer") {
    if (!draft.destinationAccountId || draft.destinationAccountId === draft.sourceAccountId) {
      errors.destination = true;
    }
  } else if (!draft.category) {
    errors.category = true;
  }
  if (!amount || Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    request: {
      workspaceId: "demo-workspace",
      kind: draft.kind,
      amount: { amount, currency: "VND" },
      sourceAccountId: draft.sourceAccountId,
      destinationAccountId: draft.kind === "transfer" ? draft.destinationAccountId : null,
      // A transfer between own accounts has no income/expense category.
      category: draft.kind === "transfer" ? null : draft.category,
    },
  };
}
