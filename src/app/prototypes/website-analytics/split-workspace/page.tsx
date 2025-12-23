'use client';

import { useState } from 'react';
import { Column, Row, Grid, Text, Heading, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { useMessages } from '@/components/hooks';

// Sample chart data for the line chart visualization
const generateChartData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    visitors: Math.floor(1500 + Math.random() * 500 + i * 100),
    views: Math.floor(3000 + Math.random() * 1000 + i * 150),
  }));
};

// Sample table data
const generateTableData = (type: string) => {
  const data: Record<string, any[]> = {
    pages: [
      { label: '/home', count: 8234, percent: 19.5 },
      { label: '/products', count: 6891, percent: 16.3 },
      { label: '/about', count: 5123, percent: 12.2 },
      { label: '/contact', count: 4567, percent: 10.8 },
      { label: '/blog', count: 3892, percent: 9.2 },
      { label: '/pricing', count: 3234, percent: 7.7 },
      { label: '/features', count: 2891, percent: 6.9 },
      { label: '/docs', count: 2456, percent: 5.8 },
      { label: '/login', count: 1987, percent: 4.7 },
      { label: '/signup', count: 1881, percent: 4.5 },
    ],
    sources: [
      { label: 'google.com', count: 15234, percent: 36.1 },
      { label: 'Direct', count: 9876, percent: 23.4 },
      { label: 'twitter.com', count: 7654, percent: 18.2 },
      { label: 'facebook.com', count: 4321, percent: 10.3 },
      { label: 'linkedin.com', count: 3210, percent: 7.6 },
      { label: 'reddit.com', count: 1987, percent: 4.7 },
    ],
    browsers: [
      { label: 'Chrome', count: 25890, percent: 61.4 },
      { label: 'Safari', count: 8456, percent: 20.1 },
      { label: 'Firefox', count: 4321, percent: 10.3 },
      { label: 'Edge', count: 2891, percent: 6.9 },
      { label: 'Other', count: 598, percent: 1.4 },
    ],
    countries: [
      { label: 'United States', count: 18234, percent: 43.3 },
      { label: 'United Kingdom', count: 7891, percent: 18.7 },
      { label: 'Canada', count: 5234, percent: 12.4 },
      { label: 'Germany', count: 4123, percent: 9.8 },
      { label: 'France', count: 3456, percent: 8.2 },
      { label: 'Australia', count: 2218, percent: 5.3 },
    ],
  };
  return data[type] || [];
};

// Simple sparkline component
const Sparkline = ({ data, color = '#3e63dd' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="20" style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Sidebar metric component with sparkline
const SidebarMetric = ({
  label,
  value,
  trendData,
  trendDirection
}: {
  label: string;
  value: string;
  trendData: number[];
  trendDirection: 'up' | 'down';
}) => {
  return (
    <Column
      gap="2"
      paddingY="4"
      paddingX="4"
      borderRadius="2"
      backgroundColor
      border
    >
      <Text size="1" weight="medium" color="muted">
        {label}
      </Text>
      <Row alignItems="center" justifyContent="space-between">
        <Text size="7" weight="bold">
          {value}
        </Text>
        <Column alignItems="flex-end">
          <Sparkline
            data={trendData}
            color={trendDirection === 'up' ? '#30a46c' : '#e5484d'}
          />
          <Text size="0" weight="medium" style={{ color: trendDirection === 'up' ? '#30a46c' : '#e5484d' }}>
            {trendDirection === 'up' ? '↑' : '↓'} {Math.floor(Math.random() * 15 + 5)}%
          </Text>
        </Column>
      </Row>
    </Column>
  );
};

// Simple table component
const SimpleTable = ({ data, title, metric }: { data: any[]; title: string; metric: string }) => {
  return (
    <Column gap="2">
      <Grid alignItems="center" justifyContent="space-between" paddingLeft="2" columns="1fr 100px">
        <Text weight="bold" size="1">{title}</Text>
        <Text weight="bold" align="center" size="1">{metric}</Text>
      </Grid>
      <Column gap="1">
        {data.map((row, index) => (
          <Grid
            key={index}
            columns="1fr 50px 50px"
            paddingLeft="2"
            paddingY="1"
            alignItems="center"
            hoverBackgroundColor="2"
            borderRadius
            gap
          >
            <Text truncate size="1">{row.label}</Text>
            <Text weight="bold" align="end" size="1">
              {row.count.toLocaleString()}
            </Text>
            <Text align="end" color="muted" size="1" paddingLeft="2" border="left">
              {row.percent}%
            </Text>
          </Grid>
        ))}
      </Column>
    </Column>
  );
};

// Simple chart component
const SimpleChart = ({ data }: { data: any[] }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.visitors, d.views]));

  return (
    <Column gap="3">
      <Row justifyContent="space-between" alignItems="center">
        <Heading size="3">Traffic Overview</Heading>
        <Row gap="3">
          <Row gap="2" alignItems="center">
            <div style={{ width: 12, height: 12, backgroundColor: '#3e63dd', borderRadius: 2 }} />
            <Text size="1">Visitors</Text>
          </Row>
          <Row gap="2" alignItems="center">
            <div style={{ width: 12, height: 12, backgroundColor: '#30a46c', borderRadius: 2 }} />
            <Text size="1">Views</Text>
          </Row>
        </Row>
      </Row>
      <div style={{ height: 300, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        {data.map((item, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
              <div
                style={{
                  width: '40%',
                  height: (item.visitors / maxValue) * 250,
                  backgroundColor: '#3e63dd',
                  borderRadius: '2px 2px 0 0',
                  minHeight: 2,
                }}
                title={`Visitors: ${item.visitors}`}
              />
              <div
                style={{
                  width: '40%',
                  height: (item.views / maxValue) * 250,
                  backgroundColor: '#30a46c',
                  borderRadius: '2px 2px 0 0',
                  minHeight: 2,
                }}
                title={`Views: ${item.views}`}
              />
            </div>
            <Text size="0" color="muted">{item.day}</Text>
          </div>
        ))}
      </div>
    </Column>
  );
};

export default function SplitWorkspacePage() {
  const { formatMessage, labels } = useMessages();
  const [chartData] = useState(generateChartData());

  // Generate trend data for sparklines
  const visitorsTrend = [12200, 12500, 12300, 12700, 12600, 12900, 12847];
  const visitsTrend = [17800, 18100, 17900, 18200, 18100, 18400, 18293];
  const viewsTrend = [40100, 41200, 40800, 41500, 41800, 42000, 42156];
  const bounceRateTrend = [45, 44, 43, 43, 42, 42, 42];
  const durationTrend = [180, 185, 190, 195, 200, 202, 204];

  return (
    <Column gap="4" padding="6" backgroundColor="2" minHeight="100vh">
      <Heading size="6">Split Workspace Analytics</Heading>

      {/* Main layout container */}
      <Row gap="4" alignItems="flex-start">
        {/* Fixed sidebar */}
        <Column
          gap="3"
          style={{
            width: 280,
            position: 'sticky',
            top: 24,
            flexShrink: 0,
          }}
        >
          <Column gap="3" padding="4" borderRadius="3" backgroundColor border>
            <Heading size="3">Key Metrics</Heading>
            <Column gap="3">
              <SidebarMetric
                label="Visitors"
                value="12,847"
                trendData={visitorsTrend}
                trendDirection="up"
              />
              <SidebarMetric
                label="Visits"
                value="18,293"
                trendData={visitsTrend}
                trendDirection="up"
              />
              <SidebarMetric
                label="Page Views"
                value="42,156"
                trendData={viewsTrend}
                trendDirection="up"
              />
              <SidebarMetric
                label="Bounce Rate"
                value="42%"
                trendData={bounceRateTrend}
                trendDirection="down"
              />
              <SidebarMetric
                label="Avg. Duration"
                value="3m 24s"
                trendData={durationTrend}
                trendDirection="up"
              />
            </Column>
          </Column>
        </Column>

        {/* Main content area */}
        <Column gap="4" style={{ flex: 1, minWidth: 0 }}>
          {/* Chart panel */}
          <Panel minHeight="400px">
            <SimpleChart data={chartData} />
          </Panel>

          {/* Tabbed data panels in 2-column grid */}
          <Grid gap="4" columns={{ xs: '1', md: '2' }}>
            {/* Pages Panel */}
            <Panel minHeight="500px">
              <Heading size="3" style={{ marginBottom: 16 }}>
                {formatMessage(labels.pages)}
              </Heading>
              <Tabs>
                <TabList>
                  <Tab id="path">{formatMessage(labels.path)}</Tab>
                  <Tab id="entry">{formatMessage(labels.entry)}</Tab>
                  <Tab id="exit">{formatMessage(labels.exit)}</Tab>
                </TabList>
                <TabPanel id="path">
                  <SimpleTable
                    data={generateTableData('pages')}
                    title="Path"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
                <TabPanel id="entry">
                  <SimpleTable
                    data={generateTableData('pages')}
                    title="Entry"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
                <TabPanel id="exit">
                  <SimpleTable
                    data={generateTableData('pages')}
                    title="Exit"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
              </Tabs>
            </Panel>

            {/* Sources Panel */}
            <Panel minHeight="500px">
              <Heading size="3" style={{ marginBottom: 16 }}>
                {formatMessage(labels.sources)}
              </Heading>
              <Tabs>
                <TabList>
                  <Tab id="referrer">{formatMessage(labels.referrers)}</Tab>
                  <Tab id="channel">{formatMessage(labels.channels)}</Tab>
                </TabList>
                <TabPanel id="referrer">
                  <SimpleTable
                    data={generateTableData('sources')}
                    title="Referrer"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
                <TabPanel id="channel">
                  <SimpleTable
                    data={generateTableData('sources')}
                    title="Channel"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
              </Tabs>
            </Panel>

            {/* Environment Panel */}
            <Panel minHeight="500px">
              <Heading size="3" style={{ marginBottom: 16 }}>
                {formatMessage(labels.environment)}
              </Heading>
              <Tabs>
                <TabList>
                  <Tab id="browser">{formatMessage(labels.browsers)}</Tab>
                  <Tab id="os">{formatMessage(labels.os)}</Tab>
                  <Tab id="device">{formatMessage(labels.devices)}</Tab>
                </TabList>
                <TabPanel id="browser">
                  <SimpleTable
                    data={generateTableData('browsers')}
                    title="Browser"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
                <TabPanel id="os">
                  <SimpleTable
                    data={generateTableData('browsers')}
                    title="OS"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
                <TabPanel id="device">
                  <SimpleTable
                    data={generateTableData('browsers')}
                    title="Device"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
              </Tabs>
            </Panel>

            {/* Location Panel */}
            <Panel minHeight="500px">
              <Heading size="3" style={{ marginBottom: 16 }}>
                {formatMessage(labels.location)}
              </Heading>
              <Tabs>
                <TabList>
                  <Tab id="country">{formatMessage(labels.countries)}</Tab>
                  <Tab id="region">{formatMessage(labels.regions)}</Tab>
                  <Tab id="city">{formatMessage(labels.cities)}</Tab>
                </TabList>
                <TabPanel id="country">
                  <SimpleTable
                    data={generateTableData('countries')}
                    title="Country"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
                <TabPanel id="region">
                  <SimpleTable
                    data={generateTableData('countries')}
                    title="Region"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
                <TabPanel id="city">
                  <SimpleTable
                    data={generateTableData('countries')}
                    title="City"
                    metric={formatMessage(labels.visitors)}
                  />
                </TabPanel>
              </Tabs>
            </Panel>
          </Grid>
        </Column>
      </Row>
    </Column>
  );
}
