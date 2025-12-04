'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';

// Chart colors for channels
const CHANNEL_COLORS = {
  organic: CHART_COLORS[0],    // #2680eb
  paid: CHART_COLORS[3],       // #e68619
  social: CHART_COLORS[1],     // #9256d9
  direct: CHART_COLORS[2],     // #44b556
  referral: CHART_COLORS[6],   // #01bad7
  email: CHART_COLORS[4],      // #e34850
};

// Generate dates for the last 30 days starting from Nov 2024
function generateDates(days: number = 30): string[] {
  const dates: string[] = [];
  const startDate = new Date(2024, 10, 5); // Nov 5, 2024
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// Generate realistic traffic data with weekly patterns
function generateTrafficData(dates: string[], channel: string, baseVolume: number, variance: number) {
  return dates.map((date) => {
    const dayOfWeek = new Date(date).getDay();
    // Higher traffic on weekdays, lower on weekends
    const weekdayMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1.1;
    // Random variance
    const randomFactor = 0.8 + Math.random() * variance;
    const value = Math.round(baseVolume * weekdayMultiplier * randomFactor);
    return { x: date, y: value, d: date };
  });
}

export default function MarketingAttributionPage() {
  // === DIALS: Layout & Spacing ===
  const sectionGap = useDynamicSpacing('ma-section-gap', {
    label: 'Section Gap',
    group: 'Layout',
    default: '24px',
    options: ['16px', '24px', '32px', '40px'],
  });

  const panelPadding = useDynamicSpacing('ma-panel-padding', {
    label: 'Panel Padding',
    group: 'Layout',
    default: '24px',
    options: ['16px', '20px', '24px', '32px'],
  });

  const metricsColumns = useDynamicVariant('ma-metrics-columns', {
    label: 'Metrics Columns',
    group: 'Layout',
    default: '6',
    options: ['4', '5', '6'] as const,
  });

  // === DIALS: Typography ===
  const metricValueSize = useDynamicVariant('ma-metric-value-size', {
    label: 'Metric Value Size',
    group: 'Typography',
    default: '7',
    options: ['6', '7', '8'] as const,
  });

  const headingSize = useDynamicVariant('ma-heading-size', {
    label: 'Heading Size',
    group: 'Typography',
    default: '2',
    options: ['1', '2', '3'] as const,
  });

  // === DIALS: Colors ===
  const organicColor = useDynamicColor('ma-organic-color', {
    label: 'Organic Channel Color',
    group: 'Channel Colors',
    default: CHART_COLORS[0],
    options: [CHART_COLORS[0], '#3e63dd', '#0090ff', '#12a594'],
    allowCustom: true,
  });

  const paidColor = useDynamicColor('ma-paid-color', {
    label: 'Paid Channel Color',
    group: 'Channel Colors',
    default: CHART_COLORS[3],
    options: [CHART_COLORS[3], '#f76b15', '#ffc53d', '#e5484d'],
    allowCustom: true,
  });

  const socialColor = useDynamicColor('ma-social-color', {
    label: 'Social Channel Color',
    group: 'Channel Colors',
    default: CHART_COLORS[1],
    options: [CHART_COLORS[1], '#8e4ec6', '#6e56cf', '#d6409f'],
    allowCustom: true,
  });

  // === DIALS: Visualization ===
  const chartHeight = useDynamicNumber('ma-chart-height', {
    label: 'Main Chart Height',
    group: 'Visualization',
    default: 320,
    min: 240,
    max: 480,
    step: 40,
    unit: 'px',
  });

  const pieChartType = useDynamicVariant('ma-pie-chart-type', {
    label: 'Distribution Chart Style',
    group: 'Visualization',
    default: 'doughnut',
    options: ['pie', 'doughnut'] as const,
  });

  const showConversionChart = useDynamicBoolean('ma-show-conversion', {
    label: 'Show Conversion Chart',
    group: 'Features',
    default: true,
  });

  const showCampaignDetails = useDynamicBoolean('ma-show-campaign-details', {
    label: 'Show Campaign Details',
    group: 'Features',
    default: true,
  });

  const tableItemCount = useDynamicNumber('ma-table-items', {
    label: 'Table Items',
    group: 'Visualization',
    default: 8,
    min: 5,
    max: 12,
    step: 1,
  });

  const dates = useMemo(() => generateDates(30), []);
  const minDate = useMemo(() => new Date(dates[0]), [dates]);
  const maxDate = useMemo(() => new Date(dates[dates.length - 1]), [dates]);

  // Traffic by source stacked bar chart data
  const trafficBySourceData = useMemo(() => {
    return {
      __id: Date.now(),
      datasets: [
        {
          type: 'bar' as const,
          label: 'Organic',
          data: generateTrafficData(dates, 'organic', 2800, 0.4),
          backgroundColor: CHANNEL_COLORS.organic,
          borderColor: CHANNEL_COLORS.organic,
          borderWidth: 0,
        },
        {
          type: 'bar' as const,
          label: 'Paid',
          data: generateTrafficData(dates, 'paid', 1900, 0.5),
          backgroundColor: CHANNEL_COLORS.paid,
          borderColor: CHANNEL_COLORS.paid,
          borderWidth: 0,
        },
        {
          type: 'bar' as const,
          label: 'Social',
          data: generateTrafficData(dates, 'social', 1200, 0.6),
          backgroundColor: CHANNEL_COLORS.social,
          borderColor: CHANNEL_COLORS.social,
          borderWidth: 0,
        },
        {
          type: 'bar' as const,
          label: 'Direct',
          data: generateTrafficData(dates, 'direct', 950, 0.35),
          backgroundColor: CHANNEL_COLORS.direct,
          borderColor: CHANNEL_COLORS.direct,
          borderWidth: 0,
        },
        {
          type: 'bar' as const,
          label: 'Referral',
          data: generateTrafficData(dates, 'referral', 680, 0.45),
          backgroundColor: CHANNEL_COLORS.referral,
          borderColor: CHANNEL_COLORS.referral,
          borderWidth: 0,
        },
        {
          type: 'bar' as const,
          label: 'Email',
          data: generateTrafficData(dates, 'email', 520, 0.55),
          backgroundColor: CHANNEL_COLORS.email,
          borderColor: CHANNEL_COLORS.email,
          borderWidth: 0,
        },
      ],
    };
  }, [dates]);

  // Channel distribution pie chart data
  const channelDistributionData = useMemo(() => ({
    labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Direct', 'Referral', 'Email'],
    datasets: [{
      label: 'Sessions',
      data: [84200, 57000, 36100, 28500, 20400, 15600],
      backgroundColor: [
        CHANNEL_COLORS.organic,
        CHANNEL_COLORS.paid,
        CHANNEL_COLORS.social,
        CHANNEL_COLORS.direct,
        CHANNEL_COLORS.referral,
        CHANNEL_COLORS.email,
      ],
      borderColor: 'transparent',
      borderWidth: 0,
    }],
  }), []);

  // Top campaigns data
  const campaignsData = useMemo(() => [
    { label: 'Black Friday Sale 2024', count: 14580, percent: 25.6 },
    { label: 'Holiday Gift Guide', count: 9240, percent: 16.2 },
    { label: 'Product Launch - Pro Edition', count: 7890, percent: 13.8 },
    { label: 'Fall Clearance Event', count: 6420, percent: 11.3 },
    { label: 'Newsletter Exclusive Deals', count: 5180, percent: 9.1 },
    { label: 'Retargeting - Cart Abandonment', count: 4350, percent: 7.6 },
    { label: 'Brand Awareness Q4', count: 3890, percent: 6.8 },
    { label: 'Influencer Collab - TechReview', count: 2960, percent: 5.2 },
  ], []);

  // Top referrers data
  const referrersData = useMemo(() => [
    { label: 'google.com', count: 78450, percent: 32.4 },
    { label: 'facebook.com', count: 24680, percent: 10.2 },
    { label: 'linkedin.com', count: 18920, percent: 7.8 },
    { label: 't.co (Twitter/X)', count: 12340, percent: 5.1 },
    { label: 'reddit.com', count: 9870, percent: 4.1 },
    { label: 'bing.com', count: 8540, percent: 3.5 },
    { label: 'instagram.com', count: 7280, percent: 3.0 },
    { label: 'producthunt.com', count: 5620, percent: 2.3 },
  ], []);

  // UTM campaigns breakdown
  const utmCampaignsData = useMemo(() => [
    { label: 'utm_source=google / utm_medium=cpc', count: 28940, percent: 22.1 },
    { label: 'utm_source=facebook / utm_medium=paid_social', count: 18720, percent: 14.3 },
    { label: 'utm_source=newsletter / utm_medium=email', count: 15600, percent: 11.9 },
    { label: 'utm_source=linkedin / utm_medium=sponsored', count: 12450, percent: 9.5 },
    { label: 'utm_source=twitter / utm_medium=organic', count: 8920, percent: 6.8 },
    { label: 'utm_source=bing / utm_medium=cpc', count: 6840, percent: 5.2 },
    { label: 'utm_source=affiliate / utm_medium=referral', count: 5280, percent: 4.0 },
  ], []);

  // Conversion rates by channel
  const conversionByChannelData = useMemo(() => ({
    __id: Date.now() + 1,
    datasets: [{
      type: 'bar' as const,
      label: 'Conversion Rate %',
      data: [
        { x: 'Email', y: 4.8, d: 'Email' },
        { x: 'Organic', y: 3.2, d: 'Organic' },
        { x: 'Paid', y: 2.9, d: 'Paid' },
        { x: 'Direct', y: 2.6, d: 'Direct' },
        { x: 'Referral', y: 2.1, d: 'Referral' },
        { x: 'Social', y: 1.4, d: 'Social' },
      ],
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
      borderWidth: 0,
    }],
  }), []);

  // Attribution model comparison
  const attributionModelData = useMemo(() => [
    { label: 'First Touch - Google Ads', count: 892, percent: 28.4 },
    { label: 'First Touch - Organic Search', count: 684, percent: 21.8 },
    { label: 'Last Touch - Direct', count: 542, percent: 17.3 },
    { label: 'Last Touch - Email', count: 428, percent: 13.6 },
    { label: 'Multi-Touch - Social Assist', count: 356, percent: 11.3 },
    { label: 'Multi-Touch - Retargeting', count: 238, percent: 7.6 },
  ], []);

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader
          title="Marketing Attribution"
          description="Track traffic sources, campaign performance, and conversion attribution across all marketing channels"
        />

        {/* Key Metrics Row */}
        <MetricsBar>
          <MetricCard
            label="Total Sessions"
            value={241800}
            change={218500}
            showChange
            formatValue={formatLongNumber}
          />
          <MetricCard
            label="Unique Visitors"
            value={186420}
            change={172800}
            showChange
            formatValue={formatLongNumber}
          />
          <MetricCard
            label="Conversions"
            value={3140}
            change={2890}
            showChange
            formatValue={formatLongNumber}
          />
          <MetricCard
            label="Conversion Rate"
            value={2.68}
            change={2.42}
            showChange
            formatValue={(n) => `${n.toFixed(2)}%`}
          />
          <MetricCard
            label="Avg. CPA"
            value={24.80}
            change={28.50}
            showChange
            reverseColors
            formatValue={(n) => `$${n.toFixed(2)}`}
          />
          <MetricCard
            label="Campaign ROI"
            value={340}
            change={295}
            showChange
            formatValue={(n) => `${n}%`}
          />
        </MetricsBar>

        {/* Traffic by Source Over Time */}
        <Panel title="Traffic by Source">
          <BarChart
            chartData={trafficBySourceData}
            unit="day"
            stacked={true}
            minDate={minDate}
            maxDate={maxDate}
            height={320}
          />
          <Row gap="4" justifyContent="center" style={{ marginTop: '12px' }}>
            {Object.entries(CHANNEL_COLORS).map(([channel, color]) => (
              <Row key={channel} gap="2" alignItems="center">
                <div style={{ width: 12, height: 12, backgroundColor: color, borderRadius: 2 }} />
                <Text size="1" style={{ textTransform: 'capitalize' }}>{channel}</Text>
              </Row>
            ))}
          </Row>
        </Panel>

        {/* Channel Distribution and Conversion Rates */}
        <GridRow layout="two">
          <Panel title="Channel Distribution">
            <Column alignItems="center">
              <div style={{ width: '280px', height: '280px' }}>
                <PieChart
                  chartData={channelDistributionData}
                  type="doughnut"
                />
              </div>
            </Column>
            <Grid columns="2" gap="3" style={{ marginTop: '16px' }}>
              {channelDistributionData.labels.map((label, idx) => (
                <Row key={label} gap="2" alignItems="center" justifyContent="space-between">
                  <Row gap="2" alignItems="center">
                    <div style={{
                      width: 10,
                      height: 10,
                      backgroundColor: channelDistributionData.datasets[0].backgroundColor[idx],
                      borderRadius: 2
                    }} />
                    <Text size="1">{label}</Text>
                  </Row>
                  <Text size="1" weight="semibold">
                    {formatLongNumber(channelDistributionData.datasets[0].data[idx])}
                  </Text>
                </Row>
              ))}
            </Grid>
          </Panel>

          <Panel title="Conversion Rate by Channel">
            <BarChart
              chartData={conversionByChannelData}
              XAxisType="category"
              height={280}
            />
            <Column gap="2" style={{ marginTop: '16px' }}>
              <Row justifyContent="space-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--base300)' }}>
                <Text size="1" weight="semibold">Channel</Text>
                <Row gap="6">
                  <Text size="1" weight="semibold" style={{ width: '80px', textAlign: 'right' }}>Conv. Rate</Text>
                  <Text size="1" weight="semibold" style={{ width: '80px', textAlign: 'right' }}>Conversions</Text>
                </Row>
              </Row>
              {[
                { channel: 'Email', rate: '4.8%', conversions: 749 },
                { channel: 'Organic', rate: '3.2%', conversions: 1012 },
                { channel: 'Paid', rate: '2.9%', conversions: 684 },
                { channel: 'Direct', rate: '2.6%', conversions: 396 },
                { channel: 'Referral', rate: '2.1%', conversions: 186 },
                { channel: 'Social', rate: '1.4%', conversions: 113 },
              ].map((row) => (
                <Row key={row.channel} justifyContent="space-between" style={{ padding: '4px 0' }}>
                  <Text size="1">{row.channel}</Text>
                  <Row gap="6">
                    <Text size="1" weight="medium" style={{ width: '80px', textAlign: 'right' }}>{row.rate}</Text>
                    <Text size="1" style={{ width: '80px', textAlign: 'right' }}>{row.conversions}</Text>
                  </Row>
                </Row>
              ))}
            </Column>
          </Panel>
        </GridRow>

        {/* Campaign Performance and Referrers */}
        <GridRow layout="two">
          <Panel title="Top Campaigns">
            <ListTable
              data={campaignsData}
              title="Campaign"
              metric="Sessions"
              showPercentage={true}
              itemCount={8}
            />
          </Panel>

          <Panel title="Top Referrers">
            <ListTable
              data={referrersData}
              title="Source"
              metric="Sessions"
              showPercentage={true}
              itemCount={8}
            />
          </Panel>
        </GridRow>

        {/* UTM Tracking and Attribution Models */}
        <GridRow layout="two">
          <Panel title="UTM Campaign Breakdown">
            <ListTable
              data={utmCampaignsData}
              title="UTM Parameters"
              metric="Sessions"
              showPercentage={true}
              itemCount={7}
            />
            <Column gap="3" style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--base100)', borderRadius: '6px' }}>
              <Heading size="1">UTM Summary</Heading>
              <Grid columns="2" gap="4">
                <Column gap="1">
                  <Text size="1" color="muted">Total Tagged Sessions</Text>
                  <Text size="3" weight="bold">130,850</Text>
                </Column>
                <Column gap="1">
                  <Text size="1" color="muted">Tagged Coverage</Text>
                  <Text size="3" weight="bold">54.1%</Text>
                </Column>
                <Column gap="1">
                  <Text size="1" color="muted">Active Campaigns</Text>
                  <Text size="3" weight="bold">24</Text>
                </Column>
                <Column gap="1">
                  <Text size="1" color="muted">Unique Sources</Text>
                  <Text size="3" weight="bold">12</Text>
                </Column>
              </Grid>
            </Column>
          </Panel>

          <Panel title="Attribution Model Analysis">
            <ListTable
              data={attributionModelData}
              title="Attribution Type"
              metric="Conversions"
              showPercentage={true}
              itemCount={6}
            />
            <Column gap="3" style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--base100)', borderRadius: '6px' }}>
              <Heading size="1">Assisted Conversions</Heading>
              <Row gap="6" justifyContent="space-between">
                <Column gap="1">
                  <Text size="1" color="muted">Social Assists</Text>
                  <Text size="3" weight="bold">1,284</Text>
                </Column>
                <Column gap="1">
                  <Text size="1" color="muted">Email Assists</Text>
                  <Text size="3" weight="bold">896</Text>
                </Column>
                <Column gap="1">
                  <Text size="1" color="muted">Paid Assists</Text>
                  <Text size="3" weight="bold">642</Text>
                </Column>
              </Row>
              <Text size="1" color="muted" style={{ marginTop: '8px' }}>
                Multi-touch attribution shows that 68% of conversions involve 2+ channels in the customer journey.
              </Text>
            </Column>
          </Panel>
        </GridRow>

        {/* Campaign Performance Metrics Table */}
        <Panel title="Campaign Performance Details">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--base300)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>Campaign</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Impressions</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Clicks</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>CTR</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Conversions</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Conv. Rate</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Cost</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>CPA</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>ROAS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Black Friday Sale 2024', impressions: 2840000, clicks: 14580, ctr: 0.51, conversions: 892, convRate: 6.12, cost: 18420, cpa: 20.65, roas: 4.2 },
                  { name: 'Holiday Gift Guide', impressions: 1920000, clicks: 9240, ctr: 0.48, conversions: 524, convRate: 5.67, cost: 12840, cpa: 24.50, roas: 3.6 },
                  { name: 'Product Launch - Pro', impressions: 1680000, clicks: 7890, ctr: 0.47, conversions: 398, convRate: 5.04, cost: 15200, cpa: 38.19, roas: 2.8 },
                  { name: 'Fall Clearance Event', impressions: 1420000, clicks: 6420, ctr: 0.45, conversions: 342, convRate: 5.33, cost: 8640, cpa: 25.26, roas: 3.4 },
                  { name: 'Newsletter Exclusives', impressions: 480000, clicks: 5180, ctr: 1.08, conversions: 428, convRate: 8.26, cost: 2400, cpa: 5.61, roas: 8.2 },
                  { name: 'Retargeting - Cart', impressions: 890000, clicks: 4350, ctr: 0.49, conversions: 286, convRate: 6.57, cost: 6520, cpa: 22.80, roas: 4.8 },
                  { name: 'Brand Awareness Q4', impressions: 3240000, clicks: 3890, ctr: 0.12, conversions: 124, convRate: 3.19, cost: 24600, cpa: 198.39, roas: 0.4 },
                  { name: 'Influencer - TechReview', impressions: 1560000, clicks: 2960, ctr: 0.19, conversions: 146, convRate: 4.93, cost: 8500, cpa: 58.22, roas: 1.8 },
                ].map((campaign, idx) => (
                  <tr key={campaign.name} style={{ borderBottom: '1px solid var(--base200)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--base50)' }}>
                    <td style={{ padding: '10px 8px', fontWeight: 500 }}>{campaign.name}</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px' }}>{formatLongNumber(campaign.impressions)}</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px' }}>{formatLongNumber(campaign.clicks)}</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px' }}>{campaign.ctr.toFixed(2)}%</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px' }}>{campaign.conversions}</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px' }}>{campaign.convRate.toFixed(2)}%</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px' }}>${formatLongNumber(campaign.cost)}</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px' }}>${campaign.cpa.toFixed(2)}</td>
                    <td style={{ textAlign: 'right', padding: '10px 8px', color: campaign.roas >= 3 ? 'var(--color-green500)' : campaign.roas >= 1 ? 'var(--color-yellow600)' : 'var(--color-red500)', fontWeight: 600 }}>
                      {campaign.roas.toFixed(1)}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Footer Insights */}
        <Panel>
          <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="6">
            <Column gap="2" style={{ padding: '16px', backgroundColor: 'var(--base100)', borderRadius: '8px' }}>
              <Text size="2" weight="bold" style={{ color: CHART_COLORS[2] }}>Top Insight</Text>
              <Text size="1">
                Email campaigns deliver the highest conversion rate at 4.8%, generating 749 conversions with the lowest CPA of $5.61.
              </Text>
            </Column>
            <Column gap="2" style={{ padding: '16px', backgroundColor: 'var(--base100)', borderRadius: '8px' }}>
              <Text size="2" weight="bold" style={{ color: CHART_COLORS[3] }}>Optimization Opportunity</Text>
              <Text size="1">
                Brand Awareness campaigns show low ROAS (0.4x). Consider reallocating budget to Newsletter and Retargeting campaigns.
              </Text>
            </Column>
            <Column gap="2" style={{ padding: '16px', backgroundColor: 'var(--base100)', borderRadius: '8px' }}>
              <Text size="2" weight="bold" style={{ color: CHART_COLORS[0] }}>Trending</Text>
              <Text size="1">
                Social media traffic increased 23% week-over-week, driven by the Holiday Gift Guide campaign on Instagram and TikTok.
              </Text>
            </Column>
          </Grid>
        </Panel>
      </Column>
    </PageBody>
  );
}
