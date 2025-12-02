'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, Heading, useTheme, Box } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { GridRow } from '@/components/common/GridRow';
import { getThemeColors } from '@/lib/colors';
import { formatLongNumber, formatLongCurrency, formatShortTime } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import { renderDateLabels } from '@/lib/charts';
import { colord } from 'colord';
import {
  DialsProvider,
  DialsOverlay,
  useDynamicColor,
  useDynamicNumber,
  useDynamicBoolean,
  useDynamicVariant,
} from '@niteshift/dials';

// Generate comprehensive time series data
function generateTimeSeriesData(days: number = 14, baseValue: number, variance: number) {
  const data: { x: string; y: number; d: string }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const multiplier = isWeekend ? 0.7 : 1;
    const randomVariance = (Math.random() - 0.5) * variance;

    data.push({
      x: dateStr,
      y: Math.round(baseValue * multiplier + randomVariance),
      d: dateStr,
    });
  }
  return data;
}

// Combined metrics data
const pageviewsData = generateTimeSeriesData(14, 1500, 600);
const sessionsData = generateTimeSeriesData(14, 1100, 400);
const conversionsData = generateTimeSeriesData(14, 85, 40);
const revenueData = generateTimeSeriesData(14, 35000, 15000);

// Traffic source data
const trafficSources = [
  { label: 'Organic Search', count: 18234, percent: 35 },
  { label: 'Direct', count: 12847, percent: 25 },
  { label: 'Paid Search', count: 9821, percent: 19 },
  { label: 'Social Media', count: 6432, percent: 12 },
  { label: 'Referral', count: 4666, percent: 9 },
];

// Feature engagement data
const featureEngagement = [
  { label: 'Dashboard', count: 8521, percent: 42 },
  { label: 'Reports', count: 5234, percent: 26 },
  { label: 'Analytics', count: 3847, percent: 19 },
  { label: 'Settings', count: 1656, percent: 8 },
  { label: 'API', count: 1012, percent: 5 },
];

// Top campaigns
const topCampaigns = [
  { label: 'Q4 Product Launch', count: 4521, percent: 38 },
  { label: 'Holiday Promo 2024', count: 3218, percent: 27 },
  { label: 'Webinar Series', count: 2156, percent: 18 },
  { label: 'Partner Referral', count: 1234, percent: 10 },
  { label: 'Retargeting', count: 812, percent: 7 },
];

// Customer health data
const customerHealth = [
  { label: 'Healthy', count: 847, percent: 68 },
  { label: 'Needs Attention', count: 287, percent: 23 },
  { label: 'At Risk', count: 112, percent: 9 },
];

// Pipeline data
const pipelineData = [
  { label: 'Qualified Leads', count: 287, percent: 32 },
  { label: 'Demo Scheduled', count: 156, percent: 17 },
  { label: 'Proposal Sent', count: 98, percent: 11 },
  { label: 'Negotiation', count: 67, percent: 8 },
  { label: 'Closed Won', count: 43, percent: 5 },
];

// Channel breakdown for pie
const channelPieData = {
  labels: ['Organic', 'Direct', 'Paid', 'Social', 'Referral'],
  datasets: [{
    data: [35, 25, 19, 12, 9],
    backgroundColor: CHART_COLORS.slice(0, 5),
    borderWidth: 0,
  }],
};

// Revenue by segment
const segmentPieData = {
  labels: ['Enterprise', 'Mid-Market', 'SMB'],
  datasets: [{
    data: [48, 35, 17],
    backgroundColor: [CHART_COLORS[0], CHART_COLORS[2], CHART_COLORS[4]],
    borderWidth: 0,
  }],
};

// Health score distribution
const healthPieData = {
  labels: ['Healthy', 'Needs Attention', 'At Risk'],
  datasets: [{
    data: [68, 23, 9],
    backgroundColor: ['#44b556', '#e68619', '#e34850'],
    borderWidth: 0,
  }],
};

// Geographic data
const geoData = [
  { label: 'United States', count: 23456, percent: 38 },
  { label: 'United Kingdom', count: 8234, percent: 13 },
  { label: 'Germany', count: 6521, percent: 11 },
  { label: 'Canada', count: 5432, percent: 9 },
  { label: 'France', count: 4321, percent: 7 },
  { label: 'Australia', count: 3892, percent: 6 },
  { label: 'Other', count: 9744, percent: 16 },
];

function HybridDashboard() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const primaryColor = useDynamicColor('hd-primary-color', {
    default: '#2680eb',
    label: 'Primary Color',
    group: 'Colors',
  });

  const successColor = useDynamicColor('hd-success-color', {
    default: '#44b556',
    label: 'Success Color',
    group: 'Colors',
  });

  const warningColor = useDynamicColor('hd-warning-color', {
    default: '#e68619',
    label: 'Warning Color',
    group: 'Colors',
  });

  const dangerColor = useDynamicColor('hd-danger-color', {
    default: '#e34850',
    label: 'Danger Color',
    group: 'Colors',
  });

  const layoutDensity = useDynamicVariant('hd-layout-density', {
    default: 'comfortable',
    options: ['compact', 'comfortable', 'spacious'],
    label: 'Layout Density',
    group: 'Layout',
  });

  const chartHeight = useDynamicNumber('hd-chart-height', {
    default: 260,
    min: 180,
    max: 400,
    label: 'Chart Height',
    group: 'Layout',
  });

  const showTrends = useDynamicBoolean('hd-show-trends', {
    default: true,
    label: 'Show Trend Indicators',
    group: 'Display',
  });

  const enableAnimations = useDynamicBoolean('hd-enable-animations', {
    default: true,
    label: 'Enable Animations',
    group: 'Display',
  });

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 13);
  const maxDate = new Date();

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Get spacing based on layout density
  const getSpacing = () => {
    switch (layoutDensity) {
      case 'compact': return '3';
      case 'spacious': return '8';
      default: return '5';
    }
  };

  // Combined traffic and engagement chart
  const combinedChartData = useMemo(() => {
    const primaryCol = colord(primaryColor);
    const successCol = colord(successColor);

    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Sessions',
          data: sessionsData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: primaryCol.alpha(0.6).toRgbString(),
          borderColor: primaryCol.alpha(0.9).toRgbString(),
          order: 2,
        },
        {
          type: 'bar' as const,
          label: 'Pageviews',
          data: pageviewsData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: successCol.alpha(0.4).toRgbString(),
          borderColor: successCol.alpha(0.7).toRgbString(),
          order: 1,
        },
      ],
    };
  }, [primaryColor, successColor]);

  // Revenue trend chart
  const revenueChartData = useMemo(() => {
    const successCol = colord(successColor);

    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Revenue',
          data: revenueData,
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          backgroundColor: successCol.alpha(0.6).toRgbString(),
          borderColor: successCol.alpha(0.9).toRgbString(),
        },
      ],
    };
  }, [successColor]);

  const spacing = getSpacing();

  return (
    <PageBody>
      <Column gap={spacing as any}>
        <PageHeader
          title="Hybrid Dashboard"
          description="Unified view combining product analytics, marketing, and revenue insights"
        />

        {/* Executive Summary Metrics */}
        <MetricsBar gap={spacing as any}>
          <MetricCard
            label="Total Visitors"
            value={52143}
            change={45892}
            showChange={showTrends}
            formatValue={formatLongNumber}
          />
          <MetricCard
            label="Conversion Rate"
            value={3.8}
            change={3.2}
            showChange={showTrends}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
          <MetricCard
            label="Monthly Revenue"
            value={487000}
            change={423000}
            showChange={showTrends}
            formatValue={(v) => formatLongCurrency(v, 'USD')}
          />
          <MetricCard
            label="Active Users"
            value={12847}
            change={11234}
            showChange={showTrends}
            formatValue={formatLongNumber}
          />
          <MetricCard
            label="Customer Health"
            value={68}
            change={62}
            showChange={showTrends}
            formatValue={(v) => `${v}%`}
          />
          <MetricCard
            label="Pipeline Value"
            value={2450000}
            change={2180000}
            showChange={showTrends}
            formatValue={(v) => formatLongCurrency(v, 'USD')}
          />
        </MetricsBar>

        {/* Main Charts Section */}
        <GridRow layout="two">
          <Panel title="Traffic & Engagement">
            <BarChart
              chartData={combinedChartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              renderXLabel={renderXLabel}
              height={`${chartHeight}px`}
            />
          </Panel>
          <Panel title="Revenue Trend">
            <BarChart
              chartData={revenueChartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              renderXLabel={renderXLabel}
              height={`${chartHeight}px`}
              currency="USD"
            />
          </Panel>
        </GridRow>

        {/* Secondary Charts */}
        <GridRow layout="three">
          <Panel title="Channel Distribution">
            <Column alignItems="center" paddingY="3">
              <PieChart
                type="doughnut"
                chartData={channelPieData}
                height="180px"
                width="180px"
              />
            </Column>
          </Panel>
          <Panel title="Revenue by Segment">
            <Column alignItems="center" paddingY="3">
              <PieChart
                type="doughnut"
                chartData={segmentPieData}
                height="180px"
                width="180px"
              />
            </Column>
          </Panel>
          <Panel title="Customer Health">
            <Column alignItems="center" paddingY="3">
              <PieChart
                type="doughnut"
                chartData={healthPieData}
                height="180px"
                width="180px"
              />
            </Column>
          </Panel>
        </GridRow>

        {/* Data Tables Section */}
        <Grid columns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }} gap={spacing as any}>
          <Panel title="Traffic Sources">
            <ListTable
              data={trafficSources}
              title="Source"
              metric="Visitors"
              showPercentage={true}
            />
          </Panel>
          <Panel title="Feature Engagement">
            <ListTable
              data={featureEngagement}
              title="Feature"
              metric="Users"
              showPercentage={true}
            />
          </Panel>
          <Panel title="Top Campaigns">
            <ListTable
              data={topCampaigns}
              title="Campaign"
              metric="Conversions"
              showPercentage={true}
            />
          </Panel>
        </Grid>

        {/* Pipeline and Customer Section */}
        <GridRow layout="two">
          <Panel title="Sales Pipeline">
            <ListTable
              data={pipelineData}
              title="Stage"
              metric="Deals"
              showPercentage={true}
            />
          </Panel>
          <Panel title="Geographic Distribution">
            <ListTable
              data={geoData}
              title="Region"
              metric="Users"
              showPercentage={true}
            />
          </Panel>
        </GridRow>

        {/* Key Insights Panel */}
        <Panel title="Key Business Insights">
          <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4">
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Row alignItems="center" gap="2">
                <Box
                  width="10px"
                  height="10px"
                  borderRadius="round"
                  style={{ backgroundColor: successColor }}
                />
                <Text size="1" color="muted">Top Performing Channel</Text>
              </Row>
              <Text size="5" weight="bold">Organic Search</Text>
              <Text size="1" color="muted">35% of traffic, 4.2% conv. rate</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Row alignItems="center" gap="2">
                <Box
                  width="10px"
                  height="10px"
                  borderRadius="round"
                  style={{ backgroundColor: primaryColor }}
                />
                <Text size="1" color="muted">Most Engaged Feature</Text>
              </Row>
              <Text size="5" weight="bold">Dashboard</Text>
              <Text size="1" color="muted">8.2 avg. sessions/user</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Row alignItems="center" gap="2">
                <Box
                  width="10px"
                  height="10px"
                  borderRadius="round"
                  style={{ backgroundColor: warningColor }}
                />
                <Text size="1" color="muted">Fastest Growing Segment</Text>
              </Row>
              <Text size="5" weight="bold">Mid-Market</Text>
              <Text size="1" color="muted">+42% MoM growth</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Row alignItems="center" gap="2">
                <Box
                  width="10px"
                  height="10px"
                  borderRadius="round"
                  style={{ backgroundColor: dangerColor }}
                />
                <Text size="1" color="muted">Attention Needed</Text>
              </Row>
              <Text size="5" weight="bold">9 At-Risk Accounts</Text>
              <Text size="1" color="muted">$287k ARR at risk</Text>
            </Column>
          </Grid>
        </Panel>

        {/* Quick Stats Footer */}
        <Grid columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(6, 1fr)' }} gap="3">
          <Column padding="3" backgroundColor="2" borderRadius="2" alignItems="center">
            <Text size="1" color="muted">Avg. Session</Text>
            <Text size="4" weight="bold">4m 32s</Text>
          </Column>
          <Column padding="3" backgroundColor="2" borderRadius="2" alignItems="center">
            <Text size="1" color="muted">Pages/Session</Text>
            <Text size="4" weight="bold">4.7</Text>
          </Column>
          <Column padding="3" backgroundColor="2" borderRadius="2" alignItems="center">
            <Text size="1" color="muted">Bounce Rate</Text>
            <Text size="4" weight="bold">32.4%</Text>
          </Column>
          <Column padding="3" backgroundColor="2" borderRadius="2" alignItems="center">
            <Text size="1" color="muted">NRR</Text>
            <Text size="4" weight="bold">118%</Text>
          </Column>
          <Column padding="3" backgroundColor="2" borderRadius="2" alignItems="center">
            <Text size="1" color="muted">CAC</Text>
            <Text size="4" weight="bold">$245</Text>
          </Column>
          <Column padding="3" backgroundColor="2" borderRadius="2" alignItems="center">
            <Text size="1" color="muted">LTV:CAC</Text>
            <Text size="4" weight="bold">4.2x</Text>
          </Column>
        </Grid>
      </Column>
      <DialsOverlay position="bottom-right" />
    </PageBody>
  );
}

export default function HybridDashboardPage() {
  return (
    <DialsProvider projectId="hybrid-dashboard">
      <HybridDashboard />
    </DialsProvider>
  );
}
