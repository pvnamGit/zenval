"use client";

import type { DashboardSnapshot } from "@zenval/contracts";
import { ArrowRight, CalendarClock, Inbox, Landmark, Sparkles, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Money } from "@/components/ui/money";
import { PageHeader, Provenance, SampleDataBadge } from "@/components/ui/page";
import { EmptyState, ErrorState, QueryView, Skeleton } from "@/components/ui/states";
import { mergeWithDrafts } from "@/features/transactions/transaction-filters";
import { TransactionListSkeleton } from "@/features/transactions/transaction-list";
import { accountMap, TransactionRow } from "@/features/transactions/transaction-row";
import { intlLocale } from "@/i18n/config";
import { useDashboardQuery, useFinanceQuery, useSessionDrafts } from "@/lib/api/hooks";
import { formatDate, localDayKey } from "@/lib/dates";

function SafeToSpendCard({ data }: { data: DashboardSnapshot }) {
  const t = useTranslations("dashboard");
  const common = useTranslations("common");
  const sts = data.safeToSpend;
  return (
    <Card
      className="relative overflow-hidden border-transparent bg-accent text-on-accent lg:col-span-2"
      data-derived-value="safeToSpend"
      data-version={sts.calculationVersion}
      data-as-of={data.asOf}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-white/10 blur-2xl"
      />
      <div className="relative p-6 sm:p-7">
        <p className="flex items-center gap-2 text-sm font-medium opacity-90">
          <Sparkles aria-hidden className="size-4" />
          {t("safeToSpend")}
        </p>
        <Money
          value={sts.amount.value}
          className="mt-3 block text-4xl font-semibold tracking-tight sm:text-5xl"
        />
        <p className="mt-2 text-sm opacity-90">{sts.horizon}</p>
        <details className="group mt-5 rounded-2xl bg-black/10 px-4 py-3 text-sm">
          <summary className="cursor-pointer list-none font-medium marker:hidden">
            {common("explain")}
          </summary>
          <div className="mt-2 space-y-1 opacity-90">
            <p>{t("safeToSpendHint")}</p>
            <p>{sts.sourceSummary}</p>
            <Provenance
              asOf={data.asOf}
              version={sts.calculationVersion}
              className="text-on-accent/80"
            />
          </div>
        </details>
      </div>
    </Card>
  );
}

function ProjectedLowCard({ data }: { data: DashboardSnapshot }) {
  const t = useTranslations("dashboard");
  return (
    <Card data-derived-value="cashFlow">
      <CardHeader
        icon={<TrendingDown aria-hidden />}
        title={t("projectedLow")}
        action={<Badge tone="forecast">{t("forecast")}</Badge>}
      />
      <CardBody>
        <Money value={data.cashFlow.projectedLow.value} className="text-2xl font-semibold" />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-soft">
          <span>
            {t("confidence")}: <strong className="text-ink">{t("confidenceMedium")}</strong>
          </span>
          <span aria-hidden>·</span>
          <span>{t("scenarioBase")}</span>
        </div>
      </CardBody>
    </Card>
  );
}

function NetWorthCard({ data }: { data: DashboardSnapshot }) {
  const t = useTranslations("dashboard");
  const netWorth = data.netWorth;
  return (
    <Card data-derived-value="netWorth">
      <CardHeader
        icon={<Landmark aria-hidden />}
        title={t("netWorth")}
        action={<Badge tone="accent">{netWorth.monthChangeLabel}</Badge>}
      />
      <CardBody>
        <Money value={netWorth.amount.value} className="text-2xl font-semibold" />
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-surface-subtle px-3 py-2">
            <dt className="text-xs text-ink-soft">{t("assets")}</dt>
            <dd>
              <Money value={netWorth.assets.value} compact className="font-medium" />
            </dd>
          </div>
          <div className="rounded-xl bg-surface-subtle px-3 py-2">
            <dt className="text-xs text-ink-soft">{t("liabilities")}</dt>
            <dd>
              <Money value={netWorth.liabilities.value} compact className="font-medium" />
            </dd>
          </div>
        </dl>
      </CardBody>
    </Card>
  );
}

function ReviewCard({ data }: { data: DashboardSnapshot }) {
  const t = useTranslations("dashboard");
  return (
    <Card className={data.reviewCount > 0 ? "border-amber/40" : undefined}>
      <CardHeader icon={<Inbox aria-hidden />} title={t("reviewInbox")} />
      <CardBody>
        <p className="text-2xl font-semibold tabular">{data.reviewCount}</p>
        <p className="mt-1 text-sm text-ink-soft">
          {t("reviewCount", { count: data.reviewCount })}
        </p>
        <ButtonLink href="/review" size="sm" className="mt-4">
          {t("openReview")}
          <ArrowRight aria-hidden />
        </ButtonLink>
      </CardBody>
    </Card>
  );
}

function DueSoonCard({ data }: { data: DashboardSnapshot }) {
  const t = useTranslations("dashboard");
  const common = useTranslations("common");
  const locale = intlLocale(useLocale());
  return (
    <Card className="lg:col-span-2">
      <CardHeader
        icon={<CalendarClock aria-hidden />}
        title={t("dueSoon")}
        action={
          <Link href="/plan" className="text-xs font-medium text-accent hover:underline">
            {common("viewAll")}
          </Link>
        }
      />
      <CardBody className="pt-2">
        {data.dueSoon.length === 0 ? (
          <p className="py-4 text-sm text-ink-soft">{t("dueSoonEmpty")}</p>
        ) : (
          <ul className="divide-y divide-line">
            {data.dueSoon.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="grid w-12 shrink-0 place-items-center rounded-xl border border-line py-1.5 text-center">
                  <span className="text-[10px] text-ink-faint uppercase">
                    {formatDate(item.dueOn, locale, "short")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <Badge tone={item.kind === "debt-installment" ? "info" : "neutral"}>
                      {item.kind === "debt-installment" ? t("debtInstallment") : t("expense")}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">{item.detail}</p>
                </div>
                <Money value={item.amount.value} className="text-sm font-semibold" />
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

function RecentTransactions() {
  const t = useTranslations("dashboard");
  const tx = useTranslations("transactions");
  const common = useTranslations("common");
  const finance = useFinanceQuery();
  const drafts = useSessionDrafts();
  const recent = useMemo(
    () => mergeWithDrafts(finance.data?.transactions ?? [], drafts).slice(0, 5),
    [finance.data, drafts],
  );
  const accounts = useMemo(() => accountMap(finance.data?.accounts ?? []), [finance.data]);

  return (
    <section aria-labelledby="recent-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="recent-heading" className="text-base font-semibold">
          {t("recent")}
        </h2>
        <Link href="/transactions" className="text-sm font-medium text-accent hover:underline">
          {common("viewAll")}
        </Link>
      </div>
      {finance.isPending ? (
        <TransactionListSkeleton rows={4} />
      ) : finance.isError ? (
        <ErrorState error={finance.error} onRetry={() => void finance.refetch()} />
      ) : recent.length === 0 ? (
        <EmptyState title={tx("emptyAll")} />
      ) : (
        <Card>
          <ul className="divide-y divide-line">
            {recent.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} accounts={accounts} />
            ))}
          </ul>
        </Card>
      )}
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Skeleton className="h-64 rounded-card lg:col-span-2" />
      <Skeleton className="h-64 rounded-card" />
      <Skeleton className="h-44 rounded-card" />
      <Skeleton className="h-44 rounded-card" />
      <Skeleton className="h-44 rounded-card" />
    </div>
  );
}

export function DashboardScreen() {
  const t = useTranslations("dashboard");
  const locale = intlLocale(useLocale());
  const dashboard = useDashboardQuery();
  // The date depends on the device clock/time zone, so it is rendered after hydration only.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(localDayKey(new Date().toISOString())), []);

  return (
    <>
      <PageHeader
        title={t("greeting")}
        description={today ? formatDate(today, locale, "long") : "\u00a0"}
        badge={<SampleDataBadge module="dashboard" />}
      />
      <QueryView query={dashboard} loading={<DashboardSkeleton />}>
        {(data) => (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <SafeToSpendCard data={data} />
              <NetWorthCard data={data} />
              <DueSoonCard data={data} />
              <div className="flex flex-col gap-4">
                <ReviewCard data={data} />
                <ProjectedLowCard data={data} />
              </div>
            </div>
            <RecentTransactions />
            <Provenance source="API · dashboard" asOf={data.asOf} />
          </div>
        )}
      </QueryView>
    </>
  );
}
