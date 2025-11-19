# Umami Dashboard/Homepage Structure Analysis

## Executive Summary

Umami is a **privacy-focused web analytics platform** built with modern web technologies. The application currently has a minimalist dashboard with navigation to multiple feature areas. There are no predefined "use case variants" or "personas" currently implemented in the codebase.

---

## 1. Current Dashboard/Homepage Location

### File Structure
- **Route**: `/dashboard` (URL: `http://localhost:3001/dashboard`)
- **Main Files**:
  - `/root/umami/src/app/(main)/dashboard/page.tsx` - Server component wrapper
  - `/root/umami/src/app/(main)/dashboard/DashboardPage.tsx` - Client component implementation
  
### Current Dashboard Implementation

The dashboard is very minimal:

```tsx
// DashboardPage.tsx
export function DashboardPage() {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader title={formatMessage(labels.dashboard)}></PageHeader>
      </Column>
    </PageBody>
  );
}
```

**Current Content**: Just a page header with "Dashboard" title - essentially a blank page awaiting content.

---

## 2. Framework & Routing Pattern

### Technology Stack
- **Framework**: **Next.js 15** (App Router)
- **Language**: **TypeScript** (ES2022 target)
- **React**: React 19
- **Routing**: Next.js App Router (in `/src/app/` directory)
- **Package Manager**: pnpm

### Routing Pattern

The application uses Next.js App Router with the following structure:

```
/src/app/
├── (main)/                     # Authenticated area (requires login)
│   ├── dashboard/page.tsx
│   ├── websites/page.tsx
│   ├── boards/page.tsx
│   ├── console/[websiteId]/page.tsx
│   ├── admin/
│   ├── settings/
│   └── App.tsx                 # Main layout wrapper
├── (collect)/                  # Analytics data collection
├── api/                        # REST API routes
├── layout.tsx                  # Root layout
├── Providers.tsx              # Provider setup
└── page.tsx                   # Root page (redirects to /dashboard)
```

**Key Routing Features**:
- Route groups using parentheses: `(main)` for authenticated, `(collect)` for collection
- Dynamic segments: `[websiteId]`, `[teamId]`
- Server components by default, client components with `'use client'` directive

---

## 3. Main Navigation Structure

### Side Navigation
Located in: `/src/app/(main)/SideNav.tsx`

**Navigation Items**:
1. **Websites** - `/websites` (main dashboard area)
2. **Links** - `/links` (short link tracking)
3. **Pixels** - `/pixels` (pixel tracking)

Additional features in sidebar:
- Language selector
- Theme switcher
- Logo/branding
- Team/user selector

### Main Navigation Areas

The application has these key feature areas:

| Area | Route | Purpose |
|------|-------|---------|
| Websites | `/websites` | Main analytics area |
| Website Console | `/websites/[websiteId]` | Individual website analytics |
| Real-time | `/websites/[websiteId]/realtime` | Live visitor tracking |
| Reports | `/websites/[websiteId]/(reports)/*` | Advanced analytics (Funnels, Revenue, Attribution, etc.) |
| Boards | `/boards` | Custom dashboards |
| Links | `/links` | Short link tracking |
| Pixels | `/pixels` | Pixel tracking |
| Admin | `/admin` | System administration (users, teams, websites) |
| Settings | `/settings` | User preferences and profile |

---

## 4. Components & Data Architecture

### Page Layout Pattern

All main pages follow this consistent pattern:

```tsx
'use client';

import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Column } from '@umami/react-zen';

export function MyPage() {
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader 
          title={formatMessage(labels.myTitle)}
          description="Optional description"
          icon={<SomeIcon />}
        >
          {/* Action buttons */}
        </PageHeader>
        {/* Main content */}
      </Column>
    </PageBody>
  );
}
```

### Core Component Library: `@umami/react-zen`

This is a custom component library providing:

**Layout Components**:
- `Row`, `Column`, `Grid`, `Container`
- `Sidebar`, `SidebarSection`, `SidebarItem`, `SidebarHeader`

**Form Components**:
- `Form`, `TextField`, `TextArea`, `Select`, `Checkbox`, `Toggle`, `SearchField`

**Button Components**:
- `Button`, `ActionButton`, `IconButton`

**Display Components**:
- `Modal`, `Dropdown`, `Menu`, `Tabs`, `Banner`, `Tooltip`, `Table`, `List`
- `Loading`, `AlertBanner`, `Empty`

### Common Custom Components (`/src/components/common/`)

**Page Structure**:
- `PageBody` - Main content container (max-width: 1320px, centered)
- `PageHeader` - Title, description, icon, and action area
- `Panel` - Card container for content sections

**Data Display**:
- `DataGrid` - Lists with search, pagination, and actions
- `Empty` / `EmptyPlaceholder` - Empty state displays
- `LoadingPanel` - Loading indicator
- `Pager` - Pagination controls

**Form Components**:
- `ActionForm` - Standard form with actions
- `ConfirmationForm` - Confirmation dialog
- `TypeConfirmationForm` - Typed confirmation

**Other**:
- `Avatar`, `Favicon` - User/website display
- `FilterLink` - Clickable filters
- `DateDisplay`, `DateDistance` - Date formatting
- `ExternalLink`, `LinkButton` - Navigation

### Charts & Metrics

**Chart Components** (`/src/components/charts/`):
- `BarChart`, `LineChart` - Chart.js based
- Animated with react-spring

**Metrics Display** (`/src/components/metrics/`):
- `MetricCard` - KPI display
- `StatsTable` - Statistics tables

**Input Components** (`/src/components/input/`):
- `DateFilter` - Date range picker
- `WebsiteSelect` - Website dropdown
- `NavButton` - Navigation button
- `PanelButton` - Panel toggle

---

## 5. Design System & Styling

### Color Scheme
**Primary Color**: `#147af3` (Blue)

**CSS Variables** (from `@umami/react-zen`):
- `--primary-color`: #147af3
- `--primary-font-color`: Light color
- `--font-color`, `--font-size`: Typography
- `--base-color-2` through `--base-color-9`: Palette variations
- `--border-radius-full`, `--border-radius-*`: Border radius

### Styling Approach
- **Minimal custom CSS** - Relies on `@umami/react-zen` component library
- **CSS Modules**: Used only when custom styles needed (`.module.css`)
- **Global Styles**: 
  - `/src/styles/global.css` - Typography, scrollbar, links
  - `/src/styles/variables.css` - CSS variables
- **Font**: Inter (from @fontsource/inter)

### Responsive Design

Uses `@umami/react-zen` responsive props system:

```tsx
<Column 
  paddingX={{ xs: '3', md: '6' }}           // Mobile: 3, Desktop: 6
  margin={{ xs: 'auto', lg: '100vh' }}     // Responsive margins
  display={{ xs: 'none', lg: 'flex' }}     // Hide on mobile, show on desktop
/>
```

Breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`

---

## 6. Data Fetching Architecture

### Query Hooks Pattern

Pre-built React Query hooks located in `/src/components/hooks/queries/`:

```typescript
// Example hooks available:
useWebsitesQuery()        // List of websites
useUsersQuery()           // List of users
useTeamsQuery()           // List of teams
useReportsQuery()         // List of reports
useWebsiteMetricsQuery()  // Website analytics data
useWebsiteEventsQuery()   // Website events
useRealtimeQuery()        // Real-time data
```

### Custom API Calls

```typescript
import { useApi } from '@/components/hooks';

export function MyComponent() {
  const { get, post, put, delete: del } = useApi();

  // Option 1: React Query pattern
  const { data, isLoading } = useQuery({
    queryKey: ['custom'],
    queryFn: () => get('/api/endpoint'),
  });

  // Option 2: Direct mutation
  const handleSubmit = async (values) => {
    await post('/api/resource', values);
  };
}
```

### State Management

**Zustand Stores** (`/src/store/`):

1. **app.ts** - Global state:
   - `locale`, `theme`, `timezone`, `dateRangeValue`
   - `user`, `config`, `shareToken`

2. **dashboard.ts** - Dashboard state:
   - `showCharts`, `limit`, `websiteOrder`, `websiteActive`
   - `editing`, `isEdited`

3. **websites.ts** - Website-specific state

4. **cache.ts** - Cache management

5. **version.ts** - Version checking

---

## 7. Internationalization (i18n)

### Message System

All UI text uses `react-intl` with custom `useMessages()` hook:

```typescript
import { useMessages } from '@/components/hooks';

export function MyComponent() {
  const { formatMessage, labels } = useMessages();
  
  return <h1>{formatMessage(labels.dashboard)}</h1>;
}
```

**Message Definitions** in `/src/components/messages.ts`:
- Over 400+ label definitions
- Organized by feature (dashboard, websites, analytics, etc.)
- Compiled to JSON in `/public/intl/messages/`

### Available Messages Include:
- `labels.dashboard`, `labels.websites`, `labels.teams`
- `labels.realtime`, `labels.analytics`, `labels.reports`
- `labels.funnels`, `labels.revenue`, `labels.attribution`
- `labels.segments`, `labels.cohorts`, `labels.goals`
- And many more...

---

## 8. Current Application Structure

### Key Pages

**Main Analytics**:
- `/websites` - Website list
- `/websites/[websiteId]` - Individual website dashboard
- `/websites/[websiteId]/realtime` - Real-time visitor tracking
- `/websites/[websiteId]/sessions` - Session details
- `/websites/[websiteId]/events` - Event tracking
- `/websites/[websiteId]/compare` - Compare multiple websites

**Advanced Reports**:
- `/websites/[websiteId]/(reports)/funnels` - Funnel analysis
- `/websites/[websiteId]/(reports)/revenue` - Revenue tracking
- `/websites/[websiteId]/(reports)/attribution` - Attribution modeling
- `/websites/[websiteId]/(reports)/utm` - UTM parameter tracking
- `/websites/[websiteId]/(reports)/journeys` - User journey paths
- `/websites/[websiteId]/(reports)/retention` - Retention cohorts
- `/websites/[websiteId]/(reports)/breakdown` - Data breakdown

**Other Features**:
- `/boards` - Custom dashboards
- `/links` - Short link management
- `/pixels` - Pixel tracking
- `/admin` - Admin controls (users, teams, websites)
- `/settings` - User preferences

---

## 9. Layout & Structure

### Root Layout (`src/app/layout.tsx`)

```
<html>
  <head>
    <!-- Fonts, icons, meta tags -->
  </head>
  <body>
    <Providers>
      {children}
    </Providers>
  </body>
</html>
```

### Main App Layout (`src/app/(main)/App.tsx`)

```
<Grid columns={{ xs: '1fr', lg: 'auto 1fr' }} rows={{ xs: 'auto 1fr', lg: '1fr' }}>
  <MobileNav />           <!-- Mobile only -->
  <SideNav />             <!-- Desktop sidebar -->
  <Column>{children}</Column>  <!-- Main content area -->
  <UpdateNotice />        <!-- Version update notification -->
</Grid>
```

### Provider Setup (`src/app/Providers.tsx`)

1. **ZenProvider** - Component library theme (light/dark)
2. **RouterProvider** - Navigation helpers
3. **MessagesProvider** (IntlProvider) - i18n
4. **QueryClientProvider** - React Query
5. **ErrorBoundary** - Error handling

---

## 10. Development Patterns

### API Routes Pattern

Located in `/src/app/api/`:

```typescript
export async function GET(request: Request) {
  const { query, auth, error } = await parseRequest(request, schema);
  if (error) return error();
  
  // Business logic
  const data = await db.query();
  
  return json(data);
}
```

### Database Access

**Supports Multiple Backends**:
- PostgreSQL (primary) via Prisma
- ClickHouse (optional high-performance analytics)
- Raw SQL queries

Pattern:
```typescript
return runQuery({
  [PRISMA]: () => prismaQuery(),
  [CLICKHOUSE]: () => clickhouseQuery(),
});
```

---

## 11. Use Cases & Personas

### IMPORTANT: Currently NOT Implemented

**No predefined use case variants or personas exist in the codebase.**

The application serves:
- **Primary Audience**: Website owners, digital marketers, product teams
- **Main Use Case**: Privacy-focused web analytics as Google Analytics alternative

### Possible Future Variants (Not Yet Implemented):

Based on the code structure and features, the platform could potentially support:

1. **E-Commerce Analytics** - With revenue tracking, attribution, and funnel analysis
2. **SaaS Product Analytics** - With event tracking, retention, and cohort analysis  
3. **Content Analytics** - With page performance, referrer tracking, and engagement metrics
4. **Conversion Optimization** - With funnel analysis, heatmaps, and session recording
5. **Marketing Analytics** - With UTM tracking, attribution modeling, and campaign analysis

However, these are **not currently coded as separate variants** - the platform provides these capabilities but doesn't differentiate UI/experience by use case.

---

## 12. Key Insights for Dashboard Variant Implementation

### Current State
- The dashboard is intentionally minimal - a starting point
- All features (analytics, reports, tracking) exist in their own areas
- Navigation is consistent across the app
- Component library is well-established

### Recommended Approach for Use Case Variants

If implementing dashboard variants:

1. **Create a variant selector** in settings or during onboarding
2. **Store variant choice** in dashboard store (`/src/store/dashboard.ts`)
3. **Create different dashboard layouts** in `/src/app/(main)/dashboard/variants/`
4. **Conditionally render components** based on selected variant
5. **Customize metrics displayed** without changing core components
6. **Pre-populate boards** based on use case templates

### Example Structure for Variants:

```
/src/app/(main)/dashboard/
├── page.tsx
├── DashboardPage.tsx
├── variants/
│   ├── BaselineVariant.tsx      # Default experience
│   ├── EcommerceVariant.tsx     # Revenue, funnels, products
│   ├── SaaSVariant.tsx          # Retention, cohorts, events
│   ├── ContentVariant.tsx       # Pages, referrers, engagement
│   └── ConversionVariant.tsx    # Funnels, UTM, attribution
└── usecase/
    ├── useUseCaseSelection.ts   # Hook to manage variant
    └── usecases.config.ts       # Define available variants
```

---

## Summary Table

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.9 |
| **UI Library** | @umami/react-zen (custom) |
| **State Management** | Zustand |
| **Data Fetching** | React Query (@tanstack/react-query) |
| **Database** | PostgreSQL + Prisma (+ optional ClickHouse) |
| **i18n** | react-intl |
| **Charts** | Chart.js + react-spring |
| **Styling** | CSS Modules + CSS Variables |
| **Current Dashboard** | Minimal header only (at `/dashboard`) |
| **Dashboard State** | Zustand store in `/src/store/dashboard.ts` |
| **Components** | 200+ built-in, plus custom components |
| **Use Case Variants** | **NOT YET IMPLEMENTED** |
| **Personas** | **NOT YET IMPLEMENTED** |
| **Dev Server** | Already running on localhost:3001 |

---

## File Locations Reference

```
/root/umami/
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx          ← Current dashboard route
│   │   │   │   └── DashboardPage.tsx ← Implementation
│   │   │   ├── App.tsx               ← Main layout wrapper
│   │   │   ├── SideNav.tsx           ← Navigation
│   │   │   └── ...
│   │   ├── Providers.tsx             ← Provider setup
│   │   └── layout.tsx                ← Root layout
│   ├── components/
│   │   ├── common/                   ← Shared UI components
│   │   ├── hooks/                    ← Custom hooks
│   │   ├── input/                    ← Form components
│   │   ├── charts/                   ← Chart components
│   │   └── messages.ts               ← i18n definitions
│   ├── store/
│   │   ├── app.ts                    ← Global app state
│   │   ├── dashboard.ts              ← Dashboard state
│   │   └── ...
│   ├── lib/                          ← Utilities
│   └── styles/
│       ├── global.css
│       └── variables.css
├── package.json
├── tsconfig.json
├── next.config.ts
└── CLAUDE.md                         ← Development guide
```

