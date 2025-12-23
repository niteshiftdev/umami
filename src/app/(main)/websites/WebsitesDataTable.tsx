import Link from 'next/link';
import { Button, Icon, Column, Text } from '@umami/react-zen';
import { Globe, Plus } from '@/components/icons';
import { WebsitesTable } from './WebsitesTable';
import { DataGrid } from '@/components/common/DataGrid';
import { useLoginQuery, useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { WebsiteAddButton } from './WebsiteAddButton';

function WebsitesEmptyState({ teamId }: { teamId?: string }) {
  const { formatMessage, labels, messages } = useMessages();

  return (
    <Column
      alignItems="center"
      justifyContent="center"
      gap="4"
      padding="8"
      style={{ minHeight: '300px' }}
    >
      <Icon size="xl" color="muted">
        <Globe />
      </Icon>
      <Column alignItems="center" gap="2">
        <Text weight="bold" size="3">
          {formatMessage(messages.noWebsitesConfigured)}
        </Text>
        <Text color="muted" align="center">
          Add your first website to start tracking analytics
        </Text>
      </Column>
      <WebsiteAddButton teamId={teamId} />
    </Column>
  );
}

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
  const { renderUrl } = useNavigation();

  const renderLink = (row: any) => (
    <Link href={renderUrl(`/websites/${row.id}`, false)}>{row.name}</Link>
  );

  return (
    <DataGrid
      query={queryResult}
      allowSearch
      allowPaging
      renderEmpty={() => <WebsitesEmptyState teamId={teamId} />}
    >
      {({ data }) => (
        <WebsitesTable
          data={data}
          showActions={showActions}
          allowEdit={allowEdit}
          allowView={allowView}
          renderLink={renderLink}
        />
      )}
    </DataGrid>
  );
}
