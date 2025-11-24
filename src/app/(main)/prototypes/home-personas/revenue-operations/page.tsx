'use client';

import { Column, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { GridRow } from '@/components/common/GridRow';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongCurrency } from '@/lib/format';
import { useMemo } from 'react';
import { getThemeColors } from '@/lib/colors';
import { startOfMonth, subMonths, addMonths, format } from 'date-fns';

export default function RevenueOperationsHomePage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic date range for last 12 months
  const { endDate, startDate } = useMemo(() => {
    const end = new Date();
    const start = subMonths(startOfMonth(end), 11);
    return { endDate: end, startDate: start };
  }, []);

  // Mock data for Revenue Operations persona - focused on sales, pipeline, and revenue
  const revenueMetrics = [
    {
      value: 3456789,
      label: 'Monthly Recurring Revenue',
      change: 234567,
      formatValue: (n: number) => formatLongCurrency(n, 'USD'),
    },
    {
      value: 892345,
      label: 'New Revenue (This Month)',
      change: 45678,
      formatValue: (n: number) => formatLongCurrency(n, 'USD'),
    },
    {
      value: 123456,
      label: 'Churned Revenue',
      change: -8923,
      formatValue: (n: number) => formatLongCurrency(n, 'USD'),
      reverseColors: true,
    },
    {
      value: 3.2,
      label: 'Churn Rate',
      change: -0.3,
      formatValue: (n: number) => `${n.toFixed(1)}%`,
      reverseColors: true,
    },
    {
      value: 4567890,
      label: 'Pipeline Value',
      change: 567890,
      formatValue: (n: number) => formatLongCurrency(n, 'USD'),
    },
  ];

  // MRR growth over 12 months
  const mrrGrowth = useMemo(() => {
    const data = [];
    let baseRevenue = 2800000;

    for (let i = 0; i < 12; i++) {
      const date = addMonths(startDate, i);
      // Simulate steady growth with some variance
      const growthRate = 1.05 + (Math.random() * 0.04 - 0.02);
      baseRevenue *= growthRate;

      data.push({
        x: format(date, 'yyyy-MM'),
        y: Math.round(baseRevenue),
      });
    }
    return data;
  }, [startDate]);

  const mrrChartData = useMemo(() => ({
    datasets: [
      {
        label: 'MRR',
        data: mrrGrowth,
        backgroundColor: colors.chart.visitors.backgroundColor,
        borderColor: colors.chart.visitors.borderColor,
        borderWidth: 1,
      },
    ],
  }), [mrrGrowth, colors]);

  // Revenue by customer segment
  const revenueBySegment = useMemo(() => {
    const segments = [
      { label: 'Enterprise', value: 45.3 },
      { label: 'Mid-Market', value: 32.7 },
      { label: 'Small Business', value: 15.8 },
      { label: 'Startup', value: 6.2 },
    ];

    return {
      labels: segments.map(s => s.label),
      datasets: [
        {
          data: segments.map(s => s.value),
          backgroundColor: [
            colors.chart.visitors.backgroundColor,
            colors.chart.views.backgroundColor,
            '#9b5de5',
            '#f15bb5',
          ],
        },
      ],
    };
  }, [colors]);

  // Sales pipeline by stage
  const pipelineStages = [
    { label: 'Prospecting', count: 1245000, percent: 27.3 },
    { label: 'Qualification', count: 987000, percent: 21.6 },
    { label: 'Proposal', count: 756000, percent: 16.6 },
    { label: 'Negotiation', count: 623000, percent: 13.6 },
    { label: 'Closed Won', count: 956890, percent: 21.0 },
  ];

  // Top sales reps performance
  const salesReps = [
    { label: 'Sarah Chen', count: 287500, percent: 32.2 },
    { label: 'Michael Roberts', count: 234800, percent: 26.3 },
    { label: 'Jessica Kumar', count: 198600, percent: 22.2 },
    { label: 'David Martinez', count: 156400, percent: 17.5 },
    { label: 'Emily Watson', count: 125900, percent: 14.1 },
  ];

  // Revenue by product line
  const productRevenue = [
    { label: 'Analytics Pro', count: 1567890, percent: 45.4 },
    { label: 'Analytics Enterprise', count: 987654, percent: 28.6 },
    { label: 'Marketing Suite', count: 567890, percent: 16.4 },
    { label: 'API Access', count: 234567, percent: 6.8 },
    { label: 'Professional Services', count: 98765, percent: 2.9 },
  ];

  // At-risk accounts
  const atRiskAccounts = [
    { label: 'Acme Corp', count: 125000, percent: 89 }, // percent = health score
    { label: 'TechStart Inc', count: 98000, percent: 76 },
    { label: 'Global Solutions', count: 87500, percent: 68 },
    { label: 'Innovation Labs', count: 76000, percent: 54 },
    { label: 'Digital Ventures', count: 65000, percent: 47 },
  ];

  // Win rate by lead source
  const winRateBySource = [
    { label: 'Referral', count: 67.5, percent: 67.5 },
    { label: 'Inbound Marketing', count: 45.3, percent: 45.3 },
    { label: 'Outbound Sales', count: 32.7, percent: 32.7 },
    { label: 'Partner Channel', count: 54.2, percent: 54.2 },
    { label: 'Events', count: 38.9, percent: 38.9 },
  ];

  // Sales cycle metrics
  const salesCycleData = useMemo(() => {
    const stages = [
      { x: 'Prospecting', y: 12 },
      { x: 'Qualification', y: 8 },
      { x: 'Proposal', y: 14 },
      { x: 'Negotiation', y: 10 },
      { x: 'Closed', y: 5 },
    ];

    return {
      datasets: [
        {
          label: 'Avg Days in Stage',
          data: stages,
          backgroundColor: colors.chart.views.backgroundColor,
          borderColor: colors.chart.views.borderColor,
          borderWidth: 1,
        },
      ],
    };
  }, [colors]);

  return (
    <PageBody>
      <Column gap="3">
        <PageHeader title="Revenue Operations Dashboard">
          <div style={{ fontSize: '14px', color: 'var(--gray500)', marginTop: '8px' }}>
            Monitor revenue drivers, sales pipeline, and account health
          </div>
        </PageHeader>

        <MetricsBar>
          {revenueMetrics.map(({ label, value, change, formatValue, reverseColors }) => (
            <MetricCard
              key={label}
              value={value}
              label={label}
              change={change}
              formatValue={formatValue}
              reverseColors={reverseColors}
              showChange={true}
            />
          ))}
        </MetricsBar>

        <GridRow layout="two">
          <Panel title="Monthly Recurring Revenue (12 Months)">
            <BarChart
              chartData={mrrChartData}
              unit="month"
              minDate={startDate}
              maxDate={endDate}
              currency="USD"
              height="350px"
            />
          </Panel>

          <Panel title="Revenue by Customer Segment">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
              <PieChart
                chartData={revenueBySegment}
                type="doughnut"
                height="350px"
              />
            </div>
          </Panel>
        </GridRow>

        <GridRow layout="three">
          <Panel title="Sales Pipeline by Stage">
            <ListTable
              data={pipelineStages}
              showPercentage={true}
              currency="USD"
            />
          </Panel>

          <Panel title="Top Sales Reps (This Month)">
            <ListTable
              data={salesReps}
              showPercentage={true}
              currency="USD"
            />
          </Panel>

          <Panel title="Revenue by Product">
            <ListTable
              data={productRevenue}
              showPercentage={true}
              currency="USD"
            />
          </Panel>
        </GridRow>

        <GridRow layout="three">
          <Panel title="At-Risk Accounts">
            <ListTable
              data={atRiskAccounts}
              showPercentage={true}
              currency="USD"
            />
          </Panel>

          <Panel title="Win Rate by Lead Source">
            <ListTable
              data={winRateBySource}
              showPercentage={true}
            />
          </Panel>

          <Panel title="Key Revenue Insights">
            <div style={{ padding: '20px' }}>
              <ul style={{ lineHeight: '1.8', color: 'var(--gray600)' }}>
                <li><strong>MRR growth:</strong> 7.2% this month</li>
                <li><strong>Churn improved:</strong> Down 0.3% to 3.2%</li>
                <li><strong>Pipeline:</strong> $4.6M in qualified opps</li>
                <li><strong>Enterprise segment:</strong> 45% of revenue</li>
                <li><strong>Avg deal size:</strong> $12,500 (+15% YoY)</li>
              </ul>
            </div>
          </Panel>
        </GridRow>

        <Panel title="Average Sales Cycle Length by Stage (Days)">
          <BarChart
            chartData={salesCycleData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
      </Column>
    </PageBody>
  );
}
