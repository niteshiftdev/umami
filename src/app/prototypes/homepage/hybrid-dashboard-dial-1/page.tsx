'use client';
/**
 * Hybrid Dashboard - Dial 1: "Card Grid"
 * Design exploration: Uniform card grid, mini visualizations, equal weight to all areas
 * Focus: Balanced view, consistent card sizing, mini charts within cards
 */
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { getThemeColors } from '@/lib/colors';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Dashboard } from '@/components/svg';

// Balanced color palette
const BALANCED_COLORS = {
  product: '#2680eb',
  marketing: '#9256d9',
  revenue: '#44b556',
  accent: '#e68619',
  muted: '#6b7280',
};

// Generate mini chart data (7 days)
function generateMiniData(base: number, variance: number) {
  const today = new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data.push({ x: dateStr, y: Math.round(base + Math.random() * variance - variance / 2) });
  }
  return data;
}

// KPI summaries for each area
const productKPIs = [
  { label: 'DAU', value: 22960, change: 7.0 },
  { label: 'MAU', value: 156432, change: 5.0 },
  { label: 'Retention', value: 42.3, change: 6.3, suffix: '%' },
];

const marketingKPIs = [
  { label: 'Sessions', value: 396230, change: 8.7 },
  { label: 'Conversions', value: 14490, change: 13.6 },
  { label: 'Conv. Rate', value: 3.65, change: 4.5, suffix: '%' },
];

const revenueKPIs = [
  { label: 'MRR', value: 642000, change: 4.2, prefix: '$' },
  { label: 'Pipeline', value: 6878000, change: 12.4, prefix: '$' },
  { label: 'NRR', value: 118, change: 2.1, suffix: '%' },
];

// Mini metric row
function MiniMetricRow({ label, value, change, prefix = '', suffix = '' }: any) {
  return (
    <Row justifyContent="space-between" alignItems="center" paddingY="1">
      <Text size="1" color="muted">{label}</Text>
      <Row gap="2" alignItems="baseline">
        <Text size="2" weight="bold">{prefix}{typeof value === 'number' && value >= 1000 ? formatNumber(value) : value}{suffix}</Text>
        <Text size="1" style={{ color: change >= 0 ? BALANCED_COLORS.revenue : '#e34850' }}>
          {change >= 0 ? '+' : ''}{change}%
        </Text>
      </Row>
    </Row>
  );
}

// Mini sparkline placeholder (simplified bar representation)
function MiniSparkBars({ data, color }: { data: { x: string; y: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.y));
  return (
    <Row gap="1" alignItems="flex-end" height="40px" style={{ marginTop: 8 }}>
      {data.map((d, idx) => (
        <div
          key={idx}
          style={{
            flex: 1,
            height: `${(d.y / max) * 100}%`,
            backgroundColor: color,
            borderRadius: 2,
            minHeight: 4,
          }}
        />
      ))}
    </Row>
  );
}

// Area card component
function AreaCard({ title, color, kpis, chartData }: { title: string; color: string; kpis: any[]; chartData: any[] }) {
  return (
    <Column paddingX="4" paddingY="4" borderRadius="3" backgroundColor border gap="3">
      <Row gap="2" alignItems="center">
        <div style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: color }} />
        <Text size="2" weight="bold">{title}</Text>
      </Row>
      <Column gap="1">
        {kpis.map((kpi, idx) => (
          <MiniMetricRow key={idx} {...kpi} />
        ))}
      </Column>
      <MiniSparkBars data={chartData} color={color} />
    </Column>
  );
}

// Alert/insight item
const alerts = [
  { area: 'Product', type: 'insight', message: 'Power users up 8.2% this week', color: BALANCED_COLORS.product },
  { area: 'Marketing', type: 'success', message: 'Black Friday campaign +35% over target', color: BALANCED_COLORS.marketing },
  { area: 'Revenue', type: 'risk', message: 'Digital Solutions renewal at risk', color: '#e34850' },
];

// Top performers from each area
const topPerformers = [
  { area: 'Product', item: '/dashboard', metric: '5m 42s avg time', color: BALANCED_COLORS.product },
  { area: 'Marketing', item: 'Organic Search', metric: '125K sessions', color: BALANCED_COLORS.marketing },
  { area: 'Revenue', item: 'Enterprise Segment', metric: '$4.2M ARR', color: BALANCED_COLORS.revenue },
];

export default function HybridDashboardDial1Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate chart data for each area
  const productChartData = useMemo(() => generateMiniData(12000, 4000), []);
  const marketingChartData = useMemo(() => generateMiniData(8000, 3000), []);
  const revenueChartData = useMemo(() => generateMiniData(24000, 8000), []);
  const combinedData = useMemo(() => generateMiniData(15000, 5000), []);

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const combinedChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Product (DAU)',
          data: productChartData,
          backgroundColor: BALANCED_COLORS.product,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Marketing (Sessions/10)',
          data: marketingChartData,
          backgroundColor: BALANCED_COLORS.marketing,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Revenue ($)',
          data: revenueChartData,
          backgroundColor: BALANCED_COLORS.revenue,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [productChartData, marketingChartData, revenueChartData],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  return (
    <PageBody>
      <PageHeader title="Executive Dashboard" icon={<Dashboard />} description="Card Grid Layout - Balanced View" />

      {/* Three Area Cards */}
      <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="3">
        <AreaCard title="Product Analytics" color={BALANCED_COLORS.product} kpis={productKPIs} chartData={productChartData} />
        <AreaCard title="Marketing Attribution" color={BALANCED_COLORS.marketing} kpis={marketingKPIs} chartData={marketingChartData} />
        <AreaCard title="Revenue Operations" color={BALANCED_COLORS.revenue} kpis={revenueKPIs} chartData={revenueChartData} />
      </Grid>

      {/* Combined Trend Chart */}
      <Panel title="7-Day Combined Trend">
        <BarChart
          chartData={combinedChartData}
          unit="day"
          minDate={sevenDaysAgo}
          maxDate={today}
          renderXLabel={renderXLabel}
          height="280px"
        />
      </Panel>

      {/* Alerts and Top Performers Side by Side */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        <Panel title="Key Alerts">
          <Column gap="2">
            {alerts.map((alert, idx) => (
              <Row key={idx} paddingX="3" paddingY="3" gap="3" alignItems="center" style={{
                borderLeft: `3px solid ${alert.color}`,
                backgroundColor: `${alert.color}10`,
                borderRadius: 4,
              }}>
                <Column style={{ flex: 1 }}>
                  <Row gap="2" alignItems="center">
                    <Text size="1" weight="bold" style={{ color: alert.color }}>{alert.area}</Text>
                    <Text size="1" color="muted">{alert.type}</Text>
                  </Row>
                  <Text size="2">{alert.message}</Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>

        <Panel title="Top Performers">
          <Column gap="2">
            {topPerformers.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="3" justifyContent="space-between" alignItems="center" style={{
                borderBottom: `1px solid ${colors.chart.line}`,
              }}>
                <Row gap="2" alignItems="center">
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
                  <Column>
                    <Text size="1" color="muted">{item.area}</Text>
                    <Text size="2" weight="bold">{item.item}</Text>
                  </Column>
                </Row>
                <Text size="2">{item.metric}</Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
