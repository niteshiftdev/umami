'use client';

import { Column, Grid, Heading, Row, Text } from '@umami/react-zen';
import { useMemo } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useMessages } from '@/components/hooks';
import { getThemeColors } from '@/lib/colors';
import { useTheme } from '@umami/react-zen';
import { formatNumber } from '@/lib/format';

export default function ProductAnalyticsDashboard() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Mock data for engagement metrics over time (last 30 days)
  const engagementTrendData = useMemo(() => {
    const today = new Date();
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }

    return {
      labels: dates.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Session Duration (min)',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 10) + 5,
          })),
          backgroundColor: colors?.chart?.primary || '#2680eb',
          borderColor: colors?.chart?.primary || '#2680eb',
          borderWidth: 0,
        },
        {
          label: 'Pages per Session',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 4) + 2,
          })),
          backgroundColor: colors?.chart?.secondary || '#9256d9',
          borderColor: colors?.chart?.secondary || '#9256d9',
          borderWidth: 0,
        },
      ],
    };
  }, [colors]);

  // User behavior funnel data
  const funnelData = useMemo(() => ({
    labels: ['Visitors', 'Product Page', 'Demo Signup', 'Trial Activated', 'Paying Customer'],
    datasets: [
      {
        label: 'Users',
        data: [15234, 10156, 6845, 4923, 1847],
        backgroundColor: [
          colors?.chart?.primary || '#2680eb',
          colors?.chart?.secondary || '#9256d9',
          colors?.chart?.tertiary || '#44b556',
          colors?.chart?.warning || '#e68619',
          colors?.chart?.success || '#44b556',
        ],
      },
    ],
  }), [colors]);

  // Feature adoption data
  const featureAdoptionData = useMemo(() => ({
    labels: ['Search', 'Filters', 'Exports', 'Custom Alerts', 'API Access', 'Real-time Analytics'],
    datasets: [
      {
        label: 'Adoption Rate (%)',
        data: [92, 78, 65, 43, 38, 28],
        backgroundColor: colors?.chart?.primary || '#2680eb',
        borderColor: colors?.chart?.primary || '#2680eb',
        borderWidth: 2,
      },
    ],
  }), [colors]);

  // Session quality distribution
  const sessionQualityData = useMemo(() => ({
    labels: ['High Value (10+ pages)', 'Medium Value (5-9 pages)', 'Low Value (2-4 pages)', 'Bounce'],
    datasets: [
      {
        label: 'Sessions',
        data: [2847, 4156, 5923, 2308],
        backgroundColor: [
          '#44b556',
          '#2680eb',
          '#e68619',
          '#e34850',
        ],
      },
    ],
  }), [colors]);

  // Event completion rates
  const eventCompletionData = useMemo(() => {
    const events = [
      { name: 'Sign Up Completed', rate: 87 },
      { name: 'Profile Setup', rate: 72 },
      { name: 'First Report Created', rate: 65 },
      { name: 'Shared with Team', rate: 43 },
      { name: 'Custom Dashboard Built', rate: 28 },
    ];
    return {
      labels: events.map(e => e.name),
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: events.map(e => e.rate),
          backgroundColor: colors?.chart?.primary || '#2680eb',
          borderColor: colors?.chart?.primary || '#2680eb',
          borderWidth: 0,
        },
      ],
    };
  }, [colors]);

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader
          title="Product Analytics Dashboard"
          description="User engagement, behavior patterns, and feature adoption metrics"
        />

        {/* Key Metrics Row */}
        <GridRow layout="three" marginBottom="4">
          <Panel>
            <MetricCard
              label="Avg Session Duration"
              value={7.3}
              previousValue={6.8}
              change={0.5}
              showLabel
              showChange
              formatValue={(v) => `${v.toFixed(1)}m`}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Pages per Session"
              value={3.2}
              previousValue={2.9}
              change={0.3}
              showLabel
              showChange
              formatValue={formatNumber}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Bounce Rate"
              value={18.5}
              previousValue={22.3}
              change={-3.8}
              showLabel
              showChange
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
          </Panel>
        </GridRow>

        {/* Engagement Trends */}
        <GridRow layout="one" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="Engagement Trends (30 Days)">
            <BarChart
              chartData={engagementTrendData}
              stacked={false}
              height="350px"
              XAxisType="linear"
              renderXLabel={(label, index, values) => {
                // Show every 5th label to avoid crowding
                return index % 5 === 0 ? label : '';
              }}
            />
          </Panel>
        </GridRow>

        {/* Session Quality & Feature Adoption */}
        <GridRow layout="two" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="Session Quality Distribution">
            <PieChart
              chartData={sessionQualityData}
              type="doughnut"
              height="350px"
            />
          </Panel>
          <Panel allowFullscreen title="Feature Adoption Rates">
            <BarChart
              chartData={featureAdoptionData}
              height="350px"
              XAxisType="linear"
              renderYLabel={(label) => `${label}%`}
            />
          </Panel>
        </GridRow>

        {/* Conversion Funnel & Event Completion */}
        <GridRow layout="two" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="User Behavior Funnel">
            <PieChart
              chartData={funnelData}
              type="pie"
              height="350px"
            />
          </Panel>
          <Panel allowFullscreen title="Key Event Completion Rates">
            <BarChart
              chartData={eventCompletionData}
              height="350px"
              XAxisType="linear"
              renderYLabel={(label) => `${label}%`}
            />
          </Panel>
        </GridRow>

        {/* Engagement Insights */}
        <Panel allowFullscreen title="Engagement Insights & Recommendations">
          <Column gap="3" padding="4">
            <Row gap="4">
              <Column flex="1">
                <Heading size="3">📈 Key Findings</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Session duration increased 7% week-over-week, indicating stronger user engagement<br/>
                  • High-value sessions (10+ pages) account for 23% of all traffic<br/>
                  • Feature adoption shows correlation between usage and retention<br/>
                  • Bounce rate improved 3.8% through recent UX improvements
                </Text>
              </Column>
              <Column flex="1">
                <Heading size="3">🎯 Recommendations</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Promote custom dashboard feature - 28% adoption indicates strong demand<br/>
                  • Implement guided tour for API access (38% adoption rate)<br/>
                  • Consider incentives for team sharing feature (43% adoption)<br/>
                  • Analyze low-value sessions to optimize onboarding
                </Text>
              </Column>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
