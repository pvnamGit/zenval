"use client";

import { Database, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { intlLocale } from "@/i18n/config";
import { useApi } from "@/lib/api/provider";
import type { ApiModule } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/dates";
import { Badge } from "./badge";

/** Shows where a derived number comes from (PRD: source, freshness, calculation version). */
export function Provenance({
  source,
  asOf,
  version,
  className,
}: {
  source?: string;
  asOf: string;
  version?: string;
  className?: string | undefined;
}) {
  const t = useTranslations("provenance");
  const locale = intlLocale(useLocale());
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-ink-faint",
        className,
      )}
    >
      <Info aria-hidden className="size-3" />
      {source ? (
        <span>
          {t("source")}: {source}
        </span>
      ) : null}
      <span>
        {t("asOf")}: <time dateTime={asOf}>{formatDateTime(asOf, locale)}</time>
      </span>
      {version ? (
        <span>
          {t("version")}: {version}
        </span>
      ) : null}
    </p>
  );
}

/** Labels screens served by the mock adapter so sample data is never mistaken for real data. */
export function SampleDataBadge({ module }: { module: ApiModule }) {
  const t = useTranslations("provenance");
  const api = useApi();
  if (api.sources[module] !== "mock") return null;
  return (
    <Badge tone="amber" title={t("sampleHint")}>
      <Database aria-hidden />
      {t("sample")}
    </Badge>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  badge,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
          {badge}
        </div>
        {description ? <p className="mt-1 max-w-2xl text-sm text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
