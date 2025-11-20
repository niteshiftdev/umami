import { Grid, Column, Row, Heading, Text } from '@umami/react-zen';
import { AreaChart, BarChart, RadarChart } from 'react-chartjs-2';

const mockVisitorTrend = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Visitors',
      data: [8234, 9125, 8945, 10234],
      fill: true,
      borderColor: '#2680eb',
      backgroundColor: 'rgba(38, 128, 235, 0.15)',
      tension: 0.4,
    },
    {
      label: 'Previous Month',
      data: [7234, 7890, 8123, 8456],
      fill: true,
      borderColor: '#d9d9d9',
      backgroundColor: 'rgba(217, 217, 217, 0.1)',
      borderDash: [5, 5],
      tension: 0.4,
    },
  ],
};

const mockEngagementMetrics = {
  labels: ['Bounce Rate', 'Conversion', 'Engagement', 'Retention', 'Growth'],
  datasets: [
    {
      label: 'Current Period',
      data: [42, 2.8, 68, 72, 15],
      fill: true,
      backgroundColor: 'rgba(38, 128, 235, 0.2)',
      borderColor: '#2680eb',
      pointBackgroundColor: '#2680eb',
    },
    {
      label: 'Previous Period',
      data: [45, 2.3, 65, 68, 10],
      fill: true,
      backgroundColor: 'rgba(217, 217, 217, 0.1)',
      borderColor: '#d9d9d9',
      pointBackgroundColor: '#d9d9d9',
      borderDash: [5, 5],
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
    <Column padding="md" gap="md">
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
          <AreaChart
            data={mockVisitorTrend}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true, position: 'top' as const },
              },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </CompactChartCard>

        <CompactChartCard title="Performance Metrics" spanCol={false}>
          <RadarChart
            data={mockEngagementMetrics}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom' as const } },
              scales: { r: { beginAtZero: true, max: 100 } },
            }}
          />
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
