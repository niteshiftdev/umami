'use client';
import { Column, Row, Grid, Text, Heading, Icon } from '@umami/react-zen';
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
  useDynamicNumber,
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

// Realistic marketing attribution data
const trafficSourceData = {
  labels: ['Organic Search', 'Paid Search', 'Social', 'Referral', 'Direct', 'Email'],
  datasets: [
    {
      data: [42850, 28340, 18920, 12450, 15680, 9340],
      backgroundColor: CHART_COLORS.slice(0, 6),
      borderColor: CHART_COLORS.slice(0, 6),
    },
  ],
};

const campaignPerformanceData = {
  labels: [
    'Spring Sale 2024',
    'Product Launch Q4',
    'Brand Awareness',
    'Retargeting US',
    'Newsletter Promo',
    'LinkedIn B2B',
  ],
  datasets: [
    {
      label: 'Conversions',
      data: [
        { x: 'Spring Sale 2024', y: 1842 },
        { x: 'Product Launch Q4', y: 1456 },
        { x: 'Brand Awareness', y: 892 },
        { x: 'Retargeting US', y: 2134 },
        { x: 'Newsletter Promo', y: 743 },
        { x: 'LinkedIn B2B', y: 521 },
      ],
      backgroundColor: '#2680eb',
      borderColor: '#2680eb',
      borderWidth: 1,
    },
  ],
};

const channelROIData = {
  labels: ['Organic', 'Paid Search', 'Social Ads', 'Display', 'Email', 'Affiliate'],
  datasets: [
    {
      label: 'ROI %',
      data: [
        { x: 'Organic', y: 487 },
        { x: 'Paid Search', y: 312 },
        { x: 'Social Ads', y: 178 },
        { x: 'Display', y: 89 },
        { x: 'Email', y: 425 },
        { x: 'Affiliate', y: 234 },
      ],
      backgroundColor: '#30a46c',
      borderColor: '#30a46c',
      borderWidth: 1,
    },
  ],
};

const topCampaignsData = [
  { label: 'Retargeting US - Q4 Push', count: 2134, percent: 28 },
  { label: 'Spring Sale 2024 - All Channels', count: 1842, percent: 24 },
  { label: 'Product Launch - Enterprise', count: 1456, percent: 19 },
  { label: 'Brand Awareness - APAC', count: 892, percent: 12 },
  { label: 'Newsletter Welcome Series', count: 743, percent: 10 },
  { label: 'LinkedIn Lead Gen B2B', count: 521, percent: 7 },
];

const landingPageData = [
  { label: '/products/enterprise-suite', count: 4521, percent: 18 },
  { label: '/pricing', count: 3842, percent: 15 },
  { label: '/demo-request', count: 3156, percent: 12 },
  { label: '/solutions/analytics', count: 2891, percent: 11 },
  { label: '/blog/2024-trends', count: 2234, percent: 9 },
  { label: '/resources/whitepaper', count: 1876, percent: 7 },
  { label: '/case-studies/acme-corp', count: 1654, percent: 6 },
  { label: '/features/reporting', count: 1432, percent: 6 },
];

const topReferrersData = [
  { label: 'google.com', count: 28450, percent: 34 },
  { label: 'linkedin.com', count: 12340, percent: 15 },
  { label: 'twitter.com', count: 8920, percent: 11 },
  { label: 'techcrunch.com', count: 5430, percent: 6 },
  { label: 'producthunt.com', count: 4210, percent: 5 },
  { label: 'reddit.com/r/analytics', count: 3890, percent: 5 },
  { label: 'ycombinator.com', count: 2340, percent: 3 },
];

const utmSourcesData = [
  { label: 'utm_source=google', count: 34520, percent: 27 },
  { label: 'utm_source=linkedin', count: 18940, percent: 15 },
  { label: 'utm_source=facebook', count: 15230, percent: 12 },
  { label: 'utm_source=twitter', count: 12450, percent: 10 },
  { label: 'utm_source=newsletter', count: 9340, percent: 7 },
  { label: 'utm_source=partner', count: 7820, percent: 6 },
];

const formatPercent = (n: number) => `${n.toFixed(1)}%`;
const formatCurrency = (n: number) => `$${n.toLocaleString()}`;
const formatROI = (n: number) => `${n}%`;

export default function MarketingAttributionPage() {
  // Dials for customization
  const chartType = useDynamicVariant('traffic-chart-type', {
    label: 'Traffic Source Chart Type',
    description: 'Display traffic sources as pie or doughnut chart',
    default: 'doughnut',
    options: ['pie', 'doughnut'] as const,
    group: 'Visualization',
  });

  const showCampaignSection = useDynamicBoolean('show-campaigns', {
    label: 'Show Campaign Performance',
    description: 'Toggle campaign performance section visibility',
    default: true,
    group: 'Sections',
  });

  const showROISection = useDynamicBoolean('show-roi', {
    label: 'Show Channel ROI',
    description: 'Toggle channel ROI section visibility',
    default: true,
    group: 'Sections',
  });

  const showUTMSection = useDynamicBoolean('show-utm', {
    label: 'Show UTM Tracking',
    description: 'Toggle UTM parameters section visibility',
    default: true,
    group: 'Sections',
  });

  const showLandingPages = useDynamicBoolean('show-landing-pages', {
    label: 'Show Landing Pages',
    description: 'Toggle landing page performance visibility',
    default: true,
    group: 'Sections',
  });

  const metricValueSize = useDynamicVariant('metric-value-size', {
    label: 'Metric Value Size',
    description: 'Font size for metric values',
    default: '7',
    options: ['5', '6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  const showChangeIndicators = useDynamicBoolean('show-change', {
    label: 'Show Change Indicators',
    description: 'Display period-over-period change percentages',
    default: true,
    group: 'Metrics',
  });

  const listItemCount = useDynamicNumber('list-item-count', {
    label: 'List Items to Show',
    description: 'Number of items to display in list tables',
    default: 6,
    min: 3,
    max: 10,
    step: 1,
    group: 'Display',
  });

  return (
    <PageBody>
      <PageHeader
        title="Marketing Attribution"
        description="Track campaign performance, traffic sources, and channel ROI"
      />

      <Column gap="6">
        {/* Top-level metrics */}
        <MetricsBar>
          <MetricCard
            label="Total Traffic"
            value={127580}
            change={12840}
            showChange={showChangeIndicators}
            valueSize={metricValueSize}
          />
          <MetricCard
            label="Conversions"
            value={7588}
            change={892}
            showChange={showChangeIndicators}
            valueSize={metricValueSize}
          />
          <MetricCard
            label="Conversion Rate"
            value={5.95}
            change={0.4}
            showChange={showChangeIndicators}
            formatValue={formatPercent}
            valueSize={metricValueSize}
          />
          <MetricCard
            label="Cost per Acquisition"
            value={24.32}
            change={-2.15}
            showChange={showChangeIndicators}
            formatValue={formatCurrency}
            valueSize={metricValueSize}
          />
          <MetricCard
            label="Ad Spend"
            value={184520}
            change={15200}
            showChange={showChangeIndicators}
            formatValue={formatCurrency}
            valueSize={metricValueSize}
          />
          <MetricCard
            label="Avg ROI"
            value={287}
            change={23}
            showChange={showChangeIndicators}
            formatValue={formatROI}
            valueSize={metricValueSize}
          />
        </MetricsBar>

        {/* Traffic Sources and Campaigns Row */}
        <Grid columns={{ xs: '1fr', lg: '1fr 2fr' }} gap="6">
          <Panel title="Traffic Sources">
            <div style={{ height: 300 }}>
              <PieChart type={chartType} chartData={trafficSourceData} />
            </div>
            <Column gap="2" paddingTop="4">
              {trafficSourceData.labels.map((label, idx) => (
                <Row key={label} justifyContent="space-between" alignItems="center">
                  <Row gap="2" alignItems="center">
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: CHART_COLORS[idx],
                      }}
                    />
                    <Text size="2">{label}</Text>
                  </Row>
                  <Text size="2" weight="semibold">
                    {trafficSourceData.datasets[0].data[idx].toLocaleString()}
                  </Text>
                </Row>
              ))}
            </Column>
          </Panel>

          {showCampaignSection && (
            <Panel title="Campaign Performance">
              <div style={{ height: 320 }}>
                <BarChart
                  chartData={campaignPerformanceData}
                  XAxisType="category"
                />
              </div>
            </Panel>
          )}
        </Grid>

        {/* Channel ROI Section */}
        {showROISection && (
          <Panel title="Channel ROI Comparison">
            <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="6">
              <div style={{ height: 280 }}>
                <BarChart chartData={channelROIData} XAxisType="category" />
              </div>
              <Column gap="4">
                <Text size="3" weight="bold">ROI by Channel</Text>
                {channelROIData.labels.map((label, idx) => {
                  const value = channelROIData.datasets[0].data[idx].y;
                  const isHighROI = value > 300;
                  const isMediumROI = value > 150 && value <= 300;
                  return (
                    <Row key={label} justifyContent="space-between" alignItems="center">
                      <Text size="2">{label}</Text>
                      <Text
                        size="2"
                        weight="bold"
                        style={{
                          color: isHighROI
                            ? '#30a46c'
                            : isMediumROI
                              ? '#f76b15'
                              : '#e5484d',
                        }}
                      >
                        {value}% ROI
                      </Text>
                    </Row>
                  );
                })}
              </Column>
            </Grid>
          </Panel>
        )}

        {/* Lists Row: Top Campaigns, Landing Pages, Referrers */}
        <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="6">
          <Panel>
            <ListTable
              data={topCampaignsData.slice(0, listItemCount)}
              title="Top Campaigns"
              metric="Conversions"
            />
          </Panel>

          {showLandingPages && (
            <Panel>
              <ListTable
                data={landingPageData.slice(0, listItemCount)}
                title="Landing Page Performance"
                metric="Sessions"
              />
            </Panel>
          )}

          <Panel>
            <ListTable
              data={topReferrersData.slice(0, listItemCount)}
              title="Top Referrers"
              metric="Visitors"
            />
          </Panel>
        </Grid>

        {/* UTM Attribution Section */}
        {showUTMSection && (
          <Panel title="UTM Attribution Breakdown">
            <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
              <Column gap="4">
                <Text size="3" weight="bold">
                  By Source
                </Text>
                <ListTable
                  data={utmSourcesData.slice(0, listItemCount)}
                  title=""
                  metric="Sessions"
                />
              </Column>
              <Column gap="4">
                <Text size="3" weight="bold">
                  Attribution Model Comparison
                </Text>
                <Grid columns="1fr 1fr 1fr" gap="4">
                  <Column
                    padding="4"
                    backgroundColor
                    border
                    borderRadius="3"
                    alignItems="center"
                    gap="2"
                  >
                    <Text size="1" color="muted" weight="semibold">
                      First Touch
                    </Text>
                    <Text size="5" weight="bold">
                      3,842
                    </Text>
                    <Text size="1" color="muted">
                      conversions
                    </Text>
                  </Column>
                  <Column
                    padding="4"
                    backgroundColor
                    border
                    borderRadius="3"
                    alignItems="center"
                    gap="2"
                  >
                    <Text size="1" color="muted" weight="semibold">
                      Last Touch
                    </Text>
                    <Text size="5" weight="bold">
                      4,156
                    </Text>
                    <Text size="1" color="muted">
                      conversions
                    </Text>
                  </Column>
                  <Column
                    padding="4"
                    backgroundColor
                    border
                    borderRadius="3"
                    alignItems="center"
                    gap="2"
                  >
                    <Text size="1" color="muted" weight="semibold">
                      Linear
                    </Text>
                    <Text size="5" weight="bold">
                      3,998
                    </Text>
                    <Text size="1" color="muted">
                      conversions
                    </Text>
                  </Column>
                </Grid>
                <Column gap="3" paddingTop="2">
                  <Row justifyContent="space-between">
                    <Text size="2">Avg. Touchpoints per Conversion</Text>
                    <Text size="2" weight="bold">
                      4.2
                    </Text>
                  </Row>
                  <Row justifyContent="space-between">
                    <Text size="2">Avg. Time to Convert</Text>
                    <Text size="2" weight="bold">
                      12.3 days
                    </Text>
                  </Row>
                  <Row justifyContent="space-between">
                    <Text size="2">Assisted Conversions</Text>
                    <Text size="2" weight="bold">
                      2,341
                    </Text>
                  </Row>
                </Column>
              </Column>
            </Grid>
          </Panel>
        )}

        {/* Geographic Performance */}
        <Panel title="Geographic Performance">
          <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="4">
            {[
              { region: 'North America', traffic: 52340, conversions: 3124, rate: 5.97 },
              { region: 'Europe', traffic: 38920, conversions: 2156, rate: 5.54 },
              { region: 'Asia Pacific', traffic: 24680, conversions: 1542, rate: 6.25 },
              { region: 'Latin America', traffic: 11640, conversions: 766, rate: 6.58 },
            ].map((geo) => (
              <Column
                key={geo.region}
                padding="5"
                backgroundColor
                border
                borderRadius="3"
                gap="3"
              >
                <Text size="2" weight="bold">
                  {geo.region}
                </Text>
                <Row justifyContent="space-between">
                  <Text size="1" color="muted">
                    Traffic
                  </Text>
                  <Text size="2" weight="semibold">
                    {geo.traffic.toLocaleString()}
                  </Text>
                </Row>
                <Row justifyContent="space-between">
                  <Text size="1" color="muted">
                    Conversions
                  </Text>
                  <Text size="2" weight="semibold">
                    {geo.conversions.toLocaleString()}
                  </Text>
                </Row>
                <Row justifyContent="space-between">
                  <Text size="1" color="muted">
                    Conv. Rate
                  </Text>
                  <Text
                    size="2"
                    weight="bold"
                    style={{ color: geo.rate > 6 ? '#30a46c' : '#0090ff' }}
                  >
                    {geo.rate}%
                  </Text>
                </Row>
              </Column>
            ))}
          </Grid>
        </Panel>
      </Column>
    </PageBody>
  );
}
