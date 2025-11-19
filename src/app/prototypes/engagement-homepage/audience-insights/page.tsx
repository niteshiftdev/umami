'use client';

import { Column, Heading, Row, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricCard } from '@/components/metrics/MetricCard';
import { GridRow } from '@/components/common/GridRow';
import styles from './page.module.css';

// Mock data for audience insights
const mockAudienceMetrics = {
  uniqueAudience: 12847,
  audienceChange: 2341,
  newVisitors: 8234,
  newVisitorsChange: 1456,
  returningRate: 36.1,
  returningRateChange: 2.3,
  loyaltyScore: 7.2,
  loyaltyChange: 0.4,
};

const mockDeviceMetrics = [
  { device: 'Desktop', users: 7234, percentage: 56.3, sessions: 8456, avgTime: 298, bounceRate: 28 },
  { device: 'Mobile', users: 4156, percentage: 32.3, sessions: 4892, avgTime: 156, bounceRate: 45 },
  { device: 'Tablet', users: 1457, percentage: 11.3, sessions: 1923, avgTime: 201, bounceRate: 38 },
];

const mockBrowserMetrics = [
  { browser: 'Chrome', users: 5234, percentage: 40.7, avgTime: 245, engagement: 7.2 },
  { browser: 'Safari', users: 3421, percentage: 26.6, avgTime: 189, engagement: 6.8 },
  { browser: 'Firefox', users: 2145, percentage: 16.7, avgTime: 267, engagement: 7.5 },
  { browser: 'Edge', users: 1647, percentage: 12.8, avgTime: 198, engagement: 6.5 },
];

const mockGeoMetrics = [
  { country: 'United States', users: 4521, percentage: 35.2, avgTime: 289, engagement: 7.4, growth: 12.3 },
  { country: 'United Kingdom', users: 1876, percentage: 14.6, avgTime: 267, engagement: 7.1, growth: 8.9 },
  { country: 'Canada', users: 1456, percentage: 11.3, avgTime: 245, engagement: 7.0, growth: 5.6 },
  { country: 'Germany', users: 987, percentage: 7.7, avgTime: 298, engagement: 7.6, growth: 15.2 },
  { country: 'France', users: 845, percentage: 6.6, avgTime: 212, engagement: 6.9, growth: 3.2 },
];

const mockBehaviorSegments = [
  { segment: 'Power Users', users: 1234, percentage: 9.6, sessions: 8.4, days: 28, loyalty: 'Very High', value: 'High' },
  { segment: 'Regular Users', users: 3456, percentage: 26.9, sessions: 5.2, days: 21, loyalty: 'High', value: 'High' },
  { segment: 'Casual Browsers', users: 5234, percentage: 40.7, sessions: 2.1, days: 14, loyalty: 'Medium', value: 'Medium' },
  { segment: 'One-Time Visitors', users: 2923, percentage: 22.7, sessions: 1.0, days: 1, loyalty: 'Low', value: 'Low' },
];

const mockVisitorLifecycle = [
  { stage: 'New Visitor', count: 8234, percentage: 64.0 },
  { stage: 'First Week', count: 2145, percentage: 16.7 },
  { stage: '1-4 Weeks', count: 1234, percentage: 9.6 },
  { stage: '1-3 Months', count: 678, percentage: 5.3 },
  { stage: 'Power User (3+ months)', count: 556, percentage: 4.3 },
];

const mockAudienceEngagementMatrix = [
  { segment: 'High Engagement + High Frequency', users: 1234, percentage: 9.6, retention: 89, ltv: '$2,450' },
  { segment: 'High Engagement + Low Frequency', users: 2456, percentage: 19.1, retention: 65, ltv: '$890' },
  { segment: 'Low Engagement + High Frequency', users: 3678, percentage: 28.6, retention: 72, ltv: '$650' },
  { segment: 'Low Engagement + Low Frequency', users: 5479, percentage: 42.6, retention: 28, ltv: '$120' },
];

const mockSourcePerformance = [
  { source: 'Direct', users: 4521, percentage: 35.2, engagement: 7.8, retention: 72, quality: 'Excellent' },
  { source: 'Google Organic', users: 3876, percentage: 30.1, engagement: 7.5, retention: 68, quality: 'Excellent' },
  { source: 'Social Media', users: 2145, percentage: 16.7, engagement: 6.2, retention: 42, quality: 'Good' },
  { source: 'Referral', users: 1234, percentage: 9.6, engagement: 7.1, retention: 59, quality: 'Good' },
  { source: 'Paid Ads', users: 1071, percentage: 8.3, engagement: 5.8, retention: 35, quality: 'Fair' },
];

const mockCohortRetention = [
  { cohort: 'Jan 2025', day0: 100, day7: 42, day14: 28, day30: 15, day60: 8, day90: 4 },
  { cohort: 'Feb 2025', day0: 100, day7: 45, day14: 31, day30: 18, day60: 10, day90: 5 },
  { cohort: 'Mar 2025', day0: 100, day7: 38, day14: 24, day30: 12, day60: 7, day90: null },
  { cohort: 'Apr 2025', day0: 100, day7: 41, day14: 26, day30: 14, day60: null, day90: null },
  { cohort: 'May 2025', day0: 100, day7: 39, day14: 25, day30: null, day60: null, day90: null },
];

export default function AudienceInsightsDashboard() {
  return (
    <Column gap>
      <div className={styles.header}>
        <Heading size="1">Audience Insights & Behavior Analysis</Heading>
        <p className={styles.subtitle}>
          Deep dive into your audience composition, behavior patterns, device preferences, and long-term value
        </p>
      </div>

      {/* Audience Metrics */}
      <MetricsBar>
        <MetricCard
          value={mockAudienceMetrics.uniqueAudience}
          label="Unique Visitors"
          change={mockAudienceMetrics.audienceChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
        <MetricCard
          value={mockAudienceMetrics.newVisitors}
          label="New Visitors"
          change={mockAudienceMetrics.newVisitorsChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
        <MetricCard
          value={mockAudienceMetrics.returningRate}
          label="Return Visitor Rate"
          change={mockAudienceMetrics.returningRateChange}
          formatValue={(n) => `${n.toFixed(1)}%`}
        />
        <MetricCard
          value={mockAudienceMetrics.loyaltyScore}
          label="Loyalty Score"
          change={mockAudienceMetrics.loyaltyChange}
          formatValue={(n) => `${n.toFixed(1)}/10`}
        />
      </MetricsBar>

      {/* Device & Browser Performance */}
      <GridRow layout="two" minHeight="500px">
        <Panel>
          <Heading size="2">Device Performance</Heading>
          <Tabs>
            <TabList>
              <Tab id="by-users">By Users</Tab>
              <Tab id="by-engagement">By Engagement</Tab>
            </TabList>
            <TabPanel id="by-users">
              <div className={styles.deviceList}>
                {mockDeviceMetrics.map((device) => (
                  <div key={device.device} className={styles.deviceItem}>
                    <div className={styles.deviceName}>{device.device}</div>
                    <div className={styles.deviceBar}>
                      <div
                        className={styles.deviceFill}
                        style={{
                          width: `${device.percentage}%`,
                          backgroundColor: device.device === 'Desktop' ? '#2680eb' : device.device === 'Mobile' ? '#9256d9' : '#44b556',
                        }}
                      />
                    </div>
                    <div className={styles.deviceStats}>
                      <span>{device.users.toLocaleString()} users</span>
                      <span className={styles.percent}>{device.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <table className={styles.metricsTable}>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Users</th>
                    <th>Sessions</th>
                    <th>Avg Time</th>
                    <th>Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDeviceMetrics.map((device) => (
                    <tr key={device.device}>
                      <td>{device.device}</td>
                      <td>{device.users.toLocaleString()}</td>
                      <td>{device.sessions.toLocaleString()}</td>
                      <td>{Math.floor(device.avgTime / 60)}m</td>
                      <td className={device.bounceRate < 35 ? styles.good : device.bounceRate < 50 ? styles.warning : styles.poor}>
                        {device.bounceRate}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel id="by-engagement">
              <table className={styles.metricsTable}>
                <thead>
                  <tr>
                    <th>Device</th>
                    <th>Sessions</th>
                    <th>Avg Time</th>
                    <th>Bounce Rate</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockDeviceMetrics].sort((a, b) => b.avgTime - a.avgTime).map((device) => (
                    <tr key={device.device}>
                      <td className={styles.strong}>{device.device}</td>
                      <td>{device.sessions.toLocaleString()}</td>
                      <td className={styles.highlight}>{Math.floor(device.avgTime / 60)}m {device.avgTime % 60}s</td>
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
                              width: `${Math.min((device.avgTime / 300) * 100, 100)}%`,
                              backgroundColor: device.avgTime > 250 ? '#44b556' : device.avgTime > 150 ? '#2680eb' : '#e68619',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </Tabs>
        </Panel>

        <Panel>
          <Heading size="2">Browser & OS Performance</Heading>
          <table className={styles.metricsTable}>
            <thead>
              <tr>
                <th>Browser</th>
                <th>Users</th>
                <th>Avg Time</th>
                <th>Engagement</th>
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {mockBrowserMetrics.map((browser) => (
                <tr key={browser.browser}>
                  <td className={styles.strong}>{browser.browser}</td>
                  <td>{browser.users.toLocaleString()}</td>
                  <td>{Math.floor(browser.avgTime / 60)}m {browser.avgTime % 60}s</td>
                  <td className={styles.engagement}>{browser.engagement.toFixed(1)}/10</td>
                  <td>
                    <span className={browser.engagement > 7.3 ? styles.excellent : browser.engagement > 6.8 ? styles.good : styles.fair}>
                      {browser.engagement > 7.3 ? '★★★★★' : browser.engagement > 6.8 ? '★★★★' : '★★★'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </GridRow>

      {/* Geographic & Behavioral Insights */}
      <GridRow layout="two" minHeight="500px">
        <Panel>
          <Heading size="2">Top Geographic Markets</Heading>
          <table className={styles.metricsTable}>
            <thead>
              <tr>
                <th>Country</th>
                <th>Users</th>
                <th>Engagement</th>
                <th>Avg Time</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {mockGeoMetrics.map((geo) => (
                <tr key={geo.country}>
                  <td className={styles.strong}>{geo.country}</td>
                  <td>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${geo.percentage}%`,
                        }}
                      />
                    </div>
                    {geo.users.toLocaleString()}
                  </td>
                  <td className={styles.engagement}>{geo.engagement.toFixed(1)}</td>
                  <td>{Math.floor(geo.avgTime / 60)}m</td>
                  <td className={styles.growth}>+{geo.growth.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <Heading size="2">Visitor Behavior Segments</Heading>
          <div className={styles.segmentGrid}>
            {mockBehaviorSegments.map((segment) => (
              <div key={segment.segment} className={styles.segmentCard}>
                <div className={styles.segmentHeader}>
                  <Heading size="4">{segment.segment}</Heading>
                  <span className={styles.badge}>{segment.percentage.toFixed(1)}%</span>
                </div>
                <div className={styles.segmentMetrics}>
                  <div className={styles.metricRow}>
                    <span>Users</span>
                    <span className={styles.value}>{segment.users.toLocaleString()}</span>
                  </div>
                  <div className={styles.metricRow}>
                    <span>Avg Sessions</span>
                    <span className={styles.value}>{segment.sessions.toFixed(1)}</span>
                  </div>
                  <div className={styles.metricRow}>
                    <span>Active Days</span>
                    <span className={styles.value}>{segment.days}</span>
                  </div>
                  <div className={styles.metricRow}>
                    <span>Loyalty</span>
                    <span className={segment.loyalty === 'Very High' ? styles.veryHigh : segment.loyalty === 'High' ? styles.high : segment.loyalty === 'Medium' ? styles.medium : styles.low}>
                      {segment.loyalty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </GridRow>

      {/* Visitor Lifecycle & Engagement Matrix */}
      <GridRow layout="two" minHeight="450px">
        <Panel>
          <Heading size="2">Visitor Lifecycle</Heading>
          <div className={styles.lifecycleChart}>
            {mockVisitorLifecycle.map((stage, idx) => (
              <div key={stage.stage} className={styles.lifecycleStage}>
                <div className={styles.stageName}>{stage.stage}</div>
                <div className={styles.stageBar}>
                  <div
                    className={styles.stageFill}
                    style={{
                      height: `${Math.max(stage.percentage * 3, 25)}px`,
                      backgroundColor: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850'][idx],
                    }}
                  />
                </div>
                <div className={styles.stageLabel}>
                  {stage.count.toLocaleString()} ({stage.percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Heading size="2">Audience Value Matrix</Heading>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Users</th>
                <th>Retention</th>
                <th>LTV</th>
              </tr>
            </thead>
            <tbody>
              {mockAudienceEngagementMatrix.map((seg) => (
                <tr key={seg.segment}>
                  <td className={styles.segmentLabel}>{seg.segment}</td>
                  <td>{(seg.users / 1000).toFixed(1)}k</td>
                  <td>
                    <span className={seg.retention > 75 ? styles.excellent : seg.retention > 60 ? styles.good : seg.retention > 40 ? styles.fair : styles.poor}>
                      {seg.retention}%
                    </span>
                  </td>
                  <td className={styles.ltv}>{seg.ltv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </GridRow>

      {/* Source Performance & Cohort Retention */}
      <GridRow layout="two" minHeight="500px">
        <Panel>
          <Heading size="2">Traffic Source Quality</Heading>
          <table className={styles.metricsTable}>
            <thead>
              <tr>
                <th>Source</th>
                <th>Users</th>
                <th>Engagement</th>
                <th>Retention</th>
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {mockSourcePerformance.map((source) => (
                <tr key={source.source}>
                  <td className={styles.strong}>{source.source}</td>
                  <td>{source.users.toLocaleString()}</td>
                  <td className={styles.engagement}>{source.engagement.toFixed(1)}</td>
                  <td>
                    <span className={source.retention > 65 ? styles.excellent : source.retention > 50 ? styles.good : source.retention > 35 ? styles.fair : styles.poor}>
                      {source.retention}%
                    </span>
                  </td>
                  <td className={source.quality === 'Excellent' ? styles.excellent : source.quality === 'Good' ? styles.good : styles.fair}>
                    {source.quality}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <Heading size="2">Cohort Retention Analysis</Heading>
          <table className={styles.cohortTable}>
            <thead>
              <tr>
                <th>Cohort</th>
                <th>Day 0</th>
                <th>Day 7</th>
                <th>Day 14</th>
                <th>Day 30</th>
                <th>Day 60</th>
                <th>Day 90</th>
              </tr>
            </thead>
            <tbody>
              {mockCohortRetention.map((cohort) => (
                <tr key={cohort.cohort}>
                  <td className={styles.cohortLabel}>{cohort.cohort}</td>
                  <td className={styles.day0}>{cohort.day0}%</td>
                  <td className={cohort.day7 > 40 ? styles.good : styles.fair}>{cohort.day7}%</td>
                  <td className={cohort.day14 > 25 ? styles.good : styles.fair}>{cohort.day14}%</td>
                  <td className={cohort.day30 > 14 ? styles.good : styles.fair}>{cohort.day30}%</td>
                  <td className={cohort.day60 ? (cohort.day60 > 8 ? styles.good : styles.fair) : styles.inactive}>{cohort.day60 || '-'}</td>
                  <td className={cohort.day90 ? (cohort.day90 > 4 ? styles.good : styles.fair) : styles.inactive}>{cohort.day90 || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </GridRow>
    </Column>
  );
}
