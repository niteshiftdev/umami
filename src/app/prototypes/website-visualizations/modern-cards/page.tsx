import { useTheme } from '@umami/react-zen';
import { Grid, Column, Row, Button, Icon, Heading, Text } from '@umami/react-zen';
import { BarChart, LineChart, PieChart } from 'react-chartjs-2';
import { FiTrendingUp, FiUsers, FiEye, FiMousePointer } from 'react-icons/fi';

// Mock data for demonstration
const mockMetrics = {
  visitors: 12534,
  visits: 8923,
  pageviews: 45230,
  bounceRate: 42.5,
  avgSessionDuration: 3.24,
  conversionRate: 2.8,
};

const mockChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Visitors',
      data: [1200, 1900, 1500, 2200, 1800, 2500, 2100],
      fill: true,
      borderColor: '#2680eb',
      backgroundColor: 'rgba(38, 128, 235, 0.1)',
      tension: 0.4,
    },
  ],
};

const mockSourcesData = {
  labels: ['Organic Search', 'Direct', 'Referral', 'Social Media', 'Email', 'Other'],
  datasets: [
    {
      data: [8934, 4521, 3210, 2156, 1234, 945],
      backgroundColor: [
        '#2680eb', '#9256d9', '#44b556', '#e68619', '#e34850', '#f7bd12'
      ],
    },
  ],
};

const mockTrafficPattern = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
  datasets: [
    {
      label: 'Traffic Pattern',
      data: [245, 156, 892, 1523, 1834, 1456, 678],
      backgroundColor: '#2680eb',
      borderColor: '#1a5fd6',
      borderRadius: 6,
    },
  ],
};

const MetricCard = ({ icon: Icon, label, value, change, unit = '' }: any) => (
  <Column
    padding="lg"
    gap="sm"
    style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 12,
      border: '1px solid var(--color-border)',
      flex: 1,
      minWidth: 200,
    }}
  >
    <Row justifyContent="space-between" alignItems="center">
      <Heading level={4} style={{ margin: 0 }}>
        {label}
      </Heading>
      <Icon size={20} style={{ color: '#2680eb' }} />
    </Row>
    <Heading level={2} style={{ margin: '8px 0' }}>
      {value.toLocaleString()}{unit}
    </Heading>
    <Text size="sm" style={{ color: change >= 0 ? '#44b556' : '#e34850' }}>
      {change >= 0 ? '+' : ''}{change}% from last week
    </Text>
  </Column>
);

const ChartCard = ({ title, children }: any) => (
  <Column
    padding="lg"
    gap="md"
    style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 12,
      border: '1px solid var(--color-border)',
      gridColumn: '1 / -1',
    }}
  >
    <Heading level={3} style={{ margin: 0 }}>
      {title}
    </Heading>
    <div style={{ height: 300, position: 'relative' }}>
      {children}
    </div>
  </Column>
);

export default function ModernCardsVisualization() {
  const { theme } = useTheme();

  return (
    <Column padding="lg" gap="lg">
      <Column gap="sm">
        <Heading level={1}>Website Analytics - Modern Cards View</Heading>
        <Text size="sm" style={{ color: 'var(--color-text-secondary)' }}>
          July 1 - July 30, 2024
        </Text>
      </Column>

      {/* Key Metrics Cards Grid */}
      <Grid
        columns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
        gap="md"
      >
        <MetricCard
          icon={FiUsers}
          label="Visitors"
          value={mockMetrics.visitors}
          change={12.5}
        />
        <MetricCard
          icon={FiEye}
          label="Pageviews"
          value={mockMetrics.pageviews}
          change={8.3}
        />
        <MetricCard
          icon={FiMousePointer}
          label="Bounce Rate"
          value={mockMetrics.bounceRate}
          change={-2.1}
          unit="%"
        />
        <MetricCard
          icon={FiTrendingUp}
          label="Avg. Session"
          value={mockMetrics.avgSessionDuration}
          change={5.2}
          unit="m"
        />
        <MetricCard
          icon={FiTrendingUp}
          label="Conversion"
          value={mockMetrics.conversionRate}
          change={3.8}
          unit="%"
        />
        <MetricCard
          icon={FiEye}
          label="Visits"
          value={mockMetrics.visits}
          change={6.4}
        />
      </Grid>

      {/* Charts Grid */}
      <Grid columns="1fr" gap="md">
        <ChartCard title="Visitor Trends">
          <LineChart
            data={mockChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </ChartCard>

        <Grid columns={{ xs: '1fr', md: '1fr 1fr' }} gap="md">
          <ChartCard title="Traffic Sources">
            <PieChart
              data={mockSourcesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' as const } },
              }}
            />
          </ChartCard>

          <ChartCard title="Daily Traffic Pattern">
            <BarChart
              data={mockTrafficPattern}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </ChartCard>
        </Grid>
      </Grid>
    </Column>
  );
}
