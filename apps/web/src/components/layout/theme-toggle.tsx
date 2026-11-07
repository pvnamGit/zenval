"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "../providers/theme-provider";

export function ThemeToggle() {
  const t = useTranslations("shell");
  const { resolved, setMode } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setMode(resolved === "dark" ? "light" : "dark")}
      aria-label={t("toggleTheme")}
      title={t("toggleTheme")}
      className="grid size-10 place-items-center rounded-xl text-ink-soft transition-colors hover:bg-surface-subtle hover:text-ink"
    >
      {resolved === "dark" ? (
        <Sun aria-hidden className="size-[18px]" />
      ) : (
        <Moon aria-hidden className="size-[18px]" />
      )}
    </button>
  );
}

