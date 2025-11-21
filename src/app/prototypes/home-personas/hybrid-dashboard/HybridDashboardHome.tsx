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
import { formatLongNumber, formatNumber } from '@/lib/format';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { renderNumberLabels } from '@/lib/charts';
import { startOfDay, subDays, startOfMonth, subMonths, format } from 'date-fns';

export function HybridDashboardHome() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate time-series data
  const generateDailyData = (days: number, baseValue: number, variance: number) => {
    const data = [];
    const now = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const randomVariance = (Math.random() - 0.5) * variance;
      const trend = (days - i) * (variance / days) * 0.2;
      const value = Math.max(0, Math.round(baseValue + randomVariance + trend));

      data.push({
        x: format(date, 'yyyy-MM-dd'),
        y: value,
      });
    }

    return data;
  };

  const generateMonthlyData = (months: number, baseValue: number, variance: number) => {
    const data = [];
    const now = startOfMonth(new Date());

    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(now, i);
      const randomVariance = (Math.random() - 0.5) * variance;
      const trend = (months - i) * 15000;
      const value = Math.max(0, Math.round(baseValue + randomVariance + trend));

      data.push({
        x: format(date, 'yyyy-MM'),
        y: value,
      });
    }

    return data;
  };

  // Product Metrics
  const activeUsersData = generateDailyData(30, 12500, 3000);
  const currentActiveUsers = activeUsersData[activeUsersData.length - 1].y;
  const previousActiveUsers = activeUsersData[activeUsersData.length - 8].y;
  const activeUsersChange = currentActiveUsers - previousActiveUsers;

  // Marketing Metrics
  const leadsData = generateDailyData(30, 280, 70);
  const totalLeads = leadsData.reduce((sum, d) => sum + d.y, 0);
  const previousLeads = leadsData.slice(0, 23).reduce((sum, d) => sum + d.y, 0);
  const leadsChange = totalLeads - previousLeads;

  // Revenue Metrics
  const revenueData = generateMonthlyData(12, 750000, 100000);
  const currentRevenue = revenueData[revenueData.length - 1].y;
  const previousRevenue = revenueData[revenueData.length - 2].y;
  const revenueChange = currentRevenue - previousRevenue;

  // Engagement Metrics
  const conversionRate = 3.6;
  const previousConversionRate = 3.1;
  const conversionChange = conversionRate - previousConversionRate;

  // Combined Growth Chart - Shows Product + Marketing + Revenue
  const combinedGrowthData = useMemo(() => {
    // Normalize all metrics to percentage of max for comparison
    const normalizedUsers = activeUsersData.map((d) => ({
      x: d.x,
      y: (d.y / Math.max(...activeUsersData.map((p) => p.y))) * 100,
    }));

    const normalizedLeads = leadsData.map((d) => ({
      x: d.x,
      y: (d.y / Math.max(...leadsData.map((p) => p.y))) * 100,
    }));

    return {
      datasets: [
        {
          type: 'line',
          label: 'User Growth',
          data: normalizedUsers,
          borderColor: CHART_COLORS[0],
          backgroundColor: CHART_COLORS[0] + '20',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
        {
          type: 'line',
          label: 'Lead Generation',
          data: normalizedLeads,
          borderColor: CHART_COLORS[1],
          backgroundColor: CHART_COLORS[1] + '20',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, []);

  // Revenue Breakdown by Source
  const revenueBySourceData = useMemo(() => {
    const lastSixMonths = revenueData.slice(-6);

    return {
      labels: lastSixMonths.map((d) => d.x),
      datasets: [
        {
          type: 'bar',
          label: 'New Revenue',
          data: lastSixMonths.map((d) => Math.round(d.y * 0.35)),
          backgroundColor: CHART_COLORS[2],
          stack: 'stack',
        },
        {
          type: 'bar',
          label: 'Expansion',
          data: lastSixMonths.map((d) => Math.round(d.y * 0.45)),
          backgroundColor: CHART_COLORS[0],
          stack: 'stack',
        },
        {
          type: 'bar',
          label: 'Renewals',
          data: lastSixMonths.map((d) => Math.round(d.y * 0.20)),
          backgroundColor: CHART_COLORS[1],
          stack: 'stack',
        },
      ],
    };
  }, []);

  // Marketing Channel Performance
  const channelPerformanceData = useMemo(() => {
    return {
      labels: ['Organic', 'Paid Ads', 'Social', 'Email', 'Referral'],
      datasets: [
        {
          label: 'Traffic',
          data: [42500, 28300, 18200, 12400, 8600],
          backgroundColor: CHART_COLORS[0],
          yAxisID: 'y',
        },
        {
          label: 'Conversions',
          data: [1785, 1245, 620, 385, 295],
          backgroundColor: CHART_COLORS[2],
          yAxisID: 'y1',
        },
      ],
    };
  }, []);

  // Product Feature Usage
  const featureUsageData = useMemo(() => {
    return {
      labels: ['Dashboard', 'Reports', 'Analytics', 'Integrations', 'API Access', 'Exports'],
      datasets: [
        {
          label: 'Usage %',
          data: [94, 78, 65, 52, 38, 45],
          backgroundColor: CHART_COLORS[1],
        },
      ],
    };
  }, []);

  // Customer Acquisition Funnel
  const acquisitionFunnelData = useMemo(() => {
    return {
      labels: ['Visitors', 'Leads', 'MQLs', 'SQLs', 'Customers'],
      datasets: [
        {
          label: 'Count',
          data: [110000, 8459, 4250, 2890, 1045],
          backgroundColor: [
            CHART_COLORS[0],
            CHART_COLORS[0] + 'CC',
            CHART_COLORS[0] + '99',
            CHART_COLORS[0] + '66',
            CHART_COLORS[2],
          ],
        },
      ],
    };
  }, []);

  // Sales Pipeline Health
  const pipelineHealthData = useMemo(() => {
    return {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          type: 'bar',
          label: 'Pipeline',
          data: [8500000, 9200000, 10100000, 11500000],
          backgroundColor: CHART_COLORS[3],
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Closed Won',
          data: [2850000, 3100000, 3450000, 3900000],
          borderColor: CHART_COLORS[2],
          backgroundColor: 'transparent',
          borderWidth: 2,
          yAxisID: 'y',
        },
      ],
    };
  }, []);

  const normalizedChartOptions = useMemo(() => {
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
            callback: (value: number) => value + '%',
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

  const dualAxisOptions = useMemo(() => {
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
          type: 'linear',
          position: 'left' as const,
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
        y1: {
          type: 'linear',
          position: 'right' as const,
          grid: {
            display: false,
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
            callback: renderNumberLabels,
          },
        },
      },
    };
  }, [colors]);

  const horizontalBarOptions = useMemo(() => {
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

  const pipelineOptions = useMemo(() => {
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

  return (
    <PageBody>
      <Column margin="2" gap="4">
        <PageHeader title="Executive Dashboard">
          <Text>Unified view of product, marketing, and revenue performance</Text>
        </PageHeader>

        {/* Key Metrics - Cross-functional */}
        <MetricsBar>
          <MetricCard
            value={currentActiveUsers}
            change={activeUsersChange}
            label="Daily Active Users"
            formatValue={formatLongNumber}
            showChange={true}
          />
          <MetricCard
            value={totalLeads}
            change={leadsChange}
            label="Monthly Leads"
            formatValue={formatLongNumber}
            showChange={true}
          />
          <MetricCard
            value={currentRevenue}
            change={revenueChange}
            label="Monthly Revenue"
            formatValue={(n) => '$' + formatLongNumber(n)}
            showChange={true}
          />
          <MetricCard
            value={conversionRate}
            change={conversionChange}
            label="Conversion Rate"
            formatValue={(n) => `${n.toFixed(1)}%`}
            showChange={true}
          />
        </MetricsBar>

        {/* Growth Trends - Normalized */}
        <Panel title="Growth Trends (Normalized %)" allowFullscreen>
          <Chart
            type="line"
            chartData={combinedGrowthData}
            chartOptions={normalizedChartOptions}
            height="400px"
          />
        </Panel>

        {/* Two Column - Revenue & Marketing */}
        <GridRow layout="two" minHeight="450px">
          <Panel title="Revenue by Type (Last 6 Months)">
            <Chart
              type="bar"
              chartData={revenueBySourceData}
              chartOptions={stackedBarOptions}
              height="380px"
            />
          </Panel>
          <Panel title="Marketing Channel Performance">
            <Chart
              type="bar"
              chartData={channelPerformanceData}
              chartOptions={dualAxisOptions}
              height="380px"
            />
          </Panel>
        </GridRow>

        {/* Three Column - Product, Funnel, Pipeline */}
        <Grid gap="3" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }}>
          <Panel title="Feature Adoption">
            <Chart
              type="bar"
              chartData={featureUsageData}
              chartOptions={horizontalBarOptions}
              height="320px"
            />
          </Panel>
          <Panel title="Acquisition Funnel">
            <Chart
              type="bar"
              chartData={acquisitionFunnelData}
              chartOptions={barChartOptions}
              height="320px"
            />
          </Panel>
          <Panel title="Quarterly Pipeline">
            <Chart
              type="bar"
              chartData={pipelineHealthData}
              chartOptions={pipelineOptions}
              height="320px"
            />
          </Panel>
        </Grid>

        {/* Cross-functional Insights */}
        <Panel title="Strategic Insights">
          <Column gap="3" padding="4">
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">
                ↑
              </Text>
              <Text>
                <Text weight="bold">Product engagement correlates with revenue growth</Text> - users
                adopting 4+ features have 3.2x higher LTV and 40% lower churn.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">
                ↑
              </Text>
              <Text>
                <Text weight="bold">Organic channel delivers highest quality leads</Text> - 4.2%
                conversion rate vs 3.1% paid average, suggesting strong product-market fit.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" style={{ color: '#e68619' }}>
                →
              </Text>
              <Text>
                <Text weight="bold">Q4 pipeline up 35% QoQ</Text> but conversion time increased to 45
                days - consider additional sales enablement to maintain velocity.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">
                ↑
              </Text>
              <Text>
                <Text weight="bold">Feature adoption at 78% for Reports module</Text> - highest this
                quarter. Strong indicator for upsell opportunities to enterprise tier.
              </Text>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
