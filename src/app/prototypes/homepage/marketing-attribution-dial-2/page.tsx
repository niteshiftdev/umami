'use client';
/**
 * Marketing Attribution - Dial 2: "Funnel View"
 * Design exploration: Funnel-style visualization, gradient colors, large charts
 * Focus: Conversion funnel, multi-color gradients, visual hierarchy
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
import { Magnet } from '@/components/svg';

// Gradient-inspired palette
const GRADIENT_COLORS = ['#2680eb', '#6734bc', '#9256d9', '#ec1562', '#e34850', '#e68619'];

function generateTrafficData() {
  const today = new Date();
  const organic: { x: string; y: number }[] = [];
  const paid: { x: string; y: number }[] = [];

  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    organic.push({ x: dateStr, y: Math.round((isWeekend ? 2800 : 4200) + Math.random() * 800 - 400) });
    paid.push({ x: dateStr, y: Math.round((isWeekend ? 1200 : 2800) + Math.random() * 600 - 300) });
  }
  return { organic, paid };
}

// Funnel stages
const funnelStages = [
  { stage: 'Impressions', value: 2850000, color: GRADIENT_COLORS[0] },
  { stage: 'Clicks', value: 396230, color: GRADIENT_COLORS[1] },
  { stage: 'Sessions', value: 328900, color: GRADIENT_COLORS[2] },
  { stage: 'Engaged', value: 186420, color: GRADIENT_COLORS[3] },
  { stage: 'Conversions', value: 14490, color: GRADIENT_COLORS[4] },
];

const sourceBreakdown = [
  { source: 'Google', value: 42 },
  { source: 'Facebook', value: 24 },
  { source: 'Direct', value: 18 },
  { source: 'Email', value: 11 },
  { source: 'Other', value: 5 },
];

const topKeywords = [
  { keyword: 'analytics platform', clicks: 12840, cpc: 2.45, conversions: 384 },
  { keyword: 'website tracking', clicks: 9820, cpc: 1.89, conversions: 256 },
  { keyword: 'user analytics', clicks: 8420, cpc: 2.12, conversions: 198 },
  { keyword: 'privacy analytics', clicks: 6240, cpc: 1.56, conversions: 178 },
];

// Funnel bar component
function FunnelBar({ stage, value, maxValue, color, index, total }: { stage: string; value: number; maxValue: number; color: string; index: number; total: number }) {
  const width = (value / maxValue) * 100;
  const minWidth = 30 + (total - index - 1) * 10; // Progressively smaller
  const actualWidth = Math.max(width, minWidth);

  return (
    <Column alignItems="center" gap="2">
      <Text size="1" color="muted" weight="bold" style={{ textTransform: 'uppercase' }}>{stage}</Text>
      <div style={{
        width: `${actualWidth}%`,
        height: 48,
        backgroundColor: color,
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'width 0.3s ease',
      }}>
        <Text size="3" weight="bold" style={{ color: '#fff' }}>{formatNumber(value)}</Text>
      </div>
      {index < total - 1 && (
        <Text size="1" color="muted">
          {((funnelStages[index + 1].value / value) * 100).toFixed(1)}% conversion
        </Text>
      )}
    </Column>
  );
}

// Big stat card
function BigStat({ label, value, subvalue }: { label: string; value: string; subvalue: string }) {
  return (
    <Column paddingX="5" paddingY="4" borderRadius="3" backgroundColor border alignItems="center" gap="1">
      <Text size="1" color="muted">{label}</Text>
      <Text style={{ fontSize: 36, fontWeight: 700, background: `linear-gradient(135deg, ${GRADIENT_COLORS[0]}, ${GRADIENT_COLORS[2]})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {value}
      </Text>
      <Text size="2" color="muted">{subvalue}</Text>
    </Column>
  );
}

export default function MarketingAttributionDial2Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const trafficData = useMemo(() => generateTrafficData(), []);

  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);

  const trafficChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Organic',
          data: trafficData.organic,
          backgroundColor: GRADIENT_COLORS[0],
          borderColor: GRADIENT_COLORS[0],
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Paid',
          data: trafficData.paid,
          backgroundColor: GRADIENT_COLORS[2],
          borderColor: GRADIENT_COLORS[2],
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [trafficData],
  );

  const sourcePieData = useMemo(
    () => ({
      labels: sourceBreakdown.map(s => s.source),
      datasets: [
        {
          data: sourceBreakdown.map(s => s.value),
          backgroundColor: GRADIENT_COLORS.slice(0, sourceBreakdown.length),
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);
  const maxFunnelValue = funnelStages[0].value;

  return (
    <PageBody>
      <PageHeader title="Marketing Attribution" icon={<Magnet />} description="Funnel View Layout - Gradient Palette" />

      {/* Key Metrics */}
      <Grid columns={{ xs: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="3">
        <BigStat label="Total Impressions" value="2.85M" subvalue="+12.4% vs last period" />
        <BigStat label="Click Rate" value="13.9%" subvalue="Industry avg: 8.2%" />
        <BigStat label="Cost per Click" value="$1.94" subvalue="-8.2% vs last period" />
        <BigStat label="ROAS" value="6.4x" subvalue="Target: 5.0x" />
      </Grid>

      {/* Funnel Visualization */}
      <Panel title="Conversion Funnel">
        <Column gap="4" paddingY="4">
          {funnelStages.map((stage, idx) => (
            <FunnelBar
              key={stage.stage}
              stage={stage.stage}
              value={stage.value}
              maxValue={maxFunnelValue}
              color={stage.color}
              index={idx}
              total={funnelStages.length}
            />
          ))}
        </Column>
      </Panel>

      {/* Traffic and Source */}
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="3">
        <Panel title="Organic vs Paid Traffic">
          <BarChart
            chartData={trafficChartData}
            unit="day"
            minDate={twoWeeksAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="280px"
            stacked
          />
        </Panel>
        <Panel title="Traffic by Source">
          <Column alignItems="center" paddingY="4">
            <PieChart type="doughnut" chartData={sourcePieData} width="200px" height="200px" />
            <Column gap="2" paddingTop="4" width="100%">
              {sourceBreakdown.map((item, idx) => (
                <Row key={idx} justifyContent="space-between" paddingX="4">
                  <Row gap="2" alignItems="center">
                    <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: GRADIENT_COLORS[idx] }} />
                    <Text size="2">{item.source}</Text>
                  </Row>
                  <Text size="2" weight="bold">{item.value}%</Text>
                </Row>
              ))}
            </Column>
          </Column>
        </Panel>
      </Grid>

      {/* Top Keywords */}
      <Panel title="Top Performing Keywords">
        <Column gap="2">
          <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
            <Text size="1" weight="bold" style={{ flex: 2 }}>Keyword</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Clicks</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>CPC</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Conversions</Text>
          </Row>
          {topKeywords.map((item, idx) => (
            <Row key={idx} paddingX="3" paddingY="3" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="2" style={{ flex: 2 }}>{item.keyword}</Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatNumber(item.clicks)}</Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>${item.cpc.toFixed(2)}</Text>
              <Text size="2" weight="bold" style={{ flex: 1, textAlign: 'right', color: GRADIENT_COLORS[0] }}>{item.conversions}</Text>
            </Row>
          ))}
        </Column>
      </Panel>
    </PageBody>
  );
}
