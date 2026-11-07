"use client";

import { ErrorState } from "@/components/ui/states";

/** Route-level boundary for unexpected render errors inside the app shell. */
export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorState error={error} onRetry={reset} className="mt-10" />;
}

