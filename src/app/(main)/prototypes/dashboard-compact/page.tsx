'use client';

import { Column, Row, Grid, Heading, Text, Box, Button } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Chart } from '@/components/charts/Chart';
import { DataTable } from '@umami/react-zen';
import { CHART_COLORS } from '@/lib/constants';

// Mock data
const mockDayData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      type: 'line',
      label: 'Visitors',
      data: [8234, 9125, 8945, 10234],
      borderColor: CHART_COLORS[0],
      backgroundColor: `${CHART_COLORS[0]}15`,
      fill: true,
      tension: 0.4,
      borderWidth: 2,
    },
  ],
};

const mockMetrics = {
  visitors: 12534,
  pageviews: 45230,
  bounceRate: 42.5,
  avgTime: 3.24,
};

const mockEvents = [
  { name: 'Click', count: 2345, change: 12 },
  { name: 'View', count: 1876, change: -5 },
  { name: 'Purchase', count: 543, change: 23 },
  { name: 'Signup', count: 234, change: 8 },
];

const mockDevices = [
  { type: 'Desktop', count: 6234, percent: 49 },
  { type: 'Mobile', count: 4567, percent: 36 },
  { type: 'Tablet', count: 1733, percent: 15 },
];

export default function DashboardCompact() {
  return (
    <PageBody gap>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="2">
          <Heading level={1}>Analytics Compact</Heading>
          <Text color="muted">Last 30 days</Text>
        </Column>
      </Row>

      {/* Small Metrics Grid */}
      <Grid columns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="2">
        <Box
          padding="3"
          borderRadius="2"
          backgroundColor="1"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <Text size="sm" color="muted">
            Visitors
          </Text>
          <Heading level={3} style={{ margin: '8px 0' }}>
            12.5k
          </Heading>
          <Text size="xs" color="muted">
            +12.5% vs last month
          </Text>
        </Box>

        <Box
          padding="3"
          borderRadius="2"
          backgroundColor="1"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <Text size="sm" color="muted">
            Pageviews
          </Text>
          <Heading level={3} style={{ margin: '8px 0' }}>
            45.2k
          </Heading>
          <Text size="xs" color="muted">
            +8.3% vs last month
          </Text>
        </Box>

        <Box
          padding="3"
          borderRadius="2"
          backgroundColor="1"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <Text size="sm" color="muted">
            Bounce Rate
          </Text>
          <Heading level={3} style={{ margin: '8px 0' }}>
            42.5%
          </Heading>
          <Text size="xs" color="muted">
            -2.1% vs last month
          </Text>
        </Box>

        <Box
          padding="3"
          borderRadius="2"
          backgroundColor="1"
          style={{ border: '1px solid var(--color-border)' }}
        >
          <Text size="sm" color="muted">
            Avg Session
          </Text>
          <Heading level={3} style={{ margin: '8px 0' }}>
            3m 24s
          </Heading>
          <Text size="xs" color="muted">
            +5.2% vs last month
          </Text>
        </Box>
      </Grid>

      {/* Trend Chart */}
      <Panel title="Monthly Trend">
        <Box height="250px">
          <Chart type="line" chartData={mockDayData} height="100%" />
        </Box>
      </Panel>

      {/* Three Column Layout */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="3">
        <Panel title="Top Events">
          <LoadingPanel data={mockEvents} isLoading={false} error={null}>
            <Column gap="2">
              {mockEvents.map((event) => (
                <Row
                  key={event.name}
                  justifyContent="space-between"
                  padding="2"
                  style={{
                    background: 'var(--color-background)',
                    borderRadius: '4px',
                  }}
                >
                  <Column gap="1">
                    <Text weight={500} size="sm">
                      {event.name}
                    </Text>
                    <Text size="xs" color="muted">
                      {event.count.toLocaleString()}
                    </Text>
                  </Column>
                  <Box
                    style={{
                      color: event.change >= 0 ? '#44b556' : '#e34850',
                    }}
                  >
                    <Text weight={500} size="sm">
                      {event.change >= 0 ? '+' : ''}{event.change}%
                    </Text>
                  </Box>
                </Row>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>

        <Panel title="Device Breakdown">
          <LoadingPanel data={mockDevices} isLoading={false} error={null}>
            <Column gap="2">
              {mockDevices.map((device, idx) => (
                <Column key={device.type} gap="1">
                  <Row justifyContent="space-between">
                    <Text size="sm">{device.type}</Text>
                    <Text size="sm" weight={500}>
                      {device.percent}%
                    </Text>
                  </Row>
                  <Box
                    height="4px"
                    backgroundColor="1"
                    borderRadius="2"
                    overflow="hidden"
                  >
                    <Box
                      height="100%"
                      backgroundColor={CHART_COLORS[idx]}
                      width={`${device.percent}%`}
                    />
                  </Box>
                  <Text size="xs" color="muted">
                    {device.count.toLocaleString()} sessions
                  </Text>
                </Column>
              ))}
            </Column>
          </LoadingPanel>
        </Panel>

        <Panel title="Quick Stats">
          <Column gap="3">
            <Column gap="1">
              <Row justifyContent="space-between">
                <Text size="sm">Unique Visitors</Text>
                <Text weight={500}>8,234</Text>
              </Row>
              <Text size="xs" color="muted">
                65.7% of total traffic
              </Text>
            </Column>

            <Column gap="1">
              <Row justifyContent="space-between">
                <Text size="sm">Return Visitors</Text>
                <Text weight={500}>4,300</Text>
              </Row>
              <Text size="xs" color="muted">
                34.3% of total traffic
              </Text>
            </Column>

            <Column gap="1">
              <Row justifyContent="space-between">
                <Text size="sm">Conversion Rate</Text>
                <Text weight={500}>2.7%</Text>
              </Row>
              <Text size="xs" color="muted">
                338 conversions
              </Text>
            </Column>

            <Button
              style={{
                marginTop: '8px',
                width: '100%',
              }}
            >
              View Full Report
            </Button>
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
