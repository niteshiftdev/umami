'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, Heading, useTheme } from '@umami/react-zen';
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
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import { renderDateLabels } from '@/lib/charts';
import { colord } from 'colord';
import {
  DialsProvider,
  useDynamicColor,
  useDynamicNumber,
  useDynamicBoolean,
  useDynamicVariant,
} from '@niteshift/dials';

// Generate realistic traffic source data over time
function generateChannelTrafficData(days: number = 14) {
  const channels = ['Organic Search', 'Direct', 'Paid Search', 'Social', 'Referral', 'Email'];
  const baseValues = [450, 320, 280, 180, 120, 90];
  const now = new Date();

  const result: Record<string, { x: string; y: number }[]> = {};
  channels.forEach((channel, idx) => {
    result[channel] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const weekendMultiplier = isWeekend ? 0.7 : 1;
      const variance = (Math.random() - 0.5) * baseValues[idx] * 0.3;

      result[channel].push({
        x: dateStr,
        y: Math.round(baseValues[idx] * weekendMultiplier + variance),
      });
    }
  });

  return result;
}

const channelData = generateChannelTrafficData(14);

// Traffic source breakdown
const trafficSourceData = [
  { label: 'Google Organic', count: 18234, percent: 32 },
  { label: 'Direct', count: 12847, percent: 23 },
  { label: 'Google Ads', count: 9821, percent: 17 },
  { label: 'Facebook', count: 5432, percent: 10 },
  { label: 'LinkedIn', count: 3912, percent: 7 },
  { label: 'Twitter/X', count: 2156, percent: 4 },
  { label: 'Newsletter', count: 2034, percent: 4 },
  { label: 'Partner Sites', count: 1789, percent: 3 },
];

// Campaign performance
const campaignPerformance = [
  { label: 'Black Friday Sale 2024', count: 4521, percent: 38 },
  { label: 'Product Launch Q4', count: 3218, percent: 27 },
  { label: 'Holiday Remarketing', count: 2156, percent: 18 },
  { label: 'Webinar Promo Nov', count: 1234, percent: 10 },
  { label: 'Brand Awareness', count: 812, percent: 7 },
];

// UTM campaign data
const utmCampaignData = [
  { label: 'utm_source=google', count: 28055, percent: 42 },
  { label: 'utm_source=facebook', count: 8654, percent: 13 },
  { label: 'utm_source=linkedin', count: 5912, percent: 9 },
  { label: 'utm_source=newsletter', count: 4034, percent: 6 },
  { label: 'utm_medium=cpc', count: 12821, percent: 19 },
  { label: 'utm_medium=email', count: 7456, percent: 11 },
];

// Channel breakdown pie chart
const channelBreakdown = {
  labels: ['Organic Search', 'Direct', 'Paid Search', 'Social', 'Referral', 'Email'],
  datasets: [{
    data: [32, 23, 17, 14, 8, 6],
    backgroundColor: CHART_COLORS.slice(0, 6),
    borderWidth: 0,
  }],
};

// Landing page performance
const landingPageData = [
  { label: '/pricing', count: 8234, percent: 28 },
  { label: '/', count: 6521, percent: 22 },
  { label: '/features', count: 4847, percent: 16 },
  { label: '/blog/analytics-guide', count: 3912, percent: 13 },
  { label: '/demo', count: 3156, percent: 11 },
  { label: '/case-studies', count: 2934, percent: 10 },
];

// Geographic conversion data
const geoConversionData = [
  { label: 'United States', count: 4521, percent: 38 },
  { label: 'United Kingdom', count: 1892, percent: 16 },
  { label: 'Germany', count: 1456, percent: 12 },
  { label: 'Canada', count: 1123, percent: 9 },
  { label: 'France', count: 892, percent: 7 },
  { label: 'Australia', count: 756, percent: 6 },
  { label: 'Netherlands', count: 534, percent: 5 },
  { label: 'Other', count: 826, percent: 7 },
];

function MarketingAttributionDashboard() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const primaryColor = useDynamicColor('ma-primary-color', {
    default: '#44b556',
    label: 'Primary Color',
    group: 'Colors',
  });

  const secondaryColor = useDynamicColor('ma-secondary-color', {
    default: '#e68619',
    label: 'Secondary Color',
    group: 'Colors',
  });

  const cardPadding = useDynamicNumber('ma-card-padding', {
    default: 6,
    min: 3,
    max: 10,
    label: 'Card Padding',
    group: 'Layout',
  });

  const chartHeight = useDynamicNumber('ma-chart-height', {
    default: 320,
    min: 200,
    max: 500,
    label: 'Chart Height',
    group: 'Layout',
  });

  const showConversionRate = useDynamicBoolean('ma-show-conversion-rate', {
    default: true,
    label: 'Show Conversion Rates',
    group: 'Display',
  });

  const darkChannelBars = useDynamicBoolean('ma-dark-channel-bars', {
    default: false,
    label: 'Dark Channel Bars',
    group: 'Display',
  });

  const metricsLayout = useDynamicVariant('ma-metrics-layout', {
    default: 'auto',
    options: ['auto', 'fixed-4', 'fixed-5'],
    label: 'Metrics Layout',
    group: 'Layout',
  });

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 13);
  const maxDate = new Date();

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Stacked channel traffic chart
  const channelChartData = useMemo(() => {
    const channels = Object.keys(channelData);
    return {
      datasets: channels.map((channel, index) => {
        const baseColor = colord(CHART_COLORS[index % CHART_COLORS.length]);
        const alpha = darkChannelBars ? 0.8 : 0.6;

        return {
          type: 'bar' as const,
          label: channel,
          data: channelData[channel],
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: baseColor.alpha(alpha).toRgbString(),
          borderColor: baseColor.alpha(0.9).toRgbString(),
        };
      }),
    };
  }, [darkChannelBars]);

  const getMetricsColumns = () => {
    if (metricsLayout === 'fixed-4') return 'repeat(4, 1fr)';
    if (metricsLayout === 'fixed-5') return 'repeat(5, 1fr)';
    return 'repeat(auto-fit, minmax(140px, 1fr))';
  };

  return (
    <PageBody>
      <Column gap={cardPadding.toString() as any}>
        <PageHeader
          title="Marketing Attribution"
          description="Track inbound sources and campaign performance"
        />

        {/* Key Metrics */}
        <Grid columns={{ xs: '1fr', md: getMetricsColumns() }} gap={cardPadding.toString() as any}>
          <MetricCard
            label="Total Visitors"
            value={56225}
            change={48912}
            showChange={true}
            formatValue={formatLongNumber}
          />
          <MetricCard
            label="Conversion Rate"
            value={3.8}
            change={3.2}
            showChange={showConversionRate}
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
          <MetricCard
            label="Cost per Acquisition"
            value={24.50}
            change={28.75}
            showChange={true}
            reverseColors={true}
            formatValue={(v) => `$${v.toFixed(2)}`}
          />
          <MetricCard
            label="Marketing ROI"
            value={342}
            change={287}
            showChange={true}
            formatValue={(v) => `${v.toFixed(0)}%`}
          />
          <MetricCard
            label="Attributed Revenue"
            value={187500}
            change={156200}
            showChange={true}
            formatValue={(v) => formatLongCurrency(v, 'USD')}
          />
        </Grid>

        {/* Channel Traffic Over Time */}
        <Panel title="Traffic by Channel Over Time">
          <BarChart
            chartData={channelChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            renderXLabel={renderXLabel}
            height={`${chartHeight}px`}
            stacked={true}
          />
        </Panel>

        {/* Traffic Sources and Campaign Performance */}
        <GridRow layout="two">
          <Panel title="Traffic Sources">
            <ListTable
              data={trafficSourceData}
              title="Source"
              metric="Visitors"
              showPercentage={true}
            />
          </Panel>
          <Panel title="Campaign Performance">
            <ListTable
              data={campaignPerformance}
              title="Campaign"
              metric="Conversions"
              showPercentage={true}
            />
          </Panel>
        </GridRow>

        {/* Channel Breakdown and UTM Analysis */}
        <GridRow layout="three">
          <Panel title="Channel Distribution">
            <Column alignItems="center" paddingY="4">
              <PieChart
                type="doughnut"
                chartData={channelBreakdown}
                height="220px"
                width="220px"
              />
            </Column>
          </Panel>
          <Panel title="Top Landing Pages">
            <ListTable
              data={landingPageData}
              title="Page"
              metric="Entries"
              showPercentage={true}
            />
          </Panel>
          <Panel title="UTM Parameters">
            <ListTable
              data={utmCampaignData}
              title="Parameter"
              metric="Sessions"
              showPercentage={true}
            />
          </Panel>
        </GridRow>

        {/* Attribution Insights */}
        <Panel title="Attribution Insights">
          <Grid columns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap="4">
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">First Touch Attribution</Text>
              <Text size="6" weight="bold">Organic Search</Text>
              <Text size="1" color="muted">42% of conversions</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">Last Touch Attribution</Text>
              <Text size="6" weight="bold">Direct</Text>
              <Text size="1" color="muted">38% of conversions</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">Avg. Touchpoints</Text>
              <Text size="6" weight="bold">3.2</Text>
              <Text size="1" color="muted">Before conversion</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius="2">
              <Text size="1" color="muted">Avg. Time to Convert</Text>
              <Text size="6" weight="bold">4.7 days</Text>
              <Text size="1" color="muted">From first visit</Text>
            </Column>
          </Grid>
        </Panel>

        {/* Geographic Performance */}
        <Panel title="Conversions by Region">
          <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="4">
            <ListTable
              data={geoConversionData}
              title="Country"
              metric="Conversions"
              showPercentage={true}
            />
            <Column gap="3">
              <Column padding="4" backgroundColor="2" borderRadius="2">
                <Text size="1" color="muted">Top Converting Region</Text>
                <Text size="5" weight="bold">North America</Text>
                <Text size="2" color="muted">54% of total conversions</Text>
              </Column>
              <Column padding="4" backgroundColor="2" borderRadius="2">
                <Text size="1" color="muted">Fastest Growing Region</Text>
                <Text size="5" weight="bold">APAC</Text>
                <Text size="2" color="muted">+127% YoY growth</Text>
              </Column>
              <Column padding="4" backgroundColor="2" borderRadius="2">
                <Text size="1" color="muted">Best ROI Region</Text>
                <Text size="5" weight="bold">EMEA</Text>
                <Text size="2" color="muted">$18.20 CPA</Text>
              </Column>
            </Column>
          </Grid>
        </Panel>
      </Column>
    </PageBody>
  );
}

export default function MarketingAttributionPage() {
  return (
    <DialsProvider projectId="marketing-attribution">
      <MarketingAttributionDashboard />
    </DialsProvider>
  );
}
