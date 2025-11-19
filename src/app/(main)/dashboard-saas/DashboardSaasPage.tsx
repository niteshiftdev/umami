'use client';
import { Column, Row, Grid, Text, Heading, Button, Icon } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatNumber } from '@/lib/format';
import { useRouter } from 'next/navigation';

// Mock data for SaaS metrics dashboard
const mockMetrics = {
  totalUsers: 12543,
  activeUsers: 4821,
  churnRate: 2.3,
  mrr: 187400,
  mrrGrowth: 12.5,
  newSubscriptions: 312,
  canceledSubscriptions: 28,
  avgSessionDuration: 428,
  conversionRate: 3.8,
};

const mockUserGrowth = [
  { x: 'Week 1', y: 8200 },
  { x: 'Week 2', y: 9100 },
  { x: 'Week 3', y: 10300 },
  { x: 'Week 4', y: 12543 },
];

const mockMRRTrend = [
  { x: 'Month 1', y: 125000 },
  { x: 'Month 2', y: 142000 },
  { x: 'Month 3', y: 156500 },
  { x: 'Month 4', y: 187400 },
];

const mockPlanDistribution = [
  { x: 'Starter', y: 4200, fill: '#4F46E5' },
  { x: 'Professional', y: 6100, fill: '#7C3AED' },
  { x: 'Enterprise', y: 2243, fill: '#DB2777' },
];

const mockConversionFunnel = [
  { x: 'Visits', y: 125000 },
  { x: 'Sign-ups', y: 8500 },
  { x: 'Trials', y: 6200 },
  { x: 'Conversions', y: 312 },
];

const MetricCard = ({
  label,
  value,
  change,
  suffix,
}: {
  label: string;
  value: string | number;
  change?: number;
  suffix?: string;
}) => (
  <Column
    gap="2"
    padding="4"
    border="all"
    borderRadius="lg"
    backgroundColor="panel"
    style={{ flex: 1 }}
  >
    <Text color="muted" size="sm">
      {label}
    </Text>
    <Row alignItems="baseline" gap="2">
      <Heading size="2">{value}</Heading>
      {suffix && <Text color="muted">{suffix}</Text>}
    </Row>
    {change !== undefined && (
      <Text color={change >= 0 ? 'success' : 'error'} size="sm">
        {change >= 0 ? '+' : ''}{change}% vs last period
      </Text>
    )}
  </Column>
);

export function DashboardSaasPage() {
  const { formatMessage, labels } = useMessages();
  const router = useRouter();

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="SaaS Metrics Dashboard"
          description="Track your subscription business health and growth metrics"
        >
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </PageHeader>

        {/* Key Metrics */}
        <Column gap="4">
          <Heading size="1">Key Performance Indicators</Heading>
          <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
            <MetricCard label="Total Users" value={formatNumber(mockMetrics.totalUsers)} change={12.5} />
            <MetricCard
              label="Monthly Recurring Revenue"
              value={`$${formatNumber(mockMetrics.mrr)}`}
              change={mockMetrics.mrrGrowth}
            />
            <MetricCard label="Active Users" value={formatNumber(mockMetrics.activeUsers)} change={8.3} />
            <MetricCard
              label="Churn Rate"
              value={mockMetrics.churnRate}
              suffix="%"
              change={-0.8}
            />
          </Grid>
        </Column>

        {/* Revenue & Growth */}
        <Grid columns={{ xs: 1, lg: 2 }} gap="4">
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">User Growth</Heading>
            <BarChart data={mockUserGrowth} />
          </Column>
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">MRR Trend</Heading>
            <BarChart data={mockMRRTrend} />
          </Column>
        </Grid>

        {/* Distribution & Funnel */}
        <Grid columns={{ xs: 1, lg: 2 }} gap="4">
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Plan Distribution</Heading>
            <PieChart data={mockPlanDistribution} />
          </Column>
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Conversion Funnel</Heading>
            <BarChart data={mockConversionFunnel} />
          </Column>
        </Grid>

        {/* Subscription Changes */}
        <Column gap="4">
          <Heading size="1">Subscription Activity</Heading>
          <Grid columns={{ xs: 1, md: 3 }} gap="4">
            <MetricCard
              label="New Subscriptions"
              value={mockMetrics.newSubscriptions}
              change={18.2}
            />
            <MetricCard
              label="Canceled Subscriptions"
              value={mockMetrics.canceledSubscriptions}
              change={-12.5}
            />
            <MetricCard
              label="Conversion Rate"
              value={mockMetrics.conversionRate}
              suffix="%"
              change={2.1}
            />
          </Grid>
        </Column>
      </Column>
    </PageBody>
  );
}
