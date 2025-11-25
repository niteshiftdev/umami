'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Heading, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { GridRow } from '@/components/common/GridRow';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Dashboard } from '@/components/svg';

// Hybrid dashboard combining Product Analytics, Marketing Attribution, and Revenue Operations

// ===== Product Analytics Data =====
function generateEngagementData() {
  const today = new Date();
  const data = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseActive = isWeekend ? 8500 : 12000;
    const variance = Math.random() * 3000 - 1500;
    data.push({
      x: dateStr,
      y: Math.round(baseActive + variance),
    });
  }
  return data;
}

// ===== Marketing Attribution Data =====
function generateTrafficSourceData() {
  const today = new Date();
  const data = {
    organic: [] as { x: string; y: number }[],
    paid: [] as { x: string; y: number }[],
    social: [] as { x: string; y: number }[],
  };

  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    data.organic.push({ x: dateStr, y: Math.round((isWeekend ? 2800 : 4200) + Math.random() * 800 - 400) });
    data.paid.push({ x: dateStr, y: Math.round((isWeekend ? 1200 : 2800) + Math.random() * 600 - 300) });
    data.social.push({ x: dateStr, y: Math.round((isWeekend ? 1800 : 1400) + Math.random() * 500 - 250) });
  }
  return data;
}

// ===== Revenue Operations Data =====
function generateRevenueData() {
  const today = new Date();
  const data = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayOfMonth = date.getDate();
    const endOfMonthBonus = dayOfMonth > 25 ? 15000 : 0;
    const baseRevenue = isWeekend ? 8500 : 24000;
    const variance = Math.random() * 8000 - 4000;
    data.push({
      x: dateStr,
      y: Math.round(baseRevenue + endOfMonthBonus + variance),
    });
  }
  return data;
}

// Combined channel breakdown
const channelBreakdown = [
  { channel: 'Organic Search', sessions: 125430, conversions: 4521, revenue: 245800 },
  { channel: 'Paid Search', sessions: 84200, conversions: 3842, revenue: 198500 },
  { channel: 'Social Media', sessions: 52100, conversions: 1245, revenue: 68400 },
  { channel: 'Email Marketing', sessions: 38400, conversions: 2156, revenue: 124300 },
  { channel: 'Referral', sessions: 28900, conversions: 892, revenue: 52100 },
];

// User segments (Product Analytics)
const userSegments = [
  { segment: 'Power Users', count: 2845, engagement: 8.4 },
  { segment: 'Regular Users', count: 8932, engagement: 5.2 },
  { segment: 'Occasional Users', count: 7621, engagement: 2.1 },
  { segment: 'New Users', count: 3562, engagement: 3.8 },
];

// Top performing campaigns (Marketing)
const topCampaigns = [
  { name: 'Black Friday Sale 2024', conversions: 1842, revenue: 156000, roas: 5.8 },
  { name: 'Newsletter Promo', conversions: 1523, revenue: 89400, roas: 12.3 },
  { name: 'Retargeting Q4', conversions: 1245, revenue: 78200, roas: 8.5 },
];

// Revenue health (RevOps)
const customerHealth = [
  { segment: 'Healthy', count: 842, arr: 4210000 },
  { segment: 'At Risk', count: 124, arr: 620000 },
  { segment: 'Critical', count: 38, arr: 190000 },
];

// Pipeline summary (RevOps)
const pipelineSummary = [
  { stage: 'Qualified', deals: 248, value: 2480000 },
  { stage: 'Discovery', deals: 156, value: 1872000 },
  { stage: 'Proposal', deals: 89, value: 1602000 },
  { stage: 'Negotiation', deals: 42, value: 924000 },
];

// Key alerts across all areas
const keyAlerts = [
  { type: 'risk', area: 'Revenue', message: 'Digital Solutions renewal at risk - 20 days remaining', priority: 'high' },
  { type: 'opportunity', area: 'Marketing', message: 'Black Friday campaign exceeding targets by 35%', priority: 'info' },
  { type: 'insight', area: 'Product', message: 'Power user segment grew 8.2% this week', priority: 'info' },
  { type: 'risk', area: 'Product', message: 'Bounce rate increased 12% on pricing page', priority: 'medium' },
];

export default function HybridDashboardPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate mock data
  const engagementData = useMemo(() => generateEngagementData(), []);
  const trafficSourceData = useMemo(() => generateTrafficSourceData(), []);
  const revenueData = useMemo(() => generateRevenueData(), []);

  // Calculate date ranges
  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 13);

  // Engagement chart data (Product)
  const engagementChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Active Users',
          data: engagementData,
          backgroundColor: colors.chart.visitors.backgroundColor,
          borderColor: colors.chart.visitors.borderColor,
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [engagementData, colors],
  );

  // Traffic sources stacked chart (Marketing)
  const trafficChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Organic',
          data: trafficSourceData.organic,
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Paid',
          data: trafficSourceData.paid,
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Social',
          data: trafficSourceData.social,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [trafficSourceData],
  );

  // Revenue chart data (RevOps)
  const revenueChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Revenue',
          data: revenueData,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [revenueData],
  );

  // Channel distribution pie
  const channelPieData = useMemo(
    () => ({
      labels: channelBreakdown.map(c => c.channel),
      datasets: [
        {
          data: channelBreakdown.map(c => c.sessions),
          backgroundColor: CHART_COLORS.slice(0, channelBreakdown.length),
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  // Health distribution pie
  const healthPieData = useMemo(
    () => ({
      labels: customerHealth.map(h => h.segment),
      datasets: [
        {
          data: customerHealth.map(h => h.count),
          backgroundColor: ['#44b556', '#e68619', '#e34850'],
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Calculate totals
  const totalDau = engagementData[engagementData.length - 1]?.y || 0;
  const totalSessions = channelBreakdown.reduce((sum, c) => sum + c.sessions, 0);
  const totalConversions = channelBreakdown.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.y, 0);
  const totalArr = customerHealth.reduce((sum, h) => sum + h.arr, 0);
  const totalPipeline = pipelineSummary.reduce((sum, s) => sum + s.value, 0);

  const alertColors: Record<string, string> = {
    high: '#e34850',
    medium: '#e68619',
    info: '#2680eb',
  };

  return (
    <PageBody>
      <PageHeader title="Executive Dashboard" icon={<Dashboard />} description="Combined view of product, marketing, and revenue metrics" />

      {/* Key Metrics - Combined */}
      <MetricsBar>
        <MetricCard value={totalDau} label="Daily Active Users" change={totalDau * 0.94} showChange formatValue={formatNumber} />
        <MetricCard value={totalSessions} label="Sessions (30d)" change={totalSessions * 0.91} showChange formatValue={formatNumber} />
        <MetricCard value={totalConversions} label="Conversions" change={totalConversions * 0.88} showChange formatValue={formatNumber} />
        <MetricCard value={totalRevenue} label="Revenue (14d)" change={totalRevenue * 0.92} showChange formatValue={(n: number) => `$${formatNumber(n)}`} />
        <MetricCard value={totalArr} label="Total ARR" change={totalArr * 0.96} showChange formatValue={(n: number) => `$${formatNumber(n)}`} />
        <MetricCard value={totalPipeline} label="Pipeline" change={totalPipeline * 0.85} showChange formatValue={(n: number) => `$${formatNumber(n)}`} />
      </MetricsBar>

      {/* Alerts Panel */}
      <Panel title="Key Alerts & Insights">
        <Column gap="2">
          {keyAlerts.map((alert, idx) => (
            <Row
              key={idx}
              paddingX="3"
              paddingY="3"
              gap="3"
              alignItems="center"
              style={{
                borderLeft: `4px solid ${alertColors[alert.priority]}`,
                backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                borderRadius: 4,
              }}
            >
              <Column style={{ flex: 1 }}>
                <Row gap="2" alignItems="center">
                  <Text size="1" weight="bold" style={{ textTransform: 'uppercase', color: alertColors[alert.priority] }}>
                    {alert.area}
                  </Text>
                  <Text size="1" color="muted">
                    {alert.type}
                  </Text>
                </Row>
                <Text size="2">{alert.message}</Text>
              </Column>
            </Row>
          ))}
        </Column>
      </Panel>

      {/* Main Charts Row - One from each area */}
      <GridRow layout="three">
        <Panel title="User Engagement">
          <BarChart
            chartData={engagementChartData}
            unit="day"
            minDate={twoWeeksAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="220px"
          />
        </Panel>
        <Panel title="Traffic Sources">
          <BarChart
            chartData={trafficChartData}
            unit="day"
            minDate={twoWeeksAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="220px"
            stacked
          />
        </Panel>
        <Panel title="Daily Revenue">
          <BarChart
            chartData={revenueChartData}
            unit="day"
            minDate={twoWeeksAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="220px"
            currency="USD"
          />
        </Panel>
      </GridRow>

      {/* Distribution Charts */}
      <GridRow layout="two">
        <Panel title="Channel Distribution">
          <Row justifyContent="center" alignItems="center" height="260px">
            <PieChart type="doughnut" chartData={channelPieData} width="240px" height="240px" />
          </Row>
        </Panel>
        <Panel title="Customer Health">
          <Row justifyContent="center" alignItems="center" height="260px">
            <PieChart type="doughnut" chartData={healthPieData} width="240px" height="240px" />
          </Row>
        </Panel>
      </GridRow>

      {/* Data Tables */}
      <GridRow layout="three">
        {/* User Segments (Product) */}
        <Panel title="User Segments">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Segment
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Users
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Eng.
              </Text>
            </Row>
            {userSegments.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Text size="2" style={{ flex: 2 }}>
                  {item.segment}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.count)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.engagement}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Top Campaigns (Marketing) */}
        <Panel title="Top Campaigns">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Campaign
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Conv.
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                ROAS
              </Text>
            </Row>
            {topCampaigns.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Text size="2" style={{ flex: 2 }} truncate>
                  {item.name}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.conversions)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right', color: item.roas >= 5 ? '#44b556' : '#e68619' }}>
                  {item.roas}x
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Pipeline Summary (RevOps) */}
        <Panel title="Pipeline Summary">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Stage
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Deals
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Value
              </Text>
            </Row>
            {pipelineSummary.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Row gap="2" alignItems="center" style={{ flex: 2 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: CHART_COLORS[idx],
                    }}
                  />
                  <Text size="2">{item.stage}</Text>
                </Row>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.deals}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  ${formatNumber(item.value)}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </GridRow>

      {/* Channel Performance (Combined Marketing + RevOps) */}
      <Panel title="Channel Performance Summary">
        <Column gap="2">
          <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
            <Text size="1" weight="bold" style={{ flex: 2 }}>
              Channel
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Sessions
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Conversions
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Conv. Rate
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Revenue
            </Text>
          </Row>
          {channelBreakdown.map((item, idx) => {
            const convRate = ((item.conversions / item.sessions) * 100).toFixed(2);
            return (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Row gap="2" alignItems="center" style={{ flex: 2 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: CHART_COLORS[idx],
                    }}
                  />
                  <Text size="2">{item.channel}</Text>
                </Row>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.sessions)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.conversions)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {convRate}%
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  ${formatNumber(item.revenue)}
                </Text>
              </Row>
            );
          })}
        </Column>
      </Panel>
    </PageBody>
  );
}
