'use client';

import { Column, Grid, Heading, Row, Text, Tabs, Tab, TabList, TabPanel } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatShortTime } from '@/lib/format';

// Realistic sample data
const metricsData = {
  visitors: 12847,
  visits: 18234,
  pageviews: 45621,
  bounceRate: 42.3,
  avgDuration: 204, // 3m 24s in seconds
  visitorsChange: 1247,
  visitsChange: 2108,
  pageviewsChange: 5432,
  bounceRateChange: -3.2,
  durationChange: 18,
};

const topPagesData = [
  { label: '/home', count: 8234, percent: 100 },
  { label: '/products/analytics-suite', count: 6821, percent: 83 },
  { label: '/pricing', count: 5432, percent: 66 },
  { label: '/about', count: 4123, percent: 50 },
  { label: '/blog/getting-started-with-web-analytics', count: 3654, percent: 44 },
  { label: '/contact', count: 2987, percent: 36 },
  { label: '/docs/api-reference', count: 2456, percent: 30 },
  { label: '/features', count: 2123, percent: 26 },
];

const entryPagesData = [
  { label: '/home', count: 7234, percent: 100 },
  { label: '/products/analytics-suite', count: 4821, percent: 67 },
  { label: '/blog/getting-started-with-web-analytics', count: 3654, percent: 51 },
  { label: '/pricing', count: 2432, percent: 34 },
  { label: '/docs/api-reference', count: 1987, percent: 27 },
];

const exitPagesData = [
  { label: '/pricing', count: 5432, percent: 100 },
  { label: '/contact', count: 4321, percent: 80 },
  { label: '/home', count: 3234, percent: 60 },
  { label: '/about', count: 2654, percent: 49 },
  { label: '/products/analytics-suite', count: 2123, percent: 39 },
];

const referrersData = [
  { label: 'google.com', count: 4521, percent: 100 },
  { label: 'twitter.com', count: 2834, percent: 63 },
  { label: 'Direct', count: 2456, percent: 54 },
  { label: 'linkedin.com', count: 1823, percent: 40 },
  { label: 'github.com', count: 1456, percent: 32 },
  { label: 'facebook.com', count: 987, percent: 22 },
  { label: 'reddit.com', count: 654, percent: 14 },
];

const channelsData = [
  { label: 'Organic Search', count: 5234, percent: 100 },
  { label: 'Social', count: 3987, percent: 76 },
  { label: 'Direct', count: 2456, percent: 47 },
  { label: 'Referral', count: 1823, percent: 35 },
  { label: 'Email', count: 987, percent: 19 },
];

const browsersData = [
  { label: 'Chrome', count: 7234, percent: 100 },
  { label: 'Safari', count: 3456, percent: 48 },
  { label: 'Firefox', count: 1234, percent: 17 },
  { label: 'Edge', count: 654, percent: 9 },
  { label: 'Opera', count: 234, percent: 3 },
  { label: 'Brave', count: 189, percent: 3 },
];

const osData = [
  { label: 'Windows', count: 5432, percent: 100 },
  { label: 'macOS', count: 4234, percent: 78 },
  { label: 'iOS', count: 1876, percent: 35 },
  { label: 'Android', count: 1234, percent: 23 },
  { label: 'Linux', count: 456, percent: 8 },
];

const devicesData = [
  { label: 'Desktop', count: 8765, percent: 100 },
  { label: 'Mobile', count: 3234, percent: 37 },
  { label: 'Tablet', count: 876, percent: 10 },
];

const countriesData = [
  { label: 'United States', count: 5432, percent: 100 },
  { label: 'United Kingdom', count: 2345, percent: 43 },
  { label: 'Germany', count: 1876, percent: 35 },
  { label: 'France', count: 1234, percent: 23 },
  { label: 'Canada', count: 987, percent: 18 },
  { label: 'Australia', count: 654, percent: 12 },
  { label: 'Netherlands', count: 432, percent: 8 },
  { label: 'Japan', count: 321, percent: 6 },
];

const regionsData = [
  { label: 'California', count: 2345, percent: 100 },
  { label: 'Texas', count: 1234, percent: 53 },
  { label: 'New York', count: 987, percent: 42 },
  { label: 'Florida', count: 654, percent: 28 },
  { label: 'Washington', count: 543, percent: 23 },
];

const citiesData = [
  { label: 'San Francisco', count: 1234, percent: 100 },
  { label: 'New York', count: 987, percent: 80 },
  { label: 'Los Angeles', count: 765, percent: 62 },
  { label: 'London', count: 654, percent: 53 },
  { label: 'Austin', count: 543, percent: 44 },
  { label: 'Berlin', count: 432, percent: 35 },
];

// Weekly traffic mock data (7 days x 24 hours)
const weeklyTrafficData = [
  [12, 8, 5, 3, 2, 4, 15, 45, 78, 92, 88, 76, 82, 95, 87, 72, 68, 54, 48, 42, 35, 28, 22, 15],
  [10, 6, 4, 2, 2, 5, 18, 52, 85, 98, 92, 78, 85, 92, 88, 75, 65, 52, 45, 38, 32, 25, 18, 12],
  [14, 9, 6, 4, 3, 6, 20, 58, 88, 105, 98, 82, 88, 98, 92, 78, 70, 58, 50, 42, 35, 28, 22, 16],
  [11, 7, 5, 3, 2, 5, 16, 48, 82, 95, 88, 75, 82, 94, 85, 72, 62, 50, 44, 38, 32, 24, 18, 13],
  [15, 10, 7, 5, 4, 8, 22, 62, 92, 110, 102, 88, 92, 102, 95, 82, 74, 62, 54, 45, 38, 30, 24, 18],
  [8, 5, 3, 2, 2, 3, 8, 25, 45, 58, 52, 48, 52, 55, 50, 42, 38, 32, 28, 24, 20, 16, 12, 9],
  [6, 4, 2, 2, 1, 2, 6, 18, 35, 48, 42, 38, 42, 48, 44, 38, 32, 28, 24, 20, 16, 12, 8, 7],
];

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// CSS keyframes for stagger animations
const staggerStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .stagger-1 { animation: fadeInUp 0.5s ease-out 0.1s forwards; opacity: 0; }
  .stagger-2 { animation: fadeInUp 0.5s ease-out 0.2s forwards; opacity: 0; }
  .stagger-3 { animation: fadeInUp 0.5s ease-out 0.3s forwards; opacity: 0; }
  .stagger-4 { animation: fadeInUp 0.5s ease-out 0.4s forwards; opacity: 0; }
  .stagger-5 { animation: fadeInUp 0.5s ease-out 0.5s forwards; opacity: 0; }
  .stagger-6 { animation: fadeInUp 0.5s ease-out 0.6s forwards; opacity: 0; }
  .stagger-7 { animation: fadeInUp 0.5s ease-out 0.7s forwards; opacity: 0; }

  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--base-color-6), transparent);
    margin: var(--spacing-8) 0;
  }

  .metrics-scroll-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
  }

  .metrics-scroll-container::-webkit-scrollbar {
    height: 4px;
  }

  .metrics-scroll-container::-webkit-scrollbar-track {
    background: var(--base-color-3);
    border-radius: 2px;
  }

  .metrics-scroll-container::-webkit-scrollbar-thumb {
    background: var(--base-color-6);
    border-radius: 2px;
  }

  .weekly-traffic-cell {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .weekly-traffic-cell:hover {
    transform: scale(1.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

function SectionDivider() {
  return <div className="section-divider" />;
}

function WeeklyTrafficGrid() {
  const maxValue = Math.max(...weeklyTrafficData.flat());

  return (
    <Column gap="3">
      <Row gap="2" style={{ paddingLeft: '48px' }}>
        {Array.from({ length: 24 }, (_, i) => (
          <Text
            key={i}
            size="1"
            color="muted"
            style={{ width: '20px', textAlign: 'center' }}
          >
            {i % 4 === 0 ? `${i}` : ''}
          </Text>
        ))}
      </Row>
      {weeklyTrafficData.map((dayData, dayIndex) => (
        <Row key={dayIndex} gap="2" alignItems="center">
          <Text size="2" weight="medium" style={{ width: '40px' }}>
            {dayLabels[dayIndex]}
          </Text>
          {dayData.map((value, hourIndex) => {
            const intensity = value / maxValue;
            return (
              <div
                key={hourIndex}
                className="weekly-traffic-cell"
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: 'var(--border-radius-1)',
                  backgroundColor: `color-mix(in srgb, var(--color-blue) ${Math.round(intensity * 100)}%, var(--base-color-3))`,
                  cursor: 'pointer',
                }}
                title={`${dayLabels[dayIndex]} ${hourIndex}:00 - ${value} visitors`}
              />
            );
          })}
        </Row>
      ))}
    </Column>
  );
}

export default function SingleColumnFocusPage() {
  return (
    <>
      <style>{staggerStyles}</style>
      <PageBody maxWidth="900px">
        <Column gap="6" paddingY="6">
          {/* Header */}
          <div className="stagger-1">
            <Column gap="2">
              <Heading size="4">Website Analytics</Heading>
              <Text color="muted">
                December 4, 2025 - Single column view optimized for readability
              </Text>
            </Column>
          </div>

          {/* Key Metrics - Horizontal scrollable on mobile, full width on desktop */}
          <div className="stagger-2">
            <Column gap="3">
              <Heading size="2">Overview</Heading>
              <div className="metrics-scroll-container">
                <Row gap="3" style={{ minWidth: 'max-content' }}>
                  <MetricCard
                    value={metricsData.visitors}
                    label="Visitors"
                    change={metricsData.visitorsChange}
                    formatValue={formatLongNumber}
                    showChange={true}
                    valueSize="7"
                  />
                  <MetricCard
                    value={metricsData.visits}
                    label="Visits"
                    change={metricsData.visitsChange}
                    formatValue={formatLongNumber}
                    showChange={true}
                    valueSize="7"
                  />
                  <MetricCard
                    value={metricsData.pageviews}
                    label="Pageviews"
                    change={metricsData.pageviewsChange}
                    formatValue={formatLongNumber}
                    showChange={true}
                    valueSize="7"
                  />
                  <MetricCard
                    value={metricsData.bounceRate}
                    label="Bounce Rate"
                    change={metricsData.bounceRateChange}
                    formatValue={(n: number) => `${Math.round(n)}%`}
                    showChange={true}
                    reverseColors={true}
                    valueSize="7"
                  />
                  <MetricCard
                    value={metricsData.avgDuration}
                    label="Avg Duration"
                    change={metricsData.durationChange}
                    formatValue={(n: number) => formatShortTime(Math.abs(n), ['m', 's'], ' ')}
                    showChange={true}
                    valueSize="7"
                  />
                </Row>
              </div>
            </Column>
          </div>

          <SectionDivider />

          {/* Weekly Traffic Heatmap */}
          <div className="stagger-3">
            <Panel>
              <Heading size="2">Weekly Traffic Patterns</Heading>
              <Text color="muted" size="2" style={{ marginBottom: 'var(--spacing-4)' }}>
                Visitor activity by hour across the week
              </Text>
              <Row border="bottom" style={{ marginBottom: 'var(--spacing-4)' }} />
              <div style={{ overflowX: 'auto' }}>
                <WeeklyTrafficGrid />
              </div>
            </Panel>
          </div>

          <SectionDivider />

          {/* Pages Section */}
          <div className="stagger-4">
            <Panel>
              <Heading size="2">Pages</Heading>
              <Text color="muted" size="2" style={{ marginBottom: 'var(--spacing-4)' }}>
                Most viewed pages, entry points, and exit pages
              </Text>
              <Row border="bottom" style={{ marginBottom: 'var(--spacing-4)' }} />
              <Tabs>
                <TabList>
                  <Tab id="pages">Top Pages</Tab>
                  <Tab id="entry">Entry Pages</Tab>
                  <Tab id="exit">Exit Pages</Tab>
                </TabList>
                <TabPanel id="pages">
                  <ListTable
                    data={topPagesData}
                    title="Page"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
                <TabPanel id="entry">
                  <ListTable
                    data={entryPagesData}
                    title="Entry Page"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
                <TabPanel id="exit">
                  <ListTable
                    data={exitPagesData}
                    title="Exit Page"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
              </Tabs>
            </Panel>
          </div>

          <SectionDivider />

          {/* Sources Section */}
          <div className="stagger-5">
            <Panel>
              <Heading size="2">Traffic Sources</Heading>
              <Text color="muted" size="2" style={{ marginBottom: 'var(--spacing-4)' }}>
                Where your visitors are coming from
              </Text>
              <Row border="bottom" style={{ marginBottom: 'var(--spacing-4)' }} />
              <Tabs>
                <TabList>
                  <Tab id="referrers">Referrers</Tab>
                  <Tab id="channels">Channels</Tab>
                </TabList>
                <TabPanel id="referrers">
                  <ListTable
                    data={referrersData}
                    title="Referrer"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
                <TabPanel id="channels">
                  <ListTable
                    data={channelsData}
                    title="Channel"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
              </Tabs>
            </Panel>
          </div>

          <SectionDivider />

          {/* Environment Section */}
          <div className="stagger-6">
            <Panel>
              <Heading size="2">Environment</Heading>
              <Text color="muted" size="2" style={{ marginBottom: 'var(--spacing-4)' }}>
                Technical details about your visitors
              </Text>
              <Row border="bottom" style={{ marginBottom: 'var(--spacing-4)' }} />
              <Tabs>
                <TabList>
                  <Tab id="browsers">Browsers</Tab>
                  <Tab id="os">Operating Systems</Tab>
                  <Tab id="devices">Devices</Tab>
                </TabList>
                <TabPanel id="browsers">
                  <ListTable
                    data={browsersData}
                    title="Browser"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
                <TabPanel id="os">
                  <ListTable
                    data={osData}
                    title="Operating System"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
                <TabPanel id="devices">
                  <ListTable
                    data={devicesData}
                    title="Device"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
              </Tabs>
            </Panel>
          </div>

          <SectionDivider />

          {/* Location Section */}
          <div className="stagger-7">
            <Panel>
              <Heading size="2">Location</Heading>
              <Text color="muted" size="2" style={{ marginBottom: 'var(--spacing-4)' }}>
                Geographic distribution of your audience
              </Text>
              <Row border="bottom" style={{ marginBottom: 'var(--spacing-4)' }} />
              <Tabs>
                <TabList>
                  <Tab id="countries">Countries</Tab>
                  <Tab id="regions">Regions</Tab>
                  <Tab id="cities">Cities</Tab>
                </TabList>
                <TabPanel id="countries">
                  <ListTable
                    data={countriesData}
                    title="Country"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
                <TabPanel id="regions">
                  <ListTable
                    data={regionsData}
                    title="Region"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
                <TabPanel id="cities">
                  <ListTable
                    data={citiesData}
                    title="City"
                    metric="Visitors"
                    showPercentage={true}
                  />
                </TabPanel>
              </Tabs>
            </Panel>
          </div>
        </Column>
      </PageBody>
    </>
  );
}
