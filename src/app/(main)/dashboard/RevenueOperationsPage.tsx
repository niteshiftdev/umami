'use client';
import { Column, Row, Text, useTheme } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { useMessages } from '@/components/hooks';
import { getThemeColors } from '@/lib/colors';
import { CHART_COLORS } from '@/lib/constants';
import { useMemo } from 'react';
import { formatLongCurrency, formatLongNumber } from '@/lib/format';

export function RevenueOperationsPage() {
  const { formatMessage, labels } = useMessages();
  const { theme } = useTheme();
  const { colors } = useMemo(() => getThemeColors(theme), [theme]);

  // Mock data - Revenue Metrics
  const monthlyRecurringRevenue = 1247600;
  const totalPipeline = 3456789;
  const conversionRate = 18.7;
  const avgDealSize = 24500;
  const previousMRR = 1189400;
  const previousPipeline = 3245600;

  // Mock data - Revenue Over Time (last 12 months)
  const now = new Date();
  const revenueOverTimeData = useMemo(() => {
    const datasets = [];
    const newRevenue = [];
    const renewalRevenue = [];
    const expansionRevenue = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);

      // Simulate realistic revenue growth
      const monthIndex = 11 - i;
      const growthMultiplier = 1 + monthIndex * 0.04;
      const seasonalMultiplier = 1 + Math.sin(monthIndex * Math.PI / 6) * 0.15;

      const newRev = Math.floor((280000 + Math.random() * 50000) * growthMultiplier * seasonalMultiplier);
      const renewalRev = Math.floor((520000 + Math.random() * 80000) * growthMultiplier);
      const expansionRev = Math.floor((150000 + Math.random() * 30000) * growthMultiplier * seasonalMultiplier);

      newRevenue.push({ x: date.getTime(), y: newRev });
      renewalRevenue.push({ x: date.getTime(), y: renewalRev });
      expansionRevenue.push({ x: date.getTime(), y: expansionRev });
    }

    datasets.push({
      label: 'New Revenue',
      data: newRevenue,
      backgroundColor: `${CHART_COLORS[2]}80`,
      borderColor: CHART_COLORS[2],
      borderWidth: 1,
    });

    datasets.push({
      label: 'Renewal Revenue',
      data: renewalRevenue,
      backgroundColor: `${CHART_COLORS[0]}80`,
      borderColor: CHART_COLORS[0],
      borderWidth: 1,
    });

    datasets.push({
      label: 'Expansion Revenue',
      data: expansionRevenue,
      backgroundColor: `${CHART_COLORS[3]}80`,
      borderColor: CHART_COLORS[3],
      borderWidth: 1,
    });

    return { datasets };
  }, []);

  // Mock data - Sales Pipeline by Stage
  const pipelineByStageData = useMemo(() => {
    const stages = [
      { x: 'Prospecting', y: 856000 },
      { x: 'Qualification', y: 678000 },
      { x: 'Proposal', y: 534000 },
      { x: 'Negotiation', y: 412000 },
      { x: 'Closed Won', y: 287000 },
    ];

    return {
      datasets: [{
        label: 'Pipeline Value',
        data: stages,
        backgroundColor: CHART_COLORS.map(c => `${c}80`),
        borderColor: CHART_COLORS,
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - Revenue by Customer Segment
  const revenueBySegmentData = useMemo(() => {
    return {
      datasets: [{
        label: 'Revenue',
        data: [
          { x: 'Enterprise', y: 487000 },
          { x: 'Mid-Market', y: 398000 },
          { x: 'SMB', y: 256000 },
          { x: 'Startup', y: 106600 },
        ],
        backgroundColor: `${CHART_COLORS[1]}80`,
        borderColor: CHART_COLORS[1],
        borderWidth: 1,
      }],
    };
  }, []);

  // Mock data - Churn Risk Analysis
  const churnRiskData = useMemo(() => {
    return {
      datasets: [{
        label: 'At-Risk ARR',
        data: [
          { x: 'Low Risk', y: 892000 },
          { x: 'Medium Risk', y: 234000 },
          { x: 'High Risk', y: 87000 },
          { x: 'Critical', y: 34500 },
        ],
        backgroundColor: [
          `${CHART_COLORS[2]}80`,
          `${CHART_COLORS[5]}80`,
          `${CHART_COLORS[3]}80`,
          `${CHART_COLORS[4]}80`,
        ],
        borderColor: [
          CHART_COLORS[2],
          CHART_COLORS[5],
          CHART_COLORS[3],
          CHART_COLORS[4],
        ],
        borderWidth: 1,
      }],
    };
  }, []);

  const minDate = useMemo(() => {
    const date = new Date(now);
    date.setMonth(date.getMonth() - 11);
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const maxDate = useMemo(() => {
    const date = new Date(now);
    date.setHours(23, 59, 59, 999);
    return date;
  }, []);

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader
          title="Revenue Operations"
          description="Sales and CSM view of revenue drivers, pipeline, and risks"
        />
      </Column>

      <MetricsBar>
        <MetricCard
          label="Monthly Recurring Revenue"
          value={monthlyRecurringRevenue}
          change={monthlyRecurringRevenue - previousMRR}
          showChange={true}
          formatValue={(v) => `$${formatLongNumber(v)}`}
        />
        <MetricCard
          label="Total Pipeline"
          value={totalPipeline}
          change={totalPipeline - previousPipeline}
          showChange={true}
          formatValue={(v) => `$${formatLongNumber(v)}`}
        />
        <MetricCard
          label="Win Rate"
          value={conversionRate}
          formatValue={(v) => `${v.toFixed(1)}%`}
        />
        <MetricCard
          label="Avg Deal Size"
          value={avgDealSize}
          formatValue={(v) => `$${formatLongNumber(v)}`}
        />
      </MetricsBar>

      <Panel minHeight="520px" title="Revenue Trends (12 Months)">
        <BarChart
          chartData={revenueOverTimeData}
          unit="month"
          stacked={true}
          minDate={minDate}
          maxDate={maxDate}
          height="400px"
        />
      </Panel>

      <Row gap>
        <Panel minHeight="400px" title="Sales Pipeline by Stage" style={{ flex: 1 }}>
          <BarChart
            chartData={pipelineByStageData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
        <Panel minHeight="400px" title="Revenue by Segment" style={{ flex: 1 }}>
          <BarChart
            chartData={revenueBySegmentData}
            XAxisType="category"
            height="300px"
          />
        </Panel>
      </Row>

      <Panel minHeight="400px" title="Customer Churn Risk Analysis">
        <BarChart
          chartData={churnRiskData}
          XAxisType="category"
          height="300px"
        />
      </Panel>
    </PageBody>
  );
}
