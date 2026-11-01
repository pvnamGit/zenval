import { Money } from "@zenval/shared-kernel";
import { describe, expect, it } from "vitest";
import { BusinessEvent } from "./business-event";

describe("BusinessEvent", () => {
  it("posts a balanced transfer", () => {
    const event = BusinessEvent.post({
      id: "event-1",
      workspaceId: "workspace-1",
      entries: [
        { accountId: "cash", amount: Money.from("-100000", "VND") },
        { accountId: "savings", amount: Money.from("100000", "VND") },
      ],
    });

    expect(event.entries).toHaveLength(2);
  });

  it("rejects an unbalanced financial event", () => {
    expect(() =>
      BusinessEvent.post({
        id: "event-1",
        workspaceId: "workspace-1",
        entries: [
          { accountId: "cash", amount: Money.from("-100000", "VND") },
          { accountId: "expense", amount: Money.from("90000", "VND") },
        ],
      }),
    ).toThrow("Ledger entries must balance to zero");
  });
});
