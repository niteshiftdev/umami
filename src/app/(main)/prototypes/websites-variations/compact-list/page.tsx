'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Row, Column, Text, Icon, Button, SearchField } from '@umami/react-zen';
import { SquarePen } from 'lucide-react';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Pager } from '@/components/common/Pager';
import { Favicon } from '@/components/common/Favicon';
import { useMessages, useNavigation } from '@/components/hooks';

interface Website {
  id: string;
  name: string;
  domain: string | null;
  teamId: string | null;
}

// Realistic sample websites data
const sampleWebsites: Website[] = [
  { id: '1', name: 'Acme Corp', domain: 'acme.com', teamId: null },
  { id: '2', name: 'TechStart Blog', domain: 'blog.techstart.io', teamId: null },
  { id: '3', name: 'CloudSync Dashboard', domain: 'app.cloudsync.dev', teamId: 't1' },
  { id: '4', name: 'Retail Plus', domain: 'retailplus.shop', teamId: null },
  { id: '5', name: 'DevTools Hub', domain: 'devtools-hub.com', teamId: 't1' },
  { id: '6', name: 'Marketing Site', domain: 'marketing.acme.com', teamId: null },
  { id: '7', name: 'E-commerce Platform', domain: 'shop.greatdeals.io', teamId: 't2' },
  { id: '8', name: 'Documentation Portal', domain: 'docs.cloudsync.dev', teamId: 't1' },
  { id: '9', name: 'Analytics Demo', domain: 'demo.analytics.co', teamId: null },
  { id: '10', name: 'Partner Network', domain: 'partners.acme.com', teamId: null },
  { id: '11', name: 'Support Center', domain: 'support.techstart.io', teamId: null },
  { id: '12', name: 'Landing Pages', domain: 'landing.greatdeals.io', teamId: 't2' },
];

const PAGE_SIZE = 15;

export default function CompactListPage() {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Filter websites by search
  const filteredWebsites = useMemo(() => {
    if (!search) return sampleWebsites;
    const lowerSearch = search.toLowerCase();
    return sampleWebsites.filter(
      site =>
        site.name.toLowerCase().includes(lowerSearch) ||
        site.domain?.toLowerCase().includes(lowerSearch),
    );
  }, [search]);

  // Paginate
  const paginatedWebsites = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredWebsites.slice(start, start + PAGE_SIZE);
  }, [filteredWebsites, page]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)}>
          <Row alignItems="center" gap="3">
            <Text
              size="1"
              style={{
                backgroundColor: 'var(--base-color-3)',
                padding: '4px 10px',
                borderRadius: 'var(--border-radius-2)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {sampleWebsites.length} sites
            </Text>
          </Row>
        </PageHeader>

        <Panel>
          <Column gap="3">
            {/* Search */}
            <Row>
              <SearchField
                value={search}
                onSearch={handleSearch}
                delay={300}
                placeholder={formatMessage(labels.search)}
                style={{ maxWidth: 280 }}
              />
            </Row>

            {/* Compact list */}
            <Column
              style={{
                borderTop: '1px solid var(--border-color)',
                marginTop: 'var(--spacing-2)',
              }}
            >
              {paginatedWebsites.length === 0 ? (
                <Row
                  justifyContent="center"
                  paddingY="6"
                  style={{ color: 'var(--base-color-10)' }}
                >
                  <Text>No websites found</Text>
                </Row>
              ) : (
                paginatedWebsites.map((website, index) => (
                  <Row
                    key={website.id}
                    alignItems="center"
                    justifyContent="space-between"
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background-color 150ms ease',
                      marginLeft: '-12px',
                      marginRight: '-12px',
                      paddingLeft: '12px',
                      paddingRight: '12px',
                      animation: `fadeSlideIn 200ms ease-out ${index * 30}ms both`,
                    }}
                    className="compact-row"
                  >
                    <Row alignItems="center" gap="3" style={{ minWidth: 0, flex: 1 }}>
                      {/* Favicon */}
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Favicon domain={website.domain} />
                      </div>

                      {/* Name and domain */}
                      <Row alignItems="center" gap="2" style={{ minWidth: 0, flex: 1 }}>
                        <Link
                          href={renderUrl(`/websites/${website.id}`, false)}
                          style={{
                            color: 'var(--base-color-12)',
                            fontWeight: 'var(--font-weight-medium)',
                            fontSize: 'var(--font-size-3)',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {website.name}
                        </Link>
                        <Text
                          size="2"
                          style={{
                            color: 'var(--base-color-10)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          -
                        </Text>
                        <Text
                          size="2"
                          style={{
                            color: 'var(--base-color-10)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {website.domain || 'No domain'}
                        </Text>

                        {/* Team indicator */}
                        {website.teamId && (
                          <div
                            style={{
                              backgroundColor: 'var(--primary-color)',
                              opacity: 0.1,
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              flexShrink: 0,
                              marginLeft: 4,
                            }}
                          />
                        )}
                      </Row>
                    </Row>

                    {/* Edit button */}
                    <Button
                      variant="quiet"
                      size="sm"
                      style={{
                        opacity: 0.4,
                        transition: 'opacity 150ms ease',
                      }}
                      className="edit-btn"
                    >
                      <Icon size="sm">
                        <SquarePen size={14} />
                      </Icon>
                    </Button>
                  </Row>
                ))
              )}
            </Column>

            {/* Pagination */}
            {filteredWebsites.length > PAGE_SIZE && (
              <Row marginTop="4">
                <Pager
                  page={page}
                  pageSize={PAGE_SIZE}
                  count={filteredWebsites.length}
                  onPageChange={handlePageChange}
                />
              </Row>
            )}
          </Column>
        </Panel>
      </Column>

      {/* Styles */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .compact-row:hover {
          background-color: var(--base-color-2);
        }

        .compact-row:hover .edit-btn {
          opacity: 1 !important;
        }

        .compact-row a:hover {
          color: var(--primary-color) !important;
        }
      `}</style>
    </PageBody>
  );
}
