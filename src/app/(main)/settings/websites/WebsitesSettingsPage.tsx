'use client';
import { Column } from '@umami/react-zen';
import { WebsitesDataTable } from '@/app/(main)/websites/WebsitesDataTable';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useLoginQuery, useMessages } from '@/components/hooks';
import { WebsitesExportButton } from './WebsitesExportButton';

export function WebsitesSettingsPage({ teamId }: { teamId: string }) {
  const { formatMessage, labels } = useMessages();
  const { user } = useLoginQuery();

  return (
    <Column gap>
      <SectionHeader title={formatMessage(labels.websites)}>
        <WebsitesExportButton userId={user?.id} teamId={teamId} />
      </SectionHeader>
      <WebsitesDataTable teamId={teamId} />
    </Column>
  );
}
