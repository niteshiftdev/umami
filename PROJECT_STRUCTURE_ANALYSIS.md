# Umami Project Structure Analysis

## 1. PROJECT OVERVIEW & TECH STACK

### Framework & Core Technologies
- **Frontend Framework**: Next.js 15.5.3 (with React 19.2.0)
- **Language**: TypeScript 5.9.3
- **Build Tool**: Turbo (integrated with Next.js)
- **Package Manager**: pnpm 10.22.0
- **Styling**: CSS Modules + PostCSS with custom CSS variables
- **Design System**: @umami/react-zen v0.203.0 (custom Umami component library)

### Key Dependencies
- **UI Components**: @umami/react-zen
- **Charts**: Chart.js v4.5.1 with chartjs-adapter-date-fns
- **State Management**: Zustand 5.0.8, Immer 10.2.0
- **Data Fetching**: TanStack React Query 5.90.5
- **Internationalization**: react-intl 7.1.14
- **Animation**: @react-spring/web 10.0.3
- **Drag & Drop**: @hello-pangea/dnd 17.0.0
- **Maps**: react-simple-maps 2.3.0, react-window (virtualization)
- **Utilities**: date-fns (date manipulation), classnames, uuid

### Backend/Database
- **ORM**: Prisma 6.18.0
- **Database Adapter**: @prisma/adapter-pg (PostgreSQL)
- **Query Engine**: ClickHouse for analytics (@clickhouse/client)
- **Caching**: Redis (@umami/redis-client)
- **Message Queue**: Kafka (kafkajs)

---

## 2. PROJECT STRUCTURE

```
/root/umami/
├── src/
│   ├── app/                          # Next.js App Router (13+ structure)
│   │   ├── layout.tsx                # Root layout with Providers
│   │   ├── Providers.tsx             # Context providers (ZenProvider, IntlProvider, QueryClientProvider)
│   │   ├── (main)/                   # Authenticated routes group
│   │   │   ├── App.tsx               # Main layout wrapper with SideNav, MobileNav, TopNav
│   │   │   ├── layout.tsx            # Main layout metadata
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── websites/[websiteId]/ # Main analytics homepage
│   │   │   │   ├── page.tsx
│   │   │   │   ├── WebsitePage.tsx
│   │   │   │   ├── WebsiteChart.tsx  # Main chart component
│   │   │   │   ├── WebsiteMetricsBar.tsx # KPI cards
│   │   │   │   ├── WebsitePanels.tsx # Data tables and visualizations
│   │   │   │   ├── WebsiteControls.tsx
│   │   │   │   ├── (reports)/        # Report sections
│   │   │   │   │   ├── attribution/
│   │   │   │   │   ├── breakdown/
│   │   │   │   │   ├── funnels/
│   │   │   │   │   ├── goals/
│   │   │   │   │   ├── journeys/
│   │   │   │   │   ├── retention/
│   │   │   │   ├── realtime/         # Real-time analytics
│   │   │   │   ├── sessions/         # Session details
│   │   │   │   ├── events/           # Event tracking
│   │   │   │   ├── segments/         # User segments
│   │   │   │   ├── cohorts/          # Cohort analysis
│   │   │   │   └── settings/         # Website settings
│   │   │   ├── admin/                # Admin panel
│   │   │   ├── settings/             # User settings
│   │   │   ├── teams/                # Team management
│   │   │   ├── boards/               # Custom dashboards
│   │   │   ├── console/              # General console
│   │   │   └── links/pixels/         # Link/pixel management
│   │   ├── api/                      # API routes
│   │   │   ├── websites/             # Website APIs
│   │   │   ├── reports/              # Report APIs
│   │   │   ├── realtime/             # Real-time APIs
│   │   │   ├── auth/                 # Authentication
│   │   │   └── [other API endpoints]
│   │   ├── login/                    # Login page
│   │   ├── share/[...shareId]/       # Share analytics page
│   │   └── (collect)/                # Data collection routes
│   │       ├── p/[slug]/             # Pixel tracking
│   │       └── q/[slug]/             # Link tracking
│   │
│   ├── components/                   # React components
│   │   ├── common/                   # Common UI components
│   │   │   ├── PageBody.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── Panel.tsx
│   │   │   ├── DataGrid.tsx
│   │   │   ├── LoadingPanel.tsx
│   │   │   └── [more...]
│   │   ├── charts/                   # Chart components
│   │   │   ├── Chart.tsx             # Base Chart.js wrapper
│   │   │   ├── BarChart.tsx          # Time series bar chart
│   │   │   ├── PieChart.tsx
│   │   │   ├── BubbleChart.tsx
│   │   │   └── ChartTooltip.tsx
│   │   ├── metrics/                  # Analytics metric components
│   │   │   ├── MetricCard.tsx        # KPI card with animation
│   │   │   ├── MetricsBar.tsx        # Container for metric cards
│   │   │   ├── MetricsTable.tsx      # Data table for metrics
│   │   │   ├── MetricsExpandedTable.tsx
│   │   │   ├── EventsChart.tsx       # Events time series
│   │   │   ├── PageviewsChart.tsx    # Pageviews time series
│   │   │   ├── WeeklyTraffic.tsx     # Weekly traffic breakdown
│   │   │   ├── WorldMap.tsx          # Geographic visualization
│   │   │   ├── RealtimeChart.tsx
│   │   │   ├── ActiveUsers.tsx
│   │   │   └── [more...]
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── index.ts
│   │   │   ├── useApi.ts
│   │   │   ├── useDateRange.ts
│   │   │   ├── useMessages.ts
│   │   │   ├── useFilters.ts
│   │   │   ├── queries/              # TanStack React Query hooks
│   │   │   │   ├── useWebsiteStatsQuery.ts
│   │   │   │   ├── useWebsiteMetricsQuery.ts
│   │   │   │   ├── useWebsitePageviewsQuery.ts
│   │   │   │   ├── useWebsiteEventsQuery.ts
│   │   │   │   ├── useWebsiteSessionsQuery.ts
│   │   │   │   ├── useActiveUsersQuery.ts
│   │   │   │   ├── useRealtimeQuery.ts
│   │   │   │   └── [many more...]
│   │   ├── input/                    # Form input components
│   │   ├── svg/                      # SVG icon components (auto-generated)
│   │   ├── messages.ts               # i18n message definitions
│   │   └── icons.ts
│   │
│   ├── lib/                          # Utility functions
│   │   ├── auth.ts                   # Authentication helpers
│   │   ├── charts.ts                 # Chart rendering utilities
│   │   ├── colors.ts                 # Color utilities & theme colors
│   │   ├── constants.ts              # App constants & config
│   │   ├── date.ts                   # Date formatting & manipulation
│   │   ├── format.ts                 # Number/value formatting
│   │   ├── data.ts                   # Data processing utilities
│   │   ├── filters.ts                # Filter logic
│   │   ├── client.ts                 # API client setup
│   │   ├── db.ts                     # Database utilities
│   │   ├── prisma.ts                 # Prisma helpers
│   │   ├── redis.ts                  # Redis helpers
│   │   ├── kafka.ts                  # Kafka helpers
│   │   └── [more...]
│   │
│   ├── styles/                       # Global styles
│   │   ├── global.css                # Global CSS (scrollbar, typography)
│   │   └── variables.css             # CSS custom properties
│   │
│   ├── store/                        # Zustand state stores
│   ├── permissions/                  # Permission system
│   ├── lang/                         # Language files
│   ├── queries/                      # GraphQL queries (if applicable)
│   ├── assets/                       # Images, icons, SVGs
│   └── index.ts
│
├── db/                               # Database files (migrations, schema)
├── prisma/                           # Prisma schema
├── scripts/                          # Build and utility scripts
├── public/                           # Static assets
└── [config files]
```

---

## 3. HOMEPAGE STRUCTURE & LAYOUT

### Main Analytics Homepage: `/websites/[websiteId]/`

The homepage is located at `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx` and serves as the main analytics dashboard.

#### Page Hierarchy
```
WebsitePage.tsx (main container)
├── WebsiteControls        # Date range, filters, comparison mode, export
├── WebsiteMetricsBar      # Top KPI cards (5 metrics)
├── Panel > WebsiteChart   # Main time series chart (pageviews/visitors)
├── WebsitePanels          # Grid of data tables and visualizations
│   ├── GridRow (Pages section - 2 columns)
│   │   ├── Pages table (Path, Entry, Exit tabs)
│   │   └── Sources table (Referrers, Channels tabs)
│   ├── GridRow (Environment section - 2 columns)
│   │   ├── Environment table (Browser, OS, Device tabs)
│   │   └── Location table (Country, Region, City tabs)
│   ├── GridRow (Map & Traffic - mixed layout)
│   │   ├── WorldMap visualization (full width on mobile)
│   │   └── WeeklyTraffic breakdown (3 columns on desktop)
│   └── GridRow (Events section - share page only)
│       ├── Events table
│       └── EventsChart
└── ExpandedViewModal     # Modal for expanded metrics view
```

#### Key Components in WebsitePage

1. **WebsiteControls** - Date range picker, filter controls, comparison mode toggle, export button
2. **WebsiteMetricsBar** - Displays 5 primary metrics:
   - Visitors (unique visitors)
   - Visits (sessions)
   - Pageviews (page views)
   - Bounce Rate (%)
   - Visit Duration (avg time on site)
   Each metric card shows change from comparison period

3. **WebsiteChart** - Main time series bar chart showing:
   - Pageviews vs Visitors over time
   - Stacked bar chart with legend toggle
   - Interactive tooltips

4. **WebsitePanels** - Multiple tabbed sections with data tables:
   - Pages: Path, Entry Page, Exit Page
   - Sources: Referrers, Marketing Channels
   - Environment: Browser, OS, Device type
   - Location: Countries, Regions, Cities
   - Geography: World map with hover details
   - Traffic: Weekly traffic pattern breakdown

---

## 4. DESIGN SYSTEM & STYLING

### Design System: @umami/react-zen
- **Custom Umami component library** providing theme-aware components
- **Core Components**: Grid, Row, Column, Box, Text, Button, Tab, Select, Input, etc.
- **Theme Support**: Light and dark modes
- **Responsive Props**: All components accept responsive values (xs, sm, md, lg, xl)

### CSS Architecture
**File**: `/root/umami/src/styles/`

1. **global.css**
   - Font styling (Inter font family)
   - Link styling
   - Custom scrollbar styling
   - Base HTML/body styles

2. **variables.css**
   - CSS custom properties
   - Primary color: #147af3 (blue)
   - Theme variables referenced throughout

### Theme System
**File**: `/root/umami/src/lib/constants.ts`

```javascript
THEME_COLORS = {
  light: {
    primary: '#2680eb',
    text: '#838383',
    line: '#d9d9d9',
    fill: '#f9f9f9',
  },
  dark: {
    primary: '#2680eb',
    text: '#7b7b7b',
    line: '#3a3a3a',
    fill: '#191919',
  }
}

CHART_COLORS = [
  '#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#f7bd12',
  '#01bad7', '#6734bc', '#89c541', '#ffc301', '#ec1562', '#ffec16',
]
```

### Styling Approach
- **CSS Modules** for component-level scoped styles
- **CSS Custom Properties** for theming
- **Inline props** via @umami/react-zen components
- **PostCSS** with flexbugs fixes and preset-env for browser compatibility

### Color System
**File**: `/root/umami/src/lib/colors.ts`
- Dynamic color generation based on seed values
- Pastel color variants
- RGB/Hex conversions
- Alpha blending for transparency effects
- Theme-aware color extraction

---

## 5. DATA VISUALIZATION IMPLEMENTATION

### Chart Technology
- **Chart.js v4.5.1** as the visualization library
- **Chart.js adapters** for date-fns integration (time series support)
- **react-simple-maps** for geographic visualizations
- **react-window** for virtualized lists (performance optimization)

### Chart Components

#### Base Chart Component (`/src/components/charts/Chart.tsx`)
- Wrapper around Chart.js with React hooks
- Manages chart lifecycle (create, update, destroy)
- Supports multiple chart types: bar, bubble, doughnut, pie, line, polarArea, radar, scatter
- Custom legend with click handlers
- Tooltip management
- Animation control

#### BarChart Component (`/src/components/charts/BarChart.tsx`)
- Time series bar chart using Chart.js
- Supports stacked bars
- X-axis: timeseries with date formatting
- Y-axis: linear with number formatting
- Custom axis labels
- Tooltip with currency/value formatting
- Responsive sizing

#### Other Chart Types
- **PieChart.tsx** - Donut/pie charts for categorical data
- **BubbleChart.tsx** - Bubble plots
- **EventsChart.tsx** - Stacked bar chart for multiple events over time
- **PageviewsChart.tsx** - Time series for pageview metrics
- **WeeklyTraffic.tsx** - Weekly breakdown with custom visualization
- **WorldMap.tsx** - Geographic heatmap using react-simple-maps
- **RealtimeChart.tsx** - Live data visualization

### Metric Components

#### MetricCard (`/src/components/metrics/MetricCard.tsx`)
- Animated value display using @react-spring/web
- Shows primary value, previous value, and percentage change
- Color-coded changes (positive/negative)
- Custom value formatting
- Props:
  - `value`: Primary metric value
  - `previousValue`: Comparison value
  - `change`: Difference amount
  - `label`: Metric label
  - `formatValue`: Custom formatter function
  - `reverseColors`: Invert color meaning (for metrics where down is good)
  - `showChange`: Toggle change display
  - `showLabel`: Toggle label display

#### MetricsBar (`/src/components/metrics/MetricsBar.tsx`)
- Horizontal grid container for MetricCards
- Responsive layout (1 column on mobile, multiple on desktop)

#### MetricsTable (`/src/components/metrics/MetricsTable.tsx`)
- Data table for analytics metrics
- Sortable columns
- Pagination with "Show More" button
- Filter links to drill down into data
- Custom cell rendering
- Download capability
- Props:
  - `type`: metric type (path, event, country, etc.)
  - `websiteId`: associated website
  - `limit`: rows per page
  - `allowDownload`: CSV export
  - `metric`: metric name to display

#### ListTable (`/src/components/metrics/ListTable.tsx`)
- Generic list table component
- Used by MetricsTable internally

### Data Query Pattern
All visualizations follow a consistent data flow pattern:

1. **Query Hook** - Fetch data (e.g., `useWebsiteStatsQuery`)
2. **useEffect Dependencies** - Re-fetch on date range/filter changes
3. **useMemo** - Memoize chart data transformation
4. **LoadingPanel** - Show loading state, error handling
5. **Chart Component** - Render visualization

Example query structure:
```typescript
export function useWebsiteStatsQuery(websiteId: string) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useQuery<WebsiteStatsData>({
    queryKey: ['websites:stats', { websiteId, startAt, endAt, ...filters }],
    queryFn: () =>
      get(`/websites/${websiteId}/stats`, { startAt, endAt, ...filters }),
    enabled: !!websiteId,
  });
}
```

---

## 6. ENGAGEMENT & ANALYTICS DATA CURRENTLY DISPLAYED

### Top-Level Metrics (MetricsBar)

#### 1. **Visitors**
- Unique visitors for the selected date range
- Shows change from comparison period (default: previous equal period)
- Used as primary engagement metric

#### 2. **Visits (Sessions)**
- Total number of sessions/visits
- Tracks repeat visitor activity
- Change percentage shown

#### 3. **Pageviews**
- Total page views/impressions
- Indicates overall content consumption
- Change comparison available

#### 4. **Bounce Rate**
- Percentage: (bounces / visits) * 100
- Reversed color indicator (red = bad, green = good)
- Shows single-page sessions

#### 5. **Visit Duration (Avg)**
- Average time spent per visit
- Formatted as MM:SS
- Indicates engagement depth
- Change from previous period

### Time Series Data (Main Chart)
- **Pageviews over time** - Line/bar chart
- **Visitors over time** - Separate series
- Time granularity options: minute, hour, day, month, year
- Interactive legend to toggle series visibility

### Detailed Breakdown Tables

#### Pages Section (2 sub-sections)
1. **Path Analytics**
   - Columns: URL Path, Visitors, Pageviews, Bounce Rate, Avg Duration
   - Sortable by any metric
   - Drill-down to page details

2. **Entry Pages**
   - First page visited in session
   - Same metrics as paths

3. **Exit Pages**
   - Last page visited in session
   - Indicates drop-off points

#### Traffic Sources Section
1. **Referrers**
   - Tracking source (direct, referral domains)
   - Columns: Referrer Domain, Visitors, Pageviews, Bounce Rate
   
2. **Marketing Channels**
   - UTM parameters breakdown (utm_campaign, utm_medium, utm_source, etc.)
   - Channel attribution
   - Campaign performance

#### Environment/Device Section
1. **Browser Analytics**
   - Browser name, version
   - Visitor count, pageviews
   - Usage percentage

2. **Operating System**
   - OS type (Windows, macOS, iOS, Android, Linux, etc.)
   - User distribution

3. **Device Type**
   - Desktop, Tablet, Mobile breakdown
   - Screen resolution data

#### Geographic/Location Section
1. **Countries**
   - Country-level visitor distribution
   - Traffic volume by country
   - Percentage of total

2. **Regions**
   - State/province level data
   - Regional performance metrics

3. **Cities**
   - City-level data
   - Top cities by visitor count

#### Geography Visualization
- **WorldMap** - Visual heatmap showing geographic distribution
- Color intensity = visitor volume
- Interactive hover details
- Drill-down capability

#### Weekly Traffic
- Traffic pattern by day of week
- Identifies peak/low traffic days
- Helps with optimization timing
- Comparison to average

#### Events (on share pages)
- Custom event tracking
- Event name, count, unique users
- Time series of event occurrences
- Event filtering

### Additional Features (Not on Homepage but Accessible)

#### Real-Time Analytics (`/websites/[websiteId]/realtime`)
- Active visitors now
- Recent page views (live stream)
- Recent referrers
- Recent countries
- 30-second update refresh

#### Session Management (`/websites/[websiteId]/sessions`)
- Individual session replay
- Session duration, bounce status
- Session activity timeline
- Browser/OS/Device details per session
- Geographic information

#### Event Tracking (`/websites/[websiteId]/events`)
- Custom events data
- Event property values
- Event filtering and breakdown

#### Reports (`/websites/[websiteId]/[reports]/*`)
- **Attribution** - Multi-touch attribution modeling
- **Breakdown** - Custom field breakdown
- **Funnels** - Conversion funnel tracking
- **Goals** - Goal conversion tracking
- **Journeys** - User journey visualization
- **Retention** - User retention cohorts

#### Segments & Cohorts
- **Segments** - Dynamic user segments based on rules
- **Cohorts** - Behavioral cohorts for analysis

#### Comparison Mode
- Side-by-side metric comparison
- Compare different time periods
- Filter variations

---

## 7. API & DATA FLOW

### Query Architecture
**Path**: `/root/umami/src/components/hooks/queries/`

Uses TanStack React Query (react-query) for:
- Automatic caching
- Background refetching
- Stale time management (1 minute default)
- Retry logic (disabled by default)

### Key API Endpoints (Backend Routes)

**File**: `/root/umami/src/app/api/`

- `/websites/[websiteId]/stats` - Get summary statistics
- `/websites/[websiteId]/pageviews` - Time series pageview data
- `/websites/[websiteId]/events` - Event data
- `/websites/[websiteId]/metrics` - Detailed metrics
- `/websites/[websiteId]/sessions` - Session data
- `/websites/[websiteId]/realtime` - Real-time active users
- `/websites/[websiteId]/reports/*` - Report-specific endpoints
- `/websites` - List user's websites
- `/teams/*` - Team management
- `/auth/*` - Authentication

### Date & Filter Parameters
Standard query parameters applied to most endpoints:
- `startAt` - Start date (timestamp)
- `endAt` - End date (timestamp)
- `unit` - Time granularity (year, month, day, hour, minute)
- `timezone` - User timezone
- Filter parameters (country, browser, os, device, etc.)

### State Management
- **Zustand** for global state
- **React Context** via hooks
- **React Query** for server state
- **Immer** for immutable state updates

---

## 8. RESPONSIVE DESIGN

### Breakpoints (from @umami/react-zen)
- `xs` - Mobile (< 640px)
- `sm` - Tablet small (640px+)
- `md` - Tablet large (768px+)
- `lg` - Desktop (1024px+)
- `xl` - Large desktop (1280px+)

### Mobile Adaptations on Homepage
1. **Navigation** - Side nav hidden, mobile nav in header
2. **MetricsBar** - Single column stack (scrollable)
3. **Charts** - Full width, same functionality
4. **Tables** - Horizontal scroll on mobile
5. **Grid Layouts** - 
   - Desktop: 2x2 grids
   - Mobile: Single column

### Navigation Structure
- **Desktop**: Vertical sidebar nav (SideNav)
- **Mobile**: Top hamburger menu (MobileNav)
- **TopNav**: Always visible (header with user menu, settings)

---

## 9. KEY FILES FOR HOMEPAGE VARIATIONS

### Critical Component Files for Customization
1. `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx` - Main page
2. `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePanels.tsx` - Data sections
3. `/root/umami/src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx` - KPI metrics
4. `/root/umami/src/app/(main)/websites/[websiteId]/WebsiteChart.tsx` - Main chart
5. `/root/umami/src/components/metrics/MetricCard.tsx` - Individual metric card
6. `/root/umami/src/components/charts/BarChart.tsx` - Chart rendering

### Design System Files
- `/root/umami/src/lib/constants.ts` - Colors, theme definitions
- `/root/umami/src/lib/colors.ts` - Color utilities
- `/root/umami/src/styles/global.css` - Global styles
- `/root/umami/src/styles/variables.css` - CSS variables

### Hook/Query Files
- `/root/umami/src/components/hooks/queries/useWebsiteStatsQuery.ts`
- `/root/umami/src/components/hooks/queries/useWebsiteMetricsQuery.ts`
- `/root/umami/src/components/hooks/queries/useWebsitePageviewsQuery.ts`
- `/root/umami/src/components/hooks/useDateRange.ts`
- `/root/umami/src/components/hooks/useFilters.ts`

### Style/Theme Files
- `/root/umami/src/components/common/Panel.tsx` - Card/panel wrapper
- `/root/umami/src/components/common/GridRow.tsx` - Grid layout helper

---

## 10. BUILD & DEPLOYMENT

### Build Process
```bash
npm run build
# Runs: npm-run-all check-env build-db check-db build-tracker build-geo build-app

npm run build-app  # Main Next.js build with Turbo
npm run dev        # Development mode on port 3001
npm run start      # Production mode
```

### Environment Variables (key ones for UI)
- `BASE_PATH` - Base path for deployment
- `CLOUD_MODE` - Cloud deployment mode
- `NODE_ENV` - Environment type (development/production)
- `DISABLE_UI` - Disable UI entirely
- `TRACKER_SCRIPT_NAME` - Custom tracker script name

### Deployment Targets
- Docker support (@umami/react-zen compatible)
- Netlify (with @netlify/plugin-nextjs)
- Standard Node.js servers
- Self-hosted options

