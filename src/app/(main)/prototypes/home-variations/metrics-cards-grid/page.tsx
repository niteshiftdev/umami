'use client';

import { useState, useMemo } from 'react';
import { Column, Row, Grid, Button, Text, Heading } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { formatNumber } from '@/lib/format';

// Mock sample data for analytics
const MOCK_METRICS = {
  pageviews: 45820,
  previousPageviews: 38420,
  visitors: 12340,
  previousVisitors: 10220,
  sessions: 18945,
  previousSessions: 16234,
  bounceRate: 42.3,
  previousBounceRate: 45.1,
  avgDuration: 285, // seconds
  previousAvgDuration: 240,
};

// Generate time-series data for the chart
const generateChartData = (days: number) => {
  const data = [];
  const baseDate = new Date(2024, 11, 3); // Dec 3, 2024

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() - i);

    const variance = Math.sin(i * 0.5) * 2000 + Math.random() * 1000;
    const baseValue = 6500;

    data.push({
      x: date.toISOString().split('T')[0],
      y: Math.max(baseValue + variance, 1000),
      d: date,
    });
  }

  return data;
};

const TIMEFRAME_OPTIONS = [
  { label: 'Last 7 days', value: 7 },
  { label: 'Last 30 days', value: 30 },
  { label: 'Last 90 days', value: 90 },
];

export default function MetricsCardsGridPage() {
  const [timeframe, setTimeframe] = useState(7);

  const chartData = useMemo(() => {
    return {
      labels: [],
      datasets: [
        {
          label: 'Pageviews',
          data: generateChartData(timeframe),
          backgroundColor: 'var(--primary-color)',
          borderColor: 'var(--primary-color)',
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [timeframe]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const pageviewsChange = MOCK_METRICS.pageviews - MOCK_METRICS.previousPageviews;
  const visitorsChange = MOCK_METRICS.visitors - MOCK_METRICS.previousVisitors;
  const sessionsChange = MOCK_METRICS.sessions - MOCK_METRICS.previousSessions;
  const bounceRateChange = MOCK_METRICS.bounceRate - MOCK_METRICS.previousBounceRate;
  const durationChange = MOCK_METRICS.avgDuration - MOCK_METRICS.previousAvgDuration;

  return (
    <PageBody>
      <Column gap="6">
        {/* Header */}
        <Column gap="2" marginY="3">
          <PageHeader title="Home Analytics" showBorder={false} />
          <Text color="muted" size="3">
            Key metrics and performance indicators for your analytics dashboard
          </Text>
        </Column>

        {/* Metrics Grid */}
        <Grid
          columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }}
          gap="4"
          width="100%"
        >
          {/* Pageviews Card */}
          <Column
            padding="5"
            backgroundColor="var(--base-color-1)"
            borderRadius="3"
            border
            gap="3"
            style={{
              boxShadow: 'var(--box-shadow-1)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-2)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-1)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(0)';
            }}
          >
            <Text size="2" weight="semibold" color="muted">
              Pageviews
            </Text>
            <Row justifyContent="space-between" alignItems="center" gap="2">
              <Text size="6" weight="bold">
                {formatNumber(MOCK_METRICS.pageviews)}
              </Text>
              <Column
                paddingX="2"
                paddingY="1"
                borderRadius="2"
                style={{
                  backgroundColor: pageviewsChange >= 0
                    ? 'color-mix(in srgb, var(--success-color), var(--base-color-1) 90%)'
                    : 'color-mix(in srgb, var(--danger-color), var(--base-color-1) 90%)',
                }}
              >
                <Text
                  size="2"
                  weight="semibold"
                  style={{
                    color: pageviewsChange >= 0
                      ? 'var(--success-color)'
                      : 'var(--danger-color)',
                  }}
                >
                  {pageviewsChange >= 0 ? '+' : ''}
                  {Math.round(
                    ((pageviewsChange / MOCK_METRICS.previousPageviews) * 100)
                  )}%
                </Text>
              </Column>
            </Row>
            <Text size="1" color="muted">
              vs previous period
            </Text>
          </Column>

          {/* Visitors Card */}
          <Column
            padding="5"
            backgroundColor="var(--base-color-1)"
            borderRadius="3"
            border
            gap="3"
            style={{
              boxShadow: 'var(--box-shadow-1)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-2)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-1)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(0)';
            }}
          >
            <Text size="2" weight="semibold" color="muted">
              Visitors
            </Text>
            <Row justifyContent="space-between" alignItems="center" gap="2">
              <Text size="6" weight="bold">
                {formatNumber(MOCK_METRICS.visitors)}
              </Text>
              <Column
                paddingX="2"
                paddingY="1"
                borderRadius="2"
                style={{
                  backgroundColor: visitorsChange >= 0
                    ? 'color-mix(in srgb, var(--success-color), var(--base-color-1) 90%)'
                    : 'color-mix(in srgb, var(--danger-color), var(--base-color-1) 90%)',
                }}
              >
                <Text
                  size="2"
                  weight="semibold"
                  style={{
                    color: visitorsChange >= 0
                      ? 'var(--success-color)'
                      : 'var(--danger-color)',
                  }}
                >
                  {visitorsChange >= 0 ? '+' : ''}
                  {Math.round(
                    ((visitorsChange / MOCK_METRICS.previousVisitors) * 100)
                  )}%
                </Text>
              </Column>
            </Row>
            <Text size="1" color="muted">
              vs previous period
            </Text>
          </Column>

          {/* Sessions Card */}
          <Column
            padding="5"
            backgroundColor="var(--base-color-1)"
            borderRadius="3"
            border
            gap="3"
            style={{
              boxShadow: 'var(--box-shadow-1)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-2)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-1)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(0)';
            }}
          >
            <Text size="2" weight="semibold" color="muted">
              Sessions
            </Text>
            <Row justifyContent="space-between" alignItems="center" gap="2">
              <Text size="6" weight="bold">
                {formatNumber(MOCK_METRICS.sessions)}
              </Text>
              <Column
                paddingX="2"
                paddingY="1"
                borderRadius="2"
                style={{
                  backgroundColor: sessionsChange >= 0
                    ? 'color-mix(in srgb, var(--success-color), var(--base-color-1) 90%)'
                    : 'color-mix(in srgb, var(--danger-color), var(--base-color-1) 90%)',
                }}
              >
                <Text
                  size="2"
                  weight="semibold"
                  style={{
                    color: sessionsChange >= 0
                      ? 'var(--success-color)'
                      : 'var(--danger-color)',
                  }}
                >
                  {sessionsChange >= 0 ? '+' : ''}
                  {Math.round(
                    ((sessionsChange / MOCK_METRICS.previousSessions) * 100)
                  )}%
                </Text>
              </Column>
            </Row>
            <Text size="1" color="muted">
              vs previous period
            </Text>
          </Column>

          {/* Bounce Rate Card */}
          <Column
            padding="5"
            backgroundColor="var(--base-color-1)"
            borderRadius="3"
            border
            gap="3"
            style={{
              boxShadow: 'var(--box-shadow-1)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-2)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-1)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(0)';
            }}
          >
            <Text size="2" weight="semibold" color="muted">
              Bounce Rate
            </Text>
            <Row justifyContent="space-between" alignItems="center" gap="2">
              <Text size="6" weight="bold">
                {MOCK_METRICS.bounceRate.toFixed(1)}%
              </Text>
              <Column
                paddingX="2"
                paddingY="1"
                borderRadius="2"
                style={{
                  backgroundColor: bounceRateChange < 0
                    ? 'color-mix(in srgb, var(--success-color), var(--base-color-1) 90%)'
                    : 'color-mix(in srgb, var(--danger-color), var(--base-color-1) 90%)',
                }}
              >
                <Text
                  size="2"
                  weight="semibold"
                  style={{
                    color: bounceRateChange < 0
                      ? 'var(--success-color)'
                      : 'var(--danger-color)',
                  }}
                >
                  {bounceRateChange < 0 ? '' : '+'}
                  {Math.abs(Math.round(bounceRateChange * 10)) / 10}%
                </Text>
              </Column>
            </Row>
            <Text size="1" color="muted">
              vs previous period
            </Text>
          </Column>

          {/* Avg Duration Card */}
          <Column
            padding="5"
            backgroundColor="var(--base-color-1)"
            borderRadius="3"
            border
            gap="3"
            style={{
              boxShadow: 'var(--box-shadow-1)',
              transition: 'all 0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-2)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                'var(--box-shadow-1)';
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(0)';
            }}
          >
            <Text size="2" weight="semibold" color="muted">
              Avg Duration
            </Text>
            <Row justifyContent="space-between" alignItems="center" gap="2">
              <Text size="6" weight="bold">
                {formatDuration(MOCK_METRICS.avgDuration)}
              </Text>
              <Column
                paddingX="2"
                paddingY="1"
                borderRadius="2"
                style={{
                  backgroundColor: durationChange >= 0
                    ? 'color-mix(in srgb, var(--success-color), var(--base-color-1) 90%)'
                    : 'color-mix(in srgb, var(--danger-color), var(--base-color-1) 90%)',
                }}
              >
                <Text
                  size="2"
                  weight="semibold"
                  style={{
                    color: durationChange >= 0
                      ? 'var(--success-color)'
                      : 'var(--danger-color)',
                  }}
                >
                  {durationChange >= 0 ? '+' : ''}
                  {Math.round(
                    ((durationChange / MOCK_METRICS.previousAvgDuration) * 100)
                  )}%
                </Text>
              </Column>
            </Row>
            <Text size="1" color="muted">
              vs previous period
            </Text>
          </Column>
        </Grid>

        {/* Timeframe Selector */}
        <Row gap="3" alignItems="center" marginY="4">
          <Text size="3" weight="semibold">
            Period:
          </Text>
          {TIMEFRAME_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={timeframe === option.value ? 'primary' : 'default'}
              size="sm"
              onPress={() => setTimeframe(option.value)}
              style={{
                transition: 'all 0.2s ease',
              }}
            >
              {option.label}
            </Button>
          ))}
        </Row>

        {/* Chart Panel */}
        <Panel
          title="Pageviews Over Time"
          height={{ xs: '300px', md: '400px' }}
          width="100%"
        >
          <BarChart
            chartData={chartData}
            unit="day"
            height={350}
            width="100%"
          />
        </Panel>

        {/* Summary Section */}
        <Column
          padding="5"
          backgroundColor="var(--base-color-1)"
          borderRadius="3"
          border
          gap="3"
          marginTop="4"
          style={{
            boxShadow: 'var(--box-shadow-1)',
          }}
        >
          <Heading size="2">Performance Summary</Heading>
          <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="4">
            <Column gap="2">
              <Text size="2" weight="semibold" color="muted">
                Total Pageviews
              </Text>
              <Text size="5" weight="bold">
                {formatNumber(
                  MOCK_METRICS.pageviews * timeframe
                )}
              </Text>
            </Column>
            <Column gap="2">
              <Text size="2" weight="semibold" color="muted">
                Avg Pageviews/Day
              </Text>
              <Text size="5" weight="bold">
                {formatNumber(Math.round(MOCK_METRICS.pageviews))}
              </Text>
            </Column>
            <Column gap="2">
              <Text size="2" weight="semibold" color="muted">
                Conversion Health
              </Text>
              <Text
                size="5"
                weight="bold"
                style={{
                  color:
                    100 - MOCK_METRICS.bounceRate > 50
                      ? 'var(--success-color)'
                      : 'var(--warning-color)',
                }}
              >
                {(100 - MOCK_METRICS.bounceRate).toFixed(1)}%
              </Text>
            </Column>
          </Grid>
        </Column>
      </Column>
    </PageBody>
  );
}
