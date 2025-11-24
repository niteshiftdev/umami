import { Grid, Row, Column, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange, useMessages } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { formatShortTime, formatLongNumber } from '@/lib/format';
import { ArrowUp, ArrowDown } from '@/components/icons';
import { CSSProperties } from 'react';

export function OverviewAltMetrics({
  websiteId,
  panelStyle,
}: {
  websiteId: string;
  panelStyle?: CSSProperties;
}) {
  const { isAllTime } = useDateRange();
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const { data, isLoading, isFetching, error } = useWebsiteStatsQuery(websiteId);

  const { pageviews, visitors, visits, bounces, totaltime, comparison } = data || {};

  const metrics = data
    ? [
        {
          id: 'visitors',
          value: visitors,
          label: formatMessage(labels.visitors),
          change: visitors - comparison.visitors,
          formatValue: formatLongNumber,
        },
        {
          id: 'visits',
          value: visits,
          label: formatMessage(labels.visits),
          change: visits - comparison.visits,
          formatValue: formatLongNumber,
        },
        {
          id: 'pageviews',
          value: pageviews,
          label: formatMessage(labels.views),
          change: pageviews - comparison.pageviews,
          formatValue: formatLongNumber,
        },
        {
          id: 'bounceRate',
          label: formatMessage(labels.bounceRate),
          value: (Math.min(visits, bounces) / visits) * 100,
          prev: (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100,
          change:
            (Math.min(visits, bounces) / visits) * 100 -
            (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100,
          formatValue: (n: number) => Math.round(+n) + '%',
          reverseColors: true,
        },
        {
          id: 'visitDuration',
          label: formatMessage(labels.visitDuration),
          value: totaltime / visits,
          prev: comparison.totaltime / comparison.visits,
          change: totaltime / visits - comparison.totaltime / comparison.visits,
          formatValue: (n: number) =>
            `${+n < 0 ? '-' : ''}${formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}`,
        },
      ]
    : null;

  return (
    <LoadingPanel
      data={metrics}
      isLoading={isLoading}
      isFetching={isFetching}
      error={getErrorMessage(error)}
      minHeight="136px"
    >
      <Grid
        columns={{
          xs: '1fr',
          sm: '1fr 1fr',
          lg: 'repeat(5, 1fr)',
        }}
        gap="3"
      >
        {metrics?.map(({ id, label, value, change, formatValue }) => {
          const isPositive = change > 0;
          const isNegative = change < 0;

          return (
            <Panel key={id} padding="0" style={panelStyle}>
              <Column gap="1">
                <Text size="1" color="gray" weight="500">
                  {label}
                </Text>
                <Heading size="4">{formatValue(value)}</Heading>
                {!isAllTime && change !== undefined && (
                  <Row gap="1" alignItems="center">
                    {isPositive && <ArrowUp width={12} height={12} />}
                    {isNegative && <ArrowDown width={12} height={12} />}
                    <Text size="1" weight="500">
                      {formatValue(Math.abs(change))}
                    </Text>
                  </Row>
                )}
              </Column>
            </Panel>
          );
        })}
      </Grid>
    </LoadingPanel>
  );
}
