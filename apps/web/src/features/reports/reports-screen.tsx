"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Money } from "@/components/ui/money";
import { PageHeader, Provenance, SampleDataBadge } from "@/components/ui/page";
import { formatBps, Progress } from "@/components/ui/progress";
import { QueryView, Skeleton } from "@/components/ui/states";
import { intlLocale } from "@/i18n/config";
import type { ReportsSnapshot } from "@/lib/api/draft-schemas";
import { useReportsQuery } from "@/lib/api/hooks";
import { formatMonth } from "@/lib/dates";
import { maxAbsolute, ratioPercent } from "@/lib/money";

/**
 * Bar heights are display-only ratios computed exactly from decimal strings. Each chart has a
 * visually hidden data table so the figures are available to screen readers (WCAG 2.2 AA).
 */
function CashflowChart({ data }: { data: ReportsSnapshot }) {
  const t = useTranslations("reports");
  const locale = intlLocale(useLocale());
  const max = maxAbsolute(
    data.monthly.flatMap((month) => [month.income.value, month.expense.value]),
  );
  const height = (value: ReportsSnapshot["monthly"][number]["income"]) =>
    max ? `${Math.max(ratioPercent(value.value, max), 1)}%` : "0%";

  return (
    <Card className="lg:col-span-2">
      <CardHeader
        title={t("cashflow")}
        action={
          <div className="flex gap-3 text-xs text-ink-soft">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-accent" />
              {t("income")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-danger/70" />
              {t("expense")}
            </span>
          </div>
        }
      />
      <CardBody>
        <div aria-hidden className="flex h-56 items-end gap-3 sm:gap-5">
          {data.monthly.map((month) => (
            <div key={month.month} className="flex h-full flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end justify-center gap-1">
                <div
                  className="w-1/2 max-w-6 rounded-t-md bg-accent"
                  style={{ height: height(month.income) }}
                />
                <div
                  className="w-1/2 max-w-6 rounded-t-md bg-danger/70"
                  style={{ height: height(month.expense) }}
                />
              </div>
              <span className="text-[11px] text-ink-faint">{formatMonth(month.month, locale)}</span>
            </div>
          ))}
        </div>
        <table className="sr-only">
          <caption>{t("tableCaption")}</caption>
          <thead>
            <tr>
              <th scope="col">{t("month")}</th>
              <th scope="col">{t("income")}</th>
              <th scope="col">{t("expense")}</th>
              <th scope="col">{t("net")}</th>
            </tr>
          </thead>
          <tbody>
            {data.monthly.map((month) => (
              <tr key={month.month}>
                <th scope="row">{formatMonth(month.month, locale)}</th>
                <td>
                  <Money value={month.income.value} />
                </td>
                <td>
                  <Money value={month.expense.value} />
                </td>
                <td>
                  <Money value={month.net.value} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

function NetWorthTrend({ data }: { data: ReportsSnapshot }) {
  const t = useTranslations("reports");
  const locale = intlLocale(useLocale());
  const latest = data.netWorth.at(-1);
  const max = maxAbsolute(data.netWorth.map((point) => point.netWorth.value));
  return (
    <Card>
      <CardHeader title={t("netWorth")} />
      <CardBody>
        {latest ? <Money value={latest.netWorth.value} className="text-2xl font-semibold" /> : null}
        <ul className="mt-4 flex flex-col gap-2.5">
          {data.netWorth.map((point) => (
            <li key={point.month} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3">
              <span className="text-xs text-ink-faint">{formatMonth(point.month, locale)}</span>
              <Progress
                valueBps={max ? ratioPercent(point.netWorth.value, max) * 100 : 0}
                label={formatMonth(point.month, locale)}
                tone="forecast"
              />
              <Money value={point.netWorth.value} compact className="text-xs font-medium" />
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

function SpendingMix({ data }: { data: ReportsSnapshot }) {
  const t = useTranslations("reports");
  const locale = intlLocale(useLocale());
  return (
    <Card className="lg:col-span-3">
      <CardHeader title={t("spending")} description={t("spendingNote")} />
      <CardBody>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          {data.spendingByCategory.map((row) => (
            <li key={row.category} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span>{row.category}</span>
                <span className="flex items-baseline gap-2">
                  <Money value={row.amount.value} className="font-medium" />
                  <span className="w-12 text-right text-xs text-ink-faint tabular">
                    {formatBps(row.shareBps, locale)}
                  </span>
                </span>
              </div>
              <Progress valueBps={row.shareBps} label={row.category} />
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

export function ReportsScreen() {
  const t = useTranslations("reports");
  const reports = useReportsQuery();
  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        badge={<SampleDataBadge module="reports" />}
      />
      <QueryView
        query={reports}
        loading={
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-80 rounded-card lg:col-span-2" />
            <Skeleton className="h-80 rounded-card" />
            <Skeleton className="h-64 rounded-card lg:col-span-3" />
          </div>
        }
      >
        {(data) => (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <CashflowChart data={data} />
              <NetWorthTrend data={data} />
              <SpendingMix data={data} />
            </div>
            <Provenance source={data.source} asOf={data.asOf} version={data.calculationVersion} />
          </div>
        )}
      </QueryView>
    </>
  );
}
