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
} from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { Pager } from '@/components/common/Pager';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { Empty } from '@/components/common/Empty';
import { Plus, BarChart3, Settings, ExternalLink } from '@/components/icons';
import styles from './page.module.css';

// Realistic sample data for websites
const sampleWebsites = [
  {
    id: 'w1',
    name: 'Marketing Site',
    domain: 'marketing.acme.io',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 1247,
  },
  {
    id: 'w2',
    name: 'Documentation Portal',
    domain: 'docs.acme.io',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 892,
  },
  {
    id: 'w3',
    name: 'Developer Blog',
    domain: 'blog.acme.io',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 456,
  },
  {
    id: 'w4',
    name: 'Customer Dashboard',
    domain: 'app.acme.io',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 2341,
  },
  {
    id: 'w5',
    name: 'Landing Page A/B',
    domain: 'promo.acme.io',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 187,
  },
  {
    id: 'w6',
    name: 'Support Center',
    domain: 'support.acme.io',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 634,
  },
  {
    id: 'w7',
    name: 'Legacy Portal',
    domain: 'old.acme.io',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    isActive: false,
    visitors24h: 12,
  },
  {
    id: 'w8',
    name: 'Partner Hub',
    domain: 'partners.acme.io',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 156,
  },
  {
    id: 'w9',
    name: 'API Docs',
    domain: 'api.acme.io',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    isActive: true,
    visitors24h: 523,
  },
  {
    id: 'w10',
    name: 'Staging Environment',
    domain: 'staging.acme.io',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    isActive: false,
    visitors24h: 0,
  },
];

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

const PAGE_SIZE = 10;

export default function CompactTablePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search) return sampleWebsites;
    const lowerSearch = search.toLowerCase();
    return sampleWebsites.filter(
      site =>
        site.name.toLowerCase().includes(lowerSearch) ||
        site.domain.toLowerCase().includes(lowerSearch),
    );
  }, [search]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <PageBody>
      <Column gap="4" margin="2" className={styles.container}>
        <PageHeader title="Websites" className={styles.header}>
          <LinkButton href="/websites/add" variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add website</Text>
          </LinkButton>
        </PageHeader>

        <Panel className={styles.panel}>
          <Column gap="3">
            <Row alignItems="center" justifyContent="space-between" className={styles.toolbar}>
              <SearchField
                value={search}
                onSearch={handleSearch}
                placeholder="Filter websites..."
                delay={300}
                className={styles.searchField}
              />
              <Text size="1" color="muted" className={styles.countLabel}>
                {filteredData.length} {filteredData.length === 1 ? 'website' : 'websites'}
              </Text>
            </Row>

            {filteredData.length === 0 ? (
              <Empty message="No websites match your search" />
            ) : (
              <div className={styles.tableWrapper}>
                <DataTable data={paginatedData} className={styles.compactTable}>
                  <DataColumn id="name" label="Website" width="280px">
                    {(row: (typeof sampleWebsites)[0]) => (
                      <Row alignItems="center" gap="2" className={styles.nameCell}>
                        <Favicon domain={row.domain} />
                        <Link href={`/websites/${row.id}`} className={styles.nameLink}>
                          <Text size="2" weight="medium" truncate>
                            {row.name}
                          </Text>
                        </Link>
                      </Row>
                    )}
                  </DataColumn>

                  <DataColumn id="domain" label="Domain">
                    {(row: (typeof sampleWebsites)[0]) => (
                      <Text size="1" color="muted" truncate className={styles.domainText}>
                        {row.domain}
                      </Text>
                    )}
                  </DataColumn>

                  <DataColumn id="visitors" label="24h" width="80px" align="end">
                    {(row: (typeof sampleWebsites)[0]) => (
                      <Text size="1" weight="medium" className={styles.visitorCount}>
                        {row.visitors24h.toLocaleString()}
                      </Text>
                    )}
                  </DataColumn>

                  <DataColumn id="created" label="Created" width="90px">
                    {(row: (typeof sampleWebsites)[0]) => (
                      <Text size="1" color="muted">
                        {formatRelativeTime(row.createdAt)}
                      </Text>
                    )}
                  </DataColumn>

                  <DataColumn id="status" label="Status" width="90px">
                    {(row: (typeof sampleWebsites)[0]) => (
                      <StatusLight variant={row.isActive ? 'success' : 'muted'}>
                        <Text size="1">{row.isActive ? 'Active' : 'Inactive'}</Text>
                      </StatusLight>
                    )}
                  </DataColumn>

                  <DataColumn id="actions" label="" width="80px" align="end">
                    {(row: (typeof sampleWebsites)[0]) => (
                      <Row gap="1" className={styles.actionsRow}>
                        <LinkButton
                          href={`/websites/${row.id}`}
                          variant="quiet"
                          className={styles.actionButton}
                        >
                          <Icon size="sm">
                            <BarChart3 />
                          </Icon>
                        </LinkButton>
                        <LinkButton
                          href={`/websites/${row.id}/settings`}
                          variant="quiet"
                          className={styles.actionButton}
                        >
                          <Icon size="sm">
                            <Settings />
                          </Icon>
                        </LinkButton>
                        <LinkButton
                          href={`https://${row.domain}`}
                          target="_blank"
                          variant="quiet"
                          className={styles.actionButton}
                        >
                          <Icon size="sm">
                            <ExternalLink />
                          </Icon>
                        </LinkButton>
                      </Row>
                    )}
                  </DataColumn>
                </DataTable>
              </div>
            )}

            {filteredData.length > PAGE_SIZE && (
              <Row justifyContent="flex-end" marginTop="2">
                <Pager
                  page={page}
                  pageSize={PAGE_SIZE}
                  count={filteredData.length}
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
