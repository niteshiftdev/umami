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

// Mock data combining all personas
const generateUnifiedGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    labels: months,
    datasets: [
      {
        label: 'Revenue',
        data: months.map((_, i) => ({
          x: new Date(2025, i, 1).toISOString(),
          y: 280000 + (i * 24000) + Math.floor(Math.random() * 10000),
        })),
        backgroundColor: colord(CHART_COLORS[2]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[2]).alpha(0.8).toRgbString(),
        borderWidth: 2,
      },
      {
        label: 'Active Users',
        data: months.map((_, i) => ({
          x: new Date(2025, i, 1).toISOString(),
          y: (18000 + (i * 1800)) * 10, // Scaled for visibility
        })),
        backgroundColor: colord(CHART_COLORS[0]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[0]).alpha(0.8).toRgbString(),
        borderWidth: 2,
      },
    ],
  };
};

const generateChannelROIData = () => {
  return {
    labels: ['Organic', 'Paid Search', 'Social', 'Email', 'Direct'],
    datasets: [
      {
        label: 'Marketing Spend',
        data: [8000, 25000, 15000, 6000, 0],
        backgroundColor: colord(CHART_COLORS[3]).alpha(0.5).toRgbString(),
        borderColor: CHART_COLORS[3],
        borderWidth: 2,
      },
      {
        label: 'Revenue Generated',
        data: [52000, 95000, 38000, 28000, 12000],
        backgroundColor: colord(CHART_COLORS[2]).alpha(0.5).toRgbString(),
        borderColor: CHART_COLORS[2],
        borderWidth: 2,
      },
    ],
  };
};

const generateCustomerJourneyData = () => {
  return {
    labels: ['Awareness', 'Consideration', 'Purchase', 'Retention', 'Advocacy'],
    datasets: [
      {
        label: 'Customers',
        data: [25000, 12500, 8500, 6200, 2100],
        backgroundColor: [
          colord(CHART_COLORS[0]).alpha(0.9).toRgbString(),
          colord(CHART_COLORS[0]).alpha(0.7).toRgbString(),
          colord(CHART_COLORS[2]).alpha(0.6).toRgbString(),
          colord(CHART_COLORS[2]).alpha(0.5).toRgbString(),
          colord(CHART_COLORS[5]).alpha(0.7).toRgbString(),
        ],
        borderColor: CHART_COLORS[0],
        borderWidth: 2,
      },
    ],
  };
};

const generateProductMetricsData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return {
    labels: weeks,
    datasets: [
      {
        label: 'DAU',
        data: [8200, 8500, 8800, 8742],
        backgroundColor: colord(CHART_COLORS[0]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[0]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'Conversions',
        data: [3800, 4100, 4250, 4050],
        backgroundColor: colord(CHART_COLORS[1]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[1]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };
};

const generateRevenueMixData = () => {
  return {
    labels: ['New Business', 'Expansion', 'Renewals', 'Professional Services'],
    datasets: [
      {
        data: [42, 28, 24, 6],
        backgroundColor: [
          colord(CHART_COLORS[2]).alpha(0.8).toRgbString(),
          colord(CHART_COLORS[5]).alpha(0.8).toRgbString(),
          colord(CHART_COLORS[0]).alpha(0.8).toRgbString(),
          colord(CHART_COLORS[1]).alpha(0.8).toRgbString(),
        ],
        borderColor: [CHART_COLORS[2], CHART_COLORS[5], CHART_COLORS[0], CHART_COLORS[1]],
        borderWidth: 2,
      },
    ],
  };
};

export function HybridDashboardPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const growthData = useMemo(() => generateUnifiedGrowthData(), []);
  const channelROIData = useMemo(() => generateChannelROIData(), []);
  const journeyData = useMemo(() => generateCustomerJourneyData(), []);
  const productMetricsData = useMemo(() => generateProductMetricsData(), []);
  const revenueMixData = useMemo(() => generateRevenueMixData(), []);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader
          title="Executive Dashboard"
          description="Unified view of business performance across product, marketing, and revenue"
        />

        {/* Key Business Metrics */}
        <MetricsBar>
          <MetricCard
            value={410000}
            previousValue={386000}
            change={24000}
            label="Monthly Revenue"
            formatValue={(n) => formatLongCurrency(n, 'USD')}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={24500}
            previousValue={23200}
            change={1300}
            label="Monthly Active Users"
            formatValue={formatNumber}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={16300}
            previousValue={14200}
            change={2100}
            label="Total Conversions"
            formatValue={formatNumber}
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
            value={3.73}
            previousValue={3.21}
            change={0.52}
            label="Marketing ROI"
            formatValue={(n) => `${n.toFixed(2)}x`}
            showLabel={true}
            showChange={true}
          />
        </MetricsBar>

        {/* Unified Growth Trend */}
        <Panel title="Business Growth Overview" allowFullscreen={true}>
          <div style={{ height: '340px', padding: '20px' }}>
            <Chart
              type="line"
              chartData={growthData}
              chartOptions={{
                scales: {
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
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
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    beginAtZero: true,
                    ticks: {
                      callback: (value: number) => formatLongNumber(value / 10),
                      color: colors.chart.text,
                    },
                    grid: {
                      drawOnChartArea: false,
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
        </Panel>

        {/* Three column KPIs */}
        <Grid columns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap="6">
          {/* Product Health */}
          <Panel title="Product Health">
            <Column padding="6" gap="4">
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Day 30 Retention</Text>
                  <Text weight="bold" size="5">28%</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↑ 4%</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Feature Adoption</Text>
                  <Text weight="bold" size="5">73%</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↑ 5%</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Session Duration</Text>
                  <Text weight="bold" size="5">4.2m</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↑ 0.4m</Text>
              </Row>
            </Column>
          </Panel>

          {/* Marketing Efficiency */}
          <Panel title="Marketing Efficiency">
            <Column padding="6" gap="4">
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Cost Per Conversion</Text>
                  <Text weight="bold" size="5">$24.05</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↓ $0.46</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Conversion Rate</Text>
                  <Text weight="bold" size="5">5.8%</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↑ 0.5%</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">CAC Payback</Text>
                  <Text weight="bold" size="5">14mo</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↓ 2mo</Text>
              </Row>
            </Column>
          </Panel>

          {/* Revenue Metrics */}
          <Panel title="Revenue Metrics">
            <Column padding="6" gap="4">
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Net Revenue Retention</Text>
                  <Text weight="bold" size="5">128%</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[4] }}>↓ 14%</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Customer Churn</Text>
                  <Text weight="bold" size="5">4.8%</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↓ 0.4%</Text>
              </Row>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Text size="1" color="muted">Avg Deal Size</Text>
                  <Text weight="bold" size="5">$48.2K</Text>
                </Column>
                <Text size="6" weight="bold" style={{ color: CHART_COLORS[2] }}>↑ $4.1K</Text>
              </Row>
            </Column>
          </Panel>
        </Grid>

        {/* Channel ROI & Customer Journey */}
        <Grid columns={{ xs: '1fr', lg: '3fr 2fr' }} gap="6">
          {/* Marketing Channel ROI */}
          <Panel title="Marketing Channel Performance" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={channelROIData}
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
          </Panel>

          {/* Revenue Mix */}
          <Panel title="Revenue Composition" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ maxWidth: '250px', maxHeight: '250px' }}>
                <Chart
                  type="doughnut"
                  chartData={revenueMixData}
                  chartOptions={{
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom' as const,
                        labels: {
                          color: colors.chart.text,
                          padding: 10,
                          font: {
                            size: 11,
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </Panel>
        </Grid>

        {/* Full Customer Journey & Weekly Metrics */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
          {/* Customer Journey Funnel */}
          <Panel title="End-to-End Customer Journey" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={journeyData}
                chartOptions={{
                  indexAxis: 'y' as const,
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongNumber(value),
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
            <Column padding="4" gap="1">
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Overall Conversion:</Text>
                <Text size="1" weight="bold">34% (Awareness → Purchase)</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="1" color="muted">Retention to Advocacy:</Text>
                <Text size="1" weight="bold">33.9% advocacy rate</Text>
              </Row>
            </Column>
          </Panel>

          {/* Weekly Product & Marketing Trends */}
          <Panel title="Weekly Engagement Trends" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="line"
                chartData={productMetricsData}
                chartOptions={{
                  scales: {
                    y: {
                      type: 'linear' as const,
                      display: true,
                      position: 'left' as const,
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongNumber(value),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
                    y1: {
                      type: 'linear' as const,
                      display: true,
                      position: 'right' as const,
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongNumber(value),
                        color: colors.chart.text,
                      },
                      grid: {
                        drawOnChartArea: false,
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
          </Panel>
        </Grid>

        {/* Strategic Insights */}
        <Panel title="Strategic Insights & Action Items">
          <Column padding="6" gap="4">
            <Column gap="2">
              <Text weight="bold" size="3">🎯 Key Wins This Month</Text>
              <Column gap="2" paddingLeft="4">
                <Text size="1">• Product retention up 4% - new onboarding flow driving 28% better D30 retention</Text>
                <Text size="1">• Marketing efficiency improved - CPA down 8% while conversion volume up 15%</Text>
                <Text size="1">• Revenue growth accelerating - 6.2% MoM growth with improving unit economics</Text>
                <Text size="1">• Expansion revenue at 28% of total - upsell motion proving effective</Text>
              </Column>
            </Column>
            <Column gap="2">
              <Text weight="bold" size="3">⚡ Priority Actions</Text>
              <Column gap="2" paddingLeft="4">
                <Text size="1">• Double down on Organic Search - 6.2% conversion rate vs 4.8% paid (invest in SEO)</Text>
                <Text size="1">• Address NRR decline from 142% to 128% - 3 enterprise accounts ($142K MRR) at risk</Text>
                <Text size="1">• Scale what's working - Black Friday campaign achieved 4.1x ROI, replicate approach</Text>
                <Text size="1">• Product optimization - 18 accounts at 80%+ usage ready for upsell ($215K ARR opportunity)</Text>
              </Column>
            </Column>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
