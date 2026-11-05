export type ReviewBucket = "review" | "pending" | "posted";

export const prototypeLocales = ["vi", "en"] as const;

export const desktopNavigationIds = [
  "home",
  "review",
  "transactions",
  "accounts",
  "plan",
  "system",
] as const satisfies ReadonlyArray<
  "home" | "review" | "transactions" | "accounts" | "plan" | "system"
>;

export const financialStateClass = {
  forecast: "forecast",
  posted: "complete",
  pending: "pending",
} as const;

export const reviewRecords = [
  { id: "transfer-candidate", bucket: "review", kind: "transfer", pnlImpact: false },
  { id: "duplicate-candidate", bucket: "review", kind: "duplicate", pnlImpact: null },
  { id: "commitment-variance", bucket: "review", kind: "variance", pnlImpact: null },
  { id: "expected-rent", bucket: "pending", kind: "expected", pnlImpact: null },
  { id: "posted-groceries", bucket: "posted", kind: "expense", pnlImpact: true },
] as const;

export function getReviewRecords(bucket: ReviewBucket) {
  return reviewRecords.filter((record) => record.bucket === bucket);
}
