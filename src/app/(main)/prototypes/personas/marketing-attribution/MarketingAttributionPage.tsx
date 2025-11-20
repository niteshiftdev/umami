'use client';
import { useMemo } from 'react';
import { PageBody } from '@/components/common/PageBody';
import { Column, Grid, Row, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { formatNumber, formatLongNumber, formatLongCurrency } from '@/lib/format';
import { colord } from 'colord';

// Mock data for Marketing Attribution
const generateChannelData = () => {
  const channels = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct', 'Referral'];
  const values = [4250, 3800, 2950, 2100, 1800, 1400];

  return {
    labels: channels,
    datasets: [
      {
        label: 'Conversions',
        data: values,
        backgroundColor: CHART_COLORS.slice(0, 6).map(c => colord(c).alpha(0.6).toRgbString()),
        borderColor: CHART_COLORS.slice(0, 6),
        borderWidth: 2,
      },
    ],
  };
};

const generateCampaignROIData = () => {
  const campaigns = ['Summer Sale 2025', 'Product Launch', 'Black Friday', 'Brand Awareness', 'Retargeting'];
  return {
    labels: campaigns,
    datasets: [
      {
        label: 'Spend',
        data: [15000, 25000, 45000, 12000, 8000],
        backgroundColor: colord(CHART_COLORS[3]).alpha(0.5).toRgbString(),
        borderColor: CHART_COLORS[3],
        borderWidth: 2,
      },
      {
        label: 'Revenue',
        data: [52000, 95000, 185000, 28000, 32000],
        backgroundColor: colord(CHART_COLORS[2]).alpha(0.5).toRgbString(),
        borderColor: CHART_COLORS[2],
        borderWidth: 2,
      },
    ],
  };
};

const generateTrafficSourcesData = () => {
  return {
    labels: ['Organic Search', 'Paid Ads', 'Social', 'Email', 'Direct', 'Other'],
    datasets: [
      {
        data: [38, 24, 16, 12, 8, 2],
        backgroundColor: CHART_COLORS.slice(0, 6).map(c => colord(c).alpha(0.7).toRgbString()),
        borderColor: CHART_COLORS.slice(0, 6),
        borderWidth: 2,
      },
    ],
  };
};

const generateWeeklyTrendsData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return {
    labels: weeks,
    datasets: [
      {
        label: 'Clicks',
        data: weeks.map(() => 15000 + Math.floor(Math.random() * 5000)),
        backgroundColor: colord(CHART_COLORS[0]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[0]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Conversions',
        data: weeks.map(() => 800 + Math.floor(Math.random() * 300)),
        backgroundColor: colord(CHART_COLORS[2]).alpha(0.4).toRgbString(),
        borderColor: colord(CHART_COLORS[2]).alpha(0.8).toRgbString(),
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };
};

const generateUTMPerformanceData = () => {
  return {
    labels: ['utm_campaign=summer', 'utm_campaign=launch', 'utm_source=google', 'utm_source=facebook', 'utm_medium=cpc'],
    datasets: [
      {
        label: 'Conversions',
        data: [1250, 980, 2150, 890, 1650],
        backgroundColor: colord(CHART_COLORS[1]).alpha(0.5).toRgbString(),
        borderColor: CHART_COLORS[1],
        borderWidth: 2,
      },
    ],
  };
};

export function MarketingAttributionPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const channelData = useMemo(() => generateChannelData(), []);
  const campaignROIData = useMemo(() => generateCampaignROIData(), []);
  const trafficSourcesData = useMemo(() => generateTrafficSourcesData(), []);
  const weeklyTrendsData = useMemo(() => generateWeeklyTrendsData(), []);
  const utmData = useMemo(() => generateUTMPerformanceData(), []);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader
          title="Marketing Attribution Dashboard"
          description="Track campaign performance, traffic sources, and marketing ROI"
        />

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            value={16300}
            previousValue={14200}
            change={2100}
            label="Total Conversions"
            formatValue={formatNumber}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={392000}
            previousValue={348000}
            change={44000}
            label="Marketing Revenue"
            formatValue={(n) => formatLongCurrency(n, 'USD')}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={3.73}
            previousValue={3.21}
            change={0.52}
            label="Average ROI"
            formatValue={(n) => `${n.toFixed(2)}x`}
            showLabel={true}
            showChange={true}
          />
          <MetricCard
            value={24.05}
            previousValue={24.51}
            change={-0.46}
            label="Cost Per Conversion"
            formatValue={(n) => `$${n.toFixed(2)}`}
            showLabel={true}
            showChange={true}
            reverseColors={true}
          />
          <MetricCard
            value={5.8}
            previousValue={5.3}
            change={0.5}
            label="Conversion Rate %"
            formatValue={(n) => `${n.toFixed(1)}%`}
            showLabel={true}
            showChange={true}
          />
        </MetricsBar>

        {/* Channel Performance */}
        <Panel title="Channel Performance (Conversions)" allowFullscreen={true}>
          <div style={{ height: '320px', padding: '20px' }}>
            <Chart
              type="bar"
              chartData={channelData}
              chartOptions={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value: number) => formatLongNumber(value),
                      color: colors.chart.text,
                    },
                    grid: {
                      color: colors.chart.line,
                    },
                    border: {
                      color: colors.chart.line,
                    },
                  },
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
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </Panel>

        {/* Two column layout */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
          {/* Campaign ROI Comparison */}
          <Panel title="Campaign ROI Analysis" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={campaignROIData}
                chartOptions={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongCurrency(value, 'USD'),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
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
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top' as const,
                      labels: {
                        color: colors.chart.text,
                      },
                    },
                  },
                }}
              />
            </div>
          </Panel>

          {/* Traffic Sources Breakdown */}
          <Panel title="Traffic Sources Distribution" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ maxWidth: '280px', maxHeight: '280px' }}>
                <PieChart chartData={trafficSourcesData} type="doughnut" />
              </div>
            </div>
          </Panel>
        </Grid>

        {/* Weekly Trends & UTM Performance */}
        <Grid columns={{ xs: '1fr', lg: '3fr 2fr' }} gap="6">
          {/* Weekly Trends */}
          <Panel title="Weekly Performance Trends" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="line"
                chartData={weeklyTrendsData}
                chartOptions={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongNumber(value),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
                      },
                    },
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
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top' as const,
                      labels: {
                        color: colors.chart.text,
                      },
                    },
                  },
                }}
              />
            </div>
          </Panel>

          {/* UTM Performance */}
          <Panel title="Top UTM Parameters" allowFullscreen={true}>
            <div style={{ height: '300px', padding: '20px' }}>
              <Chart
                type="bar"
                chartData={utmData}
                chartOptions={{
                  indexAxis: 'y' as const,
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value: number) => formatLongNumber(value),
                        color: colors.chart.text,
                      },
                      grid: {
                        color: colors.chart.line,
                      },
                      border: {
                        color: colors.chart.line,
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
                        font: {
                          size: 10,
                        },
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </Panel>
        </Grid>

        {/* Attribution Models Comparison */}
        <Panel title="Attribution Model Comparison">
          <Column padding="6" gap="4">
            <Row gap="6" wrap="wrap">
              <Column gap="2" style={{ flex: '1 1 180px' }}>
                <Text size="1" color="muted">First Touch</Text>
                <Text weight="bold" size="5">$186,400</Text>
                <Text size="1" color="muted">38% of revenue</Text>
              </Column>
              <Column gap="2" style={{ flex: '1 1 180px' }}>
                <Text size="1" color="muted">Last Touch</Text>
                <Text weight="bold" size="5">$156,800</Text>
                <Text size="1" color="muted">32% of revenue</Text>
              </Column>
              <Column gap="2" style={{ flex: '1 1 180px' }}>
                <Text size="1" color="muted">Linear</Text>
                <Text weight="bold" size="5">$147,200</Text>
                <Text size="1" color="muted">30% of revenue</Text>
              </Column>
              <Column gap="2" style={{ flex: '1 1 180px' }}>
                <Text size="1" color="muted">Time Decay</Text>
                <Text weight="bold" size="5">$164,800</Text>
                <Text size="1" color="muted">34% of revenue</Text>
              </Column>
            </Row>
          </Column>
        </Panel>

        {/* Campaign Insights */}
        <Panel title="Key Campaign Insights">
          <Column padding="6" gap="3">
            <Row gap="3">
              <Text weight="bold" style={{ minWidth: '140px' }}>Best Performer:</Text>
              <Text>Black Friday campaign - 4.1x ROI ($185K revenue on $45K spend)</Text>
            </Row>
            <Row gap="3">
              <Text weight="bold" style={{ minWidth: '140px' }}>Top Channel:</Text>
              <Text>Organic Search drives 38% of traffic with 6.2% conversion rate</Text>
            </Row>
            <Row gap="3">
              <Text weight="bold" style={{ minWidth: '140px' }}>Opportunity:</Text>
              <Text>Social Media shows high engagement but lower conversion - optimize landing pages</Text>
            </Row>
            <Row gap="3">
              <Text weight="bold" style={{ minWidth: '140px' }}>Cost Efficiency:</Text>
              <Text>Retargeting campaigns have lowest CPA at $9.60 per conversion</Text>
            </Row>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
