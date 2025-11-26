'use client';

import { useMemo, useState, useEffect } from 'react';
import { Column, Grid, Row, Text, Heading, Box, Loading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { ListTable } from '@/components/metrics/ListTable';
import { formatLongNumber, formatLongCurrency } from '@/lib/format';
import {
  useDynamicColor,
  useDynamicVariant,
  useDynamicNumber,
  useDynamicBoolean,
  DialsProvider,
  DialsOverlay,
} from '@niteshift/dials';

// Generate mock revenue data over time
function generateRevenueTimeSeriesData(months: number = 12) {
  const data: { x: string; y: number }[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    // Simulate growth trend with some variance
    const baseRevenue = 850000 + (months - i) * 45000;
    const seasonalFactor = 1 + Math.sin((date.getMonth() / 12) * Math.PI * 2) * 0.15;
    const randomVariation = 0.92 + Math.random() * 0.16;
    data.push({
      x: monthStr,
      y: Math.round(baseRevenue * seasonalFactor * randomVariation),
    });
  }
  return data;
}

function generateMRRBreakdownData() {
  return {
    newMRR: 125000,
    expansionMRR: 78000,
    contractionMRR: -23000,
    churnMRR: -45000,
    netNewMRR: 135000,
  };
}

function generatePipelineData() {
  return [
    { label: 'Qualified Leads', count: 234, percent: 100, value: 4680000 },
    { label: 'Discovery Calls', count: 156, percent: 67, value: 3120000 },
    { label: 'Demo Completed', count: 98, percent: 42, value: 1960000 },
    { label: 'Proposal Sent', count: 67, percent: 29, value: 1340000 },
    { label: 'Negotiation', count: 34, percent: 15, value: 680000 },
    { label: 'Closed Won', count: 18, percent: 8, value: 360000 },
  ];
}

function generateTopAccountsData() {
  return [
    { label: 'Acme Corporation', count: 125000, percent: 12, health: 'healthy', mrr: 125000, lastActivity: '2 days ago' },
    { label: 'TechStart Inc.', count: 98000, percent: 10, health: 'healthy', mrr: 98000, lastActivity: '1 day ago' },
    { label: 'Global Solutions Ltd.', count: 87500, percent: 9, health: 'at-risk', mrr: 87500, lastActivity: '14 days ago' },
    { label: 'Innovation Labs', count: 76000, percent: 8, health: 'healthy', mrr: 76000, lastActivity: '3 days ago' },
    { label: 'DataDriven Co.', count: 65000, percent: 7, health: 'expanding', mrr: 65000, lastActivity: '1 day ago' },
    { label: 'CloudFirst Systems', count: 54000, percent: 5, health: 'at-risk', mrr: 54000, lastActivity: '21 days ago' },
    { label: 'Enterprise Plus', count: 48000, percent: 5, health: 'healthy', mrr: 48000, lastActivity: '5 days ago' },
    { label: 'SmartBiz Solutions', count: 42000, percent: 4, health: 'churning', mrr: 42000, lastActivity: '30 days ago' },
  ];
}

function generateSegmentRevenueData() {
  return [
    { label: 'Enterprise', count: 567000, percent: 45 },
    { label: 'Mid-Market', count: 378000, percent: 30 },
    { label: 'SMB', count: 189000, percent: 15 },
    { label: 'Startup', count: 126000, percent: 10 },
  ];
}

function generateCSMWorkloadData() {
  return [
    { name: 'Sarah Chen', accounts: 42, arr: 2100000, renewals: 8, atRisk: 3 },
    { name: 'Michael Rodriguez', accounts: 38, arr: 1850000, renewals: 5, atRisk: 1 },
    { name: 'Emily Watson', accounts: 45, arr: 1720000, renewals: 12, atRisk: 4 },
    { name: 'James Kim', accounts: 35, arr: 1680000, renewals: 6, atRisk: 2 },
    { name: 'Lisa Thompson', accounts: 40, arr: 1540000, renewals: 9, atRisk: 5 },
  ];
}

function generateChurnRiskData() {
  return [
    { label: 'Global Solutions Ltd.', count: 87500, percent: 75, reason: 'No login 14 days' },
    { label: 'CloudFirst Systems', count: 54000, percent: 68, reason: 'Support tickets up 3x' },
    { label: 'SmartBiz Solutions', count: 42000, percent: 92, reason: 'Cancellation requested' },
    { label: 'DataFlow Inc.', count: 38000, percent: 45, reason: 'Feature requests unmet' },
    { label: 'NextGen Analytics', count: 31000, percent: 52, reason: 'Champion left company' },
  ];
}

function RevenueOperationsDashboardContent() {
  // Client-side only rendering to avoid SSR date issues
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Dials for customization
  const primaryColor = useDynamicColor('ro-primary-color', {
    label: 'Primary Color',
    default: '#44b556',
    options: ['#44b556', '#2680eb', '#9256d9', '#e68619', '#01bad7'],
    group: 'Colors',
  });

  const secondaryColor = useDynamicColor('ro-secondary-color', {
    label: 'Secondary Color',
    default: '#2680eb',
    options: ['#2680eb', '#44b556', '#9256d9', '#e68619', '#01bad7'],
    group: 'Colors',
  });

  const dangerColor = useDynamicColor('ro-danger-color', {
    label: 'Danger/Churn Color',
    default: '#e34850',
    options: ['#e34850', '#e68619', '#9256d9'],
    group: 'Colors',
  });

  const layout = useDynamicVariant('ro-layout', {
    label: 'Dashboard Layout',
    default: 'revenue-focused',
    options: ['revenue-focused', 'pipeline-focused', 'balanced'] as const,
    group: 'Layout',
  });

  const showHealthScores = useDynamicBoolean('ro-show-health', {
    label: 'Show Account Health',
    default: true,
    group: 'Display',
  });

  const metricSize = useDynamicVariant('ro-metric-size', {
    label: 'Metric Value Size',
    default: '8',
    options: ['6', '7', '8', '9'] as const,
    group: 'Typography',
  });

  const panelSpacing = useDynamicNumber('ro-panel-spacing', {
    label: 'Panel Spacing',
    default: 3,
    min: 1,
    max: 6,
    step: 1,
    group: 'Spacing',
  });

  const currency = useDynamicVariant('ro-currency', {
    label: 'Currency',
    default: 'USD',
    options: ['USD', 'EUR', 'GBP'] as const,
    group: 'Display',
  });

  // Mock data
  const revenueTimeSeries = useMemo(() => generateRevenueTimeSeriesData(12), []);
  const mrrBreakdown = useMemo(() => generateMRRBreakdownData(), []);
  const pipelineData = useMemo(() => generatePipelineData(), []);
  const topAccounts = useMemo(() => generateTopAccountsData(), []);
  const segmentRevenue = useMemo(() => generateSegmentRevenueData(), []);
  const csmWorkload = useMemo(() => generateCSMWorkloadData(), []);
  const churnRisk = useMemo(() => generateChurnRiskData(), []);

  // Chart data
  const revenueChartData = useMemo(() => ({
    labels: revenueTimeSeries.map(d => d.x),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Monthly Revenue',
        data: revenueTimeSeries.map(d => d.y),
        backgroundColor: primaryColor + '99',
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }), [revenueTimeSeries, primaryColor]);

  const mrrWaterfallData = useMemo(() => ({
    labels: ['New MRR', 'Expansion', 'Contraction', 'Churn', 'Net New'],
    datasets: [{
      label: 'MRR Movement',
      data: [
        mrrBreakdown.newMRR,
        mrrBreakdown.expansionMRR,
        mrrBreakdown.contractionMRR,
        mrrBreakdown.churnMRR,
        mrrBreakdown.netNewMRR,
      ],
      backgroundColor: [
        primaryColor,
        secondaryColor,
        '#e68619',
        dangerColor,
        mrrBreakdown.netNewMRR > 0 ? primaryColor : dangerColor,
      ],
      borderWidth: 0,
      borderRadius: 4,
    }],
  }), [mrrBreakdown, primaryColor, secondaryColor, dangerColor]);

  const segmentPieData = useMemo(() => ({
    labels: segmentRevenue.map(d => d.label),
    datasets: [{
      data: segmentRevenue.map(d => d.count),
      backgroundColor: [primaryColor, secondaryColor, '#e68619', '#9256d9'],
      borderWidth: 0,
    }],
  }), [segmentRevenue, primaryColor, secondaryColor]);

  const gridGap = `${panelSpacing}` as any;

  if (!isClient) {
    return (
      <Column padding="6" width="100%" maxWidth="1500px" alignItems="center" justifyContent="center" minHeight="400px">
        <Loading />
      </Column>
    );
  }

  const formatCurrency = (value: number) => {
    const symbols: Record<string, string> = { USD: '$', EUR: '\u20ac', GBP: '\u00a3' };
    return `${symbols[currency]}${formatLongNumber(value)}`;
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return primaryColor;
      case 'expanding': return secondaryColor;
      case 'at-risk': return '#e68619';
      case 'churning': return dangerColor;
      default: return '#666';
    }
  };

  return (
    <Column gap={gridGap} padding="6" width="100%" maxWidth="1500px">
      {/* Header */}
      <Row justifyContent="space-between" alignItems="center">
        <Column gap="1">
          <Heading size="5">Revenue Operations Dashboard</Heading>
          <Text color="muted">Sales & CSM view of revenue drivers, pipeline, and account health</Text>
        </Column>
        <Row gap="3" alignItems="center">
          <Box padding="2" backgroundColor="2" borderRadius="2">
            <Text size="0" color="muted">{currency}</Text>
          </Box>
          <Text color="muted" size="1">Last 12 months</Text>
        </Row>
      </Row>

      {/* Key Revenue Metrics */}
      <MetricsBar>
        <MetricCard
          value={1260000}
          change={135000}
          label="Current MRR"
          formatValue={formatCurrency}
          showChange={true}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={15120000}
          change={1620000}
          label="ARR"
          formatValue={formatCurrency}
          showChange={true}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={4680000}
          change={890000}
          label="Pipeline Value"
          formatValue={formatCurrency}
          showChange={true}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={3.2}
          change={-0.4}
          label="Churn Rate %"
          formatValue={(n) => `${n.toFixed(1)}%`}
          showChange={true}
          reverseColors={true}
          valueSize={metricSize as any}
        />
        <MetricCard
          value={118}
          change={8}
          label="NRR %"
          formatValue={(n) => `${n.toFixed(0)}%`}
          showChange={true}
          valueSize={metricSize as any}
        />
      </MetricsBar>

      {/* Revenue Trends */}
      <Grid columns={{ xs: '1fr', lg: layout === 'pipeline-focused' ? '1fr 2fr' : '2fr 1fr' }} gap={gridGap}>
        <Panel title="Monthly Revenue Trend">
          <BarChart
            chartData={revenueChartData}
            XAxisType="category"
            height="300px"
            currency={currency}
          />
        </Panel>

        <Panel title="Revenue by Segment">
          <PieChart
            type="doughnut"
            chartData={segmentPieData}
            height="300px"
          />
        </Panel>
      </Grid>

      {/* MRR Movement & Pipeline */}
      <Grid columns={{ xs: '1fr', lg: 'repeat(2, 1fr)' }} gap={gridGap}>
        <Panel title="MRR Movement This Month">
          <BarChart
            chartData={mrrWaterfallData}
            XAxisType="category"
            height="250px"
            currency={currency}
          />
        </Panel>

        <Panel title="Sales Pipeline">
          <Column gap="2">
            {pipelineData.map((stage, index) => (
              <Row key={stage.label} alignItems="center" gap="3">
                <Box width="140px">
                  <Text size="1">{stage.label}</Text>
                </Box>
                <Box flex="1" height="28px" backgroundColor="2" borderRadius="2" overflow="hidden">
                  <Box
                    height="100%"
                    width={`${stage.percent}%`}
                    borderRadius="2"
                    style={{
                      background: `linear-gradient(90deg, ${secondaryColor}, ${primaryColor})`,
                      opacity: 1 - (index * 0.12),
                    }}
                  />
                </Box>
                <Box width="50px" textAlign="right">
                  <Text size="1" weight="bold">{stage.count}</Text>
                </Box>
                <Box width="90px" textAlign="right">
                  <Text size="0" color="muted">{formatCurrency(stage.value)}</Text>
                </Box>
              </Row>
            ))}
          </Column>
        </Panel>
      </Grid>

      {/* Top Accounts & Churn Risk */}
      <Grid columns={{ xs: '1fr', lg: '3fr 2fr' }} gap={gridGap}>
        <Panel title="Top Accounts by ARR">
          <Column gap="2">
            <Grid columns="2fr 1fr 1fr 1fr" gap="3" padding="2" backgroundColor="2" borderRadius="2">
              <Text weight="bold" size="1">Account</Text>
              <Text weight="bold" size="1" align="right">MRR</Text>
              {showHealthScores && <Text weight="bold" size="1" align="center">Health</Text>}
              <Text weight="bold" size="1" align="right">Last Active</Text>
            </Grid>
            {topAccounts.map((account) => (
              <Grid key={account.label} columns="2fr 1fr 1fr 1fr" gap="3" padding="2" hoverBackgroundColor="2" borderRadius="2" alignItems="center">
                <Text size="1" truncate>{account.label}</Text>
                <Text size="1" align="right" weight="bold">{formatCurrency(account.mrr)}</Text>
                {showHealthScores && (
                  <Row justifyContent="center">
                    <Box
                      padding="1"
                      paddingX="2"
                      borderRadius="2"
                      style={{ backgroundColor: getHealthColor(account.health) + '22' }}
                    >
                      <Text size="0" style={{ color: getHealthColor(account.health) }}>
                        {account.health}
                      </Text>
                    </Box>
                  </Row>
                )}
                <Text size="0" align="right" color="muted">{account.lastActivity}</Text>
              </Grid>
            ))}
          </Column>
        </Panel>

        <Panel title="Churn Risk Accounts">
          <Column gap="2">
            <Grid columns="1fr 80px 60px" gap="3" padding="2" backgroundColor="2" borderRadius="2">
              <Text weight="bold" size="1">Account</Text>
              <Text weight="bold" size="1" align="right">At Risk</Text>
              <Text weight="bold" size="1" align="right">Score</Text>
            </Grid>
            {churnRisk.map((account) => (
              <Grid key={account.label} columns="1fr 80px 60px" gap="3" padding="2" hoverBackgroundColor="2" borderRadius="2" alignItems="center">
                <Column gap="1">
                  <Text size="1" truncate>{account.label}</Text>
                  <Text size="0" color="muted">{account.reason}</Text>
                </Column>
                <Text size="1" align="right" style={{ color: dangerColor }}>{formatCurrency(account.count)}</Text>
                <Row justifyContent="flex-end">
                  <Box
                    padding="1"
                    paddingX="2"
                    borderRadius="2"
                    style={{
                      backgroundColor: account.percent > 70 ? dangerColor + '22' : '#e68619' + '22',
                    }}
                  >
                    <Text
                      size="0"
                      weight="bold"
                      style={{ color: account.percent > 70 ? dangerColor : '#e68619' }}
                    >
                      {account.percent}%
                    </Text>
                  </Box>
                </Row>
              </Grid>
            ))}
            <Row padding="2" backgroundColor="2" borderRadius="2" justifyContent="space-between">
              <Text size="1" weight="bold">Total At Risk ARR</Text>
              <Text size="1" weight="bold" style={{ color: dangerColor }}>
                {formatCurrency(churnRisk.reduce((sum, a) => sum + a.count * 12, 0))}
              </Text>
            </Row>
          </Column>
        </Panel>
      </Grid>

      {/* CSM Workload */}
      <Panel title="CSM Team Workload">
        <Column gap="2">
          <Grid columns="1fr 80px 100px 80px 80px" gap="3" padding="2" backgroundColor="2" borderRadius="2">
            <Text weight="bold" size="1">CSM</Text>
            <Text weight="bold" size="1" align="right">Accounts</Text>
            <Text weight="bold" size="1" align="right">ARR Managed</Text>
            <Text weight="bold" size="1" align="right">Renewals</Text>
            <Text weight="bold" size="1" align="right">At Risk</Text>
          </Grid>
          {csmWorkload.map((csm) => (
            <Grid key={csm.name} columns="1fr 80px 100px 80px 80px" gap="3" padding="2" hoverBackgroundColor="2" borderRadius="2" alignItems="center">
              <Text size="1">{csm.name}</Text>
              <Text size="1" align="right">{csm.accounts}</Text>
              <Text size="1" align="right" weight="bold">{formatCurrency(csm.arr)}</Text>
              <Text size="1" align="right" style={{ color: secondaryColor }}>{csm.renewals}</Text>
              <Text size="1" align="right" style={{ color: csm.atRisk > 3 ? dangerColor : '#e68619' }}>
                {csm.atRisk}
              </Text>
            </Grid>
          ))}
        </Column>
      </Panel>

      {/* Summary Cards */}
      <Grid columns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap={gridGap}>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">Win Rate</Text>
            <Text size="5" weight="bold" style={{ color: primaryColor }}>24%</Text>
            <Text size="0" color="muted">Qualified to Closed</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">Avg Deal Size</Text>
            <Text size="5" weight="bold" style={{ color: secondaryColor }}>{formatCurrency(20000)}</Text>
            <Text size="0" color="muted">+15% vs last quarter</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">Sales Cycle</Text>
            <Text size="5" weight="bold">42 days</Text>
            <Text size="0" color="muted">Average time to close</Text>
          </Column>
        </Panel>
        <Panel>
          <Column gap="2">
            <Text weight="bold" size="1" color="muted">Renewals Due</Text>
            <Text size="5" weight="bold" style={{ color: '#e68619' }}>40</Text>
            <Text size="0" color="muted">Next 90 days</Text>
          </Column>
        </Panel>
      </Grid>
    </Column>
  );
}

export default function RevenueOperationsDashboard() {
  return (
    <DialsProvider projectId="revenue-operations">
      <RevenueOperationsDashboardContent />
      <DialsOverlay position="bottom-left" />
    </DialsProvider>
  );
}
