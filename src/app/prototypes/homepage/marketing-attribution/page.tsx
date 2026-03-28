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
  Share2,
  Search,
  Mail,
  Megaphone,
  Globe,
  TrendingUp,
  DollarSign,
  ExternalLink,
} from '@/components/icons';

// Generate time series data for the past 30 days
function generateTimeSeriesData(baseValue: number, variance: number, days: number = 30) {
  const now = new Date();
  const data: { x: string; y: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.65 : 1;
    const trendFactor = 1 + (days - i) * 0.008;
    const randomFactor = 0.75 + Math.random() * 0.5;
    const value = Math.round(baseValue * weekendFactor * trendFactor * randomFactor * variance);
    data.push({ x: dateStr, y: value });
  }

  return data;
}

// Traffic source distribution
const trafficSourceData = {
  labels: ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'],
  datasets: [
    {
      data: [34, 22, 18, 12, 9, 5],
      backgroundColor: [
        '#2680eb',
        '#9256d9',
        '#f15bb5',
        '#44b556',
        '#e68619',
        '#01bad7',
      ],
      borderWidth: 0,
    },
  ],
};

// Campaign performance data
const campaignData = {
  labels: ['Spring Launch', 'Product Update', 'Holiday Promo', 'Webinar Series', 'Partner Co-brand', 'Retargeting'],
  datasets: [
    {
      label: 'Conversions',
      data: [1847, 1523, 1289, 987, 756, 634],
      backgroundColor: 'rgba(38, 128, 235, 0.7)',
      borderColor: 'rgba(38, 128, 235, 1)',
      borderWidth: 1,
    },
  ],
};

// UTM source breakdown
const utmSourceData = {
  labels: ['google', 'facebook', 'linkedin', 'twitter', 'newsletter', 'partner'],
  datasets: [
    {
      label: 'Sessions',
      data: [45230, 23456, 18934, 12543, 9876, 7654],
      backgroundColor: 'rgba(146, 86, 217, 0.7)',
      borderColor: 'rgba(146, 86, 217, 1)',
      borderWidth: 1,
    },
  ],
};

// Top referrers data
const referrerData = [
  { domain: 'google.com', visits: 45230, conversions: 2847, convRate: 6.3 },
  { domain: 'facebook.com', visits: 23456, conversions: 1123, convRate: 4.8 },
  { domain: 'linkedin.com', visits: 18934, conversions: 1567, convRate: 8.3 },
  { domain: 'twitter.com', visits: 12543, conversions: 689, convRate: 5.5 },
  { domain: 'reddit.com', visits: 8765, conversions: 234, convRate: 2.7 },
  { domain: 'producthunt.com', visits: 6543, conversions: 567, convRate: 8.7 },
];

export default function MarketingAttributionPage() {
  // Dials for customization
  const primaryColor = useDynamicColor('ma-primary-color', {
    label: 'Primary Color',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#f15bb5'],
    group: 'Colors',
  });

  const accentColor = useDynamicColor('ma-accent-color', {
    label: 'Accent Color',
    default: '#44b556',
    options: ['#44b556', '#9256d9', '#2680eb', '#f15bb5', '#01bad7'],
    group: 'Colors',
  });

  const layoutVariant = useDynamicVariant('ma-layout', {
    label: 'Layout Style',
    default: 'balanced',
    options: ['balanced', 'charts-first', 'tables-first'] as const,
    group: 'Layout',
  });

  const cardSpacing = useDynamicSpacing('ma-card-spacing', {
    label: 'Card Spacing',
    default: '24px',
    options: ['16px', '20px', '24px', '32px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('ma-chart-height', {
    label: 'Chart Height',
    default: 280,
    min: 200,
    max: 450,
    step: 50,
    unit: 'px',
    group: 'Charts',
  });

  const showCampaignDetails = useDynamicBoolean('ma-show-campaigns', {
    label: 'Show Campaign Details',
    default: true,
    group: 'Features',
  });

  const showReferrerTable = useDynamicBoolean('ma-show-referrers', {
    label: 'Show Top Referrers',
    default: true,
    group: 'Features',
  });

  // Traffic over time data
  const trafficTimeData = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 29);

    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Organic Traffic',
          data: generateTimeSeriesData(3400, 1, 30),
          backgroundColor: `${primaryColor}99`,
          borderColor: primaryColor,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Paid Traffic',
          data: generateTimeSeriesData(2200, 1, 30),
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader
          title="Marketing Attribution"
          description="Track inbound sources, campaign performance, and conversion attribution"
        />

        {/* Key Attribution Metrics */}
        <MetricsBar>
          <MetricCard
            label="Total Sessions"
            value={127834}
            change={12456}
            showChange
          />
          <MetricCard
            label="Conversion Rate"
            value={4.82}
            change={0.34}
            showChange
            formatValue={(v) => `${v.toFixed(2)}%`}
          />
          <MetricCard
            label="Avg. CAC"
            value={47.50}
            change={-3.20}
            showChange
            reverseColors
            formatValue={(v) => formatCurrency(v)}
          />
          <MetricCard
            label="Marketing ROI"
            value={342}
            change={28}
            showChange
            formatValue={(v) => `${v}%`}
          />
        </MetricsBar>

        {/* Channel Performance Metrics */}
        <MetricsBar>
          <MetricCard
            label="Organic Traffic"
            value={43456}
            change={4230}
            showChange
          />
          <MetricCard
            label="Paid Conversions"
            value={2847}
            change={234}
            showChange
          />
          <MetricCard
            label="Email Click Rate"
            value={18.4}
            change={2.1}
            showChange
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
          <MetricCard
            label="Social Engagement"
            value={8934}
            change={-456}
            showChange
          />
        </MetricsBar>

        {/* Main Charts Section */}
        <Grid
          columns={layoutVariant === 'tables-first' ? '1fr' : { xs: '1fr', lg: '2fr 1fr' }}
          gap={gapValue as any}
        >
          {/* Traffic Over Time */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Traffic by Channel</Heading>
              <Text color="muted" size="1">Organic vs paid traffic trends over the last 30 days</Text>
            </Column>
            {dateRange && (
              <BarChart
                chartData={trafficTimeData}
                unit="day"
                minDate={dateRange.minDate}
                maxDate={dateRange.maxDate}
                height={`${chartHeight}px`}
                stacked
              />
            )}
          </Column>

          {/* Traffic Source Distribution */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Traffic Sources</Heading>
              <Text color="muted" size="1">Distribution by acquisition channel</Text>
            </Column>
            <PieChart
              chartData={trafficSourceData}
              type="doughnut"
              height={`${chartHeight}px`}
            />
          </Column>
        </Grid>

        {/* Campaign & UTM Section */}
        {showCampaignDetails && (
          <Grid
            columns={{ xs: '1fr', lg: '1fr 1fr' }}
            gap={gapValue as any}
          >
            {/* Campaign Performance */}
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="6"
              gap="4"
            >
              <Column gap="1">
                <Heading size="2">Campaign Performance</Heading>
                <Text color="muted" size="1">Conversions by active campaign</Text>
              </Column>
              {isClient && (
                <BarChart
                  chartData={campaignData}
                  XAxisType="category"
                  height={`${chartHeight}px`}
                />
              )}
            </Column>

            {/* UTM Source Breakdown */}
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="6"
              gap="4"
            >
              <Column gap="1">
                <Heading size="2">UTM Source Breakdown</Heading>
                <Text color="muted" size="1">Sessions by utm_source parameter</Text>
              </Column>
              {isClient && (
                <BarChart
                  chartData={utmSourceData}
                  XAxisType="category"
                  height={`${chartHeight}px`}
                />
              )}
            </Column>
          </Grid>
        )}

        {/* Top Referrers Table */}
        {showReferrerTable && (
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Top Referrers</Heading>
              <Text color="muted" size="1">Highest converting traffic sources</Text>
            </Column>
            <Column gap="2">
              {/* Table Header */}
              <Grid columns="2fr 1fr 1fr 1fr" gap="4" style={{ padding: '12px 16px', borderBottom: '1px solid var(--base-color-3)' }}>
                <Text weight="bold" size="1" color="muted">DOMAIN</Text>
                <Text weight="bold" size="1" color="muted">VISITS</Text>
                <Text weight="bold" size="1" color="muted">CONVERSIONS</Text>
                <Text weight="bold" size="1" color="muted">CONV. RATE</Text>
              </Grid>
              {/* Table Rows */}
              {referrerData.map((ref, index) => (
                <Grid
                  key={ref.domain}
                  columns="2fr 1fr 1fr 1fr"
                  gap="4"
                  style={{
                    padding: '12px 16px',
                    backgroundColor: index % 2 === 0 ? 'var(--base-color-1)' : 'transparent',
                    borderRadius: '4px',
                  }}
                >
                  <Row alignItems="center" gap="2">
                    <ExternalLink size={14} style={{ color: 'var(--font-color-muted)' }} />
                    <Text size="1">{ref.domain}</Text>
                  </Row>
                  <Text size="1">{ref.visits.toLocaleString()}</Text>
                  <Text size="1">{ref.conversions.toLocaleString()}</Text>
                  <Text size="1" style={{ color: ref.convRate > 6 ? 'var(--success-color)' : 'inherit' }}>
                    {ref.convRate.toFixed(1)}%
                  </Text>
                </Grid>
              ))}
            </Column>
          </Column>
        )}

        {/* Channel Attribution Cards */}
        <Column
          backgroundColor
          border
          borderRadius="3"
          padding="6"
          gap="4"
        >
          <Column gap="1">
            <Heading size="2">Channel Attribution</Heading>
            <Text color="muted" size="1">First-touch attribution by marketing channel</Text>
          </Column>
          <Grid columns={{ xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr 1fr 1fr' }} gap="4">
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Search size={16} style={{ color: primaryColor }} />
                <Text weight="bold" size="1">Organic Search</Text>
              </Row>
              <Text size="5" weight="bold">34%</Text>
              <Text color="muted" size="0">43,456 sessions</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <DollarSign size={16} style={{ color: accentColor }} />
                <Text weight="bold" size="1">Paid Search</Text>
              </Row>
              <Text size="5" weight="bold">22%</Text>
              <Text color="muted" size="0">28,123 sessions</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Share2 size={16} style={{ color: '#f15bb5' }} />
                <Text weight="bold" size="1">Social Media</Text>
              </Row>
              <Text size="5" weight="bold">18%</Text>
              <Text color="muted" size="0">23,010 sessions</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Mail size={16} style={{ color: '#44b556' }} />
                <Text weight="bold" size="1">Email</Text>
              </Row>
              <Text size="5" weight="bold">12%</Text>
              <Text color="muted" size="0">15,340 sessions</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Globe size={16} style={{ color: '#e68619' }} />
                <Text weight="bold" size="1">Direct</Text>
              </Row>
              <Text size="5" weight="bold">9%</Text>
              <Text color="muted" size="0">11,505 sessions</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Megaphone size={16} style={{ color: '#01bad7' }} />
                <Text weight="bold" size="1">Referral</Text>
              </Row>
              <Text size="5" weight="bold">5%</Text>
              <Text color="muted" size="0">6,400 sessions</Text>
            </Column>
          </Grid>
        </Column>
      </Column>
    </PageBody>
  );
}
