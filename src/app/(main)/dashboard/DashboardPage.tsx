'use client';
import { Column } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';

/**
 * DashboardPage Component
 *
 * Main dashboard page that displays the user's analytics overview.
 * Currently shows a basic page header - dashboard widgets and metrics
 * can be added within the Column component.
 *
 * Uses the internationalization hook (useMessages) to support multiple languages.
 */
export function DashboardPage() {
  // Extract message formatting function and label definitions for i18n
  const { formatMessage, labels } = useMessages();

  return (
    <PageBody>
      <Column margin="2">
        {/* Main dashboard header with localized title */}
        <PageHeader title={formatMessage(labels.dashboard)}></PageHeader>
        {/* TODO: Add dashboard content here (metrics, charts, recent activity) */}
      </Column>
    </PageBody>
  );
}
