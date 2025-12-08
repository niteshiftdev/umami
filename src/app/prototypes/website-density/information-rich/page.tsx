'use client';

import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { ArrowUp, ArrowDown } from '@/components/icons';

// Sample data with trends and changes
const heroMetrics = [
  {
    label: 'Visitors',
    value: '45,231',
    change: 12.4,
    previousValue: '40,234',
    trend: 'up',
  },
  {
    label: 'Views',
    value: '67,892',
    change: 8.2,
    previousValue: '62,753',
    trend: 'up',
  },
  {
    label: 'Visits',
    value: '52,104',
    change: 15.1,
    previousValue: '45,278',
    trend: 'up',
  },
  {
    label: 'Bounce Rate',
    value: '42%',
    change: -3.2,
    previousValue: '45.2%',
    trend: 'down',
    reverseColors: true,
  },
  {
    label: 'Avg Duration',
    value: '3m 24s',
    change: 0.5,
    previousValue: '3m 23s',
    trend: 'up',
  },
];

const topPages = [
  { url: '/home', views: 12453, change: 18.3, trend: 'strong-up' },
  { url: '/pricing', views: 8932, change: 24.7, trend: 'strong-up' },
  { url: '/docs/getting-started', views: 7621, change: 0.8, trend: 'neutral' },
  { url: '/blog/launch-announcement', views: 6234, change: -5.4, trend: 'down' },
  { url: '/features', views: 5892, change: 12.1, trend: 'up' },
  { url: '/about', views: 4521, change: 3.2, trend: 'up' },
  { url: '/contact', views: 3890, change: -2.1, trend: 'down' },
  { url: '/blog', views: 3456, change: 9.5, trend: 'up' },
];

const topReferrers = [
  { source: 'google.com', visitors: 15234, change: 14.2, trend: 'up' },
  { source: 'twitter.com', visitors: 8943, change: -3.1, trend: 'down' },
  { source: 'github.com', visitors: 6721, change: 22.5, trend: 'strong-up' },
  { source: 'linkedin.com', visitors: 5432, change: 8.9, trend: 'up' },
  { source: 'facebook.com', visitors: 4321, change: -12.3, trend: 'down' },
  { source: 'reddit.com', visitors: 3890, change: 45.6, trend: 'strong-up' },
  { source: 'direct', visitors: 3456, change: 1.2, trend: 'neutral' },
  { source: 'youtube.com', visitors: 2987, change: 6.7, trend: 'up' },
];

const topCountries = [
  { country: 'United States', visitors: 18234, change: 12.3 },
  { country: 'United Kingdom', visitors: 7821, change: 8.7 },
  { country: 'Germany', visitors: 5632, change: 15.2 },
  { country: 'Canada', visitors: 4921, change: -2.4 },
  { country: 'France', visitors: 4532, change: 9.8 },
  { country: 'Australia', visitors: 3890, change: 18.9 },
  { country: 'Japan', visitors: 3456, change: -5.6 },
  { country: 'India', visitors: 2987, change: 32.1 },
];

const topDevices = [
  { device: 'Desktop', visitors: 28432, change: 8.9, percentage: 62.8 },
  { device: 'Mobile', visitors: 14892, change: 18.2, percentage: 32.9 },
  { device: 'Tablet', visitors: 1907, change: -5.4, percentage: 4.3 },
];

// Trend indicator component
const TrendIndicator = ({ trend }: { trend: string }) => {
  if (trend === 'strong-up') {
    return (
      <span style={{ color: '#30a46c', fontSize: '14px', fontWeight: 600 }}>
        ↑↑
      </span>
    );
  }
  if (trend === 'up') {
    return (
      <span style={{ color: '#30a46c', fontSize: '14px', fontWeight: 600 }}>
        ↑
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span style={{ color: '#e5484d', fontSize: '14px', fontWeight: 600 }}>
        ↓
      </span>
    );
  }
  if (trend === 'neutral') {
    return (
      <span style={{ color: '#9ba1a6', fontSize: '14px', fontWeight: 600 }}>
        →
      </span>
    );
  }
  return null;
};

// Change badge component
const ChangeBadge = ({ change, reverseColors = false }: { change: number; reverseColors?: boolean }) => {
  const isPositive = change > 0;
  const isNeutral = Math.abs(change) < 1;

  let color = '#9ba1a6';
  if (!isNeutral) {
    if (reverseColors) {
      color = isPositive ? '#e5484d' : '#30a46c';
    } else {
      color = isPositive ? '#30a46c' : '#e5484d';
    }
  }

  return (
    <span style={{
      color,
      fontSize: '14px',
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2px'
    }}>
      {isPositive ? '+' : ''}{change.toFixed(1)}%
    </span>
  );
};

// Hero metric card component
const HeroMetricCard = ({ metric }: { metric: typeof heroMetrics[0] }) => {
  const isPositive = metric.change > 0;
  const isNeutral = Math.abs(metric.change) < 1;

  let changeColor = '#9ba1a6';
  if (!isNeutral) {
    if (metric.reverseColors) {
      changeColor = isPositive ? '#e5484d' : '#30a46c';
    } else {
      changeColor = isPositive ? '#30a46c' : '#e5484d';
    }
  }

  return (
    <Column gap="2" style={{ minWidth: 0 }}>
      <Text size="1" weight="medium" style={{ color: '#9ba1a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {metric.label}
      </Text>
      <Row alignItems="center" gap="3">
        <Text size="9" weight="bold">
          {metric.value}
        </Text>
      </Row>
      <Row alignItems="center" gap="2">
        <span style={{
          color: changeColor,
          fontSize: '16px',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {isPositive && !isNeutral && <ArrowUp size={16} />}
          {!isPositive && !isNeutral && <ArrowDown size={16} />}
          {isPositive ? '+' : ''}{metric.change.toFixed(1)}%
        </span>
        <Text size="2" style={{ color: '#9ba1a6' }}>
          vs {metric.previousValue}
        </Text>
      </Row>
    </Column>
  );
};

// Progress bar component for percentages
const ProgressBar = ({ value, maxValue = 100, color = '#3e63dd' }: { value: number; maxValue?: number; color?: string }) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div style={{
      width: '100%',
      height: '8px',
      backgroundColor: '#e1e4e8',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: color,
        transition: 'width 0.3s ease'
      }} />
    </div>
  );
};

// Chart placeholder component
const ChartPlaceholder = () => {
  const data = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 82 },
    { day: 'Thu', value: 71 },
    { day: 'Fri', value: 88 },
    { day: 'Sat', value: 92 },
    { day: 'Sun', value: 76 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Column gap="4" style={{ width: '100%', height: '100%', minHeight: '420px' }}>
      <Row justifyContent="space-between" alignItems="center">
        <Heading size="4">Traffic Trend</Heading>
        <Text size="2" style={{ color: '#9ba1a6' }}>Last 7 days</Text>
      </Row>
      <Row alignItems="flex-end" gap="3" style={{ height: '360px', padding: '20px 0' }}>
        {data.map((item, i) => (
          <Column key={i} gap="2" alignItems="center" style={{ flex: 1 }}>
            <div style={{
              width: '100%',
              height: `${(item.value / maxValue) * 100}%`,
              backgroundColor: '#3e63dd',
              borderRadius: '4px 4px 0 0',
              minHeight: '40px',
              transition: 'height 0.3s ease',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#3e63dd'
              }}>
                {item.value}%
              </div>
            </div>
            <Text size="1" style={{ color: '#9ba1a6', fontWeight: 500 }}>
              {item.day}
            </Text>
          </Column>
        ))}
      </Row>
    </Column>
  );
};

export default function InformationRichDashboard() {
  return (
    <Column gap="6" style={{ padding: '40px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <Column gap="2">
        <Heading size="8">Website Analytics</Heading>
        <Text size="3" style={{ color: '#9ba1a6' }}>
          Comprehensive view of your website performance with trends and insights
        </Text>
      </Column>

      {/* Hero Metrics - Large Cards with Trends */}
      <Grid columns={{ xs: '1', sm: '2', md: '3', lg: '5' }} gap="4">
        {heroMetrics.map((metric, i) => (
          <Panel key={i} style={{ padding: '24px' }}>
            <HeroMetricCard metric={metric} />
          </Panel>
        ))}
      </Grid>

      {/* Chart Section */}
      <Panel style={{ minHeight: '520px', padding: '32px' }}>
        <ChartPlaceholder />
      </Panel>

      {/* Two Column Layout for Tables */}
      <Grid columns={{ xs: '1', lg: '2' }} gap="4">
        {/* Top Pages */}
        <Panel>
          <Column gap="4">
            <Column gap="1">
              <Heading size="4">Top Pages</Heading>
              <Text size="2" style={{ color: '#9ba1a6' }}>
                Most viewed pages with performance trends
              </Text>
            </Column>
            <Column gap="2">
              {topPages.map((page, i) => (
                <Row
                  key={i}
                  justifyContent="space-between"
                  alignItems="center"
                  style={{
                    padding: '12px 0',
                    borderBottom: i < topPages.length - 1 ? '1px solid #e1e4e8' : 'none',
                  }}
                >
                  <Column gap="1" style={{ flex: 1, minWidth: 0 }}>
                    <Text size="2" weight="medium" style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {page.url}
                    </Text>
                    <Row alignItems="center" gap="3">
                      <Text size="1" style={{ color: '#9ba1a6' }}>
                        {page.views.toLocaleString()} views
                      </Text>
                      <Row alignItems="center" gap="1">
                        <TrendIndicator trend={page.trend} />
                        <ChangeBadge change={page.change} />
                      </Row>
                    </Row>
                  </Column>
                </Row>
              ))}
            </Column>
          </Column>
        </Panel>

        {/* Top Referrers */}
        <Panel>
          <Column gap="4">
            <Column gap="1">
              <Heading size="4">Top Referrers</Heading>
              <Text size="2" style={{ color: '#9ba1a6' }}>
                Traffic sources with change indicators
              </Text>
            </Column>
            <Column gap="2">
              {topReferrers.map((referrer, i) => (
                <Row
                  key={i}
                  justifyContent="space-between"
                  alignItems="center"
                  style={{
                    padding: '12px 0',
                    borderBottom: i < topReferrers.length - 1 ? '1px solid #e1e4e8' : 'none',
                  }}
                >
                  <Column gap="1" style={{ flex: 1, minWidth: 0 }}>
                    <Text size="2" weight="medium" style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {referrer.source}
                    </Text>
                    <Row alignItems="center" gap="3">
                      <Text size="1" style={{ color: '#9ba1a6' }}>
                        {referrer.visitors.toLocaleString()} visitors
                      </Text>
                      <Row alignItems="center" gap="1">
                        <TrendIndicator trend={referrer.trend} />
                        <ChangeBadge change={referrer.change} />
                      </Row>
                    </Row>
                  </Column>
                </Row>
              ))}
            </Column>
          </Column>
        </Panel>
      </Grid>

      {/* Countries and Devices */}
      <Grid columns={{ xs: '1', lg: '2' }} gap="4">
        {/* Top Countries */}
        <Panel>
          <Column gap="4">
            <Column gap="1">
              <Heading size="4">Top Countries</Heading>
              <Text size="2" style={{ color: '#9ba1a6' }}>
                Geographic distribution of visitors
              </Text>
            </Column>
            <Column gap="3">
              {topCountries.map((country, i) => (
                <Column key={i} gap="2">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="2" weight="medium">
                      {country.country}
                    </Text>
                    <Row alignItems="center" gap="3">
                      <Text size="2" style={{ color: '#9ba1a6' }}>
                        {country.visitors.toLocaleString()}
                      </Text>
                      <ChangeBadge change={country.change} />
                    </Row>
                  </Row>
                  <ProgressBar
                    value={country.visitors}
                    maxValue={topCountries[0].visitors}
                    color="#3e63dd"
                  />
                </Column>
              ))}
            </Column>
          </Column>
        </Panel>

        {/* Devices */}
        <Panel>
          <Column gap="4">
            <Column gap="1">
              <Heading size="4">Devices</Heading>
              <Text size="2" style={{ color: '#9ba1a6' }}>
                Device breakdown with distribution
              </Text>
            </Column>
            <Column gap="4">
              {topDevices.map((device, i) => (
                <Column key={i} gap="2">
                  <Row justifyContent="space-between" alignItems="center">
                    <Row alignItems="center" gap="2">
                      <Text size="2" weight="medium">
                        {device.device}
                      </Text>
                      <Text size="2" style={{ color: '#9ba1a6' }}>
                        ({device.percentage}%)
                      </Text>
                    </Row>
                    <Row alignItems="center" gap="3">
                      <Text size="2" style={{ color: '#9ba1a6' }}>
                        {device.visitors.toLocaleString()}
                      </Text>
                      <ChangeBadge change={device.change} />
                    </Row>
                  </Row>
                  <ProgressBar
                    value={device.percentage}
                    maxValue={100}
                    color={i === 0 ? '#3e63dd' : i === 1 ? '#30a46c' : '#e5484d'}
                  />
                </Column>
              ))}
            </Column>
          </Column>
        </Panel>
      </Grid>

      {/* Summary Stats */}
      <Panel>
        <Column gap="4">
          <Column gap="1">
            <Heading size="4">Period Summary</Heading>
            <Text size="2" style={{ color: '#9ba1a6' }}>
              Comparing current period to previous period
            </Text>
          </Column>
          <Grid columns={{ xs: '2', sm: '3', md: '4' }} gap="4">
            <Column gap="2">
              <Text size="1" style={{ color: '#9ba1a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Sessions
              </Text>
              <Text size="6" weight="bold">52,104</Text>
              <ChangeBadge change={15.1} />
            </Column>
            <Column gap="2">
              <Text size="1" style={{ color: '#9ba1a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Engagement Rate
              </Text>
              <Text size="6" weight="bold">68%</Text>
              <ChangeBadge change={4.8} />
            </Column>
            <Column gap="2">
              <Text size="1" style={{ color: '#9ba1a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pages per Visit
              </Text>
              <Text size="6" weight="bold">3.2</Text>
              <ChangeBadge change={8.1} />
            </Column>
            <Column gap="2">
              <Text size="1" style={{ color: '#9ba1a6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                New Visitors
              </Text>
              <Text size="6" weight="bold">58%</Text>
              <ChangeBadge change={2.3} />
            </Column>
          </Grid>
        </Column>
      </Panel>
    </Column>
  );
}
