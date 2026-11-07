"use client";

import { Clock, PencilLine } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Money } from "@/components/ui/money";
import { PageHeader, Provenance, SampleDataBadge } from "@/components/ui/page";
import { formatBps } from "@/components/ui/progress";
import { QueryView, Skeleton } from "@/components/ui/states";
import { intlLocale } from "@/i18n/config";
import type { Holding, InvestmentsSnapshot } from "@/lib/api/draft-schemas";
import { useInvestmentsQuery } from "@/lib/api/hooks";
import { cn } from "@/lib/cn";
import { formatDate, formatDateTime } from "@/lib/dates";
import { formatQuantity } from "@/lib/money";

const classColor: Record<Holding["assetClass"], string> = {
  equity: "bg-accent",
  fund: "bg-info",
  gold: "bg-amber",
  crypto: "bg-danger",
  bond: "bg-forecast",
};

function AllocationBar({ holdings }: { holdings: ReadonlyArray<Holding> }) {
  const t = useTranslations("investments");
  const locale = intlLocale(useLocale());
  return (
    <Card>
      <CardHeader title={t("allocation")} />
      <CardBody>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-subtle" aria-hidden>
          {holdings.map((holding) => (
            <div
              key={holding.id}
              className={cn("h-full", classColor[holding.assetClass])}
              style={{ width: `${holding.allocationBps / 100}%` }}
            />
          ))}
        </div>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {holdings.map((holding) => (
            <li key={holding.id} className="flex items-center gap-2">
              <span className={cn("size-2.5 rounded-full", classColor[holding.assetClass])} />
              <span className="truncate">{holding.symbol}</span>
              <span className="text-xs text-ink-faint">
                {t(`assetClass.${holding.assetClass}`)}
              </span>
              <span className="ml-auto font-medium tabular">
                {formatBps(holding.allocationBps, locale)}
              </span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}

function HoldingRow({ holding }: { holding: Holding }) {
  const t = useTranslations("investments");
  const locale = intlLocale(useLocale());
  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 px-4 py-3.5 sm:grid-cols-[2fr_1fr_1fr_1fr] sm:items-center sm:px-5">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold">{holding.symbol}</p>
          {holding.stale ? (
            <Badge tone="amber">
              <Clock aria-hidden />
              {t("stale")}
            </Badge>
          ) : null}
          {holding.priceSource === "manual" ? (
            <Badge>
              <PencilLine aria-hidden />
              {t("manualPrice")}
            </Badge>
          ) : null}
        </div>
        <p className="truncate text-xs text-ink-soft">
          {holding.name} · {t("quantity", { quantity: formatQuantity(holding.quantity, locale) })}
        </p>
      </div>
      <div className="hidden text-right text-xs sm:block">
        <Money value={holding.price.value} className="text-sm" />
        <p className="text-ink-faint">{formatDateTime(holding.priceAsOf, locale)}</p>
      </div>
      <Money
        value={holding.costBasis.value}
        className="hidden text-right text-sm text-ink-soft sm:block"
      />
      <div className="row-span-2 text-right sm:row-span-1">
        <Money value={holding.marketValue.value} className="block text-sm font-semibold" />
        <Money value={holding.unrealizedPnl.value} tone className="text-xs" />
      </div>
    </li>
  );
}

function Summary({ data }: { data: InvestmentsSnapshot }) {
  const t = useTranslations("investments");
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardBody className="pt-5">
          <p className="text-sm text-ink-soft">{t("marketValue")}</p>
          <Money value={data.totalMarketValue.value} className="text-2xl font-semibold" />
        </CardBody>
      </Card>
      <Card>
        <CardBody className="pt-5">
          <p className="text-sm text-ink-soft">{t("costBasis")}</p>
          <Money value={data.totalCostBasis.value} className="text-2xl font-semibold" />
        </CardBody>
      </Card>
      <Card>
        <CardBody className="pt-5">
          <p className="text-sm text-ink-soft">{t("unrealized")}</p>
          <Money value={data.unrealizedPnl.value} tone className="text-2xl font-semibold" />
        </CardBody>
      </Card>
    </div>
  );
}

export function InvestmentsScreen() {
  const t = useTranslations("investments");
  const locale = intlLocale(useLocale());
  const investments = useInvestmentsQuery();
  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        badge={<SampleDataBadge module="investments" />}
      />
      <QueryView
        query={investments}
        loading={
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-24 rounded-card" />
            <Skeleton className="h-80 rounded-card sm:col-span-3" />
          </div>
        }
      >
        {(data) => {
          const holdings = new Map(data.holdings.map((holding) => [holding.id, holding]));
          return (
            <div className="flex flex-col gap-6">
              <Summary data={data} />
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader title={t("holdings")} />
                  <div
                    aria-hidden
                    className="mt-3 hidden grid-cols-[2fr_1fr_1fr_1fr] gap-x-4 border-b border-line px-5 pb-2 text-right text-[11px] font-medium text-ink-faint uppercase sm:grid"
                  >
                    <span />
                    <span>{t("price")}</span>
                    <span>{t("costBasis")}</span>
                    <span>{t("marketValue")}</span>
                  </div>
                  <ul className="divide-y divide-line">
                    {data.holdings.map((holding) => (
                      <HoldingRow key={holding.id} holding={holding} />
                    ))}
                  </ul>
                </Card>
                <div className="flex flex-col gap-6">
                  <AllocationBar holdings={data.holdings} />
                  <Card>
                    <CardHeader title={t("activity")} />
                    <CardBody>
                      <ul className="flex flex-col gap-3">
                        {data.activities.map((activity) => (
                          <li key={activity.id} className="flex items-start gap-3 text-sm">
                            <Badge tone={activity.kind === "dividend" ? "accent" : "neutral"}>
                              {t(`activityKind.${activity.kind}`)}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="truncate">{activity.title}</p>
                              <p className="text-xs text-ink-faint">
                                {formatDate(activity.occurredOn, locale)} ·{" "}
                                {holdings.get(activity.holdingId)?.symbol}
                              </p>
                            </div>
                            <Money value={activity.amount.value} className="font-medium" />
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                </div>
              </div>
              <Provenance source={data.source} asOf={data.asOf} version={data.calculationVersion} />
            </div>
          );
        }}
      </QueryView>
    </>
  );
}
