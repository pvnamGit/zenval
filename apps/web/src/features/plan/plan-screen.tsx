"use client";

import { CalendarClock, Target } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Money, useMoneyFormatter } from "@/components/ui/money";
import { PageHeader, Provenance, SampleDataBadge } from "@/components/ui/page";
import { formatBps, Progress } from "@/components/ui/progress";
import { QueryView, Skeleton } from "@/components/ui/states";
import { intlLocale } from "@/i18n/config";
import type { Commitment, Goal } from "@/lib/api/draft-schemas";
import { usePlanningQuery } from "@/lib/api/hooks";
import { cn } from "@/lib/cn";
import { formatDate, formatRelativeDays } from "@/lib/dates";

const statusTone: Record<Commitment["status"], BadgeTone> = {
  scheduled: "neutral",
  due: "amber",
  paid: "accent",
  overdue: "danger",
  skipped: "neutral",
};

function CommitmentRow({ commitment }: { commitment: Commitment }) {
  const t = useTranslations("plan");
  const locale = intlLocale(useLocale());
  const format = useMoneyFormatter();
  const isIncome = commitment.kind === "income";
  return (
    <li
      className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
      data-pnl-impact={commitment.pnlImpact}
    >
      <div className="grid w-14 shrink-0 place-items-center rounded-xl border border-line py-1.5 text-center">
        <span className="text-[11px] font-medium text-ink-soft">
          {formatDate(commitment.nextDueOn, locale, "short")}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium">{commitment.title}</p>
          <Badge tone={statusTone[commitment.status]}>{t(`status.${commitment.status}`)}</Badge>
          {commitment.priority === "essential" ? (
            <Badge tone="info">{t("priority.essential")}</Badge>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-soft">
          {t(`kinds.${commitment.kind}`)} · {t(`cadence.${commitment.cadence}`)} ·{" "}
          {commitment.status === "paid"
            ? t("status.paid")
            : formatRelativeDays(commitment.nextDueOn, locale)}
        </p>
        <p className="mt-0.5 text-[11px] text-ink-faint">
          {t(`pnl.${commitment.pnlImpact}`)}
          {commitment.tolerance
            ? ` · ${t("tolerance", { amount: format(commitment.tolerance.value) })}`
            : ""}
        </p>
      </div>
      <Money
        value={commitment.amount.value}
        direction={isIncome ? "in" : "out"}
        tone={isIncome}
        className={cn("text-sm font-semibold", commitment.status === "paid" && "opacity-60")}
      />
    </li>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const t = useTranslations("plan");
  const locale = intlLocale(useLocale());
  return (
    <Card>
      <CardBody className="flex flex-col gap-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{goal.title}</p>
            <p className="truncate text-xs text-ink-soft">
              {t("linkedTo")}: {goal.linkedTo}
            </p>
          </div>
          <Badge
            tone={
              goal.status === "achieved" ? "accent" : goal.status === "paused" ? "neutral" : "info"
            }
          >
            {t(`goalStatus.${goal.status}`)}
          </Badge>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <Money value={goal.contributed.value} className="text-lg font-semibold" />
          <span className="text-sm font-medium text-accent tabular">
            {formatBps(goal.progressBps, locale)}
          </span>
        </div>
        <Progress valueBps={goal.progressBps} label={goal.title} />
        <dl className="flex justify-between text-xs text-ink-soft">
          <div className="flex gap-1">
            <dt>{t("target")}:</dt>
            <dd>
              <Money value={goal.target.value} compact className="font-medium text-ink" />
            </dd>
          </div>
          {goal.targetDate ? (
            <div className="flex gap-1">
              <dt>{t("targetDate")}:</dt>
              <dd className="font-medium text-ink">{formatDate(goal.targetDate, locale)}</dd>
            </div>
          ) : null}
        </dl>
      </CardBody>
    </Card>
  );
}

export function PlanScreen() {
  const t = useTranslations("plan");
  const planning = usePlanningQuery();
  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        badge={<SampleDataBadge module="planning" />}
      />
      <QueryView
        query={planning}
        loading={
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-96 rounded-card lg:col-span-2" />
            <Skeleton className="h-96 rounded-card" />
          </div>
        }
      >
        {(data) => {
          const commitments = [...data.commitments].sort((a, b) =>
            a.nextDueOn.localeCompare(b.nextDueOn),
          );
          return (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardBody className="pt-5">
                    <p className="text-sm text-ink-soft">{t("monthCommitted")}</p>
                    <Money value={data.monthCommitted.value} className="text-2xl font-semibold" />
                  </CardBody>
                </Card>
                <Card>
                  <CardBody className="pt-5">
                    <p className="text-sm text-ink-soft">{t("monthPaid")}</p>
                    <Money value={data.monthPaid.value} className="text-2xl font-semibold" />
                  </CardBody>
                </Card>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                  <CardHeader icon={<CalendarClock aria-hidden />} title={t("commitments")} />
                  <ul className="mt-2 divide-y divide-line">
                    {commitments.map((commitment) => (
                      <CommitmentRow key={commitment.id} commitment={commitment} />
                    ))}
                  </ul>
                </Card>
                <section
                  aria-labelledby="goals-heading"
                  className="flex flex-col gap-4 lg:col-span-2"
                >
                  <h2
                    id="goals-heading"
                    className="flex items-center gap-2 text-base font-semibold"
                  >
                    <Target aria-hidden className="size-4 text-accent" />
                    {t("goals")}
                  </h2>
                  {data.goals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </section>
              </div>
              <Provenance source={data.source} asOf={data.asOf} version={data.calculationVersion} />
            </div>
          );
        }}
      </QueryView>
    </>
  );
}
