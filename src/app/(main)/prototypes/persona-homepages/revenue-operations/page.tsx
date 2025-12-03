'use client';

import { Column, Row, Grid, Text, Heading, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { ListTable } from '@/components/metrics/ListTable';
import { Chart } from '@/components/charts/Chart';
import { PieChart } from '@/components/charts/PieChart';
import {
  useDynamicBoolean,
  useDynamicVariant,
} from '@niteshift/dials';

// Chart colors from design system
const CHART_COLORS = [
  '#2680eb',
  '#9256d9',
  '#44b556',
  '#e68619',
  '#e34850',
  '#f7bd12',
  '#01bad7',
  '#6734bc',
];

// Risk level colors
const RISK_COLORS = {
  high: '#e5484d',
  medium: '#f76b15',
  low: '#30a46c',
};

// Mock data for revenue metrics
const revenueMetrics = {
  mrr: 847500,
  arr: 10170000,
  nrr: 112,
  grr: 94,
  totalCustomers: 342,
  acv: 29736,
  churnRate: 2.4,
  pipelineValue: 2350000,
};

// Revenue by segment data for pie chart
const revenueBySegment = {
  labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
  datasets: [
    {
      data: [4250000, 3120000, 1980000, 820000],
      backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3]],
      borderColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3]],
    },
  ],
};

// Monthly revenue trend (last 12 months) - using category axis instead of timeseries
const monthlyRevenueTrend = {
  labels: [
    'Jan 2024',
    'Feb 2024',
    'Mar 2024',
    'Apr 2024',
    'May 2024',
    'Jun 2024',
    'Jul 2024',
    'Aug 2024',
    'Sep 2024',
    'Oct 2024',
    'Nov 2024',
    'Dec 2024',
  ],
  datasets: [
    {
      label: 'MRR',
      data: [
        { x: 'Jan 2024', y: 678000 },
        { x: 'Feb 2024', y: 695000 },
        { x: 'Mar 2024', y: 712000 },
        { x: 'Apr 2024', y: 738000 },
        { x: 'May 2024', y: 756000 },
        { x: 'Jun 2024', y: 774000 },
        { x: 'Jul 2024', y: 789000 },
        { x: 'Aug 2024', y: 802000 },
        { x: 'Sep 2024', y: 818000 },
        { x: 'Oct 2024', y: 829000 },
        { x: 'Nov 2024', y: 838000 },
        { x: 'Dec 2024', y: 847500 },
      ],
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
    },
  ],
};

// Top accounts by ARR
const topAccounts = [
  { label: 'Meridian Technologies', count: 480000, percent: 100 },
  { label: 'Apex Global Holdings', count: 425000, percent: 89 },
  { label: 'Quantum Systems Inc', count: 385000, percent: 80 },
  { label: 'Stellar Dynamics', count: 352000, percent: 73 },
  { label: 'NorthStar Enterprises', count: 318000, percent: 66 },
  { label: 'Citadel Partners', count: 295000, percent: 61 },
  { label: 'Vanguard Solutions', count: 272000, percent: 57 },
  { label: 'Pacific Rim Industries', count: 248000, percent: 52 },
];

// Pipeline stages
const pipelineStages = [
  { label: 'Discovery', count: 420000, percent: 100 },
  { label: 'Qualification', count: 680000, percent: 81 },
  { label: 'Proposal', count: 540000, percent: 64 },
  { label: 'Negotiation', count: 410000, percent: 49 },
  { label: 'Closing', count: 300000, percent: 36 },
];

// Customer segments
const customerSegments = [
  { label: 'Enterprise (>$100K ARR)', count: 48, percent: 100 },
  { label: 'Mid-Market ($25K-$100K)', count: 94, percent: 71 },
  { label: 'SMB ($5K-$25K)', count: 138, percent: 52 },
  { label: 'Startup (<$5K)', count: 62, percent: 23 },
];

// At-risk accounts
interface AtRiskAccount {
  name: string;
  arr: number;
  healthScore: number;
  lastActivity: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
}

const atRiskAccounts: AtRiskAccount[] = [
  {
    name: 'DataStream Analytics',
    arr: 156000,
    healthScore: 32,
    lastActivity: '45 days ago',
    riskLevel: 'high',
    riskFactors: ['No login 30+ days', 'Support tickets escalating', 'Champion left'],
  },
  {
    name: 'CloudNine Solutions',
    arr: 98000,
    healthScore: 41,
    lastActivity: '28 days ago',
    riskLevel: 'high',
    riskFactors: ['Usage down 60%', 'Contract renewal in 30 days'],
  },
  {
    name: 'Pinnacle Software',
    arr: 72000,
    healthScore: 55,
    lastActivity: '14 days ago',
    riskLevel: 'medium',
    riskFactors: ['Competitor evaluation', 'Budget concerns raised'],
  },
  {
    name: 'Harbor Tech Group',
    arr: 64000,
    healthScore: 58,
    lastActivity: '10 days ago',
    riskLevel: 'medium',
    riskFactors: ['Feature requests unmet', 'NPS score dropped'],
  },
  {
    name: 'Summit Industries',
    arr: 45000,
    healthScore: 68,
    lastActivity: '5 days ago',
    riskLevel: 'low',
    riskFactors: ['Minor support issues'],
  },
];

// Recent activity for accounts
const recentActivity = [
  { label: 'Meridian Tech renewed - 2yr extension', count: 960000, percent: 100 },
  { label: 'Apex Global upsell closed', count: 125000, percent: 52 },
  { label: 'Quantum Systems expansion', count: 85000, percent: 35 },
  { label: 'NorthStar pilot converted', count: 48000, percent: 20 },
  { label: 'Vanguard added seats', count: 32000, percent: 13 },
];

function formatCurrency(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

function formatPercent(n: number): string {
  return `${n}%`;
}

// Health score indicator component
function HealthScoreIndicator({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const color = score >= 70 ? RISK_COLORS.low : score >= 50 ? RISK_COLORS.medium : RISK_COLORS.high;
  const dimension = size === 'sm' ? 28 : 36;

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        borderRadius: '50%',
        border: `3px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size === 'sm' ? 10 : 12,
        color,
      }}
    >
      {score}
    </div>
  );
}

// Risk badge component
function RiskBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const color = RISK_COLORS[level];
  const labels = { high: 'High Risk', medium: 'Medium', low: 'Low' };

  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 9999,
        backgroundColor: `${color}20`,
        color,
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {labels[level]}
    </span>
  );
}

// At-risk account card
function AtRiskAccountCard({ account }: { account: AtRiskAccount }) {
  return (
    <Column
      gap="3"
      padding="4"
      backgroundColor
      border
      borderRadius="2"
      style={{
        borderLeft: `4px solid ${RISK_COLORS[account.riskLevel]}`,
        animation: 'fadeSlideIn 0.4s ease-out backwards',
      }}
    >
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Text weight="semibold">{account.name}</Text>
          <Text size="1" color="muted">
            {formatCurrency(account.arr)} ARR
          </Text>
        </Column>
        <Row gap="3" alignItems="center">
          <HealthScoreIndicator score={account.healthScore} size="sm" />
          <RiskBadge level={account.riskLevel} />
        </Row>
      </Row>
      <Row gap="2" style={{ flexWrap: 'wrap' }}>
        {account.riskFactors.map((factor, idx) => (
          <span
            key={idx}
            style={{
              padding: '2px 6px',
              backgroundColor: 'var(--base200)',
              borderRadius: 4,
              fontSize: 10,
              color: 'var(--base700)',
            }}
          >
            {factor}
          </span>
        ))}
      </Row>
      <Text size="0" color="muted">
        Last activity: {account.lastActivity}
      </Text>
    </Column>
  );
}

// Pipeline stage bar visualization
function PipelineBar() {
  const stages = [
    { name: 'Discovery', value: 420000, color: CHART_COLORS[0] },
    { name: 'Qualification', value: 680000, color: CHART_COLORS[1] },
    { name: 'Proposal', value: 540000, color: CHART_COLORS[2] },
    { name: 'Negotiation', value: 410000, color: CHART_COLORS[3] },
    { name: 'Closing', value: 300000, color: CHART_COLORS[4] },
  ];

  const total = stages.reduce((sum, s) => sum + s.value, 0);

  return (
    <Column gap="3">
      <Row style={{ height: 40, borderRadius: 8, overflow: 'hidden' }}>
        {stages.map((stage, idx) => (
          <div
            key={stage.name}
            style={{
              width: `${(stage.value / total) * 100}%`,
              height: '100%',
              backgroundColor: stage.color,
              transition: 'transform 0.2s ease',
              cursor: 'pointer',
              animation: `growWidth 0.6s ease-out ${idx * 0.1}s backwards`,
            }}
            title={`${stage.name}: ${formatCurrency(stage.value)}`}
          />
        ))}
      </Row>
      <Row justifyContent="space-between" style={{ flexWrap: 'wrap', gap: 8 }}>
        {stages.map(stage => (
          <Row key={stage.name} gap="2" alignItems="center">
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                backgroundColor: stage.color,
              }}
            />
            <Column>
              <Text size="0" color="muted">
                {stage.name}
              </Text>
              <Text size="1" weight="semibold">
                {formatCurrency(stage.value)}
              </Text>
            </Column>
          </Row>
        ))}
      </Row>
    </Column>
  );
}

// Retention gauge
function RetentionGauge({ value, label, target }: { value: number; label: string; target: number }) {
  const percentage = Math.min(value, 150);
  const isAboveTarget = value >= target;
  const color = isAboveTarget ? RISK_COLORS.low : RISK_COLORS.medium;

  return (
    <Column gap="2" alignItems="center" padding="4">
      <div
        style={{
          position: 'relative',
          width: 100,
          height: 50,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '8px solid var(--base200)',
            borderBottomColor: 'transparent',
            borderRightColor: 'transparent',
            transform: 'rotate(-45deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '8px solid transparent',
            borderTopColor: color,
            borderLeftColor: color,
            transform: `rotate(${-45 + (percentage / 150) * 180}deg)`,
            transition: 'transform 1s ease-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Text size="5" weight="bold" style={{ color }}>
            {value}%
          </Text>
        </div>
      </div>
      <Text size="1" weight="semibold">
        {label}
      </Text>
      <Text size="0" color="muted">
        Target: {target}%
      </Text>
    </Column>
  );
}

export default function RevenueOperationsDashboard() {
  // Dials for customization
  const showPipeline = useDynamicBoolean('show-pipeline', {
    label: 'Show Pipeline',
    description: 'Display pipeline visualization section',
    default: true,
    group: 'Sections',
  });

  const showAtRisk = useDynamicBoolean('show-at-risk', {
    label: 'Show At-Risk Accounts',
    description: 'Display at-risk customer accounts',
    default: true,
    group: 'Sections',
  });

  const showSegmentation = useDynamicBoolean('show-segmentation', {
    label: 'Show Segmentation',
    description: 'Display customer segmentation breakdown',
    default: true,
    group: 'Sections',
  });

  const timePeriod = useDynamicVariant('time-period', {
    label: 'Time Period',
    description: 'Select the analysis time period',
    default: 'month',
    options: ['week', 'month', 'quarter', 'year'] as const,
    group: 'Display',
  });

  const chartType = useDynamicVariant('segment-chart-type', {
    label: 'Segment Chart Type',
    description: 'Choose pie or doughnut chart for segments',
    default: 'doughnut',
    options: ['pie', 'doughnut'] as const,
    group: 'Display',
  });

  return (
    <PageBody>
      <style>
        {`
          @keyframes fadeSlideIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes growWidth {
            from {
              transform: scaleX(0);
            }
            to {
              transform: scaleX(1);
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }
        `}
      </style>

      <PageHeader
        title="Revenue Operations"
        description="Track MRR, customer health, pipeline, and retention metrics"
      />

      <Column gap="6">
        {/* Primary Revenue Metrics */}
        <MetricsBar>
          <div style={{ animation: 'fadeSlideIn 0.3s ease-out backwards' }}>
            <MetricCard
              value={revenueMetrics.mrr}
              label="Monthly Recurring Revenue"
              formatValue={formatCurrency}
              change={38500}
              showChange
            />
          </div>
          <div style={{ animation: 'fadeSlideIn 0.3s ease-out 0.05s backwards' }}>
            <MetricCard
              value={revenueMetrics.arr}
              label="Annual Recurring Revenue"
              formatValue={formatCurrency}
              valueSize="7"
            />
          </div>
          <div style={{ animation: 'fadeSlideIn 0.3s ease-out 0.1s backwards' }}>
            <MetricCard
              value={revenueMetrics.totalCustomers}
              label="Active Customers"
              change={12}
              showChange
            />
          </div>
          <div style={{ animation: 'fadeSlideIn 0.3s ease-out 0.15s backwards' }}>
            <MetricCard
              value={revenueMetrics.acv}
              label="Avg Contract Value"
              formatValue={formatCurrency}
            />
          </div>
        </MetricsBar>

        {/* Retention and Health Metrics Row */}
        <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="6">
          <Panel title="Revenue Retention">
            <Row justifyContent="space-around" paddingY="4">
              <RetentionGauge value={revenueMetrics.nrr} label="Net Revenue Retention" target={100} />
              <RetentionGauge
                value={revenueMetrics.grr}
                label="Gross Revenue Retention"
                target={90}
              />
            </Row>
            <Row justifyContent="center" gap="6" paddingTop="2">
              <Column alignItems="center">
                <Text size="0" color="muted">
                  Churn Rate
                </Text>
                <Text size="4" weight="bold" style={{ color: RISK_COLORS.medium }}>
                  {revenueMetrics.churnRate}%
                </Text>
              </Column>
              <Column alignItems="center">
                <Text size="0" color="muted">
                  Expansion Revenue
                </Text>
                <Text size="4" weight="bold" style={{ color: RISK_COLORS.low }}>
                  +$142K
                </Text>
              </Column>
            </Row>
          </Panel>

          {showSegmentation && (
            <Panel title="Revenue by Segment">
              <Row alignItems="center" gap="4">
                <div style={{ width: 180, height: 180 }}>
                  <PieChart
                    type={chartType as 'pie' | 'doughnut'}
                    chartData={revenueBySegment}
                  />
                </div>
                <Column gap="3" style={{ flex: 1 }}>
                  {revenueBySegment.labels.map((label, idx) => (
                    <Row
                      key={label}
                      justifyContent="space-between"
                      alignItems="center"
                      style={{
                        animation: `fadeSlideIn 0.3s ease-out ${idx * 0.1}s backwards`,
                      }}
                    >
                      <Row gap="2" alignItems="center">
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 2,
                            backgroundColor: CHART_COLORS[idx],
                          }}
                        />
                        <Text size="1">{label}</Text>
                      </Row>
                      <Text size="1" weight="semibold">
                        {formatCurrency(revenueBySegment.datasets[0].data[idx])}
                      </Text>
                    </Row>
                  ))}
                </Column>
              </Row>
            </Panel>
          )}
        </Grid>

        {/* Pipeline Section */}
        {showPipeline && (
          <Panel title="Sales Pipeline">
            <Row justifyContent="space-between" alignItems="center" paddingBottom="4">
              <Column>
                <Text size="6" weight="bold">
                  {formatCurrency(revenueMetrics.pipelineValue)}
                </Text>
                <Text size="1" color="muted">
                  Total Pipeline Value
                </Text>
              </Column>
              <Row gap="4">
                <Column alignItems="center">
                  <Text size="3" weight="semibold">
                    47
                  </Text>
                  <Text size="0" color="muted">
                    Open Deals
                  </Text>
                </Column>
                <Column alignItems="center">
                  <Text size="3" weight="semibold">
                    32%
                  </Text>
                  <Text size="0" color="muted">
                    Win Rate
                  </Text>
                </Column>
                <Column alignItems="center">
                  <Text size="3" weight="semibold">
                    38 days
                  </Text>
                  <Text size="0" color="muted">
                    Avg Cycle
                  </Text>
                </Column>
              </Row>
            </Row>
            <PipelineBar />
          </Panel>
        )}

        {/* Revenue Trend Chart */}
        <Panel title="Monthly Revenue Trend">
          <div style={{ height: 300 }}>
            <Chart type="bar" chartData={monthlyRevenueTrend} />
          </div>
        </Panel>

        {/* Bottom Grid: Top Accounts, At-Risk, Activity */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
          <Panel title="Top Accounts by ARR">
            <ListTable
              data={topAccounts}
              title="Account"
              metric="ARR"
              currency="USD"
              showPercentage={false}
            />
          </Panel>

          {showAtRisk && (
            <Panel title="At-Risk Accounts">
              <Column gap="3">
                <Row justifyContent="space-between" alignItems="center" paddingBottom="2">
                  <Row gap="2" alignItems="center">
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: RISK_COLORS.high,
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <Text size="1" weight="semibold" style={{ color: RISK_COLORS.high }}>
                      {formatCurrency(
                        atRiskAccounts
                          .filter(a => a.riskLevel === 'high')
                          .reduce((sum, a) => sum + a.arr, 0),
                      )}{' '}
                      ARR at High Risk
                    </Text>
                  </Row>
                </Row>
                {atRiskAccounts.slice(0, 4).map((account, idx) => (
                  <div
                    key={account.name}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <AtRiskAccountCard account={account} />
                  </div>
                ))}
              </Column>
            </Panel>
          )}
        </Grid>

        {/* Customer Segments and Recent Activity */}
        <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="6">
          <Panel title="Customer Segments">
            <ListTable
              data={customerSegments}
              title="Segment"
              metric="Customers"
              showPercentage
            />
          </Panel>

          <Panel title="Recent Account Activity">
            <ListTable
              data={recentActivity}
              title="Activity"
              metric="Value"
              currency="USD"
              showPercentage={false}
            />
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
