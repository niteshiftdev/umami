'use client';

import { Column, Row, Grid, Heading, Text, Box } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

const mockMainChart = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      type: 'line',
      label: 'Visitors',
      data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
      borderColor: CHART_COLORS[0],
      backgroundColor: `${CHART_COLORS[0]}15`,
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 0,
    },
  ],
};

const mockConversionChart = {
  labels: ['Page Views', 'Sign Ups', 'Purchases', 'Subscriptions'],
  datasets: [
    {
      type: 'bar',
      data: [45230, 8945, 3421, 1234],
      backgroundColor: CHART_COLORS.slice(0, 4),
    },
  ],
};

const insights = [
  {
    title: 'Peak Traffic',
    value: '2 PM - 4 PM',
    description: '+23% above average',
    color: CHART_COLORS[0],
  },
  {
    title: 'Top Source',
    value: 'Organic Search',
    description: '71% of traffic',
    color: CHART_COLORS[1],
  },
  {
    title: 'Engagement',
    value: '/pricing page',
    description: '68% avg time on page',
    color: CHART_COLORS[2],
  },
];

export default function DashboardFocused() {
  return (
    <PageBody gap>
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Heading level={1}>Performance Dashboard</Heading>
          <Text color="muted">Focus on key metrics and insights</Text>
        </Column>
      </Row>

      {/* Key Insight Cards */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="3">
        {insights.map((insight) => (
          <Box
            key={insight.title}
            padding="4"
            borderRadius="2"
            style={{
              border: `2px solid ${insight.color}30`,
              borderLeft: `4px solid ${insight.color}`,
              background: 'var(--color-background-secondary)',
            }}
          >
            <Text size="sm" color="muted" style={{ textTransform: 'uppercase' }}>
              {insight.title}
            </Text>
            <Heading level={2} style={{ margin: '8px 0', color: insight.color }}>
              {insight.value}
            </Heading>
            <Text size="sm">{insight.description}</Text>
          </Box>
        ))}
      </Grid>

      {/* Main Visitor Chart - Full Width */}
      <Panel title="Visitor Trend" fullscreen>
        <Box height="350px">
          <Chart type="line" chartData={mockMainChart} height="100%" />
        </Box>
      </Panel>

      {/* Two Column Bottom Section */}
      <Grid columns={{ xs: '1fr', lg: '2fr 1fr' }} gap="3">
        {/* Conversion Funnel */}
        <Panel title="Conversion Funnel">
          <Column gap="3">
            <Box height="280px">
              <Chart type="bar" chartData={mockConversionChart} height="100%" />
            </Box>
            <Column
              gap="1"
              padding="3"
              borderRadius="2"
              style={{ background: 'var(--color-background)' }}
            >
              <Row justifyContent="space-between">
                <Text color="muted">Overall Conversion Rate</Text>
                <Heading level={3} style={{ margin: 0 }}>
                  2.7%
                </Heading>
              </Row>
              <Text size="sm" color="muted">
                338 conversions from 12,500 visitors
              </Text>
            </Column>
          </Column>
        </Panel>

        {/* Summary Stats */}
        <Panel title="Summary">
          <Column gap="3">
            <Column gap="1">
              <Text size="sm" color="muted">
                Total Visitors
              </Text>
              <Heading level={2} style={{ margin: 0 }}>
                12.5k
              </Heading>
              <Text size="xs" color="muted">
                +12.5% vs last period
              </Text>
            </Column>

            <Column gap="1">
              <Text size="sm" color="muted">
                Bounce Rate
              </Text>
              <Heading level={2} style={{ margin: 0 }}>
                42.5%
              </Heading>
              <Text size="xs" color="muted">
                -2.1% vs last period
              </Text>
            </Column>

            <Column gap="1">
              <Text size="sm" color="muted">
                Avg Session
              </Text>
              <Heading level={2} style={{ margin: 0 }}>
                3m 24s
              </Heading>
              <Text size="xs" color="muted">
                +5.2% vs last period
              </Text>
            </Column>

            <Box
              height="1px"
              backgroundColor="1"
              style={{ margin: '8px 0' }}
            />

            <Column gap="1">
              <Text size="sm" color="muted">
                Return Visitors
              </Text>
              <Row justifyContent="space-between" alignItems="center">
                <Heading level={3} style={{ margin: 0 }}>
                  38%
                </Heading>
                <Text size="xs" color="muted">
                  4,745 users
                </Text>
              </Row>
            </Column>
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
