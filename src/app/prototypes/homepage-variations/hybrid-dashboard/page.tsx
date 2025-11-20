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
import { startOfDay, subDays, format } from 'date-fns';

export default function HybridDashboardPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic mock data
  const now = new Date();
  const minDate = startOfDay(subDays(now, 29));
  const maxDate = startOfDay(now);

  // Combined traffic and revenue data
  const combinedData = useMemo(() => {
    const traffic = [];
    const revenue = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(startOfDay(date), 'yyyy-MM-dd');

      // Traffic with weekly patterns
      const dayOfWeek = date.getDay();
      const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
      const baseTraffic = isWeekday ? 8500 : 6200;
      const trafficVariation = Math.sin(i / 5) * 1200 + Math.random() * 800;
      traffic.push({ x: dateStr, y: Math.floor(baseTraffic + trafficVariation) });

      // Revenue correlated with traffic
      const baseRevenue = isWeekday ? 12500 : 8900;
      const revenueVariation = Math.sin(i / 5) * 1800 + Math.random() * 1200;
      revenue.push({ x: dateStr, y: Math.floor(baseRevenue + revenueVariation) });
    }
    return { traffic, revenue };
  }, []);

  // Multi-metric performance chart
  const performanceChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Daily Traffic',
          data: combinedData.traffic,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Daily Revenue',
          data: combinedData.revenue,
          borderWidth: 2,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          yAxisID: 'y1',
          tension: 0.3,
        },
      ],
    };
  }, [combinedData]);

  // Business metrics breakdown
  const metricsBreakdownData = useMemo(() => {
    return {
      labels: [
        'Product Usage',
        'Marketing Leads',
        'Sales Pipeline',
        'Active Users',
        'Revenue Growth',
        'Churn Rate',
      ],
      datasets: [
        {
          label: 'Performance Score',
          data: [87, 72, 68, 92, 78, 15],
          backgroundColor: CHART_COLORS.slice(0, 6),
          borderWidth: 0,
        },
      ],
    };
  }, []);

  // Unified funnel: Marketing -> Product -> Revenue
  const unifiedFunnelData = useMemo(() => {
    return {
      labels: ['Website Visitors', 'Sign Ups', 'Active Users', 'Paying Customers', 'High-Value Accounts'],
      datasets: [
        {
          label: 'User Count',
          data: [162847, 28934, 14287, 6834, 892],
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
        },
      ],
    };
  }, []);

  const performanceChartOptions = useMemo(() => {
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
          },
        },
        y: {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => formatLongNumber(value),
          },
          title: {
            display: true,
            text: 'Traffic',
            color: colors.chart.text,
          },
        },
        y1: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          grid: {
            display: false,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => `$${formatLongNumber(value)}`,
          },
          title: {
            display: true,
            text: 'Revenue',
            color: colors.chart.text,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
    };
  }, [colors]);

  const metricsChartOptions = useMemo(() => {
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

  const funnelChartOptions = useMemo(() => {
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
            callback: (value: number) => formatLongNumber(value),
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
          title="Hybrid Business Dashboard"
          description="Unified view combining product, marketing, and revenue metrics"
        />

        <Row gap="3">
          <MetricCard
            value={14287}
            change={13542}
            label="Daily Active Users"
            showChange={true}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={6834}
            change={6012}
            label="Monthly Conversions"
            showChange={true}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={778200}
            change={723400}
            label="Monthly Recurring Revenue"
            showChange={true}
            formatValue={(n) => `$${formatLongNumber(n)}`}
          />
          <MetricCard
            value={4.2}
            change={4.0}
            label="Overall Conversion Rate"
            showChange={true}
            formatValue={(n) => `${n.toFixed(1)}%`}
          />
        </Row>

        <Panel title="Traffic & Revenue Performance (Last 30 Days)" minHeight="420px">
          <Chart
            type="bar"
            chartData={performanceChartData}
            chartOptions={performanceChartOptions}
            height="370px"
          />
        </Panel>

        <GridRow layout="two">
          <Panel title="Business Metrics Health Score" minHeight="400px">
            <PieChart
              chartData={metricsBreakdownData}
              chartOptions={metricsChartOptions}
              height="350px"
              type="doughnut"
            />
          </Panel>

          <Panel title="Unified Customer Funnel" minHeight="400px">
            <Chart
              type="bar"
              chartData={unifiedFunnelData}
              chartOptions={funnelChartOptions}
              height="350px"
            />
          </Panel>
        </GridRow>

        <GridRow layout="three">
          <Panel title="Product Insights">
            <Column gap="2" padding="4">
              <Row justifyContent="space-between">
                <Text weight="medium">Feature Adoption</Text>
                <Text weight="bold" color="green">
                  +12.3%
                </Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Avg Session Duration
                </Text>
                <Text size="sm">8.7 min</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  7-Day Retention
                </Text>
                <Text size="sm">78%</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Power Users
                </Text>
                <Text size="sm">{formatLongNumber(2847)}</Text>
              </Row>
            </Column>
          </Panel>

          <Panel title="Marketing Insights">
            <Column gap="2" padding="4">
              <Row justifyContent="space-between">
                <Text weight="medium">Campaign ROI</Text>
                <Text weight="bold" color="green">
                  287%
                </Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Cost per Acquisition
                </Text>
                <Text size="sm">$28.50</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Lead Quality Score
                </Text>
                <Text size="sm">72/100</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Active Campaigns
                </Text>
                <Text size="sm">18</Text>
              </Row>
            </Column>
          </Panel>

          <Panel title="Revenue Insights">
            <Column gap="2" padding="4">
              <Row justifyContent="space-between">
                <Text weight="medium">Net Revenue Retention</Text>
                <Text weight="bold" color="green">
                  142%
                </Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Churn Rate
                </Text>
                <Text size="sm">2.8%</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Annual Run Rate
                </Text>
                <Text size="sm">${formatLongNumber(7574000)}</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text size="sm" color="secondary">
                  Pipeline Value
                </Text>
                <Text size="sm">${formatLongNumber(7574000)}</Text>
              </Row>
            </Column>
          </Panel>
        </GridRow>

        <GridRow layout="two">
          <Panel title="Key Growth Drivers">
            <Column gap="2" padding="4">
              {[
                { driver: 'Organic Search Growth', impact: 'High', trend: '+18.2%' },
                { driver: 'Feature Engagement', impact: 'High', trend: '+12.3%' },
                { driver: 'Customer Expansion', impact: 'Medium', trend: '+9.7%' },
                { driver: 'Email Campaigns', impact: 'Medium', trend: '+8.4%' },
                { driver: 'Partner Referrals', impact: 'Low', trend: '+3.1%' },
              ].map((item, index) => (
                <Row key={index} justifyContent="space-between" alignItems="center">
                  <Column gap="0" style={{ flex: 1 }}>
                    <Text weight="medium">{item.driver}</Text>
                    <Text size="sm" color="secondary">
                      Impact: {item.impact}
                    </Text>
                  </Column>
                  <Text
                    weight="bold"
                    color="green"
                    style={{ minWidth: '70px', textAlign: 'right' }}
                  >
                    {item.trend}
                  </Text>
                </Row>
              ))}
            </Column>
          </Panel>

          <Panel title="Action Items">
            <Column gap="2" padding="4">
              {[
                { action: 'Review at-risk accounts (5 total)', priority: 'High', owner: 'Sales' },
                {
                  action: 'Optimize underperforming campaigns',
                  priority: 'High',
                  owner: 'Marketing',
                },
                {
                  action: 'Investigate feature adoption drop',
                  priority: 'Medium',
                  owner: 'Product',
                },
                { action: 'Follow up on warm leads (23)', priority: 'Medium', owner: 'Sales' },
                {
                  action: 'Schedule product demos (12 pending)',
                  priority: 'Low',
                  owner: 'Marketing',
                },
              ].map((item, index) => (
                <Row key={index} justifyContent="space-between" alignItems="center">
                  <Column gap="0" style={{ flex: 1 }}>
                    <Text weight="medium">{item.action}</Text>
                    <Text size="sm" color="secondary">
                      Owner: {item.owner}
                    </Text>
                  </Column>
                  <Text
                    weight="medium"
                    color={
                      item.priority === 'High' ? 'red' : item.priority === 'Medium' ? 'orange' : 'blue'
                    }
                    style={{ minWidth: '70px', textAlign: 'right' }}
                  >
                    {item.priority}
                  </Text>
                </Row>
              ))}
            </Column>
          </Panel>
        </GridRow>
      </Column>
    </PageBody>
  );
}
