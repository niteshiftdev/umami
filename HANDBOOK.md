# Umami Handbook

A comprehensive guide to understanding how Umami works internally.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [The Tracking Script](#the-tracking-script)
4. [Data Collection Flow](#data-collection-flow)
5. [Database Schema](#database-schema)
6. [Session Management](#session-management)
7. [API Structure](#api-structure)
8. [Authentication](#authentication)
9. [Analytics & Reporting](#analytics--reporting)
10. [Privacy Features](#privacy-features)

---

## Overview

Umami is a privacy-focused, open-source web analytics platform. It provides an alternative to Google Analytics with these key principles:

- **Privacy-first**: No cookies, no personal data collection, GDPR compliant
- **Lightweight**: The tracking script is ~2KB gzipped
- **Self-hosted**: You own your data completely
- **Simple**: Clean UI focused on essential metrics

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (primary), ClickHouse (optional) |
| ORM | Prisma |
| UI Components | @umami/react-zen |
| State Management | Zustand |
| Data Fetching | React Query |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Browser                            │
│  ┌─────────────────┐                                            │
│  │ Tracking Script │  (2KB, no cookies)                         │
│  │   umami.js      │                                            │
│  └────────┬────────┘                                            │
└───────────┼─────────────────────────────────────────────────────┘
            │ POST /api/send
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Umami Server (Next.js)                      │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Collection  │  │   REST API   │  │   Dashboard  │          │
│  │   Endpoint   │  │   Routes     │  │     UI       │          │
│  │  /api/send   │  │  /api/*      │  │  /websites/* │          │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘          │
│         │                 │                                      │
│         ▼                 ▼                                      │
│  ┌─────────────────────────────────────┐                        │
│  │           Query Layer               │                        │
│  │   src/queries/sql/                  │                        │
│  │   src/queries/prisma/               │                        │
│  └──────────────┬──────────────────────┘                        │
└─────────────────┼───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Database Layer                            │
│                                                                  │
│  ┌──────────────────┐       ┌──────────────────┐               │
│  │   PostgreSQL     │  or   │   ClickHouse     │               │
│  │   (Primary)      │       │   (Analytics)    │               │
│  └──────────────────┘       └──────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/            # Authenticated pages (dashboard, websites, reports)
│   ├── (collect)/         # Data collection endpoints
│   ├── api/               # REST API routes
│   ├── login/             # Authentication pages
│   └── share/             # Public sharing pages
├── components/            # React components
│   ├── common/            # Shared UI (Panel, DataGrid, PageHeader)
│   ├── charts/            # Chart components (LineChart, BarChart)
│   ├── metrics/           # Analytics displays (MetricsTable, WorldMap)
│   ├── hooks/             # Custom React hooks
│   └── input/             # Form inputs (DateFilter, WebsiteSelect)
├── lib/                   # Core utilities
│   ├── auth.ts            # Authentication logic
│   ├── db.ts              # Database abstraction
│   ├── detect.ts          # Device/browser detection
│   └── crypto.ts          # Hashing and tokens
├── queries/               # Database queries
│   ├── sql/               # Raw SQL queries
│   └── prisma/            # Prisma queries
├── store/                 # Zustand state stores
└── tracker/               # Client tracking script source
```

---

## The Tracking Script

The tracking script (`src/tracker/index.js`) is the heart of data collection. It runs on your website and sends events to Umami.

### Installation

```html
<script defer src="https://your-umami.com/script.js"
        data-website-id="your-website-id"></script>
```

### How It Works

1. **Initialization**: When the script loads, it captures initial page data
2. **Auto-tracking**: Automatically tracks page views on load and navigation
3. **SPA Support**: Hooks into `history.pushState` and `replaceState` for single-page apps
4. **Event Tracking**: Listens for clicks on elements with `data-umami-event` attributes

### Data Collected Per Page View

```javascript
{
  website: "uuid",           // Website ID
  screen: "1920x1080",       // Screen resolution
  language: "en-US",         // Browser language
  title: "Page Title",       // Document title
  hostname: "example.com",   // Current hostname
  url: "/current/path",      // Current URL path
  referrer: "google.com",    // Referrer (if external)
  tag: "optional-tag"        // Custom tag
}
```

### Script Configuration Options

| Attribute | Description | Default |
|-----------|-------------|---------|
| `data-website-id` | Website UUID (required) | - |
| `data-host-url` | Custom API endpoint | Script origin |
| `data-auto-track` | Enable automatic tracking | `true` |
| `data-do-not-track` | Respect browser DNT setting | `false` |
| `data-exclude-search` | Exclude query strings | `false` |
| `data-exclude-hash` | Exclude URL hash | `false` |
| `data-domains` | Limit to specific domains | All |
| `data-tag` | Default tag for all events | - |

### JavaScript API

```javascript
// Track custom event
umami.track('button-click', { category: 'signup' });

// Track with custom payload
umami.track({ url: '/virtual-page', title: 'Virtual Page' });

// Identify user (for session data)
umami.identify('user-123', { plan: 'pro', company: 'Acme' });
```

---

## Data Collection Flow

When a page view or event is tracked, here's what happens:

### Step 1: Client Sends Data

```
POST /api/send
Content-Type: application/json
X-Umami-Cache: <jwt-token>  (if returning visitor)

{
  "type": "event",
  "payload": {
    "website": "uuid",
    "url": "/page",
    "referrer": "https://google.com",
    "title": "Page Title",
    "screen": "1920x1080",
    "language": "en-US"
  }
}
```

### Step 2: Server Processing (`src/app/api/send/route.ts`)

```
┌─────────────────────────────────────────────┐
│           Request Received                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  1. Parse & Validate Request                │
│     - Zod schema validation                 │
│     - Check website exists                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  2. Extract Client Info                     │
│     - IP address (for geo lookup)           │
│     - User-Agent → browser, OS, device      │
│     - GeoIP → country, region, city         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  3. Bot Detection                           │
│     - Check against isbot library           │
│     - Blocked IPs check                     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  4. Generate Session & Visit IDs            │
│     - Session: hash(websiteId + ip + ua)    │
│     - Visit: hash(sessionId + hour)         │
│     - No cookies needed!                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  5. Save to Database                        │
│     - Create/update session                 │
│     - Insert event record                   │
│     - Store custom event data               │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  6. Return Cache Token                      │
│     - JWT with websiteId, sessionId, visitId│
│     - Speeds up subsequent requests         │
└─────────────────────────────────────────────┘
```

### Session ID Generation (Cookie-less)

```javascript
// From src/app/api/send/route.ts
const sessionSalt = hash(startOfMonth(createdAt).toUTCString());
const sessionId = uuid(websiteId, ip, userAgent, sessionSalt);
```

This creates a deterministic session ID from:
- Website ID
- IP address
- User agent
- Monthly salt (sessions reset each month)

**No cookies required** - the same visitor gets the same session ID based on these factors.

---

## Database Schema

### Core Tables

#### Session Table
Stores visitor session information (device, location, etc.)

```sql
session (
  session_id    UUID PRIMARY KEY,
  website_id    UUID,
  browser       VARCHAR(20),    -- Chrome, Firefox, Safari
  os            VARCHAR(20),    -- Windows, macOS, Linux
  device        VARCHAR(20),    -- desktop, mobile, tablet
  screen        VARCHAR(11),    -- 1920x1080
  language      VARCHAR(35),    -- en-US
  country       CHAR(2),        -- US, GB, DE
  region        VARCHAR(20),    -- California
  city          VARCHAR(50),    -- San Francisco
  distinct_id   VARCHAR(50),    -- Custom user ID (optional)
  created_at    TIMESTAMP
)
```

#### WebsiteEvent Table
Stores every page view and custom event.

```sql
website_event (
  event_id        UUID PRIMARY KEY,
  website_id      UUID,
  session_id      UUID,
  visit_id        UUID,          -- Hourly visit grouping
  created_at      TIMESTAMP,

  -- Page data
  url_path        VARCHAR(500),  -- /products/widget
  url_query       VARCHAR(500),  -- ?utm_source=google
  page_title      VARCHAR(500),
  hostname        VARCHAR(100),

  -- Referrer
  referrer_domain VARCHAR(500),  -- google.com
  referrer_path   VARCHAR(500),

  -- UTM Parameters
  utm_source      VARCHAR(255),
  utm_medium      VARCHAR(255),
  utm_campaign    VARCHAR(255),
  utm_content     VARCHAR(255),
  utm_term        VARCHAR(255),

  -- Ad Click IDs
  gclid           VARCHAR(255),  -- Google
  fbclid          VARCHAR(255),  -- Facebook
  msclkid         VARCHAR(255),  -- Microsoft
  ttclid          VARCHAR(255),  -- TikTok
  twclid          VARCHAR(255),  -- Twitter
  li_fat_id       VARCHAR(255),  -- LinkedIn

  -- Event info
  event_type      INTEGER,       -- 1=pageview, 2=custom, 3=link, 4=pixel
  event_name      VARCHAR(50),   -- Custom event name
  tag             VARCHAR(50)
)
```

#### EventData & SessionData Tables
Store custom properties attached to events or sessions.

```sql
event_data (
  event_data_id     UUID PRIMARY KEY,
  website_id        UUID,
  website_event_id  UUID,
  data_key          VARCHAR(500),
  string_value      VARCHAR(500),
  number_value      DECIMAL(19,4),
  date_value        TIMESTAMP,
  data_type         INTEGER       -- 0=string, 1=number, 2=date
)
```

### Entity Relationships

```
User ─────────┬───────── Website
              │              │
              │              ├──── Session ───── WebsiteEvent ───── EventData
              │              │         │
              │              │         └──── SessionData
              │              │
              │              └──── Report
              │
              └───────── Team ───── TeamUser
```

---

## Session Management

### How Sessions Work

Umami uses a **cookie-less** approach to session tracking:

1. **Session ID**: Generated from `hash(websiteId + IP + UserAgent + monthlySalt)`
2. **Visit ID**: Generated from `hash(sessionId + hourlySalt)`
3. **Cache Token**: JWT containing session info, sent back to client

### Session vs Visit

| Concept | Duration | Purpose |
|---------|----------|---------|
| **Session** | ~1 month | Unique visitor identification |
| **Visit** | ~1 hour | Single browsing session |

A single **session** can have multiple **visits** (user returning later in the day).

### Visit Expiration

```javascript
// Visit expires after 30 minutes of inactivity
if (now - iat > 1800) {
  visitId = uuid(sessionId, visitSalt);  // New visit
  iat = now;
}
```

---

## API Structure

### Collection Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/send` | POST | Receive tracking events |
| `/api/batch` | POST | Batch event processing |

### Admin API Routes

```
/api/
├── admin/           # System administration
├── auth/            # Authentication
│   ├── login        # User login
│   ├── logout       # User logout
│   └── verify       # Token verification
├── users/           # User management
├── teams/           # Team management
├── websites/        # Website CRUD
│   └── [websiteId]/
│       ├── active      # Real-time visitors
│       ├── metrics     # Aggregated metrics
│       ├── pageviews   # Page view data
│       ├── events      # Custom events
│       ├── sessions    # Session list
│       └── stats       # Summary statistics
├── reports/         # Custom reports
├── links/           # Link tracking
└── pixels/          # Tracking pixels
```

### API Request Pattern

```typescript
// Standard API handler pattern
export async function GET(request: Request) {
  // 1. Parse and validate request
  const { query, auth, error } = await parseRequest(request, schema);
  if (error) return error();

  // 2. Check permissions
  if (!canView(auth, websiteId)) return forbidden();

  // 3. Execute query
  const data = await getWebsiteStats(websiteId, query);

  // 4. Return JSON response
  return json(data);
}
```

---

## Authentication

### Login Flow

1. User submits credentials to `/api/auth/login`
2. Server validates against hashed password in database
3. JWT token created with user info
4. Token stored in HTTP-only cookie

### Token Structure

```javascript
{
  user: {
    id: "uuid",
    username: "admin",
    role: "admin"
  },
  iat: 1699999999,
  exp: 1700099999
}
```

### Role-Based Access

| Role | Capabilities |
|------|-------------|
| `admin` | Full system access, user management |
| `user` | Manage own websites and reports |
| `view-only` | View-only access to assigned websites |

### Team Permissions

Teams allow shared access to websites:

```
Team
├── Owner (team-owner role)
├── Manager (team-manager role)
└── Member (team-member role)
    └── Can view team websites
```

---

## Analytics & Reporting

### Real-time Data

The `/api/websites/[id]/active` endpoint provides real-time visitor counts:

```javascript
// Returns visitors active in last X seconds
{
  visitors: 42,
  timestamp: 1699999999
}
```

### Metrics Aggregation

Common metrics are pre-aggregated for performance:

| Metric | Description |
|--------|-------------|
| `pageviews` | Total page views |
| `visitors` | Unique visitors (sessions) |
| `visits` | Total visits |
| `bounces` | Single-page visits |
| `totaltime` | Total time on site |

### Report Types

| Type | Description |
|------|-------------|
| `funnel` | Conversion funnel analysis |
| `retention` | User retention cohorts |
| `utm` | UTM campaign performance |
| `goals` | Goal completion tracking |
| `journey` | User journey mapping |
| `insights` | AI-powered insights |

### Query Filters

All analytics endpoints support these filters:

```
?startAt=1699999999999      # Start timestamp (ms)
&endAt=1700099999999        # End timestamp (ms)
&unit=day                   # Grouping: hour, day, week, month
&timezone=America/New_York  # Timezone for grouping
&url=/products              # Filter by URL
&referrer=google.com        # Filter by referrer
&browser=Chrome             # Filter by browser
&os=Windows                 # Filter by OS
&device=desktop             # Filter by device
&country=US                 # Filter by country
```

---

## Privacy Features

### No Cookies

Umami generates session IDs from request metadata, eliminating the need for cookies:

```javascript
// Deterministic session from non-personal data
sessionId = hash(websiteId + ip + userAgent + monthlySalt)
```

### No Personal Data

The tracking script collects only:
- Page URL and title
- Referrer (external only)
- Screen resolution
- Browser language
- Device type (derived from User-Agent)

**Not collected:**
- Names or emails
- IP addresses (only used for geolocation, not stored)
- Cross-site tracking
- Fingerprinting data

### GDPR Compliance

- No consent banner required (no cookies)
- No personal data stored
- Data can be deleted per website
- Self-hosted = you control the data

### Bot Filtering

```javascript
// Automatic bot detection
if (isbot(userAgent)) {
  return json({ beep: 'boop' });  // Ignored
}
```

### Do Not Track Support

```html
<script src="..." data-do-not-track="true"></script>
```

When enabled, respects the browser's DNT setting.

### IP Blocking

Administrators can block specific IPs from being tracked via the `BLOCKED_IPS` environment variable.

---

## Environment Configuration

### Required Variables

```bash
DATABASE_URL=postgresql://user:pass@host:5432/umami
```

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_SECRET` | Encryption key for tokens | Random |
| `DISABLE_BOT_CHECK` | Skip bot detection | `false` |
| `DISABLE_LOGIN` | Disable login page | `false` |
| `REMOVE_TRAILING_SLASH` | Normalize URLs | `false` |
| `BLOCKED_IPS` | Comma-separated blocked IPs | - |
| `CLICKHOUSE_URL` | ClickHouse connection | - |

---

## Performance Considerations

### Database Indexes

Key indexes for query performance (from schema):

```sql
-- Session queries
@@index([websiteId, createdAt])
@@index([websiteId, createdAt, browser])
@@index([websiteId, createdAt, country])

-- Event queries
@@index([websiteId, createdAt, urlPath])
@@index([websiteId, createdAt, eventName])
@@index([websiteId, sessionId, createdAt])
```

### ClickHouse for Scale

For high-volume sites, ClickHouse provides:
- Columnar storage for fast aggregations
- Better compression (10-50x)
- Faster analytical queries

Enable with:
```bash
CLICKHOUSE_URL=http://localhost:8123
```

### Caching

- JWT cache tokens reduce database lookups for returning visitors
- React Query caches API responses client-side
- Static assets cached via Next.js

---

## Summary

Umami provides a complete, privacy-respecting analytics solution:

1. **Lightweight tracking** - 2KB script, no cookies
2. **Privacy-first** - No personal data, GDPR compliant
3. **Real-time** - Live visitor counts
4. **Self-hosted** - You own your data
5. **Scalable** - PostgreSQL or ClickHouse backends
6. **Extensible** - Custom events and properties

For more details, explore the source code in the `src/` directory or visit [umami.is/docs](https://umami.is/docs).
