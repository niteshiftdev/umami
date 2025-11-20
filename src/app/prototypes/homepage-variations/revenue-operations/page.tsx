'use client';
import { Column, Row, useTheme, Text } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { useMessages, useLocale } from '@/components/hooks';
import { useMemo } from 'react';
import { getThemeColors } from '@/lib/colors';
import { formatLongNumber, formatNumber } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import { startOfDay, startOfMonth, subMonths, format } from 'date-fns';

export default function RevenueOperationsPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic mock data
  const now = new Date();
  const minDate = startOfMonth(subMonths(now, 11));
  const maxDate = startOfMonth(now);

  // Monthly Recurring Revenue data
  const mrrData = useMemo(() => {
    const data = [];
    let baseRevenue = 450000;
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(now, i);
      const growth = (11 - i) * 12000 + Math.random() * 8000;
      const revenue = baseRevenue + growth;
      data.push({
        x: format(startOfMonth(date), 'yyyy-MM'),
        y: Math.floor(revenue),
      });
    }
    return data;
  }, []);

  // New vs Churned Revenue
  const revenueChangeData = useMemo(() => {
    const newRevenue = [];
    const churnedRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(now, i);
      const dateStr = format(startOfMonth(date), 'yyyy-MM');

      const newRev = 45000 + Math.random() * 15000;
      const churn = 12000 + Math.random() * 8000;

      newRevenue.push({ x: dateStr, y: Math.floor(newRev) });
      churnedRevenue.push({ x: dateStr, y: -Math.floor(churn) });
    }
    return { newRevenue, churnedRevenue };
  }, []);

  // Revenue by Product Line
  const revenueByProductData = useMemo(() => {
    return {
      labels: ['Enterprise Plan', 'Professional Plan', 'Team Plan', 'Starter Plan', 'Add-ons'],
      datasets: [
        {
          label: 'Revenue',
          data: [342000, 198500, 124300, 67800, 45600],
          backgroundColor: CHART_COLORS.slice(0, 5),
          borderWidth: 0,
        },
      ],
    };
  }, []);

  // Sales Pipeline by Stage
  const pipelineData = useMemo(() => {
    return {
      labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closing'],
      datasets: [
        {
          label: 'Pipeline Value',
          data: [2850000, 1920000, 1345000, 892000, 567000],
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 1,
        },
      ],
    };
  }, []);

  const mrrChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Monthly Recurring Revenue',
          data: mrrData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
        },
      ],
    };
  }, [mrrData]);

  const revenueChangeChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'New Revenue',
          data: revenueChangeData.newRevenue,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
        },
        {
          type: 'bar',
          label: 'Churned Revenue',
          data: revenueChangeData.churnedRevenue,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[4],
          borderColor: CHART_COLORS[4],
        },
      ],
    };
  }, [revenueChangeData]);

  const productChartOptions = useMemo(() => {
    return {
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
        tooltip: {
          enabled: true,
        },
      },
    };
  }, []);

  const pipelineChartOptions = useMemo(() => {
    return {
      indexAxis: 'y',
      scales: {
        x: {
          type: 'linear',
          beginAtZero: true,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => `$${(value / 1000000).toFixed(1)}M`,
          },
        },
        y: {
          type: 'category',
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
    };
  }, [colors]);

  return (
    <PageBody>
      <Column gap margin="2">
        <PageHeader
          title="Revenue Operations Dashboard"
          description="Sales/CSM view of revenue drivers, pipeline, and risks"
        />

        <Row gap="3">
          <MetricCard
            value={778200}
            change={723400}
            label="Monthly Recurring Revenue"
            showChange={true}
            formatValue={(n) => `$${formatLongNumber(n)}`}
          />
          <MetricCard
            value={7574000}
            change={6892000}
            label="Annual Run Rate"
            showChange={true}
            formatValue={(n) => `$${formatLongNumber(n)}`}
          />
          <MetricCard
            value={2.8}
            change={3.4}
            label="Churn Rate (%)"
            showChange={true}
            reverseColors={true}
            formatValue={(n) => `${n.toFixed(1)}%`}
          />
          <MetricCard
            value={142}
            change={128}
            label="Net Revenue Retention"
            showChange={true}
            formatValue={(n) => `${Math.round(n)}%`}
          />
        </Row>

        <Panel title="Monthly Recurring Revenue (Last 12 Months)" minHeight="420px">
          <BarChart
            chartData={mrrChartData}
            unit="month"
            minDate={minDate}
            maxDate={maxDate}
            height="370px"
            renderYLabel={(label) => `$${formatLongNumber(parseInt(label))}`}
          />
        </Panel>

        <GridRow layout="two">
          <Panel title="Revenue Change (New vs Churned)" minHeight="400px">
            <BarChart
              chartData={revenueChangeChartData}
              unit="month"
              minDate={minDate}
              maxDate={maxDate}
              height="350px"
              stacked={false}
              renderYLabel={(label) => {
                const val = parseInt(label);
                return val < 0 ? `-$${formatLongNumber(Math.abs(val))}` : `$${formatLongNumber(val)}`;
              }}
            />
          </Panel>

          <Panel title="Revenue by Product Line" minHeight="400px">
            <PieChart
              chartData={revenueByProductData}
              chartOptions={productChartOptions}
              height="350px"
              type="doughnut"
            />
          </Panel>
        </GridRow>

        <GridRow layout="two">
          <Panel title="Sales Pipeline by Stage" minHeight="400px">
            <Chart
              type="bar"
              chartData={pipelineData}
              chartOptions={pipelineChartOptions}
              height="350px"
            />
          </Panel>

          <Panel title="At-Risk Accounts">
            <Column gap="2" padding="4">
              {[
                { account: 'Acme Corporation', arr: 145000, risk: 'High', reason: 'Low Usage' },
                { account: 'TechStart Inc', arr: 89000, risk: 'High', reason: 'Payment Issue' },
                { account: 'Global Solutions', arr: 234000, risk: 'Medium', reason: 'Support Tickets' },
                { account: 'Innovation Labs', arr: 67000, risk: 'Medium', reason: 'Contract Ending' },
                { account: 'Digital Dynamics', arr: 123000, risk: 'Low', reason: 'NPS Score' },
              ].map((item, index) => (
                <Column key={index} gap="1">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="medium">{item.account}</Text>
                    <Text
                      weight="bold"
                      color={
                        item.risk === 'High' ? 'red' : item.risk === 'Medium' ? 'orange' : 'yellow'
                      }
                    >
                      {item.risk} Risk
                    </Text>
                  </Row>
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="sm" color="secondary">
                      ARR: ${formatLongNumber(item.arr)}
                    </Text>
                    <Text size="sm" color="secondary">
                      {item.reason}
                    </Text>
                  </Row>
                </Column>
              ))}
            </Column>
          </Panel>
        </GridRow>

        <Panel title="Top Performing Sales Reps (This Quarter)">
          <Column gap="2" padding="4">
            {[
              { name: 'Sarah Johnson', deals: 23, revenue: 892000, quota: 118 },
              { name: 'Michael Chen', deals: 19, revenue: 734000, quota: 105 },
              { name: 'Emily Rodriguez', deals: 21, revenue: 689000, quota: 98 },
              { name: 'David Kim', deals: 17, revenue: 623000, quota: 94 },
              { name: 'Jessica Martinez', deals: 15, revenue: 567000, quota: 89 },
            ].map((item, index) => (
              <Row key={index} justifyContent="space-between" alignItems="center">
                <Text weight="medium" style={{ flex: 1 }}>
                  {item.name}
                </Text>
                <Row gap="4" alignItems="center">
                  <Text style={{ minWidth: '100px', textAlign: 'right' }}>
                    ${formatLongNumber(item.revenue)}
                  </Text>
                  <Text style={{ minWidth: '70px', textAlign: 'right' }}>
                    {item.deals} deals
                  </Text>
                  <Text
                    weight="medium"
                    color={item.quota >= 100 ? 'green' : 'orange'}
                    style={{ minWidth: '80px', textAlign: 'right' }}
                  >
                    {item.quota}% quota
                  </Text>
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
