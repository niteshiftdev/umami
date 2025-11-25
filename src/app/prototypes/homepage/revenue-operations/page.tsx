'use client';
import { useMemo, useCallback } from 'react';
import { Column, Row, Heading, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { GridRow } from '@/components/common/GridRow';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { renderDateLabels } from '@/lib/charts';
import { formatNumber } from '@/lib/format';
import { Money } from '@/components/svg';

// Mock data for Revenue Operations persona
function generateRevenueData() {
  const today = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    // Revenue pattern - lower on weekends, end of month spike
    const dayOfMonth = date.getDate();
    const endOfMonthBonus = dayOfMonth > 25 ? 15000 : 0;
    const baseRevenue = isWeekend ? 8500 : 24000;
    const variance = Math.random() * 8000 - 4000;
    data.push({
      x: dateStr,
      y: Math.round(baseRevenue + endOfMonthBonus + variance),
    });
  }
  return data;
}

function generateMRRData() {
  const today = new Date();
  const data = [];
  let mrr = 485000; // Starting MRR
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    // Growth pattern with some variation
    const growth = 0.02 + Math.random() * 0.03;
    mrr = Math.round(mrr * (1 + growth));
    data.push({
      x: dateStr,
      y: mrr,
    });
  }
  return data;
}

function generatePipelineData() {
  const today = new Date();
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseDeals = isWeekend ? 2 : 8;
    data.push({
      x: dateStr,
      y: Math.round(baseDeals + Math.random() * 6 - 3),
    });
  }
  return data;
}

// Pipeline stages
const pipelineStages = [
  { stage: 'Qualified Lead', count: 248, value: 2480000, avgDays: 5, winRate: 45 },
  { stage: 'Discovery', count: 156, value: 1872000, avgDays: 12, winRate: 52 },
  { stage: 'Proposal', count: 89, value: 1602000, avgDays: 8, winRate: 68 },
  { stage: 'Negotiation', count: 42, value: 924000, avgDays: 14, winRate: 78 },
  { stage: 'Closed Won', count: 28, value: 672000, avgDays: 0, winRate: 100 },
];

// Customer health scores
const customerHealth = [
  { segment: 'Healthy', count: 842, arr: 4210000, color: '#44b556' },
  { segment: 'At Risk', count: 124, arr: 620000, color: '#e68619' },
  { segment: 'Critical', count: 38, arr: 190000, color: '#e34850' },
];

// Top accounts by ARR
const topAccounts = [
  { name: 'Acme Corporation', arr: 156000, health: 'Healthy', csm: 'Sarah Johnson', renewal: '2025-03-15' },
  { name: 'TechStart Inc', arr: 124000, health: 'At Risk', csm: 'Mike Chen', renewal: '2025-01-28' },
  { name: 'Global Dynamics', arr: 98000, health: 'Healthy', csm: 'Emily Davis', renewal: '2025-06-10' },
  { name: 'Innovate Labs', arr: 87000, health: 'Healthy', csm: 'James Wilson', renewal: '2025-04-22' },
  { name: 'Digital Solutions', arr: 76000, health: 'Critical', csm: 'Sarah Johnson', renewal: '2024-12-15' },
];

// Revenue breakdown by product
const revenueByProduct = [
  { product: 'Enterprise Plan', revenue: 2845000, percentage: 48.2 },
  { product: 'Professional Plan', revenue: 1892000, percentage: 32.1 },
  { product: 'Starter Plan', revenue: 684000, percentage: 11.6 },
  { product: 'Add-ons', revenue: 478000, percentage: 8.1 },
];

// Churn risk accounts
const churnRiskAccounts = [
  { name: 'Digital Solutions', arr: 76000, riskScore: 92, reason: 'Low engagement, support tickets', daysToRenewal: 20 },
  { name: 'CloudFirst Ltd', arr: 54000, riskScore: 85, reason: 'Competitor evaluation', daysToRenewal: 45 },
  { name: 'DataStream Corp', arr: 42000, riskScore: 78, reason: 'Budget constraints', daysToRenewal: 62 },
  { name: 'TechStart Inc', arr: 124000, riskScore: 72, reason: 'Key stakeholder left', daysToRenewal: 64 },
];

// Expansion opportunities
const expansionOpportunities = [
  { name: 'Acme Corporation', currentArr: 156000, potentialArr: 245000, likelihood: 85, stage: 'Proposal' },
  { name: 'Global Dynamics', currentArr: 98000, potentialArr: 156000, likelihood: 72, stage: 'Discovery' },
  { name: 'Innovate Labs', currentArr: 87000, potentialArr: 124000, likelihood: 68, stage: 'Qualified' },
];

export default function RevenueOperationsPage() {
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Generate mock data
  const revenueData = useMemo(() => generateRevenueData(), []);
  const mrrData = useMemo(() => generateMRRData(), []);
  const pipelineData = useMemo(() => generatePipelineData(), []);

  // Calculate date ranges
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const twelveMonthsAgo = new Date(today);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  // Revenue chart data
  const revenueChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Revenue',
          data: revenueData,
          backgroundColor: CHART_COLORS[2],
          borderColor: CHART_COLORS[2],
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [revenueData],
  );

  // MRR chart data
  const mrrChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'MRR',
          data: mrrData,
          backgroundColor: CHART_COLORS[0],
          borderColor: CHART_COLORS[0],
          borderWidth: 1,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    }),
    [mrrData],
  );

  // Pipeline chart data
  const pipelineChartData = useMemo(
    () => ({
      datasets: [
        {
          type: 'bar' as const,
          label: 'New Deals',
          data: pipelineData,
          backgroundColor: CHART_COLORS[1],
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
          barPercentage: 0.8,
          categoryPercentage: 0.9,
        },
      ],
    }),
    [pipelineData],
  );

  // Customer health pie
  const healthPieData = useMemo(
    () => ({
      labels: customerHealth.map(h => h.segment),
      datasets: [
        {
          data: customerHealth.map(h => h.count),
          backgroundColor: customerHealth.map(h => h.color),
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  // Product revenue pie
  const productPieData = useMemo(
    () => ({
      labels: revenueByProduct.map(p => p.product),
      datasets: [
        {
          data: revenueByProduct.map(p => p.revenue),
          backgroundColor: CHART_COLORS.slice(0, revenueByProduct.length),
          borderWidth: 0,
        },
      ],
    }),
    [],
  );

  const renderDayLabel = useCallback(renderDateLabels('day', 'en-US'), []);
  const renderMonthLabel = useCallback(renderDateLabels('month', 'en-US'), []);

  // Calculate key metrics
  const totalArr = customerHealth.reduce((sum, h) => sum + h.arr, 0);
  const totalPipelineValue = pipelineStages.reduce((sum, s) => sum + s.value, 0);
  const currentMrr = mrrData[mrrData.length - 1]?.y || 0;

  return (
    <PageBody>
      <PageHeader title="Revenue Operations" icon={<Money />} description="Sales and CSM view of revenue drivers, pipeline, and risks" />

      {/* Key Revenue Metrics */}
      <MetricsBar>
        <MetricCard value={currentMrr} label="MRR" change={currentMrr * 0.96} showChange formatValue={(n: number) => `$${formatNumber(n)}`} />
        <MetricCard value={totalArr} label="Total ARR" change={totalArr * 0.94} showChange formatValue={(n: number) => `$${formatNumber(n)}`} />
        <MetricCard value={totalPipelineValue} label="Pipeline Value" change={totalPipelineValue * 0.88} showChange formatValue={(n: number) => `$${formatNumber(n)}`} />
        <MetricCard value={2.8} label="Net Revenue Retention" change={2.5} showChange formatValue={(n: number) => `${(n * 100).toFixed(0)}%`} />
        <MetricCard value={4.2} label="Churn Rate" change={4.8} showChange reverseColors formatValue={(n: number) => `${n.toFixed(1)}%`} />
      </MetricsBar>

      {/* Revenue and MRR Charts */}
      <GridRow layout="two">
        <Panel title="Daily Revenue (Last 30 Days)">
          <BarChart
            chartData={revenueChartData}
            unit="day"
            minDate={thirtyDaysAgo}
            maxDate={today}
            renderXLabel={renderDayLabel}
            height="280px"
            currency="USD"
          />
        </Panel>
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
      </GridRow>

      {/* Pipeline and Health */}
      <GridRow layout="two">
        <Panel title="New Deals Created">
          <BarChart
            chartData={pipelineChartData}
            unit="day"
            minDate={thirtyDaysAgo}
            maxDate={today}
            renderXLabel={renderDayLabel}
            height="280px"
          />
        </Panel>
        <Panel title="Customer Health Distribution">
          <Row justifyContent="center" alignItems="center" height="280px">
            <PieChart type="doughnut" chartData={healthPieData} width="260px" height="260px" />
          </Row>
        </Panel>
      </GridRow>

      {/* Pipeline Stages */}
      <Panel title="Pipeline by Stage">
        <Column gap="2">
          <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
            <Text size="1" weight="bold" style={{ flex: 2 }}>
              Stage
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Deals
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Value
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Avg Days
            </Text>
            <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
              Win Rate
            </Text>
          </Row>
          {pipelineStages.map((item, idx) => (
            <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Row gap="2" alignItems="center" style={{ flex: 2 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: CHART_COLORS[idx],
                  }}
                />
                <Text size="2">{item.stage}</Text>
              </Row>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                {item.count}
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                ${formatNumber(item.value)}
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                {item.avgDays > 0 ? `${item.avgDays}d` : '-'}
              </Text>
              <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                {item.winRate}%
              </Text>
            </Row>
          ))}
        </Column>
      </Panel>

      {/* Top Accounts and Revenue by Product */}
      <GridRow layout="two">
        <Panel title="Top Accounts by ARR">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Account
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                ARR
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
                Health
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Renewal
              </Text>
            </Row>
            {topAccounts.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Column style={{ flex: 2 }}>
                  <Text size="2" truncate>
                    {item.name}
                  </Text>
                  <Text size="1" color="muted">
                    {item.csm}
                  </Text>
                </Column>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  ${formatNumber(item.arr)}
                </Text>
                <Text
                  size="2"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    color: item.health === 'Healthy' ? '#44b556' : item.health === 'At Risk' ? '#e68619' : '#e34850',
                  }}
                >
                  {item.health}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.renewal}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        <Panel title="Revenue by Product">
          <Row justifyContent="center" alignItems="center" height="280px">
            <PieChart type="doughnut" chartData={productPieData} width="260px" height="260px" />
          </Row>
        </Panel>
      </GridRow>

      {/* Risk and Opportunities */}
      <GridRow layout="two">
        {/* Churn Risk */}
        <Panel title="Churn Risk Accounts">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Account
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                ARR
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Risk
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Days
              </Text>
            </Row>
            {churnRiskAccounts.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Column style={{ flex: 2 }}>
                  <Text size="2" truncate>
                    {item.name}
                  </Text>
                  <Text size="1" color="muted" truncate>
                    {item.reason}
                  </Text>
                </Column>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  ${formatNumber(item.arr)}
                </Text>
                <Text
                  size="2"
                  style={{
                    flex: 1,
                    textAlign: 'right',
                    color: item.riskScore >= 80 ? '#e34850' : '#e68619',
                  }}
                >
                  {item.riskScore}%
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  {item.daysToRenewal}d
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Expansion Opportunities */}
        <Panel title="Expansion Opportunities">
          <Column gap="2">
            <Row paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
              <Text size="1" weight="bold" style={{ flex: 2 }}>
                Account
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Current
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'right' }}>
                Potential
              </Text>
              <Text size="1" weight="bold" style={{ flex: 1, textAlign: 'center' }}>
                Stage
              </Text>
            </Row>
            {expansionOpportunities.map((item, idx) => (
              <Row key={idx} paddingX="3" paddingY="2" style={{ borderBottom: `1px solid ${colors.chart.line}` }}>
                <Column style={{ flex: 2 }}>
                  <Text size="2" truncate>
                    {item.name}
                  </Text>
                  <Text size="1" color="muted">
                    {item.likelihood}% likelihood
                  </Text>
                </Column>
                <Text size="2" style={{ flex: 1, textAlign: 'right' }}>
                  ${formatNumber(item.currentArr)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'right', color: '#44b556' }}>
                  ${formatNumber(item.potentialArr)}
                </Text>
                <Text size="2" style={{ flex: 1, textAlign: 'center' }}>
                  {item.stage}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </GridRow>
    </PageBody>
  );
}
