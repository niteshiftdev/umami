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

// Mock data for Revenue Operations persona
// Focus: Revenue drivers, pipeline health, sales metrics, churn risk

export function RevenueOperationsHomePage() {
  // Generate realistic mock data for revenue operations
  const mockData = useMemo(() => {
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;

    // Monthly Recurring Revenue trend (last 12 months)
    const mrrData = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const baseMRR = 2400000;
      const growth = i * 85000; // Growing MRR
      const variance = Math.random() * 50000 - 25000;
      return {
        x: monthDate.toISOString(),
        y: Math.round(baseMRR + growth + variance),
      };
    });

    // Pipeline value trend (last 12 weeks)
    const pipelineData = Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date(now.getTime() - (11 - i) * 7 * dayInMs);
      const basePipeline = 8500000;
      const variance = Math.random() * 1500000 - 750000;
      return {
        x: weekDate.toISOString(),
        y: Math.round(basePipeline + variance),
      };
    });

    // Revenue by product line
    const revenueByProductData = {
      labels: ['Enterprise Plan', 'Professional Plan', 'Starter Plan', 'Add-ons', 'Services'],
      datasets: [
        {
          label: 'Revenue',
          data: [1850000, 1250000, 450000, 320000, 180000],
          backgroundColor: [
            '#3e63dd',
            '#6e56cf',
            '#8e4ec6',
            '#30a46c',
            '#f76b15',
          ],
        },
      ],
    };

    // Top deals in pipeline
    const topDeals = [
      { label: 'Acme Corp - Enterprise Expansion', count: 450000, percent: 100 },
      { label: 'TechStart Inc - New Business', count: 380000, percent: 84 },
      { label: 'Global Systems - Migration', count: 325000, percent: 72 },
      { label: 'Innovation Labs - Multi-year', count: 290000, percent: 64 },
      { label: 'Digital Solutions - Upgrade', count: 245000, percent: 54 },
      { label: 'Smart Industries - New Business', count: 210000, percent: 47 },
      { label: 'Future Tech - Enterprise', count: 185000, percent: 41 },
      { label: 'CloudFirst - Expansion', count: 165000, percent: 37 },
    ];

    // Revenue by region
    const revenueByRegion = [
      { label: 'North America', count: 2850000, percent: 100 },
      { label: 'Europe', count: 1620000, percent: 57 },
      { label: 'Asia Pacific', count: 890000, percent: 31 },
      { label: 'Latin America', count: 340000, percent: 12 },
      { label: 'Middle East & Africa', count: 250000, percent: 9 },
    ];

    // Churn risk accounts
    const churnRiskData = Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date(now.getTime() - (11 - i) * 7 * dayInMs);
      const baseRisk = 2.8; // 2.8% churn rate
      const variance = Math.random() * 0.8 - 0.4;
      return {
        x: weekDate.toISOString(),
        y: parseFloat((baseRisk + variance).toFixed(2)),
      };
    });

    // Customer Lifetime Value trend
    const clvData = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const baseCLV = 145000;
      const growth = i * 2800; // Increasing CLV
      const variance = Math.random() * 8000 - 4000;
      return {
        x: monthDate.toISOString(),
        y: Math.round(baseCLV + growth + variance),
      };
    });

    // Sales cycle length trend (in days)
    const salesCycleData = Array.from({ length: 12 }, (_, i) => {
      const weekDate = new Date(now.getTime() - (11 - i) * 7 * dayInMs);
      const baseCycle = 45; // 45 days
      const improvement = i * -0.5; // Decreasing (improving) cycle time
      const variance = Math.random() * 6 - 3;
      return {
        x: weekDate.toISOString(),
        y: Math.round(baseCycle + improvement + variance),
      };
    });

    return {
      mrrData,
      pipelineData,
      revenueByProductData,
      topDeals,
      revenueByRegion,
      churnRiskData,
      clvData,
      salesCycleData,
      // Summary metrics
      metrics: {
        mrr: 3245000,
        previousMrr: 3089000,
        arr: 38940000,
        previousArr: 37068000,
        pipelineValue: 8765000,
        previousPipelineValue: 8234000,
        avgDealSize: 52340,
        previousAvgDealSize: 48920,
        winRate: 34.5, // percentage
        previousWinRate: 32.8,
        churnRate: 2.7, // percentage
        previousChurnRate: 3.1,
        customerLifetimeValue: 168500,
        previousCustomerLifetimeValue: 154200,
        salesCycleLength: 42, // days
        previousSalesCycleLength: 47,
      },
    };
  }, []);

  // Create chart data for MRR trend
  const mrrChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Monthly Recurring Revenue',
        data: mockData.mrrData,
        borderColor: '#3e63dd',
        backgroundColor: '#3e63dd33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.mrrData]);

  // Create chart data for pipeline
  const pipelineChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Pipeline Value',
        data: mockData.pipelineData,
        borderColor: '#6e56cf',
        backgroundColor: '#6e56cf33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.pipelineData]);

  // Create chart data for churn risk
  const churnRiskChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Churn Rate (%)',
        data: mockData.churnRiskData,
        borderColor: '#e5484d',
        backgroundColor: '#e5484d33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.churnRiskData]);

  // Create chart data for CLV
  const clvChartData = useMemo(() => ({
    datasets: [
      {
        label: 'Customer Lifetime Value',
        data: mockData.clvData,
        borderColor: '#30a46c',
        backgroundColor: '#30a46c33',
        borderWidth: 2,
        fill: true,
      },
    ],
  }), [mockData.clvData]);

  return (
    <Column gap="4" padding="6">
      {/* Page Header */}
      <Column gap="2">
        <Heading size="1">Revenue Operations Dashboard</Heading>
        <Text size="3" color="muted">
          Sales/CSM view of revenue drivers, pipeline, and risks
        </Text>
      </Column>

      {/* Key Metrics */}
      <MetricsBar>
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
        <MetricCard
          value={mockData.metrics.pipelineValue}
          previousValue={mockData.metrics.previousPipelineValue}
          change={mockData.metrics.pipelineValue - mockData.metrics.previousPipelineValue}
          label="Pipeline Value"
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.avgDealSize}
          previousValue={mockData.metrics.previousAvgDealSize}
          change={mockData.metrics.avgDealSize - mockData.metrics.previousAvgDealSize}
          label="Avg Deal Size"
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.winRate}
          previousValue={mockData.metrics.previousWinRate}
          change={mockData.metrics.winRate - mockData.metrics.previousWinRate}
          label="Win Rate"
          formatValue={n => `${n.toFixed(1)}%`}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.churnRate}
          previousValue={mockData.metrics.previousChurnRate}
          change={mockData.metrics.churnRate - mockData.metrics.previousChurnRate}
          label="Churn Rate"
          formatValue={n => `${n.toFixed(1)}%`}
          showChange={true}
          reverseColors={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.customerLifetimeValue}
          previousValue={mockData.metrics.previousCustomerLifetimeValue}
          change={mockData.metrics.customerLifetimeValue - mockData.metrics.previousCustomerLifetimeValue}
          label="Customer Lifetime Value"
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange={true}
          valueSize="8"
          labelWeight="bold"
        />
        <MetricCard
          value={mockData.metrics.salesCycleLength}
          previousValue={mockData.metrics.previousSalesCycleLength}
          change={mockData.metrics.salesCycleLength - mockData.metrics.previousSalesCycleLength}
          label="Sales Cycle (days)"
          formatValue={formatLongNumber}
          showChange={true}
          reverseColors={true}
          valueSize="8"
          labelWeight="bold"
        />
      </MetricsBar>

      {/* Primary Charts Row */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
        <Panel title="Monthly Recurring Revenue (Last 12 Months)" allowFullscreen>
          <BarChart
            chartData={mrrChartData}
            unit="month"
            height="300px"
          />
        </Panel>

        <Panel title="Pipeline Value Trend (Last 12 Weeks)" allowFullscreen>
          <BarChart
            chartData={pipelineChartData}
            unit="week"
            height="300px"
          />
        </Panel>
      </Grid>

      {/* Revenue Distribution */}
      <Grid columns={{ xs: '1fr', lg: '1fr 2fr' }} gap="4">
        <Panel title="Revenue by Product Line" allowFullscreen>
          <PieChart
            chartData={mockData.revenueByProductData}
            type="doughnut"
            height="300px"
          />
        </Panel>

        <Panel title="Customer Lifetime Value Trend (Last 12 Months)" allowFullscreen>
          <BarChart
            chartData={clvChartData}
            unit="month"
            height="300px"
          />
        </Panel>
      </Grid>

      {/* Risk Metrics */}
      <Panel title="Churn Rate Trend (Last 12 Weeks)" allowFullscreen>
        <BarChart
          chartData={churnRiskChartData}
          unit="week"
          height="300px"
        />
      </Panel>

      {/* Data Tables Row */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
        <Panel title="Top Deals in Pipeline" allowFullscreen>
          <ListTable
            data={mockData.topDeals}
            title="Deal"
            metric="Value"
            currency="USD"
            showPercentage={true}
          />
        </Panel>

        <Panel title="Revenue by Region" allowFullscreen>
          <ListTable
            data={mockData.revenueByRegion}
            title="Region"
            metric="Revenue"
            currency="USD"
            showPercentage={true}
          />
        </Panel>
      </Grid>
    </Column>
  );
}
