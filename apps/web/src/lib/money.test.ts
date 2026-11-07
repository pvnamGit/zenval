import { describe, expect, it } from "vitest";
import {
  compareDecimal,
  formatIntegerInput,
  formatMoney,
  maxAbsolute,
  parseAmountInput,
  ratioPercent,
} from "./money";

const vnd = (amount: string) => ({ amount, currency: "VND" });

describe("formatMoney", () => {
  it("formats VND without minor units and with explicit direction signs", () => {
    expect(formatMoney(vnd("12400000"), "vi-VN")).toBe("12.400.000\u00a0₫");
    expect(formatMoney(vnd("486000"), "vi-VN", { direction: "out" })).toBe("−486.000\u00a0₫");
    expect(formatMoney(vnd("32000000"), "vi-VN", { direction: "in" })).toBe("+32.000.000\u00a0₫");
  });

  it("uses the amount sign when no direction is given and never shows −0", () => {
    expect(formatMoney(vnd("-2000000"), "vi-VN")).toBe("−2.000.000\u00a0₫");
    expect(formatMoney(vnd("0"), "vi-VN")).toBe("0\u00a0₫");
  });

  it("formats beyond Number.MAX_SAFE_INTEGER exactly (no binary floating point)", () => {
    expect(formatMoney(vnd("90071992547409931"), "en-US", { hideCurrency: true })).toBe(
      "90,071,992,547,409,931",
    );
    expect(
      formatMoney({ amount: "12345678901234567.89", currency: "USD" }, "en-US", {
        hideCurrency: true,
      }),
    ).toBe("12,345,678,901,234,567.89");
  });

  it("rejects non-decimal input", () => {
    expect(() => formatMoney(vnd("1e6"), "vi-VN")).toThrow(RangeError);
  });
});

describe("parseAmountInput", () => {
  it("accepts grouped VND input as a positive integer string", () => {
    expect(parseAmountInput("1.250.000", "VND")).toBe("1250000");
    expect(parseAmountInput("1,250,000", "VND")).toBe("1250000");
    expect(parseAmountInput(" 0086 000 ", "VND")).toBe("86000");
  });

  it("rejects empty, zero, negative, and fractional VND", () => {
    expect(parseAmountInput("", "VND")).toBeNull();
    expect(parseAmountInput("0", "VND")).toBeNull();
    expect(parseAmountInput("-5000", "VND")).toBeNull();
    expect(parseAmountInput("12abc", "VND")).toBeNull();
  });

  it("keeps up to two decimals for currencies with minor units", () => {
    expect(parseAmountInput("1,234.56", "USD")).toBe("1234.56");
    expect(parseAmountInput("10.5", "USD")).toBe("10.5");
  });
});

describe("formatIntegerInput", () => {
  it("regroups digits while typing", () => {
    expect(formatIntegerInput("1250000", "vi-VN")).toBe("1.250.000");
    expect(formatIntegerInput("abc", "vi-VN")).toBe("");
  });
});

describe("ratio helpers", () => {
  it("computes display ratios exactly from decimal strings", () => {
    expect(ratioPercent(vnd("8000000"), vnd("23150000"))).toBe(34.55);
    expect(ratioPercent(vnd("5"), vnd("0"))).toBe(0);
    expect(ratioPercent(vnd("200"), vnd("100"))).toBe(100);
  });

  it("compares decimals and finds the largest absolute value", () => {
    expect(compareDecimal("10.5", "10.50")).toBe(0);
    expect(compareDecimal("-1", "0.01")).toBe(-1);
    expect(maxAbsolute([vnd("100"), vnd("-300"), vnd("200")])).toEqual(vnd("300"));
    expect(maxAbsolute([])).toBeNull();
  });
});
