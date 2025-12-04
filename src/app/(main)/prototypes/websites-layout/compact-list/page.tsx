'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Column, Row, SearchField, Text, Icon } from '@umami/react-zen';
import { ChevronRight } from '@/components/icons';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { Pager } from '@/components/common/Pager';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Empty } from '@/components/common/Empty';
import { useMessages, useNavigation } from '@/components/hooks';
import { useUserWebsitesQuery } from '@/components/hooks/queries/useUserWebsitesQuery';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

// Mock data for prototype when no real data available
const MOCK_WEBSITES: Website[] = [
  { id: '1', name: 'Acme Corporation', domain: 'acme.com', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'TechStart Blog', domain: 'blog.techstart.io', createdAt: '2024-02-20T14:45:00Z' },
  { id: '3', name: 'Nova Analytics', domain: 'nova-analytics.dev', createdAt: '2024-03-05T09:15:00Z' },
  { id: '4', name: 'Meridian Software', domain: 'meridian.software', createdAt: '2024-03-18T16:00:00Z' },
  { id: '5', name: 'CloudSync Platform', domain: 'cloudsync.io', createdAt: '2024-04-02T11:30:00Z' },
  { id: '6', name: 'DataVault Pro', domain: 'datavaultpro.com', createdAt: '2024-04-22T08:45:00Z' },
  { id: '7', name: 'Quantum Leap Studios', domain: 'quantumleap.studio', createdAt: '2024-05-10T13:20:00Z' },
  { id: '8', name: 'Horizon Ventures', domain: 'horizon.ventures', createdAt: '2024-05-28T15:55:00Z' },
];

function CompactListRow({ website, index }: { website: Website; index: number }) {
  const { renderUrl } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={renderUrl(`/websites/${website.id}`, false)}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Row
        alignItems="center"
        justifyContent="space-between"
        paddingY="3"
        paddingX="4"
        style={{
          borderBottom: '1px solid var(--border-color)',
          backgroundColor: isHovered ? 'var(--base-color-2)' : 'transparent',
          cursor: 'pointer',
          transition: 'background-color 150ms ease',
          animationName: 'compactListFadeIn',
          animationDuration: '300ms',
          animationTimingFunction: 'ease-out',
          animationFillMode: 'both',
          animationDelay: `${index * 40}ms`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Row alignItems="center" gap="3" style={{ minWidth: 0, flex: 1 }}>
          <div style={{ flexShrink: 0, width: 16, height: 16 }}>
            <Favicon domain={website.domain} />
          </div>
          <Text
            weight="medium"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {website.name}
          </Text>
        </Row>
        <Row alignItems="center" gap="3" style={{ flexShrink: 0 }}>
          <Text color="muted" size="sm">
            {website.domain}
          </Text>
          <Icon
            size="sm"
            color="muted"
            style={{
              opacity: isHovered ? 1 : 0.5,
              transform: isHovered ? 'translateX(2px)' : 'translateX(0)',
              transition: 'opacity 150ms ease, transform 150ms ease',
            }}
          >
            <ChevronRight />
          </Icon>
        </Row>
      </Row>
    </Link>
  );
}

export default function CompactListPage() {
  const { teamId, router, updateParams, query: queryParams } = useNavigation();
  const { formatMessage, labels } = useMessages();
  const [search, setSearch] = useState(queryParams?.search || '');

  const { data, isLoading, isFetching, error } = useUserWebsitesQuery(
    { teamId },
    { search: queryParams?.search, page: queryParams?.page },
  );

  const handleSearch = (value: string) => {
    if (value !== search) {
      setSearch(value);
      router.push(updateParams({ search: value, page: 1 }));
    }
  };

  const handlePageChange = useCallback(
    (page: number) => {
      router.push(updateParams({ search, page }));
    },
    [search, router, updateParams],
  );

  // Use real data if available, otherwise fall back to mock data for prototype
  const websites: Website[] = data?.data || MOCK_WEBSITES;
  const showPager = data && data.count > data.pageSize;
  const isEmpty = data && data.data?.length === 0;

  return (
    <PageBody>
      <style>{`
        @keyframes compactListFadeIn {
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
      <Column gap="4">
        <PageHeader title={formatMessage(labels.websites) || 'Websites'} />

        <Panel padding="0" style={{ overflow: 'hidden' }}>
          <Column>
            <Row
              paddingX="4"
              paddingY="3"
              style={{ borderBottom: '1px solid var(--border-color)' }}
            >
              <SearchField
                value={search}
                onSearch={handleSearch}
                delay={600}
                placeholder={formatMessage(labels.search) || 'Search...'}
                style={{ width: '100%', maxWidth: 280 }}
              />
            </Row>

            <LoadingPanel
              data={data || (MOCK_WEBSITES.length > 0 ? { data: MOCK_WEBSITES } : null)}
              isLoading={isLoading}
              isFetching={isFetching}
              error={error}
              renderEmpty={() => <Empty message="No websites found" />}
            >
              {isEmpty ? (
                <Empty message="No websites match your search" />
              ) : (
                <Column>
                  {websites.map((website, index) => (
                    <CompactListRow key={website.id} website={website} index={index} />
                  ))}
                </Column>
              )}
            </LoadingPanel>

            {showPager && (
              <Row padding="4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <Pager
                  page={data.page}
                  pageSize={data.pageSize}
                  count={data.count}
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
