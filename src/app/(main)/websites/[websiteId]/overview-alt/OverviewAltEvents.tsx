import { MetricsTable } from '@/components/metrics/MetricsTable';
import { useMessages } from '@/components/hooks';
import { useDynamicNumber } from '@niteshift/dials';

export function OverviewAltEvents({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();

  const eventsLimit = useDynamicNumber('events-limit', {
    label: 'Events to Show',
    description: 'Number of top events to display',
    default: 10,
    min: 5,
    max: 25,
    step: 5,
    options: [5, 10, 15, 20],
    group: 'Overview Alt - Events',
  });

  return (
    <MetricsTable
      websiteId={websiteId}
      type="event"
      title={formatMessage(labels.event)}
      metric={formatMessage(labels.count)}
      limit={eventsLimit}
      allowDownload={false}
      showMore={false}
      filterLink={false}
    />
  );
}
