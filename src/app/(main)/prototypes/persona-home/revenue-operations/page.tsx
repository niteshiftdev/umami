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
import { useDynamicVariant, useDynamicBoolean, useDynamicNumber } from '@umami/dials';

// Mock data generator for realistic revenue operations metrics
function generateMockData() {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setMonth(startDate.getMonth() - 12);

  // Generate monthly recurring revenue (MRR) for the last 12 months
  const mrrData = [];
  let baseRevenue = 2400000;
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    baseRevenue += 150000 + Math.random() * 100000; // Growth trend
    mrrData.push({
      x: format(date, 'yyyy-MM'),
      y: Math.floor(baseRevenue),
    });
  }

  // Generate weekly pipeline data
  const pipelineData = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (11 - i) * 7);
    pipelineData.push({
      x: format(date, "yyyy-'W'II"),
      y: Math.floor(8500000 + Math.random() * 2000000),
    });
  }

  // Revenue by customer segment
  const segmentRevenue = [
    { name: 'Enterprise', value: 18500000 },
    { name: 'Mid-Market', value: 12300000 },
    { name: 'SMB', value: 8700000 },
    { name: 'Startup', value: 3200000 },
  ];

  // Deal stages in pipeline
  const dealStages = [
    { name: 'Prospecting', value: 12400000 },
    { name: 'Qualification', value: 8900000 },
    { name: 'Proposal', value: 6700000 },
    { name: 'Negotiation', value: 4200000 },
    { name: 'Closed Won', value: 2800000 },
  ];

  // Customer health scores distribution
  const healthScores = [
    { name: 'Healthy', value: 234 },
    { name: 'At Risk', value: 87 },
    { name: 'Critical', value: 23 },
  ];

  // Churn analysis by month
  const churnData = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    churnData.push({
      x: format(date, 'yyyy-MM'),
      y: 2.1 + Math.random() * 1.2, // Churn rate between 2-3.3%
    });
  }

  // Sales performance by region
  const regionData = [
    { name: 'North America', value: 21500000 },
    { name: 'EMEA', value: 13800000 },
    { name: 'APAC', value: 6400000 },
    { name: 'LATAM', value: 2900000 },
  ];

  // Top deals at risk
  const dealsAtRisk = [
    { account: 'Acme Corporation', value: 450000, stage: 'Negotiation', risk: 'High', daysStale: 45 },
    { account: 'GlobalTech Industries', value: 380000, stage: 'Proposal', risk: 'Medium', daysStale: 32 },
    { account: 'Phoenix Systems', value: 290000, stage: 'Negotiation', risk: 'High', daysStale: 38 },
    { account: 'Stellar Enterprises', value: 275000, stage: 'Qualification', risk: 'Medium', daysStale: 28 },
    { account: 'Nexus Solutions', value: 225000, stage: 'Proposal', risk: 'Low', daysStale: 18 },
  ];

  return {
    mrrData,
    pipelineData,
    segmentRevenue,
    dealStages,
    healthScores,
    churnData,
    regionData,
    dealsAtRisk,
    metrics: {
      totalARR: 42700000,
      prevTotalARR: 38900000,
      currentMRR: 3558333,
      prevCurrentMRR: 3241667,
      pipelineValue: 35200000,
      prevPipelineValue: 32800000,
      avgDealSize: 187500,
      prevAvgDealSize: 172000,
      winRate: 23.4,
      prevWinRate: 21.8,
      churnRate: 2.7,
      prevChurnRate: 3.1,
      netRevRetention: 112.5,
      prevNetRevRetention: 108.2,
      salesCycleLength: 67, // days
      prevSalesCycleLength: 72,
    },
  };
}

export default function RevenueOperationsPage() {
  const mockData = useMemo(() => generateMockData(), []);

  // Dials for layout exploration
  const layout = useDynamicVariant('ro-layout', {
    label: 'Layout Style',
    default: 'two-column',
    options: ['single-column', 'two-column', 'three-column'] as const,
    group: 'Layout',
  });

  const showMRRChart = useDynamicBoolean('ro-show-mrr', {
    label: 'MRR Growth Chart',
    default: true,
    group: 'Charts',
  });

  const showPipelineChart = useDynamicBoolean('ro-show-pipeline', {
    label: 'Pipeline Trend Chart',
    default: true,
    group: 'Charts',
  });

  const showSegmentCharts = useDynamicBoolean('ro-show-segments', {
    label: 'Segment Analysis Charts',
    default: true,
    group: 'Charts',
  });

  const showChurnChart = useDynamicBoolean('ro-show-churn', {
    label: 'Churn Rate Chart',
    default: true,
    group: 'Charts',
  });

  const showDealsTable = useDynamicBoolean('ro-show-deals', {
    label: 'Deals at Risk Table',
    default: true,
    group: 'Tables',
  });

  const chartHeight = useDynamicNumber('ro-chart-height', {
    label: 'Chart Height (px)',
    default: 300,
    min: 200,
    max: 500,
    step: 50,
    group: 'Visualization',
  });

  // Calculate date ranges
  const now = new Date();
  const monthlyMinDate = new Date(now);
  monthlyMinDate.setMonth(monthlyMinDate.getMonth() - 12);
  const monthlyMaxDate = now;

  const weeklyMinDate = new Date(now);
  weeklyMinDate.setDate(weeklyMinDate.getDate() - 12 * 7);
  const weeklyMaxDate = now;

  const gridLayout = layout === 'single-column' ? 'one' : layout === 'three-column' ? 'three' : 'two';

  // Prepare chart data for MRR growth
  const mrrChartData = {
    datasets: [
      {
        label: 'Monthly Recurring Revenue',
        data: mockData.mrrData,
        borderColor: '#44b556',
        backgroundColor: '#44b556',
      },
    ],
  };

  // Prepare chart data for pipeline
  const pipelineChartData = {
    datasets: [
      {
        label: 'Pipeline Value',
        data: mockData.pipelineData,
        borderColor: '#2680eb',
        backgroundColor: '#2680eb',
      },
    ],
  };

  // Prepare pie chart for customer segments
  const segmentChartData = {
    labels: mockData.segmentRevenue.map(s => s.name),
    datasets: [
      {
        data: mockData.segmentRevenue.map(s => s.value),
        backgroundColor: ['#2680eb', '#9256d9', '#44b556', '#e68619'],
      },
    ],
  };

  // Prepare chart for deal stages
  const stagesChartData = {
    labels: mockData.dealStages.map(s => s.name),
    datasets: [
      {
        data: mockData.dealStages.map(s => s.value),
        backgroundColor: ['#2680eb', '#9256d9', '#44b556', '#e68619', '#01bad7'],
      },
    ],
  };

  // Prepare chart for customer health
  const healthChartData = {
    labels: mockData.healthScores.map(h => h.name),
    datasets: [
      {
        data: mockData.healthScores.map(h => h.value),
        backgroundColor: ['#44b556', '#e68619', '#e34850'],
      },
    ],
  };

  // Prepare chart for churn rate
  const churnChartData = {
    datasets: [
      {
        label: 'Churn Rate %',
        data: mockData.churnData,
        borderColor: '#e34850',
        backgroundColor: '#e34850',
      },
    ],
  };

  const formatCurrency = (value: number) => `$${(value / 1000000).toFixed(1)}M`;
  const formatLargeCurrency = (value: number) => `$${Math.floor(value).toLocaleString()}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;
  const formatDays = (value: number) => `${Math.floor(value)}d`;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return '#e34850';
      case 'Medium':
        return '#e68619';
      case 'Low':
        return '#44b556';
      default:
        return '#838383';
    }
  };

  return (
    <PageBody>
      <Column gap="3" margin="2">
        <PageHeader title="Revenue Operations Dashboard">
          <Text size="2" style={{ color: '#838383' }}>
            Sales, CSM view of revenue drivers, pipeline, and risks
          </Text>
        </PageHeader>

        {/* Key Metrics */}
        <MetricsBar>
          <MetricCard
            label="Annual Recurring Revenue"
            value={mockData.metrics.totalARR}
            change={mockData.metrics.totalARR - mockData.metrics.prevTotalARR}
            formatValue={formatCurrency}
            showChange
          />
          <MetricCard
            label="Monthly Recurring Revenue"
            value={mockData.metrics.currentMRR}
            change={mockData.metrics.currentMRR - mockData.metrics.prevCurrentMRR}
            formatValue={formatCurrency}
            showChange
          />
          <MetricCard
            label="Pipeline Value"
            value={mockData.metrics.pipelineValue}
            change={mockData.metrics.pipelineValue - mockData.metrics.prevPipelineValue}
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
            label="Win Rate"
            value={mockData.metrics.winRate}
            change={mockData.metrics.winRate - mockData.metrics.prevWinRate}
            formatValue={formatPercent}
            showChange
          />
          <MetricCard
            label="Churn Rate"
            value={mockData.metrics.churnRate}
            change={mockData.metrics.churnRate - mockData.metrics.prevChurnRate}
            formatValue={formatPercent}
            showChange
            reverseColors
          />
          <MetricCard
            label="Net Revenue Retention"
            value={mockData.metrics.netRevRetention}
            change={mockData.metrics.netRevRetention - mockData.metrics.prevNetRevRetention}
            formatValue={formatPercent}
            showChange
          />
          <MetricCard
            label="Sales Cycle Length"
            value={mockData.metrics.salesCycleLength}
            change={mockData.metrics.salesCycleLength - mockData.metrics.prevSalesCycleLength}
            formatValue={formatDays}
            showChange
            reverseColors
          />
        </MetricsBar>

        {/* Revenue Growth and Pipeline */}
        {(showMRRChart || showPipelineChart) && (
          <GridRow layout={gridLayout}>
            {showMRRChart && (
              <Panel title="Monthly Recurring Revenue (12 Months)" allowFullscreen>
                <BarChart
                  chartData={mrrChartData}
                  height={chartHeight}
                  unit="month"
                  minDate={monthlyMinDate}
                  maxDate={monthlyMaxDate}
                />
              </Panel>
            )}
            {showPipelineChart && (
              <Panel title="Pipeline Value Trend (12 Weeks)" allowFullscreen>
                <BarChart
                  chartData={pipelineChartData}
                  height={chartHeight}
                  unit="week"
                  minDate={weeklyMinDate}
                  maxDate={weeklyMaxDate}
                />
              </Panel>
            )}
          </GridRow>
        )}

        {/* Segment Analysis */}
        {showSegmentCharts && (
          <GridRow layout="three">
            <Panel title="Revenue by Segment" allowFullscreen>
              <PieChart chartData={segmentChartData} height={chartHeight - 20} type="doughnut" />
            </Panel>
            <Panel title="Pipeline by Stage" allowFullscreen>
              <PieChart chartData={stagesChartData} height={chartHeight - 20} type="doughnut" />
            </Panel>
            <Panel title="Customer Health" allowFullscreen>
              <PieChart chartData={healthChartData} height={chartHeight - 20} type="pie" />
            </Panel>
          </GridRow>
        )}

        {/* Churn and Deals at Risk */}
        {(showChurnChart || showDealsTable) && (
          <GridRow layout={gridLayout}>
            {showChurnChart && (
              <Panel title="Monthly Churn Rate (12 Months)" allowFullscreen>
                <BarChart
                  chartData={churnChartData}
                  height={chartHeight}
                  unit="month"
                  minDate={monthlyMinDate}
                  maxDate={monthlyMaxDate}
                />
              </Panel>
            )}
            {showDealsTable && (
              <Panel title="Deals at Risk">
            <Grid
              columns="2fr 1fr 1fr 1fr 1fr"
              gap="2"
              paddingY="2"
              style={{ borderBottom: '1px solid #d9d9d9' }}
            >
              <Text weight="bold">Account</Text>
              <Text weight="bold">Value</Text>
              <Text weight="bold">Stage</Text>
              <Text weight="bold">Risk</Text>
              <Text weight="bold">Days Stale</Text>
            </Grid>
            {mockData.dealsAtRisk.map((deal, idx) => (
              <Grid
                key={idx}
                columns="2fr 1fr 1fr 1fr 1fr"
                gap="2"
                paddingY="2"
                style={{ borderBottom: '1px solid #e9e9e9' }}
              >
                <Text>{deal.account}</Text>
                <Text>{formatLargeCurrency(deal.value)}</Text>
                <Text>{deal.stage}</Text>
                <Text weight="bold" style={{ color: getRiskColor(deal.risk) }}>
                  {deal.risk}
                </Text>
                <Text>{deal.daysStale}</Text>
              </Grid>
            ))}
              </Panel>
            )}
          </GridRow>
        )}
      </Column>
    </PageBody>
  );
}
