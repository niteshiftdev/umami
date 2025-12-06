'use client';

import { useMemo, useState } from 'react';
import { Column, Row, Grid, Heading, Text, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';

// Generate dates for the last 30 days
function generateDates(days: number) {
  const dates: string[] = [];
  const today = new Date(2024, 11, 4); // December 4, 2024
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
  }
  return dates;
}

// Active user trend data (DAU with realistic patterns)
function generateActiveUserData() {
  const dates = generateDates(30);
  const baseDAU = 12500;

  return {
    __id: Date.now(),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Daily Active Users',
        data: dates.map((date, i) => {
          const dayOfWeek = new Date(date).getDay();
          // Lower on weekends
          const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
          // Growth trend
          const growthFactor = 1 + (i / dates.length) * 0.15;
          // Random variance
          const variance = 0.9 + Math.random() * 0.2;
          const value = Math.round(baseDAU * weekendFactor * growthFactor * variance);
          return { x: date, y: value, d: date };
        }),
        backgroundColor: CHART_COLORS[0],
        borderColor: CHART_COLORS[0],
        borderWidth: 0,
      },
      {
        type: 'line' as const,
        label: '7-day Average',
        data: dates.map((date, i) => {
          const dayOfWeek = new Date(date).getDay();
          const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
          const growthFactor = 1 + (i / dates.length) * 0.15;
          const variance = 0.9 + Math.random() * 0.2;
          const rawValue = baseDAU * weekendFactor * growthFactor * variance;
          // 7-day moving average approximation
          const avgValue = Math.round(rawValue * 0.95 + baseDAU * 0.05);
          return { x: date, y: avgValue, d: date };
        }),
        backgroundColor: 'transparent',
        borderColor: CHART_COLORS[3],
        borderWidth: 2,
        order: 0,
      },
    ],
  };
}

// Session duration trend data
function generateSessionDurationData() {
  const dates = generateDates(14);
  const baseMinutes = 8.5;

  return {
    __id: Date.now() + 1,
    datasets: [
      {
        type: 'bar' as const,
        label: 'Avg Session (min)',
        data: dates.map((date, i) => {
          const variance = 0.85 + Math.random() * 0.3;
          const trend = 1 + (i / dates.length) * 0.08;
          const value = Math.round(baseMinutes * variance * trend * 10) / 10;
          return { x: date, y: value, d: date };
        }),
        backgroundColor: CHART_COLORS[2],
        borderColor: CHART_COLORS[2],
        borderWidth: 0,
      },
    ],
  };
}

// Feature adoption pie chart data
function generateFeatureAdoptionData() {
  return {
    labels: ['Dashboard', 'Reports', 'Analytics', 'Settings', 'API', 'Integrations'],
    datasets: [
      {
        label: 'Feature Usage',
        data: [34, 24, 18, 12, 8, 4],
        backgroundColor: CHART_COLORS.slice(0, 6),
        borderColor: 'transparent',
        borderWidth: 0,
      },
    ],
  };
}

// User type distribution
function generateUserTypeData() {
  return {
    labels: ['Power Users', 'Regular Users', 'Casual Users', 'New Users'],
    datasets: [
      {
        label: 'User Types',
        data: [18, 35, 32, 15],
        backgroundColor: [CHART_COLORS[1], CHART_COLORS[0], CHART_COLORS[2], CHART_COLORS[5]],
        borderColor: 'transparent',
        borderWidth: 0,
      },
    ],
  };
}

// Top features by engagement
const topFeatures = [
  { label: 'Real-time Dashboard', count: 45230, percent: 100 },
  { label: 'Custom Reports Builder', count: 38450, percent: 85 },
  { label: 'Event Tracking', count: 32100, percent: 71 },
  { label: 'Funnel Analysis', count: 28900, percent: 64 },
  { label: 'User Segmentation', count: 24500, percent: 54 },
  { label: 'A/B Test Results', count: 19800, percent: 44 },
  { label: 'Cohort Analysis', count: 15600, percent: 34 },
  { label: 'Export to CSV', count: 12300, percent: 27 },
];

// Top pages by engagement score
const topPages = [
  { label: '/dashboard', count: 89, percent: 100 },
  { label: '/analytics/overview', count: 76, percent: 85 },
  { label: '/reports/custom', count: 68, percent: 76 },
  { label: '/settings/integrations', count: 54, percent: 61 },
  { label: '/users/segments', count: 48, percent: 54 },
  { label: '/funnels/builder', count: 42, percent: 47 },
  { label: '/events/explorer', count: 38, percent: 43 },
  { label: '/api/documentation', count: 31, percent: 35 },
];

// Retention cohort data
const retentionCohorts = [
  { week: 'Week 1', day1: 100, day7: 68, day14: 52, day30: 38 },
  { week: 'Week 2', day1: 100, day7: 71, day14: 55, day30: 41 },
  { week: 'Week 3', day1: 100, day7: 73, day14: 58, day30: 44 },
  { week: 'Week 4', day1: 100, day7: 75, day14: 61, day30: 47 },
];

export default function ProductAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('30d');

  // === DIALS: Layout & Spacing ===
  const sectionGap = useDynamicSpacing('pa-section-gap', {
    label: 'Section Gap',
    group: 'Layout',
    default: '24px',
    options: ['16px', '24px', '32px', '40px', '48px'],
  });

  const panelPadding = useDynamicSpacing('pa-panel-padding', {
    label: 'Panel Padding',
    group: 'Layout',
    default: '24px',
    options: ['16px', '20px', '24px', '32px'],
  });

  const metricsLayout = useDynamicVariant('pa-metrics-layout', {
    label: 'Metrics Cards Layout',
    group: 'Layout',
    default: '6',
    options: ['4', '5', '6'] as const,
    description: 'Number of metric cards per row',
  });

  const chartsLayout = useDynamicVariant('pa-charts-layout', {
    label: 'Charts Section Layout',
    group: 'Layout',
    default: 'two',
    options: ['one', 'two', 'three'] as const,
  });

  // === DIALS: Typography ===
  const headingSize = useDynamicVariant('pa-heading-size', {
    label: 'Panel Heading Size',
    group: 'Typography',
    default: '2',
    options: ['1', '2', '3'] as const,
  });

  const metricValueSize = useDynamicVariant('pa-metric-value-size', {
    label: 'Metric Value Size',
    group: 'Typography',
    default: '7',
    options: ['6', '7', '8', '9'] as const,
  });

  const metricLabelSize = useDynamicVariant('pa-metric-label-size', {
    label: 'Metric Label Size',
    group: 'Typography',
    default: '1',
    options: ['0', '1', '2'] as const,
  });

  // === DIALS: Colors ===
  const primaryChartColor = useDynamicColor('pa-primary-chart-color', {
    label: 'Primary Chart Color',
    group: 'Colors',
    default: CHART_COLORS[0],
    options: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[6], '#3e63dd', '#0090ff'],
    allowCustom: true,
  });

  const secondaryChartColor = useDynamicColor('pa-secondary-chart-color', {
    label: 'Secondary Chart Color',
    group: 'Colors',
    default: CHART_COLORS[3],
    options: [CHART_COLORS[3], CHART_COLORS[4], CHART_COLORS[5], '#f76b15', '#e5484d'],
    allowCustom: true,
  });

  const accentColor = useDynamicColor('pa-accent-color', {
    label: 'Accent Color',
    group: 'Colors',
    default: CHART_COLORS[2],
    options: [CHART_COLORS[2], CHART_COLORS[0], CHART_COLORS[1], '#30a46c', '#12a594'],
    allowCustom: true,
  });

  // === DIALS: Visualization ===
  const chartHeight = useDynamicNumber('pa-chart-height', {
    label: 'Main Chart Height',
    group: 'Visualization',
    default: 320,
    min: 200,
    max: 500,
    step: 40,
    unit: 'px',
  });

  const pieChartType = useDynamicVariant('pa-pie-chart-type', {
    label: 'Pie Chart Style',
    group: 'Visualization',
    default: 'doughnut',
    options: ['pie', 'doughnut'] as const,
  });

  const showTrendLine = useDynamicBoolean('pa-show-trend-line', {
    label: 'Show Trend Line',
    group: 'Visualization',
    default: true,
    trueLabel: 'Show',
    falseLabel: 'Hide',
  });

  const tableItemCount = useDynamicNumber('pa-table-item-count', {
    label: 'Table Items Count',
    group: 'Visualization',
    default: 8,
    min: 5,
    max: 12,
    step: 1,
  });

  // === DIALS: Features ===
  const showRetentionCohorts = useDynamicBoolean('pa-show-retention', {
    label: 'Show Retention Cohorts',
    group: 'Features',
    default: true,
  });

  const showEngagementHighlights = useDynamicBoolean('pa-show-engagement', {
    label: 'Show Engagement Highlights',
    group: 'Features',
    default: true,
  });

  const showGoalsProgress = useDynamicBoolean('pa-show-goals', {
    label: 'Show Goals Progress',
    group: 'Features',
    default: true,
  });

  // Generate chart data with dynamic colors
  const activeUserData = useMemo(() => {
    const dates = generateDates(30);
    const baseDAU = 12500;
    return {
      __id: Date.now(),
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Active Users',
          data: dates.map((date, i) => {
            const dayOfWeek = new Date(date).getDay();
            const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
            const growthFactor = 1 + (i / dates.length) * 0.15;
            const variance = 0.9 + Math.random() * 0.2;
            const value = Math.round(baseDAU * weekendFactor * growthFactor * variance);
            return { x: date, y: value, d: date };
          }),
          backgroundColor: primaryChartColor,
          borderColor: primaryChartColor,
          borderWidth: 0,
        },
        ...(showTrendLine ? [{
          type: 'line' as const,
          label: '7-day Average',
          data: dates.map((date, i) => {
            const dayOfWeek = new Date(date).getDay();
            const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
            const growthFactor = 1 + (i / dates.length) * 0.15;
            const variance = 0.9 + Math.random() * 0.2;
            const rawValue = baseDAU * weekendFactor * growthFactor * variance;
            const avgValue = Math.round(rawValue * 0.95 + baseDAU * 0.05);
            return { x: date, y: avgValue, d: date };
          }),
          backgroundColor: 'transparent',
          borderColor: secondaryChartColor,
          borderWidth: 2,
          order: 0,
        }] : []),
      ],
    };
  }, [primaryChartColor, secondaryChartColor, showTrendLine]);

  const sessionDurationData = useMemo(() => generateSessionDurationData(), []);
  const featureAdoptionData = useMemo(() => generateFeatureAdoptionData(), []);
  const userTypeData = useMemo(() => generateUserTypeData(), []);

  const minDate = new Date(2024, 10, 5); // Nov 5, 2024
  const maxDate = new Date(2024, 11, 4); // Dec 4, 2024

  return (
    <PageBody>
      <Column gap="6" style={{ gap: sectionGap }}>
        <PageHeader
          title="Product Analytics"
          description="User engagement metrics and behavior patterns for product decisions"
        >
          <Row gap="2">
            {(['7d', '14d', '30d'] as const).map(period => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'primary' : 'quiet'}
                size="sm"
                onPress={() => setSelectedPeriod(period)}
              >
                {period === '7d' ? 'Last 7 days' : period === '14d' ? 'Last 14 days' : 'Last 30 days'}
              </Button>
            ))}
          </Row>
        </PageHeader>

        {/* Key Metrics Row */}
        <MetricsBar columns={`repeat(${metricsLayout}, 1fr)`}>
          <MetricCard
            label="Daily Active Users"
            value={14280}
            change={12850}
            showChange
            valueSize={metricValueSize as '6' | '7' | '8' | '9'}
            labelSize={metricLabelSize as '0' | '1' | '2'}
          />
          <MetricCard
            label="Weekly Active Users"
            value={48900}
            change={45200}
            showChange
            valueSize={metricValueSize as '6' | '7' | '8' | '9'}
            labelSize={metricLabelSize as '0' | '1' | '2'}
          />
          <MetricCard
            label="Monthly Active Users"
            value={156000}
            change={142000}
            showChange
            valueSize={metricValueSize as '6' | '7' | '8' | '9'}
            labelSize={metricLabelSize as '0' | '1' | '2'}
          />
          <MetricCard
            label="Avg Session Duration"
            value={9.2}
            change={8.4}
            showChange
            formatValue={(n: number) => `${n.toFixed(1)}m`}
            valueSize={metricValueSize as '6' | '7' | '8' | '9'}
            labelSize={metricLabelSize as '0' | '1' | '2'}
          />
          <MetricCard
            label="Sessions per User"
            value={4.8}
            change={4.2}
            showChange
            formatValue={(n: number) => n.toFixed(1)}
            valueSize={metricValueSize as '6' | '7' | '8' | '9'}
            labelSize={metricLabelSize as '0' | '1' | '2'}
          />
          <MetricCard
            label="Feature Adoption"
            value={72}
            change={65}
            showChange
            formatValue={(n: number) => `${Math.round(n)}%`}
            valueSize={metricValueSize as '6' | '7' | '8' | '9'}
            labelSize={metricLabelSize as '0' | '1' | '2'}
          />
        </MetricsBar>

        {/* Daily Active Users Chart - Full Width */}
        <Panel title="Daily Active Users Trend" style={{ padding: panelPadding }}>
          <BarChart
            chartData={activeUserData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            height={chartHeight}
          />
        </Panel>

        {/* Two Column Layout: Feature Adoption & User Types */}
        <GridRow layout={chartsLayout as 'one' | 'two' | 'three'}>
          <Panel title="Feature Adoption Breakdown" style={{ padding: panelPadding }}>
            <Row justifyContent="center" alignItems="center" style={{ height: 280 }}>
              <div style={{ width: 260, height: 260 }}>
                <PieChart chartData={featureAdoptionData} type={pieChartType as 'pie' | 'doughnut'} />
              </div>
            </Row>
            <Grid columns="repeat(3, 1fr)" gap="2" paddingTop="4">
              {featureAdoptionData.labels.map((label, i) => (
                <Row key={label} gap="2" alignItems="center">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: CHART_COLORS[i],
                      flexShrink: 0,
                    }}
                  />
                  <Text size="1" truncate>
                    {label} ({featureAdoptionData.datasets[0].data[i]}%)
                  </Text>
                </Row>
              ))}
            </Grid>
          </Panel>
          <Panel title="User Engagement Segments" style={{ padding: panelPadding }}>
            <Row justifyContent="center" alignItems="center" style={{ height: 280 }}>
              <div style={{ width: 260, height: 260 }}>
                <PieChart chartData={userTypeData} type={pieChartType as 'pie' | 'doughnut'} />
              </div>
            </Row>
            <Grid columns="repeat(2, 1fr)" gap="3" paddingTop="4">
              {userTypeData.labels.map((label, i) => (
                <Row key={label} gap="2" alignItems="center">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: userTypeData.datasets[0].backgroundColor[i],
                      flexShrink: 0,
                    }}
                  />
                  <Text size="1">
                    {label}: {userTypeData.datasets[0].data[i]}%
                  </Text>
                </Row>
              ))}
            </Grid>
          </Panel>
        </GridRow>

        {/* Three Column Layout: Top Features, Top Pages, Session Duration */}
        <GridRow layout="three">
          <Panel title="Top Features by Usage" style={{ padding: panelPadding }}>
            <ListTable
              data={topFeatures}
              title="Feature"
              metric="Sessions"
              showPercentage
              itemCount={tableItemCount}
            />
          </Panel>
          <Panel title="Page Engagement Score" style={{ padding: panelPadding }}>
            <ListTable
              data={topPages}
              title="Page"
              metric="Score"
              showPercentage
              itemCount={tableItemCount}
            />
          </Panel>
          <Panel title="Avg Session Duration" style={{ padding: panelPadding }}>
            <BarChart
              chartData={sessionDurationData}
              unit="day"
              height={280}
            />
          </Panel>
        </GridRow>

        {/* Retention Cohort Table */}
        {showRetentionCohorts && (
        <Panel title="User Retention Cohorts" style={{ padding: panelPadding }}>
          <Column gap="3">
            <Text color="muted" size="2">
              Percentage of users returning after initial signup, grouped by signup week
            </Text>
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: 500,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--base-border)',
                        fontWeight: 600,
                      }}
                    >
                      Cohort
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--base-border)',
                        fontWeight: 600,
                      }}
                    >
                      Day 1
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--base-border)',
                        fontWeight: 600,
                      }}
                    >
                      Day 7
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--base-border)',
                        fontWeight: 600,
                      }}
                    >
                      Day 14
                    </th>
                    <th
                      style={{
                        textAlign: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--base-border)',
                        fontWeight: 600,
                      }}
                    >
                      Day 30
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {retentionCohorts.map((cohort, idx) => (
                    <tr key={cohort.week}>
                      <td
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--base-border)',
                          fontWeight: 500,
                        }}
                      >
                        {cohort.week}
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--base-border)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 4,
                            backgroundColor: CHART_COLORS[0],
                            color: 'white',
                            fontWeight: 600,
                            minWidth: 48,
                          }}
                        >
                          {cohort.day1}%
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--base-border)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 4,
                            backgroundColor: `rgba(38, 128, 235, ${cohort.day7 / 100})`,
                            color: cohort.day7 > 50 ? 'white' : 'inherit',
                            fontWeight: 500,
                            minWidth: 48,
                          }}
                        >
                          {cohort.day7}%
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--base-border)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 4,
                            backgroundColor: `rgba(38, 128, 235, ${cohort.day14 / 100})`,
                            color: cohort.day14 > 50 ? 'white' : 'inherit',
                            fontWeight: 500,
                            minWidth: 48,
                          }}
                        >
                          {cohort.day14}%
                        </span>
                      </td>
                      <td
                        style={{
                          textAlign: 'center',
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--base-border)',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 12px',
                            borderRadius: 4,
                            backgroundColor: `rgba(38, 128, 235, ${cohort.day30 / 100})`,
                            color: cohort.day30 > 50 ? 'white' : 'inherit',
                            fontWeight: 500,
                            minWidth: 48,
                          }}
                        >
                          {cohort.day30}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Row gap="4" paddingTop="2">
              <Row gap="2" alignItems="center">
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: CHART_COLORS[2],
                  }}
                />
                <Text size="1" color="muted">
                  Improving retention trend (+2.3% WoW)
                </Text>
              </Row>
              <Row gap="2" alignItems="center">
                <Text size="1" weight="semibold" style={{ color: CHART_COLORS[0] }}>
                  Target: 50% Day 30 retention
                </Text>
              </Row>
            </Row>
          </Column>
        </Panel>
        )}

        {/* Engagement Summary Row */}
        {(showEngagementHighlights || showGoalsProgress) && (
        <GridRow layout="two">
          {showEngagementHighlights && (
          <Panel style={{ padding: panelPadding }}>
            <Column gap="4">
              <Heading size={headingSize as '1' | '2' | '3'}>Engagement Highlights</Heading>
              <Column gap="3">
                <Row justifyContent="space-between" alignItems="center" paddingY="2">
                  <Text>New user activation rate</Text>
                  <Text weight="bold" style={{ color: CHART_COLORS[2] }}>
                    78.4%
                  </Text>
                </Row>
                <Row justifyContent="space-between" alignItems="center" paddingY="2">
                  <Text>Feature discovery rate</Text>
                  <Text weight="bold" style={{ color: CHART_COLORS[0] }}>
                    65.2%
                  </Text>
                </Row>
                <Row justifyContent="space-between" alignItems="center" paddingY="2">
                  <Text>Power user conversion</Text>
                  <Text weight="bold" style={{ color: CHART_COLORS[1] }}>
                    23.8%
                  </Text>
                </Row>
                <Row justifyContent="space-between" alignItems="center" paddingY="2">
                  <Text>30-day churn rate</Text>
                  <Text weight="bold" style={{ color: CHART_COLORS[4] }}>
                    8.2%
                  </Text>
                </Row>
                <Row justifyContent="space-between" alignItems="center" paddingY="2">
                  <Text>NPS score (last 30 days)</Text>
                  <Text weight="bold" style={{ color: CHART_COLORS[2] }}>
                    +52
                  </Text>
                </Row>
              </Column>
            </Column>
          </Panel>
          )}
          {showGoalsProgress && (
          <Panel style={{ padding: panelPadding }}>
            <Column gap="4">
              <Heading size={headingSize as '1' | '2' | '3'}>Weekly Goals Progress</Heading>
              <Column gap="3">
                {[
                  { label: 'DAU Target (15K)', current: 14280, target: 15000, color: primaryChartColor },
                  { label: 'Session Duration (10m)', current: 9.2, target: 10, color: accentColor },
                  { label: 'Feature Adoption (75%)', current: 72, target: 75, color: secondaryChartColor },
                  { label: 'Retention Day 7 (80%)', current: 75, target: 80, color: CHART_COLORS[3] },
                ].map(goal => {
                  const progress = Math.min((goal.current / goal.target) * 100, 100);
                  return (
                    <Column key={goal.label} gap="2">
                      <Row justifyContent="space-between">
                        <Text size="2">{goal.label}</Text>
                        <Text size="2" weight="semibold">
                          {Math.round(progress)}%
                        </Text>
                      </Row>
                      <div
                        style={{
                          height: 8,
                          backgroundColor: 'var(--base-border)',
                          borderRadius: 4,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: goal.color,
                            borderRadius: 4,
                            transition: 'width 0.5s ease-out',
                          }}
                        />
                      </div>
                    </Column>
                  );
                })}
              </Column>
            </Column>
          </Panel>
          )}
        </GridRow>
        )}
      </Column>
    </PageBody>
  );
}
