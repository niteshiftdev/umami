'use client';
import { Column, Row, Grid, Text, Heading, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';
import { useRouter } from 'next/navigation';

const variants = [
  {
    id: 'saas',
    title: 'SaaS Metrics',
    description: 'Track subscription business health, MRR, churn, and growth metrics',
    icon: '📈',
    path: '/dashboard-saas',
    metrics: ['Total Users', 'MRR', 'Churn Rate', 'Conversion Funnel'],
  },
  {
    id: 'creator',
    title: 'Content Creator',
    description: 'Monitor content performance, audience engagement, and traffic sources',
    icon: '📝',
    path: '/dashboard-creator',
    metrics: ['Page Views', 'Unique Visitors', 'Read Time', 'Traffic Sources'],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    description: 'Track sales, conversion funnel, customer behavior, and product performance',
    icon: '🛍️',
    path: '/dashboard-ecommerce',
    metrics: ['Revenue', 'Orders', 'Conversion Rate', 'Top Products'],
  },
  {
    id: 'agency',
    title: 'Marketing Agency',
    description: 'Manage multi-client campaigns, ROI, reach, and engagement metrics',
    icon: '🎯',
    path: '/dashboard-agency',
    metrics: ['Active Campaigns', 'Total Reach', 'ROI', 'Engagement Rate'],
  },
];

const VariantCard = ({
  title,
  description,
  icon,
  metrics,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  metrics: string[];
  onClick: () => void;
}) => (
  <Column
    gap="3"
    padding="4"
    border="all"
    borderRadius="lg"
    backgroundColor="panel"
    style={{
      flex: 1,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = 'translateY(-2px)';
      el.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = 'translateY(0)';
      el.style.boxShadow = 'none';
    }}
  >
    <Row gap="2" alignItems="center">
      <Text style={{ fontSize: '24px' }}>{icon}</Text>
      <Heading size="2">{title}</Heading>
    </Row>
    <Text color="muted" size="sm">
      {description}
    </Text>
    <Column gap="2" marginTop="2">
      <Text size="xs" color="muted">
        Key Metrics:
      </Text>
      <Row gap="1" wrap="wrap">
        {metrics.map((metric) => (
          <Text
            key={metric}
            size="xs"
            style={{
              display: 'inline-block',
              padding: '4px 8px',
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '4px',
            }}
          >
            {metric}
          </Text>
        ))}
      </Row>
    </Column>
    <Button
      onClick={onClick}
      style={{ marginTop: '12px' }}
    >
      View Dashboard
    </Button>
  </Column>
);

export function DashboardPage() {
  const { formatMessage, labels } = useMessages();
  const router = useRouter();

  return (
    <PageBody>
      <Column margin="2" gap="6">
        <PageHeader
          title="Dashboard Variants"
          description="Explore pre-configured dashboards designed for specific use cases and personas"
        />

        <Column gap="4">
          <Heading size="1">Choose Your Use Case</Heading>
          <Text color="muted">
            Select a dashboard variant tailored to your business model. Each includes realistic mock data,
            relevant KPIs, and insights specific to your industry.
          </Text>
        </Column>

        <Grid columns={{ xs: 1, md: 2, lg: 2 }} gap="4">
          {variants.map((variant) => (
            <VariantCard
              key={variant.id}
              title={variant.title}
              description={variant.description}
              icon={variant.icon}
              metrics={variant.metrics}
              onClick={() => router.push(variant.path)}
            />
          ))}
        </Grid>

        <Column gap="4" marginTop="4" padding="4" border="all" borderRadius="lg" backgroundColor="panel">
          <Heading size="2">About These Variants</Heading>
          <Column gap="3">
            <Text>
              These dashboard variants demonstrate how Umami can be customized for different business models
              and use cases. Each variant includes:
            </Text>
            <Column as="ul" gap="2" paddingLeft="6">
              <Text>Realistic mock data tailored to the specific use case</Text>
              <Text>Industry-relevant KPIs and metrics</Text>
              <Text>Contextual charts and visualizations</Text>
              <Text>Data tables with actionable insights</Text>
              <Text>Consistent UI patterns following Umami design language</Text>
            </Column>
            <Text color="muted" size="sm">
              Use these as inspiration for building your own dashboards or as templates for your analytics implementation.
            </Text>
          </Column>
        </Column>
      </Column>
    </PageBody>
  );
}
