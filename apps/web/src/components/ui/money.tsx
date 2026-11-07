"use client";

import type { MoneyDto } from "@zenval/contracts";
import { useLocale } from "next-intl";
import { intlLocale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { type FormatMoneyOptions, formatMoney, isNegative } from "@/lib/money";

type MoneyProps = FormatMoneyOptions & {
  value: MoneyDto;
  className?: string | undefined;
  /** Colour inflows/outflows (or the sign of the amount when no direction is given). */
  tone?: boolean;
};

export function useMoneyFormatter() {
  const locale = intlLocale(useLocale());
  return (value: MoneyDto, options?: FormatMoneyOptions) => formatMoney(value, locale, options);
}

export function Money({ value, className, tone = false, ...options }: MoneyProps) {
  const format = useMoneyFormatter();
  const direction = options.direction;
  const negative = direction ? direction === "out" : isNegative(value);
  const positive = direction ? direction === "in" : !negative && value.amount !== "0";
  return (
    <span
      className={cn(
        "tabular whitespace-nowrap",
        tone && negative && "text-danger",
        tone && positive && "text-accent",
        className,
      )}
    >
      {format(value, options)}
    </span>
  );
}
