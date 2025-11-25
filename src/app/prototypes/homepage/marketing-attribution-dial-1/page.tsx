'use client';
/**
 * Marketing Attribution - Dial 1: "Channel Focus"
 * Design exploration: Channel-centric layout with progress bars, green/teal palette
 * Focus: Channel comparison, horizontal progress indicators, data tables
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
import { Magnet } from '@/components/svg';

// Green/teal focused palette
const CHANNEL_COLORS = ['#44b556', '#01bad7', '#2680eb', '#9256d9', '#e68619', '#e34850'];

function generateConversionData() {
  const today = new Date();
  const data = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    data.push({ x: dateStr, y: Math.round((isWeekend ? 85 : 145) + Math.random() * 40 - 20) });
  }
  return data;
}

const channelData = [
  { channel: 'Organic Search', sessions: 125430, conversions: 4521, revenue: 245800, convRate: 3.61 },
  { channel: 'Paid Search', sessions: 84200, conversions: 3842, revenue: 198500, convRate: 4.56 },
  { channel: 'Email Marketing', sessions: 38400, conversions: 2156, revenue: 124300, convRate: 5.61 },
  { channel: 'Social Media', sessions: 52100, conversions: 1245, revenue: 68400, convRate: 2.39 },
  { channel: 'Direct', sessions: 67200, conversions: 1834, revenue: 98200, convRate: 2.73 },
  { channel: 'Referral', sessions: 28900, conversions: 892, revenue: 52100, convRate: 3.09 },
];

const campaigns = [
  { name: 'Black Friday Sale', source: 'google', conversions: 1842, spend: 26800, roas: 5.8 },
  { name: 'Newsletter Promo', source: 'email', conversions: 1523, spend: 7200, roas: 12.3 },
  { name: 'Retargeting Q4', source: 'google', conversions: 1245, spend: 9200, roas: 8.5 },
  { name: 'Product Launch', source: 'facebook', conversions: 986, spend: 23400, roas: 4.2 },
];

// Progress bar component
function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = (value / max) * 100;
  return (
    <div style={{ width: '100%', height: 8, backgroundColor: 'rgba(128,128,128,0.2)', borderRadius: 4 }}>
      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: color, borderRadius: 4 }} />
    </div>
  );
}

// Metric with trend
function MetricWithBar({ label, value, max, format, color }: { label: string; value: number; max: number; format: (n: number) => string; color: string }) {
  return (
    <Column paddingX="4" paddingY="4" borderRadius="3" backgroundColor border gap="2">
      <Text size="1" color="muted" weight="bold">{label}</Text>
      <Text size="7" weight="bold">{format(value)}</Text>
      <ProgressBar value={value} max={max} color={color} />
    </Column>
  );
}

export default function MarketingAttributionDial1Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const conversionData = useMemo(() => generateConversionData(), []);

  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);

  const maxSessions = Math.max(...channelData.map(c => c.sessions));
  const maxConversions = Math.max(...channelData.map(c => c.conversions));
  const maxRevenue = Math.max(...channelData.map(c => c.revenue));

  const conversionChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Conversions',
          data: conversionData,
          backgroundColor: CHANNEL_COLORS[0],
          borderColor: CHANNEL_COLORS[0],
          borderWidth: 1,
          barPercentage: 0.75,
          categoryPercentage: 0.85,
        },
      ],
    }),
    [conversionData],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  const totalSessions = channelData.reduce((sum, c) => sum + c.sessions, 0);
  const totalConversions = channelData.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = channelData.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <PageBody>
      <PageHeader title="Marketing Attribution" icon={<Magnet />} description="Channel Focus Layout - Green/Teal Palette" />

      {/* Top Metrics with Progress Bars */}
      <Grid columns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap="3">
        <MetricWithBar label="Total Sessions" value={totalSessions} max={500000} format={formatNumber} color={CHANNEL_COLORS[0]} />
        <MetricWithBar label="Conversions" value={totalConversions} max={20000} format={formatNumber} color={CHANNEL_COLORS[1]} />
        <MetricWithBar label="Revenue" value={totalRevenue} max={1000000} format={(n) => `$${formatNumber(n)}`} color={CHANNEL_COLORS[2]} />
        <MetricWithBar label="Conv. Rate" value={3.65} max={10} format={(n) => `${n.toFixed(2)}%`} color={CHANNEL_COLORS[3]} />
      </Grid>

      {/* Conversion Trend */}
      <Panel title="Daily Conversions">
        <BarChart
          chartData={conversionChartData}
          unit="day"
          minDate={twoWeeksAgo}
          maxDate={today}
          renderXLabel={renderXLabel}
          height="260px"
        />
      </Panel>

      {/* Channel Performance with Visual Bars */}
      <Panel title="Channel Performance">
        <Column gap="3">
          {channelData.map((item, idx) => (
            <Row key={idx} gap="4" alignItems="center" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Row gap="2" alignItems="center" style={{ minWidth: 160 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: CHANNEL_COLORS[idx] }} />
                <Text size="2" weight="bold">{item.channel}</Text>
              </Row>
              <Column gap="1" style={{ flex: 1 }}>
                <Row justifyContent="space-between">
                  <Text size="1" color="muted">Sessions</Text>
                  <Text size="1">{formatNumber(item.sessions)}</Text>
                </Row>
                <ProgressBar value={item.sessions} max={maxSessions} color={CHANNEL_COLORS[idx]} />
              </Column>
              <Column gap="1" style={{ flex: 1 }}>
                <Row justifyContent="space-between">
                  <Text size="1" color="muted">Conversions</Text>
                  <Text size="1">{formatNumber(item.conversions)}</Text>
                </Row>
                <ProgressBar value={item.conversions} max={maxConversions} color={CHANNEL_COLORS[idx]} />
              </Column>
              <Column gap="1" style={{ flex: 1 }}>
                <Row justifyContent="space-between">
                  <Text size="1" color="muted">Revenue</Text>
                  <Text size="1">${formatNumber(item.revenue)}</Text>
                </Row>
                <ProgressBar value={item.revenue} max={maxRevenue} color={CHANNEL_COLORS[idx]} />
              </Column>
              <Text size="2" weight="bold" style={{ minWidth: 60, textAlign: 'right' }}>{item.convRate}%</Text>
            </Row>
          ))}
        </Column>
      </Panel>

      {/* Campaign Performance */}
      <Panel title="Top Campaigns">
        <Column gap="2">
          <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
            <Text size="1" weight="bold" style={{ flex: 2 }}>Campaign</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Conversions</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Spend</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>ROAS</Text>
          </Row>
          {campaigns.map((item, idx) => (
            <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Column style={{ flex: 2 }}>
                <Text size="2">{item.name}</Text>
                <Text size="1" color="muted">{item.source}</Text>
              </Column>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{formatNumber(item.conversions)}</Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>${formatNumber(item.spend)}</Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right', color: item.roas >= 5 ? '#44b556' : '#e68619' }}>{item.roas}x</Text>
            </Row>
          ))}
        </Column>
      </Panel>
    </PageBody>
  );
}
