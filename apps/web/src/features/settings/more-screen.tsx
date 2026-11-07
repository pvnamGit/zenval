"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { mobilePrimaryKeys, navItems, settingsItem } from "@/components/layout/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page";

/** Mobile "More" hub listing destinations that do not fit in the bottom bar. */
export function MoreScreen() {
  const t = useTranslations("nav");
  const items = [...navItems.filter((item) => !mobilePrimaryKeys.includes(item.key)), settingsItem];
  return (
    <>
      <PageHeader title={t("more")} />
      <Card>
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-5 py-4 text-sm font-medium hover:bg-surface-subtle"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent">
                  <item.icon aria-hidden className="size-4" />
                </span>
                {t(item.key)}
                <ChevronRight aria-hidden className="ml-auto size-4 text-ink-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

