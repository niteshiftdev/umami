'use client';

import { Column, Heading, Row, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricCard } from '@/components/metrics/MetricCard';
import { GridRow } from '@/components/common/GridRow';
import styles from './page.module.css';

// Mock data for content performance
const mockContentMetrics = {
  totalContent: 247,
  contentChange: 12,
  avgEngagementScore: 6.8,
  engagementScoreChange: 0.4,
  highPerformingContent: 42,
  highPerformingChange: 5,
  trendingContent: 12,
  trendingChange: 3,
};

const mockTopPages = [
  { title: 'How to Build a React App', slug: '/blog/react-guide', views: 3421, engagement: 8.5, scrollDepth: 87, time: 425, trend: 'up' },
  { title: 'Next.js Best Practices', slug: '/blog/nextjs-practices', views: 2987, engagement: 8.2, scrollDepth: 81, time: 392, trend: 'up' },
  { title: 'Pricing Plans', slug: '/pricing', views: 2654, engagement: 7.1, scrollDepth: 62, time: 218, trend: 'stable' },
  { title: 'Product Demo', slug: '/demo', views: 2145, engagement: 7.8, scrollDepth: 78, time: 356, trend: 'up' },
  { title: 'Documentation Index', slug: '/docs', views: 1876, engagement: 7.5, scrollDepth: 71, time: 312, trend: 'down' },
  { title: 'Our Story', slug: '/about', views: 1543, engagement: 6.2, scrollDepth: 54, time: 156, trend: 'stable' },
  { title: 'Blog Home', slug: '/blog', views: 1234, engagement: 5.8, scrollDepth: 48, time: 124, trend: 'down' },
  { title: 'Contact Us', slug: '/contact', views: 987, engagement: 5.1, scrollDepth: 35, time: 78, trend: 'stable' },
];

const mockTrendingContent = [
  { title: 'AI Integration Guide', slug: '/blog/ai-integration', growthRate: 156, currentViews: 234, previousViews: 89 },
  { title: 'Security Best Practices', slug: '/blog/security', growthRate: 134, currentViews: 312, previousViews: 134 },
  { title: 'Performance Optimization', slug: '/blog/performance', growthRate: 98, currentViews: 245, previousViews: 123 },
  { title: 'Database Design', slug: '/blog/database', growthRate: 87, currentViews: 187, previousViews: 99 },
  { title: 'DevOps Essentials', slug: '/blog/devops', growthRate: 72, currentViews: 156, previousViews: 91 },
];

const mockContentByType = [
  { type: 'Blog Posts', count: 124, views: 18943, avgEngagement: 7.6, avgTime: 312, avgScroll: 72 },
  { type: 'Documentation', count: 89, views: 12354, avgEngagement: 7.8, avgTime: 398, avgScroll: 79 },
  { type: 'Product Pages', count: 34, views: 8765, avgEngagement: 7.1, avgTime: 234, avgScroll: 61 },
];

const mockScrollDepthData = [
  { depth: '0-25%', count: 2341, percentage: 18.2 },
  { depth: '25-50%', count: 1876, percentage: 14.6 },
  { depth: '50-75%', count: 3124, percentage: 24.3 },
  { depth: '75-100%', count: 4234, percentage: 32.9 },
  { depth: 'Full Page', count: 1425, percentage: 11.1 },
];

const mockEngagementSegments = [
  { segment: 'Educational Content', views: 8234, avgTime: 421, scrollDepth: 81, ctr: 12.3 },
  { segment: 'Case Studies', views: 5123, avgTime: 312, scrollDepth: 68, ctr: 18.7 },
  { segment: 'How-To Guides', views: 6587, avgTime: 456, scrollDepth: 85, ctr: 24.1 },
  { segment: 'News/Updates', views: 3456, avgTime: 145, scrollDepth: 41, ctr: 8.9 },
  { segment: 'Product Pages', views: 4321, avgTime: 289, scrollDepth: 62, ctr: 15.2 },
];

const mockContentGaps = [
  { topic: 'API Integration', searches: 234, coverage: 2, gap: 'High' },
  { topic: 'Mobile Development', searches: 189, coverage: 5, gap: 'Medium' },
  { topic: 'Cloud Deployment', searches: 156, coverage: 3, gap: 'High' },
  { topic: 'Testing Strategies', searches: 143, coverage: 8, gap: 'Low' },
];

export default function ContentPerformanceDashboard() {
  return (
    <Column gap>
      <div className={styles.header}>
        <Heading size="1">Content Performance & Engagement</Heading>
        <p className={styles.subtitle}>
          Analyze how your content performs across metrics like scroll depth, time on page, and engagement quality
        </p>
      </div>

      {/* Content Metrics */}
      <MetricsBar>
        <MetricCard
          value={mockContentMetrics.totalContent}
          label="Total Content Items"
          change={mockContentMetrics.contentChange}
          formatValue={(n) => n.toString()}
        />
        <MetricCard
          value={mockContentMetrics.avgEngagementScore}
          label="Avg Engagement Score"
          change={mockContentMetrics.engagementScoreChange}
          formatValue={(n) => `${n.toFixed(1)}/10`}
        />
        <MetricCard
          value={mockContentMetrics.highPerformingContent}
          label="High Performing"
          change={mockContentMetrics.highPerformingChange}
          formatValue={(n) => n.toString()}
        />
        <MetricCard
          value={mockContentMetrics.trendingContent}
          label="Trending Content"
          change={mockContentMetrics.trendingChange}
          formatValue={(n) => n.toString()}
        />
      </MetricsBar>

      {/* Top Performing Content */}
      <GridRow layout="one">
        <Panel>
          <Heading size="2">Top Performing Content</Heading>
          <Tabs>
            <TabList>
              <Tab id="by-views">By Views</Tab>
              <Tab id="by-engagement">By Engagement</Tab>
              <Tab id="by-scroll">By Scroll Depth</Tab>
            </TabList>
            <TabPanel id="by-views">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Views</th>
                    <th>Engagement</th>
                    <th>Avg Time</th>
                    <th>Scroll Depth</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTopPages.map((page) => (
                    <tr key={page.slug}>
                      <td className={styles.contentTitle}>{page.title}</td>
                      <td className={styles.highlight}>{page.views.toLocaleString()}</td>
                      <td>
                        <div className={styles.engagementBadge} style={{ backgroundColor: page.engagement > 8 ? '#44b556' : page.engagement > 7 ? '#2680eb' : '#e68619' }}>
                          {page.engagement.toFixed(1)}/10
                        </div>
                      </td>
                      <td>{Math.floor(page.time / 60)}m {page.time % 60}s</td>
                      <td>
                        <div className={styles.scoreBar}>
                          <div
                            className={styles.scoreFill}
                            style={{
                              width: `${page.scrollDepth}%`,
                              backgroundColor: page.scrollDepth > 75 ? '#44b556' : page.scrollDepth > 60 ? '#2680eb' : '#e68619',
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel id="by-engagement">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Engagement</th>
                    <th>Quality</th>
                    <th>Views</th>
                    <th>Scroll</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockTopPages].sort((a, b) => b.engagement - a.engagement).map((page) => (
                    <tr key={page.slug}>
                      <td className={styles.contentTitle}>{page.title}</td>
                      <td className={styles.engagementScore}>{page.engagement.toFixed(1)}</td>
                      <td>
                        <span className={page.engagement > 8 ? styles.excellent : page.engagement > 7 ? styles.good : page.engagement > 6 ? styles.fair : styles.poor}>
                          {page.engagement > 8 ? '★★★★★' : page.engagement > 7 ? '★★★★' : page.engagement > 6 ? '★★★' : '★★'}
                        </span>
                      </td>
                      <td>{page.views.toLocaleString()}</td>
                      <td>{page.scrollDepth}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
            <TabPanel id="by-scroll">
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Scroll Depth</th>
                    <th>Full Read %</th>
                    <th>Avg Time</th>
                    <th>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockTopPages].sort((a, b) => b.scrollDepth - a.scrollDepth).map((page) => (
                    <tr key={page.slug}>
                      <td className={styles.contentTitle}>{page.title}</td>
                      <td className={styles.scrollScore}>{page.scrollDepth}%</td>
                      <td>
                        <div className={styles.scoreBar}>
                          <div
                            className={styles.scoreFill}
                            style={{
                              width: `${page.scrollDepth}%`,
                              backgroundColor: '#2680eb',
                            }}
                          />
                        </div>
                      </td>
                      <td>{Math.floor(page.time / 60)}m</td>
                      <td>{page.views.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          </Tabs>
        </Panel>
      </GridRow>

      {/* Trending Content & Content by Type */}
      <GridRow layout="two" minHeight="450px">
        <Panel>
          <Heading size="2">Trending Content (Last 7 Days)</Heading>
          <div className={styles.trendingList}>
            {mockTrendingContent.map((item, idx) => (
              <div key={item.slug} className={styles.trendItem}>
                <div className={styles.trendRank}>#{idx + 1}</div>
                <div className={styles.trendContent}>
                  <div className={styles.trendTitle}>{item.title}</div>
                  <div className={styles.trendStats}>
                    <span>{item.currentViews} views</span>
                    <span className={styles.growth}>+{item.growthRate}%</span>
                  </div>
                </div>
                <div className={styles.trendGrowth}>
                  <div className={styles.growthBar}>
                    <div
                      className={styles.growthFill}
                      style={{
                        width: `${Math.min(item.growthRate / 160 * 100, 100)}%`,
                        backgroundColor: '#44b556',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Heading size="2">Content Performance by Type</Heading>
          <div className={styles.typeGrid}>
            {mockContentByType.map((type) => (
              <div key={type.type} className={styles.typeCard}>
                <Heading size="4">{type.type}</Heading>
                <div className={styles.typeStats}>
                  <div className={styles.typeStatRow}>
                    <span>Items</span>
                    <span className={styles.statValue}>{type.count}</span>
                  </div>
                  <div className={styles.typeStatRow}>
                    <span>Total Views</span>
                    <span className={styles.statValue}>{(type.views / 1000).toFixed(1)}k</span>
                  </div>
                  <div className={styles.typeStatRow}>
                    <span>Avg Engagement</span>
                    <span className={styles.statValue}>{type.avgEngagement.toFixed(1)}</span>
                  </div>
                  <div className={styles.typeStatRow}>
                    <span>Avg Time</span>
                    <span className={styles.statValue}>{Math.floor(type.avgTime / 60)}m</span>
                  </div>
                  <div className={styles.typeStatRow}>
                    <span>Scroll Depth</span>
                    <span className={styles.statValue}>{type.avgScroll}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </GridRow>

      {/* Scroll Depth Distribution */}
      <GridRow layout="two" minHeight="400px">
        <Panel>
          <Heading size="2">Reader Engagement Levels</Heading>
          <div className={styles.scrollChart}>
            {mockScrollDepthData.map((item) => (
              <div key={item.depth} className={styles.scrollItem}>
                <div className={styles.scrollLabel}>
                  <span>{item.depth}</span>
                  <span className={styles.scrollCount}>{item.count.toLocaleString()}</span>
                </div>
                <div className={styles.scrollBar}>
                  <div
                    className={styles.scrollFill}
                    style={{
                      width: `${item.percentage * 3.5}%`,
                      backgroundColor: item.percentage > 25 ? '#44b556' : item.percentage > 18 ? '#2680eb' : '#e68619',
                    }}
                  />
                </div>
                <div className={styles.scrollPercent}>{item.percentage}%</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <Heading size="2">Content by Engagement Type</Heading>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Views</th>
                <th>Time</th>
                <th>Scroll</th>
                <th>CTR</th>
              </tr>
            </thead>
            <tbody>
              {mockEngagementSegments.map((seg) => (
                <tr key={seg.segment}>
                  <td className={styles.segmentName}>{seg.segment}</td>
                  <td>{seg.views.toLocaleString()}</td>
                  <td>{Math.floor(seg.avgTime / 60)}m</td>
                  <td>
                    <span className={seg.scrollDepth > 70 ? styles.excellent : seg.scrollDepth > 60 ? styles.good : styles.fair}>
                      {seg.scrollDepth}%
                    </span>
                  </td>
                  <td className={styles.highlight}>{seg.ctr.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </GridRow>

      {/* Content Gaps */}
      <GridRow layout="one">
        <Panel>
          <Heading size="2">Content Gaps & Opportunities</Heading>
          <p className={styles.description}>Topics with high search interest but limited coverage</p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Topic</th>
                <th>Search Interest</th>
                <th>Content Items</th>
                <th>Coverage Gap</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {mockContentGaps.map((gap) => (
                <tr key={gap.topic}>
                  <td className={styles.topicName}>{gap.topic}</td>
                  <td>{gap.searches.toLocaleString()} searches</td>
                  <td>{gap.coverage} items</td>
                  <td>
                    <span className={gap.gap === 'High' ? styles.highGap : gap.gap === 'Medium' ? styles.mediumGap : styles.lowGap}>
                      {gap.gap}
                    </span>
                  </td>
                  <td className={gap.gap === 'High' ? styles.urgent : gap.gap === 'Medium' ? styles.warning : styles.normal}>
                    {gap.gap === 'High' ? '🔴 High' : gap.gap === 'Medium' ? '🟡 Medium' : '🟢 Low'}
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
