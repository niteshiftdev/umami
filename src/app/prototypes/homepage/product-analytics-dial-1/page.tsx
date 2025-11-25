'use client';
/**
 * Product Analytics - Dial 1: "Compact Cards"
 * Design exploration: Denser layout with smaller metric cards and warm color palette
 * Focus: Information density, warm orange/red tones, compact spacing
 */
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { getThemeColors } from '@/lib/colors';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Overview } from '@/components/svg';

// Custom warm color palette for this dial
const WARM_COLORS = ['#e68619', '#e34850', '#f7bd12', '#9256d9', '#44b556', '#2680eb'];

// Generate engagement data
function generateEngagementData() {
  const today = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActive = isWeekend ? 8500 : 12000;
    data.push({ x: dateStr, y: Math.round(baseActive + Math.random() * 3000 - 1500) });
  }
  return data;
}

function generateRetentionData() {
  const today = new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const baseRetention = 42;
    data.push({ x: dateStr, y: Math.round((baseRetention + Math.random() * 15 - 7.5) * 10) / 10 });
  }
  return data;
}

const featureUsageData = [
  { label: 'Dashboard', value: 34500 },
  { label: 'Reports', value: 28200 },
  { label: 'Analytics', value: 21800 },
  { label: 'Settings', value: 12400 },
  { label: 'Export', value: 6200 },
];

const userSegments = [
  { segment: 'Power Users', count: 2845, growth: 8.2 },
  { segment: 'Regular Users', count: 8932, growth: 3.1 },
  { segment: 'Occasional Users', count: 7621, growth: -2.4 },
  { segment: 'New Users', count: 3562, growth: 15.8 },
];

const topPages = [
  { page: '/dashboard', time: '5:42', sessions: 34521 },
  { page: '/reports/analytics', time: '4:18', sessions: 28432 },
  { page: '/settings', time: '3:55', sessions: 12843 },
];

// Compact metric card component
function CompactMetric({ label, value, change, format = formatNumber }: { label: string; value: number; change?: number; format?: (n: number) => string }) {
  const isPositive = change && change > 0;
  return (
    <Column paddingX="4" paddingY="3" borderRadius="2" backgroundColor border gap="1">
      <Text size="1" color="muted" weight="bold">
        {label}
      </Text>
      <Text size="6" weight="bold">
        {format(value)}
      </Text>
      {change !== undefined && (
        <Text size="1" style={{ color: isPositive ? '#44b556' : '#e34850' }}>
          {isPositive ? '+' : ''}
          {change.toFixed(1)}%
        </Text>
      )}
    </Column>
  );
}

export default function ProductAnalyticsDial1Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const engagementData = useMemo(() => generateEngagementData(), []);
  const retentionData = useMemo(() => generateRetentionData(), []);

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const engagementChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'DAU',
          data: engagementData,
          backgroundColor: WARM_COLORS[0],
          borderColor: WARM_COLORS[0],
          borderWidth: 1,
          barPercentage: 0.7,
          categoryPercentage: 0.85,
        },
      ],
    }),
    [engagementData],
  );

  const retentionChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Retention %',
          data: retentionData,
          backgroundColor: WARM_COLORS[1],
          borderColor: WARM_COLORS[1],
          borderWidth: 1,
          barPercentage: 0.6,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [retentionData],
  );

  const featureChartData = useMemo(
    () => ({
      labels: featureUsageData.map(d => d.label),
      datasets: [
        {
          data: featureUsageData.map(d => d.value),
          backgroundColor: WARM_COLORS.slice(0, featureUsageData.length),
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  return (
    <PageBody>
      <PageHeader title="Product Analytics" icon={<Overview />} description="Compact Cards Layout - Warm Palette" />

      {/* Compact Metrics Grid - 6 columns */}
      <Grid columns={{ xs: '1fr 1fr', md: 'repeat(6, 1fr)' }} gap="2">
        <CompactMetric label="DAU" value={22960} change={7.0} />
        <CompactMetric label="MAU" value={156432} change={5.0} />
        <CompactMetric label="Sessions/User" value={5.2} change={8.3} format={(n) => n.toFixed(1)} />
        <CompactMetric label="Retention %" value={42.3} change={6.3} format={(n) => `${n.toFixed(1)}%`} />
        <CompactMetric label="Avg Duration" value={4.8} change={6.7} format={(n) => `${n.toFixed(1)}m`} />
        <CompactMetric label="Bounce Rate" value={24.5} change={-3.2} format={(n) => `${n.toFixed(1)}%`} />
      </Grid>

      {/* Main Chart - Full Width */}
      <Panel title="Daily Active Users (30 Days)">
        <BarChart
          chartData={engagementChartData}
          unit="day"
          minDate={thirtyDaysAgo}
          maxDate={today}
          renderXLabel={renderXLabel}
          height="260px"
        />
      </Panel>

      {/* Two Column Layout */}
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="3">
        <Panel title="7-Day Retention">
          <BarChart
            chartData={retentionChartData}
            unit="day"
            minDate={sevenDaysAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="200px"
          />
        </Panel>
        <Panel title="Feature Usage">
          <Row justifyContent="center" alignItems="center" height="200px">
            <PieChart type="doughnut" chartData={featureChartData} width="180px" height="180px" />
          </Row>
        </Panel>
      </Grid>

      {/* Compact Tables Side by Side */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        <Panel title="User Segments">
          <Column gap="1">
            {userSegments.map((item, idx) => (
              <Row key={idx} paddingX="2" paddingY="2" justifyContent="space-between" alignItems="center" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Row gap="2" alignItems="center">
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: WARM_COLORS[idx] }} />
                  <Text size="2">{item.segment}</Text>
                </Row>
                <Row gap="3">
                  <Text size="2">{formatNumber(item.count)}</Text>
                  <Text size="2" style={{ color: item.growth >= 0 ? '#44b556' : '#e34850', minWidth: 45, textAlign: 'right' }}>
                    {item.growth >= 0 ? '+' : ''}{item.growth}%
                  </Text>
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>

        <Panel title="Top Pages">
          <Column gap="1">
            {topPages.map((item, idx) => (
              <Row key={idx} paddingX="2" paddingY="2" justifyContent="space-between" alignItems="center" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Text size="2" truncate style={{ flex: 1 }}>{item.page}</Text>
                <Text size="2" style={{ width: 50, textAlign: 'right' }}>{item.time}</Text>
                <Text size="2" style={{ width: 60, textAlign: 'right' }}>{formatNumber(item.sessions)}</Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
