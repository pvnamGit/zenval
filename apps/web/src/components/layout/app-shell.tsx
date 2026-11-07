"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";
import { useQuickAdd } from "@/features/transactions/quick-add-provider";
import { useDashboardQuery } from "@/lib/api/hooks";
import { useApi } from "@/lib/api/provider";
import { cn } from "@/lib/cn";
import { Button } from "../ui/button";
import { CommandPalette } from "./command-palette";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { isActive, navItems, settingsItem } from "./navigation";
import { ThemeToggle } from "./theme-toggle";

function ReviewCountBadge() {
  const { data } = useDashboardQuery();
  if (!data?.reviewCount) return null;
  return (
    <span className="ml-auto rounded-full bg-amber-soft px-2 text-[11px] font-semibold text-amber tabular">
      {data.reviewCount}
    </span>
  );
}

function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const api = useApi();
  const sample = Object.values(api.sources).some((source) => source === "mock");
  const shell = useTranslations("shell");

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line bg-surface px-3 py-5 lg:flex">
      <Link href="/" className="mb-6 flex items-center gap-2 px-3">
        <Logo />
      </Link>
      <nav aria-label={t("primary")} className="flex flex-1 flex-col gap-0.5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-soft text-accent"
                  : "text-ink-soft hover:bg-surface-subtle hover:text-ink",
              )}
            >
              <Icon aria-hidden className="size-[18px]" />
              {t(item.key)}
              {item.key === "review" ? <ReviewCountBadge /> : null}
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col gap-2 border-t border-line pt-3">
        {sample ? (
          <p className="mx-3 rounded-lg bg-amber-soft px-2.5 py-1.5 text-[11px] font-medium text-amber">
            {shell("sampleMode")}
          </p>
        ) : null}
        <Link
          href={settingsItem.href}
          aria-current={isActive(pathname, settingsItem.href) ? "page" : undefined}
          className={cn(
            "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
            isActive(pathname, settingsItem.href)
              ? "bg-accent-soft text-accent"
              : "text-ink-soft hover:bg-surface-subtle hover:text-ink",
          )}
        >
          <settingsItem.icon aria-hidden className="size-[18px]" />
          {t("settings")}
        </Link>
      </div>
    </aside>
  );
}

function Topbar({ onSearch }: { onSearch: () => void }) {
  const t = useTranslations("shell");
  const { open } = useQuickAdd();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="lg:hidden">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={onSearch}
          className="ml-auto flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm text-ink-faint transition-colors hover:border-line-strong lg:ml-0 lg:w-72"
        >
          <Search aria-hidden className="size-4" />
          <span className="sr-only lg:not-sr-only">{t("search")}</span>
          <kbd className="ml-auto hidden rounded-md border border-line px-1.5 text-[11px] lg:inline">
            ⌘K
          </kbd>
        </button>
        <div className="flex items-center gap-1 lg:ml-auto">
          <ThemeToggle />
          <Button onClick={open} className="hidden sm:inline-flex">
            <Plus aria-hidden />
            {t("quickAdd")}
          </Button>
        </div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations("nav");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="fixed top-2 left-2 z-50 -translate-y-[150%] rounded-lg bg-ink px-3 py-2 text-sm text-surface focus:translate-y-0"
      >
        {t("skipToContent")}
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onSearch={() => setSearchOpen(true)} />
        <main
          id="main"
          className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 lg:px-8 lg:pb-12"
        >
          {children}
        </main>
      </div>
      <MobileNav />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}

