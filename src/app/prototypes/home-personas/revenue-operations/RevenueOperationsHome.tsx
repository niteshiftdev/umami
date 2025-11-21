'use client';

import { useMemo } from 'react';
import { Column, Grid, Row, Heading, Text, useTheme } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { Chart } from '@/components/charts/Chart';
import { formatLongNumber, formatNumber, formatLongCurrency } from '@/lib/format';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { renderNumberLabels } from '@/lib/charts';
import { startOfDay, subDays, startOfMonth, subMonths, format } from 'date-fns';

export function RevenueOperationsHome() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic monthly revenue data
  const generateMonthlyData = (months: number, baseValue: number, variance: number, growth: number) => {
    const data = [];
    const now = startOfMonth(new Date());

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(now, i);
      const randomVariance = (Math.random() - 0.5) * variance;
      const trend = (months - i) * growth;
      const value = Math.max(0, Math.round(baseValue + randomVariance + trend));

      data.push({
        x: format(date, 'yyyy-MM'),
        y: value,
      });
    }

    return data;
  };

  // Generate daily pipeline data
  const generateDailyData = (days: number, baseValue: number, variance: number) => {
    const data = [];
    const now = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const randomVariance = (Math.random() - 0.5) * variance;
      const value = Math.max(0, Math.round(baseValue + randomVariance));

      data.push({
        x: format(date, 'yyyy-MM-dd'),
        y: value,
      });
    }

    return data;
  };

  // Revenue Metrics
  const monthlyRevenueData = generateMonthlyData(12, 850000, 150000, 25000);
  const currentRevenue = monthlyRevenueData[monthlyRevenueData.length - 1].y;
  const previousRevenue = monthlyRevenueData[monthlyRevenueData.length - 2].y;
  const revenueChange = currentRevenue - previousRevenue;

  const arr = 11250000; // Annual Recurring Revenue
  const previousArr = 10450000;
  const arrChange = arr - previousArr;

  const avgDealSize = 42500;
  const previousAvgDealSize = 39800;
  const dealSizeChange = avgDealSize - previousAvgDealSize;

  const churnRate = 2.8;
  const previousChurnRate = 3.4;
  const churnChange = churnRate - previousChurnRate;

  // Monthly Revenue with Targets
  const revenueChartData = useMemo(() => {
    const targetData = monthlyRevenueData.map((d) => ({
      x: d.x,
      y: 950000, // Target revenue
    }));

    return {
      datasets: [
        {
          type: 'bar',
          label: 'Actual Revenue',
          data: monthlyRevenueData,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 1,
        },
        {
          type: 'line',
          label: 'Target',
          data: targetData,
          borderColor: CHART_COLORS[4],
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
        },
      ],
    };
  }, []);

  // Sales Pipeline by Stage
  const pipelineData = useMemo(() => {
    return {
      labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'],
      datasets: [
        {
          label: 'Pipeline Value',
          data: [3850000, 2450000, 1850000, 980000, 1120000],
          backgroundColor: [
            CHART_COLORS[0],
            CHART_COLORS[1],
            CHART_COLORS[3],
            CHART_COLORS[5],
            CHART_COLORS[2],
          ],
        },
      ],
    };
  }, []);

  // Revenue by Product Line
  const revenueByProductData = useMemo(() => {
    const months = monthlyRevenueData.slice(-6).map((d) => d.x);

    return {
      labels: months,
      datasets: [
        {
          type: 'bar',
          label: 'Enterprise',
          data: months.map(() => Math.round(500000 + Math.random() * 100000)),
          backgroundColor: CHART_COLORS[0],
          stack: 'stack',
        },
        {
          type: 'bar',
          label: 'Professional',
          data: months.map(() => Math.round(250000 + Math.random() * 50000)),
          backgroundColor: CHART_COLORS[1],
          stack: 'stack',
        },
        {
          type: 'bar',
          label: 'Starter',
          data: months.map(() => Math.round(100000 + Math.random() * 30000)),
          backgroundColor: CHART_COLORS[2],
          stack: 'stack',
        },
      ],
    };
  }, []);

  // Customer Health Score Distribution
  const customerHealthData = useMemo(() => {
    return {
      labels: ['Healthy', 'At Risk', 'Critical'],
      datasets: [
        {
          label: 'Customers',
          data: [285, 52, 18],
          backgroundColor: [CHART_COLORS[2], CHART_COLORS[5], CHART_COLORS[4]],
        },
      ],
    };
  }, []);

  // Win Rate by Rep
  const winRateData = useMemo(() => {
    return {
      labels: ['Sarah Chen', 'Mike Johnson', 'Emily Davis', 'James Wilson', 'Lisa Anderson'],
      datasets: [
        {
          label: 'Win Rate (%)',
          data: [68, 62, 58, 54, 51],
          backgroundColor: CHART_COLORS[1],
        },
      ],
    };
  }, []);

  // Deals Closing This Month
  const dealsClosingData = generateDailyData(30, 45000, 25000);
  const dealsClosingChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Expected Close Value',
          data: dealsClosingData,
          backgroundColor: CHART_COLORS[3],
          borderColor: CHART_COLORS[3],
          borderWidth: 1,
        },
      ],
    };
  }, []);

  const monthlyChartOptions = useMemo(() => {
    return {
      scales: {
        x: {
          type: 'timeseries',
          time: {
            unit: 'month',
          },
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
        y: {
          type: 'linear',
          min: 0,
          beginAtZero: true,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => '$' + formatLongNumber(value),
          },
        },
      },
    };
  }, [colors]);

  const barChartOptions = useMemo(() => {
    return {
      scales: {
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
        y: {
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => '$' + formatLongNumber(value),
          },
        },
      },
    };
  }, [colors]);

  const stackedBarOptions = useMemo(() => {
    return {
      scales: {
        x: {
          stacked: true,
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
        y: {
          stacked: true,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => '$' + formatLongNumber(value),
          },
        },
      },
    };
  }, [colors]);

  const percentChartOptions = useMemo(() => {
    return {
      indexAxis: 'y' as const,
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => value + '%',
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
    };
  }, [colors]);

  const dailyChartOptions = useMemo(() => {
    return {
      scales: {
        x: {
          type: 'timeseries',
          time: {
            unit: 'day',
          },
          grid: {
            display: false,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            maxRotation: 0,
          },
        },
        y: {
          type: 'linear',
          min: 0,
          beginAtZero: true,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => '$' + formatLongNumber(value),
          },
        },
      },
    };
  }, [colors]);

  return (
    <PageBody>
      <Column margin="2" gap="4">
        <PageHeader title="Revenue Operations">
          <Text>Monitor pipeline health, revenue trends, and customer success metrics</Text>
        </PageHeader>

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            value={currentRevenue}
            change={revenueChange}
            label="Monthly Revenue"
            formatValue={(n) => '$' + formatLongNumber(n)}
            showChange={true}
          />
          <MetricCard
            value={arr}
            change={arrChange}
            label="ARR"
            formatValue={(n) => '$' + formatLongNumber(n)}
            showChange={true}
          />
          <MetricCard
            value={avgDealSize}
            change={dealSizeChange}
            label="Avg Deal Size"
            formatValue={(n) => '$' + formatLongNumber(n)}
            showChange={true}
          />
          <MetricCard
            value={churnRate}
            change={churnChange}
            label="Churn Rate"
            formatValue={(n) => `${n.toFixed(1)}%`}
            showChange={true}
            reverseColors={true}
          />
        </MetricsBar>

        {/* Monthly Revenue Trend */}
        <Panel title="Monthly Revenue vs Target (Last 12 Months)" allowFullscreen>
          <Chart
            type="bar"
            chartData={revenueChartData}
            chartOptions={monthlyChartOptions}
            height="400px"
          />
        </Panel>

        {/* Two Column Layout */}
        <GridRow layout="two" minHeight="450px">
          <Panel title="Sales Pipeline by Stage">
            <Chart
              type="bar"
              chartData={pipelineData}
              chartOptions={barChartOptions}
              height="380px"
            />
          </Panel>
          <Panel title="Revenue by Product Line (Last 6 Months)">
            <Chart
              type="bar"
              chartData={revenueByProductData}
              chartOptions={stackedBarOptions}
              height="380px"
            />
          </Panel>
        </GridRow>

        {/* Risk and Performance */}
        <GridRow layout="two" minHeight="450px">
          <Panel title="Customer Health Score">
            <Chart
              type="doughnut"
              chartData={customerHealthData}
              chartOptions={{}}
              height="380px"
            />
          </Panel>
          <Panel title="Win Rate by Sales Rep">
            <Chart
              type="bar"
              chartData={winRateData}
              chartOptions={percentChartOptions}
              height="380px"
            />
          </Panel>
        </GridRow>

        {/* Deals Closing This Month */}
        <Panel title="Expected Deal Closures (Next 30 Days)">
          <Chart
            type="bar"
            chartData={dealsClosingChartData}
            chartOptions={dailyChartOptions}
            height="400px"
          />
        </Panel>

        {/* Revenue Insights */}
        <Panel title="Key Insights">
          <Column gap="3" padding="4">
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">
                ↑
              </Text>
              <Text>
                <Text weight="bold">ARR grew by $800k (7.7%)</Text> this month, primarily driven by
                Enterprise plan expansions and strong Q1 sales performance.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" style={{ color: '#e34850' }}>
                ↓
              </Text>
              <Text>
                <Text weight="bold">18 customers in critical health status</Text> representing $1.2M ARR
                at risk - immediate CSM intervention required.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">
                ↑
              </Text>
              <Text>
                <Text weight="bold">$3.85M in early-stage pipeline</Text> - highest in 6 months. Focus on
                moving deals through qualification to maintain momentum.
              </Text>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
