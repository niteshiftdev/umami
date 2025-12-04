'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  Icon,
  DataTable,
  DataColumn,
  SearchField,
  Button,
  Heading,
} from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { DateDistance } from '@/components/common/DateDistance';
import { Pager } from '@/components/common/Pager';
import {
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  ExternalLink,
  Globe,
} from '@/components/icons';

// Sample realistic website data for the prototype
const sampleWebsites = [
  {
    id: 'w1',
    name: 'Marketing Site',
    domain: 'marketing.acme.com',
    createdAt: new Date('2024-01-15T09:23:00'),
    teamName: 'Marketing',
    status: 'active',
    pageviews: 45230,
  },
  {
    id: 'w2',
    name: 'E-commerce Store',
    domain: 'shop.acme.com',
    createdAt: new Date('2024-02-20T14:45:00'),
    teamName: 'Product',
    status: 'active',
    pageviews: 128450,
  },
  {
    id: 'w3',
    name: 'Developer Blog',
    domain: 'blog.dev.io',
    createdAt: new Date('2024-03-10T11:30:00'),
    teamName: 'Engineering',
    status: 'active',
    pageviews: 23100,
  },
  {
    id: 'w4',
    name: 'Customer Portal',
    domain: 'portal.acme.com',
    createdAt: new Date('2024-04-05T16:15:00'),
    teamName: 'Support',
    status: 'paused',
    pageviews: 8920,
  },
  {
    id: 'w5',
    name: 'Documentation Hub',
    domain: 'docs.acme.com',
    createdAt: new Date('2024-05-18T08:00:00'),
    teamName: 'Engineering',
    status: 'active',
    pageviews: 67800,
  },
  {
    id: 'w6',
    name: 'Landing Pages',
    domain: 'landing.acme.com',
    createdAt: new Date('2024-06-22T13:20:00'),
    teamName: 'Marketing',
    status: 'active',
    pageviews: 34560,
  },
  {
    id: 'w7',
    name: 'Analytics Dashboard',
    domain: 'analytics.internal.io',
    createdAt: new Date('2024-07-30T10:45:00'),
    teamName: 'Data',
    status: 'active',
    pageviews: 12340,
  },
  {
    id: 'w8',
    name: 'Support Center',
    domain: 'support.acme.com',
    createdAt: new Date('2024-08-14T15:30:00'),
    teamName: 'Support',
    status: 'active',
    pageviews: 56780,
  },
  {
    id: 'w9',
    name: 'Partner Portal',
    domain: 'partners.acme.com',
    createdAt: new Date('2024-09-03T09:00:00'),
    teamName: 'Sales',
    status: 'paused',
    pageviews: 4320,
  },
  {
    id: 'w10',
    name: 'Career Site',
    domain: 'careers.acme.com',
    createdAt: new Date('2024-10-01T11:15:00'),
    teamName: 'HR',
    status: 'active',
    pageviews: 19870,
  },
  {
    id: 'w11',
    name: 'Investor Relations',
    domain: 'ir.acme.com',
    createdAt: new Date('2024-10-15T14:00:00'),
    teamName: 'Finance',
    status: 'active',
    pageviews: 7650,
  },
  {
    id: 'w12',
    name: 'Mobile App Landing',
    domain: 'app.acme.com',
    createdAt: new Date('2024-11-01T08:30:00'),
    teamName: 'Product',
    status: 'active',
    pageviews: 41230,
  },
];

type SortField = 'name' | 'domain' | 'createdAt' | 'teamName' | 'status' | 'pageviews';
type SortDirection = 'asc' | 'desc';

function StatusBadge({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <Row
      alignItems="center"
      gap="1"
      style={{
        display: 'inline-flex',
        padding: '2px 8px',
        borderRadius: 'var(--border-radius-2)',
        backgroundColor: isActive
          ? 'rgba(48, 164, 108, 0.1)'
          : 'rgba(247, 107, 21, 0.1)',
        color: isActive ? 'var(--color-success)' : 'var(--color-warning)',
        fontSize: 'var(--font-size-1)',
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: isActive ? 'var(--color-success)' : 'var(--color-warning)',
        }}
      />
      {status}
    </Row>
  );
}

function SortableHeader({
  label,
  field,
  currentSort,
  currentDirection,
  onSort,
}: {
  label: string;
  field: SortField;
  currentSort: SortField;
  currentDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentSort === field;

  return (
    <button
      onClick={() => onSort(field)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-1)',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: 'var(--font-size-1)',
        color: isActive ? 'var(--base-color-12)' : 'var(--base-color-9)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {label}
      <Icon size="xs" color={isActive ? undefined : 'muted'}>
        {isActive ? (
          currentDirection === 'asc' ? (
            <ArrowUp />
          ) : (
            <ArrowDown />
          )
        ) : (
          <ArrowUpDown />
        )}
      </Icon>
    </button>
  );
}

export default function DenseDataTablePage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...sampleWebsites];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        website =>
          website.name.toLowerCase().includes(searchLower) ||
          website.domain.toLowerCase().includes(searchLower) ||
          website.teamName.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    data.sort((a, b) => {
      let aVal: string | number | Date = a[sortField];
      let bVal: string | number | Date = b[sortField];

      if (sortField === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [search, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, page]);

  const totalCount = filteredAndSortedData.length;

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" icon={<Globe />}>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            Add website
          </Button>
        </PageHeader>

        <Panel>
          <Column gap="4">
            {/* Toolbar */}
            <Row alignItems="center" justifyContent="space-between" gap="4">
              <Row alignItems="center" gap="4">
                <SearchField
                  value={search}
                  onSearch={setSearch}
                  delay={300}
                  placeholder="Search websites..."
                />
                <Text size="1" color="muted">
                  {totalCount} website{totalCount !== 1 ? 's' : ''}
                </Text>
              </Row>
              <Row alignItems="center" gap="2">
                <Text size="1" color="muted">
                  Sorted by {sortField} ({sortDirection})
                </Text>
              </Row>
            </Row>

            {/* Dense Table */}
            <Column
              style={{
                border: '1px solid var(--base-color-4)',
                borderRadius: 'var(--border-radius-2)',
                overflow: 'hidden',
              }}
            >
              {/* Table Header */}
              <Row
                alignItems="center"
                gap="3"
                paddingY="2"
                paddingX="3"
                style={{
                  backgroundColor: 'var(--base-color-2)',
                  borderBottom: '1px solid var(--base-color-4)',
                }}
              >
                <div style={{ flex: '2', minWidth: 180 }}>
                  <SortableHeader
                    label="Name"
                    field="name"
                    currentSort={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                  />
                </div>
                <div style={{ flex: '2', minWidth: 150 }}>
                  <SortableHeader
                    label="Domain"
                    field="domain"
                    currentSort={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                  />
                </div>
                <div style={{ width: 100 }}>
                  <SortableHeader
                    label="Team"
                    field="teamName"
                    currentSort={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                  />
                </div>
                <div style={{ width: 100 }}>
                  <SortableHeader
                    label="Status"
                    field="status"
                    currentSort={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                  />
                </div>
                <div style={{ width: 120 }}>
                  <SortableHeader
                    label="Created"
                    field="createdAt"
                    currentSort={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                  />
                </div>
                <div style={{ width: 100, textAlign: 'right' }}>
                  <SortableHeader
                    label="Views"
                    field="pageviews"
                    currentSort={sortField}
                    currentDirection={sortDirection}
                    onSort={handleSort}
                  />
                </div>
                <div style={{ width: 80 }}>
                  <Text
                    size="1"
                    weight="semibold"
                    color="muted"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    Actions
                  </Text>
                </div>
              </Row>

              {/* Table Body */}
              {paginatedData.length === 0 ? (
                <Row
                  alignItems="center"
                  justifyContent="center"
                  paddingY="6"
                  style={{ color: 'var(--base-color-8)' }}
                >
                  <Text>No websites found matching your search.</Text>
                </Row>
              ) : (
                paginatedData.map((website, index) => (
                  <Row
                    key={website.id}
                    alignItems="center"
                    gap="3"
                    paddingY="2"
                    paddingX="3"
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? 'transparent' : 'var(--base-color-2)',
                      borderBottom:
                        index < paginatedData.length - 1
                          ? '1px solid var(--base-color-3)'
                          : 'none',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        'var(--base-color-3)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        index % 2 === 0 ? 'transparent' : 'var(--base-color-2)';
                    }}
                  >
                    {/* Name with Favicon */}
                    <div style={{ flex: '2', minWidth: 180 }}>
                      <Row alignItems="center" gap="2">
                        <Favicon domain={website.domain} />
                        <Link
                          href={`/websites/${website.id}`}
                          style={{
                            color: 'var(--primary-color)',
                            textDecoration: 'none',
                            fontWeight: 500,
                            fontSize: 'var(--font-size-2)',
                          }}
                        >
                          {website.name}
                        </Link>
                      </Row>
                    </div>

                    {/* Domain */}
                    <div style={{ flex: '2', minWidth: 150 }}>
                      <Row alignItems="center" gap="1">
                        <Text
                          size="2"
                          color="muted"
                          truncate
                          style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-1)' }}
                        >
                          {website.domain}
                        </Text>
                        <a
                          href={`https://${website.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--base-color-8)',
                            display: 'inline-flex',
                            opacity: 0.6,
                          }}
                        >
                          <Icon size="xs">
                            <ExternalLink />
                          </Icon>
                        </a>
                      </Row>
                    </div>

                    {/* Team */}
                    <div style={{ width: 100 }}>
                      <Text size="2" truncate>
                        {website.teamName}
                      </Text>
                    </div>

                    {/* Status */}
                    <div style={{ width: 100 }}>
                      <StatusBadge status={website.status} />
                    </div>

                    {/* Created */}
                    <div style={{ width: 120 }}>
                      <DateDistance date={website.createdAt} />
                    </div>

                    {/* Pageviews */}
                    <div style={{ width: 100, textAlign: 'right' }}>
                      <Text
                        size="2"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        {website.pageviews.toLocaleString()}
                      </Text>
                    </div>

                    {/* Actions */}
                    <div style={{ width: 80 }}>
                      <Row alignItems="center" gap="1">
                        <Link
                          href={`/websites/${website.id}`}
                          style={{ color: 'var(--base-color-10)' }}
                          title="View analytics"
                        >
                          <Button size="sm" variant="quiet">
                            <Icon size="sm">
                              <Eye />
                            </Icon>
                          </Button>
                        </Link>
                        <Link
                          href={`/websites/${website.id}/settings`}
                          style={{ color: 'var(--base-color-10)' }}
                          title="Edit settings"
                        >
                          <Button size="sm" variant="quiet">
                            <Icon size="sm">
                              <Settings />
                            </Icon>
                          </Button>
                        </Link>
                      </Row>
                    </div>
                  </Row>
                ))
              )}
            </Column>

            {/* Pagination */}
            {totalCount > pageSize && (
              <Row justifyContent="flex-end" marginTop="4">
                <Pager
                  page={page}
                  pageSize={pageSize}
                  count={totalCount}
                  onPageChange={setPage}
                />
              </Row>
            )}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
