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

// Mock engagement data
const engagementData = {
  dailyActiveUsers: generateTimeSeriesData(14, 12500, 4000),
  weeklyActiveUsers: generateTimeSeriesData(14, 45000, 10000),
  monthlyActiveUsers: generateTimeSeriesData(14, 125000, 20000),
};

// Feature adoption data
const featureAdoptionData = {
  labels: ['Dashboard', 'Reports', 'Analytics', 'Settings', 'API', 'Integrations'],
  datasets: [
    {
      label: 'Users',
      data: [89, 72, 65, 45, 38, 28],
      backgroundColor: CHART_COLORS.slice(0, 6),
    },
  ],
};

// User journey stages
const journeyStagesData = {
  labels: ['Signup', 'Onboarding', 'First Action', 'Power User', 'Advocate'],
  datasets: [
    {
      label: 'Users in Stage',
      data: [15000, 12000, 8500, 4200, 1800],
      backgroundColor: CHART_COLORS.slice(0, 5),
    },
  ],
};

// Session duration distribution
const sessionDurationData = {
  labels: ['<1 min', '1-5 min', '5-15 min', '15-30 min', '30+ min'],
  datasets: [
    {
      label: 'Sessions',
      data: [8500, 22000, 35000, 18000, 9500],
      backgroundColor: CHART_COLORS.slice(0, 5),
    },
  ],
};

export default function ProductAnalyticsPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const colorPalette = useDynamicVariant('pa-color-palette', {
    label: 'Color Palette',
    description: 'Overall color scheme for charts',
    default: 'default',
    options: ['default', 'warm', 'cool', 'monochrome'] as const,
    group: 'Colors',
  });

  const layoutStyle = useDynamicVariant('pa-layout-style', {
    label: 'Layout Style',
    description: 'Dashboard layout arrangement',
    default: 'grid',
    options: ['grid', 'stacked', 'sidebar'] as const,
    group: 'Layout',
  });

  const chartStyle = useDynamicVariant('pa-chart-style', {
    label: 'Chart Style',
    description: 'Visualization approach for charts',
    default: 'bar',
    options: ['bar', 'line', 'area'] as const,
    group: 'Visualization',
  });

  const headingSize = useDynamicVariant('pa-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '3',
    options: ['2', '3', '4', '5'] as const,
    group: 'Typography',
  });

  const panelSpacing = useDynamicSpacing('pa-panel-spacing', {
    label: 'Panel Spacing',
    description: 'Gap between panels',
    default: '3',
    options: ['2', '3', '4', '5', '6'] as const,
    group: 'Spacing',
  });

  const showChangeIndicators = useDynamicBoolean('pa-show-change', {
    label: 'Show Change Indicators',
    description: 'Display percentage changes on metrics',
    default: true,
    group: 'Features',
  });

  const accentColor = useDynamicColor('pa-accent-color', {
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
      case 'warm':
        return ['#e68619', '#e34850', '#f7bd12', '#ffc301', '#ec1562', '#ffec16'];
      case 'cool':
        return ['#2680eb', '#9256d9', '#01bad7', '#6734bc', '#44b556', '#89c541'];
      case 'monochrome':
        return ['#1a1a1a', '#404040', '#666666', '#8c8c8c', '#b3b3b3', '#d9d9d9'];
      default:
        return CHART_COLORS;
    }
  };

  const chartColors = getChartColors();

  // Engagement chart data
  const engagementChartData = useMemo(() => ({
    datasets: [
      {
        type: chartStyle === 'area' ? 'line' : chartStyle,
        label: 'DAU',
        data: engagementData.dailyActiveUsers,
        backgroundColor: chartStyle === 'area' ? `${chartColors[0]}40` : chartColors[0],
        borderColor: chartColors[0],
        borderWidth: 2,
        fill: chartStyle === 'area',
        order: 1,
      },
      {
        type: chartStyle === 'area' ? 'line' : chartStyle,
        label: 'WAU / 7',
        data: engagementData.weeklyActiveUsers.map(d => ({ ...d, y: Math.floor(d.y / 7) })),
        backgroundColor: chartStyle === 'area' ? `${chartColors[1]}40` : chartColors[1],
        borderColor: chartColors[1],
        borderWidth: 2,
        fill: chartStyle === 'area',
        order: 2,
      },
    ],
  }), [chartStyle, chartColors]);

  // Feature adoption pie chart
  const featureChartData = useMemo(() => ({
    labels: featureAdoptionData.labels,
    datasets: [
      {
        ...featureAdoptionData.datasets[0],
        backgroundColor: chartColors.slice(0, 6),
      },
    ],
  }), [chartColors]);

  // Journey funnel data
  const journeyChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Users',
        data: journeyStagesData.datasets[0].data.map((y, i) => ({
          x: journeyStagesData.labels[i],
          y,
        })),
        backgroundColor: chartColors.slice(0, 5),
        borderColor: chartColors.slice(0, 5),
        borderWidth: 1,
      },
    ],
  }), [chartColors]);

  // Session duration chart
  const sessionChartData = useMemo(() => ({
    labels: sessionDurationData.labels,
    datasets: [
      {
        ...sessionDurationData.datasets[0],
        backgroundColor: chartColors.slice(0, 5),
      },
    ],
  }), [chartColors]);

  const renderMetricsSection = () => (
    <MetricsBar>
      <MetricCard
        label="Daily Active Users"
        value={12847}
        change={showChangeIndicators ? 1156 : undefined}
        showLabel
        showChange={showChangeIndicators}
        valueColor={accentColor}
      />
      <MetricCard
        label="Avg. Session Duration"
        value={847}
        change={showChangeIndicators ? 72 : undefined}
        showLabel
        showChange={showChangeIndicators}
        formatValue={(n) => `${Math.floor(n / 60)}m ${n % 60}s`}
      />
      <MetricCard
        label="Pages per Session"
        value={5.8}
        change={showChangeIndicators ? 0.4 : undefined}
        showLabel
        showChange={showChangeIndicators}
        formatValue={(n) => n.toFixed(1)}
      />
      <MetricCard
        label="Bounce Rate"
        value={32.4}
        change={showChangeIndicators ? -2.8 : undefined}
        showLabel
        showChange={showChangeIndicators}
        formatValue={(n) => `${n.toFixed(1)}%`}
        reverseColors
      />
      <MetricCard
        label="Feature Adoption"
        value={67}
        change={showChangeIndicators ? 5 : undefined}
        showLabel
        showChange={showChangeIndicators}
        formatValue={(n) => `${n}%`}
      />
    </MetricsBar>
  );

  const renderGridLayout = () => (
    <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={panelSpacing}>
      <Panel minHeight="400px">
        <Heading size={headingSize as any}>User Engagement Trends</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          Daily and weekly active users over the past 14 days
        </Text>
        <Box height="320px" marginTop="4">
          <BarChart
            chartData={engagementChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            height="100%"
          />
        </Box>
      </Panel>

      <Panel minHeight="400px">
        <Heading size={headingSize as any}>Feature Adoption Rate</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          Percentage of users engaging with each feature
        </Text>
        <Box height="320px" marginTop="4">
          <PieChart
            chartData={featureChartData}
            type="doughnut"
            height="100%"
          />
        </Box>
      </Panel>

      <Panel minHeight="400px">
        <Heading size={headingSize as any}>User Journey Funnel</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          Users at each stage of the product journey
        </Text>
        <Box height="320px" marginTop="4">
          <Chart
            type="bar"
            chartData={journeyChartData}
            height="100%"
          />
        </Box>
      </Panel>

      <Panel minHeight="400px">
        <Heading size={headingSize as any}>Session Duration Distribution</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          How long users spend in each session
        </Text>
        <Box height="320px" marginTop="4">
          <PieChart
            chartData={sessionChartData}
            type="pie"
            height="100%"
          />
        </Box>
      </Panel>
    </Grid>
  );

  const renderStackedLayout = () => (
    <Column gap={panelSpacing}>
      <Panel minHeight="350px">
        <Heading size={headingSize as any}>User Engagement Trends</Heading>
        <Text size="1" style={{ color: colors.theme.text }}>
          Daily and weekly active users over the past 14 days
        </Text>
        <Box height="280px" marginTop="4">
          <BarChart
            chartData={engagementChartData}
            unit="day"
            minDate={minDate}
            maxDate={maxDate}
            height="100%"
          />
        </Box>
      </Panel>

      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={panelSpacing}>
        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Feature Adoption</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={featureChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>User Journey</Heading>
          <Box height="240px" marginTop="4">
            <Chart type="bar" chartData={journeyChartData} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="300px">
          <Heading size={headingSize as any}>Session Duration</Heading>
          <Box height="240px" marginTop="4">
            <PieChart chartData={sessionChartData} type="pie" height="100%" />
          </Box>
        </Panel>
      </Grid>
    </Column>
  );

  const renderSidebarLayout = () => (
    <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap={panelSpacing}>
      <Column gap={panelSpacing}>
        <Panel minHeight="400px">
          <Heading size={headingSize as any}>User Engagement Trends</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            Daily and weekly active users over the past 14 days
          </Text>
          <Box height="320px" marginTop="4">
            <BarChart chartData={engagementChartData} unit="day" minDate={minDate} maxDate={maxDate} height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="350px">
          <Heading size={headingSize as any}>User Journey Funnel</Heading>
          <Text size="1" style={{ color: colors.theme.text }}>
            Users at each stage of the product journey
          </Text>
          <Box height="280px" marginTop="4">
            <Chart type="bar" chartData={journeyChartData} height="100%" />
          </Box>
        </Panel>
      </Column>

      <Column gap={panelSpacing}>
        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Feature Adoption</Heading>
          <Box height="280px" marginTop="4">
            <PieChart chartData={featureChartData} type="doughnut" height="100%" />
          </Box>
        </Panel>

        <Panel minHeight="350px">
          <Heading size={headingSize as any}>Session Duration</Heading>
          <Box height="280px" marginTop="4">
            <PieChart chartData={sessionChartData} type="pie" height="100%" />
          </Box>
        </Panel>
      </Column>
    </Grid>
  );

  return (
    <Column gap={panelSpacing} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column>
          <Heading size="5">Product Analytics Dashboard</Heading>
          <Text size="2" style={{ color: colors.theme.text }}>
            User engagement metrics and behavior patterns
          </Text>
        </Column>
      </Row>

      {renderMetricsSection()}

      {layoutStyle === 'grid' && renderGridLayout()}
      {layoutStyle === 'stacked' && renderStackedLayout()}
      {layoutStyle === 'sidebar' && renderSidebarLayout()}
    </Column>
  );
}
