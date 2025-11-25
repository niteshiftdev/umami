'use client';
/**
 * Hybrid Dashboard - Dial 2: "Tab Sections"
 * Design exploration: Tabbed interface simulation, section-based layout, navigation hints
 * Focus: Organized sections, clear separation, drill-down indicators
 */
import { useMemo, useCallback, useState } from 'react';
import { Column, Row, Grid, Text, Button, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { getThemeColors } from '@/lib/colors';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Dashboard } from '@/components/svg';

// Section colors
const SECTION_COLORS = {
  overview: '#2680eb',
  product: '#9256d9',
  marketing: '#01bad7',
  revenue: '#44b556',
};

function generateData(days: number, base: number, variance: number) {
  const today = new Date();
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data.push({ x: dateStr, y: Math.round(base + Math.random() * variance - variance / 2) });
  }
  return data;
}

// Key metrics for overview
const overviewMetrics = [
  { label: 'Active Users', value: 22960, change: 7.0, category: 'Product' },
  { label: 'Sessions', value: 396230, change: 8.7, category: 'Marketing' },
  { label: 'Conversions', value: 14490, change: 13.6, category: 'Marketing' },
  { label: 'MRR', value: 642000, change: 4.2, category: 'Revenue', prefix: '$' },
  { label: 'Pipeline', value: 6878000, change: 12.4, category: 'Revenue', prefix: '$' },
  { label: 'Retention', value: 42.3, change: 6.3, category: 'Product', suffix: '%' },
];

const channelData = [
  { channel: 'Organic', sessions: 125430, conversions: 4521 },
  { channel: 'Paid', sessions: 84200, conversions: 3842 },
  { channel: 'Social', sessions: 52100, conversions: 1245 },
  { channel: 'Email', sessions: 38400, conversions: 2156 },
];

const pipelineData = [
  { stage: 'Qualified', value: 2480000 },
  { stage: 'Discovery', value: 1872000 },
  { stage: 'Proposal', value: 1602000 },
  { stage: 'Negotiation', value: 924000 },
];

// Section header with action hint
function SectionHeader({ title, color, subtitle }: { title: string; color: string; subtitle?: string }) {
  return (
    <Row paddingY="4" paddingX="4" alignItems="center" gap="3" style={{
      borderLeft: `4px solid ${color}`,
      backgroundColor: `${color}08`,
      borderRadius: '0 4px 4px 0',
      marginBottom: 12,
    }}>
      <Column style={{ flex: 1 }}>
        <Text size="3" weight="bold">{title}</Text>
        {subtitle && <Text size="1" color="muted">{subtitle}</Text>}
      </Column>
      <Button size="sm" variant="quiet">View Details</Button>
    </Row>
  );
}

// Metric badge
function MetricBadge({ label, value, change, prefix = '', suffix = '', category }: any) {
  const categoryColor = category === 'Product' ? SECTION_COLORS.product : category === 'Marketing' ? SECTION_COLORS.marketing : SECTION_COLORS.revenue;
  return (
    <Column paddingX="4" paddingY="3" borderRadius="2" backgroundColor border gap="1">
      <Row gap="2" alignItems="center">
        <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: categoryColor }} />
        <Text size="1" color="muted">{label}</Text>
      </Row>
      <Text size="5" weight="bold">{prefix}{typeof value === 'number' && value >= 1000 ? formatNumber(value) : value}{suffix}</Text>
      <Text size="1" style={{ color: change >= 0 ? '#44b556' : '#e34850' }}>
        {change >= 0 ? '+' : ''}{change}% vs prior
      </Text>
    </Column>
  );
}

export default function HybridDashboardDial2Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const engagementData = useMemo(() => generateData(14, 12000, 4000), []);
  const revenueData = useMemo(() => generateData(14, 24000, 8000), []);

  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);

  const engagementChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Active Users',
          data: engagementData,
          backgroundColor: SECTION_COLORS.product,
          borderWidth: 0,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [engagementData],
  );

  const revenueChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Revenue',
          data: revenueData,
          backgroundColor: SECTION_COLORS.revenue,
          borderWidth: 0,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [revenueData],
  );

  const channelPieData = useMemo(
    () => ({
      labels: channelData.map(c => c.channel),
      datasets: [
        {
          data: channelData.map(c => c.sessions),
          backgroundColor: [SECTION_COLORS.overview, SECTION_COLORS.product, SECTION_COLORS.marketing, SECTION_COLORS.revenue],
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  return (
    <PageBody>
      <PageHeader title="Executive Dashboard" icon={<Dashboard />} description="Section Layout - Organized View" />

      {/* Overview Section */}
      <SectionHeader title="Overview" color={SECTION_COLORS.overview} subtitle="Key metrics across all areas" />
      <Grid columns={{ xs: '1fr 1fr', md: 'repeat(3, 1fr)' }} gap="3">
        {overviewMetrics.map((metric, idx) => (
          <MetricBadge key={idx} {...metric} />
        ))}
      </Grid>

      {/* Product Section */}
      <SectionHeader title="Product Analytics" color={SECTION_COLORS.product} subtitle="User engagement and behavior" />
      <Panel>
        <BarChart
          chartData={engagementChartData}
          unit="day"
          minDate={twoWeeksAgo}
          maxDate={today}
          renderXLabel={renderXLabel}
          height="240px"
        />
      </Panel>

      {/* Marketing Section */}
      <SectionHeader title="Marketing Attribution" color={SECTION_COLORS.marketing} subtitle="Traffic sources and campaigns" />
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        <Panel title="Channel Distribution">
          <Row justifyContent="center" alignItems="center" height="220px">
            <PieChart type="doughnut" chartData={channelPieData} width="200px" height="200px" />
          </Row>
        </Panel>
        <Panel title="Channel Performance">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 1 }}>Channel</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Sessions</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Conversions</Text>
            </Row>
            {channelData.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Row gap="2" alignItems="center" style={{ flex: 1 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    backgroundColor: [SECTION_COLORS.overview, SECTION_COLORS.product, SECTION_COLORS.marketing, SECTION_COLORS.revenue][idx],
                  }} />
                  <Text size="2">{item.channel}</Text>
                </Row>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatNumber(item.sessions)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatNumber(item.conversions)}</Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </Grid>

      {/* Revenue Section */}
      <SectionHeader title="Revenue Operations" color={SECTION_COLORS.revenue} subtitle="Pipeline and financial metrics" />
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="3">
        <Panel title="Revenue Trend">
          <BarChart
            chartData={revenueChartData}
            unit="day"
            minDate={twoWeeksAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="240px"
            currency="USD"
          />
        </Panel>
        <Panel title="Pipeline by Stage">
          <Column gap="2">
            {pipelineData.map((item, idx) => {
              const maxValue = Math.max(...pipelineData.map(p => p.value));
              const widthPercent = (item.value / maxValue) * 100;
              return (
                <Column key={idx} gap="1">
                  <Row justifyContent="space-between">
                    <Text size="2">{item.stage}</Text>
                    <Text size="2" weight="bold">${formatNumber(item.value)}</Text>
                  </Row>
                  <div style={{ width: '100%', height: 8, backgroundColor: 'rgba(128,128,128,0.15)', borderRadius: 4 }}>
                    <div style={{
                      width: `${widthPercent}%`,
                      height: '100%',
                      backgroundColor: SECTION_COLORS.revenue,
                      borderRadius: 4,
                    }} />
                  </div>
                </Column>
              );
            })}
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
