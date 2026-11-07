"use client";

import type { DemoAccount, DemoTransaction } from "@zenval/contracts";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/states";
import { intlLocale } from "@/i18n/config";
import { formatDate, localDayKey } from "@/lib/dates";
import { groupByDay } from "./transaction-filters";
import { TransactionRow } from "./transaction-row";

export function TransactionList({
  transactions,
  accounts,
}: {
  transactions: ReadonlyArray<DemoTransaction>;
  accounts: ReadonlyMap<string, DemoAccount>;
}) {
  const t = useTranslations("transactions");
  const locale = intlLocale(useLocale());
  const today = localDayKey(new Date().toISOString());

  return (
    <div className="flex flex-col gap-5">
      {groupByDay(transactions).map((group) => (
        <section key={group.day} aria-label={formatDate(group.day, locale, "long")}>
          <h2 className="mb-2 flex items-baseline justify-between px-1 text-xs font-semibold tracking-wide text-ink-soft uppercase">
            <span>{group.day === today ? t("today") : formatDate(group.day, locale, "long")}</span>
            <span className="font-normal normal-case text-ink-faint">
              {t("count", { count: group.items.length })}
            </span>
          </h2>
          <Card>
            <ul className="divide-y divide-line">
              {group.items.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  accounts={accounts}
                />
              ))}
            </ul>
          </Card>
        </section>
      ))}
    </div>
  );
}

export function TransactionListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <ul className="divide-y divide-line">
        {Array.from({ length: rows }, (_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows.
          <li key={index} className="flex items-center gap-3 px-5 py-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-20" />
          </li>
        ))}
      </ul>
    </Card>
  );
}
