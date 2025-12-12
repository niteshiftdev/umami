import { ReactNode } from 'react';
import { Icon, DataTable, DataColumn, DataTableProps } from '@umami/react-zen';
import { LinkButton } from '@/components/common/LinkButton';
import { useMessages, useNavigation } from '@/components/hooks';
import { SquarePen } from '@/components/icons';
import { WebsitesCard } from './WebsitesCard';

export interface WebsitesTableProps extends DataTableProps {
  showActions?: boolean;
  allowEdit?: boolean;
  allowView?: boolean;
  renderLink?: (row: any) => ReactNode;
  displayMode?: string;
}

export function WebsitesTable({ showActions, renderLink, displayMode, ...props }: WebsitesTableProps) {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();

  // Use custom card component for mobile/card display
  if (displayMode === 'cards') {
    return <WebsitesCard data={props.data} showActions={showActions} renderLink={renderLink} />;
  }

  return (
    <DataTable {...props}>
      <DataColumn id="name" label={formatMessage(labels.name)}>
        {renderLink}
      </DataColumn>
      <DataColumn id="domain" label={formatMessage(labels.domain)} />
      {showActions && (
        <DataColumn id="action" label=" " align="end">
          {(row: any) => {
            const websiteId = row.id;

            return (
              <LinkButton href={renderUrl(`/websites/${websiteId}/settings`)} variant="quiet">
                <Icon>
                  <SquarePen />
                </Icon>
              </LinkButton>
            );
          }}
        </DataColumn>
      )}
    </DataTable>
  );
}
