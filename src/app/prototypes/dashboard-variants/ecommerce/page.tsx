'use client';
import { Column, Row, Grid, Text, Heading, Icon, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { useMessages } from '@/components/hooks';
import { ShoppingCart, TrendingUp, Package, AlertTriangle } from 'lucide-react';

export default function EcommerceDashboard() {
  const { formatMessage, labels } = useMessages();

  // Mock data for e-commerce use case
  const metrics = {
    revenue: '$127,450',
    revenueChange: 18.2,
    orders: 1247,
    ordersChange: 15.3,
    conversionRate: '3.24%',
    conversionChange: 0.42,
    avgOrderValue: '$102.34',
    avgOrderChange: 4.1,
  };

  const topProducts = [
    { name: 'Premium Wireless Headphones', sales: 324, revenue: '$32,400', inventory: 12 },
    { name: 'USB-C Cable (3-pack)', sales: 521, revenue: '$15,630', inventory: 89 },
    { name: 'Smartphone Stand', sales: 287, revenue: '$8,610', inventory: 3, lowStock: true },
    { name: 'Laptop Bag', sales: 198, revenue: '$9,900', inventory: 156 },
  ];

  const cartAbandonments = [
    { value: '$8,234', reason: 'Shipping cost too high', recovery: 'Abandoned' },
    { value: '$5,123', reason: 'Decided to compare', recovery: 'Recovered 34%' },
    { value: '$3,421', reason: 'Payment issues', recovery: 'Pending' },
    { value: '$2,987', reason: 'Coupon not applied', recovery: 'Abandoned' },
  ];

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="E-Commerce Dashboard"
          description="Sales, products, and customer behavior tracking"
        />

        {/* Key Metrics */}
        <Grid columns={{ xs: 1, md: 2, lg: 4 }} gap="4">
          {/* Revenue */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Revenue</Text>
                <Icon size="sm" style={{ color: '#10b981' }}>
                  <TrendingUp size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.revenue}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.revenueChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Orders */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Orders</Text>
                <Icon size="sm" style={{ color: '#3b82f6' }}>
                  <ShoppingCart size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.orders}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.ordersChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Conversion Rate */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Conversion Rate</Text>
                <Icon size="sm" style={{ color: '#8b5cf6' }}>
                  <TrendingUp size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.conversionRate}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.conversionChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>

          {/* Avg Order Value */}
          <Panel>
            <Column gap="3">
              <Row justifyContent="space-between" alignItems="center">
                <Text size="sm" color="muted">Avg Order Value</Text>
                <Icon size="sm" style={{ color: '#f59e0b' }}>
                  <Package size={16} />
                </Icon>
              </Row>
              <Column>
                <Heading size="4">{metrics.avgOrderValue}</Heading>
                <Text size="xs" color="muted">
                  <span style={{ color: '#10b981' }}>↑ {metrics.avgOrderChange}%</span>
                  {' '}vs last month
                </Text>
              </Column>
            </Column>
          </Panel>
        </Grid>

        {/* Top Products */}
        <Panel title="Top Selling Products">
          <Column gap="3">
            {topProducts.map((product, idx) => (
              <Row
                key={idx}
                justifyContent="space-between"
                alignItems="center"
                paddingY="2"
                style={{ borderBottom: idx < topProducts.length - 1 ? '1px solid #e5e7eb' : 'none' }}
              >
                <Column gap="2" flex={1}>
                  <Row alignItems="center" gap="2">
                    <Text weight="bold">{product.name}</Text>
                    {product.lowStock && (
                      <Icon size="sm" style={{ color: '#ef4444' }}>
                        <AlertTriangle size={14} />
                      </Icon>
                    )}
                  </Row>
                  <Text size="xs" color="muted">{product.sales} sales</Text>
                </Column>
                <Column alignItems="flex-end" gap="1">
                  <Text weight="bold">{product.revenue}</Text>
                  <Text size="xs" color={product.lowStock ? '#ef4444' : 'muted'}>
                    Stock: {product.inventory}
                  </Text>
                </Column>
              </Row>
            ))}
          </Column>
        </Panel>

        {/* Cart Abandonment */}
        <Panel title="Cart Abandonment">
          <Column gap="3">
            {cartAbandonments.map((item, idx) => (
              <Row
                key={idx}
                justifyContent="space-between"
                alignItems="center"
                paddingY="2"
                style={{ borderBottom: idx < cartAbandonments.length - 1 ? '1px solid #e5e7eb' : 'none' }}
              >
                <Column gap="1" flex={1}>
                  <Text weight="bold">{item.value}</Text>
                  <Text size="xs" color="muted">{item.reason}</Text>
                </Column>
                <Text
                  size="xs"
                  weight="bold"
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: item.recovery === 'Abandoned' ? '#fecaca' : item.recovery === 'Recovered 34%' ? '#bfdbfe' : '#fef3c7',
                    color: item.recovery === 'Abandoned' ? '#dc2626' : item.recovery === 'Recovered 34%' ? '#1e40af' : '#b45309',
                  }}
                >
                  {item.recovery}
                </Text>
              </Row>
            ))}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
