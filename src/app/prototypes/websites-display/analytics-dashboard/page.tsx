'use client';
import { Column, Grid, Row, Text, Button, Icon, SearchField } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { SquarePen, TrendingUp, TrendingDown, Users, Eye } from '@/components/icons';
import Link from 'next/link';

const websites = [
  { id: '1', name: 'Acme Analytics', domain: 'analytics.acme.com', views: 45230, visitors: 12450, change: 12.5 },
  { id: '2', name: 'TechCorp Blog', domain: 'blog.techcorp.io', views: 28100, visitors: 8920, change: -3.2 },
  { id: '3', name: 'Startup Hub', domain: 'startuphub.co', views: 15670, visitors: 4230, change: 24.8 },
  { id: '4', name: 'E-Commerce Store', domain: 'shop.example.com', views: 89450, visitors: 31200, change: 8.1 },
  { id: '5', name: 'Developer Docs', domain: 'docs.devtools.dev', views: 62300, visitors: 18750, change: -1.5 },
  { id: '6', name: 'Marketing Site', domain: 'marketing.brand.com', views: 33400, visitors: 9870, change: 15.3 },
];

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function AnalyticsDashboardPage() {
  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" />
        <Panel>
          <Column gap="4">
            <Row justifyContent="space-between" alignItems="center">
              <SearchField placeholder="Search websites..." />
              <Text size="1" color="muted">Last 24 hours</Text>
            </Row>
            <Grid columns={{ xs: 1, lg: 2 }} gap="4">
              {websites.map((website) => (
                <Column
                  key={website.id}
                  padding="4"
                  border
                  borderRadius="2"
                  backgroundColor
                  gap="4"
                  style={{ position: 'relative' }}
                >
                  {/* Header with favicon, name, and domain */}
                  <Row alignItems="center" gap="3">
                    <Favicon domain={website.domain} style={{ width: 24, height: 24 }} />
                    <Column gap="1" style={{ flex: 1 }}>
                      <Text weight="bold" size="3">{website.name}</Text>
                      <Text size="1" color="muted">{website.domain}</Text>
                    </Column>
                    <Button size="sm" variant="quiet" asChild>
                      <Link href={`/websites/${website.id}/settings`}>
                        <Icon size="xs">
                          <SquarePen />
                        </Icon>
                      </Link>
                    </Button>
                  </Row>

                  {/* Metrics row */}
                  <Grid columns={2} gap="4">
                    <Column gap="2">
                      <Row alignItems="center" gap="2">
                        <Icon size="sm">
                          <Eye />
                        </Icon>
                        <Text size="1" color="muted">Views</Text>
                      </Row>
                      <Text size="4" weight="bold">{formatNumber(website.views)}</Text>
                    </Column>
                    <Column gap="2">
                      <Row alignItems="center" gap="2">
                        <Icon size="sm">
                          <Users />
                        </Icon>
                        <Text size="1" color="muted">Visitors</Text>
                      </Row>
                      <Text size="4" weight="bold">{formatNumber(website.visitors)}</Text>
                    </Column>
                  </Grid>

                  {/* Trend indicator */}
                  <Row alignItems="center" gap="2">
                    <Icon
                      size="sm"
                      style={{
                        color: website.change >= 0 ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {website.change >= 0 ? (
                        <TrendingUp />
                      ) : (
                        <TrendingDown />
                      )}
                    </Icon>
                    <Text
                      size="2"
                      weight="medium"
                      style={{
                        color: website.change >= 0 ? '#22c55e' : '#ef4444'
                      }}
                    >
                      {website.change >= 0 ? '+' : ''}{website.change}%
                    </Text>
                    <Text size="1" color="muted">vs. previous period</Text>
                  </Row>
                </Column>
              ))}
            </Grid>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
