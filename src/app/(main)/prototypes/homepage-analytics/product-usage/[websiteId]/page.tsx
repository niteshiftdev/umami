'use client';
import { useMessages } from '@/components/hooks';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { GridRow } from '@/components/common/GridRow';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { EventsChart } from '@/components/metrics/EventsChart';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { WorldMap } from '@/components/metrics/WorldMap';

export default function ProductUsagePage({ params }: { params: { websiteId: string } }) {
  const { formatMessage, labels } = useMessages();

  // Realistic product engagement metrics
  const engagementMetrics = [
    { label: 'Daily Active Users', value: 8457, change: 12.3, changeType: 'increase' as const },
    { label: 'Avg Session Duration', value: '4m 32s', change: 8.7, changeType: 'increase' as const },
    { label: 'Feature Adoption Rate', value: '67.4%', change: -2.1, changeType: 'decrease' as const },
    { label: 'Weekly Retention', value: '43.8%', change: 5.2, changeType: 'increase' as const },
  ];

  // Top features by usage
  const featureUsageData = [
    { x: 'Dashboard View', y: 34567, z: 42.3 },
    { x: 'Report Builder', y: 18923, z: 23.1 },
    { x: 'Data Export', y: 12456, z: 15.2 },
    { x: 'Team Sharing', y: 9834, z: 12.0 },
    { x: 'API Access', y: 4521, z: 5.5 },
    { x: 'Custom Alerts', y: 1567, z: 1.9 },
  ];

  // User journey funnel
  const journeyFunnelData = [
    { x: 'Sign Up', y: 12500, z: 100.0 },
    { x: 'First Login', y: 11875, z: 95.0 },
    { x: 'Complete Setup', y: 10625, z: 85.0 },
    { x: 'First Report', y: 8750, z: 70.0 },
    { x: 'Share w/ Team', y: 5000, z: 40.0 },
    { x: 'Weekly Active', y: 4375, z: 35.0 },
  ];

  // Power user segments
  const userSegmentData = [
    { x: 'Power Users (10+ actions/day)', y: 1245, z: 14.7 },
    { x: 'Regular Users (3-9 actions/day)', y: 3678, z: 43.5 },
    { x: 'Casual Users (1-2 actions/day)', y: 2134, z: 25.2 },
    { x: 'At Risk (<1 action/day)', y: 1400, z: 16.6 },
  ];

  // Geographic engagement
  const geoEngagementData = [
    { x: 'United States', y: 4523, z: 53.5 },
    { x: 'United Kingdom', y: 1234, z: 14.6 },
    { x: 'Germany', y: 892, z: 10.5 },
    { x: 'Canada', y: 678, z: 8.0 },
    { x: 'Australia', y: 456, z: 5.4 },
    { x: 'France', y: 345, z: 4.1 },
    { x: 'Netherlands', y: 234, z: 2.8 },
    { x: 'Singapore', y: 95, z: 1.1 },
  ];

  return (
    <>
      <PageHeader title="Product Usage Analytics">
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Understand customer engagement patterns and feature adoption
        </div>
      </PageHeader>
      <PageBody>
        {/* Key Engagement Metrics */}
        <GridRow>
          {engagementMetrics.map((metric, index) => (
            <Panel key={index}>
              <MetricCard
                label={metric.label}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
              />
            </Panel>
          ))}
        </GridRow>

        {/* Feature Usage Breakdown */}
        <GridRow columns="two">
          <Panel title="Top Features by Usage" subtitle="Last 30 days">
            <MetricsTable data={featureUsageData} />
          </Panel>
          <Panel title="User Activation Funnel" subtitle="From sign-up to weekly active">
            <MetricsTable data={journeyFunnelData} />
          </Panel>
        </GridRow>

        {/* User Segments */}
        <GridRow columns="two-one">
          <Panel title="User Engagement Segments" subtitle="Based on daily activity">
            <MetricsTable data={userSegmentData} />
          </Panel>
          <Panel>
            <div style={{ padding: '20px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Engagement Health</h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary)' }}>
                  78.2%
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Users active this week
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>Power User Growth</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
                  +18.5%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', marginBottom: '4px' }}>At-Risk Users</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                  16.6%
                </div>
              </div>
            </div>
          </Panel>
        </GridRow>

        {/* Geographic Engagement */}
        <GridRow>
          <Panel title="Engagement by Geography" subtitle="Active users by region">
            <div style={{ height: '400px' }}>
              <WorldMap data={geoEngagementData} />
            </div>
          </Panel>
        </GridRow>

        {/* Engagement Patterns */}
        <GridRow columns="two">
          <Panel title="Weekly Engagement Patterns" subtitle="Activity heatmap by hour and day">
            <WeeklyTraffic />
          </Panel>
          <Panel title="Feature Usage Trends" subtitle="30-day rolling average">
            <EventsChart websiteId={params.websiteId} />
          </Panel>
        </GridRow>
      </PageBody>
    </>
  );
}
