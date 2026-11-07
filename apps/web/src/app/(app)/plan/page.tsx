import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PlanScreen } from "@/features/plan/plan-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("plan");
  return { title: t("title") };
}

export default function Page() {
  return <PlanScreen />;
}
