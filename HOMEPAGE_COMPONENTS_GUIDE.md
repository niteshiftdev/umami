# Umami Homepage Components - Quick Reference Guide

## Homepage File Locations

### Main Page Entry Points
```
/src/app/(main)/websites/[websiteId]/
├── page.tsx                    # Route handler - passes websiteId to WebsitePage
├── WebsitePage.tsx             # Main page component - orchestrates layout
├── WebsiteControls.tsx         # Date range, filters, comparison controls
├── WebsiteMetricsBar.tsx       # 5 KPI metric cards
├── WebsiteChart.tsx            # Main time series chart
└── WebsitePanels.tsx           # Grid of 6 panel sections with data
```

## Component Hierarchy (Visual Flow)

```
WebsitePage (main container)
│
├─ WebsiteControls
│  └─ Date picker, filters, export
│
├─ WebsiteMetricsBar
│  ├─ MetricsBar (container)
│  └─ MetricCard x5
│     ├─ Visitors
│     ├─ Visits
│     ├─ Pageviews
│     ├─ Bounce Rate
│     └─ Visit Duration
│
├─ Panel wrapper
│  └─ WebsiteChart
│     └─ BarChart (Chart.js)
│
├─ WebsitePanels
│  ├─ GridRow "Pages"
│  │  ├─ Pages Panel (MetricsTable with tabs)
│  │  └─ Sources Panel (MetricsTable with tabs)
│  │
│  ├─ GridRow "Environment"
│  │  ├─ Environment Panel (MetricsTable with tabs)
│  │  └─ Location Panel (MetricsTable with tabs)
│  │
│  ├─ GridRow "Geography"
│  │  ├─ WorldMap Panel
│  │  └─ WeeklyTraffic Panel
│  │
│  └─ GridRow "Events" (share pages only)
│     ├─ Events Panel (MetricsTable)
│     └─ EventsChart Panel
│
└─ ExpandedViewModal (hidden by default)
```

## Key Component Props & Data Flow

### WebsiteMetricsBar
```typescript
Props: { websiteId: string, showChange?: boolean, compareMode?: boolean }
Data Source: useWebsiteStatsQuery(websiteId)
Returns:
{
  pageviews: number,
  visitors: number,
  visits: number,
  bounces: number,
  totaltime: number,
  comparison: { ... same fields ... }
}
```

### WebsiteChart
```typescript
Props: { websiteId: string }
Data Source: useWebsitePageviewsQuery(websiteId)
Renders: BarChart with two series (Pageviews + Visitors)
```

### WebsitePanels
```typescript
Props: { websiteId: string }
Contains: 6 sections with MetricsTable components
Table Types: 'path', 'entry', 'exit', 'referrer', 'channel', 'browser', 
             'os', 'device', 'country', 'region', 'city', 'event'
```

## Metrics Being Displayed

### Top Metrics Bar (WebsiteMetricsBar)
| Metric | Query | Calculation | Change Type |
|--------|-------|-----------|-------------|
| Visitors | useWebsiteStatsQuery | Count of unique visitors | Absolute diff |
| Visits | useWebsiteStatsQuery | Count of sessions | Absolute diff |
| Pageviews | useWebsiteStatsQuery | Total page views | Absolute diff |
| Bounce Rate | useWebsiteStatsQuery | (bounces / visits) * 100 | Percentage (reversed) |
| Visit Duration | useWebsiteStatsQuery | totaltime / visits | Formatted as MM:SS |

### Time Series Chart (WebsiteChart)
- Pageviews over time (stacked bar)
- Visitors over time (stacked bar)
- Time granularity: minute, hour, day, month, year
- Interactive legend to toggle visibility

### Tables (WebsitePanels)
```
Columns typically:
1. Item name (path, country, browser, etc.)
2. Visitors (unique count)
3. Pageviews (total)
4. Bounce Rate (%)
5. Avg Duration (MM:SS)
```

## Design System Integration

### Color Palette
**Primary Theme**: Umami Blue (#2680eb)
**Chart Colors**: 12-color palette
```javascript
CHART_COLORS = [
  '#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#f7bd12',
  '#01bad7', '#6734bc', '#89c541', '#ffc301', '#ec1562', '#ffec16'
]
```

### Layout System (@umami/react-zen)
- Grid/Column/Row components
- Responsive breakpoints: xs, sm, md, lg, xl
- Padding/margin spacing system
- Border radius, colors, typography

### Typography
- Font: Inter (from @fontsource/inter)
- Weights: 300, 400, 500, 700
- Global CSS for base styles

## Custom Hooks Used

### Data Queries
```typescript
useWebsiteStatsQuery(websiteId)           // Top metrics
useWebsitePageviewsQuery(websiteId)       // Time series
useWebsiteMetricsQuery(websiteId, type)   // Table data
useActiveUsersQuery(websiteId)            // Active users
useRealtimeQuery(websiteId)               // Live data
```

### UI State
```typescript
useDateRange()                // Date range state & parameters
useFilterParameters()         // Active filters
useDateParameters()           // Start/end times + unit
useMessages()                 // i18n labels
useNavigation()               // Router & current path
useLocale()                   // Language & locale info
```

## State Management

### Global State (Zustand)
- Selected date range
- Active filters
- Comparison mode settings
- User preferences (theme, timezone)

### Server State (TanStack React Query)
- Website metrics data
- Time series data
- Table data
- Cached with 1-minute stale time

### Local State (React useState)
- Expanded table rows
- Modal visibility
- UI animations

## Styling Approach

### CSS Variables (from variables.css)
```css
--primary-color: #147af3
--light-color: (light theme text)
--base-color-*: (theme background colors)
```

### Inline Styling
```typescript
// Most components use @umami/react-zen props
<Column gap="3" padding="2" borderRadius="2">
  <Text size="4" weight="bold">Title</Text>
</Column>
```

### CSS Modules (limited use)
Only used for complex layouts or animations
Example: `/src/app/(main)/websites/[websiteId]/journeys/Journey.module.css`

## API Endpoints Called by Homepage

```
GET /websites/[websiteId]/stats
GET /websites/[websiteId]/pageviews
GET /websites/[websiteId]/metrics?type=path
GET /websites/[websiteId]/metrics?type=country
GET /websites/[websiteId]/metrics?type=browser
... etc for each table type
```

Query parameters on all:
- startAt (timestamp)
- endAt (timestamp)
- unit (minute|hour|day|month|year)
- timezone (user timezone)
- Filters (country, browser, os, etc.)

## Animation & Transitions

### Metric Cards
- @react-spring/web for animated counter
- Smooth number transitions when data updates

### Charts
- Chart.js animation (300ms duration by default)
- Resize animations with 0ms duration

### Page Transitions
- Next.js default transitions between sections

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- i18n language support

## Performance Optimizations

- React Query caching (1 minute stale time)
- Lazy loaded modals
- Virtual lists for large tables (react-window)
- Responsive images
- Code splitting via Next.js

## Common Modification Points

### To Add a New Metric Card:
1. Add query hook in `/src/components/hooks/queries/`
2. Update WebsiteMetricsBar.tsx to fetch data
3. Add MetricCard to metrics array

### To Add a New Data Table:
1. Create query hook for data fetching
2. Add new GridRow/Panel section in WebsitePanels.tsx
3. Use MetricsTable with appropriate type prop

### To Change Colors:
1. Edit `/src/lib/constants.ts` - THEME_COLORS or CHART_COLORS
2. Edit `/src/lib/colors.ts` for dynamic color generation
3. Update `/src/styles/variables.css` for CSS variables

### To Modify Layout:
1. Edit `/src/app/(main)/websites/[websiteId]/WebsitePanels.tsx` for panel arrangement
2. Use GridRow component with layout prop: "two", "two-one", etc.
3. Adjust Panel paddingX/paddingY for spacing

### To Add a New Chart Type:
1. Create component in `/src/components/charts/`
2. Extend from Chart.tsx base component
3. Implement custom chartOptions for Chart.js config
4. Use in desired panel or main chart area
