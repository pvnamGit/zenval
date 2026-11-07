"use client";

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { QuickAddDialog } from "./quick-add-dialog";

type QuickAddContextValue = { open: () => void };

const QuickAddContext = createContext<QuickAddContextValue | null>(null);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <QuickAddContext.Provider value={value}>
      {children}
      <QuickAddDialog open={isOpen} onClose={() => setOpen(false)} />
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd(): QuickAddContextValue {
  const value = useContext(QuickAddContext);
  if (!value) throw new Error("useQuickAdd must be used inside <QuickAddProvider>");
  return value;
}

