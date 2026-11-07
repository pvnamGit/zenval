import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountsScreen } from "@/features/accounts/accounts-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("accounts");
  return { title: t("title") };
}

export default function Page() {
  return <AccountsScreen />;
}
