"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Modal built on the native <dialog> element: focus trapping, Escape-to-close, and the top layer
 * come from the platform. On small screens it renders as a bottom sheet.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string | undefined;
}) {
  const t = useTranslations("common");
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click is a pointer shortcut; Escape is handled natively via onCancel.
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clicking the backdrop (the dialog element itself) closes the modal.
        if (event.target === event.currentTarget) onClose();
      }}
      className={cn(
        "m-0 mt-auto w-full max-w-none rounded-t-3xl border border-line bg-surface-raised p-0 text-ink shadow-card",
        "sm:m-auto sm:max-w-lg sm:rounded-3xl",
        "max-h-[92dvh] overflow-y-auto",
        className,
      )}
    >
      {open ? (
        <div className="p-5 sm:p-6">
          <header className="mb-5 flex items-start gap-3">
            <div className="flex-1">
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="mt-1 text-sm text-ink-soft">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="-m-2 grid size-10 place-items-center rounded-xl text-ink-soft hover:bg-surface-subtle hover:text-ink"
            >
              <X aria-hidden className="size-5" />
            </button>
          </header>
          {children}
        </div>
      ) : null}
    </dialog>
  );
}
