'use client';
import { Column, Row, Grid, Text, Heading, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { WorldMap } from '@/components/metrics/WorldMap';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { formatLongNumber, formatShortTime } from '@/lib/format';

// Sample data for the prototype
const SAMPLE_METRICS = {
  visitors: 12847,
  visits: 18293,
  views: 42156,
  bounces: 7683,
  totaltime: 3726720, // seconds (3m 24s average)
};

const SAMPLE_CHART_DATA = {
  pageviews: Array.from({ length: 24 }, (_, i) => ({
    x: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    y: Math.floor(Math.random() * 2000) + 1000,
  })),
  sessions: Array.from({ length: 24 }, (_, i) => ({
    x: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    y: Math.floor(Math.random() * 1500) + 500,
  })),
};

const SAMPLE_PAGE_DATA = [
  { x: '/dashboard', y: 3245, z: 18.5 },
  { x: '/products', y: 2891, z: 16.5 },
  { x: '/about', y: 2134, z: 12.2 },
  { x: '/contact', y: 1876, z: 10.7 },
  { x: '/pricing', y: 1543, z: 8.8 },
  { x: '/blog', y: 1234, z: 7.1 },
  { x: '/features', y: 987, z: 5.6 },
  { x: '/docs', y: 856, z: 4.9 },
  { x: '/support', y: 745, z: 4.3 },
  { x: '/login', y: 634, z: 3.6 },
];

const SAMPLE_REFERRER_DATA = [
  { x: 'google.com', y: 4523, z: 25.8 },
  { x: 'twitter.com', y: 3876, z: 22.1 },
  { x: 'linkedin.com', y: 2543, z: 14.5 },
  { x: 'facebook.com', y: 2134, z: 12.2 },
  { x: 'github.com', y: 1876, z: 10.7 },
  { x: 'youtube.com', y: 1234, z: 7.0 },
  { x: 'reddit.com', y: 876, z: 5.0 },
  { x: 'medium.com', y: 543, z: 3.1 },
  { x: 'hackernews.com', y: 234, z: 1.3 },
  { x: 'direct', y: 156, z: 0.9 },
];

const SAMPLE_BROWSER_DATA = [
  { x: 'Chrome', y: 7234, z: 41.3 },
  { x: 'Safari', y: 4321, z: 24.7 },
  { x: 'Firefox', y: 2876, z: 16.4 },
  { x: 'Edge', y: 1543, z: 8.8 },
  { x: 'Opera', y: 876, z: 5.0 },
  { x: 'Brave', y: 543, z: 3.1 },
  { x: 'Samsung Browser', y: 234, z: 1.3 },
  { x: 'Arc', y: 156, z: 0.9 },
  { x: 'Vivaldi', y: 87, z: 0.5 },
  { x: 'Other', y: 45, z: 0.3 },
];

const SAMPLE_COUNTRY_DATA = [
  { x: 'US', y: 5234, z: 29.9 },
  { x: 'GB', y: 3876, z: 22.1 },
  { x: 'CA', y: 2543, z: 14.5 },
  { x: 'DE', y: 1876, z: 10.7 },
  { x: 'FR', y: 1234, z: 7.0 },
  { x: 'AU', y: 876, z: 5.0 },
  { x: 'JP', y: 543, z: 3.1 },
  { x: 'BR', y: 234, z: 1.3 },
  { x: 'IN', y: 156, z: 0.9 },
  { x: 'Other', y: 87, z: 0.5 },
];

export default function CommandCenterPage() {
  const { visitors, visits, views, bounces, totaltime } = SAMPLE_METRICS;
  const bounceRate = (Math.min(visits, bounces) / visits) * 100;
  const avgDuration = totaltime / visits;

  const metrics = [
    {
      value: visitors,
      label: 'Visitors',
      formatValue: formatLongNumber,
    },
    {
      value: visits,
      label: 'Visits',
      formatValue: formatLongNumber,
    },
    {
      value: views,
      label: 'Views',
      formatValue: formatLongNumber,
    },
    {
      value: bounceRate,
      label: 'Bounce Rate',
      formatValue: (n: number) => Math.round(n) + '%',
    },
    {
      value: avgDuration,
      label: 'Duration',
      formatValue: (n: number) => formatShortTime(Math.abs(~~n), ['m', 's'], ' '),
    },
  ];

  return (
    <Column gap="3" paddingX="6" paddingY="6" style={{ maxWidth: '100%', margin: '0 auto' }}>
      {/* Dark Header Bar */}
      <Row
        paddingX="6"
        paddingY="4"
        backgroundColor="accent"
        borderRadius="3"
        style={{ marginBottom: '8px' }}
      >
        <Heading size="5" style={{ color: 'white' }}>
          Command Center - Analytics Dashboard
        </Heading>
      </Row>

      {/* Compact Metrics Strip */}
      <MetricsBar style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {metrics.map(({ label, value, formatValue }) => (
          <MetricCard
            key={label}
            value={value}
            label={label}
            formatValue={formatValue}
            labelSize="1"
            valueSize="6"
            labelWeight="medium"
            valueWeight="bold"
            showChange={false}
          />
        ))}
      </MetricsBar>

      {/* Full-Width Chart Section */}
      <Panel style={{ minHeight: '300px' }}>
        <Heading size="2" weight="bold" style={{ marginBottom: '16px' }}>
          Traffic Overview
        </Heading>
        <PageviewsChart
          data={SAMPLE_CHART_DATA}
          unit="hour"
          minDate={new Date(Date.now() - 24 * 3600000)}
          maxDate={new Date()}
          height="280px"
        />
      </Panel>

      {/* 3-Column Grid Layout */}
      <Grid columns={{ xs: 1, md: 3 }} gap="3">
        {/* Pages Panel */}
        <Panel style={{ minHeight: '450px' }}>
          <Heading size="2" weight="bold" style={{ marginBottom: '12px' }}>
            Pages
          </Heading>
          <Tabs>
            <TabList>
              <Tab id="path">Path</Tab>
              <Tab id="entry">Entry</Tab>
              <Tab id="exit">Exit</Tab>
            </TabList>
            <TabPanel id="path">
              <div style={{ marginTop: '12px' }}>
                {SAMPLE_PAGE_DATA.map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="entry">
              <div style={{ marginTop: '12px' }}>
                {SAMPLE_PAGE_DATA.slice(0, 7).map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(Math.floor(item.y * 0.8))}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {(item.z * 0.9).toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="exit">
              <div style={{ marginTop: '12px' }}>
                {SAMPLE_PAGE_DATA.slice(0, 7).map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(Math.floor(item.y * 0.6))}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {(item.z * 0.7).toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </Panel>

        {/* Sources Panel */}
        <Panel style={{ minHeight: '450px' }}>
          <Heading size="2" weight="bold" style={{ marginBottom: '12px' }}>
            Sources
          </Heading>
          <Tabs>
            <TabList>
              <Tab id="referrer">Referrers</Tab>
              <Tab id="channel">Channels</Tab>
            </TabList>
            <TabPanel id="referrer">
              <div style={{ marginTop: '12px' }}>
                {SAMPLE_REFERRER_DATA.map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="channel">
              <div style={{ marginTop: '12px' }}>
                {[
                  { x: 'Organic Search', y: 8234, z: 47.0 },
                  { x: 'Social', y: 4321, z: 24.7 },
                  { x: 'Direct', y: 2876, z: 16.4 },
                  { x: 'Referral', y: 1543, z: 8.8 },
                  { x: 'Email', y: 876, z: 5.0 },
                  { x: 'Paid', y: 543, z: 3.1 },
                ].map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </Panel>

        {/* Environment Panel */}
        <Panel style={{ minHeight: '450px' }}>
          <Heading size="2" weight="bold" style={{ marginBottom: '12px' }}>
            Environment
          </Heading>
          <Tabs>
            <TabList>
              <Tab id="browser">Browsers</Tab>
              <Tab id="os">OS</Tab>
              <Tab id="device">Devices</Tab>
            </TabList>
            <TabPanel id="browser">
              <div style={{ marginTop: '12px' }}>
                {SAMPLE_BROWSER_DATA.map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="os">
              <div style={{ marginTop: '12px' }}>
                {[
                  { x: 'Windows', y: 5234, z: 29.9 },
                  { x: 'macOS', y: 4321, z: 24.7 },
                  { x: 'Linux', y: 2876, z: 16.4 },
                  { x: 'iOS', y: 2543, z: 14.5 },
                  { x: 'Android', y: 1876, z: 10.7 },
                  { x: 'Chrome OS', y: 543, z: 3.1 },
                  { x: 'Other', y: 234, z: 1.3 },
                ].map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="device">
              <div style={{ marginTop: '12px' }}>
                {[
                  { x: 'Desktop', y: 8234, z: 47.0 },
                  { x: 'Mobile', y: 6543, z: 37.4 },
                  { x: 'Tablet', y: 2134, z: 12.2 },
                  { x: 'TV', y: 543, z: 3.1 },
                  { x: 'Console', y: 234, z: 1.3 },
                ].map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </Panel>
      </Grid>

      {/* Location Section - 2 Columns */}
      <Grid columns={{ xs: 1, md: 2 }} gap="3">
        {/* World Map */}
        <Panel style={{ minHeight: '400px' }} paddingX="0" paddingY="0">
          <WorldMap data={SAMPLE_COUNTRY_DATA} />
        </Panel>

        {/* Location Data */}
        <Panel style={{ minHeight: '400px' }}>
          <Heading size="2" weight="bold" style={{ marginBottom: '12px' }}>
            Location
          </Heading>
          <Tabs>
            <TabList>
              <Tab id="country">Countries</Tab>
              <Tab id="region">Regions</Tab>
              <Tab id="city">Cities</Tab>
            </TabList>
            <TabPanel id="country">
              <div style={{ marginTop: '12px' }}>
                {SAMPLE_COUNTRY_DATA.map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="region">
              <div style={{ marginTop: '12px' }}>
                {[
                  { x: 'California', y: 2345, z: 13.4 },
                  { x: 'London', y: 1876, z: 10.7 },
                  { x: 'Ontario', y: 1543, z: 8.8 },
                  { x: 'Bavaria', y: 1234, z: 7.0 },
                  { x: 'Île-de-France', y: 987, z: 5.6 },
                  { x: 'New South Wales', y: 765, z: 4.4 },
                  { x: 'Tokyo', y: 543, z: 3.1 },
                ].map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
            <TabPanel id="city">
              <div style={{ marginTop: '12px' }}>
                {[
                  { x: 'San Francisco', y: 1876, z: 10.7 },
                  { x: 'London', y: 1543, z: 8.8 },
                  { x: 'New York', y: 1234, z: 7.0 },
                  { x: 'Toronto', y: 987, z: 5.6 },
                  { x: 'Berlin', y: 765, z: 4.4 },
                  { x: 'Paris', y: 543, z: 3.1 },
                  { x: 'Sydney', y: 432, z: 2.5 },
                ].map((item, index) => (
                  <Row
                    key={index}
                    justifyContent="space-between"
                    paddingY="2"
                    borderBottom
                    style={{ fontSize: '14px' }}
                  >
                    <Text size="2" style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.x}
                    </Text>
                    <Text size="2" weight="medium" style={{ marginLeft: '12px' }}>
                      {formatLongNumber(item.y)}
                    </Text>
                    <Text size="2" color="muted" style={{ marginLeft: '8px', minWidth: '50px', textAlign: 'right' }}>
                      {item.z.toFixed(1)}%
                    </Text>
                  </Row>
                ))}
              </div>
            </TabPanel>
          </Tabs>
        </Panel>
      </Grid>
    </Column>
  );
}
