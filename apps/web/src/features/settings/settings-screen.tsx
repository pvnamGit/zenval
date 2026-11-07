"use client";

import { Download, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useState, useTransition } from "react";
import { type ThemeMode, useTheme } from "@/components/providers/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { type Locale, localeCookieName } from "@/i18n/config";
import { apiConfig } from "@/lib/api/config";
import { useApi } from "@/lib/api/provider";
import type { ApiModule } from "@/lib/api/types";

function Row({
  label,
  hint,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-ink-soft">{hint}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function setLocaleCookie(locale: Locale) {
  // biome-ignore lint/suspicious/noDocumentCookie: next-intl reads the locale from this cookie on the server.
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

export function SettingsScreen() {
  const t = useTranslations("settings");
  const common = useTranslations("common");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { mode, setMode } = useTheme();
  const api = useApi();
  const [zone, setZone] = useState("");

  useEffect(() => setZone(Intl.DateTimeFormat().resolvedOptions().timeZone), []);

  function changeLocale(next: Locale) {
    setLocaleCookie(next);
    startTransition(() => router.refresh());
  }

  return (
    <>
      <PageHeader title={t("title")} description={t("description")} />
      <div className="flex max-w-3xl flex-col gap-6">
        <Card>
          <CardHeader title={t("display")} />
          <CardBody className="divide-y divide-line">
            <Row label={t("language")}>
              <SegmentedControl<Locale>
                label={t("language")}
                value={locale}
                onChange={changeLocale}
                options={[
                  { value: "vi", label: "Tiếng Việt" },
                  { value: "en", label: "English" },
                ]}
                className={pending ? "opacity-60" : undefined}
              />
            </Row>
            <Row label={t("theme")}>
              <SegmentedControl<ThemeMode>
                label={t("theme")}
                value={mode}
                onChange={setMode}
                options={[
                  { value: "system", label: t("themes.system") },
                  { value: "light", label: t("themes.light") },
                  { value: "dark", label: t("themes.dark") },
                ]}
              />
            </Row>
            <Row label={t("timezone")}>
              <span className="text-sm text-ink-soft">{t("timezoneDevice", { zone })}</span>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t("data")} />
          <CardBody className="divide-y divide-line">
            <Row label={t("export")} hint={t("exportHint")}>
              <Button variant="secondary" size="sm" disabled title={common("comingSoon")}>
                <Download aria-hidden />
                {common("comingSoon")}
              </Button>
            </Row>
            <Row label={t("delete")} hint={t("deleteHint")}>
              <Button variant="secondary" size="sm" disabled title={common("comingSoon")}>
                <Trash2 aria-hidden />
                {common("comingSoon")}
              </Button>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title={t("connection")} />
          <CardBody className="divide-y divide-line">
            <Row label={t("mode")}>
              <Badge tone={apiConfig.mode === "http" ? "accent" : "amber"}>
                {apiConfig.mode === "http" ? t("modeHttp") : t("modeMock")}
              </Badge>
            </Row>
            {apiConfig.mode === "http" ? (
              <Row label={t("baseUrl")}>
                <code className="rounded-md bg-surface-subtle px-2 py-1 text-xs">
                  {apiConfig.baseUrl}
                </code>
              </Row>
            ) : null}
            <Row label={t("modules")}>
              <ul className="flex max-w-md flex-wrap justify-end gap-1.5">
                {(Object.entries(api.sources) as Array<[ApiModule, string]>)
                  .filter(([module]) => module !== "transactions")
                  .map(([module, source]) => (
                    <li key={module}>
                      <Badge tone={source === "http" ? "accent" : "amber"}>
                        {module in navLabels
                          ? nav(navLabels[module as keyof typeof navLabels])
                          : module}
                        : {source}
                      </Badge>
                    </li>
                  ))}
              </ul>
            </Row>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

const navLabels = {
  dashboard: "home",
  finance: "accounts",
  review: "review",
  planning: "plan",
  debts: "debts",
  investments: "investments",
  reports: "reports",
} as const;
