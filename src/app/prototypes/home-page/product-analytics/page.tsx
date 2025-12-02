'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, Heading, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { GridRow } from '@/components/common/GridRow';
import { getThemeColors } from '@/lib/colors';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import { renderDateLabels } from '@/lib/charts';
import { colord } from 'colord';
import {
  DialsProvider,
  DialsOverlay,
  useDynamicColor,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';

// Generate realistic mock data for the last 14 days
function generateTimeSeriesData(days: number = 14) {
  const data: { x: string; y: number; d: string }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Realistic pattern: higher on weekdays, lower on weekends
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? 800 : 1200;
    const variance = Math.random() * 400 - 200;

    data.push({
      x: dateStr,
      y: Math.round(baseValue + variance),
      d: dateStr,
    });
  }
  return data;
}

function generateSessionsData(days: number = 14) {
  const data: { x: string; y: number; d: string }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? 600 : 900;
    const variance = Math.random() * 300 - 150;

    data.push({
      x: dateStr,
      y: Math.round(baseValue + variance),
      d: dateStr,
    });
  }
  return data;
}

// Mock data for user engagement metrics
const engagementPageviews = generateTimeSeriesData(14);
const engagementSessions = generateSessionsData(14);

const featureUsageData = [
  { label: 'Dashboard View', count: 4521, percent: 32 },
  { label: 'Report Export', count: 3892, percent: 28 },
  { label: 'User Management', count: 2156, percent: 15 },
  { label: 'API Integration', count: 1834, percent: 13 },
  { label: 'Custom Events', count: 1012, percent: 7 },
  { label: 'Funnel Analysis', count: 687, percent: 5 },
];

const userJourneyData = [
  { label: 'Homepage → Dashboard', count: 8234, percent: 45 },
  { label: 'Dashboard → Reports', count: 5621, percent: 31 },
  { label: 'Reports → Export', count: 2847, percent: 16 },
  { label: 'Settings → Integrations', count: 1523, percent: 8 },
];

const retentionCohortData = [
  { label: 'Week 1 (Dec 1-7)', count: 89, percent: 89 },
  { label: 'Week 2 (Nov 24-30)', count: 76, percent: 76 },
  { label: 'Week 3 (Nov 17-23)', count: 68, percent: 68 },
  { label: 'Week 4 (Nov 10-16)', count: 62, percent: 62 },
  { label: 'Week 5 (Nov 3-9)', count: 58, percent: 58 },
];

const deviceBreakdown = {
  labels: ['Desktop', 'Mobile', 'Tablet'],
  datasets: [{
    data: [68, 24, 8],
    backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2]],
    borderWidth: 0,
  }],
};

const sessionDurationData = {
  labels: ['0-30s', '30s-2m', '2-5m', '5-10m', '10m+'],
  datasets: [{
    data: [15, 28, 32, 18, 7],
    backgroundColor: CHART_COLORS.slice(0, 5),
    borderWidth: 0,
  }],
};

function ProductAnalyticsDashboard() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const primaryColor = useDynamicColor('pa-primary-color', {
    default: '#2680eb',
    label: 'Primary Color',
    group: 'Colors',
  });

  const accentColor = useDynamicColor('pa-accent-color', {
    default: '#9256d9',
    label: 'Accent Color',
    group: 'Colors',
  });

  const chartHeight = useDynamicNumber('pa-chart-height', {
    default: 300,
    min: 200,
    max: 500,
    label: 'Chart Height',
    group: 'Layout',
  });

  const showPercentages = useDynamicBoolean('pa-show-percentages', {
    default: true,
    label: 'Show Percentages',
    group: 'Display',
  });

  const compactMode = useDynamicBoolean('pa-compact-mode', {
    default: false,
    label: 'Compact Mode',
    group: 'Layout',
  });

  const cardSpacing = useDynamicNumber('pa-card-spacing', {
    default: 6,
    min: 2,
    max: 10,
    label: 'Card Spacing',
    group: 'Layout',
  });

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 13);
  const maxDate = new Date();

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // User engagement time series chart data
  const engagementChartData = useMemo(() => {
    const primaryCol = colord(primaryColor);
    const accentCol = colord(accentColor);

    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Sessions',
          data: engagementSessions,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: primaryCol.alpha(0.6).toRgbString(),
          borderColor: primaryCol.alpha(0.9).toRgbString(),
          hoverBackgroundColor: primaryCol.alpha(0.9).toRgbString(),
          order: 2,
        },
        {
          type: 'bar' as const,
          label: 'Pageviews',
          data: engagementPageviews,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: accentCol.alpha(0.4).toRgbString(),
          borderColor: accentCol.alpha(0.7).toRgbString(),
          hoverBackgroundColor: accentCol.alpha(0.7).toRgbString(),
          order: 1,
        },
      ],
    };
  }, [primaryColor, accentColor]);

  const metricsSpacing = compactMode ? '4' : cardSpacing.toString();

  return (
    <PageBody>
      <Column gap={metricsSpacing as any}>
        <PageHeader
          title="Product Analytics"
          description="User engagement metrics and behavior patterns"
        />

        {/* Key Metrics */}
        <MetricsBar gap={metricsSpacing as any}>
          <MetricCard
            label="Daily Active Users"
            value={12847}
            change={11234}
            showChange={true}
            formatValue={formatLongNumber}
          />
          <MetricCard
            label="Avg. Session Duration"
            value={342}
            change={298}
            showChange={true}
            formatValue={(v) => formatShortTime(v, ['m', 's'], ' ')}
          />
          <MetricCard
            label="Pages per Session"
            value={4.7}
            change={4.2}
            showChange={true}
            formatValue={(v) => v.toFixed(1)}
          />
          <MetricCard
            label="Bounce Rate"
            value={32.4}
            change={35.8}
            showChange={true}
            reverseColors={true}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
          <MetricCard
            label="Feature Adoption"
            value={78.5}
            change={72.3}
            showChange={true}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
        </MetricsBar>

        {/* Engagement Over Time */}
        <Panel title="User Engagement Trends">
          <BarChart
            chartData={engagementChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            renderXLabel={renderXLabel}
            height={`${chartHeight}px`}
          />
        </Panel>

        {/* Feature Usage and User Journey */}
        <GridRow layout="two">
          <Panel title="Feature Usage">
            <ListTable
              data={featureUsageData}
              title="Feature"
              metric="Uses"
              showPercentage={showPercentages}
            />
          </Panel>
          <Panel title="Top User Journeys">
            <ListTable
              data={userJourneyData}
              title="Path"
              metric="Users"
              showPercentage={showPercentages}
            />
          </Panel>
        </GridRow>

        {/* Device and Session Analytics */}
        <GridRow layout="three">
          <Panel title="Device Breakdown">
            <Column alignItems="center" paddingY="4">
              <PieChart
                type="doughnut"
                chartData={deviceBreakdown}
                height="200px"
                width="200px"
              />
            </Column>
          </Panel>
          <Panel title="Session Duration Distribution">
            <Column alignItems="center" paddingY="4">
              <PieChart
                type="pie"
                chartData={sessionDurationData}
                height="200px"
                width="200px"
              />
            </Column>
          </Panel>
          <Panel title="Retention by Cohort">
            <ListTable
              data={retentionCohortData}
              title="Cohort"
              metric="Retained %"
              showPercentage={false}
            />
          </Panel>
        </GridRow>

        {/* Behavior Insights */}
        <Panel title="Behavior Insights">
          <Grid columns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap="4">
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">Power Users (10+ sessions/week)</Text>
              <Text size="6" weight="bold">2,341</Text>
              <Text size="1" color="muted">18.2% of total users</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">Feature Discovery Rate</Text>
              <Text size="6" weight="bold">67%</Text>
              <Text size="1" color="muted">Users who tried 3+ features</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">Activation Rate</Text>
              <Text size="6" weight="bold">84%</Text>
              <Text size="1" color="muted">Completed onboarding</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">Time to First Value</Text>
              <Text size="6" weight="bold">4.2 min</Text>
              <Text size="1" color="muted">Avg. time to key action</Text>
            </Column>
          </Grid>
        </Panel>
      </Column>
      <DialsOverlay position="bottom-right" />
    </PageBody>
  );
}

export default function ProductAnalyticsPage() {
  return (
    <DialsProvider projectId="product-analytics">
      <ProductAnalyticsDashboard />
    </DialsProvider>
  );
}
