export type Locale = "vi" | "en";
export type Theme = "light" | "dark";

const localeKey = "zenval.display.locale";
const themeKey = "zenval.display.theme";
type StoragePort = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export function readDisplayPreferences(
  storage: StoragePort | null,
  deviceDark: boolean,
): {
  locale: Locale;
  theme: Theme;
  themeOverride: boolean;
} {
  let locale: string | null = null;
  let theme: string | null = null;
  try {
    locale = storage?.getItem(localeKey) ?? null;
    theme = storage?.getItem(themeKey) ?? null;
  } catch {
    // A blocked storage API should not prevent the interface from loading.
  }
  return {
    locale: locale === "en" ? "en" : "vi",
    theme: theme === "light" || theme === "dark" ? theme : deviceDark ? "dark" : "light",
    themeOverride: theme === "light" || theme === "dark",
  };
}

export function saveDisplayPreference(
  storage: StoragePort | null,
  key: "locale" | "theme",
  value: Locale | Theme,
): void {
  try {
    storage?.setItem(key === "locale" ? localeKey : themeKey, value);
  } catch {
    // The active preference still works for this session.
  }
}

export function clearThemePreference(storage: StoragePort | null): void {
  try {
    storage?.removeItem(themeKey);
  } catch {
    // Continue using the device setting for this session.
  }
}
