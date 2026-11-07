"use client";

import { type ReactNode, useId } from "react";
import { cn } from "@/lib/cn";

type Option<T extends string> = { value: T; label: ReactNode; count?: number };

/**
 * Single-choice segmented control built on native radio inputs, so keyboard behaviour (arrow
 * keys, Tab into the group) and screen-reader semantics come from the platform.
 */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  size = "md",
}: {
  value: T;
  onChange: (value: T) => void;
  options: ReadonlyArray<Option<T>>;
  label: string;
  className?: string | undefined;
  size?: "sm" | "md";
}) {
  const name = useId();
  return (
    <fieldset
      className={cn(
        "inline-flex min-w-0 rounded-xl border border-line bg-surface-subtle p-1",
        className,
      )}
    >
      <legend className="sr-only">{label}</legend>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors",
              "has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-accent/45",
              size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3 text-sm",
              selected ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
            {option.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] tabular",
                  selected ? "bg-accent-soft text-accent" : "bg-line/60",
                )}
              >
                {option.count}
              </span>
            ) : null}
          </label>
        );
      })}
    </fieldset>
  );
}
