'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Text, Heading, Box, useTheme } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { useDynamicVariant, useDynamicColor, useDynamicSpacing, useDynamicBoolean } from '@niteshift/dials';
import { CHART_COLORS } from '@/lib/constants';
import { getThemeColors } from '@/lib/colors';
import { formatLongNumber } from '@/lib/format';
import { subDays, startOfDay, endOfDay } from 'date-fns';

// Date range for charts
const now = new Date();
const minDate = startOfDay(subDays(now, 13));
const maxDate = endOfDay(now);

// Mock data generators
function generateTimeSeriesData(days: number, baseValue: number, variance: number) {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const value = Math.floor(baseValue + (Math.random() - 0.5) * variance);
    data.push({
      x: date.toISOString().split('T')[0],
      y: Math.max(0, value),
    });
  }
  return data;
}

// Combined metrics data
const combinedData = {
  // Product Analytics
  dailyActiveUsers: generateTimeSeriesData(14, 12500, 4000),
  engagementRate: 67,
  avgSessionDuration: 847,

  // Marketing Attribution
  totalVisitors: generateTimeSeriesData(14, 45000, 10000),
  conversionRate: 3.07,
  topChannels: [
    { name: 'Organic Search', value: 42500 },
    { name: 'Paid Search', value: 28300 },
    { name: 'Social', value: 18700 },
    { name: 'Email', value: 12400 },
  ],

  // Revenue Operations
  mrr: 485000,
  arr: 5820000,
  nrr: 122,
  pipelineValue: 6110000,
};

// Traffic & engagement combined chart
const trafficEngagementData = {
  visitors: generateTimeSeriesData(14, 45000, 10000),
  activeUsers: generateTimeSeriesData(14, 12500, 4000),
  conversions: generateTimeSeriesData(14, 1400, 500),
};

// Revenue & pipeline chart
const revenueData = {
  mrr: generateTimeSeriesData(14, 485000, 50000),
  newBusiness: generateTimeSeriesData(14, 85000, 30000),
  expansion: generateTimeSeriesData(14, 42000, 15000),
};

// Channel distribution
const channelDistribution = {
  labels: ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'],
  datasets: [
    {
      label: 'Visitors',
      data: [42500, 28300, 18700, 12400, 21800, 8900],
      backgroundColor: CHART_COLORS.slice(0, 6),
    },
  ],
};

// Customer segments
const customerSegments = {
  labels: ['Enterprise', 'Mid-Market', 'SMB', 'Self-Serve'],
  datasets: [
    {
      label: 'Revenue',
      data: [2850000, 1920000, 780000, 270000],
      backgroundColor: CHART_COLORS.slice(0, 4),
    },
  ],
};

// Feature usage
const featureUsage = {
  labels: ['Dashboard', 'Reports', 'Analytics', 'API', 'Integrations'],
  datasets: [
    {
      label: 'Usage %',
      data: [89, 72, 65, 38, 28],
      backgroundColor: CHART_COLORS.slice(0, 5),
    },
  ],
};

// Key accounts summary
const keyAccounts = [
  { name: 'Enterprise Solutions', arr: 156000, health: 92, trend: 'up', engagement: 'High' },
  { name: 'TechCorp Global', arr: 142000, health: 85, trend: 'up', engagement: 'High' },
  { name: 'DataFlow Systems', arr: 98000, health: 58, trend: 'down', engagement: 'Medium' },
  { name: 'CloudFirst Ltd', arr: 86000, health: 72, trend: 'stable', engagement: 'Medium' },
  { name: 'Digital Media Group', arr: 78000, health: 88, trend: 'up', engagement: 'High' },
];

export default function HybridDashboardPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const colorPalette = useDynamicVariant('hd-color-palette', {
    label: 'Color Palette',
    description: 'Overall color scheme',
    default: 'default',
    options: ['default', 'corporate', 'modern', 'contrast'] as const,
    group: 'Colors',
  });

  const layoutStyle = useDynamicVariant('hd-layout-style', {
    label: 'Layout Style',
    description: 'Dashboard layout arrangement',
    default: 'balanced',
    options: ['balanced', 'metrics-first', 'charts-focus', 'compact'] as const,
    group: 'Layout',
  });

  const primaryFocus = useDynamicVariant('hd-primary-focus', {
    label: 'Primary Focus',
    description: 'Which metrics to emphasize',
    default: 'all',
    options: ['all', 'product', 'marketing', 'revenue'] as const,
    group: 'Visualization',
  });

  const headingSize = useDynamicVariant('hd-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '3',
    options: ['2', '3', '4', '5'] as const,
    group: 'Typography',
  });

  const panelSpacing = useDynamicSpacing('hd-panel-spacing', {
    label: 'Panel Spacing',
    description: 'Gap between panels',
    default: '3',
    options: ['2', '3', '4', '5', '6'] as const,
    group: 'Spacing',
  });

  const showDetailedMetrics = useDynamicBoolean('hd-detailed-metrics', {
    label: 'Show Detailed Metrics',
    description: 'Display extended metric cards',
    default: true,
    group: 'Features',
  });

  const accentColor = useDynamicColor('hd-accent-color', {
    label: 'Accent Color',
    description: 'Primary accent color',
    default: '#2680eb',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850'],
    allowCustom: true,
    group: 'Colors',
  });

  // Get color palette based on dial
  const getChartColors = () => {
    switch (colorPalette) {
      case 'corporate':
        return ['#1a365d', '#2a4365', '#2c5282', '#2b6cb0', '#3182ce', '#4299e1'];
      case 'modern':
        return ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];
      case 'contrast':
        return ['#1e293b', '#f97316', '#22c55e', '#3b82f6', '#a855f7', '#ef4444'];
      default:
        return CHART_COLORS;
    }
  };

  const chartColors = getChartColors();

  // Traffic & engagement chart
  const trafficChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Visitors',
        data: trafficEngagementData.visitors,
        backgroundColor: `${chartColors[0]}70`,
        borderColor: chartColors[0],
        borderWidth: 1,
        order: 2,
      },
      {
        type: 'line' as const,
        label: 'Active Users',
        data: trafficEngagementData.activeUsers,
        backgroundColor: 'transparent',
        borderColor: chartColors[2],
        borderWidth: 2,
        order: 1,
      },
      {
        type: 'line' as const,
        label: 'Conversions',
        data: trafficEngagementData.conversions.map(d => ({ ...d, y: d.y * 10 })),
        backgroundColor: 'transparent',
        borderColor: chartColors[3],
        borderWidth: 2,
        order: 1,
      },
    ],
  }), [chartColors]);

  // Revenue chart
  const revenueChartData = useMemo(() => ({
    datasets: [
      {
        type: 'line' as const,
        label: 'MRR',
        data: revenueData.mrr,
        backgroundColor: `${chartColors[0]}30`,
        borderColor: chartColors[0],
        borderWidth: 2,
        fill: true,
        order: 1,
      },
      {
        type: 'bar' as const,
        label: 'New Business',
        data: revenueData.newBusiness,
        backgroundColor: chartColors[2],
        borderColor: chartColors[2],
        borderWidth: 1,
        order: 2,
      },
      {
        type: 'bar' as const,
        label: 'Expansion',
        data: revenueData.expansion,
        backgroundColor: chartColors[3],
        borderColor: chartColors[3],
        borderWidth: 1,
        order: 3,
      },
    ],
  }), [chartColors]);

  // Channel pie chart
  const channelChartData = useMemo(() => ({
    labels: channelDistribution.labels,
    datasets: [
      {
        ...channelDistribution.datasets[0],
        backgroundColor: chartColors.slice(0, 6),
      },
    ],
  }), [chartColors]);

  // Customer segments chart
  const segmentChartData = useMemo(() => ({
    labels: customerSegments.labels,
    datasets: [
      {
        ...customerSegments.datasets[0],
        backgroundColor: chartColors.slice(0, 4),
      },
    ],
  }), [chartColors]);

  // Feature usage chart
  const featureChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Usage %',
        data: featureUsage.datasets[0].data.map((y, i) => ({
          x: featureUsage.labels[i],
          y,
        })),
        backgroundColor: chartColors.slice(0, 5),
        borderColor: chartColors.slice(0, 5),
        borderWidth: 1,
      },
    ],
  }), [chartColors]);

  const getHealthColor = (health: number) => {
    if (health >= 80) return '#44b556';
    if (health >= 60) return '#e68619';
    return '#e34850';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return { symbol: '↑', color: '#44b556' };
      case 'down':
        return { symbol: '↓', color: '#e34850' };
      default:
        return { symbol: '→', color: colors.theme.text };
    }
  };

  const renderComprehensiveMetrics = () => (
    <Grid columns={{ xs: '1fr', md: 'repeat(auto-fit, minmax(140px, 1fr))' }} gap="3">
      {/* Product Analytics metrics */}
      <MetricCard
        label="Daily Active Users"
        value={12847}
        change={1156}
        showLabel
        showChange
        valueColor={primaryFocus === 'product' || primaryFocus === 'all' ? accentColor : undefined}
      />
      <MetricCard
        label="Engagement Rate"
        value={67}
        change={5}
        showLabel
        showChange
        formatValue={(n) => `${n}%`}
      />

      {/* Marketing metrics */}
      <MetricCard
        label="Visitors"
        value={132600}
        change={18500}
        showLabel
        showChange
        valueColor={primaryFocus === 'marketing' || primaryFocus === 'all' ? accentColor : undefined}
      />
      <MetricCard
        label="Conversion Rate"
        value={3.07}
        change={0.4}
        showLabel
        showChange
        formatValue={(n) => `${n.toFixed(2)}%`}
      />

      {/* Revenue metrics */}
      <MetricCard
        label="MRR"
        value={485000}
        change={32000}
        showLabel
        showChange
        formatValue={(n) => `$${formatLongNumber(n)}`}
        valueColor={primaryFocus === 'revenue' || primaryFocus === 'all' ? accentColor : undefined}
      />
      {showDetailedMetrics && (
        <>
          <MetricCard
            label="NRR"
            value={122}
            change={4}
            showLabel
            showChange
            formatValue={(n) => `${n}%`}
          />
          <MetricCard
            label="Pipeline"
            value={6110000}
            change={820000}
            showLabel
            showChange
            formatValue={(n) => `$${formatLongNumber(n)}`}
          />
        </>
      )}
    </Grid>
  );

  const renderKeyAccountsTable = () => (
    <Panel minHeight="320px">
      <Heading size={headingSize as any}>Key Accounts Overview</Heading>
      <Text size="1" style={{ color: colors.theme.text }}>
        Top accounts with health and engagement status
      </Text>
      <Box marginTop="4">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
              <th style={{ textAlign: 'left', padding: '10px 8px', color: colors.theme.text, fontSize: '13px' }}>Account</th>
              <th style={{ textAlign: 'right', padding: '10px 8px', color: colors.theme.text, fontSize: '13px' }}>ARR</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: colors.theme.text, fontSize: '13px' }}>Health</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: colors.theme.text, fontSize: '13px' }}>Trend</th>
              <th style={{ textAlign: 'center', padding: '10px 8px', color: colors.theme.text, fontSize: '13px' }}>Engagement</th>
            </tr>
          </thead>
          <tbody>
            {keyAccounts.map((account) => {
              const trend = getTrendIcon(account.trend);
              return (
                <tr key={account.name} style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
                  <td style={{ padding: '10px 8px', fontWeight: 500, fontSize: '13px' }}>{account.name}</td>
                  <td style={{ textAlign: 'right', padding: '10px 8px', fontSize: '13px' }}>${formatLongNumber(account.arr)}</td>
                  <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                    <span style={{ color: getHealthColor(account.health), fontWeight: 600, fontSize: '13px' }}>
                      {account.health}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                    <span style={{ color: trend.color, fontWeight: 600, fontSize: '16px' }}>
                      {trend.symbol}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 8px' }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor: account.engagement === 'High' ? '#44b55620' : '#e6861920',
                      color: account.engagement === 'High' ? '#44b556' : '#e68619',
                    }}>
                      {account.engagement}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Panel>
  );

  const renderBalancedLayout = () => (
    <Column gap={panelSpacing}>
      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="380px">
          <Heading size={headingSize as any}>Traffic & Engagement</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            Visitors, active users, and conversions over 14 days
          </Text>
          <Box height="300px" marginTop="4">
            <BarChart chartData={trafficChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="380px">
          <Heading size={headingSize as any}>Revenue Performance</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            MRR, new business, and expansion revenue
          </Text>
          <Box height="300px" marginTop="4">
            <BarChart chartData={revenueChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
          </Box>
        </Panel>
      </Grid>

      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Traffic Channels</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={channelChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Customer Segments</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={segmentChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Feature Usage</Heading>
          <Box height="240px" marginTop="4">
            <Chart type="bar" chartData={featureChartData} height="100%" />
          </Box>
        </Panel>
      </Grid>

      {renderKeyAccountsTable()}
    </Column>
  );

  const renderMetricsFirstLayout = () => (
    <Column gap={panelSpacing}>
      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        {renderKeyAccountsTable()}

        <Panel minHeight="320px">
          <Heading size={headingSize as any}>Revenue by Segment</Heading>
          <Box height="260px" marginTop="4">
            <PieChart chartData={segmentChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>
      </Grid>

      <Panel minHeight="400px">
        <Heading size={headingSize as any}>Traffic & Engagement Overview</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          Combined view of visitors, active users, and conversions
        </Text>
        <Box height="320px" marginTop="4">
          <BarChart chartData={trafficChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
        </Box>
      </Panel>

      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Traffic Channels</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={channelChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Feature Adoption</Heading>
          <Box height="240px" marginTop="4">
            <Chart type="bar" chartData={featureChartData} height="100%" />
          </Box>
        </Panel>
      </Grid>
    </Column>
  );

  const renderChartsFocusLayout = () => (
    <Column gap={panelSpacing}>
      <Panel minHeight="450px">
        <Heading size={headingSize as any}>Traffic & Engagement Trends</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          Visitors, active users, and conversions over time
        </Text>
        <Box height="380px" marginTop="4">
          <BarChart chartData={trafficChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
        </Box>
      </Panel>

      <Panel minHeight="450px">
        <Heading size={headingSize as any}>Revenue Performance</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          MRR, new business, and expansion revenue
        </Text>
        <Box height="380px" marginTop="4">
          <BarChart chartData={revenueChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
        </Box>
      </Panel>

      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="280px">
          <Heading size={headingSize as any}>Channels</Heading>
          <Box height="220px" marginTop="4">
            <PieChart chartData={channelChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="280px">
          <Heading size={headingSize as any}>Segments</Heading>
          <Box height="220px" marginTop="4">
            <PieChart chartData={segmentChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="280px">
          <Heading size={headingSize as any}>Features</Heading>
          <Box height="220px" marginTop="4">
            <Chart type="bar" chartData={featureChartData} height="100%" />
          </Box>
        </Panel>
      </Grid>
    </Column>
  );

  const renderCompactLayout = () => (
    <Column gap={panelSpacing}>
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap={panelSpacing}>
        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Traffic & Engagement</Heading>
          <Box height="290px" marginTop="3">
            <BarChart chartData={trafficChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Channels</Heading>
          <Box height="290px" marginTop="3">
            <PieChart chartData={channelChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>
      </Grid>

      <Grid columns={{ xs: '1fr', md: '1fr 2fr' }} gap={panelSpacing}>
        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Segments</Heading>
          <Box height="290px" marginTop="3">
            <PieChart chartData={segmentChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Revenue</Heading>
          <Box height="290px" marginTop="3">
            <BarChart chartData={revenueChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
          </Box>
        </Panel>
      </Grid>

      {renderKeyAccountsTable()}
    </Column>
  );

  return (
    <Column gap={panelSpacing} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column>
          <Heading size="5">Unified Analytics Dashboard</Heading>
          <Text size="2" style={{ color: colors.theme.text }}>
            Combined view of product, marketing, and revenue metrics
          </Text>
        </Column>
      </Row>

      {renderComprehensiveMetrics()}

      {layoutStyle === 'balanced' && renderBalancedLayout()}
      {layoutStyle === 'metrics-first' && renderMetricsFirstLayout()}
      {layoutStyle === 'charts-focus' && renderChartsFocusLayout()}
      {layoutStyle === 'compact' && renderCompactLayout()}
    </Column>
  );
}
