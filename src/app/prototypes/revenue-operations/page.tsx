'use client';

import { useMemo } from 'react';
import { Column, Row, Grid, Heading, Text, Box } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatLongNumber, formatCurrency } from '@/lib/format';
import { CHART_COLORS } from '@/lib/constants';
import {
  useDynamicVariant,
  useDynamicColor,
  useDynamicBoolean,
  useDynamicNumber,
  useDynamicSpacing,
} from '@niteshift/dials';

// Generate realistic dates for the past 30 days
function generateDates(days: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates;
}

// Generate revenue data with realistic business patterns
function generateRevenueData(dates: Date[]) {
  return dates.map((date, index) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const monthProgress = date.getDate() / 30;

    // Revenue tends to spike at end of month (sales push)
    const endOfMonthMultiplier = monthProgress > 0.8 ? 1.3 : 1;
    const baseNewBusiness = isWeekend ? 15000 : 45000;
    const baseExpansion = isWeekend ? 8000 : 22000;
    const baseRenewal = isWeekend ? 5000 : 18000;
    const variance = Math.random() * 0.2 - 0.1;

    return {
      date: date.toISOString(),
      newBusiness: Math.round(baseNewBusiness * endOfMonthMultiplier * (1 + variance)),
      expansion: Math.round(baseExpansion * (1 + variance)),
      renewal: Math.round(baseRenewal * (1 + variance)),
    };
  });
}

// Pipeline data with realistic sales stages
const pipelineData = [
  { stage: 'Discovery', deals: 142, value: 4260000, avgDealSize: 30000, winRate: 12 },
  { stage: 'Qualification', deals: 98, value: 3920000, avgDealSize: 40000, winRate: 18 },
  { stage: 'Demo', deals: 67, value: 3350000, avgDealSize: 50000, winRate: 32 },
  { stage: 'Proposal', deals: 45, value: 2700000, avgDealSize: 60000, winRate: 48 },
  { stage: 'Negotiation', deals: 28, value: 2240000, avgDealSize: 80000, winRate: 68 },
  { stage: 'Closed Won', deals: 19, value: 1900000, avgDealSize: 100000, winRate: 100 },
];

// Account health data for CSM view
const accountHealthData = [
  {
    account: 'Acme Corp',
    arr: 245000,
    health: 92,
    nps: 9,
    lastContact: '2 days ago',
    renewalDate: 'Mar 2025',
    risk: 'low',
    expansion: 45000
  },
  {
    account: 'TechFlow Inc',
    arr: 189000,
    health: 78,
    nps: 7,
    lastContact: '1 week ago',
    renewalDate: 'Feb 2025',
    risk: 'medium',
    expansion: 28000
  },
  {
    account: 'GlobalScale',
    arr: 156000,
    health: 45,
    nps: 5,
    lastContact: '3 weeks ago',
    renewalDate: 'Jan 2025',
    risk: 'high',
    expansion: 0
  },
  {
    account: 'DataDrive',
    arr: 134000,
    health: 88,
    nps: 8,
    lastContact: '3 days ago',
    renewalDate: 'Apr 2025',
    risk: 'low',
    expansion: 22000
  },
  {
    account: 'CloudFirst',
    arr: 112000,
    health: 65,
    nps: 6,
    lastContact: '2 weeks ago',
    renewalDate: 'Feb 2025',
    risk: 'medium',
    expansion: 15000
  },
  {
    account: 'SmartOps',
    arr: 98000,
    health: 38,
    nps: 4,
    lastContact: '1 month ago',
    renewalDate: 'Dec 2024',
    risk: 'high',
    expansion: 0
  },
];

// Revenue by segment
const revenueBySegment = [
  { segment: 'Enterprise', value: 48, revenue: 4800000 },
  { segment: 'Mid-Market', value: 32, revenue: 3200000 },
  { segment: 'SMB', value: 20, revenue: 2000000 },
];

// Sales rep performance
const salesRepData = [
  { name: 'Sarah Chen', quota: 500000, attainment: 112, deals: 8, pipeline: 1200000 },
  { name: 'Michael Rodriguez', quota: 450000, attainment: 98, deals: 6, pipeline: 980000 },
  { name: 'Emily Watson', quota: 500000, attainment: 95, deals: 7, pipeline: 1150000 },
  { name: 'James Park', quota: 400000, attainment: 88, deals: 5, pipeline: 720000 },
  { name: 'Lisa Thompson', quota: 450000, attainment: 76, deals: 4, pipeline: 890000 },
];

// Churn analysis
const churnData = [
  { reason: 'Competitive Loss', count: 12, arr: 456000 },
  { reason: 'Budget Cuts', count: 8, arr: 312000 },
  { reason: 'Product Fit', count: 6, arr: 198000 },
  { reason: 'Champion Left', count: 5, arr: 175000 },
  { reason: 'Poor Support', count: 3, arr: 89000 },
];

export default function RevenueOperationsPage() {
  // Layout dials
  const layoutStyle = useDynamicVariant('ro-layout-style', {
    label: 'Layout Style',
    description: 'Overall layout arrangement',
    default: 'standard',
    options: ['standard', 'compact', 'executive'] as const,
    group: 'Layout',
  });

  const showPipeline = useDynamicBoolean('ro-show-pipeline', {
    label: 'Show Pipeline',
    description: 'Display pipeline stages',
    default: true,
    group: 'Sections',
  });

  const showAccountHealth = useDynamicBoolean('ro-show-account-health', {
    label: 'Show Account Health',
    description: 'Display CSM account health',
    default: true,
    group: 'Sections',
  });

  const showSalesReps = useDynamicBoolean('ro-show-sales-reps', {
    label: 'Show Sales Reps',
    description: 'Display rep performance',
    default: true,
    group: 'Sections',
  });

  const showChurn = useDynamicBoolean('ro-show-churn', {
    label: 'Show Churn Analysis',
    description: 'Display churn reasons',
    default: true,
    group: 'Sections',
  });

  // Color dials
  const newBusinessColor = useDynamicColor('ro-new-business-color', {
    label: 'New Business Color',
    description: 'Color for new revenue',
    default: '#2680eb',
    options: ['#2680eb', '#3e63dd', '#0090ff', '#147af3'],
    allowCustom: true,
    group: 'Colors',
  });

  const expansionColor = useDynamicColor('ro-expansion-color', {
    label: 'Expansion Color',
    description: 'Color for expansion revenue',
    default: '#44b556',
    options: ['#44b556', '#30a46c', '#89c541', '#3e9b4f'],
    allowCustom: true,
    group: 'Colors',
  });

  const renewalColor = useDynamicColor('ro-renewal-color', {
    label: 'Renewal Color',
    description: 'Color for renewal revenue',
    default: '#9256d9',
    options: ['#9256d9', '#6734bc', '#5b5bd6', '#8e4ec6'],
    allowCustom: true,
    group: 'Colors',
  });

  const riskHighColor = useDynamicColor('ro-risk-high-color', {
    label: 'High Risk Color',
    description: 'Color for high risk accounts',
    default: '#e34850',
    options: ['#e34850', '#dc2626', '#f87171', '#ef4444'],
    allowCustom: true,
    group: 'Colors',
  });

  // Typography dials
  const headingSize = useDynamicVariant('ro-heading-size', {
    label: 'Heading Size',
    description: 'Size of section headings',
    default: '4',
    options: ['3', '4', '5'] as const,
    group: 'Typography',
  });

  const metricValueSize = useDynamicVariant('ro-metric-value-size', {
    label: 'Metric Value Size',
    description: 'Size of metric values',
    default: '8',
    options: ['6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  // Spacing dials
  const sectionGap = useDynamicSpacing('ro-section-gap', {
    label: 'Section Gap',
    description: 'Space between sections',
    default: '24px',
    options: ['16px', '24px', '32px', '40px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('ro-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts',
    default: 350,
    min: 250,
    max: 500,
    step: 50,
    unit: 'px',
    group: 'Visualization',
  });

  // Generate chart data
  const dates = useMemo(() => generateDates(30), []);
  const revenueData = useMemo(() => generateRevenueData(dates), [dates]);

  const revenueChartData = useMemo(() => {
    return {
      labels: revenueData.map((d) => d.date),
      datasets: [
        {
          label: 'New Business',
          data: revenueData.map((d) => ({ x: d.date, y: d.newBusiness })),
          backgroundColor: newBusinessColor,
          borderColor: newBusinessColor,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 3,
        },
        {
          label: 'Expansion',
          data: revenueData.map((d) => ({ x: d.date, y: d.expansion })),
          backgroundColor: expansionColor,
          borderColor: expansionColor,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 2,
        },
        {
          label: 'Renewal',
          data: revenueData.map((d) => ({ x: d.date, y: d.renewal })),
          backgroundColor: renewalColor,
          borderColor: renewalColor,
          borderWidth: 0,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
          order: 1,
        },
      ],
    };
  }, [revenueData, newBusinessColor, expansionColor, renewalColor]);

  const segmentChartData = useMemo(() => {
    return {
      labels: revenueBySegment.map((d) => d.segment),
      datasets: [
        {
          data: revenueBySegment.map((d) => d.value),
          backgroundColor: [newBusinessColor, expansionColor, renewalColor],
          borderWidth: 0,
        },
      ],
    };
  }, [newBusinessColor, expansionColor, renewalColor]);

  // Calculate summary metrics
  const totalRevenue = revenueData.reduce((sum, d) => sum + d.newBusiness + d.expansion + d.renewal, 0);
  const totalNewBusiness = revenueData.reduce((sum, d) => sum + d.newBusiness, 0);
  const totalExpansion = revenueData.reduce((sum, d) => sum + d.expansion, 0);
  const totalPipeline = pipelineData.reduce((sum, s) => sum + s.value, 0);
  const totalARR = accountHealthData.reduce((sum, a) => sum + a.arr, 0);
  const avgHealthScore = Math.round(accountHealthData.reduce((sum, a) => sum + a.health, 0) / accountHealthData.length);
  const atRiskARR = accountHealthData.filter(a => a.risk === 'high').reduce((sum, a) => sum + a.arr, 0);

  const getHealthColor = (health: number) => {
    if (health >= 80) return '#44b556';
    if (health >= 60) return '#f7bd12';
    return riskHighColor;
  };

  const getRiskBadgeColor = (risk: string) => {
    if (risk === 'low') return { bg: '#dcfce7', text: '#166534' };
    if (risk === 'medium') return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#fecaca', text: '#991b1b' };
  };

  const gapStyle = { gap: sectionGap };

  return (
    <Column style={gapStyle} padding="6">
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="6">Revenue Operations</Heading>
          <Text color="muted">Sales and CSM view of revenue drivers, pipeline, and risks</Text>
        </Column>
        <Text color="muted" size="1">Last 30 days</Text>
      </Row>

      {/* Key Metrics Bar */}
      <MetricsBar>
        <MetricCard
          label="Total Revenue"
          value={totalRevenue}
          change={totalRevenue * 0.89}
          formatValue={(v) => `$${formatLongNumber(v)}`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="New Business"
          value={totalNewBusiness}
          change={totalNewBusiness * 0.92}
          formatValue={(v) => `$${formatLongNumber(v)}`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Total Pipeline"
          value={totalPipeline}
          change={totalPipeline * 0.95}
          formatValue={(v) => `$${formatLongNumber(v)}`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="Avg. Health Score"
          value={avgHealthScore}
          change={72}
          formatValue={(v) => `${v}`}
          showChange
          showLabel
          valueSize={metricValueSize as any}
        />
        <MetricCard
          label="At-Risk ARR"
          value={atRiskARR}
          change={atRiskARR * 1.1}
          formatValue={(v) => `$${formatLongNumber(v)}`}
          showChange
          showLabel
          reverseColors
          valueSize={metricValueSize as any}
        />
      </MetricsBar>

      {/* Revenue by Type Chart */}
      <Panel>
        <Heading size={headingSize as any}>Revenue by Type</Heading>
        <Box height={`${chartHeight}px`}>
          <BarChart
            chartData={revenueChartData}
            unit="day"
            stacked={true}
            currency="USD"
            minDate={dates[0]}
            maxDate={dates[dates.length - 1]}
            height={`${chartHeight}px`}
          />
        </Box>
      </Panel>

      {/* Pipeline and Segment */}
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="3">
        {/* Pipeline Stages */}
        {showPipeline && (
          <Panel>
            <Heading size={headingSize as any}>Pipeline Stages</Heading>
            <Column gap="3">
              {pipelineData.map((stage, index) => {
                const maxValue = pipelineData[0].value;
                const barWidth = (stage.value / maxValue) * 100;
                return (
                  <Column key={stage.stage} gap="2">
                    <Row justifyContent="space-between" alignItems="center">
                      <Text size="2" weight="medium">{stage.stage}</Text>
                      <Row gap="4">
                        <Text size="1" color="muted">{stage.deals} deals</Text>
                        <Text size="2" weight="bold">${formatLongNumber(stage.value)}</Text>
                      </Row>
                    </Row>
                    <Box
                      style={{
                        width: '100%',
                        height: '24px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box
                        style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          backgroundColor: CHART_COLORS[index],
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '8px'
                        }}
                      >
                        <Text size="1" style={{ color: 'white' }}>{stage.winRate}% win rate</Text>
                      </Box>
                    </Box>
                  </Column>
                );
              })}
            </Column>
          </Panel>
        )}

        {/* Revenue by Segment */}
        <Panel>
          <Heading size={headingSize as any}>Revenue by Segment</Heading>
          <Row alignItems="center" gap="4" justifyContent="center">
            <Box height="200px" width="200px">
              <PieChart type="doughnut" chartData={segmentChartData} height="200px" />
            </Box>
            <Column gap="3">
              {revenueBySegment.map((segment, index) => (
                <Column key={segment.segment} gap="1">
                  <Row gap="2" alignItems="center">
                    <Box
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: [newBusinessColor, expansionColor, renewalColor][index]
                      }}
                    />
                    <Text size="2">{segment.segment}</Text>
                  </Row>
                  <Text size="3" weight="bold">${formatLongNumber(segment.revenue)}</Text>
                  <Text size="1" color="muted">{segment.value}% of total</Text>
                </Column>
              ))}
            </Column>
          </Row>
        </Panel>
      </Grid>

      {/* Account Health */}
      {showAccountHealth && (
        <Panel>
          <Row justifyContent="space-between" alignItems="center" marginBottom="4">
            <Heading size={headingSize as any}>Account Health</Heading>
            <Text size="1" color="muted">Total ARR: ${formatLongNumber(totalARR)}</Text>
          </Row>
          <Box style={{ overflowX: 'auto' }}>
            <Box style={{ minWidth: '900px' }}>
              <Row gap="3" paddingY="2" style={{ borderBottom: '1px solid #e5e5e5' }}>
                <Text size="1" weight="bold" style={{ flex: 2 }}>Account</Text>
                <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>ARR</Text>
                <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>Health</Text>
                <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>NPS</Text>
                <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>Risk</Text>
                <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>Renewal</Text>
                <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Expansion</Text>
              </Row>
              {accountHealthData.map((account) => (
                <Row
                  key={account.account}
                  gap="3"
                  paddingY="3"
                  alignItems="center"
                  style={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <Column style={{ flex: 2 }}>
                    <Text size="2" weight="medium">{account.account}</Text>
                    <Text size="1" color="muted">Last contact: {account.lastContact}</Text>
                  </Column>
                  <Text size="2" weight="medium" style={{ flex: 1, textAlign: 'right' }}>
                    ${formatLongNumber(account.arr)}
                  </Text>
                  <Box style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box
                      style={{
                        width: '48px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getHealthColor(account.health),
                        textAlign: 'center'
                      }}
                    >
                      <Text size="2" style={{ color: 'white' }}>{account.health}</Text>
                    </Box>
                  </Box>
                  <Text size="2" style={{ flex: 1, textAlign: 'center' }}>{account.nps}</Text>
                  <Box style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <Box
                      style={{
                        padding: '2px 10px',
                        borderRadius: '4px',
                        backgroundColor: getRiskBadgeColor(account.risk).bg,
                      }}
                    >
                      <Text size="1" style={{ color: getRiskBadgeColor(account.risk).text }}>
                        {account.risk}
                      </Text>
                    </Box>
                  </Box>
                  <Text size="2" style={{ flex: 1, textAlign: 'center' }}>{account.renewalDate}</Text>
                  <Text
                    size="2"
                    weight={account.expansion > 0 ? 'medium' : 'normal'}
                    style={{ flex: 1, textAlign: 'right', color: account.expansion > 0 ? '#166534' : '#999' }}
                  >
                    {account.expansion > 0 ? `+$${formatLongNumber(account.expansion)}` : '-'}
                  </Text>
                </Row>
              ))}
            </Box>
          </Box>
        </Panel>
      )}

      {/* Sales Reps & Churn */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        {/* Sales Rep Performance */}
        {showSalesReps && (
          <Panel>
            <Heading size={headingSize as any}>Rep Performance</Heading>
            <Column gap="3">
              {salesRepData.map((rep) => (
                <Column
                  key={rep.name}
                  padding="3"
                  border
                  borderRadius="2"
                  gap="2"
                >
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="2" weight="medium">{rep.name}</Text>
                    <Box
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: rep.attainment >= 100 ? '#dcfce7' : rep.attainment >= 80 ? '#fef3c7' : '#fecaca',
                        color: rep.attainment >= 100 ? '#166534' : rep.attainment >= 80 ? '#92400e' : '#991b1b'
                      }}
                    >
                      <Text size="1" weight="medium">{rep.attainment}%</Text>
                    </Box>
                  </Row>
                  <Grid columns="repeat(3, 1fr)" gap="2">
                    <Column>
                      <Text size="1" color="muted">Quota</Text>
                      <Text size="2">${formatLongNumber(rep.quota)}</Text>
                    </Column>
                    <Column>
                      <Text size="1" color="muted">Deals</Text>
                      <Text size="2">{rep.deals}</Text>
                    </Column>
                    <Column>
                      <Text size="1" color="muted">Pipeline</Text>
                      <Text size="2">${formatLongNumber(rep.pipeline)}</Text>
                    </Column>
                  </Grid>
                  <Box
                    style={{
                      width: '100%',
                      height: '4px',
                      backgroundColor: '#e5e5e5',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                      style={{
                        width: `${Math.min(rep.attainment, 120)}%`,
                        height: '100%',
                        backgroundColor: rep.attainment >= 100 ? expansionColor : newBusinessColor,
                        borderRadius: '2px'
                      }}
                    />
                  </Box>
                </Column>
              ))}
            </Column>
          </Panel>
        )}

        {/* Churn Analysis */}
        {showChurn && (
          <Panel>
            <Heading size={headingSize as any}>Churn Analysis</Heading>
            <Column gap="3">
              {churnData.map((reason, index) => (
                <Row key={reason.reason} justifyContent="space-between" alignItems="center" paddingY="2">
                  <Row gap="3" alignItems="center" style={{ flex: 2 }}>
                    <Text size="1" color="muted" style={{ width: '20px' }}>{index + 1}</Text>
                    <Text size="2">{reason.reason}</Text>
                  </Row>
                  <Row gap="4" alignItems="center">
                    <Column alignItems="flex-end">
                      <Text size="1" color="muted">Accounts</Text>
                      <Text size="2">{reason.count}</Text>
                    </Column>
                    <Column alignItems="flex-end" style={{ minWidth: '80px' }}>
                      <Text size="1" color="muted">Lost ARR</Text>
                      <Text size="2" weight="medium" style={{ color: riskHighColor }}>
                        -${formatLongNumber(reason.arr)}
                      </Text>
                    </Column>
                  </Row>
                </Row>
              ))}
              <Row
                justifyContent="space-between"
                paddingTop="3"
                style={{ borderTop: '1px solid #e5e5e5' }}
              >
                <Text size="2" weight="medium">Total Churn</Text>
                <Column alignItems="flex-end">
                  <Text size="2" weight="bold" style={{ color: riskHighColor }}>
                    -${formatLongNumber(churnData.reduce((sum, r) => sum + r.arr, 0))}
                  </Text>
                  <Text size="1" color="muted">
                    {churnData.reduce((sum, r) => sum + r.count, 0)} accounts
                  </Text>
                </Column>
              </Row>
            </Column>
          </Panel>
        )}
      </Grid>
    </Column>
  );
}
