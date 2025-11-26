'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Heading, Text, Box, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicBoolean,
  useDynamicNumber,
  useDynamicSpacing,
} from '@niteshift/dials';

// Generate realistic dates for the past 30 days
function generateDates(days: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
}

// Generate realistic engagement data with seasonal patterns
function generateEngagementData(dates: Date[]) {
  return dates.map((date) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseViews = isWeekend ? 8500 : 12500;
    const baseSessions = isWeekend ? 4200 : 6800;
    const variance = Math.random() * 0.3 - 0.15;

    return {
      date: date.toISOString(),
      views: Math.round(baseViews * (1 + variance)),
      sessions: Math.round(baseSessions * (1 + variance)),
    };
  });
}

// Mock data for user behavior flows
const userFlowData = [
  { path: '/home', views: 45230, bounceRate: 32, avgTime: 45 },
  { path: '/products', views: 32180, bounceRate: 28, avgTime: 120 },
  { path: '/products/[id]', views: 28450, bounceRate: 18, avgTime: 180 },
  { path: '/cart', views: 12340, bounceRate: 45, avgTime: 90 },
  { path: '/checkout', views: 8920, bounceRate: 12, avgTime: 240 },
  { path: '/account', views: 6780, bounceRate: 22, avgTime: 65 },
  { path: '/blog', views: 5430, bounceRate: 55, avgTime: 210 },
  { path: '/support', views: 3210, bounceRate: 38, avgTime: 145 },
];

// Mock data for feature adoption
const featureAdoptionData = [
  { feature: 'Search', adoption: 78, trend: 5 },
  { feature: 'Filters', adoption: 65, trend: 12 },
  { feature: 'Wishlist', adoption: 42, trend: -3 },
  { feature: 'Compare', adoption: 28, trend: 8 },
  { feature: 'Reviews', adoption: 89, trend: 2 },
  { feature: 'Quick View', adoption: 51, trend: 15 },
];

// Mock retention cohort data
const retentionCohorts = [
  { week: 'Week 1', day1: 100, day7: 42, day14: 28, day30: 18 },
  { week: 'Week 2', day1: 100, day7: 45, day14: 31, day30: 21 },
  { week: 'Week 3', day1: 100, day7: 48, day14: 33, day30: 22 },
  { week: 'Week 4', day1: 100, day7: 52, day14: 36, day30: 25 },
];

// Device breakdown data
const deviceBreakdown = [
  { device: 'Desktop', value: 42 },
  { device: 'Mobile', value: 48 },
  { device: 'Tablet', value: 10 },
];

// Session depth data
const sessionDepthData = [
  { depth: '1 page', sessions: 12450 },
  { depth: '2-3 pages', sessions: 18320 },
  { depth: '4-6 pages', sessions: 8940 },
  { depth: '7-10 pages', sessions: 3210 },
  { depth: '10+ pages', sessions: 1280 },
];

export default function ProductAnalyticsPage() {
  // Layout dials
  const layoutStyle = useDynamicVariant('pa-layout-style', {
    label: 'Layout Style',
    description: 'Overall layout arrangement',
    default: 'standard',
    options: ['standard', 'compact', 'expanded'] as const,
    group: 'Layout',
  });

  const metricsColumns = useDynamicVariant('pa-metrics-columns', {
    label: 'Metrics Columns',
    description: 'Number of columns in metrics bar',
    default: '5',
    options: ['4', '5', '6'] as const,
    group: 'Layout',
  });

  const showRetention = useDynamicBoolean('pa-show-retention', {
    label: 'Show Retention',
    description: 'Display retention cohort table',
    default: true,
    group: 'Sections',
  });

  const showFeatureAdoption = useDynamicBoolean('pa-show-feature-adoption', {
    label: 'Show Feature Adoption',
    description: 'Display feature adoption metrics',
    default: true,
    group: 'Sections',
  });

  // Color dials
  const primaryChartColor = useDynamicColor('pa-primary-chart-color', {
    label: 'Primary Chart Color',
    description: 'Main color for charts',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#3e63dd'],
    allowCustom: true,
    group: 'Colors',
  });

  const secondaryChartColor = useDynamicColor('pa-secondary-chart-color', {
    label: 'Secondary Chart Color',
    description: 'Secondary color for charts',
    default: '#9256d9',
    options: ['#9256d9', '#44b556', '#e68619', '#01bad7', '#ec1562'],
    allowCustom: true,
    group: 'Colors',
  });

  const accentColor = useDynamicColor('pa-accent-color', {
    label: 'Accent Color',
    description: 'Accent highlights',
    default: '#44b556',
    options: ['#44b556', '#e68619', '#01bad7', '#f7bd12', '#ec1562'],
    allowCustom: true,
    group: 'Colors',
  });

  // Typography dials
  const headingSize = useDynamicVariant('pa-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '4',
    options: ['3', '4', '5'] as const,
    group: 'Typography',
  });

  const metricValueSize = useDynamicVariant('pa-metric-value-size', {
    label: 'Metric Value Size',
    description: 'Size of metric values',
    default: '8',
    options: ['6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  // Spacing dials
  const sectionGap = useDynamicSpacing('pa-section-gap', {
    label: 'Section Gap',
    description: 'Space between sections',
    default: '24px',
    options: ['16px', '24px', '32px', '40px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('pa-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts',
    default: 350,
    min: 250,
    max: 500,
    step: 50,
    unit: 'px',
    group: 'Visualization',
  });

  // Generate chart data
  const dates = useMemo(() => generateDates(30), []);
  const engagementData = useMemo(() => generateEngagementData(dates), [dates]);

  const engagementChartData = useMemo(() => {
    return {
      labels: engagementData.map((d) => d.date),
      datasets: [
        {
          label: 'Page Views',
          data: engagementData.map((d) => ({
            x: d.date,
            y: d.views,
          })),
          backgroundColor: primaryChartColor,
          borderColor: primaryChartColor,
          borderWidth: 0,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
        {
          label: 'Sessions',
          data: engagementData.map((d) => ({
            x: d.date,
            y: d.sessions,
          })),
          backgroundColor: secondaryChartColor,
          borderColor: secondaryChartColor,
          borderWidth: 0,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    };
  }, [engagementData, primaryChartColor, secondaryChartColor]);

  const deviceChartData = useMemo(() => {
    return {
      labels: deviceBreakdown.map((d) => d.device),
      datasets: [
        {
          data: deviceBreakdown.map((d) => d.value),
          backgroundColor: [primaryChartColor, secondaryChartColor, accentColor],
          borderWidth: 0,
        },
      ],
    };
  }, [primaryChartColor, secondaryChartColor, accentColor]);

  const sessionDepthChartData = useMemo(() => {
    return {
      labels: sessionDepthData.map((d) => d.depth),
      datasets: [
        {
          label: 'Sessions',
          data: sessionDepthData.map((d, i) => ({
            x: d.depth,
            y: d.sessions,
          })),
          backgroundColor: CHART_COLORS.slice(0, 5),
          borderWidth: 0,
        },
      ],
    };
  }, []);

  // Calculate summary metrics
  const totalViews = engagementData.reduce((sum, d) => sum + d.views, 0);
  const totalSessions = engagementData.reduce((sum, d) => sum + d.sessions, 0);
  const avgSessionDuration = 186; // seconds
  const bounceRate = 34.2;
  const pagesPerSession = 4.2;

  const gapStyle = { gap: sectionGap };

  return (
    <Column style={gapStyle} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="6">Product Analytics</Heading>
          <Text color="muted">User engagement metrics and behavior patterns</Text>
        </Column>
        <Text color="muted" size="1">Last 30 days</Text>
      </Row>

      {/* Key Metrics Bar */}
      <MetricsBar>
        <MetricCard
          label="Total Page Views"
          value={totalViews}
          change={totalViews * 0.92}
          formatValue={formatLongNumber}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Unique Sessions"
          value={totalSessions}
          change={totalSessions * 0.88}
          formatValue={formatLongNumber}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Avg. Session Duration"
          value={avgSessionDuration}
          change={172}
          formatValue={(v) => formatShortTime(v, ['m', 's'])}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Bounce Rate"
          value={bounceRate}
          change={36.8}
          formatValue={(v) => `${v.toFixed(1)}%`}
          showChange
          showLabel
          reverseColors
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Pages / Session"
          value={pagesPerSession}
          change={3.9}
          formatValue={(v) => v.toFixed(1)}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
      </MetricsBar>

      {/* Engagement Trend Chart */}
      <Panel>
        <Heading size={headingSize as any}>Engagement Trends</Heading>
        <Box height={`${chartHeight}px`}>
          <BarChart
            chartData={engagementChartData}
            unit="day"
            stacked={false}
            minDate={dates[0]}
            maxDate={dates[dates.length - 1]}
            height={`${chartHeight}px`}
          />
        </Box>
      </Panel>

      {/* Two-column layout */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        {/* User Flow Analysis */}
        <Panel>
          <Heading size={headingSize as any}>Top Pages by Views</Heading>
          <Column gap="2">
            {userFlowData.slice(0, 6).map((page, index) => (
              <Row key={page.path} justifyContent="space-between" alignItems="center" paddingY="2">
                <Row gap="3" alignItems="center">
                  <Text size="1" color="muted" style={{ width: '20px' }}>{index + 1}</Text>
                  <Text size="2">{page.path}</Text>
                </Row>
                <Row gap="4" alignItems="center">
                  <Text size="2" weight="bold">{formatLongNumber(page.views)}</Text>
                  <Box
                    style={{
                      width: '60px',
                      height: '6px',
                      backgroundColor: '#e5e5e5',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      style={{
                        width: `${(page.views / userFlowData[0].views) * 100}%`,
                        height: '100%',
                        backgroundColor: primaryChartColor,
                        borderRadius: '3px'
                      }}
                    />
                  </Box>
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Device Breakdown */}
        <Panel>
          <Heading size={headingSize as any}>Device Distribution</Heading>
          <Row alignItems="center" gap="6">
            <Box height="200px" width="200px">
              <PieChart type="doughnut" chartData={deviceChartData} height="200px" />
            </Box>
            <Column gap="3">
              {deviceBreakdown.map((device, index) => (
                <Row key={device.device} gap="3" alignItems="center">
                  <Box
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      backgroundColor: [primaryChartColor, secondaryChartColor, accentColor][index]
                    }}
                  />
                  <Text size="2">{device.device}</Text>
                  <Text size="2" weight="bold">{device.value}%</Text>
                </Row>
              ))}
            </Column>
          </Row>
        </Panel>
      </Grid>

      {/* Feature Adoption */}
      {showFeatureAdoption && (
        <Panel>
          <Heading size={headingSize as any}>Feature Adoption</Heading>
          <Grid columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap="4">
            {featureAdoptionData.map((feature) => (
              <Column
                key={feature.feature}
                padding="4"
                border
                borderRadius="2"
                gap="2"
              >
                <Row justifyContent="space-between" alignItems="center">
                  <Text size="2" weight="medium">{feature.feature}</Text>
                  <Text
                    size="1"
                    style={{
                      color: feature.trend >= 0 ? '#44b556' : '#e34850'
                    }}
                  >
                    {feature.trend >= 0 ? '+' : ''}{feature.trend}%
                  </Text>
                </Row>
                <Text size="5" weight="bold">{feature.adoption}%</Text>
                <Box
                  style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: '#e5e5e5',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    style={{
                      width: `${feature.adoption}%`,
                      height: '100%',
                      backgroundColor: primaryChartColor,
                      borderRadius: '2px'
                    }}
                  />
                </Box>
              </Column>
            ))}
          </Grid>
        </Panel>
      )}

      {/* Session Depth & Retention */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        {/* Session Depth */}
        <Panel>
          <Heading size={headingSize as any}>Session Depth</Heading>
          <Box height="250px">
            <Chart
              type="bar"
              chartData={sessionDepthChartData}
              height="250px"
              chartOptions={{
                scales: {
                  x: { type: 'category' },
                  y: { beginAtZero: true }
                }
              }}
            />
          </Box>
        </Panel>

        {/* Retention Cohorts */}
        {showRetention && (
          <Panel>
            <Heading size={headingSize as any}>Retention Cohorts</Heading>
            <Column gap="1">
              <Row gap="3" paddingY="2" style={{ borderBottom: '1px solid #e5e5e5' }}>
                <Text size="1" weight="bold" style={{ width: '80px' }}>Cohort</Text>
                <Text size="1" weight="bold" style={{ width: '60px', textAlign: 'center' }}>Day 1</Text>
                <Text size="1" weight="bold" style={{ width: '60px', textAlign: 'center' }}>Day 7</Text>
                <Text size="1" weight="bold" style={{ width: '60px', textAlign: 'center' }}>Day 14</Text>
                <Text size="1" weight="bold" style={{ width: '60px', textAlign: 'center' }}>Day 30</Text>
              </Row>
              {retentionCohorts.map((cohort) => (
                <Row key={cohort.week} gap="3" paddingY="2">
                  <Text size="2" style={{ width: '80px' }}>{cohort.week}</Text>
                  <Text size="2" style={{ width: '60px', textAlign: 'center' }}>{cohort.day1}%</Text>
                  <Box style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                    <Box
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `rgba(68, 181, 86, ${cohort.day7 / 100})`
                      }}
                    >
                      <Text size="2">{cohort.day7}%</Text>
                    </Box>
                  </Box>
                  <Box style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                    <Box
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `rgba(68, 181, 86, ${cohort.day14 / 100})`
                      }}
                    >
                      <Text size="2">{cohort.day14}%</Text>
                    </Box>
                  </Box>
                  <Box style={{ width: '60px', display: 'flex', justifyContent: 'center' }}>
                    <Box
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `rgba(68, 181, 86, ${cohort.day30 / 100})`
                      }}
                    >
                      <Text size="2">{cohort.day30}%</Text>
                    </Box>
                  </Box>
                </Row>
              ))}
            </Column>
          </Panel>
        )}
      </Grid>
    </Column>
  );
}
