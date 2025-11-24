'use client';

import { Column, Grid, Heading, Row, Text } from '@umami/react-zen';
import { useMemo, useState, useEffect } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useMessages } from '@/components/hooks';
import { getThemeColors } from '@/lib/colors';
import { useTheme } from '@umami/react-zen';
import { formatNumber, formatCurrency } from '@/lib/format';

// Wrapper to delay BarChart rendering until client-side
function ClientOnlyBarChart(props: any) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <BarChart {...props} />;
}

export default function RevenueOperationsDashboard() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Revenue pipeline over time
  const revenuePipelineData = useMemo(() => {
    const today = new Date();
    const dates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }

    return {
      labels: dates.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Pipeline Value ($)',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 150000) + 850000,
          })),
          backgroundColor: colors?.chart?.primary || '#2680eb',
          borderColor: colors?.chart?.primary || '#2680eb',
          borderWidth: 0,
        },
        {
          label: 'Closed Won ($)',
          data: dates.map((_, i) => ({
            x: dates[i].toISOString().split('T')[0],
            y: Math.floor(Math.random() * 50000) + 180000,
          })),
          backgroundColor: colors?.chart?.success || '#44b556',
          borderColor: colors?.chart?.success || '#44b556',
          borderWidth: 0,
        },
      ],
    };
  }, [colors]);

  // Deal stage distribution
  const dealStageData = useMemo(() => ({
    labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closing'],
    datasets: [
      {
        label: 'Deal Count',
        data: [47, 32, 18, 12, 8],
        backgroundColor: [
          colors?.chart?.info || '#01bad7',
          colors?.chart?.primary || '#2680eb',
          colors?.chart?.secondary || '#9256d9',
          colors?.chart?.warning || '#e68619',
          colors?.chart?.success || '#44b556',
        ],
      },
    ],
  }), [colors]);

  // Win rate by sales rep
  const winRateByRepData = useMemo(() => ({
    labels: ['Sarah Johnson', 'Mike Chen', 'Lisa Rodriguez', 'Tom Williams', 'Emily Davis'],
    datasets: [
      {
        label: 'Win Rate (%)',
        data: [65, 72, 58, 68, 61],
        backgroundColor: colors?.chart?.primary || '#2680eb',
        borderColor: colors?.chart?.primary || '#2680eb',
        borderWidth: 0,
      },
    ],
  }), [colors]);

  // Revenue risk by segment
  const riskBySegmentData = useMemo(() => ({
    labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
    datasets: [
      {
        label: 'At Risk ($K)',
        data: [145, 82, 43, 28],
        backgroundColor: colors?.chart?.danger || '#e34850',
        borderColor: colors?.chart?.danger || '#e34850',
        borderWidth: 0,
      },
      {
        label: 'Healthy ($K)',
        data: [520, 285, 156, 95],
        backgroundColor: colors?.chart?.success || '#44b556',
        borderColor: colors?.chart?.success || '#44b556',
        borderWidth: 0,
      },
    ],
  }), [colors]);

  // Quarterly revenue forecast
  const revenueForecastData = useMemo(() => ({
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Forecasted Revenue ($M)',
        data: [
          { x: 'Q1', y: 2.4, d: new Date(2024, 0, 1) },
          { x: 'Q2', y: 2.8, d: new Date(2024, 3, 1) },
          { x: 'Q3', y: 3.2, d: new Date(2024, 6, 1) },
          { x: 'Q4', y: 3.8, d: new Date(2024, 9, 1) },
        ],
        backgroundColor: colors?.chart?.secondary || '#9256d9',
        borderColor: colors?.chart?.secondary || '#9256d9',
        borderWidth: 2,
      },
    ],
  }), [colors]);

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader
          title="Revenue Operations Dashboard"
          description="Sales pipeline, deal tracking, and revenue risk analysis for CSM/sales leaders"
        />

        {/* Revenue KPIs */}
        <GridRow layout="three" marginBottom="4">
          <Panel>
            <MetricCard
              label="Total Pipeline Value"
              value={1025000}
              previousValue={895000}
              change={130000}
              showLabel
              showChange
              formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Closed Won This Month"
              value={185000}
              previousValue={142000}
              change={43000}
              showLabel
              showChange
              formatValue={(v) => `$${(v / 1000).toFixed(0)}K`}
            />
          </Panel>
          <Panel>
            <MetricCard
              label="Average Sales Cycle"
              value={45}
              previousValue={52}
              change={-7}
              showLabel
              showChange
              formatValue={(v) => `${v}d`}
            />
          </Panel>
        </GridRow>

        {/* Revenue Pipeline Trend */}
        <GridRow layout="one" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="Revenue Pipeline Trend (30 Days)">
            <ClientOnlyBarChart
              chartData={revenuePipelineData}
              stacked={true}
              height="350px"
              renderXLabel={(label, index, values) => {
                return index % 5 === 0 ? label : '';
              }}
              currency="USD"
            />
          </Panel>
        </GridRow>

        {/* Deal Stage Distribution & Win Rates */}
        <GridRow layout="two" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="Deal Stage Distribution">
            <PieChart
              chartData={dealStageData}
              type="doughnut"
              height="350px"
            />
          </Panel>
          <Panel allowFullscreen title="Win Rate by Sales Rep">
            <ClientOnlyBarChart
              chartData={winRateByRepData}
              height="350px"
              XAxisType="linear"
              renderYLabel={(label) => `${label}%`}
            />
          </Panel>
        </GridRow>

        {/* Revenue Risk & Forecast */}
        <GridRow layout="two" minHeight="400px" marginBottom="4">
          <Panel allowFullscreen title="Revenue Risk by Customer Segment">
            <ClientOnlyBarChart
              chartData={riskBySegmentData}
              stacked={true}
              height="350px"
              XAxisType="linear"
              renderYLabel={(label) => `$${label}K`}
            />
          </Panel>
          <Panel allowFullscreen title="Quarterly Revenue Forecast">
            <ClientOnlyBarChart
              chartData={revenueForecastData}
              height="350px"
              XAxisType="linear"
              renderYLabel={(label) => `$${label}M`}
            />
          </Panel>
        </GridRow>

        {/* Revenue Operations Insights */}
        <Panel allowFullscreen title="Revenue Operations Summary & Actions">
          <Column gap="3" padding="4">
            <Row gap="4">
              <Column flex="1">
                <Heading size="3">💰 Revenue Metrics</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Total ARR: $8.2M (up 15% YoY)<br/>
                  • Monthly Recurring Revenue: $682K<br/>
                  • Win rate across team: 64% average<br/>
                  • Q4 forecast: $3.8M (achievable with current pipeline)
                </Text>
              </Column>
              <Column flex="1">
                <Heading size="3">⚠️ Risk & Opportunities</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • $298K at risk across all segments<br/>
                  • Enterprise segment shows strong health (78% at risk-free)<br/>
                  • Sarah Johnson leading team with 72% win rate<br/>
                  • Focus on Negotiation stage deals for Q4 close
                </Text>
              </Column>
            </Row>
            <Row gap="4" style={{ marginTop: '2rem' }}>
              <Column flex="1">
                <Heading size="3">🎯 Action Items</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Review 8 deals in Closing stage for potential acceleration<br/>
                  • Implement coaching for Mike Chen (highest performer) across team<br/>
                  • Conduct risk mitigation calls with 5 at-risk Enterprise accounts<br/>
                  • 23 deals in Proposal - focus on follow-up cadence
                </Text>
              </Column>
              <Column flex="1">
                <Heading size="3">📈 Targets</Heading>
                <Text size="1" style={{ lineHeight: '1.6', marginTop: '1rem' }}>
                  • Q4 Revenue Target: $3.8M (on track)<br/>
                  • Win Rate Target: 68% (current: 64%)<br/>
                  • Average Sales Cycle: 40 days (current: 45 days)<br/>
                  • Customer Retention: 92% (current: 91%)
                </Text>
              </Column>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
