import { ReactNode, useState } from 'react';
import {
  Icon,
  DataTable,
  DataColumn,
  DataTableProps,
  Row,
  Text,
  MenuItem,
  Modal,
  Dialog,
} from '@umami/react-zen';
import { useMessages, useNavigation } from '@/components/hooks';
import { Edit, Trash, Code, Eye } from '@/components/icons';
import { Favicon } from '@/components/common/Favicon';
import { MenuButton } from '@/components/input/MenuButton';
import { DateDistance } from '@/components/common/DateDistance';
import { WebsiteDeleteForm } from '@/app/(main)/websites/[websiteId]/settings/WebsiteDeleteForm';

export interface WebsitesTableProps extends DataTableProps {
  showActions?: boolean;
  allowEdit?: boolean;
  allowView?: boolean;
  renderLink?: (row: any) => ReactNode;
}

export function WebsitesTable({ showActions, renderLink, ...props }: WebsitesTableProps) {
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();
  const [deleteWebsite, setDeleteWebsite] = useState<string | null>(null);

  return (
    <>
      <DataTable {...props}>
        <DataColumn id="name" label={formatMessage(labels.name)}>
          {(row: any) => (
            <Row alignItems="center" gap="3">
              <Favicon domain={row.domain} />
              {renderLink?.(row)}
            </Row>
          )}
        </DataColumn>
        <DataColumn id="domain" label={formatMessage(labels.domain)} width="200px">
          {(row: any) => (
            <Text color="muted" size="1">
              {row.domain}
            </Text>
          )}
        </DataColumn>
        <DataColumn id="created" label={formatMessage(labels.created)} width="150px">
          {(row: any) => <DateDistance date={new Date(row.createdAt)} />}
        </DataColumn>
        {showActions && (
          <DataColumn id="action" label=" " align="end" width="50px">
            {(row: any) => {
              const websiteId = row.id;

              return (
                <MenuButton>
                  <MenuItem href={renderUrl(`/websites/${websiteId}`)}>
                    <Row alignItems="center" gap>
                      <Icon>
                        <Eye />
                      </Icon>
                      <Text>{formatMessage(labels.view)}</Text>
                    </Row>
                  </MenuItem>
                  <MenuItem href={renderUrl(`/websites/${websiteId}/settings`)}>
                    <Row alignItems="center" gap>
                      <Icon>
                        <Edit />
                      </Icon>
                      <Text>{formatMessage(labels.settings)}</Text>
                    </Row>
                  </MenuItem>
                  <MenuItem href={renderUrl(`/websites/${websiteId}/settings#tracking-code`)}>
                    <Row alignItems="center" gap>
                      <Icon>
                        <Code />
                      </Icon>
                      <Text>{formatMessage(labels.trackingCode)}</Text>
                    </Row>
                  </MenuItem>
                  <MenuItem id="delete" onAction={() => setDeleteWebsite(websiteId)}>
                    <Row alignItems="center" gap>
                      <Icon>
                        <Trash />
                      </Icon>
                      <Text>{formatMessage(labels.delete)}</Text>
                    </Row>
                  </MenuItem>
                </MenuButton>
              );
            }}
          </DataColumn>
        )}
      </DataTable>
      <Modal isOpen={!!deleteWebsite}>
        <Dialog style={{ width: 400 }}>
          <WebsiteDeleteForm websiteId={deleteWebsite} onClose={() => setDeleteWebsite(null)} />
        </Dialog>
      </Modal>
    </>
  );
}
