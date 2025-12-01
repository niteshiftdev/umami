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
  Plus,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  SortAsc,
} from '@/components/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';

// Mock realistic data
const mockWebsites = [
  {
    id: '1',
    name: 'Marketing Website',
    domain: 'marketing.acme.com',
    createdAt: '2024-01-15T10:30:00Z',
    stats: { pageviews: 45230, visitors: 12840, change: 12.5 },
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'shop.acme.com',
    createdAt: '2024-02-20T14:45:00Z',
    stats: { pageviews: 128450, visitors: 34210, change: 8.3 },
  },
  {
    id: '3',
    name: 'Developer Documentation',
    domain: 'docs.acme.com',
    createdAt: '2024-03-10T09:15:00Z',
    stats: { pageviews: 67890, visitors: 18230, change: -3.2 },
  },
  {
    id: '4',
    name: 'Company Blog',
    domain: 'blog.acme.com',
    createdAt: '2024-04-05T16:20:00Z',
    stats: { pageviews: 23560, visitors: 8940, change: 15.7 },
  },
  {
    id: '5',
    name: 'Support Portal',
    domain: 'support.acme.com',
    createdAt: '2024-05-12T11:00:00Z',
    stats: { pageviews: 15670, visitors: 5230, change: -2.1 },
  },
  {
    id: '6',
    name: 'Landing Pages',
    domain: 'go.acme.com',
    createdAt: '2024-06-01T08:30:00Z',
    stats: { pageviews: 89120, visitors: 41560, change: 24.8 },
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function WebsiteListItem({ website }: { website: (typeof mockWebsites)[0] }) {
  const isPositive = website.stats.change >= 0;

  return (
    <Link
      href={`/websites/${website.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Row
        alignItems="center"
        paddingX="4"
        paddingY="4"
        gap="4"
        style={{
          borderBottom: '1px solid var(--border-color)',
          transition: 'background-color 0.15s ease',
          cursor: 'pointer',
        }}
      >
        {/* Website icon and info */}
        <Row alignItems="center" gap="3" flex="2">
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-gray-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size="sm" color="muted">
              <Globe />
            </Icon>
          </div>
          <Column gap="0">
            <Text size="2" weight="medium">
              {website.name}
            </Text>
            <Text size="1" color="muted">
              {website.domain}
            </Text>
          </Column>
        </Row>

        {/* Visitors */}
        <Column gap="0" flex="1" alignItems="flex-end">
          <Text size="2" weight="medium">
            {formatNumber(website.stats.visitors)}
          </Text>
          <Text size="0" color="muted">
            visitors
          </Text>
        </Column>

        {/* Pageviews */}
        <Column gap="0" flex="1" alignItems="flex-end">
          <Text size="2" weight="medium">
            {formatNumber(website.stats.pageviews)}
          </Text>
          <Text size="0" color="muted">
            pageviews
          </Text>
        </Column>

        {/* Change indicator */}
        <Row gap="1" alignItems="center" flex="1" justifyContent="flex-end">
          <Icon
            size="sm"
            style={{
              color: isPositive
                ? 'var(--color-green-600)'
                : 'var(--color-red-600)',
            }}
          >
            {isPositive ? <ArrowUpRight /> : <ArrowDownRight />}
          </Icon>
          <Text
            size="1"
            weight="medium"
            style={{
              color: isPositive
                ? 'var(--color-green-600)'
                : 'var(--color-red-600)',
            }}
          >
            {isPositive ? '+' : ''}
            {website.stats.change}%
          </Text>
        </Row>

        {/* Created date */}
        <Row gap="1" alignItems="center" flex="1" justifyContent="flex-end">
          <Icon size="xs" color="muted">
            <Calendar />
          </Icon>
          <Text size="1" color="muted">
            {formatDate(website.createdAt)}
          </Text>
        </Row>

        {/* Actions */}
        <Row gap="1" alignItems="center">
          <Link
            href={`/websites/${website.id}/settings`}
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="quiet" size="sm">
              <Icon size="sm">
                <SquarePen />
              </Icon>
            </Button>
          </Link>
          <Icon size="sm" color="muted">
            <ChevronRight />
          </Icon>
        </Row>
      </Row>
    </Link>
  );
}

export default function MinimalListPrototype() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'visitors' | 'pageviews' | 'change'>(
    'visitors'
  );

  const filteredWebsites = useMemo(() => {
    let result = [...mockWebsites];

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(lowerSearch) ||
          w.domain.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'visitors':
          return b.stats.visitors - a.stats.visitors;
        case 'pageviews':
          return b.stats.pageviews - a.stats.pageviews;
        case 'change':
          return b.stats.change - a.stats.change;
        default:
          return 0;
      }
    });

    return result;
  }, [search, sortBy]);

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

        {/* Search and sort controls */}
        <Row justifyContent="space-between" alignItems="center" gap="4">
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search websites..."
          />
          <Row gap="2" alignItems="center">
            <Icon size="sm" color="muted">
              <SortAsc />
            </Icon>
            <Text size="1" color="muted">
              Sort by:
            </Text>
            <Row gap="1">
              <Button
                variant={sortBy === 'visitors' ? 'secondary' : 'quiet'}
                size="sm"
                onPress={() => setSortBy('visitors')}
              >
                Visitors
              </Button>
              <Button
                variant={sortBy === 'pageviews' ? 'secondary' : 'quiet'}
                size="sm"
                onPress={() => setSortBy('pageviews')}
              >
                Pageviews
              </Button>
              <Button
                variant={sortBy === 'change' ? 'secondary' : 'quiet'}
                size="sm"
                onPress={() => setSortBy('change')}
              >
                Growth
              </Button>
              <Button
                variant={sortBy === 'name' ? 'secondary' : 'quiet'}
                size="sm"
                onPress={() => setSortBy('name')}
              >
                Name
              </Button>
            </Row>
          </Row>
        </Row>

        {/* List header */}
        <Row
          alignItems="center"
          paddingX="4"
          paddingY="2"
          gap="4"
          style={{
            borderBottom: '2px solid var(--border-color)',
            backgroundColor: 'var(--color-gray-50)',
          }}
        >
          <Text size="0" weight="bold" color="muted" flex="2">
            WEBSITE
          </Text>
          <Text size="0" weight="bold" color="muted" flex="1" style={{ textAlign: 'right' }}>
            VISITORS
          </Text>
          <Text size="0" weight="bold" color="muted" flex="1" style={{ textAlign: 'right' }}>
            PAGEVIEWS
          </Text>
          <Text size="0" weight="bold" color="muted" flex="1" style={{ textAlign: 'right' }}>
            CHANGE
          </Text>
          <Text size="0" weight="bold" color="muted" flex="1" style={{ textAlign: 'right' }}>
            CREATED
          </Text>
          <div style={{ width: '80px' }} />
        </Row>

        {/* List items */}
        <Column
          border
          borderRadius="3"
          backgroundColor
          style={{ overflow: 'hidden' }}
        >
          {filteredWebsites.map((website) => (
            <WebsiteListItem key={website.id} website={website} />
          ))}
        </Column>

        {filteredWebsites.length === 0 && (
          <Column alignItems="center" paddingY="10">
            <Text color="muted">No websites found matching your search.</Text>
          </Column>
        )}

        {/* Summary footer */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingX="4"
          paddingY="3"
          style={{
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <Text size="1" color="muted">
            Showing {filteredWebsites.length} of {mockWebsites.length} websites
          </Text>
          <Row gap="4">
            <Text size="1" color="muted">
              Total visitors:{' '}
              <Text size="1" weight="bold">
                {formatNumber(
                  filteredWebsites.reduce((sum, w) => sum + w.stats.visitors, 0)
                )}
              </Text>
            </Text>
            <Text size="1" color="muted">
              Total pageviews:{' '}
              <Text size="1" weight="bold">
                {formatNumber(
                  filteredWebsites.reduce((sum, w) => sum + w.stats.pageviews, 0)
                )}
              </Text>
            </Text>
          </Row>
        </Row>
      </Column>
    </PageBody>
  );
}
