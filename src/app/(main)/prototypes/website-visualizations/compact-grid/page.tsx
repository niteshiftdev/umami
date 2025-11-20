'use client';

import { Grid, Column, Row, Heading, Text } from '@umami/react-zen';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

const mockVisitorTrendData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      type: 'line',
      label: 'Visitors',
      data: [8234, 9125, 8945, 10234],
      fill: true,
      borderColor: CHART_COLORS[0],
      backgroundColor: `${CHART_COLORS[0]}25`,
      tension: 0.4,
      borderWidth: 2,
    },
    {
      type: 'line',
      label: 'Previous Month',
      data: [7234, 7890, 8123, 8456],
      fill: true,
      borderColor: '#999',
      backgroundColor: '#99999915',
      borderDash: [5, 5],
      tension: 0.4,
      borderWidth: 2,
    },
  ],
};

const mockEngagementMetricsData = {
  labels: ['Bounce Rate', 'Conversion', 'Engagement', 'Retention', 'Growth'],
  datasets: [
    {
      type: 'radar',
      label: 'Current Period',
      data: [42, 2.8, 68, 72, 15],
      fill: true,
      backgroundColor: `${CHART_COLORS[0]}20`,
      borderColor: CHART_COLORS[0],
      pointBackgroundColor: CHART_COLORS[0],
      borderWidth: 2,
    },
    {
      type: 'radar',
      label: 'Previous Period',
      data: [45, 2.3, 65, 68, 10],
      fill: true,
      backgroundColor: '#99999910',
      borderColor: '#999',
      pointBackgroundColor: '#999',
      borderDash: [5, 5],
      borderWidth: 2,
    },
  ],
};

const mockTopPages = [
  { path: '/home', views: 5234, bounce: 42 },
  { path: '/about', views: 3421, bounce: 35 },
  { path: '/pricing', views: 2890, bounce: 55 },
  { path: '/contact', views: 1523, bounce: 28 },
];

const mockRegions = [
  { name: 'United States', visitors: 5432, percent: 43 },
  { name: 'Canada', visitors: 1234, percent: 10 },
  { name: 'United Kingdom', visitors: 1023, percent: 8 },
  { name: 'Germany', visitors: 892, percent: 7 },
  { name: 'Others', visitors: 3423, percent: 32 },
];

const StatBox = ({ label, value, subtext }: any) => (
  <Column
    padding="md"
    gap="xs"
    style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 8,
      border: '1px solid var(--color-border)',
    }}
  >
    <Text size="xs" style={{ color: 'var(--color-text-secondary)' }}>
      {label}
    </Text>
    <Heading level={4} style={{ margin: 0 }}>
      {value}
    </Heading>
    {subtext && (
      <Text size="xs" style={{ color: '#2680eb' }}>
        {subtext}
      </Text>
    )}
  </Column>
);

const CompactChartCard = ({ title, children, spanCol = false }: any) => (
  <Column
    padding="md"
    gap="sm"
    style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 8,
      border: '1px solid var(--color-border)',
      gridColumn: spanCol ? '1 / -1' : 'auto',
      minHeight: 280,
    }}
  >
    <Heading level={5} style={{ margin: 0, fontSize: 13 }}>
      {title}
    </Heading>
    <div style={{ height: 240, position: 'relative', flex: 1 }}>
      {children}
    </div>
  </Column>
);

export default function CompactGridVisualization() {
  return (
    <Column padding="lg" gap="md" width="100%" maxWidth="1400px" margin="0 auto">
      <Column gap="xs">
        <Heading level={1} style={{ fontSize: 24 }}>
          Analytics Dashboard
        </Heading>
        <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
          July 1 - July 30, 2024 • Last 30 days
        </Text>
      </Column>

      {/* KPI Summary Grid */}
      <Grid columns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="sm">
        <StatBox label="Visitors" value="12.5k" subtext="+12.5% ↑" />
        <StatBox label="Pageviews" value="45.2k" subtext="+8.3% ↑" />
        <StatBox label="Bounce Rate" value="42.5%" subtext="-2.1% ↓" />
        <StatBox label="Avg Session" value="3.2m" subtext="+5.2% ↑" />
      </Grid>

      {/* Main Charts Grid */}
      <Grid
        columns={{ xs: '1fr', md: '2fr 1fr' }}
        gap="md"
      >
        <CompactChartCard title="Visitor Trend (Monthly)" spanCol={false}>
          <Chart type="line" chartData={mockVisitorTrendData} height="100%" />
        </CompactChartCard>

        <CompactChartCard title="Performance Metrics" spanCol={false}>
          <Chart type="radar" chartData={mockEngagementMetricsData} height="100%" />
        </CompactChartCard>
      </Grid>

      {/* Bottom Row - Tables */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="md">
        <Column
          padding="md"
          gap="sm"
          style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
          }}
        >
          <Heading level={5} style={{ margin: 0, fontSize: 13 }}>
            Top Pages
          </Heading>
          <Column gap="xs">
            {mockTopPages.map((page) => (
              <Row
                key={page.path}
                justifyContent="space-between"
                padding="xs"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <Text size="sm" style={{ flex: 1 }}>
                  {page.path}
                </Text>
                <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {page.views.toLocaleString()} • {page.bounce}%
                </Text>
              </Row>
            ))}
          </Column>
        </Column>

        <Column
          padding="md"
          gap="sm"
          style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 8,
            border: '1px solid var(--color-border)',
          }}
        >
          <Heading level={5} style={{ margin: 0, fontSize: 13 }}>
            Top Regions
          </Heading>
          <Column gap="xs">
            {mockRegions.map((region) => (
              <Row
                key={region.name}
                justifyContent="space-between"
                padding="xs"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                <Column gap="xs" style={{ flex: 1 }}>
                  <Text size="sm">{region.name}</Text>
                  <div
                    style={{
                      height: 4,
                      background: 'var(--color-border)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: '#2680eb',
                        width: `${region.percent}%`,
                      }}
                    />
                  </div>
                </Column>
                <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {region.visitors.toLocaleString()}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
      </Grid>
    </Column>
  );
}
