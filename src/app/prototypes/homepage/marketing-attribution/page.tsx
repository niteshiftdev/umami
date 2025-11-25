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

// Traffic source data
const trafficSourceData = {
  labels: ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'],
  datasets: [
    {
      label: 'Visitors',
      data: [42500, 28300, 18700, 12400, 21800, 8900],
      backgroundColor: CHART_COLORS.slice(0, 6),
    },
  ],
};

// Campaign performance data
const campaignData = {
  google: generateTimeSeriesData(14, 3200, 1200),
  facebook: generateTimeSeriesData(14, 2100, 800),
  linkedin: generateTimeSeriesData(14, 1400, 600),
  email: generateTimeSeriesData(14, 1800, 700),
};

// UTM source breakdown
const utmSourceData = {
  labels: ['google', 'facebook', 'linkedin', 'twitter', 'newsletter', 'partner'],
  datasets: [
    {
      label: 'Conversions',
      data: [1250, 890, 520, 340, 780, 290],
      backgroundColor: CHART_COLORS.slice(0, 6),
    },
  ],
};

// Landing page performance
const landingPageData = [
  { page: '/pricing', visitors: 15400, conversions: 1230, rate: 7.99 },
  { page: '/features', visitors: 12800, conversions: 640, rate: 5.0 },
  { page: '/demo', visitors: 8500, conversions: 1020, rate: 12.0 },
  { page: '/blog/guide', visitors: 21000, conversions: 420, rate: 2.0 },
  { page: '/signup', visitors: 6200, conversions: 1860, rate: 30.0 },
];

// Conversion funnel
const conversionFunnelData = {
  labels: ['Landing', 'Engaged', 'Lead', 'MQL', 'Converted'],
  datasets: [
    {
      label: 'Users',
      data: [52000, 38500, 12400, 4800, 1920],
      backgroundColor: CHART_COLORS.slice(0, 5),
    },
  ],
};

export default function MarketingAttributionPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const colorPalette = useDynamicVariant('ma-color-palette', {
    label: 'Color Palette',
    description: 'Overall color scheme for charts',
    default: 'default',
    options: ['default', 'brand', 'vibrant', 'pastel'] as const,
    group: 'Colors',
  });

  const layoutStyle = useDynamicVariant('ma-layout-style', {
    label: 'Layout Style',
    description: 'Dashboard layout arrangement',
    default: 'cards',
    options: ['cards', 'list', 'compact'] as const,
    group: 'Layout',
  });

  const visualizationType = useDynamicVariant('ma-viz-type', {
    label: 'Visualization Type',
    description: 'Chart type for trends',
    default: 'bar',
    options: ['bar', 'line', 'stacked'] as const,
    group: 'Visualization',
  });

  const headingSize = useDynamicVariant('ma-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '3',
    options: ['2', '3', '4', '5'] as const,
    group: 'Typography',
  });

  const panelSpacing = useDynamicSpacing('ma-panel-spacing', {
    label: 'Panel Spacing',
    description: 'Gap between panels',
    default: '3',
    options: ['2', '3', '4', '5', '6'] as const,
    group: 'Spacing',
  });

  const showROI = useDynamicBoolean('ma-show-roi', {
    label: 'Show ROI Metrics',
    description: 'Display return on investment calculations',
    default: true,
    group: 'Features',
  });

  const accentColor = useDynamicColor('ma-accent-color', {
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
      case 'brand':
        return ['#2680eb', '#1a5fb4', '#3584e4', '#62a0ea', '#99c1f1', '#c0d8f9'];
      case 'vibrant':
        return ['#ec1562', '#f7bd12', '#44b556', '#2680eb', '#9256d9', '#e68619'];
      case 'pastel':
        return ['#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2', '#b5eaea', '#f3d9dc'];
      default:
        return CHART_COLORS;
    }
  };

  const chartColors = getChartColors();

  // Traffic sources pie chart
  const trafficChartData = useMemo(() => ({
    labels: trafficSourceData.labels,
    datasets: [
      {
        ...trafficSourceData.datasets[0],
        backgroundColor: chartColors.slice(0, 6),
      },
    ],
  }), [chartColors]);

  // Campaign trends chart
  const campaignChartData = useMemo(() => ({
    datasets: [
      {
        type: visualizationType === 'stacked' ? 'bar' : visualizationType,
        label: 'Google Ads',
        data: campaignData.google,
        backgroundColor: visualizationType === 'line' ? 'transparent' : chartColors[0],
        borderColor: chartColors[0],
        borderWidth: 2,
        fill: false,
        stack: visualizationType === 'stacked' ? 'stack1' : undefined,
        order: 1,
      },
      {
        type: visualizationType === 'stacked' ? 'bar' : visualizationType,
        label: 'Facebook',
        data: campaignData.facebook,
        backgroundColor: visualizationType === 'line' ? 'transparent' : chartColors[1],
        borderColor: chartColors[1],
        borderWidth: 2,
        fill: false,
        stack: visualizationType === 'stacked' ? 'stack1' : undefined,
        order: 2,
      },
      {
        type: visualizationType === 'stacked' ? 'bar' : visualizationType,
        label: 'LinkedIn',
        data: campaignData.linkedin,
        backgroundColor: visualizationType === 'line' ? 'transparent' : chartColors[2],
        borderColor: chartColors[2],
        borderWidth: 2,
        fill: false,
        stack: visualizationType === 'stacked' ? 'stack1' : undefined,
        order: 3,
      },
      {
        type: visualizationType === 'stacked' ? 'bar' : visualizationType,
        label: 'Email',
        data: campaignData.email,
        backgroundColor: visualizationType === 'line' ? 'transparent' : chartColors[3],
        borderColor: chartColors[3],
        borderWidth: 2,
        fill: false,
        stack: visualizationType === 'stacked' ? 'stack1' : undefined,
        order: 4,
      },
    ],
  }), [visualizationType, chartColors]);

  // UTM source chart
  const utmChartData = useMemo(() => ({
    labels: utmSourceData.labels,
    datasets: [
      {
        ...utmSourceData.datasets[0],
        backgroundColor: chartColors.slice(0, 6),
      },
    ],
  }), [chartColors]);

  // Conversion funnel chart
  const funnelChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Users',
        data: conversionFunnelData.datasets[0].data.map((y, i) => ({
          x: conversionFunnelData.labels[i],
          y,
        })),
        backgroundColor: chartColors.slice(0, 5),
        borderColor: chartColors.slice(0, 5),
        borderWidth: 1,
      },
    ],
  }), [chartColors]);

  const renderMetricsSection = () => (
    <MetricsBar>
      <MetricCard
        label="Total Visitors"
        value={132600}
        change={18500}
        showLabel
        showChange
        valueColor={accentColor}
      />
      <MetricCard
        label="Conversions"
        value={4070}
        change={520}
        showLabel
        showChange
      />
      <MetricCard
        label="Conversion Rate"
        value={3.07}
        change={0.4}
        showLabel
        showChange
        formatValue={(n) => `${n.toFixed(2)}%`}
      />
      <MetricCard
        label="Cost per Acquisition"
        value={42.80}
        change={-5.20}
        showLabel
        showChange
        formatValue={(n) => `$${n.toFixed(2)}`}
        reverseColors
      />
      {showROI && (
        <MetricCard
          label="Marketing ROI"
          value={340}
          change={45}
          showLabel
          showChange
          formatValue={(n) => `${n}%`}
        />
      )}
    </MetricsBar>
  );

  const renderLandingPageTable = () => (
    <Panel minHeight="350px">
      <Heading size={headingSize as any}>Landing Page Performance</Heading>
      <Text size="1" style={{ color: colors.theme.text }}>
        Top converting pages by traffic source
      </Text>
      <Box marginTop="4">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
              <th style={{ textAlign: 'left', padding: '12px 8px', color: colors.theme.text }}>Page</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>Visitors</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>Conversions</th>
              <th style={{ textAlign: 'right', padding: '12px 8px', color: colors.theme.text }}>Conv. Rate</th>
            </tr>
          </thead>
          <tbody>
            {landingPageData.map((row) => (
              <tr key={row.page} style={{ borderBottom: `1px solid ${colors.theme.line}` }}>
                <td style={{ padding: '12px 8px', fontWeight: 500 }}>{row.page}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px' }}>{formatLongNumber(row.visitors)}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px' }}>{formatLongNumber(row.conversions)}</td>
                <td style={{ textAlign: 'right', padding: '12px 8px', color: row.rate > 10 ? '#44b556' : 'inherit' }}>
                  {row.rate.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Panel>
  );

  const renderCardsLayout = () => (
    <Column gap={panelSpacing}>
      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="400px">
          <Heading size={headingSize as any}>Traffic Sources</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            Visitor distribution by acquisition channel
          </Text>
          <Box height="320px" marginTop="4">
            <PieChart chartData={trafficChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="400px">
          <Heading size={headingSize as any}>Campaign Performance</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            Visitors from paid campaigns over time
          </Text>
          <Box height="320px" marginTop="4">
            <BarChart
              chartData={campaignChartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              stacked={visualizationType === 'stacked'}
              height="100%"
            />
          </Box>
        </Panel>
      </Grid>

      <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="400px">
          <Heading size={headingSize as any}>Conversion Funnel</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            User journey from landing to conversion
          </Text>
          <Box height="320px" marginTop="4">
            <Chart type="bar" chartData={funnelChartData} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="400px">
          <Heading size={headingSize as any}>UTM Source Attribution</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            Conversions by UTM source parameter
          </Text>
          <Box height="320px" marginTop="4">
            <PieChart chartData={utmChartData} type="pie" height="100%" />
          </Box>
        </Panel>
      </Grid>

      {renderLandingPageTable()}
    </Column>
  );

  const renderListLayout = () => (
    <Column gap={panelSpacing}>
      <Panel minHeight="400px">
        <Heading size={headingSize as any}>Campaign Performance Trends</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          All campaign channels over the past 14 days
        </Text>
        <Box height="320px" marginTop="4">
          <BarChart
            chartData={campaignChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            stacked={visualizationType === 'stacked'}
            height="100%"
          />
        </Box>
      </Panel>

      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Traffic Sources</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={trafficChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Conversion Funnel</Heading>
          <Box height="240px" marginTop="4">
            <Chart type="bar" chartData={funnelChartData} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>UTM Sources</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={utmChartData} type="pie" height="100%" />
          </Box>
        </Panel>
      </Grid>

      {renderLandingPageTable()}
    </Column>
  );

  const renderCompactLayout = () => (
    <Column gap={panelSpacing}>
      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="280px">
          <Heading size={headingSize as any}>Traffic Sources</Heading>
          <Box height="220px" marginTop="3">
            <PieChart chartData={trafficChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="280px">
          <Heading size={headingSize as any}>Conversion Funnel</Heading>
          <Box height="220px" marginTop="3">
            <Chart type="bar" chartData={funnelChartData} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="280px">
          <Heading size={headingSize as any}>UTM Sources</Heading>
          <Box height="220px" marginTop="3">
            <PieChart chartData={utmChartData} type="pie" height="100%" />
          </Box>
        </Panel>
      </Grid>

      <Panel minHeight="350px">
        <Heading size={headingSize as any}>Campaign Performance</Heading>
        <Box height="280px" marginTop="3">
          <BarChart
            chartData={campaignChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            stacked={visualizationType === 'stacked'}
            height="100%"
          />
        </Box>
      </Panel>

      {renderLandingPageTable()}
    </Column>
  );

  return (
    <Column gap={panelSpacing} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column>
          <Heading size="5">Marketing Attribution Dashboard</Heading>
          <Text size="2" style={{ color: colors.theme.text }}>
            Track inbound sources and campaign performance
          </Text>
        </Column>
      </Row>

      {renderMetricsSection()}

      {layoutStyle === 'cards' && renderCardsLayout()}
      {layoutStyle === 'list' && renderListLayout()}
      {layoutStyle === 'compact' && renderCompactLayout()}
    </Column>
  );
}
