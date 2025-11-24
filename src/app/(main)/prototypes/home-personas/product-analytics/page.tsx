'use client';

import { Column, Row, Grid, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { GridRow } from '@/components/common/GridRow';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber } from '@/lib/format';
import { useMemo } from 'react';
import { getThemeColors } from '@/lib/colors';
import { startOfDay, subDays, addDays, format } from 'date-fns';

export default function ProductAnalyticsHomePage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic date range for last 30 days
  const { endDate, startDate } = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    return { endDate: end, startDate: start };
  }, []);

  // Mock data for Product Analytics persona - focused on user engagement
  const engagementMetrics = [
    {
      value: 45672,
      label: 'Monthly Active Users',
      change: 3245,
      formatValue: formatLongNumber,
    },
    {
      value: 8234,
      label: 'Daily Active Users',
      change: 412,
      formatValue: formatLongNumber,
    },
    {
      value: 18.3,
      label: 'DAU/MAU Ratio',
      change: 1.2,
      formatValue: (n: number) => `${n.toFixed(1)}%`,
    },
    {
      value: 156,
      label: 'Avg Session Duration',
      change: 12,
      formatValue: (n: number) => `${Math.round(n)}s`,
    },
    {
      value: 4.7,
      label: 'Pages per Session',
      change: 0.3,
      formatValue: (n: number) => n.toFixed(1),
    },
  ];

  // User engagement over time - last 30 days
  const engagementOverTime = useMemo(() => {
    const data = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(startDate, i);
      // Create realistic patterns with weekly cycles
      const weekdayFactor = [5, 6].includes(date.getDay()) ? 0.7 : 1.0; // Lower on weekends
      const baseValue = 8000 + Math.sin(i / 7) * 1000;
      const randomVariation = Math.random() * 500;

      data.push({
        x: format(date, 'yyyy-MM-dd'),
        y: Math.round(baseValue * weekdayFactor + randomVariation),
      });
    }
    return data;
  }, [startDate]);

  const engagementChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Daily Active Users',
        data: engagementOverTime,
        backgroundColor: colors.chart.visitors.backgroundColor,
        borderColor: colors.chart.visitors.borderColor,
        borderWidth: 1,
      },
    ],
  }), [engagementOverTime, colors]);

  // Feature adoption data
  const featureAdoptionData = useMemo(() => {
    const features = [
      { label: 'Search', value: 78.5 },
      { label: 'Filters', value: 65.2 },
      { label: 'Dashboard', value: 89.3 },
      { label: 'Reports', value: 45.7 },
      { label: 'Exports', value: 32.1 },
      { label: 'Integrations', value: 28.4 },
    ];

    return {
      labels: features.map(f => f.label),
      datasets: [
        {
          data: features.map(f => f.value),
          backgroundColor: [
            colors.chart.visitors.backgroundColor,
            colors.chart.views.backgroundColor,
            '#9b5de5',
            '#f15bb5',
            '#fee440',
            '#00bbf9',
          ],
        },
      ],
    };
  }, [colors]);

  // Retention cohort data
  const retentionData = [
    { label: 'Week 1', count: 2847, percent: 100 },
    { label: 'Week 2', count: 2139, percent: 75.1 },
    { label: 'Week 3', count: 1878, percent: 66.0 },
    { label: 'Week 4', count: 1652, percent: 58.0 },
    { label: 'Week 8', count: 1367, percent: 48.0 },
    { label: 'Week 12', count: 1196, percent: 42.0 },
  ];

  // User behavior funnel
  const funnelData = useMemo(() => {
    const steps = [
      { x: 'Visited Site', y: 45672 },
      { x: 'Signed Up', y: 12834 },
      { x: 'Completed Onboarding', y: 9876 },
      { x: 'First Action', y: 8234 },
      { x: 'Return Visit', y: 6123 },
    ];

    return {
      datasets: [
        {
          label: 'Users',
          data: steps,
          backgroundColor: colors.chart.visitors.backgroundColor,
          borderColor: colors.chart.visitors.borderColor,
          borderWidth: 1,
        },
      ],
    };
  }, [colors]);

  // Top user segments
  const userSegments = [
    { label: 'Power Users', count: 2847, percent: 6.2 },
    { label: 'Active Users', count: 12834, percent: 28.1 },
    { label: 'Casual Users', count: 18765, percent: 41.1 },
    { label: 'At-Risk Users', count: 7834, percent: 17.2 },
    { label: 'Inactive', count: 3392, percent: 7.4 },
  ];

  return (
    <PageBody>
      <Column gap="3">
        <PageHeader title="Product Analytics Dashboard">
          <div style={{ fontSize: '14px', color: 'var(--gray500)', marginTop: '8px' }}>
            Understand user engagement, feature adoption, and behavior patterns
          </div>
        </PageHeader>

        <MetricsBar>
          {engagementMetrics.map(({ label, value, change, formatValue }) => (
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

        <GridRow layout="two">
          <Panel title="Daily Active Users (Last 30 Days)">
            <BarChart
              chartData={engagementChartData}
              unit="day"
              minDate={startDate}
              maxDate={endDate}
              height="350px"
            />
          </Panel>

          <Panel title="Feature Adoption Rate">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '350px' }}>
              <PieChart
                chartData={featureAdoptionData}
                type="doughnut"
                height="350px"
              />
            </div>
          </Panel>
        </GridRow>

        <GridRow layout="two">
          <Panel title="User Retention Cohort">
            <ListTable
              data={retentionData}
              showPercentage={true}
            />
          </Panel>

          <Panel title="User Segments">
            <ListTable
              data={userSegments}
              showPercentage={true}
            />
          </Panel>
        </GridRow>

        <Panel title="Conversion Funnel">
          <BarChart
            chartData={funnelData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
      </Column>
    </PageBody>
  );
}
