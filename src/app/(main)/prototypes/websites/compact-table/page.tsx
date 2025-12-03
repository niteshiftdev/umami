'use client';

import { useState, useMemo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Column,
  Row,
  Button,
  Icon,
  Text,
  Heading,
  SearchField,
  Checkbox,
  DataTable,
  DataColumn,
  Loading,
} from '@umami/react-zen';
import { PageBody, PageHeader, Panel, Favicon, EmptyPlaceholder, Pager } from '@/components/common';
import {
  SquarePen,
  Eye,
  Plus,
  Trash2,
  ExternalLink,
  Globe,
  Users,
  Check,
} from 'lucide-react';

// Sample data for the prototype - realistic website entries
const SAMPLE_WEBSITES = [
  {
    id: 'w1',
    name: 'Acme Corp Marketing',
    domain: 'marketing.acme.com',
    teamName: 'Marketing Team',
    owner: 'Sarah Chen',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 45200,
  },
  {
    id: 'w2',
    name: 'Developer Portal',
    domain: 'developers.acme.com',
    teamName: 'Engineering',
    owner: 'Marcus Johnson',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 128750,
  },
  {
    id: 'w3',
    name: 'E-commerce Store',
    domain: 'shop.acme.com',
    teamName: 'Sales',
    owner: 'Emily Rodriguez',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 892340,
  },
  {
    id: 'w4',
    name: 'Support Center',
    domain: 'support.acme.com',
    teamName: 'Customer Success',
    owner: 'David Park',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 234100,
  },
  {
    id: 'w5',
    name: 'Blog Platform',
    domain: 'blog.acme.com',
    teamName: 'Content',
    owner: 'Lisa Thompson',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 567800,
  },
  {
    id: 'w6',
    name: 'Internal Dashboard',
    domain: 'dash.acme.internal',
    teamName: 'Engineering',
    owner: 'Alex Kim',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 12450,
  },
  {
    id: 'w7',
    name: 'Partner Portal',
    domain: 'partners.acme.com',
    teamName: 'Business Dev',
    owner: 'Rachel Green',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 34200,
  },
  {
    id: 'w8',
    name: 'Careers Site',
    domain: 'careers.acme.com',
    teamName: 'HR',
    owner: 'Tom Wilson',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 78900,
  },
  {
    id: 'w9',
    name: 'Product Documentation',
    domain: 'docs.acme.com',
    teamName: 'Engineering',
    owner: 'Nina Patel',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 456700,
  },
  {
    id: 'w10',
    name: 'Landing Pages',
    domain: 'go.acme.com',
    teamName: 'Marketing Team',
    owner: 'Chris Martinez',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 89200,
  },
  {
    id: 'w11',
    name: 'API Gateway',
    domain: 'api.acme.com',
    teamName: 'Engineering',
    owner: 'Jordan Lee',
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 2340000,
  },
  {
    id: 'w12',
    name: 'Community Forum',
    domain: 'community.acme.com',
    teamName: 'Customer Success',
    owner: 'Amy Foster',
    createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    pageviews: 345600,
  },
];

// Compact table styles
const compactStyles = {
  tableRow: {
    height: '36px',
  },
  cell: {
    padding: '4px 8px',
    fontSize: 'var(--font-size-2)',
  },
  headerCell: {
    padding: '6px 8px',
    fontSize: 'var(--font-size-1)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontWeight: 600,
  },
  checkboxCell: {
    width: '32px',
    padding: '4px 8px',
  },
  actionButton: {
    padding: '2px 4px',
    minWidth: '24px',
    height: '24px',
  },
  faviconSize: {
    width: '14px',
    height: '14px',
  },
};

// Animation keyframes
const fadeInKeyframes = `
@keyframes fadeInRow {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default function CompactTablePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  // Filter websites based on search
  const filteredWebsites = useMemo(() => {
    if (!search) return SAMPLE_WEBSITES;
    const lower = search.toLowerCase();
    return SAMPLE_WEBSITES.filter(
      (w) =>
        w.name.toLowerCase().includes(lower) ||
        w.domain.toLowerCase().includes(lower) ||
        w.teamName.toLowerCase().includes(lower) ||
        w.owner.toLowerCase().includes(lower)
    );
  }, [search]);

  // Paginate
  const paginatedWebsites = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredWebsites.slice(start, start + pageSize);
  }, [filteredWebsites, page]);

  const totalCount = filteredWebsites.length;
  const allSelected = paginatedWebsites.length > 0 && paginatedWebsites.every((w) => selectedIds.has(w.id));
  const someSelected = paginatedWebsites.some((w) => selectedIds.has(w.id)) && !allSelected;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedWebsites.map((w) => w.id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <PageBody>
      <style>{fadeInKeyframes}</style>
      <Column gap="4" margin="2">
        <PageHeader title="Websites">
          <Row gap="2">
            {selectedIds.size > 0 && (
              <Button variant="danger" size="sm">
                <Icon size="sm">
                  <Trash2 />
                </Icon>
                Delete ({selectedIds.size})
              </Button>
            )}
            <Button variant="primary" size="sm">
              <Icon size="sm">
                <Plus />
              </Icon>
              Add Website
            </Button>
          </Row>
        </PageHeader>

        <Panel style={{ padding: 'var(--spacing-3)' }}>
          <Column gap="3">
            {/* Toolbar */}
            <Row alignItems="center" justifyContent="space-between" gap="3">
              <Row alignItems="center" gap="3">
                <SearchField
                  value={search}
                  onSearch={handleSearch}
                  placeholder="Search websites..."
                  delay={300}
                />
                <Text size="2" color="muted">
                  {totalCount} website{totalCount !== 1 ? 's' : ''}
                </Text>
              </Row>
              <Row alignItems="center" gap="2">
                <Text size="1" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Columns:
                </Text>
                <Button variant="quiet" size="sm">
                  All
                </Button>
              </Row>
            </Row>

            {/* Compact Table */}
            {isLoading ? (
              <Column minHeight="300px" alignItems="center" justifyContent="center">
                <Loading icon="dots" />
              </Column>
            ) : paginatedWebsites.length === 0 ? (
              <EmptyPlaceholder
                icon={<Globe />}
                title="No websites found"
                description={search ? 'Try adjusting your search terms' : 'Add your first website to get started'}
              />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: 'var(--font-size-2)',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1px solid var(--base-color-4)',
                        backgroundColor: 'var(--base-color-2)',
                      }}
                    >
                      <th style={{ ...compactStyles.headerCell, ...compactStyles.checkboxCell, textAlign: 'center' }}>
                        <Checkbox
                          isSelected={allSelected}
                          isIndeterminate={someSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'left', width: '24px' }}></th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'left', minWidth: '160px' }}>Name</th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'left', minWidth: '180px' }}>Domain</th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'left', minWidth: '120px' }}>Team</th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'left', minWidth: '120px' }}>Owner</th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'right', minWidth: '80px' }}>Views</th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'left', minWidth: '100px' }}>Created</th>
                      <th style={{ ...compactStyles.headerCell, textAlign: 'right', minWidth: '90px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWebsites.map((website, index) => (
                      <tr
                        key={website.id}
                        style={{
                          borderBottom: '1px solid var(--base-color-3)',
                          height: compactStyles.tableRow.height,
                          transition: 'background-color 150ms ease',
                          animation: `fadeInRow 200ms ease ${index * 30}ms both`,
                          backgroundColor: selectedIds.has(website.id)
                            ? 'var(--base-color-3)'
                            : 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          if (!selectedIds.has(website.id)) {
                            e.currentTarget.style.backgroundColor = 'var(--base-color-2)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selectedIds.has(website.id)) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <td style={{ ...compactStyles.cell, ...compactStyles.checkboxCell, textAlign: 'center' }}>
                          <Checkbox
                            isSelected={selectedIds.has(website.id)}
                            onChange={() => handleSelectRow(website.id)}
                          />
                        </td>
                        <td style={{ ...compactStyles.cell, width: '24px' }}>
                          <Favicon domain={website.domain} style={compactStyles.faviconSize} />
                        </td>
                        <td style={{ ...compactStyles.cell }}>
                          <Text size="2" weight="medium" truncate style={{ maxWidth: '160px' }}>
                            {website.name}
                          </Text>
                        </td>
                        <td style={{ ...compactStyles.cell }}>
                          <Row alignItems="center" gap="1">
                            <Text size="2" color="muted" truncate style={{ maxWidth: '150px' }}>
                              {website.domain}
                            </Text>
                            <a
                              href={`https://${website.domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                color: 'var(--base-color-8)',
                                transition: 'color 150ms ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--primary-color)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--base-color-8)';
                              }}
                            >
                              <ExternalLink size={12} />
                            </a>
                          </Row>
                        </td>
                        <td style={{ ...compactStyles.cell }}>
                          <Row alignItems="center" gap="1">
                            <Icon size="xs" color="muted">
                              <Users size={10} />
                            </Icon>
                            <Text size="2" color="muted" truncate style={{ maxWidth: '100px' }}>
                              {website.teamName}
                            </Text>
                          </Row>
                        </td>
                        <td style={{ ...compactStyles.cell }}>
                          <Text size="2" color="muted" truncate style={{ maxWidth: '100px' }}>
                            {website.owner}
                          </Text>
                        </td>
                        <td style={{ ...compactStyles.cell, textAlign: 'right' }}>
                          <Text size="2" color="muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            {formatNumber(website.pageviews)}
                          </Text>
                        </td>
                        <td style={{ ...compactStyles.cell }}>
                          <Text size="1" color="muted">
                            {formatDistanceToNow(new Date(website.createdAt), { addSuffix: true })}
                          </Text>
                        </td>
                        <td style={{ ...compactStyles.cell, textAlign: 'right' }}>
                          <Row gap="0" justifyContent="flex-end">
                            <Button
                              variant="quiet"
                              size="xs"
                              style={compactStyles.actionButton}
                              onPress={() => {}}
                            >
                              <Icon size="xs">
                                <Eye size={14} />
                              </Icon>
                            </Button>
                            <Button
                              variant="quiet"
                              size="xs"
                              style={compactStyles.actionButton}
                              onPress={() => {}}
                            >
                              <Icon size="xs">
                                <SquarePen size={14} />
                              </Icon>
                            </Button>
                            <Button
                              variant="quiet"
                              size="xs"
                              style={compactStyles.actionButton}
                              onPress={() => {}}
                            >
                              <Icon size="xs" color="muted">
                                <Trash2 size={14} />
                              </Icon>
                            </Button>
                          </Row>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalCount > pageSize && (
              <Row marginTop="3" justifyContent="space-between" alignItems="center">
                <Text size="2" color="muted">
                  Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount}
                </Text>
                <Pager
                  page={page}
                  pageSize={pageSize}
                  count={totalCount}
                  onPageChange={handlePageChange}
                />
              </Row>
            )}
          </Column>
        </Panel>

        {/* Keyboard shortcuts hint */}
        <Row justifyContent="center" paddingY="2">
          <Text size="1" color="muted">
            Tip: Use <kbd style={{
              padding: '1px 4px',
              backgroundColor: 'var(--base-color-3)',
              borderRadius: 'var(--border-radius-1)',
              fontSize: 'var(--font-size-1)',
              fontFamily: 'monospace',
            }}>Shift</kbd> + Click to select multiple rows
          </Text>
        </Row>
      </Column>
    </PageBody>
  );
}
