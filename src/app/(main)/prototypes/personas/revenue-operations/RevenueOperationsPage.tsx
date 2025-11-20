'use client';
import { useMemo } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { Column, Grid, Row, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { Chart } from '@/components/charts/Chart';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber, formatLongNumber, formatLongCurrency } from '@/lib/format';
import { colord } from 'colord';

// Mock data for Revenue Operations
const generateRevenueGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    labels: months,
    datasets: [
      {
        label: 'MRR',
        data: months.map((_, i) => ({
          x: new Date(2025, i, 1).toISOString(),
          y: 280000 + (i * 24000) + Math.floor(Math.random() * 10000),
        })),
        backgroundColor: colord(CHART_COLORS[0]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[0]).alpha(0.8).toRgbString(),
        borderWidth: 2,
      },
      {
        label: 'ARR',
        data: months.map((_, i) => ({
          x: new Date(2025, i, 1).toISOString(),
          y: (280000 + (i * 24000)) * 12,
        })),
        backgroundColor: colord(CHART_COLORS[1]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[1]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        hidden: true,
      },
    ],
  };
};

const generatePipelineData = () => {
  return {
    labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'],
    datasets: [
      {
        label: 'Pipeline Value',
        data: [1250000, 890000, 650000, 420000, 285000],
        backgroundColor: [
          colord(CHART_COLORS[0]).alpha(0.9).toRgbString(),
          colord(CHART_COLORS[0]).alpha(0.7).toRgbString(),
          colord(CHART_COLORS[0]).alpha(0.5).toRgbString(),
          colord(CHART_COLORS[0]).alpha(0.35).toRgbString(),
          colord(CHART_COLORS[2]).alpha(0.8).toRgbString(),
        ],
        borderColor: CHART_COLORS[0],
        borderWidth: 2,
      },
    ],
  };
};

const generateCustomerSegmentData = () => {
  return {
    labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
    datasets: [
      {
        label: 'Revenue',
        data: [185000, 128000, 62000, 35000],
        backgroundColor: CHART_COLORS.slice(0, 4).map(c => colord(c).alpha(0.6).toRgbString()),
        borderColor: CHART_COLORS.slice(0, 4),
        borderWidth: 2,
      },
    ],
  };
};

const generateChurnRiskData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return {
    labels: weeks,
    datasets: [
      {
        label: 'At-Risk MRR',
        data: [45000, 52000, 38000, 49000],
        backgroundColor: colord(CHART_COLORS[4]).alpha(0.5).toRgbString(),
        borderColor: colord(CHART_COLORS[4]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Saved MRR',
        data: [28000, 31000, 24000, 29000],
        backgroundColor: colord(CHART_COLORS[2]).alpha(0.5).toRgbString(),
        borderColor: colord(CHART_COLORS[2]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
};

const generateExpansionData = () => {
  return {
    labels: ['Upsells', 'Cross-sells', 'Add-ons', 'Upgrades', 'Renewals'],
    datasets: [
      {
        label: 'Expansion Revenue',
        data: [125000, 89000, 64000, 78000, 142000],
        backgroundColor: colord(CHART_COLORS[5]).alpha(0.5).toRgbString(),
        borderColor: CHART_COLORS[5],
        borderWidth: 2,
      },
    ],
  };
};

export function RevenueOperationsPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const revenueData = useMemo(() => generateRevenueGrowthData(), []);
  const pipelineData = useMemo(() => generatePipelineData(), []);
  const segmentData = useMemo(() => generateCustomerSegmentData(), []);
  const churnData = useMemo(() => generateChurnRiskData(), []);
  const expansionData = useMemo(() => generateExpansionData(), []);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader
          title="Revenue Operations Dashboard"
          description="Monitor revenue health, pipeline velocity, and growth drivers"
        />

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            value={410000}
            previousValue={386000}
            change={24000}
            label="Monthly Recurring Revenue"
            formatValue={(n) => formatLongCurrency(n, 'USD')}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={4920000}
            previousValue={4632000}
            change={288000}
            label="Annual Recurring Revenue"
            formatValue={(n) => formatLongCurrency(n, 'USD')}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={3495000}
            previousValue={3280000}
            change={215000}
            label="Pipeline Value"
            formatValue={(n) => formatLongCurrency(n, 'USD')}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={4.8}
            previousValue={5.2}
            change={-0.4}
            label="Customer Churn Rate %"
            formatValue={(n) => `${n.toFixed(1)}%`}
            showLabel={true}
            showChange={true}
            reverseColors={true}
          />
          <MetricCard
            value={128}
            previousValue={142}
            change={-14}
            label="Net Revenue Retention %"
            formatValue={(n) => `${Math.round(n)}%`}
            showLabel={true}
            showChange={true}
          />
        </MetricsBar>

        {/* Revenue Growth Trend */}
        <Panel title="Revenue Growth Trend (6 Months)" allowFullscreen={true}>
          <div style={{ height: '320px', padding: '20px' }}>
            <BarChart
              chartData={revenueData}
              unit="month"
              stacked={false}
            />
          </div>
          <Column padding="4" gap="2">
            <Row justifyContent="space-between">
              <Text size="1" color="muted">Average Monthly Growth:</Text>
              <Text size="1" weight="bold">6.2%</Text>
            </Row>
            <Row justifyContent="space-between">
              <Text size="1" color="muted">YoY Growth Rate:</Text>
              <Text size="1" weight="bold">74%</Text>
            </Row>
          </Column>
        </Panel>

        {/* Two column layout */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
          {/* Sales Pipeline Funnel */}
          <Panel title="Sales Pipeline by Stage" allowFullscreen={true}>
            <div style={{ height: '320px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={pipelineData}
                chartOptions={{
                  indexAxis: 'y' as const,
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongCurrency(value, 'USD'),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    y: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <Column padding="4" gap="2">
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Win Rate:</Text>
                <Text size="1" weight="bold">22.8%</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Avg. Deal Size:</Text>
                <Text size="1" weight="bold">$48,200</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Sales Cycle:</Text>
                <Text size="1" weight="bold">47 days</Text>
              </Row>
            </Column>
          </Panel>

          {/* Revenue by Customer Segment */}
          <Panel title="Revenue by Customer Segment" allowFullscreen={true}>
            <div style={{ height: '320px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={segmentData}
                chartOptions={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongCurrency(value, 'USD'),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <Column padding="4" gap="2">
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Enterprise ARPA:</Text>
                <Text size="1" weight="bold">$24,500/mo</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Total Customers:</Text>
                <Text size="1" weight="bold">1,247</Text>
              </Row>
            </Column>
          </Panel>
        </Grid>

        {/* Churn Risk & Expansion Revenue */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
          {/* Churn Risk Tracking */}
          <Panel title="Churn Risk & Recovery" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="line"
                chartData={churnData}
                chartOptions={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongCurrency(value, 'USD'),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top' as const,
                      labels: {
                        color: colors.chart.text,
                      },
                    },
                  },
                }}
              />
            </div>
            <Column padding="4" gap="2">
              <Text size="1" color="muted">
                CS team saved 60% of at-risk MRR this month through proactive outreach
              </Text>
            </Column>
          </Panel>

          {/* Expansion Revenue */}
          <Panel title="Expansion Revenue Breakdown" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={expansionData}
                chartOptions={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongCurrency(value, 'USD'),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                      ticks: {
                        color: colors.chart.text,
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
            <Column padding="4" gap="2">
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Total Expansion:</Text>
                <Text size="1" weight="bold">$498K</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="1" color="muted">% of Total Revenue:</Text>
                <Text size="1" weight="bold">28%</Text>
              </Row>
            </Column>
          </Panel>
        </Grid>

        {/* Revenue Health Indicators */}
        <Panel title="Revenue Health Indicators">
          <Column padding="6" gap="4">
            <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="6">
              <Column gap="2">
                <Text size="1" color="muted">LTV:CAC Ratio</Text>
                <Text weight="bold" size="6">3.8:1</Text>
                <Text size="1" color="muted">Target: 3:1 or higher</Text>
              </Column>
              <Column gap="2">
                <Text size="1" color="muted">Payback Period</Text>
                <Text weight="bold" size="6">14 months</Text>
                <Text size="1" color="muted">Industry avg: 18 months</Text>
              </Column>
              <Column gap="2">
                <Text size="1" color="muted">CAC</Text>
                <Text weight="bold" size="6">$12,400</Text>
                <Text size="1" color="muted">Down 8% from last quarter</Text>
              </Column>
              <Column gap="2">
                <Text size="1" color="muted">Customer LTV</Text>
                <Text weight="bold" size="6">$47,120</Text>
                <Text size="1" color="muted">Up 12% from last quarter</Text>
              </Column>
            </Grid>
          </Column>
        </Panel>

        {/* Top Revenue Risks & Opportunities */}
        <Panel title="Revenue Risks & Opportunities">
          <Column padding="6" gap="4">
            <Column gap="2">
              <Text weight="bold" size="3">⚠️ Top Risks</Text>
              <Column gap="2" paddingLeft="4">
                <Row gap="3">
                  <Text size="1" style={{ minWidth: '100px' }} color="muted">High Priority:</Text>
                  <Text size="1">3 enterprise accounts ($142K MRR) showing usage decline - CS intervention needed</Text>
                </Row>
                <Row gap="3">
                  <Text size="1" style={{ minWidth: '100px' }} color="muted">Medium Priority:</Text>
                  <Text size="1">Pipeline velocity down 12% - sales team needs more qualified leads</Text>
                </Row>
                <Row gap="3">
                  <Text size="1" style={{ minWidth: '100px' }} color="muted">Watch:</Text>
                  <Text size="1">8 accounts approaching renewal without executive sponsorship</Text>
                </Row>
              </Column>
            </Column>
            <Column gap="2">
              <Text weight="bold" size="3">💰 Top Opportunities</Text>
              <Column gap="2" paddingLeft="4">
                <Row gap="3">
                  <Text size="1" style={{ minWidth: '100px' }} color="muted">Expansion:</Text>
                  <Text size="1">18 accounts showing high usage (80%+ of plan) - upsell opportunity of $215K ARR</Text>
                </Row>
                <Row gap="3">
                  <Text size="1" style={{ minWidth: '100px' }} color="muted">Cross-sell:</Text>
                  <Text size="1">Mid-market segment showing 45% attach rate for analytics add-on</Text>
                </Row>
                <Row gap="3">
                  <Text size="1" style={{ minWidth: '100px' }} color="muted">New Market:</Text>
                  <Text size="1">Enterprise pipeline up 34% - consider dedicated team</Text>
                </Row>
              </Column>
            </Column>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
