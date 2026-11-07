"use client";

import { Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { PageHeader, SampleDataBadge } from "@/components/ui/page";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { EmptyState, QueryView } from "@/components/ui/states";
import { useFinanceQuery, useSessionDrafts } from "@/lib/api/hooks";
import { useQuickAdd } from "./quick-add-provider";
import {
  defaultFilters,
  filterTransactions,
  mergeWithDrafts,
  type TransactionFilters,
} from "./transaction-filters";
import { TransactionList, TransactionListSkeleton } from "./transaction-list";
import { accountMap } from "./transaction-row";

export function TransactionsScreen() {
  const t = useTranslations("transactions");
  const common = useTranslations("common");
  const shell = useTranslations("shell");
  const finance = useFinanceQuery();
  const drafts = useSessionDrafts();
  const { open } = useQuickAdd();
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);

  const all = useMemo(
    () => mergeWithDrafts(finance.data?.transactions ?? [], drafts),
    [finance.data, drafts],
  );
  const visible = useMemo(() => filterTransactions(all, filters), [all, filters]);
  const accounts = useMemo(() => accountMap(finance.data?.accounts ?? []), [finance.data]);

  function update<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <PageHeader
        title={t("title")}
        description={t("description")}
        badge={<SampleDataBadge module="finance" />}
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end">
        <Field label={t("searchLabel")} className="lg:w-72">
          {(ids) => (
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-faint"
              />
              <Input
                {...ids}
                type="search"
                value={filters.query}
                onChange={(event) => update("query", event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="pl-9"
              />
            </div>
          )}
        </Field>
        <SegmentedControl
          label={t("kind")}
          value={filters.kind}
          onChange={(value) => update("kind", value)}
          className="overflow-x-auto"
          options={[
            { value: "all", label: common("all") },
            { value: "expense", label: t("kinds.expense") },
            { value: "income", label: t("kinds.income") },
            { value: "transfer", label: t("kinds.transfer") },
          ]}
        />
        <div className="grid grid-cols-2 gap-3 lg:ml-auto lg:flex">
          <Field label={t("status")}>
            {(ids) => (
              <Select
                {...ids}
                value={filters.status}
                onChange={(event) =>
                  update("status", event.target.value as TransactionFilters["status"])
                }
              >
                <option value="all">{common("all")}</option>
                <option value="posted">{t("statuses.posted")}</option>
                <option value="expected">{t("statuses.expected")}</option>
                <option value="draft">{t("statuses.draft")}</option>
              </Select>
            )}
          </Field>
          <Field label={t("account")}>
            {(ids) => (
              <Select
                {...ids}
                value={filters.accountId}
                onChange={(event) => update("accountId", event.target.value)}
              >
                <option value="all">{t("allAccounts")}</option>
                {(finance.data?.accounts ?? []).map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </div>

      <QueryView query={finance} loading={<TransactionListSkeleton rows={6} />}>
        {() =>
          all.length === 0 ? (
            <EmptyState
              title={t("emptyAll")}
              action={
                <Button onClick={open}>
                  <Plus aria-hidden />
                  {shell("quickAdd")}
                </Button>
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState title={t("empty")} />
          ) : (
            <TransactionList transactions={visible} accounts={accounts} />
          )
        }
      </QueryView>
    </>
  );
}
