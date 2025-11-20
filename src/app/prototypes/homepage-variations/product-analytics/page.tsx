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

export default function ProductAnalyticsPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { locale } = useLocale();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic mock data for the last 30 days
  const now = new Date();
  const minDate = new Date(startOfDay(subDays(now, 29)));
  const maxDate = new Date(startOfDay(now));

  // Daily Active Users data
  const dauData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      const baseUsers = 12000;
      const variation = Math.sin(i / 3) * 2000 + Math.random() * 1500;
      data.push({
        x: format(startOfDay(date), 'yyyy-MM-dd'),
        y: Math.floor(baseUsers + variation),
      });
    }
    return data;
  }, []);

  // Session Duration data
  const sessionDurationData = useMemo(() => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(now, i);
      const baseMinutes = 8.5;
      const variation = Math.sin(i / 4) * 1.5 + Math.random() * 0.8;
      data.push({
        x: format(startOfDay(date), 'yyyy-MM-dd'),
        y: Math.max(5, baseMinutes + variation),
      });
    }
    return data;
  }, []);

  // Feature Adoption chart data
  const featureAdoptionData = useMemo(() => {
    return {
      labels: ['Dashboard', 'Reports', 'Exports', 'API Access', 'Integrations', 'Alerts'],
      datasets: [
        {
          label: 'Feature Usage',
          data: [8942, 6251, 4328, 2891, 5673, 3456],
          backgroundColor: CHART_COLORS.slice(0, 6),
          borderWidth: 0,
        },
      ],
    };
  }, []);

  // User Retention by Cohort
  const retentionData = useMemo(() => {
    return {
      datasets: [
        {
          label: 'Week 1',
          data: [
            { x: '2025-01-13', y: 100 },
            { x: '2025-01-14', y: 92 },
            { x: '2025-01-15', y: 87 },
            { x: '2025-01-16', y: 84 },
            { x: '2025-01-17', y: 81 },
            { x: '2025-01-18', y: 79 },
            { x: '2025-01-19', y: 78 },
          ],
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 2,
        },
        {
          label: 'Week 2',
          data: [
            { x: '2025-01-13', y: 100 },
            { x: '2025-01-14', y: 89 },
            { x: '2025-01-15', y: 82 },
            { x: '2025-01-16', y: 78 },
            { x: '2025-01-17', y: 74 },
            { x: '2025-01-18', y: 71 },
            { x: '2025-01-19', y: 69 },
          ],
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 2,
        },
        {
          label: 'Week 3',
          data: [
            { x: '2025-01-13', y: 100 },
            { x: '2025-01-14', y: 94 },
            { x: '2025-01-15', y: 90 },
            { x: '2025-01-16', y: 88 },
            { x: '2025-01-17', y: 86 },
            { x: '2025-01-18', y: 85 },
            { x: '2025-01-19', y: 84 },
          ],
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 2,
        },
      ],
    };
  }, []);

  const dauChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Daily Active Users',
          data: dauData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          ...colors.chart.visitors,
        },
      ],
    };
  }, [dauData, colors]);

  const sessionDurationChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Avg Session Duration (min)',
          data: sessionDurationData,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
          backgroundColor: CHART_COLORS[3],
          borderColor: CHART_COLORS[3],
        },
      ],
    };
  }, [sessionDurationData]);

  const featureAdoptionChartOptions = useMemo(() => {
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

  const retentionChartOptions = useMemo(() => {
    return {
      scales: {
        x: {
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
        y: {
          type: 'linear',
          min: 0,
          max: 100,
          beginAtZero: true,
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: (value: number) => `${value}%`,
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

  return (
    <PageBody>
      <Column gap margin="2">
        <PageHeader
          title="Product Analytics Dashboard"
          description="User engagement metrics and behavior patterns"
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
            value={8.7}
            change={8.2}
            label="Avg Session Duration (min)"
            showChange={true}
            formatValue={(n) => n.toFixed(1)}
          />
          <MetricCard
            value={4.3}
            change={3.9}
            label="Sessions per User"
            showChange={true}
            formatValue={(n) => n.toFixed(1)}
          />
          <MetricCard
            value={78}
            change={74}
            label="7-Day Retention (%)"
            showChange={true}
            formatValue={(n) => `${Math.round(n)}%`}
          />
        </Row>

        <GridRow layout="two">
          <Panel title="Daily Active Users (Last 30 Days)" minHeight="400px">
            <BarChart
              chartData={dauChartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              height="350px"
            />
          </Panel>

          <Panel title="Average Session Duration (Last 30 Days)" minHeight="400px">
            <BarChart
              chartData={sessionDurationChartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              height="350px"
            />
          </Panel>
        </GridRow>

        <GridRow layout="two">
          <Panel title="Feature Adoption" minHeight="400px">
            <PieChart
              chartData={featureAdoptionData}
              chartOptions={featureAdoptionChartOptions}
              height="350px"
              type="doughnut"
            />
          </Panel>

          <Panel title="User Retention by Cohort (%)" minHeight="400px">
            <Chart
              type="line"
              chartData={retentionData}
              chartOptions={retentionChartOptions}
              height="350px"
            />
          </Panel>
        </GridRow>

        <Panel title="Top User Actions (Last 7 Days)">
          <Column gap="2" padding="4">
            {[
              { action: 'View Dashboard', count: 45832, change: 8.3 },
              { action: 'Generate Report', count: 23491, change: 12.7 },
              { action: 'Export Data', count: 18234, change: -3.2 },
              { action: 'Create Alert', count: 12567, change: 15.4 },
              { action: 'Share Link', count: 9821, change: 5.6 },
            ].map((item, index) => (
              <Row key={index} justifyContent="space-between" alignItems="center">
                <Text weight="medium">{item.action}</Text>
                <Row gap="4" alignItems="center">
                  <Text>{formatNumber(item.count)} actions</Text>
                  <Text
                    color={item.change >= 0 ? 'green' : 'red'}
                    weight="medium"
                    style={{ minWidth: '60px', textAlign: 'right' }}
                  >
                    {item.change >= 0 ? '+' : ''}
                    {item.change.toFixed(1)}%
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
