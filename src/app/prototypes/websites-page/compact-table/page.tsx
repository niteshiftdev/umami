'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Text,
  Heading,
  Icon,
  Button,
  SearchField,
  StatusLight,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableColumn,
  TableCell,
} from '@umami/react-zen';
import {
  Globe,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Settings,
  TrendingUp,
  TrendingDown,
  Filter,
} from 'lucide-react';

// Mock data for prototype with extensive metrics
const mockWebsites = [
  {
    id: '1',
    name: 'Marketing Site',
    domain: 'marketing.example.com',
    visitors: 12847,
    pageviews: 45231,
    sessions: 15234,
    bounceRate: 42.3,
    avgDuration: 154,
    trend: 12.5,
    status: 'active',
    events: 8934,
    conversion: 3.2,
  },
  {
    id: '2',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    visitors: 8934,
    pageviews: 67823,
    sessions: 12456,
    bounceRate: 35.8,
    avgDuration: 252,
    trend: 8.2,
    status: 'active',
    events: 23456,
    conversion: 4.8,
  },
  {
    id: '3',
    name: 'Documentation Portal',
    domain: 'docs.example.com',
    visitors: 5621,
    pageviews: 23456,
    sessions: 6789,
    bounceRate: 28.1,
    avgDuration: 345,
    trend: -3.4,
    status: 'active',
    events: 1234,
    conversion: 0,
  },
  {
    id: '4',
    name: 'Developer Blog',
    domain: 'blog.example.com',
    visitors: 3412,
    pageviews: 8934,
    sessions: 4123,
    bounceRate: 52.6,
    avgDuration: 201,
    trend: 24.1,
    status: 'active',
    events: 567,
    conversion: 1.5,
  },
  {
    id: '5',
    name: 'Support Center',
    domain: 'support.example.com',
    visitors: 2156,
    pageviews: 12345,
    sessions: 2890,
    bounceRate: 31.2,
    avgDuration: 368,
    trend: -1.2,
    status: 'active',
    events: 4521,
    conversion: 0,
  },
  {
    id: '6',
    name: 'Landing Pages',
    domain: 'landing.example.com',
    visitors: 987,
    pageviews: 2341,
    sessions: 1123,
    bounceRate: 68.4,
    avgDuration: 75,
    trend: 45.3,
    status: 'inactive',
    events: 234,
    conversion: 8.2,
  },
  {
    id: '7',
    name: 'Partner Portal',
    domain: 'partners.example.com',
    visitors: 654,
    pageviews: 3421,
    sessions: 789,
    bounceRate: 22.1,
    avgDuration: 412,
    trend: 5.6,
    status: 'active',
    events: 1890,
    conversion: 12.4,
  },
  {
    id: '8',
    name: 'Community Forum',
    domain: 'community.example.com',
    visitors: 4532,
    pageviews: 34567,
    sessions: 5678,
    bounceRate: 18.9,
    avgDuration: 534,
    trend: 15.3,
    status: 'active',
    events: 12345,
    conversion: 0,
  },
];

type SortField = 'name' | 'visitors' | 'pageviews' | 'bounceRate' | 'trend';
type SortDirection = 'asc' | 'desc';

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function MiniSparkline({ trend, positive }: { trend: number; positive: boolean }) {
  // Generate a simple sparkline-like visualization
  const bars = [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, positive ? 1 : 0.5];

  return (
    <Row gap="0" alignItems="flex-end" style={{ height: 20 }}>
      {bars.map((height, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: `${height * 100}%`,
            backgroundColor: positive
              ? 'var(--color-green-9)'
              : 'var(--color-red-9)',
            marginRight: 1,
            borderRadius: 1,
            opacity: 0.3 + i * 0.1,
          }}
        />
      ))}
    </Row>
  );
}

function SortableHeader({
  label,
  field,
  currentSort,
  currentDirection,
  onSort,
  align = 'start',
}: {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'start' | 'end';
}) {
  const isActive = currentSort === field;

  return (
    <Row
      gap="1"
      alignItems="center"
      justifyContent={align === 'end' ? 'flex-end' : 'flex-start'}
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => onSort(field)}
    >
      <Text size="1" weight="medium" color={isActive ? 'primary' : 'muted'}>
        {label}
      </Text>
      <Icon size="xs" color={isActive ? 'primary' : 'muted'}>
        {isActive ? (
          currentDirection === 'asc' ? (
            <ArrowUp size={12} />
          ) : (
            <ArrowDown size={12} />
          )
        ) : (
          <ArrowUpDown size={12} />
        )}
      </Icon>
    </Row>
  );
}

export default function CompactTableWebsitesPage() {
  const [searchValue, setSearchValue] = useState('');
  const [sortField, setSortField] = useState<SortField>('visitors');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredWebsites = mockWebsites
    .filter(
      (site) =>
        site.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        site.domain.toLowerCase().includes(searchValue.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal as string) * modifier;
      }
      return ((aVal as number) - (bVal as number)) * modifier;
    });

  return (
    <>
      <style>{`
        @keyframes tableRowFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .table-row {
          animation: tableRowFade 0.3s ease-out both;
        }
        .table-row:hover {
          background-color: var(--base-color-3);
        }
      `}</style>
      <Column
        width="100%"
        maxWidth="1320px"
        paddingX={{ xs: '3', md: '6' }}
        paddingBottom="6"
        style={{ margin: '0 auto' }}
      >
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="4"
          border="bottom"
          width="100%"
        >
          <Column gap="1">
            <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
            <Text color="muted" size="2">
              Manage and monitor your tracked websites
            </Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus size={16} />
            </Icon>
            Add Website
          </Button>
        </Row>

        {/* Controls */}
        <Row
          marginBottom="4"
          gap="3"
          justifyContent="space-between"
          alignItems="center"
          wrap="wrap"
        >
          <SearchField
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search websites..."
            style={{ maxWidth: 280 }}
          />
          <Row gap="2">
            <Button variant="quiet" size="sm">
              <Icon size="sm">
                <Filter size={14} />
              </Icon>
              Filter
            </Button>
          </Row>
        </Row>

        {/* Summary Stats */}
        <Row gap="4" marginBottom="5" wrap="wrap">
          <Column
            backgroundColor
            border
            borderRadius="2"
            padding="4"
            minWidth="140px"
          >
            <Text size="1" color="muted">
              Total Visitors
            </Text>
            <Text size="5" weight="bold">
              {formatNumber(
                mockWebsites.reduce((sum, site) => sum + site.visitors, 0)
              )}
            </Text>
          </Column>
          <Column
            backgroundColor
            border
            borderRadius="2"
            padding="4"
            minWidth="140px"
          >
            <Text size="1" color="muted">
              Total Pageviews
            </Text>
            <Text size="5" weight="bold">
              {formatNumber(
                mockWebsites.reduce((sum, site) => sum + site.pageviews, 0)
              )}
            </Text>
          </Column>
          <Column
            backgroundColor
            border
            borderRadius="2"
            padding="4"
            minWidth="140px"
          >
            <Text size="1" color="muted">
              Avg. Bounce Rate
            </Text>
            <Text size="5" weight="bold">
              {(
                mockWebsites.reduce((sum, site) => sum + site.bounceRate, 0) /
                mockWebsites.length
              ).toFixed(1)}
              %
            </Text>
          </Column>
          <Column
            backgroundColor
            border
            borderRadius="2"
            padding="4"
            minWidth="140px"
          >
            <Text size="1" color="muted">
              Active Sites
            </Text>
            <Text size="5" weight="bold">
              {mockWebsites.filter((s) => s.status === 'active').length}
            </Text>
          </Column>
        </Row>

        {/* Table */}
        <Column backgroundColor border borderRadius="3" overflow="hidden">
          <Table aria-label="Websites">
            <TableHeader>
              <TableColumn isRowHeader width="25%">
                <SortableHeader
                  label="Website"
                  field="name"
                  currentSort={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableColumn>
              <TableColumn width="12%">
                <SortableHeader
                  label="Visitors"
                  field="visitors"
                  currentSort={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="end"
                />
              </TableColumn>
              <TableColumn width="12%">
                <SortableHeader
                  label="Pageviews"
                  field="pageviews"
                  currentSort={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="end"
                />
              </TableColumn>
              <TableColumn width="12%">
                <SortableHeader
                  label="Bounce"
                  field="bounceRate"
                  currentSort={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  align="end"
                />
              </TableColumn>
              <TableColumn width="12%">
                <Text size="1" weight="medium" color="muted">
                  Avg. Time
                </Text>
              </TableColumn>
              <TableColumn width="15%">
                <SortableHeader
                  label="Trend"
                  field="trend"
                  currentSort={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                />
              </TableColumn>
              <TableColumn width="8%" align="end">
                <Text size="1" weight="medium" color="muted">
                  Actions
                </Text>
              </TableColumn>
            </TableHeader>
            <TableBody>
              {filteredWebsites.map((website, index) => (
                <TableRow
                  key={website.id}
                  className="table-row"
                  style={{
                    animationDelay: `${index * 0.03}s`,
                    cursor: 'pointer',
                  }}
                >
                  <TableCell>
                    <Row gap="3" alignItems="center">
                      <StatusLight
                        variant={website.status === 'active' ? 'success' : 'inactive'}
                      />
                      <Column gap="0">
                        <Text weight="medium" size="2">
                          {website.name}
                        </Text>
                        <Text color="muted" size="1">
                          {website.domain}
                        </Text>
                      </Column>
                    </Row>
                  </TableCell>
                  <TableCell align="end">
                    <Text weight="medium" size="2">
                      {formatNumber(website.visitors)}
                    </Text>
                  </TableCell>
                  <TableCell align="end">
                    <Text size="2">{formatNumber(website.pageviews)}</Text>
                  </TableCell>
                  <TableCell align="end">
                    <Text
                      size="2"
                      color={
                        website.bounceRate > 50
                          ? 'red'
                          : website.bounceRate < 30
                            ? 'green'
                            : undefined
                      }
                    >
                      {website.bounceRate}%
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text size="2" color="muted">
                      {formatDuration(website.avgDuration)}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Row gap="2" alignItems="center">
                      <MiniSparkline
                        trend={website.trend}
                        positive={website.trend >= 0}
                      />
                      <Row gap="1" alignItems="center">
                        <Icon
                          size="xs"
                          color={website.trend >= 0 ? 'green' : 'red'}
                        >
                          {website.trend >= 0 ? (
                            <TrendingUp size={12} />
                          ) : (
                            <TrendingDown size={12} />
                          )}
                        </Icon>
                        <Text
                          size="1"
                          weight="medium"
                          color={website.trend >= 0 ? 'green' : 'red'}
                        >
                          {website.trend >= 0 ? '+' : ''}
                          {website.trend}%
                        </Text>
                      </Row>
                    </Row>
                  </TableCell>
                  <TableCell align="end">
                    <Row gap="1" justifyContent="flex-end">
                      <Button variant="quiet" size="sm">
                        <Icon size="sm" color="muted">
                          <ExternalLink size={14} />
                        </Icon>
                      </Button>
                      <Button variant="quiet" size="sm">
                        <Icon size="sm" color="muted">
                          <Settings size={14} />
                        </Icon>
                      </Button>
                    </Row>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Column>

        {filteredWebsites.length === 0 && (
          <Column
            alignItems="center"
            justifyContent="center"
            padding="12"
            gap="3"
          >
            <Icon size="lg" color="muted">
              <Globe size={48} />
            </Icon>
            <Text color="muted">No websites match your search</Text>
          </Column>
        )}
      </Column>
    </>
  );
}
