import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InvestmentsScreen } from "@/features/investments/investments-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("investments");
  return { title: t("title") };
}

export default function Page() {
  return <InvestmentsScreen />;
}
