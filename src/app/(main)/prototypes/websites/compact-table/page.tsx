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
  StatusLight,
  TooltipTrigger,
  Tooltip,
} from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { Pager } from '@/components/common/Pager';
import { Empty } from '@/components/common/Empty';
import { LinkButton } from '@/components/common/LinkButton';
import { Eye, Settings, Plus, ExternalLink, Activity, TrendingUp, TrendingDown } from '@/components/icons';

// CSS for compact table styling
const compactTableStyles = `
  .compact-table-wrapper table {
    font-size: var(--font-size-1);
  }
  .compact-table-wrapper table th,
  .compact-table-wrapper table td {
    padding: 6px 8px;
    height: auto;
    line-height: 1.4;
  }
  .compact-table-wrapper table th {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--base-color-8);
    font-weight: 600;
  }
  .compact-table-wrapper table tbody tr {
    transition: background-color 0.15s ease;
  }
  .compact-table-wrapper table tbody tr:hover {
    background-color: var(--base-color-2);
  }
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
  .compact-table-wrapper table tbody tr {
    animation: fadeInRow 0.2s ease forwards;
  }
  .compact-table-wrapper table tbody tr:nth-child(1) { animation-delay: 0ms; }
  .compact-table-wrapper table tbody tr:nth-child(2) { animation-delay: 30ms; }
  .compact-table-wrapper table tbody tr:nth-child(3) { animation-delay: 60ms; }
  .compact-table-wrapper table tbody tr:nth-child(4) { animation-delay: 90ms; }
  .compact-table-wrapper table tbody tr:nth-child(5) { animation-delay: 120ms; }
  .compact-table-wrapper table tbody tr:nth-child(6) { animation-delay: 150ms; }
  .compact-table-wrapper table tbody tr:nth-child(7) { animation-delay: 180ms; }
  .compact-table-wrapper table tbody tr:nth-child(8) { animation-delay: 210ms; }
  .compact-table-wrapper table tbody tr:nth-child(9) { animation-delay: 240ms; }
  .compact-table-wrapper table tbody tr:nth-child(10) { animation-delay: 270ms; }
`;

// Realistic sample data for power users managing many websites
const sampleWebsites = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Corporate Portal',
    domain: 'portal.acmecorp.com',
    createdAt: new Date('2024-01-15T09:30:00Z'),
    status: 'active',
    visitors: 12847,
    pageviews: 45230,
    bounceRate: 32.4,
    trend: 'up',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'E-commerce Store',
    domain: 'shop.retailbrand.io',
    createdAt: new Date('2024-02-20T14:15:00Z'),
    status: 'active',
    visitors: 8932,
    pageviews: 28450,
    bounceRate: 45.1,
    trend: 'up',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Developer Docs',
    domain: 'docs.devplatform.dev',
    createdAt: new Date('2024-03-10T11:00:00Z'),
    status: 'active',
    visitors: 5621,
    pageviews: 18920,
    bounceRate: 28.7,
    trend: 'up',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Marketing Site',
    domain: 'marketing.growthco.com',
    createdAt: new Date('2024-04-05T16:45:00Z'),
    status: 'active',
    visitors: 3245,
    pageviews: 9870,
    bounceRate: 52.3,
    trend: 'down',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'SaaS Dashboard',
    domain: 'app.cloudmetrics.io',
    createdAt: new Date('2024-05-18T08:20:00Z'),
    status: 'active',
    visitors: 2178,
    pageviews: 15640,
    bounceRate: 18.2,
    trend: 'up',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Blog Platform',
    domain: 'blog.contentcreators.net',
    createdAt: new Date('2024-06-22T13:30:00Z'),
    status: 'inactive',
    visitors: 0,
    pageviews: 0,
    bounceRate: 0,
    trend: 'neutral',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Support Center',
    domain: 'help.servicedesk.com',
    createdAt: new Date('2024-07-14T10:10:00Z'),
    status: 'active',
    visitors: 1892,
    pageviews: 7230,
    bounceRate: 35.8,
    trend: 'up',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Landing Pages',
    domain: 'landing.campaignhub.io',
    createdAt: new Date('2024-08-03T15:55:00Z'),
    status: 'active',
    visitors: 4521,
    pageviews: 6780,
    bounceRate: 68.4,
    trend: 'down',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'API Gateway',
    domain: 'api.integrations.dev',
    createdAt: new Date('2024-09-11T07:40:00Z'),
    status: 'active',
    visitors: 892,
    pageviews: 2140,
    bounceRate: 12.1,
    trend: 'up',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Internal Wiki',
    domain: 'wiki.teamcollab.internal',
    createdAt: new Date('2024-10-25T12:25:00Z'),
    status: 'active',
    visitors: 567,
    pageviews: 3420,
    bounceRate: 22.5,
    trend: 'neutral',
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export default function CompactTablePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    if (!search) return sampleWebsites;
    const query = search.toLowerCase();
    return sampleWebsites.filter(
      site =>
        site.name.toLowerCase().includes(query) || site.domain.toLowerCase().includes(query),
    );
  }, [search]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <PageBody>
      <style dangerouslySetInnerHTML={{ __html: compactTableStyles }} />
      <Column gap="4">
        <PageHeader title="Websites" description="Manage and monitor all your tracked websites">
          <LinkButton href="/websites/add" variant="primary">
            <Icon size="sm">
              <Plus />
            </Icon>
            Add Website
          </LinkButton>
        </PageHeader>

        <Panel paddingY="4" paddingX="4">
          <Column gap="3">
            {/* Compact toolbar */}
            <Row alignItems="center" justifyContent="space-between" gap="3">
              <Row alignItems="center" gap="3">
                <SearchField
                  value={search}
                  onSearch={handleSearch}
                  placeholder="Search websites..."
                  delay={300}
                />
                <Text size="1" color="muted">
                  {filteredData.length} websites
                </Text>
              </Row>
              <Row alignItems="center" gap="2">
                <Text size="1" color="muted">
                  Quick stats:
                </Text>
                <Row alignItems="center" gap="1">
                  <StatusLight variant="success" />
                  <Text size="1">{sampleWebsites.filter(s => s.status === 'active').length} active</Text>
                </Row>
              </Row>
            </Row>

            {/* Compact data table */}
            {paginatedData.length > 0 ? (
              <div className="compact-table-wrapper">
              <DataTable data={paginatedData}>
                <DataColumn id="status" label="" width={40}>
                  {(row: (typeof sampleWebsites)[0]) => (
                    <TooltipTrigger delay={0}>
                      <Row alignItems="center" justifyContent="center">
                        <StatusLight variant={row.status === 'active' ? 'success' : 'muted'} />
                      </Row>
                      <Tooltip>{row.status === 'active' ? 'Active' : 'Inactive'}</Tooltip>
                    </TooltipTrigger>
                  )}
                </DataColumn>
                <DataColumn id="name" label="Website">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Row alignItems="center" gap="2">
                      <Favicon domain={row.domain} />
                      <Link
                        href={`/websites/${row.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Text size="1" weight="medium" style={{ color: 'var(--primary-color)' }}>
                          {row.name}
                        </Text>
                      </Link>
                    </Row>
                  )}
                </DataColumn>
                <DataColumn id="domain" label="Domain">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Row alignItems="center" gap="1">
                      <Text size="1" color="muted" truncate style={{ maxWidth: 180 }}>
                        {row.domain}
                      </Text>
                      <a
                        href={`https://${row.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Icon size="xs" color="muted">
                          <ExternalLink />
                        </Icon>
                      </a>
                    </Row>
                  )}
                </DataColumn>
                <DataColumn id="visitors" label="Visitors" align="end">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Row alignItems="center" justifyContent="flex-end" gap="1">
                      <Text size="1">{formatNumber(row.visitors)}</Text>
                      {row.trend === 'up' && (
                        <Icon size="xs" color="success">
                          <TrendingUp />
                        </Icon>
                      )}
                      {row.trend === 'down' && (
                        <Icon size="xs" color="error">
                          <TrendingDown />
                        </Icon>
                      )}
                    </Row>
                  )}
                </DataColumn>
                <DataColumn id="pageviews" label="Views" align="end">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Text size="1">{formatNumber(row.pageviews)}</Text>
                  )}
                </DataColumn>
                <DataColumn id="bounceRate" label="Bounce" align="end">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Text
                      size="1"
                      color={
                        row.bounceRate > 50 ? 'error' : row.bounceRate < 30 ? 'success' : undefined
                      }
                    >
                      {row.bounceRate > 0 ? `${row.bounceRate}%` : '-'}
                    </Text>
                  )}
                </DataColumn>
                <DataColumn id="createdAt" label="Created" align="end">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <TooltipTrigger delay={0}>
                      <Text size="1" color="muted">
                        {formatRelativeTime(row.createdAt)}
                      </Text>
                      <Tooltip>{row.createdAt.toLocaleDateString()}</Tooltip>
                    </TooltipTrigger>
                  )}
                </DataColumn>
                <DataColumn id="actions" label="" align="end" width={80}>
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Row alignItems="center" justifyContent="flex-end" gap="1">
                      <TooltipTrigger delay={0}>
                        <LinkButton
                          href={`/websites/${row.id}`}
                          variant="quiet"
                          size="sm"
                        >
                          <Icon size="sm">
                            <Eye />
                          </Icon>
                        </LinkButton>
                        <Tooltip>View Analytics</Tooltip>
                      </TooltipTrigger>
                      <TooltipTrigger delay={0}>
                        <LinkButton
                          href={`/websites/${row.id}/settings`}
                          variant="quiet"
                          size="sm"
                        >
                          <Icon size="sm">
                            <Settings />
                          </Icon>
                        </LinkButton>
                        <Tooltip>Settings</Tooltip>
                      </TooltipTrigger>
                    </Row>
                  )}
                </DataColumn>
              </DataTable>
              </div>
            ) : (
              <Empty message="No websites found matching your search" />
            )}

            {/* Pagination */}
            {filteredData.length > pageSize && (
              <Row marginTop="2">
                <Pager
                  page={page}
                  pageSize={pageSize}
                  count={filteredData.length}
                  onPageChange={setPage}
                />
              </Row>
            )}
          </Column>
        </Panel>

        {/* Compact summary footer */}
        <Row
          alignItems="center"
          justifyContent="space-between"
          paddingX="3"
          paddingY="2"
          style={{
            backgroundColor: 'var(--base-color-2)',
            borderRadius: 'var(--border-radius-2)',
          }}
        >
          <Row alignItems="center" gap="4">
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Activity />
              </Icon>
              <Text size="1" color="muted">
                Total Visitors:{' '}
                <Text as="span" size="1" weight="medium">
                  {formatNumber(sampleWebsites.reduce((sum, s) => sum + s.visitors, 0))}
                </Text>
              </Text>
            </Row>
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Eye />
              </Icon>
              <Text size="1" color="muted">
                Total Pageviews:{' '}
                <Text as="span" size="1" weight="medium">
                  {formatNumber(sampleWebsites.reduce((sum, s) => sum + s.pageviews, 0))}
                </Text>
              </Text>
            </Row>
          </Row>
          <Text size="1" color="muted">
            Last updated: just now
          </Text>
        </Row>
      </Column>
    </PageBody>
  );
}
