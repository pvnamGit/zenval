"use client";

import { HandCoins, Landmark } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Money } from "@/components/ui/money";
import { PageHeader, Provenance, SampleDataBadge } from "@/components/ui/page";
import { formatBps, Progress } from "@/components/ui/progress";
import { EmptyState, QueryView, Skeleton } from "@/components/ui/states";
import { intlLocale } from "@/i18n/config";
import type { Debt } from "@/lib/api/draft-schemas";
import { useDebtsQuery } from "@/lib/api/hooks";
import { formatDate } from "@/lib/dates";

const statusTone: Record<Debt["status"], BadgeTone> = {
  active: "info",
  overdue: "danger",
  settled: "accent",
};

function DebtCard({ debt }: { debt: Debt }) {
  const t = useTranslations("debts");
  const locale = intlLocale(useLocale());
  const installment = debt.nextInstallment;
  return (
    <Card data-debt-direction={debt.direction}>
      <CardBody className="flex flex-col gap-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{debt.name}</p>
            <p className="truncate text-xs text-ink-soft">
              {debt.counterparty}
              {debt.interestRateBps > 0
                ? ` · ${t("rate", { rate: formatBps(debt.interestRateBps, locale) })}`
                : ""}
            </p>
          </div>
          <Badge tone={statusTone[debt.status]}>{t(`status.${debt.status}`)}</Badge>
        </div>

        <div>
          <p className="text-xs text-ink-soft">{t("outstanding")}</p>
          <Money value={debt.outstandingPrincipal.value} className="text-xl font-semibold" />
          <p className="text-xs text-ink-faint">
            {t("original")}: <Money value={debt.originalPrincipal.value} compact />
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Progress
            valueBps={debt.repaidBps}
            label={t("repaid", { percent: formatBps(debt.repaidBps, locale) })}
            tone={debt.direction === "payable" ? "info" : "accent"}
          />
          <div className="flex justify-between text-xs text-ink-soft">
            <span>{t("repaid", { percent: formatBps(debt.repaidBps, locale) })}</span>
            {debt.recoveryProbabilityBps !== null ? (
              <span>
                {t("recovery", { percent: formatBps(debt.recoveryProbabilityBps, locale) })}
              </span>
            ) : null}
          </div>
        </div>

        {installment ? (
          <div className="rounded-2xl bg-surface-subtle p-3">
            <p className="mb-2 flex items-center justify-between text-xs font-medium text-ink-soft">
              <span>{t("nextInstallment")}</span>
              <span>{formatDate(installment.dueOn, locale)}</span>
            </p>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <div data-pnl-impact="false">
                <dt className="text-ink-faint">{t("principal")}</dt>
                <dd>
                  <Money value={installment.principal.value} compact className="font-medium" />
                </dd>
              </div>
              <div data-pnl-impact="true">
                <dt className="text-ink-faint">{t("interest")}</dt>
                <dd>
                  <Money value={installment.interest.value} compact className="font-medium" />
                </dd>
              </div>
              <div data-pnl-impact="true">
                <dt className="text-ink-faint">{t("fee")}</dt>
                <dd>
                  <Money value={installment.fee.value} compact className="font-medium" />
                </dd>
              </div>
            </dl>
            <p className="mt-2 flex justify-between border-t border-line pt-2 text-sm">
              <span className="text-ink-soft">{t("total")}</span>
              <Money value={installment.total.value} className="font-semibold" />
            </p>
            <p className="mt-1 text-[11px] text-ink-faint">{t("pnlNote")}</p>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

export function DebtsScreen() {
  const t = useTranslations("debts");
  const debts = useDebtsQuery();
  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        badge={<SampleDataBadge module="debts" />}
      />
      <QueryView
        query={debts}
        loading={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-72 rounded-card sm:col-span-3" />
          </div>
        }
      >
        {(data) => {
          const payables = data.debts.filter((debt) => debt.direction === "payable");
          const receivables = data.debts.filter((debt) => debt.direction === "receivable");
          return (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {(
                  [
                    ["totalPayable", data.totalPayable],
                    ["totalReceivable", data.totalReceivable],
                    ["expectedRecoverable", data.expectedRecoverable],
                  ] as const
                ).map(([key, amount]) => (
                  <Card key={key}>
                    <CardBody className="pt-5">
                      <p className="text-sm text-ink-soft">{t(key)}</p>
                      <Money value={amount.value} className="text-2xl font-semibold" />
                    </CardBody>
                  </Card>
                ))}
              </div>
              {(
                [
                  ["payables", payables, Landmark],
                  ["receivables", receivables, HandCoins],
                ] as const
              ).map(([key, list, Icon]) => (
                <section key={key} aria-labelledby={`${key}-heading`}>
                  <h2
                    id={`${key}-heading`}
                    className="flex items-center gap-2 text-base font-semibold"
                  >
                    <Icon aria-hidden className="size-4 text-accent" />
                    {t(key)}
                  </h2>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {list.length === 0 ? (
                      <EmptyState title={t("empty")} className="md:col-span-2" />
                    ) : (
                      list.map((debt) => <DebtCard key={debt.id} debt={debt} />)
                    )}
                  </div>
                </section>
              ))}
              <Provenance source={data.source} asOf={data.asOf} version={data.calculationVersion} />
            </div>
          );
        }}
      </QueryView>
    </>
  );
}
