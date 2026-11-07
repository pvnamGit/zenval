import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AccountDetailScreen } from "@/features/accounts/accounts-screen";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("accounts");
  return { title: t("title") };
}

export default async function Page({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;
  return <AccountDetailScreen accountId={decodeURIComponent(accountId)} />;
}
