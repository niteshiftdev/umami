'use client';

import { Column, Grid, Heading, Row, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricCard } from '@/components/metrics/MetricCard';
import { GridRow } from '@/components/common/GridRow';
import styles from './page.module.css';

// Mock data for engagement metrics
const mockEngagementData = {
  visitors: 12847,
  visitorChange: 2341,
  visits: 18920,
  visitsChange: -1256,
  pageviews: 45632,
  pageviewsChange: 3421,
  bounceRate: 32.5,
  bounceRateChange: -2.3,
  avgSessionTime: 245, // seconds
  avgSessionTimeChange: 18,
  returnVisitors: 4521,
  returnVisitorsChange: 892,
};

const mockEngagementBreakdown = [
  { name: 'High Engagement (>5min)', users: 3421, percentage: 26.6, color: '#44b556' },
  { name: 'Medium Engagement (1-5min)', users: 5634, percentage: 43.8, color: '#2680eb' },
  { name: 'Low Engagement (<1min)', users: 2145, percentage: 16.7, color: '#e68619' },
  { name: 'No Engagement', users: 1647, percentage: 12.8, color: '#e34850' },
];

const mockContentEngagement = [
  { page: '/blog/react-hooks-guide', views: 2847, avgTime: 312, bounceRate: 24 },
  { page: '/products', views: 2154, avgTime: 186, bounceRate: 41 },
  { page: '/docs/getting-started', views: 1923, avgTime: 425, bounceRate: 18 },
  { page: '/about', views: 1456, avgTime: 89, bounceRate: 67 },
  { page: '/blog/next-js-tips', views: 1234, avgTime: 287, bounceRate: 29 },
];

const mockReturnVisitorTrend = [
  { period: 'Mon', newVisitors: 2341, returning: 1456, engaged: 876 },
  { period: 'Tue', newVisitors: 2156, returning: 1689, engaged: 945 },
  { period: 'Wed', newVisitors: 2654, returning: 1823, engaged: 1123 },
  { period: 'Thu', newVisitors: 2489, returning: 1954, engaged: 1289 },
  { period: 'Fri', newVisitors: 3124, returning: 2341, engaged: 1567 },
  { period: 'Sat', newVisitors: 1987, returning: 1456, engaged: 1034 },
  { period: 'Sun', newVisitors: 1321, returning: 987, engaged: 654 },
];

const mockDeviceEngagement = [
  { device: 'Desktop', users: 7234, avgTime: 298, bounceRate: 28 },
  { device: 'Mobile', users: 4156, avgTime: 156, bounceRate: 45 },
  { device: 'Tablet', users: 1457, avgTime: 201, bounceRate: 38 },
];

export default function MultiMetricsDashboard() {
  return (
    <Column gap>
      <div className={styles.header}>
        <Heading size="1">Multi-Metric Engagement Dashboard</Heading>
        <p className={styles.subtitle}>
          Beyond visits: Understanding user engagement depth, quality, and behavior patterns
        </p>
      </div>

      {/* Enhanced Metrics Bar with Engagement Focus */}
      <MetricsBar>
        <MetricCard
          value={mockEngagementData.visitors}
          label="Visitors"
          change={mockEngagementData.visitorChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
        <MetricCard
          value={mockEngagementData.visits}
          label="Visits"
          change={mockEngagementData.visitsChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
        <MetricCard
          value={mockEngagementData.pageviews}
          label="Pageviews"
          change={mockEngagementData.pageviewsChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
        <MetricCard
          value={mockEngagementData.bounceRate}
          label="Bounce Rate"
          change={mockEngagementData.bounceRateChange}
          formatValue={(n) => `${Math.round(n)}%`}
          reverseColors={true}
        />
        <MetricCard
          value={mockEngagementData.avgSessionTime}
          label="Avg Session Time"
          change={mockEngagementData.avgSessionTimeChange}
          formatValue={(n) => {
            const mins = Math.floor(n / 60);
            const secs = n % 60;
            return `${mins}m ${secs}s`;
          }}
        />
        <MetricCard
          value={mockEngagementData.returnVisitors}
          label="Return Visitors"
          change={mockEngagementData.returnVisitorsChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
      </MetricsBar>

      {/* Engagement Segments */}
      <GridRow layout="one">
        <Panel>
          <Heading size="2">Visitor Engagement Segments</Heading>
          <Row border="bottom" marginBottom="4" />
          <div className={styles.segmentGrid}>
            {mockEngagementBreakdown.map((segment) => (
              <div key={segment.name} className={styles.segment}>
                <div className={styles.segmentBar}>
                  <div
                    className={styles.segmentFill}
                    style={{
                      width: `${segment.percentage}%`,
                      backgroundColor: segment.color,
                    }}
                  />
                </div>
                <div className={styles.segmentLabel}>
                  <span className={styles.segmentName}>{segment.name}</span>
                  <span className={styles.segmentStats}>
                    {segment.users.toLocaleString()} users ({segment.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </GridRow>

      {/* Content Performance & Return Visitor Trends */}
      <GridRow layout="two" minHeight="500px">
        <Panel>
          <Heading size="2">Top Pages by Engagement</Heading>
          <Tabs>
            <TabList>
              <Tab id="views">By Views</Tab>
              <Tab id="time">By Time</Tab>
              <Tab id="bounce">By Engagement</Tab>
            </TabList>
            <TabPanel id="views">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Views</th>
                    <th>Avg Time</th>
                    <th>Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {mockContentEngagement.map((row) => (
                    <tr key={row.page}>
                      <td className={styles.pageName}>{row.page}</td>
                      <td>{row.views.toLocaleString()}</td>
                      <td>{Math.floor(row.avgTime / 60)}m {row.avgTime % 60}s</td>
                      <td>{row.bounceRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel id="time">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Avg Time</th>
                    <th>Views</th>
                    <th>Quality Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockContentEngagement].sort((a, b) => b.avgTime - a.avgTime).map((row) => (
                    <tr key={row.page}>
                      <td className={styles.pageName}>{row.page}</td>
                      <td className={styles.highlight}>{Math.floor(row.avgTime / 60)}m {row.avgTime % 60}s</td>
                      <td>{row.views.toLocaleString()}</td>
                      <td className={styles.score}>{Math.round((row.avgTime / 425) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel id="bounce">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Bounce Rate</th>
                    <th>Engagement</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockContentEngagement].sort((a, b) => a.bounceRate - b.bounceRate).map((row) => (
                    <tr key={row.page}>
                      <td className={styles.pageName}>{row.page}</td>
                      <td>
                        <span className={row.bounceRate < 30 ? styles.good : row.bounceRate < 45 ? styles.warning : styles.poor}>
                          {row.bounceRate}%
                        </span>
                      </td>
                      <td className={styles.highlight}>{Math.round((row.avgTime / 425) * 100)}%</td>
                      <td>→</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </Tabs>
        </Panel>

        <Panel>
          <Heading size="2">Return Visitor Trend</Heading>
          <div className={styles.trendChart}>
            {mockReturnVisitorTrend.map((day) => (
              <div key={day.period} className={styles.trendDay}>
                <div className={styles.trendLabel}>{day.period}</div>
                <div className={styles.trendBars}>
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(day.newVisitors / 3500) * 100}%`,
                      backgroundColor: '#2680eb',
                    }}
                    title={`New: ${day.newVisitors}`}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(day.returning / 3500) * 100}%`,
                      backgroundColor: '#9256d9',
                    }}
                    title={`Returning: ${day.returning}`}
                  />
                  <div
                    className={styles.bar}
                    style={{
                      height: `${(day.engaged / 3500) * 100}%`,
                      backgroundColor: '#44b556',
                    }}
                    title={`Engaged: ${day.engaged}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: '#2680eb' }} />
              New Visitors
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: '#9256d9' }} />
              Returning
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendColor} style={{ backgroundColor: '#44b556' }} />
              Highly Engaged
            </div>
          </div>
        </Panel>
      </GridRow>

      {/* Device Performance */}
      <GridRow layout="one">
        <Panel>
          <Heading size="2">Engagement by Device Type</Heading>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Device</th>
                <th>Users</th>
                <th>Avg Session Time</th>
                <th>Bounce Rate</th>
                <th>Performance Score</th>
              </tr>
            </thead>
            <tbody>
              {mockDeviceEngagement.map((device) => (
                <tr key={device.device}>
                  <td className={styles.deviceName}>{device.device}</td>
                  <td>{device.users.toLocaleString()}</td>
                  <td>{Math.floor(device.avgTime / 60)}m {device.avgTime % 60}s</td>
                  <td>
                    <span className={device.bounceRate < 35 ? styles.good : device.bounceRate < 50 ? styles.warning : styles.poor}>
                      {device.bounceRate}%
                    </span>
                  </td>
                  <td>
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreFill}
                        style={{
                          width: `${100 - device.bounceRate}%`,
                          backgroundColor: device.bounceRate < 35 ? '#44b556' : device.bounceRate < 50 ? '#e68619' : '#e34850',
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </GridRow>
    </Column>
  );
}
