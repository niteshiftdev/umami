'use client';

import { useMemo } from 'react';
import { Column, Grid, Row, Text, Heading, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { ListTable } from '@/components/metrics/ListTable';
import { BarChart } from '@/components/charts/BarChart';
import { formatLongNumber, formatShortTime } from '@/lib/format';

/**
 * Compact Metrics Dashboard
 *
 * A data-dense layout that prioritizes metrics visibility with smaller cards
 * in a 2x3 grid at the top, a shorter main chart, and compact metrics tables.
 * Optimized for users who want to see more data at once without scrolling.
 */

// Realistic mock data for prototype
const mockStats = {
  pageviews: 45231,
  visitors: 12847,
  visits: 18392,
  bounces: 4598,
  totaltime: 1839200,
  events: 8421,
  pagesPerVisit: 2.46,
  comparison: {
    pageviews: 41000,
    visitors: 11500,
    visits: 16800,
    bounces: 4200,
    totaltime: 1680000,
    events: 7200,
  },
};

// Generate time series data for chart
const generateMockChartData = () => {
  const now = new Date();
  const pageviews: { x: string; y: number }[] = [];
  const sessions: { x: string; y: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate realistic-looking traffic patterns (weekends lower)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseMultiplier = isWeekend ? 0.6 : 1;
    const randomVariation = 0.8 + Math.random() * 0.4;

    pageviews.push({
      x: dateStr,
      y: Math.round(1500 * baseMultiplier * randomVariation),
    });
    sessions.push({
      x: dateStr,
      y: Math.round(450 * baseMultiplier * randomVariation),
    });
  }

  return { pageviews, sessions };
};

// Mock metrics table data
const mockPagesData = [
  { label: '/dashboard', count: 8432, percent: 42 },
  { label: '/products/analytics-suite', count: 4217, percent: 21 },
  { label: '/pricing', count: 3104, percent: 15 },
  { label: '/blog/getting-started', count: 2156, percent: 11 },
  { label: '/about', count: 1891, percent: 9 },
];

const mockSourcesData = [
  { label: 'google.com', count: 5621, percent: 44 },
  { label: 'twitter.com', count: 2847, percent: 22 },
  { label: 'linkedin.com', count: 1923, percent: 15 },
  { label: 'github.com', count: 1456, percent: 11 },
  { label: 'reddit.com', count: 1000, percent: 8 },
];

const mockBrowsersData = [
  { label: 'Chrome', count: 7832, percent: 61 },
  { label: 'Safari', count: 2564, percent: 20 },
  { label: 'Firefox', count: 1542, percent: 12 },
  { label: 'Edge', count: 653, percent: 5 },
  { label: 'Other', count: 256, percent: 2 },
];

const mockCountriesData = [
  { label: 'United States', count: 4532, percent: 35 },
  { label: 'United Kingdom', count: 1923, percent: 15 },
  { label: 'Germany', count: 1542, percent: 12 },
  { label: 'Canada', count: 1156, percent: 9 },
  { label: 'France', count: 987, percent: 8 },
];

const mockDevicesData = [
  { label: 'Desktop', count: 8943, percent: 70 },
  { label: 'Mobile', count: 3217, percent: 25 },
  { label: 'Tablet', count: 687, percent: 5 },
];

const mockEventsData = [
  { label: 'button_click', count: 3421, percent: 41 },
  { label: 'form_submit', count: 2156, percent: 26 },
  { label: 'video_play', count: 1432, percent: 17 },
  { label: 'download', count: 897, percent: 11 },
  { label: 'scroll_depth', count: 515, percent: 5 },
];

// Compact chart component with reduced height
function CompactChart() {
  const chartData = useMemo(() => {
    const { pageviews, sessions } = generateMockChartData();
    return {
      __id: Date.now(),
      datasets: [
        {
          type: 'bar' as const,
          label: 'Visitors',
          data: sessions,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: 'rgba(38, 128, 235, 0.5)',
          borderColor: 'rgba(38, 128, 235, 0.8)',
          order: 2,
        },
        {
          type: 'bar' as const,
          label: 'Views',
          data: pageviews,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          borderWidth: 1,
          backgroundColor: 'rgba(150, 97, 209, 0.5)',
          borderColor: 'rgba(150, 97, 209, 0.8)',
          order: 1,
        },
      ],
    };
  }, []);

  const now = new Date();
  const minDate = new Date(now);
  minDate.setDate(minDate.getDate() - 29);

  return (
    <BarChart
      chartData={chartData}
      unit="day"
      minDate={minDate}
      maxDate={now}
      height="280px"
    />
  );
}

// Inline sparkline component for compact visual indicators
function Sparkline({ data, color = 'var(--primary-color)' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Compact metrics card with smaller sizing
function CompactMetricCard({
  label,
  value,
  change,
  formatValue = formatLongNumber,
  reverseColors = false,
  sparklineData,
}: {
  label: string;
  value: number;
  change: number;
  formatValue?: (n: number) => string;
  reverseColors?: boolean;
  sparklineData?: number[];
}) {
  const isPositive = reverseColors ? change < 0 : change > 0;
  const changeColor = isPositive ? 'var(--color-green)' : 'var(--color-red)';
  const changePercent = change !== 0 ? Math.round(Math.abs(change)) : 0;

  return (
    <Column
      paddingX="4"
      paddingY="3"
      borderRadius="3"
      backgroundColor
      border
      gap="1"
      style={{
        animation: 'fadeSlideIn 0.4s ease-out forwards',
        opacity: 0,
      }}
    >
      <Row justifyContent="space-between" alignItems="center">
        <Text size="0" weight="bold" color="muted">
          {label}
        </Text>
        {sparklineData && <Sparkline data={sparklineData} />}
      </Row>
      <Row alignItems="baseline" gap="2">
        <Text size="6" weight="bold">
          {formatValue(value)}
        </Text>
        {change !== 0 && (
          <Text size="0" style={{ color: changeColor }}>
            {isPositive ? '+' : '-'}{changePercent}%
          </Text>
        )}
      </Row>
    </Column>
  );
}

// Compact table panel with reduced row limit
function CompactTablePanel({
  title,
  data,
  metric = 'Visitors',
}: {
  title: string;
  data: { label: string; count: number; percent: number }[];
  metric?: string;
}) {
  return (
    <Column gap="2">
      <Heading size="1" weight="bold">{title}</Heading>
      <ListTable
        data={data}
        title=""
        metric={metric}
        animate={false}
        showPercentage={true}
      />
    </Column>
  );
}

export default function CompactMetricsDashboard() {
  // Calculate derived metrics
  const bounceRate = Math.round((mockStats.bounces / mockStats.visits) * 100);
  const avgDuration = mockStats.totaltime / mockStats.visits;
  const prevBounceRate = Math.round((mockStats.comparison.bounces / mockStats.comparison.visits) * 100);
  const prevAvgDuration = mockStats.comparison.totaltime / mockStats.comparison.visits;

  // Sparkline mock data (last 7 days trend)
  const visitorsTrend = [320, 410, 380, 450, 520, 490, 540];
  const visitsTrend = [480, 620, 550, 680, 750, 710, 780];
  const viewsTrend = [1100, 1350, 1200, 1480, 1620, 1550, 1700];
  const bounceTrend = [28, 26, 27, 25, 24, 25, 23];
  const durationTrend = [85, 92, 88, 96, 102, 98, 105];
  const eventsTrend = [210, 280, 250, 320, 350, 330, 380];

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .compact-grid > * {
          animation: fadeSlideIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .compact-grid > *:nth-child(1) { animation-delay: 0.05s; }
        .compact-grid > *:nth-child(2) { animation-delay: 0.1s; }
        .compact-grid > *:nth-child(3) { animation-delay: 0.15s; }
        .compact-grid > *:nth-child(4) { animation-delay: 0.2s; }
        .compact-grid > *:nth-child(5) { animation-delay: 0.25s; }
        .compact-grid > *:nth-child(6) { animation-delay: 0.3s; }
        .panel-animate {
          animation: fadeSlideIn 0.5s ease-out forwards;
          animation-delay: 0.35s;
          opacity: 0;
        }
        .tables-animate > * {
          animation: fadeSlideIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .tables-animate > *:nth-child(1) { animation-delay: 0.4s; }
        .tables-animate > *:nth-child(2) { animation-delay: 0.45s; }
        .tables-animate > *:nth-child(3) { animation-delay: 0.5s; }
        .tables-animate > *:nth-child(4) { animation-delay: 0.55s; }
      `}</style>

      <Column gap="2" padding="4">
        {/* Header */}
        <Row justifyContent="space-between" alignItems="center" marginBottom="2">
          <Column gap="1">
            <Heading size="4" weight="bold">Analytics Overview</Heading>
            <Text size="1" color="muted">Last 30 days - Compact view</Text>
          </Column>
          <Row
            paddingX="3"
            paddingY="2"
            backgroundColor="2"
            borderRadius="2"
          >
            <Text size="1" weight="medium">
              Nov 3, 2025 - Dec 3, 2025
            </Text>
          </Row>
        </Row>

        {/* 2x3 Compact Metrics Grid */}
        <Grid
          columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          gap="2"
          className="compact-grid"
        >
          <CompactMetricCard
            label="VISITORS"
            value={mockStats.visitors}
            change={Math.round(((mockStats.visitors - mockStats.comparison.visitors) / mockStats.comparison.visitors) * 100)}
            sparklineData={visitorsTrend}
          />
          <CompactMetricCard
            label="VISITS"
            value={mockStats.visits}
            change={Math.round(((mockStats.visits - mockStats.comparison.visits) / mockStats.comparison.visits) * 100)}
            sparklineData={visitsTrend}
          />
          <CompactMetricCard
            label="PAGE VIEWS"
            value={mockStats.pageviews}
            change={Math.round(((mockStats.pageviews - mockStats.comparison.pageviews) / mockStats.comparison.pageviews) * 100)}
            sparklineData={viewsTrend}
          />
          <CompactMetricCard
            label="BOUNCE RATE"
            value={bounceRate}
            change={bounceRate - prevBounceRate}
            formatValue={(n) => `${n}%`}
            reverseColors={true}
            sparklineData={bounceTrend}
          />
          <CompactMetricCard
            label="AVG. DURATION"
            value={avgDuration}
            change={Math.round(((avgDuration - prevAvgDuration) / prevAvgDuration) * 100)}
            formatValue={(n) => formatShortTime(n, ['m', 's'], ' ')}
            sparklineData={durationTrend}
          />
          <CompactMetricCard
            label="EVENTS"
            value={mockStats.events}
            change={Math.round(((mockStats.events - mockStats.comparison.events) / mockStats.comparison.events) * 100)}
            sparklineData={eventsTrend}
          />
        </Grid>

        {/* Compact Chart Panel - Reduced Height */}
        <Panel minHeight="320px" className="panel-animate">
          <Row justifyContent="space-between" alignItems="center" marginBottom="2">
            <Heading size="2" weight="bold">Traffic Overview</Heading>
            <Row gap="4">
              <Row alignItems="center" gap="2">
                <Row
                  width="12px"
                  height="12px"
                  borderRadius="1"
                  style={{ backgroundColor: 'rgba(38, 128, 235, 0.7)' }}
                />
                <Text size="1" color="muted">Visitors</Text>
              </Row>
              <Row alignItems="center" gap="2">
                <Row
                  width="12px"
                  height="12px"
                  borderRadius="1"
                  style={{ backgroundColor: 'rgba(150, 97, 209, 0.7)' }}
                />
                <Text size="1" color="muted">Views</Text>
              </Row>
            </Row>
          </Row>
          <CompactChart />
        </Panel>

        {/* Compact Metrics Tables - 2x2 Grid with limit:5 */}
        <Grid
          columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
          gap="2"
          className="tables-animate"
        >
          <Panel paddingY="4" paddingX="4">
            <Tabs>
              <TabList>
                <Tab id="pages">Pages</Tab>
                <Tab id="entry">Entry</Tab>
                <Tab id="exit">Exit</Tab>
              </TabList>
              <TabPanel id="pages">
                <CompactTablePanel title="" data={mockPagesData} />
              </TabPanel>
              <TabPanel id="entry">
                <CompactTablePanel title="" data={mockPagesData} />
              </TabPanel>
              <TabPanel id="exit">
                <CompactTablePanel title="" data={mockPagesData} />
              </TabPanel>
            </Tabs>
          </Panel>

          <Panel paddingY="4" paddingX="4">
            <Tabs>
              <TabList>
                <Tab id="referrers">Referrers</Tab>
                <Tab id="channels">Channels</Tab>
              </TabList>
              <TabPanel id="referrers">
                <CompactTablePanel title="" data={mockSourcesData} />
              </TabPanel>
              <TabPanel id="channels">
                <CompactTablePanel title="" data={mockSourcesData} />
              </TabPanel>
            </Tabs>
          </Panel>

          <Panel paddingY="4" paddingX="4">
            <Tabs>
              <TabList>
                <Tab id="browsers">Browsers</Tab>
                <Tab id="os">OS</Tab>
                <Tab id="devices">Devices</Tab>
              </TabList>
              <TabPanel id="browsers">
                <CompactTablePanel title="" data={mockBrowsersData} />
              </TabPanel>
              <TabPanel id="os">
                <CompactTablePanel title="" data={mockBrowsersData} />
              </TabPanel>
              <TabPanel id="devices">
                <CompactTablePanel title="" data={mockDevicesData} />
              </TabPanel>
            </Tabs>
          </Panel>

          <Panel paddingY="4" paddingX="4">
            <Tabs>
              <TabList>
                <Tab id="countries">Countries</Tab>
                <Tab id="events">Events</Tab>
              </TabList>
              <TabPanel id="countries">
                <CompactTablePanel title="" data={mockCountriesData} />
              </TabPanel>
              <TabPanel id="events">
                <CompactTablePanel title="" data={mockEventsData} metric="Count" />
              </TabPanel>
            </Tabs>
          </Panel>
        </Grid>

        {/* Summary Footer */}
        <Row
          justifyContent="center"
          paddingY="3"
          style={{
            animation: 'fadeSlideIn 0.4s ease-out forwards',
            animationDelay: '0.6s',
            opacity: 0,
          }}
        >
          <Text size="1" color="muted">
            Showing condensed analytics data - All metrics visible without scrolling
          </Text>
        </Row>
      </Column>
    </>
  );
}
