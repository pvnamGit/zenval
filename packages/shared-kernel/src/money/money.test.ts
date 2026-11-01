import { describe, expect, it } from "vitest";
import { Money } from "./money";

describe("Money", () => {
  it("adds decimal amounts without floating point drift", () => {
    const result = Money.from("0.1", "USD").add(Money.from("0.2", "USD"));

    expect(result.amount).toBe("0.3");
  });

  it("rejects arithmetic across currencies", () => {
    expect(() => Money.from("1", "VND").add(Money.from("1", "USD"))).toThrow("Currency mismatch");
  });
});
