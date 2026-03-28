'use client';

import { useMemo, useState, useEffect } from 'react';
import { Column, Row, Grid, Text, Heading } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import {
  useDynamicColor,
  useDynamicVariant,
  useDynamicSpacing,
  useDynamicNumber,
  useDynamicBoolean,
} from '@niteshift/dials';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Briefcase,
  CreditCard,
} from '@/components/icons';

// Generate time series data for revenue
function generateRevenueData(baseValue: number, variance: number, days: number = 30) {
  const now = new Date();
  const data: { x: string; y: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    // Revenue tends to spike at end of month
    const endOfMonthFactor = date.getDate() > 25 ? 1.4 : 1;
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.3 : 1;
    const trendFactor = 1 + (days - i) * 0.012;
    const randomFactor = 0.7 + Math.random() * 0.6;
    const value = Math.round(baseValue * endOfMonthFactor * weekendFactor * trendFactor * randomFactor * variance);
    data.push({ x: dateStr, y: value });
  }

  return data;
}

// Pipeline stage data
const pipelineData = {
  labels: ['Prospect', 'Qualified', 'Demo', 'Proposal', 'Negotiation', 'Closed Won'],
  datasets: [
    {
      label: 'Deals',
      data: [145, 98, 67, 42, 28, 18],
      backgroundColor: [
        'rgba(38, 128, 235, 0.3)',
        'rgba(38, 128, 235, 0.4)',
        'rgba(38, 128, 235, 0.5)',
        'rgba(38, 128, 235, 0.6)',
        'rgba(38, 128, 235, 0.8)',
        'rgba(68, 181, 86, 0.9)',
      ],
      borderColor: [
        '#2680eb',
        '#2680eb',
        '#2680eb',
        '#2680eb',
        '#2680eb',
        '#44b556',
      ],
      borderWidth: 1,
    },
  ],
};

// Revenue by segment
const revenueSegmentData = {
  labels: ['Enterprise', 'Mid-Market', 'SMB', 'Startup'],
  datasets: [
    {
      data: [45, 28, 18, 9],
      backgroundColor: [
        '#2680eb',
        '#9256d9',
        '#44b556',
        '#e68619',
      ],
      borderWidth: 0,
    },
  ],
};

// MRR movement data
const mrrMovementData = {
  labels: ['New', 'Expansion', 'Contraction', 'Churn', 'Net'],
  datasets: [
    {
      label: 'MRR ($)',
      data: [125000, 45000, -15000, -28000, 127000],
      backgroundColor: [
        'rgba(68, 181, 86, 0.8)',
        'rgba(38, 128, 235, 0.8)',
        'rgba(230, 134, 25, 0.8)',
        'rgba(227, 72, 80, 0.8)',
        'rgba(146, 86, 217, 0.8)',
      ],
      borderColor: [
        '#44b556',
        '#2680eb',
        '#e68619',
        '#e34850',
        '#9256d9',
      ],
      borderWidth: 1,
    },
  ],
};

// At-risk accounts
const atRiskAccounts = [
  { name: 'Acme Corp', mrr: 8500, health: 32, reason: 'Low usage last 30 days', daysInactive: 21 },
  { name: 'TechStart Inc', mrr: 4200, health: 45, reason: 'Support tickets increased', daysInactive: 14 },
  { name: 'Global Systems', mrr: 12800, health: 38, reason: 'Failed renewal call', daysInactive: 7 },
  { name: 'DataFlow Ltd', mrr: 3100, health: 52, reason: 'Champion left company', daysInactive: 30 },
  { name: 'CloudNine Solutions', mrr: 6700, health: 41, reason: 'Competitor evaluation', daysInactive: 5 },
];

// Top expansion opportunities
const expansionOpps = [
  { name: 'Enterprise Solutions', currentMRR: 15000, potentialMRR: 32000, probability: 78 },
  { name: 'Innovate Tech', currentMRR: 8200, potentialMRR: 18500, probability: 65 },
  { name: 'Scale Corp', currentMRR: 12500, potentialMRR: 24000, probability: 82 },
  { name: 'GrowthCo', currentMRR: 5800, potentialMRR: 14200, probability: 55 },
];

export default function RevenueOperationsPage() {
  // Dials for customization
  const primaryColor = useDynamicColor('ro-primary-color', {
    label: 'Primary Color',
    default: '#2680eb',
    options: ['#2680eb', '#44b556', '#9256d9', '#e68619', '#e34850'],
    group: 'Colors',
  });

  const successColor = useDynamicColor('ro-success-color', {
    label: 'Success Color',
    default: '#44b556',
    options: ['#44b556', '#2680eb', '#9256d9', '#01bad7'],
    group: 'Colors',
  });

  const dangerColor = useDynamicColor('ro-danger-color', {
    label: 'Danger Color',
    default: '#e34850',
    options: ['#e34850', '#e68619', '#9256d9', '#f15bb5'],
    group: 'Colors',
  });

  const layoutVariant = useDynamicVariant('ro-layout', {
    label: 'Layout Style',
    default: 'executive',
    options: ['executive', 'detailed', 'compact'] as const,
    group: 'Layout',
  });

  const cardSpacing = useDynamicSpacing('ro-card-spacing', {
    label: 'Card Spacing',
    default: '24px',
    options: ['16px', '20px', '24px', '32px'],
    group: 'Spacing',
  });

  const chartHeight = useDynamicNumber('ro-chart-height', {
    label: 'Chart Height',
    default: 280,
    min: 200,
    max: 450,
    step: 50,
    unit: 'px',
    group: 'Charts',
  });

  const showRiskAlerts = useDynamicBoolean('ro-show-risks', {
    label: 'Show Risk Alerts',
    default: true,
    group: 'Features',
  });

  const showExpansionOpps = useDynamicBoolean('ro-show-expansion', {
    label: 'Show Expansion Opportunities',
    default: true,
    group: 'Features',
  });

  // Revenue over time data
  const revenueTimeData = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 29);

    return {
      datasets: [
        {
          type: 'bar' as const,
          label: 'Daily Revenue',
          data: generateRevenueData(45000, 1, 30),
          backgroundColor: `${successColor}66`,
          borderColor: successColor,
          borderWidth: 1,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ],
    };
  }, [successColor]);

  // Use state for client-side rendering to avoid SSR date formatting issues
  const [isClient, setIsClient] = useState(false);
  const [dateRange, setDateRange] = useState<{ minDate: Date; maxDate: Date } | null>(null);

  useEffect(() => {
    setIsClient(true);
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    setDateRange({ minDate: start, maxDate: now });
  }, []);

  const gapValue = cardSpacing.replace('px', '');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return formatCurrency(value);
  };

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader
          title="Revenue Operations"
          description="Sales and CSM view of revenue drivers, pipeline health, and customer risks"
        />

        {/* Key Revenue Metrics */}
        <MetricsBar>
          <MetricCard
            label="Monthly Recurring Revenue"
            value={847500}
            change={42300}
            showChange
            formatValue={formatCompactCurrency}
          />
          <MetricCard
            label="Annual Run Rate"
            value={10170000}
            change={507600}
            showChange
            formatValue={formatCompactCurrency}
          />
          <MetricCard
            label="Net Revenue Retention"
            value={118}
            change={3}
            showChange
            formatValue={(v) => `${v}%`}
          />
          <MetricCard
            label="Gross Margin"
            value={78.4}
            change={1.2}
            showChange
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
        </MetricsBar>

        {/* Pipeline & Churn Metrics */}
        <MetricsBar>
          <MetricCard
            label="Pipeline Value"
            value={2340000}
            change={187000}
            showChange
            formatValue={formatCompactCurrency}
          />
          <MetricCard
            label="Avg. Deal Size"
            value={42500}
            change={3200}
            showChange
            formatValue={formatCurrency}
          />
          <MetricCard
            label="Win Rate"
            value={32.4}
            change={2.8}
            showChange
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
          <MetricCard
            label="Churn Rate"
            value={2.1}
            change={-0.4}
            showChange
            reverseColors
            formatValue={(v) => `${v.toFixed(1)}%`}
          />
        </MetricsBar>

        {/* Main Charts Section */}
        <Grid
          columns={layoutVariant === 'compact' ? '1fr' : { xs: '1fr', lg: '2fr 1fr' }}
          gap={gapValue as any}
        >
          {/* Revenue Over Time */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Revenue Trend</Heading>
              <Text color="muted" size="1">Daily revenue over the last 30 days</Text>
            </Column>
            {dateRange && (
              <BarChart
                chartData={revenueTimeData}
                unit="day"
                minDate={dateRange.minDate}
                maxDate={dateRange.maxDate}
                height={`${chartHeight}px`}
                currency="USD"
              />
            )}
          </Column>

          {/* Revenue by Segment */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Revenue by Segment</Heading>
              <Text color="muted" size="1">Distribution across customer tiers</Text>
            </Column>
            <PieChart
              chartData={revenueSegmentData}
              type="doughnut"
              height={`${chartHeight}px`}
            />
          </Column>
        </Grid>

        {/* Pipeline & MRR Movement */}
        <Grid
          columns={layoutVariant === 'detailed' ? '1fr' : { xs: '1fr', lg: '1fr 1fr' }}
          gap={gapValue as any}
        >
          {/* Pipeline Stages */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">Pipeline by Stage</Heading>
              <Text color="muted" size="1">Deal progression through sales funnel</Text>
            </Column>
            {isClient && (
              <BarChart
                chartData={pipelineData}
                XAxisType="category"
                height={`${chartHeight}px`}
              />
            )}
          </Column>

          {/* MRR Movement */}
          <Column
            backgroundColor
            border
            borderRadius="3"
            padding="6"
            gap="4"
          >
            <Column gap="1">
              <Heading size="2">MRR Movement</Heading>
              <Text color="muted" size="1">This month's recurring revenue changes</Text>
            </Column>
            {isClient && (
              <BarChart
                chartData={mrrMovementData}
                XAxisType="category"
                height={`${chartHeight}px`}
                currency="USD"
              />
            )}
          </Column>
        </Grid>

        {/* Risk & Opportunity Tables */}
        <Grid
          columns={{ xs: '1fr', lg: showExpansionOpps && showRiskAlerts ? '1fr 1fr' : '1fr' }}
          gap={gapValue as any}
        >
          {/* At-Risk Accounts */}
          {showRiskAlerts && (
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="6"
              gap="4"
            >
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Heading size="2">At-Risk Accounts</Heading>
                  <Text color="muted" size="1">Accounts requiring immediate attention</Text>
                </Column>
                <Row
                  alignItems="center"
                  gap="2"
                  padding="2"
                  style={{ backgroundColor: `${dangerColor}20`, borderRadius: '4px' }}
                >
                  <AlertTriangle size={16} style={{ color: dangerColor }} />
                  <Text size="1" weight="bold" style={{ color: dangerColor }}>
                    ${atRiskAccounts.reduce((acc, a) => acc + a.mrr, 0).toLocaleString()} ARR at risk
                  </Text>
                </Row>
              </Row>
              <Column gap="2">
                {atRiskAccounts.map((account, index) => (
                  <Row
                    key={account.name}
                    justifyContent="space-between"
                    alignItems="center"
                    padding="3"
                    style={{
                      backgroundColor: index % 2 === 0 ? 'var(--base-color-1)' : 'transparent',
                      borderRadius: '4px',
                      borderLeft: `3px solid ${account.health < 40 ? dangerColor : '#e68619'}`,
                    }}
                  >
                    <Column gap="1">
                      <Text weight="bold" size="1">{account.name}</Text>
                      <Text color="muted" size="0">{account.reason}</Text>
                    </Column>
                    <Column alignItems="flex-end" gap="1">
                      <Text weight="bold" size="1">{formatCurrency(account.mrr)}/mo</Text>
                      <Row alignItems="center" gap="1">
                        <Text size="0" color="muted">Health: </Text>
                        <Text size="0" style={{ color: account.health < 40 ? dangerColor : '#e68619' }}>
                          {account.health}%
                        </Text>
                      </Row>
                    </Column>
                  </Row>
                ))}
              </Column>
            </Column>
          )}

          {/* Expansion Opportunities */}
          {showExpansionOpps && (
            <Column
              backgroundColor
              border
              borderRadius="3"
              padding="6"
              gap="4"
            >
              <Row justifyContent="space-between" alignItems="center">
                <Column gap="1">
                  <Heading size="2">Expansion Opportunities</Heading>
                  <Text color="muted" size="1">High-probability upsell candidates</Text>
                </Column>
                <Row
                  alignItems="center"
                  gap="2"
                  padding="2"
                  style={{ backgroundColor: `${successColor}20`, borderRadius: '4px' }}
                >
                  <TrendingUp size={16} style={{ color: successColor }} />
                  <Text size="1" weight="bold" style={{ color: successColor }}>
                    ${expansionOpps.reduce((acc, o) => acc + (o.potentialMRR - o.currentMRR), 0).toLocaleString()} potential
                  </Text>
                </Row>
              </Row>
              <Column gap="2">
                {expansionOpps.map((opp, index) => (
                  <Row
                    key={opp.name}
                    justifyContent="space-between"
                    alignItems="center"
                    padding="3"
                    style={{
                      backgroundColor: index % 2 === 0 ? 'var(--base-color-1)' : 'transparent',
                      borderRadius: '4px',
                      borderLeft: `3px solid ${successColor}`,
                    }}
                  >
                    <Column gap="1">
                      <Text weight="bold" size="1">{opp.name}</Text>
                      <Text color="muted" size="0">
                        Current: {formatCurrency(opp.currentMRR)}/mo → {formatCurrency(opp.potentialMRR)}/mo
                      </Text>
                    </Column>
                    <Column alignItems="flex-end" gap="1">
                      <Text weight="bold" size="1" style={{ color: successColor }}>
                        +{formatCurrency(opp.potentialMRR - opp.currentMRR)}
                      </Text>
                      <Row alignItems="center" gap="1">
                        <CheckCircle size={12} style={{ color: successColor }} />
                        <Text size="0">{opp.probability}% probability</Text>
                      </Row>
                    </Column>
                  </Row>
                ))}
              </Column>
            </Column>
          )}
        </Grid>

        {/* Quick Stats */}
        <Column
          backgroundColor
          border
          borderRadius="3"
          padding="6"
          gap="4"
        >
          <Column gap="1">
            <Heading size="2">Revenue Health Indicators</Heading>
            <Text color="muted" size="1">Key operational metrics at a glance</Text>
          </Column>
          <Grid columns={{ xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr 1fr' }} gap="4">
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Clock size={16} style={{ color: primaryColor }} />
                <Text weight="bold" size="1">Avg. Sales Cycle</Text>
              </Row>
              <Text size="5" weight="bold">34 days</Text>
              <Text color="muted" size="0">-5 days from last quarter</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Target size={16} style={{ color: successColor }} />
                <Text weight="bold" size="1">Quota Attainment</Text>
              </Row>
              <Text size="5" weight="bold">87%</Text>
              <Text color="muted" size="0">On track for 105%</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Users size={16} style={{ color: '#9256d9' }} />
                <Text weight="bold" size="1">Active Customers</Text>
              </Row>
              <Text size="5" weight="bold">1,247</Text>
              <Text color="muted" size="0">+48 this month</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <Briefcase size={16} style={{ color: '#e68619' }} />
                <Text weight="bold" size="1">Deals in Progress</Text>
              </Row>
              <Text size="5" weight="bold">145</Text>
              <Text color="muted" size="0">$2.3M total value</Text>
            </Column>
            <Column
              backgroundColor
              border
              borderRadius="2"
              padding="4"
              gap="2"
            >
              <Row alignItems="center" gap="2">
                <CreditCard size={16} style={{ color: '#01bad7' }} />
                <Text weight="bold" size="1">LTV:CAC Ratio</Text>
              </Row>
              <Text size="5" weight="bold">4.2x</Text>
              <Text color="muted" size="0">Industry avg: 3.0x</Text>
            </Column>
          </Grid>
        </Column>
      </Column>
    </PageBody>
  );
}
