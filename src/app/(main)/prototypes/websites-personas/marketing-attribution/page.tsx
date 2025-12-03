'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Text, Heading, Box, Button, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { ListTable } from '@/components/metrics/ListTable';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { Chart } from '@/components/charts/Chart';
import { CHART_COLORS } from '@/lib/constants';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicBoolean,
} from '@niteshift/dials';

// Generate 30 days of realistic time series data
const generateTimeSeriesData = () => {
  const data: { x: Date; y: number }[] = [];
  const baseDate = new Date('2024-11-03');
  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    // Add realistic variation with weekly patterns
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    const baseTraffic = 2400 + Math.random() * 800;
    data.push({
      x: date,
      y: Math.round(baseTraffic * weekendFactor),
    });
  }
  return data;
};

// Channel distribution data (Organic 35%, Paid 25%, Social 18%, Email 12%, Direct 7%, Referral 3%)
const channelData = {
  labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Email', 'Direct', 'Referral'],
  datasets: [
    {
      data: [35, 25, 18, 12, 7, 3],
      backgroundColor: [CHART_COLORS[2], CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[3], CHART_COLORS[4], CHART_COLORS[5]],
    },
  ],
};

// Campaign performance data
const campaignPerformance = [
  { name: 'Black Friday Sale', visitors: 12840, conversions: 642, revenue: 89460, spend: 15200, cpa: 23.68, roas: 5.88 },
  { name: 'Product Launch Q4', visitors: 8920, conversions: 312, revenue: 52340, spend: 12800, cpa: 41.03, roas: 4.09 },
  { name: 'Holiday Promo', visitors: 7650, conversions: 268, revenue: 38920, spend: 8500, cpa: 31.72, roas: 4.58 },
  { name: 'Retargeting Campaign', visitors: 4210, conversions: 189, revenue: 24680, spend: 3200, cpa: 16.93, roas: 7.71 },
  { name: 'Brand Awareness', visitors: 15340, conversions: 184, revenue: 18920, spend: 9800, cpa: 53.26, roas: 1.93 },
  { name: 'Newsletter Signup', visitors: 3890, conversions: 156, revenue: 12450, spend: 2100, cpa: 13.46, roas: 5.93 },
];

// UTM Source breakdown
const utmSourceData = [
  { label: 'google', count: 28450, percent: 38 },
  { label: 'facebook', count: 14280, percent: 19 },
  { label: 'linkedin', count: 9640, percent: 13 },
  { label: 'newsletter', count: 8920, percent: 12 },
  { label: 'twitter', count: 5680, percent: 8 },
  { label: 'instagram', count: 4210, percent: 6 },
  { label: 'bing', count: 2180, percent: 3 },
  { label: 'youtube', count: 1240, percent: 2 },
];

// UTM Medium breakdown
const utmMediumData = [
  { label: 'cpc', count: 24680, percent: 33 },
  { label: 'organic', count: 22140, percent: 29 },
  { label: 'social', count: 13920, percent: 18 },
  { label: 'email', count: 9180, percent: 12 },
  { label: 'referral', count: 4560, percent: 6 },
  { label: 'display', count: 1520, percent: 2 },
];

// UTM Campaign breakdown
const utmCampaignData = [
  { label: 'black_friday_2024', count: 12840, percent: 24 },
  { label: 'product_launch_q4', count: 8920, percent: 17 },
  { label: 'holiday_promo', count: 7650, percent: 14 },
  { label: 'brand_awareness', count: 6280, percent: 12 },
  { label: 'retargeting_nov', count: 4210, percent: 8 },
  { label: 'newsletter_weekly', count: 3890, percent: 7 },
  { label: 'linkedin_b2b', count: 3420, percent: 6 },
  { label: 'influencer_collab', count: 2890, percent: 5 },
  { label: 'google_brand', count: 2340, percent: 4 },
  { label: 'facebook_lookalike', count: 1560, percent: 3 },
];

// Attribution model comparison
const attributionData = {
  labels: ['Organic Search', 'Paid Ads', 'Social', 'Email', 'Direct', 'Referral'],
  datasets: [
    {
      label: 'First Touch',
      data: [420, 380, 210, 145, 85, 42],
      backgroundColor: CHART_COLORS[0],
    },
    {
      label: 'Last Touch',
      data: [285, 520, 180, 165, 95, 37],
      backgroundColor: CHART_COLORS[1],
    },
    {
      label: 'Linear',
      data: [352, 450, 195, 155, 90, 40],
      backgroundColor: CHART_COLORS[2],
    },
  ],
};

// Top converting landing pages
const landingPageData = [
  { label: '/products/new-arrivals', count: 342, percent: 26 },
  { label: '/sale/black-friday', count: 289, percent: 22 },
  { label: '/features/enterprise', count: 178, percent: 14 },
  { label: '/pricing', count: 156, percent: 12 },
  { label: '/demo', count: 134, percent: 10 },
  { label: '/blog/getting-started', count: 98, percent: 8 },
  { label: '/resources/case-studies', count: 67, percent: 5 },
  { label: '/contact', count: 39, percent: 3 },
];

// Channel trend data
const generateChannelTrends = () => {
  const baseDate = new Date('2024-11-03');
  const channels = [
    { name: 'Organic', base: 850, color: CHART_COLORS[2] },
    { name: 'Paid', base: 620, color: CHART_COLORS[0] },
    { name: 'Social', base: 440, color: CHART_COLORS[1] },
    { name: 'Email', base: 290, color: CHART_COLORS[3] },
  ];

  return {
    datasets: channels.map((channel) => ({
      label: channel.name,
      data: Array.from({ length: 30 }, (_, i) => {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + i);
        const dayOfWeek = date.getDay();
        const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1;
        const trendFactor = 1 + (i * 0.008); // slight upward trend
        const noise = 0.85 + Math.random() * 0.3;
        return {
          x: date,
          y: Math.round(channel.base * weekendFactor * trendFactor * noise),
        };
      }),
      backgroundColor: channel.color,
      borderColor: channel.color,
    })),
  };
};

// Conversion funnel by channel
const conversionFunnelData = [
  { channel: 'Organic Search', visitors: 26320, engaged: 18424, leads: 2106, conversions: 526, rate: 2.0 },
  { channel: 'Paid Ads', visitors: 18750, engaged: 11250, leads: 1875, conversions: 469, rate: 2.5 },
  { channel: 'Social Media', visitors: 13500, engaged: 6750, leads: 810, conversions: 162, rate: 1.2 },
  { channel: 'Email', visitors: 9000, engaged: 7200, leads: 1080, conversions: 315, rate: 3.5 },
  { channel: 'Direct', visitors: 5250, engaged: 3675, leads: 368, conversions: 105, rate: 2.0 },
  { channel: 'Referral', visitors: 2250, engaged: 1575, leads: 225, conversions: 68, rate: 3.0 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function MarketingAttributionDashboard() {
  const channelTrendData = useMemo(() => generateChannelTrends(), []);
  const minDate = new Date('2024-11-03');
  const maxDate = new Date('2024-12-02');

  // === DIALS: Layout & Spacing ===
  const sectionGap = useDynamicSpacing('ma-section-gap', {
    label: 'Section Gap',
    description: 'Spacing between major sections',
    default: '24px',
    options: ['16px', '20px', '24px', '32px', '40px'],
    group: 'Layout',
  });

  const panelStyle = useDynamicVariant('ma-panel-style', {
    label: 'Panel Style',
    description: 'Visual style for content panels',
    default: 'default',
    options: ['default', 'minimal', 'bordered'] as const,
    group: 'Layout',
  });

  // === DIALS: Color Palette ===
  const accentColor = useDynamicColor('ma-accent-color', {
    label: 'Accent Color',
    description: 'Primary accent color for highlights',
    default: '#2680eb',
    options: ['#2680eb', '#44b556', '#9256d9', '#e68619', '#e34850'],
    allowCustom: true,
    group: 'Colors',
  });

  const positiveColor = useDynamicColor('ma-positive-color', {
    label: 'Positive Indicator',
    description: 'Color for positive metrics',
    default: '#30a46c',
    options: ['#30a46c', '#44b556', '#89c541', '#01bad7'],
    group: 'Colors',
  });

  const negativeColor = useDynamicColor('ma-negative-color', {
    label: 'Negative Indicator',
    description: 'Color for negative metrics',
    default: '#e5484d',
    options: ['#e5484d', '#e34850', '#f76b15', '#ec1562'],
    group: 'Colors',
  });

  // === DIALS: Typography ===
  const headingSize = useDynamicVariant('ma-heading-size', {
    label: 'Heading Size',
    description: 'Font size for section headings',
    default: '4',
    options: ['3', '4', '5'] as const,
    group: 'Typography',
  });

  const headingWeight = useDynamicVariant('ma-heading-weight', {
    label: 'Heading Weight',
    description: 'Font weight for section headings',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography',
  });

  // === DIALS: Visualizations ===
  const chartStyle = useDynamicVariant('ma-chart-style', {
    label: 'Channel Chart Type',
    description: 'Visualization style for channel distribution',
    default: 'doughnut',
    options: ['doughnut', 'pie'] as const,
    group: 'Visualizations',
  });

  const showAttributionComparison = useDynamicBoolean('ma-show-attribution', {
    label: 'Show Attribution Models',
    description: 'Display attribution model comparison',
    default: true,
    group: 'Visualizations',
  });

  const showUtmAnalysis = useDynamicBoolean('ma-show-utm', {
    label: 'Show UTM Analysis',
    description: 'Display UTM breakdown tables',
    default: true,
    group: 'Visualizations',
  });

  const showCampaignTable = useDynamicBoolean('ma-show-campaigns', {
    label: 'Show Campaign Table',
    description: 'Display campaign performance table',
    default: true,
    group: 'Visualizations',
  });

  // === DIALS: Components ===
  const metricCardStyle = useDynamicVariant('ma-metric-style', {
    label: 'Metric Card Style',
    description: 'Visual style of KPI cards',
    default: 'default',
    options: ['default', 'compact', 'expanded'] as const,
    group: 'Components',
  });

  const showInsights = useDynamicBoolean('ma-show-insights', {
    label: 'Show Insights Panel',
    description: 'Display key insights section',
    default: true,
    group: 'Components',
  });

  return (
    <PageBody>
      <Column gap="6" style={sectionGap ? { gap: sectionGap } : undefined}>
        {/* Header */}
        <Row justifyContent="space-between" alignItems="center" style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <Column gap="1">
            <Heading size="2">Marketing Attribution</Heading>
            <Text color="muted">Nov 3 - Dec 2, 2024</Text>
          </Column>
          <Row gap="3">
            <Button variant="secondary">Export Report</Button>
            <Button variant="primary">Configure Goals</Button>
          </Row>
        </Row>

        {/* Top Level KPIs */}
        <MetricsBar style={{ animation: 'fadeIn 0.4s ease-out 0.1s backwards' }}>
          <MetricCard label="Total Conversions" value={1645} change={186} showChange />
          <MetricCard label="Conversion Rate" value={2.19} change={0.24} formatValue={(n) => `${n.toFixed(2)}%`} showChange />
          <MetricCard label="Cost per Acquisition" value={28.42} change={-3.18} formatValue={(n) => `$${n.toFixed(2)}`} showChange reverseColors />
          <MetricCard label="Return on Ad Spend" value={4.82} change={0.67} formatValue={(n) => `${n.toFixed(2)}x`} showChange />
          <MetricCard label="Total Ad Spend" value={51600} change={8200} formatValue={formatCurrency} showChange />
          <MetricCard label="Revenue Attributed" value={248770} change={42350} formatValue={formatCurrency} showChange />
        </MetricsBar>

        {/* Channel Distribution and Trends */}
        <Grid columns={{ xs: '1fr', lg: '1fr 2fr' }} gap="6" style={{ animation: 'fadeIn 0.4s ease-out 0.2s backwards' }}>
          <Panel>
            <Column gap="4">
              <Row justifyContent="space-between" alignItems="center">
                <Text weight={headingWeight} size={headingSize as any}>Channel Distribution</Text>
                <Text color="muted" size="1">By Traffic Share</Text>
              </Row>
              <Box height="280px">
                <PieChart type={chartStyle} chartData={channelData} />
              </Box>
              <Column gap="2" paddingTop="2">
                {channelData.labels.map((label, i) => (
                  <Row key={label} justifyContent="space-between" alignItems="center" paddingX="2">
                    <Row gap="2" alignItems="center">
                      <Box
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 2,
                          backgroundColor: channelData.datasets[0].backgroundColor[i]
                        }}
                      />
                      <Text size="2">{label}</Text>
                    </Row>
                    <Text weight="semibold" size="2">{channelData.datasets[0].data[i]}%</Text>
                  </Row>
                ))}
              </Column>
            </Column>
          </Panel>

          <Panel>
            <Column gap="4">
              <Row justifyContent="space-between" alignItems="center">
                <Text weight={headingWeight} size={headingSize as any}>Channel Performance Over Time</Text>
                <Text color="muted" size="1">Daily Sessions by Channel</Text>
              </Row>
              <Box height="380px">
                <BarChart
                  chartData={channelTrendData}
                  unit="day"
                  minDate={minDate}
                  maxDate={maxDate}
                  stacked
                />
              </Box>
            </Column>
          </Panel>
        </Grid>

        {/* Campaign Performance Table */}
        <Panel style={{ animation: 'fadeIn 0.4s ease-out 0.3s backwards' }}>
          <Column gap="4">
            <Row justifyContent="space-between" alignItems="center">
              <Text weight="bold" size="4">Campaign Performance</Text>
              <Text color="muted" size="1">Active Campaigns (Last 30 Days)</Text>
            </Row>
            <Box style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: 600 }}>Campaign</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Visitors</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Conversions</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Revenue</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>Spend</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>CPA</th>
                    <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: 600 }}>ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerformance.map((campaign, index) => (
                    <tr
                      key={campaign.name}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        animation: `fadeIn 0.3s ease-out ${0.4 + index * 0.05}s backwards`
                      }}
                    >
                      <td style={{ padding: '12px 8px' }}>
                        <Text weight="medium">{campaign.name}</Text>
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                        <Text>{formatLongNumber(campaign.visitors)}</Text>
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                        <Text weight="semibold">{formatLongNumber(campaign.conversions)}</Text>
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                        <Text style={{ color: 'var(--accent-color-green)' }}>{formatCurrency(campaign.revenue)}</Text>
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                        <Text color="muted">{formatCurrency(campaign.spend)}</Text>
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                        <Text>${campaign.cpa.toFixed(2)}</Text>
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 8px' }}>
                        <Box
                          style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: 4,
                            backgroundColor: campaign.roas >= 4
                              ? 'color-mix(in srgb, var(--accent-color-green), transparent 85%)'
                              : campaign.roas >= 2
                                ? 'color-mix(in srgb, var(--accent-color-orange), transparent 85%)'
                                : 'color-mix(in srgb, var(--accent-color-red), transparent 85%)',
                            color: campaign.roas >= 4
                              ? 'var(--accent-color-green)'
                              : campaign.roas >= 2
                                ? 'var(--accent-color-orange)'
                                : 'var(--accent-color-red)',
                          }}
                        >
                          <Text weight="semibold">{campaign.roas.toFixed(2)}x</Text>
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Column>
        </Panel>

        {/* UTM Analysis Section */}
        <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="6" style={{ animation: 'fadeIn 0.4s ease-out 0.5s backwards' }}>
          <Panel>
            <ListTable data={utmSourceData} title="UTM Source" metric="Sessions" />
          </Panel>
          <Panel>
            <ListTable data={utmMediumData} title="UTM Medium" metric="Sessions" />
          </Panel>
          <Panel>
            <ListTable data={utmCampaignData} title="UTM Campaign" metric="Sessions" />
          </Panel>
        </Grid>

        {/* Attribution Model Comparison */}
        <Panel style={{ animation: 'fadeIn 0.4s ease-out 0.6s backwards' }}>
          <Column gap="4">
            <Row justifyContent="space-between" alignItems="center">
              <Column gap="1">
                <Text weight="bold" size="4">Attribution Model Comparison</Text>
                <Text color="muted" size="2">How conversions are credited across channels by different models</Text>
              </Column>
            </Row>
            <Box height="320px">
              <Chart
                type="bar"
                chartData={attributionData}
                chartOptions={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      grid: { display: false },
                    },
                    y: {
                      beginAtZero: true,
                      grid: { color: 'var(--border-color)' },
                    },
                  },
                }}
              />
            </Box>
            <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="4" paddingTop="2">
              <Column
                gap="2"
                padding="4"
                borderRadius="2"
                style={{ backgroundColor: 'var(--base-color-2)' }}
              >
                <Row gap="2" alignItems="center">
                  <Box style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: CHART_COLORS[0] }} />
                  <Text weight="semibold">First Touch</Text>
                </Row>
                <Text size="2" color="muted">Credits conversion to the first channel that brought the visitor</Text>
              </Column>
              <Column
                gap="2"
                padding="4"
                borderRadius="2"
                style={{ backgroundColor: 'var(--base-color-2)' }}
              >
                <Row gap="2" alignItems="center">
                  <Box style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: CHART_COLORS[1] }} />
                  <Text weight="semibold">Last Touch</Text>
                </Row>
                <Text size="2" color="muted">Credits conversion to the last channel before purchase</Text>
              </Column>
              <Column
                gap="2"
                padding="4"
                borderRadius="2"
                style={{ backgroundColor: 'var(--base-color-2)' }}
              >
                <Row gap="2" alignItems="center">
                  <Box style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: CHART_COLORS[2] }} />
                  <Text weight="semibold">Linear</Text>
                </Row>
                <Text size="2" color="muted">Distributes credit equally across all touchpoints</Text>
              </Column>
            </Grid>
          </Column>
        </Panel>

        {/* Conversion Funnel and Landing Pages */}
        <Grid columns={{ xs: '1fr', lg: '3fr 2fr' }} gap="6" style={{ animation: 'fadeIn 0.4s ease-out 0.7s backwards' }}>
          <Panel>
            <Column gap="4">
              <Row justifyContent="space-between" alignItems="center">
                <Text weight="bold" size="4">Conversion Funnel by Channel</Text>
                <Text color="muted" size="1">Visitor Journey Breakdown</Text>
              </Row>
              <Box style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>Channel</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>Visitors</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>Engaged</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>Leads</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>Conversions</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', fontWeight: 600, fontSize: 13 }}>CVR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversionFunnelData.map((row) => (
                      <tr key={row.channel} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 8px' }}>
                          <Text weight="medium" size="2">{row.channel}</Text>
                        </td>
                        <td style={{ textAlign: 'right', padding: '10px 8px' }}>
                          <Text size="2">{formatLongNumber(row.visitors)}</Text>
                        </td>
                        <td style={{ textAlign: 'right', padding: '10px 8px' }}>
                          <Text size="2" color="muted">{formatLongNumber(row.engaged)}</Text>
                        </td>
                        <td style={{ textAlign: 'right', padding: '10px 8px' }}>
                          <Text size="2" color="muted">{formatLongNumber(row.leads)}</Text>
                        </td>
                        <td style={{ textAlign: 'right', padding: '10px 8px' }}>
                          <Text size="2" weight="semibold">{row.conversions}</Text>
                        </td>
                        <td style={{ textAlign: 'right', padding: '10px 8px' }}>
                          <Box
                            style={{
                              display: 'inline-block',
                              padding: '2px 6px',
                              borderRadius: 4,
                              backgroundColor: row.rate >= 3
                                ? 'color-mix(in srgb, var(--accent-color-green), transparent 85%)'
                                : row.rate >= 2
                                  ? 'color-mix(in srgb, var(--accent-color-blue), transparent 85%)'
                                  : 'color-mix(in srgb, var(--font-color-muted), transparent 85%)',
                              color: row.rate >= 3
                                ? 'var(--accent-color-green)'
                                : row.rate >= 2
                                  ? 'var(--accent-color-blue)'
                                  : 'var(--font-color-muted)',
                            }}
                          >
                            <Text size="2" weight="semibold">{row.rate}%</Text>
                          </Box>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Column>
          </Panel>

          <Panel>
            <ListTable data={landingPageData} title="Top Converting Landing Pages" metric="Conversions" />
          </Panel>
        </Grid>

        {/* Insights Section */}
        <Panel style={{ animation: 'fadeIn 0.4s ease-out 0.8s backwards' }}>
          <Column gap="4">
            <Text weight="bold" size="4">Key Insights</Text>
            <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="4">
              <Column
                gap="2"
                padding="4"
                borderRadius="2"
                border
                style={{ borderLeftWidth: 3, borderLeftColor: 'var(--accent-color-green)' }}
              >
                <Text weight="semibold">Top Performer</Text>
                <Text size="2" color="muted">
                  Retargeting Campaign delivers the highest ROAS at 7.71x with the lowest CPA of $16.93
                </Text>
              </Column>
              <Column
                gap="2"
                padding="4"
                borderRadius="2"
                border
                style={{ borderLeftWidth: 3, borderLeftColor: 'var(--accent-color-blue)' }}
              >
                <Text weight="semibold">Attribution Gap</Text>
                <Text size="2" color="muted">
                  Paid ads receive 37% more credit in Last Touch vs First Touch model - consider multi-touch
                </Text>
              </Column>
              <Column
                gap="2"
                padding="4"
                borderRadius="2"
                border
                style={{ borderLeftWidth: 3, borderLeftColor: 'var(--accent-color-orange)' }}
              >
                <Text weight="semibold">Optimization Opportunity</Text>
                <Text size="2" color="muted">
                  Email has highest CVR (3.5%) but only 12% of traffic - scale email acquisition efforts
                </Text>
              </Column>
            </Grid>
          </Column>
        </Panel>
      </Column>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </PageBody>
  );
}
