'use client';

import { Column, Row, SearchField } from '@umami/react-zen';
import { useCallback, useState } from 'react';
import { Empty } from '@/components/common/Empty';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Pager } from '@/components/common/Pager';
import {
  useLoginQuery,
  useMessages,
  useNavigation,
  useUserWebsitesQuery,
} from '@/components/hooks';
import { WebsiteCard } from './WebsiteCard';

export function WebsitesDataTable({
  userId,
  teamId,
  allowEdit = true,
  allowView = true,
  showActions = true,
}: {
  userId?: string;
  teamId?: string;
  allowEdit?: boolean;
  allowView?: boolean;
  showActions?: boolean;
}) {
  const { user } = useLoginQuery();
  const queryResult = useUserWebsitesQuery({ userId: userId || user?.id, teamId });
  const { router, updateParams, query: queryParams } = useNavigation();
  const { formatMessage, labels } = useMessages();
  const [search, setSearch] = useState(queryParams?.search || queryResult.data?.search || '');
  const { data, error, isLoading, isFetching } = queryResult;
  const showPager = data && data.count > data.pageSize;

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
    [search],
  );

  return (
    <Column gap="4" minHeight="300px">
      <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap>
        <SearchField
          value={search}
          onSearch={handleSearch}
          delay={600}
          placeholder={formatMessage(labels.search)}
        />
      </Row>
      <LoadingPanel
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        renderEmpty={() => <Empty />}
      >
        {data && (
          <>
            <Column gap="2">
              {data.data.map((website: any) => (
                <WebsiteCard key={website.id} website={website} showActions={showActions} />
              ))}
            </Column>
            {showPager && (
              <Row marginTop="6">
                <Pager
                  page={data.page}
                  pageSize={data.pageSize}
                  count={data.count}
                  onPageChange={handlePageChange}
                />
              </Row>
            )}
          </>
        )}
      </LoadingPanel>
    </Column>
  );
}
