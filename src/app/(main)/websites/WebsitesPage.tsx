'use client';
import { Column } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useMessages, useNavigation } from '@/components/hooks';
import { WebsiteAddButton } from './WebsiteAddButton';
import { WebsitesDataTable } from './WebsitesDataTable';

export function WebsitesPage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels } = useMessages();

  return (
    <Column
      width="100%"
      alignItems="center"
      style={{
        flexGrow: 1,
        backgroundColor: 'color-mix(in srgb, var(--primary-color) 15%, transparent)',
      }}
    >
      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader title={formatMessage(labels.websites)}>
            <WebsiteAddButton teamId={teamId} />
          </PageHeader>
          <Panel>
            <WebsitesDataTable teamId={teamId} />
          </Panel>
        </Column>
      </PageBody>
    </Column>
  );
}
