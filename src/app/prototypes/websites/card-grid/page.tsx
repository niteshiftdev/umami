'use client';
import { Grid, Row, Column, Text, Heading, Button, Icon } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { LinkButton } from '@/components/common/LinkButton';
import { SquarePen, Eye } from '@/components/icons';

// Sample data
const websites = [
  { id: '1', name: 'acme-corp.com', domain: 'acme-corp.com', views: 125400, visitors: 34200, bounceRate: 42.5, avgDuration: 287 },
  { id: '2', name: 'startup-hub.io', domain: 'startup-hub.io', views: 89200, visitors: 28100, bounceRate: 51.2, avgDuration: 165 },
  { id: '3', name: 'design-studio.net', domain: 'design-studio.net', views: 156800, visitors: 45600, bounceRate: 38.9, avgDuration: 412 },
  { id: '4', name: 'tech-blog.dev', domain: 'tech-blog.dev', views: 203400, visitors: 52100, bounceRate: 35.4, avgDuration: 523 },
  { id: '5', name: 'ecommerce-hub.shop', domain: 'ecommerce-hub.shop', views: 421600, visitors: 98200, bounceRate: 28.7, avgDuration: 651 },
  { id: '6', name: 'wellness-guide.health', domain: 'wellness-guide.health', views: 78900, visitors: 21400, bounceRate: 59.1, avgDuration: 142 },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function WebsiteCard({ website }: { website: typeof websites[0] }) {
  return (
    <Column
      gap="3"
      paddingX="4"
      paddingY="4"
      border
      borderRadius="2"
      backgroundColor="surface"
      style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1" flex="1">
          <Heading size="2">{website.name}</Heading>
          <Text color="muted" size="sm">{website.domain}</Text>
        </Column>
        <Row gap="2">
          <LinkButton href={`/websites/${website.id}`} variant="quiet" size="sm">
            <Icon><Eye /></Icon>
          </LinkButton>
          <LinkButton href={`/websites/${website.id}/settings`} variant="quiet" size="sm">
            <Icon><SquarePen /></Icon>
          </LinkButton>
        </Row>
      </Row>

      <Grid columns="1fr 1fr" gap="3">
        <Column>
          <Text color="muted" size="sm">Page Views</Text>
          <Heading size="3">{formatNumber(website.views)}</Heading>
        </Column>
        <Column>
          <Text color="muted" size="sm">Visitors</Text>
          <Heading size="3">{formatNumber(website.visitors)}</Heading>
        </Column>
        <Column>
          <Text color="muted" size="sm">Bounce Rate</Text>
          <Heading size="3">{website.bounceRate}%</Heading>
        </Column>
        <Column>
          <Text color="muted" size="sm">Avg Duration</Text>
          <Heading size="3">{website.avgDuration}s</Heading>
        </Column>
      </Grid>
    </Column>
  );
}

export default function CardGridPage() {
  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites - Card Grid View">
          <Button variant="primary">Add Website</Button>
        </PageHeader>

        <Grid
          gap="3"
          columns={{
            xs: '1fr',
            md: 'repeat(auto-fill, minmax(380px, 1fr))',
          }}
        >
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </Grid>
      </Column>
    </PageBody>
  );
}
