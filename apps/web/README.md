# @zenval/web

Next.js App Router PWA for Zenval. Screens depend on a typed API port, so the backend can be
connected module by module without touching UI code.

## Run

```bash
pnpm --filter @zenval/web dev                          # mock data (default)
NEXT_PUBLIC_API_MODE=http pnpm --filter @zenval/web dev  # call apps/api at NEXT_PUBLIC_API_BASE_URL
```

## Structure

```text
src/
  app/                    routes only (thin server components + metadata)
    (app)/                authenticated shell: /, /transactions, /accounts/[id], /review, /plan,
                          /debts, /investments, /reports, /settings, /more
    (auth)/login          sign-in screen (OAuth not wired yet)
  features/<module>/      screens, module components, pure helpers (+ tests)
  components/ui/          design-system primitives (Button, Card, Dialog, Field, Money, …)
  components/layout/      app shell: sidebar, top bar, mobile nav, ⌘K palette
  components/providers/   theme, toast, and API/query providers
  lib/api/                API port, HTTP client, adapters, TanStack Query hooks
  lib/money.ts, dates.ts  exact money formatting (decimal strings/bigint), date helpers
  i18n/, messages/        next-intl (vi default, en) via the NEXT_LOCALE cookie
  legacy-prototype/       earlier port of design/ kept for reference; not routed
```

## API integration

- `lib/api/types.ts` — `ZenvalApi`, the only interface screens use (via hooks in `lib/api/hooks.ts`).
- `lib/api/http-api.ts` — HTTP adapter. Every response is validated with a zod contract; errors are
  normalized to `ApiError` (`network`, `http`, `invalid-response`, `not-implemented`, …).
- `lib/api/mock/` — in-memory adapter with the same behavior (idempotency, draft-only captures).
- `lib/api/draft-schemas.ts` — contracts for endpoints that do not exist yet (planning, debts,
  investments, reports, review resolution). When an endpoint lands: move its schema to
  `@zenval/contracts`, implement it in `http-api.ts`, and set its `sources` entry to `"http"`.
  Screens show a "sample data" badge for any module still served by the mock.

Mutations send `X-Idempotency-Key`; one key is generated per user intent and reused on retry.

## Rules

- Never convert money to `number`; use `formatMoney`/`<Money>` with `MoneyDto` strings.
- The UI does not calculate financial figures. Derived values come from the API with source,
  `asOf`, and calculation version, rendered via `<Provenance>`.
- Transfers and debt principal are labeled as having no income/expense impact.
