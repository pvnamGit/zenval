"use client";

import type { DemoAccount } from "@zenval/contracts";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Landmark,
  PiggyBank,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Money } from "@/components/ui/money";
import { PageHeader, Provenance, SampleDataBadge } from "@/components/ui/page";
import { EmptyState, QueryView, Skeleton } from "@/components/ui/states";
import { mergeWithDrafts } from "@/features/transactions/transaction-filters";
import { TransactionList, TransactionListSkeleton } from "@/features/transactions/transaction-list";
import { accountMap } from "@/features/transactions/transaction-row";
import { intlLocale } from "@/i18n/config";
import { useFinanceQuery, useSessionDrafts } from "@/lib/api/hooks";
import { formatDateTime } from "@/lib/dates";

const kindIcon = { bank: Landmark, savings: PiggyBank, wallet: Smartphone } as const;

function AccountCard({ account }: { account: DemoAccount }) {
  const t = useTranslations("accounts");
  const locale = intlLocale(useLocale());
  const Icon = kindIcon[account.kind];
  return (
    <Link
      href={`/accounts/${encodeURIComponent(account.id)}`}
      className="group rounded-card focus-visible:outline-offset-4"
    >
      <Card className="h-full transition-colors group-hover:border-line-strong">
        <CardBody className="flex h-full flex-col gap-4 pt-5">
          <div className="flex items-start gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-surface-subtle text-sm font-semibold text-ink">
              {account.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{account.name}</p>
              <p className="truncate text-xs text-ink-soft">
                {account.institution} · {account.maskedReference}
              </p>
            </div>
            <ChevronRight
              aria-hidden
              className="size-4 text-ink-faint transition-transform group-hover:translate-x-0.5"
            />
          </div>
          <Money value={account.balance.value} className="text-xl font-semibold" />
          <div className="mt-auto flex flex-wrap items-center gap-2">
            <Badge>
              <Icon aria-hidden />
              {t(`kinds.${account.kind}`)}
            </Badge>
            {account.reconciliation === "reconciled" ? (
              <Badge tone="accent">
                <CircleCheck aria-hidden />
                {t("reconciled")}
              </Badge>
            ) : (
              <Badge tone="amber">{t("manual")}</Badge>
            )}
            <span className="ml-auto text-[11px] text-ink-faint">
              {formatDateTime(account.asOf, locale)}
            </span>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

export function AccountsScreen() {
  const t = useTranslations("accounts");
  const finance = useFinanceQuery();
  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        badge={<SampleDataBadge module="finance" />}
      />
      <QueryView
        query={finance}
        loading={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-28 rounded-card sm:col-span-2 lg:col-span-3" />
            <Skeleton className="h-44 rounded-card" />
            <Skeleton className="h-44 rounded-card" />
            <Skeleton className="h-44 rounded-card" />
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-1 pt-5">
                <p className="text-sm text-ink-soft">{t("totalAssets")}</p>
                <Money value={data.totalAssets.value} className="text-3xl font-semibold" />
                <Provenance source={data.source} asOf={data.asOf} className="mt-2" />
              </CardBody>
            </Card>
            {data.accounts.length === 0 ? (
              <EmptyState title={t("noActivity")} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.accounts.map((account) => (
                  <AccountCard key={account.id} account={account} />
                ))}
              </div>
            )}
          </div>
        )}
      </QueryView>
    </>
  );
}

export function AccountDetailScreen({ accountId }: { accountId: string }) {
  const t = useTranslations("accounts");
  const common = useTranslations("common");
  const finance = useFinanceQuery();
  const drafts = useSessionDrafts();
  const account = finance.data?.accounts.find((item) => item.id === accountId);
  const accounts = useMemo(() => accountMap(finance.data?.accounts ?? []), [finance.data]);
  const transactions = useMemo(
    () =>
      mergeWithDrafts(finance.data?.transactions ?? [], drafts).filter(
        (transaction) =>
          transaction.sourceAccountId === accountId ||
          transaction.destinationAccountId === accountId,
      ),
    [finance.data, drafts, accountId],
  );

  return (
    <>
      <Link
        href="/accounts"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ChevronLeft aria-hidden className="size-4" />
        {common("back")}
      </Link>
      <QueryView query={finance} loading={<TransactionListSkeleton rows={4} />}>
        {() =>
          !account ? (
            <EmptyState title={t("notFound")} />
          ) : (
            <>
              <PageHeader
                title={account.name}
                description={`${account.institution} · ${account.maskedReference}`}
                badge={<SampleDataBadge module="finance" />}
              />
              <Card className="mb-6">
                <CardBody className="pt-5">
                  <p className="text-sm text-ink-soft">{t("balance")}</p>
                  <Money value={account.balance.value} className="text-3xl font-semibold" />
                  <Provenance asOf={account.asOf} className="mt-2" />
                </CardBody>
              </Card>
              <h2 className="mb-3 text-base font-semibold">{t("activity")}</h2>
              {transactions.length === 0 ? (
                <EmptyState title={t("noActivity")} />
              ) : (
                <TransactionList transactions={transactions} accounts={accounts} />
              )}
            </>
          )
        }
      </QueryView>
    </>
  );
}
