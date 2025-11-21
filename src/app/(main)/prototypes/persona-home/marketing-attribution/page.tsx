'use client';
import { Column, Grid, Heading, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useMemo } from 'react';
import { format } from 'date-fns';

// Mock data generator for realistic marketing attribution metrics
function generateMockData() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 30);

  // Generate daily traffic by channel for the last 30 days
  const channels = ['Organic Search', 'Paid Search', 'Social Media', 'Email', 'Direct'];
  const dailyTraffic = channels.map(channel => {
    const data = [];
    const baseTraffic = {
      'Organic Search': 3000,
      'Paid Search': 2000,
      'Social Media': 1500,
      'Email': 1000,
      'Direct': 800,
    }[channel];

    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        x: format(date, 'yyyy-MM-dd'),
        y: Math.floor(baseTraffic + Math.random() * 500 - 250),
      });
    }

    return {
      label: channel,
      data,
      borderColor: ['#2680eb', '#e68619', '#9256d9', '#44b556', '#e34850'][channels.indexOf(channel)],
      backgroundColor: ['#2680eb', '#e68619', '#9256d9', '#44b556', '#e34850'][channels.indexOf(channel)],
    };
  });

  // Campaign performance data
  const campaigns = [
    { name: 'Q4 Holiday Sale', spend: 45000, conversions: 1234, revenue: 189000 },
    { name: 'Product Launch 2024', spend: 38000, conversions: 987, revenue: 156000 },
    { name: 'Brand Awareness', spend: 28000, conversions: 543, revenue: 87000 },
    { name: 'Retargeting', spend: 22000, conversions: 876, revenue: 134000 },
    { name: 'Content Marketing', spend: 15000, conversions: 456, revenue: 72000 },
  ];

  // Channel attribution (first-touch)
  const channelAttribution = [
    { name: 'Organic Search', value: 3845 },
    { name: 'Paid Search', value: 2134 },
    { name: 'Social Media', value: 1876 },
    { name: 'Email', value: 1234 },
    { name: 'Direct', value: 987 },
    { name: 'Referral', value: 654 },
  ];

  // Conversion funnel data
  const funnelData = [];
  const funnelStages = [
    { stage: 'Impressions', count: 1250000 },
    { stage: 'Clicks', count: 87500 },
    { stage: 'Landing Page Views', count: 78300 },
    { stage: 'Sign-ups', count: 12450 },
    { stage: 'Qualified Leads', count: 5870 },
    { stage: 'Conversions', count: 2340 },
  ];

  for (let i = 0; i < funnelStages.length; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (funnelStages.length - i - 1));
    funnelData.push({
      x: format(date, 'yyyy-MM-dd'),
      y: funnelStages[i].count,
    });
  }

  // Monthly spend and revenue trend
  const monthlyPerformance = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const spend = 120000 + Math.random() * 40000;
    const revenue = spend * (3.2 + Math.random() * 0.8); // 3-4x ROAS
    monthlyPerformance.push({
      month: date,
      spend: Math.floor(spend),
      revenue: Math.floor(revenue),
    });
  }

  return {
    dailyTraffic,
    campaigns,
    channelAttribution,
    funnelData,
    monthlyPerformance,
    metrics: {
      totalConversions: 5096,
      prevTotalConversions: 4723,
      costPerAcquisition: 87.5,
      prevCostPerAcquisition: 92.3,
      returnOnAdSpend: 3.65,
      prevReturnOnAdSpend: 3.42,
      conversionRate: 2.98,
      prevConversionRate: 2.76,
      totalSpend: 148000,
      prevTotalSpend: 142000,
      totalRevenue: 540300,
      prevTotalRevenue: 485660,
    },
  };
}

export default function MarketingAttributionPage() {
  const mockData = useMemo(() => generateMockData(), []);

  // Prepare stacked chart data for channel traffic
  const channelTrafficData = {
    datasets: mockData.dailyTraffic,
  };

  // Prepare pie chart for channel attribution
  const attributionChartData = {
    labels: mockData.channelAttribution.map(c => c.name),
    datasets: [
      {
        data: mockData.channelAttribution.map(c => c.value),
        backgroundColor: ['#2680eb', '#e68619', '#9256d9', '#44b556', '#e34850', '#01bad7'],
      },
    ],
  };

  // Prepare funnel visualization (using bar chart)
  const funnelChartData = {
    datasets: [
      {
        label: 'Funnel Stage',
        data: mockData.funnelData,
        borderColor: '#44b556',
        backgroundColor: '#44b556',
      },
    ],
  };

  // Prepare monthly spend vs revenue
  const monthlyData = mockData.monthlyPerformance.map(m => ({
    x: format(m.month, 'yyyy-MM'),
    y: m.revenue,
  }));

  const monthlySpendData = mockData.monthlyPerformance.map(m => ({
    x: format(m.month, 'yyyy-MM'),
    y: m.spend,
  }));

  const spendRevenueChartData = {
    datasets: [
      {
        label: 'Revenue',
        data: monthlyData,
        borderColor: '#44b556',
        backgroundColor: '#44b556',
      },
      {
        label: 'Ad Spend',
        data: monthlySpendData,
        borderColor: '#e68619',
        backgroundColor: '#e68619',
      },
    ],
  };

  const formatCurrency = (value: number) => `$${Math.floor(value).toLocaleString()}`;
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;
  const formatROAS = (value: number) => `${value.toFixed(2)}x`;

  return (
    <PageBody>
      <Column gap="3" margin="2">
        <PageHeader title="Marketing Attribution Dashboard">
          <Text size="2" style={{ color: '#838383' }}>
            Track inbound sources and campaign performance
          </Text>
        </PageHeader>

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            label="Total Conversions"
            value={mockData.metrics.totalConversions}
            change={mockData.metrics.totalConversions - mockData.metrics.prevTotalConversions}
            showChange
          />
          <MetricCard
            label="Cost Per Acquisition"
            value={mockData.metrics.costPerAcquisition}
            change={mockData.metrics.costPerAcquisition - mockData.metrics.prevCostPerAcquisition}
            formatValue={formatCurrency}
            showChange
            reverseColors
          />
          <MetricCard
            label="Return on Ad Spend"
            value={mockData.metrics.returnOnAdSpend}
            change={mockData.metrics.returnOnAdSpend - mockData.metrics.prevReturnOnAdSpend}
            formatValue={formatROAS}
            showChange
          />
          <MetricCard
            label="Conversion Rate"
            value={mockData.metrics.conversionRate}
            change={mockData.metrics.conversionRate - mockData.metrics.prevConversionRate}
            formatValue={formatPercent}
            showChange
          />
          <MetricCard
            label="Total Ad Spend"
            value={mockData.metrics.totalSpend}
            change={mockData.metrics.totalSpend - mockData.metrics.prevTotalSpend}
            formatValue={formatCurrency}
            showChange
            reverseColors
          />
          <MetricCard
            label="Total Revenue"
            value={mockData.metrics.totalRevenue}
            change={mockData.metrics.totalRevenue - mockData.metrics.prevTotalRevenue}
            formatValue={formatCurrency}
            showChange
          />
        </MetricsBar>

        {/* Traffic and Attribution */}
        <GridRow layout="two">
          <Panel title="Traffic by Channel (30 Days)" allowFullscreen>
            <BarChart chartData={channelTrafficData} height={300} unit="day" stacked />
          </Panel>
          <Panel title="First-Touch Attribution" allowFullscreen>
            <PieChart chartData={attributionChartData} height={300} type="doughnut" />
          </Panel>
        </GridRow>

        {/* Conversion Funnel and Performance */}
        <GridRow layout="two">
          <Panel title="Conversion Funnel" allowFullscreen>
            <BarChart chartData={funnelChartData} height={300} unit="day" />
          </Panel>
          <Panel title="Spend vs Revenue (12 Months)" allowFullscreen>
            <BarChart chartData={spendRevenueChartData} height={300} unit="month" />
          </Panel>
        </GridRow>

        {/* Campaign Performance Table */}
        <Panel title="Top Campaigns Performance">
          <Grid
            columns="2fr 1fr 1fr 1fr 1fr"
            gap="2"
            paddingY="2"
            style={{ borderBottom: '1px solid #d9d9d9' }}
          >
            <Text weight="bold">Campaign</Text>
            <Text weight="bold">Spend</Text>
            <Text weight="bold">Conversions</Text>
            <Text weight="bold">Revenue</Text>
            <Text weight="bold">ROAS</Text>
          </Grid>
          {mockData.campaigns.map((campaign, idx) => (
            <Grid
              key={idx}
              columns="2fr 1fr 1fr 1fr 1fr"
              gap="2"
              paddingY="2"
              style={{ borderBottom: '1px solid #e9e9e9' }}
            >
              <Text>{campaign.name}</Text>
              <Text>{formatCurrency(campaign.spend)}</Text>
              <Text>{campaign.conversions.toLocaleString()}</Text>
              <Text>{formatCurrency(campaign.revenue)}</Text>
              <Text style={{ color: '#44b556' }}>
                {(campaign.revenue / campaign.spend).toFixed(2)}x
              </Text>
            </Grid>
          ))}
        </Panel>
      </Column>
    </PageBody>
  );
}
