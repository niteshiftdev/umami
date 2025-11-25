'use client';
/**
 * Revenue Operations - Dial 1: "Pipeline Focus"
 * Design exploration: Pipeline-centric view, stage progression bars, darker accents
 * Focus: Deal stages, health indicators, compact revenue metrics
 */
import { useMemo, useCallback } from 'react';
import { Column, Row, Grid, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { getThemeColors } from '@/lib/colors';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Money } from '@/components/svg';

// Pipeline-focused colors
const PIPELINE_COLORS = {
  qualified: '#2680eb',
  discovery: '#9256d9',
  proposal: '#e68619',
  negotiation: '#44b556',
  closedWon: '#01bad7',
  health: {
    healthy: '#44b556',
    atRisk: '#e68619',
    critical: '#e34850',
  },
};

function generateMRRData() {
  const today = new Date();
  const data = [];
  let mrr = 485000;
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    mrr = Math.round(mrr * (1 + 0.02 + Math.random() * 0.03));
    data.push({ x: dateStr, y: mrr });
  }
  return data;
}

const pipelineStages = [
  { stage: 'Qualified Lead', deals: 248, value: 2480000, avgDays: 5, conversion: 63 },
  { stage: 'Discovery', deals: 156, value: 1872000, avgDays: 12, conversion: 57 },
  { stage: 'Proposal', deals: 89, value: 1602000, avgDays: 8, conversion: 47 },
  { stage: 'Negotiation', deals: 42, value: 924000, avgDays: 14, conversion: 67 },
  { stage: 'Closed Won', deals: 28, value: 672000, avgDays: 0, conversion: 100 },
];

const accountHealth = [
  { name: 'Acme Corporation', arr: 156000, health: 'healthy', csm: 'Sarah J.', daysToRenewal: 110 },
  { name: 'TechStart Inc', arr: 124000, health: 'atRisk', csm: 'Mike C.', daysToRenewal: 64 },
  { name: 'Global Dynamics', arr: 98000, health: 'healthy', csm: 'Emily D.', daysToRenewal: 197 },
  { name: 'Digital Solutions', arr: 76000, health: 'critical', csm: 'Sarah J.', daysToRenewal: 20 },
  { name: 'Innovate Labs', arr: 87000, health: 'healthy', csm: 'James W.', daysToRenewal: 148 },
];

// Pipeline stage bar
function PipelineStageBar({ stage, deals, value, avgDays, conversion, color, maxValue }: any) {
  const widthPercent = (value / maxValue) * 100;
  return (
    <Column gap="2" paddingY="3" style={{ borderBottom: '1px solid rgba(128,128,128,0.2)' }}>
      <Row justifyContent="space-between" alignItems="center">
        <Row gap="2" alignItems="center">
          <div style={{ width: 4, height: 32, borderRadius: 2, backgroundColor: color }} />
          <Column>
            <Text size="2" weight="bold">{stage}</Text>
            <Text size="1" color="muted">{deals} deals | {avgDays > 0 ? `${avgDays}d avg` : 'Closed'}</Text>
          </Column>
        </Row>
        <Column alignItems="flex-end">
          <Text size="2" weight="bold">${formatNumber(value)}</Text>
          <Text size="1" color="muted">{conversion}% conv.</Text>
        </Column>
      </Row>
      <div style={{ width: '100%', height: 8, backgroundColor: 'rgba(128,128,128,0.15)', borderRadius: 4 }}>
        <div style={{ width: `${widthPercent}%`, height: '100%', backgroundColor: color, borderRadius: 4, transition: 'width 0.3s' }} />
      </div>
    </Column>
  );
}

// Health indicator badge
function HealthBadge({ health }: { health: string }) {
  const color = PIPELINE_COLORS.health[health as keyof typeof PIPELINE_COLORS.health];
  return (
    <div style={{
      padding: '2px 8px',
      borderRadius: 12,
      backgroundColor: `${color}20`,
      border: `1px solid ${color}`,
    }}>
      <Text size="1" style={{ color, textTransform: 'capitalize' }}>{health}</Text>
    </div>
  );
}

// Compact revenue metric
function RevenueMetric({ label, value, change }: { label: string; value: string; change: number }) {
  return (
    <Column paddingX="4" paddingY="3" borderRadius="2" backgroundColor border>
      <Text size="1" color="muted">{label}</Text>
      <Row alignItems="baseline" gap="2">
        <Text size="5" weight="bold">{value}</Text>
        <Text size="1" style={{ color: change >= 0 ? PIPELINE_COLORS.health.healthy : PIPELINE_COLORS.health.critical }}>
          {change >= 0 ? '+' : ''}{change}%
        </Text>
      </Row>
    </Column>
  );
}

export default function RevenueOperationsDial1Page() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  const mrrData = useMemo(() => generateMRRData(), []);

  const today = new Date();
  const twelveMonthsAgo = new Date(today);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const mrrChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'MRR',
          data: mrrData,
          backgroundColor: PIPELINE_COLORS.qualified,
          borderColor: PIPELINE_COLORS.qualified,
          borderWidth: 0,
          barPercentage: 0.65,
          categoryPercentage: 0.8,
          borderRadius: 3,
        },
      ],
    }),
    [mrrData],
  );

  const renderMonthLabel = useCallback(renderDateLabels('month', 'en-US'), []);

  const totalPipelineValue = pipelineStages.reduce((sum, s) => sum + s.value, 0);
  const maxStageValue = Math.max(...pipelineStages.map(s => s.value));
  const currentMrr = mrrData[mrrData.length - 1]?.y || 0;
  const stageColors = [PIPELINE_COLORS.qualified, PIPELINE_COLORS.discovery, PIPELINE_COLORS.proposal, PIPELINE_COLORS.negotiation, PIPELINE_COLORS.closedWon];

  return (
    <PageBody>
      <PageHeader title="Revenue Operations" icon={<Money />} description="Pipeline Focus Layout - Stage Progression" />

      {/* Compact Metrics */}
      <Grid columns={{ xs: '1fr 1fr', md: 'repeat(5, 1fr)' }} gap="2">
        <RevenueMetric label="MRR" value={`$${formatNumber(currentMrr)}`} change={4.2} />
        <RevenueMetric label="ARR" value="$5.0M" change={3.8} />
        <RevenueMetric label="Pipeline" value={`$${formatNumber(totalPipelineValue)}`} change={12.4} />
        <RevenueMetric label="NRR" value="118%" change={2.1} />
        <RevenueMetric label="Churn" value="4.2%" change={-0.8} />
      </Grid>

      {/* Pipeline Stages - Main Focus */}
      <Panel title="Pipeline by Stage">
        <Column>
          {pipelineStages.map((stage, idx) => (
            <PipelineStageBar
              key={stage.stage}
              {...stage}
              color={stageColors[idx]}
              maxValue={maxStageValue}
            />
          ))}
        </Column>
        <Row justifyContent="flex-end" paddingTop="3">
          <Text size="2" weight="bold">Total Pipeline: ${formatNumber(totalPipelineValue)}</Text>
        </Row>
      </Panel>

      {/* MRR Trend and Account Health Side by Side */}
      <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="3">
        <Panel title="MRR Trend (12 Months)">
          <BarChart
            chartData={mrrChartData}
            unit="month"
            minDate={twelveMonthsAgo}
            maxDate={today}
            renderXLabel={renderMonthLabel}
            height="280px"
            currency="USD"
          />
        </Panel>

        <Panel title="Account Health Monitor">
          <Column gap="2">
            {accountHealth.map((account, idx) => (
              <Row key={idx} justifyContent="space-between" alignItems="center" paddingY="2" paddingX="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Column style={{ flex: 1 }}>
                  <Text size="2" weight="bold" truncate>{account.name}</Text>
                  <Text size="1" color="muted">{account.csm} | {account.daysToRenewal}d to renewal</Text>
                </Column>
                <Row gap="3" alignItems="center">
                  <Text size="2">${formatNumber(account.arr)}</Text>
                  <HealthBadge health={account.health} />
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>
      </Grid>
    </PageBody>
  );
}
