'use client';
import { Column, Grid, Heading, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useMemo } from 'react';
import { format } from 'date-fns';

// Mock data generator for realistic product analytics metrics
function generateMockData() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 30);

  // Generate daily engagement data for the last 30 days
  const dailyEngagement = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dailyEngagement.push({
      x: format(date, 'yyyy-MM-dd'), // Format for day unit
      y: Math.floor(12000 + Math.random() * 8000 + Math.sin(i / 7) * 3000), // Weekly pattern
    });
  }

  // Generate hourly data for today
  const hourlyData = [];
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now);
    hour.setHours(i, 0, 0, 0);
    // Peak during business hours (9-17)
    const baseLine = i >= 9 && i <= 17 ? 800 : 200;
    hourlyData.push({
      x: format(hour, 'yyyy-MM-dd HH'), // Format for hour unit
      y: Math.floor(baseLine + Math.random() * 300),
    });
  }

  // Feature adoption data
  const featureData = [
    { name: 'Dashboard', value: 8543 },
    { name: 'Reports', value: 6721 },
    { name: 'Analytics', value: 5892 },
    { name: 'Settings', value: 3456 },
    { name: 'Integrations', value: 2134 },
    { name: 'API', value: 1245 },
  ];

  // User cohort retention
  const cohortData = [];
  for (let week = 0; week < 12; week++) {
    const date = new Date(now);
    date.setDate(date.getDate() - week * 7);
    const retention = 100 * Math.pow(0.85, week); // 15% weekly churn
    cohortData.push({
      x: format(date, "yyyy-'W'II"), // Format for week unit
      y: Math.floor(retention),
    });
  }

  return {
    dailyEngagement,
    hourlyData,
    featureData,
    cohortData,
    metrics: {
      activeUsers: 47823,
      prevActiveUsers: 45120,
      sessionDuration: 342, // seconds
      prevSessionDuration: 328,
      engagementRate: 68.4, // percentage
      prevEngagementRate: 64.2,
      featureAdoption: 82.5, // percentage
      prevFeatureAdoption: 78.9,
      dailyActiveUsers: 12456,
      prevDailyActiveUsers: 11823,
      weeklyRetention: 73.2, // percentage
      prevWeeklyRetention: 71.8,
    },
  };
}

export default function ProductAnalyticsPage() {
  const mockData = useMemo(() => generateMockData(), []);

  // Prepare chart data for daily engagement
  const engagementChartData = {
    datasets: [
      {
        label: 'Active Users',
        data: mockData.dailyEngagement,
        borderColor: '#2680eb',
        backgroundColor: '#2680eb',
      },
    ],
  };

  // Prepare chart data for hourly pattern
  const hourlyChartData = {
    datasets: [
      {
        label: 'Sessions',
        data: mockData.hourlyData,
        borderColor: '#44b556',
        backgroundColor: '#44b556',
      },
    ],
  };

  // Prepare pie chart for feature adoption
  const featureChartData = {
    labels: mockData.featureData.map(f => f.name),
    datasets: [
      {
        data: mockData.featureData.map(f => f.value),
        backgroundColor: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#01bad7'],
      },
    ],
  };

  // Prepare cohort retention chart
  const cohortChartData = {
    datasets: [
      {
        label: 'Retention %',
        data: mockData.cohortData.reverse(),
        borderColor: '#9256d9',
        backgroundColor: '#9256d9',
      },
    ],
  };

  const formatSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <PageBody>
      <Column gap="3" margin="2">
        <PageHeader title="Product Analytics Dashboard">
          <Text size="2" style={{ color: '#838383' }}>
            User engagement metrics and behavior patterns
          </Text>
        </PageHeader>

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            label="Monthly Active Users"
            value={mockData.metrics.activeUsers}
            change={mockData.metrics.activeUsers - mockData.metrics.prevActiveUsers}
            showChange
          />
          <MetricCard
            label="Daily Active Users"
            value={mockData.metrics.dailyActiveUsers}
            change={mockData.metrics.dailyActiveUsers - mockData.metrics.prevDailyActiveUsers}
            showChange
          />
          <MetricCard
            label="Avg Session Duration"
            value={mockData.metrics.sessionDuration}
            change={mockData.metrics.sessionDuration - mockData.metrics.prevSessionDuration}
            formatValue={formatSeconds}
            showChange
          />
          <MetricCard
            label="Engagement Rate"
            value={mockData.metrics.engagementRate}
            change={mockData.metrics.engagementRate - mockData.metrics.prevEngagementRate}
            formatValue={formatPercent}
            showChange
          />
          <MetricCard
            label="Feature Adoption"
            value={mockData.metrics.featureAdoption}
            change={mockData.metrics.featureAdoption - mockData.metrics.prevFeatureAdoption}
            formatValue={formatPercent}
            showChange
          />
          <MetricCard
            label="Weekly Retention"
            value={mockData.metrics.weeklyRetention}
            change={mockData.metrics.weeklyRetention - mockData.metrics.prevWeeklyRetention}
            formatValue={formatPercent}
            showChange
          />
        </MetricsBar>

        {/* Engagement Charts */}
        <GridRow layout="two">
          <Panel title="Daily Active Users (30 Days)" allowFullscreen>
            <BarChart chartData={engagementChartData} height={300} unit="day" />
          </Panel>
          <Panel title="Hourly Session Pattern (Today)" allowFullscreen>
            <BarChart chartData={hourlyChartData} height={300} unit="hour" />
          </Panel>
        </GridRow>

        {/* Feature Adoption and Retention */}
        <GridRow layout="two">
          <Panel title="Feature Usage Distribution" allowFullscreen>
            <PieChart chartData={featureChartData} height={300} type="doughnut" />
          </Panel>
          <Panel title="User Retention by Cohort (12 Weeks)" allowFullscreen>
            <BarChart chartData={cohortChartData} height={300} unit="week" />
          </Panel>
        </GridRow>
      </Column>
    </PageBody>
  );
}
