import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { QuickAddProvider } from "@/features/transactions/quick-add-provider";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QuickAddProvider>
      <AppShell>{children}</AppShell>
    </QuickAddProvider>
  );
}

