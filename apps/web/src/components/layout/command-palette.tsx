"use client";

import { ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { navItems, settingsItem } from "./navigation";

/** ⌘K navigation palette. Searches screens today; extend with entity search when the API has it. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("shell");
  const nav = useTranslations("nav");
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return [...navItems, settingsItem].filter((item) =>
      nav(item.key).toLocaleLowerCase().includes(normalized),
    );
  }, [query, nav]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery("");
      setActiveIndex(0);
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function go(href: string) {
    onClose();
    router.push(href);
  }

  const active = Math.min(activeIndex, results.length - 1);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click is a pointer shortcut; Escape is handled natively via onCancel.
    <dialog
      ref={dialogRef}
      aria-label={t("search")}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-line bg-surface-raised p-0 text-ink shadow-card"
    >
      <div className="flex items-center gap-2 border-b border-line px-4">
        <Search aria-hidden className="size-4 text-ink-faint" />
        <input
          ref={inputRef}
          type="search"
          aria-label={t("search")}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex(Math.min(active + 1, results.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex(Math.max(active - 1, 0));
            } else if (event.key === "Enter") {
              const item = results[active];
              if (!item) return;
              event.preventDefault();
              go(item.href);
            }
          }}
          placeholder={t("searchPlaceholder")}
          className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint focus-visible:outline-none"
        />
      </div>
      <ul className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-ink-faint">{t("noResults")}</li>
        ) : (
          results.map((item, index) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => go(item.href)}
                onMouseEnter={() => setActiveIndex(index)}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm",
                  index === active ? "bg-accent-soft text-accent" : "text-ink",
                )}
              >
                <item.icon aria-hidden className="size-4" />
                {nav(item.key)}
                <ChevronRight aria-hidden className="ml-auto size-4 opacity-60" />
              </button>
            </li>
          ))
        )}
      </ul>
    </dialog>
  );
}
