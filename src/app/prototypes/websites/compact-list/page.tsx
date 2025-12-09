'use client';
import { Column, Row, Text, Icon, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { LinkButton } from '@/components/common/LinkButton';
import { SquarePen, Eye } from '@/components/icons';

// Sample data
const websites = [
  { id: '1', name: 'acme-corp.com', domain: 'acme-corp.com', views: 125400, visitors: 34200, bounceRate: 42.5 },
  { id: '2', name: 'startup-hub.io', domain: 'startup-hub.io', views: 89200, visitors: 28100, bounceRate: 51.2 },
  { id: '3', name: 'design-studio.net', domain: 'design-studio.net', views: 156800, visitors: 45600, bounceRate: 38.9 },
  { id: '4', name: 'tech-blog.dev', domain: 'tech-blog.dev', views: 203400, visitors: 52100, bounceRate: 35.4 },
  { id: '5', name: 'ecommerce-hub.shop', domain: 'ecommerce-hub.shop', views: 421600, visitors: 98200, bounceRate: 28.7 },
  { id: '6', name: 'wellness-guide.health', domain: 'wellness-guide.health', views: 78900, visitors: 21400, bounceRate: 59.1 },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function CompactListPage() {
  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites - Compact List View">
          <Button variant="primary">Add Website</Button>
        </PageHeader>

        <Panel>
          <Column gap="0">
            {/* Header */}
            <Row
              gap="3"
              paddingY="3"
              paddingX="4"
              borderBottom
              alignItems="center"
              style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}
            >
              <div style={{ flex: '0 0 30%' }}>Name</div>
              <div style={{ flex: '0 0 20%', textAlign: 'right' }}>Views</div>
              <div style={{ flex: '0 0 20%', textAlign: 'right' }}>Visitors</div>
              <div style={{ flex: '0 0 15%', textAlign: 'right' }}>Bounce</div>
              <div style={{ flex: '0 0 15%', textAlign: 'right' }}>Actions</div>
            </Row>

            {/* Rows */}
            {websites.map((website, idx) => (
              <Row
                key={website.id}
                gap="3"
                paddingY="3"
                paddingX="4"
                borderBottom={idx !== websites.length - 1}
                alignItems="center"
                style={{
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Column gap="1" style={{ flex: '0 0 30%' }}>
                  <Text weight="500">{website.name}</Text>
                  <Text color="muted" size="sm">{website.domain}</Text>
                </Column>
                <Text style={{ flex: '0 0 20%', textAlign: 'right' }}>
                  {formatNumber(website.views)}
                </Text>
                <Text style={{ flex: '0 0 20%', textAlign: 'right' }}>
                  {formatNumber(website.visitors)}
                </Text>
                <Text style={{ flex: '0 0 15%', textAlign: 'right' }}>
                  {website.bounceRate}%
                </Text>
                <Row gap="2" style={{ flex: '0 0 15%', justifyContent: 'flex-end' }}>
                  <LinkButton href={`/websites/${website.id}`} variant="quiet" size="sm">
                    <Icon><Eye /></Icon>
                  </LinkButton>
                  <LinkButton href={`/websites/${website.id}/settings`} variant="quiet" size="sm">
                    <Icon><SquarePen /></Icon>
                  </LinkButton>
                </Row>
              </Row>
            ))}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
