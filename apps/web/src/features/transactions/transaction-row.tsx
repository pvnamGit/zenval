"use client";

import type { DemoAccount, DemoTransaction } from "@zenval/contracts";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Money } from "@/components/ui/money";
import { intlLocale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/dates";

const statusTone: Record<DemoTransaction["status"], BadgeTone> = {
  posted: "neutral",
  expected: "forecast",
  draft: "amber",
};

const kindStyles = {
  expense: { icon: ArrowUpRight, className: "bg-danger-soft text-danger" },
  income: { icon: ArrowDownLeft, className: "bg-accent-soft text-accent" },
  transfer: { icon: ArrowLeftRight, className: "bg-info-soft text-info" },
} as const;

export function TransactionRow({
  transaction,
  accounts,
}: {
  transaction: DemoTransaction;
  accounts: ReadonlyMap<string, DemoAccount>;
}) {
  const t = useTranslations("transactions");
  const common = useTranslations("common");
  const locale = intlLocale(useLocale());
  const style = kindStyles[transaction.kind];
  const Icon = style.icon;
  const source = accounts.get(transaction.sourceAccountId);
  const destination = transaction.destinationAccountId
    ? accounts.get(transaction.destinationAccountId)
    : undefined;

  const accountLabel =
    transaction.kind === "transfer"
      ? `${source?.name ?? transaction.sourceAccountId} → ${destination?.name ?? transaction.destinationAccountId ?? "?"}`
      : (source?.name ?? transaction.sourceAccountId);

  return (
    <li
      className="flex items-center gap-3 px-4 py-3 sm:px-5"
      data-transaction-kind={transaction.kind}
      data-pnl-impact={String(transaction.pnlImpact)}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", style.className)}>
        <Icon aria-hidden className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-ink">{transaction.title}</p>
          {transaction.status !== "posted" ? (
            <Badge tone={statusTone[transaction.status]}>
              {t(`statuses.${transaction.status}`)}
            </Badge>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-soft">
          {transaction.kind === "transfer"
            ? common("noPnl")
            : (transaction.category ?? t("uncategorized"))}
          {" · "}
          {accountLabel}
        </p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <Money
          value={transaction.amount.value}
          direction={
            transaction.kind === "expense"
              ? "out"
              : transaction.kind === "income"
                ? "in"
                : "neutral"
          }
          tone={transaction.kind !== "transfer"}
          className={cn(
            "text-sm font-semibold",
            transaction.status !== "posted" && "opacity-70",
            transaction.kind === "transfer" && "text-ink-soft",
          )}
        />
        <time dateTime={transaction.occurredAt} className="text-[11px] text-ink-faint tabular">
          {formatTime(transaction.occurredAt, locale)}
        </time>
      </div>
    </li>
  );
}

export function accountMap(accounts: ReadonlyArray<DemoAccount>): Map<string, DemoAccount> {
  return new Map(accounts.map((account) => [account.id, account]));
}
