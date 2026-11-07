import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DebtsScreen } from "@/features/debts/debts-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("debts");
  return { title: t("title") };
}

export default function Page() {
  return <DebtsScreen />;
}
