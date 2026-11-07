/**
 * Date helpers. Instants (`2026-11-05T02:42:00Z`) render in the device time zone; calendar dates
 * (`2026-11-05`) are parsed as local dates so they never shift across a UTC boundary.
 */

const calendarDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCalendarDate(value: string): Date {
  const match = calendarDatePattern.exec(value);
  if (!match) return new Date(value);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export function formatDate(
  value: string,
  locale: string,
  style: "short" | "medium" | "long" = "medium",
): string {
  const date = parseCalendarDate(value);
  const options: Intl.DateTimeFormatOptions =
    style === "short"
      ? { day: "2-digit", month: "2-digit" }
      : style === "long"
        ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
        : { day: "numeric", month: "short", year: "numeric" };
  return new Intl.DateTimeFormat(locale, options).format(date);
}

export function formatDateTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
    new Date(value),
  );
}

export function formatMonth(value: string, locale: string): string {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit" }).format(
    new Date(year ?? 1970, (month ?? 1) - 1, 1),
  );
}

/** Whole calendar days from `now` to `value` (negative when overdue). */
export function daysUntil(value: string, now: Date = new Date()): number {
  const target = parseCalendarDate(value);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((startOfTarget.getTime() - today.getTime()) / 86_400_000);
}

export function formatRelativeDays(value: string, locale: string, now: Date = new Date()): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
    daysUntil(value, now),
    "day",
  );
}

/** Groups items by local calendar day key `YYYY-MM-DD`, preserving input order. */
export function localDayKey(isoInstant: string): string {
  const date = new Date(isoInstant);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

