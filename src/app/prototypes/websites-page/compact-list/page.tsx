'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Grid,
  Text,
  Icon,
  Button,
  SearchField,
  StatusLight,
} from '@umami/react-zen';
import {
  Globe,
  SquarePen,
  Plus,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Check,
  ExternalLink,
  Trash2,
  Copy,
  MoreHorizontal,
} from 'lucide-react';

// Mock websites data with more entries for compact view testing
const mockWebsites = [
  { id: '1', name: 'Acme Corporation', domain: 'acme.com', visitors: 12847, pageviews: 45231, trend: 12.5, isOnline: 3, lastUpdated: '2 min ago' },
  { id: '2', name: 'TechStart Blog', domain: 'blog.techstart.io', visitors: 8934, pageviews: 28476, trend: -4.2, isOnline: 7, lastUpdated: '5 min ago' },
  { id: '3', name: 'E-Commerce Store', domain: 'shop.example.org', visitors: 34521, pageviews: 98234, trend: 28.3, isOnline: 15, lastUpdated: '1 min ago' },
  { id: '4', name: 'Portfolio Site', domain: 'designer.me', visitors: 2341, pageviews: 5672, trend: 8.7, isOnline: 0, lastUpdated: '15 min ago' },
  { id: '5', name: 'SaaS Dashboard', domain: 'app.saasproduct.com', visitors: 18234, pageviews: 67843, trend: 15.1, isOnline: 42, lastUpdated: '30 sec ago' },
  { id: '6', name: 'Documentation Hub', domain: 'docs.opensource.dev', visitors: 6723, pageviews: 21345, trend: -1.8, isOnline: 8, lastUpdated: '8 min ago' },
  { id: '7', name: 'Marketing Landing', domain: 'launch.startup.co', visitors: 4521, pageviews: 12453, trend: 45.2, isOnline: 2, lastUpdated: '3 min ago' },
  { id: '8', name: 'Community Forum', domain: 'forum.community.org', visitors: 9876, pageviews: 34567, trend: 5.6, isOnline: 23, lastUpdated: '1 min ago' },
  { id: '9', name: 'News Portal', domain: 'news.daily.net', visitors: 56789, pageviews: 234567, trend: -2.3, isOnline: 156, lastUpdated: '10 sec ago' },
  { id: '10', name: 'Learning Platform', domain: 'learn.education.io', visitors: 23456, pageviews: 89012, trend: 18.9, isOnline: 67, lastUpdated: '4 min ago' },
  { id: '11', name: 'Event Website', domain: 'conference2024.com', visitors: 1234, pageviews: 4567, trend: 78.4, isOnline: 1, lastUpdated: '20 min ago' },
  { id: '12', name: 'API Gateway', domain: 'api.services.io', visitors: 45678, pageviews: 123456, trend: 3.2, isOnline: 0, lastUpdated: '12 min ago' },
];

type SortField = 'name' | 'visitors' | 'pageviews' | 'trend';
type SortDirection = 'asc' | 'desc';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function SortHeader({
  label,
  field,
  currentSort,
  currentDirection,
  onSort,
  align = 'left',
}: {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}) {
  const isActive = currentSort === field;

  return (
    <Row
      alignItems="center"
      gap="1"
      justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onSort(field)}
    >
      <Text size="1" weight={isActive ? 'bold' : 'medium'} color={isActive ? undefined : 'muted'}>
        {label}
      </Text>
      <Icon size="xs" color={isActive ? undefined : 'muted'}>
        {isActive && currentDirection === 'asc' ? <ChevronUp /> : <ChevronDown />}
      </Icon>
    </Row>
  );
}

function CompactRow({
  website,
  isSelected,
  onSelect,
}: {
  website: (typeof mockWebsites)[0];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grid
      columns="24px 1fr 100px 100px 80px 100px 80px"
      gap="3"
      alignItems="center"
      paddingY="2"
      paddingX="3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isSelected
          ? 'var(--color-blue-50)'
          : isHovered
            ? 'var(--color-gray-50)'
            : 'transparent',
        borderRadius: '4px',
        transition: 'background-color 0.1s ease',
      }}
    >
      {/* Checkbox */}
      <Row
        alignItems="center"
        justifyContent="center"
        style={{ cursor: 'pointer' }}
        onClick={() => onSelect(website.id)}
      >
        <Row
          alignItems="center"
          justifyContent="center"
          border
          borderRadius="1"
          style={{
            width: 16,
            height: 16,
            backgroundColor: isSelected ? 'var(--color-blue-500)' : 'transparent',
            borderColor: isSelected ? 'var(--color-blue-500)' : undefined,
          }}
        >
          {isSelected && (
            <Icon size="xs" style={{ color: 'white' }}>
              <Check />
            </Icon>
          )}
        </Row>
      </Row>

      {/* Website Name & Domain */}
      <Row alignItems="center" gap="3">
        <Row
          alignItems="center"
          justifyContent="center"
          backgroundColor="2"
          borderRadius="1"
          style={{ width: 28, height: 28, flexShrink: 0 }}
        >
          <Icon size="sm" color="muted">
            <Globe />
          </Icon>
        </Row>
        <Column gap="0">
          <Link
            href={`/websites/${website.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Text size="2" weight="medium" truncate style={{ maxWidth: 200 }}>
              {website.name}
            </Text>
          </Link>
          <Row alignItems="center" gap="1">
            <Text size="1" color="muted" truncate style={{ maxWidth: 150 }}>
              {website.domain}
            </Text>
            <a
              href={`https://${website.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ lineHeight: 0 }}
            >
              <Icon size="xs" color="muted">
                <ExternalLink />
              </Icon>
            </a>
          </Row>
        </Column>
      </Row>

      {/* Visitors */}
      <Text size="2" weight="medium" align="right">
        {formatNumber(website.visitors)}
      </Text>

      {/* Pageviews */}
      <Text size="2" align="right">
        {formatNumber(website.pageviews)}
      </Text>

      {/* Trend */}
      <Row alignItems="center" justifyContent="flex-end" gap="1">
        <Icon size="xs" style={{ color: website.trend >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
          {website.trend >= 0 ? <TrendingUp /> : <TrendingDown />}
        </Icon>
        <Text size="1" style={{ color: website.trend >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
          {website.trend >= 0 ? '+' : ''}
          {website.trend}%
        </Text>
      </Row>

      {/* Status */}
      <Row justifyContent="center">
        {website.isOnline > 0 ? (
          <StatusLight variant="success">
            <Text size="1">{website.isOnline}</Text>
          </StatusLight>
        ) : (
          <Text size="1" color="muted">
            -
          </Text>
        )}
      </Row>

      {/* Actions */}
      <Row alignItems="center" justifyContent="flex-end" gap="1">
        {isHovered && (
          <>
            <Button variant="quiet" size="xs">
              <Icon size="sm">
                <Copy />
              </Icon>
            </Button>
            <Link href={`/websites/${website.id}/settings`}>
              <Button variant="quiet" size="xs">
                <Icon size="sm">
                  <SquarePen />
                </Icon>
              </Button>
            </Link>
          </>
        )}
        <Button variant="quiet" size="xs">
          <Icon size="sm">
            <MoreHorizontal />
          </Icon>
        </Button>
      </Row>
    </Grid>
  );
}

export default function CompactListWebsitesPage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('visitors');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredWebsites.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredWebsites.map(w => w.id)));
    }
  };

  const filteredWebsites = useMemo(() => {
    let result = mockWebsites.filter(
      website =>
        website.name.toLowerCase().includes(search.toLowerCase()) ||
        website.domain.toLowerCase().includes(search.toLowerCase()),
    );

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;

      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal as string) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    });

    return result;
  }, [search, sortField, sortDirection]);

  const allSelected = selectedIds.size === filteredWebsites.length && filteredWebsites.length > 0;

  return (
    <Column
      width="100%"
      paddingBottom="6"
      maxWidth="1320px"
      paddingX={{ xs: '3', md: '6' }}
      style={{ margin: '0 auto' }}
    >
      <Column gap="4" margin="2">
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="4"
          marginBottom="2"
          border="bottom"
          width="100%"
        >
          <Column gap="1">
            <Text size="5" weight="bold">
              Websites
            </Text>
            <Text size="2" color="muted">
              {mockWebsites.length} websites
            </Text>
          </Column>
          <Button variant="primary" size="sm">
            <Icon size="sm">
              <Plus />
            </Icon>
            <Text size="2">Add Website</Text>
          </Button>
        </Row>

        {/* Search and Bulk Actions */}
        <Row alignItems="center" justifyContent="space-between" gap="4">
          <Row alignItems="center" gap="3">
            <SearchField
              value={search}
              onSearch={setSearch}
              placeholder="Search..."
              style={{ maxWidth: '240px' }}
            />
            <Text size="1" color="muted">
              {filteredWebsites.length} results
            </Text>
          </Row>
          {selectedIds.size > 0 && (
            <Row alignItems="center" gap="2">
              <Text size="2" color="muted">
                {selectedIds.size} selected
              </Text>
              <Button variant="outline" size="sm">
                <Icon size="sm">
                  <Copy />
                </Icon>
                <Text size="2">Copy Codes</Text>
              </Button>
              <Button variant="outline" size="sm">
                <Icon size="sm" style={{ color: 'var(--danger-color)' }}>
                  <Trash2 />
                </Icon>
                <Text size="2" style={{ color: 'var(--danger-color)' }}>
                  Delete
                </Text>
              </Button>
            </Row>
          )}
        </Row>

        {/* List Container */}
        <Column backgroundColor border borderRadius="3" overflow="hidden">
          {/* Table Header */}
          <Grid
            columns="24px 1fr 100px 100px 80px 100px 80px"
            gap="3"
            alignItems="center"
            paddingY="3"
            paddingX="3"
            backgroundColor="2"
            border="bottom"
          >
            <Row
              alignItems="center"
              justifyContent="center"
              style={{ cursor: 'pointer' }}
              onClick={handleSelectAll}
            >
              <Row
                alignItems="center"
                justifyContent="center"
                border
                borderRadius="1"
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: allSelected ? 'var(--color-blue-500)' : 'transparent',
                  borderColor: allSelected ? 'var(--color-blue-500)' : undefined,
                }}
              >
                {allSelected && (
                  <Icon size="xs" style={{ color: 'white' }}>
                    <Check />
                  </Icon>
                )}
              </Row>
            </Row>
            <SortHeader
              label="WEBSITE"
              field="name"
              currentSort={sortField}
              currentDirection={sortDirection}
              onSort={handleSort}
            />
            <SortHeader
              label="VISITORS"
              field="visitors"
              currentSort={sortField}
              currentDirection={sortDirection}
              onSort={handleSort}
              align="right"
            />
            <SortHeader
              label="PAGEVIEWS"
              field="pageviews"
              currentSort={sortField}
              currentDirection={sortDirection}
              onSort={handleSort}
              align="right"
            />
            <SortHeader
              label="TREND"
              field="trend"
              currentSort={sortField}
              currentDirection={sortDirection}
              onSort={handleSort}
              align="right"
            />
            <Text size="1" color="muted" align="center">
              ONLINE
            </Text>
            <Text size="1" color="muted" align="right">
              ACTIONS
            </Text>
          </Grid>

          {/* List Items */}
          <Column>
            {filteredWebsites.map((website, index) => (
              <div
                key={website.id}
                style={{
                  borderBottom:
                    index < filteredWebsites.length - 1
                      ? '1px solid var(--color-gray-100)'
                      : 'none',
                }}
              >
                <CompactRow
                  website={website}
                  isSelected={selectedIds.has(website.id)}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </Column>

          {filteredWebsites.length === 0 && (
            <Row
              color="muted"
              alignItems="center"
              justifyContent="center"
              width="100%"
              padding="6"
            >
              No websites found.
            </Row>
          )}
        </Column>

        {/* Footer */}
        <Row justifyContent="space-between" alignItems="center" paddingY="2">
          <Text size="1" color="muted">
            Showing {filteredWebsites.length} of {mockWebsites.length} websites
          </Text>
          <Row gap="2">
            <Button variant="outline" size="sm" isDisabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" isDisabled>
              Next
            </Button>
          </Row>
        </Row>
      </Column>
    </Column>
  );
}
