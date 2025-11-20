'use client';
import { Column, Row, Text, Heading } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import Link from 'next/link';
import { CHART_COLORS } from '@/lib/constants';

export function DashboardPage() {
  const { formatMessage, labels } = useMessages();

  const personas = [
    {
      title: 'Product Analytics',
      description: 'User engagement metrics and behavior patterns',
      path: '/dashboard/product-analytics',
      color: CHART_COLORS[0],
    },
    {
      title: 'Marketing Attribution',
      description: 'Track inbound sources and campaign performance',
      path: '/dashboard/marketing-attribution',
      color: CHART_COLORS[2],
    },
    {
      title: 'Revenue Operations',
      description: 'Sales and CSM view of revenue drivers and pipeline',
      path: '/dashboard/revenue-operations',
      color: CHART_COLORS[1],
    },
    {
      title: 'Hybrid Dashboard',
      description: 'Complete business overview combining all metrics',
      path: '/dashboard/hybrid',
      color: CHART_COLORS[3],
    },
  ];

  return (
    <PageBody>
      <Column margin="2">
        <PageHeader
          title={formatMessage(labels.dashboard)}
          description="Select a persona-optimized dashboard view"
        />
      </Column>

      <Column gap>
        {personas.map((persona) => (
          <Link key={persona.path} href={persona.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Panel
              paddingY="6"
              paddingX="6"
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${persona.color}`,
              }}
            >
              <Column gap>
                <Heading size="3" weight="bold">{persona.title}</Heading>
                <Text size="2" style={{ opacity: 0.8 }}>{persona.description}</Text>
              </Column>
            </Panel>
          </Link>
        ))}
      </Column>
    </PageBody>
  );
}
