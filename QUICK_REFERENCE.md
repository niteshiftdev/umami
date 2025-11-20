# Quick Reference: Creating Homepage Variations

## File Locations Quick Links
- App Layout: `/root/umami/src/app/(main)/App.tsx`
- Theme/Colors: `/root/umami/src/lib/constants.ts`
- UI Components: `/root/umami/src/components/common/` and `/root/umami/src/components/metrics/`
- Charts: `/root/umami/src/components/charts/`
- Hooks/Queries: `/root/umami/src/components/hooks/queries/`
- API Routes: `/root/umami/src/app/api/`

## Creating a New Homepage Variation

### Step 1: Create the Route
```bash
mkdir -p /root/umami/src/app/\(main\)/homepage-variation-1
touch /root/umami/src/app/\(main\)/homepage-variation-1/page.tsx
```

### Step 2: Basic Template
```typescript
'use client';
import { Column } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';

export default function HomepageVariation1() {
  return (
    <PageBody>
      <Column margin="2">
        <PageHeader title="Variation 1: Description" />
        <Panel title="Metric Cards">
          {/* Add content */}
        </Panel>
      </Column>
    </PageBody>
  );
}
```

### Step 3: Key Imports Reference

#### Layout/Structure
```typescript
import { Column, Row, Grid, Box } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
```

#### Charts
```typescript
import { Chart } from '@/components/charts/Chart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
```

#### Metrics
```typescript
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { ActiveUsers } from '@/components/metrics/ActiveUsers';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { WorldMap } from '@/components/metrics/WorldMap';
```

#### Styling/Colors
```typescript
import { THEME_COLORS, CHART_COLORS } from '@/lib/constants';
import { getThemeColors } from '@/lib/colors';
import { useTheme } from '@umami/react-zen';
```

## Color System

Primary Blue: `#2680eb`

Full Palette (from constants):
- Chart colors (12): `#2680eb, #9256d9, #44b556, #e68619, #e34850, #f7bd12, #01bad7, #6734bc, #89c541, #ffc301, #ec1562, #ffec16`

## Layout Props (via @umami/react-zen)

Spacing: `padding`, `margin`, `gap` (values like "1", "2", "3", "6")
Display: `display` (responsive: `{ xs: 'none', lg: 'flex' }`)
Border: `border`, `borderRadius`
Size: `width`, `height`, `minHeight`

Example:
```typescript
<Column padding="6" gap="4" border="bottom">
  Content here
</Column>
```

## Authentication

- Automatic: Pages under `/app/(main)/` redirect to `/login` if not authenticated
- To disable for testing: Set `DISABLE_AUTH=1` env variable
- Current user available via `useLoginQuery()` hook

## Data Fetching Pattern

```typescript
const { data, isLoading, error } = useWebsiteMetricsQuery(
  websiteId,
  { type: 'pageviews' }
);

if (isLoading) return <LoadingPanel />;
if (error) return <ErrorMessage message={error.message} />;

return <BarChart chartData={data} />;
```

## Files to Reference

1. **Existing similar page**: `/root/umami/src/app/(main)/websites/[websiteId]/WebsitePage.tsx`
2. **Example metrics usage**: `/root/umami/src/app/(main)/websites/[websiteId]/WebsiteMetricsBar.tsx`
3. **Example chart usage**: `/root/umami/src/app/(main)/websites/[websiteId]/WebsiteChart.tsx`

## Environment for Testing
```bash
cd /root/umami
npm run dev  # Runs on http://localhost:3001
```

When logging in with `DISABLE_AUTH=1`, you'll be treated as admin.
