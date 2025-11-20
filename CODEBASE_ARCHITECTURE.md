# Umami Codebase Architecture Summary

## 1. Project Framework & Structure

### Framework
- **Next.js 15.5.3** with App Router (NOT Pages Router)
- **React 19.2.0** with TypeScript 5.9
- **Output**: Standalone (configured for containerization)

### Directory Structure
```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main authenticated routes group
│   │   ├── layout.tsx            # Main layout with auth check
│   │   ├── App.tsx               # Client component with Grid layout
│   │   ├── SideNav.tsx           # Side navigation
│   │   ├── TopNav.tsx            # Top navigation
│   │   ├── MobileNav.tsx         # Mobile navigation
│   │   ├── dashboard/            # Dashboard page
│   │   ├── websites/[websiteId]/ # Website detail pages
│   │   ├── admin/                # Admin pages
│   │   ├── settings/             # Settings pages
│   │   ├── boards/               # Board pages
│   │   └── ...
│   ├── (collect)/                # Collect routes (public)
│   ├── api/                      # API routes
│   ├── Providers.tsx             # React providers setup
│   └── layout.tsx                # Root layout
├── components/
│   ├── charts/                   # Chart components
│   │   ├── Chart.tsx             # Base Chart (Chart.js wrapper)
│   │   ├── BarChart.tsx          # Time-series bar charts
│   │   ├── PieChart.tsx          # Pie/Doughnut charts
│   │   ├── BubbleChart.tsx       # Bubble charts
│   │   └── ChartTooltip.tsx      # Tooltip component
│   ├── common/                   # Reusable UI components
│   │   ├── Panel.tsx             # Card/panel wrapper
│   │   ├── PageHeader.tsx        # Page header component
│   │   ├── PageBody.tsx          # Page body wrapper
│   │   ├── LoadingPanel.tsx      # Loading state
│   │   ├── Avatar.tsx            # User avatar
│   │   ├── Favicon.tsx           # Favicon component
│   │   ├── ErrorBoundary.tsx     # Error boundary
│   │   └── ...
│   ├── metrics/                  # Analytics metric components
│   │   ├── MetricCard.tsx        # Metric display card
│   │   ├── MetricLabel.tsx       # Metric label with formatting
│   │   ├── MetricsBar.tsx        # Bar of metrics
│   │   ├── MetricsTable.tsx      # Table of metrics
│   │   ├── PageviewsChart.tsx    # Pageviews chart
│   │   ├── WeeklyTraffic.tsx     # Weekly traffic visualization
│   │   ├── WorldMap.tsx          # Geographic map
│   │   ├── Legend.tsx            # Chart legend
│   │   └── ...
│   ├── hooks/
│   │   ├── queries/              # React Query hooks for data fetching
│   │   │   ├── useWebsiteMetricsQuery.ts
│   │   │   ├── useWebsiteSessionsQuery.ts
│   │   │   ├── useActiveUsersQuery.ts
│   │   │   └── 50+ other query hooks
│   │   ├── useApi.ts             # API client hook
│   │   ├── useMessages.ts        # i18n hook
│   │   ├── useDateRange.ts       # Date range state
│   │   ├── useFilters.ts         # Filter state
│   │   └── ...
│   └── ...
├── lib/
│   ├── auth.ts                   # Authentication logic
│   ├── colors.ts                 # Color utilities
│   ├── constants.ts              # Constants and config
│   ├── charts.ts                 # Chart utilities
│   ├── date.ts                   # Date formatting
│   ├── format.ts                 # Number/string formatting
│   ├── prisma.ts                 # Database utilities
│   ├── types.ts                  # TypeScript types
│   └── ...
├── styles/
│   ├── global.css                # Global styles
│   └── variables.css             # CSS variables (primary color)
└── queries/                      # Prisma queries

public/
├── intl/messages/                # i18n message files
├── favicon.ico
└── ...

---

## 2. Design System & Styling

### UI Library: Umami React Zen
- **Package**: `@umami/react-zen` v0.203.0
- **Provides**: Base components (Grid, Row, Column, Box, Button, etc.)
- **Styling**: CSS modules with responsive props via props API
- **CSS-in-JS**: Props-based (e.g., `padding="3"`, `gap`, `border="bottom"`)

### Theme System
- **Theme Provider**: `ZenProvider` in `/src/app/Providers.tsx`
- **Current Theme**: Light theme (hardcoded in Providers)
- **Colors**: Defined in `/src/lib/constants.ts` (THEME_COLORS)

### Color Palette
```typescript
// Light theme
primary: '#2680eb' (Blue)
text: '#838383' (Gray)
line: '#d9d9d9' (Light gray)
fill: '#f9f9f9' (Almost white)

// Chart colors (12-color palette)
['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#f7bd12', 
 '#01bad7', '#6734bc', '#89c541', '#ffc301', '#ec1562', '#ffec16']
```

### CSS Variables
- **Location**: `/src/styles/variables.css`
- **Primary color**: `--primary-color: #147af3`
- **Primary font color**: `--primary-font-color`
- Global CSS: `/src/styles/global.css`

### Typography
- **Font**: Inter (from @fontsource/inter)
- **Font weights**: 300, 400, 500, 700
- **Imported in root layout**: 4 font weights

### Responsive Design
- **Breakpoints**: `xs`, `md`, `lg` (from @umami/react-zen)
- **Grid layout**: 
  - Desktop: 2-column (sidenav + content)
  - Mobile: 1-column (full width)

---

## 3. Component Library Architecture

### Base Layout Components (from @umami/react-zen)
```typescript
Grid          // Grid layout (columns, rows)
Column        // Vertical flex container
Row           // Horizontal flex container
Box           // Generic container
Button        // Button component
Icon          // Icon wrapper
Text          // Text component
Heading       // Heading component
```

### Custom Component Patterns

#### Panel Component
**File**: `/src/components/common/Panel.tsx`
```typescript
interface PanelProps extends ColumnProps {
  title?: string;
  allowFullscreen?: boolean;
}
// Returns: Column with padding, border, rounded corners, optional fullscreen
```

#### PageHeader Component
**File**: `/src/components/common/PageHeader.tsx`
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  label?: ReactNode;
  icon?: ReactNode;
  showBorder?: boolean;
  children?: ReactNode;
}
// Returns: Row with title, description, optional children
```

#### PageBody Component
**File**: `/src/components/common/PageBody.tsx`
- Centered column layout with padding and gaps

---

## 4. Available Chart & Visualization Components

### Chart Components
All located in `/src/components/charts/`

1. **Chart.tsx** (Base component - wrapper around Chart.js)
   - Supports: bar, bubble, doughnut, pie, line, polarArea, radar, scatter
   - Props: `type`, `chartData`, `chartOptions`, `animationDuration`
   - Exports legend functionality
   - Handles tooltips via callback

2. **BarChart.tsx** (Time-series bar charts)
   ```typescript
   Props: unit?, stacked?, currency?, renderXLabel?, renderYLabel?
   XAxisType, YAxisType, minDate?, maxDate?
   Returns: <Chart> with preconfig for time-series bars
   ```

3. **PieChart.tsx** (Pie and doughnut charts)
   ```typescript
   Props: type? ('pie' | 'doughnut')
   Returns: <Chart> with tooltip handling
   ```

4. **BubbleChart.tsx** - Bubble visualization

5. **ChartTooltip.tsx** - Tooltip display component

### Metric Components (in `/src/components/metrics/`)

1. **MetricCard.tsx** - Display individual metric with label and value
2. **MetricsBar.tsx** - Horizontal bar of metric cards
3. **MetricLabel.tsx** - Formatted metric label with change indicator
4. **MetricsTable.tsx** - Table of metrics with sorting
5. **MetricsExpandedTable.tsx** - Expanded table view
6. **PageviewsChart.tsx** - Pageviews line chart
7. **WeeklyTraffic.tsx** - Weekly traffic heatmap
8. **WorldMap.tsx** - Geographic visualization (using react-simple-maps)
9. **EventsChart.tsx** - Event data visualization
10. **ActiveUsers.tsx** - Real-time active users display
11. **RealtimeChart.tsx** - Real-time data visualization
12. **Legend.tsx** - Chart legend component

### Supported Chart Libraries
- **Chart.js v4.5.1** (core charting)
- **chartjs-adapter-date-fns v3.0.0** (time-series support)
- **react-simple-maps v2.3.0** (geographic maps)

---

## 5. Data Fetching & API Structure

### API Client Pattern

#### Hook-based API Access
**File**: `/src/components/hooks/useApi.ts`
```typescript
const { get, post, delete: delete_, useQuery } = useApi();
```

#### React Query Integration
**Location**: `/src/components/hooks/queries/`
- 50+ query hooks using React Query v5.90.5
- Pattern: `use[Entity]Query`

**Example - useWebsiteMetricsQuery**:
```typescript
export function useWebsiteMetricsQuery(
  websiteId: string,
  params: { type: string; limit?: number; search?: string },
  options?: ReactQueryOptions,
) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useQuery({
    queryKey: ['websites:metrics', { websiteId, startAt, endAt, ...params }],
    queryFn: async () =>
      get(`/websites/${websiteId}/metrics`, {
        startAt, endAt, unit, timezone, ...filters, ...params
      }),
    enabled: !!websiteId,
    placeholderData: keepPreviousData,
    ...options,
  });
}
```

### API Routes Pattern
**Location**: `/src/app/api/`

**Standard structure**:
```typescript
import { parseRequest } from '@/lib/request';
import { json, unauthorized } from '@/lib/response';

export async function GET(request: Request) {
  const { auth, query, error } = await parseRequest(request, schema);
  
  if (error) return error();
  if (!canViewData(auth)) return unauthorized();
  
  const data = await getData(query);
  return json(data);
}
```

#### Key API utilities
- **parseRequest()** - Parse & validate request with auth check
- **json()** - JSON response helper
- **unauthorized()** - 401 response
- **badRequest()** - 400 response
- **checkAuth()** - Extract auth from request headers

### Common API Routes
```
/api/auth/login              - POST (username/password)
/api/auth/logout             - POST
/api/auth/verify             - POST (verify token)
/api/config                  - GET (app configuration)
/api/me                      - GET (current user)
/api/me/teams                - GET (user teams)
/api/websites                - GET/POST (list/create websites)
/api/websites/:websiteId     - GET/PUT/DELETE
/api/admin/users             - GET (list users)
/api/admin/teams             - GET (list teams)
```

### QueryClient Configuration
**Location**: `/src/app/Providers.tsx`
```typescript
const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,  // 1 minute
    },
  },
});
```

---

## 6. Authentication Setup

### Auth Flow
1. **Login API**: `/api/auth/login` (POST with username/password)
2. **Token Storage**: `localStorage` with key `umami.auth`
3. **Token Format**: Secure JWT (optionally backed by Redis)
4. **Auth Check**: `useLoginQuery` hook in App component

### Authentication Implementation

#### checkAuth() Function
**File**: `/src/lib/auth.ts`
```typescript
export async function checkAuth(request: Request) {
  // Disable auth mode (returns admin user)
  if (process.env.disableAuth) {
    return { user: adminUser, token: null, ... };
  }
  
  // Parse bearer token from Authorization header
  const token = getBearerToken(request);
  const payload = parseSecureToken(token, secret());
  
  // Extract user by userId or via Redis authKey
  let user = await getUser(userId);
  
  return { token, authKey, shareToken, user };
}
```

#### useLoginQuery Hook
Verifies user session on app load
- Called from App.tsx
- Redirects to `/login` if user not authenticated
- Handles loading and error states

### Role-Based Access Control
**Location**: `/src/lib/constants.ts`
```typescript
ROLES = {
  admin: 'admin',
  user: 'user',
  viewOnly: 'view-only',
  teamOwner: 'team-owner',
  teamManager: 'team-manager',
  teamMember: 'team-member',
  teamViewOnly: 'team-view-only',
}

ROLE_PERMISSIONS = {
  admin: ['all'],
  user: ['website:create', 'website:update', 'website:delete', 'team:create'],
  viewOnly: [],
  // ... etc
}
```

### Permission Checking
**Location**: `/src/permissions/` (external Prisma queries)
Functions like:
- `canViewAllWebsites(auth)`
- `canCreateWebsite(auth)`
- `canUpdateUser(auth)`
- etc.

### Disabling Auth (For Development)
Set environment variable: `DISABLE_AUTH=1`
- Returns hardcoded admin user
- Useful for prototyping

---

## 7. Example Page Implementation

### Website Dashboard Page
**Location**: `/src/app/(main)/websites/[websiteId]/`

#### Structure
```
page.tsx                    # Server component (async)
│ └─ WebsitePage (client)   # Main layout
    └── WebsiteControls     # Controls bar (date range, etc.)
    └── WebsiteMetricsBar   # Metrics cards
    └── Panel > WebsiteChart # Main chart
    └── WebsitePanels       # Multiple metric panels
    └── ExpandedViewModal   # Full-screen modal
```

#### Example: WebsitePage.tsx
```typescript
'use client';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';

export function WebsitePage({ websiteId }: { websiteId: string }) {
  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />
      <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
      <Panel minHeight="520px">
        <WebsiteChart websiteId={websiteId} />
      </Panel>
      <WebsitePanels websiteId={websiteId} />
      <ExpandedViewModal websiteId={websiteId} />
    </Column>
  );
}
```

---

## 8. Component Export/Import Patterns

### Import Paths (using @/ alias)
```typescript
// From tsconfig.json
"baseUrl": ".",
"paths": {
  "@/*": ["./src/*"]
}

// Usage examples:
import { Panel } from '@/components/common/Panel';
import { useWebsiteMetricsQuery } from '@/components/hooks/queries';
import { THEME_COLORS } from '@/lib/constants';
import { Chart } from '@/components/charts/Chart';
```

### Component Export Pattern
**Standard export**:
```typescript
// components/common/Panel.tsx
export function Panel({ ... }: PanelProps) {
  return (...);
}

// Usage
import { Panel } from '@/components/common/Panel';
```

### Hook Export Pattern
```typescript
// components/hooks/useApi.ts
export function useApi() {
  return { get, post, useQuery };
}

// Usage in query hook
const { get, useQuery } = useApi();
```

---

## 9. Key Constants & Configuration

### Theme Colors
**File**: `/src/lib/constants.ts`
```typescript
THEME_COLORS = {
  light: {
    primary: '#2680eb',
    text: '#838383',
    line: '#d9d9d9',
    fill: '#f9f9f9',
  },
  dark: { /* similar */ }
}

CHART_COLORS = [
  '#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#f7bd12',
  '#01bad7', '#6734bc', '#89c541', '#ffc301', '#ec1562', '#ffec16'
]
```

### Animation
```typescript
DEFAULT_ANIMATION_DURATION = 0  // Set to 0 for instant (from fix commit)
```

### Date Formats
Supported units: 'year', 'month', 'hour', 'day', 'minute'

### Responsive Grid Configuration
**From App.tsx**:
```typescript
<Grid
  columns={{ xs: '1fr', lg: 'auto 1fr' }}
  rows={{ xs: 'auto 1fr', lg: '1fr' }}
  height={{ xs: 'auto', lg: '100vh' }}
>
```

---

## 10. Key Files Reference

### Must-Read Files for Prototyping
1. `/src/app/(main)/App.tsx` - Main app layout & auth
2. `/src/app/(main)/layout.tsx` - Layout wrapper
3. `/src/app/Providers.tsx` - Providers setup (theme, queries, i18n)
4. `/src/components/common/Panel.tsx` - Card/panel component
5. `/src/components/common/PageHeader.tsx` - Page header
6. `/src/components/charts/Chart.tsx` - Base chart component
7. `/src/components/charts/BarChart.tsx` - Time-series chart example
8. `/src/lib/constants.ts` - Colors, roles, permissions
9. `/src/lib/colors.ts` - Color utilities
10. `/src/app/(main)/websites/[websiteId]/WebsitePage.tsx` - Example page layout

### Component Library Files
- `/src/components/metrics/MetricCard.tsx` - Metric display
- `/src/components/metrics/MetricsBar.tsx` - Metrics row
- `/src/components/metrics/MetricsTable.tsx` - Metrics table
- `/src/components/hooks/useApi.ts` - API client
- `/src/components/hooks/useMessages.ts` - i18n
- `/src/components/hooks/useDateRange.ts` - Date state

---

## 11. Creating Prototype Homepage Variations

### Step-by-Step Guide

#### 1. Create New Page Route
```
src/app/(main)/homepage-variation-1/page.tsx
```

#### 2. Create Layout Component
```typescript
'use client';
import { Column } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';

export function HomepageVariation1() {
  return (
    <PageBody>
      <Column margin="2">
        <PageHeader title="Variation 1: [Your Description]" />
        <Panel title="Section 1">
          {/* Your content here */}
        </Panel>
      </Column>
    </PageBody>
  );
}
```

#### 3. Use Chart Components
```typescript
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';

// In component:
<Panel title="Chart Title">
  <BarChart chartData={data} />
</Panel>
```

#### 4. Use Metric Components
```typescript
import { MetricsBar } from '@/components/metrics/MetricsBar';

<MetricsBar>
  {metrics.map(metric => (
    <MetricCard key={metric.key} {...metric} />
  ))}
</MetricsBar>
```

#### 5. Fetch Data (if needed)
```typescript
const { data, isLoading } = useWebsiteMetricsQuery(websiteId, {
  type: 'pageviews',
});

if (isLoading) return <LoadingPanel />;
```

#### 6. Ensure Auth Access
Pages under `/src/app/(main)/` are automatically protected
- App.tsx checks `useLoginQuery()`
- Redirects to `/login` if not authenticated

---

## 12. Important Env Variables

From next.config.ts (referenced for dynamic behavior):
```
BASE_PATH - Base path for deployment
CLOUD_MODE - Cloud deployment flag
DISABLE_AUTH - Skip authentication (for dev)
DISABLE_UI - Disable entire UI
DEFAULT_LOCALE - Default language
FAVICON_URL - Favicon CDN URL
LINKS_URL - Links service URL
PIXELS_URL - Pixels service URL
```

---

## Summary: Key Takeaways for Prototyping

1. **Framework**: Next.js 15 App Router (not Pages Router)
2. **UI Library**: @umami/react-zen (props-based styling)
3. **Layout**: Page wrapped in PageBody > Column structure
4. **Charts**: Use Chart.tsx, BarChart.tsx, PieChart.tsx components
5. **Styling**: Via @umami/react-zen props (padding, gap, etc.)
6. **Colors**: Primary #2680eb, use THEME_COLORS from constants
7. **Data**: React Query hooks in /src/components/hooks/queries/
8. **Auth**: Automatic via App.tsx layout
9. **Route**: Create under /src/app/(main)/ for protected pages
10. **Import**: Use @/ alias prefix for all imports

