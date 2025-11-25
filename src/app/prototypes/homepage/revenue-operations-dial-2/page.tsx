'use client';
/**
 * Revenue Operations - Dial 2: "Executive Summary"
 * Design exploration: High-level KPIs, trend sparklines style, premium dark accents
 * Focus: Executive overview, large numbers, trend indicators, risk alerts
 */
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { getThemeColors } from '@/lib/colors';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Money } from '@/components/svg';

// Executive color palette - premium feel
const EXEC_COLORS = {
  primary: '#2680eb',
  secondary: '#9256d9',
  success: '#44b556',
  warning: '#e68619',
  danger: '#e34850',
  neutral: '#6b7280',
};

function generateRevenueData() {
  const today = new Date();
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const base = 22000 + Math.random() * 8000;
    data.push({ x: dateStr, y: Math.round(base) });
  }
  return data;
}

// Executive KPI data
const kpiData = {
  mrr: { value: 642000, change: 4.2, target: 650000 },
  arr: { value: 7704000, change: 3.8, target: 8000000 },
  nrr: { value: 118, change: 2.1, target: 115 },
  churn: { value: 4.2, change: -0.8, target: 5.0 },
  pipeline: { value: 6878000, change: 12.4, target: 6000000 },
  cac: { value: 842, change: -5.2, target: 900 },
};

const revenueBySegment = [
  { segment: 'Enterprise', arr: 4200000, percentage: 54.5 },
  { segment: 'Mid-Market', arr: 2100000, percentage: 27.3 },
  { segment: 'SMB', arr: 1404000, percentage: 18.2 },
];

const riskAlerts = [
  { level: 'critical', account: 'Digital Solutions', arr: 76000, issue: 'Renewal at risk - 20 days', action: 'Executive escalation required' },
  { level: 'warning', account: 'TechStart Inc', arr: 124000, issue: 'Key champion left company', action: 'Schedule stakeholder mapping' },
  { level: 'warning', account: 'CloudFirst Ltd', arr: 54000, issue: 'Evaluating competitor', action: 'Competitive positioning call' },
];

const expansionOpps = [
  { account: 'Acme Corp', current: 156000, potential: 245000, stage: 'Proposal', likelihood: 85 },
  { account: 'Global Dynamics', current: 98000, potential: 156000, stage: 'Discovery', likelihood: 72 },
];

// Executive KPI Card
function ExecKPICard({ label, value, change, target, format, isPercentage = false, reverseColors = false }: any) {
  const isOnTarget = isPercentage ? (reverseColors ? value <= target : value >= target) : value >= target;
  const changeColor = reverseColors ? (change <= 0 ? EXEC_COLORS.success : EXEC_COLORS.danger) : (change >= 0 ? EXEC_COLORS.success : EXEC_COLORS.danger);

  return (
    <Column paddingX="5" paddingY="4" borderRadius="3" backgroundColor border gap="2">
      <Row justifyContent="space-between" alignItems="center">
        <Text size="1" color="muted" weight="bold" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Text>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: isOnTarget ? EXEC_COLORS.success : EXEC_COLORS.warning,
        }} />
      </Row>
      <Text style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>{format(value)}</Text>
      <Row justifyContent="space-between" alignItems="center">
        <Text size="1" style={{ color: changeColor }}>
          {change >= 0 ? '+' : ''}{change}% vs prior
        </Text>
        <Text size="1" color="muted">Target: {format(target)}</Text>
      </Row>
    </Column>
  );
}

// Risk Alert Row
function RiskAlertRow({ level, account, arr, issue, action }: any) {
  const levelColor = level === 'critical' ? EXEC_COLORS.danger : EXEC_COLORS.warning;
  return (
    <Row paddingX="4" paddingY="3" gap="3" alignItems="flex-start" style={{
      borderLeft: `4px solid ${levelColor}`,
      backgroundColor: `${levelColor}10`,
      borderRadius: 4,
    }}>
      <Column style={{ flex: 1 }}>
        <Row gap="2" alignItems="center">
          <Text size="2" weight="bold">{account}</Text>
          <Text size="1" color="muted">${formatNumber(arr)} ARR</Text>
        </Row>
        <Text size="2">{issue}</Text>
        <Text size="1" style={{ color: levelColor, marginTop: 4 }}>{action}</Text>
      </Column>
      <Text size="1" weight="bold" style={{ color: levelColor, textTransform: 'uppercase' }}>{level}</Text>
    </Row>
  );
}

export default function RevenueOperationsDial2Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const revenueData = useMemo(() => generateRevenueData(), []);

  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const revenueChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Revenue',
          data: revenueData,
          backgroundColor: EXEC_COLORS.primary,
          borderColor: EXEC_COLORS.primary,
          borderWidth: 0,
          barPercentage: 0.5,
          categoryPercentage: 0.7,
          borderRadius: 4,
        },
      ],
    }),
    [revenueData],
  );

  const segmentPieData = useMemo(
    () => ({
      labels: revenueBySegment.map(s => s.segment),
      datasets: [
        {
          data: revenueBySegment.map(s => s.arr),
          backgroundColor: [EXEC_COLORS.primary, EXEC_COLORS.secondary, EXEC_COLORS.neutral],
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const renderXLabel = useCallback(renderDateLabels('day', 'en-US'), []);

  return (
    <PageBody>
      <PageHeader title="Revenue Operations" icon={<Money />} description="Executive Summary Layout - KPI Focus" />

      {/* Executive KPIs */}
      <Grid columns={{ xs: '1fr 1fr', md: 'repeat(3, 1fr)' }} gap="3">
        <ExecKPICard label="Monthly Recurring Revenue" value={kpiData.mrr.value} change={kpiData.mrr.change} target={kpiData.mrr.target} format={(n: number) => `$${formatNumber(n)}`} />
        <ExecKPICard label="Annual Recurring Revenue" value={kpiData.arr.value} change={kpiData.arr.change} target={kpiData.arr.target} format={(n: number) => `$${formatNumber(n)}`} />
        <ExecKPICard label="Net Revenue Retention" value={kpiData.nrr.value} change={kpiData.nrr.change} target={kpiData.nrr.target} format={(n: number) => `${n}%`} isPercentage />
        <ExecKPICard label="Monthly Churn Rate" value={kpiData.churn.value} change={kpiData.churn.change} target={kpiData.churn.target} format={(n: number) => `${n}%`} isPercentage reverseColors />
        <ExecKPICard label="Pipeline Value" value={kpiData.pipeline.value} change={kpiData.pipeline.change} target={kpiData.pipeline.target} format={(n: number) => `$${formatNumber(n)}`} />
        <ExecKPICard label="Customer Acq. Cost" value={kpiData.cac.value} change={kpiData.cac.change} target={kpiData.cac.target} format={(n: number) => `$${n}`} reverseColors />
      </Grid>

      {/* Risk Alerts - High Priority */}
      <Panel title="Revenue Risk Alerts">
        <Column gap="3">
          {riskAlerts.map((alert, idx) => (
            <RiskAlertRow key={idx} {...alert} />
          ))}
        </Column>
      </Panel>

      {/* Revenue Trend and Segment Split */}
      <Grid columns={{ xs: '1fr', md: '2fr 1fr' }} gap="3">
        <Panel title="7-Day Revenue Trend">
          <BarChart
            chartData={revenueChartData}
            unit="day"
            minDate={sevenDaysAgo}
            maxDate={today}
            renderXLabel={renderXLabel}
            height="300px"
            currency="USD"
          />
        </Panel>
        <Panel title="Revenue by Segment">
          <Column alignItems="center" gap="4" paddingY="3">
            <PieChart type="doughnut" chartData={segmentPieData} width="180px" height="180px" />
            <Column gap="2" width="100%">
              {revenueBySegment.map((item, idx) => (
                <Row key={idx} justifyContent="space-between" paddingX="3">
                  <Row gap="2" alignItems="center">
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      backgroundColor: [EXEC_COLORS.primary, EXEC_COLORS.secondary, EXEC_COLORS.neutral][idx],
                    }} />
                    <Text size="2">{item.segment}</Text>
                  </Row>
                  <Row gap="3">
                    <Text size="2" color="muted">${formatNumber(item.arr)}</Text>
                    <Text size="2" weight="bold">{item.percentage}%</Text>
                  </Row>
                </Row>
              ))}
            </Column>
          </Column>
        </Panel>
      </Grid>

      {/* Expansion Opportunities */}
      <Panel title="Top Expansion Opportunities">
        <Column gap="2">
          <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
            <Text size="1" weight="bold" style={{ flex: 2 }}>Account</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Current ARR</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Potential</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>Stage</Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>Likelihood</Text>
          </Row>
          {expansionOpps.map((opp, idx) => (
            <Row key={idx} paddingX="3" paddingY="3" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="2" weight="bold" style={{ flex: 2 }}>{opp.account}</Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>${formatNumber(opp.current)}</Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right', color: EXEC_COLORS.success }}>${formatNumber(opp.potential)}</Text>
              <Text size="2" style={{ flex: 1, textAlign: 'center' }}>{opp.stage}</Text>
              <Row style={{ flex: 1 }} justifyContent="flex-end" gap="2" alignItems="center">
                <div style={{
                  width: 60,
                  height: 6,
                  backgroundColor: 'rgba(128,128,128,0.2)',
                  borderRadius: 3,
                }}>
                  <div style={{
                    width: `${opp.likelihood}%`,
                    height: '100%',
                    backgroundColor: opp.likelihood >= 70 ? EXEC_COLORS.success : EXEC_COLORS.warning,
                    borderRadius: 3,
                  }} />
                </div>
                <Text size="2" weight="bold">{opp.likelihood}%</Text>
              </Row>
            </Row>
          ))}
        </Column>
      </Panel>
    </PageBody>
  );
}
