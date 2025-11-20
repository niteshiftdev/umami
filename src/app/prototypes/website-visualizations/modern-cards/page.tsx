'use client';

import { Grid, Column, Row, Heading, Text } from '@umami/react-zen';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

// Mock data for demonstration
const mockMetrics = {
  visitors: 12534,
  visits: 8923,
  pageviews: 45230,
  bounceRate: 42.5,
  avgSessionDuration: 3.24,
  conversionRate: 2.8,
};

const mockVisitorTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Visitors',
      type: 'line',
      data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
      fill: true,
      borderColor: CHART_COLORS[0],
      backgroundColor: `${CHART_COLORS[0]}20`,
      tension: 0.4,
      borderWidth: 2,
    },
  ],
};

const mockSourcesData = {
  labels: ['Organic Search', 'Direct', 'Referral', 'Social Media', 'Email', 'Other'],
  datasets: [
    {
      data: [8934, 4521, 3210, 2156, 1234, 945],
      backgroundColor: CHART_COLORS.slice(0, 6),
    },
  ],
};

const mockTrafficPatternData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
  datasets: [
    {
      label: 'Traffic Pattern',
      data: [245, 156, 892, 1523, 1834, 1456, 678],
      type: 'bar',
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[1],
      borderRadius: 6,
      borderWidth: 0,
    },
  ],
};

const StatCard = ({ label, value, unit = '' }: any) => (
  <Column
    padding="lg"
    gap="sm"
    style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 12,
      border: '1px solid var(--color-border)',
      flex: 1,
      minWidth: 200,
    }}
  >
    <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
      {label}
    </Text>
    <Heading level={2} style={{ margin: '8px 0' }}>
      {value.toLocaleString()}{unit}
    </Heading>
  </Column>
);

const ChartCard = ({ title, children }: any) => (
  <Column
    padding="lg"
    gap="md"
    style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 12,
      border: '1px solid var(--color-border)',
      gridColumn: '1 / -1',
      minHeight: 400,
    }}
  >
    <Heading level={3} style={{ margin: 0 }}>
      {title}
    </Heading>
    <div style={{ flex: 1, minHeight: 300 }}>
      {children}
    </div>
  </Column>
);

export default function ModernCardsVisualization() {
  return (
    <Column padding="lg" gap="lg">
      <Column gap="sm">
        <Heading level={1}>Website Analytics - Modern Cards View</Heading>
        <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
          July 1 - July 30, 2024
        </Text>
      </Column>

      {/* Key Metrics Cards Grid */}
      <Grid
        columns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
        gap="md"
      >
        <StatCard label="Visitors" value={mockMetrics.visitors} />
        <StatCard label="Pageviews" value={mockMetrics.pageviews} />
        <StatCard label="Bounce Rate" value={mockMetrics.bounceRate} unit="%" />
        <StatCard label="Avg. Session" value={mockMetrics.avgSessionDuration} unit="m" />
        <StatCard label="Conversion" value={mockMetrics.conversionRate} unit="%" />
        <StatCard label="Visits" value={mockMetrics.visits} />
      </Grid>

      {/* Charts Grid */}
      <Grid columns="1fr" gap="md">
        <ChartCard title="Visitor Trends">
          <Chart type="line" chartData={mockVisitorTrendData} height="100%" />
        </ChartCard>

        <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="md">
          <ChartCard title="Traffic Sources">
            <Chart type="pie" chartData={mockSourcesData} height="100%" />
          </ChartCard>

          <ChartCard title="Daily Traffic Pattern">
            <Chart type="bar" chartData={mockTrafficPatternData} height="100%" />
          </ChartCard>
        </Grid>
      </Grid>
    </Column>
  );
}
