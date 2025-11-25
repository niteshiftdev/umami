'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Heading, Text, useTheme } from '@umami/react-zen';
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
import { Magnet } from '@/components/svg';

// Mock data for Marketing Attribution persona
function generateTrafficSourceData() {
  const today = new Date();
  const data = {
    organic: [] as { x: string; y: number }[],
    paid: [] as { x: string; y: number }[],
    social: [] as { x: string; y: number }[],
    referral: [] as { x: string; y: number }[],
    direct: [] as { x: string; y: number }[],
  };

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Different patterns for different sources
    data.organic.push({ x: dateStr, y: Math.round((isWeekend ? 2800 : 4200) + Math.random() * 800 - 400) });
    data.paid.push({ x: dateStr, y: Math.round((isWeekend ? 1200 : 2800) + Math.random() * 600 - 300) });
    data.social.push({ x: dateStr, y: Math.round((isWeekend ? 1800 : 1400) + Math.random() * 500 - 250) });
    data.referral.push({ x: dateStr, y: Math.round((isWeekend ? 600 : 900) + Math.random() * 300 - 150) });
    data.direct.push({ x: dateStr, y: Math.round((isWeekend ? 1500 : 2200) + Math.random() * 400 - 200) });
  }
  return data;
}

function generateCampaignData() {
  const today = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseConversions = isWeekend ? 85 : 145;
    data.push({
      x: dateStr,
      y: Math.round(baseConversions + Math.random() * 40 - 20),
    });
  }
  return data;
}

// Channel breakdown
const channelBreakdown = [
  { channel: 'Organic Search', sessions: 125430, conversions: 4521, revenue: 245800, cpa: 0 },
  { channel: 'Paid Search', sessions: 84200, conversions: 3842, revenue: 198500, cpa: 28.5 },
  { channel: 'Social Media', sessions: 52100, conversions: 1245, revenue: 68400, cpa: 15.2 },
  { channel: 'Email Marketing', sessions: 38400, conversions: 2156, revenue: 124300, cpa: 4.8 },
  { channel: 'Referral', sessions: 28900, conversions: 892, revenue: 52100, cpa: 0 },
  { channel: 'Direct', sessions: 67200, conversions: 1834, revenue: 98200, cpa: 0 },
];

// Top campaigns
const topCampaigns = [
  { name: 'Black Friday Sale 2024', source: 'Google Ads', clicks: 45230, conversions: 1842, ctr: 4.2, roas: 5.8 },
  { name: 'Product Launch Q4', source: 'Facebook', clicks: 32100, conversions: 986, ctr: 3.1, roas: 4.2 },
  { name: 'Newsletter Promo', source: 'Email', clicks: 28400, conversions: 1523, ctr: 8.4, roas: 12.3 },
  { name: 'Brand Awareness', source: 'Display', clicks: 89200, conversions: 423, ctr: 0.8, roas: 1.2 },
  { name: 'Retargeting Q4', source: 'Google Ads', clicks: 18900, conversions: 1245, ctr: 6.2, roas: 8.5 },
];

// UTM parameters breakdown
const utmBreakdown = [
  { source: 'google', medium: 'cpc', campaigns: 12, sessions: 84200 },
  { source: 'facebook', medium: 'social', campaigns: 8, sessions: 32100 },
  { source: 'newsletter', medium: 'email', campaigns: 24, sessions: 38400 },
  { source: 'linkedin', medium: 'social', campaigns: 5, sessions: 12800 },
  { source: 'twitter', medium: 'social', campaigns: 6, sessions: 7200 },
];

// Referrer domains
const topReferrers = [
  { domain: 'google.com', sessions: 125430, bounceRate: 32.4, avgDuration: '3m 24s' },
  { domain: 'facebook.com', sessions: 32100, bounceRate: 45.2, avgDuration: '2m 12s' },
  { domain: 'twitter.com', sessions: 18900, bounceRate: 52.1, avgDuration: '1m 48s' },
  { domain: 'linkedin.com', sessions: 12800, bounceRate: 28.5, avgDuration: '4m 32s' },
  { domain: 'reddit.com', sessions: 8400, bounceRate: 58.3, avgDuration: '1m 22s' },
];

export default function MarketingAttributionPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate mock data
  const trafficSourceData = useMemo(() => generateTrafficSourceData(), []);
  const campaignData = useMemo(() => generateCampaignData(), []);

  // Calculate date range for charts
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

  // Traffic sources stacked chart
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
        {
          type: 'bar' as const,
          label: 'Referral',
          data: trafficSourceData.referral,
          backgroundColor: CHART_COLORS[3],
          borderColor: CHART_COLORS[3],
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          type: 'bar' as const,
          label: 'Direct',
          data: trafficSourceData.direct,
          backgroundColor: CHART_COLORS[4],
          borderColor: CHART_COLORS[4],
          borderWidth: 0,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [trafficSourceData],
  );

  // Campaign conversions chart
  const campaignChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Conversions',
          data: campaignData,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [campaignData],
  );

  // Channel distribution pie chart
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

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Calculate totals
  const totalSessions = channelBreakdown.reduce((sum, c) => sum + c.sessions, 0);
  const totalConversions = channelBreakdown.reduce((sum, c) => sum + c.conversions, 0);
  const totalRevenue = channelBreakdown.reduce((sum, c) => sum + c.revenue, 0);
  const avgConversionRate = ((totalConversions / totalSessions) * 100).toFixed(2);

  return (
    <PageBody>
      <PageHeader title="Marketing Attribution" icon={<Magnet />} description="Track inbound sources and campaign performance" />

      {/* Key Metrics */}
      <MetricsBar>
        <MetricCard value={totalSessions} label="Total Sessions" change={totalSessions * 0.92} showChange formatValue={formatNumber} />
        <MetricCard value={totalConversions} label="Conversions" change={totalConversions * 0.88} showChange formatValue={formatNumber} />
        <MetricCard
          value={parseFloat(avgConversionRate)}
          label="Conversion Rate"
          change={parseFloat(avgConversionRate) * 0.95}
          showChange
          formatValue={(n: number) => `${n.toFixed(2)}%`}
        />
        <MetricCard value={totalRevenue} label="Attributed Revenue" change={totalRevenue * 0.85} showChange formatValue={(n: number) => `$${formatNumber(n)}`} />
        <MetricCard value={18.4} label="Avg CPA" change={21.2} showChange reverseColors formatValue={(n: number) => `$${n.toFixed(2)}`} />
      </MetricsBar>

      {/* Traffic Sources Chart */}
      <Panel title="Traffic Sources Over Time">
        <BarChart
          chartData={trafficChartData}
          unit="day"
          minDate={thirtyDaysAgo}
          maxDate={today}
          renderXLabel={renderXLabel}
          height="320px"
          stacked
        />
      </Panel>

      {/* Channel Distribution and Conversions */}
      <GridRow layout="two">
        <Panel title="Channel Distribution">
          <Row justifyContent="center" alignItems="center" height="300px">
            <PieChart type="doughnut" chartData={channelPieData} width="280px" height="280px" />
          </Row>
        </Panel>
        <Panel title="Daily Conversions">
          <BarChart
            chartData={campaignChartData}
            unit="day"
            minDate={thirtyDaysAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="300px"
          />
        </Panel>
      </GridRow>

      {/* Channel Performance Table */}
      <Panel title="Channel Performance">
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
              Revenue
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              CPA
            </Text>
          </Row>
          {channelBreakdown.map((item, idx) => (
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
                ${formatNumber(item.revenue)}
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                {item.cpa > 0 ? `$${item.cpa.toFixed(2)}` : '-'}
              </Text>
            </Row>
          ))}
        </Column>
      </Panel>

      {/* Campaigns and UTM Data */}
      <GridRow layout="two">
        {/* Top Campaigns */}
        <Panel title="Top Campaigns">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Campaign
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Clicks
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
                <Column style={{ flex: 2 }}>
                  <Text size="2" truncate>
                    {item.name}
                  </Text>
                  <Text size="1" color="muted">
                    {item.source}
                  </Text>
                </Column>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.clicks)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.conversions)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right', color: item.roas >= 3 ? '#44b556' : item.roas >= 1 ? '#e68619' : '#e34850' }}>
                  {item.roas}x
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Top Referrers */}
        <Panel title="Top Referrers">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Domain
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Sessions
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Bounce
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Duration
              </Text>
            </Row>
            {topReferrers.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Text size="2" style={{ flex: 2 }} truncate>
                  {item.domain}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {formatNumber(item.sessions)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.bounceRate}%
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.avgDuration}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </GridRow>

      {/* UTM Parameters */}
      <Panel title="UTM Parameters">
        <Column gap="2">
          <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
            <Text size="1" weight="bold" style={{ flex: 1 }}>
              Source
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1 }}>
              Medium
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Campaigns
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Sessions
            </Text>
          </Row>
          {utmBreakdown.map((item, idx) => (
            <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="2" style={{ flex: 1 }}>
                {item.source}
              </Text>
              <Text size="2" style={{ flex: 1 }}>
                {item.medium}
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                {item.campaigns}
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                {formatNumber(item.sessions)}
              </Text>
            </Row>
          ))}
        </Column>
      </Panel>
    </PageBody>
  );
}
