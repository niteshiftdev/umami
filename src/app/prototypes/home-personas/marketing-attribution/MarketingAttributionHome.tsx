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
import { startOfDay, subDays, format } from 'date-fns';

export function MarketingAttributionHome() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate realistic time-series data
  const generateTimeSeriesData = (days: number, baseValue: number, variance: number) => {
    const data = [];
    const now = startOfDay(new Date());

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const randomVariance = (Math.random() - 0.5) * variance;
      const weekendFactor = [0, 6].includes(date.getDay()) ? 0.7 : 1;
      const value = Math.max(0, Math.round((baseValue + randomVariance) * weekendFactor));

      data.push({
        x: format(date, 'yyyy-MM-dd'),
        y: value,
      });
    }

    return data;
  };

  // Campaign Performance Metrics
  const totalLeads = 8459;
  const previousLeads = 7234;
  const leadsChange = totalLeads - previousLeads;

  const conversionRate = 3.8;
  const previousConversionRate = 3.2;
  const conversionChange = conversionRate - previousConversionRate;

  const costPerLead = 24.5;
  const previousCostPerLead = 28.2;
  const cplChange = costPerLead - previousCostPerLead;

  const roas = 4.2;
  const previousRoas = 3.7;
  const roasChange = roas - previousRoas;

  // Traffic by Source (Last 30 Days)
  const trafficBySourceData = generateTimeSeriesData(30, 12000, 3000);
  const organicTraffic = trafficBySourceData.map((d) => ({
    x: d.x,
    y: Math.round(d.y * 0.42),
  }));
  const paidTraffic = trafficBySourceData.map((d) => ({
    x: d.x,
    y: Math.round(d.y * 0.28),
  }));
  const socialTraffic = trafficBySourceData.map((d) => ({
    x: d.x,
    y: Math.round(d.y * 0.18),
  }));
  const referralTraffic = trafficBySourceData.map((d) => ({
    x: d.x,
    y: Math.round(d.y * 0.12),
  }));

  // Traffic Sources Chart
  const trafficSourcesChartData = useMemo(() => {
    return {
      datasets: [
        {
          type: 'bar',
          label: 'Organic',
          data: organicTraffic,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 1,
          stack: 'stack',
        },
        {
          type: 'bar',
          label: 'Paid Ads',
          data: paidTraffic,
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 1,
          stack: 'stack',
        },
        {
          type: 'bar',
          label: 'Social',
          data: socialTraffic,
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
          stack: 'stack',
        },
        {
          type: 'bar',
          label: 'Referral',
          data: referralTraffic,
          backgroundColor: CHART_COLORS[3],
          borderColor: CHART_COLORS[3],
          borderWidth: 1,
          stack: 'stack',
        },
      ],
    };
  }, []);

  // Channel Attribution Data
  const channelAttributionData = useMemo(() => {
    return {
      labels: ['Organic Search', 'Google Ads', 'Facebook', 'LinkedIn', 'Email', 'Referral'],
      datasets: [
        {
          label: 'Conversions',
          data: [3250, 2100, 1580, 890, 420, 219],
          backgroundColor: [
            CHART_COLORS[2],
            CHART_COLORS[0],
            CHART_COLORS[1],
            CHART_COLORS[4],
            CHART_COLORS[5],
            CHART_COLORS[3],
          ],
        },
      ],
    };
  }, []);

  // Campaign Performance by Platform
  const campaignPerformanceData = useMemo(() => {
    return {
      labels: ['Google Ads', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok'],
      datasets: [
        {
          label: 'Conversions',
          data: [2100, 1580, 890, 324, 275],
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 1,
        },
        {
          label: 'Leads',
          data: [5850, 4200, 2350, 980, 850],
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
        },
      ],
    };
  }, []);

  // UTM Campaign Performance
  const utmCampaignData = useMemo(() => {
    return {
      labels: [
        'spring_sale_2024',
        'product_launch_q1',
        'webinar_series',
        'retargeting_jan',
        'brand_awareness',
      ],
      datasets: [
        {
          label: 'Spend',
          data: [45000, 38000, 22000, 18000, 15000],
          backgroundColor: CHART_COLORS[4],
          borderColor: CHART_COLORS[4],
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Revenue',
          data: [198000, 152000, 88000, 64800, 52500],
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 1,
          yAxisID: 'y1',
        },
      ],
    };
  }, []);

  // Cost per Channel
  const costPerChannelData = useMemo(() => {
    return {
      labels: ['Google Ads', 'Facebook', 'LinkedIn', 'Twitter', 'Email'],
      datasets: [
        {
          label: 'Cost per Lead ($)',
          data: [28.5, 21.2, 42.8, 18.7, 8.3],
          backgroundColor: CHART_COLORS[3],
        },
      ],
    };
  }, []);

  const stackedChartOptions = useMemo(() => {
    return {
      scales: {
        x: {
          type: 'timeseries',
          stacked: true,
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
          stacked: true,
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

  const dualAxisChartOptions = useMemo(() => {
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
            callback: (value: number) => '$' + formatLongNumber(value),
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
            callback: (value: number) => '$' + formatLongNumber(value),
          },
        },
      },
    };
  }, [colors]);

  return (
    <PageBody>
      <Column margin="2" gap="4">
        <PageHeader title="Marketing Attribution">
          <Text>Track campaign performance, attribution, and ROI across all channels</Text>
        </PageHeader>

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            value={totalLeads}
            change={leadsChange}
            label="Total Leads"
            formatValue={formatLongNumber}
            showChange={true}
          />
          <MetricCard
            value={conversionRate}
            change={conversionChange}
            label="Conversion Rate"
            formatValue={(n) => `${n.toFixed(1)}%`}
            showChange={true}
          />
          <MetricCard
            value={costPerLead}
            change={cplChange}
            label="Cost per Lead"
            formatValue={(n) => `$${n.toFixed(2)}`}
            showChange={true}
            reverseColors={true}
          />
          <MetricCard
            value={roas}
            change={roasChange}
            label="ROAS"
            formatValue={(n) => `${n.toFixed(1)}x`}
            showChange={true}
          />
        </MetricsBar>

        {/* Traffic Sources Stacked Chart */}
        <Panel title="Traffic by Source (Last 30 Days)" allowFullscreen>
          <Chart
            type="bar"
            chartData={trafficSourcesChartData}
            chartOptions={stackedChartOptions}
            height="400px"
          />
        </Panel>

        {/* Two Column Layout */}
        <GridRow layout="two" minHeight="450px">
          <Panel title="Channel Attribution (Conversions)">
            <Chart
              type="doughnut"
              chartData={channelAttributionData}
              chartOptions={{}}
              height="380px"
            />
          </Panel>
          <Panel title="Campaign Performance by Platform">
            <Chart
              type="bar"
              chartData={campaignPerformanceData}
              chartOptions={barChartOptions}
              height="380px"
            />
          </Panel>
        </GridRow>

        {/* Campaign ROI and Cost Analysis */}
        <GridRow layout="two" minHeight="450px">
          <Panel title="Top Campaigns (Spend vs Revenue)">
            <Chart
              type="bar"
              chartData={utmCampaignData}
              chartOptions={dualAxisChartOptions}
              height="380px"
            />
          </Panel>
          <Panel title="Cost per Lead by Channel">
            <Chart
              type="bar"
              chartData={costPerChannelData}
              chartOptions={barChartOptions}
              height="380px"
            />
          </Panel>
        </GridRow>

        {/* Attribution Insights */}
        <Panel title="Key Insights">
          <Column gap="3" padding="4">
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">
                ↑
              </Text>
              <Text>
                <Text weight="bold">Google Ads generated $198k revenue</Text> from the spring_sale_2024
                campaign with a 4.4x ROAS - the best performing campaign this quarter.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" color="primary">
                ↑
              </Text>
              <Text>
                <Text weight="bold">Organic search drives 42% of all traffic</Text> and has the highest
                conversion rate at 4.2%, demonstrating strong SEO performance.
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="7" weight="bold" style={{ color: '#e68619' }}>
                →
              </Text>
              <Text>
                <Text weight="bold">LinkedIn CPL is 2x higher than other channels</Text> at $42.80 -
                consider reallocating budget to Facebook ($21.20) or Google Ads ($28.50).
              </Text>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
