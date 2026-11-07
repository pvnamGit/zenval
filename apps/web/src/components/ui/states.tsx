"use client";

import type { UseQueryResult } from "@tanstack/react-query";
import { CircleAlert, Inbox, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";
import { isApiError } from "@/lib/api/errors";
import { cn } from "@/lib/cn";
import { Button } from "./button";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("rounded-lg bg-surface-subtle motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border border-dashed border-line px-6 py-10 text-center",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-2xl bg-surface-subtle text-ink-faint [&_svg]:size-5">
        {icon ?? <Inbox aria-hidden />}
      </span>
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-soft">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  className?: string | undefined;
}) {
  const t = useTranslations("errors");
  const common = useTranslations("common");
  const message = !isApiError(error)
    ? t("generic")
    : error.code === "network"
      ? t("network")
      : error.code === "invalid-response"
        ? t("invalidResponse")
        : error.code === "not-implemented"
          ? t("notImplemented")
          : t("generic");

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl border border-danger/30 bg-danger-soft/50 px-6 py-8 text-center",
        className,
      )}
    >
      <CircleAlert aria-hidden className="size-6 text-danger" />
      <p className="text-sm font-semibold text-ink">{t("title")}</p>
      <p className="max-w-sm text-sm text-ink-soft">{message}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          <RefreshCw aria-hidden />
          {common("retry")}
        </Button>
      ) : null}
    </div>
  );
}

/**
 * Renders loading / error / success for a TanStack query so every screen handles all states the
 * same way (PRD: empty, loading, error, partial, stale states are mandatory).
 */
export function QueryView<T>({
  query,
  loading,
  children,
}: {
  query: UseQueryResult<T>;
  loading: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) return <>{loading}</>;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  return <>{children(query.data)}</>;
}
