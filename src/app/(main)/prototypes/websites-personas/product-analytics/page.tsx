'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Text, Box, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { ListTable } from '@/components/metrics/ListTable';
import { Chart } from '@/components/charts/Chart';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { CHART_COLORS } from '@/lib/constants';
import { formatLongNumber } from '@/lib/format';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicBoolean,
} from '@niteshift/dials';

// Generate 30 days of realistic time series data
const generateTimeSeriesData = () => {
  const data: { x: Date; y: number }[] = [];
  const baseDate = new Date('2024-11-03');

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);

    // Simulate DAU with weekly patterns (lower on weekends)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? 2800 : 4200;
    const variance = Math.floor(Math.random() * 600) - 300;

    data.push({
      x: date,
      y: baseValue + variance + (i * 15), // Slight upward trend
    });
  }
  return data;
};

const dauData = generateTimeSeriesData();

// Funnel data - realistic conversion funnel
const funnelStages = [
  { stage: 'Visited Homepage', users: 48250, percent: 100 },
  { stage: 'Signed Up', users: 31362, percent: 65 },
  { stage: 'Completed Onboarding', users: 19300, percent: 40 },
  { stage: 'First Key Action', users: 12062, percent: 25 },
  { stage: 'Power User (7+ actions)', users: 5790, percent: 12 },
];

// Feature adoption data
const featureAdoption = [
  { label: 'Dashboard Overview', count: 38420, percent: 82 },
  { label: 'Custom Reports', count: 21090, percent: 45 },
  { label: 'Team Collaboration', count: 16380, percent: 35 },
  { label: 'API Integration', count: 9360, percent: 20 },
  { label: 'Advanced Filtering', count: 7020, percent: 15 },
  { label: 'Export to CSV', count: 6084, percent: 13 },
  { label: 'Scheduled Reports', count: 4680, percent: 10 },
];

// Session depth data
const sessionDepthData = [
  { label: '1 page', count: 12450, percent: 26 },
  { label: '2-3 pages', count: 15280, percent: 32 },
  { label: '4-6 pages', count: 11400, percent: 24 },
  { label: '7-10 pages', count: 5700, percent: 12 },
  { label: '11+ pages', count: 2850, percent: 6 },
];

// User cohort breakdown
const cohortData = {
  labels: ['New Users', 'Returning (Week 1)', 'Returning (Week 2-4)', 'Power Users', 'Dormant'],
  datasets: [{
    data: [28, 22, 31, 12, 7],
    backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3], CHART_COLORS[4]],
  }],
};

// Weekly retention cohorts
const retentionCohorts = [
  { week: 'Nov 4', users: 4820, w1: 68, w2: 52, w3: 41, w4: 35 },
  { week: 'Nov 11', users: 5140, w1: 71, w2: 55, w3: 44, w4: null },
  { week: 'Nov 18', users: 4950, w1: 69, w2: 51, w3: null, w4: null },
  { week: 'Nov 25', users: 5380, w1: 72, w2: null, w3: null, w4: null },
];

// Peak usage hours (24h distribution)
const hourlyUsage = Array.from({ length: 24 }, (_, hour) => {
  // Simulate realistic usage pattern: low at night, peaks at 10am and 3pm
  let intensity = 0;
  if (hour >= 0 && hour < 6) intensity = 15 + Math.random() * 10;
  else if (hour >= 6 && hour < 9) intensity = 40 + Math.random() * 15;
  else if (hour >= 9 && hour < 12) intensity = 85 + Math.random() * 15;
  else if (hour >= 12 && hour < 14) intensity = 65 + Math.random() * 15;
  else if (hour >= 14 && hour < 17) intensity = 90 + Math.random() * 10;
  else if (hour >= 17 && hour < 20) intensity = 55 + Math.random() * 15;
  else intensity = 25 + Math.random() * 10;

  return { hour, intensity: Math.round(intensity) };
});

// Top user paths
const userPaths = [
  { label: 'Dashboard -> Reports -> Export', count: 8420, percent: 18 },
  { label: 'Dashboard -> Settings -> Team', count: 6230, percent: 13 },
  { label: 'Login -> Dashboard -> Logout', count: 5840, percent: 12 },
  { label: 'Dashboard -> API Docs -> Dashboard', count: 4650, percent: 10 },
  { label: 'Reports -> Filter -> Share', count: 3920, percent: 8 },
];

// Engagement by device
const deviceEngagement = {
  labels: ['Desktop', 'Mobile', 'Tablet'],
  datasets: [{
    data: [72, 23, 5],
    backgroundColor: [CHART_COLORS[0], CHART_COLORS[2], CHART_COLORS[1]],
  }],
};

export default function ProductAnalyticsDashboard() {
  // === DIALS: Layout & Spacing ===
  const layoutStyle = useDynamicVariant('pa-layout-style', {
    label: 'Layout Style',
    description: 'Overall layout arrangement',
    default: 'default',
    options: ['default', 'compact', 'spacious'] as const,
    group: 'Layout',
  });

  const sectionGap = useDynamicSpacing('pa-section-gap', {
    label: 'Section Gap',
    description: 'Spacing between major sections',
    default: '20px',
    options: ['12px', '16px', '20px', '24px', '32px'],
    group: 'Layout',
  });

  const panelPadding = useDynamicSpacing('pa-panel-padding', {
    label: 'Panel Padding',
    description: 'Internal padding of panels',
    default: '',
    options: ['', '12px', '16px', '20px', '24px'],
    group: 'Layout',
  });

  // === DIALS: Color Palette ===
  const primaryAccent = useDynamicColor('pa-primary-accent', {
    label: 'Primary Accent Color',
    description: 'Main accent color for charts and highlights',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#3e63dd', '#0090ff'],
    allowCustom: true,
    group: 'Colors',
  });

  const heatmapColor = useDynamicColor('pa-heatmap-color', {
    label: 'Heatmap Base Color',
    description: 'Color used in heatmap visualizations',
    default: '38, 128, 235',
    options: ['38, 128, 235', '146, 86, 217', '68, 181, 86', '230, 134, 25', '62, 99, 221'],
    allowCustom: true,
    group: 'Colors',
  });

  // === DIALS: Typography ===
  const headingSize = useDynamicVariant('pa-heading-size', {
    label: 'Section Heading Size',
    description: 'Font size for section headings',
    default: '3',
    options: ['2', '3', '4'] as const,
    group: 'Typography',
  });

  const headingWeight = useDynamicVariant('pa-heading-weight', {
    label: 'Section Heading Weight',
    description: 'Font weight for section headings',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography',
  });

  const metricLabelSize = useDynamicVariant('pa-metric-label-size', {
    label: 'Metric Label Size',
    description: 'Font size for metric card labels',
    default: '',
    options: ['', '0', '1', '2'] as const,
    group: 'Typography',
  });

  // === DIALS: Visualization Options ===
  const chartType = useDynamicVariant('pa-chart-type', {
    label: 'User Segments Chart Type',
    description: 'Visualization style for user segments',
    default: 'doughnut',
    options: ['doughnut', 'pie'] as const,
    group: 'Visualizations',
  });

  const showRetentionTable = useDynamicBoolean('pa-show-retention', {
    label: 'Show Retention Table',
    description: 'Display the weekly retention cohorts',
    default: true,
    group: 'Visualizations',
  });

  const showHeatmap = useDynamicBoolean('pa-show-heatmap', {
    label: 'Show Peak Hours Heatmap',
    description: 'Display the hourly usage heatmap',
    default: true,
    group: 'Visualizations',
  });

  const funnelOrientation = useDynamicVariant('pa-funnel-orientation', {
    label: 'Funnel Orientation',
    description: 'Funnel chart orientation',
    default: 'horizontal',
    options: ['horizontal', 'vertical'] as const,
    group: 'Visualizations',
  });

  // === DIALS: Component Style ===
  const metricCardStyle = useDynamicVariant('pa-metric-card-style', {
    label: 'Metric Card Style',
    description: 'Visual style of metric cards',
    default: 'default',
    options: ['default', 'minimal', 'emphasized'] as const,
    group: 'Components',
  });

  const showPercentages = useDynamicBoolean('pa-show-percentages', {
    label: 'Show Percentages in Tables',
    description: 'Display percentage column in data tables',
    default: true,
    group: 'Components',
  });

  // DAU/MAU chart data
  const engagementChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Daily Active Users',
        data: dauData,
        backgroundColor: primaryAccent,
        borderColor: primaryAccent,
        borderWidth: 1,
      },
    ],
  }), [primaryAccent]);

  // Funnel visualization as horizontal bar chart
  const funnelChartData = useMemo(() => ({
    labels: funnelStages.map(s => s.stage),
    datasets: [{
      label: 'Users',
      data: funnelStages.map(s => s.users),
      backgroundColor: funnelStages.map((_, i) =>
        `rgba(38, 128, 235, ${1 - (i * 0.15)})`
      ),
      borderRadius: 4,
    }],
  }), []);

  const funnelChartOptions = useMemo(() => ({
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        grid: { color: 'var(--border-color)' },
        ticks: { color: 'var(--font-color-muted)' },
      },
      y: {
        grid: { display: false },
        ticks: { color: 'var(--font-color)' },
      },
    },
    plugins: {
      legend: { display: false },
    },
  }), []);

  const gapValue = layoutStyle === 'compact' ? '3' : layoutStyle === 'spacious' ? '6' : '5';

  return (
    <Column
      gap={gapValue as any}
      width="100%"
      maxWidth="1320px"
      paddingX={{ xs: '3', md: '6' }}
      paddingY="6"
      style={{
        margin: '0 auto',
        animation: 'fadeIn 0.4s ease-out',
        ...(sectionGap && { gap: sectionGap }),
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .stagger-1 { animation: slideIn 0.3s ease-out 0.1s both; }
        .stagger-2 { animation: slideIn 0.3s ease-out 0.2s both; }
        .stagger-3 { animation: slideIn 0.3s ease-out 0.3s both; }
        .stagger-4 { animation: slideIn 0.3s ease-out 0.4s both; }
        .heat-cell {
          transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        }
        .heat-cell:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          z-index: 10;
        }
        .retention-cell {
          transition: background-color 0.2s ease;
        }
      `}</style>

      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="1">Product Analytics</Heading>
          <Text color="muted">Understanding user engagement and behavior patterns</Text>
        </Column>
        <Text color="muted" size="1">Last 30 days | Nov 3 - Dec 2, 2024</Text>
      </Row>

      {/* Key Engagement Metrics */}
      <Grid columns={{ xs: '1fr', sm: '1fr 1fr', lg: 'repeat(5, 1fr)' }} gap="3" className="stagger-1">
        <MetricCard
          label="DAU"
          value={4127}
          change={3890}
          showChange
          formatValue={(v) => formatLongNumber(v)}
          {...(metricLabelSize && { labelSize: metricLabelSize as any })}
        />
        <MetricCard
          label="MAU"
          value={46820}
          change={42150}
          showChange
          formatValue={(v) => formatLongNumber(v)}
          {...(metricLabelSize && { labelSize: metricLabelSize as any })}
        />
        <MetricCard
          label="DAU/MAU Ratio"
          value={8.8}
          change={8.2}
          showChange
          formatValue={(v) => `${v.toFixed(1)}%`}
          {...(metricLabelSize && { labelSize: metricLabelSize as any })}
        />
        <MetricCard
          label="Avg Session Depth"
          value={4.2}
          change={3.8}
          showChange
          formatValue={(v) => `${v.toFixed(1)} pages`}
          {...(metricLabelSize && { labelSize: metricLabelSize as any })}
        />
        <MetricCard
          label="Activation Rate"
          value={40}
          change={36}
          showChange
          formatValue={(v) => `${v}%`}
          {...(metricLabelSize && { labelSize: metricLabelSize as any })}
        />
      </Grid>

      {/* Main content grid */}
      <Grid columns={{ xs: '1fr', lg: '2fr 1fr' }} gap="4">
        {/* Left column - Funnel and DAU trend */}
        <Column gap="4">
          {/* Conversion Funnel */}
          <Panel className="stagger-2">
            <Column gap="4">
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text weight={headingWeight} size={headingSize as any}>Conversion Funnel</Text>
                  <Text color="muted" size="1">User progression through key milestones</Text>
                </Column>
              </Row>
              <Box height="280px">
                <Chart
                  type="bar"
                  chartData={funnelChartData}
                  chartOptions={funnelChartOptions}
                />
              </Box>
              {/* Funnel metrics below chart */}
              <Grid columns="repeat(5, 1fr)" gap="2">
                {funnelStages.map((stage, i) => (
                  <Column
                    key={stage.stage}
                    alignItems="center"
                    gap="1"
                    paddingY="2"
                    style={{
                      borderTop: `3px solid rgba(38, 128, 235, ${1 - (i * 0.15)})`,
                    }}
                  >
                    <Text weight="bold" size="3">{stage.percent}%</Text>
                    <Text color="muted" size="0" align="center">{stage.stage}</Text>
                  </Column>
                ))}
              </Grid>
            </Column>
          </Panel>

          {/* DAU Trend */}
          <Panel className="stagger-3">
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text weight={headingWeight} size={headingSize as any}>Daily Active Users Trend</Text>
                  <Text color="muted" size="1">30-day engagement pattern</Text>
                </Column>
              </Row>
              <Box height="240px">
                <BarChart
                  chartData={engagementChartData}
                  unit="day"
                  minDate={new Date('2024-11-03')}
                  maxDate={new Date('2024-12-02')}
                />
              </Box>
            </Column>
          </Panel>
        </Column>

        {/* Right column - Cohorts and device breakdown */}
        <Column gap="4">
          {/* User Cohort Breakdown */}
          <Panel className="stagger-2">
            <Column gap="3">
              <Text weight={headingWeight} size={headingSize as any}>User Segments</Text>
              <Box height="200px">
                <PieChart
                  type={chartType}
                  chartData={cohortData}
                />
              </Box>
            </Column>
          </Panel>

          {/* Device Engagement */}
          <Panel className="stagger-3">
            <Column gap="3">
              <Text weight={headingWeight} size={headingSize as any}>Engagement by Device</Text>
              <Box height="180px">
                <PieChart
                  type="doughnut"
                  chartData={deviceEngagement}
                />
              </Box>
            </Column>
          </Panel>
        </Column>
      </Grid>

      {/* Second row - Feature adoption and session depth */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
        {/* Feature Adoption */}
        <Panel className="stagger-3" {...(panelPadding && { style: { padding: panelPadding } })}>
          <ListTable
            title="Feature Adoption"
            metric="Users"
            data={featureAdoption}
            showPercentage={showPercentages}
          />
        </Panel>

        {/* Session Depth */}
        <Panel className="stagger-3" {...(panelPadding && { style: { padding: panelPadding } })}>
          <ListTable
            title="Session Depth Distribution"
            metric="Sessions"
            data={sessionDepthData}
            showPercentage={showPercentages}
          />
        </Panel>
      </Grid>

      {/* Third row - Retention and Peak Hours */}
      <Grid columns={{ xs: '1fr', lg: '3fr 2fr' }} gap="4">
        {/* Retention Cohorts Table */}
        {showRetentionTable && (
        <Panel className="stagger-4">
          <Column gap="4">
            <Column gap="1">
              <Text weight={headingWeight} size={headingSize as any}>Weekly Retention Cohorts</Text>
              <Text color="muted" size="1">Percentage of users returning each week</Text>
            </Column>
            <Box style={{ overflowX: 'auto' }}>
              <Grid
                columns="120px 80px repeat(4, 1fr)"
                gap="1"
                style={{ minWidth: '500px' }}
              >
                {/* Header row */}
                <Text weight="bold" size="1" color="muted">Cohort</Text>
                <Text weight="bold" size="1" color="muted" align="right">Users</Text>
                <Text weight="bold" size="1" color="muted" align="center">Week 1</Text>
                <Text weight="bold" size="1" color="muted" align="center">Week 2</Text>
                <Text weight="bold" size="1" color="muted" align="center">Week 3</Text>
                <Text weight="bold" size="1" color="muted" align="center">Week 4</Text>

                {/* Data rows */}
                {retentionCohorts.map((cohort) => (
                  <>
                    <Text size="2">{cohort.week}</Text>
                    <Text size="2" align="right">{formatLongNumber(cohort.users)}</Text>
                    {[cohort.w1, cohort.w2, cohort.w3, cohort.w4].map((value, i) => (
                      <Row
                        key={i}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius="2"
                        paddingY="2"
                        className="retention-cell"
                        style={{
                          backgroundColor: value !== null
                            ? `rgba(38, 128, 235, ${(value / 100) * 0.6 + 0.1})`
                            : 'var(--base-color-2)',
                          color: value !== null && value > 50 ? 'white' : 'inherit',
                        }}
                      >
                        <Text size="2" weight={value !== null && value > 60 ? 'bold' : 'normal'}>
                          {value !== null ? `${value}%` : '-'}
                        </Text>
                      </Row>
                    ))}
                  </>
                ))}
              </Grid>
            </Box>
          </Column>
        </Panel>
        )}

        {/* Peak Usage Hours */}
        {showHeatmap && (
        <Panel className="stagger-4">
          <Column gap="4">
            <Column gap="1">
              <Text weight={headingWeight} size={headingSize as any}>Peak Usage Hours</Text>
              <Text color="muted" size="1">Activity intensity by hour (UTC)</Text>
            </Column>
            <Grid columns="repeat(12, 1fr)" gap="1">
              {hourlyUsage.slice(0, 12).map((h) => (
                <Column key={h.hour} alignItems="center" gap="1">
                  <Box
                    width="100%"
                    height="60px"
                    borderRadius="2"
                    className="heat-cell"
                    style={{
                      backgroundColor: `rgba(${heatmapColor}, ${h.intensity / 100})`,
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    title={`${h.hour}:00 - ${h.intensity}% activity`}
                  />
                  <Text size="0" color="muted">{h.hour}</Text>
                </Column>
              ))}
            </Grid>
            <Grid columns="repeat(12, 1fr)" gap="1">
              {hourlyUsage.slice(12, 24).map((h) => (
                <Column key={h.hour} alignItems="center" gap="1">
                  <Box
                    width="100%"
                    height="60px"
                    borderRadius="2"
                    className="heat-cell"
                    style={{
                      backgroundColor: `rgba(${heatmapColor}, ${h.intensity / 100})`,
                      cursor: 'pointer',
                    }}
                    title={`${h.hour}:00 - ${h.intensity}% activity`}
                  />
                  <Text size="0" color="muted">{h.hour}</Text>
                </Column>
              ))}
            </Grid>
            <Row justifyContent="space-between" paddingX="2">
              <Row gap="2" alignItems="center">
                <Box
                  width="12px"
                  height="12px"
                  borderRadius="1"
                  style={{ backgroundColor: `rgba(${heatmapColor}, 0.2)` }}
                />
                <Text size="0" color="muted">Low</Text>
              </Row>
              <Row gap="2" alignItems="center">
                <Box
                  width="12px"
                  height="12px"
                  borderRadius="1"
                  style={{ backgroundColor: `rgba(${heatmapColor}, 0.6)` }}
                />
                <Text size="0" color="muted">Medium</Text>
              </Row>
              <Row gap="2" alignItems="center">
                <Box
                  width="12px"
                  height="12px"
                  borderRadius="1"
                  style={{ backgroundColor: `rgba(${heatmapColor}, 1)` }}
                />
                <Text size="0" color="muted">High</Text>
              </Row>
            </Row>
          </Column>
        </Panel>
        )}
      </Grid>

      {/* User Paths */}
      <Panel className="stagger-4">
        <ListTable
          title="Top User Journeys"
          metric="Sessions"
          data={userPaths}
          showPercentage={showPercentages}
        />
      </Panel>
    </Column>
  );
}
