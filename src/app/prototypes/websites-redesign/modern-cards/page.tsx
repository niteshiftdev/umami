'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  Column,
  Row,
  Heading,
  Text,
  Icon,
  Button,
  SearchField,
} from '@umami/react-zen';
import { Globe, SquarePen, ExternalLink, TrendingUp, Eye, Users, Plus, LayoutGrid, List } from '@/components/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';

// Mock realistic data for the prototype
const mockWebsites = [
  {
    id: '1',
    name: 'Marketing Website',
    domain: 'marketing.acme.com',
    createdAt: '2024-01-15T10:30:00Z',
    stats: { pageviews: 45230, visitors: 12840, bounceRate: 32 },
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'shop.acme.com',
    createdAt: '2024-02-20T14:45:00Z',
    stats: { pageviews: 128450, visitors: 34210, bounceRate: 28 },
  },
  {
    id: '3',
    name: 'Developer Documentation',
    domain: 'docs.acme.com',
    createdAt: '2024-03-10T09:15:00Z',
    stats: { pageviews: 67890, visitors: 18230, bounceRate: 45 },
  },
  {
    id: '4',
    name: 'Company Blog',
    domain: 'blog.acme.com',
    createdAt: '2024-04-05T16:20:00Z',
    stats: { pageviews: 23560, visitors: 8940, bounceRate: 52 },
  },
  {
    id: '5',
    name: 'Support Portal',
    domain: 'support.acme.com',
    createdAt: '2024-05-12T11:00:00Z',
    stats: { pageviews: 15670, visitors: 5230, bounceRate: 38 },
  },
  {
    id: '6',
    name: 'Landing Pages',
    domain: 'go.acme.com',
    createdAt: '2024-06-01T08:30:00Z',
    stats: { pageviews: 89120, visitors: 41560, bounceRate: 22 },
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function WebsiteCard({ website }: { website: typeof mockWebsites[0] }) {
  const createdDate = new Date(website.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Column
      gap="4"
      paddingX="6"
      paddingY="5"
      border
      borderRadius="3"
      backgroundColor
      style={{
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: 'pointer',
      }}
    >
      {/* Header with website name and domain */}
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Row alignItems="center" gap="2">
            <Icon size="sm" color="primary">
              <Globe />
            </Icon>
            <Heading size="2">{website.name}</Heading>
          </Row>
          <Row alignItems="center" gap="2">
            <Text size="1" color="muted">
              {website.domain}
            </Text>
            <Icon size="xs" color="muted">
              <ExternalLink />
            </Icon>
          </Row>
        </Column>
        <Row gap="2">
          <Link href={`/websites/${website.id}/settings`}>
            <Button variant="quiet" size="sm">
              <Icon size="sm">
                <SquarePen />
              </Icon>
            </Button>
          </Link>
        </Row>
      </Row>

      {/* Stats row */}
      <Row gap="6" paddingTop="2" style={{ borderTop: '1px solid var(--border-color)' }}>
        <Column gap="1">
          <Row alignItems="center" gap="1">
            <Icon size="xs" color="muted">
              <Eye />
            </Icon>
            <Text size="0" color="muted">
              Pageviews
            </Text>
          </Row>
          <Text size="3" weight="bold">
            {formatNumber(website.stats.pageviews)}
          </Text>
        </Column>
        <Column gap="1">
          <Row alignItems="center" gap="1">
            <Icon size="xs" color="muted">
              <Users />
            </Icon>
            <Text size="0" color="muted">
              Visitors
            </Text>
          </Row>
          <Text size="3" weight="bold">
            {formatNumber(website.stats.visitors)}
          </Text>
        </Column>
        <Column gap="1">
          <Row alignItems="center" gap="1">
            <Icon size="xs" color="muted">
              <TrendingUp />
            </Icon>
            <Text size="0" color="muted">
              Bounce Rate
            </Text>
          </Row>
          <Text size="3" weight="bold">
            {website.stats.bounceRate}%
          </Text>
        </Column>
      </Row>

      {/* Footer with metadata */}
      <Row justifyContent="space-between" alignItems="center" paddingTop="2">
        <Text size="0" color="muted">
          Created {createdDate}
        </Text>
        <Link href={`/websites/${website.id}`}>
          <Button variant="primary" size="sm">
            View Analytics
          </Button>
        </Link>
      </Row>
    </Column>
  );
}

export default function ModernCardsPrototype() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');

  const filteredWebsites = useMemo(() => {
    if (!search) return mockWebsites;
    const lowerSearch = search.toLowerCase();
    return mockWebsites.filter(
      (w) =>
        w.name.toLowerCase().includes(lowerSearch) ||
        w.domain.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </Button>
        </PageHeader>

        {/* Search and view toggle */}
        <Row justifyContent="space-between" alignItems="center" gap="4">
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search websites..."
          />
          <Row gap="1">
            <Button
              variant={viewMode === 'cards' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setViewMode('cards')}
            >
              <Icon size="sm">
                <LayoutGrid />
              </Icon>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setViewMode('list')}
            >
              <Icon size="sm">
                <List />
              </Icon>
            </Button>
          </Row>
        </Row>

        {/* Summary stats */}
        <Row gap="4">
          <Column
            gap="1"
            paddingX="5"
            paddingY="4"
            border
            borderRadius="3"
            backgroundColor
            flex="1"
          >
            <Text size="0" color="muted" weight="medium">
              Total Websites
            </Text>
            <Text size="5" weight="bold">
              {filteredWebsites.length}
            </Text>
          </Column>
          <Column
            gap="1"
            paddingX="5"
            paddingY="4"
            border
            borderRadius="3"
            backgroundColor
            flex="1"
          >
            <Text size="0" color="muted" weight="medium">
              Total Pageviews
            </Text>
            <Text size="5" weight="bold">
              {formatNumber(
                filteredWebsites.reduce((sum, w) => sum + w.stats.pageviews, 0)
              )}
            </Text>
          </Column>
          <Column
            gap="1"
            paddingX="5"
            paddingY="4"
            border
            borderRadius="3"
            backgroundColor
            flex="1"
          >
            <Text size="0" color="muted" weight="medium">
              Total Visitors
            </Text>
            <Text size="5" weight="bold">
              {formatNumber(
                filteredWebsites.reduce((sum, w) => sum + w.stats.visitors, 0)
              )}
            </Text>
          </Column>
        </Row>

        {/* Cards grid */}
        <Column gap="4">
          <Row
            gap="4"
            wrap="wrap"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            }}
          >
            {filteredWebsites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))}
          </Row>
        </Column>

        {filteredWebsites.length === 0 && (
          <Column alignItems="center" paddingY="10">
            <Text color="muted">No websites found matching your search.</Text>
          </Column>
        )}
      </Column>
    </PageBody>
  );
}
