'use client';

import { useMemo, useState, useEffect } from 'react';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import {
  useDynamicColor,
  useDynamicVariant,
  useDynamicSpacing,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';
import {
  Users,
  MousePointerClick,
  Clock,
  TrendingUp,
  Repeat,
  Target,
  Zap,
  Activity,
} from '@/components/icons';

// Generate realistic mock data for the past 30 days
function generateTimeSeriesData(baseValue: number, variance: number, days: number = 30) {
  const now = new Date();
  const data: { x: string; y: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
    const trendFactor = 1 + (days - i) * 0.01;
    const randomFactor = 0.8 + Math.random() * 0.4;
    const value = Math.round(baseValue * weekendFactor * trendFactor * randomFactor * variance);
    data.push({ x: dateStr, y: value });
  }

  return data;
}

// Feature adoption funnel data
const featureAdoptionData = {
  labels: ['Signed Up', 'Onboarded', 'First Action', 'Power User', 'Retained 30d'],
  datasets: [
    {
      label: 'Users',
      data: [12847, 9634, 7256, 4102, 2891],
      backgroundColor: [
        'rgba(38, 128, 235, 0.8)',
        'rgba(38, 128, 235, 0.7)',
        'rgba(38, 128, 235, 0.6)',
        'rgba(38, 128, 235, 0.5)',
        'rgba(38, 128, 235, 0.4)',
      ],
      borderColor: 'rgba(38, 128, 235, 1)',
      borderWidth: 1,
    },
  ],
};

// User segments pie chart
const userSegmentsData = {
  labels: ['Power Users', 'Regular Users', 'Casual Users', 'Dormant Users', 'New Users'],
  datasets: [
    {
      data: [15, 28, 32, 12, 13],
      backgroundColor: [
        '#2680eb',
        '#9256d9',
        '#44b556',
        '#e68619',
        '#e34850',
      ],
      borderWidth: 0,
    },
  ],
};

// Feature usage data
const featureUsageData = {
  labels: ['Dashboard', 'Reports', 'Analytics', 'Settings', 'Export', 'API'],
  datasets: [
    {
      label: 'Usage Count',
      data: [8432, 6721, 5893, 3421, 2876, 1934],
      backgroundColor: 'rgba(146, 86, 217, 0.7)',
      borderColor: 'rgba(146, 86, 217, 1)',
      borderWidth: 1,
    },
  ],
};

export default function ProductAnalyticsPage() {
  // Dials for customization
  const primaryColor = useDynamicColor('pa-primary-color', {
    label: 'Primary Color',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850'],
    group: 'Colors',
  });

  const accentColor = useDynamicColor('pa-accent-color', {
    label: 'Accent Color',
    default: '#9256d9',
    options: ['#9256d9', '#2680eb', '#44b556', '#f15bb5', '#01bad7'],
    group: 'Colors',
  });

  const layoutVariant = useDynamicVariant('pa-layout', {
    label: 'Layout Style',
    default: 'grid',
    options: ['grid', 'stacked', 'compact'] as const,
    group: 'Layout',
  });

  const cardSpacing = useDynamicSpacing('pa-card-spacing', {
    label: 'Card Spacing',
    default: '24px',
    options: ['16px', '20px', '24px', '32px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('pa-chart-height', {
    label: 'Chart Height',
    default: 300,
    min: 200,
    max: 500,
    step: 50,
    unit: 'px',
    group: 'Charts',
  });

  const showRetentionMetrics = useDynamicBoolean('pa-show-retention', {
    label: 'Show Retention Metrics',
    default: true,
    group: 'Features',
  });

  const showSegmentation = useDynamicBoolean('pa-show-segmentation', {
    label: 'Show User Segmentation',
    default: true,
    group: 'Features',
  });

  // Generate engagement time series with proper date format
  const engagementData = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 29);

    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Active Users',
          data: generateTimeSeriesData(5200, 1, 30),
          backgroundColor: `${primaryColor}99`,
          borderColor: primaryColor,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Sessions',
          data: generateTimeSeriesData(8400, 1, 30),
          backgroundColor: `${accentColor}66`,
          borderColor: accentColor,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ],
    };
  }, [primaryColor, accentColor]);

  // Use state for client-side rendering to avoid SSR date formatting issues
  const [isClient, setIsClient] = useState(false);
  const [dateRange, setDateRange] = useState<{ minDate: Date; maxDate: Date } | null>(null);

  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    setDateRange({ minDate: start, maxDate: now });
  }, []);

  const gapValue = cardSpacing.replace('px', '');

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader
          title="Product Analytics"
          description="User engagement, behavior patterns, and feature adoption insights"
        />

        {/* Key Engagement Metrics */}
        <MetricsBar>
          <MetricCard
            label="Daily Active Users"
            value={5247}
            change={342}
            showChange
          />
          <MetricCard
            label="Avg. Session Duration"
            value={847}
            change={-23}
            showChange
            formatValue={(v) => `${Math.floor(v / 60)}m ${v % 60}s`}
          />
          <MetricCard
            label="Feature Adoption Rate"
            value={73.4}
            change={5.2}
            showChange
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
          <MetricCard
            label="User Stickiness (DAU/MAU)"
            value={28.6}
            change={2.1}
            showChange
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
        </MetricsBar>

        {showRetentionMetrics && (
          <MetricsBar>
            <MetricCard
              label="Day 1 Retention"
              value={68.2}
              change={3.4}
              showChange
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
            <MetricCard
              label="Day 7 Retention"
              value={42.7}
              change={1.8}
              showChange
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
            <MetricCard
              label="Day 30 Retention"
              value={22.5}
              change={-0.9}
              showChange
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
            <MetricCard
              label="Churn Rate"
              value={4.2}
              change={-0.3}
              showChange
              reverseColors
              formatValue={(v) => `${v.toFixed(1)}%`}
            />
          </MetricsBar>
        )}

        {/* Main Charts Section */}
        <Grid
          columns={layoutVariant === 'stacked' ? '1fr' : { xs: '1fr', lg: '2fr 1fr' }}
          gap={gapValue as any}
        >
          {/* User Engagement Chart */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Row justifyContent="space-between" alignItems="center">
              <Column gap="1">
                <Heading size="2">User Engagement Trends</Heading>
                <Text color="muted" size="1">Daily active users and session activity over time</Text>
              </Column>
            </Row>
            {dateRange && (
              <BarChart
                chartData={engagementData}
                unit="day"
                minDate={dateRange.minDate}
                maxDate={dateRange.maxDate}
                height={`${chartHeight}px`}
              />
            )}
          </Column>

          {/* User Segments */}
          {showSegmentation && (
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="6"
              gap="4"
            >
              <Column gap="1">
                <Heading size="2">User Segments</Heading>
                <Text color="muted" size="1">Distribution by engagement level</Text>
              </Column>
              <PieChart
                chartData={userSegmentsData}
                type="doughnut"
                height={`${chartHeight}px`}
              />
            </Column>
          )}
        </Grid>

        {/* Feature Usage & Funnel */}
        <Grid
          columns={layoutVariant === 'compact' ? '1fr' : { xs: '1fr', lg: '1fr 1fr' }}
          gap={gapValue as any}
        >
          {/* Feature Adoption Funnel */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Adoption Funnel</Heading>
              <Text color="muted" size="1">User journey from signup to power user</Text>
            </Column>
            {isClient && (
              <BarChart
                chartData={featureAdoptionData}
                XAxisType="category"
                height={`${chartHeight}px`}
              />
            )}
          </Column>

          {/* Feature Usage */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Feature Usage</Heading>
              <Text color="muted" size="1">Most used features this month</Text>
            </Column>
            {isClient && (
              <BarChart
                chartData={featureUsageData}
                XAxisType="category"
                height={`${chartHeight}px`}
              />
            )}
          </Column>
        </Grid>

        {/* Behavioral Insights */}
        <Column
          backgroundColor
          border
          borderRadius="3"
          padding="6"
          gap="4"
        >
          <Column gap="1">
            <Heading size="2">Behavioral Insights</Heading>
            <Text color="muted" size="1">Key patterns and user behavior metrics</Text>
          </Column>
          <Grid columns={{ xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="4">
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Target size={16} style={{ color: primaryColor }} />
                <Text weight="bold" size="1">Conversion Rate</Text>
              </Row>
              <Text size="6" weight="bold">12.4%</Text>
              <Text color="muted" size="0">+2.1% from last month</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Repeat size={16} style={{ color: accentColor }} />
                <Text weight="bold" size="1">Repeat Usage</Text>
              </Row>
              <Text size="6" weight="bold">67.8%</Text>
              <Text color="muted" size="0">Users returning within 7 days</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Zap size={16} style={{ color: '#44b556' }} />
                <Text weight="bold" size="1">Activation Rate</Text>
              </Row>
              <Text size="6" weight="bold">75.1%</Text>
              <Text color="muted" size="0">Completed key action in session 1</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Activity size={16} style={{ color: '#e68619' }} />
                <Text weight="bold" size="1">Engagement Score</Text>
              </Row>
              <Text size="6" weight="bold">8.2/10</Text>
              <Text color="muted" size="0">Based on feature interactions</Text>
            </Column>
          </Grid>
        </Column>
      </Column>
    </PageBody>
  );
}
