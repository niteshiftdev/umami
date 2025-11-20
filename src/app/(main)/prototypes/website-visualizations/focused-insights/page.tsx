'use client';

import { Grid, Column, Row, Heading, Text } from '@umami/react-zen';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';

const mockMainMetricData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      type: 'line',
      label: 'Visitors',
      data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
      fill: true,
      borderColor: CHART_COLORS[0],
      backgroundColor: `${CHART_COLORS[0]}15`,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
  ],
};

const mockConversionFunnelData = {
  labels: ['Page Views', 'Sign Ups', 'Purchases', 'Subscriptions'],
  datasets: [
    {
      type: 'bar',
      data: [45230, 8945, 3421, 1234],
      backgroundColor: CHART_COLORS.slice(0, 4),
      borderRadius: 0,
    },
  ],
};

const mockInsights = [
  {
    title: 'Peak Hours',
    value: '2 PM - 4 PM',
    description: 'Highest traffic concentration',
    trend: '+23% above average',
    color: '#2680eb',
  },
  {
    title: 'Top Source',
    value: 'Organic Search',
    description: '8,934 visitors (71%)',
    trend: '+12% growth this month',
    color: '#44b556',
  },
  {
    title: 'Most Engaged',
    value: '/pricing',
    description: '68% engagement rate',
    trend: 'No bounce detected',
    color: '#e68619',
  },
];

const InsightBox = ({ title, value, description, trend, color }: any) => (
  <Column
    padding="lg"
    gap="md"
    style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 10,
      border: `2px solid ${color}20`,
      borderLeft: `4px solid ${color}`,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <Column gap="xs">
      <Text size="xs" style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </Text>
      <Heading level={2} style={{ margin: 0, color }}>
        {value}
      </Heading>
      <Text size="sm">{description}</Text>
    </Column>
    <Row
      gap="xs"
      alignItems="center"
      style={{
        padding: '8px 0',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: color,
        }}
      />
      <Text size="xs" style={{ color }}>
        {trend}
      </Text>
    </Row>
  </Column>
);

export default function FocusedInsightsVisualization() {
  return (
    <Column
      padding="lg"
      gap="lg"
      width="100%"
      maxWidth="1400px"
      margin="0 auto"
    >
      {/* Header with Controls */}
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="sm">
          <Heading level={1}>Website Performance</Heading>
          <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
            Last 30 days • Updated 2 minutes ago
          </Text>
        </Column>
      </Row>

      {/* Main Chart - Full Width */}
      <Column
        padding="lg"
        gap="md"
        style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 12,
          border: '1px solid var(--color-border)',
        }}
      >
        <Row justifyContent="space-between" alignItems="center">
          <Column gap="xs">
            <Heading level={3} style={{ margin: 0 }}>
              Visitor Growth
            </Heading>
            <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
              Daily visitor count with trend comparison
            </Text>
          </Column>
          <Text
            size="sm"
            style={{
              padding: '4px 12px',
              background: '#44b55620',
              color: '#44b556',
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            ↑ 12.5% from last month
          </Text>
        </Row>
        <div style={{ height: 300, position: 'relative' }}>
          <Chart type="line" chartData={mockMainMetricData} height="100%" />
        </div>
      </Column>

      {/* Key Insights */}
      <Column gap="sm">
        <Heading level={3} style={{ margin: 0 }}>
          Key Insights
        </Heading>
        <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="md">
          {mockInsights.map((insight, idx) => (
            <InsightBox key={idx} {...insight} />
          ))}
        </Grid>
      </Column>

      {/* Bottom Charts Row */}
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="md">
        {/* Conversion Funnel */}
        <Column
          padding="lg"
          gap="md"
          style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 12,
            border: '1px solid var(--color-border)',
          }}
        >
          <Column gap="xs">
            <Heading level={3} style={{ margin: 0 }}>
              Conversion Funnel
            </Heading>
            <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
              User journey from initial view to subscription
            </Text>
          </Column>
          <div style={{ height: 280, position: 'relative' }}>
            <Chart type="bar" chartData={mockConversionFunnelData} height="100%" />
          </div>
          <Row
            justifyContent="space-between"
            alignItems="center"
            padding="sm"
            style={{ background: 'var(--color-background)', borderRadius: 6 }}
          >
            <Column gap="xs">
              <Text size="xs" style={{ color: 'var(--color-text-secondary)' }}>
                Overall Conversion
              </Text>
              <Heading level={3} style={{ margin: 0 }}>
                2.7%
              </Heading>
            </Column>
          </Row>
        </Column>

        {/* Quick Stats */}
        <Column
          padding="lg"
          gap="md"
          style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 12,
            border: '1px solid var(--color-border)',
          }}
        >
          <Heading level={3} style={{ margin: 0 }}>
            Quick Stats
          </Heading>
          <Column gap="md">
            <Column gap="xs">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm">Bounce Rate</Text>
                <Heading level={4} style={{ margin: 0 }}>
                  42.5%
                </Heading>
              </Row>
              <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#e34850', width: '42.5%' }} />
              </div>
            </Column>

            <Column gap="xs">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm">Avg. Session</Text>
                <Heading level={4} style={{ margin: 0 }}>
                  3m 24s
                </Heading>
              </Row>
              <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#2680eb', width: '68%' }} />
              </div>
            </Column>

            <Column gap="xs">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm">Return Visitors</Text>
                <Heading level={4} style={{ margin: 0 }}>
                  38%
                </Heading>
              </Row>
              <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#44b556', width: '38%' }} />
              </div>
            </Column>
          </Column>
        </Column>
      </Grid>
    </Column>
  );
}
