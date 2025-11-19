# Critical Files for Creating Homepage Variations

## File Locations (Absolute Paths)

### Main Homepage Components
- **/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx** - Main page orchestrator
- **/root/umami/src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx** - KPI metrics display
- **/root/umami/src/app/(main)/websites/[websiteId]/WebsitePanels.tsx** - Data panel grid layout
- **/root/umami/src/app/(main)/websites/[websiteId]/WebsiteChart.tsx** - Main time series chart
- **/root/umami/src/app/(main)/websites/[websiteId]/WebsiteControls.tsx** - Control bar (filters, date range)

### Chart & Visualization Components
- **/root/umami/src/components/charts/Chart.tsx** - Base Chart.js wrapper
- **/root/umami/src/components/charts/BarChart.tsx** - Time series bar chart
- **/root/umami/src/components/charts/PieChart.tsx** - Pie/donut charts
- **/root/umami/src/components/charts/BubbleChart.tsx** - Bubble plots
- **/root/umami/src/components/metrics/EventsChart.tsx** - Events time series
- **/root/umami/src/components/metrics/PageviewsChart.tsx** - Pageviews chart
- **/root/umami/src/components/metrics/WeeklyTraffic.tsx** - Weekly breakdown
- **/root/umami/src/components/metrics/WorldMap.tsx** - Geographic heatmap

### Metric Card Components
- **/root/umami/src/components/metrics/MetricCard.tsx** - Individual KPI card (animated)
- **/root/umami/src/components/metrics/MetricsBar.tsx** - Container for metric cards
- **/root/umami/src/components/metrics/MetricsTable.tsx** - Data table component
- **/root/umami/src/components/metrics/MetricsExpandedTable.tsx** - Expanded table view
- **/root/umami/src/components/metrics/ListTable.tsx** - Generic list table

### Common Components
- **/root/umami/src/components/common/Panel.tsx** - Card/panel wrapper
- **/root/umami/src/components/common/GridRow.tsx** - Grid layout helper
- **/root/umami/src/components/common/PageBody.tsx** - Page body wrapper
- **/root/umami/src/components/common/PageHeader.tsx** - Page header
- **/root/umami/src/components/common/LoadingPanel.tsx** - Loading state wrapper

### Data Query Hooks
- **/root/umami/src/components/hooks/queries/useWebsiteStatsQuery.ts** - Top metrics
- **/root/umami/src/components/hooks/queries/useWebsitePageviewsQuery.ts** - Time series
- **/root/umami/src/components/hooks/queries/useWebsiteMetricsQuery.ts** - Table metrics
- **/root/umami/src/components/hooks/queries/useWebsiteEventsQuery.ts** - Event data
- **/root/umami/src/components/hooks/queries/useRealtimeQuery.ts** - Real-time data
- **/root/umami/src/components/hooks/queries/useActiveUsersQuery.ts** - Active users

### UI State Hooks
- **/root/umami/src/components/hooks/useDateRange.ts** - Date range state
- **/root/umami/src/components/hooks/useFilterParameters.ts** - Filter state
- **/root/umami/src/components/hooks/useMessages.ts** - i18n labels
- **/root/umami/src/components/hooks/useDateParameters.ts** - Date parameters
- **/root/umami/src/components/hooks/useNavigation.ts** - Router navigation
- **/root/umami/src/components/hooks/useLocale.ts** - Locale/language

### Design System & Styles
- **/root/umami/src/lib/constants.ts** - Theme colors, chart colors, constants
- **/root/umami/src/lib/colors.ts** - Color utilities and theme extraction
- **/root/umami/src/lib/charts.ts** - Chart utility functions
- **/root/umami/src/lib/format.ts** - Number/currency formatting
- **/root/umami/src/lib/date.ts** - Date formatting utilities
- **/root/umami/src/styles/global.css** - Global CSS (scrollbar, base styles)
- **/root/umami/src/styles/variables.css** - CSS custom properties

### Global Setup
- **/root/umami/src/app/Providers.tsx** - Root context providers
- **/root/umami/src/app/layout.tsx** - Root layout
- **/root/umami/src/app/(main)/layout.tsx** - Main authenticated layout
- **/root/umami/src/app/(main)/App.tsx** - Main app wrapper (navigation, etc)

### Theme & Config
- **/root/umami/next.config.ts** - Next.js configuration
- **/root/umami/tsconfig.json** - TypeScript configuration
- **/root/umami/package.json** - Dependencies and scripts

---

## Key Data Structures

### WebsiteStatsData (from useWebsiteStatsQuery)
```typescript
{
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

### Chart Data Format (Chart.js)
```typescript
{
  labels: string[];           // X-axis labels
  datasets: Array<{
    label: string;
    data: Array<{ x: string|number, y: number }>;
    backgroundColor: string;
    borderColor: string;
    // ... more Chart.js options
  }>;
  focusLabel?: string;       // For filtering visibility
}
```

### MetricCard Props
```typescript
{
  value: number;
  previousValue?: number;
  change?: number;
  label?: string;
  reverseColors?: boolean;   // For metrics where down is good
  formatValue?: (n: any) => string;
  showLabel?: boolean;
  showChange?: boolean;
}
```

### MetricsTable Props
```typescript
{
  type: string;              // 'path', 'country', 'browser', etc.
  title: string;
  websiteId: string;
  limit: number;
  allowDownload?: boolean;
  showMore?: boolean;
  metric: string;            // Metric name to display
  filterLink?: boolean;
}
```

---

## Development Workflow for Variations

### Step 1: Understand Current Implementation
- Read WebsitePage.tsx to see component composition
- Review WebsiteMetricsBar.tsx for metric data flow
- Examine WebsitePanels.tsx for layout structure
- Study the relevant query hooks for data fetching

### Step 2: Create Variation Component
```bash
# Copy existing files as templates
cp /root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx \
   /root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.Variant1.tsx
```

### Step 3: Modify Layout
- Edit WebsitePanels component to reorder/hide sections
- Adjust GridRow layout props
- Modify Panel styling and arrangement

### Step 4: Modify Metrics Display
- Update MetricCard styling in variations
- Add/remove metrics from MetricsBar
- Create variant MetricsBar if needed

### Step 5: Update Chart Visualization
- Modify BarChart configuration
- Add chart type variations
- Adjust colors via constants.ts

### Step 6: Style with Design System
- Use @umami/react-zen components
- Update colors in /root/umami/src/lib/constants.ts
- Modify CSS via /root/umami/src/styles/

### Step 7: Test and Deploy
```bash
npm run dev              # Test locally on port 3001
npm run build          # Build for production
npm run start          # Run production server
```

---

## Key Concepts for Variations

### 1. Responsive Layout
- Use @umami/react-zen Grid, Row, Column components
- Responsive props: xs, sm, md, lg, xl
- GridRow with layout prop: "one", "two", "two-one", etc.

### 2. Theme System
- Primary color: #2680eb
- Chart colors: 12-color palette in CHART_COLORS
- Light/dark theme colors in THEME_COLORS
- All in /root/umami/src/lib/constants.ts

### 3. Data Flow Pattern
```
Component (WebsitePage)
  ↓
Custom Hook (useWebsiteStatsQuery)
  ↓
TanStack React Query
  ↓
API Endpoint (/websites/[websiteId]/stats)
  ↓
Data Display (MetricCard, Chart, Table)
```

### 4. State Management
- Global: Zustand store (date range, filters)
- Server: React Query (API data)
- Local: React useState (UI state)

### 5. Animation
- @react-spring/web for smooth transitions
- Chart.js built-in animations (300ms default)
- CSS transitions for UI elements

---

## Common Customization Tasks

### Change Color Scheme
```typescript
// File: /root/umami/src/lib/constants.ts
export const THEME_COLORS = {
  light: {
    primary: '#NEW_COLOR',    // Change here
    text: '#ANOTHER_COLOR',
    line: '#LINE_COLOR',
    fill: '#FILL_COLOR',
  },
  dark: { ... }
}

export const CHART_COLORS = [
  '#NEW_CHART_COLOR_1',
  '#NEW_CHART_COLOR_2',
  // ... etc
]
```

### Reorder Panels
```typescript
// File: /root/umami/src/app/(main)/websites/[websiteId]/WebsitePanels.tsx
// Change the order of GridRow components
// Remove sections by commenting out GridRow
// Add new sections as new GridRow entries
```

### Modify Metric Cards
```typescript
// File: /root/umami/src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx
// Edit the metrics array to add/remove/reorder cards
// Change formatValue for different display formats
// Add new query hooks for new metrics
```

### Change Chart Type
```typescript
// File: /root/umami/src/app/(main)/websites/[websiteId]/WebsiteChart.tsx
// Modify chartOptions passed to BarChart
// Or use different chart component: PieChart, LineChart, etc.
// Import from /root/umami/src/components/charts/
```

### Adjust Layout Spacing
```typescript
// Use @umami/react-zen props
<Column gap="3" padding="2">     {/* change gap, padding values */}
  <GridRow layout="two">         {/* change layout: "one", "two", "two-one" */}
    <Panel gridColumn="span 1">  {/* control column spanning */}
```

---

## Performance Considerations

### Lazy Loading
- Modals loaded only when needed
- Virtual lists for large tables (react-window)
- Code splitting via Next.js

### Caching Strategy
- React Query cache: 1 minute stale time
- Automatic background refetching
- Manual refetch on date range/filter change

### Optimization Tips
- Memoize expensive calculations with useMemo
- Use React.memo for components that receive complex props
- Lazy load images and visualizations
- Monitor bundle size with Next.js analyzer

---

## Testing the Variations

### Development Testing
```bash
# Run dev server
npm run dev

# Navigate to http://localhost:3001
# Login and select a website
# Check each section for data display
```

### Manual Testing Checklist
- [ ] All metric cards display correctly
- [ ] Chart renders with correct data
- [ ] Tables load with proper pagination
- [ ] Filters/date range controls work
- [ ] Responsive layout works on mobile
- [ ] Animations are smooth
- [ ] Colors match design system
- [ ] i18n labels display correctly
- [ ] Loading states appear/disappear
- [ ] Error states handled gracefully

### Component Testing Files
If tests exist: `/root/umami/src/**/__tests__/`
Run tests: `npm run test`

