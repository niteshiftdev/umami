import { Grid, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { useMessages } from '@/components/hooks';
import { useDynamicNumber, useDynamicVariant, useDynamicBoolean } from '@niteshift/dials';

export function OverviewAltTopContent({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();

  const topContentLayout = useDynamicVariant('top-content-layout', {
    label: 'Top Content Layout',
    description: 'Grid layout for pages and sources',
    default: 'two-column',
    options: ['single-column', 'two-column'] as const,
    group: 'Overview Alt - Top Content',
  });

  const topContentLimit = useDynamicNumber('top-content-limit', {
    label: 'Items to Show',
    description: 'Number of items in each list',
    default: 8,
    min: 5,
    max: 20,
    step: 1,
    options: [5, 8, 10, 15],
    group: 'Overview Alt - Top Content',
  });

  const showTopPages = useDynamicBoolean('show-top-pages', {
    label: 'Show Top Pages',
    description: 'Display most visited pages',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Top Content',
  });

  const showTopSources = useDynamicBoolean('show-top-sources', {
    label: 'Show Top Sources',
    description: 'Display top referrers',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Top Content',
  });

  const tableProps = {
    websiteId,
    limit: topContentLimit,
    allowDownload: false,
    showMore: false,
    metric: formatMessage(labels.visitors),
  };

  if (!showTopPages && !showTopSources) {
    return null;
  }

  return (
    <Grid
      columns={{
        xs: '1fr',
        lg: topContentLayout === 'two-column' && showTopPages && showTopSources ? '1fr 1fr' : '1fr',
      }}
      gap="3"
    >
      {showTopPages && (
        <Panel>
          <Heading size="2" marginBottom="4">
            Top Pages
          </Heading>
          <MetricsTable type="path" title={formatMessage(labels.path)} {...tableProps} />
        </Panel>
      )}
      {showTopSources && (
        <Panel>
          <Heading size="2" marginBottom="4">
            Top Sources
          </Heading>
          <MetricsTable type="referrer" title={formatMessage(labels.referrer)} {...tableProps} />
        </Panel>
      )}
    </Grid>
  );
}
