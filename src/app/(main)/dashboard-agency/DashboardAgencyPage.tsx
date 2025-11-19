'use client';
import { Column, Row, Grid, Text, Heading, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatNumber } from '@/lib/format';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@/components/common/DataGrid';

// Mock data for marketing agency dashboard
const mockMetrics = {
  activeProjects: 12,
  totalCampaigns: 47,
  avgEngagementRate: 6.2,
  clientSatisfaction: 4.6,
  totalReach: 2840000,
  conversionsGenerated: 8940,
  topCampaignROI: 340,
  leadsCaptured: 1240,
};

const mockCampaignPerformance = [
  { x: 'Campaign A', y: 156200 },
  { x: 'Campaign B', y: 142500 },
  { x: 'Campaign C', y: 128400 },
  { x: 'Campaign D', y: 98600 },
  { x: 'Campaign E', y: 87300 },
];

const mockChannelMix = [
  { x: 'Social Media', y: 1420000, fill: '#4F46E5' },
  { x: 'Email', y: 680000, fill: '#7C3AED' },
  { x: 'PPC', y: 520000, fill: '#DB2777' },
  { x: 'SEO', y: 220000, fill: '#15803D' },
];

const mockClientCampaigns = [
  {
    client: 'TechCorp Inc',
    campaign: 'Q4 Product Launch',
    status: 'Active',
    reach: 245000,
    engagement: 7.2,
    roi: '285%',
    daysLeft: 12,
  },
  {
    client: 'RetailHub Co',
    campaign: 'Holiday Sale Push',
    status: 'Active',
    reach: 520000,
    engagement: 5.8,
    roi: '340%',
    daysLeft: 8,
  },
  {
    client: 'FinanceFlow',
    campaign: 'Brand Awareness',
    status: 'Active',
    reach: 180000,
    engagement: 4.2,
    roi: '165%',
    daysLeft: 25,
  },
  {
    client: 'HealthFirst',
    campaign: 'Lead Generation',
    status: 'Completed',
    reach: 320000,
    engagement: 6.8,
    roi: '420%',
    daysLeft: 0,
  },
  {
    client: 'EdTech Solutions',
    campaign: 'Enrollment Campaign',
    status: 'Active',
    reach: 280000,
    engagement: 8.1,
    roi: '295%',
    daysLeft: 15,
  },
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
        {change >= 0 ? '+' : ''}{change}% vs last month
      </Text>
    )}
  </Column>
);

export function DashboardAgencyPage() {
  const { formatMessage, labels } = useMessages();
  const router = useRouter();

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="Marketing Agency Dashboard"
          description="Monitor all client campaigns, performance metrics, and ROI across your projects"
        >
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </PageHeader>

        {/* Key Metrics */}
        <Column gap="4">
          <Heading size="1">Agency Overview</Heading>
          <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
            <MetricCard
              label="Active Projects"
              value={mockMetrics.activeProjects}
              change={4}
            />
            <MetricCard
              label="Total Reach"
              value={formatNumber(mockMetrics.totalReach)}
              change={32.5}
            />
            <MetricCard
              label="Conversions Generated"
              value={formatNumber(mockMetrics.conversionsGenerated)}
              change={28.1}
            />
            <MetricCard
              label="Client Satisfaction"
              value={mockMetrics.clientSatisfaction}
              suffix="⭐"
              change={0.3}
            />
          </Grid>
        </Column>

        {/* Campaign Performance */}
        <Grid columns={{ xs: 1, lg: 2 }} gap="4">
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Top Campaign Performance</Heading>
            <BarChart data={mockCampaignPerformance} />
          </Column>
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Traffic by Channel</Heading>
            <PieChart data={mockChannelMix} />
          </Column>
        </Grid>

        {/* Engagement & Results */}
        <Column gap="4">
          <Heading size="1">Campaign Results</Heading>
          <Grid columns={{ xs: 1, md: 3 }} gap="4">
            <MetricCard
              label="Avg Engagement Rate"
              value={mockMetrics.avgEngagementRate}
              suffix="%"
              change={2.3}
            />
            <MetricCard
              label="Top Campaign ROI"
              value={mockMetrics.topCampaignROI}
              suffix="%"
              change={15.8}
            />
            <MetricCard
              label="Leads Captured"
              value={formatNumber(mockMetrics.leadsCaptured)}
              change={21.4}
            />
          </Grid>
        </Column>

        {/* Client Campaigns Table */}
        <Column gap="4">
          <Heading size="1">Active Client Campaigns</Heading>
          <Column border="all" borderRadius="lg" backgroundColor="panel" overflow="auto">
            <DataGrid
              data={mockClientCampaigns}
              columns={[
                {
                  key: 'client',
                  label: 'Client',
                  render: (value: string) => <Text truncate weight="bold">{value}</Text>,
                },
                {
                  key: 'campaign',
                  label: 'Campaign',
                  render: (value: string) => <Text truncate>{value}</Text>,
                },
                {
                  key: 'status',
                  label: 'Status',
                  render: (value: string) => (
                    <Text
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        backgroundColor: value === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)',
                        color: value === 'Active' ? '#22c55e' : '#6b7280',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {value}
                    </Text>
                  ),
                },
                {
                  key: 'reach',
                  label: 'Reach',
                  render: (value: number) => <Text>{formatNumber(value)}</Text>,
                },
                {
                  key: 'engagement',
                  label: 'Engagement',
                  render: (value: number) => (
                    <Text color={value > 7 ? 'success' : value > 5 ? 'warning' : 'muted'}>
                      {value}%
                    </Text>
                  ),
                },
                {
                  key: 'roi',
                  label: 'ROI',
                  render: (value: string) => (
                    <Text color="success" weight="bold">
                      {value}
                    </Text>
                  ),
                },
                {
                  key: 'daysLeft',
                  label: 'Days Left',
                  render: (value: number) => (
                    <Text color={value === 0 ? 'muted' : value < 7 ? 'warning' : 'muted'}>
                      {value === 0 ? 'Done' : `${value}d`}
                    </Text>
                  ),
                },
              ]}
            />
          </Column>
        </Column>
      </Column>
    </PageBody>
  );
}
