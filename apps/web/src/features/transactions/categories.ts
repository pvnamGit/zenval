/**
 * Quick-add categories. `value` is the canonical category name stored by the API (matching the
 * demo fixture); `key` selects the localized label. Replace with the categories endpoint (FR-015)
 * when it exists.
 */
export const expenseCategories = [
  { key: "food", value: "Ăn uống" },
  { key: "transport", value: "Đi lại" },
  { key: "shopping", value: "Mua sắm" },
  { key: "bills", value: "Hóa đơn" },
  { key: "health", value: "Sức khỏe" },
  { key: "entertainment", value: "Giải trí" },
] as const;

export const incomeCategories = [
  { key: "salary", value: "Lương" },
  { key: "bonus", value: "Thưởng" },
  { key: "otherIncome", value: "Thu nhập khác" },
] as const;

export type CategoryKey =
  | (typeof expenseCategories)[number]["key"]
  | (typeof incomeCategories)[number]["key"];
