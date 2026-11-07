export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

/** Cookie read by `src/i18n/request.ts`; the same name next-intl uses by convention. */
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as ReadonlyArray<string>).includes(value);
}

/** BCP 47 tag used for `Intl` number/date formatting. */
export function intlLocale(locale: Locale): string {
  return locale === "vi" ? "vi-VN" : "en-US";
}

