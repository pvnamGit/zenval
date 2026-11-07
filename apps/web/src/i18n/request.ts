import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, localeCookieName } from "./config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const requested = store.get(localeCookieName)?.value;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Financial dates are rendered on the client in the device time zone (PRD FR-001/FR-003).
    // This only covers server-rendered strings so next-intl does not warn about a missing zone.
    timeZone: "Asia/Ho_Chi_Minh",
  };
});
