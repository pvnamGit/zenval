"use client";

import type { DemoReviewItem } from "@zenval/contracts";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Money } from "@/components/ui/money";
import { PageHeader, Provenance, SampleDataBadge } from "@/components/ui/page";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { EmptyState, QueryView } from "@/components/ui/states";
import { TransactionListSkeleton } from "@/features/transactions/transaction-list";
import type { ReviewAction } from "@/lib/api/draft-schemas";
import { useFinanceQuery, useResolveReviewItem } from "@/lib/api/hooks";

type Bucket = DemoReviewItem["bucket"];

const kindTone: Record<DemoReviewItem["kind"], BadgeTone> = {
  transfer: "info",
  duplicate: "amber",
  variance: "danger",
  expected: "forecast",
  expense: "neutral",
};

function ReviewRow({ item }: { item: DemoReviewItem }) {
  const t = useTranslations("review");
  const common = useTranslations("common");
  const { notify } = useToast();
  const resolve = useResolveReviewItem();

  function act(action: ReviewAction) {
    resolve.mutate(
      { itemId: item.id, action, idempotencyKey: `${item.id}:${action}` },
      {
        onSuccess: () => notify(action === "approve" ? t("approved") : t("dismissed")),
        onError: (error) => notify(error.message, "error"),
      },
    );
  }

  const pnlLabel =
    item.pnlImpact === false
      ? common("noPnl")
      : item.pnlImpact === true
        ? t("pnlYes")
        : t("pnlUnknown");

  return (
    <li
      className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:px-5"
      data-pnl-impact={String(item.pnlImpact)}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{item.title}</p>
          <Badge tone={kindTone[item.kind]}>{t(`kinds.${item.kind}`)}</Badge>
        </div>
        <p className="mt-1 text-xs text-ink-soft">{item.detail}</p>
        <p className="mt-0.5 text-[11px] text-ink-faint">{pnlLabel}</p>
      </div>
      <Money value={item.amount.value} className="text-sm font-semibold sm:w-32 sm:text-right" />
      {item.bucket === "review" ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={resolve.isPending}
            onClick={() => act("dismiss")}
          >
            <X aria-hidden />
            {t("dismiss")}
          </Button>
          <Button size="sm" disabled={resolve.isPending} onClick={() => act("approve")}>
            <Check aria-hidden />
            {item.kind === "duplicate" ? t("approveDuplicate") : t("approve")}
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export function ReviewScreen() {
  const t = useTranslations("review");
  const finance = useFinanceQuery();
  const [bucket, setBucket] = useState<Bucket>("review");
  const items = finance.data?.reviewItems ?? [];
  const count = (value: Bucket) => items.filter((item) => item.bucket === value).length;

  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        badge={<SampleDataBadge module="review" />}
      />
      <SegmentedControl
        label={t("title")}
        value={bucket}
        onChange={setBucket}
        className="mb-5"
        options={(["review", "pending", "posted"] as const).map((value) => ({
          value,
          label: t(`buckets.${value}`),
          ...(finance.data ? { count: count(value) } : {}),
        }))}
      />
      <QueryView query={finance} loading={<TransactionListSkeleton rows={3} />}>
        {(data) => {
          const visible = data.reviewItems.filter((item) => item.bucket === bucket);
          return (
            <div className="flex flex-col gap-3">
              {visible.length === 0 ? (
                <EmptyState title={t("empty")} />
              ) : (
                <Card>
                  <ul className="divide-y divide-line">
                    {visible.map((item) => (
                      <ReviewRow key={item.id} item={item} />
                    ))}
                  </ul>
                </Card>
              )}
              <Provenance source={data.source} asOf={data.asOf} />
            </div>
          );
        }}
      </QueryView>
    </>
  );
}

