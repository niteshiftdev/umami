'use client';
import { Column, Grid, Row, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { useMemo } from 'react';

// Mock data for Marketing Attribution persona
// Focus: Traffic sources, campaign performance, conversion tracking, ROI

export function MarketingAttributionHomePage() {
  // Generate realistic mock data for marketing campaigns
  const mockData = useMemo(() => {
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;

    // Daily traffic by source (last 30 days)
    const trafficData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * dayInMs);
      return {
        x: date.toISOString(),
        y: Math.round(8000 + Math.random() * 4000 + i * 50), // Growing trend
      };
    });

    // Conversion rate trend (last 30 days)
    const conversionData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * dayInMs);
      const baseRate = 3.2;
      const variance = Math.random() * 1.5 - 0.75;
      return {
        x: date.toISOString(),
        y: parseFloat((baseRate + variance).toFixed(2)),
      };
    });

    // Traffic sources distribution
    const trafficSourcesData = {
      labels: ['Organic Search', 'Paid Search', 'Social Media', 'Direct', 'Email', 'Referral'],
      datasets: [
        {
          label: 'Sessions',
          data: [45230, 32145, 28934, 19823, 15432, 12876],
          backgroundColor: [
            '#3e63dd',
            '#6e56cf',
            '#8e4ec6',
            '#30a46c',
            '#f76b15',
            '#e5484d',
          ],
        },
      ],
    };

    // Top campaigns by conversion
    const topCampaigns = [
      { label: 'Google Ads - Brand Keywords', count: 3245, percent: 100 },
      { label: 'Facebook Lead Gen Campaign', count: 2891, percent: 89 },
      { label: 'LinkedIn Sponsored Content', count: 2134, percent: 66 },
      { label: 'Twitter Promoted Tweets', count: 1876, percent: 58 },
      { label: 'Instagram Story Ads', count: 1543, percent: 48 },
      { label: 'Google Display Network', count: 1234, percent: 38 },
      { label: 'Reddit Sponsored Posts', count: 987, percent: 30 },
      { label: 'YouTube Video Ads', count: 754, percent: 23 },
    ];

    // UTM sources performance
    const utmSources = [
      { label: 'google', count: 52341, percent: 100 },
      { label: 'facebook', count: 38234, percent: 73 },
      { label: 'linkedin', count: 24567, percent: 47 },
      { label: 'twitter', count: 18934, percent: 36 },
      { label: 'newsletter', count: 15432, percent: 29 },
      { label: 'partner-sites', count: 12876, percent: 25 },
    ];

    // Campaign ROI trend (last 12 weeks)
    const roiData = Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date(now.getTime() - (11 - i) * 7 * dayInMs);
      const baseROI = 320; // 320% ROI
      const trend = i * 5; // Improving trend
      const variance = Math.random() * 40 - 20;
      return {
        x: weekDate.toISOString(),
        y: Math.round(baseROI + trend + variance),
      };
    });

    // Cost per acquisition trend (last 30 days)
    const cpaData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * dayInMs);
      const baseCPA = 45;
      const improvement = i * -0.3; // Decreasing (improving) CPA
      const variance = Math.random() * 8 - 4;
      return {
        x: date.toISOString(),
        y: parseFloat((baseCPA + improvement + variance).toFixed(2)),
      };
    });

    return {
      trafficData,
      conversionData,
      trafficSourcesData,
      topCampaigns,
      utmSources,
      roiData,
      cpaData,
      // Summary metrics
      metrics: {
        totalVisitors: 154321,
        previousTotalVisitors: 142567,
        conversions: 4932,
        previousConversions: 4234,
        conversionRate: 3.19,
        previousConversionRate: 2.97,
        costPerAcquisition: 38.5,
        previousCostPerAcquisition: 42.3,
        roi: 365, // percentage
        previousRoi: 342,
        adSpend: 189850,
        previousAdSpend: 179200,
      },
    };
  }, []);

  // Create chart data for traffic trend
  const trafficChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Total Visitors',
        data: mockData.trafficData,
        borderColor: '#3e63dd',
        backgroundColor: '#3e63dd33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.trafficData]);

  // Create chart data for conversion rate
  const conversionChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: mockData.conversionData,
        borderColor: '#30a46c',
        backgroundColor: '#30a46c33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.conversionData]);

  // Create chart data for ROI
  const roiChartData = useMemo(() => ({
    datasets: [
      {
        label: 'ROI (%)',
        data: mockData.roiData,
        borderColor: '#6e56cf',
        backgroundColor: '#6e56cf33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.roiData]);

  // Create chart data for CPA
  const cpaChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Cost Per Acquisition ($)',
        data: mockData.cpaData,
        borderColor: '#f76b15',
        backgroundColor: '#f76b1533',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.cpaData]);

  return (
    <Column gap="4" padding="6">
      {/* Page Header */}
      <Column gap="2">
        <Heading size="1">Marketing Attribution Dashboard</Heading>
        <Text size="3" color="muted">
          Track inbound sources and campaign performance
        </Text>
      </Column>

      {/* Key Metrics */}
      <MetricsBar>
        <MetricCard
          value={mockData.metrics.totalVisitors}
          previousValue={mockData.metrics.previousTotalVisitors}
          change={mockData.metrics.totalVisitors - mockData.metrics.previousTotalVisitors}
          label="Total Visitors"
          formatValue={formatLongNumber}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.conversions}
          previousValue={mockData.metrics.previousConversions}
          change={mockData.metrics.conversions - mockData.metrics.previousConversions}
          label="Conversions"
          formatValue={formatLongNumber}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.conversionRate}
          previousValue={mockData.metrics.previousConversionRate}
          change={mockData.metrics.conversionRate - mockData.metrics.previousConversionRate}
          label="Conversion Rate"
          formatValue={n => `${n.toFixed(2)}%`}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.costPerAcquisition}
          previousValue={mockData.metrics.previousCostPerAcquisition}
          change={mockData.metrics.costPerAcquisition - mockData.metrics.previousCostPerAcquisition}
          label="Cost Per Acquisition"
          formatValue={n => `$${n.toFixed(2)}`}
          showChange={true}
          reverseColors={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.roi}
          previousValue={mockData.metrics.previousRoi}
          change={mockData.metrics.roi - mockData.metrics.previousRoi}
          label="Return on Investment"
          formatValue={n => `${Math.round(n)}%`}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.adSpend}
          previousValue={mockData.metrics.previousAdSpend}
          change={mockData.metrics.adSpend - mockData.metrics.previousAdSpend}
          label="Ad Spend (30d)"
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange={true}
          reverseColors={true}
          valueSize="8"
          labelWeight="bold"
        />
      </MetricsBar>

      {/* Primary Charts Row */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
        <Panel title="Daily Traffic Trend (Last 30 Days)" allowFullscreen>
          <BarChart
            chartData={trafficChartData}
            unit="day"
            height="300px"
          />
        </Panel>

        <Panel title="Conversion Rate Trend (Last 30 Days)" allowFullscreen>
          <BarChart
            chartData={conversionChartData}
            unit="day"
            height="300px"
          />
        </Panel>
      </Grid>

      {/* Traffic Sources and ROI */}
      <Grid columns={{ xs: '1fr', lg: '1fr 2fr' }} gap="4">
        <Panel title="Traffic by Source" allowFullscreen>
          <PieChart
            chartData={mockData.trafficSourcesData}
            type="doughnut"
            height="300px"
          />
        </Panel>

        <Panel title="Campaign ROI Trend (Last 12 Weeks)" allowFullscreen>
          <BarChart
            chartData={roiChartData}
            unit="week"
            height="300px"
          />
        </Panel>
      </Grid>

      {/* CPA Trend */}
      <Panel title="Cost Per Acquisition Trend (Last 30 Days)" allowFullscreen>
        <BarChart
          chartData={cpaChartData}
          unit="day"
          height="300px"
        />
      </Panel>

      {/* Data Tables Row */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
        <Panel title="Top Performing Campaigns" allowFullscreen>
          <ListTable
            data={mockData.topCampaigns}
            title="Campaign"
            metric="Conversions"
            showPercentage={true}
          />
        </Panel>

        <Panel title="Traffic by UTM Source" allowFullscreen>
          <ListTable
            data={mockData.utmSources}
            title="Source"
            metric="Sessions"
            showPercentage={true}
          />
        </Panel>
      </Grid>
    </Column>
  );
}
