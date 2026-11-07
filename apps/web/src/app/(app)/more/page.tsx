import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { MoreScreen } from "@/features/settings/more-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("more") };
}

export default function Page() {
  return <MoreScreen />;
}
