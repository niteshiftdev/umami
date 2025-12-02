'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, Heading, useTheme, Box } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { GridRow } from '@/components/common/GridRow';
import { getThemeColors } from '@/lib/colors';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import { renderDateLabels } from '@/lib/charts';
import { colord } from 'colord';
import {
  DialsProvider,
  useDynamicColor,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';

// Generate revenue time series data
function generateRevenueData(days: number = 14) {
  const data: { x: string; y: number; d: string }[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Revenue tends to spike mid-month and end of month
    const dayOfMonth = date.getDate();
    const isEndOfMonth = dayOfMonth > 25 || dayOfMonth < 5;
    const baseValue = isEndOfMonth ? 45000 : 28000;
    const variance = Math.random() * 15000 - 7500;

    data.push({
      x: dateStr,
      y: Math.round(baseValue + variance),
      d: dateStr,
    });
  }
  return data;
}

function generateMRRGrowthData(days: number = 14) {
  const data: { x: string; y: number; d: string }[] = [];
  const now = new Date();
  let runningMRR = 2450000; // Starting MRR

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Small daily growth with some variance
    const dailyGrowth = (Math.random() * 8000) - 2000;
    runningMRR += dailyGrowth;

    data.push({
      x: dateStr,
      y: Math.round(runningMRR),
      d: dateStr,
    });
  }
  return data;
}

const revenueData = generateRevenueData(14);
const mrrData = generateMRRGrowthData(14);

// Pipeline stage data
const pipelineStages = [
  { label: 'Lead', count: 342, percent: 28 },
  { label: 'Qualified', count: 187, percent: 15 },
  { label: 'Demo Scheduled', count: 124, percent: 10 },
  { label: 'Proposal Sent', count: 89, percent: 7 },
  { label: 'Negotiation', count: 56, percent: 5 },
  { label: 'Closed Won', count: 43, percent: 4 },
];

// Top accounts by revenue
const topAccountsData = [
  { label: 'Acme Corporation', count: 125000, percent: 18 },
  { label: 'TechStart Inc', count: 89500, percent: 13 },
  { label: 'Global Dynamics', count: 78200, percent: 11 },
  { label: 'Innovate Labs', count: 67800, percent: 10 },
  { label: 'Summit Enterprises', count: 54300, percent: 8 },
  { label: 'Horizon Group', count: 48900, percent: 7 },
  { label: 'Vertex Solutions', count: 42100, percent: 6 },
  { label: 'Nexus Corp', count: 38700, percent: 5 },
];

// At-risk accounts
const atRiskAccounts = [
  { label: 'DataFlow Systems', count: 45000, percent: 72 },
  { label: 'Quantum Analytics', count: 38500, percent: 65 },
  { label: 'CloudScale Pro', count: 32000, percent: 58 },
  { label: 'MetricPulse Inc', count: 28500, percent: 45 },
];

// Expansion opportunities
const expansionOpportunities = [
  { label: 'Acme Corporation - Enterprise', count: 85000, percent: 92 },
  { label: 'TechStart Inc - Add-ons', count: 34000, percent: 85 },
  { label: 'Global Dynamics - Seats', count: 28000, percent: 78 },
  { label: 'Summit Enterprises - Upgrade', count: 22000, percent: 72 },
];

// Revenue breakdown by segment
const revenueBySegment = {
  labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
  datasets: [{
    data: [45, 32, 18, 5],
    backgroundColor: [CHART_COLORS[0], CHART_COLORS[2], CHART_COLORS[4], CHART_COLORS[6]],
    borderWidth: 0,
  }],
};

// Revenue by product
const revenueByProduct = {
  labels: ['Analytics Pro', 'Basic Plan', 'Enterprise Suite', 'Add-ons'],
  datasets: [{
    data: [38, 28, 24, 10],
    backgroundColor: [CHART_COLORS[1], CHART_COLORS[3], CHART_COLORS[5], CHART_COLORS[7]],
    borderWidth: 0,
  }],
};

// CSM performance data
const csmPerformance = [
  { label: 'Sarah Chen', count: 98, percent: 98 },
  { label: 'Michael Torres', count: 95, percent: 95 },
  { label: 'Emily Watson', count: 92, percent: 92 },
  { label: 'David Kim', count: 88, percent: 88 },
  { label: 'Jessica Park', count: 85, percent: 85 },
];

function RevenueOperationsDashboard() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Dials for customization
  const revenueColor = useDynamicColor('ro-revenue-color', {
    default: '#44b556',
    label: 'Revenue Color',
    group: 'Colors',
  });

  const riskColor = useDynamicColor('ro-risk-color', {
    default: '#e34850',
    label: 'Risk Color',
    group: 'Colors',
  });

  const opportunityColor = useDynamicColor('ro-opportunity-color', {
    default: '#2680eb',
    label: 'Opportunity Color',
    group: 'Colors',
  });

  const chartHeight = useDynamicNumber('ro-chart-height', {
    default: 280,
    min: 200,
    max: 450,
    label: 'Chart Height',
    group: 'Layout',
  });

  const showPipelineStages = useDynamicBoolean('ro-show-pipeline', {
    default: true,
    label: 'Show Pipeline Stages',
    group: 'Display',
  });

  const compactMetrics = useDynamicBoolean('ro-compact-metrics', {
    default: false,
    label: 'Compact Metrics',
    group: 'Layout',
  });

  const highlightAtRisk = useDynamicBoolean('ro-highlight-risk', {
    default: true,
    label: 'Highlight At-Risk Accounts',
    group: 'Display',
  });

  const cardBorderRadius = useDynamicNumber('ro-card-radius', {
    default: 3,
    min: 0,
    max: 6,
    label: 'Card Border Radius',
    group: 'Layout',
  });

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 13);
  const maxDate = new Date();

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  // Revenue chart data
  const revenueChartData = useMemo(() => {
    const revCol = colord(revenueColor);

    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Revenue',
          data: revenueData,
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          backgroundColor: revCol.alpha(0.6).toRgbString(),
          borderColor: revCol.alpha(0.9).toRgbString(),
          hoverBackgroundColor: revCol.alpha(0.9).toRgbString(),
        },
      ],
    };
  }, [revenueColor]);

  // MRR trend chart data
  const mrrChartData = useMemo(() => {
    const oppCol = colord(opportunityColor);

    return {
      datasets: [
        {
          type: 'line' as const,
          label: 'MRR',
          data: mrrData,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          backgroundColor: oppCol.alpha(0.2).toRgbString(),
          borderColor: oppCol.alpha(0.9).toRgbString(),
          pointBackgroundColor: oppCol.toRgbString(),
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [opportunityColor]);

  const metricSize = compactMetrics ? '6' : '8';

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader
          title="Revenue Operations"
          description="Sales/CSM view of revenue drivers, pipeline, and risks"
        />

        {/* Key Revenue Metrics */}
        <MetricsBar>
          <MetricCard
            label="Monthly Recurring Revenue"
            value={2487000}
            change={2312000}
            showChange={true}
            formatValue={(v) => formatLongCurrency(v, 'USD')}
            valueSize={metricSize as any}
          />
          <MetricCard
            label="Annual Contract Value"
            value={29844000}
            change={27744000}
            showChange={true}
            formatValue={(v) => formatLongCurrency(v, 'USD')}
            valueSize={metricSize as any}
          />
          <MetricCard
            label="Net Revenue Retention"
            value={118}
            change={112}
            showChange={true}
            formatValue={(v) => `${v}%`}
            valueSize={metricSize as any}
          />
          <MetricCard
            label="Churn Rate"
            value={2.1}
            change={2.8}
            showChange={true}
            reverseColors={true}
            formatValue={(v) => `${v.toFixed(1)}%`}
            valueSize={metricSize as any}
          />
          <MetricCard
            label="Pipeline Value"
            value={4250000}
            change={3890000}
            showChange={true}
            formatValue={(v) => formatLongCurrency(v, 'USD')}
            valueSize={metricSize as any}
          />
        </MetricsBar>

        {/* Revenue Trends */}
        <GridRow layout="two">
          <Panel title="Daily Revenue">
            <BarChart
              chartData={revenueChartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              renderXLabel={renderXLabel}
              height={`${chartHeight}px`}
              currency="USD"
            />
          </Panel>
          <Panel title="MRR Trend">
            <BarChart
              chartData={mrrChartData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              renderXLabel={renderXLabel}
              height={`${chartHeight}px`}
              currency="USD"
            />
          </Panel>
        </GridRow>

        {/* Pipeline and Top Accounts */}
        <GridRow layout="two">
          {showPipelineStages && (
            <Panel title="Sales Pipeline">
              <ListTable
                data={pipelineStages}
                title="Stage"
                metric="Deals"
                showPercentage={true}
              />
            </Panel>
          )}
          <Panel title="Top Accounts by ARR">
            <ListTable
              data={topAccountsData}
              title="Account"
              metric="ARR"
              showPercentage={true}
            />
          </Panel>
          {!showPipelineStages && (
            <Panel title="CSM Performance (NPS Score)">
              <ListTable
                data={csmPerformance}
                title="CSM"
                metric="NPS"
                showPercentage={false}
              />
            </Panel>
          )}
        </GridRow>

        {/* Risk and Opportunity */}
        <GridRow layout="two">
          <Panel title="At-Risk Accounts">
            <Column gap="3">
              <ListTable
                data={atRiskAccounts}
                title="Account"
                metric="ARR"
                showPercentage={false}
              />
              <Row backgroundColor="2" padding="3" borderRadius="2" gap="2" alignItems="center">
                <Box
                  width="10px"
                  height="10px"
                  borderRadius="round"
                  style={{
                    backgroundColor: highlightAtRisk ? riskColor : CHART_COLORS[4],
                  }}
                />
                <Text size="1" color="muted">Total At-Risk ARR:</Text>
                <Text size="2" weight="bold">{formatLongCurrency(144000, 'USD')}</Text>
              </Row>
            </Column>
          </Panel>
          <Panel title="Expansion Opportunities">
            <Column gap="3">
              <ListTable
                data={expansionOpportunities}
                title="Opportunity"
                metric="Potential"
                showPercentage={false}
              />
              <Row backgroundColor="2" padding="3" borderRadius="2" gap="2" alignItems="center">
                <Box
                  width="10px"
                  height="10px"
                  borderRadius="round"
                  style={{ backgroundColor: opportunityColor }}
                />
                <Text size="1" color="muted">Total Expansion Pipeline:</Text>
                <Text size="2" weight="bold">{formatLongCurrency(169000, 'USD')}</Text>
              </Row>
            </Column>
          </Panel>
        </GridRow>

        {/* Revenue Breakdown */}
        <GridRow layout="three">
          <Panel title="Revenue by Segment">
            <Column alignItems="center" paddingY="4">
              <PieChart
                type="doughnut"
                chartData={revenueBySegment}
                height="200px"
                width="200px"
              />
            </Column>
          </Panel>
          <Panel title="Revenue by Product">
            <Column alignItems="center" paddingY="4">
              <PieChart
                type="doughnut"
                chartData={revenueByProduct}
                height="200px"
                width="200px"
              />
            </Column>
          </Panel>
          <Panel title="CSM Performance">
            <ListTable
              data={csmPerformance}
              title="CSM"
              metric="NPS"
              showPercentage={false}
            />
          </Panel>
        </GridRow>

        {/* Revenue Health Indicators */}
        <Panel title="Revenue Health Indicators">
          <Grid columns={{ xs: '1fr', md: 'repeat(5, 1fr)' }} gap="4">
            <Column padding="4" backgroundColor="2" borderRadius={cardBorderRadius.toString() as any}>
              <Text size="1" color="muted">Expansion MRR</Text>
              <Text size="5" weight="bold" style={{ color: revenueColor }}>+$87.2k</Text>
              <Text size="1" color="muted">This month</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius={cardBorderRadius.toString() as any}>
              <Text size="1" color="muted">Contraction MRR</Text>
              <Text size="5" weight="bold" style={{ color: riskColor }}>-$12.4k</Text>
              <Text size="1" color="muted">This month</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius={cardBorderRadius.toString() as any}>
              <Text size="1" color="muted">New Business MRR</Text>
              <Text size="5" weight="bold" style={{ color: opportunityColor }}>+$156.8k</Text>
              <Text size="1" color="muted">This month</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius={cardBorderRadius.toString() as any}>
              <Text size="1" color="muted">Churned MRR</Text>
              <Text size="5" weight="bold" style={{ color: riskColor }}>-$52.3k</Text>
              <Text size="1" color="muted">This month</Text>
            </Column>
            <Column padding="4" backgroundColor="2" borderRadius={cardBorderRadius.toString() as any}>
              <Text size="1" color="muted">Net New MRR</Text>
              <Text size="5" weight="bold" style={{ color: revenueColor }}>+$179.3k</Text>
              <Text size="1" color="muted">This month</Text>
            </Column>
          </Grid>
        </Panel>
      </Column>
    </PageBody>
  );
}

export default function RevenueOperationsPage() {
  return (
    <DialsProvider projectId="revenue-operations">
      <RevenueOperationsDashboard />
    </DialsProvider>
  );
}
