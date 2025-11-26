'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Heading, Text, Box, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatLongNumber, formatShortTime } from '@/lib/format';
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

// Generate comprehensive data combining all persona views
function generateHybridData(dates: Date[]) {
  return dates.map((date) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const monthProgress = date.getDate() / 30;
    const endOfMonthMultiplier = monthProgress > 0.8 ? 1.2 : 1;
    const variance = Math.random() * 0.2 - 0.1;

    return {
      date: date.toISOString(),
      // Product metrics
      pageViews: Math.round((isWeekend ? 8500 : 12500) * (1 + variance)),
      sessions: Math.round((isWeekend ? 4200 : 6800) * (1 + variance)),
      // Marketing metrics
      organicTraffic: Math.round((isWeekend ? 3200 : 4800) * (1 + variance)),
      paidTraffic: Math.round((isWeekend ? 1800 : 3200) * (1 + variance)),
      // Revenue metrics
      revenue: Math.round((isWeekend ? 25000 : 65000) * endOfMonthMultiplier * (1 + variance)),
      conversions: Math.round((isWeekend ? 120 : 380) * (1 + variance)),
    };
  });
}

// Top performing content
const topContent = [
  { path: '/products/bestsellers', views: 45230, conversions: 1809, revenue: 108540 },
  { path: '/promo/black-friday', views: 38900, conversions: 1556, revenue: 93360 },
  { path: '/collections/holiday', views: 32100, conversions: 963, revenue: 57780 },
  { path: '/products/new-arrivals', views: 28400, conversions: 852, revenue: 51120 },
  { path: '/blog/gift-guide', views: 24200, conversions: 484, revenue: 29040 },
];

// Channel performance summary
const channelSummary = [
  { channel: 'Organic Search', visitors: 142500, conversions: 4275, revenue: 285000, cost: 0 },
  { channel: 'Google Ads', visitors: 89200, conversions: 3568, revenue: 214080, cost: 151620 },
  { channel: 'Facebook Ads', visitors: 67800, conversions: 2034, revenue: 101700, cost: 77760 },
  { channel: 'Email', visitors: 34500, conversions: 2415, revenue: 168000, cost: 20550 },
  { channel: 'Direct', visitors: 52300, conversions: 1569, revenue: 94140, cost: 0 },
];

// Key accounts spotlight
const keyAccounts = [
  { name: 'Acme Corp', arr: 245000, health: 92, expansion: 45000, activity: 'high' },
  { name: 'TechFlow Inc', arr: 189000, health: 78, expansion: 28000, activity: 'medium' },
  { name: 'GlobalScale', arr: 156000, health: 45, expansion: 0, activity: 'low' },
];

// Funnel metrics
const funnelData = [
  { stage: 'Visitors', value: 415200, percent: 100 },
  { stage: 'Engaged', value: 228360, percent: 55 },
  { stage: 'Leads', value: 41520, percent: 10 },
  { stage: 'Qualified', value: 16608, percent: 4 },
  { stage: 'Customers', value: 6228, percent: 1.5 },
];

// Real-time activity
const realtimeActivity = [
  { metric: 'Active Users', value: 847, trend: 12 },
  { metric: 'Pages/Session', value: 4.2, trend: 5 },
  { metric: 'Live Revenue', value: 12450, trend: 8 },
  { metric: 'Cart Adds', value: 156, trend: -3 },
];

// Traffic source breakdown for pie chart
const trafficSourceBreakdown = [
  { source: 'Organic', value: 35 },
  { source: 'Paid', value: 28 },
  { source: 'Social', value: 15 },
  { source: 'Email', value: 12 },
  { source: 'Direct', value: 10 },
];

export default function HybridDashboardPage() {
  // Layout dials
  const dashboardDensity = useDynamicVariant('hd-density', {
    label: 'Dashboard Density',
    description: 'Information density level',
    default: 'comfortable',
    options: ['compact', 'comfortable', 'spacious'] as const,
    group: 'Layout',
  });

  const primaryFocus = useDynamicVariant('hd-primary-focus', {
    label: 'Primary Focus',
    description: 'Which metrics to emphasize',
    default: 'balanced',
    options: ['product', 'marketing', 'revenue', 'balanced'] as const,
    group: 'Layout',
  });

  const showRealtime = useDynamicBoolean('hd-show-realtime', {
    label: 'Show Real-time',
    description: 'Display real-time activity panel',
    default: true,
    group: 'Sections',
  });

  const showFunnel = useDynamicBoolean('hd-show-funnel', {
    label: 'Show Funnel',
    description: 'Display conversion funnel',
    default: true,
    group: 'Sections',
  });

  const showAccounts = useDynamicBoolean('hd-show-accounts', {
    label: 'Show Accounts',
    description: 'Display key accounts spotlight',
    default: true,
    group: 'Sections',
  });

  const showChannels = useDynamicBoolean('hd-show-channels', {
    label: 'Show Channels',
    description: 'Display channel performance',
    default: true,
    group: 'Sections',
  });

  // Color dials
  const productColor = useDynamicColor('hd-product-color', {
    label: 'Product Metrics Color',
    description: 'Color for product analytics',
    default: '#2680eb',
    options: ['#2680eb', '#3e63dd', '#0090ff', '#5b5bd6'],
    allowCustom: true,
    group: 'Colors',
  });

  const marketingColor = useDynamicColor('hd-marketing-color', {
    label: 'Marketing Metrics Color',
    description: 'Color for marketing metrics',
    default: '#9256d9',
    options: ['#9256d9', '#6734bc', '#8e4ec6', '#ec1562'],
    allowCustom: true,
    group: 'Colors',
  });

  const revenueColor = useDynamicColor('hd-revenue-color', {
    label: 'Revenue Metrics Color',
    description: 'Color for revenue metrics',
    default: '#44b556',
    options: ['#44b556', '#30a46c', '#89c541', '#3e9b4f'],
    allowCustom: true,
    group: 'Colors',
  });

  const alertColor = useDynamicColor('hd-alert-color', {
    label: 'Alert Color',
    description: 'Color for alerts and warnings',
    default: '#e68619',
    options: ['#e68619', '#f7bd12', '#e34850', '#ffc301'],
    allowCustom: true,
    group: 'Colors',
  });

  // Typography dials
  const headingSize = useDynamicVariant('hd-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '4',
    options: ['3', '4', '5'] as const,
    group: 'Typography',
  });

  const metricValueSize = useDynamicVariant('hd-metric-value-size', {
    label: 'Metric Value Size',
    description: 'Size of metric values',
    default: '7',
    options: ['6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  const labelWeight = useDynamicVariant('hd-label-weight', {
    label: 'Label Weight',
    description: 'Font weight for labels',
    default: 'medium',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography',
  });

  // Spacing dials
  const sectionGap = useDynamicSpacing('hd-section-gap', {
    label: 'Section Gap',
    description: 'Space between sections',
    default: '20px',
    options: ['12px', '16px', '20px', '24px', '32px'],
    group: 'Spacing',
  });

  const cardPadding = useDynamicSpacing('hd-card-padding', {
    label: 'Card Padding',
    description: 'Padding inside cards',
    default: '16px',
    options: ['12px', '16px', '20px', '24px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('hd-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts',
    default: 300,
    min: 200,
    max: 450,
    step: 50,
    unit: 'px',
    group: 'Visualization',
  });

  // Generate chart data
  const dates = useMemo(() => generateDates(30), []);
  const hybridData = useMemo(() => generateHybridData(dates), [dates]);

  const combinedChartData = useMemo(() => {
    return {
      labels: hybridData.map((d) => d.date),
      datasets: [
        {
          label: 'Revenue',
          data: hybridData.map((d) => ({ x: d.date, y: d.revenue })),
          backgroundColor: revenueColor,
          borderColor: revenueColor,
          borderWidth: 0,
          barPercentage: 0.7,
          categoryPercentage: 0.85,
          order: 1,
          yAxisID: 'y',
        },
        {
          label: 'Conversions',
          data: hybridData.map((d) => ({ x: d.date, y: d.conversions })),
          type: 'line' as const,
          borderColor: marketingColor,
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          order: 0,
          yAxisID: 'y1',
        },
      ],
    };
  }, [hybridData, revenueColor, marketingColor]);

  const trafficChartData = useMemo(() => {
    return {
      labels: trafficSourceBreakdown.map((d) => d.source),
      datasets: [
        {
          data: trafficSourceBreakdown.map((d) => d.value),
          backgroundColor: [productColor, marketingColor, revenueColor, alertColor, '#01bad7'],
          borderWidth: 0,
        },
      ],
    };
  }, [productColor, marketingColor, revenueColor, alertColor]);

  // Calculate summary metrics
  const totalRevenue = hybridData.reduce((sum, d) => sum + d.revenue, 0);
  const totalPageViews = hybridData.reduce((sum, d) => sum + d.pageViews, 0);
  const totalSessions = hybridData.reduce((sum, d) => sum + d.sessions, 0);
  const totalConversions = hybridData.reduce((sum, d) => sum + d.conversions, 0);
  const conversionRate = (totalConversions / totalSessions * 100);
  const avgOrderValue = totalRevenue / totalConversions;

  const getHealthColor = (health: number) => {
    if (health >= 80) return revenueColor;
    if (health >= 60) return alertColor;
    return '#e34850';
  };

  const gapStyle = { gap: sectionGap };
  const paddingStyle = { padding: cardPadding };

  return (
    <Column style={gapStyle} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="6">Hybrid Dashboard</Heading>
          <Text color="muted">Unified view of product, marketing, and revenue metrics</Text>
        </Column>
        <Row gap="3" alignItems="center">
          {showRealtime && (
            <Box
              style={{
                padding: '4px 12px',
                borderRadius: '16px',
                backgroundColor: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Box
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: revenueColor,
                  animation: 'pulse 2s infinite'
                }}
              />
              <Text size="1" style={{ color: '#166534' }}>Live</Text>
            </Box>
          )}
          <Text color="muted" size="1">Last 30 days</Text>
        </Row>
      </Row>

      {/* Key Metrics Bar - Comprehensive */}
      <MetricsBar>
        <MetricCard
          label="Total Revenue"
          value={totalRevenue}
          change={totalRevenue * 0.91}
          formatValue={(v) => `$${formatLongNumber(v)}`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
          labelWeight={labelWeight as any}
          valueColor={revenueColor}
        />
        <MetricCard
          label="Conversions"
          value={totalConversions}
          change={totalConversions * 0.88}
          formatValue={formatLongNumber}
          showChange
          showLabel
          valueSize={metricValueSize as any}
          labelWeight={labelWeight as any}
          valueColor={marketingColor}
        />
        <MetricCard
          label="Page Views"
          value={totalPageViews}
          change={totalPageViews * 0.93}
          formatValue={formatLongNumber}
          showChange
          showLabel
          valueSize={metricValueSize as any}
          labelWeight={labelWeight as any}
          valueColor={productColor}
        />
        <MetricCard
          label="Conv. Rate"
          value={conversionRate}
          change={3.6}
          formatValue={(v) => `${v.toFixed(1)}%`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
          labelWeight={labelWeight as any}
        />
        <MetricCard
          label="Avg. Order Value"
          value={avgOrderValue}
          change={avgOrderValue * 0.95}
          formatValue={(v) => `$${v.toFixed(0)}`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
          labelWeight={labelWeight as any}
        />
      </MetricsBar>

      {/* Real-time Activity Strip */}
      {showRealtime && (
        <Grid columns={{ xs: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="3">
          {realtimeActivity.map((item) => (
            <Box
              key={item.metric}
              style={{
                ...paddingStyle,
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}
            >
              <Row justifyContent="space-between" alignItems="flex-start">
                <Column gap="1">
                  <Text size="1" color="muted">{item.metric}</Text>
                  <Text size="5" weight="bold">
                    {item.metric === 'Live Revenue' ? `$${formatLongNumber(item.value)}` :
                     item.metric === 'Pages/Session' ? item.value.toFixed(1) :
                     formatLongNumber(item.value)}
                  </Text>
                </Column>
                <Text
                  size="1"
                  style={{
                    color: item.trend >= 0 ? revenueColor : '#e34850',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: item.trend >= 0 ? '#dcfce7' : '#fecaca'
                  }}
                >
                  {item.trend >= 0 ? '+' : ''}{item.trend}%
                </Text>
              </Row>
            </Box>
          ))}
        </Grid>
      )}

      {/* Main Chart - Revenue & Conversions */}
      <Panel>
        <Row justifyContent="space-between" alignItems="center">
          <Heading size={headingSize as any}>Revenue & Conversions Trend</Heading>
          <Row gap="4">
            <Row gap="2" alignItems="center">
              <Box style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: revenueColor }} />
              <Text size="1">Revenue</Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Box style={{ width: '12px', height: '3px', backgroundColor: marketingColor }} />
              <Text size="1">Conversions</Text>
            </Row>
          </Row>
        </Row>
        <Box height={`${chartHeight}px`}>
          <BarChart
            chartData={combinedChartData}
            unit="day"
            stacked={false}
            currency="USD"
            minDate={dates[0]}
            maxDate={dates[dates.length - 1]}
            height={`${chartHeight}px`}
          />
        </Box>
      </Panel>

      {/* Three-column layout */}
      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="3">
        {/* Conversion Funnel */}
        {showFunnel && (
          <Panel>
            <Heading size={headingSize as any}>Conversion Funnel</Heading>
            <Column gap="2">
              {funnelData.map((stage, index) => {
                const width = stage.percent;
                return (
                  <Column key={stage.stage} gap="1">
                    <Row justifyContent="space-between">
                      <Text size="2">{stage.stage}</Text>
                      <Text size="2" weight="medium">{formatLongNumber(stage.value)}</Text>
                    </Row>
                    <Box
                      style={{
                        width: '100%',
                        height: '28px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <Box
                        style={{
                          width: `${width}%`,
                          height: '100%',
                          backgroundColor: CHART_COLORS[index],
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: width > 10 ? 'auto' : '40px'
                        }}
                      >
                        <Text size="1" style={{ color: 'white' }}>{stage.percent}%</Text>
                      </Box>
                    </Box>
                  </Column>
                );
              })}
            </Column>
          </Panel>
        )}

        {/* Traffic Sources */}
        <Panel>
          <Heading size={headingSize as any}>Traffic Sources</Heading>
          <Column alignItems="center" gap="4">
            <Box height="160px" width="160px">
              <PieChart type="doughnut" chartData={trafficChartData} height="160px" />
            </Box>
            <Grid columns="repeat(2, 1fr)" gap="2" style={{ width: '100%' }}>
              {trafficSourceBreakdown.map((source, index) => (
                <Row key={source.source} gap="2" alignItems="center">
                  <Box
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '2px',
                      backgroundColor: [productColor, marketingColor, revenueColor, alertColor, '#01bad7'][index]
                    }}
                  />
                  <Text size="1">{source.source}</Text>
                  <Text size="1" weight="bold">{source.value}%</Text>
                </Row>
              ))}
            </Grid>
          </Column>
        </Panel>

        {/* Key Accounts */}
        {showAccounts && (
          <Panel>
            <Heading size={headingSize as any}>Key Accounts</Heading>
            <Column gap="3">
              {keyAccounts.map((account) => (
                <Column
                  key={account.name}
                  padding="3"
                  border
                  borderRadius="2"
                  gap="2"
                >
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="2" weight="medium">{account.name}</Text>
                    <Box
                      style={{
                        width: '32px',
                        padding: '2px',
                        borderRadius: '4px',
                        backgroundColor: getHealthColor(account.health),
                        textAlign: 'center'
                      }}
                    >
                      <Text size="1" style={{ color: 'white' }}>{account.health}</Text>
                    </Box>
                  </Row>
                  <Row justifyContent="space-between">
                    <Column>
                      <Text size="1" color="muted">ARR</Text>
                      <Text size="2" weight="medium">${formatLongNumber(account.arr)}</Text>
                    </Column>
                    <Column alignItems="flex-end">
                      <Text size="1" color="muted">Expansion</Text>
                      <Text
                        size="2"
                        weight="medium"
                        style={{ color: account.expansion > 0 ? revenueColor : '#999' }}
                      >
                        {account.expansion > 0 ? `+$${formatLongNumber(account.expansion)}` : '-'}
                      </Text>
                    </Column>
                  </Row>
                </Column>
              ))}
            </Column>
          </Panel>
        )}
      </Grid>

      {/* Bottom section: Content & Channels */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        {/* Top Content */}
        <Panel>
          <Heading size={headingSize as any}>Top Converting Content</Heading>
          <Column gap="2">
            {topContent.map((content, index) => (
              <Row key={content.path} justifyContent="space-between" alignItems="center" paddingY="2">
                <Row gap="3" alignItems="center" style={{ flex: 2 }}>
                  <Text size="1" color="muted" style={{ width: '16px' }}>{index + 1}</Text>
                  <Text size="2" style={{ fontFamily: 'monospace', fontSize: '12px' }}>{content.path}</Text>
                </Row>
                <Row gap="3" alignItems="center">
                  <Column alignItems="flex-end">
                    <Text size="1" color="muted">Conv.</Text>
                    <Text size="2">{formatLongNumber(content.conversions)}</Text>
                  </Column>
                  <Column alignItems="flex-end" style={{ minWidth: '70px' }}>
                    <Text size="1" color="muted">Revenue</Text>
                    <Text size="2" weight="medium" style={{ color: revenueColor }}>
                      ${formatLongNumber(content.revenue)}
                    </Text>
                  </Column>
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Channel Performance */}
        {showChannels && (
          <Panel>
            <Heading size={headingSize as any}>Channel ROI</Heading>
            <Column gap="2">
              {channelSummary.map((channel, index) => {
                const roi = channel.cost > 0 ? ((channel.revenue - channel.cost) / channel.cost * 100) : null;
                return (
                  <Row key={channel.channel} justifyContent="space-between" alignItems="center" paddingY="2">
                    <Row gap="2" alignItems="center" style={{ flex: 1 }}>
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
                    <Row gap="4" alignItems="center">
                      <Column alignItems="flex-end">
                        <Text size="1" color="muted">Revenue</Text>
                        <Text size="2">${formatLongNumber(channel.revenue)}</Text>
                      </Column>
                      <Column alignItems="flex-end" style={{ minWidth: '60px' }}>
                        <Text size="1" color="muted">ROI</Text>
                        <Text
                          size="2"
                          weight="medium"
                          style={{ color: roi === null ? '#999' : roi > 100 ? revenueColor : roi > 0 ? alertColor : '#e34850' }}
                        >
                          {roi === null ? 'Organic' : `${roi.toFixed(0)}%`}
                        </Text>
                      </Column>
                    </Row>
                  </Row>
                );
              })}
            </Column>
          </Panel>
        )}
      </Grid>
    </Column>
  );
}
