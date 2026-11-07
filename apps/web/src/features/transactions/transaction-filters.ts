import type { DemoTransaction } from "@zenval/contracts";
import { localDayKey } from "@/lib/dates";

export type TransactionFilters = {
  query: string;
  kind: "all" | DemoTransaction["kind"];
  status: "all" | DemoTransaction["status"];
  accountId: "all" | string;
};

export const defaultFilters: TransactionFilters = {
  query: "",
  kind: "all",
  status: "all",
  accountId: "all",
};

/** Session drafts first (newest first), then server rows; a server row wins on id collision. */
export function mergeWithDrafts(
  server: ReadonlyArray<DemoTransaction>,
  drafts: ReadonlyArray<DemoTransaction>,
): DemoTransaction[] {
  const serverIds = new Set(server.map((transaction) => transaction.id));
  return [...drafts.filter((draft) => !serverIds.has(draft.id)), ...server].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  );
}

export function filterTransactions(
  transactions: ReadonlyArray<DemoTransaction>,
  filters: TransactionFilters,
): DemoTransaction[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return transactions.filter((transaction) => {
    if (filters.kind !== "all" && transaction.kind !== filters.kind) return false;
    if (filters.status !== "all" && transaction.status !== filters.status) return false;
    if (
      filters.accountId !== "all" &&
      transaction.sourceAccountId !== filters.accountId &&
      transaction.destinationAccountId !== filters.accountId
    ) {
      return false;
    }
    if (!query) return true;
    return [transaction.title, transaction.category ?? "", transaction.note]
      .join(" ")
      .toLocaleLowerCase()
      .includes(query);
  });
}

/** Groups by local calendar day, preserving the (already sorted) order. */
export function groupByDay(
  transactions: ReadonlyArray<DemoTransaction>,
): Array<{ day: string; items: DemoTransaction[] }> {
  const groups: Array<{ day: string; items: DemoTransaction[] }> = [];
  for (const transaction of transactions) {
    const day = localDayKey(transaction.occurredAt);
    const last = groups.at(-1);
    if (last && last.day === day) last.items.push(transaction);
    else groups.push({ day, items: [transaction] });
  }
  return groups;
}

