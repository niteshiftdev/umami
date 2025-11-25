'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Heading, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { GridRow } from '@/components/common/GridRow';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Overview } from '@/components/svg';

// Mock data generators for Product Analytics persona
function generateEngagementData() {
  const today = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    // Realistic engagement pattern - higher on weekdays
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActive = isWeekend ? 8500 : 12000;
    const variance = Math.random() * 3000 - 1500;
    data.push({
      x: dateStr,
      y: Math.round(baseActive + variance),
    });
  }
  return data;
}

function generateSessionData() {
  const today = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseAvg = isWeekend ? 4.2 : 5.8;
    const variance = Math.random() * 1.5 - 0.75;
    data.push({
      x: dateStr,
      y: Math.round((baseAvg + variance) * 10) / 10,
    });
  }
  return data;
}

function generateFeatureUsageData() {
  return [
    { label: 'Dashboard', value: 34500 },
    { label: 'Reports', value: 28200 },
    { label: 'Analytics', value: 21800 },
    { label: 'Settings', value: 12400 },
    { label: 'Integrations', value: 8900 },
    { label: 'Export', value: 6200 },
  ];
}

function generateRetentionData() {
  const today = new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    // Retention typically varies between 35-55%
    const baseRetention = 42;
    const variance = Math.random() * 15 - 7.5;
    data.push({
      x: dateStr,
      y: Math.round((baseRetention + variance) * 10) / 10,
    });
  }
  return data;
}

function generateCohortData() {
  const cohorts = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return cohorts.map((label, idx) => ({
    label,
    day1: 100,
    day7: 68 - idx * 3 + Math.random() * 5,
    day14: 52 - idx * 4 + Math.random() * 5,
    day30: 38 - idx * 3 + Math.random() * 5,
  }));
}

function generateUserFlowData() {
  return [
    { from: 'Homepage', to: 'Dashboard', value: 4520 },
    { from: 'Homepage', to: 'Pricing', value: 2180 },
    { from: 'Dashboard', to: 'Reports', value: 3200 },
    { from: 'Dashboard', to: 'Settings', value: 1100 },
    { from: 'Reports', to: 'Export', value: 890 },
    { from: 'Pricing', to: 'Signup', value: 680 },
  ];
}

// Top pages by engagement time
const topPagesByEngagement = [
  { page: '/dashboard', avgTime: '5m 42s', sessions: 34521, bounceRate: 12.3 },
  { page: '/reports/analytics', avgTime: '4m 18s', sessions: 28432, bounceRate: 18.5 },
  { page: '/settings/integrations', avgTime: '3m 55s', sessions: 12843, bounceRate: 22.1 },
  { page: '/docs/getting-started', avgTime: '6m 12s', sessions: 8932, bounceRate: 8.4 },
  { page: '/features', avgTime: '2m 34s', sessions: 21543, bounceRate: 35.2 },
];

// User segments
const userSegments = [
  { segment: 'Power Users', count: 2845, percentage: 12.4, growth: 8.2 },
  { segment: 'Regular Users', count: 8932, percentage: 38.9, growth: 3.1 },
  { segment: 'Occasional Users', count: 7621, percentage: 33.2, growth: -2.4 },
  { segment: 'New Users', count: 3562, percentage: 15.5, growth: 15.8 },
];

export default function ProductAnalyticsPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate mock data
  const engagementData = useMemo(() => generateEngagementData(), []);
  const sessionData = useMemo(() => generateSessionData(), []);
  const featureUsageData = useMemo(() => generateFeatureUsageData(), []);
  const retentionData = useMemo(() => generateRetentionData(), []);

  // Calculate date range for charts
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  // Chart data configurations
  const engagementChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Active Users',
          data: engagementData,
          backgroundColor: colors.chart.visitors.backgroundColor,
          borderColor: colors.chart.visitors.borderColor,
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [engagementData, colors],
  );

  const sessionChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Avg Sessions/User',
          data: sessionData,
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [sessionData],
  );

  const featureChartData = useMemo(
    () => ({
      labels: featureUsageData.map(d => d.label),
      datasets: [
        {
          data: featureUsageData.map(d => d.value),
          backgroundColor: CHART_COLORS.slice(0, featureUsageData.length),
          borderWidth: 0,
        },
      ],
    }),
    [featureUsageData],
  );

  const retentionChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Retention Rate %',
          data: retentionData,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 1,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [retentionData],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  return (
    <PageBody>
      <PageHeader title="Product Analytics" icon={<Overview />} description="User engagement metrics and behavior patterns" />

      {/* Key Metrics */}
      <MetricsBar>
        <MetricCard value={22960} label="Daily Active Users" change={21450} showChange formatValue={formatNumber} />
        <MetricCard value={156432} label="Monthly Active Users" change={148920} showChange formatValue={formatNumber} />
        <MetricCard value={5.2} label="Avg Sessions/User" change={4.8} showChange formatValue={(n: number) => n.toFixed(1)} />
        <MetricCard value={42.3} label="Retention Rate %" change={39.8} showChange formatValue={(n: number) => `${n.toFixed(1)}%`} />
        <MetricCard value={4.8} label="Avg Session Duration" change={4.5} showChange formatValue={(n: number) => `${n.toFixed(1)}m`} />
      </MetricsBar>

      {/* Main Charts Row */}
      <GridRow layout="two">
        <Panel title="Daily Active Users">
          <BarChart
            chartData={engagementChartData}
            unit="day"
            minDate={thirtyDaysAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="300px"
          />
        </Panel>
        <Panel title="Session Frequency">
          <BarChart
            chartData={sessionChartData}
            unit="day"
            minDate={thirtyDaysAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="300px"
          />
        </Panel>
      </GridRow>

      {/* Feature Usage and Retention */}
      <GridRow layout="two">
        <Panel title="Feature Usage Distribution">
          <Row justifyContent="center" alignItems="center" height="300px">
            <PieChart type="doughnut" chartData={featureChartData} width="280px" height="280px" />
          </Row>
        </Panel>
        <Panel title="7-Day Retention Trend">
          <BarChart
            chartData={retentionChartData}
            unit="day"
            minDate={sevenDaysAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="300px"
          />
        </Panel>
      </GridRow>

      {/* Data Tables */}
      <GridRow layout="two">
        {/* Top Pages by Engagement */}
        <Panel title="Top Pages by Engagement">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Page
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Avg Time
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Sessions
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Bounce
              </Text>
            </Row>
            {topPagesByEngagement.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Text size="2" style={{ flex: 2 }} truncate>
                  {item.page}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.avgTime}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.sessions)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.bounceRate}%
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* User Segments */}
        <Panel title="User Segments">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Segment
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Users
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                % Total
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Growth
              </Text>
            </Row>
            {userSegments.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Text size="2" style={{ flex: 2 }}>
                  {item.segment}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.count)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.percentage}%
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right', color: item.growth >= 0 ? '#44b556' : '#e34850' }}>
                  {item.growth >= 0 ? '+' : ''}
                  {item.growth}%
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </GridRow>

      {/* Cohort Analysis Preview */}
      <Panel title="Cohort Retention Analysis">
        <Column gap="2">
          <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
            <Text size="1" weight="bold" style={{ flex: 1 }}>
              Cohort
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
              Day 1
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
              Day 7
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
              Day 14
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
              Day 30
            </Text>
          </Row>
          {generateCohortData().map((cohort, idx) => (
            <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="2" style={{ flex: 1 }}>
                {cohort.label}
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'center' }}>
                {cohort.day1}%
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'center' }}>
                {cohort.day7.toFixed(1)}%
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'center' }}>
                {cohort.day14.toFixed(1)}%
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'center' }}>
                {cohort.day30.toFixed(1)}%
              </Text>
            </Row>
          ))}
        </Column>
      </Panel>
    </PageBody>
  );
}
