"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateDemoTransactionRequest,
  DemoFinanceSnapshot,
  DemoTransaction,
} from "@zenval/contracts";
import type { ReviewAction } from "./draft-schemas";
import { useApi } from "./provider";

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  finance: ["finance"] as const,
  /** Draft captures created in this browser session (the API does not list drafts yet). */
  sessionDrafts: ["transactions", "session-drafts"] as const,
  planning: ["planning"] as const,
  debts: ["debts"] as const,
  investments: ["investments"] as const,
  reports: ["reports"] as const,
};

export function useDashboardQuery() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: ({ signal }) => api.dashboard.get({ signal }),
  });
}

export function useFinanceQuery() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.finance,
    queryFn: ({ signal }) => api.finance.get({ signal }),
  });
}

export function usePlanningQuery() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.planning,
    queryFn: ({ signal }) => api.planning.get({ signal }),
  });
}

export function useDebtsQuery() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.debts,
    queryFn: ({ signal }) => api.debts.get({ signal }),
  });
}

export function useInvestmentsQuery() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.investments,
    queryFn: ({ signal }) => api.investments.get({ signal }),
  });
}

export function useReportsQuery() {
  const api = useApi();
  return useQuery({
    queryKey: queryKeys.reports,
    queryFn: ({ signal }) => api.reports.get({ signal }),
  });
}

export function useSessionDrafts(): DemoTransaction[] {
  const { data } = useQuery<DemoTransaction[]>({
    queryKey: queryKeys.sessionDrafts,
    queryFn: () => [],
    initialData: [],
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
  return data;
}

export type CreateTransactionVariables = {
  request: CreateDemoTransactionRequest;
  /** Generate once per user intent and reuse it on retry so the API can de-duplicate. */
  idempotencyKey: string;
};

export function useCreateTransaction() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ request, idempotencyKey }: CreateTransactionVariables) =>
      api.transactions.create(request, { idempotencyKey }),
    onSuccess: ({ transaction }) => {
      queryClient.setQueryData<DemoTransaction[]>(queryKeys.sessionDrafts, (previous = []) => [
        transaction,
        ...previous.filter((item) => item.id !== transaction.id),
      ]);
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export type ResolveReviewVariables = {
  itemId: string;
  action: ReviewAction;
  idempotencyKey: string;
};

export function useResolveReviewItem() {
  const api = useApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, action, idempotencyKey }: ResolveReviewVariables) =>
      api.review.resolve(itemId, action, { idempotencyKey }),
    onMutate: async ({ itemId, action }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.finance });
      const previous = queryClient.getQueryData<DemoFinanceSnapshot>(queryKeys.finance);
      if (previous) {
        // Optimistic: the server remains the source of truth and is refetched on settle.
        queryClient.setQueryData<DemoFinanceSnapshot>(queryKeys.finance, {
          ...previous,
          reviewItems: previous.reviewItems.flatMap((item) => {
            if (item.id !== itemId) return [item];
            if (action === "dismiss" || item.kind === "duplicate") return [];
            return [{ ...item, bucket: "posted" as const }];
          }),
        });
      }
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.finance, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.finance });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
