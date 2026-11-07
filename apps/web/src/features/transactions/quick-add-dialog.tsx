"use client";

import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Info } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ErrorState, Skeleton } from "@/components/ui/states";
import { intlLocale } from "@/i18n/config";
import { useCreateTransaction, useFinanceQuery } from "@/lib/api/hooks";
import { cn } from "@/lib/cn";
import { formatIntegerInput } from "@/lib/money";
import { expenseCategories, incomeCategories } from "./categories";
import { buildQuickAddRequest, type QuickAddErrors, type TransactionKind } from "./quick-add-form";

function newKey(): string {
  return crypto.randomUUID();
}

export function QuickAddDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("quickAdd");
  const tx = useTranslations("transactions");
  const common = useTranslations("common");
  const locale = intlLocale(useLocale());
  const { notify } = useToast();
  const finance = useFinanceQuery();
  const mutation = useCreateTransaction();

  const [kind, setKind] = useState<TransactionKind>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sourceAccountId, setSource] = useState("");
  const [destinationAccountId, setDestination] = useState("");
  const [errors, setErrors] = useState<QuickAddErrors>({});
  // One idempotency key per user intent: a retry of the same payload reuses it so the API can
  // de-duplicate; any change to the payload is a new intent and gets a new key.
  const attempt = useRef<{ key: string; fingerprint: string } | null>(null);

  const accounts = finance.data?.accounts ?? [];

  useEffect(() => {
    if (!open) return;
    setErrors({});
    mutation.reset();
  }, [open, mutation.reset]);

  useEffect(() => {
    if (!sourceAccountId && accounts[0]) setSource(accounts[0].id);
    if (!destinationAccountId && accounts[1]) setDestination(accounts[1].id);
  }, [accounts, sourceAccountId, destinationAccountId]);

  const categories = kind === "income" ? incomeCategories : expenseCategories;

  function changeKind(next: TransactionKind) {
    setKind(next);
    setCategory(null);
    setErrors({});
  }

  function resetForm() {
    setAmount("");
    setCategory(null);
    setErrors({});
    attempt.current = null;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const result = buildQuickAddRequest({
      kind,
      amount,
      category,
      sourceAccountId,
      destinationAccountId,
    });
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    const fingerprint = JSON.stringify(result.request);
    if (attempt.current?.fingerprint !== fingerprint) {
      attempt.current = { key: newKey(), fingerprint };
    }
    mutation.mutate(
      { request: result.request, idempotencyKey: attempt.current.key },
      {
        onSuccess: ({ replayed }) => {
          notify(replayed ? t("replayed") : t("success"));
          resetForm();
          onClose();
        },
      },
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title={t("title")} description={t("description")}>
      {finance.isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-11" />
          <Skeleton className="h-16" />
          <Skeleton className="h-11" />
        </div>
      ) : finance.isError ? (
        <ErrorState error={finance.error} onRetry={() => void finance.refetch()} />
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          <SegmentedControl
            label={tx("kind")}
            value={kind}
            onChange={changeKind}
            className="w-full"
            options={[
              {
                value: "expense",
                label: (
                  <>
                    <ArrowUpRight aria-hidden className="size-4" />
                    {tx("kinds.expense")}
                  </>
                ),
              },
              {
                value: "income",
                label: (
                  <>
                    <ArrowDownLeft aria-hidden className="size-4" />
                    {tx("kinds.income")}
                  </>
                ),
              },
              {
                value: "transfer",
                label: (
                  <>
                    <ArrowLeftRight aria-hidden className="size-4" />
                    {tx("kinds.transfer")}
                  </>
                ),
              },
            ]}
          />

          <Field label={t("amount")} error={errors.amount ? t("errors.amount") : undefined}>
            {(ids) => (
              <div className="relative">
                <Input
                  {...ids}
                  inputMode="numeric"
                  autoComplete="off"
                  autoFocus
                  placeholder={t("amountPlaceholder")}
                  value={amount}
                  onChange={(event) => setAmount(formatIntegerInput(event.target.value, locale))}
                  className="h-14 pr-12 text-2xl font-semibold tabular"
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-lg text-ink-faint">
                  ₫
                </span>
              </div>
            )}
          </Field>

          {kind !== "transfer" ? (
            <fieldset>
              <legend className="mb-1.5 text-xs font-medium text-ink-soft">{t("category")}</legend>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={category === item.value}
                    onClick={() => setCategory(item.value)}
                    className={cn(
                      "h-9 rounded-full border px-3 text-sm transition-colors",
                      category === item.value
                        ? "border-accent bg-accent-soft font-medium text-accent"
                        : "border-line bg-surface text-ink-soft hover:border-line-strong",
                    )}
                  >
                    {t(`categories.${item.key}`)}
                  </button>
                ))}
              </div>
              {errors.category ? (
                <p className="mt-1.5 text-xs font-medium text-danger">{t("errors.category")}</p>
              ) : null}
            </fieldset>
          ) : null}

          <div className={cn("grid gap-4", kind === "transfer" && "sm:grid-cols-2")}>
            <Field label={kind === "transfer" ? t("from") : t("account")}>
              {(ids) => (
                <Select
                  {...ids}
                  value={sourceAccountId}
                  onChange={(event) => setSource(event.target.value)}
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} · {account.institution}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            {kind === "transfer" ? (
              <Field
                label={t("to")}
                error={errors.destination ? t("errors.destination") : undefined}
              >
                {(ids) => (
                  <Select
                    {...ids}
                    value={destinationAccountId}
                    onChange={(event) => setDestination(event.target.value)}
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} · {account.institution}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            ) : null}
          </div>

          {kind === "transfer" ? (
            <p className="flex gap-2 rounded-xl bg-info-soft px-3 py-2.5 text-xs text-info">
              <Info aria-hidden className="mt-px size-4 shrink-0" />
              {t("transferNote")}
            </p>
          ) : null}

          {mutation.isError ? <ErrorState error={mutation.error} /> : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onClose}>
              {common("cancel")}
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("submitting") : t("submit")}
            </Button>
          </div>
        </form>
      )}
    </Dialog>
  );
}
