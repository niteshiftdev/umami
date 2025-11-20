'use client';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { MetricCard } from '@/components/metrics/MetricCard';
import { Column, Row, Heading, Text, Grid, DataTable, DataColumn } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { useMemo } from 'react';
import { CHART_COLORS } from '@/lib/constants';

export function MarketingAttributionPage() {
  const { formatMessage, labels } = useMessages();

  // Mock data for marketing metrics
  const marketingMetrics = useMemo(
    () => ({
      totalVisitors: 127543,
      previousTotalVisitors: 118234,
      conversions: 8421,
      previousConversions: 7832,
      costPerAcquisition: 42.5,
      previousCostPerAcquisition: 46.2,
      roi: 324,
      previousRoi: 298,
    }),
    [],
  );

  // Mock data for traffic by source over 30 days
  const trafficBySourceData = useMemo(() => {
    const days = 30;
    const labels = [];
    const organicData = [];
    const paidData = [];
    const socialData = [];
    const referralData = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toISOString().split('T')[0]);

      // Generate realistic traffic data with trends
      const dayOfWeek = date.getDay();
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.8 : 1;

      organicData.push(Math.round((2500 + Math.random() * 800) * weekendFactor));
      paidData.push(Math.round((1800 + Math.random() * 600) * weekendFactor));
      socialData.push(Math.round((1200 + Math.random() * 400) * weekendFactor));
      referralData.push(Math.round((600 + Math.random() * 300) * weekendFactor));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Organic Search',
          data: organicData,
          borderColor: CHART_COLORS[0],
          backgroundColor: CHART_COLORS[0] + '40',
          stack: 'stack0',
        },
        {
          label: 'Paid Ads',
          data: paidData,
          borderColor: CHART_COLORS[1],
          backgroundColor: CHART_COLORS[1] + '40',
          stack: 'stack0',
        },
        {
          label: 'Social Media',
          data: socialData,
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '40',
          stack: 'stack0',
        },
        {
          label: 'Referrals',
          data: referralData,
          borderColor: CHART_COLORS[3],
          backgroundColor: CHART_COLORS[3] + '40',
          stack: 'stack0',
        },
      ],
    };
  }, []);

  // Mock data for channel performance
  const channelPerformanceData = useMemo(
    () => [
      {
        channel: 'Google Ads',
        visitors: 34521,
        conversions: 2876,
        conversionRate: 8.33,
        cost: 125430,
        revenue: 421650,
        roi: 236,
      },
      {
        channel: 'Facebook Ads',
        visitors: 28934,
        conversions: 1987,
        conversionRate: 6.87,
        cost: 89320,
        revenue: 298540,
        roi: 234,
      },
      {
        channel: 'LinkedIn Ads',
        visitors: 12543,
        conversions: 1234,
        conversionRate: 9.84,
        cost: 67890,
        revenue: 345670,
        roi: 409,
      },
      {
        channel: 'Organic Search',
        visitors: 45678,
        conversions: 2104,
        conversionRate: 4.61,
        cost: 0,
        revenue: 312450,
        roi: Infinity,
      },
      {
        channel: 'Social Organic',
        visitors: 5867,
        conversions: 220,
        conversionRate: 3.75,
        cost: 0,
        revenue: 31200,
        roi: Infinity,
      },
    ],
    [],
  );

  // Mock data for campaign performance by conversion
  const conversionByChannelData = useMemo(
    () => ({
      labels: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Organic Search', 'Email', 'Referral'],
      datasets: [
        {
          label: 'Conversions',
          data: [2876, 1987, 1234, 2104, 892, 328],
          backgroundColor: CHART_COLORS.slice(0, 6),
        },
      ],
    }),
    [],
  );

  // Mock data for monthly ad spend vs revenue
  const adSpendRevenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      labels: months,
      datasets: [
        {
          label: 'Ad Spend ($)',
          data: [78000, 82000, 79000, 91000, 88000, 95000],
          borderColor: CHART_COLORS[4],
          backgroundColor: CHART_COLORS[4] + '40',
          yAxisID: 'y',
        },
        {
          label: 'Revenue ($)',
          data: [245000, 267000, 289000, 312000, 334000, 378000],
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '40',
          yAxisID: 'y',
        },
      ],
    };
  }, []);

  // Mock data for landing page performance
  const landingPageData = useMemo(
    () => ({
      labels: [
        '/landing/product-demo',
        '/landing/free-trial',
        '/landing/webinar',
        '/landing/ebook',
        '/landing/pricing',
      ],
      datasets: [
        {
          label: 'Conversion Rate %',
          data: [12.4, 8.9, 15.2, 6.3, 9.7],
          backgroundColor: CHART_COLORS[5] + '80',
          borderColor: CHART_COLORS[5],
          borderWidth: 2,
        },
      ],
    }),
    [],
  );

  return (
    <PageBody>
      <Column gap="6" paddingY="6">
        <PageHeader title="Marketing Attribution Dashboard" />

        <Text size="md" style={{ color: 'var(--gray500)' }}>
          Track campaign performance, channel attribution, and marketing ROI across all touchpoints
        </Text>

        {/* Key Metrics Row */}
        <Grid columns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="4">
          <Panel>
            <MetricCard
              value={marketingMetrics.totalVisitors}
              previousValue={marketingMetrics.previousTotalVisitors}
              label="Total Visitors"
              formatValue={n => n.toLocaleString()}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={marketingMetrics.conversions}
              previousValue={marketingMetrics.previousConversions}
              label="Conversions"
              formatValue={n => n.toLocaleString()}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={marketingMetrics.costPerAcquisition}
              previousValue={marketingMetrics.previousCostPerAcquisition}
              label="Cost Per Acquisition"
              formatValue={n => `$${n.toFixed(2)}`}
              showLabel
              showChange
              reverseColors
            />
          </Panel>
          <Panel>
            <MetricCard
              value={marketingMetrics.roi}
              previousValue={marketingMetrics.previousRoi}
              label="ROI %"
              formatValue={n => `${n}%`}
              showLabel
              showChange
            />
          </Panel>
        </Grid>

        {/* Traffic by Source - Stacked Area */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Traffic by Source (Last 30 Days)</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Daily visitor breakdown across marketing channels
            </Text>
            <BarChart chartData={trafficBySourceData} height={320} stacked unit="visitors" />
          </Column>
        </Panel>

        {/* Two Column Layout for Charts */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">Conversions by Channel</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Distribution of conversions across marketing channels
              </Text>
              <PieChart chartData={conversionByChannelData} height={300} type="doughnut" />
            </Column>
          </Panel>

          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">Landing Page Conversion Rates</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Top performing landing pages by conversion rate
              </Text>
              <BarChart chartData={landingPageData} height={300} unit="%" />
            </Column>
          </Panel>
        </Grid>

        {/* Ad Spend vs Revenue Trend */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Ad Spend vs Revenue (Last 6 Months)</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Marketing investment compared to generated revenue
            </Text>
            <BarChart chartData={adSpendRevenueData} height={300} unit="$" />
          </Column>
        </Panel>

        {/* Channel Performance Table */}
        <Panel>
          <Column gap="3">
            <Heading size="md">Channel Performance Details</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Comprehensive view of marketing channel effectiveness
            </Text>
            <DataTable data={channelPerformanceData}>
              <DataColumn id="channel" label="Channel" />
              <DataColumn id="visitors" label="Visitors">
                {row => row.visitors.toLocaleString()}
              </DataColumn>
              <DataColumn id="conversions" label="Conversions">
                {row => row.conversions.toLocaleString()}
              </DataColumn>
              <DataColumn id="conversionRate" label="Conv. Rate">
                {row => `${row.conversionRate.toFixed(2)}%`}
              </DataColumn>
              <DataColumn id="cost" label="Cost">
                {row => (row.cost > 0 ? `$${row.cost.toLocaleString()}` : '-')}
              </DataColumn>
              <DataColumn id="revenue" label="Revenue">
                {row => `$${row.revenue.toLocaleString()}`}
              </DataColumn>
              <DataColumn id="roi" label="ROI">
                {row => (row.roi === Infinity ? 'Organic' : `${row.roi}%`)}
              </DataColumn>
            </DataTable>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
