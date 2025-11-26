'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Heading, Text, Box, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatLongNumber } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicBoolean,
  useDynamicNumber,
  useDynamicSpacing,
} from '@niteshift/dials';

// Generate realistic dates for the past 30 days
function generateDates(days: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
}

// Generate campaign performance data
function generateCampaignData(dates: Date[]) {
  return dates.map((date) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseOrganic = isWeekend ? 3200 : 4800;
    const basePaid = isWeekend ? 1800 : 3200;
    const baseSocial = isWeekend ? 2400 : 1600;
    const baseEmail = isWeekend ? 800 : 1400;
    const variance = Math.random() * 0.25 - 0.125;

    return {
      date: date.toISOString(),
      organic: Math.round(baseOrganic * (1 + variance)),
      paid: Math.round(basePaid * (1 + variance)),
      social: Math.round(baseSocial * (1 + variance * 1.5)),
      email: Math.round(baseEmail * (1 + variance)),
    };
  });
}

// Channel attribution data with realistic marketing metrics
const channelAttributionData = [
  {
    channel: 'Organic Search',
    visitors: 142500,
    conversions: 4275,
    revenue: 285000,
    cpa: 0,
    conversionRate: 3.0,
    icon: 'search'
  },
  {
    channel: 'Google Ads',
    visitors: 89200,
    conversions: 3568,
    revenue: 214080,
    cpa: 42.50,
    conversionRate: 4.0,
    icon: 'ad'
  },
  {
    channel: 'Facebook Ads',
    visitors: 67800,
    conversions: 2034,
    revenue: 101700,
    cpa: 38.20,
    conversionRate: 3.0,
    icon: 'social'
  },
  {
    channel: 'Email Marketing',
    visitors: 34500,
    conversions: 2415,
    revenue: 168000,
    cpa: 8.50,
    conversionRate: 7.0,
    icon: 'email'
  },
  {
    channel: 'Direct',
    visitors: 52300,
    conversions: 1569,
    revenue: 94140,
    cpa: 0,
    conversionRate: 3.0,
    icon: 'direct'
  },
  {
    channel: 'Referral',
    visitors: 28900,
    conversions: 1156,
    revenue: 63580,
    cpa: 0,
    conversionRate: 4.0,
    icon: 'referral'
  },
];

// Active campaign performance
const activeCampaigns = [
  {
    name: 'Black Friday Early Access',
    status: 'active',
    spend: 12500,
    impressions: 1250000,
    clicks: 37500,
    conversions: 1875,
    ctr: 3.0,
    roas: 4.2
  },
  {
    name: 'Holiday Gift Guide 2024',
    status: 'active',
    spend: 8900,
    impressions: 890000,
    clicks: 26700,
    conversions: 1068,
    ctr: 3.0,
    roas: 3.8
  },
  {
    name: 'Q4 Retargeting',
    status: 'active',
    spend: 6200,
    impressions: 450000,
    clicks: 18000,
    conversions: 1080,
    ctr: 4.0,
    roas: 5.2
  },
  {
    name: 'Brand Awareness - LinkedIn',
    status: 'paused',
    spend: 4500,
    impressions: 680000,
    clicks: 8160,
    conversions: 245,
    ctr: 1.2,
    roas: 1.8
  },
  {
    name: 'Newsletter Signup',
    status: 'active',
    spend: 2800,
    impressions: 320000,
    clicks: 12800,
    conversions: 1920,
    ctr: 4.0,
    roas: 6.1
  },
];

// UTM breakdown data
const utmSourceData = [
  { source: 'google', visitors: 186400, conversions: 7456 },
  { source: 'facebook', visitors: 72800, conversions: 2184 },
  { source: 'newsletter', visitors: 34500, conversions: 2415 },
  { source: 'twitter', visitors: 18200, conversions: 364 },
  { source: 'linkedin', visitors: 15600, conversions: 624 },
  { source: 'instagram', visitors: 12400, conversions: 496 },
];

const utmMediumData = [
  { medium: 'cpc', value: 42 },
  { medium: 'organic', value: 28 },
  { medium: 'email', value: 15 },
  { medium: 'social', value: 10 },
  { medium: 'referral', value: 5 },
];

// Landing page performance
const landingPages = [
  { path: '/promo/black-friday', visitors: 45200, bounceRate: 28, conversions: 2260 },
  { path: '/products/bestsellers', visitors: 38400, bounceRate: 32, conversions: 1536 },
  { path: '/collections/holiday', visitors: 29800, bounceRate: 35, conversions: 894 },
  { path: '/', visitors: 24500, bounceRate: 42, conversions: 490 },
  { path: '/sale', visitors: 18900, bounceRate: 30, conversions: 756 },
];

export default function MarketingAttributionPage() {
  // Layout dials
  const layoutStyle = useDynamicVariant('ma-layout-style', {
    label: 'Layout Style',
    description: 'Overall layout arrangement',
    default: 'standard',
    options: ['standard', 'compact', 'wide'] as const,
    group: 'Layout',
  });

  const showCampaigns = useDynamicBoolean('ma-show-campaigns', {
    label: 'Show Campaigns',
    description: 'Display active campaigns table',
    default: true,
    group: 'Sections',
  });

  const showLandingPages = useDynamicBoolean('ma-show-landing-pages', {
    label: 'Show Landing Pages',
    description: 'Display landing page performance',
    default: true,
    group: 'Sections',
  });

  const showUtmBreakdown = useDynamicBoolean('ma-show-utm', {
    label: 'Show UTM Breakdown',
    description: 'Display UTM parameter analysis',
    default: true,
    group: 'Sections',
  });

  // Color dials
  const organicColor = useDynamicColor('ma-organic-color', {
    label: 'Organic Traffic Color',
    description: 'Color for organic traffic',
    default: '#44b556',
    options: ['#44b556', '#30a46c', '#3e63dd', '#2680eb'],
    allowCustom: true,
    group: 'Colors',
  });

  const paidColor = useDynamicColor('ma-paid-color', {
    label: 'Paid Traffic Color',
    description: 'Color for paid traffic',
    default: '#2680eb',
    options: ['#2680eb', '#3e63dd', '#9256d9', '#6734bc'],
    allowCustom: true,
    group: 'Colors',
  });

  const socialColor = useDynamicColor('ma-social-color', {
    label: 'Social Traffic Color',
    description: 'Color for social traffic',
    default: '#9256d9',
    options: ['#9256d9', '#ec1562', '#e34850', '#6734bc'],
    allowCustom: true,
    group: 'Colors',
  });

  const emailColor = useDynamicColor('ma-email-color', {
    label: 'Email Traffic Color',
    description: 'Color for email traffic',
    default: '#e68619',
    options: ['#e68619', '#f7bd12', '#ffc301', '#e34850'],
    allowCustom: true,
    group: 'Colors',
  });

  // Typography dials
  const headingSize = useDynamicVariant('ma-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '4',
    options: ['3', '4', '5'] as const,
    group: 'Typography',
  });

  const metricValueSize = useDynamicVariant('ma-metric-value-size', {
    label: 'Metric Value Size',
    description: 'Size of metric values',
    default: '8',
    options: ['6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  // Spacing dials
  const sectionGap = useDynamicSpacing('ma-section-gap', {
    label: 'Section Gap',
    description: 'Space between sections',
    default: '24px',
    options: ['16px', '24px', '32px', '40px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('ma-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts',
    default: 350,
    min: 250,
    max: 500,
    step: 50,
    unit: 'px',
    group: 'Visualization',
  });

  // Generate chart data
  const dates = useMemo(() => generateDates(30), []);
  const campaignData = useMemo(() => generateCampaignData(dates), [dates]);

  const trafficSourceChartData = useMemo(() => {
    return {
      labels: campaignData.map((d) => d.date),
      datasets: [
        {
          label: 'Organic',
          data: campaignData.map((d) => ({ x: d.date, y: d.organic })),
          backgroundColor: organicColor,
          borderColor: organicColor,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 4,
        },
        {
          label: 'Paid',
          data: campaignData.map((d) => ({ x: d.date, y: d.paid })),
          backgroundColor: paidColor,
          borderColor: paidColor,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 3,
        },
        {
          label: 'Social',
          data: campaignData.map((d) => ({ x: d.date, y: d.social })),
          backgroundColor: socialColor,
          borderColor: socialColor,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 2,
        },
        {
          label: 'Email',
          data: campaignData.map((d) => ({ x: d.date, y: d.email })),
          backgroundColor: emailColor,
          borderColor: emailColor,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 1,
        },
      ],
    };
  }, [campaignData, organicColor, paidColor, socialColor, emailColor]);

  const utmMediumChartData = useMemo(() => {
    return {
      labels: utmMediumData.map((d) => d.medium),
      datasets: [
        {
          data: utmMediumData.map((d) => d.value),
          backgroundColor: [paidColor, organicColor, emailColor, socialColor, '#01bad7'],
          borderWidth: 0,
        },
      ],
    };
  }, [organicColor, paidColor, socialColor, emailColor]);

  // Calculate summary metrics
  const totalVisitors = channelAttributionData.reduce((sum, c) => sum + c.visitors, 0);
  const totalConversions = channelAttributionData.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = channelAttributionData.reduce((sum, c) => sum + c.revenue, 0);
  const avgConversionRate = (totalConversions / totalVisitors * 100);
  const totalAdSpend = activeCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const blendedRoas = totalRevenue / totalAdSpend;

  const gapStyle = { gap: sectionGap };

  return (
    <Column style={gapStyle} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="6">Marketing Attribution</Heading>
          <Text color="muted">Track inbound sources and campaign performance</Text>
        </Column>
        <Text color="muted" size="1">Last 30 days</Text>
      </Row>

      {/* Key Metrics Bar */}
      <MetricsBar>
        <MetricCard
          label="Total Visitors"
          value={totalVisitors}
          change={totalVisitors * 0.91}
          formatValue={formatLongNumber}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Conversions"
          value={totalConversions}
          change={totalConversions * 0.87}
          formatValue={formatLongNumber}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Conversion Rate"
          value={avgConversionRate}
          change={3.2}
          formatValue={(v) => `${v.toFixed(1)}%`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Ad Spend"
          value={totalAdSpend}
          change={totalAdSpend * 0.95}
          formatValue={(v) => `$${formatLongNumber(v)}`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Blended ROAS"
          value={blendedRoas}
          change={3.8}
          formatValue={(v) => `${v.toFixed(1)}x`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
      </MetricsBar>

      {/* Traffic Sources Chart */}
      <Panel>
        <Heading size={headingSize as any}>Traffic by Source</Heading>
        <Box height={`${chartHeight}px`}>
          <BarChart
            chartData={trafficSourceChartData}
            unit="day"
            stacked={true}
            minDate={dates[0]}
            maxDate={dates[dates.length - 1]}
            height={`${chartHeight}px`}
          />
        </Box>
      </Panel>

      {/* Channel Attribution Table */}
      <Panel>
        <Heading size={headingSize as any}>Channel Attribution</Heading>
        <Box style={{ overflowX: 'auto' }}>
          <Box style={{ minWidth: '800px' }}>
            <Row
              gap="4"
              paddingY="3"
              style={{ borderBottom: '1px solid #e5e5e5' }}
            >
              <Text size="1" weight="bold" style={{ flex: 2 }}>Channel</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Visitors</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Conversions</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Conv. Rate</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Revenue</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>CPA</Text>
            </Row>
            {channelAttributionData.map((channel, index) => (
              <Row
                key={channel.channel}
                gap="4"
                paddingY="3"
                style={{ borderBottom: '1px solid #f0f0f0' }}
                alignItems="center"
              >
                <Row style={{ flex: 2 }} gap="2" alignItems="center">
                  <Box
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: CHART_COLORS[index]
                    }}
                  />
                  <Text size="2">{channel.channel}</Text>
                </Row>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(channel.visitors)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(channel.conversions)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{channel.conversionRate.toFixed(1)}%</Text>
                <Text size="2" weight="medium" style={{ flex: 1, textAlign: 'right' }}>${formatLongNumber(channel.revenue)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {channel.cpa > 0 ? `$${channel.cpa.toFixed(2)}` : '-'}
                </Text>
              </Row>
            ))}
          </Box>
        </Box>
      </Panel>

      {/* Two-column layout */}
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="3">
        {/* Active Campaigns */}
        {showCampaigns && (
          <Panel>
            <Heading size={headingSize as any}>Active Campaigns</Heading>
            <Column gap="3">
              {activeCampaigns.map((campaign) => (
                <Column
                  key={campaign.name}
                  padding="4"
                  border
                  borderRadius="2"
                  gap="3"
                >
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="2" weight="medium">{campaign.name}</Text>
                    <Box
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: campaign.status === 'active' ? '#dcfce7' : '#fef3c7',
                        color: campaign.status === 'active' ? '#166534' : '#92400e'
                      }}
                    >
                      <Text size="1">{campaign.status}</Text>
                    </Box>
                  </Row>
                  <Grid columns="repeat(4, 1fr)" gap="3">
                    <Column gap="1">
                      <Text size="1" color="muted">Spend</Text>
                      <Text size="2" weight="medium">${formatLongNumber(campaign.spend)}</Text>
                    </Column>
                    <Column gap="1">
                      <Text size="1" color="muted">Clicks</Text>
                      <Text size="2" weight="medium">{formatLongNumber(campaign.clicks)}</Text>
                    </Column>
                    <Column gap="1">
                      <Text size="1" color="muted">Conversions</Text>
                      <Text size="2" weight="medium">{formatLongNumber(campaign.conversions)}</Text>
                    </Column>
                    <Column gap="1">
                      <Text size="1" color="muted">ROAS</Text>
                      <Text
                        size="2"
                        weight="medium"
                        style={{ color: campaign.roas >= 3 ? '#166534' : campaign.roas >= 2 ? '#92400e' : '#dc2626' }}
                      >
                        {campaign.roas.toFixed(1)}x
                      </Text>
                    </Column>
                  </Grid>
                </Column>
              ))}
            </Column>
          </Panel>
        )}

        {/* UTM Breakdown */}
        {showUtmBreakdown && (
          <Panel>
            <Heading size={headingSize as any}>Traffic by Medium</Heading>
            <Row alignItems="center" gap="4">
              <Box height="180px" width="180px">
                <PieChart type="doughnut" chartData={utmMediumChartData} height="180px" />
              </Box>
              <Column gap="2">
                {utmMediumData.map((item, index) => (
                  <Row key={item.medium} gap="2" alignItems="center">
                    <Box
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: [paidColor, organicColor, emailColor, socialColor, '#01bad7'][index]
                      }}
                    />
                    <Text size="2" style={{ width: '60px' }}>{item.medium}</Text>
                    <Text size="2" weight="bold">{item.value}%</Text>
                  </Row>
                ))}
              </Column>
            </Row>
          </Panel>
        )}
      </Grid>

      {/* Landing Pages & UTM Sources */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        {/* Landing Page Performance */}
        {showLandingPages && (
          <Panel>
            <Heading size={headingSize as any}>Top Landing Pages</Heading>
            <Column gap="2">
              {landingPages.map((page, index) => (
                <Row key={page.path} justifyContent="space-between" alignItems="center" paddingY="2">
                  <Row gap="3" alignItems="center" style={{ flex: 2 }}>
                    <Text size="1" color="muted" style={{ width: '20px' }}>{index + 1}</Text>
                    <Text size="2" style={{ fontFamily: 'monospace' }}>{page.path}</Text>
                  </Row>
                  <Row gap="4" alignItems="center">
                    <Column alignItems="flex-end">
                      <Text size="1" color="muted">Visitors</Text>
                      <Text size="2">{formatLongNumber(page.visitors)}</Text>
                    </Column>
                    <Column alignItems="flex-end">
                      <Text size="1" color="muted">Conv.</Text>
                      <Text size="2" weight="medium">{formatLongNumber(page.conversions)}</Text>
                    </Column>
                    <Column alignItems="flex-end" style={{ width: '50px' }}>
                      <Text size="1" color="muted">Rate</Text>
                      <Text
                        size="2"
                        style={{ color: (page.conversions / page.visitors * 100) > 4 ? '#166534' : undefined }}
                      >
                        {(page.conversions / page.visitors * 100).toFixed(1)}%
                      </Text>
                    </Column>
                  </Row>
                </Row>
              ))}
            </Column>
          </Panel>
        )}

        {/* UTM Sources */}
        <Panel>
          <Heading size={headingSize as any}>Top UTM Sources</Heading>
          <Column gap="2">
            {utmSourceData.map((source, index) => (
              <Row key={source.source} justifyContent="space-between" alignItems="center" paddingY="2">
                <Row gap="3" alignItems="center">
                  <Text size="1" color="muted" style={{ width: '20px' }}>{index + 1}</Text>
                  <Text size="2">{source.source}</Text>
                </Row>
                <Row gap="4" alignItems="center">
                  <Text size="2">{formatLongNumber(source.visitors)}</Text>
                  <Box
                    style={{
                      width: '80px',
                      height: '6px',
                      backgroundColor: '#e5e5e5',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      style={{
                        width: `${(source.visitors / utmSourceData[0].visitors) * 100}%`,
                        height: '100%',
                        backgroundColor: paidColor,
                        borderRadius: '3px'
                      }}
                    />
                  </Box>
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>
      </Grid>
    </Column>
  );
}
