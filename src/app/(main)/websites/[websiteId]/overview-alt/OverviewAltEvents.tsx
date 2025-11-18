import { MetricsTable } from '@/components/metrics/MetricsTable';
import { useMessages } from '@/components/hooks';

export function OverviewAltEvents({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();

  return (
    <MetricsTable
      websiteId={websiteId}
      type="event"
      title={formatMessage(labels.event)}
      metric={formatMessage(labels.count)}
      limit={10}
      allowDownload={false}
      showMore={false}
      filterLink={false}
    />
  );
}
