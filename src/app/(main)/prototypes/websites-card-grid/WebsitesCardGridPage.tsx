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

export function WebsitesCardGridPage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels } = useMessages();
  const { user } = useLoginQuery();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!queryResult.data?.data) return { ...queryResult.data, data: [] };

    const searchLower = search.toLowerCase();
    const filtered = queryResult.data.data.filter(website =>
      website.name.toLowerCase().includes(searchLower) ||
      website.domain.toLowerCase().includes(searchLower)
    );

    return {
      ...queryResult.data,
      data: filtered,
      count: filtered.length,
    };
  }, [queryResult.data, search]);

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
