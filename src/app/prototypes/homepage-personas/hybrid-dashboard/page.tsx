'use client';

import { useMemo, useCallback, useState } from 'react';
import { Column, Row, Grid, Text, Box, Button, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
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

// Combined mock data generators from all personas
function generateUnifiedTimeSeriesData() {
  const now = new Date();
  const data = {
    visitors: [] as { x: string; y: number }[],
    conversions: [] as { x: string; y: number }[],
    revenue: [] as { x: string; y: number }[],
    sessions: [] as { x: string; y: number }[],
  };

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    const dateStr = date.toISOString().split('T')[0];

    data.visitors.push({ x: dateStr, y: Math.floor((12000 + Math.random() * 3000) * weekendFactor) });
    data.conversions.push({ x: dateStr, y: Math.floor((420 + Math.random() * 120) * weekendFactor) });
    data.revenue.push({ x: dateStr, y: Math.floor((45000 + Math.random() * 15000) * weekendFactor) });
    data.sessions.push({ x: dateStr, y: Math.floor((8500 + Math.random() * 2000) * weekendFactor) });
  }
  return data;
}

function generateTopChannels() {
  return [
    { name: 'Google Organic', visitors: 45230, conversions: 2156, revenue: 215600 },
    { name: 'Google Ads', visitors: 28540, conversions: 1842, revenue: 184200 },
    { name: 'Direct', visitors: 15840, conversions: 1248, revenue: 124800 },
    { name: 'Email', visitors: 12450, conversions: 1124, revenue: 168600 },
    { name: 'Social', visitors: 8920, conversions: 512, revenue: 51200 },
  ];
}

function generateTopFeatures() {
  return [
    { name: 'Dashboard Views', users: 8432, engagement: 92 },
    { name: 'Report Builder', users: 3215, engagement: 78 },
    { name: 'Data Export', users: 2876, engagement: 65 },
    { name: 'Team Sharing', users: 1954, engagement: 84 },
    { name: 'API Integration', users: 1432, engagement: 71 },
  ];
}

function generatePipelineSummary() {
  return {
    total: 12850000,
    weighted: 6420000,
    deals: 245,
    avgDealSize: 52449,
  };
}

function generateAccountAlerts() {
  return [
    { account: 'InnovateCo', type: 'churn_risk', message: 'Health score dropped to 45%', severity: 'high' },
    { account: 'Startup Labs', type: 'renewal', message: 'Renewal in 45 days', severity: 'high' },
    { account: 'CloudFirst Ltd', type: 'engagement', message: 'No login in 14 days', severity: 'medium' },
    { account: 'TechStart Inc', type: 'expansion', message: 'Usage at 90% of plan', severity: 'low' },
  ];
}

function generateQuickStats() {
  return {
    mau: 142580,
    mauChange: 12.4,
    arr: 8130000,
    arrChange: 8.2,
    nps: 68,
    npsChange: 4,
    churnRate: 2.8,
    churnChange: -0.4,
  };
}

function generateConversionFunnel() {
  return [
    { step: 'Visitors', count: 145670, rate: 100 },
    { step: 'Engaged', count: 89420, rate: 61.4 },
    { step: 'Qualified', count: 28540, rate: 19.6 },
    { step: 'Converted', count: 8920, rate: 6.1 },
  ];
}

// Mini funnel component
function MiniFunnel({ data }: { data: any[] }) {
  return (
    <Column gap="2">
      {data.map((step, idx) => (
        <Row key={idx} alignItems="center" gap="2">
          <Text size="1" style={{ width: '70px' }}>{step.step}</Text>
          <Box style={{ flex: 1, height: '18px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
            <Box style={{ width: `${step.rate}%`, height: '100%', backgroundColor: CHART_COLORS[0], opacity: 1 - idx * 0.2 }} />
          </Box>
          <Text size="1" weight="medium" style={{ width: '45px', textAlign: 'right' }}>{step.rate}%</Text>
        </Row>
      ))}
    </Column>
  );
}

// Alert badge component
function AlertBadge({ severity }: { severity: string }) {
  const getColor = () => {
    if (severity === 'high') return { bg: '#f8d7da', text: '#721c24' };
    if (severity === 'medium') return { bg: '#fff3cd', text: '#856404' };
    return { bg: '#d4edda', text: '#155724' };
  };
  const colors = getColor();

  return (
    <Box style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: colors.bg }}>
      <Text size="0" weight="medium" style={{ color: colors.text }}>{severity}</Text>
    </Box>
  );
}

export default function HybridDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Dials for customization
  const primaryColor = useDynamicColor('hd-primary-color', {
    label: 'Primary Color',
    description: 'Main accent color for charts',
    default: '#3e63dd',
    options: ['#3e63dd', '#2680eb', '#30a46c', '#8e4ec6', '#f76b15'],
    group: 'Colors',
  });

  const dashboardLayout = useDynamicVariant('hd-layout', {
    label: 'Dashboard Layout',
    description: 'Overall layout structure',
    default: 'balanced',
    options: ['balanced', 'metrics-focused', 'visualization-focused', 'compact'] as const,
    group: 'Layout',
  });

  const showAlerts = useDynamicBoolean('hd-show-alerts', {
    label: 'Show Alerts',
    description: 'Display account/system alerts',
    default: true,
    group: 'Visibility',
  });

  const chartHeight = useDynamicNumber('hd-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts in pixels',
    default: 260,
    min: 180,
    max: 400,
    step: 40,
    unit: 'px',
    group: 'Layout',
  });

  const metricCardSize = useDynamicVariant('hd-metric-size', {
    label: 'Metric Card Size',
    description: 'Size of metric cards',
    default: 'medium',
    options: ['small', 'medium', 'large'] as const,
    group: 'Style',
  });

  const showMiniCharts = useDynamicBoolean('hd-show-mini-charts', {
    label: 'Show Mini Charts',
    description: 'Display sparkline charts in metrics',
    default: true,
    group: 'Visibility',
  });

  const colorScheme = useDynamicVariant('hd-color-scheme', {
    label: 'Color Scheme',
    description: 'Chart color palette',
    default: 'default',
    options: ['default', 'vibrant', 'muted', 'monochrome'] as const,
    group: 'Colors',
  });

  // Generate mock data
  const timeSeriesData = useMemo(() => generateUnifiedTimeSeriesData(), []);
  const topChannels = useMemo(() => generateTopChannels(), []);
  const topFeatures = useMemo(() => generateTopFeatures(), []);
  const pipelineSummary = useMemo(() => generatePipelineSummary(), []);
  const accountAlerts = useMemo(() => generateAccountAlerts(), []);
  const quickStats = useMemo(() => generateQuickStats(), []);
  const funnelData = useMemo(() => generateConversionFunnel(), []);

  // Get chart colors based on scheme
  const getChartColors = () => {
    switch (colorScheme) {
      case 'vibrant': return ['#e5484d', '#30a46c', '#0090ff', '#f76b15', '#8e4ec6'];
      case 'muted': return ['#8d8d8d', '#a1a1a1', '#b5b5b5', '#c9c9c9', '#dddddd'];
      case 'monochrome': return [primaryColor, `${primaryColor}cc`, `${primaryColor}99`, `${primaryColor}66`, `${primaryColor}33`];
      default: return CHART_COLORS;
    }
  };
  const chartColors = getChartColors();

  // Combined metrics chart
  const metricsChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Visitors',
        data: timeSeriesData.visitors,
        backgroundColor: `${chartColors[0]}66`,
        borderColor: chartColors[0],
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: 'Conversions',
        data: timeSeriesData.conversions,
        borderColor: chartColors[1],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 0,
        yAxisID: 'y1',
      },
    ],
  }), [timeSeriesData, chartColors]);

  // Revenue chart
  const revenueChartData = useMemo(() => ({
    datasets: [{
      type: 'bar' as const,
      label: 'Revenue',
      data: timeSeriesData.revenue,
      backgroundColor: `${chartColors[2]}66`,
      borderColor: chartColors[2],
      borderWidth: 1,
    }],
  }), [timeSeriesData, chartColors]);

  // Channel distribution pie
  const channelPieData = useMemo(() => ({
    labels: topChannels.map(c => c.name),
    datasets: [{
      data: topChannels.map(c => c.visitors),
      backgroundColor: chartColors.slice(0, 5),
      borderWidth: 0,
    }],
  }), [topChannels, chartColors]);

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Calculate date range for charts
  const dateRange = useMemo(() => {
    const now = new Date();
    const minDate = new Date(now);
    minDate.setDate(minDate.getDate() - 29);
    return { minDate, maxDate: now };
  }, []);

  // Calculate totals
  const totalVisitors = timeSeriesData.visitors.reduce((sum, d) => sum + d.y, 0);
  const totalConversions = timeSeriesData.conversions.reduce((sum, d) => sum + d.y, 0);
  const totalRevenue = timeSeriesData.revenue.reduce((sum, d) => sum + d.y, 0);
  const conversionRate = (totalConversions / totalVisitors) * 100;

  const getMetricValueSize = () => {
    switch (metricCardSize) {
      case 'small': return '5' as const;
      case 'large': return '9' as const;
      default: return '7' as const;
    }
  };

  const getGridColumns = () => {
    switch (dashboardLayout) {
      case 'metrics-focused': return { xs: '2', md: '3', lg: '6' };
      case 'compact': return { xs: '3', md: '4', lg: '6' };
      default: return { xs: '2', md: '3', lg: '5' };
    }
  };

  return (
    <PageBody>
      <Column gap="5" padding="4">
        <Row justifyContent="space-between" alignItems="center">
          <Column gap="1">
            <PageHeader title="Hybrid Dashboard" />
            <Text size="2" style={{ color: '#666' }}>
              Combined view: Product Analytics + Marketing + Revenue Operations
            </Text>
          </Column>
          <Row gap="2">
            {['overview', 'product', 'marketing', 'revenue'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'primary' : 'quiet'}
                onPress={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </Row>
        </Row>

        {/* Quick Stats Bar */}
        <Grid columns={getGridColumns()} gap="3">
          <MetricCard
            label="Monthly Active Users"
            value={quickStats.mau}
            change={quickStats.mauChange * quickStats.mau / 100}
            showChange
            showLabel
            valueSize={getMetricValueSize()}
          />
          <MetricCard
            label="Annual Revenue"
            value={quickStats.arr}
            formatValue={(n) => `$${formatLongNumber(n)}`}
            change={quickStats.arrChange * quickStats.arr / 100}
            showChange
            showLabel
            valueSize={getMetricValueSize()}
          />
          <MetricCard
            label="Conversion Rate"
            value={conversionRate}
            formatValue={(n) => `${n.toFixed(2)}%`}
            change={0.4}
            showChange
            showLabel
            valueSize={getMetricValueSize()}
          />
          <MetricCard
            label="NPS Score"
            value={quickStats.nps}
            change={quickStats.npsChange}
            showChange
            showLabel
            valueSize={getMetricValueSize()}
          />
          <MetricCard
            label="Churn Rate"
            value={quickStats.churnRate}
            formatValue={(n) => `${n.toFixed(1)}%`}
            change={quickStats.churnChange}
            showChange
            reverseColors
            showLabel
            valueSize={getMetricValueSize()}
          />
        </Grid>

        {/* Alerts Section */}
        {showAlerts && accountAlerts.length > 0 && (
          <Panel>
            <Row gap="4" style={{ overflowX: 'auto', padding: '4px 0' }}>
              {accountAlerts.map((alert, idx) => (
                <Row key={idx} gap="3" alignItems="center" style={{ padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: '6px', minWidth: '240px' }}>
                  <AlertBadge severity={alert.severity} />
                  <Column gap="0">
                    <Text size="1" weight="medium">{alert.account}</Text>
                    <Text size="0" style={{ color: '#666' }}>{alert.message}</Text>
                  </Column>
                </Row>
              ))}
            </Row>
          </Panel>
        )}

        {/* Main Content Grid */}
        <Grid columns={{ xs: '1', lg: dashboardLayout === 'visualization-focused' ? '1' : '3' }} gap="4">
          {/* Main Chart */}
          <Column gap="4" style={{ gridColumn: dashboardLayout === 'visualization-focused' ? 'span 1' : 'span 2' }}>
            <Panel title="Traffic & Conversions">
              <BarChart
                chartData={metricsChartData}
                unit="day"
                height={`${chartHeight}px`}
                renderXLabel={renderXLabel}
                minDate={dateRange.minDate}
                maxDate={dateRange.maxDate}
              />
            </Panel>

            {dashboardLayout !== 'metrics-focused' && (
              <Panel title="Revenue Trend">
                <BarChart
                  chartData={revenueChartData}
                  unit="day"
                  height={`${chartHeight - 60}px`}
                  currency="USD"
                  renderXLabel={renderXLabel}
                  minDate={dateRange.minDate}
                  maxDate={dateRange.maxDate}
                />
              </Panel>
            )}
          </Column>

          {/* Side Panels */}
          {dashboardLayout !== 'visualization-focused' && (
            <Column gap="4">
              {/* Conversion Funnel */}
              <Panel title="Conversion Funnel">
                <MiniFunnel data={funnelData} />
              </Panel>

              {/* Top Channels */}
              <Panel title="Top Channels">
                <Column gap="2">
                  {topChannels.slice(0, 4).map((channel, idx) => (
                    <Row key={channel.name} justifyContent="space-between" alignItems="center" style={{ padding: '4px 0' }}>
                      <Row gap="2" alignItems="center">
                        <Box style={{ width: '8px', height: '8px', backgroundColor: chartColors[idx], borderRadius: '2px' }} />
                        <Text size="1">{channel.name}</Text>
                      </Row>
                      <Text size="1" weight="medium">{formatLongNumber(channel.visitors)}</Text>
                    </Row>
                  ))}
                </Column>
              </Panel>

              {/* Pipeline Summary */}
              <Panel title="Pipeline Summary">
                <Grid columns="2" gap="3">
                  <Column gap="1">
                    <Text size="0" style={{ color: '#666' }}>Total Pipeline</Text>
                    <Text size="3" weight="bold">${formatLongNumber(pipelineSummary.total)}</Text>
                  </Column>
                  <Column gap="1">
                    <Text size="0" style={{ color: '#666' }}>Weighted</Text>
                    <Text size="3" weight="bold">${formatLongNumber(pipelineSummary.weighted)}</Text>
                  </Column>
                  <Column gap="1">
                    <Text size="0" style={{ color: '#666' }}>Active Deals</Text>
                    <Text size="3" weight="bold">{pipelineSummary.deals}</Text>
                  </Column>
                  <Column gap="1">
                    <Text size="0" style={{ color: '#666' }}>Avg Deal Size</Text>
                    <Text size="3" weight="bold">${formatLongNumber(pipelineSummary.avgDealSize)}</Text>
                  </Column>
                </Grid>
              </Panel>
            </Column>
          )}
        </Grid>

        {/* Bottom Row: Feature Usage + Channel Distribution */}
        <Grid columns={{ xs: '1', lg: '2' }} gap="4">
          <Panel title="Top Features by Usage">
            <Column gap="2">
              {topFeatures.map((feature, idx) => (
                <Row key={feature.name} justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: idx < topFeatures.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                  <Column gap="1">
                    <Text size="2">{feature.name}</Text>
                    <Row gap="2">
                      <Text size="1" style={{ color: '#666' }}>{formatLongNumber(feature.users)} users</Text>
                      <Text size="1" style={{ color: chartColors[0] }}>{feature.engagement}% engagement</Text>
                    </Row>
                  </Column>
                  <Box style={{ width: '80px', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <Box style={{ width: `${feature.engagement}%`, height: '100%', backgroundColor: chartColors[0] }} />
                  </Box>
                </Row>
              ))}
            </Column>
          </Panel>

          <Panel title="Traffic Distribution">
            <Row gap="4" alignItems="center">
              <Box style={{ width: '180px', height: '180px' }}>
                <PieChart type="doughnut" chartData={channelPieData} height="180px" />
              </Box>
              <Column gap="2" style={{ flex: 1 }}>
                {topChannels.map((channel, idx) => (
                  <Row key={channel.name} justifyContent="space-between" alignItems="center">
                    <Row gap="2" alignItems="center">
                      <Box style={{ width: '10px', height: '10px', backgroundColor: chartColors[idx], borderRadius: '2px' }} />
                      <Text size="1">{channel.name}</Text>
                    </Row>
                    <Column alignItems="flex-end">
                      <Text size="1" weight="medium">{((channel.visitors / totalVisitors) * 100).toFixed(1)}%</Text>
                      <Text size="0" style={{ color: '#30a46c' }}>${formatLongNumber(channel.revenue)}</Text>
                    </Column>
                  </Row>
                ))}
              </Column>
            </Row>
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
