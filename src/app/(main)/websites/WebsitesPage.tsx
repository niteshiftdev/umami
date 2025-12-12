'use client';
import { WebsitesDataTable } from './WebsitesDataTable';
import { WebsiteAddButton } from './WebsiteAddButton';
import { useMessages, useNavigation } from '@/components/hooks';
import { Column, Row, Text } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { Devices } from '@/components/icons';

export function WebsitesPage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column gap="8" margin="2">
        <PageHeader
          title={formatMessage(labels.websites)}
          description="Track analytics and monitor performance across all your websites in one place"
          icon={<Devices />}
        >
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>
        <Panel>
          <Column gap="4">
            <Row alignItems="center" gap="2">
              <Column gap="1">
                <Text weight="bold">Your Websites</Text>
                <Text size="sm" color="muted">Manage and analyze your tracked websites</Text>
              </Column>
            </Row>
            <WebsitesDataTable teamId={teamId} />
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
