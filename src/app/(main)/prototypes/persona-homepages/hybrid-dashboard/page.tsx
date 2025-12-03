'use client';

import { useState } from 'react';
import { Column, Row, Grid, Text, Heading, Box } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { ListTable } from '@/components/metrics/ListTable';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import {
  useDynamicVariant,
  useDynamicBoolean,
} from '@niteshift/dials';

// Chart colors from design system
const CHART_COLORS = [
  '#2680eb',
  '#9256d9',
  '#44b556',
  '#e68619',
  '#e34850',
  '#f7bd12',
  '#01bad7',
  '#6734bc',
  '#89c541',
  '#ffc301',
];

// Generate realistic dates for the last 30 days
function generateDates(count: number) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// Product Analytics Mock Data
const productMetrics = {
  dau: 24892,
  dauChange: 8.3,
  wau: 98450,
  wauChange: 5.2,
  mau: 312500,
  mauChange: 12.1,
  featureAdoption: 67.8,
  featureAdoptionChange: 4.2,
  avgSessionDuration: 8.4,
  sessionChange: -2.1,
};

const topFeatures = [
  { label: 'Dashboard Analytics', count: 45230, percent: 78 },
  { label: 'Custom Reports', count: 38920, percent: 67 },
  { label: 'API Integrations', count: 31450, percent: 54 },
  { label: 'Team Collaboration', count: 28100, percent: 48 },
  { label: 'Export Tools', count: 21890, percent: 38 },
  { label: 'Alert Notifications', count: 19200, percent: 33 },
];

const engagementDates = generateDates(14);
const engagementMinDate = new Date(engagementDates[0]);
const engagementMaxDate = new Date(engagementDates[engagementDates.length - 1]);
const engagementData = {
  labels: engagementDates,
  datasets: [
    {
      label: 'Active Users',
      data: engagementDates.map((date, i) => ({
        x: date,
        y: 18000 + Math.floor(Math.random() * 8000) + i * 200,
      })),
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
    },
  ],
};

// Marketing Attribution Mock Data
const marketingMetrics = {
  totalVisitors: 156780,
  visitorsChange: 15.4,
  conversionRate: 3.8,
  conversionChange: 0.4,
  costPerAcquisition: 42.50,
  cpaChange: -8.2,
  leadQuality: 72,
  leadQualityChange: 3.1,
};

const trafficSources = [
  { label: 'Organic Search', count: 52340, percent: 33 },
  { label: 'Direct Traffic', count: 41890, percent: 27 },
  { label: 'Paid Search', count: 28450, percent: 18 },
  { label: 'Social Media', count: 18920, percent: 12 },
  { label: 'Email Campaigns', count: 10240, percent: 7 },
  { label: 'Referral', count: 4940, percent: 3 },
];

const trafficPieData = {
  labels: trafficSources.map(s => s.label),
  datasets: [
    {
      data: trafficSources.map(s => s.count),
      backgroundColor: CHART_COLORS.slice(0, trafficSources.length),
      borderColor: CHART_COLORS.slice(0, trafficSources.length),
    },
  ],
};

const topCampaigns = [
  { label: 'Q4 Product Launch', count: 12450, percent: 42 },
  { label: 'Holiday Promo 2024', count: 9870, percent: 33 },
  { label: 'Webinar Series', count: 7230, percent: 24 },
  { label: 'LinkedIn Outreach', count: 5890, percent: 20 },
  { label: 'Content Syndication', count: 4120, percent: 14 },
];

// Revenue Operations Mock Data
const revenueMetrics = {
  mrr: 2847500,
  mrrChange: 6.8,
  arr: 34170000,
  arrChange: 18.2,
  avgDealSize: 28500,
  dealSizeChange: 12.4,
  customerHealth: 84,
  healthChange: 2.1,
  nrr: 118,
  nrrChange: 4.5,
};

const pipelineDates = generateDates(7);
const pipelineMinDate = new Date(pipelineDates[0]);
const pipelineMaxDate = new Date(pipelineDates[pipelineDates.length - 1]);
const pipelineData = {
  labels: pipelineDates,
  datasets: [
    {
      label: 'Pipeline Value',
      data: pipelineDates.map((date, i) => ({
        x: date,
        y: 4200000 + Math.floor(Math.random() * 800000) + i * 150000,
      })),
      backgroundColor: CHART_COLORS[2],
      borderColor: CHART_COLORS[2],
      borderWidth: 1,
    },
  ],
};

const topAccounts = [
  { label: 'Acme Corporation', count: 245000, percent: 92 },
  { label: 'GlobalTech Industries', count: 198000, percent: 88 },
  { label: 'Nexus Financial', count: 175000, percent: 85 },
  { label: 'Pinnacle Systems', count: 142000, percent: 78 },
  { label: 'Vertex Solutions', count: 118000, percent: 72 },
  { label: 'Quantum Dynamics', count: 95000, percent: 65 },
];

const healthDistribution = {
  labels: ['Healthy', 'At Risk', 'Critical'],
  datasets: [
    {
      data: [68, 24, 8],
      backgroundColor: ['#30a46c', '#f76b15', '#e5484d'],
      borderColor: ['#30a46c', '#f76b15', '#e5484d'],
    },
  ],
};

export default function HybridDashboardPage() {
  // Dials controls for section visibility
  const showProductSection = useDynamicBoolean('show-product-section', {
    label: 'Show Product Health',
    description: 'Toggle visibility of Product Health section',
    default: true,
    group: 'Section Visibility',
  });

  const showMarketingSection = useDynamicBoolean('show-marketing-section', {
    label: 'Show Marketing Performance',
    description: 'Toggle visibility of Marketing Performance section',
    default: true,
    group: 'Section Visibility',
  });

  const showRevenueSection = useDynamicBoolean('show-revenue-section', {
    label: 'Show Revenue Overview',
    description: 'Toggle visibility of Revenue Overview section',
    default: true,
    group: 'Section Visibility',
  });

  // Layout arrangement
  const layoutArrangement = useDynamicVariant('layout-arrangement', {
    label: 'Layout Arrangement',
    description: 'Choose how sections are arranged',
    default: 'stacked',
    options: ['stacked', 'two-column'] as const,
    group: 'Layout',
  });

  // Chart type preference for traffic
  const trafficChartType = useDynamicVariant('traffic-chart-type', {
    label: 'Traffic Chart Type',
    description: 'Choose chart type for traffic sources',
    default: 'pie',
    options: ['pie', 'doughnut'] as const,
    group: 'Chart Preferences',
  });

  // Metric display size
  const metricSize = useDynamicVariant('metric-display-size', {
    label: 'Metric Display Size',
    description: 'Size of metric values',
    default: '7',
    options: ['5', '6', '7', '8', '9'] as const,
    group: 'Display',
  });

  const formatCurrency = (n: number) => `$${Math.round(n).toLocaleString()}`;
  const formatPercent = (n: number) => `${n.toFixed(1)}%`;
  const formatMinutes = (n: number) => `${n.toFixed(1)}m`;

  const renderSection = (
    title: string,
    subtitle: string,
    accentColor: string,
    children: React.ReactNode
  ) => (
    <Column
      gap="4"
      style={{
        animation: 'fadeInUp 0.5s ease-out forwards',
        opacity: 0,
      }}
    >
      <Row alignItems="center" gap="3">
        <Box
          style={{
            width: '4px',
            height: '28px',
            backgroundColor: accentColor,
            borderRadius: '2px',
          }}
        />
        <Column gap="1">
          <Heading size="3">{title}</Heading>
          <Text color="muted" size="2">{subtitle}</Text>
        </Column>
      </Row>
      {children}
    </Column>
  );

  const ProductHealthSection = () => (
    <>
      <MetricsBar>
        <MetricCard
          label="Daily Active Users"
          value={productMetrics.dau}
          change={productMetrics.dauChange}
          showChange
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Weekly Active Users"
          value={productMetrics.wau}
          change={productMetrics.wauChange}
          showChange
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Monthly Active Users"
          value={productMetrics.mau}
          change={productMetrics.mauChange}
          showChange
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Feature Adoption"
          value={productMetrics.featureAdoption}
          change={productMetrics.featureAdoptionChange}
          showChange
          formatValue={formatPercent}
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Avg Session"
          value={productMetrics.avgSessionDuration}
          change={productMetrics.sessionChange}
          showChange
          formatValue={formatMinutes}
          valueSize={metricSize as any}
        />
      </MetricsBar>
      <Grid columns={{ xs: '1fr', lg: '2fr 1fr' }} gap="4">
        <Panel title="User Engagement Trend">
          <Box style={{ height: '280px' }}>
            <BarChart
              chartData={engagementData}
              unit="day"
              minDate={engagementMinDate}
              maxDate={engagementMaxDate}
            />
          </Box>
        </Panel>
        <Panel title="Top Features by Usage">
          <ListTable
            data={topFeatures}
            title="Feature"
            metric="Users"
            showPercentage
          />
        </Panel>
      </Grid>
    </>
  );

  const MarketingPerformanceSection = () => (
    <>
      <MetricsBar>
        <MetricCard
          label="Total Visitors"
          value={marketingMetrics.totalVisitors}
          change={marketingMetrics.visitorsChange}
          showChange
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Conversion Rate"
          value={marketingMetrics.conversionRate}
          change={marketingMetrics.conversionChange}
          showChange
          formatValue={formatPercent}
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Cost Per Acquisition"
          value={marketingMetrics.costPerAcquisition}
          change={marketingMetrics.cpaChange}
          showChange
          formatValue={formatCurrency}
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Lead Quality Score"
          value={marketingMetrics.leadQuality}
          change={marketingMetrics.leadQualityChange}
          showChange
          valueSize={metricSize as any}
        />
      </MetricsBar>
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
        <Panel title="Traffic Sources">
          <Box style={{ height: '280px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart
              type={trafficChartType as 'pie' | 'doughnut'}
              chartData={trafficPieData}
            />
          </Box>
        </Panel>
        <Panel title="Top Campaigns">
          <ListTable
            data={topCampaigns}
            title="Campaign"
            metric="Conversions"
            showPercentage
          />
        </Panel>
      </Grid>
    </>
  );

  const RevenueOverviewSection = () => (
    <>
      <MetricsBar>
        <MetricCard
          label="Monthly Recurring Revenue"
          value={revenueMetrics.mrr}
          change={revenueMetrics.mrrChange}
          showChange
          formatValue={formatCurrency}
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Annual Recurring Revenue"
          value={revenueMetrics.arr}
          change={revenueMetrics.arrChange}
          showChange
          formatValue={formatCurrency}
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Avg Deal Size"
          value={revenueMetrics.avgDealSize}
          change={revenueMetrics.dealSizeChange}
          showChange
          formatValue={formatCurrency}
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Net Revenue Retention"
          value={revenueMetrics.nrr}
          change={revenueMetrics.nrrChange}
          showChange
          formatValue={formatPercent}
          valueSize={metricSize as any}
        />
        <MetricCard
          label="Customer Health"
          value={revenueMetrics.customerHealth}
          change={revenueMetrics.healthChange}
          showChange
          valueSize={metricSize as any}
        />
      </MetricsBar>
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr 1fr' }} gap="4">
        <Panel title="Pipeline Trend">
          <Box style={{ height: '240px' }}>
            <BarChart
              chartData={pipelineData}
              unit="day"
              minDate={pipelineMinDate}
              maxDate={pipelineMaxDate}
              currency="USD"
            />
          </Box>
        </Panel>
        <Panel title="Customer Health Distribution">
          <Box style={{ height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart type="doughnut" chartData={healthDistribution} />
          </Box>
        </Panel>
        <Panel title="Top Accounts by ARR">
          <ListTable
            data={topAccounts}
            title="Account"
            metric="ARR"
            showPercentage
            currency="USD"
          />
        </Panel>
      </Grid>
    </>
  );

  const renderContent = () => {
    const sections = [];

    if (showProductSection) {
      sections.push(
        <div
          key="product"
          style={{
            animation: 'fadeInUp 0.5s ease-out forwards',
            animationDelay: '0.1s',
            opacity: 0,
          }}
        >
          {renderSection(
            'Product Health',
            'User engagement and feature adoption metrics',
            '#2680eb',
            <ProductHealthSection />
          )}
        </div>
      );
    }

    if (showMarketingSection) {
      sections.push(
        <div
          key="marketing"
          style={{
            animation: 'fadeInUp 0.5s ease-out forwards',
            animationDelay: '0.2s',
            opacity: 0,
          }}
        >
          {renderSection(
            'Marketing Performance',
            'Traffic attribution and campaign effectiveness',
            '#9256d9',
            <MarketingPerformanceSection />
          )}
        </div>
      );
    }

    if (showRevenueSection) {
      sections.push(
        <div
          key="revenue"
          style={{
            animation: 'fadeInUp 0.5s ease-out forwards',
            animationDelay: '0.3s',
            opacity: 0,
          }}
        >
          {renderSection(
            'Revenue Overview',
            'Financial metrics and customer health',
            '#30a46c',
            <RevenueOverviewSection />
          )}
        </div>
      );
    }

    if (layoutArrangement === 'two-column' && sections.length >= 2) {
      return (
        <Grid columns={{ xs: '1fr', xl: '1fr 1fr' }} gap="6">
          <Column gap="6">
            {sections.filter((_, i) => i % 2 === 0)}
          </Column>
          <Column gap="6">
            {sections.filter((_, i) => i % 2 === 1)}
          </Column>
        </Grid>
      );
    }

    return <Column gap="6">{sections}</Column>;
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <PageBody>
        <PageHeader
          title="Executive Dashboard"
          description="Unified view of product, marketing, and revenue performance"
        />
        {renderContent()}
      </PageBody>
    </>
  );
}
