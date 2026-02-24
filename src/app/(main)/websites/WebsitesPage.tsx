'use client';
import { Button, Column, Icon, Row } from '@umami/react-zen';
import Link from 'next/link';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { useMessages, useNavigation } from '@/components/hooks';
import { BarChart3 } from '@/components/icons';
import { WebsiteAddButton } from './WebsiteAddButton';
import { WebsitesDataTable } from './WebsitesDataTable';

export function WebsitesPage() {
  const { teamId, renderUrl } = useNavigation();
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)}>
          <Row gap="2" alignItems="center">
            <Link href={renderUrl('/websites/comparison')}>
              <Button variant="secondary">
                <Icon size="sm">
                  <BarChart3 />
                </Icon>
                {formatMessage(labels.compare)}
              </Button>
            </Link>
            <WebsiteAddButton teamId={teamId} />
          </Row>
        </PageHeader>
        <Panel>
          <WebsitesDataTable teamId={teamId} />
        </Panel>
      </Column>
    </PageBody>
  );
}
