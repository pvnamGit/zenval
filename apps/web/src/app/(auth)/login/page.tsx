import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginScreen } from "@/features/auth/login-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return { title: { absolute: t("title") } };
}

export default function Page() {
  return <LoginScreen />;
}
