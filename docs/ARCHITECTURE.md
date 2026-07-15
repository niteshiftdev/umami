# Umami Architecture Overview

Umami is a privacy-focused, self-hosted web analytics platform — an alternative to
Google Analytics that collects visitor data **without cookies and without collecting
personal information**. This document is a map of the codebase for contributors: what
the major pieces are, how a request flows through the system, and where to look when
working on a given feature.

For day-to-day setup and installation, see [`README.md`](../README.md). For
sandbox-specific and prototyping guidance, see [`CLAUDE.md`](../CLAUDE.md).

## Tech stack

| Concern            | Choice                                                        |
| ------------------ | ------------------------------------------------------------- |
| Framework          | Next.js 15 (App Router), React 19                             |
| Language           | TypeScript (ES2022)                                           |
| Database           | PostgreSQL via Prisma ORM (optional ClickHouse for analytics) |
| Data fetching (UI) | `@tanstack/react-query`                                       |
| Client state       | Zustand stores (`src/store/`)                                 |
| UI components      | `@umami/react-zen` component library                          |
| i18n               | `react-intl` via the `useMessages` hook                       |
| Charts             | Chart.js + react-spring                                       |
| Package manager    | pnpm                                                          |

## The two halves of the system

Umami is really two applications sharing one codebase and database.

### 1. Data collection (write path)

A lightweight tracker script runs on customer websites and sends a small payload on
each pageview or custom event. The server enriches the payload (device, browser, OS,
geo, referrer) and persists it.

- **`src/tracker/`** — source for the client-side tracking script that sites embed.
- **`src/app/(collect)/`** — the public collection endpoints:
  - `p/[slug]` — pageview/event collection
  - `q/[slug]` — queue/secondary collection
- **`src/app/api/send/`** — the primary event ingestion API route.
- **`src/lib/detect.ts`, `src/lib/ip.ts`** — user-agent parsing and IP/geo detection
  used to enrich incoming hits.

Incoming hits are stored as `Session` (one per visitor session) plus `WebsiteEvent`
rows (one per pageview or custom event), with optional `EventData` / `SessionData`
for custom properties.

### 2. Analytics dashboard (read path)

The authenticated app where users view reports, manage websites, and configure teams.

- **`src/app/(main)/`** — the authenticated UI. Key sections:
  - `websites/` — per-site analytics dashboards
  - `dashboard/` & `boards/` — cross-website overview boards
  - `reports/` — saved custom reports (funnels, retention, attribution, etc.)
  - `links/` — short-link tracking
  - `pixels/` — tracking-pixel management
  - `teams/`, `settings/`, `admin/` — administration
- **`src/app/share/`** — public, read-only shared report pages.

## Request lifecycle (API routes)

API routes live under `src/app/api/**/route.ts` and follow a consistent pattern:

```ts
export async function GET(request: Request) {
  const { query, auth, error } = await parseRequest(request, schema); // parse + Zod-validate
  if (error) return error();          // early-return on validation/auth failure
  // ...authorization + business logic...
  return json(data);                  // response helpers from @/lib/response
}
```

1. **Parse & validate** — `parseRequest()` (`src/lib/request.ts`) parses the request
   and validates it against a Zod schema.
2. **Authenticate** — `checkAuth()` (`src/lib/auth.ts`); can be bypassed with
   `skipAuth: true` for public collection endpoints.
3. **Authorize** — permission checks in `src/permissions/`.
4. **Query** — via the query layer (below).
5. **Respond** — helpers in `src/lib/response.ts` (`json`, `unauthorized`, etc.).

## Data & query layer

The query layer abstracts over multiple database backends through `runQuery()` in
[`src/lib/db.ts`](../src/lib/db.ts):

```ts
return runQuery({
  [PRISMA]: () => prismaQuery(),
  [CLICKHOUSE]: () => clickhouseQuery(),
});
```

- **`src/queries/prisma/`** — entity CRUD via Prisma (website, user, team, report,
  link, pixel, segment, …).
- **`src/queries/sql/`** — hand-written SQL for analytics aggregations, grouped by
  concern: `events/`, `pageviews/`, `sessions/`, `reports/`, plus realtime and stats
  helpers.
- **Generated Prisma client** lives in `src/generated/prisma/` (non-default location).
  **Never edit generated files by hand** — regenerate with `pnpm build-db-client`
  after changing `prisma/schema.prisma`.

### Core data model (`prisma/schema.prisma`)

| Model                         | Purpose                                        |
| ----------------------------- | ---------------------------------------------- |
| `User`, `Team`, `TeamUser`    | Accounts, organizations, and membership        |
| `Website`                     | A tracked site                                 |
| `Session`, `SessionData`      | A visitor session and its custom properties    |
| `WebsiteEvent`, `EventData`   | A pageview/custom event and its properties     |
| `Report`, `Segment`           | Saved reports and reusable audience segments   |
| `Revenue`                     | Revenue attribution data                       |
| `Link`, `Pixel`               | Short-link tracking and tracking pixels        |

## Frontend architecture

- **Component library first** — reach for `@umami/react-zen` primitives (`Button`,
  `Form`, `Row`, `Column`, `Grid`, `Modal`, …) before writing custom CSS.
- **Shared components** — `src/components/common/` (`PageBody`, `PageHeader`, `Panel`,
  `DataGrid`, `Empty`, …). Feature-specific groups: `charts/`, `metrics/`, `boards/`,
  `input/`.
- **Data fetching** — prefer the pre-built query hooks in
  `src/components/hooks/queries/` (e.g. `useWebsitesQuery`, `useReportsQuery`). Fall
  back to `useApi()` + React Query for one-off calls.
- **Global state** — Zustand stores in `src/store/` (`app`, `dashboard`, `websites`,
  `cache`, `version`).
- **i18n** — all user-facing strings go through `useMessages()`; strings are defined
  in `src/components/messages.ts` and compiled to `public/intl/messages/`.

## Directory quick reference

```
src/
├── app/
│   ├── (main)/        Authenticated dashboard UI
│   ├── (collect)/     Public data-collection endpoints (p/, q/)
│   ├── api/           REST API routes
│   ├── login/ sso/    Authentication pages
│   └── share/         Public shared reports
├── tracker/           Client-side tracking script source
├── lib/               Core utilities (db, auth, request/response, date, detect, ip)
├── queries/           DB query layer (prisma/ + raw sql/)
├── permissions/       Authorization checks
├── components/        React UI (common, input, charts, metrics, boards, hooks)
├── store/             Zustand state stores
├── config/            App/config constants and the Niteshift design manifest
└── generated/prisma/  Auto-generated Prisma client (do not edit)
```

## Where do I make a change?

| I want to…                       | Start here                                         |
| -------------------------------- | -------------------------------------------------- |
| Add a dashboard page             | `src/app/(main)/<feature>/page.tsx`                |
| Add an API endpoint              | `src/app/api/<feature>/route.ts`                   |
| Add a reusable component         | `src/components/common/`                            |
| Add a data hook                  | `src/components/hooks/queries/`                     |
| Change an analytics aggregation  | `src/queries/sql/`                                 |
| Change an entity CRUD query      | `src/queries/prisma/`                              |
| Change the DB schema             | `prisma/schema.prisma` → `pnpm build-db-client`    |
| Change what the tracker collects | `src/tracker/` → `pnpm build-tracker`              |

## Common commands

```bash
pnpm dev               # Dev server (port 3001, Turbo)
pnpm test              # Jest unit tests
pnpm lint              # ESLint (also runs on pre-commit)
pnpm build-db-client   # Regenerate the Prisma client after schema changes
pnpm update-db         # Apply new migrations
pnpm build-tracker     # Rebuild the tracking script
pnpm build-geo         # Rebuild the GeoIP database
```
