import type { MoneyDto } from "@zenval/contracts";

/**
 * Money helpers for presentation only.
 *
 * Amounts arrive as exact decimal strings (`MoneyDto`). They are never converted to a binary
 * floating-point `number`: `Intl.NumberFormat#format` accepts decimal strings and formats them
 * exactly, and arithmetic (when unavoidable) is done on `bigint` minor units.
 */

const zeroMinorUnitCurrencies = new Set(["VND", "JPY", "KRW"]);
const decimalPattern = /^-?\d+(\.\d+)?$/;

export type MoneyDirection = "in" | "out" | "neutral";

export type FormatMoneyOptions = {
  /** Prefix `+` for inflows and `−` for outflows. Amount sign is ignored when set. */
  direction?: MoneyDirection;
  /** Compact notation, e.g. `12,4 Tr ₫`. */
  compact?: boolean;
  /** Render digits only, without the currency symbol. */
  hideCurrency?: boolean;
};

export function minorUnitDigits(currency: string): number {
  return zeroMinorUnitCurrencies.has(currency) ? 0 : 2;
}

function formatDecimalString(formatter: Intl.NumberFormat, value: string): string {
  // `format` accepts exact decimal strings (ECMA-402 NumberFormat v3); the lib typing predates it.
  return (formatter.format as unknown as (input: string) => string)(value);
}

export function formatMoney(
  money: MoneyDto,
  locale: string,
  options: FormatMoneyOptions = {},
): string {
  if (!decimalPattern.test(money.amount)) {
    throw new RangeError("Money amount must be a decimal string");
  }
  const negative = money.amount.startsWith("-");
  const absolute = negative ? money.amount.slice(1) : money.amount;
  const digits = minorUnitDigits(money.currency);

  const formatter = new Intl.NumberFormat(locale, {
    ...(options.hideCurrency ? {} : { style: "currency", currency: money.currency }),
    ...(options.compact
      ? { notation: "compact", maximumFractionDigits: 1 }
      : { minimumFractionDigits: digits, maximumFractionDigits: Math.max(digits, 2) }),
  });
  const body = formatDecimalString(formatter, absolute);

  const direction = options.direction;
  if (direction === "in") return `+${body}`;
  if (direction === "out") return `−${body}`;
  if (direction === "neutral") return body;
  return negative && !/^0(\.0+)?$/.test(absolute) ? `−${body}` : body;
}

/** True when the decimal string is negative and non-zero. */
export function isNegative(money: MoneyDto): boolean {
  return money.amount.startsWith("-") && !/^-0(\.0+)?$/.test(money.amount);
}

/**
 * Parses a user-typed amount into a positive minor-unit string for the given currency.
 * Grouping separators and spaces are ignored. Returns `null` for empty, zero, negative, or
 * over-precise input.
 */
export function parseAmountInput(raw: string, currency: string): string | null {
  const digits = minorUnitDigits(currency);
  const cleaned = raw.replace(/[\s.,\u00a0_']/g, (match, offset: number, whole: string) => {
    // Treat the last `.`/`,` as a decimal separator only for currencies with minor units.
    if (digits > 0 && (match === "." || match === ",")) {
      const lastSeparator = Math.max(whole.lastIndexOf("."), whole.lastIndexOf(","));
      if (offset === lastSeparator && whole.length - offset - 1 <= digits) return ".";
    }
    return "";
  });
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const [whole = "", fraction = ""] = cleaned.split(".");
  if (fraction.length > digits) return null;
  const normalizedWhole = whole.replace(/^0+(?=\d)/, "");
  const value = fraction ? `${normalizedWhole}.${fraction}` : normalizedWhole;
  if (/^0(\.0+)?$/.test(value)) return null;
  return value;
}

/** Re-groups digits while the user types (VND-style integer input). */
export function formatIntegerInput(raw: string, locale: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (!digits) return "";
  return new Intl.NumberFormat(locale).format(BigInt(digits));
}

/** Percentage (0–100) of `part` in `total`, using bigint minor units. Display only. */
export function ratioPercent(part: MoneyDto, total: MoneyDto): number {
  if (part.currency !== total.currency) throw new RangeError("Currency mismatch");
  const scale = 10n ** BigInt(Math.max(fractionLength(part.amount), fractionLength(total.amount)));
  const toUnits = (amount: string) => {
    const [whole = "0", fraction = ""] = amount.replace("-", "").split(".");
    const padded = fraction.padEnd(scale.toString().length - 1, "0");
    return BigInt(whole) * scale + BigInt(padded || "0");
  };
  const totalUnits = toUnits(total.amount);
  if (totalUnits === 0n) return 0;
  const basisPoints = (toUnits(part.amount) * 10_000n) / totalUnits;
  const clamped = basisPoints > 10_000n ? 10_000n : basisPoints;
  // Converting a bounded integer (0–10000) to number is exact.
  return Number(clamped) / 100;
}

function fractionLength(amount: string): number {
  return amount.split(".")[1]?.length ?? 0;
}

/** Exact comparison of two decimal strings (−1, 0, 1). */
export function compareDecimal(a: string, b: string): number {
  const scale = Math.max(fractionLength(a), fractionLength(b));
  const toScaled = (value: string) => {
    const negative = value.startsWith("-");
    const [whole = "0", fraction = ""] = (negative ? value.slice(1) : value).split(".");
    const units = BigInt(whole) * 10n ** BigInt(scale) + BigInt(fraction.padEnd(scale, "0") || "0");
    return negative ? -units : units;
  };
  const difference = toScaled(a) - toScaled(b);
  return difference === 0n ? 0 : difference > 0n ? 1 : -1;
}

/** Largest absolute amount in a list (same currency), for chart scaling. */
export function maxAbsolute(values: ReadonlyArray<MoneyDto>): MoneyDto | null {
  let max: MoneyDto | null = null;
  for (const value of values) {
    const absolute = { ...value, amount: value.amount.replace(/^-/, "") };
    if (!max || compareDecimal(absolute.amount, max.amount) > 0) max = absolute;
  }
  return max;
}

/** Formats an exact decimal quantity (e.g. units held) for display. */
export function formatQuantity(quantity: string, locale: string): string {
  return formatDecimalString(new Intl.NumberFormat(locale, { maximumFractionDigits: 8 }), quantity);
}
