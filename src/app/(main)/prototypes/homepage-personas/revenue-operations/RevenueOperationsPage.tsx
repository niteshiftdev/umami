'use client';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { MetricCard } from '@/components/metrics/MetricCard';
import { Column, Row, Heading, Text, Grid, DataTable, DataColumn } from '@umami/react-zen';
import { useMessages } from '@/components/hooks';
import { useMemo } from 'react';
import { CHART_COLORS } from '@/lib/constants';

export function RevenueOperationsPage() {
  const { formatMessage, labels } = useMessages();

  // Mock data for revenue metrics
  const revenueMetrics = useMemo(
    () => ({
      totalRevenue: 2847650,
      previousTotalRevenue: 2634200,
      monthlyRecurring: 456780,
      previousMonthlyRecurring: 423450,
      avgDealSize: 24560,
      previousAvgDealSize: 23100,
      pipelineValue: 8945000,
      previousPipelineValue: 8234000,
    }),
    [],
  );

  // Mock data for monthly revenue trend over 12 months
  const monthlyRevenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const newRevenue = [
      185000, 192000, 198000, 210000, 223000, 234000, 245000, 251000, 267000, 278000, 289000, 304000,
    ];
    const expansionRevenue = [
      32000, 28000, 35000, 41000, 38000, 45000, 52000, 48000, 56000, 61000, 58000, 67000,
    ];

    return {
      labels: months,
      datasets: [
        {
          label: 'New Revenue',
          data: newRevenue,
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '40',
        },
        {
          label: 'Expansion Revenue',
          data: expansionRevenue,
          borderColor: CHART_COLORS[0],
          backgroundColor: CHART_COLORS[0] + '40',
        },
      ],
    };
  }, []);

  // Mock data for revenue by segment
  const revenueBySegmentData = useMemo(
    () => ({
      labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
      datasets: [
        {
          label: 'Revenue',
          data: [1234500, 892340, 534280, 186530],
          backgroundColor: [CHART_COLORS[0], CHART_COLORS[1], CHART_COLORS[2], CHART_COLORS[3]],
        },
      ],
    }),
    [],
  );

  // Mock data for sales pipeline by stage
  const pipelineByStageData = useMemo(
    () => ({
      labels: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'],
      datasets: [
        {
          label: 'Pipeline Value ($)',
          data: [2450000, 1890000, 1567000, 892000, 456000],
          backgroundColor: CHART_COLORS[4] + '70',
          borderColor: CHART_COLORS[4],
          borderWidth: 2,
        },
      ],
    }),
    [],
  );

  // Mock data for revenue by product line
  const revenueByProductData = useMemo(() => {
    return {
      labels: ['Professional', 'Enterprise', 'Premium', 'Starter', 'Add-ons'],
      datasets: [
        {
          label: 'Revenue',
          data: [1145600, 892300, 534700, 186500, 88550],
          backgroundColor: CHART_COLORS[1] + '60',
          borderColor: CHART_COLORS[1],
          borderWidth: 1,
        },
      ],
    };
  }, []);

  // Mock data for top deals at risk
  const dealsAtRiskData = useMemo(
    () => [
      {
        account: 'Acme Corporation',
        value: 125000,
        stage: 'Negotiation',
        probability: 65,
        closeDate: '2025-12-15',
        owner: 'Sarah Johnson',
        riskLevel: 'high',
      },
      {
        account: 'TechStart Inc',
        value: 89000,
        stage: 'Proposal',
        probability: 50,
        closeDate: '2025-12-20',
        owner: 'Mike Chen',
        riskLevel: 'high',
      },
      {
        account: 'Global Industries',
        value: 245000,
        stage: 'Qualification',
        probability: 45,
        closeDate: '2026-01-10',
        owner: 'Jessica Martinez',
        riskLevel: 'medium',
      },
      {
        account: 'Innovation Labs',
        value: 67000,
        stage: 'Negotiation',
        probability: 70,
        closeDate: '2025-12-18',
        owner: 'David Kim',
        riskLevel: 'medium',
      },
      {
        account: 'Digital Ventures',
        value: 156000,
        stage: 'Proposal',
        probability: 55,
        closeDate: '2025-12-28',
        owner: 'Emily Brown',
        riskLevel: 'high',
      },
    ],
    [],
  );

  // Mock data for conversion rates by stage
  const conversionRatesData = useMemo(
    () => ({
      labels: ['Lead→Qualified', 'Qualified→Proposal', 'Proposal→Negotiation', 'Negotiation→Closed'],
      datasets: [
        {
          label: 'Conversion Rate %',
          data: [34, 56, 68, 72],
          backgroundColor: CHART_COLORS[5] + '70',
          borderColor: CHART_COLORS[5],
          borderWidth: 2,
        },
      ],
    }),
    [],
  );

  const getRiskBadgeStyle = (level: string) => {
    switch (level) {
      case 'high':
        return {
          backgroundColor: '#fee',
          color: '#c00',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        };
      case 'medium':
        return {
          backgroundColor: '#ffeaa7',
          color: '#d63031',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        };
      default:
        return {
          backgroundColor: '#e8f5e9',
          color: '#2e7d32',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
        };
    }
  };

  return (
    <PageBody>
      <Column gap="6" paddingY="6">
        <PageHeader title="Revenue Operations Dashboard" />

        <Text size="md" style={{ color: 'var(--gray500)' }}>
          Monitor revenue performance, pipeline health, and sales metrics to drive strategic decisions
        </Text>

        {/* Key Metrics Row */}
        <Grid columns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }} gap="4">
          <Panel>
            <MetricCard
              value={revenueMetrics.totalRevenue}
              previousValue={revenueMetrics.previousTotalRevenue}
              label="Total Revenue"
              formatValue={n => `$${(n / 1000000).toFixed(2)}M`}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={revenueMetrics.monthlyRecurring}
              previousValue={revenueMetrics.previousMonthlyRecurring}
              label="Monthly Recurring Revenue"
              formatValue={n => `$${(n / 1000).toFixed(0)}K`}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={revenueMetrics.avgDealSize}
              previousValue={revenueMetrics.previousAvgDealSize}
              label="Avg. Deal Size"
              formatValue={n => `$${n.toLocaleString()}`}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={revenueMetrics.pipelineValue}
              previousValue={revenueMetrics.previousPipelineValue}
              label="Pipeline Value"
              formatValue={n => `$${(n / 1000000).toFixed(1)}M`}
              showLabel
              showChange
            />
          </Panel>
        </Grid>

        {/* Monthly Revenue Trend */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Monthly Revenue Trend</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              New and expansion revenue breakdown over the past 12 months
            </Text>
            <BarChart chartData={monthlyRevenueData} height={320} unit="$" />
          </Column>
        </Panel>

        {/* Two Column Layout for Charts */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">Revenue by Customer Segment</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Revenue distribution across customer segments
              </Text>
              <PieChart chartData={revenueBySegmentData} height={300} type="doughnut" />
            </Column>
          </Panel>

          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">Sales Pipeline by Stage</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Total pipeline value at each stage of the sales process
              </Text>
              <BarChart chartData={pipelineByStageData} height={300} unit="$" />
            </Column>
          </Panel>
        </Grid>

        {/* Revenue by Product Line */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Revenue by Product Line</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Performance comparison across different product offerings
            </Text>
            <BarChart chartData={revenueByProductData} height={280} unit="$" />
          </Column>
        </Panel>

        {/* Conversion Rates */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Sales Stage Conversion Rates</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Conversion efficiency between each stage of the sales funnel
            </Text>
            <BarChart chartData={conversionRatesData} height={280} unit="%" />
          </Column>
        </Panel>

        {/* Deals at Risk Table */}
        <Panel>
          <Column gap="3">
            <Heading size="md">High-Priority Deals Requiring Attention</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Active deals with potential risk factors or upcoming close dates
            </Text>
            <DataTable data={dealsAtRiskData}>
              <DataColumn id="account" label="Account" />
              <DataColumn id="value" label="Value">
                {row => `$${row.value.toLocaleString()}`}
              </DataColumn>
              <DataColumn id="stage" label="Stage" />
              <DataColumn id="probability" label="Probability">
                {row => `${row.probability}%`}
              </DataColumn>
              <DataColumn id="closeDate" label="Close Date" />
              <DataColumn id="owner" label="Owner" />
              <DataColumn id="riskLevel" label="Risk">
                {row => (
                  <span style={getRiskBadgeStyle(row.riskLevel)}>
                    {row.riskLevel.toUpperCase()}
                  </span>
                )}
              </DataColumn>
            </DataTable>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
