'use client';

import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, Box } from '@umami/react-zen';
import { useDynamicColor, useDynamicVariant, useDynamicBoolean, useDynamicNumber } from '@niteshift/dials';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { CHART_COLORS } from '@/lib/constants';
import { formatLongNumber } from '@/lib/format';
import { renderDateLabels } from '@/lib/charts';

// Mock data generators for marketing attribution
function generateTrafficSourceData() {
  return [
    { source: 'Google Organic', visitors: 45230, conversions: 2156, revenue: 215600, cpc: 0, roas: null },
    { source: 'Google Ads', visitors: 28540, conversions: 1842, revenue: 184200, cpc: 2.45, roas: 4.2 },
    { source: 'Facebook Ads', visitors: 18320, conversions: 892, revenue: 89200, cpc: 1.85, roas: 3.1 },
    { source: 'Direct', visitors: 15840, conversions: 1248, revenue: 124800, cpc: 0, roas: null },
    { source: 'Twitter/X', visitors: 8920, conversions: 312, revenue: 31200, cpc: 3.20, roas: 2.1 },
    { source: 'LinkedIn Ads', visitors: 6540, conversions: 524, revenue: 78600, cpc: 8.50, roas: 2.8 },
    { source: 'Email', visitors: 12450, conversions: 1124, revenue: 168600, cpc: 0.12, roas: 42.1 },
    { source: 'Referral', visitors: 9830, conversions: 428, revenue: 42800, cpc: 0, roas: null },
  ];
}

function generateCampaignData() {
  return [
    { name: 'Black Friday 2024', status: 'active', spend: 45000, impressions: 2450000, clicks: 89200, conversions: 4520, revenue: 452000, roi: 904 },
    { name: 'Holiday Season', status: 'active', spend: 38000, impressions: 1890000, clicks: 72400, conversions: 3180, revenue: 318000, roi: 737 },
    { name: 'Product Launch Q4', status: 'active', spend: 25000, impressions: 1240000, clicks: 48200, conversions: 1890, revenue: 189000, roi: 656 },
    { name: 'Retargeting - Cart', status: 'active', spend: 12000, impressions: 890000, clicks: 32100, conversions: 2840, revenue: 142000, roi: 1083 },
    { name: 'Brand Awareness', status: 'paused', spend: 18000, impressions: 3200000, clicks: 28400, conversions: 420, revenue: 42000, roi: 133 },
    { name: 'Newsletter Signup', status: 'active', spend: 8500, impressions: 620000, clicks: 18900, conversions: 3240, revenue: 48600, roi: 472 },
  ];
}

function generateDailyTrafficData() {
  const now = new Date();
  const channels = ['Organic', 'Paid Search', 'Social', 'Direct', 'Email'];
  const data: Record<string, { x: string; y: number }[]> = {};

  channels.forEach(channel => {
    data[channel] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      let baseValue = 0;
      switch (channel) {
        case 'Organic': baseValue = 1500 + Math.floor(Math.random() * 400); break;
        case 'Paid Search': baseValue = 950 + Math.floor(Math.random() * 300); break;
        case 'Social': baseValue = 600 + Math.floor(Math.random() * 200); break;
        case 'Direct': baseValue = 520 + Math.floor(Math.random() * 150); break;
        case 'Email': baseValue = 400 + Math.floor(Math.random() * 180); break;
      }
      // Add weekend dip for work-related traffic
      const dayOfWeek = date.getDay();
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.6 : 1;
      data[channel].push({
        x: date.toISOString().split('T')[0],
        y: Math.floor(baseValue * weekendFactor),
      });
    }
  });
  return data;
}

function generateConversionPathData() {
  return [
    { path: 'Google Ads > Direct > Purchase', conversions: 1842, value: 184200, touchpoints: 2 },
    { path: 'Organic > Email > Purchase', conversions: 1524, value: 152400, touchpoints: 2 },
    { path: 'Social > Organic > Direct > Purchase', conversions: 892, value: 89200, touchpoints: 3 },
    { path: 'Direct > Purchase', conversions: 756, value: 75600, touchpoints: 1 },
    { path: 'Email > Purchase', conversions: 624, value: 93600, touchpoints: 1 },
    { path: 'Referral > Organic > Purchase', conversions: 428, value: 42800, touchpoints: 2 },
  ];
}

function generateUtmData() {
  return {
    campaigns: [
      { name: 'black_friday_2024', clicks: 45200, conversions: 2156 },
      { name: 'holiday_promo', clicks: 38400, conversions: 1842 },
      { name: 'product_launch', clicks: 28900, conversions: 1124 },
      { name: 'newsletter_q4', clicks: 18200, conversions: 892 },
    ],
    mediums: [
      { name: 'cpc', clicks: 89200, conversions: 4520 },
      { name: 'email', clicks: 45600, conversions: 3180 },
      { name: 'organic', clicks: 62400, conversions: 2840 },
      { name: 'social', clicks: 28400, conversions: 892 },
    ],
    sources: [
      { name: 'google', clicks: 124500, conversions: 6240 },
      { name: 'facebook', clicks: 38200, conversions: 1520 },
      { name: 'newsletter', clicks: 28400, conversions: 2180 },
      { name: 'twitter', clicks: 12800, conversions: 420 },
    ],
  };
}

// Channel Distribution Pie Chart Component
function ChannelPieChart({ data, primaryColor }: { data: any[]; primaryColor: string }) {
  const chartData = useMemo(() => ({
    labels: data.slice(0, 6).map(d => d.source),
    datasets: [{
      data: data.slice(0, 6).map(d => d.visitors),
      backgroundColor: CHART_COLORS.slice(0, 6),
      borderWidth: 0,
    }],
  }), [data]);

  return <PieChart type="doughnut" chartData={chartData} height="220px" />;
}

// UTM Parameters Table Component
function UtmTable({ title, data }: { title: string; data: { name: string; clicks: number; conversions: number }[] }) {
  return (
    <Column gap="2">
      <Text size="2" weight="bold">{title}</Text>
      <Column gap="1">
        {data.map((item) => (
          <Row key={item.name} justifyContent="space-between" alignItems="center" style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
            <Text size="1" style={{ fontFamily: 'monospace' }}>{item.name}</Text>
            <Row gap="4">
              <Text size="1">{formatLongNumber(item.clicks)} clicks</Text>
              <Text size="1" weight="medium" style={{ color: '#30a46c' }}>{formatLongNumber(item.conversions)} conv</Text>
            </Row>
          </Row>
        ))}
      </Column>
    </Column>
  );
}

export default function MarketingAttributionPage() {
  // Dials for customization
  const primaryColor = useDynamicColor('ma-primary-color', {
    label: 'Primary Color',
    description: 'Main accent color for charts',
    default: '#30a46c',
    options: ['#30a46c', '#2680eb', '#8e4ec6', '#f76b15', '#e5484d'],
    group: 'Colors',
  });

  const attributionModel = useDynamicVariant('ma-attribution-model', {
    label: 'Attribution Model',
    description: 'Model used for conversion attribution',
    default: 'last-touch',
    options: ['first-touch', 'last-touch', 'linear', 'time-decay', 'position-based'] as const,
    group: 'Attribution',
  });

  const showRoas = useDynamicBoolean('ma-show-roas', {
    label: 'Show ROAS',
    description: 'Display Return on Ad Spend metrics',
    default: true,
    group: 'Visibility',
  });

  const chartHeight = useDynamicNumber('ma-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts in pixels',
    default: 280,
    min: 200,
    max: 450,
    step: 50,
    unit: 'px',
    group: 'Layout',
  });

  const tableStyle = useDynamicVariant('ma-table-style', {
    label: 'Table Style',
    description: 'Visual style for data tables',
    default: 'striped',
    options: ['striped', 'bordered', 'minimal'] as const,
    group: 'Style',
  });

  const channelLayout = useDynamicVariant('ma-channel-layout', {
    label: 'Channel View',
    description: 'How to display channel breakdown',
    default: 'table',
    options: ['table', 'cards', 'chart'] as const,
    group: 'Layout',
  });

  // Generate mock data
  const trafficSourceData = useMemo(() => generateTrafficSourceData(), []);
  const campaignData = useMemo(() => generateCampaignData(), []);
  const dailyTrafficData = useMemo(() => generateDailyTrafficData(), []);
  const conversionPathData = useMemo(() => generateConversionPathData(), []);
  const utmData = useMemo(() => generateUtmData(), []);

  // Traffic by channel chart data
  const trafficChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Organic',
        data: dailyTrafficData['Organic'],
        backgroundColor: `${CHART_COLORS[0]}99`,
        borderColor: CHART_COLORS[0],
        borderWidth: 1,
        stack: 'traffic',
      },
      {
        type: 'bar' as const,
        label: 'Paid Search',
        data: dailyTrafficData['Paid Search'],
        backgroundColor: `${CHART_COLORS[1]}99`,
        borderColor: CHART_COLORS[1],
        borderWidth: 1,
        stack: 'traffic',
      },
      {
        type: 'bar' as const,
        label: 'Social',
        data: dailyTrafficData['Social'],
        backgroundColor: `${CHART_COLORS[2]}99`,
        borderColor: CHART_COLORS[2],
        borderWidth: 1,
        stack: 'traffic',
      },
      {
        type: 'bar' as const,
        label: 'Direct',
        data: dailyTrafficData['Direct'],
        backgroundColor: `${CHART_COLORS[3]}99`,
        borderColor: CHART_COLORS[3],
        borderWidth: 1,
        stack: 'traffic',
      },
      {
        type: 'bar' as const,
        label: 'Email',
        data: dailyTrafficData['Email'],
        backgroundColor: `${CHART_COLORS[4]}99`,
        borderColor: CHART_COLORS[4],
        borderWidth: 1,
        stack: 'traffic',
      },
    ],
  }), [dailyTrafficData]);

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Calculate date range for charts
  const dateRange = useMemo(() => {
    const now = new Date();
    const minDate = new Date(now);
    minDate.setDate(minDate.getDate() - 29);
    return { minDate, maxDate: now };
  }, []);

  // Calculate totals
  const totalVisitors = trafficSourceData.reduce((sum, d) => sum + d.visitors, 0);
  const totalConversions = trafficSourceData.reduce((sum, d) => sum + d.conversions, 0);
  const totalRevenue = trafficSourceData.reduce((sum, d) => sum + d.revenue, 0);
  const overallConversionRate = ((totalConversions / totalVisitors) * 100).toFixed(2);
  const totalAdSpend = campaignData.reduce((sum, c) => sum + c.spend, 0);
  const avgRoas = totalRevenue / totalAdSpend;

  const getTableRowStyle = (idx: number) => {
    if (tableStyle === 'striped') {
      return { backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'transparent', padding: '8px 4px' };
    }
    if (tableStyle === 'bordered') {
      return { borderBottom: '1px solid #e0e0e0', padding: '8px 4px' };
    }
    return { padding: '8px 4px' };
  };

  return (
    <PageBody>
      <Column gap="6" padding="4">
        <PageHeader title="Marketing Attribution" />
        <Row gap="2" alignItems="center" style={{ marginTop: '-12px' }}>
          <Text size="2" style={{ color: '#666' }}>
            Track inbound sources and campaign performance
          </Text>
          <Box style={{ padding: '2px 8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <Text size="1" weight="medium">Model: {attributionModel.replace('-', ' ')}</Text>
          </Box>
        </Row>

        {/* Key Metrics */}
        <Row gap="4" style={{ overflowX: 'auto' }}>
          <MetricCard
            label="Total Visitors"
            value={totalVisitors}
            change={totalVisitors * 0.15}
            showChange
            showLabel
          />
          <MetricCard
            label="Conversions"
            value={totalConversions}
            change={totalConversions * 0.22}
            showChange
            showLabel
          />
          <MetricCard
            label="Conversion Rate"
            value={parseFloat(overallConversionRate)}
            formatValue={(n) => `${n.toFixed(2)}%`}
            change={0.35}
            showChange
            showLabel
          />
          <MetricCard
            label="Total Revenue"
            value={totalRevenue}
            formatValue={(n) => `$${formatLongNumber(n)}`}
            change={totalRevenue * 0.18}
            showChange
            showLabel
          />
          {showRoas && (
            <MetricCard
              label="Avg ROAS"
              value={avgRoas}
              formatValue={(n) => `${n.toFixed(1)}x`}
              change={0.4}
              showChange
              showLabel
            />
          )}
        </Row>

        {/* Traffic Trends Chart */}
        <Panel title="Traffic by Channel">
          <BarChart
            chartData={trafficChartData}
            unit="day"
            height={`${chartHeight}px`}
            stacked
            renderXLabel={renderXLabel}
            minDate={dateRange.minDate}
            maxDate={dateRange.maxDate}
          />
        </Panel>

        {/* Traffic Sources + Channel Distribution */}
        <Grid columns={{ xs: '1', lg: '3' }} gap="4">
          <Column gap="4" style={{ gridColumn: 'span 2' }}>
            <Panel title="Traffic Sources Performance">
              <Column gap="1">
                <Row gap="2" style={{ borderBottom: '2px solid #e0e0e0', paddingBottom: '8px', marginBottom: '4px' }}>
                  <Text size="1" weight="bold" style={{ flex: 2 }}>Source</Text>
                  <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Visitors</Text>
                  <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Conv.</Text>
                  <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Revenue</Text>
                  {showRoas && <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>ROAS</Text>}
                </Row>
                {trafficSourceData.map((source, idx) => (
                  <Row key={source.source} gap="2" style={getTableRowStyle(idx)}>
                    <Text size="2" style={{ flex: 2 }}>{source.source}</Text>
                    <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(source.visitors)}</Text>
                    <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(source.conversions)}</Text>
                    <Text size="2" style={{ flex: 1, textAlign: 'right' }}>${formatLongNumber(source.revenue)}</Text>
                    {showRoas && (
                      <Text size="2" style={{ flex: 1, textAlign: 'right', color: source.roas ? (source.roas > 3 ? '#30a46c' : source.roas > 1.5 ? '#ffc53d' : '#e5484d') : '#999' }}>
                        {source.roas ? `${source.roas}x` : '-'}
                      </Text>
                    )}
                  </Row>
                ))}
              </Column>
            </Panel>
          </Column>

          <Panel title="Channel Distribution">
            <Column gap="4" alignItems="center">
              <ChannelPieChart data={trafficSourceData} primaryColor={primaryColor} />
              <Column gap="2" style={{ width: '100%' }}>
                {trafficSourceData.slice(0, 5).map((source, idx) => (
                  <Row key={source.source} justifyContent="space-between" alignItems="center">
                    <Row gap="2" alignItems="center">
                      <Box style={{ width: '10px', height: '10px', backgroundColor: CHART_COLORS[idx], borderRadius: '2px' }} />
                      <Text size="1">{source.source}</Text>
                    </Row>
                    <Text size="1" weight="medium">{((source.visitors / totalVisitors) * 100).toFixed(1)}%</Text>
                  </Row>
                ))}
              </Column>
            </Column>
          </Panel>
        </Grid>

        {/* Campaign Performance */}
        <Panel title="Campaign Performance">
          <Column gap="1">
            <Row gap="2" style={{ borderBottom: '2px solid #e0e0e0', paddingBottom: '8px', marginBottom: '4px' }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>Campaign</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>Status</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Spend</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Clicks</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Conv.</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Revenue</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>ROI</Text>
            </Row>
            {campaignData.map((campaign, idx) => (
              <Row key={campaign.name} gap="2" style={getTableRowStyle(idx)}>
                <Text size="2" style={{ flex: 2 }}>{campaign.name}</Text>
                <Box style={{ flex: 1, textAlign: 'center' }}>
                  <Box
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: campaign.status === 'active' ? '#d4edda' : '#f8d7da',
                      color: campaign.status === 'active' ? '#155724' : '#721c24',
                    }}
                  >
                    <Text size="0">{campaign.status}</Text>
                  </Box>
                </Box>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>${formatLongNumber(campaign.spend)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(campaign.clicks)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatLongNumber(campaign.conversions)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>${formatLongNumber(campaign.revenue)}</Text>
                <Text size="2" weight="medium" style={{ flex: 1, textAlign: 'right', color: campaign.roi > 500 ? '#30a46c' : campaign.roi > 200 ? '#ffc53d' : '#e5484d' }}>
                  {campaign.roi}%
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Conversion Paths + UTM Parameters */}
        <Grid columns={{ xs: '1', lg: '2' }} gap="4">
          <Panel title="Top Conversion Paths">
            <Column gap="2">
              {conversionPathData.map((path, idx) => (
                <Column key={idx} gap="1" style={{ padding: '8px', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'transparent', borderRadius: '4px' }}>
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="1" style={{ fontFamily: 'monospace', color: '#666' }}>{path.path}</Text>
                    <Text size="1" style={{ color: '#999' }}>{path.touchpoints} touchpoints</Text>
                  </Row>
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="2" weight="medium">{formatLongNumber(path.conversions)} conversions</Text>
                    <Text size="2" weight="medium" style={{ color: primaryColor }}>${formatLongNumber(path.value)}</Text>
                  </Row>
                </Column>
              ))}
            </Column>
          </Panel>

          <Panel title="UTM Parameters">
            <Grid columns="3" gap="4">
              <UtmTable title="Campaigns" data={utmData.campaigns} />
              <UtmTable title="Mediums" data={utmData.mediums} />
              <UtmTable title="Sources" data={utmData.sources} />
            </Grid>
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
