import { describe, expect, it } from "vitest";
import {
  clearThemePreference,
  readDisplayPreferences,
  saveDisplayPreference,
} from "./display-preferences";

describe("device display preferences", () => {
  it("restores chosen language and appearance independently of device theme", () => {
    const values = new Map<string, string>();
    const storage = {
      removeItem: (key: string) => {
        values.delete(key);
      },
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => {
        values.set(key, value);
      },
    };
    saveDisplayPreference(storage, "locale", "en");
    saveDisplayPreference(storage, "theme", "light");
    expect(readDisplayPreferences(storage, true)).toEqual({
      locale: "en",
      theme: "light",
      themeOverride: true,
    });
    clearThemePreference(storage);
    expect(readDisplayPreferences(storage, true)).toEqual({
      locale: "en",
      theme: "dark",
      themeOverride: false,
    });
  });

  it("uses Vietnamese and device appearance when values are invalid or storage is unavailable", () => {
    const storage = {
      removeItem: () => {
        throw new Error("blocked");
      },
      getItem: () => "invalid",
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readDisplayPreferences(storage, true)).toEqual({
      locale: "vi",
      theme: "dark",
      themeOverride: false,
    });
    expect(readDisplayPreferences(null, false)).toEqual({
      locale: "vi",
      theme: "light",
      themeOverride: false,
    });
    expect(() => saveDisplayPreference(storage, "theme", "dark")).not.toThrow();
    expect(
      readDisplayPreferences(
        {
          ...storage,
          getItem: () => {
            throw new Error("blocked");
          },
        },
        false,
      ),
    ).toEqual({ locale: "vi", theme: "light", themeOverride: false });
  });
});
