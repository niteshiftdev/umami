'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  SearchField,
  Icon,
  Button,
  Loading,
  Checkbox,
} from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { Empty } from '@/components/common/Empty';
import { Pager } from '@/components/common/Pager';
import { useMessages } from '@/components/hooks';
import { Eye, SquarePen, Trash2, Globe } from '@/components/icons';
import { formatDistanceToNow } from 'date-fns';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: Date;
}

// Realistic sample data for power users with many websites
const SAMPLE_WEBSITES: Website[] = [
  { id: '1', name: 'Main Marketing Site', domain: 'marketing.acmecorp.com', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'E-commerce Store', domain: 'shop.acmecorp.com', createdAt: new Date('2024-02-20') },
  { id: '3', name: 'Developer Documentation', domain: 'docs.acmecorp.com', createdAt: new Date('2024-03-08') },
  { id: '4', name: 'Customer Portal', domain: 'portal.acmecorp.com', createdAt: new Date('2024-04-12') },
  { id: '5', name: 'Blog', domain: 'blog.acmecorp.com', createdAt: new Date('2024-05-22') },
  { id: '6', name: 'Support Center', domain: 'support.acmecorp.com', createdAt: new Date('2024-06-01') },
  { id: '7', name: 'Partner Dashboard', domain: 'partners.acmecorp.com', createdAt: new Date('2024-07-14') },
  { id: '8', name: 'Status Page', domain: 'status.acmecorp.com', createdAt: new Date('2024-08-19') },
  { id: '9', name: 'API Gateway', domain: 'api.acmecorp.com', createdAt: new Date('2024-09-03') },
  { id: '10', name: 'Analytics Demo', domain: 'demo.acmecorp.com', createdAt: new Date('2024-09-28') },
  { id: '11', name: 'Staging Environment', domain: 'staging.acmecorp.com', createdAt: new Date('2024-10-05') },
  { id: '12', name: 'Internal Tools', domain: 'tools.acmecorp.com', createdAt: new Date('2024-10-22') },
  { id: '13', name: 'Mobile Landing', domain: 'm.acmecorp.com', createdAt: new Date('2024-11-01') },
  { id: '14', name: 'Careers Page', domain: 'careers.acmecorp.com', createdAt: new Date('2024-11-10') },
  { id: '15', name: 'Investor Relations', domain: 'investors.acmecorp.com', createdAt: new Date('2024-11-18') },
];

const PAGE_SIZE = 10;

export default function CompactTablePage() {
  const { formatMessage, labels, messages } = useMessages();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);

  const filteredWebsites = useMemo(() => {
    if (!search) return SAMPLE_WEBSITES;
    const lower = search.toLowerCase();
    return SAMPLE_WEBSITES.filter(
      w => w.name.toLowerCase().includes(lower) || w.domain.toLowerCase().includes(lower)
    );
  }, [search]);

  const paginatedWebsites = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredWebsites.slice(start, start + PAGE_SIZE);
  }, [filteredWebsites, page]);

  const totalCount = filteredWebsites.length;
  const allSelected = paginatedWebsites.length > 0 && paginatedWebsites.every(w => selectedIds.has(w.id));
  const someSelected = paginatedWebsites.some(w => selectedIds.has(w.id));

  const handleSelectAll = () => {
    if (allSelected) {
      const newSet = new Set(selectedIds);
      paginatedWebsites.forEach(w => newSet.delete(w.id));
      setSelectedIds(newSet);
    } else {
      const newSet = new Set(selectedIds);
      paginatedWebsites.forEach(w => newSet.add(w.id));
      setSelectedIds(newSet);
    }
  };

  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <PageBody>
      <Column gap="4">
        <PageHeader title={formatMessage(labels.websites)} icon={<Globe />}>
          {selectedIds.size > 0 && (
            <Row gap="2" alignItems="center">
              <Text size="2" color="muted">
                {selectedIds.size} selected
              </Text>
              <Button variant="outline" size="sm">
                <Icon size="sm"><Trash2 /></Icon>
                Delete
              </Button>
            </Row>
          )}
          <Button variant="primary">
            Add Website
          </Button>
        </PageHeader>

        <Panel paddingY="4" paddingX="4">
          <Column gap="3">
            <Row alignItems="center" justifyContent="space-between">
              <SearchField
                value={search}
                onSearch={handleSearch}
                placeholder={formatMessage(labels.search)}
                delay={300}
              />
              <Text size="1" color="muted">
                {totalCount} websites
              </Text>
            </Row>

            {isLoading ? (
              <Loading placement="absolute" />
            ) : paginatedWebsites.length === 0 ? (
              <Empty message={search ? 'No websites match your search' : formatMessage(messages.noDataAvailable)} />
            ) : (
              <div style={{ overflow: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: 'var(--font-size-2)',
                }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid var(--base-color-border)',
                      textAlign: 'left',
                    }}>
                      <th style={{
                        padding: '6px 8px',
                        width: '32px',
                        verticalAlign: 'middle',
                      }}>
                        <Checkbox
                          isSelected={allSelected}
                          isIndeterminate={someSelected && !allSelected}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th style={{
                        padding: '6px 12px',
                        fontWeight: 500,
                        color: 'var(--font-color-muted)',
                        fontSize: 'var(--font-size-1)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Website
                      </th>
                      <th style={{
                        padding: '6px 12px',
                        fontWeight: 500,
                        color: 'var(--font-color-muted)',
                        fontSize: 'var(--font-size-1)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        Domain
                      </th>
                      <th style={{
                        padding: '6px 12px',
                        fontWeight: 500,
                        color: 'var(--font-color-muted)',
                        fontSize: 'var(--font-size-1)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        whiteSpace: 'nowrap',
                      }}>
                        Created
                      </th>
                      <th style={{
                        padding: '6px 12px',
                        fontWeight: 500,
                        color: 'var(--font-color-muted)',
                        fontSize: 'var(--font-size-1)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'right',
                        width: '80px',
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedWebsites.map((website, index) => (
                      <tr
                        key={website.id}
                        style={{
                          borderBottom: '1px solid var(--base-color-border)',
                          backgroundColor: selectedIds.has(website.id)
                            ? 'var(--base-color-2)'
                            : 'transparent',
                          transition: 'background-color 0.15s ease',
                          animation: `fadeIn 0.2s ease ${index * 0.03}s both`,
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
                        <td style={{
                          padding: '4px 8px',
                          verticalAlign: 'middle',
                        }}>
                          <Checkbox
                            isSelected={selectedIds.has(website.id)}
                            onChange={() => handleSelect(website.id)}
                          />
                        </td>
                        <td style={{
                          padding: '4px 12px',
                          verticalAlign: 'middle',
                        }}>
                          <Row alignItems="center" gap="2">
                            <Favicon domain={website.domain} />
                            <Link
                              href={`/websites/${website.id}`}
                              style={{
                                color: 'var(--font-color-default)',
                                textDecoration: 'none',
                                fontWeight: 500,
                              }}
                            >
                              {website.name}
                            </Link>
                          </Row>
                        </td>
                        <td style={{
                          padding: '4px 12px',
                          verticalAlign: 'middle',
                          color: 'var(--font-color-muted)',
                        }}>
                          {website.domain}
                        </td>
                        <td style={{
                          padding: '4px 12px',
                          verticalAlign: 'middle',
                          color: 'var(--font-color-muted)',
                          whiteSpace: 'nowrap',
                        }}>
                          <span title={website.createdAt.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}>
                            {formatDistanceToNow(website.createdAt, { addSuffix: true })}
                          </span>
                        </td>
                        <td style={{
                          padding: '4px 12px',
                          verticalAlign: 'middle',
                          textAlign: 'right',
                        }}>
                          <Row gap="1" justifyContent="flex-end">
                            <Button
                              variant="quiet"
                              size="sm"
                              onPress={() => window.location.href = `/websites/${website.id}`}
                            >
                              <Icon size="sm"><Eye /></Icon>
                            </Button>
                            <Button
                              variant="quiet"
                              size="sm"
                              onPress={() => window.location.href = `/websites/${website.id}/settings`}
                            >
                              <Icon size="sm"><SquarePen /></Icon>
                            </Button>
                          </Row>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalCount > PAGE_SIZE && (
              <Row marginTop="4">
                <Pager
                  page={page}
                  pageSize={PAGE_SIZE}
                  count={totalCount}
                  onPageChange={handlePageChange}
                />
              </Row>
            )}
          </Column>
        </Panel>

        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Column>
    </PageBody>
  );
}
