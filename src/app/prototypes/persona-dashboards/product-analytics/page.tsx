'use client';

import { useMemo, useState, useEffect } from 'react';
import { Column, Grid, Row, Text, Heading, Box, Loading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import {
  useDynamicColor,
  useDynamicVariant,
  useDynamicNumber,
  useDynamicBoolean,
  DialsProvider,
  DialsOverlay,
} from '@niteshift/dials';

// Generate mock time series data for engagement
function generateEngagementData(days: number = 30) {
  const data: { x: Date; y: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Use actual Date objects for timeseries charts
    const dateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    // Simulate realistic engagement patterns with weekly cycles
    const dayOfWeek = date.getDay();
    const baseValue = 2500 + Math.sin(i * 0.3) * 500;
    const weekendDip = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
    const randomVariation = 0.85 + Math.random() * 0.3;
    data.push({
      x: dateObj,
      y: Math.round(baseValue * weekendDip * randomVariation),
    });
  }
  return data;
}

function generateSessionDurationData() {
  return [
    { label: '0-30 seconds', count: 8234, percent: 28 },
    { label: '30s - 2 minutes', count: 12456, percent: 42 },
    { label: '2-5 minutes', count: 5678, percent: 19 },
    { label: '5-15 minutes', count: 2345, percent: 8 },
    { label: '15+ minutes', count: 891, percent: 3 },
  ];
}

function generateFeatureUsageData() {
  return [
    { label: 'Dashboard Overview', count: 45678, percent: 32 },
    { label: 'Reports & Analytics', count: 34567, percent: 24 },
    { label: 'User Management', count: 23456, percent: 17 },
    { label: 'Settings & Config', count: 18234, percent: 13 },
    { label: 'API Integration', count: 12345, percent: 9 },
    { label: 'Export & Download', count: 7891, percent: 5 },
  ];
}

function generateUserCohortData() {
  return [
    { label: 'Power Users (>20 sessions/week)', count: 3456, percent: 12 },
    { label: 'Regular Users (5-20 sessions/week)', count: 12345, percent: 41 },
    { label: 'Casual Users (1-5 sessions/week)', count: 9876, percent: 33 },
    { label: 'Dormant Users (<1 session/week)', count: 4321, percent: 14 },
  ];
}

function generateRetentionData() {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'];
  return weeks.map((week, i) => ({
    x: week,
    y: Math.round(100 * Math.pow(0.88, i)),
  }));
}

function generateEventFunnelData() {
  return [
    { label: 'Page View', count: 125000, percent: 100 },
    { label: 'Feature Clicked', count: 87500, percent: 70 },
    { label: 'Action Started', count: 52500, percent: 42 },
    { label: 'Action Completed', count: 31500, percent: 25 },
    { label: 'Converted', count: 15750, percent: 13 },
  ];
}

function ProductAnalyticsDashboardContent() {
  // Client-side only rendering to avoid SSR date issues
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dials for customization
  const primaryColor = useDynamicColor('pa-primary-color', {
    label: 'Primary Chart Color',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#01bad7'],
    group: 'Colors',
  });

  const secondaryColor = useDynamicColor('pa-secondary-color', {
    label: 'Secondary Chart Color',
    default: '#9256d9',
    options: ['#9256d9', '#44b556', '#e68619', '#e34850', '#2680eb', '#01bad7'],
    group: 'Colors',
  });

  const accentColor = useDynamicColor('pa-accent-color', {
    label: 'Accent Color',
    default: '#44b556',
    options: ['#44b556', '#e68619', '#e34850', '#2680eb', '#9256d9', '#01bad7'],
    group: 'Colors',
  });

  const layout = useDynamicVariant('pa-layout', {
    label: 'Dashboard Layout',
    default: 'standard',
    options: ['standard', 'compact', 'wide'] as const,
    group: 'Layout',
  });

  const chartStyle = useDynamicVariant('pa-chart-style', {
    label: 'Chart Style',
    default: 'rounded',
    options: ['rounded', 'sharp', 'gradient'] as const,
    group: 'Visualization',
  });

  const showTrends = useDynamicBoolean('pa-show-trends', {
    label: 'Show Trend Indicators',
    default: true,
    group: 'Display',
  });

  const metricSize = useDynamicVariant('pa-metric-size', {
    label: 'Metric Card Size',
    default: '8',
    options: ['6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  const panelSpacing = useDynamicNumber('pa-panel-spacing', {
    label: 'Panel Spacing',
    default: 3,
    min: 1,
    max: 6,
    step: 1,
    group: 'Spacing',
  });

  // Mock data
  const engagementData = useMemo(() => generateEngagementData(30), []);
  const sessionDurationData = useMemo(() => generateSessionDurationData(), []);
  const featureUsageData = useMemo(() => generateFeatureUsageData(), []);
  const userCohortData = useMemo(() => generateUserCohortData(), []);
  const retentionData = useMemo(() => generateRetentionData(), []);
  const funnelData = useMemo(() => generateEventFunnelData(), []);

  // Prepare chart data
  const engagementChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Daily Active Users',
        data: engagementData,
        backgroundColor: primaryColor + '99',
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: chartStyle === 'rounded' ? 4 : 0,
      },
    ],
  }), [engagementData, primaryColor, chartStyle]);

  const retentionChartData = useMemo(() => ({
    labels: retentionData.map(d => d.x),
    datasets: [
      {
        type: 'line' as const,
        label: 'User Retention %',
        data: retentionData.map(d => d.y),
        backgroundColor: secondaryColor + '33',
        borderColor: secondaryColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  }), [retentionData, secondaryColor]);

  const cohortPieData = useMemo(() => ({
    labels: userCohortData.map(d => d.label),
    datasets: [
      {
        data: userCohortData.map(d => d.count),
        backgroundColor: [primaryColor, secondaryColor, accentColor, '#e68619'],
        borderWidth: 0,
      },
    ],
  }), [userCohortData, primaryColor, secondaryColor, accentColor]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return d;
  }, []);
  const maxDate = useMemo(() => new Date(), []);

  const gridGap = `${panelSpacing}` as any;

  if (!isClient) {
    return (
      <Column padding="6" width="100%" maxWidth="1400px" alignItems="center" justifyContent="center" minHeight="400px">
        <Loading />
      </Column>
    );
  }

  return (
    <Column gap={gridGap} padding="6" width="100%" maxWidth="1400px">
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="5">Product Analytics Dashboard</Heading>
          <Text color="muted">User engagement and behavior insights</Text>
        </Column>
        <Text color="muted" size="1">Last 30 days</Text>
      </Row>

      {/* Key Metrics Bar */}
      <MetricsBar>
        <MetricCard
          value={29834}
          change={showTrends ? 2341 : 0}
          label="Daily Active Users"
          formatValue={formatLongNumber}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={142567}
          change={showTrends ? 12456 : 0}
          label="Total Sessions"
          formatValue={formatLongNumber}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={4.8}
          change={showTrends ? 0.3 : 0}
          label="Sessions per User"
          formatValue={(n) => n.toFixed(1)}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={234}
          change={showTrends ? 18 : 0}
          label="Avg Session Duration"
          formatValue={(n) => formatShortTime(n, ['m', 's'], ' ')}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={68.5}
          change={showTrends ? -2.3 : 0}
          label="Feature Adoption %"
          formatValue={(n) => `${n.toFixed(1)}%`}
          showChange={showTrends}
          reverseColors={true}
          valueSize={metricSize as any}
        />
      </MetricsBar>

      {/* Main Charts Row */}
      <Grid columns={{ xs: '1fr', lg: layout === 'wide' ? '1fr' : '2fr 1fr' }} gap={gridGap}>
        <Panel title="Daily Active Users">
          <BarChart
            chartData={engagementChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            height="300px"
          />
        </Panel>

        <Panel title="User Cohorts">
          <PieChart
            type="doughnut"
            chartData={cohortPieData}
            height="300px"
          />
        </Panel>
      </Grid>

      {/* Secondary Row */}
      <Grid columns={{ xs: '1fr', md: layout === 'compact' ? '1fr' : 'repeat(2, 1fr)' }} gap={gridGap}>
        <Panel title="Session Duration Distribution">
          <ListTable
            data={sessionDurationData}
            title="Duration Range"
            metric="Sessions"
          />
        </Panel>

        <Panel title="Feature Usage">
          <ListTable
            data={featureUsageData}
            title="Feature"
            metric="Interactions"
          />
        </Panel>
      </Grid>

      {/* Retention & Funnel Row */}
      <Grid columns={{ xs: '1fr', lg: 'repeat(2, 1fr)' }} gap={gridGap}>
        <Panel title="Weekly Retention Curve">
          <BarChart
            chartData={retentionChartData}
            XAxisType="category"
            height="250px"
            renderYLabel={(label) => `${label}%`}
            minDate={new Date()}
            maxDate={new Date()}
          />
        </Panel>

        <Panel title="Conversion Funnel">
          <Column gap="2">
            {funnelData.map((step, index) => (
              <Row key={step.label} alignItems="center" gap="3">
                <Box width="120px">
                  <Text size="1" truncate>{step.label}</Text>
                </Box>
                <Box flex="1" height="24px" backgroundColor="2" borderRadius="2" overflow="hidden">
                  <Box
                    height="100%"
                    width={`${step.percent}%`}
                    backgroundColor={primaryColor}
                    style={{
                      background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                      opacity: 1 - (index * 0.15),
                    }}
                  />
                </Box>
                <Box width="80px" textAlign="right">
                  <Text size="1" weight="bold">{formatLongNumber(step.count)}</Text>
                </Box>
                <Box width="40px" textAlign="right">
                  <Text size="0" color="muted">{step.percent}%</Text>
                </Box>
              </Row>
            ))}
          </Column>
        </Panel>
      </Grid>

      {/* Bottom Insights */}
      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={gridGap}>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="2">Top Engagement Day</Text>
            <Text size="5" weight="bold" style={{ color: primaryColor }}>Tuesday</Text>
            <Text color="muted" size="1">32% higher than average</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="2">Peak Usage Hours</Text>
            <Text size="5" weight="bold" style={{ color: secondaryColor }}>2-4 PM</Text>
            <Text color="muted" size="1">EST timezone</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="2">Stickiness Ratio</Text>
            <Text size="5" weight="bold" style={{ color: accentColor }}>42%</Text>
            <Text color="muted" size="1">DAU/MAU ratio</Text>
          </Column>
        </Panel>
      </Grid>
    </Column>
  );
}

export default function ProductAnalyticsDashboard() {
  return (
    <DialsProvider projectId="product-analytics">
      <ProductAnalyticsDashboardContent />
      <DialsOverlay position="bottom-left" />
    </DialsProvider>
  );
}
