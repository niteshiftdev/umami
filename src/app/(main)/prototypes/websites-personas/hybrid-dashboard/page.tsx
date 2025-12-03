'use client';

import { useMemo, useState } from 'react';
import { Column, Row, Grid, Text, Box, Button } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicBoolean,
} from '@niteshift/dials';

// Generate 30 days of realistic time series data
const generateTimeSeriesData = () => {
  const data = [];
  const baseDate = new Date('2024-11-03');

  for (let i = 0; i < 30; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);

    // Create realistic correlated data with weekly patterns
    const dayOfWeek = date.getDay();
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    const trendMultiplier = 1 + (i * 0.008); // Slight upward trend

    const visitors = Math.round((1650 + Math.random() * 400) * weekendMultiplier * trendMultiplier);
    const engaged = Math.round(visitors * (0.68 + Math.random() * 0.08));
    const mqls = Math.round(engaged * (0.055 + Math.random() * 0.015));
    const sqls = Math.round(mqls * (0.22 + Math.random() * 0.08));
    const customers = Math.round(sqls * (0.09 + Math.random() * 0.03));
    const revenue = Math.round(customers * (1850 + Math.random() * 650));

    data.push({
      date: date.toISOString().split('T')[0],
      visitors,
      engaged,
      mqls,
      sqls,
      customers,
      revenue,
    });
  }
  return data;
};

const timeSeriesData = generateTimeSeriesData();

// Aggregate totals
const totals = timeSeriesData.reduce(
  (acc, day) => ({
    visitors: acc.visitors + day.visitors,
    engaged: acc.engaged + day.engaged,
    mqls: acc.mqls + day.mqls,
    sqls: acc.sqls + day.sqls,
    customers: acc.customers + day.customers,
    revenue: acc.revenue + day.revenue,
  }),
  { visitors: 0, engaged: 0, mqls: 0, sqls: 0, customers: 0, revenue: 0 }
);

// Executive KPI data
const executiveKPIs = {
  traffic: {
    value: totals.visitors,
    change: 12.4,
    label: 'Total Visitors',
  },
  engagement: {
    value: Math.round((totals.engaged / totals.visitors) * 100),
    change: 3.2,
    label: 'Engagement Rate',
    suffix: '%',
  },
  conversions: {
    value: totals.customers,
    change: 18.7,
    label: 'New Customers',
  },
  revenue: {
    value: 89400,
    change: 8.5,
    label: 'MRR',
    currency: true,
  },
};

// Funnel data
const funnelStages = [
  { stage: 'Visitors', value: totals.visitors, rate: 100 },
  { stage: 'Engaged', value: totals.engaged, rate: Math.round((totals.engaged / totals.visitors) * 100) },
  { stage: 'MQL', value: totals.mqls, rate: Math.round((totals.mqls / totals.visitors) * 100 * 10) / 10 },
  { stage: 'SQL', value: totals.sqls, rate: Math.round((totals.sqls / totals.visitors) * 100 * 100) / 100 },
  { stage: 'Customer', value: totals.customers, rate: Math.round((totals.customers / totals.visitors) * 100 * 100) / 100 },
];

// Marketing channel data
const channelData = [
  { name: 'Organic Search', visitors: 17850, leads: 712, revenue: 32100, change: 15.2 },
  { name: 'Paid Search', visitors: 12750, leads: 489, revenue: 24500, change: -3.4 },
  { name: 'Social Media', visitors: 9180, leads: 321, revenue: 14200, change: 22.8 },
  { name: 'Email', visitors: 5940, leads: 298, revenue: 11800, change: 8.1 },
  { name: 'Direct', visitors: 4280, leads: 187, revenue: 6800, change: 5.6 },
];

// Product engagement metrics
const productMetrics = {
  dauMau: 68,
  sessionsPerUser: 4.2,
  avgSessionDuration: 510, // 8.5 minutes in seconds
  featureAdoption: 73,
};

// Top features by adoption
const topFeatures = [
  { name: 'Dashboard Analytics', adoption: 94, trend: 2.1 },
  { name: 'Report Builder', adoption: 78, trend: 5.4 },
  { name: 'User Segments', adoption: 65, trend: 8.2 },
  { name: 'Funnel Analysis', adoption: 52, trend: 12.3 },
  { name: 'Custom Events', adoption: 41, trend: -1.8 },
];

// Revenue operations data
const revenueMetrics = {
  mrr: 89400,
  arr: 1072800,
  nrr: 115,
  pipeline: 248000,
  closedWon: 67500,
  avgDealSize: 4250,
};

// Health status for each area
const healthStatus = {
  marketing: 'green',
  product: 'yellow',
  revenue: 'green',
};

// CSS styles for animations and custom layouts
const styles = {
  pageContainer: {
    animation: 'fadeIn 0.4s ease-out',
  },
  sectionHeader: {
    borderBottom: '2px solid var(--border-color)',
    paddingBottom: '8px',
    marginBottom: '16px',
  },
  funnelBar: {
    transition: 'all 0.3s ease',
  },
  healthIndicator: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '8px',
  },
  kpiCard: {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  sparklineContainer: {
    height: '40px',
    opacity: 0.7,
  },
  channelRow: {
    transition: 'background-color 0.15s ease',
  },
  drilldownButton: {
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
  metricTile: {
    background: 'linear-gradient(135deg, var(--background-color) 0%, var(--base-color-2) 100%)',
  },
};

const cssAnimation = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes growWidth {
    from { width: 0; }
  }
  .funnel-row:hover .drill-btn { opacity: 1; }
  .channel-row:hover { background-color: var(--base-color-2); }
  .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
  .feature-row { animation: slideInLeft 0.3s ease-out backwards; }
  .feature-row:nth-child(1) { animation-delay: 0.05s; }
  .feature-row:nth-child(2) { animation-delay: 0.1s; }
  .feature-row:nth-child(3) { animation-delay: 0.15s; }
  .feature-row:nth-child(4) { animation-delay: 0.2s; }
  .feature-row:nth-child(5) { animation-delay: 0.25s; }
`;

function HealthIndicator({ status }: { status: string }) {
  const colors: Record<string, string> = {
    green: 'var(--accent-color-green)',
    yellow: 'var(--accent-color-orange)',
    red: 'var(--accent-color-red)',
  };

  return (
    <span
      style={{
        ...styles.healthIndicator,
        backgroundColor: colors[status] || colors.yellow,
      }}
    />
  );
}

function ExecutiveKPICard({
  value,
  label,
  change,
  currency,
  suffix,
  delay,
}: {
  value: number;
  label: string;
  change: number;
  currency?: boolean;
  suffix?: string;
  delay: number;
}) {
  const displayValue = currency
    ? formatLongCurrency(value, 'USD')
    : suffix
      ? `${value}${suffix}`
      : formatLongNumber(value);

  const changeColor = change >= 0 ? 'var(--accent-color-green)' : 'var(--accent-color-red)';
  const changeIcon = change >= 0 ? '+' : '';

  return (
    <Column
      className="kpi-card"
      gap="2"
      paddingX="5"
      paddingY="4"
      borderRadius="3"
      border
      backgroundColor
      style={{
        ...styles.kpiCard,
        animation: `fadeIn 0.4s ease-out ${delay}s backwards`,
      }}
    >
      <Text size="1" color="muted" weight="medium">
        {label}
      </Text>
      <Text size="7" weight="bold">
        {displayValue}
      </Text>
      <Row gap="2" alignItems="center">
        <Text size="1" weight="semibold" style={{ color: changeColor }}>
          {changeIcon}{change}%
        </Text>
        <Text size="1" color="muted">
          vs last period
        </Text>
      </Row>
    </Column>
  );
}

function FunnelVisualization() {
  const maxValue = funnelStages[0].value;

  return (
    <Column gap="3">
      {funnelStages.map((stage, index) => {
        const widthPercent = (stage.value / maxValue) * 100;
        const conversionFromPrev = index > 0
          ? Math.round((stage.value / funnelStages[index - 1].value) * 100)
          : 100;

        return (
          <Row
            key={stage.stage}
            className="funnel-row"
            alignItems="center"
            gap="4"
            paddingY="2"
            style={{
              animation: `fadeIn 0.4s ease-out ${0.1 + index * 0.08}s backwards`,
            }}
          >
            <Box style={{ width: '80px', flexShrink: 0 }}>
              <Text size="2" weight="semibold">{stage.stage}</Text>
            </Box>
            <Box style={{ flex: 1, position: 'relative', height: '32px' }}>
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${widthPercent}%`,
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  borderRadius: '4px',
                  opacity: 0.85,
                  animation: `growWidth 0.6s ease-out ${0.2 + index * 0.1}s backwards`,
                }}
              />
              <Row
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  paddingLeft: '12px',
                }}
                alignItems="center"
              >
                <Text size="2" weight="bold" style={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  {formatLongNumber(stage.value)}
                </Text>
              </Row>
            </Box>
            <Box style={{ width: '60px', textAlign: 'right' }}>
              <Text size="1" color="muted">
                {conversionFromPrev}%
              </Text>
            </Box>
            <Box className="drill-btn" style={styles.drilldownButton}>
              <Button size="sm" variant="quiet">
                <Text size="1">View</Text>
              </Button>
            </Box>
          </Row>
        );
      })}
    </Column>
  );
}

function ChannelPerformanceTable() {
  return (
    <Column gap="1">
      <Grid
        columns="2fr 1fr 1fr 1fr 80px"
        gap="3"
        paddingX="3"
        paddingY="2"
        style={{ borderBottom: '1px solid var(--border-color)' }}
      >
        <Text size="1" weight="bold" color="muted">Channel</Text>
        <Text size="1" weight="bold" color="muted" align="right">Visitors</Text>
        <Text size="1" weight="bold" color="muted" align="right">Leads</Text>
        <Text size="1" weight="bold" color="muted" align="right">Revenue</Text>
        <Text size="1" weight="bold" color="muted" align="right">Change</Text>
      </Grid>
      {channelData.map((channel, index) => (
        <Grid
          key={channel.name}
          className="channel-row"
          columns="2fr 1fr 1fr 1fr 80px"
          gap="3"
          paddingX="3"
          paddingY="2"
          borderRadius="2"
          style={{
            ...styles.channelRow,
            animation: `fadeIn 0.3s ease-out ${0.15 + index * 0.05}s backwards`,
          }}
        >
          <Text size="2" weight="medium">{channel.name}</Text>
          <Text size="2" align="right">{formatLongNumber(channel.visitors)}</Text>
          <Text size="2" align="right">{formatLongNumber(channel.leads)}</Text>
          <Text size="2" align="right">{formatLongCurrency(channel.revenue, 'USD')}</Text>
          <Text
            size="2"
            align="right"
            weight="semibold"
            style={{
              color: channel.change >= 0 ? 'var(--accent-color-green)' : 'var(--accent-color-red)',
            }}
          >
            {channel.change >= 0 ? '+' : ''}{channel.change}%
          </Text>
        </Grid>
      ))}
    </Column>
  );
}

function ProductEngagementSummary() {
  return (
    <Column gap="4">
      <Grid columns="repeat(2, 1fr)" gap="3">
        <Column
          gap="1"
          paddingX="4"
          paddingY="3"
          borderRadius="2"
          style={{ backgroundColor: 'var(--base-color-2)' }}
        >
          <Text size="1" color="muted">DAU/MAU Ratio</Text>
          <Row alignItems="baseline" gap="1">
            <Text size="6" weight="bold">{productMetrics.dauMau}</Text>
            <Text size="2" color="muted">%</Text>
          </Row>
        </Column>
        <Column
          gap="1"
          paddingX="4"
          paddingY="3"
          borderRadius="2"
          style={{ backgroundColor: 'var(--base-color-2)' }}
        >
          <Text size="1" color="muted">Sessions/User</Text>
          <Text size="6" weight="bold">{productMetrics.sessionsPerUser}</Text>
        </Column>
        <Column
          gap="1"
          paddingX="4"
          paddingY="3"
          borderRadius="2"
          style={{ backgroundColor: 'var(--base-color-2)' }}
        >
          <Text size="1" color="muted">Avg Session</Text>
          <Text size="6" weight="bold">8.5m</Text>
        </Column>
        <Column
          gap="1"
          paddingX="4"
          paddingY="3"
          borderRadius="2"
          style={{ backgroundColor: 'var(--base-color-2)' }}
        >
          <Text size="1" color="muted">Feature Adoption</Text>
          <Row alignItems="baseline" gap="1">
            <Text size="6" weight="bold">{productMetrics.featureAdoption}</Text>
            <Text size="2" color="muted">%</Text>
          </Row>
        </Column>
      </Grid>

      <Column gap="2">
        <Text size="2" weight="bold">Top Features by Adoption</Text>
        {topFeatures.map((feature, index) => (
          <Row
            key={feature.name}
            className="feature-row"
            alignItems="center"
            justifyContent="space-between"
            paddingY="1"
          >
            <Row gap="3" alignItems="center" style={{ flex: 1 }}>
              <Text size="2">{feature.name}</Text>
              <Box
                style={{
                  flex: 1,
                  maxWidth: '100px',
                  height: '6px',
                  backgroundColor: 'var(--base-color-3)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  style={{
                    width: `${feature.adoption}%`,
                    height: '100%',
                    backgroundColor: CHART_COLORS[2],
                    borderRadius: '3px',
                  }}
                />
              </Box>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="2" weight="semibold">{feature.adoption}%</Text>
              <Text
                size="1"
                style={{
                  color: feature.trend >= 0 ? 'var(--accent-color-green)' : 'var(--accent-color-red)',
                }}
              >
                {feature.trend >= 0 ? '+' : ''}{feature.trend}%
              </Text>
            </Row>
          </Row>
        ))}
      </Column>
    </Column>
  );
}

function RevenueOperationsSummary() {
  return (
    <Column gap="4">
      <Grid columns="repeat(3, 1fr)" gap="3">
        <Column
          gap="1"
          paddingX="4"
          paddingY="3"
          borderRadius="2"
          border
          style={{ borderColor: 'var(--accent-color-green)', borderWidth: '1px' }}
        >
          <Text size="1" color="muted">MRR</Text>
          <Text size="5" weight="bold">{formatLongCurrency(revenueMetrics.mrr, 'USD')}</Text>
        </Column>
        <Column
          gap="1"
          paddingX="4"
          paddingY="3"
          borderRadius="2"
          border
        >
          <Text size="1" color="muted">ARR</Text>
          <Text size="5" weight="bold">{formatLongCurrency(revenueMetrics.arr, 'USD')}</Text>
        </Column>
        <Column
          gap="1"
          paddingX="4"
          paddingY="3"
          borderRadius="2"
          border
        >
          <Text size="1" color="muted">NRR</Text>
          <Row alignItems="baseline" gap="1">
            <Text size="5" weight="bold">{revenueMetrics.nrr}</Text>
            <Text size="2" color="muted">%</Text>
          </Row>
        </Column>
      </Grid>

      <Row gap="4">
        <Column gap="2" style={{ flex: 1 }}>
          <Text size="1" color="muted">Active Pipeline</Text>
          <Text size="4" weight="bold">{formatLongCurrency(revenueMetrics.pipeline, 'USD')}</Text>
          <Box
            style={{
              height: '8px',
              backgroundColor: 'var(--base-color-3)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Box
              style={{
                width: '62%',
                height: '100%',
                backgroundColor: CHART_COLORS[0],
                borderRadius: '4px',
              }}
            />
          </Box>
          <Text size="1" color="muted">62% to quarterly target</Text>
        </Column>

        <Column gap="2" style={{ flex: 1 }}>
          <Text size="1" color="muted">Closed Won (30d)</Text>
          <Text size="4" weight="bold">{formatLongCurrency(revenueMetrics.closedWon, 'USD')}</Text>
          <Box
            style={{
              height: '8px',
              backgroundColor: 'var(--base-color-3)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <Box
              style={{
                width: '78%',
                height: '100%',
                backgroundColor: CHART_COLORS[2],
                borderRadius: '4px',
              }}
            />
          </Box>
          <Text size="1" color="muted">78% to monthly target</Text>
        </Column>
      </Row>

      <Row
        gap="3"
        paddingX="4"
        paddingY="3"
        borderRadius="2"
        style={{ backgroundColor: 'var(--base-color-2)' }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text size="2">Average Deal Size</Text>
        <Text size="3" weight="bold">{formatLongCurrency(revenueMetrics.avgDealSize, 'USD')}</Text>
      </Row>
    </Column>
  );
}

export default function HybridExecutiveDashboard() {
  const [selectedView, setSelectedView] = useState<'all' | 'marketing' | 'product' | 'revenue'>('all');

  // === DIALS: Layout & Spacing ===
  const layoutStyle = useDynamicVariant('hd-layout-style', {
    label: 'Layout Style',
    description: 'Overall dashboard layout',
    default: 'default',
    options: ['compact', 'default', 'spacious'] as const,
    group: 'Layout',
  });

  const sectionGap = useDynamicSpacing('hd-section-gap', {
    label: 'Section Gap',
    description: 'Spacing between dashboard sections',
    default: '20px',
    options: ['12px', '16px', '20px', '24px', '32px'],
    group: 'Layout',
  });

  const columnsLayout = useDynamicVariant('hd-columns-layout', {
    label: 'Summary Columns',
    description: 'Layout for Marketing/Product/Revenue panels',
    default: '3',
    options: ['2', '3'] as const,
    group: 'Layout',
  });

  // === DIALS: Colors ===
  const primaryAccent = useDynamicColor('hd-primary-accent', {
    label: 'Primary Accent',
    description: 'Main accent color for charts',
    default: '#2680eb',
    options: ['#2680eb', '#3e63dd', '#0090ff', '#9256d9'],
    allowCustom: true,
    group: 'Colors',
  });

  const healthyStatusColor = useDynamicColor('hd-healthy-color', {
    label: 'Healthy Status',
    description: 'Color for healthy indicators',
    default: '#30a46c',
    options: ['#30a46c', '#44b556', '#89c541'],
    group: 'Colors',
  });

  const warningStatusColor = useDynamicColor('hd-warning-color', {
    label: 'Warning Status',
    description: 'Color for warning indicators',
    default: '#f7bd12',
    options: ['#f7bd12', '#ffc301', '#e68619'],
    group: 'Colors',
  });

  const criticalStatusColor = useDynamicColor('hd-critical-color', {
    label: 'Critical Status',
    description: 'Color for critical indicators',
    default: '#e5484d',
    options: ['#e5484d', '#f76b15', '#ec1562'],
    group: 'Colors',
  });

  // === DIALS: Typography ===
  const headingSize = useDynamicVariant('hd-heading-size', {
    label: 'Heading Size',
    description: 'Font size for section headings',
    default: '3',
    options: ['2', '3', '4'] as const,
    group: 'Typography',
  });

  const headingWeight = useDynamicVariant('hd-heading-weight', {
    label: 'Heading Weight',
    description: 'Font weight for headings',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography',
  });

  const metricLabelSize = useDynamicVariant('hd-metric-label-size', {
    label: 'Metric Label Size',
    description: 'Font size for metric labels',
    default: '',
    options: ['', '0', '1', '2'] as const,
    group: 'Typography',
  });

  // === DIALS: Visualizations ===
  const showHealthIndicators = useDynamicBoolean('hd-show-health', {
    label: 'Show Health Indicators',
    description: 'Display health status bar',
    default: true,
    group: 'Visualizations',
  });

  const showFunnel = useDynamicBoolean('hd-show-funnel', {
    label: 'Show Traffic Funnel',
    description: 'Display traffic-to-revenue funnel',
    default: true,
    group: 'Visualizations',
  });

  const showTrendChart = useDynamicBoolean('hd-show-trend', {
    label: 'Show Trend Chart',
    description: 'Display cross-functional trends',
    default: true,
    group: 'Visualizations',
  });

  const channelChartType = useDynamicVariant('hd-channel-chart', {
    label: 'Channel Chart Type',
    description: 'Visualization for channel distribution',
    default: 'doughnut',
    options: ['doughnut', 'pie'] as const,
    group: 'Visualizations',
  });

  // === DIALS: Components ===
  const showChannelTable = useDynamicBoolean('hd-show-channel-table', {
    label: 'Show Channel Table',
    description: 'Display channel performance table',
    default: true,
    group: 'Components',
  });

  const showProgressBars = useDynamicBoolean('hd-show-progress', {
    label: 'Show Progress Bars',
    description: 'Display progress bars in summary panels',
    default: true,
    group: 'Components',
  });

  const gapValue = layoutStyle === 'compact' ? '3' : layoutStyle === 'spacious' ? '6' : '5';

  // Prepare chart data for cross-functional trends
  const trendChartData = useMemo(() => {
    return {
      datasets: [
        {
          label: 'Visitors',
          data: timeSeriesData.map(d => ({
            x: new Date(d.date),
            y: d.visitors,
          })),
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
        },
        {
          label: 'Engaged',
          data: timeSeriesData.map(d => ({
            x: new Date(d.date),
            y: d.engaged,
          })),
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
        },
        {
          label: 'MQLs',
          data: timeSeriesData.map(d => ({
            x: new Date(d.date),
            y: d.mqls,
          })),
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
        },
      ],
    };
  }, []);

  // Pie chart for channel distribution
  const channelPieData = useMemo(() => {
    return {
      labels: channelData.map(c => c.name),
      datasets: [
        {
          data: channelData.map(c => c.visitors),
          backgroundColor: CHART_COLORS.slice(0, channelData.length),
        },
      ],
    };
  }, []);

  return (
    <>
      <style>{cssAnimation}</style>
      <Column gap="6" style={styles.pageContainer}>
        {/* Header */}
        <Row justifyContent="space-between" alignItems="center">
          <Column gap="1">
            <Text size="6" weight="bold">Executive Dashboard</Text>
            <Text size="2" color="muted">
              Cross-functional view: Traffic to Revenue | Last 30 days
            </Text>
          </Column>
          <Row gap="2">
            {(['all', 'marketing', 'product', 'revenue'] as const).map((view) => (
              <Button
                key={view}
                size="sm"
                variant={selectedView === view ? 'primary' : 'quiet'}
                onPress={() => setSelectedView(view)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </Button>
            ))}
          </Row>
        </Row>

        {/* Executive KPIs */}
        <Grid columns="repeat(4, 1fr)" gap="4">
          <ExecutiveKPICard
            value={executiveKPIs.traffic.value}
            label={executiveKPIs.traffic.label}
            change={executiveKPIs.traffic.change}
            delay={0}
          />
          <ExecutiveKPICard
            value={executiveKPIs.engagement.value}
            label={executiveKPIs.engagement.label}
            change={executiveKPIs.engagement.change}
            suffix="%"
            delay={0.05}
          />
          <ExecutiveKPICard
            value={executiveKPIs.conversions.value}
            label={executiveKPIs.conversions.label}
            change={executiveKPIs.conversions.change}
            delay={0.1}
          />
          <ExecutiveKPICard
            value={executiveKPIs.revenue.value}
            label={executiveKPIs.revenue.label}
            change={executiveKPIs.revenue.change}
            currency
            delay={0.15}
          />
        </Grid>

        {/* Health Status Bar */}
        <Row
          gap="6"
          paddingX="5"
          paddingY="3"
          borderRadius="2"
          style={{ backgroundColor: 'var(--base-color-2)' }}
        >
          <Row gap="2" alignItems="center">
            <HealthIndicator status={healthStatus.marketing} />
            <Text size="2" weight="medium">Marketing</Text>
          </Row>
          <Row gap="2" alignItems="center">
            <HealthIndicator status={healthStatus.product} />
            <Text size="2" weight="medium">Product</Text>
          </Row>
          <Row gap="2" alignItems="center">
            <HealthIndicator status={healthStatus.revenue} />
            <Text size="2" weight="medium">Revenue</Text>
          </Row>
          <Box style={{ flex: 1 }} />
          <Text size="1" color="muted">Updated 5 minutes ago</Text>
        </Row>

        {/* Main Content: Funnel + Trend Chart */}
        <Grid columns="1fr 1.5fr" gap="4">
          <Panel title="Traffic-to-Revenue Funnel">
            <FunnelVisualization />
          </Panel>

          <Panel title="Cross-Functional Trends" minHeight="320px">
            <Box style={{ height: '260px' }}>
              <BarChart
                chartData={trendChartData}
                unit="day"
                stacked={false}
                minDate={new Date('2024-11-03')}
                maxDate={new Date('2024-12-02')}
              />
            </Box>
          </Panel>
        </Grid>

        {/* Three-Column Summary */}
        <Grid columns="repeat(3, 1fr)" gap="4">
          {/* Marketing Summary */}
          <Panel>
            <Row gap="2" alignItems="center" style={styles.sectionHeader}>
              <HealthIndicator status={healthStatus.marketing} />
              <Text size="3" weight="bold">Marketing</Text>
            </Row>
            <Column gap="4">
              <Grid columns="repeat(2, 1fr)" gap="3">
                <Column gap="1">
                  <Text size="1" color="muted">Total Leads</Text>
                  <Text size="4" weight="bold">{formatLongNumber(totals.mqls)}</Text>
                </Column>
                <Column gap="1">
                  <Text size="1" color="muted">CPL</Text>
                  <Text size="4" weight="bold">$42.50</Text>
                </Column>
              </Grid>
              <Box style={{ height: '160px' }}>
                <PieChart chartData={channelPieData} type="doughnut" />
              </Box>
            </Column>
          </Panel>

          {/* Product Summary */}
          <Panel>
            <Row gap="2" alignItems="center" style={styles.sectionHeader}>
              <HealthIndicator status={healthStatus.product} />
              <Text size="3" weight="bold">Product</Text>
            </Row>
            <ProductEngagementSummary />
          </Panel>

          {/* Revenue Summary */}
          <Panel>
            <Row gap="2" alignItems="center" style={styles.sectionHeader}>
              <HealthIndicator status={healthStatus.revenue} />
              <Text size="3" weight="bold">Revenue</Text>
            </Row>
            <RevenueOperationsSummary />
          </Panel>
        </Grid>

        {/* Channel Performance Table */}
        <Panel title="Channel Performance">
          <ChannelPerformanceTable />
        </Panel>
      </Column>
    </>
  );
}
