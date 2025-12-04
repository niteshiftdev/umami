'use client';

import { Column, Row, Grid, Text, Heading, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';

// Compact Metric Card - horizontal layout for density
function CompactMetricCard({
  label,
  value,
  change,
  changeType = 'positive',
}: {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}) {
  const changeColor =
    changeType === 'positive'
      ? 'var(--green-9)'
      : changeType === 'negative'
        ? 'var(--red-9)'
        : 'var(--base-color-9)';

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      paddingX="3"
      paddingY="2"
      backgroundColor
      border
      borderRadius="2"
      gap="2"
      style={{
        minWidth: '140px',
        animation: 'fadeSlideIn 0.3s ease-out forwards',
        opacity: 0,
      }}
    >
      <Text size="1" color="muted" weight="medium">
        {label}
      </Text>
      <Row alignItems="baseline" gap="1">
        <Text size="3" weight="bold">
          {value}
        </Text>
        {change && (
          <Text size="0" style={{ color: changeColor }}>
            {change}
          </Text>
        )}
      </Row>
    </Row>
  );
}

// Compact Data Table for density
function CompactDataTable({
  title,
  metric,
  data,
}: {
  title: string;
  metric: string;
  data: Array<{ label: string; value: number; percent: number }>;
}) {
  return (
    <Column gap="1">
      <Grid columns="1fr 60px 40px" paddingX="2" paddingY="1">
        <Text size="0" weight="bold" color="muted">
          {title}
        </Text>
        <Text size="0" weight="bold" color="muted" align="right">
          {metric}
        </Text>
        <Text size="0" weight="bold" color="muted" align="right">
          %
        </Text>
      </Grid>
      {data.map((row, index) => (
        <Grid
          key={row.label}
          columns="1fr 60px 40px"
          paddingX="2"
          paddingY="1"
          hoverBackgroundColor="2"
          borderRadius="1"
          alignItems="center"
          style={{
            animation: `fadeSlideIn 0.2s ease-out ${index * 0.02}s forwards`,
            opacity: 0,
          }}
        >
          <Text size="1" truncate style={{ maxWidth: '180px' }}>
            {row.label}
          </Text>
          <Text size="1" weight="medium" align="right">
            {row.value.toLocaleString()}
          </Text>
          <Text size="0" color="muted" align="right">
            {row.percent}%
          </Text>
        </Grid>
      ))}
    </Column>
  );
}

// Mini World Map placeholder (compact visualization)
function CompactWorldMapPlaceholder({ topCountries }: { topCountries: Array<{ code: string; name: string; visitors: number }> }) {
  return (
    <Column gap="2" style={{ height: '100%' }}>
      <Row alignItems="center" justifyContent="space-between">
        <Text size="1" weight="bold">Top Locations</Text>
      </Row>
      <Column gap="1" style={{ flex: 1 }}>
        {topCountries.map((country, index) => (
          <Row
            key={country.code}
            alignItems="center"
            justifyContent="space-between"
            paddingX="2"
            paddingY="1"
            hoverBackgroundColor="2"
            borderRadius="1"
            style={{
              animation: `fadeSlideIn 0.2s ease-out ${index * 0.03}s forwards`,
              opacity: 0,
            }}
          >
            <Row alignItems="center" gap="2">
              <Text size="1">{country.code}</Text>
              <Text size="1" color="muted">{country.name}</Text>
            </Row>
            <Text size="1" weight="medium">{country.visitors.toLocaleString()}</Text>
          </Row>
        ))}
      </Column>
    </Column>
  );
}

// Compact Traffic Sparkline placeholder
function CompactTrafficSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <Row alignItems="flex-end" gap="1" style={{ height: '40px' }}>
      {data.map((value, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${((value - min) / range) * 100}%`,
            minHeight: '4px',
            backgroundColor: 'var(--blue-9)',
            borderRadius: '1px',
            opacity: 0.7 + (i / data.length) * 0.3,
            animation: `growUp 0.4s ease-out ${i * 0.03}s forwards`,
            transform: 'scaleY(0)',
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </Row>
  );
}

// Sample Data
const mockMetrics = {
  visitors: { value: '12,847', change: '+8.2%', type: 'positive' as const },
  visits: { value: '18,234', change: '+12.4%', type: 'positive' as const },
  pageviews: { value: '45,621', change: '+15.7%', type: 'positive' as const },
  bounceRate: { value: '42.3%', change: '-2.1%', type: 'positive' as const },
  avgDuration: { value: '3m 24s', change: '+18s', type: 'positive' as const },
};

const mockPages = [
  { label: '/', value: 8432, percent: 18 },
  { label: '/products', value: 6218, percent: 14 },
  { label: '/pricing', value: 4891, percent: 11 },
  { label: '/blog/analytics-guide', value: 3654, percent: 8 },
  { label: '/docs/getting-started', value: 3102, percent: 7 },
  { label: '/about', value: 2847, percent: 6 },
  { label: '/contact', value: 2156, percent: 5 },
  { label: '/features', value: 1987, percent: 4 },
  { label: '/blog/performance-tips', value: 1654, percent: 4 },
  { label: '/docs/api-reference', value: 1432, percent: 3 },
  { label: '/careers', value: 1298, percent: 3 },
  { label: '/blog/case-studies', value: 1156, percent: 3 },
  { label: '/integrations', value: 987, percent: 2 },
  { label: '/docs/webhooks', value: 876, percent: 2 },
  { label: '/changelog', value: 654, percent: 1 },
];

const mockEntryPages = [
  { label: '/', value: 6543, percent: 36 },
  { label: '/blog/analytics-guide', value: 2187, percent: 12 },
  { label: '/products', value: 1876, percent: 10 },
  { label: '/pricing', value: 1654, percent: 9 },
  { label: '/docs/getting-started', value: 1432, percent: 8 },
  { label: '/features', value: 987, percent: 5 },
  { label: '/blog/performance-tips', value: 876, percent: 5 },
  { label: '/about', value: 765, percent: 4 },
  { label: '/integrations', value: 543, percent: 3 },
  { label: '/contact', value: 432, percent: 2 },
  { label: '/docs/api-reference', value: 398, percent: 2 },
  { label: '/careers', value: 287, percent: 2 },
  { label: '/changelog', value: 198, percent: 1 },
  { label: '/blog/case-studies', value: 165, percent: 1 },
  { label: '/docs/webhooks', value: 143, percent: 1 },
];

const mockReferrers = [
  { label: 'google.com', value: 4521, percent: 25 },
  { label: 'twitter.com', value: 2187, percent: 12 },
  { label: 'github.com', value: 1876, percent: 10 },
  { label: 'linkedin.com', value: 1543, percent: 8 },
  { label: 'reddit.com', value: 1298, percent: 7 },
  { label: 'producthunt.com', value: 1087, percent: 6 },
  { label: 'hackernews.com', value: 976, percent: 5 },
  { label: 'dev.to', value: 854, percent: 5 },
  { label: 'facebook.com', value: 743, percent: 4 },
  { label: 'medium.com', value: 632, percent: 3 },
  { label: 'youtube.com', value: 521, percent: 3 },
  { label: 'stackoverflow.com', value: 432, percent: 2 },
  { label: 'bing.com', value: 321, percent: 2 },
  { label: 'duckduckgo.com', value: 287, percent: 2 },
  { label: 'slack.com', value: 198, percent: 1 },
];

const mockChannels = [
  { label: 'Organic Search', value: 7234, percent: 40 },
  { label: 'Direct', value: 4521, percent: 25 },
  { label: 'Social', value: 2876, percent: 16 },
  { label: 'Referral', value: 1987, percent: 11 },
  { label: 'Email', value: 876, percent: 5 },
  { label: 'Paid Search', value: 543, percent: 3 },
];

const mockBrowsers = [
  { label: 'Chrome', value: 8765, percent: 48 },
  { label: 'Safari', value: 4321, percent: 24 },
  { label: 'Firefox', value: 2198, percent: 12 },
  { label: 'Edge', value: 1654, percent: 9 },
  { label: 'Brave', value: 876, percent: 5 },
  { label: 'Opera', value: 287, percent: 2 },
  { label: 'Samsung Internet', value: 176, percent: 1 },
];

const mockOS = [
  { label: 'Windows', value: 6543, percent: 36 },
  { label: 'macOS', value: 4987, percent: 27 },
  { label: 'iOS', value: 3254, percent: 18 },
  { label: 'Android', value: 2187, percent: 12 },
  { label: 'Linux', value: 987, percent: 5 },
  { label: 'Chrome OS', value: 287, percent: 2 },
];

const mockDevices = [
  { label: 'Desktop', value: 11234, percent: 62 },
  { label: 'Mobile', value: 5432, percent: 30 },
  { label: 'Tablet', value: 1456, percent: 8 },
];

const mockCountries = [
  { label: 'United States', value: 5432, percent: 30 },
  { label: 'United Kingdom', value: 2187, percent: 12 },
  { label: 'Germany', value: 1876, percent: 10 },
  { label: 'Canada', value: 1543, percent: 8 },
  { label: 'France', value: 1298, percent: 7 },
  { label: 'Australia', value: 1087, percent: 6 },
  { label: 'Netherlands', value: 876, percent: 5 },
  { label: 'India', value: 765, percent: 4 },
  { label: 'Brazil', value: 654, percent: 4 },
  { label: 'Japan', value: 543, percent: 3 },
  { label: 'Spain', value: 432, percent: 2 },
  { label: 'Italy', value: 398, percent: 2 },
  { label: 'Sweden', value: 321, percent: 2 },
  { label: 'Singapore', value: 287, percent: 2 },
  { label: 'South Korea', value: 243, percent: 1 },
];

const mockCities = [
  { label: 'San Francisco', value: 1876, percent: 10 },
  { label: 'New York', value: 1654, percent: 9 },
  { label: 'London', value: 1432, percent: 8 },
  { label: 'Los Angeles', value: 1198, percent: 7 },
  { label: 'Berlin', value: 987, percent: 5 },
  { label: 'Toronto', value: 876, percent: 5 },
  { label: 'Paris', value: 765, percent: 4 },
  { label: 'Sydney', value: 654, percent: 4 },
  { label: 'Amsterdam', value: 543, percent: 3 },
  { label: 'Seattle', value: 487, percent: 3 },
  { label: 'Chicago', value: 432, percent: 2 },
  { label: 'Mumbai', value: 398, percent: 2 },
  { label: 'Melbourne', value: 354, percent: 2 },
  { label: 'Austin', value: 321, percent: 2 },
  { label: 'Boston', value: 287, percent: 2 },
];

const mockTopCountries = [
  { code: 'US', name: 'United States', visitors: 5432 },
  { code: 'GB', name: 'United Kingdom', visitors: 2187 },
  { code: 'DE', name: 'Germany', visitors: 1876 },
  { code: 'CA', name: 'Canada', visitors: 1543 },
  { code: 'FR', name: 'France', visitors: 1298 },
  { code: 'AU', name: 'Australia', visitors: 1087 },
  { code: 'NL', name: 'Netherlands', visitors: 876 },
  { code: 'IN', name: 'India', visitors: 765 },
];

const mockWeeklyData = [320, 480, 520, 450, 680, 890, 920, 780, 650, 720, 890, 950, 1020, 1180];

export default function CompactDataDensePage() {
  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes growUp {
          from {
            transform: scaleY(0);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
      <Column
        width="100%"
        paddingX={{ xs: '2', md: '4' }}
        paddingY="3"
        gap="3"
        style={{ maxWidth: '1600px', margin: '0 auto' }}
      >
        {/* Compact Header */}
        <Row alignItems="center" justifyContent="space-between">
          <Heading size="3">Analytics Dashboard</Heading>
          <Text size="1" color="muted">Last 30 days</Text>
        </Row>

        {/* Compact Metrics Bar - Horizontal Layout */}
        <Grid
          columns={{ xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }}
          gap="2"
          style={{
            animation: 'fadeSlideIn 0.3s ease-out forwards',
          }}
        >
          <CompactMetricCard
            label="Visitors"
            value={mockMetrics.visitors.value}
            change={mockMetrics.visitors.change}
            changeType={mockMetrics.visitors.type}
          />
          <CompactMetricCard
            label="Visits"
            value={mockMetrics.visits.value}
            change={mockMetrics.visits.change}
            changeType={mockMetrics.visits.type}
          />
          <CompactMetricCard
            label="Pageviews"
            value={mockMetrics.pageviews.value}
            change={mockMetrics.pageviews.change}
            changeType={mockMetrics.pageviews.type}
          />
          <CompactMetricCard
            label="Bounce"
            value={mockMetrics.bounceRate.value}
            change={mockMetrics.bounceRate.change}
            changeType={mockMetrics.bounceRate.type}
          />
          <CompactMetricCard
            label="Avg. Time"
            value={mockMetrics.avgDuration.value}
            change={mockMetrics.avgDuration.change}
            changeType={mockMetrics.avgDuration.type}
          />
        </Grid>

        {/* Mini Chart with Traffic Trend */}
        <Panel paddingX="3" paddingY="3">
          <Row alignItems="center" justifyContent="space-between" marginBottom="2">
            <Text size="1" weight="bold">Traffic Trend (14 days)</Text>
            <Text size="0" color="muted">Peak: 1,180 visitors</Text>
          </Row>
          <CompactTrafficSparkline data={mockWeeklyData} />
        </Panel>

        {/* 3-Column Dense Layout for Data Panels */}
        <Grid
          columns={{ xs: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' }}
          gap="2"
        >
          {/* Pages Panel */}
          <Panel paddingX="3" paddingY="3" style={{ minHeight: 'auto' }}>
            <Tabs>
              <TabList>
                <Tab id="pages"><Text size="1">Pages</Text></Tab>
                <Tab id="entry"><Text size="1">Entry</Text></Tab>
              </TabList>
              <TabPanel id="pages">
                <CompactDataTable title="Path" metric="Views" data={mockPages} />
              </TabPanel>
              <TabPanel id="entry">
                <CompactDataTable title="Path" metric="Entries" data={mockEntryPages} />
              </TabPanel>
            </Tabs>
          </Panel>

          {/* Sources Panel */}
          <Panel paddingX="3" paddingY="3" style={{ minHeight: 'auto' }}>
            <Tabs>
              <TabList>
                <Tab id="referrers"><Text size="1">Referrers</Text></Tab>
                <Tab id="channels"><Text size="1">Channels</Text></Tab>
              </TabList>
              <TabPanel id="referrers">
                <CompactDataTable title="Source" metric="Visits" data={mockReferrers} />
              </TabPanel>
              <TabPanel id="channels">
                <CompactDataTable title="Channel" metric="Visits" data={mockChannels} />
              </TabPanel>
            </Tabs>
          </Panel>

          {/* Location Panel with mini map data */}
          <Panel paddingX="3" paddingY="3" style={{ minHeight: 'auto' }}>
            <Tabs>
              <TabList>
                <Tab id="countries"><Text size="1">Countries</Text></Tab>
                <Tab id="cities"><Text size="1">Cities</Text></Tab>
              </TabList>
              <TabPanel id="countries">
                <CompactDataTable title="Country" metric="Visits" data={mockCountries} />
              </TabPanel>
              <TabPanel id="cities">
                <CompactDataTable title="City" metric="Visits" data={mockCities} />
              </TabPanel>
            </Tabs>
          </Panel>
        </Grid>

        {/* Second Row: Environment + Top Locations Sidebar */}
        <Grid
          columns={{ xs: '1fr', lg: '2fr 1fr' }}
          gap="2"
        >
          {/* Environment Panels - 2 columns within */}
          <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="2">
            {/* Browsers & OS */}
            <Panel paddingX="3" paddingY="3" style={{ minHeight: 'auto' }}>
              <Tabs>
                <TabList>
                  <Tab id="browsers"><Text size="1">Browsers</Text></Tab>
                  <Tab id="os"><Text size="1">OS</Text></Tab>
                </TabList>
                <TabPanel id="browsers">
                  <CompactDataTable title="Browser" metric="Users" data={mockBrowsers} />
                </TabPanel>
                <TabPanel id="os">
                  <CompactDataTable title="Operating System" metric="Users" data={mockOS} />
                </TabPanel>
              </Tabs>
            </Panel>

            {/* Devices */}
            <Panel paddingX="3" paddingY="3" style={{ minHeight: 'auto' }}>
              <Text size="1" weight="bold" style={{ marginBottom: '8px', display: 'block' }}>Devices</Text>
              <Column gap="2">
                {mockDevices.map((device, index) => (
                  <Row
                    key={device.label}
                    alignItems="center"
                    gap="2"
                    style={{
                      animation: `fadeSlideIn 0.2s ease-out ${index * 0.05}s forwards`,
                      opacity: 0,
                    }}
                  >
                    <Text size="1" style={{ width: '60px' }}>{device.label}</Text>
                    <div style={{ flex: 1, height: '16px', backgroundColor: 'var(--base-color-4)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${device.percent}%`,
                          height: '100%',
                          backgroundColor: 'var(--blue-9)',
                          borderRadius: '2px',
                          transition: 'width 0.5s ease-out',
                        }}
                      />
                    </div>
                    <Text size="1" weight="medium" style={{ width: '50px', textAlign: 'right' }}>
                      {device.value.toLocaleString()}
                    </Text>
                    <Text size="0" color="muted" style={{ width: '30px', textAlign: 'right' }}>
                      {device.percent}%
                    </Text>
                  </Row>
                ))}
              </Column>
            </Panel>
          </Grid>

          {/* Compact World Map Sidebar */}
          <Panel paddingX="3" paddingY="3" style={{ minHeight: 'auto' }}>
            <CompactWorldMapPlaceholder topCountries={mockTopCountries} />
          </Panel>
        </Grid>

        {/* Footer Stats Row */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingX="3"
          paddingY="2"
          backgroundColor
          border
          borderRadius="2"
          style={{
            animation: 'fadeSlideIn 0.3s ease-out 0.4s forwards',
            opacity: 0,
          }}
        >
          <Row gap="4">
            <Row alignItems="center" gap="1">
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--green-9)' }} />
              <Text size="0" color="muted">Realtime: 47 active</Text>
            </Row>
            <Text size="0" color="muted">Updated: 2 min ago</Text>
          </Row>
          <Row gap="3">
            <Text size="0" color="muted">Period: Nov 4 - Dec 4, 2024</Text>
            <Text size="0" color="muted">Timezone: UTC</Text>
          </Row>
        </Row>
      </Column>
    </>
  );
}
