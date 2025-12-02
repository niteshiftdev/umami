# Umami Codebase Exploration Summary

## 1. Project Overview & Framework

### Framework: Next.js 15 with App Router
- **Version**: 3.0.0 (privacy-focused analytics alternative to Google Analytics)
- **Build System**: Next.js with Turbo cache (v15.5.3)
- **Package Manager**: pnpm 10.22.0
- **Language**: TypeScript with React 19.2.0

### Key Routing Structure
- **Next.js App Router** (NOT Pages Router)
- Main app routes located in `/src/app/`
- Landing page redirects to `/websites` (root page redirects users to websites list)
- Path: `/src/app/page.tsx` - redirects to `/websites`

### Main Route Groups
```
src/app/
├── (main)/ - Protected routes with layout
│   ├── dashboard/
│   ├── websites/[websiteId]/
│   ├── boards/[boardId]/
│   ├── console/
│   ├── admin/
│   └── settings/
├── api/ - REST API routes
├── login/
├── logout/
└── sso/
```

---

## 2. Existing Home Page Implementation

### Dashboard Page
**Location**: `/src/app/(main)/dashboard/page.tsx`

Currently, the dashboard is minimal:
```typescript
export function DashboardPage() {
  return (
    <PageBody>
      <Column margin="2">
        <PageHeader title="Dashboard" />
      </Column>
    </PageBody>
  );
}
```

### Main Website Analytics Page
**Location**: `/src/app/(main)/websites/[websiteId]/page.tsx`

This is the primary analytics view with:
- **WebsiteMetricsBar**: Displays key metrics (visitors, visits, pageviews, bounce rate, visit duration)
- **WebsiteChart**: Line/bar chart showing pageviews vs sessions over time
- **WebsitePanels**: Multiple sections with tabbed content:
  - Pages (path, entry, exit)
  - Sources (referrers, channels)
  - Environment (browsers, OS, devices)
  - Location (countries, regions, cities)
  - World Map visualization
  - Weekly Traffic heatmap
  - Events chart (for shared pages)

### Layout Components
- **PageBody**: Default max-width 1320px, responsive padding
- **PageHeader**: Title, optional description, icon, and right-aligned children
- **Panel**: Reusable container with border, padding, optional fullscreen mode
- **GridRow**: Responsive grid layouts (one, two, three, one-two, two-one columns)

---

## 3. Design System

### Design Token System: @niteshift/dials
**Location**: `/root/umami/packages/dials/`

This is a runtime design parameter control system for rapid prototyping. Used in WebsitePage for:
- **Typography Controls**: Font sizes, weights, colors
- **Color Controls**: Custom hex color pickers
- **Variant Controls**: Size/weight options

#### Current Typography Controls in WebsitePage:
```
Metric Typography:
- metric-label-size: ['0', '1', '2', '3', '4'] (default: '')
- metric-value-size: ['4', '5', '6', '7', '8', '9'] (default: '8')
- metric-label-weight: ['normal', 'medium', 'semibold', 'bold'] (default: 'bold')
- metric-value-weight: ['normal', 'medium', 'semibold', 'bold'] (default: 'bold')
- metric-label-color: Custom hex or predefined colors
- metric-value-color: Custom hex or predefined colors

Section Heading Typography:
- section-heading-size: ['1', '2', '3', '4', '5'] (default: '2')
- section-heading-weight: ['normal', 'medium', 'semibold', 'bold'] (default: 'bold')
- section-heading-color: Custom hex or predefined colors
```

### Component Library: @umami/react-zen
Version 0.203.0 - Provides UI components with built-in theming:

**Layout Components:**
- `Column`, `Row`, `Grid`: Flex-based layout primitives
- `Box`: Generic container

**Typography:**
- `Heading`: Responsive heading with size variants
- `Text`: Text component with size, weight, color options

**UI Elements:**
- `Button`, `LinkButton`: Various button variants
- `Icon`, `Focusable`
- `Tab`, `TabList`, `TabPanel`, `Tabs`
- `AlertBanner`, `Loading`
- `Tooltip`, `TooltipTrigger`
- `FloatingTooltip`

**Props System:**
- Responsive props: `size={{ xs: '2', md: '3', lg: '4' }}`
- Spacing: `padding`, `paddingX`, `paddingY`, `margin`, `marginBottom`
- Sizing: `width`, `height`, `maxWidth`, `minHeight`
- Layout: `gap`, `border`, `backgroundColor`, `borderRadius`
- Theme support: `useTheme()` hook

### Theme Colors
**Location**: `/src/lib/constants.ts` - `THEME_COLORS`

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
  },
}

CHART_COLORS = [
  '#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#f7bd12',
  '#01bad7', '#6734bc', '#89c541', '#ffc301', '#ec1562', '#ffec16'
]
```

### Global Styles
**Location**: `/src/styles/`
- `variables.css`: CSS variables for colors and fonts
- `global.css`: Global styles including scrollbar theming
- Uses CSS variables pattern: `--primary-color`, `--font-color`, `--base-color-*`

---

## 4. Chart/Visualization Components

### Available Chart Types
**Location**: `/src/components/charts/`

#### Chart Types (via Chart.js):
- `bar`
- `bubble`
- `doughnut`
- `pie`
- `line`
- `polarArea`
- `radar`
- `scatter`

### Chart Component Library

#### Base Chart Component
**File**: `/src/components/charts/Chart.tsx`
```typescript
export interface ChartProps extends BoxProps {
  type?: 'bar' | 'bubble' | 'doughnut' | 'pie' | 'line' | 'polarArea' | 'radar' | 'scatter';
  chartData?: ChartData & { focusLabel?: string };
  chartOptions?: ChartOptions;
  updateMode?: UpdateMode;
  animationDuration?: number;
  onTooltip?: (model: any) => void;
}
```

**Features:**
- Canvas-based rendering via Chart.js 4.5.1
- Custom legend rendering
- Legend item click handling for toggling datasets
- External tooltip support
- Animation configuration

#### BarChart Component
**File**: `/src/components/charts/BarChart.tsx`
- Extends Chart with time-series capabilities
- Supports stacked bars
- Custom axis label rendering
- Date formatting via date-fns
- Currency formatting option
- Tooltip with date/value display

#### PageviewsChart Component
**File**: `/src/components/metrics/PageviewsChart.tsx`
- Specialized bar chart for page/session data
- Two datasets: visitors (bar) and views (bar) with optional comparison (line)
- Time series generation with minDate/maxDate
- Responsive date label rendering

#### EventsChart Component
**File**: `/src/components/metrics/EventsChart.tsx`
- Multi-dataset stacked bar chart
- Dynamic dataset creation from event data
- Color assignment from CHART_COLORS palette
- Focus label support for dataset filtering

#### PieChart Component
**File**: `/src/components/charts/PieChart.tsx`
- Supports 'pie' and 'doughnut' types
- Custom tooltip display

#### Other Visualizations
- **WorldMap**: Geographic visualization using `react-simple-maps`
  - ComposableMap with ZoomableGroup
  - Geographies data from datamaps.world.json
  - Color intensity based on country metrics
  - Hover tooltips
  
- **WeeklyTraffic**: Heatmap-style visualization
  - 7 days x 24 hours grid
  - Scaled dot indicators based on traffic
  - Interactive tooltips

### ChartTooltip Component
**File**: `/src/components/charts/ChartTooltip.tsx`
- Displays chart data on hover
- Shows title, color indicator, and value

### Color System for Charts
**Function**: `getThemeColors()` in `/src/lib/colors.ts`
- Returns theme-specific colors
- Chart colors with opacity support (rgba strings)
- Map colors (base, fill, stroke, hover)
- Uses `colord` library for color manipulation

---

## 5. Data Types & APIs

### Core Data Structures

#### WebsiteStatsData
```typescript
export interface WebsiteStatsData {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  comparison: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
  };
}
```

#### WebsitePageviewsData
```typescript
export interface WebsitePageviewsData {
  pageviews: { x: string; y: number }[];
  sessions: { x: string; y: number }[];
}
```

#### MetricsData Format
Standard format for most metrics queries:
```typescript
{
  x: string;      // Label/name
  y: number;      // Count/value
  z?: number;     // Percentage
}[]
```

#### Comparison Support
API supports date comparison with `compare` parameter:
- Returns `comparison` object with same structure as primary period
- Used for calculating changes/trends

### API Endpoints

**Base Path**: `/api/websites/[websiteId]/`

#### Core Stats Endpoint
- `GET /api/websites/{websiteId}/stats`
- Query params: `startAt`, `endAt`, `unit`, `timezone`, filter params
- Returns: `WebsiteStatsData` with comparison period

#### Pageviews Endpoint
- `GET /api/websites/{websiteId}/pageviews`
- Supports `compare` parameter for date comparison
- Returns: Time series data for pageviews and sessions

#### Metrics Endpoint
- `GET /api/websites/{websiteId}/metrics`
- Query param `type`: 'path', 'referrer', 'browser', 'os', 'device', 'country', 'city', 'region', 'entry', 'exit', 'channel', 'event'
- Returns: Array of metrics

#### Events Series
- `GET /api/websites/{websiteId}/events/series`
- Returns: Event data with time series { x: event, t: timestamp, y: count }

#### Active Users (Realtime)
- `GET /api/websites/{websiteId}/active`
- Real-time visitor count

#### Weekly Traffic
- `GET /api/websites/{websiteId}/weekly-traffic`
- Returns: 7 days × 24 hours matrix of visitor counts

### Query Hooks Pattern
**Location**: `/src/components/hooks/queries/`

All use React Query (@tanstack/react-query v5.90.5):

```typescript
export function useWebsiteStatsQuery(
  websiteId: string,
  options?: UseQueryOptions<WebsiteStatsData, Error, WebsiteStatsData>,
) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useQuery<WebsiteStatsData>({
    queryKey: ['websites:stats', { websiteId, startAt, endAt, unit, timezone, ...filters }],
    queryFn: () =>
      get(`/websites/${websiteId}/stats`, { startAt, endAt, unit, timezone, ...filters }),
    enabled: !!websiteId,
    ...options,
  });
}
```

**Standard Query Hook Features:**
- Automatic cache key generation
- Date parameter management
- Filter parameter handling
- Conditional enabling
- Support for React Query options

### Available Query Hooks
- `useWebsiteStatsQuery` - Key metrics
- `useWebsitePageviewsQuery` - Pageview/session time series
- `useWebsiteMetricsQuery` - Configurable metrics by type
- `useWebsiteEventsQuery` - Event data
- `useWebsiteEventsSeriesQuery` - Event time series
- `useWebsiteValuesQuery` - Custom metric values
- `useWebsiteSessionsQuery` - Session data
- `useWebsiteSessionStatsQuery` - Session statistics
- `useWeeklyTrafficQuery` - Weekly heatmap data
- `useRealtimeQuery` - Real-time active users

### Global State Management
**Location**: `/src/store/`

Uses **Zustand** (v5.0.8) for state management:

#### Dashboard Store
```typescript
// /src/store/dashboard.ts
export const initialState = {
  showCharts: boolean;
  limit: number;
  websiteOrder: string[];
  websiteActive: string[];
  editing: boolean;
  isEdited: boolean;
};

export const useDashboard = store;  // Zustand store
```

#### Common Hooks
- `useDateRange()` - Date range selection state
- `useDateParameters()` - Extracted start/end dates
- `useFilterParameters()` - Active filters
- `useMessages()` - Internationalization
- `useLocale()` - Current locale/formatting

---

## 6. Existing Dashboard & Metrics Components

### Dashboard Components

#### MetricCard
**File**: `/src/components/metrics/MetricCard.tsx`

Animated metric display card:
```typescript
export interface MetricCardProps {
  value: number;
  previousValue?: number;
  change?: number;
  label?: string;
  reverseColors?: boolean;
  formatValue?: (n: any) => string;
  showLabel?: boolean;
  showChange?: boolean;
  labelSize?: '0' | '1' | '2' | '3' | '4';
  valueSize?: '4' | '5' | '6' | '7' | '8' | '9';
  labelWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  valueWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  labelColor?: string;
  valueColor?: string;
}
```

Features:
- Animated number transitions via @react-spring/web
- Percentage change display
- Customizable typography via dials
- Optional reverse color scheme (for metrics where lower is better)

#### MetricsBar
**File**: `/src/components/metrics/MetricsBar.tsx`

Responsive grid of metric cards:
```typescript
<Grid columns="repeat(auto-fit, minmax(140px, 1fr))" gap {...props}>
  {children}
</Grid>
```

#### MetricsTable
**File**: `/src/components/metrics/MetricsTable.tsx`

Data table with:
- Configurable data types (path, referrer, browser, etc.)
- Filtering support
- Expandable/link functionality
- Download capability
- Show more functionality

#### ListTable
**File**: `/src/components/metrics/ListTable.tsx`

Underlying table component with:
- Sortable columns
- Custom label rendering
- Count and percentage display
- Metric display

### Supporting Components

#### LoadingPanel
**File**: `/src/components/common/LoadingPanel.tsx`
- Shows loading state, error, or empty state
- Configurable loading icon and placement
- Custom empty render function

#### Empty
**File**: `/src/components/common/Empty.tsx`
- Empty state placeholder

#### ErrorMessage
**File**: `/src/components/common/ErrorMessage.tsx`
- Error display component

### Page Layout Pattern

Standard page layout:
```typescript
<PageBody maxWidth="1320px">
  <Column margin="2">
    <PageHeader title={title} />
  </Column>
  
  <Grid gap="3">
    <GridRow layout="two">
      <Panel>
        {/* Content */}
      </Panel>
      <Panel>
        {/* Content */}
      </Panel>
    </GridRow>
  </Grid>
</PageBody>
```

---

## 7. Formatting & Utility Libraries

### Formatting Functions
**Location**: `/src/lib/format.ts`

```typescript
formatNumber(n: number) -> "1234"
formatLongNumber(n: number) -> "1.2m", "1.2k", "1.2b"
formatTime(seconds: number) -> "1:23:45"
formatShortTime(seconds: number, formats?: string[]) -> "1m 23s"
formatCurrency(value: number, currency: string) -> "$1,234.56"
formatLongCurrency(value: number, currency: string) -> "$1.2m"
stringToColor(str: string) -> "#hexcolor" (hash-based)
```

### Date Utilities
**Location**: `/src/lib/date.ts`

Uses date-fns and date-fns-tz for:
- Date range calculations
- Time zone handling
- Format strings
- Locale-aware formatting
- Time series generation

### Color Utilities
**Location**: `/src/lib/colors.ts`

```typescript
hex6(str: string) -> "a1b2c3"  // Hash function
hex2RGB(color: string) -> { r, g, b }
rgb2Hex(r, g, b) -> "a1b2c3"
getPastel(color: string, factor: number) -> "hexcolor"
getColor(seed: string) -> "hexcolor"
getThemeColors(theme: string) -> { colors: { theme, chart, map } }
```

Uses `colord` library for color manipulation with alpha/opacity support.

### Filter Functions
**Location**: `/src/lib/filters.ts`

```typescript
percentFilter(data: Array) -> Array  // Adds percentage calculation (z field)
```

---

## 8. File Structure Summary

```
/root/umami/
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── dashboard/
│   │   │   ├── websites/[websiteId]/
│   │   │   ├── boards/[boardId]/
│   │   │   └── [other routes]
│   │   ├── api/
│   │   │   ├── websites/[websiteId]/
│   │   │   ├── auth/
│   │   │   └── [other endpoints]
│   │   └── [other routes]
│   │
│   ├── components/
│   │   ├── charts/
│   │   │   ├── Chart.tsx (base)
│   │   │   ├── BarChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── ChartTooltip.tsx
│   │   │
│   │   ├── metrics/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── MetricsBar.tsx
│   │   │   ├── MetricsTable.tsx
│   │   │   ├── PageviewsChart.tsx
│   │   │   ├── EventsChart.tsx
│   │   │   ├── WeeklyTraffic.tsx
│   │   │   └── WorldMap.tsx
│   │   │
│   │   ├── common/
│   │   │   ├── PageHeader.tsx
│   │   │   ├── PageBody.tsx
│   │   │   ├── Panel.tsx
│   │   │   ├── GridRow.tsx
│   │   │   ├── LoadingPanel.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── [other components]
│   │   │
│   │   ├── hooks/
│   │   │   ├── queries/
│   │   │   ├── context/
│   │   │   └── [hook files]
│   │   │
│   │   └── boards/
│   │
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── colors.ts
│   │   ├── format.ts
│   │   ├── date.ts
│   │   ├── charts.ts
│   │   └── [utilities]
│   │
│   ├── store/
│   │   ├── dashboard.ts (Zustand store)
│   │   └── [other stores]
│   │
│   └── styles/
│       ├── global.css
│       └── variables.css
│
├── packages/
│   └── dials/
│       └── src/
│           ├── components/
│           ├── controls/
│           ├── hooks/
│           └── [design system files]
│
└── package.json
```

---

## 9. Key Technologies & Dependencies

### Core
- **Next.js** 15.5.3 (App Router)
- **React** 19.2.0
- **TypeScript** 5.9.3

### UI & Components
- **@umami/react-zen** 0.203.0 (custom design system)
- **@niteshift/dials** 0.1.0 (runtime design parameters)
- **lucide-react** 0.543.0 (icons)

### Data & State
- **@tanstack/react-query** 5.90.5 (server state)
- **zustand** 5.0.8 (client state)
- **zod** 4.1.12 (schema validation)

### Visualization
- **chart.js** 4.5.1 (charting)
- **chartjs-adapter-date-fns** 3.0.0 (chart date support)
- **react-simple-maps** 2.3.0 (geographic maps)
- **@react-spring/web** 10.0.3 (animations)

### Utilities
- **date-fns** 2.23.0 + **date-fns-tz** 1.1.4 (date handling)
- **colord** 2.9.2 (color manipulation)
- **@hello-pangea/dnd** 17.0.0 (drag & drop)
- **react-intl** 7.1.14 (internationalization)

### Database
- **@prisma/client** 6.18.0 (ORM)
- **@prisma/adapter-pg** 6.18.0 (PostgreSQL adapter)

---

## 10. Responsive Design Pattern

All components use responsive props from react-zen:

```typescript
// Example responsive sizing
<Heading size={{ xs: '2', md: '3', lg: '4' }} />

// Example responsive padding
<PageBody paddingX={{ xs: '3', md: '6' }} />

// Breakpoints follow common standards:
// xs: mobile
// md: tablet
// lg: desktop
```

GridRow layouts support breakpoint-specific columns:
```javascript
{
  two: {
    columns: {
      xs: '1fr',
      md: 'repeat(auto-fill, minmax(560px, 1fr))',
    },
  }
}
```

---

## Key Insights for Persona-Based Homepage

1. **Component Reusability**: MetricCard, MetricsBar, Panel, GridRow form the foundation
2. **Data Pattern**: All metrics follow `{ x, y, z }` format with comparison support
3. **Design System**: Fully parameterizable via dials for rapid prototyping
4. **Performance**: React Query caching, Turbo build system
5. **Theming**: Light/dark theme with CSS variables and colord color manipulation
6. **Animations**: @react-spring for smooth number transitions
7. **Layout**: Responsive grid system with mobile-first approach
8. **State**: Zustand for dashboard configuration, React Query for server state

