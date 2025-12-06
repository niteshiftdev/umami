'use client';
import { WebsitesDataTable } from './WebsitesDataTable';
import { WebsiteAddButton } from './WebsiteAddButton';
import { useMessages, useNavigation } from '@/components/hooks';
import { Column } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { Globe } from '@/components/icons';

export function WebsitesPage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels, messages } = useMessages();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader
          title={formatMessage(labels.websites)}
          description={formatMessage(messages.websitesInfo)}
          icon={<Globe />}
        >
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>
        <Panel>
          <WebsitesDataTable teamId={teamId} />
        </Panel>
      </Column>
    </PageBody>
  );
}
