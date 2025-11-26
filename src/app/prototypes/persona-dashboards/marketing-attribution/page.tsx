'use client';

import { useMemo, useState, useEffect } from 'react';
import { Column, Grid, Row, Text, Heading, Box, Loading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import {
  useDynamicColor,
  useDynamicVariant,
  useDynamicNumber,
  useDynamicBoolean,
  DialsProvider,
  DialsOverlay,
} from '@niteshift/dials';

// Generate mock campaign performance data over time
function generateCampaignTimeSeriesData(days: number = 30) {
  const channels = ['Paid Search', 'Organic Search', 'Social Media', 'Email', 'Direct'];
  const data: Record<string, { x: Date; y: number }[]> = {};

  channels.forEach(channel => {
    data[channel] = [];
  });

  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Use actual Date objects for timeseries charts
    const dateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.65 : 1;

    data['Paid Search'].push({ x: dateObj, y: Math.round((1200 + Math.random() * 400) * weekendMultiplier) });
    data['Organic Search'].push({ x: dateObj, y: Math.round((2800 + Math.random() * 600) * weekendMultiplier) });
    data['Social Media'].push({ x: dateObj, y: Math.round((800 + Math.random() * 300) * weekendMultiplier) });
    data['Email'].push({ x: dateObj, y: Math.round((600 + Math.random() * 200) * weekendMultiplier) });
    data['Direct'].push({ x: dateObj, y: Math.round((1500 + Math.random() * 350) * weekendMultiplier) });
  }

  return data;
}

function generateChannelBreakdownData() {
  return [
    { label: 'Organic Search', count: 84567, percent: 35, revenue: 423890, cpa: 0 },
    { label: 'Paid Search (Google Ads)', count: 45678, percent: 19, revenue: 312456, cpa: 24.50 },
    { label: 'Social Media (Paid)', count: 32145, percent: 13, revenue: 189234, cpa: 18.75 },
    { label: 'Social Media (Organic)', count: 28934, percent: 12, revenue: 145670, cpa: 0 },
    { label: 'Email Marketing', count: 24567, percent: 10, revenue: 198765, cpa: 2.30 },
    { label: 'Direct Traffic', count: 18234, percent: 8, revenue: 91170, cpa: 0 },
    { label: 'Referral', count: 7891, percent: 3, revenue: 47346, cpa: 0 },
  ];
}

function generateCampaignPerformanceData() {
  return [
    { label: 'Black Friday 2024', count: 12456, percent: 24, spend: 45000, revenue: 234567, roas: 5.21 },
    { label: 'Holiday Season Push', count: 9876, percent: 19, spend: 38000, revenue: 178234, roas: 4.69 },
    { label: 'New Year Launch', count: 8234, percent: 16, spend: 28000, revenue: 145678, roas: 5.20 },
    { label: 'Brand Awareness Q4', count: 7123, percent: 14, spend: 52000, revenue: 124890, roas: 2.40 },
    { label: 'Retargeting Campaign', count: 6789, percent: 13, spend: 18000, revenue: 98765, roas: 5.49 },
    { label: 'Newsletter Promo', count: 5234, percent: 10, spend: 5000, revenue: 87654, roas: 17.53 },
    { label: 'Affiliate Partners', count: 2345, percent: 4, spend: 12000, revenue: 45678, roas: 3.81 },
  ];
}

function generateUTMSourceData() {
  return [
    { label: 'google', count: 67890, percent: 34 },
    { label: 'facebook', count: 34567, percent: 17 },
    { label: 'newsletter', count: 23456, percent: 12 },
    { label: 'twitter', count: 18234, percent: 9 },
    { label: 'linkedin', count: 15678, percent: 8 },
    { label: 'instagram', count: 12345, percent: 6 },
    { label: 'partner_blog', count: 9876, percent: 5 },
    { label: 'youtube', count: 8765, percent: 4 },
    { label: 'tiktok', count: 6543, percent: 3 },
    { label: 'podcast', count: 4321, percent: 2 },
  ];
}

function generateLandingPageData() {
  return [
    { label: '/pricing', count: 34567, percent: 28, conversionRate: 4.2 },
    { label: '/features', count: 28934, percent: 23, conversionRate: 3.8 },
    { label: '/demo', count: 23456, percent: 19, conversionRate: 8.5 },
    { label: '/blog/analytics-guide', count: 18234, percent: 15, conversionRate: 2.1 },
    { label: '/case-studies', count: 12345, percent: 10, conversionRate: 5.6 },
    { label: '/free-trial', count: 6789, percent: 5, conversionRate: 12.3 },
  ];
}

function MarketingAttributionDashboardContent() {
  // Client-side only rendering to avoid SSR date issues
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dials for customization
  const primaryColor = useDynamicColor('ma-primary-color', {
    label: 'Primary Color',
    default: '#9256d9',
    options: ['#9256d9', '#2680eb', '#44b556', '#e68619', '#e34850', '#01bad7'],
    group: 'Colors',
  });

  const secondaryColor = useDynamicColor('ma-secondary-color', {
    label: 'Secondary Color',
    default: '#44b556',
    options: ['#44b556', '#2680eb', '#9256d9', '#e68619', '#e34850', '#01bad7'],
    group: 'Colors',
  });

  const warningColor = useDynamicColor('ma-warning-color', {
    label: 'Warning/Alert Color',
    default: '#e68619',
    options: ['#e68619', '#e34850', '#f7bd12', '#9256d9', '#2680eb'],
    group: 'Colors',
  });

  const layout = useDynamicVariant('ma-layout', {
    label: 'Dashboard Layout',
    default: 'standard',
    options: ['standard', 'metrics-first', 'charts-first'] as const,
    group: 'Layout',
  });

  const showROAS = useDynamicBoolean('ma-show-roas', {
    label: 'Show ROAS Metrics',
    default: true,
    group: 'Display',
  });

  const currencyDisplay = useDynamicVariant('ma-currency', {
    label: 'Currency Display',
    default: 'USD',
    options: ['USD', 'EUR', 'GBP'] as const,
    group: 'Display',
  });

  const metricSize = useDynamicVariant('ma-metric-size', {
    label: 'Metric Value Size',
    default: '8',
    options: ['6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  const panelSpacing = useDynamicNumber('ma-panel-spacing', {
    label: 'Panel Spacing',
    default: 3,
    min: 1,
    max: 6,
    step: 1,
    group: 'Spacing',
  });

  // Mock data
  const channelTimeData = useMemo(() => generateCampaignTimeSeriesData(30), []);
  const channelBreakdown = useMemo(() => generateChannelBreakdownData(), []);
  const campaignPerformance = useMemo(() => generateCampaignPerformanceData(), []);
  const utmSourceData = useMemo(() => generateUTMSourceData(), []);
  const landingPageData = useMemo(() => generateLandingPageData(), []);

  // Chart data
  const channelTrendsChartData = useMemo(() => ({
    datasets: [
      {
        type: 'line' as const,
        label: 'Organic Search',
        data: channelTimeData['Organic Search'],
        borderColor: primaryColor,
        backgroundColor: primaryColor + '22',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        type: 'line' as const,
        label: 'Paid Search',
        data: channelTimeData['Paid Search'],
        borderColor: secondaryColor,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        type: 'line' as const,
        label: 'Social Media',
        data: channelTimeData['Social Media'],
        borderColor: warningColor,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  }), [channelTimeData, primaryColor, secondaryColor, warningColor]);

  const channelPieData = useMemo(() => ({
    labels: channelBreakdown.slice(0, 6).map(d => d.label),
    datasets: [{
      data: channelBreakdown.slice(0, 6).map(d => d.count),
      backgroundColor: [primaryColor, secondaryColor, warningColor, '#e34850', '#01bad7', '#f7bd12'],
      borderWidth: 0,
    }],
  }), [channelBreakdown, primaryColor, secondaryColor, warningColor]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    return d;
  }, []);
  const maxDate = useMemo(() => new Date(), []);

  const gridGap = `${panelSpacing}` as any;

  if (!isClient) {
    return (
      <Column padding="6" width="100%" maxWidth="1400px" alignItems="center" justifyContent="center" minHeight="400px">
        <Loading />
      </Column>
    );
  }

  const formatCurrency = (value: number) => {
    const symbols: Record<string, string> = { USD: '$', EUR: '\u20ac', GBP: '\u00a3' };
    return `${symbols[currencyDisplay]}${formatLongNumber(value)}`;
  };

  return (
    <Column gap={gridGap} padding="6" width="100%" maxWidth="1400px">
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="5">Marketing Attribution Dashboard</Heading>
          <Text color="muted">Track inbound sources and campaign performance</Text>
        </Column>
        <Row gap="3" alignItems="center">
          <Box padding="2" backgroundColor="2" borderRadius="2">
            <Text size="0" color="muted">Currency: {currencyDisplay}</Text>
          </Box>
          <Text color="muted" size="1">Last 30 days</Text>
        </Row>
      </Row>

      {/* Key Marketing Metrics */}
      <MetricsBar>
        <MetricCard
          value={242125}
          change={18234}
          label="Total Visitors"
          formatValue={formatLongNumber}
          showChange={true}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={1408531}
          change={123456}
          label="Total Revenue"
          formatValue={formatCurrency}
          showChange={showROAS}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={198000}
          change={-12000}
          label="Ad Spend"
          formatValue={formatCurrency}
          showChange={showROAS}
          reverseColors={true}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={7.11}
          change={0.45}
          label="Overall ROAS"
          formatValue={(n) => `${n.toFixed(2)}x`}
          showChange={showROAS}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={3.8}
          change={0.4}
          label="Conversion Rate"
          formatValue={(n) => `${n.toFixed(1)}%`}
          showChange={true}
          valueSize={metricSize as any}
        />
      </MetricsBar>

      {/* Channel Performance */}
      <Grid columns={{ xs: '1fr', lg: '2fr 1fr' }} gap={gridGap}>
        <Panel title="Traffic by Channel Over Time">
          <BarChart
            chartData={channelTrendsChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            height="320px"
          />
        </Panel>

        <Panel title="Channel Distribution">
          <PieChart
            type="doughnut"
            chartData={channelPieData}
            height="320px"
          />
        </Panel>
      </Grid>

      {/* Campaign Performance Table */}
      <Panel title="Campaign Performance">
        <Column gap="3">
          <Grid columns="2fr 1fr 1fr 1fr 1fr" gap="3" padding="2" backgroundColor="2" borderRadius="2">
            <Text weight="bold" size="1">Campaign</Text>
            <Text weight="bold" size="1" align="right">Conversions</Text>
            <Text weight="bold" size="1" align="right">Spend</Text>
            <Text weight="bold" size="1" align="right">Revenue</Text>
            <Text weight="bold" size="1" align="right">ROAS</Text>
          </Grid>
          {campaignPerformance.map((campaign, idx) => (
            <Grid key={campaign.label} columns="2fr 1fr 1fr 1fr 1fr" gap="3" padding="2" hoverBackgroundColor="2" borderRadius="2">
              <Row alignItems="center" gap="2">
                <Box
                  width="8px"
                  height="8px"
                  borderRadius="4"
                  backgroundColor={[primaryColor, secondaryColor, warningColor, '#e34850', '#01bad7', '#f7bd12', '#6734bc'][idx]}
                />
                <Text size="1">{campaign.label}</Text>
              </Row>
              <Text size="1" align="right">{formatLongNumber(campaign.count)}</Text>
              <Text size="1" align="right">{formatCurrency(campaign.spend)}</Text>
              <Text size="1" align="right" weight="bold">{formatCurrency(campaign.revenue)}</Text>
              <Text
                size="1"
                align="right"
                weight="bold"
                style={{ color: campaign.roas > 4 ? '#44b556' : campaign.roas > 2 ? warningColor : '#e34850' }}
              >
                {campaign.roas.toFixed(2)}x
              </Text>
            </Grid>
          ))}
        </Column>
      </Panel>

      {/* UTM Sources & Landing Pages */}
      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={gridGap}>
        <Panel title="Top UTM Sources">
          <ListTable
            data={utmSourceData}
            title="utm_source"
            metric="Visitors"
          />
        </Panel>

        <Panel title="Landing Page Performance">
          <Column gap="2">
            <Grid columns="2fr 1fr 1fr" gap="3" padding="2" backgroundColor="2" borderRadius="2">
              <Text weight="bold" size="1">Page</Text>
              <Text weight="bold" size="1" align="right">Visitors</Text>
              <Text weight="bold" size="1" align="right">Conv. Rate</Text>
            </Grid>
            {landingPageData.map((page) => (
              <Grid key={page.label} columns="2fr 1fr 1fr" gap="3" padding="2" hoverBackgroundColor="2" borderRadius="2">
                <Text size="1" truncate>{page.label}</Text>
                <Text size="1" align="right">{formatLongNumber(page.count)}</Text>
                <Text
                  size="1"
                  align="right"
                  weight="bold"
                  style={{ color: page.conversionRate > 5 ? '#44b556' : page.conversionRate > 3 ? warningColor : '#e34850' }}
                >
                  {page.conversionRate.toFixed(1)}%
                </Text>
              </Grid>
            ))}
          </Column>
        </Panel>
      </Grid>

      {/* Attribution Model Insights */}
      <Grid columns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap={gridGap}>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">First Touch</Text>
            <Text size="4" weight="bold">Organic Search</Text>
            <Text size="0" color="muted">35% of conversions</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">Last Touch</Text>
            <Text size="4" weight="bold">Paid Search</Text>
            <Text size="0" color="muted">28% of conversions</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">Best Performer</Text>
            <Text size="4" weight="bold" style={{ color: '#44b556' }}>Email</Text>
            <Text size="0" color="muted">17.53x ROAS</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">Needs Review</Text>
            <Text size="4" weight="bold" style={{ color: warningColor }}>Brand Awareness</Text>
            <Text size="0" color="muted">2.40x ROAS</Text>
          </Column>
        </Panel>
      </Grid>
    </Column>
  );
}

export default function MarketingAttributionDashboard() {
  return (
    <DialsProvider projectId="marketing-attribution">
      <MarketingAttributionDashboardContent />
      <DialsOverlay position="bottom-left" />
    </DialsProvider>
  );
}
