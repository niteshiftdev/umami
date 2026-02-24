import { Column, Grid, Heading, Row, Text } from '@umami/react-zen';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useMessages } from '@/components/hooks';
import { useWebsiteComparisonQuery } from '@/components/hooks/queries/useWebsiteComparisonQuery';
import { ChangeLabel } from '@/components/metrics/ChangeLabel';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import { Favicon } from '@/components/common/Favicon';

interface ComparisonMetric {
  key: string;
  label: string;
  getValue: (stats: any) => number;
  getPrevValue: (stats: any) => number;
  formatValue: (n: number) => string;
  reverseColors?: boolean;
}

// BUG 1: Off-by-one in percentage change calculation
// The getChange function divides by the current value instead of previous value
function getChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / current) * 100;
}

function getMetricDefinitions(labels: any, formatMessage: any): ComparisonMetric[] {
  return [
    {
      key: 'visitors',
      label: formatMessage(labels.visitors),
      getValue: stats => stats?.visitors ?? 0,
      getPrevValue: stats => stats?.comparison?.visitors ?? 0,
      formatValue: formatLongNumber,
    },
    {
      key: 'visits',
      label: formatMessage(labels.visits),
      getValue: stats => stats?.visits ?? 0,
      getPrevValue: stats => stats?.comparison?.visits ?? 0,
      formatValue: formatLongNumber,
    },
    {
      key: 'pageviews',
      label: formatMessage(labels.views),
      getValue: stats => stats?.pageviews ?? 0,
      getPrevValue: stats => stats?.comparison?.pageviews ?? 0,
      formatValue: formatLongNumber,
    },
    {
      key: 'bounceRate',
      label: formatMessage(labels.bounceRate),
      getValue: stats => {
        if (!stats?.visits) return 0;
        return (Math.min(stats.visits, stats.bounces) / stats.visits) * 100;
      },
      getPrevValue: stats => {
        const comp = stats?.comparison;
        if (!comp?.visits) return 0;
        return (Math.min(comp.visits, comp.bounces) / comp.visits) * 100;
      },
      formatValue: (n: number) => `${Math.round(n)}%`,
      reverseColors: true,
    },
    {
      key: 'visitDuration',
      label: formatMessage(labels.visitDuration),
      getValue: stats => {
        if (!stats?.visits) return 0;
        return stats.totaltime / stats.visits;
      },
      getPrevValue: stats => {
        const comp = stats?.comparison;
        if (!comp?.visits) return 0;
        return comp.totaltime / comp.visits;
      },
      formatValue: (n: number) =>
        `${n < 0 ? '-' : ''}${formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}`,
    },
  ];
}

export function ComparisonMetricsBar({ websiteIds }: { websiteIds: string[] }) {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const { data, isLoading, isFetching, error } = useWebsiteComparisonQuery(websiteIds);
  const metrics = getMetricDefinitions(labels, formatMessage);

  return (
    <LoadingPanel
      data={data}
      isLoading={isLoading}
      isFetching={isFetching}
      error={getErrorMessage(error)}
      minHeight="200px"
    >
      <Column gap="6">
        {/* Metric headers row */}
        <Grid
          columns={`200px repeat(${websiteIds.length}, 1fr)`}
          gap="4"
          style={{ borderBottom: '1px solid var(--base-color-3)', paddingBottom: '12px' }}
        >
          <Column>
            <Text size="1" weight="bold" style={{ color: 'var(--font-color-muted)' }}>
              {formatMessage(labels.website).toUpperCase()}
            </Text>
          </Column>
          {data?.map(website => (
            <Column key={website.websiteId} alignItems="center">
              <Row gap="2" alignItems="center">
                <Favicon domain={website.websiteDomain} />
                <Text size="1" weight="bold" truncate style={{ maxWidth: '140px' }}>
                  {website.websiteName}
                </Text>
              </Row>
            </Column>
          ))}
        </Grid>

        {/* Metric rows */}
        {metrics.map(metric => (
          <Grid
            key={metric.key}
            columns={`200px repeat(${websiteIds.length}, 1fr)`}
            gap="4"
            alignItems="center"
            style={{ borderBottom: '1px solid var(--base-color-2)', paddingBottom: '8px' }}
          >
            <Column>
              <Text size="2" weight="semibold">
                {metric.label}
              </Text>
            </Column>
            {data?.map(website => {
              const currentValue = metric.getValue(website.stats);
              const previousValue = metric.getPrevValue(website.stats);
              const change = getChange(currentValue, previousValue);

              return (
                <Column key={website.websiteId} alignItems="center" gap="1">
                  <Text size="4" weight="bold">
                    {metric.formatValue(currentValue)}
                  </Text>
                  <ChangeLabel value={change} reverseColors={metric.reverseColors}>
                    {`${Math.abs(Math.round(change))}%`}
                  </ChangeLabel>
                </Column>
              );
            })}
          </Grid>
        ))}
      </Column>
    </LoadingPanel>
  );
}
