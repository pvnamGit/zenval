"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext, useState } from "react";
import { createZenvalApi } from "./create-api";
import { isApiError } from "./errors";
import type { ZenvalApiClient } from "./types";

const ApiContext = createContext<ZenvalApiClient | null>(null);

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: true,
        retry: (failureCount, error) =>
          failureCount < 2 && (!isApiError(error) || error.isRetryable),
      },
      mutations: { retry: false },
    },
  });
}

export function ApiProvider({
  children,
  api,
  queryClient,
}: {
  children: ReactNode;
  /** Inject a specific adapter (tests, Storybook). Defaults to the configured one. */
  api?: ZenvalApiClient;
  queryClient?: QueryClient;
}) {
  const [client] = useState(() => api ?? createZenvalApi());
  const [queries] = useState(() => queryClient ?? createQueryClient());
  return (
    <ApiContext.Provider value={client}>
      <QueryClientProvider client={queries}>{children}</QueryClientProvider>
    </ApiContext.Provider>
  );
}

export function useApi(): ZenvalApiClient {
  const api = useContext(ApiContext);
  if (!api) throw new Error("useApi must be used inside <ApiProvider>");
  return api;
}

