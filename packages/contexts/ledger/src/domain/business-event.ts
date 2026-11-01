import { Money } from "@zenval/shared-kernel";

export interface LedgerEntryInput {
  readonly accountId: string;
  readonly amount: Money;
}

export class BusinessEvent {
  private constructor(
    readonly id: string,
    readonly workspaceId: string,
    readonly entries: readonly LedgerEntryInput[],
  ) {}

  static post(input: {
    id: string;
    workspaceId: string;
    entries: readonly LedgerEntryInput[];
  }): BusinessEvent {
    if (input.entries.length < 2) {
      throw new Error("A business event requires at least two ledger entries");
    }

    const [firstEntry] = input.entries;
    if (!firstEntry) {
      throw new Error("A business event requires ledger entries");
    }

    const balance = input.entries.reduce(
      (total, entry) => total.add(entry.amount),
      Money.zero(firstEntry.amount.currency.code),
    );

    if (!balance.isZero()) {
      throw new Error("Ledger entries must balance to zero");
    }

    return new BusinessEvent(input.id, input.workspaceId, [...input.entries]);
  }
}
