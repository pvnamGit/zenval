"use client";

import { Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useQuickAdd } from "@/features/transactions/quick-add-provider";
import { cn } from "@/lib/cn";
import { isActive, mobilePrimaryKeys, navItems } from "./navigation";

const primary = navItems.filter((item) => mobilePrimaryKeys.includes(item.key));
const secondaryHrefs = navItems
  .filter((item) => !mobilePrimaryKeys.includes(item.key))
  .map((item) => item.href)
  .concat("/settings", "/more");

function Tab({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium",
        active ? "text-accent" : "text-ink-faint",
      )}
    >
      {children}
      {label}
    </Link>
  );
}

export function MobileNav() {
  const t = useTranslations("nav");
  const shell = useTranslations("shell");
  const pathname = usePathname();
  const { open } = useQuickAdd();
  const [first, second, third] = primary;
  const moreActive = secondaryHrefs.some((href) => isActive(pathname, href));

  return (
    <nav
      aria-label={t("primary")}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch px-2">
        {[first, second].map((item) =>
          item ? (
            <Tab
              key={item.key}
              href={item.href}
              label={t(item.key)}
              active={isActive(pathname, item.href)}
            >
              <item.icon aria-hidden className="size-5" />
            </Tab>
          ) : null,
        )}
        <div className="flex flex-1 items-center justify-center">
          <button
            type="button"
            onClick={open}
            aria-label={shell("quickAdd")}
            className="-mt-6 grid size-14 place-items-center rounded-2xl bg-accent text-on-accent shadow-card ring-4 ring-canvas transition-transform active:scale-95"
          >
            <Plus aria-hidden className="size-6" />
          </button>
        </div>
        {third ? (
          <Tab href={third.href} label={t(third.key)} active={isActive(pathname, third.href)}>
            <third.icon aria-hidden className="size-5" />
          </Tab>
        ) : null}
        <Tab href="/more" label={t("more")} active={moreActive}>
          <Ellipsis aria-hidden className="size-5" />
        </Tab>
      </div>
    </nav>
  );
}

