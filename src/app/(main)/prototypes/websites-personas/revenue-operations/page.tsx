'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Text, Box } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { ListTable } from '@/components/metrics/ListTable';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicSpacing,
  useDynamicBoolean,
} from '@niteshift/dials';

// Chart colors from the design system
const CHART_COLORS = [
  '#2680eb',
  '#9256d9',
  '#44b556',
  '#e68619',
  '#e34850',
  '#f7bd12',
  '#01bad7',
  '#6734bc',
  '#89c541',
  '#ffc301',
  '#ec1562',
  '#ffec16',
];

// Generate 30 days of date data
const generateDateRange = () => {
  const dates: Date[] = [];
  const startDate = new Date('2024-11-03');
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const dates = generateDateRange();

// Revenue trend data - MRR growth over 30 days
const revenueData = {
  datasets: [
    {
      label: 'MRR',
      data: dates.map((date, i) => ({
        x: date,
        y: 72400 + i * 890 + Math.floor(Math.random() * 1500),
      })),
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
    },
  ],
};

// Pipeline funnel data
const pipelineStages = [
  { stage: 'Website Visitors', count: 48250, color: CHART_COLORS[6] },
  { stage: 'MQLs', count: 524, color: CHART_COLORS[0] },
  { stage: 'SQLs', count: 198, color: CHART_COLORS[1] },
  { stage: 'Opportunities', count: 82, color: CHART_COLORS[2] },
  { stage: 'Closed Won', count: 27, color: CHART_COLORS[3] },
];

// Account health distribution
const healthDistribution = {
  labels: ['Healthy (80-100)', 'Good (60-79)', 'At Risk (40-59)', 'Critical (<40)'],
  datasets: [
    {
      data: [156, 89, 34, 12],
      backgroundColor: [
        'var(--accent-color-green)',
        CHART_COLORS[0],
        'var(--accent-color-orange)',
        'var(--accent-color-red)',
      ],
    },
  ],
};

// At-risk accounts data
const atRiskAccounts = [
  {
    name: 'Meridian Technologies',
    mrr: 4850,
    healthScore: 32,
    riskFactors: ['Usage down 45%', 'No login 14 days'],
    lastContact: '18 days ago',
  },
  {
    name: 'CloudBase Systems',
    mrr: 3200,
    healthScore: 38,
    riskFactors: ['3 open tickets', 'Billing failed'],
    lastContact: '12 days ago',
  },
  {
    name: 'DataFlow Inc',
    mrr: 2950,
    healthScore: 41,
    riskFactors: ['Usage down 32%', 'Contract ending'],
    lastContact: '8 days ago',
  },
  {
    name: 'Apex Solutions',
    mrr: 5400,
    healthScore: 44,
    riskFactors: ['Key champion left'],
    lastContact: '22 days ago',
  },
  {
    name: 'NorthStar Analytics',
    mrr: 1890,
    healthScore: 47,
    riskFactors: ['Downgrade request'],
    lastContact: '5 days ago',
  },
];

// Expansion opportunities
const expansionOpportunities = [
  {
    name: 'TechStart Industries',
    currentMrr: 2400,
    expansionPotential: 3600,
    signals: ['Hitting usage limits', 'Viewed enterprise pricing'],
    engagementTrend: 28,
  },
  {
    name: 'GlobalMedia LLC',
    currentMrr: 4200,
    expansionPotential: 2800,
    signals: ['Added 12 new users', 'API usage up 156%'],
    engagementTrend: 45,
  },
  {
    name: 'Innovate Corp',
    currentMrr: 1800,
    expansionPotential: 4200,
    signals: ['Department expansion', 'Feature requests'],
    engagementTrend: 62,
  },
  {
    name: 'Summit Partners',
    currentMrr: 3600,
    expansionPotential: 1800,
    signals: ['Integrations active', 'High NPS score'],
    engagementTrend: 18,
  },
];

// Traffic to pipeline conversion data
const conversionTrends = {
  datasets: [
    {
      label: 'Visitors to MQL',
      data: dates.map((date, i) => ({
        x: date,
        y: 1.02 + Math.sin(i / 5) * 0.15 + Math.random() * 0.08,
      })),
      backgroundColor: CHART_COLORS[0],
      borderColor: CHART_COLORS[0],
    },
    {
      label: 'MQL to SQL',
      data: dates.map((date, i) => ({
        x: date,
        y: 36.5 + Math.cos(i / 4) * 3 + Math.random() * 2,
      })),
      backgroundColor: CHART_COLORS[1],
      borderColor: CHART_COLORS[1],
    },
  ],
};

// High-value page visits
const highValuePages = [
  { label: '/pricing', count: 2847, percent: 100 },
  { label: '/demo-request', count: 1256, percent: 44 },
  { label: '/enterprise', count: 892, percent: 31 },
  { label: '/case-studies', count: 678, percent: 24 },
  { label: '/features/integrations', count: 534, percent: 19 },
  { label: '/contact-sales', count: 445, percent: 16 },
  { label: '/roi-calculator', count: 312, percent: 11 },
];

// Revenue by source
const revenueBySource = [
  { label: 'Organic Search', count: 34200, percent: 100 },
  { label: 'Direct', count: 28100, percent: 82 },
  { label: 'Paid Search', count: 15400, percent: 45 },
  { label: 'Social', count: 8900, percent: 26 },
  { label: 'Referral', count: 6200, percent: 18 },
  { label: 'Email', count: 4100, percent: 12 },
];

// Styles for the funnel visualization
const funnelBarStyle = (width: number, color: string) => ({
  width: `${width}%`,
  height: '36px',
  backgroundColor: color,
  borderRadius: '4px',
  transition: 'width 0.6s ease-out',
});

// Risk badge component
function RiskBadge({ score }: { score: number }) {
  let bgColor = 'var(--accent-color-green)';
  let label = 'Healthy';

  if (score < 40) {
    bgColor = 'var(--accent-color-red)';
    label = 'Critical';
  } else if (score < 60) {
    bgColor = 'var(--accent-color-orange)';
    label = 'At Risk';
  } else if (score < 80) {
    bgColor = 'var(--accent-color-blue)';
    label = 'Good';
  }

  return (
    <Row
      alignItems="center"
      gap="2"
      style={{
        backgroundColor: `color-mix(in srgb, ${bgColor}, transparent 85%)`,
        color: bgColor,
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: bgColor,
        }}
      />
      {score}
    </Row>
  );
}

export default function RevenueOperationsDashboard() {
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];

  // Calculate funnel conversion rates
  const funnelWithRates = pipelineStages.map((stage, i) => {
    const prevCount = i > 0 ? pipelineStages[i - 1].count : stage.count;
    const rate = i > 0 ? ((stage.count / prevCount) * 100).toFixed(1) : '100';
    return { ...stage, rate };
  });

  // === DIALS: Layout & Spacing ===
  const layoutDensity = useDynamicVariant('ro-layout-density', {
    label: 'Layout Density',
    description: 'Overall information density',
    default: 'default',
    options: ['compact', 'default', 'spacious'] as const,
    group: 'Layout',
  });

  const sectionGap = useDynamicSpacing('ro-section-gap', {
    label: 'Section Gap',
    description: 'Spacing between sections',
    default: '24px',
    options: ['16px', '20px', '24px', '32px', '40px'],
    group: 'Layout',
  });

  // === DIALS: Colors ===
  const revenueColor = useDynamicColor('ro-revenue-color', {
    label: 'Revenue Accent',
    description: 'Primary color for revenue metrics',
    default: '#2680eb',
    options: ['#2680eb', '#44b556', '#9256d9', '#3e63dd'],
    allowCustom: true,
    group: 'Colors',
  });

  const healthyColor = useDynamicColor('ro-healthy-color', {
    label: 'Healthy Status',
    description: 'Color for healthy accounts',
    default: '#30a46c',
    options: ['#30a46c', '#44b556', '#89c541'],
    group: 'Colors',
  });

  const riskColor = useDynamicColor('ro-risk-color', {
    label: 'Risk Status',
    description: 'Color for at-risk indicators',
    default: '#e5484d',
    options: ['#e5484d', '#f76b15', '#ec1562'],
    group: 'Colors',
  });

  // === DIALS: Typography ===
  const headingSize = useDynamicVariant('ro-heading-size', {
    label: 'Heading Size',
    description: 'Font size for section headings',
    default: '4',
    options: ['3', '4', '5'] as const,
    group: 'Typography',
  });

  const headingWeight = useDynamicVariant('ro-heading-weight', {
    label: 'Heading Weight',
    description: 'Font weight for headings',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography',
  });

  // === DIALS: Visualizations ===
  const healthChartType = useDynamicVariant('ro-health-chart', {
    label: 'Health Chart Type',
    description: 'Visualization for account health',
    default: 'doughnut',
    options: ['doughnut', 'pie'] as const,
    group: 'Visualizations',
  });

  const showPipelineFunnel = useDynamicBoolean('ro-show-funnel', {
    label: 'Show Pipeline Funnel',
    description: 'Display pipeline funnel visualization',
    default: true,
    group: 'Visualizations',
  });

  const showAtRiskTable = useDynamicBoolean('ro-show-at-risk', {
    label: 'Show At-Risk Accounts',
    description: 'Display at-risk accounts table',
    default: true,
    group: 'Visualizations',
  });

  const showExpansionCards = useDynamicBoolean('ro-show-expansion', {
    label: 'Show Expansion Opportunities',
    description: 'Display expansion opportunity cards',
    default: true,
    group: 'Visualizations',
  });

  // === DIALS: Components ===
  const metricValueSize = useDynamicVariant('ro-metric-size', {
    label: 'Metric Value Size',
    description: 'Size of metric card values',
    default: '8',
    options: ['6', '7', '8', '9'] as const,
    group: 'Components',
  });

  const showMRRTrend = useDynamicBoolean('ro-show-mrr-trend', {
    label: 'Show MRR Trend Chart',
    description: 'Display MRR growth chart',
    default: true,
    group: 'Components',
  });

  const gapValue = layoutDensity === 'compact' ? '4' : layoutDensity === 'spacious' ? '8' : '6';

  return (
    <Column
      width="100%"
      paddingBottom="6"
      maxWidth="1320px"
      paddingX={{ xs: '3', md: '6' }}
      style={{ margin: '0 auto', ...(sectionGap && { gap: sectionGap }) }}
      gap={gapValue as any}
    >
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center" paddingY="4">
        <Column gap="1">
          <Text size="6" weight="bold">
            Revenue Operations
          </Text>
          <Text color="muted">Pipeline health, account insights, and revenue drivers</Text>
        </Column>
        <Row gap="3" alignItems="center">
          <Text size="1" color="muted">
            Last 30 days
          </Text>
          <Box
            style={{
              padding: '6px 12px',
              backgroundColor: 'var(--base-color-2)',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          >
            Nov 3 - Dec 2, 2024
          </Box>
        </Row>
      </Row>

      {/* Primary Revenue KPIs */}
      <MetricsBar>
        <MetricCard
          label="MRR"
          value={98200}
          change={8400}
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange
        />
        <MetricCard
          label="ARR"
          value={1178400}
          change={100800}
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange
        />
        <MetricCard
          label="Net Revenue Retention"
          value={112}
          change={4}
          formatValue={n => `${n.toFixed(0)}%`}
          showChange
        />
        <MetricCard
          label="Pipeline Value"
          value={842500}
          change={156000}
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange
        />
        <MetricCard
          label="Avg Deal Size"
          value={32400}
          change={2800}
          formatValue={n => formatLongCurrency(n, 'USD')}
          showChange
        />
      </MetricsBar>

      {/* Pipeline Funnel & Revenue Trend */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
        {/* Pipeline Funnel */}
        <Panel title="Pipeline Funnel">
          <Column gap="4" style={{ padding: '12px 0' }}>
            {funnelWithRates.map((stage, index) => {
              const widthPercent = (stage.count / pipelineStages[0].count) * 100;
              return (
                <Column key={stage.stage} gap="2">
                  <Row justifyContent="space-between" alignItems="center">
                    <Text weight="medium">{stage.stage}</Text>
                    <Row gap="3" alignItems="center">
                      <Text weight="bold">{formatLongNumber(stage.count)}</Text>
                      {index > 0 && (
                        <Text size="1" color="muted">
                          {stage.rate}% conv.
                        </Text>
                      )}
                    </Row>
                  </Row>
                  <div
                    style={{
                      ...funnelBarStyle(Math.max(widthPercent, 3), stage.color),
                      animationDelay: `${index * 100}ms`,
                    }}
                  />
                </Column>
              );
            })}
          </Column>
          <Row
            justifyContent="space-between"
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '12px',
              marginTop: '8px',
            }}
          >
            <Text size="1" color="muted">
              Overall Visitor to Close Rate
            </Text>
            <Text weight="bold" style={{ color: 'var(--accent-color-green)' }}>
              0.056%
            </Text>
          </Row>
        </Panel>

        {/* MRR Trend */}
        <Panel title="MRR Growth Trend">
          <Box height="280px">
            <BarChart
              chartData={revenueData}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              currency="USD"
            />
          </Box>
        </Panel>
      </Grid>

      {/* Account Health Section */}
      <Grid columns={{ xs: '1fr', lg: '320px 1fr' }} gap="6">
        {/* Health Distribution */}
        <Panel title="Account Health Distribution">
          <Box height="220px">
            <PieChart chartData={healthDistribution} type="doughnut" />
          </Box>
          <Grid columns="2" gap="3" style={{ marginTop: '12px' }}>
            <Column
              gap="1"
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--base-color-1)',
                borderRadius: '6px',
              }}
            >
              <Text size="1" color="muted">
                Total Accounts
              </Text>
              <Text size="5" weight="bold">
                291
              </Text>
            </Column>
            <Column
              gap="1"
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--base-color-1)',
                borderRadius: '6px',
              }}
            >
              <Text size="1" color="muted">
                Avg Health Score
              </Text>
              <Text size="5" weight="bold">
                72
              </Text>
            </Column>
          </Grid>
        </Panel>

        {/* At-Risk Accounts */}
        <Panel title="At-Risk Accounts">
          <Column gap="3">
            <Row
              style={{
                backgroundColor: 'var(--base-color-1)',
                padding: '8px 12px',
                borderRadius: '6px',
              }}
            >
              <Grid columns="2fr 100px 80px 2fr 100px" gap="3" style={{ width: '100%' }}>
                <Text size="1" weight="semibold" color="muted">
                  Account
                </Text>
                <Text size="1" weight="semibold" color="muted">
                  MRR
                </Text>
                <Text size="1" weight="semibold" color="muted">
                  Score
                </Text>
                <Text size="1" weight="semibold" color="muted">
                  Risk Factors
                </Text>
                <Text size="1" weight="semibold" color="muted">
                  Last Contact
                </Text>
              </Grid>
            </Row>
            {atRiskAccounts.map((account, i) => (
              <Row
                key={account.name}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor:
                    account.healthScore < 40
                      ? 'color-mix(in srgb, var(--accent-color-red), transparent 95%)'
                      : 'transparent',
                  opacity: 0,
                  animation: `fadeSlideIn 0.4s ease-out ${i * 80}ms forwards`,
                }}
              >
                <Grid columns="2fr 100px 80px 2fr 100px" gap="3" style={{ width: '100%' }} alignItems="center">
                  <Text weight="medium">{account.name}</Text>
                  <Text weight="bold">{formatLongCurrency(account.mrr, 'USD')}</Text>
                  <RiskBadge score={account.healthScore} />
                  <Row gap="2" style={{ flexWrap: 'wrap' }}>
                    {account.riskFactors.map((factor, j) => (
                      <Text
                        key={j}
                        size="1"
                        style={{
                          padding: '2px 6px',
                          backgroundColor: 'var(--base-color-2)',
                          borderRadius: '4px',
                        }}
                      >
                        {factor}
                      </Text>
                    ))}
                  </Row>
                  <Text size="1" color="muted">
                    {account.lastContact}
                  </Text>
                </Grid>
              </Row>
            ))}
            <Row
              justifyContent="space-between"
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '12px',
              }}
            >
              <Text size="1" color="muted">
                Total at-risk MRR
              </Text>
              <Text weight="bold" style={{ color: 'var(--accent-color-red)' }}>
                {formatLongCurrency(
                  atRiskAccounts.reduce((sum, a) => sum + a.mrr, 0),
                  'USD'
                )}
              </Text>
            </Row>
          </Column>
        </Panel>
      </Grid>

      {/* Expansion Opportunities */}
      <Panel title="Expansion Opportunities">
        <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap="4">
          {expansionOpportunities.map((opp, i) => (
            <Column
              key={opp.name}
              gap="3"
              style={{
                padding: '16px',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                backgroundColor: 'var(--background-color)',
                opacity: 0,
                animation: `fadeSlideIn 0.4s ease-out ${i * 100}ms forwards`,
              }}
            >
              <Row justifyContent="space-between" alignItems="flex-start">
                <Text weight="semibold">{opp.name}</Text>
                <ChangeLabel value={opp.engagementTrend}>+{opp.engagementTrend}%</ChangeLabel>
              </Row>
              <Grid columns="2" gap="2">
                <Column gap="1">
                  <Text size="1" color="muted">
                    Current MRR
                  </Text>
                  <Text weight="bold">{formatLongCurrency(opp.currentMrr, 'USD')}</Text>
                </Column>
                <Column gap="1">
                  <Text size="1" color="muted">
                    Expansion
                  </Text>
                  <Text weight="bold" style={{ color: 'var(--accent-color-green)' }}>
                    +{formatLongCurrency(opp.expansionPotential, 'USD')}
                  </Text>
                </Column>
              </Grid>
              <Column gap="2">
                <Text size="1" color="muted">
                  Signals
                </Text>
                <Row gap="2" style={{ flexWrap: 'wrap' }}>
                  {opp.signals.map((signal, j) => (
                    <Text
                      key={j}
                      size="1"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'color-mix(in srgb, var(--accent-color-green), transparent 90%)',
                        color: 'var(--accent-color-green)',
                        borderRadius: '4px',
                      }}
                    >
                      {signal}
                    </Text>
                  ))}
                </Row>
              </Column>
            </Column>
          ))}
        </Grid>
        <Row
          justifyContent="space-between"
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '16px',
            marginTop: '16px',
          }}
        >
          <Text color="muted">Total Expansion Potential</Text>
          <Text size="5" weight="bold" style={{ color: 'var(--accent-color-green)' }}>
            {formatLongCurrency(
              expansionOpportunities.reduce((sum, o) => sum + o.expansionPotential, 0),
              'USD'
            )}
          </Text>
        </Row>
      </Panel>

      {/* High-Value Pages & Revenue by Source */}
      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="6">
        <Panel>
          <ListTable
            title="High-Intent Page Visits"
            metric="Views"
            data={highValuePages}
            showPercentage
          />
        </Panel>
        <Panel>
          <ListTable
            title="Revenue by Traffic Source"
            metric="Revenue"
            data={revenueBySource}
            currency="USD"
            showPercentage
          />
        </Panel>
      </Grid>

      {/* Conversion Metrics */}
      <Panel title="Conversion Rate Trends">
        <Grid columns={{ xs: '1fr', lg: '3fr 1fr' }} gap="6">
          <Box height="240px">
            <BarChart
              chartData={conversionTrends}
              unit="day"
              minDate={minDate}
              maxDate={maxDate}
              stacked={false}
            />
          </Box>
          <Column gap="4" justifyContent="center">
            <Column
              gap="2"
              style={{
                padding: '16px',
                backgroundColor: 'var(--base-color-1)',
                borderRadius: '8px',
              }}
            >
              <Text size="1" color="muted">
                Avg Visitor to MQL Rate
              </Text>
              <Row alignItems="baseline" gap="2">
                <Text size="6" weight="bold">
                  1.09%
                </Text>
                <ChangeLabel value={0.12}>+0.12%</ChangeLabel>
              </Row>
            </Column>
            <Column
              gap="2"
              style={{
                padding: '16px',
                backgroundColor: 'var(--base-color-1)',
                borderRadius: '8px',
              }}
            >
              <Text size="1" color="muted">
                Avg MQL to SQL Rate
              </Text>
              <Row alignItems="baseline" gap="2">
                <Text size="6" weight="bold">
                  37.8%
                </Text>
                <ChangeLabel value={2.4}>+2.4%</ChangeLabel>
              </Row>
            </Column>
            <Column
              gap="2"
              style={{
                padding: '16px',
                backgroundColor: 'var(--base-color-1)',
                borderRadius: '8px',
              }}
            >
              <Text size="1" color="muted">
                Avg SQL to Close Rate
              </Text>
              <Row alignItems="baseline" gap="2">
                <Text size="6" weight="bold">
                  32.9%
                </Text>
                <ChangeLabel value={-1.2}>-1.2%</ChangeLabel>
              </Row>
            </Column>
          </Column>
        </Grid>
      </Panel>

      {/* CSS Keyframe Animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Column>
  );
}
