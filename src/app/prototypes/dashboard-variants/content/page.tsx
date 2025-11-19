'use client';

import { Column, DataTable, DataColumn } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { formatNumber } from '@/lib/format';
import styles from './page.module.css';

export default function ContentPublisherDashboard() {
  // Mock data for content/media analytics
  const summaryMetrics = {
    pageviews: 425230,
    pageviewsChange: 18.5,
    uniqueVisitors: 84320,
    visitorsChange: 12.3,
    avgTimeOnPage: '4m 32s',
    engagementChange: 5.2,
    bounceRate: 34.2,
    bounceChange: -3.1,
  };

  const topContent = [
    { id: 1, title: 'Ultimate Guide to React Hooks 2025', views: 45230, engagement: 8.2, shares: 1240, minutes: 12.4 },
    { id: 2, title: 'Best Practices for TypeScript in Production', views: 38450, engagement: 7.5, shares: 980, minutes: 10.8 },
    { id: 3, title: 'Next.js 15: What\'s New and Why It Matters', views: 32100, engagement: 6.8, shares: 750, minutes: 9.2 },
    { id: 4, title: 'Web Performance Optimization Strategies', views: 28900, engagement: 6.1, shares: 620, minutes: 11.1 },
    { id: 5, title: 'Building Accessible Websites: A Complete Guide', views: 22340, engagement: 5.9, shares: 480, minutes: 8.7 },
  ];

  const audienceDemographics = [
    { location: 'United States', users: 32450, pageviews: 128200, bounceRate: 32.1 },
    { location: 'Canada', users: 12340, pageviews: 45800, bounceRate: 35.2 },
    { location: 'United Kingdom', users: 11230, pageviews: 42100, bounceRate: 36.8 },
    { location: 'Germany', users: 8920, pageviews: 33400, bounceRate: 38.5 },
    { location: 'Australia', users: 7480, pageviews: 28200, bounceRate: 34.9 },
  ];

  const trafficSources = [
    { source: 'Organic Search', users: 42300, sessions: 68900, bounceRate: 28.4, avgSession: '6m 12s' },
    { source: 'Direct', users: 18900, sessions: 24100, bounceRate: 42.1, avgSession: '3m 45s' },
    { source: 'Social Media', users: 14200, sessions: 18300, bounceRate: 48.9, avgSession: '2m 30s' },
    { source: 'Referral', users: 5920, sessions: 7200, bounceRate: 31.2, avgSession: '5m 18s' },
    { source: 'Newsletter', users: 3000, sessions: 4100, bounceRate: 22.1, avgSession: '7m 45s' },
  ];

  const contentPerformanceTrend = [
    { week: 'Week 1', articles: 12, views: 185200, avgEngagement: 6.2 },
    { week: 'Week 2', articles: 14, views: 212500, avgEngagement: 6.5 },
    { week: 'Week 3', articles: 11, views: 195800, avgEngagement: 6.1 },
    { week: 'Week 4', articles: 15, views: 242300, avgEngagement: 6.8 },
  ];

  return (
    <PageBody>
      <PageHeader title="Content Publisher Analytics Dashboard" subtitle="Audience engagement and content performance" />

      <Column size="two">
        <Panel title="Pageviews" subtitle="Total content views">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{formatNumber(summaryMetrics.pageviews)}</div>
            <div className={`${styles.change} ${summaryMetrics.pageviewsChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.pageviewsChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.pageviewsChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Unique Visitors" subtitle="Individual users this month">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{formatNumber(summaryMetrics.uniqueVisitors)}</div>
            <div className={`${styles.change} ${summaryMetrics.visitorsChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.visitorsChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.visitorsChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Average Time on Page" subtitle="Content engagement metric">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{summaryMetrics.avgTimeOnPage}</div>
            <div className={`${styles.change} ${summaryMetrics.engagementChange > 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.engagementChange > 0 ? '↑' : '↓'} {Math.abs(summaryMetrics.engagementChange)}% vs last month
            </div>
          </div>
        </Panel>

        <Panel title="Bounce Rate" subtitle="Visitors leaving without action">
          <div className={styles.metricLarge}>
            <div className={styles.value}>{summaryMetrics.bounceRate}%</div>
            <div className={`${styles.change} ${summaryMetrics.bounceChange < 0 ? styles.positive : styles.negative}`}>
              {summaryMetrics.bounceChange < 0 ? '↓' : '↑'} {Math.abs(summaryMetrics.bounceChange)}% vs last month
            </div>
          </div>
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Top Performing Content" subtitle="Articles driving the most engagement">
          <DataTable data={topContent}>
            <DataColumn id="title" label="Article Title">
              {(row: any) => row.title}
            </DataColumn>
            <DataColumn id="views" label="Views">
              {(row: any) => formatNumber(row.views)}
            </DataColumn>
            <DataColumn id="engagement" label="Engagement Score">
              {(row: any) => row.engagement.toFixed(1)}
            </DataColumn>
            <DataColumn id="shares" label="Social Shares">
              {(row: any) => formatNumber(row.shares)}
            </DataColumn>
            <DataColumn id="minutes" label="Avg Time (min)">
              {(row: any) => row.minutes.toFixed(1)}
            </DataColumn>
          </DataTable>
        </Panel>
      </Column>

      <Column size="two">
        <Panel title="Top Countries" subtitle="Audience geographic distribution">
          <DataTable data={audienceDemographics}>
            <DataColumn id="location" label="Country">
              {(row: any) => row.location}
            </DataColumn>
            <DataColumn id="users" label="Users">
              {(row: any) => formatNumber(row.users)}
            </DataColumn>
            <DataColumn id="pageviews" label="Pageviews">
              {(row: any) => formatNumber(row.pageviews)}
            </DataColumn>
            <DataColumn id="bounceRate" label="Bounce %">
              {(row: any) => `${row.bounceRate}%`}
            </DataColumn>
          </DataTable>
        </Panel>

        <Panel title="Traffic by Source" subtitle="Where your audience comes from">
          <DataTable data={trafficSources}>
            <DataColumn id="source" label="Source">
              {(row: any) => row.source}
            </DataColumn>
            <DataColumn id="users" label="Users">
              {(row: any) => formatNumber(row.users)}
            </DataColumn>
            <DataColumn id="sessions" label="Sessions">
              {(row: any) => formatNumber(row.sessions)}
            </DataColumn>
            <DataColumn id="bounceRate" label="Bounce %">
              {(row: any) => `${row.bounceRate}%`}
            </DataColumn>
            <DataColumn id="avgSession" label="Avg Duration">
              {(row: any) => row.avgSession}
            </DataColumn>
          </DataTable>
        </Panel>
      </Column>

      <Column size="full">
        <Panel title="Content Publishing Trends" subtitle="Output and performance over time">
          <DataTable data={contentPerformanceTrend}>
            <DataColumn id="week" label="Period">
              {(row: any) => row.week}
            </DataColumn>
            <DataColumn id="articles" label="Articles Published">
              {(row: any) => formatNumber(row.articles)}
            </DataColumn>
            <DataColumn id="views" label="Total Views">
              {(row: any) => formatNumber(row.views)}
            </DataColumn>
            <DataColumn id="avgEngagement" label="Avg Engagement">
              {(row: any) => row.avgEngagement.toFixed(1)}
            </DataColumn>
          </DataTable>
        </Panel>
      </Column>
    </PageBody>
  );
}
