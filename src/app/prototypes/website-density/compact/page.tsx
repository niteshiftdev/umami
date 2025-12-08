'use client';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';

// Sample data
const SAMPLE_METRICS = {
  visitors: 45231,
  views: 67892,
  visits: 52104,
  bounceRate: 42,
  avgDuration: '3m 24s',
};

const SAMPLE_PAGES = [
  { path: '/home', visitors: 12453, views: 18921 },
  { path: '/pricing', visitors: 8732, views: 12456 },
  { path: '/docs/getting-started', visitors: 7234, views: 11234 },
  { path: '/blog/launch-announcement', visitors: 6543, views: 9876 },
  { path: '/features', visitors: 5432, views: 8234 },
  { path: '/about', visitors: 4321, views: 6543 },
  { path: '/contact', visitors: 3876, views: 5234 },
  { path: '/docs/api-reference', visitors: 3456, views: 4987 },
  { path: '/blog/product-update', visitors: 2987, views: 4321 },
  { path: '/careers', visitors: 2543, views: 3876 },
  { path: '/docs/tutorials', visitors: 2234, views: 3456 },
  { path: '/blog/case-study', visitors: 1987, views: 3012 },
  { path: '/integrations', visitors: 1765, views: 2543 },
  { path: '/changelog', visitors: 1543, views: 2234 },
  { path: '/community', visitors: 1432, views: 2098 },
];

const SAMPLE_SOURCES = [
  { source: 'google.com', visitors: 18234, views: 25678 },
  { source: 'twitter.com', visitors: 9876, views: 14532 },
  { source: 'linkedin.com', visitors: 7654, views: 11234 },
  { source: 'producthunt.com', visitors: 5432, views: 8765 },
  { source: 'direct', visitors: 4321, views: 6789 },
  { source: 'facebook.com', visitors: 3456, views: 5234 },
  { source: 'reddit.com', visitors: 2987, views: 4321 },
  { source: 'youtube.com', visitors: 2543, views: 3876 },
  { source: 'github.com', visitors: 2234, views: 3456 },
  { source: 'medium.com', visitors: 1987, views: 2987 },
  { source: 'dev.to', visitors: 1765, views: 2543 },
  { source: 'hackernews.com', visitors: 1543, views: 2234 },
  { source: 'stackoverflow.com', visitors: 1432, views: 2098 },
  { source: 'instagram.com', visitors: 1234, views: 1876 },
  { source: 'pinterest.com', visitors: 987, views: 1456 },
];

const SAMPLE_COUNTRIES = [
  { country: 'United States', visitors: 15234, views: 22456 },
  { country: 'United Kingdom', visitors: 8765, views: 12987 },
  { country: 'Germany', visitors: 6543, views: 9876 },
  { country: 'France', visitors: 5432, views: 8234 },
  { country: 'Canada', visitors: 4321, views: 6543 },
  { country: 'Australia', visitors: 3456, views: 5234 },
  { country: 'Netherlands', visitors: 2987, views: 4321 },
  { country: 'Spain', visitors: 2543, views: 3876 },
  { country: 'India', visitors: 2234, views: 3456 },
  { country: 'Brazil', visitors: 1987, views: 2987 },
  { country: 'Japan', visitors: 1765, views: 2543 },
  { country: 'Italy', visitors: 1543, views: 2234 },
  { country: 'Sweden', visitors: 1432, views: 2098 },
  { country: 'Switzerland', visitors: 1234, views: 1876 },
  { country: 'Singapore', visitors: 987, views: 1456 },
];

const SAMPLE_BROWSERS = [
  { browser: 'Chrome', visitors: 25678, views: 38234 },
  { browser: 'Safari', visitors: 12345, views: 18765 },
  { browser: 'Firefox', visitors: 5432, views: 8234 },
  { browser: 'Edge', visitors: 4321, views: 6543 },
  { browser: 'Opera', visitors: 1234, views: 1876 },
  { browser: 'Brave', visitors: 987, views: 1456 },
  { browser: 'Arc', visitors: 765, views: 1123 },
  { browser: 'Samsung Internet', visitors: 543, views: 876 },
  { browser: 'UC Browser', visitors: 432, views: 654 },
  { browser: 'Vivaldi', visitors: 321, views: 487 },
  { browser: 'DuckDuckGo', visitors: 234, views: 356 },
  { browser: 'Tor Browser', visitors: 187, views: 278 },
  { browser: 'Waterfox', visitors: 143, views: 215 },
  { browser: 'Pale Moon', visitors: 98, views: 145 },
  { browser: 'Other', visitors: 512, views: 789 },
];

const SAMPLE_DEVICES = [
  { device: 'Desktop', visitors: 28765, views: 42345 },
  { device: 'Mobile', visitors: 14321, views: 21876 },
  { device: 'Tablet', visitors: 2145, views: 3671 },
];

// Compact metric card component
function CompactMetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Column gap="1" paddingX="3" paddingY="2">
      <Text size="1" weight="medium" style={{ color: '#666' }}>
        {label}
      </Text>
      <Text size="5" weight="bold">
        {value}
      </Text>
    </Column>
  );
}

// Compact table component
function CompactTable({
  title,
  data,
  labelKey,
  showViews = false,
}: {
  title: string;
  data: any[];
  labelKey: string;
  showViews?: boolean;
}) {
  return (
    <Column gap="2">
      <Heading size="1" weight="semi-bold" style={{ paddingBottom: '8px', borderBottom: '1px solid #e5e5e5' }}>
        {title}
      </Heading>
      <Column gap="0" style={{ fontSize: '13px' }}>
        {data.map((item, index) => {
          const total = item.visitors + (item.views || 0);
          const percentage = Math.round((item.visitors / SAMPLE_METRICS.visitors) * 100);

          return (
            <Row
              key={index}
              justifyContent="space-between"
              alignItems="center"
              paddingY="1"
              paddingX="2"
              style={{
                borderBottom: index < data.length - 1 ? '1px solid #f0f0f0' : 'none',
                minHeight: '28px',
              }}
            >
              <Text
                size="1"
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  marginRight: '8px',
                }}
              >
                {item[labelKey]}
              </Text>
              <Row gap="3" alignItems="center" style={{ flexShrink: 0 }}>
                <Text size="1" weight="medium" style={{ minWidth: '50px', textAlign: 'right' }}>
                  {item.visitors.toLocaleString()}
                </Text>
                {showViews && (
                  <Text size="1" style={{ color: '#999', minWidth: '50px', textAlign: 'right' }}>
                    {item.views?.toLocaleString()}
                  </Text>
                )}
                <Text size="1" style={{ color: '#999', minWidth: '35px', textAlign: 'right' }}>
                  {percentage}%
                </Text>
              </Row>
            </Row>
          );
        })}
      </Column>
    </Column>
  );
}

// Simple chart placeholder with mini visualization
function CompactChart() {
  // Generate sample data points for the last 30 days
  const dataPoints = Array.from({ length: 30 }, (_, i) => {
    const baseValue = 1500;
    const variation = Math.sin(i / 3) * 500 + Math.random() * 400;
    return Math.round(baseValue + variation);
  });

  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);

  return (
    <Column gap="2">
      <Row justifyContent="space-between" alignItems="center">
        <Heading size="1" weight="semi-bold">
          Visitors
        </Heading>
        <Text size="1" style={{ color: '#666' }}>
          Last 30 days
        </Text>
      </Row>
      <div
        style={{
          height: '300px',
          width: '100%',
          position: 'relative',
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Y-axis labels */}
          <text x="5" y="20" fontSize="11" fill="#999">
            {maxValue.toLocaleString()}
          </text>
          <text x="5" y="140" fontSize="11" fill="#999">
            {Math.round((maxValue + minValue) / 2).toLocaleString()}
          </text>
          <text x="5" y="260" fontSize="11" fill="#999">
            {minValue.toLocaleString()}
          </text>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="50"
              y1={i * 65}
              x2="100%"
              y2={i * 65}
              stroke="#e5e5e5"
              strokeWidth="1"
            />
          ))}

          {/* Area chart */}
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Chart area */}
          <path
            d={`M 50,${260 - ((dataPoints[0] - minValue) / (maxValue - minValue)) * 240} ${dataPoints
              .map(
                (value, i) =>
                  `L ${50 + (i * (100 - 50)) / (dataPoints.length - 1)},${
                    260 - ((value - minValue) / (maxValue - minValue)) * 240
                  }`
              )
              .join(' ')} L ${50 + ((dataPoints.length - 1) * (100 - 50)) / (dataPoints.length - 1)},260 L 50,260 Z`}
            fill="url(#chartGradient)"
          />

          {/* Chart line */}
          <path
            d={`M 50,${260 - ((dataPoints[0] - minValue) / (maxValue - minValue)) * 240} ${dataPoints
              .map(
                (value, i) =>
                  `L ${50 + (i * (100 - 50)) / (dataPoints.length - 1)},${
                    260 - ((value - minValue) / (maxValue - minValue)) * 240
                  }`
              )
              .join(' ')}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data points */}
          {dataPoints.map((value, i) => (
            <circle
              key={i}
              cx={50 + (i * (100 - 50)) / (dataPoints.length - 1)}
              cy={260 - ((value - minValue) / (maxValue - minValue)) * 240}
              r="2"
              fill="#3b82f6"
            />
          ))}
        </svg>
      </div>
    </Column>
  );
}

export default function CompactDensityPage() {
  return (
    <Column gap="2" padding="4" style={{ maxWidth: '1800px', margin: '0 auto' }}>
      {/* Page Header */}
      <Column gap="1" paddingBottom="2">
        <Heading size="4" weight="bold">
          Website Analytics - Compact Density
        </Heading>
        <Text size="1" style={{ color: '#666' }}>
          Maximum data per viewport for power users
        </Text>
      </Column>

      {/* Compressed Metrics Bar */}
      <Panel paddingY="3" paddingX="4">
        <Row gap="1" justifyContent="space-between" style={{ flexWrap: 'wrap' }}>
          <CompactMetricCard label="Visitors" value={SAMPLE_METRICS.visitors.toLocaleString()} />
          <CompactMetricCard label="Views" value={SAMPLE_METRICS.views.toLocaleString()} />
          <CompactMetricCard label="Visits" value={SAMPLE_METRICS.visits.toLocaleString()} />
          <CompactMetricCard label="Bounce Rate" value={`${SAMPLE_METRICS.bounceRate}%`} />
          <CompactMetricCard label="Avg Duration" value={SAMPLE_METRICS.avgDuration} />
        </Row>
      </Panel>

      {/* Compact Chart */}
      <Panel paddingY="3" paddingX="4" style={{ minHeight: '300px' }}>
        <CompactChart />
      </Panel>

      {/* 3-Column Grid for Tables */}
      <Grid columns={{ xs: 1, sm: 2, md: 3 }} gap="2">
        {/* Pages */}
        <Panel paddingY="3" paddingX="3">
          <CompactTable title="Top Pages" data={SAMPLE_PAGES} labelKey="path" showViews={true} />
        </Panel>

        {/* Sources */}
        <Panel paddingY="3" paddingX="3">
          <CompactTable title="Top Sources" data={SAMPLE_SOURCES} labelKey="source" showViews={true} />
        </Panel>

        {/* Countries */}
        <Panel paddingY="3" paddingX="3">
          <CompactTable title="Countries" data={SAMPLE_COUNTRIES} labelKey="country" showViews={true} />
        </Panel>

        {/* Browsers */}
        <Panel paddingY="3" paddingX="3">
          <CompactTable title="Browsers" data={SAMPLE_BROWSERS} labelKey="browser" />
        </Panel>

        {/* Devices */}
        <Panel paddingY="3" paddingX="3">
          <CompactTable title="Devices" data={SAMPLE_DEVICES} labelKey="device" showViews={true} />
        </Panel>

        {/* Additional space for future metrics */}
        <Panel paddingY="3" paddingX="3">
          <Column gap="2">
            <Heading size="1" weight="semi-bold" style={{ paddingBottom: '8px', borderBottom: '1px solid #e5e5e5' }}>
              Operating Systems
            </Heading>
            <Column gap="0" style={{ fontSize: '13px' }}>
              {[
                { os: 'Windows', visitors: 18234 },
                { os: 'macOS', visitors: 15678 },
                { os: 'iOS', visitors: 8765 },
                { os: 'Android', visitors: 7234 },
                { os: 'Linux', visitors: 2345 },
                { os: 'Chrome OS', visitors: 876 },
                { os: 'Other', visitors: 432 },
              ].map((item, index, arr) => {
                const percentage = Math.round((item.visitors / SAMPLE_METRICS.visitors) * 100);

                return (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    alignItems="center"
                    paddingY="1"
                    paddingX="2"
                    style={{
                      borderBottom: index < arr.length - 1 ? '1px solid #f0f0f0' : 'none',
                      minHeight: '28px',
                    }}
                  >
                    <Text
                      size="1"
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        marginRight: '8px',
                      }}
                    >
                      {item.os}
                    </Text>
                    <Row gap="3" alignItems="center" style={{ flexShrink: 0 }}>
                      <Text size="1" weight="medium" style={{ minWidth: '50px', textAlign: 'right' }}>
                        {item.visitors.toLocaleString()}
                      </Text>
                      <Text size="1" style={{ color: '#999', minWidth: '35px', textAlign: 'right' }}>
                        {percentage}%
                      </Text>
                    </Row>
                  </Row>
                );
              })}
            </Column>
          </Column>
        </Panel>
      </Grid>
    </Column>
  );
}
