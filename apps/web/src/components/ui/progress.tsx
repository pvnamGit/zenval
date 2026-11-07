import { cn } from "@/lib/cn";

const tones = {
  accent: "bg-accent",
  amber: "bg-amber",
  danger: "bg-danger",
  info: "bg-info",
  forecast: "bg-forecast",
} as const;

/** Progress bar driven by integer basis points (0–10000) supplied by the server. */
export function Progress({
  valueBps,
  label,
  tone = "accent",
  className,
}: {
  valueBps: number;
  label: string;
  tone?: keyof typeof tones;
  className?: string | undefined;
}) {
  const clamped = Math.min(10_000, Math.max(0, Math.round(valueBps)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped / 100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-subtle", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500", tones[tone])}
        style={{ width: `${clamped / 100}%` }}
      />
    </div>
  );
}

export function formatBps(bps: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(
    bps / 10_000,
  );
}
