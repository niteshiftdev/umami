'use client';

import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, Heading, Box } from '@umami/react-zen';
import { useDynamicColor, useDynamicVariant, useDynamicBoolean, useDynamicNumber } from '@niteshift/dials';
import { Chart } from '@/components/charts/Chart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber, formatLongNumber } from '@/lib/format';
import { renderDateLabels } from '@/lib/charts';

// Mock data generator for realistic product analytics data
function generateEngagementData() {
  const now = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const baseValue = 12000 + Math.floor(Math.random() * 3000);
    // Add weekly pattern (lower on weekends)
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
    data.push({
      x: date.toISOString().split('T')[0],
      y: Math.floor(baseValue * weekendFactor),
    });
  }
  return data;
}

function generateSessionData() {
  const now = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const baseValue = 8500 + Math.floor(Math.random() * 2000);
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    data.push({
      x: date.toISOString().split('T')[0],
      y: Math.floor(baseValue * weekendFactor),
    });
  }
  return data;
}

function generateRetentionData() {
  // Cohort retention data (week over week)
  return [
    { week: 'Week 1', day1: 100, day3: 68, day7: 45, day14: 32, day30: 24 },
    { week: 'Week 2', day1: 100, day3: 71, day7: 48, day14: 35, day30: 26 },
    { week: 'Week 3', day1: 100, day3: 65, day7: 42, day14: 30, day30: 22 },
    { week: 'Week 4', day1: 100, day3: 72, day7: 50, day14: 38, day30: 28 },
  ];
}

function generateFeatureUsageData() {
  return [
    { feature: 'Dashboard Views', users: 8432, sessions: 24521, avgDuration: '4m 32s' },
    { feature: 'Report Builder', users: 3215, sessions: 8932, avgDuration: '8m 15s' },
    { feature: 'Data Export', users: 2876, sessions: 5124, avgDuration: '2m 45s' },
    { feature: 'Team Sharing', users: 1954, sessions: 4321, avgDuration: '3m 12s' },
    { feature: 'API Integration', users: 1432, sessions: 6543, avgDuration: '6m 48s' },
    { feature: 'Custom Events', users: 1128, sessions: 3456, avgDuration: '5m 22s' },
  ];
}

function generateUserSegmentData() {
  return {
    labels: ['Power Users', 'Regular Users', 'Casual Users', 'New Users', 'Dormant'],
    datasets: [{
      data: [1842, 4521, 3215, 2108, 1456],
      backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3], CHART_COLORS[4]],
      borderWidth: 0,
    }],
  };
}

function generateFunnelData() {
  return [
    { step: 'Visited Homepage', count: 45230, rate: 100 },
    { step: 'Viewed Product', count: 28540, rate: 63.1 },
    { step: 'Added to Cart', count: 12380, rate: 27.4 },
    { step: 'Started Checkout', count: 8920, rate: 19.7 },
    { step: 'Completed Purchase', count: 5840, rate: 12.9 },
  ];
}

function generateHourlyActivityData() {
  const data = [];
  for (let hour = 0; hour < 24; hour++) {
    // Peak hours around 10-11am and 2-3pm
    let baseValue = 400;
    if (hour >= 9 && hour <= 11) baseValue = 1200 + Math.floor(Math.random() * 300);
    else if (hour >= 14 && hour <= 16) baseValue = 1000 + Math.floor(Math.random() * 250);
    else if (hour >= 6 && hour <= 8) baseValue = 600 + Math.floor(Math.random() * 150);
    else if (hour >= 17 && hour <= 20) baseValue = 750 + Math.floor(Math.random() * 200);
    else if (hour >= 0 && hour <= 5) baseValue = 150 + Math.floor(Math.random() * 50);
    else baseValue = 500 + Math.floor(Math.random() * 150);

    data.push({
      x: `${hour.toString().padStart(2, '0')}:00`,
      y: baseValue,
    });
  }
  return data;
}

// Retention Heatmap Component
function RetentionHeatmap({ data }: { data: any[] }) {
  const getColor = (value: number) => {
    if (value >= 60) return '#30a46c';
    if (value >= 40) return '#46a758';
    if (value >= 25) return '#ffc53d';
    if (value >= 15) return '#f76b15';
    return '#e5484d';
  };

  return (
    <Column gap="2">
      <Row gap="2">
        <Box style={{ width: '80px' }} />
        <Text size="1" weight="medium" style={{ width: '60px', textAlign: 'center' }}>Day 1</Text>
        <Text size="1" weight="medium" style={{ width: '60px', textAlign: 'center' }}>Day 3</Text>
        <Text size="1" weight="medium" style={{ width: '60px', textAlign: 'center' }}>Day 7</Text>
        <Text size="1" weight="medium" style={{ width: '60px', textAlign: 'center' }}>Day 14</Text>
        <Text size="1" weight="medium" style={{ width: '60px', textAlign: 'center' }}>Day 30</Text>
      </Row>
      {data.map((row, idx) => (
        <Row key={idx} gap="2" alignItems="center">
          <Text size="1" style={{ width: '80px' }}>{row.week}</Text>
          {['day1', 'day3', 'day7', 'day14', 'day30'].map((day) => (
            <Box
              key={day}
              style={{
                width: '60px',
                height: '36px',
                backgroundColor: getColor(row[day]),
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text size="1" weight="medium" style={{ color: '#fff' }}>{row[day]}%</Text>
            </Box>
          ))}
        </Row>
      ))}
    </Column>
  );
}

// Funnel Visualization Component
function FunnelChart({ data }: { data: any[] }) {
  const maxCount = data[0]?.count || 1;

  return (
    <Column gap="3">
      {data.map((step, idx) => {
        const widthPercent = (step.count / maxCount) * 100;
        const dropoff = idx > 0 ? data[idx - 1].count - step.count : 0;

        return (
          <Column key={idx} gap="1">
            <Row justifyContent="space-between" alignItems="center">
              <Text size="2" weight="medium">{step.step}</Text>
              <Row gap="3">
                <Text size="2">{formatLongNumber(step.count)}</Text>
                <Text size="1" style={{ color: '#666', width: '50px' }}>{step.rate}%</Text>
              </Row>
            </Row>
            <Box style={{ position: 'relative', height: '24px' }}>
              <Box
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${widthPercent}%`,
                  height: '100%',
                  backgroundColor: CHART_COLORS[0],
                  borderRadius: '4px',
                  opacity: 0.8 - (idx * 0.1),
                }}
              />
            </Box>
            {idx > 0 && (
              <Text size="0" style={{ color: '#e5484d' }}>
                -{formatLongNumber(dropoff)} ({((dropoff / data[idx - 1].count) * 100).toFixed(1)}% drop-off)
              </Text>
            )}
          </Column>
        );
      })}
    </Column>
  );
}

export default function ProductAnalyticsPage() {
  // Dials for customization
  const primaryColor = useDynamicColor('pa-primary-color', {
    label: 'Primary Color',
    description: 'Main accent color for charts and highlights',
    default: '#2680eb',
    options: ['#2680eb', '#3e63dd', '#0090ff', '#30a46c', '#8e4ec6'],
    group: 'Colors',
  });

  const cardLayout = useDynamicVariant('pa-card-layout', {
    label: 'Metrics Layout',
    description: 'Layout style for metric cards',
    default: 'row',
    options: ['row', 'grid'] as const,
    group: 'Layout',
  });

  const showRetention = useDynamicBoolean('pa-show-retention', {
    label: 'Show Retention',
    description: 'Display the retention heatmap',
    default: true,
    group: 'Visibility',
  });

  const chartHeight = useDynamicNumber('pa-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts in pixels',
    default: 300,
    min: 200,
    max: 500,
    step: 50,
    unit: 'px',
    group: 'Layout',
  });

  const metricStyle = useDynamicVariant('pa-metric-style', {
    label: 'Metric Card Style',
    description: 'Visual style for metric cards',
    default: 'standard',
    options: ['standard', 'compact', 'detailed'] as const,
    group: 'Style',
  });

  // Generate mock data
  const engagementData = useMemo(() => generateEngagementData(), []);
  const sessionData = useMemo(() => generateSessionData(), []);
  const retentionData = useMemo(() => generateRetentionData(), []);
  const featureUsageData = useMemo(() => generateFeatureUsageData(), []);
  const userSegmentData = useMemo(() => generateUserSegmentData(), []);
  const funnelData = useMemo(() => generateFunnelData(), []);
  const hourlyData = useMemo(() => generateHourlyActivityData(), []);

  // Chart data for engagement
  const engagementChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Active Users',
        data: engagementData,
        backgroundColor: `${primaryColor}99`,
        borderColor: primaryColor,
        borderWidth: 1,
      },
      {
        type: 'line' as const,
        label: 'Sessions',
        data: sessionData,
        borderColor: CHART_COLORS[1],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  }), [engagementData, sessionData, primaryColor]);

  // Hourly activity chart data
  const hourlyChartData = useMemo(() => ({
    labels: hourlyData.map(d => d.x),
    datasets: [{
      type: 'bar' as const,
      label: 'Active Users',
      data: hourlyData.map(d => d.y),
      backgroundColor: `${primaryColor}66`,
      borderColor: primaryColor,
      borderWidth: 1,
    }],
  }), [hourlyData, primaryColor]);

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Calculate date range for charts
  const dateRange = useMemo(() => {
    const now = new Date();
    const minDate = new Date(now);
    minDate.setDate(minDate.getDate() - 29);
    return { minDate, maxDate: now };
  }, []);

  // Calculate metrics
  const totalActiveUsers = engagementData.reduce((sum, d) => sum + d.y, 0);
  const avgDailyUsers = Math.floor(totalActiveUsers / 30);
  const totalSessions = sessionData.reduce((sum, d) => sum + d.y, 0);
  const avgSessionsPerUser = (totalSessions / totalActiveUsers).toFixed(2);

  return (
    <PageBody>
      <Column gap="6" padding="4">
        <PageHeader title="Product Analytics Dashboard" />
        <Text size="2" style={{ color: '#666', marginTop: '-12px' }}>
          User engagement metrics and behavior patterns
        </Text>

        {/* Key Metrics */}
        {cardLayout === 'row' ? (
          <Row gap="4" style={{ overflowX: 'auto' }}>
            <MetricCard
              label="Monthly Active Users"
              value={totalActiveUsers}
              change={totalActiveUsers * 0.08}
              showChange
              showLabel
              valueSize={metricStyle === 'compact' ? '6' : '8'}
            />
            <MetricCard
              label="Avg Daily Users"
              value={avgDailyUsers}
              change={avgDailyUsers * 0.12}
              showChange
              showLabel
              valueSize={metricStyle === 'compact' ? '6' : '8'}
            />
            <MetricCard
              label="Sessions/User"
              value={parseFloat(avgSessionsPerUser)}
              formatValue={(n) => n.toFixed(2)}
              change={0.15}
              showChange
              showLabel
              valueSize={metricStyle === 'compact' ? '6' : '8'}
            />
            <MetricCard
              label="Avg Session Duration"
              value={312}
              formatValue={(n) => `${Math.floor(n / 60)}m ${n % 60}s`}
              change={24}
              showChange
              showLabel
              valueSize={metricStyle === 'compact' ? '6' : '8'}
            />
            <MetricCard
              label="Feature Adoption"
              value={68.5}
              formatValue={(n) => `${n.toFixed(1)}%`}
              change={3.2}
              showChange
              showLabel
              valueSize={metricStyle === 'compact' ? '6' : '8'}
            />
          </Row>
        ) : (
          <Grid columns={{ xs: '2', md: '5' }} gap="4">
            <MetricCard label="Monthly Active Users" value={totalActiveUsers} showLabel />
            <MetricCard label="Avg Daily Users" value={avgDailyUsers} showLabel />
            <MetricCard label="Sessions/User" value={parseFloat(avgSessionsPerUser)} formatValue={(n) => n.toFixed(2)} showLabel />
            <MetricCard label="Avg Session Duration" value={312} formatValue={(n) => `${Math.floor(n / 60)}m ${n % 60}s`} showLabel />
            <MetricCard label="Feature Adoption" value={68.5} formatValue={(n) => `${n.toFixed(1)}%`} showLabel />
          </Grid>
        )}

        {/* Main Engagement Chart */}
        <Panel title="User Engagement Trends">
          <BarChart
            chartData={engagementChartData}
            unit="day"
            height={`${chartHeight}px`}
            renderXLabel={renderXLabel}
            minDate={dateRange.minDate}
            maxDate={dateRange.maxDate}
          />
        </Panel>

        {/* Middle Row: Funnel + User Segments */}
        <Grid columns={{ xs: '1', lg: '2' }} gap="4">
          <Panel title="Conversion Funnel">
            <FunnelChart data={funnelData} />
          </Panel>

          <Panel title="User Segments">
            <Row gap="4" alignItems="center">
              <Box style={{ width: '200px', height: '200px' }}>
                <PieChart
                  type="doughnut"
                  chartData={userSegmentData}
                  height="200px"
                />
              </Box>
              <Column gap="2" style={{ flex: 1 }}>
                {userSegmentData.labels.map((label, idx) => (
                  <Row key={label} justifyContent="space-between" alignItems="center">
                    <Row gap="2" alignItems="center">
                      <Box style={{ width: '12px', height: '12px', backgroundColor: CHART_COLORS[idx], borderRadius: '2px' }} />
                      <Text size="2">{label}</Text>
                    </Row>
                    <Text size="2" weight="medium">{formatLongNumber(userSegmentData.datasets[0].data[idx])}</Text>
                  </Row>
                ))}
              </Column>
            </Row>
          </Panel>
        </Grid>

        {/* Retention Heatmap */}
        {showRetention && (
          <Panel title="Cohort Retention">
            <RetentionHeatmap data={retentionData} />
          </Panel>
        )}

        {/* Hourly Activity */}
        <Panel title="Hourly Activity Pattern">
          <Chart
            type="bar"
            chartData={hourlyChartData}
            height={`${chartHeight - 100}px`}
          />
        </Panel>

        {/* Feature Usage Table */}
        <Panel title="Feature Usage">
          <Column gap="2">
            <Row gap="4" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '8px' }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>Feature</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Users</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Sessions</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Avg Duration</Text>
            </Row>
            {featureUsageData.map((feature) => (
              <Row key={feature.feature} gap="4" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                <Text size="2" style={{ flex: 2 }}>{feature.feature}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(feature.users)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(feature.sessions)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{feature.avgDuration}</Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
