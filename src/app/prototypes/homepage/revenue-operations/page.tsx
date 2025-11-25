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
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { subDays, startOfDay, endOfDay } from 'date-fns';

// Date range for charts
const now = new Date();
const minDate = startOfDay(subDays(now, 29));
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

// Revenue trend data
const revenueData = {
  mrr: generateTimeSeriesData(30, 485000, 50000),
  arr: generateTimeSeriesData(30, 5820000, 200000),
  newBusiness: generateTimeSeriesData(30, 85000, 30000),
  expansion: generateTimeSeriesData(30, 42000, 15000),
};

// Pipeline by stage
const pipelineStageData = {
  labels: ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'],
  datasets: [
    {
      label: 'Deal Value',
      data: [2450000, 1820000, 980000, 520000, 340000],
      backgroundColor: CHART_COLORS.slice(0, 5),
    },
  ],
};

// Revenue by segment
const segmentData = {
  labels: ['Enterprise', 'Mid-Market', 'SMB', 'Self-Serve'],
  datasets: [
    {
      label: 'Revenue',
      data: [2850000, 1920000, 780000, 270000],
      backgroundColor: CHART_COLORS.slice(0, 4),
    },
  ],
};

// Churn risk accounts
const churnRiskAccounts = [
  { name: 'Acme Corp', arr: 124000, risk: 'High', healthScore: 32, lastActivity: '14 days ago' },
  { name: 'TechStart Inc', arr: 86000, risk: 'High', healthScore: 41, lastActivity: '21 days ago' },
  { name: 'Global Retail Co', arr: 156000, risk: 'Medium', healthScore: 55, lastActivity: '7 days ago' },
  { name: 'DataFlow Systems', arr: 68000, risk: 'Medium', healthScore: 58, lastActivity: '10 days ago' },
  { name: 'CloudFirst Ltd', arr: 92000, risk: 'Low', healthScore: 72, lastActivity: '3 days ago' },
];

// Top expansion opportunities
const expansionOpportunities = [
  { name: 'Enterprise Solutions', potential: 85000, currentArr: 120000, signals: ['Usage spike', 'Team growth'] },
  { name: 'Digital Media Group', potential: 62000, currentArr: 88000, signals: ['Feature requests', 'API usage'] },
  { name: 'FinServ Partners', potential: 48000, currentArr: 156000, signals: ['Multi-team usage'] },
  { name: 'Healthcare Plus', potential: 35000, currentArr: 72000, signals: ['Contract renewal'] },
];

// NRR trend
const nrrTrendData = {
  months: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  values: [108, 112, 106, 115, 118, 122],
};

export default function RevenueOperationsPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const colorPalette = useDynamicVariant('ro-color-palette', {
    label: 'Color Palette',
    description: 'Overall color scheme for charts',
    default: 'default',
    options: ['default', 'financial', 'growth', 'minimal'] as const,
    group: 'Colors',
  });

  const layoutStyle = useDynamicVariant('ro-layout-style', {
    label: 'Layout Style',
    description: 'Dashboard layout arrangement',
    default: 'executive',
    options: ['executive', 'detailed', 'focused'] as const,
    group: 'Layout',
  });

  const visualizationType = useDynamicVariant('ro-viz-type', {
    label: 'Visualization Type',
    description: 'Chart type for revenue trends',
    default: 'area',
    options: ['bar', 'line', 'area'] as const,
    group: 'Visualization',
  });

  const headingSize = useDynamicVariant('ro-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '3',
    options: ['2', '3', '4', '5'] as const,
    group: 'Typography',
  });

  const panelSpacing = useDynamicSpacing('ro-panel-spacing', {
    label: 'Panel Spacing',
    description: 'Gap between panels',
    default: '3',
    options: ['2', '3', '4', '5', '6'] as const,
    group: 'Spacing',
  });

  const showHealthScores = useDynamicBoolean('ro-show-health', {
    label: 'Show Health Scores',
    description: 'Display customer health indicators',
    default: true,
    group: 'Features',
  });

  const accentColor = useDynamicColor('ro-accent-color', {
    label: 'Accent Color',
    description: 'Primary accent color',
    default: '#44b556',
    options: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850'],
    allowCustom: true,
    group: 'Colors',
  });

  // Get color palette based on dial
  const getChartColors = () => {
    switch (colorPalette) {
      case 'financial':
        return ['#1a7f37', '#2da44e', '#57ab5a', '#7ce38b', '#aff5b4', '#dafbe1'];
      case 'growth':
        return ['#0969da', '#218bff', '#54aeff', '#80ccff', '#b6e3ff', '#ddf4ff'];
      case 'minimal':
        return ['#24292f', '#57606a', '#8c959f', '#afb8c1', '#d0d7de', '#eaeef2'];
      default:
        return CHART_COLORS;
    }
  };

  const chartColors = getChartColors();

  // Revenue trend chart data
  const revenueTrendData = useMemo(() => ({
    datasets: [
      {
        type: visualizationType === 'area' ? 'line' : visualizationType,
        label: 'MRR',
        data: revenueData.mrr,
        backgroundColor: visualizationType === 'area' ? `${chartColors[0]}40` : chartColors[0],
        borderColor: chartColors[0],
        borderWidth: 2,
        fill: visualizationType === 'area',
        order: 1,
      },
      {
        type: visualizationType === 'area' ? 'line' : visualizationType,
        label: 'New Business',
        data: revenueData.newBusiness,
        backgroundColor: visualizationType === 'area' ? `${chartColors[2]}40` : chartColors[2],
        borderColor: chartColors[2],
        borderWidth: 2,
        fill: visualizationType === 'area',
        order: 2,
      },
      {
        type: visualizationType === 'area' ? 'line' : visualizationType,
        label: 'Expansion',
        data: revenueData.expansion,
        backgroundColor: visualizationType === 'area' ? `${chartColors[3]}40` : chartColors[3],
        borderColor: chartColors[3],
        borderWidth: 2,
        fill: visualizationType === 'area',
        order: 3,
      },
    ],
  }), [visualizationType, chartColors]);

  // Pipeline stage chart
  const pipelineChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Pipeline Value',
        data: pipelineStageData.datasets[0].data.map((y, i) => ({
          x: pipelineStageData.labels[i],
          y,
        })),
        backgroundColor: chartColors.slice(0, 5),
        borderColor: chartColors.slice(0, 5),
        borderWidth: 1,
      },
    ],
  }), [chartColors]);

  // Segment distribution chart
  const segmentChartData = useMemo(() => ({
    labels: segmentData.labels,
    datasets: [
      {
        ...segmentData.datasets[0],
        backgroundColor: chartColors.slice(0, 4),
      },
    ],
  }), [chartColors]);

  // NRR trend chart
  const nrrChartData = useMemo(() => ({
    datasets: [
      {
        type: 'line' as const,
        label: 'Net Revenue Retention %',
        data: nrrTrendData.values.map((y, i) => ({
          x: nrrTrendData.months[i],
          y,
        })),
        backgroundColor: `${chartColors[0]}40`,
        borderColor: chartColors[0],
        borderWidth: 3,
        fill: true,
        tension: 0.3,
      },
    ],
  }), [chartColors]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return '#e34850';
      case 'Medium':
        return '#e68619';
      case 'Low':
        return '#44b556';
      default:
        return colors.theme.text;
    }
  };

  const renderMetricsSection = () => (
    <MetricsBar>
      <MetricCard
        label="Monthly Recurring Revenue"
        value={485000}
        change={32000}
        showLabel
        showChange
        formatValue={(n) => `$${formatLongNumber(n)}`}
        valueColor={accentColor}
      />
      <MetricCard
        label="Annual Run Rate"
        value={5820000}
        change={384000}
        showLabel
        showChange
        formatValue={(n) => `$${formatLongNumber(n)}`}
      />
      <MetricCard
        label="Net Revenue Retention"
        value={122}
        change={4}
        showLabel
        showChange
        formatValue={(n) => `${n}%`}
      />
      <MetricCard
        label="Pipeline Value"
        value={6110000}
        change={820000}
        showLabel
        showChange
        formatValue={(n) => `$${formatLongNumber(n)}`}
      />
      <MetricCard
        label="Gross Churn"
        value={2.4}
        change={-0.6}
        showLabel
        showChange
        formatValue={(n) => `${n.toFixed(1)}%`}
        reverseColors
      />
    </MetricsBar>
  );

  const renderChurnRiskTable = () => (
    <Panel minHeight="350px">
      <Heading size={headingSize as any}>Churn Risk Accounts</Heading>
      <Text size="1" style={{ color: colors.theme.text }}>
        Accounts requiring immediate attention
      </Text>
      <Box marginTop="4">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.theme.text }}>Account</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>ARR</th>
              <th style={{ textAlign: 'center', padding: '12px 8px', color: colors.theme.text }}>Risk</th>
              {showHealthScores && (
                <th style={{ textAlign: 'center', padding: '12px 8px', color: colors.theme.text }}>Health</th>
              )}
              <th style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {churnRiskAccounts.map((account) => (
              <tr key={account.name} style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{account.name}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px' }}>${formatLongNumber(account.arr)}</td>
                <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                  <span style={{
                    color: getRiskColor(account.risk),
                    fontWeight: 600,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: `${getRiskColor(account.risk)}15`,
                  }}>
                    {account.risk}
                  </span>
                </td>
                {showHealthScores && (
                  <td style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <span style={{ color: account.healthScore < 50 ? '#e34850' : account.healthScore < 70 ? '#e68619' : '#44b556' }}>
                      {account.healthScore}
                    </span>
                  </td>
                )}
                <td style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>{account.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Panel>
  );

  const renderExpansionTable = () => (
    <Panel minHeight="350px">
      <Heading size={headingSize as any}>Expansion Opportunities</Heading>
      <Text size="1" style={{ color: colors.theme.text }}>
        Top accounts with upsell potential
      </Text>
      <Box marginTop="4">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.theme.text }}>Account</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>Current ARR</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>Potential</th>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.theme.text }}>Signals</th>
            </tr>
          </thead>
          <tbody>
            {expansionOpportunities.map((opp) => (
              <tr key={opp.name} style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{opp.name}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px' }}>${formatLongNumber(opp.currentArr)}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', color: '#44b556', fontWeight: 600 }}>
                  +${formatLongNumber(opp.potential)}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  {opp.signals.map((signal, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        fontSize: '12px',
                        padding: '2px 6px',
                        marginRight: '4px',
                        borderRadius: '3px',
                        backgroundColor: `${chartColors[0]}20`,
                        color: chartColors[0],
                      }}
                    >
                      {signal}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Panel>
  );

  const renderExecutiveLayout = () => (
    <Column gap={panelSpacing}>
      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="400px">
          <Heading size={headingSize as any}>Revenue Trends</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            MRR, new business, and expansion over 30 days
          </Text>
          <Box height="320px" marginTop="4">
            <BarChart chartData={revenueTrendData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="400px">
          <Heading size={headingSize as any}>Pipeline by Stage</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            Deal value distribution across sales stages
          </Text>
          <Box height="320px" marginTop="4">
            <Chart type="bar" chartData={pipelineChartData} height="100%" />
          </Box>
        </Panel>
      </Grid>

      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Revenue by Segment</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            ARR distribution across customer segments
          </Text>
          <Box height="280px" marginTop="4">
            <PieChart chartData={segmentChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Net Revenue Retention</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            NRR trend over the past 6 months
          </Text>
          <Box height="280px" marginTop="4">
            <Chart type="bar" chartData={nrrChartData} height="100%" />
          </Box>
        </Panel>
      </Grid>

      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        {renderChurnRiskTable()}
        {renderExpansionTable()}
      </Grid>
    </Column>
  );

  const renderDetailedLayout = () => (
    <Column gap={panelSpacing}>
      <Panel minHeight="400px">
        <Heading size={headingSize as any}>Revenue Performance</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          Complete revenue breakdown over 30 days
        </Text>
        <Box height="320px" marginTop="4">
          <BarChart chartData={revenueTrendData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
        </Box>
      </Panel>

      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Pipeline Stages</Heading>
          <Box height="240px" marginTop="4">
            <Chart type="bar" chartData={pipelineChartData} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Segment Mix</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={segmentChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>NRR Trend</Heading>
          <Box height="240px" marginTop="4">
            <Chart type="bar" chartData={nrrChartData} height="100%" />
          </Box>
        </Panel>
      </Grid>

      {renderChurnRiskTable()}
      {renderExpansionTable()}
    </Column>
  );

  const renderFocusedLayout = () => (
    <Column gap={panelSpacing}>
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap={panelSpacing}>
        <Column gap={panelSpacing}>
          <Panel minHeight="350px">
            <Heading size={headingSize as any}>Revenue Trends</Heading>
            <Box height="280px" marginTop="4">
              <BarChart chartData={revenueTrendData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
            </Box>
          </Panel>

          <Panel minHeight="300px">
            <Heading size={headingSize as any}>Pipeline by Stage</Heading>
            <Box height="240px" marginTop="4">
              <Chart type="bar" chartData={pipelineChartData} height="100%" />
            </Box>
          </Panel>
        </Column>

        <Column gap={panelSpacing}>
          <Panel minHeight="300px">
            <Heading size={headingSize as any}>Revenue Segments</Heading>
            <Box height="240px" marginTop="4">
              <PieChart chartData={segmentChartData} type="doughnut" height="100%" />
            </Box>
          </Panel>

          <Panel minHeight="300px">
            <Heading size={headingSize as any}>NRR Trend</Heading>
            <Box height="240px" marginTop="4">
              <Chart type="bar" chartData={nrrChartData} height="100%" />
            </Box>
          </Panel>
        </Column>
      </Grid>

      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        {renderChurnRiskTable()}
        {renderExpansionTable()}
      </Grid>
    </Column>
  );

  return (
    <Column gap={panelSpacing} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column>
          <Heading size="5">Revenue Operations Dashboard</Heading>
          <Text size="2" style={{ color: colors.theme.text }}>
            Sales and CSM view of revenue drivers, pipeline, and risks
          </Text>
        </Column>
      </Row>

      {renderMetricsSection()}

      {layoutStyle === 'executive' && renderExecutiveLayout()}
      {layoutStyle === 'detailed' && renderDetailedLayout()}
      {layoutStyle === 'focused' && renderFocusedLayout()}
    </Column>
  );
}
