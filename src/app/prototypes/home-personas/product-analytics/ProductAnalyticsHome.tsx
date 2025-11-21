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
import { BarChart } from '@/components/charts/BarChart';
import { formatLongNumber, formatNumber } from '@/lib/format';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { renderNumberLabels } from '@/lib/charts';
import { startOfDay, subDays, format } from 'date-fns';

export function ProductAnalyticsHome() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic time-series data for the last 30 days
  const generateTimeSeriesData = (days: number, baseValue: number, variance: number) => {
    const data = [];
    const now = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const randomVariance = (Math.random() - 0.5) * variance;
      const trend = (days - i) * (variance / days) * 0.3; // Slight upward trend
      const value = Math.max(0, Math.round(baseValue + randomVariance + trend));

      data.push({
        x: format(date, 'yyyy-MM-dd'),
        y: value,
      });
    }

    return data;
  };

  // User Engagement Metrics
  const activeUsersData = generateTimeSeriesData(30, 12500, 3000);
  const sessionDurationData = generateTimeSeriesData(30, 285, 60);
  const pageViewsData = generateTimeSeriesData(30, 45000, 10000);

  const currentActiveUsers = activeUsersData[activeUsersData.length - 1].y;
  const previousActiveUsers = activeUsersData[activeUsersData.length - 8].y;
  const activeUsersChange = currentActiveUsers - previousActiveUsers;

  const currentSessionDuration = sessionDurationData[sessionDurationData.length - 1].y;
  const previousSessionDuration = sessionDurationData[sessionDurationData.length - 8].y;
  const sessionDurationChange = currentSessionDuration - previousSessionDuration;

  const currentPageViews = pageViewsData[pageViewsData.length - 1].y;
  const previousPageViews = pageViewsData[pageViewsData.length - 8].y;
  const pageViewsChange = currentPageViews - previousPageViews;

  const bounceRate = 32.5;
  const previousBounceRate = 35.8;
  const bounceRateChange = bounceRate - previousBounceRate;

  // Engagement Chart Data
  const engagementChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Daily Active Users',
          data: activeUsersData,
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ],
    };
  }, []);

  // Feature Adoption Data
  const featureAdoptionData = useMemo(() => {
    return {
      labels: ['Dashboard', 'Reports', 'Filters', 'Exports', 'Integrations', 'Webhooks'],
      datasets: [
        {
          label: 'Weekly Active Users',
          data: [8750, 6200, 5100, 3800, 2400, 1500],
          backgroundColor: [
            CHART_COLORS[0],
            CHART_COLORS[1],
            CHART_COLORS[2],
            CHART_COLORS[3],
            CHART_COLORS[4],
            CHART_COLORS[5],
          ],
        },
      ],
    };
  }, []);

  // Retention Cohort Data
  const retentionChartData = useMemo(() => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'];

    return {
      labels: weeks,
      datasets: [
        {
          type: 'line',
          label: 'Jan Cohort',
          data: [100, 72, 65, 58, 54, 51],
          borderColor: CHART_COLORS[0],
          backgroundColor: CHART_COLORS[0] + '40',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
        {
          type: 'line',
          label: 'Feb Cohort',
          data: [100, 75, 68, 62, 59, 56],
          borderColor: CHART_COLORS[1],
          backgroundColor: CHART_COLORS[1] + '40',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
        {
          type: 'line',
          label: 'Mar Cohort',
          data: [100, 78, 71, 66, 63, 60],
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '40',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, []);

  // User Journey Funnel Data
  const funnelData = useMemo(() => {
    return {
      labels: ['Landing', 'Sign Up', 'Onboarding', 'First Action', 'Active User'],
      datasets: [
        {
          label: 'Users',
          data: [25000, 8500, 6800, 5100, 4250],
          backgroundColor: [
            CHART_COLORS[2],
            CHART_COLORS[2] + 'CC',
            CHART_COLORS[2] + '99',
            CHART_COLORS[2] + '66',
            CHART_COLORS[2] + '33',
          ],
        },
      ],
    };
  }, []);

  // Session Duration Chart
  const sessionDurationChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Avg Session Duration (seconds)',
          data: sessionDurationData,
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ],
    };
  }, []);

  const engagementChartOptions = useMemo(() => {
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
            callback: renderNumberLabels,
          },
        },
      },
    };
  }, [colors]);

  const retentionChartOptions = useMemo(() => {
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
      },
    };
  }, [colors]);

  const funnelChartOptions = useMemo(() => {
    return {
      indexAxis: 'y' as const,
      scales: {
        x: {
          grid: {
            color: colors.chart.line,
          },
          border: {
            color: colors.chart.line,
          },
          ticks: {
            color: colors.chart.text,
            callback: renderNumberLabels,
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

  const featureAdoptionOptions = useMemo(() => {
    return {
      plugins: {
        legend: {
          display: false,
        },
      },
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
            callback: renderNumberLabels,
          },
        },
      },
    };
  }, [colors]);

  return (
    <PageBody>
      <Column margin="2" gap="4">
        <PageHeader title="Product Analytics">
          <Text>Track user engagement, behavior patterns, and product adoption metrics</Text>
        </PageHeader>

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            value={currentActiveUsers}
            change={activeUsersChange}
            label="Daily Active Users"
            formatValue={formatLongNumber}
            showChange={true}
          />
          <MetricCard
            value={currentSessionDuration}
            change={sessionDurationChange}
            label="Avg Session (sec)"
            formatValue={formatNumber}
            showChange={true}
          />
          <MetricCard
            value={currentPageViews}
            change={pageViewsChange}
            label="Daily Page Views"
            formatValue={formatLongNumber}
            showChange={true}
          />
          <MetricCard
            value={bounceRate}
            change={bounceRateChange}
            label="Bounce Rate"
            formatValue={(n) => `${n.toFixed(1)}%`}
            showChange={true}
            reverseColors={true}
          />
        </MetricsBar>

        {/* Main Engagement Chart */}
        <Panel title="Daily Active Users (Last 30 Days)" allowFullscreen>
          <Chart
            type="bar"
            chartData={engagementChartData}
            chartOptions={engagementChartOptions}
            height="400px"
          />
        </Panel>

        {/* Two Column Layout */}
        <GridRow layout="two" minHeight="450px">
          <Panel title="Feature Adoption (Weekly Active Users)">
            <Chart
              type="bar"
              chartData={featureAdoptionData}
              chartOptions={featureAdoptionOptions}
              height="380px"
            />
          </Panel>
          <Panel title="User Journey Funnel (Last 30 Days)">
            <Chart
              type="bar"
              chartData={funnelData}
              chartOptions={funnelChartOptions}
              height="380px"
            />
          </Panel>
        </GridRow>

        {/* Retention Analysis */}
        <GridRow layout="two" minHeight="450px">
          <Panel title="Cohort Retention Analysis (%)">
            <Chart
              type="line"
              chartData={retentionChartData}
              chartOptions={retentionChartOptions}
              height="380px"
            />
          </Panel>
          <Panel title="Session Duration Trend">
            <Chart
              type="bar"
              chartData={sessionDurationChartData}
              chartOptions={engagementChartOptions}
              height="380px"
            />
          </Panel>
        </GridRow>

        {/* Engagement Insights */}
        <Panel title="Key Insights">
          <Column gap="3" padding="4">
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">↑</Text>
              <Text>
                <Text weight="bold">Daily active users increased by 15.2%</Text> compared to last week,
                driven by new feature releases and improved onboarding.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">↑</Text>
              <Text>
                <Text weight="bold">Retention improved by 8%</Text> for the March cohort, showing strong
                product-market fit with recent improvements.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" style={{ color: '#e68619' }}>→</Text>
              <Text>
                <Text weight="bold">Conversion from sign-up to first action is 60%</Text> - consider
                optimizing the onboarding experience to reduce drop-off.
              </Text>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
