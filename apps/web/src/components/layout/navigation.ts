import {
  ArrowLeftRight,
  CalendarClock,
  ChartColumn,
  House,
  Inbox,
  type LucideIcon,
  Scale,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";

export type NavKey =
  | "home"
  | "transactions"
  | "accounts"
  | "review"
  | "plan"
  | "debts"
  | "investments"
  | "reports"
  | "settings";

export type NavItem = { key: NavKey; href: string; icon: LucideIcon };

export const navItems: ReadonlyArray<NavItem> = [
  { key: "home", href: "/", icon: House },
  { key: "review", href: "/review", icon: Inbox },
  { key: "transactions", href: "/transactions", icon: ArrowLeftRight },
  { key: "accounts", href: "/accounts", icon: Wallet },
  { key: "plan", href: "/plan", icon: CalendarClock },
  { key: "debts", href: "/debts", icon: Scale },
  { key: "investments", href: "/investments", icon: TrendingUp },
  { key: "reports", href: "/reports", icon: ChartColumn },
];

export const settingsItem: NavItem = { key: "settings", href: "/settings", icon: Settings };

/** Mobile bottom bar: four destinations around the central quick-add button. */
export const mobilePrimaryKeys: ReadonlyArray<NavKey> = ["home", "transactions", "review"];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
