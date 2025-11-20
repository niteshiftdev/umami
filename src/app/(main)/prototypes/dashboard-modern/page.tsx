'use client';

import { Column, Row, Grid, Heading, Text, Box } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

// Mock data
const mockMetrics = {
  visitors: 12534,
  previousVisitors: 11123,
  pageviews: 45230,
  previousPageviews: 42156,
  sessions: 8923,
  previousSessions: 8234,
  bounceRate: 42.5,
};

const mockChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      type: 'bar',
      label: 'Visitors',
      data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
      backgroundColor: CHART_COLORS[0],
      borderRadius: 4,
    },
    {
      type: 'bar',
      label: 'Sessions',
      data: [800, 1200, 1000, 1400, 1100, 1600, 1300],
      backgroundColor: CHART_COLORS[1],
      borderRadius: 4,
    },
  ],
};

const mockPageData = [
  { path: '/home', views: 5234, bounce: 42 },
  { path: '/about', views: 3421, bounce: 35 },
  { path: '/pricing', views: 2890, bounce: 55 },
  { path: '/contact', views: 1523, bounce: 28 },
  { path: '/docs', views: 1200, bounce: 20 },
];

const mockSourceData = [
  { name: 'Organic Search', count: 8934, percent: 71 },
  { name: 'Direct', count: 2123, percent: 17 },
  { name: 'Referral', count: 875, percent: 7 },
  { name: 'Social', count: 370, percent: 3 },
  { name: 'Email', count: 232, percent: 2 },
];

export default function DashboardModern() {
  return (
    <PageBody gap>
      <Column gap="3">
        <Heading level={1}>Website Analytics Dashboard</Heading>
        <Text color="muted">July 1 - July 30, 2024</Text>
      </Column>

      {/* Key Metrics */}
      <MetricsBar>
        <MetricCard
          value={mockMetrics.visitors}
          previousValue={mockMetrics.previousVisitors}
          label="Visitors"
          showChange
        />
        <MetricCard
          value={mockMetrics.pageviews}
          previousValue={mockMetrics.previousPageviews}
          label="Pageviews"
          showChange
        />
        <MetricCard
          value={mockMetrics.sessions}
          previousValue={mockMetrics.previousSessions}
          label="Sessions"
          showChange
        />
        <MetricCard value={mockMetrics.bounceRate} label="Bounce Rate" unit="%" />
      </MetricsBar>

      {/* Main Chart */}
      <Panel title="Visitor Trends" fullscreen>
        <Box height="400px">
          <Chart type="bar" chartData={mockChartData} height="100%" />
        </Box>
      </Panel>

      {/* Two Column Layout */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel title="Top Pages">
          <LoadingPanel data={mockPageData} isLoading={false} error={null}>
            <Column gap="2">
              {mockPageData.map((page) => (
                <Row
                  key={page.path}
                  justifyContent="space-between"
                  alignItems="center"
                  padding="2"
                  style={{
                    background: 'var(--color-background)',
                    borderRadius: '6px',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <Column gap="1">
                    <Text weight={500}>{page.path}</Text>
                    <Text size="sm" color="muted">
                      {page.views.toLocaleString()} views
                    </Text>
                  </Column>
                  <Box
                    padding="2"
                    backgroundColor="1"
                    borderRadius="2"
                    style={{ minWidth: '50px', textAlign: 'center' }}
                  >
                    <Text size="sm" weight={500}>
                      {page.bounce}%
                    </Text>
                  </Box>
                </Row>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>

        <Panel title="Traffic Sources">
          <LoadingPanel data={mockSourceData} isLoading={false} error={null}>
            <Column gap="2">
              {mockSourceData.map((source) => (
                <Column key={source.name} gap="1">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight={500}>{source.name}</Text>
                    <Text size="sm" color="muted">
                      {source.count.toLocaleString()}
                    </Text>
                  </Row>
                  <Box
                    height="6px"
                    backgroundColor="1"
                    borderRadius="2"
                    overflow="hidden"
                  >
                    <Box
                      height="100%"
                      backgroundColor="primary"
                      width={`${source.percent}%`}
                      style={{ transition: 'width 0.3s ease' }}
                    />
                  </Box>
                  <Text size="xs" color="muted">
                    {source.percent}% of traffic
                  </Text>
                </Column>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>
      </Grid>
    </PageBody>
  );
}
