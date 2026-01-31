# Umami Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT APPLICATIONS                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────────────┐        ┌──────────────────────┐                       │
│  │   Umami Dashboard    │        │   Tracked Websites   │                       │
│  │   (React SPA)        │        │   (with tracker.js)  │                       │
│  └──────────┬───────────┘        └──────────┬───────────┘                       │
│             │                               │                                    │
│             │ REST API                      │ POST /api/send                     │
│             │                               │                                    │
└─────────────┼───────────────────────────────┼────────────────────────────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           NEXT.JS APPLICATION                                    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         APP ROUTER (src/app/)                               ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐││
│  │  │  (main)/    │  │  (collect)/ │  │    api/     │  │  login/logout/sso   │││
│  │  │  Dashboard  │  │  Link/Pixel │  │  REST API   │  │  Authentication     │││
│  │  │  Websites   │  │  Collection │  │  Endpoints  │  │  Pages              │││
│  │  │  Reports    │  │             │  │             │  │                     │││
│  │  │  Settings   │  │             │  │             │  │                     │││
│  │  └─────────────┘  └─────────────┘  └──────┬──────┘  └─────────────────────┘││
│  └───────────────────────────────────────────┼─────────────────────────────────┘│
│                                              │                                   │
│  ┌───────────────────────────────────────────┼─────────────────────────────────┐│
│  │                         CORE LIBRARIES (src/lib/)                           ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      ││
│  │  │  auth.ts │  │request.ts│  │response.ts│ │  db.ts   │  │ detect.ts│      ││
│  │  │  JWT     │  │  Zod     │  │  JSON    │  │  Query   │  │  Device  │      ││
│  │  │  Tokens  │  │  Schema  │  │  Helpers │  │  Routing │  │  Detection│     ││
│  │  └──────────┘  └──────────┘  └──────────┘  └────┬─────┘  └──────────┘      ││
│  └─────────────────────────────────────────────────┼───────────────────────────┘│
│                                                    │                             │
│  ┌─────────────────────────────────────────────────┼───────────────────────────┐│
│  │                       QUERY LAYER (src/queries/)                            ││
│  │  ┌─────────────────────────┐    ┌─────────────────────────┐                 ││
│  │  │      prisma/            │    │        sql/             │                 ││
│  │  │  • user.ts              │    │  • events/              │                 ││
│  │  │  • website.ts           │    │  • pageviews/           │                 ││
│  │  │  • team.ts              │    │  • sessions/            │                 ││
│  │  │  • report.ts            │    │  • reports/             │                 ││
│  │  │  • segment.ts           │    │  • getWebsiteStats.ts   │                 ││
│  │  └─────────────────────────┘    └─────────────────────────┘                 ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA STORES                                         │
│                                                                                  │
│  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐      │
│  │     PostgreSQL      │  │     ClickHouse      │  │       Redis         │      │
│  │     (Primary)       │  │     (Optional)      │  │     (Optional)      │      │
│  │                     │  │                     │  │                     │      │
│  │  • Users            │  │  • High-volume      │  │  • Session cache    │      │
│  │  • Teams            │  │    analytics        │  │  • Rate limiting    │      │
│  │  • Websites         │  │  • Fast aggregation │  │                     │      │
│  │  • Sessions         │  │                     │  │                     │      │
│  │  • Events           │  │                     │  │                     │      │
│  │  • Reports          │  │                     │  │                     │      │
│  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              REACT APPLICATION                                   │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                              PROVIDERS                                       ││
│  │  QueryClientProvider → IntlProvider → DialsProvider → App                   ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                           STATE MANAGEMENT                                   ││
│  │                                                                              ││
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         ││
│  │  │  Zustand Store  │    │  React Query    │    │  React Context  │         ││
│  │  │  (Global State) │    │  (Server State) │    │  (Local State)  │         ││
│  │  │                 │    │                 │    │                 │         ││
│  │  │  • user         │    │  • websites     │    │  • useUser()    │         ││
│  │  │  • locale       │    │  • reports      │    │  • useWebsite() │         ││
│  │  │  • theme        │    │  • metrics      │    │  • useTeam()    │         ││
│  │  │  • timezone     │    │  • sessions     │    │  • useLink()    │         ││
│  │  │  • dateRange    │    │  • events       │    │  • usePixel()   │         ││
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘         ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                              COMPONENTS                                      ││
│  │                                                                              ││
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐││
│  │  │ @umami/       │  │ components/   │  │ components/   │  │ components/   │││
│  │  │ react-zen     │  │ common/       │  │ charts/       │  │ metrics/      │││
│  │  │               │  │               │  │               │  │               │││
│  │  │ • Button      │  │ • PageBody    │  │ • BarChart    │  │ • MetricCard  │││
│  │  │ • Form        │  │ • PageHeader  │  │ • PieChart    │  │ • MetricsTable│││
│  │  │ • TextField   │  │ • Panel       │  │ • BubbleChart │  │ • EventsChart │││
│  │  │ • Modal       │  │ • DataGrid    │  │ • Chart       │  │ • Legend      │││
│  │  │ • Table       │  │ • Empty       │  │               │  │               │││
│  │  │ • Row/Column  │  │ • LoadingPanel│  │               │  │               │││
│  │  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                           CUSTOM HOOKS                                       ││
│  │                                                                              ││
│  │  ┌─────────────────────────┐    ┌─────────────────────────┐                 ││
│  │  │     Data Hooks          │    │     UI Hooks            │                 ││
│  │  │                         │    │                         │                 ││
│  │  │  • useApi()             │    │  • useMessages()        │                 ││
│  │  │  • useWebsitesQuery()   │    │  • useFormat()          │                 ││
│  │  │  • useReportsQuery()    │    │  • useNavigation()      │                 ││
│  │  │  • useMetricsQuery()    │    │  • useDateRange()       │                 ││
│  │  │  • useSessionsQuery()   │    │  • useFilters()         │                 ││
│  │  │  • useRealtimeQuery()   │    │  • useMobile()          │                 ││
│  │  └─────────────────────────┘    └─────────────────────────┘                 ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

## API Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API ROUTES (src/app/api/)                           │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         AUTHENTICATION                                       ││
│  │  POST /api/auth/login    • User login (returns JWT)                         ││
│  │  POST /api/auth/verify   • Verify token                                     ││
│  │  POST /api/auth/logout   • Logout                                           ││
│  │  POST /api/auth/sso      • SSO integration                                  ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         RESOURCE MANAGEMENT                                  ││
│  │                                                                              ││
│  │  /api/users              • User CRUD operations                             ││
│  │  /api/teams              • Team management                                  ││
│  │  /api/websites           • Website configuration                            ││
│  │  /api/reports            • Report management                                ││
│  │  /api/links              • Link tracking                                    ││
│  │  /api/pixels             • Pixel tracking                                   ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         ANALYTICS DATA                                       ││
│  │                                                                              ││
│  │  /api/websites/[id]/metrics     • Aggregated metrics                        ││
│  │  /api/websites/[id]/pageviews   • Pageview data                             ││
│  │  /api/websites/[id]/sessions    • Session data                              ││
│  │  /api/websites/[id]/events      • Event data                                ││
│  │  /api/websites/[id]/active      • Active visitors                           ││
│  │  /api/realtime/[id]             • Real-time activity                        ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         REPORTING                                            ││
│  │                                                                              ││
│  │  /api/reports/funnel      • Funnel analysis                                 ││
│  │  /api/reports/retention   • Retention reports                               ││
│  │  /api/reports/journey     • User journey                                    ││
│  │  /api/reports/revenue     • Revenue tracking                                ││
│  │  /api/reports/attribution • Attribution analysis                            ││
│  │  /api/reports/utm         • UTM tracking                                    ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         DATA COLLECTION (Public)                             ││
│  │                                                                              ││
│  │  POST /api/send           • Receive tracking events                         ││
│  │  POST /api/batch          • Batch event collection                          ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Data Collection Pipeline

```
┌────────────────────┐
│  Tracked Website   │
│  (with tracker.js) │
└─────────┬──────────┘
          │
          │ Page view / Custom event
          ▼
┌────────────────────┐
│  POST /api/send    │
│  (Public endpoint) │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────────┐
│                    REQUEST PROCESSING                           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Validate   │  │ Bot Detection│  │  IP Blocking │          │
│  │   (Zod)      │──▶│   (isbot)   │──▶│              │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                              │                  │
│                                              ▼                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Device     │  │   GeoIP      │  │   Session    │          │
│  │   Detection  │──▶│   Lookup    │──▶│   Handling  │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                              │                  │
│                                              ▼                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │              EVENT PROCESSING                     │          │
│  │  • Parse URL path, query, hostname               │          │
│  │  • Extract referrer domain                       │          │
│  │  • Parse UTM parameters                          │          │
│  │  • Extract click IDs (gclid, fbclid, etc.)       │          │
│  └──────────────────────────────────────────────────┘          │
└────────────────────────────┬───────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                              │
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────┐            │
│  │     PostgreSQL      │    │     ClickHouse      │            │
│  │                     │    │     (optional)      │            │
│  │  • Session record   │    │                     │            │
│  │  • WebsiteEvent     │    │  • High-volume      │            │
│  │  • EventData        │    │    event storage    │            │
│  │  • SessionData      │    │                     │            │
│  └─────────────────────┘    └─────────────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CORE ENTITIES                                       │
│                                                                                  │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐                    │
│  │    User     │       │    Team     │       │  TeamUser   │                    │
│  ├─────────────┤       ├─────────────┤       ├─────────────┤                    │
│  │ id          │       │ id          │       │ teamId      │                    │
│  │ username    │◄──────│ name        │◄──────│ userId      │                    │
│  │ password    │       │ accessCode  │       │ role        │                    │
│  │ role        │       │ logoUrl     │       │ createdAt   │                    │
│  │ displayName │       │ createdAt   │       └─────────────┘                    │
│  └─────────────┘       └─────────────┘                                          │
│         │                     │                                                  │
│         │                     │                                                  │
│         ▼                     ▼                                                  │
│  ┌─────────────────────────────────────────────────────────────┐                │
│  │                         Website                              │                │
│  ├─────────────────────────────────────────────────────────────┤                │
│  │ id │ name │ domain │ shareId │ userId │ teamId │ createdBy  │                │
│  └───────────────────────────────┬─────────────────────────────┘                │
│                                  │                                               │
│         ┌────────────────────────┼────────────────────────┐                     │
│         │                        │                        │                     │
│         ▼                        ▼                        ▼                     │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐               │
│  │   Session   │         │WebsiteEvent │         │   Report    │               │
│  ├─────────────┤         ├─────────────┤         ├─────────────┤               │
│  │ id          │         │ id          │         │ id          │               │
│  │ websiteId   │◄────────│ websiteId   │         │ websiteId   │               │
│  │ browser     │         │ sessionId   │         │ userId      │               │
│  │ os          │         │ visitId     │         │ type        │               │
│  │ device      │         │ urlPath     │         │ name        │               │
│  │ country     │         │ eventName   │         │ parameters  │               │
│  │ region      │         │ referrer*   │         │ createdAt   │               │
│  │ city        │         │ utm*        │         └─────────────┘               │
│  │ distinctId  │         │ gclid/fbclid│                                        │
│  └─────────────┘         │ createdAt   │                                        │
│         │                └──────┬──────┘                                        │
│         │                       │                                               │
│         ▼                       ▼                                               │
│  ┌─────────────┐         ┌─────────────┐                                        │
│  │ SessionData │         │  EventData  │                                        │
│  ├─────────────┤         ├─────────────┤                                        │
│  │ sessionId   │         │websiteEventId│                                       │
│  │ dataKey     │         │ dataKey     │                                        │
│  │ stringValue │         │ stringValue │                                        │
│  │ numberValue │         │ numberValue │                                        │
│  │ dateValue   │         │ dateValue   │                                        │
│  │ dataType    │         │ dataType    │                                        │
│  └─────────────┘         └─────────────┘                                        │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────────┐│
│  │                         ADDITIONAL FEATURES                                  ││
│  │                                                                              ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        ││
│  │  │   Segment   │  │   Revenue   │  │    Link     │  │    Pixel    │        ││
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤        ││
│  │  │ websiteId   │  │ websiteId   │  │ name        │  │ name        │        ││
│  │  │ type        │  │ sessionId   │  │ url         │  │ slug        │        ││
│  │  │ name        │  │ eventId     │  │ slug        │  │ userId      │        ││
│  │  │ parameters  │  │ currency    │  │ userId      │  │ teamId      │        ││
│  │  │             │  │ revenue     │  │ teamId      │  │             │        ││
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        ││
│  └─────────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
/root/umami
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Authenticated pages
│   │   │   ├── dashboard/            # Dashboard
│   │   │   ├── websites/             # Website management & analytics
│   │   │   │   └── [websiteId]/      # Website-specific pages
│   │   │   │       ├── (reports)/    # Analytics reports
│   │   │   │       ├── sessions/     # Session data
│   │   │   │       ├── events/       # Event data
│   │   │   │       └── settings/     # Website settings
│   │   │   ├── settings/             # User settings
│   │   │   ├── admin/                # Admin panel
│   │   │   ├── links/                # Link tracking
│   │   │   ├── pixels/               # Pixel tracking
│   │   │   └── boards/               # Custom dashboards
│   │   ├── (collect)/                # Data collection endpoints
│   │   ├── api/                      # REST API routes
│   │   ├── login/                    # Login page
│   │   ├── logout/                   # Logout
│   │   ├── sso/                      # SSO integration
│   │   └── share/                    # Public sharing
│   │
│   ├── components/                   # React components
│   │   ├── common/                   # Shared UI components
│   │   ├── charts/                   # Chart components
│   │   ├── metrics/                  # Analytics displays
│   │   ├── input/                    # Form inputs
│   │   ├── boards/                   # Dashboard boards
│   │   ├── hooks/                    # Custom hooks
│   │   │   └── queries/              # React Query hooks
│   │   └── svg/                      # Icon components
│   │
│   ├── lib/                          # Core utilities
│   │   ├── auth.ts                   # Authentication (JWT)
│   │   ├── request.ts                # Request parsing (Zod)
│   │   ├── response.ts               # Response helpers
│   │   ├── db.ts                     # Database routing
│   │   ├── detect.ts                 # Device detection
│   │   └── ...                       # Other utilities
│   │
│   ├── queries/                      # Database queries
│   │   ├── prisma/                   # Prisma ORM queries
│   │   └── sql/                      # Raw SQL queries
│   │
│   ├── store/                        # Zustand state stores
│   │   ├── app.ts                    # Global app state
│   │   ├── dashboard.ts              # Dashboard state
│   │   └── ...
│   │
│   ├── permissions/                  # Authorization checks
│   ├── tracker/                      # Client-side tracker
│   ├── styles/                       # Global styles
│   └── generated/prisma/             # Generated Prisma client
│
├── prisma/
│   └── schema.prisma                 # Database schema
│
├── public/
│   ├── script.js                     # Compiled tracker script
│   └── intl/messages/                # i18n translations
│
└── packages/
    └── dials/                        # Niteshift Dials SDK
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI Components** | @umami/react-zen |
| **React** | React 19 |
| **Data Fetching** | @tanstack/react-query |
| **State Management** | Zustand |
| **Form Validation** | Zod |
| **Charts** | Chart.js + react-spring |
| **i18n** | react-intl |
| **Database (Primary)** | PostgreSQL + Prisma |
| **Database (Analytics)** | ClickHouse (optional) |
| **Cache** | Redis (optional) |
| **Authentication** | JWT tokens |
| **Package Manager** | pnpm |
