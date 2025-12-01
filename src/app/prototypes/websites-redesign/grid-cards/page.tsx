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
import {
  Globe,
  SquarePen,
  TrendingUp,
  TrendingDown,
  Plus,
  MoreVertical,
  ArrowUpRight,
  Activity,
} from '@/components/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';

// Mock realistic data with trend information
const mockWebsites = [
  {
    id: '1',
    name: 'Marketing Website',
    domain: 'marketing.acme.com',
    stats: { pageviews: 45230, visitors: 12840, trend: 12.5, isUp: true },
    status: 'active',
    lastVisit: '2 min ago',
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'shop.acme.com',
    stats: { pageviews: 128450, visitors: 34210, trend: 8.3, isUp: true },
    status: 'active',
    lastVisit: '1 min ago',
  },
  {
    id: '3',
    name: 'Developer Documentation',
    domain: 'docs.acme.com',
    stats: { pageviews: 67890, visitors: 18230, trend: 3.2, isUp: false },
    status: 'active',
    lastVisit: '5 min ago',
  },
  {
    id: '4',
    name: 'Company Blog',
    domain: 'blog.acme.com',
    stats: { pageviews: 23560, visitors: 8940, trend: 15.7, isUp: true },
    status: 'active',
    lastVisit: '12 min ago',
  },
  {
    id: '5',
    name: 'Support Portal',
    domain: 'support.acme.com',
    stats: { pageviews: 15670, visitors: 5230, trend: 2.1, isUp: false },
    status: 'inactive',
    lastVisit: '3 hours ago',
  },
  {
    id: '6',
    name: 'Landing Pages',
    domain: 'go.acme.com',
    stats: { pageviews: 89120, visitors: 41560, trend: 24.8, isUp: true },
    status: 'active',
    lastVisit: 'Just now',
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function CompactWebsiteCard({ website }: { website: (typeof mockWebsites)[0] }) {
  return (
    <Column
      gap="3"
      paddingX="5"
      paddingY="4"
      border
      borderRadius="3"
      backgroundColor
      style={{
        minHeight: '180px',
        position: 'relative',
      }}
    >
      {/* Status indicator */}
      <Row
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
        }}
      >
        <Row
          alignItems="center"
          gap="1"
          paddingX="2"
          paddingY="1"
          borderRadius="2"
          style={{
            backgroundColor:
              website.status === 'active'
                ? 'var(--color-green-100)'
                : 'var(--color-gray-100)',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor:
                website.status === 'active'
                  ? 'var(--color-green-600)'
                  : 'var(--color-gray-400)',
            }}
          />
          <Text
            size="0"
            style={{
              color:
                website.status === 'active'
                  ? 'var(--color-green-700)'
                  : 'var(--color-gray-600)',
            }}
          >
            {website.status === 'active' ? 'Active' : 'Inactive'}
          </Text>
        </Row>
      </Row>

      {/* Website info */}
      <Column gap="1">
        <Row alignItems="center" gap="2">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size="sm" color="primary">
              <Globe />
            </Icon>
          </div>
        </Row>
        <Heading size="2" style={{ marginTop: '8px' }}>
          {website.name}
        </Heading>
        <Text size="1" color="muted">
          {website.domain}
        </Text>
      </Column>

      {/* Stats */}
      <Row gap="4" style={{ marginTop: 'auto' }}>
        <Column gap="0">
          <Text size="3" weight="bold">
            {formatNumber(website.stats.visitors)}
          </Text>
          <Text size="0" color="muted">
            visitors
          </Text>
        </Column>
        <Column gap="0">
          <Row alignItems="center" gap="1">
            <Text size="3" weight="bold">
              {website.stats.trend}%
            </Text>
            <Icon
              size="xs"
              style={{
                color: website.stats.isUp
                  ? 'var(--color-green-600)'
                  : 'var(--color-red-600)',
              }}
            >
              {website.stats.isUp ? <TrendingUp /> : <TrendingDown />}
            </Icon>
          </Row>
          <Text size="0" color="muted">
            vs last week
          </Text>
        </Column>
      </Row>

      {/* Footer */}
      <Row
        justifyContent="space-between"
        alignItems="center"
        paddingTop="3"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <Text size="0" color="muted">
          {website.lastVisit}
        </Text>
        <Row gap="1">
          <Link href={`/websites/${website.id}/settings`}>
            <Button variant="quiet" size="sm">
              <Icon size="sm">
                <SquarePen />
              </Icon>
            </Button>
          </Link>
          <Link href={`/websites/${website.id}`}>
            <Button variant="quiet" size="sm">
              <Icon size="sm">
                <ArrowUpRight />
              </Icon>
            </Button>
          </Link>
        </Row>
      </Row>
    </Column>
  );
}

export default function GridCardsPrototype() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredWebsites = useMemo(() => {
    let result = mockWebsites;

    if (filter !== 'all') {
      result = result.filter((w) => w.status === filter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(lowerSearch) ||
          w.domain.toLowerCase().includes(lowerSearch)
      );
    }

    return result;
  }, [search, filter]);

  const activeCount = mockWebsites.filter((w) => w.status === 'active').length;
  const inactiveCount = mockWebsites.filter((w) => w.status === 'inactive').length;

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

        {/* Live stats bar */}
        <Row
          gap="6"
          paddingX="5"
          paddingY="4"
          border
          borderRadius="3"
          backgroundColor
          alignItems="center"
        >
          <Row alignItems="center" gap="2">
            <Icon size="sm" color="primary">
              <Activity />
            </Icon>
            <Text size="1" weight="medium">
              Live Overview
            </Text>
          </Row>
          <Row gap="6" style={{ marginLeft: 'auto' }}>
            <Column gap="0" alignItems="center">
              <Text size="4" weight="bold">
                {formatNumber(
                  mockWebsites.reduce((sum, w) => sum + w.stats.visitors, 0)
                )}
              </Text>
              <Text size="0" color="muted">
                Total Visitors
              </Text>
            </Column>
            <Column gap="0" alignItems="center">
              <Text size="4" weight="bold">
                {formatNumber(
                  mockWebsites.reduce((sum, w) => sum + w.stats.pageviews, 0)
                )}
              </Text>
              <Text size="0" color="muted">
                Total Pageviews
              </Text>
            </Column>
            <Column gap="0" alignItems="center">
              <Row alignItems="center" gap="1">
                <Text size="4" weight="bold" style={{ color: 'var(--color-green-600)' }}>
                  +12.4%
                </Text>
                <Icon size="sm" style={{ color: 'var(--color-green-600)' }}>
                  <TrendingUp />
                </Icon>
              </Row>
              <Text size="0" color="muted">
                Avg Growth
              </Text>
            </Column>
          </Row>
        </Row>

        {/* Filters and search */}
        <Row justifyContent="space-between" alignItems="center" gap="4">
          <Row gap="2">
            <Button
              variant={filter === 'all' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setFilter('all')}
            >
              All ({mockWebsites.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setFilter('active')}
            >
              Active ({activeCount})
            </Button>
            <Button
              variant={filter === 'inactive' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setFilter('inactive')}
            >
              Inactive ({inactiveCount})
            </Button>
          </Row>
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search websites..."
          />
        </Row>

        {/* Cards grid - 3 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredWebsites.map((website) => (
            <CompactWebsiteCard key={website.id} website={website} />
          ))}
        </div>

        {filteredWebsites.length === 0 && (
          <Column alignItems="center" paddingY="10">
            <Text color="muted">No websites found matching your criteria.</Text>
          </Column>
        )}
      </Column>
    </PageBody>
  );
}
