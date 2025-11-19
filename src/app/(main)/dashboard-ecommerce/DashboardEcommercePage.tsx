'use client';
import { Column, Row, Grid, Text, Heading, Button, Badge } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { formatNumber } from '@/lib/format';
import { useRouter } from 'next/navigation';
import { DataGrid } from '@/components/common/DataGrid';

// Mock data for e-commerce dashboard
const mockMetrics = {
  totalRevenue: 487200,
  totalOrders: 2340,
  avgOrderValue: 208,
  conversionRate: 2.8,
  cartAbandonmentRate: 68.5,
  productViews: 156200,
  newCustomers: 420,
  returningCustomers: 1920,
};

const mockRevenueByDay = [
  { x: 'Mon', y: 42300 },
  { x: 'Tue', y: 51200 },
  { x: 'Wed', y: 48900 },
  { x: 'Thu', y: 55100 },
  { x: 'Fri', y: 72400 },
  { x: 'Sat', y: 95200 },
  { x: 'Sun', y: 122100 },
];

const mockProductCategories = [
  { x: 'Electronics', y: 186400, fill: '#4F46E5' },
  { x: 'Clothing', y: 142300, fill: '#7C3AED' },
  { x: 'Home & Garden', y: 98600, fill: '#DB2777' },
  { x: 'Sports', y: 59900, fill: '#15803D' },
];

const mockConversionFunnel = [
  { x: 'Product Views', y: 156200 },
  { x: 'Add to Cart', y: 28400 },
  { x: 'Checkout', y: 8900 },
  { x: 'Purchase', y: 2340 },
];

const mockTopProducts = [
  {
    name: 'Premium Wireless Headphones',
    revenue: 58400,
    units: 280,
    avgRating: 4.7,
    trend: '+24%',
  },
  {
    name: 'Yoga Mat - Premium',
    revenue: 42300,
    units: 1210,
    avgRating: 4.5,
    trend: '+18%',
  },
  {
    name: 'Smart Watch Pro',
    revenue: 39800,
    units: 152,
    avgRating: 4.6,
    trend: '+12%',
  },
  {
    name: 'Cotton T-Shirt Collection',
    revenue: 31200,
    units: 2080,
    avgRating: 4.3,
    trend: '+8%',
  },
  {
    name: 'Portable Phone Charger',
    revenue: 28900,
    units: 890,
    avgRating: 4.4,
    trend: '-5%',
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

export function DashboardEcommercePage() {
  const { formatMessage, labels } = useMessages();
  const router = useRouter();

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="E-commerce Analytics Dashboard"
          description="Monitor sales performance, customer behavior, and product metrics"
        >
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </PageHeader>

        {/* Key Metrics */}
        <Column gap="4">
          <Heading size="1">Sales Overview</Heading>
          <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
            <MetricCard
              label="Total Revenue"
              value={`$${formatNumber(mockMetrics.totalRevenue)}`}
              change={26.4}
            />
            <MetricCard
              label="Total Orders"
              value={formatNumber(mockMetrics.totalOrders)}
              change={18.7}
            />
            <MetricCard
              label="Avg Order Value"
              value={`$${mockMetrics.avgOrderValue}`}
              change={5.2}
            />
            <MetricCard
              label="Conversion Rate"
              value={mockMetrics.conversionRate}
              suffix="%"
              change={1.3}
            />
          </Grid>
        </Column>

        {/* Revenue Trends */}
        <Grid columns={{ xs: 1, lg: 2 }} gap="4">
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Revenue by Day</Heading>
            <BarChart data={mockRevenueByDay} />
          </Column>
          <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
            <Heading size="2">Sales by Category</Heading>
            <PieChart data={mockProductCategories} />
          </Column>
        </Grid>

        {/* Customer & Conversion Metrics */}
        <Column gap="4">
          <Heading size="1">Customer & Conversion Metrics</Heading>
          <Grid columns={{ xs: 1, md: 3 }} gap="4">
            <MetricCard
              label="New Customers"
              value={formatNumber(mockMetrics.newCustomers)}
              change={15.8}
            />
            <MetricCard
              label="Returning Customers"
              value={formatNumber(mockMetrics.returningCustomers)}
              change={12.3}
            />
            <MetricCard
              label="Cart Abandonment"
              value={mockMetrics.cartAbandonmentRate}
              suffix="%"
              change={-4.2}
            />
          </Grid>
        </Column>

        {/* Conversion Funnel */}
        <Column gap="4" border="all" borderRadius="lg" padding="4" backgroundColor="panel">
          <Heading size="2">Conversion Funnel</Heading>
          <BarChart data={mockConversionFunnel} />
        </Column>

        {/* Top Products Table */}
        <Column gap="4">
          <Heading size="1">Top Performing Products</Heading>
          <Column border="all" borderRadius="lg" backgroundColor="panel" overflow="auto">
            <DataGrid
              data={mockTopProducts}
              columns={[
                {
                  key: 'name',
                  label: 'Product Name',
                  render: (value: string) => <Text truncate>{value}</Text>,
                },
                {
                  key: 'revenue',
                  label: 'Revenue',
                  render: (value: number) => <Text>${formatNumber(value)}</Text>,
                },
                {
                  key: 'units',
                  label: 'Units Sold',
                  render: (value: number) => <Text>{formatNumber(value)}</Text>,
                },
                {
                  key: 'avgRating',
                  label: 'Rating',
                  render: (value: number) => <Text>⭐ {value}</Text>,
                },
                {
                  key: 'trend',
                  label: 'Trend',
                  render: (value: string) => (
                    <Text color={value.startsWith('+') ? 'success' : 'error'}>{value}</Text>
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
