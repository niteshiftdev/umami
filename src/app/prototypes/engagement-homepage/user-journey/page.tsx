'use client';

import { Column, Heading, Row, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricCard } from '@/components/metrics/MetricCard';
import { GridRow } from '@/components/common/GridRow';
import styles from './page.module.css';

// Mock data for user journey and funnel
const mockJourneyMetrics = {
  totalSessions: 18920,
  sessionsChange: -1256,
  avgJourneyLength: 4.2,
  journeyLengthChange: 0.3,
  completedFunnels: 3456,
  completionRateChange: 234,
  conversionRate: 18.2,
  conversionRateChange: 1.5,
  repeatedPaths: 4123,
  repeatedPathsChange: 567,
};

const mockFunnelData = [
  { step: 'Homepage', users: 12847, rate: 100, dropoff: 0, color: '#2680eb' },
  { step: 'Product Browse', users: 8934, rate: 69.5, dropoff: 3913, color: '#2680eb' },
  { step: 'Product View', users: 5642, rate: 43.9, dropoff: 3292, color: '#2680eb' },
  { step: 'Add to Cart', users: 2456, rate: 19.1, dropoff: 3186, color: '#2680eb' },
  { step: 'Checkout', users: 1834, rate: 14.3, dropoff: 622, color: '#2680eb' },
  { step: 'Purchase', users: 1456, rate: 11.3, dropoff: 378, color: '#44b556' },
];

const mockEntryPoints = [
  { path: '/', users: 6234, percentage: 48.5, avgPathLength: 3.2, conversionRate: 14.5 },
  { path: '/blog', users: 2145, percentage: 16.7, avgPathLength: 2.1, conversionRate: 8.3 },
  { path: '/products', users: 1987, percentage: 15.4, avgPathLength: 5.8, conversionRate: 24.1 },
  { path: '/pricing', users: 1234, percentage: 9.6, avgPathLength: 1.9, conversionRate: 12.7 },
  { path: '/docs', users: 1247, percentage: 9.7, avgPathLength: 4.5, conversionRate: 19.2 },
];

const mockExitPoints = [
  { path: '/', users: 2456, percentage: 19.1, avgTimeBeforeExit: 34, exitRate: 12.3 },
  { path: '/contact', users: 1845, percentage: 14.3, avgTimeBeforeExit: 156, exitRate: 45.6 },
  { path: '/pricing', users: 1678, percentage: 13.0, avgTimeBeforeExit: 78, exitRate: 31.2 },
  { path: '/404', users: 945, percentage: 7.3, avgTimeBeforeExit: 12, exitRate: 98.5 },
  { path: '/blog/post-1', users: 834, percentage: 6.5, avgTimeBeforeExit: 245, exitRate: 28.9 },
];

const mockCommonPaths = [
  { path: '/ → /products → /product/123 → /cart', users: 456, conversions: 89, rate: 19.5 },
  { path: '/ → /blog → /products → /product/456', users: 334, conversions: 41, rate: 12.3 },
  { path: '/products → /product/123 → /cart → /checkout', users: 289, conversions: 78, rate: 27.0 },
  { path: '/ → /products → /pricing → /contact', users: 178, conversions: 12, rate: 6.7 },
  { path: '/blog → /blog/post-1 → /products → /product/789', users: 145, conversions: 18, rate: 12.4 },
];

const mockSessionTypes = [
  { type: 'Direct Single Page', sessions: 4521, percentage: 23.9, avgTime: 45, conversions: 234 },
  { type: 'Quick Browse', sessions: 3456, percentage: 18.3, avgTime: 120, conversions: 156 },
  { type: 'Deep Exploration', sessions: 2834, percentage: 15.0, avgTime: 420, conversions: 612 },
  { type: 'Comparison Shopping', sessions: 2145, percentage: 11.3, avgTime: 340, conversions: 445 },
  { type: 'Mobile Quick Click', sessions: 2987, percentage: 15.8, avgTime: 60, conversions: 178 },
  { type: 'Return Customer', sessions: 1977, percentage: 10.4, avgTime: 280, conversions: 456 },
];

export default function UserJourneyDashboard() {
  return (
    <Column gap>
      <div className={styles.header}>
        <Heading size="1">User Journey & Conversion Dashboard</Heading>
        <p className={styles.subtitle}>
          Understand how users navigate your site, where they enter, where they leave, and what paths lead to conversions
        </p>
      </div>

      {/* Journey Metrics */}
      <MetricsBar>
        <MetricCard
          value={mockJourneyMetrics.totalSessions}
          label="Total Sessions"
          change={mockJourneyMetrics.sessionsChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
        <MetricCard
          value={mockJourneyMetrics.avgJourneyLength}
          label="Avg Journey Length"
          change={mockJourneyMetrics.journeyLengthChange}
          formatValue={(n) => `${n.toFixed(1)} pages`}
        />
        <MetricCard
          value={mockJourneyMetrics.conversionRate}
          label="Conversion Rate"
          change={mockJourneyMetrics.conversionRateChange}
          formatValue={(n) => `${n.toFixed(1)}%`}
        />
        <MetricCard
          value={mockJourneyMetrics.completedFunnels}
          label="Completed Funnels"
          change={mockJourneyMetrics.completionRateChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
        <MetricCard
          value={mockJourneyMetrics.repeatedPaths}
          label="Sessions on Popular Paths"
          change={mockJourneyMetrics.repeatedPathsChange}
          formatValue={(n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())}
        />
      </MetricsBar>

      {/* Conversion Funnel */}
      <GridRow layout="one">
        <Panel>
          <Heading size="2">Conversion Funnel</Heading>
          <Row border="bottom" marginBottom="4" />
          <div className={styles.funnelContainer}>
            {mockFunnelData.map((step, index) => (
              <div key={step.step} className={styles.funnelStep}>
                <div className={styles.funnelContent}>
                  <div className={styles.funnelBar}>
                    <div
                      className={styles.funnelFill}
                      style={{
                        width: `${step.rate}%`,
                        backgroundColor: step.color,
                      }}
                    />
                  </div>
                  <div className={styles.funnelLabel}>
                    <span className={styles.stepName}>{step.step}</span>
                    <span className={styles.stepStats}>
                      {step.users.toLocaleString()} users • {step.rate.toFixed(1)}% of start
                    </span>
                  </div>
                </div>
                {step.dropoff > 0 && (
                  <div className={styles.dropoffLabel}>
                    ↓ {step.dropoff.toLocaleString()} dropoff ({((step.dropoff / mockFunnelData[index - 1]?.users || 0) * 100).toFixed(1)}%)
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>
      </GridRow>

      {/* Entry & Exit Points */}
      <GridRow layout="two" minHeight="500px">
        <Panel>
          <Heading size="2">Entry Points</Heading>
          <Tabs>
            <TabList>
              <Tab id="entry-users">By Users</Tab>
              <Tab id="entry-conversion">By Conversion</Tab>
            </TabList>
            <TabPanel id="entry-users">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Entry Users</th>
                    <th>Avg Path Length</th>
                    <th>Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEntryPoints.map((entry) => (
                    <tr key={entry.path}>
                      <td className={styles.pathName}>{entry.path}</td>
                      <td>{entry.users.toLocaleString()}</td>
                      <td>{entry.avgPathLength.toFixed(1)} pages</td>
                      <td className={styles.conversion}>{entry.conversionRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel id="entry-conversion">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Conversion Rate</th>
                    <th>Quality Score</th>
                    <th>Entry Users</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockEntryPoints].sort((a, b) => b.conversionRate - a.conversionRate).map((entry) => (
                    <tr key={entry.path}>
                      <td className={styles.pathName}>{entry.path}</td>
                      <td className={styles.highlight}>{entry.conversionRate.toFixed(1)}%</td>
                      <td>
                        <div className={styles.scoreBar}>
                          <div
                            className={styles.scoreFill}
                            style={{
                              width: `${Math.min(entry.conversionRate, 30) * 3.33}%`,
                              backgroundColor: entry.conversionRate > 20 ? '#44b556' : entry.conversionRate > 12 ? '#2680eb' : '#e68619',
                            }}
                          />
                        </div>
                      </td>
                      <td>{entry.users.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </Tabs>
        </Panel>

        <Panel>
          <Heading size="2">Exit Points</Heading>
          <Tabs>
            <TabList>
              <Tab id="exit-users">By Exit Rate</Tab>
              <Tab id="exit-engagement">By Engagement</Tab>
            </TabList>
            <TabPanel id="exit-users">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Exit Rate</th>
                    <th>Exit Users</th>
                    <th>Time Before Exit</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockExitPoints].sort((a, b) => b.exitRate - a.exitRate).map((exit) => (
                    <tr key={exit.path}>
                      <td className={styles.pathName}>{exit.path}</td>
                      <td className={exit.exitRate > 50 ? styles.warning : styles.normal}>
                        {exit.exitRate.toFixed(1)}%
                      </td>
                      <td>{exit.users.toLocaleString()}</td>
                      <td>{Math.floor(exit.avgTimeBeforeExit / 60)}m {exit.avgTimeBeforeExit % 60}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel id="exit-engagement">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Avg Time</th>
                    <th>Engagement</th>
                    <th>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockExitPoints].sort((a, b) => b.avgTimeBeforeExit - a.avgTimeBeforeExit).map((exit) => (
                    <tr key={exit.path}>
                      <td className={styles.pathName}>{exit.path}</td>
                      <td className={styles.highlight}>{Math.floor(exit.avgTimeBeforeExit / 60)}m {exit.avgTimeBeforeExit % 60}s</td>
                      <td>
                        {exit.avgTimeBeforeExit > 120 ? '🟢 Strong' : exit.avgTimeBeforeExit > 60 ? '🟡 Moderate' : '🔴 Low'}
                      </td>
                      <td className={exit.exitRate > 50 ? styles.poor : exit.exitRate > 30 ? styles.warning : styles.good}>
                        {exit.exitRate > 50 ? 'Action Needed' : exit.exitRate > 30 ? 'Monitor' : 'Good'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </Tabs>
        </Panel>
      </GridRow>

      {/* Most Common Paths */}
      <GridRow layout="one">
        <Panel>
          <Heading size="2">Most Common User Journeys</Heading>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User Path</th>
                <th>Sessions</th>
                <th>Conversions</th>
                <th>Conv. Rate</th>
                <th>Quality</th>
              </tr>
            </thead>
            <tbody>
              {mockCommonPaths.map((path, idx) => (
                <tr key={idx}>
                  <td className={styles.pathName}>{path.path}</td>
                  <td>{path.users.toLocaleString()}</td>
                  <td className={styles.highlight}>{path.conversions.toLocaleString()}</td>
                  <td className={styles.conversion}>{path.rate.toFixed(1)}%</td>
                  <td>
                    <div className={styles.scoreBar}>
                      <div
                        className={styles.scoreFill}
                        style={{
                          width: `${path.rate * 3.33}%`,
                          backgroundColor: path.rate > 20 ? '#44b556' : path.rate > 12 ? '#2680eb' : '#e68619',
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

      {/* Session Behavior Types */}
      <GridRow layout="one">
        <Panel>
          <Heading size="2">Session Behavior Patterns</Heading>
          <div className={styles.sessionGrid}>
            {mockSessionTypes.map((session) => (
              <div key={session.type} className={styles.sessionCard}>
                <div className={styles.sessionHeader}>
                  <Heading size="4">{session.type}</Heading>
                  <span className={styles.sessionPercent}>{session.percentage.toFixed(1)}%</span>
                </div>
                <div className={styles.sessionStats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Sessions</span>
                    <span className={styles.statValue}>{(session.sessions / 1000).toFixed(1)}k</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Avg Time</span>
                    <span className={styles.statValue}>{Math.floor(session.avgTime / 60)}m {session.avgTime % 60}s</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Conversions</span>
                    <span className={styles.statValue}>{session.conversions.toLocaleString()}</span>
                  </div>
                </div>
                <div className={styles.convRate}>
                  Conv. Rate: {((session.conversions / session.sessions) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </GridRow>
    </Column>
  );
}
