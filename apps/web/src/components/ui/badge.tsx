import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "accent" | "amber" | "danger" | "info" | "forecast";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-subtle text-ink-soft border-line",
  accent: "bg-accent-soft text-accent border-transparent",
  amber: "bg-amber-soft text-amber border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  info: "bg-info-soft text-info border-transparent",
  forecast: "bg-forecast-soft text-forecast border-dashed border-forecast/40",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-4 whitespace-nowrap [&_svg]:size-3",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
