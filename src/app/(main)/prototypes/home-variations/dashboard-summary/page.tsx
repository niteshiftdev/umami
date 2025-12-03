'use client';
import { useMemo } from 'react';
import { Column, Grid, Row, Text, Heading } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatNumber } from '@/lib/format';

const MOCK_PAGEVIEWS_DATA = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  return {
    x: date.getTime(),
    y: Math.floor(Math.random() * 5000) + 3000,
  };
});

const MOCK_BREAKDOWN = [
  { x: 'Homepage', y: 12500, z: 35.2 },
  { x: 'Blog', y: 8900, z: 25.1 },
  { x: 'Pricing', y: 6200, z: 17.4 },
  { x: 'Product', y: 5100, z: 14.3 },
  { x: 'Contact', y: 2800, z: 7.9 },
];

const TOTAL_PAGEVIEWS = 35600;
const TOTAL_VISITORS = 12400;
const TOTAL_SESSIONS = 18900;
const BOUNCE_RATE = 42.5;
const AVG_DURATION = 3.24;
const PREVIOUS_PAGEVIEWS = 32100;

export default function DashboardSummaryPage() {
  const pageviewsChange = TOTAL_PAGEVIEWS - PREVIOUS_PAGEVIEWS;
  const pageviewsChangePercent = (pageviewsChange / PREVIOUS_PAGEVIEWS) * 100;

  const barChartData = useMemo(() => ({
    labels: MOCK_PAGEVIEWS_DATA.map(d => {
      const date = new Date(d.x);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Pageviews',
        data: MOCK_PAGEVIEWS_DATA.map(d => ({ x: d.x, y: d.y })),
        borderColor: 'var(--primary-color)',
        backgroundColor: 'rgba(20, 122, 243, 0.1)',
        borderWidth: 2,
      },
    ],
  }), []);

  const pieChartData = useMemo(() => ({
    labels: MOCK_BREAKDOWN.map(d => d.x),
    datasets: [
      {
        label: 'Traffic by Page',
        data: MOCK_BREAKDOWN.map(d => d.y),
        backgroundColor: [
          'rgba(20, 122, 243, 0.8)',
          'rgba(48, 164, 108, 0.8)',
          'rgba(0, 144, 255, 0.8)',
          'rgba(229, 72, 77, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderColor: 'var(--base-color-1)',
        borderWidth: 2,
      },
    ],
  }), []);

  return (
    <PageBody>
      <Column gap="5">
        {/* Hero Summary Section */}
        <Panel
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, rgba(20, 122, 243, 0.8) 100%)',
            color: 'white',
          }}
        >
          <Column gap="4">
            <Column gap="1">
              <Text size="3" weight="medium" style={{ opacity: 0.9 }}>
                Traffic Overview
              </Text>
              <Heading
                level="1"
                style={{
                  fontSize: 'var(--heading-size-4)',
                  marginBottom: 'var(--spacing-2)',
                }}
              >
                {formatNumber(TOTAL_PAGEVIEWS)}
              </Heading>
              <Text size="3" style={{ opacity: 0.85 }}>
                Total Pageviews • Last 14 Days
              </Text>
            </Column>

            {pageviewsChange > 0 && (
              <Row gap="3" alignItems="center">
                <Text
                  size="5"
                  weight="bold"
                  style={{
                    color: '#30a46c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                  }}
                >
                  +{pageviewsChangePercent.toFixed(1)}%
                </Text>
                <Text size="3" style={{ opacity: 0.85 }}>
                  vs previous period
                </Text>
              </Row>
            )}
          </Column>
        </Panel>

        {/* Metrics Grid */}
        <Grid
          columns={{
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          gap="3"
        >
          <MetricCard
            value={TOTAL_VISITORS}
            label="Unique Visitors"
            showLabel={true}
            valueSize="6"
            formatValue={formatNumber}
          />
          <MetricCard
            value={TOTAL_SESSIONS}
            label="Sessions"
            showLabel={true}
            valueSize="6"
            formatValue={formatNumber}
          />
          <MetricCard
            value={BOUNCE_RATE}
            label="Bounce Rate"
            showLabel={true}
            valueSize="6"
            formatValue={v => `${v.toFixed(1)}%`}
          />
          <MetricCard
            value={AVG_DURATION}
            label="Avg Duration"
            showLabel={true}
            valueSize="6"
            formatValue={v => `${v.toFixed(2)}m`}
          />
        </Grid>

        {/* Charts Section */}
        <Grid
          columns={{
            xs: '1fr',
            lg: '3fr 2fr',
          }}
          gap="5"
        >
          {/* Bar Chart Panel */}
          <Panel title="Pageviews Trend">
            <BarChart
              chartData={barChartData}
              height="300px"
              unit="day"
            />
          </Panel>

          {/* Pie Chart Panel */}
          <Panel title="Traffic by Page">
            <BarChart
              chartData={pieChartData}
              height="300px"
              unit="day"
            />
          </Panel>
        </Grid>

        {/* Top Pages Breakdown */}
        <Panel title="Top Pages">
          <Column gap="4">
            {MOCK_BREAKDOWN.map((page, index) => (
              <Row
                key={index}
                justifyContent="space-between"
                alignItems="center"
                gap="4"
              >
                <Column gap="1" flex={1}>
                  <Text weight="semibold">{page.x}</Text>
                  <Text size="2" color="muted">
                    {formatNumber(page.y)} views
                  </Text>
                </Column>
                <Row
                  alignItems="center"
                  gap="2"
                  style={{ minWidth: '100px' }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: 'var(--base-color-4)',
                      borderRadius: 'var(--border-radius-full)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${page.z}%`,
                        height: '100%',
                        backgroundColor: 'var(--primary-color)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <Text size="2" weight="semibold" style={{ minWidth: '35px' }}>
                    {page.z}%
                  </Text>
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
