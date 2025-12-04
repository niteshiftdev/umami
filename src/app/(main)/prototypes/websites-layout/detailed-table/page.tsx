'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  SearchField,
  Text,
  DataTable,
  DataColumn,
  Icon,
  Button,
} from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { Pager } from '@/components/common/Pager';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Empty } from '@/components/common/Empty';
import { DateDistance } from '@/components/common/DateDistance';
import { useMessages, useNavigation } from '@/components/hooks';
import { Eye, SquarePen, ExternalLink, Globe, Activity } from '@/components/icons';

// Realistic sample data for the prototype
const SAMPLE_WEBSITES = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Marketing Site',
    domain: 'marketing.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 180).toISOString(),
    status: 'active',
    lastActive: new Date(Date.now() - 3600000 * 2).toISOString(),
    pageviews: 847293,
    visitors: 124589,
    bounceRate: 42.3,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    name: 'Developer Documentation',
    domain: 'docs.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 365).toISOString(),
    status: 'active',
    lastActive: new Date(Date.now() - 60000 * 15).toISOString(),
    pageviews: 1254678,
    visitors: 89234,
    bounceRate: 28.7,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    name: 'E-commerce Store',
    domain: 'shop.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    status: 'active',
    lastActive: new Date(Date.now() - 60000 * 5).toISOString(),
    pageviews: 2156789,
    visitors: 456123,
    bounceRate: 35.1,
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    name: 'Company Blog',
    domain: 'blog.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 420).toISOString(),
    status: 'active',
    lastActive: new Date(Date.now() - 3600000 * 8).toISOString(),
    pageviews: 567890,
    visitors: 78432,
    bounceRate: 51.2,
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    name: 'Customer Portal',
    domain: 'portal.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    status: 'active',
    lastActive: new Date(Date.now() - 60000 * 45).toISOString(),
    pageviews: 345678,
    visitors: 23456,
    bounceRate: 18.9,
  },
  {
    id: 'f6a7b8c9-d0e1-2345-fabc-678901234567',
    name: 'Support Center',
    domain: 'support.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 200).toISOString(),
    status: 'active',
    lastActive: new Date(Date.now() - 3600000 * 1).toISOString(),
    pageviews: 234567,
    visitors: 45678,
    bounceRate: 22.4,
  },
  {
    id: 'a7b8c9d0-e1f2-3456-abcd-789012345678',
    name: 'Partner Network',
    domain: 'partners.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 150).toISOString(),
    status: 'inactive',
    lastActive: new Date(Date.now() - 86400000 * 14).toISOString(),
    pageviews: 12345,
    visitors: 2345,
    bounceRate: 65.8,
  },
  {
    id: 'b8c9d0e1-f2a3-4567-bcde-890123456789',
    name: 'Careers Page',
    domain: 'careers.acmecorp.com',
    createdAt: new Date(Date.now() - 86400000 * 300).toISOString(),
    status: 'active',
    lastActive: new Date(Date.now() - 3600000 * 6).toISOString(),
    pageviews: 89012,
    visitors: 34567,
    bounceRate: 38.6,
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export default function DetailedTablePage() {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = SAMPLE_WEBSITES.filter(
    website =>
      website.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      website.domain.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <PageBody maxWidth="1600px">
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)} description="Detailed view of all tracked websites with comprehensive metrics">
          <Button variant="primary">
            <Icon>
              <Globe />
            </Icon>
            <Text>{formatMessage(labels.addWebsite)}</Text>
          </Button>
        </PageHeader>

        <Panel>
          <Column gap="4" style={{ minHeight: '500px' }}>
            {/* Search and filters row */}
            <Row alignItems="center" justifyContent="space-between" gap="4" wrap="wrap">
              <SearchField
                value={searchValue}
                onSearch={handleSearch}
                delay={300}
                placeholder={formatMessage(labels.search)}
                style={{ minWidth: '280px' }}
              />
              <Row gap="2" alignItems="center">
                <Text color="muted" size="sm">
                  {filteredData.length} websites
                </Text>
              </Row>
            </Row>

            {/* Data table */}
            <LoadingPanel
              data={paginatedData}
              isLoading={false}
              isEmpty={paginatedData.length === 0}
              renderEmpty={() => <Empty message="No websites found" />}
            >
              <Column
                style={{
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  @keyframes rowFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                `}</style>
                <DataTable data={paginatedData}>
                  <DataColumn id="name" label={formatMessage(labels.website)} width="240px">
                    {(row: any) => (
                      <Link
                        href={renderUrl(`/websites/${row.id}`, false)}
                        style={{ textDecoration: 'none' }}
                      >
                        <Row gap="3" alignItems="center">
                          <Favicon domain={row.domain} />
                          <Column gap="1">
                            <Text weight="600">{row.name}</Text>
                          </Column>
                        </Row>
                      </Link>
                    )}
                  </DataColumn>

                  <DataColumn id="domain" label={formatMessage(labels.domain)} width="200px">
                    {(row: any) => (
                      <Row gap="2" alignItems="center">
                        <Text color="muted" size="sm" style={{ fontFamily: 'monospace' }}>
                          {row.domain}
                        </Text>
                        <a
                          href={`https://${row.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'flex', opacity: 0.5 }}
                        >
                          <Icon size="xs">
                            <ExternalLink />
                          </Icon>
                        </a>
                      </Row>
                    )}
                  </DataColumn>

                  <DataColumn id="status" label="Status" width="100px">
                    {(row: any) => (
                      <Row gap="2" alignItems="center">
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor:
                              row.status === 'active'
                                ? 'var(--color-green-600)'
                                : 'var(--base-color-6)',
                          }}
                        />
                        <Text size="sm" color={row.status === 'active' ? undefined : 'muted'}>
                          {row.status === 'active' ? 'Active' : 'Inactive'}
                        </Text>
                      </Row>
                    )}
                  </DataColumn>

                  <DataColumn id="pageviews" label="Pageviews" width="110px" align="end">
                    {(row: any) => (
                      <Text weight="500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatNumber(row.pageviews)}
                      </Text>
                    )}
                  </DataColumn>

                  <DataColumn id="visitors" label="Visitors" width="100px" align="end">
                    {(row: any) => (
                      <Text weight="500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatNumber(row.visitors)}
                      </Text>
                    )}
                  </DataColumn>

                  <DataColumn id="bounceRate" label="Bounce Rate" width="110px" align="end">
                    {(row: any) => (
                      <Row gap="2" alignItems="center" justifyContent="flex-end">
                        <Text
                          size="sm"
                          style={{
                            fontVariantNumeric: 'tabular-nums',
                            color:
                              row.bounceRate < 30
                                ? 'var(--color-green-600)'
                                : row.bounceRate > 50
                                  ? 'var(--color-red-600)'
                                  : 'inherit',
                          }}
                        >
                          {row.bounceRate.toFixed(1)}%
                        </Text>
                      </Row>
                    )}
                  </DataColumn>

                  <DataColumn id="lastActive" label="Last Active" width="130px">
                    {(row: any) => (
                      <Row gap="2" alignItems="center">
                        <Icon size="xs" color="muted">
                          <Activity />
                        </Icon>
                        <DateDistance date={new Date(row.lastActive)} />
                      </Row>
                    )}
                  </DataColumn>

                  <DataColumn id="createdAt" label={formatMessage(labels.created)} width="130px">
                    {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
                  </DataColumn>

                  <DataColumn id="actions" label=" " width="100px" align="end">
                    {(row: any) => (
                      <Row gap="1" justifyContent="flex-end">
                        <Link href={renderUrl(`/websites/${row.id}`, false)}>
                          <Button variant="quiet" size="sm">
                            <Icon size="sm">
                              <Eye />
                            </Icon>
                          </Button>
                        </Link>
                        <Link href={renderUrl(`/websites/${row.id}/settings`, false)}>
                          <Button variant="quiet" size="sm">
                            <Icon size="sm">
                              <SquarePen />
                            </Icon>
                          </Button>
                        </Link>
                      </Row>
                    )}
                  </DataColumn>
                </DataTable>
              </Column>
            </LoadingPanel>

            {/* Pagination */}
            {filteredData.length > pageSize && (
              <Row marginTop="4">
                <Pager
                  page={page}
                  pageSize={pageSize}
                  count={filteredData.length}
                  onPageChange={handlePageChange}
                />
              </Row>
            )}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
