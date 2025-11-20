'use client';
import { useMemo } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { Column, Grid, Row, Text, Heading, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber, formatLongNumber } from '@/lib/format';
import { colord } from 'colord';

// Mock data for Product Analytics
const generateEngagementData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return {
    labels: days,
    datasets: [
      {
        label: 'Daily Active Users',
        data: days.map((_, i) => ({
          x: new Date(2025, 10, 18 + i).toISOString(),
          y: 8500 + Math.floor(Math.random() * 2000),
        })),
        backgroundColor: colord(CHART_COLORS[0]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[0]).alpha(0.7).toRgbString(),
      },
    ],
  };
};

const generateRetentionData = () => {
  return {
    labels: ['Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 30'],
    datasets: [
      {
        label: 'Retention Rate',
        data: [100, 68, 52, 41, 28],
        backgroundColor: CHART_COLORS.slice(0, 5).map(c => colord(c).alpha(0.6).toRgbString()),
        borderColor: CHART_COLORS.slice(0, 5),
        borderWidth: 2,
      },
    ],
  };
};

const generateFeatureAdoptionData = () => {
  const features = ['Dashboard', 'Reports', 'Analytics', 'Exports', 'API', 'Integrations'];
  return {
    labels: features,
    datasets: [
      {
        label: 'Feature Usage %',
        data: [92, 78, 85, 45, 31, 58],
        backgroundColor: CHART_COLORS.map(c => colord(c).alpha(0.5).toRgbString()),
        borderColor: CHART_COLORS,
        borderWidth: 2,
      },
    ],
  };
};

const generateFunnelData = () => {
  return {
    labels: ['Visited', 'Signed Up', 'Activated', 'Retained', 'Referred'],
    datasets: [
      {
        label: 'Users',
        data: [15000, 8500, 6200, 4100, 1850],
        backgroundColor: [
          colord(CHART_COLORS[2]).alpha(0.9).toRgbString(),
          colord(CHART_COLORS[2]).alpha(0.7).toRgbString(),
          colord(CHART_COLORS[2]).alpha(0.5).toRgbString(),
          colord(CHART_COLORS[2]).alpha(0.3).toRgbString(),
          colord(CHART_COLORS[2]).alpha(0.2).toRgbString(),
        ],
        borderColor: CHART_COLORS[2],
        borderWidth: 2,
      },
    ],
  };
};

const generateSessionData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return {
    labels: hours.map(h => `${h}:00`),
    datasets: [
      {
        label: 'Active Sessions',
        data: hours.map(h => {
          // Peak hours 9am-5pm, lower at night
          const baseValue = h >= 9 && h <= 17 ? 450 : h >= 6 && h <= 22 ? 280 : 80;
          return baseValue + Math.floor(Math.random() * 100);
        }),
        backgroundColor: colord(CHART_COLORS[1]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[1]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
};

export function ProductAnalyticsPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const engagementData = useMemo(() => generateEngagementData(), []);
  const retentionData = useMemo(() => generateRetentionData(), []);
  const featureData = useMemo(() => generateFeatureAdoptionData(), []);
  const funnelData = useMemo(() => generateFunnelData(), []);
  const sessionData = useMemo(() => generateSessionData(), []);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader
          title="Product Analytics Dashboard"
          description="Track user engagement, behavior patterns, and product adoption"
        />

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            value={8742}
            previousValue={8100}
            change={642}
            label="Daily Active Users"
            formatValue={formatNumber}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={24500}
            previousValue={23200}
            change={1300}
            label="Monthly Active Users"
            formatValue={formatNumber}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={28}
            previousValue={24}
            change={4}
            label="Day 30 Retention %"
            formatValue={(n) => `${Math.round(n)}%`}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={4.2}
            previousValue={3.8}
            change={0.4}
            label="Avg. Session Duration"
            formatValue={(n) => `${n.toFixed(1)}m`}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={6.8}
            previousValue={6.3}
            change={0.5}
            label="Pages per Session"
            formatValue={(n) => n.toFixed(1)}
            showLabel={true}
            showChange={true}
          />
        </MetricsBar>

        {/* User Engagement Trends */}
        <Panel title="User Engagement Trends" allowFullscreen={true}>
          <div style={{ height: '300px', padding: '20px' }}>
            <BarChart
              chartData={engagementData}
              unit="day"
              stacked={false}
            />
          </div>
        </Panel>

        {/* Two column layout */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
          {/* Retention Cohort Analysis */}
          <Panel title="Retention Cohort Analysis" allowFullscreen={true}>
            <div style={{ height: '280px', padding: '20px' }}>
              <Chart
                type="line"
                chartData={retentionData}
                chartOptions={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (value: number) => `${value}%`,
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <Column padding="4" gap="2">
              <Text size="1" color="muted">
                Cohort retention from Nov 1-7, 2025. Day 1 = 100% baseline (8,500 users).
              </Text>
            </Column>
          </Panel>

          {/* Feature Adoption */}
          <Panel title="Feature Adoption Rate" allowFullscreen={true}>
            <div style={{ height: '280px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={featureData}
                chartOptions={{
                  indexAxis: 'y' as const,
                  scales: {
                    x: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (value: number) => `${value}%`,
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </Panel>
        </Grid>

        {/* Conversion Funnel & Session Activity */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
          {/* Conversion Funnel */}
          <Panel title="User Acquisition Funnel" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={funnelData}
                chartOptions={{
                  indexAxis: 'y' as const,
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongNumber(value),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <Column padding="4" gap="1">
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Signup Conversion:</Text>
                <Text size="1" weight="bold">56.7%</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Activation Rate:</Text>
                <Text size="1" weight="bold">72.9%</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Overall Conversion:</Text>
                <Text size="1" weight="bold">12.3%</Text>
              </Row>
            </Column>
          </Panel>

          {/* Session Activity (24h) */}
          <Panel title="Session Activity (24h Pattern)" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="line"
                chartData={sessionData}
                chartOptions={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                        maxTicksLimit: 12,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <Column padding="4" gap="2">
              <Text size="1" color="muted">
                Peak usage: 9AM-5PM EST (avg. 470 concurrent sessions)
              </Text>
            </Column>
          </Panel>
        </Grid>

        {/* Behavioral Insights */}
        <Panel title="Behavioral Insights">
          <Column padding="6" gap="4">
            <Row gap="4" wrap="wrap">
              <Column gap="2" style={{ flex: '1 1 200px' }}>
                <Text weight="bold" size="6">63%</Text>
                <Text size="1" color="muted">Power Users (5+ sessions/week)</Text>
              </Column>
              <Column gap="2" style={{ flex: '1 1 200px' }}>
                <Text weight="bold" size="6">2.8x</Text>
                <Text size="1" color="muted">Higher retention with integrations</Text>
              </Column>
              <Column gap="2" style={{ flex: '1 1 200px' }}>
                <Text weight="bold" size="6">4.2m</Text>
                <Text size="1" color="muted">Avg. session duration (mins)</Text>
              </Column>
              <Column gap="2" style={{ flex: '1 1 200px' }}>
                <Text weight="bold" size="6">18%</Text>
                <Text size="1" color="muted">Weekly churn rate</Text>
              </Column>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
