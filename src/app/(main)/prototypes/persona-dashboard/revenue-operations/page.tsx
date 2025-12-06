'use client';

import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongCurrency, formatCurrency } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';

// Mock data for MRR growth over time (monthly)
const mrrGrowthData = {
  __id: Date.now(),
  datasets: [
    {
      type: 'bar' as const,
      label: 'MRR',
      data: [
        { x: '2024-01', y: 142500, d: '2024-01-01' },
        { x: '2024-02', y: 156800, d: '2024-02-01' },
        { x: '2024-03', y: 168200, d: '2024-03-01' },
        { x: '2024-04', y: 175400, d: '2024-04-01' },
        { x: '2024-05', y: 189600, d: '2024-05-01' },
        { x: '2024-06', y: 198500, d: '2024-06-01' },
        { x: '2024-07', y: 215800, d: '2024-07-01' },
        { x: '2024-08', y: 228400, d: '2024-08-01' },
        { x: '2024-09', y: 242100, d: '2024-09-01' },
        { x: '2024-10', y: 256800, d: '2024-10-01' },
        { x: '2024-11', y: 271500, d: '2024-11-01' },
      ],
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
      order: 2,
    },
    {
      type: 'line' as const,
      label: 'Expansion',
      data: [
        { x: '2024-01', y: 12400, d: '2024-01-01' },
        { x: '2024-02', y: 14200, d: '2024-02-01' },
        { x: '2024-03', y: 11800, d: '2024-03-01' },
        { x: '2024-04', y: 15600, d: '2024-04-01' },
        { x: '2024-05', y: 18900, d: '2024-05-01' },
        { x: '2024-06', y: 16200, d: '2024-06-01' },
        { x: '2024-07', y: 21400, d: '2024-07-01' },
        { x: '2024-08', y: 19800, d: '2024-08-01' },
        { x: '2024-09', y: 22600, d: '2024-09-01' },
        { x: '2024-10', y: 24100, d: '2024-10-01' },
        { x: '2024-11', y: 26800, d: '2024-11-01' },
      ],
      backgroundColor: CHART_COLORS[2],
      borderColor: CHART_COLORS[2],
      borderWidth: 2,
      order: 1,
    },
  ],
};

// Pipeline stages breakdown (doughnut chart)
const pipelineStagesData = {
  labels: ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closing'],
  datasets: [
    {
      label: 'Pipeline Value',
      data: [485000, 672000, 890000, 445000, 218000],
      backgroundColor: [
        CHART_COLORS[0],
        CHART_COLORS[1],
        CHART_COLORS[2],
        CHART_COLORS[3],
        CHART_COLORS[4],
      ],
      borderColor: 'transparent',
      borderWidth: 0,
    },
  ],
};

// Revenue by plan tier
const revenueByPlanData = {
  __id: Date.now() + 1,
  datasets: [
    {
      type: 'bar' as const,
      label: 'Revenue',
      data: [
        { x: '2024-08', y: 48200, d: '2024-08-01' },
        { x: '2024-09', y: 52400, d: '2024-09-01' },
        { x: '2024-10', y: 56100, d: '2024-10-01' },
        { x: '2024-11', y: 61800, d: '2024-11-01' },
      ],
      backgroundColor: CHART_COLORS[5],
      borderColor: CHART_COLORS[5],
      borderWidth: 1,
    },
  ],
};

// Churn reasons breakdown
const churnReasonsData = {
  labels: ['Price', 'Competitor', 'No longer needed', 'Poor support', 'Missing features'],
  datasets: [
    {
      label: 'Churned Accounts',
      data: [12, 8, 15, 4, 9],
      backgroundColor: [
        CHART_COLORS[4],
        CHART_COLORS[3],
        CHART_COLORS[6],
        CHART_COLORS[7],
        CHART_COLORS[8],
      ],
      borderColor: 'transparent',
      borderWidth: 0,
    },
  ],
};

// Top accounts by revenue
const topAccountsData = [
  { label: 'Meridian Healthcare Systems', count: 48500, percent: 18 },
  { label: 'Apex Financial Group', count: 42200, percent: 16 },
  { label: 'TechVision Industries', count: 38900, percent: 14 },
  { label: 'Global Logistics Partners', count: 35600, percent: 13 },
  { label: 'Quantum Data Solutions', count: 32100, percent: 12 },
  { label: 'Sterling Manufacturing Co.', count: 28400, percent: 10 },
  { label: 'Riverdale Consulting', count: 24800, percent: 9 },
  { label: 'Pacific Rim Trading', count: 20500, percent: 8 },
];

// At-risk accounts
const atRiskAccountsData = [
  { label: 'Westfield Retail Group', count: 18200, percent: 85 },
  { label: 'Northern Analytics LLC', count: 15800, percent: 72 },
  { label: 'Coastal Media Networks', count: 14200, percent: 68 },
  { label: 'Summit Engineering Corp', count: 12600, percent: 61 },
  { label: 'Valley Tech Innovations', count: 11400, percent: 55 },
];

// Pipeline deals
const pipelineDealsData = [
  { label: 'Enterprise deal - Fortis Bank', count: 145000, percent: 75 },
  { label: 'Mid-market - DataStream Inc', count: 68000, percent: 60 },
  { label: 'Enterprise deal - Aegis Insurance', count: 122000, percent: 45 },
  { label: 'Mid-market - CloudNine Systems', count: 54000, percent: 80 },
  { label: 'SMB bundle - Regional hospitals', count: 38000, percent: 90 },
  { label: 'Enterprise deal - Nexus Telecom', count: 98000, percent: 35 },
];

// Recent expansion revenue
const expansionDealsData = [
  { label: 'Meridian Healthcare - seat upgrade', count: 8400, percent: 100 },
  { label: 'TechVision Industries - API tier', count: 6200, percent: 100 },
  { label: 'Global Logistics - enterprise add-on', count: 12800, percent: 100 },
  { label: 'Apex Financial - compliance module', count: 9600, percent: 100 },
];

const formatCurrencyValue = (n: number) => formatCurrency(n, 'USD');
const formatCurrencyShort = (n: number) => formatLongCurrency(n, 'USD');

export default function RevenueOperationsPage() {
  // === DIALS: Layout & Spacing ===
  const sectionGap = useDynamicSpacing('ro-section-gap', {
    label: 'Section Gap',
    group: 'Layout',
    default: '24px',
    options: ['16px', '24px', '32px', '40px'],
  });

  const panelPadding = useDynamicSpacing('ro-panel-padding', {
    label: 'Panel Padding',
    group: 'Layout',
    default: '24px',
    options: ['16px', '20px', '24px', '32px'],
  });

  const metricsColumns = useDynamicVariant('ro-metrics-columns', {
    label: 'Metrics Columns',
    group: 'Layout',
    default: '6',
    options: ['4', '5', '6'] as const,
  });

  // === DIALS: Typography ===
  const metricValueSize = useDynamicVariant('ro-metric-value-size', {
    label: 'Metric Value Size',
    group: 'Typography',
    default: '7',
    options: ['6', '7', '8'] as const,
  });

  const headingSize = useDynamicVariant('ro-heading-size', {
    label: 'Heading Size',
    group: 'Typography',
    default: '2',
    options: ['1', '2', '3'] as const,
  });

  // === DIALS: Colors ===
  const revenueColor = useDynamicColor('ro-revenue-color', {
    label: 'Revenue Chart Color',
    group: 'Colors',
    default: CHART_COLORS[0],
    options: [CHART_COLORS[0], '#30a46c', '#3e63dd', '#0090ff'],
    allowCustom: true,
  });

  const expansionColor = useDynamicColor('ro-expansion-color', {
    label: 'Expansion Color',
    group: 'Colors',
    default: CHART_COLORS[2],
    options: [CHART_COLORS[2], '#30a46c', '#12a594', '#0090ff'],
    allowCustom: true,
  });

  const churnColor = useDynamicColor('ro-churn-color', {
    label: 'Churn/Risk Color',
    group: 'Colors',
    default: CHART_COLORS[4],
    options: [CHART_COLORS[4], '#f76b15', '#e5484d', '#d6409f'],
    allowCustom: true,
  });

  // === DIALS: Visualization ===
  const chartHeight = useDynamicNumber('ro-chart-height', {
    label: 'Main Chart Height',
    group: 'Visualization',
    default: 320,
    min: 240,
    max: 480,
    step: 40,
    unit: 'px',
  });

  const pieChartType = useDynamicVariant('ro-pie-chart-type', {
    label: 'Pipeline Chart Style',
    group: 'Visualization',
    default: 'doughnut',
    options: ['pie', 'doughnut'] as const,
  });

  const showAtRiskAccounts = useDynamicBoolean('ro-show-at-risk', {
    label: 'Show At-Risk Accounts',
    group: 'Features',
    default: true,
  });

  const showPipelineDeals = useDynamicBoolean('ro-show-pipeline', {
    label: 'Show Pipeline Deals',
    group: 'Features',
    default: true,
  });

  const tableItemCount = useDynamicNumber('ro-table-items', {
    label: 'Table Items',
    group: 'Visualization',
    default: 5,
    min: 3,
    max: 10,
    step: 1,
  });

  return (
    <PageBody>
      <Column gap="6" style={{ gap: sectionGap }}>
        <PageHeader
          title="Revenue Operations"
          description="Pipeline health, revenue metrics, and customer value insights for Sales and CSM teams"
        />

        {/* Key Revenue Metrics */}
        <MetricsBar>
          <MetricCard
            label="MRR"
            value={271500}
            change={256800}
            formatValue={formatCurrencyShort}
            showLabel
            showChange
          />
          <MetricCard
            label="ARR"
            value={3258000}
            change={3081600}
            formatValue={formatCurrencyShort}
            showLabel
            showChange
          />
          <MetricCard
            label="Pipeline Value"
            value={2710000}
            change={2480000}
            formatValue={formatCurrencyShort}
            showLabel
            showChange
          />
          <MetricCard
            label="Avg Deal Size"
            value={42800}
            change={38200}
            formatValue={formatCurrencyShort}
            showLabel
            showChange
          />
          <MetricCard
            label="NRR"
            value={112}
            change={108}
            formatValue={(n: number) => `${n.toFixed(0)}%`}
            showLabel
            showChange
          />
          <MetricCard
            label="Churn Rate"
            value={2.4}
            change={2.8}
            formatValue={(n: number) => `${n.toFixed(1)}%`}
            showLabel
            showChange
            reverseColors
          />
        </MetricsBar>

        {/* MRR Growth Chart */}
        <Panel title="Monthly Recurring Revenue Trend">
          <BarChart
            chartData={mrrGrowthData}
            unit="month"
            height={320}
            currency="USD"
            stacked={false}
          />
          <Row gap="6" justifyContent="center" paddingTop="3">
            <Row gap="2" alignItems="center">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: CHART_COLORS[0],
                }}
              />
              <Text size="1" color="muted">
                MRR
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: CHART_COLORS[2],
                }}
              />
              <Text size="1" color="muted">
                Expansion Revenue
              </Text>
            </Row>
          </Row>
        </Panel>

        {/* Pipeline and Revenue Breakdown */}
        <GridRow layout="two">
          <Panel title="Pipeline by Stage">
            <Column alignItems="center" paddingY="4">
              <div style={{ width: 280, height: 280 }}>
                <PieChart chartData={pipelineStagesData} type="doughnut" />
              </div>
            </Column>
            <Grid columns="1fr 1fr" gap="3" paddingTop="3">
              {pipelineStagesData.labels.map((label, idx) => (
                <Row key={label} gap="2" alignItems="center">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: pipelineStagesData.datasets[0].backgroundColor[idx],
                    }}
                  />
                  <Text size="1" color="muted">
                    {label}
                  </Text>
                  <Text size="1" weight="bold">
                    {formatCurrencyShort(pipelineStagesData.datasets[0].data[idx])}
                  </Text>
                </Row>
              ))}
            </Grid>
          </Panel>

          <Panel title="Churn Analysis">
            <Column alignItems="center" paddingY="4">
              <div style={{ width: 280, height: 280 }}>
                <PieChart chartData={churnReasonsData} type="pie" />
              </div>
            </Column>
            <Row justifyContent="space-between" paddingTop="3">
              <Column gap="1">
                <Text size="1" color="muted">
                  Total Churned (YTD)
                </Text>
                <Text size="4" weight="bold">
                  48 accounts
                </Text>
              </Column>
              <Column gap="1" alignItems="flex-end">
                <Text size="1" color="muted">
                  Revenue Lost
                </Text>
                <Text size="4" weight="bold" style={{ color: CHART_COLORS[4] }}>
                  {formatCurrencyShort(186400)}
                </Text>
              </Column>
            </Row>
          </Panel>
        </GridRow>

        {/* Customer LTV and Segments */}
        <GridRow layout="three">
          <Panel>
            <Column gap="4">
              <Heading size="2">Customer LTV</Heading>
              <Grid columns="1fr 1fr" gap="4">
                <Column
                  gap="1"
                  padding="4"
                  borderRadius="2"
                  style={{ backgroundColor: 'var(--base-color-fill)' }}
                >
                  <Text size="1" color="muted">
                    Enterprise
                  </Text>
                  <Text size="5" weight="bold">
                    {formatCurrencyShort(248000)}
                  </Text>
                </Column>
                <Column
                  gap="1"
                  padding="4"
                  borderRadius="2"
                  style={{ backgroundColor: 'var(--base-color-fill)' }}
                >
                  <Text size="1" color="muted">
                    Mid-Market
                  </Text>
                  <Text size="5" weight="bold">
                    {formatCurrencyShort(86500)}
                  </Text>
                </Column>
                <Column
                  gap="1"
                  padding="4"
                  borderRadius="2"
                  style={{ backgroundColor: 'var(--base-color-fill)' }}
                >
                  <Text size="1" color="muted">
                    SMB
                  </Text>
                  <Text size="5" weight="bold">
                    {formatCurrencyShort(24200)}
                  </Text>
                </Column>
                <Column
                  gap="1"
                  padding="4"
                  borderRadius="2"
                  style={{ backgroundColor: 'var(--base-color-fill)' }}
                >
                  <Text size="1" color="muted">
                    Blended Avg
                  </Text>
                  <Text size="5" weight="bold">
                    {formatCurrencyShort(72400)}
                  </Text>
                </Column>
              </Grid>
            </Column>
          </Panel>

          <Panel>
            <Column gap="4">
              <Heading size="2">Revenue Mix</Heading>
              <Column gap="3">
                <Row justifyContent="space-between" alignItems="center">
                  <Text size="2">New Business</Text>
                  <Text size="2" weight="bold">
                    {formatCurrencyShort(142800)}
                  </Text>
                </Row>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'var(--base-color-fill)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '52%',
                      height: '100%',
                      backgroundColor: CHART_COLORS[0],
                    }}
                  />
                </div>
                <Row justifyContent="space-between" alignItems="center">
                  <Text size="2">Expansion</Text>
                  <Text size="2" weight="bold">
                    {formatCurrencyShort(98200)}
                  </Text>
                </Row>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'var(--base-color-fill)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '36%',
                      height: '100%',
                      backgroundColor: CHART_COLORS[2],
                    }}
                  />
                </div>
                <Row justifyContent="space-between" alignItems="center">
                  <Text size="2">Renewals</Text>
                  <Text size="2" weight="bold">
                    {formatCurrencyShort(30500)}
                  </Text>
                </Row>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'var(--base-color-fill)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '12%',
                      height: '100%',
                      backgroundColor: CHART_COLORS[1],
                    }}
                  />
                </div>
              </Column>
            </Column>
          </Panel>

          <Panel>
            <Column gap="4">
              <Heading size="2">Win Rates</Heading>
              <Column gap="4">
                <Column gap="2">
                  <Row justifyContent="space-between">
                    <Text size="2">Enterprise</Text>
                    <Text size="2" weight="bold" style={{ color: CHART_COLORS[2] }}>
                      32%
                    </Text>
                  </Row>
                  <div
                    style={{
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: 'var(--base-color-fill)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '32%',
                        height: '100%',
                        backgroundColor: CHART_COLORS[2],
                      }}
                    />
                  </div>
                </Column>
                <Column gap="2">
                  <Row justifyContent="space-between">
                    <Text size="2">Mid-Market</Text>
                    <Text size="2" weight="bold" style={{ color: CHART_COLORS[0] }}>
                      45%
                    </Text>
                  </Row>
                  <div
                    style={{
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: 'var(--base-color-fill)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '45%',
                        height: '100%',
                        backgroundColor: CHART_COLORS[0],
                      }}
                    />
                  </div>
                </Column>
                <Column gap="2">
                  <Row justifyContent="space-between">
                    <Text size="2">SMB</Text>
                    <Text size="2" weight="bold" style={{ color: CHART_COLORS[1] }}>
                      58%
                    </Text>
                  </Row>
                  <div
                    style={{
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: 'var(--base-color-fill)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: '58%',
                        height: '100%',
                        backgroundColor: CHART_COLORS[1],
                      }}
                    />
                  </div>
                </Column>
              </Column>
            </Column>
          </Panel>
        </GridRow>

        {/* Tables Row */}
        <GridRow layout="two">
          <Panel>
            <ListTable
              data={topAccountsData}
              title="Top Accounts by MRR"
              metric="MRR"
              currency="USD"
              showPercentage={false}
            />
          </Panel>

          <Panel>
            <ListTable
              data={atRiskAccountsData}
              title="At-Risk Accounts"
              metric="Risk Score"
              currency="USD"
              showPercentage
              renderLabel={(row) => (
                <Row gap="2" alignItems="center">
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor:
                        row.percent >= 70
                          ? CHART_COLORS[4]
                          : row.percent >= 50
                            ? CHART_COLORS[3]
                            : CHART_COLORS[5],
                    }}
                  />
                  <Text>{row.label}</Text>
                </Row>
              )}
            />
          </Panel>
        </GridRow>

        {/* Pipeline and Expansion */}
        <GridRow layout="two">
          <Panel>
            <ListTable
              data={pipelineDealsData}
              title="Active Pipeline Deals"
              metric="Win Prob"
              currency="USD"
              showPercentage
              renderLabel={(row) => (
                <Column gap="1">
                  <Text>{row.label}</Text>
                  <Text size="1" color="muted">
                    {formatCurrencyValue(row.count)}
                  </Text>
                </Column>
              )}
            />
          </Panel>

          <Panel>
            <ListTable
              data={expansionDealsData}
              title="Recent Expansion Revenue"
              metric="Amount"
              currency="USD"
              showPercentage={false}
            />
            <Row
              justifyContent="space-between"
              paddingTop="4"
              marginTop="4"
              style={{ borderTop: '1px solid var(--base-color-border)' }}
            >
              <Column gap="1">
                <Text size="1" color="muted">
                  Expansion MRR (MTD)
                </Text>
                <Text size="4" weight="bold" style={{ color: CHART_COLORS[2] }}>
                  {formatCurrencyShort(37000)}
                </Text>
              </Column>
              <Column gap="1" alignItems="flex-end">
                <Text size="1" color="muted">
                  vs Last Month
                </Text>
                <Text size="4" weight="bold" style={{ color: CHART_COLORS[2] }}>
                  +18.4%
                </Text>
              </Column>
            </Row>
          </Panel>
        </GridRow>

        {/* Sales Performance Snapshot */}
        <Panel title="Sales Performance Snapshot">
          <Grid columns={{ xs: '1fr', md: 'repeat(5, 1fr)' }} gap="4">
            <Column
              gap="2"
              padding="4"
              borderRadius="2"
              alignItems="center"
              style={{ backgroundColor: 'var(--base-color-fill)' }}
            >
              <Text size="1" color="muted">
                Deals Closed (MTD)
              </Text>
              <Text size="6" weight="bold">
                24
              </Text>
              <Text size="1" style={{ color: CHART_COLORS[2] }}>
                +6 from last month
              </Text>
            </Column>
            <Column
              gap="2"
              padding="4"
              borderRadius="2"
              alignItems="center"
              style={{ backgroundColor: 'var(--base-color-fill)' }}
            >
              <Text size="1" color="muted">
                Avg Sales Cycle
              </Text>
              <Text size="6" weight="bold">
                42 days
              </Text>
              <Text size="1" style={{ color: CHART_COLORS[2] }}>
                -5 days vs Q2
              </Text>
            </Column>
            <Column
              gap="2"
              padding="4"
              borderRadius="2"
              alignItems="center"
              style={{ backgroundColor: 'var(--base-color-fill)' }}
            >
              <Text size="1" color="muted">
                Quota Attainment
              </Text>
              <Text size="6" weight="bold">
                94%
              </Text>
              <Text size="1" color="muted">
                Team average
              </Text>
            </Column>
            <Column
              gap="2"
              padding="4"
              borderRadius="2"
              alignItems="center"
              style={{ backgroundColor: 'var(--base-color-fill)' }}
            >
              <Text size="1" color="muted">
                Demos Scheduled
              </Text>
              <Text size="6" weight="bold">
                67
              </Text>
              <Text size="1" style={{ color: CHART_COLORS[0] }}>
                This week
              </Text>
            </Column>
            <Column
              gap="2"
              padding="4"
              borderRadius="2"
              alignItems="center"
              style={{ backgroundColor: 'var(--base-color-fill)' }}
            >
              <Text size="1" color="muted">
                Proposals Out
              </Text>
              <Text size="6" weight="bold">
                18
              </Text>
              <Text size="1" color="muted">
                {formatCurrencyShort(890000)} value
              </Text>
            </Column>
          </Grid>
        </Panel>
      </Column>
    </PageBody>
  );
}
