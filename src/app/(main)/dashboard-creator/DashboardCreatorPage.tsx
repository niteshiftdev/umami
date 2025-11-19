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

// Mock data for content creator dashboard
const mockMetrics = {
  totalPageviews: 487200,
  uniqueVisitors: 92300,
  avgReadTime: 4.2,
  bounceRate: 34.5,
  avgSessionDuration: 628,
  topPostViews: 12400,
  subscriberGrowth: 2847,
  engagementRate: 8.6,
};

const mockViewsByDay = [
  { x: 'Mon', y: 58200 },
  { x: 'Tue', y: 64300 },
  { x: 'Wed', y: 71200 },
  { x: 'Thu', y: 52100 },
  { x: 'Fri', y: 89300 },
  { x: 'Sat', y: 92200 },
  { x: 'Sun', y: 59900 },
];

const mockTrafficSources = [
  { x: 'Organic Search', y: 245600, fill: '#4F46E5' },
  { x: 'Direct', y: 123400, fill: '#7C3AED' },
  { x: 'Social Media', y: 98300, fill: '#DB2777' },
  { x: 'Referral', y: 19900, fill: '#15803D' },
];

const mockTopPosts = [
  {
    title: '10 Tips for Effective Remote Work',
    views: 12400,
    avgTime: '5:32',
    bounceRate: 28.3,
    engagementRate: 12.4,
  },
  {
    title: 'Getting Started with React Hooks',
    views: 9820,
    avgTime: '4:15',
    bounceRate: 35.1,
    engagementRate: 8.9,
  },
  {
    title: 'Web Performance Optimization Guide',
    views: 7650,
    avgTime: '6:42',
    bounceRate: 22.5,
    engagementRate: 14.2,
  },
  {
    title: 'CSS Grid vs Flexbox Comparison',
    views: 6432,
    avgTime: '5:08',
    bounceRate: 41.2,
    engagementRate: 6.1,
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
        {change >= 0 ? '+' : ''}{change}% vs last week
      </Text>
    )}
  </Column>
);

export function DashboardCreatorPage() {
  const { formatMessage, labels } = useMessages();
  const router = useRouter();

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="Content Creator Dashboard"
          description="Monitor your content performance and audience engagement"
        >
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </PageHeader>

        {/* Key Metrics */}
        <Column gap="4">
          <Heading size="1">Content Performance Metrics</Heading>
          <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
            <MetricCard
              label="Total Page Views"
              value={formatNumber(mockMetrics.totalPageviews)}
              change={18.5}
            />
            <MetricCard
              label="Unique Visitors"
              value={formatNumber(mockMetrics.uniqueVisitors)}
              change={22.3}
            />
            <MetricCard
              label="Avg Read Time"
              value={mockMetrics.avgReadTime}
              suffix="min"
              change={5.2}
            />
            <MetricCard
              label="Bounce Rate"
              value={mockMetrics.bounceRate}
              suffix="%"
              change={-3.1}
            />
          </Grid>
        </Column>

        {/* Traffic Overview */}
        <Grid columns={{ xs: 1, lg: 2 }} gap="4">
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Daily Views (Last 7 Days)</Heading>
            <BarChart data={mockViewsByDay} />
          </Column>
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Traffic Sources</Heading>
            <PieChart data={mockTrafficSources} />
          </Column>
        </Grid>

        {/* Engagement Metrics */}
        <Column gap="4">
          <Heading size="1">Engagement Insights</Heading>
          <Grid columns={{ xs: 1, md: 3 }} gap="4">
            <MetricCard
              label="Avg Session Duration"
              value={`${Math.floor(mockMetrics.avgSessionDuration / 60)}:${String(mockMetrics.avgSessionDuration % 60).padStart(2, '0')}`}
              suffix="min"
              change={8.7}
            />
            <MetricCard
              label="Subscriber Growth"
              value={`+${mockMetrics.subscriberGrowth}`}
              change={15.2}
            />
            <MetricCard
              label="Engagement Rate"
              value={mockMetrics.engagementRate}
              suffix="%"
              change={3.4}
            />
          </Grid>
        </Column>

        {/* Top Posts Table */}
        <Column gap="4">
          <Heading size="1">Top Performing Posts</Heading>
          <Column border="all" borderRadius="lg" backgroundColor="panel" overflow="auto">
            <DataGrid
              data={mockTopPosts}
              columns={[
                {
                  key: 'title',
                  label: 'Post Title',
                  render: (value: string) => <Text truncate>{value}</Text>,
                },
                {
                  key: 'views',
                  label: 'Views',
                  render: (value: number) => <Text>{formatNumber(value)}</Text>,
                },
                {
                  key: 'avgTime',
                  label: 'Avg Read Time',
                  render: (value: string) => <Text>{value}</Text>,
                },
                {
                  key: 'bounceRate',
                  label: 'Bounce Rate',
                  render: (value: number) => (
                    <Text color={value > 40 ? 'error' : value > 30 ? 'warning' : 'success'}>
                      {value}%
                    </Text>
                  ),
                },
                {
                  key: 'engagementRate',
                  label: 'Engagement',
                  render: (value: number) => (
                    <Text color={value > 10 ? 'success' : 'muted'}>{value}%</Text>
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
