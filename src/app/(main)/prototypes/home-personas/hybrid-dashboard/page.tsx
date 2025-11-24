'use client';

import { Column, useTheme, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { GridRow } from '@/components/common/GridRow';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { useMemo, useState } from 'react';
import { getThemeColors } from '@/lib/colors';
import { startOfDay, subDays, addDays, format, startOfMonth, subMonths, addMonths } from 'date-fns';

export default function HybridDashboardHomePage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);
  const [activeTab, setActiveTab] = useState('overview');

  // Date ranges
  const currentDate = new Date();
  const endDate = currentDate;
  const startDate = subMonths(startOfMonth(currentDate), 11);

  // Combined top-level metrics showing all aspects
  const overviewMetrics = [
    {
      value: 3456789,
      label: 'Monthly Revenue',
      change: 234567,
      formatValue: (n: number) => formatLongCurrency(n, 'USD'),
    },
    {
      value: 45672,
      label: 'Active Users',
      change: 3245,
      formatValue: formatLongNumber,
    },
    {
      value: 87234,
      label: 'Marketing Visits',
      change: 5432,
      formatValue: formatLongNumber,
    },
    {
      value: 5.23,
      label: 'Conversion Rate',
      change: 0.12,
      formatValue: (n: number) => `${n.toFixed(2)}%`,
    },
    {
      value: 18.3,
      label: 'User Engagement',
      change: 1.2,
      formatValue: (n: number) => `${n.toFixed(1)}%`,
    },
  ];

  // Combined growth chart showing revenue, users, and traffic
  const growthData = useMemo(() => {
    const revenueData = [];
    const usersData = [];
    const trafficData = [];

    let baseRevenue = 2800000;
    let baseUsers = 38000;
    let baseTraffic = 72000;

    for (let i = 0; i < 12; i++) {
      const date = addMonths(startDate, i);
      const dateStr = format(date, 'yyyy-MM');

      // Simulate growth with correlation
      const growthFactor = 1.05 + (Math.random() * 0.04 - 0.02);
      baseRevenue *= growthFactor;
      baseUsers *= 1.04 + (Math.random() * 0.02 - 0.01);
      baseTraffic *= 1.06 + (Math.random() * 0.03 - 0.015);

      revenueData.push({ x: dateStr, y: Math.round(baseRevenue) });
      usersData.push({ x: dateStr, y: Math.round(baseUsers) });
      trafficData.push({ x: dateStr, y: Math.round(baseTraffic) });
    }

    return { revenueData, usersData, trafficData };
  }, [startDate]);

  // Health score breakdown
  const healthScoreData = useMemo(() => {
    const categories = [
      { label: 'User Engagement', value: 85 },
      { label: 'Revenue Growth', value: 92 },
      { label: 'Marketing Efficiency', value: 78 },
      { label: 'Customer Retention', value: 88 },
      { label: 'Product Adoption', value: 81 },
    ];

    return {
      labels: categories.map(c => c.label),
      datasets: [
        {
          data: categories.map(c => c.value),
          backgroundColor: [
            colors.chart.visitors.backgroundColor,
            colors.chart.views.backgroundColor,
            '#9b5de5',
            '#f15bb5',
            '#00bbf9',
          ],
        },
      ],
    };
  }, [colors]);

  // Top insights combining all personas
  const topInsights = [
    { label: 'Enterprise accounts', count: 1567890, percent: 45.4 },
    { label: 'Organic search traffic', count: 23456, percent: 26.9 },
    { label: 'Power users', count: 2847, percent: 6.2 },
    { label: 'Email campaign ROI', count: 4.67, percent: 367 },
    { label: 'Product demo conversions', count: 12834, percent: 14.7 },
  ];

  // Revenue breakdown multi-dimensional
  const revenueBreakdown = [
    { label: 'New Business', count: 892345, percent: 25.8 },
    { label: 'Expansion', count: 1234567, percent: 35.7 },
    { label: 'Renewals', count: 1329877, percent: 38.5 },
  ];

  // Customer journey funnel (combines marketing + product + revenue)
  const customerJourneyData = useMemo(() => {
    const stages = [
      { x: 'Marketing Visit', y: 87234 },
      { x: 'Sign Up', y: 12834 },
      { x: 'First Value', y: 8234 },
      { x: 'Paying Customer', y: 4567 },
      { x: 'Power User', y: 2847 },
    ];

    return {
      datasets: [
        {
          label: 'Users',
          data: stages,
          backgroundColor: colors.chart.visitors.backgroundColor,
          borderColor: colors.chart.visitors.borderColor,
          borderWidth: 1,
        },
      ],
    };
  }, [colors]);

  // Key performance indicators across all dimensions
  const kpiComparison = [
    { label: 'MRR Growth Rate', count: 7.2, percent: 100 },
    { label: 'CAC Payback (months)', count: 8.5, percent: 71 },
    { label: 'NPS Score', count: 67, percent: 100 },
    { label: 'Feature Adoption', count: 78.5, percent: 100 },
    { label: 'Win Rate', count: 45.3, percent: 100 },
  ];

  // Multi-channel performance
  const channelPerformance = [
    { label: 'Organic → Product → Revenue', count: 856000, percent: 24.8 },
    { label: 'Paid Ads → Trial → Revenue', count: 723000, percent: 20.9 },
    { label: 'Referral → Product → Revenue', count: 645000, percent: 18.7 },
    { label: 'Content → Email → Revenue', count: 534000, percent: 15.4 },
    { label: 'Social → Product → Revenue', count: 387000, percent: 11.2 },
  ];

  return (
    <PageBody>
      <Column gap="3">
        <PageHeader title="Hybrid Executive Dashboard">
          <div style={{ fontSize: '14px', color: 'var(--gray500)', marginTop: '8px' }}>
            Unified view across Product, Marketing, and Revenue Operations
          </div>
        </PageHeader>

        <MetricsBar>
          {overviewMetrics.map(({ label, value, change, formatValue }) => (
            <MetricCard
              key={label}
              value={value}
              label={label}
              change={change}
              formatValue={formatValue}
              showChange={true}
            />
          ))}
        </MetricsBar>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab value="overview">Overview</Tab>
            <Tab value="growth">Growth Metrics</Tab>
            <Tab value="efficiency">Efficiency</Tab>
          </TabList>

          <TabPanel value="overview">
            <Column gap="3">
              <GridRow layout="two">
                <Panel title="Business Health Score">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
                    <PieChart
                      chartData={healthScoreData}
                      type="doughnut"
                      height="350px"
                    />
                  </div>
                </Panel>

                <Panel title="Customer Journey Funnel">
                  <BarChart
                    chartData={customerJourneyData}
                    XAxisType="category"
                    height="350px"
                  />
                </Panel>
              </GridRow>

              <GridRow layout="three">
                <Panel title="Top Business Drivers">
                  <ListTable
                    data={topInsights}
                    showPercentage={true}
                  />
                </Panel>

                <Panel title="Revenue Composition">
                  <ListTable
                    data={revenueBreakdown}
                    showPercentage={true}
                    currency="USD"
                  />
                </Panel>

                <Panel title="Cross-Functional KPIs">
                  <ListTable
                    data={kpiComparison}
                    showPercentage={true}
                  />
                </Panel>
              </GridRow>
            </Column>
          </TabPanel>

          <TabPanel value="growth">
            <Column gap="3">
              <Panel title="12-Month Growth Trends">
                <BarChart
                  chartData={{
                    datasets: [
                      {
                        label: 'Revenue',
                        data: growthData.revenueData,
                        backgroundColor: colors.chart.visitors.backgroundColor,
                        borderColor: colors.chart.visitors.borderColor,
                        borderWidth: 1,
                        yAxisID: 'y',
                      },
                    ],
                  }}
                  unit="month"
                  minDate={startDate}
                  maxDate={endDate}
                  currency="USD"
                  height="400px"
                />
              </Panel>

              <GridRow layout="two">
                <Panel title="User Growth (12 Months)">
                  <BarChart
                    chartData={{
                      datasets: [
                        {
                          label: 'Active Users',
                          data: growthData.usersData,
                          backgroundColor: colors.chart.views.backgroundColor,
                          borderColor: colors.chart.views.borderColor,
                          borderWidth: 1,
                        },
                      ],
                    }}
                    unit="month"
                    minDate={startDate}
                    maxDate={endDate}
                    height="350px"
                  />
                </Panel>

                <Panel title="Traffic Growth (12 Months)">
                  <BarChart
                    chartData={{
                      datasets: [
                        {
                          label: 'Visitors',
                          data: growthData.trafficData,
                          backgroundColor: '#9b5de5',
                          borderColor: '#7b3dc5',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    unit="month"
                    minDate={startDate}
                    maxDate={endDate}
                    height="350px"
                  />
                </Panel>
              </GridRow>
            </Column>
          </TabPanel>

          <TabPanel value="efficiency">
            <Column gap="3">
              <Panel title="Multi-Channel Attribution & Revenue">
                <ListTable
                  data={channelPerformance}
                  showPercentage={true}
                  currency="USD"
                />
              </Panel>

              <GridRow layout="two">
                <Panel title="Key Efficiency Metrics">
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                        3.2
                      </div>
                      <div style={{ color: 'var(--gray600)', marginTop: '4px' }}>
                        Customer Acquisition Cost Ratio
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--green600)', marginTop: '4px' }}>
                        ↑ 12% improvement
                      </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                        156%
                      </div>
                      <div style={{ color: 'var(--gray600)', marginTop: '4px' }}>
                        Net Revenue Retention
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--green600)', marginTop: '4px' }}>
                        ↑ 8% improvement
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>
                        42%
                      </div>
                      <div style={{ color: 'var(--gray600)', marginTop: '4px' }}>
                        Marketing-Influenced Revenue
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--green600)', marginTop: '4px' }}>
                        ↑ 5% improvement
                      </div>
                    </div>
                  </div>
                </Panel>

                <Panel title="Strategic Insights">
                  <div style={{ padding: '20px' }}>
                    <ul style={{ lineHeight: '1.8', color: 'var(--gray600)' }}>
                      <li><strong>Revenue diversification:</strong> Expansion now 36% of MRR</li>
                      <li><strong>Organic channel:</strong> Lowest CAC at $32 vs $89 paid</li>
                      <li><strong>Product-led growth:</strong> 28% of revenue from self-serve</li>
                      <li><strong>Retention improvement:</strong> Churn down to 3.2% from 3.5%</li>
                      <li><strong>Power user conversion:</strong> Up 15% this quarter</li>
                      <li><strong>Sales cycle:</strong> Reduced to 49 days (−8 days)</li>
                    </ul>
                  </div>
                </Panel>
              </GridRow>
            </Column>
          </TabPanel>
        </Tabs>
      </Column>
    </PageBody>
  );
}
