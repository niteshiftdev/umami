'use client';
import { Column } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useMessages, useNavigation } from '@/components/hooks';
import { WebsiteAddButton } from './WebsiteAddButton';
import { WebsitesDataTable } from './WebsitesDataTable';
import styles from './WebsitesPage.module.css';

export function WebsitesPage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels } = useMessages();

  return (
    <div className={styles.page}>
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
    </div>
  );
}
