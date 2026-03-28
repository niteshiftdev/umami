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
  Users,
  MousePointerClick,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Share2,
  Target,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
} from '@/components/icons';

// Generate time series data
function generateTimeSeriesData(baseValue: number, variance: number, days: number = 30) {
  const now = new Date();
  const data: { x: string; y: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;
    const endOfMonthFactor = date.getDate() > 25 ? 1.15 : 1;
    const trendFactor = 1 + (days - i) * 0.01;
    const randomFactor = 0.75 + Math.random() * 0.5;
    const value = Math.round(baseValue * weekendFactor * endOfMonthFactor * trendFactor * randomFactor * variance);
    data.push({ x: dateStr, y: value });
  }

  return data;
}

// Traffic source data
const trafficSourceData = {
  labels: ['Organic', 'Paid', 'Social', 'Email', 'Direct', 'Referral'],
  datasets: [
    {
      data: [32, 24, 16, 14, 8, 6],
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

// User segments data
const userSegmentData = {
  labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup', 'Free Tier'],
  datasets: [
    {
      data: [28, 25, 22, 15, 10],
      backgroundColor: [
        '#2680eb',
        '#44b556',
        '#9256d9',
        '#e68619',
        '#838383',
      ],
      borderWidth: 0,
    },
  ],
};

// Feature usage funnel
const featureFunnelData = {
  labels: ['View Dashboard', 'Create Report', 'Export Data', 'Share Link', 'API Usage'],
  datasets: [
    {
      label: 'Users',
      data: [8432, 5621, 3892, 2156, 1234],
      backgroundColor: 'rgba(38, 128, 235, 0.7)',
      borderColor: '#2680eb',
      borderWidth: 1,
    },
  ],
};

// Top performing items
const topPerformers = [
  { type: 'campaign', name: 'Q4 Product Launch', metric: 'Conversions', value: 2847, change: 23.4 },
  { type: 'feature', name: 'Real-time Dashboard', metric: 'Adoption', value: 78.5, change: 12.1 },
  { type: 'segment', name: 'Enterprise Customers', metric: 'NRR', value: 125, change: 8.2 },
  { type: 'channel', name: 'Organic Search', metric: 'Traffic', value: 45230, change: 15.7 },
];

// Alerts and insights
const alerts = [
  { severity: 'warning', message: 'Churn rate increased 0.5% in EMEA region', category: 'Revenue' },
  { severity: 'success', message: 'Product adoption up 15% after tutorial update', category: 'Product' },
  { severity: 'warning', message: 'Paid CAC trending up, now $52 vs $47 target', category: 'Marketing' },
  { severity: 'success', message: 'Net new MRR exceeded monthly target by 18%', category: 'Revenue' },
];

export default function HybridDashboardPage() {
  // Dials for customization
  const primaryColor = useDynamicColor('hd-primary-color', {
    label: 'Primary Color',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#f15bb5'],
    group: 'Colors',
  });

  const secondaryColor = useDynamicColor('hd-secondary-color', {
    label: 'Secondary Color',
    default: '#9256d9',
    options: ['#9256d9', '#2680eb', '#44b556', '#f15bb5', '#01bad7'],
    group: 'Colors',
  });

  const successColor = useDynamicColor('hd-success-color', {
    label: 'Success Color',
    default: '#44b556',
    options: ['#44b556', '#2680eb', '#01bad7', '#9256d9'],
    group: 'Colors',
  });

  const layoutVariant = useDynamicVariant('hd-layout', {
    label: 'Layout Style',
    default: 'unified',
    options: ['unified', 'sectioned', 'dense'] as const,
    group: 'Layout',
  });

  const cardSpacing = useDynamicSpacing('hd-card-spacing', {
    label: 'Card Spacing',
    default: '24px',
    options: ['16px', '20px', '24px', '32px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('hd-chart-height', {
    label: 'Chart Height',
    default: 260,
    min: 180,
    max: 400,
    step: 40,
    unit: 'px',
    group: 'Charts',
  });

  const showProductMetrics = useDynamicBoolean('hd-show-product', {
    label: 'Show Product Metrics',
    default: true,
    group: 'Sections',
  });

  const showMarketingMetrics = useDynamicBoolean('hd-show-marketing', {
    label: 'Show Marketing Metrics',
    default: true,
    group: 'Sections',
  });

  const showRevenueMetrics = useDynamicBoolean('hd-show-revenue', {
    label: 'Show Revenue Metrics',
    default: true,
    group: 'Sections',
  });

  const showInsights = useDynamicBoolean('hd-show-insights', {
    label: 'Show Insights Panel',
    default: true,
    group: 'Sections',
  });

  // Combined engagement + revenue data
  const combinedData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Active Users',
          data: generateTimeSeriesData(5200, 1, 30),
          backgroundColor: `${primaryColor}99`,
          borderColor: primaryColor,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          yAxisID: 'y',
        },
        {
          type: 'bar' as const,
          label: 'Conversions',
          data: generateTimeSeriesData(420, 1, 30),
          backgroundColor: `${secondaryColor}66`,
          borderColor: secondaryColor,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          yAxisID: 'y',
        },
      ],
    };
  }, [primaryColor, secondaryColor]);

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

  const formatCompact = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader
          title="Hybrid Dashboard"
          description="Unified view combining product, marketing, and revenue insights"
        />

        {/* Executive Summary Metrics */}
        <MetricsBar>
          <MetricCard
            label="Monthly Active Users"
            value={52470}
            change={4230}
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
            label="Monthly Revenue"
            value={847500}
            change={42300}
            showChange
            formatValue={formatCurrency}
          />
          <MetricCard
            label="Net Promoter Score"
            value={62}
            change={5}
            showChange
          />
        </MetricsBar>

        {/* Sectioned Metrics */}
        <Grid
          columns={layoutVariant === 'dense' ? { xs: '1fr', lg: '1fr 1fr 1fr' } : { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
          gap={gapValue as any}
        >
          {/* Product Section */}
          {showProductMetrics && (
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="5"
              gap="4"
            >
              <Row alignItems="center" gap="2">
                <Activity size={18} style={{ color: primaryColor }} />
                <Heading size="2">Product Health</Heading>
              </Row>
              <Grid columns="1fr 1fr" gap="3">
                <Column gap="1">
                  <Text color="muted" size="0">DAU/MAU</Text>
                  <Text size="4" weight="bold">28.6%</Text>
                  <Text size="0" style={{ color: successColor }}>+2.1%</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">Retention (D7)</Text>
                  <Text size="4" weight="bold">42.7%</Text>
                  <Text size="0" style={{ color: successColor }}>+1.8%</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">Avg. Session</Text>
                  <Text size="4" weight="bold">14m 23s</Text>
                  <Text size="0" style={{ color: successColor }}>+45s</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">Feature Adoption</Text>
                  <Text size="4" weight="bold">73.4%</Text>
                  <Text size="0" style={{ color: successColor }}>+5.2%</Text>
                </Column>
              </Grid>
            </Column>
          )}

          {/* Marketing Section */}
          {showMarketingMetrics && (
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="5"
              gap="4"
            >
              <Row alignItems="center" gap="2">
                <Target size={18} style={{ color: secondaryColor }} />
                <Heading size="2">Marketing Performance</Heading>
              </Row>
              <Grid columns="1fr 1fr" gap="3">
                <Column gap="1">
                  <Text color="muted" size="0">Traffic</Text>
                  <Text size="4" weight="bold">{formatCompact(127834)}</Text>
                  <Text size="0" style={{ color: successColor }}>+12.4%</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">CAC</Text>
                  <Text size="4" weight="bold">$47.50</Text>
                  <Text size="0" style={{ color: successColor }}>-$3.20</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">Email CTR</Text>
                  <Text size="4" weight="bold">18.4%</Text>
                  <Text size="0" style={{ color: successColor }}>+2.1%</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">ROI</Text>
                  <Text size="4" weight="bold">342%</Text>
                  <Text size="0" style={{ color: successColor }}>+28%</Text>
                </Column>
              </Grid>
            </Column>
          )}

          {/* Revenue Section */}
          {showRevenueMetrics && (
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="5"
              gap="4"
            >
              <Row alignItems="center" gap="2">
                <DollarSign size={18} style={{ color: successColor }} />
                <Heading size="2">Revenue Metrics</Heading>
              </Row>
              <Grid columns="1fr 1fr" gap="3">
                <Column gap="1">
                  <Text color="muted" size="0">MRR</Text>
                  <Text size="4" weight="bold">$847K</Text>
                  <Text size="0" style={{ color: successColor }}>+$42K</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">NRR</Text>
                  <Text size="4" weight="bold">118%</Text>
                  <Text size="0" style={{ color: successColor }}>+3%</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">ARPU</Text>
                  <Text size="4" weight="bold">$679</Text>
                  <Text size="0" style={{ color: successColor }}>+$34</Text>
                </Column>
                <Column gap="1">
                  <Text color="muted" size="0">Churn</Text>
                  <Text size="4" weight="bold">2.1%</Text>
                  <Text size="0" style={{ color: successColor }}>-0.4%</Text>
                </Column>
              </Grid>
            </Column>
          )}
        </Grid>

        {/* Main Visualization Section */}
        <Grid
          columns={layoutVariant === 'sectioned' ? '1fr' : { xs: '1fr', lg: '3fr 2fr' }}
          gap={gapValue as any}
        >
          {/* Combined Activity Chart */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Engagement & Conversion Trends</Heading>
              <Text color="muted" size="1">Daily active users and conversions over 30 days</Text>
            </Column>
            {dateRange && (
              <BarChart
                chartData={combinedData}
                unit="day"
                minDate={dateRange.minDate}
                maxDate={dateRange.maxDate}
                height={`${chartHeight}px`}
              />
            )}
          </Column>

          {/* Distribution Charts */}
          <Grid
            rows="1fr 1fr"
            gap={gapValue as any}
          >
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="5"
              gap="3"
            >
              <Row alignItems="center" gap="2">
                <Search size={16} style={{ color: secondaryColor }} />
                <Text weight="bold" size="1">Traffic Sources</Text>
              </Row>
              <PieChart
                chartData={trafficSourceData}
                type="doughnut"
                height={`${Math.floor(chartHeight * 0.7)}px`}
              />
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="5"
              gap="3"
            >
              <Row alignItems="center" gap="2">
                <Users size={16} style={{ color: primaryColor }} />
                <Text weight="bold" size="1">Customer Segments</Text>
              </Row>
              <PieChart
                chartData={userSegmentData}
                type="doughnut"
                height={`${Math.floor(chartHeight * 0.7)}px`}
              />
            </Column>
          </Grid>
        </Grid>

        {/* Feature Funnel & Insights */}
        <Grid
          columns={{ xs: '1fr', lg: showInsights ? '1fr 1fr' : '1fr' }}
          gap={gapValue as any}
        >
          {/* Feature Usage Funnel */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Feature Usage Funnel</Heading>
              <Text color="muted" size="1">User progression through key features</Text>
            </Column>
            {isClient && (
              <BarChart
                chartData={featureFunnelData}
                XAxisType="category"
                height={`${chartHeight}px`}
              />
            )}
          </Column>

          {/* Insights & Alerts */}
          {showInsights && (
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="6"
              gap="4"
            >
              <Column gap="1">
                <Heading size="2">Insights & Alerts</Heading>
                <Text color="muted" size="1">Cross-functional notifications</Text>
              </Column>
              <Column gap="3">
                {alerts.map((alert, index) => (
                  <Row
                    key={index}
                    alignItems="flex-start"
                    gap="3"
                    padding="3"
                    style={{
                      backgroundColor: alert.severity === 'warning' ? 'rgba(230, 134, 25, 0.1)' : 'rgba(68, 181, 86, 0.1)',
                      borderRadius: '6px',
                      borderLeft: `3px solid ${alert.severity === 'warning' ? '#e68619' : successColor}`,
                    }}
                  >
                    {alert.severity === 'warning' ? (
                      <AlertTriangle size={18} style={{ color: '#e68619', flexShrink: 0, marginTop: '2px' }} />
                    ) : (
                      <CheckCircle size={18} style={{ color: successColor, flexShrink: 0, marginTop: '2px' }} />
                    )}
                    <Column gap="1">
                      <Text size="1">{alert.message}</Text>
                      <Text size="0" color="muted">{alert.category}</Text>
                    </Column>
                  </Row>
                ))}
              </Column>
            </Column>
          )}
        </Grid>

        {/* Top Performers Leaderboard */}
        <Column
          backgroundColor
          border
          borderRadius="3"
          padding="6"
          gap="4"
        >
          <Column gap="1">
            <Heading size="2">Top Performers</Heading>
            <Text color="muted" size="1">Best performing items across all categories</Text>
          </Column>
          <Grid columns={{ xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="4">
            {topPerformers.map((item, index) => (
              <Column
                key={item.name}
                backgroundColor
                border
                borderRadius="2"
                padding="4"
                gap="2"
              >
                <Row alignItems="center" gap="2">
                  {item.type === 'campaign' && <Zap size={16} style={{ color: secondaryColor }} />}
                  {item.type === 'feature' && <Activity size={16} style={{ color: primaryColor }} />}
                  {item.type === 'segment' && <Users size={16} style={{ color: successColor }} />}
                  {item.type === 'channel' && <Search size={16} style={{ color: '#e68619' }} />}
                  <Text weight="bold" size="0" color="muted" style={{ textTransform: 'uppercase' }}>
                    {item.type}
                  </Text>
                </Row>
                <Text weight="bold" size="1">{item.name}</Text>
                <Row justifyContent="space-between" alignItems="flex-end">
                  <Column gap="0">
                    <Text size="0" color="muted">{item.metric}</Text>
                    <Text size="4" weight="bold">
                      {typeof item.value === 'number' && item.metric === 'Traffic'
                        ? formatCompact(item.value)
                        : item.metric === 'NRR' || item.metric === 'Adoption'
                        ? `${item.value}%`
                        : item.value.toLocaleString()}
                    </Text>
                  </Column>
                  <Row alignItems="center" gap="1">
                    <TrendingUp size={14} style={{ color: successColor }} />
                    <Text size="0" style={{ color: successColor }}>+{item.change}%</Text>
                  </Row>
                </Row>
              </Column>
            ))}
          </Grid>
        </Column>
      </Column>
    </PageBody>
  );
}
