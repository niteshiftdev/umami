'use client';
import { Column, Grid, Row, Text, Heading, TabList, Tab, TabPanel } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatLongCurrency, formatShortTime } from '@/lib/format';
import { useMemo, useState } from 'react';

// Hybrid Dashboard combining all persona elements
// Shows: Product Analytics + Marketing Attribution + Revenue Operations

export function HybridDashboardHomePage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Generate comprehensive mock data combining all personas
  const mockData = useMemo(() => {
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;

    // Combined metrics over last 30 days
    const combinedData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now.getTime() - (29 - i) * dayInMs);
      return {
        x: date.toISOString(),
        users: Math.round(12000 + i * 100 + Math.random() * 2000 - 1000),
        revenue: Math.round(95000 + i * 2000 + Math.random() * 15000 - 7500),
        conversions: Math.round(150 + i * 3 + Math.random() * 30 - 15),
      };
    });

    // Business health overview
    const healthScoreData = {
      labels: ['Product Engagement', 'Marketing ROI', 'Revenue Growth', 'Customer Health', 'Pipeline Strength'],
      datasets: [
        {
          label: 'Score',
          data: [82, 78, 85, 76, 81],
          backgroundColor: [
            '#30a46c',
            '#30a46c',
            '#3e63dd',
            '#f76b15',
            '#3e63dd',
          ],
        },
      ],
    };

    // Cross-functional metrics
    const topInitiatives = [
      { label: 'Enterprise Feature Launch', count: 95, percent: 100 },
      { label: 'Q4 Marketing Campaign', count: 89, percent: 94 },
      { label: 'Customer Retention Program', count: 82, percent: 86 },
      { label: 'Sales Enablement Initiative', count: 76, percent: 80 },
      { label: 'Product Onboarding Redesign', count: 71, percent: 75 },
      { label: 'Partner Channel Expansion', count: 65, percent: 68 },
    ];

    // Revenue by customer segment
    const segmentRevenue = [
      { label: 'Enterprise Customers', count: 1850000, percent: 100 },
      { label: 'Mid-Market Customers', count: 980000, percent: 53 },
      { label: 'Small Business', count: 415000, percent: 22 },
      { label: 'Startup/Growth', count: 185000, percent: 10 },
    ];

    // Funnel metrics combining product & marketing
    const funnelData = Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date(now.getTime() - (11 - i) * 7 * dayInMs);
      return {
        x: weekDate.toISOString(),
        visitors: Math.round(45000 + i * 800 + Math.random() * 5000 - 2500),
        signups: Math.round(4200 + i * 75 + Math.random() * 400 - 200),
        active: Math.round(2800 + i * 60 + Math.random() * 300 - 150),
        paying: Math.round(1350 + i * 35 + Math.random() * 150 - 75),
      };
    });

    return {
      combinedData,
      healthScoreData,
      topInitiatives,
      segmentRevenue,
      funnelData,
      // Summary metrics (combining all personas)
      metrics: {
        // Product metrics
        dau: 15234,
        previousDau: 14123,
        engagementScore: 7.8,
        previousEngagementScore: 7.4,
        // Marketing metrics
        totalVisitors: 154321,
        previousTotalVisitors: 142567,
        conversionRate: 3.19,
        previousConversionRate: 2.97,
        // Revenue metrics
        mrr: 3245000,
        previousMrr: 3089000,
        arr: 38940000,
        previousArr: 37068000,
        // Combined health
        healthScore: 80.4,
        previousHealthScore: 77.2,
      },
    };
  }, []);

  // Multi-metric chart
  const multiMetricChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Daily Active Users',
        data: mockData.combinedData.map(d => ({ x: d.x, y: d.users })),
        borderColor: '#3e63dd',
        backgroundColor: '#3e63dd33',
        borderWidth: 2,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Daily Revenue ($)',
        data: mockData.combinedData.map(d => ({ x: d.x, y: d.revenue })),
        borderColor: '#30a46c',
        backgroundColor: '#30a46c33',
        borderWidth: 2,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  }), [mockData.combinedData]);

  // Funnel conversion chart
  const funnelChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Visitors',
        data: mockData.funnelData.map(d => ({ x: d.x, y: d.visitors })),
        borderColor: '#3e63dd',
        backgroundColor: '#3e63dd33',
        borderWidth: 2,
      },
      {
        label: 'Signups',
        data: mockData.funnelData.map(d => ({ x: d.x, y: d.signups })),
        borderColor: '#6e56cf',
        backgroundColor: '#6e56cf33',
        borderWidth: 2,
      },
      {
        label: 'Active Users',
        data: mockData.funnelData.map(d => ({ x: d.x, y: d.active })),
        borderColor: '#30a46c',
        backgroundColor: '#30a46c33',
        borderWidth: 2,
      },
      {
        label: 'Paying Customers',
        data: mockData.funnelData.map(d => ({ x: d.x, y: d.paying })),
        borderColor: '#f76b15',
        backgroundColor: '#f76b1533',
        borderWidth: 2,
      },
    ],
  }), [mockData.funnelData]);

  return (
    <Column gap="4" padding="6">
      {/* Page Header */}
      <Column gap="2">
        <Heading size="1">Hybrid Dashboard</Heading>
        <Text size="3" color="muted">
          Unified view of product, marketing, and revenue metrics
        </Text>
      </Column>

      {/* Top-level Health Metrics */}
      <MetricsBar>
        <MetricCard
          value={mockData.metrics.healthScore}
          previousValue={mockData.metrics.previousHealthScore}
          change={mockData.metrics.healthScore - mockData.metrics.previousHealthScore}
          label="Overall Health Score"
          formatValue={n => `${n.toFixed(1)}/100`}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.dau}
          previousValue={mockData.metrics.previousDau}
          change={mockData.metrics.dau - mockData.metrics.previousDau}
          label="Daily Active Users"
          formatValue={formatLongNumber}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.totalVisitors}
          previousValue={mockData.metrics.previousTotalVisitors}
          change={mockData.metrics.totalVisitors - mockData.metrics.previousTotalVisitors}
          label="Monthly Visitors"
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
          value={mockData.metrics.mrr}
          previousValue={mockData.metrics.previousMrr}
          change={mockData.metrics.mrr - mockData.metrics.previousMrr}
          label="Monthly Recurring Revenue"
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.arr}
          previousValue={mockData.metrics.previousArr}
          change={mockData.metrics.arr - mockData.metrics.previousArr}
          label="Annual Recurring Revenue"
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
      </MetricsBar>

      {/* Tabbed View for Different Perspectives */}
      <Panel>
        <TabList value={activeTab} onValueChange={setActiveTab}>
          <Tab value="overview">Overview</Tab>
          <Tab value="product">Product</Tab>
          <Tab value="marketing">Marketing</Tab>
          <Tab value="revenue">Revenue</Tab>
        </TabList>

        <TabPanel value="overview" active={activeTab === 'overview'}>
          <Column gap="4" paddingTop="4">
            {/* Multi-metric trend */}
            <Panel title="Growth Trends (Last 30 Days)" allowFullscreen>
              <BarChart
                chartData={multiMetricChartData}
                unit="day"
                height="350px"
              />
            </Panel>

            {/* Business health and funnel */}
            <Grid columns={{ xs: '1fr', lg: '1fr 2fr' }} gap="4">
              <Panel title="Business Health Scores" allowFullscreen>
                <PieChart
                  chartData={mockData.healthScoreData}
                  type="doughnut"
                  height="300px"
                />
              </Panel>

              <Panel title="Full Funnel Conversion (Last 12 Weeks)" allowFullscreen>
                <BarChart
                  chartData={funnelChartData}
                  unit="week"
                  height="300px"
                />
              </Panel>
            </Grid>

            {/* Strategic initiatives and revenue */}
            <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
              <Panel title="Top Strategic Initiatives" allowFullscreen>
                <ListTable
                  data={mockData.topInitiatives}
                  title="Initiative"
                  metric="Progress"
                  showPercentage={true}
                />
              </Panel>

              <Panel title="Revenue by Customer Segment" allowFullscreen>
                <ListTable
                  data={mockData.segmentRevenue}
                  title="Segment"
                  metric="Revenue"
                  currency="USD"
                  showPercentage={true}
                />
              </Panel>
            </Grid>
          </Column>
        </TabPanel>

        <TabPanel value="product" active={activeTab === 'product'}>
          <Column gap="4" paddingTop="4">
            <Text size="4" weight="bold" color="muted">
              Product analytics metrics would appear here (DAU, engagement, feature adoption, retention)
            </Text>
            <Panel>
              <Text>Deep dive into product engagement, user behavior patterns, and feature analytics.</Text>
            </Panel>
          </Column>
        </TabPanel>

        <TabPanel value="marketing" active={activeTab === 'marketing'}>
          <Column gap="4" paddingTop="4">
            <Text size="4" weight="bold" color="muted">
              Marketing attribution metrics would appear here (traffic sources, campaign ROI, conversion tracking)
            </Text>
            <Panel>
              <Text>Deep dive into traffic sources, campaign performance, and attribution modeling.</Text>
            </Panel>
          </Column>
        </TabPanel>

        <TabPanel value="revenue" active={activeTab === 'revenue'}>
          <Column gap="4" paddingTop="4">
            <Text size="4" weight="bold" color="muted">
              Revenue operations metrics would appear here (pipeline, deals, churn risk, CLV)
            </Text>
            <Panel>
              <Text>Deep dive into sales pipeline, deal velocity, churn analysis, and revenue forecasting.</Text>
            </Panel>
          </Column>
        </TabPanel>
      </Panel>

      {/* Key Insights Section */}
      <Panel title="Key Insights & Alerts">
        <Column gap="3">
          <Row gap="2" alignItems="center">
            <Text size="2" style={{ color: '#30a46c' }}>●</Text>
            <Text>DAU increased 7.9% week-over-week, driven by new feature launches</Text>
          </Row>
          <Row gap="2" alignItems="center">
            <Text size="2" style={{ color: '#3e63dd' }}>●</Text>
            <Text>Marketing campaign ROI up 23% - consider scaling Q4 spend</Text>
          </Row>
          <Row gap="2" alignItems="center">
            <Text size="2" style={{ color: '#f76b15' }}>●</Text>
            <Text>3 enterprise deals at risk - CS team engaged for retention</Text>
          </Row>
          <Row gap="2" alignItems="center">
            <Text size="2" style={{ color: '#30a46c' }}>●</Text>
            <Text>MRR growth 5.1% MoM - on track for annual targets</Text>
          </Row>
        </Column>
      </Panel>
    </Column>
  );
}
