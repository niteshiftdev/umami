# Codebase Exploration Complete

This document summarizes the exploration conducted to understand the Umami codebase architecture for creating 4 homepage variations.

## Documents Created

1. **CODEBASE_ARCHITECTURE.md** - Complete 12-section architecture guide (643 lines)
   - Framework and project structure
   - Design system and styling
   - Component library architecture
   - Chart and visualization components
   - Data fetching and API patterns
   - Authentication setup
   - Example page implementation
   - Component export/import patterns
   - Constants and configuration
   - Key files reference
   - Step-by-step prototyping guide
   - Environment variables

2. **QUICK_REFERENCE.md** - Practical quick-start guide
   - File location shortcuts
   - Step-by-step new route creation
   - Key imports reference
   - Color system
   - Layout props
   - Authentication details
   - Data fetching patterns
   - Files to reference
   - Testing environment

## Key Findings Summary

### 1. Project Stack
- **Framework**: Next.js 15.5.3 with App Router (NOT Pages Router)
- **React**: 19.2.0
- **TypeScript**: 5.9
- **UI Library**: @umami/react-zen v0.203.0
- **Charting**: Chart.js v4.5.1 + chartjs-adapter-date-fns
- **State Management**: React Query v5.90.5 + Zustand
- **i18n**: react-intl

### 2. Design System
- **Primary Color**: #2680eb (Blue)
- **Theme Provider**: ZenProvider in Providers.tsx
- **Color Palette**: 12-color chart palette pre-defined
- **Typography**: Inter font (300, 400, 500, 700)
- **Responsive Breakpoints**: xs, md, lg
- **Component Props**: Flexbox-based (padding, gap, border, etc.)

### 3. Component Architecture
- **Base Layout**: Grid, Column, Row (from @umami/react-zen)
- **Common Components**: Panel, PageHeader, PageBody, LoadingPanel
- **Chart Components**: Chart (base), BarChart, PieChart, BubbleChart
- **Metric Components**: MetricCard, MetricsBar, MetricsTable, WeeklyTraffic, WorldMap, etc.
- **All components are TypeScript-based with proper interfaces**

### 4. Data Layer
- **API Pattern**: Fetch via React Query hooks in `/src/components/hooks/queries/`
- **50+ Query Hooks**: useWebsiteMetricsQuery, useActiveUsersQuery, etc.
- **API Routes**: Located in `/src/app/api/` following Next.js App Router pattern
- **Authentication**: Bearer token via Authorization header, JWT tokens
- **Query Client**: Configured with 1-minute stale time, no auto-refetch

### 5. Authentication
- **Auth Flow**: POST /api/auth/login returns JWT token stored in localStorage
- **Auth Check**: useLoginQuery() in App.tsx redirects to /login if not authenticated
- **RBAC**: 7 roles with granular permissions
- **Dev Mode**: Set DISABLE_AUTH=1 to skip authentication
- **Pages**: All pages under /(main)/ are automatically protected

### 6. File Structure
```
src/
├── app/(main)/              # Protected routes
├── app/api/                 # API routes
├── components/
│   ├── charts/              # 5 chart components
│   ├── common/              # ~15 reusable UI components
│   ├── metrics/             # ~12 analytics components
│   └── hooks/
│       └── queries/         # 50+ data fetching hooks
├── lib/                     # Utilities (auth, colors, constants)
└── styles/                  # Global CSS and variables
```

## Creating Homepage Variations

### Quick Start
1. Create: `/src/app/(main)/homepage-variation-[N]/page.tsx`
2. Use template with PageBody > Column > Panel structure
3. Import charts, metrics, and hooks as needed
4. Pages are automatically authenticated and styled

### Key Import Patterns
```typescript
// Layout
import { Column, Row, Grid } from '@umami/react-zen';
import { PageBody, PageHeader, Panel } from '@/components/common/...';

// Charts
import { BarChart, PieChart } from '@/components/charts/...';

// Metrics
import { MetricCard, MetricsBar } from '@/components/metrics/...';

// Data
import { useWebsiteMetricsQuery } from '@/components/hooks/queries/...';

// Styling
import { THEME_COLORS } from '@/lib/constants';
```

### Styling Via Props
```typescript
<Column padding="6" gap="4" border="bottom" marginY="3">
  {children}
</Column>
```

## File Locations (Absolute Paths)

### Core Infrastructure
- `/root/umami/src/app/layout.tsx` - Root layout
- `/root/umami/src/app/Providers.tsx` - Provider setup
- `/root/umami/src/app/(main)/App.tsx` - Main app component

### Component Libraries
- `/root/umami/src/components/common/` - UI components
- `/root/umami/src/components/charts/` - Chart components
- `/root/umami/src/components/metrics/` - Metric components
- `/root/umami/src/components/hooks/` - Data fetching hooks

### Styling
- `/root/umami/src/lib/constants.ts` - Colors, roles, permissions
- `/root/umami/src/lib/colors.ts` - Color utilities
- `/root/umami/src/styles/` - Global CSS

### Examples to Reference
- `/root/umami/src/app/(main)/dashboard/DashboardPage.tsx` - Simple page
- `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx` - Complex page with charts

## Database & API Access

### Prisma Database
- ORM: Prisma v6.18.0
- Database: PostgreSQL (via @prisma/adapter-pg)
- ClickHouse: For analytics data (@clickhouse/client v1.12.0)
- Redis: Optional session storage (@umami/redis-client v0.29.0)

### API Endpoints
```
POST   /api/auth/login              - Login
GET    /api/me                      - Current user
GET    /api/websites                - List websites
GET    /api/websites/:id/metrics    - Website metrics
GET    /api/config                  - App configuration
```

## Testing & Development

### Run Development Server
```bash
cd /root/umami
npm run dev  # Runs on localhost:3001
```

### With Auth Disabled
```bash
DISABLE_AUTH=1 npm run dev
```

### Key Build Scripts
- `npm run build-app` - Build Next.js app
- `npm run build-db` - Generate Prisma client
- `npm run lint` - Run ESLint

## Responsive Design

### Breakpoints (via @umami/react-zen)
- xs: Mobile
- md: Tablet
- lg: Desktop

### Example Responsive Layout
```typescript
<Grid
  columns={{ xs: '1fr', lg: 'auto 1fr' }}
  display={{ xs: 'none', lg: 'flex' }}
>
  {content}
</Grid>
```

## Error Handling & Loading States

### Components Available
- `<ErrorBoundary>` - Catches React errors
- `<LoadingPanel>` - Loading indicator
- `<ErrorMessage>` - Error display

### Pattern
```typescript
const { data, isLoading, error } = useQuery(...);

if (isLoading) return <LoadingPanel />;
if (error) return <ErrorMessage message={error.message} />;

return <MyComponent data={data} />;
```

## Performance Considerations

### Animations
- `DEFAULT_ANIMATION_DURATION` set to 0 (instant)
- Charts use efficient Chart.js rendering
- React Query caching with 1-minute stale time

### Code Splitting
- Automatic via Next.js App Router
- Each route is code-split by default

## i18n (Internationalization)

### Message System
- react-intl for translations
- Message files in `/public/intl/messages/`
- Hook: `useMessages()` returns `formatMessage(labels.*)`

## Build & Deployment

### Output Mode
- Standalone (self-contained)
- Suitable for Docker containerization

### Environment Variables
- DISABLE_AUTH - Skip authentication (for dev)
- BASE_PATH - Deploy under subpath
- CLOUD_MODE - Cloud deployment flag

## Next Steps

1. Review `/root/umami/CODEBASE_ARCHITECTURE.md` for complete details
2. Reference `/root/umami/QUICK_REFERENCE.md` for quick starts
3. Copy example from `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`
4. Create first variation under `/src/app/(main)/homepage-variation-1/`
5. Test locally with `npm run dev`
6. Iterate on design and layout

## Contact Points for Typical Tasks

### Need to fetch data?
- See: `/root/umami/src/components/hooks/useApi.ts`
- Example: `/root/umami/src/components/hooks/queries/useWebsiteMetricsQuery.ts`

### Need a metric card?
- See: `/root/umami/src/components/metrics/MetricCard.tsx`

### Need a chart?
- See: `/root/umami/src/components/charts/BarChart.tsx` (time-series)
- See: `/root/umami/src/components/charts/PieChart.tsx` (categorical)

### Need UI layout?
- See: `/root/umami/src/components/common/Panel.tsx`
- See: `/root/umami/src/components/common/PageHeader.tsx`

### Need colors?
- See: `/root/umami/src/lib/constants.ts` (THEME_COLORS, CHART_COLORS)

