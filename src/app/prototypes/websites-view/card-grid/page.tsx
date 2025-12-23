'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  Button,
  Icon,
  Grid,
  SearchField,
  Heading,
} from '@umami/react-zen';
import {
  Globe,
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Settings,
  ExternalLink,
  MoreHorizontal,
} from '@/components/icons';
import { Favicon } from '@/components/common/Favicon';
import { PageBody } from '@/components/common/PageBody';

// Sample data for prototype
const sampleWebsites = [
  {
    id: '1',
    name: 'Acme Corp',
    domain: 'acme.com',
    visitors: 12847,
    pageviews: 45230,
    trend: 12.5,
    status: 'active',
    createdAt: '2024-06-15',
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'techstart.io',
    visitors: 8934,
    pageviews: 28104,
    trend: -3.2,
    status: 'active',
    createdAt: '2024-08-22',
  },
  {
    id: '3',
    name: 'E-Shop Store',
    domain: 'eshop.store',
    visitors: 34521,
    pageviews: 156780,
    trend: 28.7,
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Portfolio Site',
    domain: 'jane-doe.dev',
    visitors: 2341,
    pageviews: 5892,
    trend: 5.1,
    status: 'active',
    createdAt: '2024-09-01',
  },
  {
    id: '5',
    name: 'SaaS Dashboard',
    domain: 'app.saasify.com',
    visitors: 18923,
    pageviews: 89234,
    trend: -1.8,
    status: 'active',
    createdAt: '2024-01-20',
  },
  {
    id: '6',
    name: 'News Portal',
    domain: 'dailynews.net',
    visitors: 67234,
    pageviews: 234567,
    trend: 15.3,
    status: 'active',
    createdAt: '2023-11-05',
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function WebsiteCard({ website }: { website: (typeof sampleWebsites)[0] }) {
  const isPositive = website.trend >= 0;

  return (
    <Column
      padding="5"
      border
      borderRadius="3"
      backgroundColor
      gap="4"
      style={{
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: 'pointer',
      }}
    >
      {/* Header */}
      <Row justifyContent="space-between" alignItems="flex-start">
        <Row alignItems="center" gap="3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              backgroundColor: 'var(--base-color-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Favicon domain={website.domain} />
          </div>
          <Column gap="1">
            <Text weight="bold" size="2">
              {website.name}
            </Text>
            <Text color="muted" size="1">
              {website.domain}
            </Text>
          </Column>
        </Row>
        <Button variant="quiet" size="sm">
          <Icon size="sm">
            <MoreHorizontal />
          </Icon>
        </Button>
      </Row>

      {/* Metrics */}
      <Row gap="6">
        <Column gap="1">
          <Text color="muted" size="0">
            Visitors
          </Text>
          <Row alignItems="center" gap="2">
            <Text weight="bold" size="3">
              {formatNumber(website.visitors)}
            </Text>
          </Row>
        </Column>
        <Column gap="1">
          <Text color="muted" size="0">
            Pageviews
          </Text>
          <Text weight="bold" size="3">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>
      </Row>

      {/* Trend */}
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center" gap="2">
          <Icon size="sm" color={isPositive ? 'success' : 'error'}>
            {isPositive ? <TrendingUp /> : <TrendingDown />}
          </Icon>
          <Text size="1" color={isPositive ? 'success' : 'error'}>
            {isPositive ? '+' : ''}
            {website.trend}% from last week
          </Text>
        </Row>
      </Row>

      {/* Actions */}
      <Row gap="2" marginTop="2">
        <Link href={`/websites/${website.id}`} style={{ flex: 1 }}>
          <Button variant="secondary" style={{ width: '100%' }}>
            <Icon size="sm">
              <Eye />
            </Icon>
            <Text>View Analytics</Text>
          </Button>
        </Link>
        <Link href={`/websites/${website.id}/settings`}>
          <Button variant="quiet">
            <Icon size="sm">
              <Settings />
            </Icon>
          </Button>
        </Link>
      </Row>
    </Column>
  );
}

export default function CardGridVariation() {
  const [search, setSearch] = useState('');

  const filteredWebsites = sampleWebsites.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.domain.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageBody>
      <Column gap="6" margin="2">
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="6"
          border="bottom"
        >
          <Column gap="2">
            <Heading size="4">Websites</Heading>
            <Text color="muted">{sampleWebsites.length} websites tracked</Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add website</Text>
          </Button>
        </Row>

        {/* Search and filters */}
        <Row alignItems="center" justifyContent="space-between" gap="4">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search websites..."
            style={{ maxWidth: 300 }}
          />
          <Row gap="2">
            <Button variant="secondary" size="sm">
              Sort by: Recent
            </Button>
          </Row>
        </Row>

        {/* Card Grid */}
        <Grid columns={{ xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }} gap="4">
          {filteredWebsites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </Grid>

        {filteredWebsites.length === 0 && (
          <Column alignItems="center" justifyContent="center" padding="8" gap="4">
            <Icon size="xl" color="muted">
              <Globe />
            </Icon>
            <Text color="muted">No websites found matching your search</Text>
          </Column>
        )}
      </Column>
    </PageBody>
  );
}
