'use client';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { MetricCard } from '@/components/metrics/MetricCard';
import { Column, Row, Heading, Text, Grid } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { useMemo } from 'react';
import { CHART_COLORS } from '@/lib/constants';

export function ProductAnalyticsPage() {
  const { formatMessage, labels } = useMessages();

  // Mock data for user engagement metrics
  const engagementMetrics = useMemo(
    () => ({
      activeUsers: 24537,
      previousActiveUsers: 22104,
      avgSessionDuration: 342, // seconds
      previousAvgSessionDuration: 318,
      bounceRate: 42.3,
      previousBounceRate: 45.8,
      featureAdoption: 67.2,
      previousFeatureAdoption: 61.5,
    }),
    [],
  );

  // Mock data for daily active users over 30 days
  const dailyActiveUsersData = useMemo(() => {
    const days = 30;
    const data = [];
    const labels = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toISOString().split('T')[0]);

      // Generate realistic DAU data with weekly patterns
      const dayOfWeek = date.getDay();
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
      const baseUsers = 18000 + Math.random() * 4000;
      data.push(Math.round(baseUsers * weekendFactor));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Daily Active Users',
          data,
          borderColor: CHART_COLORS[0],
          backgroundColor: CHART_COLORS[0] + '40',
        },
      ],
    };
  }, []);

  // Mock data for user cohort retention
  const cohortRetentionData = useMemo(() => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];
    return {
      labels: weeks,
      datasets: [
        {
          label: 'Cohort Retention %',
          data: [100, 68, 52, 44, 39, 36],
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '40',
        },
      ],
    };
  }, []);

  // Mock data for feature usage breakdown
  const featureUsageData = useMemo(
    () => ({
      labels: ['Dashboard', 'Reports', 'Analytics', 'Settings', 'Integrations', 'Admin'],
      datasets: [
        {
          label: 'Feature Usage',
          data: [8542, 6321, 5890, 3421, 2156, 1203],
          backgroundColor: CHART_COLORS.slice(0, 6),
        },
      ],
    }),
    [],
  );

  // Mock data for user journey funnel
  const userJourneyData = useMemo(() => {
    return {
      labels: ['Sign Up', 'Onboarding', 'First Action', 'Active User', 'Power User'],
      datasets: [
        {
          label: 'Users',
          data: [10000, 8234, 6890, 5421, 2187],
          backgroundColor: CHART_COLORS[4] + '80',
          borderColor: CHART_COLORS[4],
          borderWidth: 2,
        },
      ],
    };
  }, []);

  // Mock data for session duration distribution
  const sessionDurationData = useMemo(() => {
    return {
      labels: ['0-1 min', '1-5 min', '5-15 min', '15-30 min', '30-60 min', '60+ min'],
      datasets: [
        {
          label: 'Sessions',
          data: [3421, 8932, 6754, 4321, 1876, 892],
          backgroundColor: CHART_COLORS[1] + '60',
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
        },
      ],
    };
  }, []);

  return (
    <PageBody>
      <Column gap="6" paddingY="6">
        <PageHeader title="Product Analytics Dashboard" />

        <Text size="md" style={{ color: 'var(--gray500)' }}>
          Track user engagement, behavior patterns, and feature adoption across your product
        </Text>

        {/* Key Metrics Row */}
        <Grid columns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="4">
          <Panel>
            <MetricCard
              value={engagementMetrics.activeUsers}
              previousValue={engagementMetrics.previousActiveUsers}
              label="Active Users (30d)"
              formatValue={n => n.toLocaleString()}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={engagementMetrics.avgSessionDuration}
              previousValue={engagementMetrics.previousAvgSessionDuration}
              label="Avg. Session (seconds)"
              formatValue={n => `${Math.round(n)}s`}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={engagementMetrics.bounceRate}
              previousValue={engagementMetrics.previousBounceRate}
              label="Bounce Rate %"
              formatValue={n => `${n.toFixed(1)}%`}
              showLabel
              showChange
              reverseColors
            />
          </Panel>
          <Panel>
            <MetricCard
              value={engagementMetrics.featureAdoption}
              previousValue={engagementMetrics.previousFeatureAdoption}
              label="Feature Adoption %"
              formatValue={n => `${n.toFixed(1)}%`}
              showLabel
              showChange
            />
          </Panel>
        </Grid>

        {/* Daily Active Users Chart */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Daily Active Users (Last 30 Days)</Heading>
            <BarChart chartData={dailyActiveUsersData} height={300} unit="users" />
          </Column>
        </Panel>

        {/* Two Column Layout for Charts */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">User Cohort Retention</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Percentage of users returning each week after signup
              </Text>
              <BarChart chartData={cohortRetentionData} height={280} unit="%" />
            </Column>
          </Panel>

          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">Feature Usage Distribution</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Most accessed product areas by unique users
              </Text>
              <PieChart chartData={featureUsageData} height={280} type="doughnut" />
            </Column>
          </Panel>
        </Grid>

        {/* User Journey Funnel */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">User Journey Funnel</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Conversion rates through key product milestones
            </Text>
            <BarChart chartData={userJourneyData} height={300} unit="users" />
          </Column>
        </Panel>

        {/* Session Duration Distribution */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Session Duration Distribution</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              How long users spend in each session
            </Text>
            <BarChart chartData={sessionDurationData} height={280} unit="sessions" />
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
