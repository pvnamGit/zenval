import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buttonClass } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("errors");
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-sm text-center">
        <p className="text-5xl font-semibold text-accent tabular">404</p>
        <h1 className="mt-4 text-xl font-semibold text-ink">{t("notFoundTitle")}</h1>
        <p className="mt-2 text-sm text-ink-soft">{t("notFoundBody")}</p>
        <Link href="/" className={buttonClass("primary", "md", "mt-6")}>
          {t("goHome")}
        </Link>
      </div>
    </main>
  );
}
