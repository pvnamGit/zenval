import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ReviewScreen } from "@/features/review/review-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("review");
  return { title: t("title") };
}

export default function Page() {
  return <ReviewScreen />;
}
