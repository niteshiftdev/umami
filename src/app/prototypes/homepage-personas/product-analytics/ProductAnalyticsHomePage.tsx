'use client';
import { Column, Grid, Row, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import { useMemo } from 'react';

// Mock data for Product Analytics persona
// Focus: User engagement, behavior patterns, feature adoption, retention

export function ProductAnalyticsHomePage() {
  // Generate realistic mock data for the last 30 days
  const mockData = useMemo(() => {
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;

    // Daily Active Users trend (last 30 days)
    const dauData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * dayInMs);
      const baseValue = 12000;
      const trend = i * 100; // Upward trend
      const variance = Math.random() * 2000 - 1000; // Random variance
      return {
        x: date.toISOString(),
        y: Math.round(baseValue + trend + variance),
      };
    });

    // Session Duration trend (last 30 days)
    const sessionDurationData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * dayInMs);
      const baseValue = 420; // ~7 minutes in seconds
      const variance = Math.random() * 120 - 60;
      return {
        x: date.toISOString(),
        y: Math.round(baseValue + variance),
      };
    });

    // Feature adoption by category
    const featureAdoptionData = {
      labels: ['Analytics', 'Dashboards', 'Reports', 'Alerts', 'Exports'],
      datasets: [
        {
          label: 'Users',
          data: [8234, 6891, 5432, 3210, 2145],
          backgroundColor: [
            '#3e63dd',
            '#6e56cf',
            '#8e4ec6',
            '#3e63dd99',
            '#6e56cf99',
          ],
        },
      ],
    };

    // Top features by engagement
    const topFeatures = [
      { label: 'Real-time Dashboard', count: 8234, percent: 100 },
      { label: 'Custom Reports', count: 6891, percent: 84 },
      { label: 'Data Export', count: 5432, percent: 66 },
      { label: 'Scheduled Alerts', count: 3210, percent: 39 },
      { label: 'Team Sharing', count: 2854, percent: 35 },
      { label: 'API Access', count: 2145, percent: 26 },
      { label: 'Mobile App', count: 1876, percent: 23 },
      { label: 'Slack Integration', count: 1543, percent: 19 },
    ];

    // User segments by behavior
    const userSegments = [
      { label: 'Power Users (Daily)', count: 3245, percent: 100 },
      { label: 'Regular Users (Weekly)', count: 5432, percent: 167 },
      { label: 'Occasional Users (Monthly)', count: 4123, percent: 127 },
      { label: 'Inactive (30+ days)', count: 1876, percent: 58 },
    ];

    // Retention cohort data (weekly)
    const retentionData = Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date(now.getTime() - (11 - i) * 7 * dayInMs);
      const baseRetention = 85;
      const decay = i * 0.5; // Slight decay over time
      const variance = Math.random() * 5 - 2.5;
      return {
        x: weekDate.toISOString(),
        y: Math.round(baseRetention - decay + variance),
      };
    });

    return {
      dauData,
      sessionDurationData,
      featureAdoptionData,
      topFeatures,
      userSegments,
      retentionData,
      // Summary metrics
      metrics: {
        dau: 15234,
        previousDau: 14123,
        mau: 42156,
        previousMau: 38942,
        avgSessionDuration: 428, // seconds
        previousAvgSessionDuration: 395,
        featureAdoptionRate: 68.5, // percentage
        previousFeatureAdoptionRate: 63.2,
        weeklyRetention: 84.2, // percentage
        previousWeeklyRetention: 82.8,
        engagementScore: 7.8, // out of 10
        previousEngagementScore: 7.4,
      },
    };
  }, []);

  // Create chart data for DAU trend
  const dauChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Daily Active Users',
        data: mockData.dauData,
        borderColor: '#3e63dd',
        backgroundColor: '#3e63dd33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.dauData]);

  // Create chart data for retention
  const retentionChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Retention Rate (%)',
        data: mockData.retentionData,
        borderColor: '#30a46c',
        backgroundColor: '#30a46c33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.retentionData]);

  return (
    <Column gap="4" padding="6">
      {/* Page Header */}
      <Column gap="2">
        <Heading size="1">Product Analytics Dashboard</Heading>
        <Text size="3" color="muted">
          User engagement metrics and behavior patterns
        </Text>
      </Column>

      {/* Key Metrics */}
      <MetricsBar>
        <MetricCard
          value={mockData.metrics.dau}
          previousValue={mockData.metrics.previousDau}
          change={mockData.metrics.dau - mockData.metrics.previousDau}
          label="Daily Active Users"
          formatValue={formatLongNumber}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.mau}
          previousValue={mockData.metrics.previousMau}
          change={mockData.metrics.mau - mockData.metrics.previousMau}
          label="Monthly Active Users"
          formatValue={formatLongNumber}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.avgSessionDuration}
          previousValue={mockData.metrics.previousAvgSessionDuration}
          change={mockData.metrics.avgSessionDuration - mockData.metrics.previousAvgSessionDuration}
          label="Avg Session Duration"
          formatValue={n => formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.featureAdoptionRate}
          previousValue={mockData.metrics.previousFeatureAdoptionRate}
          change={mockData.metrics.featureAdoptionRate - mockData.metrics.previousFeatureAdoptionRate}
          label="Feature Adoption Rate"
          formatValue={n => `${Math.round(n)}%`}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.weeklyRetention}
          previousValue={mockData.metrics.previousWeeklyRetention}
          change={mockData.metrics.weeklyRetention - mockData.metrics.previousWeeklyRetention}
          label="Weekly Retention"
          formatValue={n => `${n.toFixed(1)}%`}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.engagementScore}
          previousValue={mockData.metrics.previousEngagementScore}
          change={mockData.metrics.engagementScore - mockData.metrics.previousEngagementScore}
          label="Engagement Score"
          formatValue={n => `${n.toFixed(1)}/10`}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
      </MetricsBar>

      {/* Charts Row */}
      <Grid columns={{ xs: '1fr', lg: '2fr 1fr' }} gap="4">
        <Panel title="Daily Active Users (Last 30 Days)" allowFullscreen>
          <BarChart
            chartData={dauChartData}
            unit="day"
            height="300px"
          />
        </Panel>

        <Panel title="Feature Adoption by Category" allowFullscreen>
          <PieChart
            chartData={mockData.featureAdoptionData}
            type="doughnut"
            height="300px"
          />
        </Panel>
      </Grid>

      {/* Second Charts Row */}
      <Panel title="Weekly Retention Rate (Last 12 Weeks)" allowFullscreen>
        <BarChart
          chartData={retentionChartData}
          unit="week"
          height="300px"
        />
      </Panel>

      {/* Data Tables Row */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
        <Panel title="Top Features by Engagement" allowFullscreen>
          <ListTable
            data={mockData.topFeatures}
            title="Feature"
            metric="Active Users"
            showPercentage={true}
          />
        </Panel>

        <Panel title="User Segments by Behavior" allowFullscreen>
          <ListTable
            data={mockData.userSegments}
            title="Segment"
            metric="Users"
            showPercentage={false}
          />
        </Panel>
      </Grid>
    </Column>
  );
}
