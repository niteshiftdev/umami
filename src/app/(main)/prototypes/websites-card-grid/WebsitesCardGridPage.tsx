'use client';
import { WebsiteCard } from './WebsiteCard';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { useMessages, useNavigation, useLoginQuery, useUserWebsitesQuery } from '@/components/hooks';
import { Column, Row, Grid, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { DataGrid } from '@/components/common/DataGrid';
import { Empty } from '@/components/common/Empty';
import { useState, useMemo } from 'react';

// Mock data for demonstration
const MOCK_WEBSITES = [
  {
    id: '1',
    name: 'Tech Blog',
    domain: 'techblog.example.com',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
  {
    id: '2',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
  },
  {
    id: '3',
    name: 'Portfolio',
    domain: 'portfolio.example.com',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: '4',
    name: 'SaaS Dashboard',
    domain: 'app.example.com',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
  },
  {
    id: '5',
    name: 'Marketing Site',
    domain: 'marketing.example.com',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    id: '6',
    name: 'Community Forum',
    domain: 'forum.example.com',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
];

export function WebsitesCardGridPage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels } = useMessages();
  const { user } = useLoginQuery();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });
  const [search, setSearch] = useState('');

  // Use real data if available, otherwise use mock data
  const displayData = queryResult.data?.data && queryResult.data.data.length > 0
    ? queryResult.data.data
    : MOCK_WEBSITES;

  const filteredData = useMemo(() => {
    const searchLower = search.toLowerCase();
    const filtered = displayData.filter(website =>
      website.name.toLowerCase().includes(searchLower) ||
      website.domain.toLowerCase().includes(searchLower)
    );

    return {
      ...queryResult.data,
      data: filtered,
      count: filtered.length,
    };
  }, [displayData, search, queryResult.data]);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)}>
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>
        <Panel>
          <Column gap="6">
            {/* Search bar */}
            <Row>
              <input
                type="text"
                placeholder={formatMessage(labels.search)}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: 'var(--spacing-2) var(--spacing-3)',
                  borderRadius: 'var(--border-radius-2)',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  width: '300px',
                  maxWidth: '100%',
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text)',
                }}
              />
            </Row>

            {/* Cards Grid */}
            {filteredData?.data && filteredData.data.length > 0 ? (
              <Grid
                columns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr', xl: '1fr 1fr 1fr 1fr' }}
                gap="6"
                width="100%"
              >
                {filteredData.data.map((website: any) => (
                  <WebsiteCard key={website.id} website={website} />
                ))}
              </Grid>
            ) : (
              <Empty message={formatMessage(labels.noDataAvailable)} />
            )}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
