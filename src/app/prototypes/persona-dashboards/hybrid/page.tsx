'use client';

import { useMemo, useState, useEffect } from 'react';
import { Column, Grid, Row, Text, Heading, Box, Tab, TabList, TabPanel, Tabs, Loading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import {
  useDynamicColor,
  useDynamicVariant,
  useDynamicNumber,
  useDynamicBoolean,
  DialsProvider,
  DialsOverlay,
} from '@niteshift/dials';

// ===== PRODUCT ANALYTICS DATA =====
function generateEngagementTrend(days: number = 14) {
  const data: { x: Date; y: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Use actual Date objects for timeseries charts
    const dateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfWeek = date.getDay();
    const baseValue = 3200 + Math.sin(i * 0.4) * 600;
    const weekendDip = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;
    data.push({ x: dateObj, y: Math.round(baseValue * weekendDip * (0.9 + Math.random() * 0.2)) });
  }
  return data;
}

function generateFeatureAdoption() {
  return [
    { label: 'Core Analytics', count: 89, percent: 89 },
    { label: 'Custom Reports', count: 67, percent: 67 },
    { label: 'API Integration', count: 45, percent: 45 },
    { label: 'Team Collaboration', count: 38, percent: 38 },
    { label: 'Advanced Filters', count: 31, percent: 31 },
  ];
}

// ===== MARKETING DATA =====
function generateChannelMix() {
  return [
    { label: 'Organic Search', count: 42567, percent: 38 },
    { label: 'Paid Search', count: 28934, percent: 26 },
    { label: 'Social Media', count: 18234, percent: 16 },
    { label: 'Email', count: 12456, percent: 11 },
    { label: 'Direct', count: 9876, percent: 9 },
  ];
}

function generateCampaignROI() {
  return [
    { label: 'Product Launch Q4', roas: 6.2, spend: 45000, revenue: 279000 },
    { label: 'Retargeting', roas: 8.4, spend: 15000, revenue: 126000 },
    { label: 'Brand Awareness', roas: 2.1, spend: 35000, revenue: 73500 },
    { label: 'Newsletter Promo', roas: 12.3, spend: 8000, revenue: 98400 },
  ];
}

// ===== REVENUE DATA =====
function generateRevenueMetrics() {
  return {
    mrr: 1260000,
    arr: 15120000,
    growth: 12.5,
    nrr: 118,
    churnRate: 3.2,
  };
}

function generateTopAccounts() {
  return [
    { label: 'Acme Corp', mrr: 125000, health: 'healthy', engagement: 92 },
    { label: 'TechStart Inc', mrr: 98000, health: 'healthy', engagement: 88 },
    { label: 'Global Solutions', mrr: 87500, health: 'at-risk', engagement: 34 },
    { label: 'Innovation Labs', mrr: 76000, health: 'expanding', engagement: 95 },
    { label: 'DataDriven Co', mrr: 65000, health: 'healthy', engagement: 78 },
  ];
}

function generateChurnRisks() {
  return [
    { label: 'Global Solutions', risk: 75, mrr: 87500, reason: 'Low engagement' },
    { label: 'CloudFirst', risk: 68, mrr: 54000, reason: 'Support issues' },
    { label: 'NextGen Analytics', risk: 52, mrr: 31000, reason: 'Champion left' },
  ];
}

// ===== COMBINED METRICS =====
function generateCombinedTrends(days: number = 14) {
  const users: { x: Date; y: number }[] = [];
  const revenue: { x: Date; y: number }[] = [];
  const conversions: { x: Date; y: number }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Use actual Date objects for timeseries charts
    const dateObj = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfWeek = date.getDay();
    const weekendDip = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.7 : 1;

    users.push({ x: dateObj, y: Math.round(3500 * weekendDip * (0.9 + Math.random() * 0.2)) });
    revenue.push({ x: dateObj, y: Math.round(42000 * weekendDip * (0.85 + Math.random() * 0.3)) });
    conversions.push({ x: dateObj, y: Math.round(145 * weekendDip * (0.8 + Math.random() * 0.4)) });
  }

  return { users, revenue, conversions };
}

function HybridDashboardContent() {
  // Client-side only rendering to avoid SSR date issues
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dials - Color Palette
  const productColor = useDynamicColor('hb-product-color', {
    label: 'Product Analytics Color',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#01bad7'],
    group: 'Color Palette',
  });

  const marketingColor = useDynamicColor('hb-marketing-color', {
    label: 'Marketing Color',
    default: '#9256d9',
    options: ['#9256d9', '#e68619', '#2680eb', '#01bad7'],
    group: 'Color Palette',
  });

  const revenueColor = useDynamicColor('hb-revenue-color', {
    label: 'Revenue Color',
    default: '#44b556',
    options: ['#44b556', '#2680eb', '#9256d9', '#01bad7'],
    group: 'Color Palette',
  });

  const dangerColor = useDynamicColor('hb-danger-color', {
    label: 'Warning/Risk Color',
    default: '#e34850',
    options: ['#e34850', '#e68619', '#9256d9'],
    group: 'Color Palette',
  });

  // Dials - Layout
  const layout = useDynamicVariant('hb-layout', {
    label: 'Dashboard Layout',
    default: 'balanced',
    options: ['balanced', 'product-heavy', 'revenue-heavy', 'marketing-heavy'] as const,
    group: 'Layout',
  });

  const cardStyle = useDynamicVariant('hb-card-style', {
    label: 'Card Style',
    default: 'standard',
    options: ['standard', 'minimal', 'detailed'] as const,
    group: 'Layout',
  });

  // Dials - Typography
  const metricSize = useDynamicVariant('hb-metric-size', {
    label: 'Metric Value Size',
    default: '7',
    options: ['5', '6', '7', '8'] as const,
    group: 'Typography',
  });

  const headingSize = useDynamicVariant('hb-heading-size', {
    label: 'Section Heading Size',
    default: '2',
    options: ['1', '2', '3', '4'] as const,
    group: 'Typography',
  });

  // Dials - Spacing
  const panelSpacing = useDynamicNumber('hb-panel-spacing', {
    label: 'Panel Spacing',
    default: 3,
    min: 1,
    max: 6,
    step: 1,
    group: 'Spacing',
  });

  const contentDensity = useDynamicVariant('hb-density', {
    label: 'Content Density',
    default: 'comfortable',
    options: ['compact', 'comfortable', 'spacious'] as const,
    group: 'Spacing',
  });

  // Dials - Display Options
  const showTrends = useDynamicBoolean('hb-show-trends', {
    label: 'Show Trend Indicators',
    default: true,
    group: 'Display',
  });

  const showHealth = useDynamicBoolean('hb-show-health', {
    label: 'Show Health Scores',
    default: true,
    group: 'Display',
  });

  const showROAS = useDynamicBoolean('hb-show-roas', {
    label: 'Show ROAS Metrics',
    default: true,
    group: 'Display',
  });

  // Mock data
  const engagementTrend = useMemo(() => generateEngagementTrend(14), []);
  const featureAdoption = useMemo(() => generateFeatureAdoption(), []);
  const channelMix = useMemo(() => generateChannelMix(), []);
  const campaignROI = useMemo(() => generateCampaignROI(), []);
  const revenueMetrics = useMemo(() => generateRevenueMetrics(), []);
  const topAccounts = useMemo(() => generateTopAccounts(), []);
  const churnRisks = useMemo(() => generateChurnRisks(), []);
  const combinedTrends = useMemo(() => generateCombinedTrends(14), []);

  // Chart data
  const combinedChartData = useMemo(() => ({
    datasets: [
      {
        type: 'line' as const,
        label: 'Active Users',
        data: combinedTrends.users,
        borderColor: productColor,
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: 'Daily Revenue',
        data: combinedTrends.revenue,
        backgroundColor: revenueColor + '66',
        borderColor: revenueColor,
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: 'y1',
      },
    ],
  }), [combinedTrends, productColor, revenueColor]);

  const channelPieData = useMemo(() => ({
    labels: channelMix.map(d => d.label),
    datasets: [{
      data: channelMix.map(d => d.count),
      backgroundColor: [productColor, marketingColor, revenueColor, '#e68619', '#01bad7'],
      borderWidth: 0,
    }],
  }), [channelMix, productColor, marketingColor, revenueColor]);

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 13);
    return d;
  }, []);
  const maxDate = useMemo(() => new Date(), []);

  const gridGap = `${panelSpacing}` as any;
  const padding = contentDensity === 'compact' ? '4' : contentDensity === 'spacious' ? '8' : '6';

  if (!isClient) {
    return (
      <Column padding="6" width="100%" maxWidth="1600px" alignItems="center" justifyContent="center" minHeight="400px">
        <Loading />
      </Column>
    );
  }

  const formatCurrency = (value: number) => `$${formatLongNumber(value)}`;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return revenueColor;
      case 'expanding': return productColor;
      case 'at-risk': return '#e68619';
      default: return '#666';
    }
  };

  const getLayoutColumns = () => {
    switch (layout) {
      case 'product-heavy': return { xs: '1fr', lg: '2fr 1fr 1fr' };
      case 'revenue-heavy': return { xs: '1fr', lg: '1fr 1fr 2fr' };
      case 'marketing-heavy': return { xs: '1fr', lg: '1fr 2fr 1fr' };
      default: return { xs: '1fr', lg: 'repeat(3, 1fr)' };
    }
  };

  return (
    <Column gap={gridGap} padding={padding as any} width="100%" maxWidth="1600px">
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="5">Unified Analytics Dashboard</Heading>
          <Text color="muted">Product, Marketing & Revenue insights in one view</Text>
        </Column>
        <Row gap="2">
          <Box padding="1" paddingX="2" backgroundColor={productColor + '22'} borderRadius="2">
            <Text size="0" style={{ color: productColor }}>Product</Text>
          </Box>
          <Box padding="1" paddingX="2" backgroundColor={marketingColor + '22'} borderRadius="2">
            <Text size="0" style={{ color: marketingColor }}>Marketing</Text>
          </Box>
          <Box padding="1" paddingX="2" backgroundColor={revenueColor + '22'} borderRadius="2">
            <Text size="0" style={{ color: revenueColor }}>Revenue</Text>
          </Box>
        </Row>
      </Row>

      {/* Combined Key Metrics */}
      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }} gap={gridGap}>
        {/* Product Metrics */}
        <MetricCard
          value={32456}
          change={showTrends ? 2341 : 0}
          label="Daily Active Users"
          formatValue={formatLongNumber}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={68.5}
          change={showTrends ? 3.2 : 0}
          label="Feature Adoption"
          formatValue={(n) => `${n.toFixed(1)}%`}
          showChange={showTrends}
          valueSize={metricSize as any}
        />

        {/* Marketing Metrics */}
        <MetricCard
          value={112067}
          change={showTrends ? 8934 : 0}
          label="Monthly Visitors"
          formatValue={formatLongNumber}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={5.8}
          change={showROAS && showTrends ? 0.6 : 0}
          label="Avg ROAS"
          formatValue={(n) => `${n.toFixed(1)}x`}
          showChange={showROAS && showTrends}
          valueSize={metricSize as any}
        />

        {/* Revenue Metrics */}
        <MetricCard
          value={revenueMetrics.mrr}
          change={showTrends ? 135000 : 0}
          label="MRR"
          formatValue={formatCurrency}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={revenueMetrics.nrr}
          change={showTrends ? 3 : 0}
          label="Net Revenue Retention"
          formatValue={(n) => `${n.toFixed(0)}%`}
          showChange={showTrends}
          valueSize={metricSize as any}
        />
      </Grid>

      {/* Main Combined Chart */}
      <Panel title="Users & Revenue Trend (14 Days)">
        <BarChart
          chartData={combinedChartData}
          unit="day"
          minDate={minDate}
          maxDate={maxDate}
          height="280px"
        />
      </Panel>

      {/* Three Column Section - Adaptive to Layout */}
      <Grid columns={getLayoutColumns()} gap={gridGap}>
        {/* Product Analytics Section */}
        <Panel>
          <Column gap="4">
            <Row alignItems="center" gap="2">
              <Box width="8px" height="8px" borderRadius="4" backgroundColor={productColor} />
              <Heading size={headingSize as any}>Product</Heading>
            </Row>
            <Column gap="2">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="1" color="muted">Avg Session</Text>
                <Text size="2" weight="bold">4m 32s</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Text size="1" color="muted">Sessions/User</Text>
                <Text size="2" weight="bold">4.8</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Text size="1" color="muted">Stickiness (DAU/MAU)</Text>
                <Text size="2" weight="bold">42%</Text>
              </Row>
            </Column>
            {cardStyle !== 'minimal' && (
              <Column gap="2">
                <Text size="1" weight="bold">Feature Adoption</Text>
                {featureAdoption.slice(0, 4).map((feature) => (
                  <Row key={feature.label} alignItems="center" gap="2">
                    <Box flex="1">
                      <Text size="0" truncate>{feature.label}</Text>
                    </Box>
                    <Box width="60px" height="6px" backgroundColor="2" borderRadius="1" overflow="hidden">
                      <Box height="100%" width={`${feature.percent}%`} backgroundColor={productColor} borderRadius="1" />
                    </Box>
                    <Text size="0" style={{ width: '30px', textAlign: 'right' }}>{feature.percent}%</Text>
                  </Row>
                ))}
              </Column>
            )}
          </Column>
        </Panel>

        {/* Marketing Section */}
        <Panel>
          <Column gap="4">
            <Row alignItems="center" gap="2">
              <Box width="8px" height="8px" borderRadius="4" backgroundColor={marketingColor} />
              <Heading size={headingSize as any}>Marketing</Heading>
            </Row>
            <PieChart
              type="doughnut"
              chartData={channelPieData}
              height="160px"
            />
            {cardStyle === 'detailed' && showROAS && (
              <Column gap="2">
                <Text size="1" weight="bold">Top Campaigns by ROAS</Text>
                {campaignROI.slice(0, 3).map((campaign) => (
                  <Row key={campaign.label} justifyContent="space-between" alignItems="center">
                    <Text size="0" truncate style={{ maxWidth: '120px' }}>{campaign.label}</Text>
                    <Text size="0" weight="bold" style={{ color: campaign.roas > 5 ? revenueColor : '#e68619' }}>
                      {campaign.roas.toFixed(1)}x
                    </Text>
                  </Row>
                ))}
              </Column>
            )}
          </Column>
        </Panel>

        {/* Revenue Section */}
        <Panel>
          <Column gap="4">
            <Row alignItems="center" gap="2">
              <Box width="8px" height="8px" borderRadius="4" backgroundColor={revenueColor} />
              <Heading size={headingSize as any}>Revenue</Heading>
            </Row>
            <Column gap="2">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="1" color="muted">ARR</Text>
                <Text size="2" weight="bold">{formatCurrency(revenueMetrics.arr)}</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Text size="1" color="muted">Growth</Text>
                <Text size="2" weight="bold" style={{ color: revenueColor }}>+{revenueMetrics.growth}%</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Text size="1" color="muted">Churn Rate</Text>
                <Text size="2" weight="bold" style={{ color: dangerColor }}>{revenueMetrics.churnRate}%</Text>
              </Row>
            </Column>
            {cardStyle !== 'minimal' && showHealth && (
              <Column gap="2">
                <Text size="1" weight="bold">Top Accounts</Text>
                {topAccounts.slice(0, 4).map((account) => (
                  <Row key={account.label} justifyContent="space-between" alignItems="center">
                    <Row alignItems="center" gap="2">
                      <Box
                        width="6px"
                        height="6px"
                        borderRadius="3"
                        backgroundColor={getHealthColor(account.health)}
                      />
                      <Text size="0" truncate style={{ maxWidth: '100px' }}>{account.label}</Text>
                    </Row>
                    <Text size="0" weight="bold">{formatCurrency(account.mrr)}</Text>
                  </Row>
                ))}
              </Column>
            )}
          </Column>
        </Panel>
      </Grid>

      {/* Alerts & Actions Row */}
      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={gridGap}>
        {/* Churn Risk Alerts */}
        <Panel>
          <Column gap="3">
            <Row alignItems="center" gap="2">
              <Box width="8px" height="8px" borderRadius="4" backgroundColor={dangerColor} />
              <Heading size={headingSize as any}>Churn Risk Alerts</Heading>
            </Row>
            {churnRisks.map((account) => (
              <Row key={account.label} justifyContent="space-between" alignItems="center" padding="2" backgroundColor="2" borderRadius="2">
                <Column gap="1">
                  <Text size="1" weight="bold">{account.label}</Text>
                  <Text size="0" color="muted">{account.reason}</Text>
                </Column>
                <Column alignItems="flex-end" gap="1">
                  <Text size="1" style={{ color: dangerColor }}>{formatCurrency(account.mrr)}/mo</Text>
                  <Box
                    padding="1"
                    paddingX="2"
                    borderRadius="2"
                    style={{ backgroundColor: account.risk > 60 ? dangerColor + '22' : '#e68619' + '22' }}
                  >
                    <Text size="0" style={{ color: account.risk > 60 ? dangerColor : '#e68619' }}>
                      {account.risk}% risk
                    </Text>
                  </Box>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Quick Actions / Insights */}
        <Panel>
          <Column gap="3">
            <Heading size={headingSize as any}>Key Insights</Heading>
            <Row padding="2" backgroundColor={revenueColor + '11'} borderRadius="2" gap="2" alignItems="center">
              <Box width="4px" height="40px" backgroundColor={revenueColor} borderRadius="1" />
              <Column gap="1">
                <Text size="1" weight="bold">Revenue up 12.5% MoM</Text>
                <Text size="0" color="muted">Expansion revenue driving growth</Text>
              </Column>
            </Row>
            <Row padding="2" backgroundColor={productColor + '11'} borderRadius="2" gap="2" alignItems="center">
              <Box width="4px" height="40px" backgroundColor={productColor} borderRadius="1" />
              <Column gap="1">
                <Text size="1" weight="bold">Feature adoption peaked</Text>
                <Text size="0" color="muted">Custom Reports usage up 23%</Text>
              </Column>
            </Row>
            <Row padding="2" backgroundColor={marketingColor + '11'} borderRadius="2" gap="2" alignItems="center">
              <Box width="4px" height="40px" backgroundColor={marketingColor} borderRadius="1" />
              <Column gap="1">
                <Text size="1" weight="bold">Email ROAS exceptional</Text>
                <Text size="0" color="muted">12.3x return on newsletter promo</Text>
              </Column>
            </Row>
            <Row padding="2" backgroundColor={dangerColor + '11'} borderRadius="2" gap="2" alignItems="center">
              <Box width="4px" height="40px" backgroundColor={dangerColor} borderRadius="1" />
              <Column gap="1">
                <Text size="1" weight="bold">3 accounts at risk</Text>
                <Text size="0" color="muted">${formatLongNumber(172500)} ARR needs attention</Text>
              </Column>
            </Row>
          </Column>
        </Panel>
      </Grid>
    </Column>
  );
}

export default function HybridDashboard() {
  return (
    <DialsProvider projectId="hybrid-dashboard">
      <HybridDashboardContent />
      <DialsOverlay position="bottom-left" />
    </DialsProvider>
  );
}
