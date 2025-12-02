'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Icon,
  SearchField,
  Grid,
  Badge,
} from '@umami/react-zen';
import { Plus, Globe, ExternalLink, Settings, TrendingUp, Users, Eye } from '@/components/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';

// Sample data representing realistic website analytics
const sampleWebsites = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    pageviews: 45230,
    visitors: 12450,
    trend: '+12%',
    status: 'active',
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    pageviews: 28750,
    visitors: 8920,
    trend: '+8%',
    status: 'active',
  },
  {
    id: '3',
    name: 'E-Commerce Store',
    domain: 'shop.mystore.com',
    pageviews: 156800,
    visitors: 42300,
    trend: '+24%',
    status: 'active',
  },
  {
    id: '4',
    name: 'Marketing Landing',
    domain: 'promo.acme.com',
    pageviews: 8450,
    visitors: 3200,
    trend: '-3%',
    status: 'active',
  },
  {
    id: '5',
    name: 'Developer Docs',
    domain: 'docs.techstart.io',
    pageviews: 67200,
    visitors: 15800,
    trend: '+18%',
    status: 'active',
  },
  {
    id: '6',
    name: 'Support Portal',
    domain: 'support.acme.com',
    pageviews: 12300,
    visitors: 4500,
    trend: '+5%',
    status: 'active',
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function WebsiteCard({ website }: { website: (typeof sampleWebsites)[0] }) {
  const isPositiveTrend = website.trend.startsWith('+');

  return (
    <Column
      padding="5"
      border
      borderRadius="3"
      backgroundColor
      gap="4"
      style={{ minHeight: '200px' }}
    >
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Heading size="2">{website.name}</Heading>
          <Row alignItems="center" gap="2">
            <Icon size="sm" color="muted">
              <Globe />
            </Icon>
            <Text size="1" color="muted">
              {website.domain}
            </Text>
          </Row>
        </Column>
        <Row gap="1">
          <Button variant="quiet" size="sm">
            <Icon size="sm">
              <ExternalLink />
            </Icon>
          </Button>
          <Button variant="quiet" size="sm">
            <Icon size="sm">
              <Settings />
            </Icon>
          </Button>
        </Row>
      </Row>

      <Row gap="6" style={{ marginTop: 'auto' }}>
        <Column gap="1">
          <Row alignItems="center" gap="1">
            <Icon size="sm" color="muted">
              <Eye />
            </Icon>
            <Text size="1" color="muted">
              Views
            </Text>
          </Row>
          <Text size="3" weight="bold">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>

        <Column gap="1">
          <Row alignItems="center" gap="1">
            <Icon size="sm" color="muted">
              <Users />
            </Icon>
            <Text size="1" color="muted">
              Visitors
            </Text>
          </Row>
          <Text size="3" weight="bold">
            {formatNumber(website.visitors)}
          </Text>
        </Column>

        <Column gap="1" style={{ marginLeft: 'auto' }}>
          <Row alignItems="center" gap="1">
            <Icon size="sm" color="muted">
              <TrendingUp />
            </Icon>
            <Text size="1" color="muted">
              Trend
            </Text>
          </Row>
          <Badge variant={isPositiveTrend ? 'success' : 'error'}>{website.trend}</Badge>
        </Column>
      </Row>
    </Column>
  );
}

export default function CardGridWebsitesPage() {
  const [search, setSearch] = useState('');

  const filteredWebsites = sampleWebsites.filter(
    website =>
      website.name.toLowerCase().includes(search.toLowerCase()) ||
      website.domain.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            Add Website
          </Button>
        </PageHeader>

        <Column
          paddingY="6"
          paddingX={{ xs: '3', md: '6' }}
          border
          borderRadius="3"
          backgroundColor
          gap="6"
        >
          <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap>
            <SearchField
              value={search}
              onSearch={setSearch}
              placeholder="Search websites..."
              delay={300}
            />
            <Text color="muted" size="1">
              {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
            </Text>
          </Row>

          <Grid
            columns={{ xs: '1', sm: '1', md: '2', lg: '3' }}
            gap="4"
            style={{ minHeight: '300px' }}
          >
            {filteredWebsites.map(website => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </Grid>

          {filteredWebsites.length === 0 && (
            <Column alignItems="center" justifyContent="center" padding="10" gap="3">
              <Icon size="lg" color="muted">
                <Globe />
              </Icon>
              <Text color="muted">No websites found</Text>
            </Column>
          )}
        </Column>
      </Column>
    </PageBody>
  );
}
