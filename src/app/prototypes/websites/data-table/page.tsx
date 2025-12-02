'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  SearchField,
  DataTable,
  DataColumn,
  Icon,
  StatusLight,
} from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { ArrowUp, ArrowDown } from '@/components/icons';

// Types
interface WebsiteMetrics {
  id: string;
  name: string;
  domain: string;
  pageviews: number;
  sessions: number;
  bounceRate: number;
  status: 'active' | 'inactive';
  lastActivity: Date;
}

// Sample data with realistic website names and metrics
const sampleWebsites: WebsiteMetrics[] = [
  {
    id: '1',
    name: 'Acme Commerce',
    domain: 'acme-commerce.com',
    pageviews: 284521,
    sessions: 89234,
    bounceRate: 32.4,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
  },
  {
    id: '2',
    name: 'TechBlog Pro',
    domain: 'techblogpro.io',
    pageviews: 156892,
    sessions: 42156,
    bounceRate: 45.8,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 32), // 32 mins ago
  },
  {
    id: '3',
    name: 'Startup Landing',
    domain: 'startuphq.co',
    pageviews: 89234,
    sessions: 31245,
    bounceRate: 67.2,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: '4',
    name: 'Design Portfolio',
    domain: 'janedesigns.studio',
    pageviews: 45672,
    sessions: 18934,
    bounceRate: 28.1,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
  },
  {
    id: '5',
    name: 'SaaS Dashboard',
    domain: 'cloudmetrics.app',
    pageviews: 234567,
    sessions: 67891,
    bounceRate: 38.9,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: '6',
    name: 'E-Learning Hub',
    domain: 'learnfast.edu',
    pageviews: 178234,
    sessions: 52341,
    bounceRate: 52.3,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
  },
  {
    id: '7',
    name: 'Health Tracker',
    domain: 'healthylife.health',
    pageviews: 12345,
    sessions: 4521,
    bounceRate: 71.5,
    status: 'inactive',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  },
  {
    id: '8',
    name: 'News Aggregator',
    domain: 'dailypulse.news',
    pageviews: 567234,
    sessions: 198234,
    bounceRate: 41.2,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
  },
  {
    id: '9',
    name: 'Recipe Collection',
    domain: 'tastykitchen.recipes',
    pageviews: 98234,
    sessions: 34521,
    bounceRate: 35.7,
    status: 'active',
    lastActivity: new Date(Date.now() - 1000 * 60 * 90), // 90 mins ago
  },
  {
    id: '10',
    name: 'Travel Guides',
    domain: 'wanderlust.travel',
    pageviews: 5234,
    sessions: 1823,
    bounceRate: 82.1,
    status: 'inactive',
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
  },
];

// Format number with K/M suffix
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Get relative time string
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

// Get bounce rate color style
function getBounceRateStyle(rate: number): React.CSSProperties {
  if (rate < 40) {
    return { color: 'var(--success-color)' };
  }
  if (rate < 60) {
    return { color: 'var(--warning-color, #f76b15)' };
  }
  return { color: 'var(--danger-color)' };
}

// Sort direction type
type SortDirection = 'asc' | 'desc' | null;
type SortField = 'name' | 'domain' | 'pageviews' | 'sessions' | 'bounceRate' | 'status' | 'lastActivity';

// Sort indicator component
function SortIndicator({ direction }: { direction: SortDirection }) {
  if (!direction) return null;
  return (
    <Icon size="xs" style={{ marginLeft: 4 }}>
      {direction === 'asc' ? <ArrowUp /> : <ArrowDown />}
    </Icon>
  );
}

// Status badge component
function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <StatusLight variant={status === 'active' ? 'active' : 'inactive'}>
      <Text size="2" style={{ textTransform: 'capitalize' }}>
        {status}
      </Text>
    </StatusLight>
  );
}

// Summary row component
function SummaryRow({ data }: { data: WebsiteMetrics[] }) {
  const totals = useMemo(() => {
    const totalPageviews = data.reduce((sum, w) => sum + w.pageviews, 0);
    const totalSessions = data.reduce((sum, w) => sum + w.sessions, 0);
    const avgBounceRate = data.reduce((sum, w) => sum + w.bounceRate, 0) / data.length;
    const activeCount = data.filter(w => w.status === 'active').length;
    return { totalPageviews, totalSessions, avgBounceRate, activeCount };
  }, [data]);

  return (
    <Row
      paddingY="4"
      paddingX="4"
      style={{
        borderTop: '2px solid var(--base-color-6)',
        backgroundColor: 'var(--base-color-3)',
        marginTop: 'var(--spacing-2)',
      }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Text size="2" weight="semi-bold" style={{ minWidth: 200 }}>
        Total ({data.length} websites)
      </Text>
      <Row gap="6" style={{ flex: 1 }} justifyContent="flex-end">
        <Column alignItems="flex-end" style={{ minWidth: 100 }}>
          <Text size="1" color="muted">Pageviews</Text>
          <Text size="2" weight="semi-bold">{formatNumber(totals.totalPageviews)}</Text>
        </Column>
        <Column alignItems="flex-end" style={{ minWidth: 100 }}>
          <Text size="1" color="muted">Sessions</Text>
          <Text size="2" weight="semi-bold">{formatNumber(totals.totalSessions)}</Text>
        </Column>
        <Column alignItems="flex-end" style={{ minWidth: 100 }}>
          <Text size="1" color="muted">Avg Bounce</Text>
          <Text size="2" weight="semi-bold" style={getBounceRateStyle(totals.avgBounceRate)}>
            {totals.avgBounceRate.toFixed(1)}%
          </Text>
        </Column>
        <Column alignItems="flex-end" style={{ minWidth: 80 }}>
          <Text size="1" color="muted">Active</Text>
          <Text size="2" weight="semi-bold">{totals.activeCount}/{data.length}</Text>
        </Column>
      </Row>
    </Row>
  );
}

export default function DataTablePage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('pageviews');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...sampleWebsites];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        w =>
          w.name.toLowerCase().includes(searchLower) ||
          w.domain.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    if (sortField && sortDirection) {
      result.sort((a, b) => {
        let aVal: string | number | Date = a[sortField];
        let bVal: string | number | Date = b[sortField];

        if (sortField === 'lastActivity') {
          aVal = (aVal as Date).getTime();
          bVal = (bVal as Date).getTime();
        }

        if (typeof aVal === 'string') {
          return sortDirection === 'asc'
            ? aVal.localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal);
        }

        return sortDirection === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number);
      });
    }

    return result;
  }, [search, sortField, sortDirection]);

  // Handle column header click for sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sortable header component
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Row
      alignItems="center"
      style={{ cursor: 'pointer', userSelect: 'none' }}
      onClick={() => handleSort(field)}
    >
      <Text size="2" weight="medium">{children}</Text>
      <SortIndicator direction={sortField === field ? sortDirection : null} />
    </Row>
  );

  return (
    <PageBody maxWidth="1600px">
      <Column gap="6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <PageHeader title="Websites" description="Monitor all your tracked websites in one place">
          <Row gap="3">
            <SearchField
              value={search}
              onSearch={setSearch}
              placeholder="Search websites..."
              delay={300}
            />
          </Row>
        </PageHeader>

        <Panel style={{ overflow: 'hidden' }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(8px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes rowFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .data-table-row {
              animation: rowFadeIn 0.2s ease-out;
              animation-fill-mode: both;
            }
            .data-table-row:nth-child(1) { animation-delay: 0.05s; }
            .data-table-row:nth-child(2) { animation-delay: 0.08s; }
            .data-table-row:nth-child(3) { animation-delay: 0.11s; }
            .data-table-row:nth-child(4) { animation-delay: 0.14s; }
            .data-table-row:nth-child(5) { animation-delay: 0.17s; }
            .data-table-row:nth-child(6) { animation-delay: 0.20s; }
            .data-table-row:nth-child(7) { animation-delay: 0.23s; }
            .data-table-row:nth-child(8) { animation-delay: 0.26s; }
            .data-table-row:nth-child(9) { animation-delay: 0.29s; }
            .data-table-row:nth-child(10) { animation-delay: 0.32s; }
            .hover-row {
              transition: background-color 0.15s ease;
            }
            .hover-row:hover {
              background-color: var(--base-color-3);
            }
          `}</style>

          <DataTable data={filteredData}>
            <DataColumn
              id="name"
              label={<SortableHeader field="name">Website</SortableHeader>}
            >
              {(row: WebsiteMetrics) => (
                <Row alignItems="center" gap="3" className="data-table-row hover-row" style={{ padding: '4px 0' }}>
                  <Favicon domain={row.domain} />
                  <Link
                    href={`/websites/${row.id}`}
                    style={{
                      color: 'var(--font-color)',
                      fontWeight: 500,
                      textDecoration: 'none',
                    }}
                  >
                    {row.name}
                  </Link>
                </Row>
              )}
            </DataColumn>

            <DataColumn
              id="domain"
              label={<SortableHeader field="domain">Domain</SortableHeader>}
            >
              {(row: WebsiteMetrics) => (
                <Text size="2" color="muted" className="data-table-row">
                  {row.domain}
                </Text>
              )}
            </DataColumn>

            <DataColumn
              id="pageviews"
              label={<SortableHeader field="pageviews">Pageviews</SortableHeader>}
              align="end"
            >
              {(row: WebsiteMetrics) => (
                <Text size="2" weight="medium" className="data-table-row" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatNumber(row.pageviews)}
                </Text>
              )}
            </DataColumn>

            <DataColumn
              id="sessions"
              label={<SortableHeader field="sessions">Sessions</SortableHeader>}
              align="end"
            >
              {(row: WebsiteMetrics) => (
                <Text size="2" weight="medium" className="data-table-row" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {formatNumber(row.sessions)}
                </Text>
              )}
            </DataColumn>

            <DataColumn
              id="bounceRate"
              label={<SortableHeader field="bounceRate">Bounce Rate</SortableHeader>}
              align="end"
            >
              {(row: WebsiteMetrics) => (
                <Row alignItems="center" justifyContent="flex-end" gap="2" className="data-table-row">
                  <div
                    style={{
                      width: 50,
                      height: 4,
                      backgroundColor: 'var(--base-color-4)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(row.bounceRate, 100)}%`,
                        height: '100%',
                        backgroundColor:
                          row.bounceRate < 40
                            ? 'var(--success-color)'
                            : row.bounceRate < 60
                            ? 'var(--warning-color, #f76b15)'
                            : 'var(--danger-color)',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <Text
                    size="2"
                    weight="medium"
                    style={{
                      ...getBounceRateStyle(row.bounceRate),
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: 45,
                      textAlign: 'right',
                    }}
                  >
                    {row.bounceRate.toFixed(1)}%
                  </Text>
                </Row>
              )}
            </DataColumn>

            <DataColumn
              id="status"
              label={<SortableHeader field="status">Status</SortableHeader>}
              align="center"
            >
              {(row: WebsiteMetrics) => (
                <div className="data-table-row">
                  <StatusBadge status={row.status} />
                </div>
              )}
            </DataColumn>

            <DataColumn
              id="lastActivity"
              label={<SortableHeader field="lastActivity">Last Activity</SortableHeader>}
              align="end"
            >
              {(row: WebsiteMetrics) => (
                <Text size="2" color="muted" className="data-table-row" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {getRelativeTime(row.lastActivity)}
                </Text>
              )}
            </DataColumn>
          </DataTable>

          <SummaryRow data={filteredData} />
        </Panel>
      </Column>
    </PageBody>
  );
}
