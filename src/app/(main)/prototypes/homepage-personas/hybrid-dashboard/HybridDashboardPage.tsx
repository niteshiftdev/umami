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

export function HybridDashboardPage() {
  const { formatMessage, labels } = useMessages();

  // Consolidated metrics from all personas
  const consolidatedMetrics = useMemo(
    () => ({
      // Product metrics
      activeUsers: 24537,
      previousActiveUsers: 22104,
      featureAdoption: 67.2,
      previousFeatureAdoption: 61.5,
      // Marketing metrics
      conversions: 8421,
      previousConversions: 7832,
      roi: 324,
      previousRoi: 298,
      // Revenue metrics
      totalRevenue: 2847650,
      previousTotalRevenue: 2634200,
      monthlyRecurring: 456780,
      previousMonthlyRecurring: 423450,
    }),
    [],
  );

  // Unified time-series data showing all key metrics
  const unifiedTimeSeriesData = useMemo(() => {
    const days = 30;
    const labels = [];
    const activeUsersData = [];
    const conversionsData = [];
    const revenueData = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(date.toISOString().split('T')[0]);

      const dayOfWeek = date.getDay();
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.75 : 1;

      // Product: active users (scale 15k-25k)
      activeUsersData.push(Math.round((18000 + Math.random() * 4000) * weekendFactor));

      // Marketing: conversions (scale 200-400)
      conversionsData.push(Math.round((250 + Math.random() * 100) * weekendFactor));

      // Revenue: daily revenue (scale 70k-100k)
      revenueData.push(Math.round((80000 + Math.random() * 15000) * weekendFactor));
    }

    return {
      labels,
      datasets: [
        {
          label: 'Active Users',
          data: activeUsersData,
          borderColor: CHART_COLORS[0],
          backgroundColor: CHART_COLORS[0] + '40',
          yAxisID: 'y',
        },
        {
          label: 'Conversions',
          data: conversionsData,
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '40',
          yAxisID: 'y1',
        },
        {
          label: 'Revenue ($)',
          data: revenueData,
          borderColor: CHART_COLORS[4],
          backgroundColor: CHART_COLORS[4] + '40',
          yAxisID: 'y2',
        },
      ],
    };
  }, []);

  // Cross-functional KPI breakdown
  const crossFunctionalKPIData = useMemo(
    () => ({
      labels: ['Product Engagement', 'Marketing Efficiency', 'Sales Performance', 'Customer Success'],
      datasets: [
        {
          label: 'Performance Score',
          data: [87, 92, 78, 83],
          backgroundColor: CHART_COLORS.slice(0, 4),
        },
      ],
    }),
    [],
  );

  // Customer journey metrics combining product + marketing + revenue
  const customerJourneyData = useMemo(() => {
    return {
      labels: ['Awareness', 'Consideration', 'Trial', 'Conversion', 'Retention', 'Expansion'],
      datasets: [
        {
          label: 'Users in Stage',
          data: [125000, 45600, 18900, 8421, 6234, 2187],
          backgroundColor: CHART_COLORS[1] + '60',
          borderColor: CHART_COLORS[1],
          borderWidth: 2,
        },
      ],
    };
  }, []);

  // Marketing channel performance with revenue attribution
  const channelRevenueData = useMemo(
    () => ({
      labels: ['Organic Search', 'Paid Ads', 'Social Media', 'Referrals', 'Direct', 'Email'],
      datasets: [
        {
          label: 'Revenue Attributed ($K)',
          data: [845, 678, 423, 312, 267, 189],
          backgroundColor: CHART_COLORS[5] + '70',
          borderColor: CHART_COLORS[5],
          borderWidth: 2,
        },
      ],
    }),
    [],
  );

  // Top performing segments (product + revenue view)
  const segmentPerformanceData = useMemo(
    () => [
      {
        segment: 'Enterprise Tech',
        users: 4523,
        engagement: 82.4,
        mrr: 125600,
        churnRate: 2.1,
      },
      {
        segment: 'Mid-Market SaaS',
        users: 8934,
        engagement: 76.8,
        mrr: 89200,
        churnRate: 3.8,
      },
      {
        segment: 'SMB Services',
        users: 15678,
        engagement: 71.2,
        mrr: 54300,
        churnRate: 5.2,
      },
      {
        segment: 'Startup/Scale-up',
        users: 6234,
        engagement: 88.9,
        mrr: 32100,
        churnRate: 4.5,
      },
    ],
    [],
  );

  // Revenue forecast based on current metrics
  const revenueForecastData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      labels: months,
      datasets: [
        {
          label: 'Actual Revenue',
          data: [410000, 445000, 478000, 512000, 534000, 0],
          borderColor: CHART_COLORS[2],
          backgroundColor: CHART_COLORS[2] + '40',
        },
        {
          label: 'Forecast Revenue',
          data: [0, 0, 0, 0, 534000, 567000],
          borderColor: CHART_COLORS[3],
          backgroundColor: CHART_COLORS[3] + '40',
          borderDash: [5, 5],
        },
      ],
    };
  }, []);

  // Product feature adoption vs revenue correlation
  const featureRevenueCorrelationData = useMemo(
    () => ({
      labels: ['Advanced Analytics', 'API Access', 'Custom Reports', 'Integrations', 'Automation'],
      datasets: [
        {
          label: 'Adoption Rate %',
          data: [67.2, 54.8, 72.3, 61.5, 45.9],
          backgroundColor: CHART_COLORS[0] + '60',
          borderColor: CHART_COLORS[0],
          borderWidth: 1,
        },
      ],
    }),
    [],
  );

  return (
    <PageBody>
      <Column gap="6" paddingY="6">
        <PageHeader title="Unified Business Dashboard" />

        <Text size="md" style={{ color: 'var(--gray500)' }}>
          Comprehensive view combining product analytics, marketing attribution, and revenue operations
        </Text>

        {/* Top-level KPIs - All Personas */}
        <Grid columns={{ xs: '1fr', md: '1fr 1fr', lg: 'repeat(6, 1fr)' }} gap="4">
          <Panel>
            <MetricCard
              value={consolidatedMetrics.activeUsers}
              previousValue={consolidatedMetrics.previousActiveUsers}
              label="Active Users"
              formatValue={n => n.toLocaleString()}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={consolidatedMetrics.featureAdoption}
              previousValue={consolidatedMetrics.previousFeatureAdoption}
              label="Feature Adoption %"
              formatValue={n => `${n.toFixed(1)}%`}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={consolidatedMetrics.conversions}
              previousValue={consolidatedMetrics.previousConversions}
              label="Conversions"
              formatValue={n => n.toLocaleString()}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={consolidatedMetrics.roi}
              previousValue={consolidatedMetrics.previousRoi}
              label="Marketing ROI %"
              formatValue={n => `${n}%`}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={consolidatedMetrics.totalRevenue}
              previousValue={consolidatedMetrics.previousTotalRevenue}
              label="Total Revenue"
              formatValue={n => `$${(n / 1000000).toFixed(2)}M`}
              showLabel
              showChange
            />
          </Panel>
          <Panel>
            <MetricCard
              value={consolidatedMetrics.monthlyRecurring}
              previousValue={consolidatedMetrics.previousMonthlyRecurring}
              label="MRR"
              formatValue={n => `$${(n / 1000).toFixed(0)}K`}
              showLabel
              showChange
            />
          </Panel>
        </Grid>

        {/* Unified Time Series - All Three Metrics */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Unified Business Metrics (Last 30 Days)</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Track product engagement, marketing conversions, and revenue performance together
            </Text>
            <BarChart chartData={unifiedTimeSeriesData} height={340} unit="mixed" />
          </Column>
        </Panel>

        {/* Cross-Functional KPIs */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">Cross-Functional Performance Scores</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Health scores across all business functions
              </Text>
              <PieChart chartData={crossFunctionalKPIData} height={300} type="doughnut" />
            </Column>
          </Panel>

          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">End-to-End Customer Journey</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Users at each stage from awareness to expansion
              </Text>
              <BarChart chartData={customerJourneyData} height={300} unit="users" />
            </Column>
          </Panel>
        </Grid>

        {/* Marketing Channel Revenue Attribution */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Marketing Channel Revenue Attribution</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Revenue generated by each marketing channel (last 30 days)
            </Text>
            <BarChart chartData={channelRevenueData} height={300} unit="$K" />
          </Column>
        </Panel>

        {/* Revenue Forecast */}
        <Panel allowFullscreen>
          <Column gap="3">
            <Heading size="md">Revenue Forecast (Current Quarter)</Heading>
            <Text size="sm" style={{ color: 'var(--gray500)' }}>
              Actual vs forecasted revenue based on current pipeline and trends
            </Text>
            <BarChart chartData={revenueForecastData} height={300} unit="$" />
          </Column>
        </Panel>

        {/* Two Column Layout */}
        <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="4">
          <Panel allowFullscreen>
            <Column gap="3">
              <Heading size="md">Feature Adoption Rates</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Adoption of premium features correlating with higher revenue
              </Text>
              <BarChart chartData={featureRevenueCorrelationData} height={300} unit="%" />
            </Column>
          </Panel>

          <Panel>
            <Column gap="3">
              <Heading size="md">Segment Performance Overview</Heading>
              <Text size="sm" style={{ color: 'var(--gray500)' }}>
                Combined product and revenue metrics by customer segment
              </Text>
              <DataTable data={segmentPerformanceData}>
                <DataColumn id="segment" label="Segment" />
                <DataColumn id="users" label="Users">
                  {row => row.users.toLocaleString()}
                </DataColumn>
                <DataColumn id="engagement" label="Engagement">
                  {row => `${row.engagement.toFixed(1)}%`}
                </DataColumn>
                <DataColumn id="mrr" label="MRR">
                  {row => `$${(row.mrr / 1000).toFixed(0)}K`}
                </DataColumn>
                <DataColumn id="churnRate" label="Churn">
                  {row => `${row.churnRate.toFixed(1)}%`}
                </DataColumn>
              </DataTable>
            </Column>
          </Panel>
        </Grid>

        {/* Strategic Insights Panel */}
        <Panel>
          <Column gap="4">
            <Heading size="md">Strategic Insights</Heading>
            <Grid columns={{ xs: '1fr', md: '1fr 1fr 1fr' }} gap="4">
              <Column gap="2">
                <Text weight="bold" style={{ color: CHART_COLORS[0] }}>
                  Product Health
                </Text>
                <Text size="sm">
                  Active user growth is up 11% with strong feature adoption trends. Focus on reducing
                  bounce rate through improved onboarding.
                </Text>
              </Column>
              <Column gap="2">
                <Text weight="bold" style={{ color: CHART_COLORS[2] }}>
                  Marketing Efficiency
                </Text>
                <Text size="sm">
                  ROI improved to 324% with LinkedIn Ads showing highest conversion rates. Consider
                  reallocating budget from lower-performing channels.
                </Text>
              </Column>
              <Column gap="2">
                <Text weight="bold" style={{ color: CHART_COLORS[4] }}>
                  Revenue Momentum
                </Text>
                <Text size="sm">
                  Revenue growth at 8.1% with strong enterprise segment performance. Pipeline value up
                  8.6% indicating healthy future growth.
                </Text>
              </Column>
            </Grid>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
