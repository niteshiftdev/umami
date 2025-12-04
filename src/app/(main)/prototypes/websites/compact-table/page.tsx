'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Column, Row, Text, SearchField, Button, Icon, Checkbox } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { Pager } from '@/components/common/Pager';
import { Empty } from '@/components/common/Empty';
import { LinkButton } from '@/components/common/LinkButton';
import { SquarePen, Trash2, ExternalLink, MoreHorizontal, ChevronDown, ChevronUp } from '@/components/icons';
import { formatDistanceToNow, format } from 'date-fns';

// Mock data for the prototype - realistic website analytics data
const mockWebsites = [
  {
    id: 'ws-001',
    name: 'Acme Corp',
    domain: 'acme-corp.com',
    createdAt: new Date('2024-03-15T09:30:00'),
    updatedAt: new Date('2024-12-03T14:22:00'),
    visitors: 14523,
    pageviews: 89234,
    status: 'active',
  },
  {
    id: 'ws-002',
    name: 'TechStartup Blog',
    domain: 'blog.techstartup.io',
    createdAt: new Date('2024-06-22T11:45:00'),
    updatedAt: new Date('2024-12-04T08:15:00'),
    visitors: 8901,
    pageviews: 32156,
    status: 'active',
  },
  {
    id: 'ws-003',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    createdAt: new Date('2024-01-08T16:20:00'),
    updatedAt: new Date('2024-12-02T19:45:00'),
    visitors: 45678,
    pageviews: 234567,
    status: 'active',
  },
  {
    id: 'ws-004',
    name: 'Marketing Landing',
    domain: 'landing.marketpro.net',
    createdAt: new Date('2024-09-10T08:00:00'),
    updatedAt: new Date('2024-11-28T12:30:00'),
    visitors: 2341,
    pageviews: 5678,
    status: 'paused',
  },
  {
    id: 'ws-005',
    name: 'Developer Docs',
    domain: 'docs.devtools.dev',
    createdAt: new Date('2024-02-28T14:15:00'),
    updatedAt: new Date('2024-12-04T10:00:00'),
    visitors: 67890,
    pageviews: 189234,
    status: 'active',
  },
  {
    id: 'ws-006',
    name: 'Portfolio Site',
    domain: 'johnsmith.design',
    createdAt: new Date('2024-07-19T10:30:00'),
    updatedAt: new Date('2024-11-15T16:45:00'),
    visitors: 1234,
    pageviews: 4567,
    status: 'active',
  },
  {
    id: 'ws-007',
    name: 'SaaS Dashboard',
    domain: 'app.cloudsaas.com',
    createdAt: new Date('2024-04-05T09:00:00'),
    updatedAt: new Date('2024-12-03T22:10:00'),
    visitors: 34521,
    pageviews: 156789,
    status: 'active',
  },
  {
    id: 'ws-008',
    name: 'News Portal',
    domain: 'dailynews.press',
    createdAt: new Date('2023-11-20T13:00:00'),
    updatedAt: new Date('2024-12-04T06:30:00'),
    visitors: 123456,
    pageviews: 567890,
    status: 'active',
  },
  {
    id: 'ws-009',
    name: 'Support Center',
    domain: 'help.supportpro.io',
    createdAt: new Date('2024-08-14T11:20:00'),
    updatedAt: new Date('2024-11-30T09:15:00'),
    visitors: 5678,
    pageviews: 23456,
    status: 'paused',
  },
  {
    id: 'ws-010',
    name: 'Community Forum',
    domain: 'community.devhub.org',
    createdAt: new Date('2024-05-30T15:45:00'),
    updatedAt: new Date('2024-12-01T20:00:00'),
    visitors: 28934,
    pageviews: 145678,
    status: 'active',
  },
  {
    id: 'ws-011',
    name: 'API Gateway',
    domain: 'api.cloudservices.net',
    createdAt: new Date('2024-10-12T08:30:00'),
    updatedAt: new Date('2024-12-03T11:45:00'),
    visitors: 890,
    pageviews: 3456,
    status: 'active',
  },
  {
    id: 'ws-012',
    name: 'Analytics Demo',
    domain: 'demo.analytics.io',
    createdAt: new Date('2024-11-01T10:00:00'),
    updatedAt: new Date('2024-11-25T14:30:00'),
    visitors: 456,
    pageviews: 1234,
    status: 'paused',
  },
];

type SortField = 'name' | 'domain' | 'createdAt' | 'updatedAt' | 'visitors';
type SortDirection = 'asc' | 'desc';

export default function CompactTablePage() {
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const pageSize = 10;

  // Filter and sort websites
  const filteredWebsites = useMemo(() => {
    let result = mockWebsites.filter(
      website =>
        website.name.toLowerCase().includes(search.toLowerCase()) ||
        website.domain.toLowerCase().includes(search.toLowerCase()),
    );

    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    });

    return result;
  }, [search, sortField, sortDirection]);

  const paginatedWebsites = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredWebsites.slice(start, start + pageSize);
  }, [filteredWebsites, page]);

  const allSelected = paginatedWebsites.length > 0 && paginatedWebsites.every(w => selectedIds.has(w.id));
  const someSelected = paginatedWebsites.some(w => selectedIds.has(w.id)) && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedWebsites.map(w => w.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <Icon size="xs" style={{ marginLeft: 2 }}>
        {sortDirection === 'asc' ? <ChevronUp /> : <ChevronDown />}
      </Icon>
    );
  };

  return (
    <PageBody>
      <Column gap="4" style={{ animationName: 'fadeIn', animationDuration: '300ms', animationFillMode: 'both' }}>
        <PageHeader title="Websites" description="Manage and monitor all your tracked websites">
          <LinkButton href="/websites/add" variant="primary">
            Add website
          </LinkButton>
        </PageHeader>

        <Panel paddingY="4" paddingX="4">
          <Column gap="3">
            {/* Toolbar */}
            <Row alignItems="center" justifyContent="space-between" gap="3">
              <Row alignItems="center" gap="3">
                <SearchField
                  value={search}
                  onSearch={handleSearch}
                  delay={300}
                  placeholder="Search websites..."
                  style={{ width: 220 }}
                />
                {selectedIds.size > 0 && (
                  <Row
                    alignItems="center"
                    gap="2"
                    style={{
                      animationName: 'fadeIn',
                      animationDuration: '150ms',
                      animationFillMode: 'both',
                    }}
                  >
                    <Text size="1" color="muted">
                      {selectedIds.size} selected
                    </Text>
                    <Button size="sm" variant="quiet">
                      <Icon size="sm">
                        <Trash2 />
                      </Icon>
                    </Button>
                  </Row>
                )}
              </Row>
              <Text size="1" color="muted">
                {filteredWebsites.length} websites
              </Text>
            </Row>

            {/* Table */}
            {filteredWebsites.length === 0 ? (
              <Empty message="No websites found" />
            ) : (
              <div
                style={{
                  overflowX: 'auto',
                  animationName: 'fadeIn',
                  animationDuration: '200ms',
                  animationDelay: '100ms',
                  animationFillMode: 'both',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 'var(--font-size-2)',
                    lineHeight: 1.4,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--base-6)',
                      }}
                    >
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'left',
                          width: 32,
                        }}
                      >
                        <Checkbox
                          isSelected={allSelected}
                          isIndeterminate={someSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'left',
                          fontWeight: 500,
                          color: 'var(--base-11)',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                        onClick={() => handleSort('name')}
                      >
                        <Row alignItems="center" gap="1">
                          Name
                          <SortIcon field="name" />
                        </Row>
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'left',
                          fontWeight: 500,
                          color: 'var(--base-11)',
                          cursor: 'pointer',
                          userSelect: 'none',
                        }}
                        onClick={() => handleSort('domain')}
                      >
                        <Row alignItems="center" gap="1">
                          Domain
                          <SortIcon field="domain" />
                        </Row>
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'right',
                          fontWeight: 500,
                          color: 'var(--base-11)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('visitors')}
                      >
                        <Row alignItems="center" justifyContent="flex-end" gap="1">
                          Visitors
                          <SortIcon field="visitors" />
                        </Row>
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'left',
                          fontWeight: 500,
                          color: 'var(--base-11)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('createdAt')}
                      >
                        <Row alignItems="center" gap="1">
                          Created
                          <SortIcon field="createdAt" />
                        </Row>
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'left',
                          fontWeight: 500,
                          color: 'var(--base-11)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          whiteSpace: 'nowrap',
                        }}
                        onClick={() => handleSort('updatedAt')}
                      >
                        <Row alignItems="center" gap="1">
                          Updated
                          <SortIcon field="updatedAt" />
                        </Row>
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'center',
                          fontWeight: 500,
                          color: 'var(--base-11)',
                          width: 60,
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: '6px 8px',
                          textAlign: 'right',
                          fontWeight: 500,
                          color: 'var(--base-11)',
                          width: 80,
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWebsites.map((website, index) => (
                      <tr
                        key={website.id}
                        style={{
                          borderBottom: '1px solid var(--base-4)',
                          transition: 'background-color 150ms ease',
                          backgroundColor: selectedIds.has(website.id)
                            ? 'var(--base-3)'
                            : 'transparent',
                          animationName: 'fadeIn',
                          animationDuration: '200ms',
                          animationDelay: `${50 + index * 25}ms`,
                          animationFillMode: 'both',
                        }}
                        onMouseEnter={e => {
                          if (!selectedIds.has(website.id)) {
                            e.currentTarget.style.backgroundColor = 'var(--base-2)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!selectedIds.has(website.id)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <td style={{ padding: '6px 8px' }}>
                          <Checkbox
                            isSelected={selectedIds.has(website.id)}
                            onChange={() => handleSelectOne(website.id)}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <Row alignItems="center" gap="2">
                            <Favicon domain={website.domain} />
                            <Link
                              href={`/websites/${website.id}`}
                              style={{
                                color: 'var(--base-12)',
                                textDecoration: 'none',
                                fontWeight: 500,
                              }}
                            >
                              {website.name}
                            </Link>
                          </Row>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <Text size="2" color="muted" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                            {website.domain}
                          </Text>
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                          <Text size="2" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                            {website.visitors.toLocaleString()}
                          </Text>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <Text
                            size="1"
                            color="muted"
                            title={format(website.createdAt, 'PPpp')}
                          >
                            {format(website.createdAt, 'MMM d, yyyy')}
                          </Text>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <Text
                            size="1"
                            color="muted"
                            title={format(website.updatedAt, 'PPpp')}
                          >
                            {formatDistanceToNow(website.updatedAt, { addSuffix: true })}
                          </Text>
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor:
                                website.status === 'active'
                                  ? 'var(--color-success)'
                                  : 'var(--base-8)',
                            }}
                            title={website.status === 'active' ? 'Active' : 'Paused'}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <Row alignItems="center" justifyContent="flex-end" gap="1">
                            <LinkButton
                              href={`/websites/${website.id}`}
                              variant="quiet"
                              size="sm"
                            >
                              <Icon size="sm">
                                <ExternalLink />
                              </Icon>
                            </LinkButton>
                            <LinkButton
                              href={`/websites/${website.id}/settings`}
                              variant="quiet"
                              size="sm"
                            >
                              <Icon size="sm">
                                <SquarePen />
                              </Icon>
                            </LinkButton>
                          </Row>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {filteredWebsites.length > pageSize && (
              <Row marginTop="2">
                <Pager
                  page={page}
                  pageSize={pageSize}
                  count={filteredWebsites.length}
                  onPageChange={setPage}
                />
              </Row>
            )}
          </Column>
        </Panel>

        {/* Keyboard shortcuts hint */}
        <Row justifyContent="center">
          <Text size="1" color="muted">
            Tip: Click column headers to sort
          </Text>
        </Row>
      </Column>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </PageBody>
  );
}
