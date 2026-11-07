"use client";

import type { ReactNode } from "react";
import { ApiProvider } from "@/lib/api/provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ApiProvider>
        <ToastProvider>{children}</ToastProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

