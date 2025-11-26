'use client';

import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, Box } from '@umami/react-zen';
import { useDynamicColor, useDynamicVariant, useDynamicBoolean, useDynamicNumber } from '@niteshift/dials';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { Chart } from '@/components/charts/Chart';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { CHART_COLORS } from '@/lib/constants';
import { formatLongNumber } from '@/lib/format';
import { renderDateLabels } from '@/lib/charts';

// Mock data generators for Revenue Operations
function generateRevenueData() {
  const now = new Date();
  const data = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    // Seasonal pattern with Q4 peak
    const month = date.getMonth();
    let baseRevenue = 850000;
    if (month >= 9 && month <= 11) baseRevenue = 1200000; // Q4 peak
    else if (month >= 0 && month <= 2) baseRevenue = 720000; // Q1 slower
    else if (month >= 3 && month <= 5) baseRevenue = 890000; // Q2
    else baseRevenue = 950000; // Q3

    data.push({
      x: date.toISOString().split('T')[0].slice(0, 7) + '-01',
      y: baseRevenue + Math.floor(Math.random() * 150000),
    });
  }
  return data;
}

function generateMrrData() {
  const now = new Date();
  const data = [];
  let mrr = 2850000; // Starting MRR
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    // Growth trend with some variation
    const growth = 0.02 + Math.random() * 0.03; // 2-5% monthly growth
    mrr = mrr * (1 + growth);
    data.push({
      x: date.toISOString().split('T')[0].slice(0, 7) + '-01',
      y: Math.floor(mrr),
    });
  }
  return data;
}

function generatePipelineData() {
  return [
    { stage: 'Qualification', count: 245, value: 4250000, avgDays: 8 },
    { stage: 'Discovery', count: 182, value: 3180000, avgDays: 14 },
    { stage: 'Proposal', count: 124, value: 2450000, avgDays: 21 },
    { stage: 'Negotiation', count: 68, value: 1820000, avgDays: 12 },
    { stage: 'Closed Won', count: 42, value: 1240000, avgDays: 0 },
  ];
}

function generateAccountData() {
  return [
    { name: 'Acme Corporation', arr: 245000, health: 92, risk: 'low', csm: 'Sarah Chen', renewalDate: '2025-03-15' },
    { name: 'TechStart Inc', arr: 180000, health: 78, risk: 'medium', csm: 'Mike Johnson', renewalDate: '2025-02-28' },
    { name: 'Global Dynamics', arr: 156000, health: 95, risk: 'low', csm: 'Sarah Chen', renewalDate: '2025-06-10' },
    { name: 'InnovateCo', arr: 142000, health: 45, risk: 'high', csm: 'Emily Rodriguez', renewalDate: '2025-01-20' },
    { name: 'DataFlow Systems', arr: 128000, health: 88, risk: 'low', csm: 'Mike Johnson', renewalDate: '2025-04-05' },
    { name: 'CloudFirst Ltd', arr: 115000, health: 62, risk: 'medium', csm: 'Emily Rodriguez', renewalDate: '2025-02-14' },
    { name: 'Enterprise Solutions', arr: 98000, health: 85, risk: 'low', csm: 'Sarah Chen', renewalDate: '2025-05-22' },
    { name: 'Startup Labs', arr: 72000, health: 38, risk: 'high', csm: 'Mike Johnson', renewalDate: '2025-01-10' },
  ];
}

function generateChurnData() {
  return {
    labels: ['Churned', 'At Risk', 'Healthy', 'Expanding'],
    datasets: [{
      data: [320000, 580000, 4250000, 1180000],
      backgroundColor: ['#e5484d', '#f76b15', '#30a46c', '#0090ff'],
      borderWidth: 0,
    }],
  };
}

function generateRevenueBySegment() {
  return {
    labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
    datasets: [{
      data: [3850000, 2180000, 1420000, 680000],
      backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3]],
      borderWidth: 0,
    }],
  };
}

function generateCsmPerformance() {
  return [
    { name: 'Sarah Chen', accounts: 42, arr: 1850000, nps: 72, churnRate: 2.1, expansion: 145000 },
    { name: 'Mike Johnson', accounts: 38, arr: 1620000, nps: 68, churnRate: 3.8, expansion: 98000 },
    { name: 'Emily Rodriguez', accounts: 35, arr: 1480000, nps: 65, churnRate: 5.2, expansion: 72000 },
    { name: 'David Kim', accounts: 31, arr: 1280000, nps: 74, churnRate: 1.8, expansion: 168000 },
  ];
}

// Pipeline Funnel Component
function PipelineFunnel({ data, primaryColor }: { data: any[]; primaryColor: string }) {
  const maxValue = data[0]?.value || 1;

  return (
    <Column gap="3">
      {data.map((stage, idx) => {
        const widthPercent = (stage.value / maxValue) * 100;
        const isWon = stage.stage === 'Closed Won';

        return (
          <Column key={idx} gap="1">
            <Row justifyContent="space-between" alignItems="center">
              <Row gap="2" alignItems="center">
                <Text size="2" weight="medium">{stage.stage}</Text>
                <Text size="1" style={{ color: '#666' }}>({stage.count} deals)</Text>
              </Row>
              <Row gap="3">
                <Text size="2" weight="medium">${formatLongNumber(stage.value)}</Text>
                {!isWon && <Text size="1" style={{ color: '#999' }}>~{stage.avgDays} days</Text>}
              </Row>
            </Row>
            <Box style={{ position: 'relative', height: '28px' }}>
              <Box
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${widthPercent}%`,
                  height: '100%',
                  backgroundColor: isWon ? '#30a46c' : primaryColor,
                  borderRadius: '4px',
                  opacity: isWon ? 1 : 0.7 - (idx * 0.1),
                }}
              />
            </Box>
          </Column>
        );
      })}
    </Column>
  );
}

// Health Score Badge Component
function HealthBadge({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 80) return { bg: '#d4edda', text: '#155724' };
    if (score >= 60) return { bg: '#fff3cd', text: '#856404' };
    return { bg: '#f8d7da', text: '#721c24' };
  };
  const colors = getColor();

  return (
    <Box style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: colors.bg }}>
      <Text size="1" weight="medium" style={{ color: colors.text }}>{score}</Text>
    </Box>
  );
}

// Risk Badge Component
function RiskBadge({ risk }: { risk: string }) {
  const getColor = () => {
    if (risk === 'low') return { bg: '#d4edda', text: '#155724' };
    if (risk === 'medium') return { bg: '#fff3cd', text: '#856404' };
    return { bg: '#f8d7da', text: '#721c24' };
  };
  const colors = getColor();

  return (
    <Box style={{ padding: '2px 8px', borderRadius: '12px', backgroundColor: colors.bg }}>
      <Text size="1" weight="medium" style={{ color: colors.text }}>{risk}</Text>
    </Box>
  );
}

export default function RevenueOperationsPage() {
  // Dials for customization
  const primaryColor = useDynamicColor('ro-primary-color', {
    label: 'Primary Color',
    description: 'Main accent color for charts',
    default: '#8e4ec6',
    options: ['#8e4ec6', '#2680eb', '#30a46c', '#f76b15', '#3e63dd'],
    group: 'Colors',
  });

  const viewMode = useDynamicVariant('ro-view-mode', {
    label: 'View Mode',
    description: 'Focus area for the dashboard',
    default: 'overview',
    options: ['overview', 'pipeline', 'accounts', 'csm'] as const,
    group: 'View',
  });

  const showForecasting = useDynamicBoolean('ro-show-forecasting', {
    label: 'Show Forecasting',
    description: 'Display revenue forecasting section',
    default: true,
    group: 'Visibility',
  });

  const chartHeight = useDynamicNumber('ro-chart-height', {
    label: 'Chart Height',
    description: 'Height of main charts in pixels',
    default: 280,
    min: 200,
    max: 450,
    step: 50,
    unit: 'px',
    group: 'Layout',
  });

  const riskView = useDynamicVariant('ro-risk-view', {
    label: 'Risk Highlight',
    description: 'How to highlight at-risk accounts',
    default: 'badge',
    options: ['badge', 'row-color', 'icon'] as const,
    group: 'Style',
  });

  const metricsDisplay = useDynamicVariant('ro-metrics-display', {
    label: 'Metrics Display',
    description: 'Style for displaying key metrics',
    default: 'cards',
    options: ['cards', 'compact', 'detailed'] as const,
    group: 'Layout',
  });

  // Generate mock data
  const revenueData = useMemo(() => generateRevenueData(), []);
  const mrrData = useMemo(() => generateMrrData(), []);
  const pipelineData = useMemo(() => generatePipelineData(), []);
  const accountData = useMemo(() => generateAccountData(), []);
  const churnData = useMemo(() => generateChurnData(), []);
  const segmentData = useMemo(() => generateRevenueBySegment(), []);
  const csmPerformance = useMemo(() => generateCsmPerformance(), []);

  // Revenue chart data
  const revenueChartData = useMemo(() => ({
    datasets: [
      {
        type: 'bar' as const,
        label: 'Monthly Revenue',
        data: revenueData,
        backgroundColor: `${primaryColor}66`,
        borderColor: primaryColor,
        borderWidth: 1,
      },
      {
        type: 'line' as const,
        label: 'MRR',
        data: mrrData,
        borderColor: CHART_COLORS[2],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        yAxisID: 'y1',
      },
    ],
  }), [revenueData, mrrData, primaryColor]);

  const renderXLabel = useCallback(renderDateLabels('month', 'en-US'), []);

  // Calculate date range for charts (12 months)
  const dateRange = useMemo(() => {
    const now = new Date();
    const minDate = new Date(now);
    minDate.setMonth(minDate.getMonth() - 11);
    minDate.setDate(1);
    return { minDate, maxDate: now };
  }, []);

  // Calculate metrics
  const currentMrr = mrrData[mrrData.length - 1]?.y || 0;
  const previousMrr = mrrData[mrrData.length - 2]?.y || 0;
  const mrrGrowth = ((currentMrr - previousMrr) / previousMrr) * 100;
  const totalPipeline = pipelineData.reduce((sum, s) => sum + s.value, 0);
  const weightedPipeline = pipelineData.reduce((sum, s, idx) => {
    const weights = [0.1, 0.2, 0.4, 0.6, 1.0];
    return sum + s.value * weights[idx];
  }, 0);
  const totalArr = accountData.reduce((sum, a) => sum + a.arr, 0);
  const atRiskArr = accountData.filter(a => a.risk === 'high').reduce((sum, a) => sum + a.arr, 0);
  const avgHealthScore = Math.floor(accountData.reduce((sum, a) => sum + a.health, 0) / accountData.length);

  const getAccountRowStyle = (account: any) => {
    if (riskView !== 'row-color') return {};
    if (account.risk === 'high') return { backgroundColor: '#fff5f5' };
    if (account.risk === 'medium') return { backgroundColor: '#fffcf0' };
    return {};
  };

  return (
    <PageBody>
      <Column gap="6" padding="4">
        <PageHeader title="Revenue Operations" />
        <Text size="2" style={{ color: '#666', marginTop: '-12px' }}>
          Sales/CSM view of revenue drivers, pipeline, and risks
        </Text>

        {/* Key Metrics */}
        <Row gap="4" style={{ overflowX: 'auto' }}>
          <MetricCard
            label="Monthly Recurring Revenue"
            value={currentMrr}
            formatValue={(n) => `$${formatLongNumber(n)}`}
            change={currentMrr - previousMrr}
            showChange
            showLabel
            valueSize={metricsDisplay === 'compact' ? '6' : '8'}
          />
          <MetricCard
            label="MRR Growth"
            value={mrrGrowth}
            formatValue={(n) => `${n.toFixed(1)}%`}
            showLabel
            valueSize={metricsDisplay === 'compact' ? '6' : '8'}
          />
          <MetricCard
            label="Total Pipeline"
            value={totalPipeline}
            formatValue={(n) => `$${formatLongNumber(n)}`}
            showLabel
            valueSize={metricsDisplay === 'compact' ? '6' : '8'}
          />
          <MetricCard
            label="Weighted Pipeline"
            value={weightedPipeline}
            formatValue={(n) => `$${formatLongNumber(n)}`}
            showLabel
            valueSize={metricsDisplay === 'compact' ? '6' : '8'}
          />
          <MetricCard
            label="At-Risk ARR"
            value={atRiskArr}
            formatValue={(n) => `$${formatLongNumber(n)}`}
            showLabel
            valueColor="#e5484d"
            valueSize={metricsDisplay === 'compact' ? '6' : '8'}
          />
          <MetricCard
            label="Avg Health Score"
            value={avgHealthScore}
            showLabel
            valueSize={metricsDisplay === 'compact' ? '6' : '8'}
          />
        </Row>

        {/* Revenue & MRR Chart */}
        <Panel title="Revenue Trends">
          <BarChart
            chartData={revenueChartData}
            unit="month"
            height={`${chartHeight}px`}
            renderXLabel={renderXLabel}
            minDate={dateRange.minDate}
            maxDate={dateRange.maxDate}
          />
        </Panel>

        {/* Pipeline + Revenue Segments */}
        <Grid columns={{ xs: '1', lg: '2' }} gap="4">
          <Panel title="Sales Pipeline">
            <PipelineFunnel data={pipelineData} primaryColor={primaryColor} />
          </Panel>

          <Grid columns="2" gap="4">
            <Panel title="Customer Health">
              <Column alignItems="center" gap="2">
                <Box style={{ width: '160px', height: '160px' }}>
                  <PieChart type="doughnut" chartData={churnData} height="160px" />
                </Box>
                <Column gap="1" style={{ width: '100%' }}>
                  {churnData.labels.map((label, idx) => (
                    <Row key={label} justifyContent="space-between" alignItems="center">
                      <Row gap="2" alignItems="center">
                        <Box style={{ width: '10px', height: '10px', backgroundColor: churnData.datasets[0].backgroundColor[idx], borderRadius: '2px' }} />
                        <Text size="1">{label}</Text>
                      </Row>
                      <Text size="1" weight="medium">${formatLongNumber(churnData.datasets[0].data[idx])}</Text>
                    </Row>
                  ))}
                </Column>
              </Column>
            </Panel>

            <Panel title="Revenue by Segment">
              <Column alignItems="center" gap="2">
                <Box style={{ width: '160px', height: '160px' }}>
                  <PieChart type="doughnut" chartData={segmentData} height="160px" />
                </Box>
                <Column gap="1" style={{ width: '100%' }}>
                  {segmentData.labels.map((label, idx) => (
                    <Row key={label} justifyContent="space-between" alignItems="center">
                      <Row gap="2" alignItems="center">
                        <Box style={{ width: '10px', height: '10px', backgroundColor: segmentData.datasets[0].backgroundColor[idx], borderRadius: '2px' }} />
                        <Text size="1">{label}</Text>
                      </Row>
                      <Text size="1" weight="medium">${formatLongNumber(segmentData.datasets[0].data[idx])}</Text>
                    </Row>
                  ))}
                </Column>
              </Column>
            </Panel>
          </Grid>
        </Grid>

        {/* Account Health Table */}
        <Panel title="Top Accounts by ARR">
          <Column gap="1">
            <Row gap="2" style={{ borderBottom: '2px solid #e0e0e0', paddingBottom: '8px', marginBottom: '4px' }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>Account</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>ARR</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>Health</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>Risk</Text>
              <Text size="1" weight="bold" style={{ flex: 1 }}>CSM</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Renewal</Text>
            </Row>
            {accountData.map((account, idx) => (
              <Row key={account.name} gap="2" style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0', ...getAccountRowStyle(account) }}>
                <Text size="2" style={{ flex: 2 }}>{account.name}</Text>
                <Text size="2" weight="medium" style={{ flex: 1, textAlign: 'right' }}>${formatLongNumber(account.arr)}</Text>
                <Box style={{ flex: 1, textAlign: 'center' }}>
                  <HealthBadge score={account.health} />
                </Box>
                <Box style={{ flex: 1, textAlign: 'center' }}>
                  <RiskBadge risk={account.risk} />
                </Box>
                <Text size="2" style={{ flex: 1 }}>{account.csm}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right', color: new Date(account.renewalDate) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) ? '#e5484d' : '#666' }}>
                  {new Date(account.renewalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* CSM Performance */}
        <Panel title="CSM Performance">
          <Column gap="1">
            <Row gap="2" style={{ borderBottom: '2px solid #e0e0e0', paddingBottom: '8px', marginBottom: '4px' }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>CSM</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Accounts</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>ARR Managed</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>NPS</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Churn Rate</Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Expansion</Text>
            </Row>
            {csmPerformance.map((csm, idx) => (
              <Row key={csm.name} gap="2" style={{ padding: '8px 4px', borderBottom: '1px solid #f0f0f0', backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'transparent' }}>
                <Text size="2" weight="medium" style={{ flex: 2 }}>{csm.name}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>{csm.accounts}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>${formatLongNumber(csm.arr)}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right', color: csm.nps >= 70 ? '#30a46c' : csm.nps >= 50 ? '#ffc53d' : '#e5484d' }}>{csm.nps}</Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right', color: csm.churnRate <= 3 ? '#30a46c' : csm.churnRate <= 5 ? '#ffc53d' : '#e5484d' }}>{csm.churnRate}%</Text>
                <Text size="2" weight="medium" style={{ flex: 1, textAlign: 'right', color: '#30a46c' }}>+${formatLongNumber(csm.expansion)}</Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Forecasting Section */}
        {showForecasting && (
          <Panel title="Revenue Forecast (Next Quarter)">
            <Grid columns={{ xs: '1', md: '3' }} gap="4">
              <Column gap="2" style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <Text size="1" weight="medium" style={{ color: '#666' }}>Conservative</Text>
                <Text size="6" weight="bold">$3.2M</Text>
                <Text size="1" style={{ color: '#666' }}>Based on weighted pipeline at 60%</Text>
              </Column>
              <Column gap="2" style={{ padding: '16px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                <Text size="1" weight="medium" style={{ color: '#155724' }}>Target</Text>
                <Text size="6" weight="bold" style={{ color: '#155724' }}>$4.1M</Text>
                <Text size="1" style={{ color: '#155724' }}>Based on historical win rates</Text>
              </Column>
              <Column gap="2" style={{ padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
                <Text size="1" weight="medium" style={{ color: '#1565c0' }}>Stretch</Text>
                <Text size="6" weight="bold" style={{ color: '#1565c0' }}>$5.4M</Text>
                <Text size="1" style={{ color: '#1565c0' }}>Including expansion opportunities</Text>
              </Column>
            </Grid>
          </Panel>
        )}
      </Column>
    </PageBody>
  );
}
