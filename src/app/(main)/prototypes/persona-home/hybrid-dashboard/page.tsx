'use client';
import { Column, Grid, Heading, Text, Tabs, TabList, Tab, TabPanel } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { useMemo } from 'react';

// Mock data generator combining all persona metrics
function generateMockData() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 30);

  // Generate unified daily metrics for the last 30 days
  const dailyMetrics = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dailyMetrics.push({
      date: date.toISOString(),
      activeUsers: Math.floor(12000 + Math.random() * 3000 + Math.sin(i / 7) * 2000),
      conversions: Math.floor(150 + Math.random() * 50),
      revenue: Math.floor(25000 + Math.random() * 10000),
    });
  }

  // Generate monthly revenue breakdown
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    monthlyRevenue.push({
      x: date.toISOString(),
      y: Math.floor(2800000 + i * 200000 + Math.random() * 300000),
    });
  }

  // Channel performance with full funnel metrics
  const channelPerformance = [
    {
      name: 'Organic Search',
      users: 28450,
      conversions: 1234,
      revenue: 187000,
      engagement: 72.3,
    },
    {
      name: 'Paid Search',
      users: 19870,
      conversions: 987,
      revenue: 156000,
      engagement: 68.9,
    },
    {
      name: 'Social Media',
      users: 15230,
      conversions: 654,
      revenue: 98000,
      engagement: 58.4,
    },
    {
      name: 'Email',
      users: 12890,
      conversions: 876,
      revenue: 134000,
      engagement: 81.2,
    },
    {
      name: 'Direct',
      users: 9870,
      conversions: 456,
      revenue: 72000,
      engagement: 75.6,
    },
  ];

  // Customer journey stages
  const journeyStages = [
    { name: 'Awareness', value: 145000 },
    { name: 'Consideration', value: 42300 },
    { name: 'Evaluation', value: 18900 },
    { name: 'Purchase', value: 5870 },
    { name: 'Retention', value: 4123 },
  ];

  // Revenue sources breakdown
  const revenueSources = [
    { name: 'New Business', value: 8900000 },
    { name: 'Expansion', value: 6200000 },
    { name: 'Renewal', value: 24500000 },
    { name: 'Professional Services', value: 3100000 },
  ];

  // Product feature adoption vs revenue
  const featureRevenue = [
    { feature: 'Analytics Dashboard', adoption: 87, revenue: 12400000 },
    { feature: 'API Access', adoption: 54, revenue: 9800000 },
    { feature: 'Advanced Reports', adoption: 72, revenue: 8900000 },
    { feature: 'Integrations', adoption: 63, revenue: 7200000 },
    { feature: 'White Label', adoption: 31, revenue: 4400000 },
  ];

  return {
    dailyMetrics,
    monthlyRevenue,
    channelPerformance,
    journeyStages,
    revenueSources,
    featureRevenue,
    metrics: {
      // Product metrics
      totalActiveUsers: 47823,
      prevTotalActiveUsers: 45120,
      engagementRate: 68.4,
      prevEngagementRate: 64.2,
      // Marketing metrics
      totalConversions: 5096,
      prevTotalConversions: 4723,
      costPerAcquisition: 87.5,
      prevCostPerAcquisition: 92.3,
      // Revenue metrics
      monthlyRevenue: 3558333,
      prevMonthlyRevenue: 3241667,
      avgDealSize: 187500,
      prevAvgDealSize: 172000,
      // Efficiency metrics
      ltv: 456000,
      prevLtv: 423000,
      cac: 87.5,
      prevCac: 92.3,
      ltvCacRatio: 5.21,
      prevLtvCacRatio: 4.58,
      magicNumber: 1.34,
      prevMagicNumber: 1.18,
    },
  };
}

export default function HybridDashboardPage() {
  const mockData = useMemo(() => generateMockData(), []);

  // Prepare multi-metric trend chart
  const activeUsersData = mockData.dailyMetrics.map(m => ({
    x: m.date,
    y: m.activeUsers,
  }));

  const conversionsData = mockData.dailyMetrics.map(m => ({
    x: m.date,
    y: m.conversions * 10, // Scale for visibility
  }));

  const multiMetricChartData = {
    datasets: [
      {
        label: 'Active Users',
        data: activeUsersData,
        borderColor: '#2680eb',
        backgroundColor: '#2680eb',
      },
      {
        label: 'Conversions (×10)',
        data: conversionsData,
        borderColor: '#44b556',
        backgroundColor: '#44b556',
      },
    ],
  };

  // Prepare monthly revenue chart
  const revenueChartData = {
    datasets: [
      {
        label: 'Monthly Revenue',
        data: mockData.monthlyRevenue,
        borderColor: '#44b556',
        backgroundColor: '#44b556',
      },
    ],
  };

  // Prepare customer journey chart
  const journeyChartData = {
    labels: mockData.journeyStages.map(s => s.name),
    datasets: [
      {
        data: mockData.journeyStages.map(s => s.value),
        backgroundColor: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#01bad7'],
      },
    ],
  };

  // Prepare revenue sources chart
  const revenueSourcesChartData = {
    labels: mockData.revenueSources.map(s => s.name),
    datasets: [
      {
        data: mockData.revenueSources.map(s => s.value),
        backgroundColor: ['#2680eb', '#9256d9', '#44b556', '#e68619'],
      },
    ],
  };

  const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(1)}M`;
  const formatLargeCurrency = (value: number) => `$${Math.floor(value).toLocaleString()}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  const formatRatio = (value: number) => `${value.toFixed(2)}x`;

  return (
    <PageBody>
      <Column gap="3" margin="2">
        <PageHeader title="Executive Hybrid Dashboard">
          <Text size="2" style={{ color: '#838383' }}>
            Unified view across product, marketing, and revenue operations
          </Text>
        </PageHeader>

        {/* Top Level KPIs */}
        <Panel>
          <Heading size="3" style={{ marginBottom: '16px' }}>
            North Star Metrics
          </Heading>
          <MetricsBar>
            <MetricCard
              label="Monthly Active Users"
              value={mockData.metrics.totalActiveUsers}
              change={mockData.metrics.totalActiveUsers - mockData.metrics.prevTotalActiveUsers}
              showChange
            />
            <MetricCard
              label="Monthly Conversions"
              value={mockData.metrics.totalConversions}
              change={mockData.metrics.totalConversions - mockData.metrics.prevTotalConversions}
              showChange
            />
            <MetricCard
              label="Monthly Revenue"
              value={mockData.metrics.monthlyRevenue}
              change={mockData.metrics.monthlyRevenue - mockData.metrics.prevMonthlyRevenue}
              formatValue={formatCurrency}
              showChange
            />
            <MetricCard
              label="LTV:CAC Ratio"
              value={mockData.metrics.ltvCacRatio}
              change={mockData.metrics.ltvCacRatio - mockData.metrics.prevLtvCacRatio}
              formatValue={formatRatio}
              showChange
            />
          </MetricsBar>
        </Panel>

        {/* Tabbed Views by Persona */}
        <Panel>
          <Tabs>
            <TabList>
              <Tab id="overview">Overview</Tab>
              <Tab id="product">Product</Tab>
              <Tab id="marketing">Marketing</Tab>
              <Tab id="revenue">Revenue</Tab>
            </TabList>

            {/* Overview Tab */}
            <TabPanel id="overview">
              <Column gap="3">
                <GridRow layout="two">
                  <Panel title="Key Metrics Trend (30 Days)" allowFullscreen>
                    <BarChart chartData={multiMetricChartData} height={300} unit="day" />
                  </Panel>
                  <Panel title="Revenue Growth (6 Months)" allowFullscreen>
                    <BarChart chartData={revenueChartData} height={300} unit="month" />
                  </Panel>
                </GridRow>

                <Panel title="Channel Performance">
                  <Grid
                    columns="2fr 1fr 1fr 1fr 1fr"
                    gap="2"
                    paddingY="2"
                    style={{ borderBottom: '1px solid #d9d9d9' }}
                  >
                    <Text weight="bold">Channel</Text>
                    <Text weight="bold">Users</Text>
                    <Text weight="bold">Conversions</Text>
                    <Text weight="bold">Revenue</Text>
                    <Text weight="bold">Engagement</Text>
                  </Grid>
                  {mockData.channelPerformance.map((channel, idx) => (
                    <Grid
                      key={idx}
                      columns="2fr 1fr 1fr 1fr 1fr"
                      gap="2"
                      paddingY="2"
                      style={{ borderBottom: '1px solid #e9e9e9' }}
                    >
                      <Text>{channel.name}</Text>
                      <Text>{channel.users.toLocaleString()}</Text>
                      <Text>{channel.conversions.toLocaleString()}</Text>
                      <Text>{formatLargeCurrency(channel.revenue)}</Text>
                      <Text style={{ color: channel.engagement > 70 ? '#44b556' : '#838383' }}>
                        {formatPercent(channel.engagement)}
                      </Text>
                    </Grid>
                  ))}
                </Panel>
              </Column>
            </TabPanel>

            {/* Product Tab */}
            <TabPanel id="product">
              <Column gap="3">
                <MetricsBar>
                  <MetricCard
                    label="Active Users"
                    value={mockData.metrics.totalActiveUsers}
                    change={mockData.metrics.totalActiveUsers - mockData.metrics.prevTotalActiveUsers}
                    showChange
                  />
                  <MetricCard
                    label="Engagement Rate"
                    value={mockData.metrics.engagementRate}
                    change={mockData.metrics.engagementRate - mockData.metrics.prevEngagementRate}
                    formatValue={formatPercent}
                    showChange
                  />
                </MetricsBar>

                <GridRow layout="two">
                  <Panel title="Customer Journey Funnel" allowFullscreen>
                    <PieChart chartData={journeyChartData} height={300} type="doughnut" />
                  </Panel>
                  <Panel title="Feature Adoption vs Revenue">
                    <Grid
                      columns="2fr 1fr 1fr"
                      gap="2"
                      paddingY="2"
                      style={{ borderBottom: '1px solid #d9d9d9' }}
                    >
                      <Text weight="bold">Feature</Text>
                      <Text weight="bold">Adoption %</Text>
                      <Text weight="bold">Revenue</Text>
                    </Grid>
                    {mockData.featureRevenue.map((item, idx) => (
                      <Grid
                        key={idx}
                        columns="2fr 1fr 1fr"
                        gap="2"
                        paddingY="2"
                        style={{ borderBottom: '1px solid #e9e9e9' }}
                      >
                        <Text>{item.feature}</Text>
                        <Text>{formatPercent(item.adoption)}</Text>
                        <Text>{formatCurrency(item.revenue)}</Text>
                      </Grid>
                    ))}
                  </Panel>
                </GridRow>
              </Column>
            </TabPanel>

            {/* Marketing Tab */}
            <TabPanel id="marketing">
              <Column gap="3">
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
                    formatValue={formatLargeCurrency}
                    showChange
                    reverseColors
                  />
                  <MetricCard
                    label="CAC Payback (Months)"
                    value={mockData.metrics.magicNumber}
                    change={mockData.metrics.magicNumber - mockData.metrics.prevMagicNumber}
                    formatValue={formatRatio}
                    showChange
                    reverseColors
                  />
                </MetricsBar>

                <Panel title="Top Performing Channels">
                  <Grid
                    columns="2fr 1fr 1fr 1fr"
                    gap="2"
                    paddingY="2"
                    style={{ borderBottom: '1px solid #d9d9d9' }}
                  >
                    <Text weight="bold">Channel</Text>
                    <Text weight="bold">Users</Text>
                    <Text weight="bold">Conv. Rate</Text>
                    <Text weight="bold">Revenue</Text>
                  </Grid>
                  {mockData.channelPerformance.map((channel, idx) => {
                    const convRate = (channel.conversions / channel.users) * 100;
                    return (
                      <Grid
                        key={idx}
                        columns="2fr 1fr 1fr 1fr"
                        gap="2"
                        paddingY="2"
                        style={{ borderBottom: '1px solid #e9e9e9' }}
                      >
                        <Text>{channel.name}</Text>
                        <Text>{channel.users.toLocaleString()}</Text>
                        <Text>{formatPercent(convRate)}</Text>
                        <Text>{formatLargeCurrency(channel.revenue)}</Text>
                      </Grid>
                    );
                  })}
                </Panel>
              </Column>
            </TabPanel>

            {/* Revenue Tab */}
            <TabPanel id="revenue">
              <Column gap="3">
                <MetricsBar>
                  <MetricCard
                    label="Monthly Revenue"
                    value={mockData.metrics.monthlyRevenue}
                    change={mockData.metrics.monthlyRevenue - mockData.metrics.prevMonthlyRevenue}
                    formatValue={formatCurrency}
                    showChange
                  />
                  <MetricCard
                    label="Avg Deal Size"
                    value={mockData.metrics.avgDealSize}
                    change={mockData.metrics.avgDealSize - mockData.metrics.prevAvgDealSize}
                    formatValue={formatLargeCurrency}
                    showChange
                  />
                  <MetricCard
                    label="Customer LTV"
                    value={mockData.metrics.ltv}
                    change={mockData.metrics.ltv - mockData.metrics.prevLtv}
                    formatValue={formatLargeCurrency}
                    showChange
                  />
                </MetricsBar>

                <GridRow layout="two">
                  <Panel title="Revenue by Source" allowFullscreen>
                    <PieChart chartData={revenueSourcesChartData} height={300} type="doughnut" />
                  </Panel>
                  <Panel title="Revenue Breakdown">
                    <Grid
                      columns="2fr 1fr 1fr"
                      gap="2"
                      paddingY="2"
                      style={{ borderBottom: '1px solid #d9d9d9' }}
                    >
                      <Text weight="bold">Source</Text>
                      <Text weight="bold">Amount</Text>
                      <Text weight="bold">% of Total</Text>
                    </Grid>
                    {mockData.revenueSources.map((source, idx) => {
                      const total = mockData.revenueSources.reduce((sum, s) => sum + s.value, 0);
                      const percentage = (source.value / total) * 100;
                      return (
                        <Grid
                          key={idx}
                          columns="2fr 1fr 1fr"
                          gap="2"
                          paddingY="2"
                          style={{ borderBottom: '1px solid #e9e9e9' }}
                        >
                          <Text>{source.name}</Text>
                          <Text>{formatCurrency(source.value)}</Text>
                          <Text>{formatPercent(percentage)}</Text>
                        </Grid>
                      );
                    })}
                  </Panel>
                </GridRow>
              </Column>
            </TabPanel>
          </Tabs>
        </Panel>
      </Column>
    </PageBody>
  );
}
