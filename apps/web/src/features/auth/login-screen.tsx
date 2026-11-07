"use client";

import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

/**
 * Sign-in screen. Authentication (ADD-01 Google OAuth) is not wired yet: both actions enter the
 * sample workspace. Replace `enterWorkspace` with the auth redirect when the API exposes it.
 */
export function LoginScreen() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");

  function enterWorkspace() {
    router.push("/");
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    enterWorkspace();
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-accent p-12 text-on-accent lg:flex">
        <Logo className="[&_span]:text-on-accent [&_rect]:fill-on-accent [&_path]:stroke-accent" />
        <div>
          <p className="max-w-md text-4xl font-semibold leading-tight tracking-tight">
            {t("subtitle")}
          </p>
          <p className="mt-6 flex max-w-md items-start gap-2 text-sm opacity-90">
            <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
            {t("privacy")}
          </p>
        </div>
        <span />
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-sm text-ink-soft lg:hidden">{t("subtitle")}</p>

          <Button variant="secondary" size="lg" className="mt-8 w-full" onClick={enterWorkspace}>
            <GoogleMark />
            {t("google")}
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
            <span className="h-px flex-1 bg-line" />
            {t("or")}
            <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field label={t("email")}>
              {(ids) => (
                <Input
                  {...ids}
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t("emailPlaceholder")}
                />
              )}
            </Field>
            <Button type="submit" size="lg" className="w-full">
              {t("continue")}
            </Button>
          </form>

          <p className="mt-6 rounded-xl bg-amber-soft px-3 py-2.5 text-xs text-amber">
            {t("demo")}
          </p>
        </div>
      </section>
    </main>
  );
}
