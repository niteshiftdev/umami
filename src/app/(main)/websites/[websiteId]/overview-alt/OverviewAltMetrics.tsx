import { Grid, Row, Column, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange, useMessages } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { formatShortTime, formatLongNumber } from '@/lib/format';
import { ArrowUp, ArrowDown } from '@/components/icons';
import { useDynamicColor, useDynamicVariant, useDynamicSpacing } from '@niteshift/dials';

export function OverviewAltMetrics({
  websiteId,
  layout,
}: {
  websiteId: string;
  layout: 'grid' | 'row';
}) {
  const { isAllTime } = useDateRange();
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const { data, isLoading, isFetching, error } = useWebsiteStatsQuery(websiteId);

  const metricCardStyle = useDynamicVariant('metric-card-style', {
    label: 'Metric Card Style',
    description: 'Visual style of metric cards',
    default: 'elevated',
    options: ['flat', 'elevated', 'bordered'] as const,
    group: 'Overview Alt - Metrics',
  });

  const positiveColor = useDynamicColor('metric-positive-color', {
    label: 'Positive Change Color',
    description: 'Color for positive metric changes',
    default: '#30a46c',
    options: ['#30a46c', '#12a594', '#0090ff', '#3e63dd'],
    group: 'Overview Alt - Metrics',
  });

  const negativeColor = useDynamicColor('metric-negative-color', {
    label: 'Negative Change Color',
    description: 'Color for negative metric changes',
    default: '#e5484d',
    options: ['#e5484d', '#f76b15', '#d6409f', '#8e4ec6'],
    group: 'Overview Alt - Metrics',
  });

  const metricBorderRadius = useDynamicVariant('metric-border-radius', {
    label: 'Card Border Radius',
    description: 'Corner rounding of metric cards',
    default: '8px',
    options: ['2px', '4px', '8px', '16px'] as const,
    group: 'Overview Alt - Metrics',
  });

  const metricPadding = useDynamicSpacing('metric-padding', {
    label: 'Card Padding',
    description: 'Internal padding of metric cards',
    default: '16px',
    options: ['8px', '12px', '16px', '24px', '32px'],
    group: 'Overview Alt - Metrics',
  });

  const metricBackground = useDynamicColor('metric-background', {
    label: 'Card Background',
    description: 'Background color of metric cards',
    default: 'transparent',
    options: ['transparent', '#fcfcfc', '#f9f9f9', '#f0f0f0', '#191919', '#222222', '#2a2a2a'],
    allowCustom: true,
    group: 'Overview Alt - Metrics',
  });

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

  const getCardStyle = () => {
    const baseStyle: any = {
      borderRadius: metricBorderRadius,
      padding: metricPadding,
      backgroundColor: metricBackground,
    };

    switch (metricCardStyle) {
      case 'elevated':
        return {
          ...baseStyle,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        };
      case 'bordered':
        return { ...baseStyle, border: '1px solid var(--base-border-color)' };
      default:
        return baseStyle;
    }
  };

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
          md: layout === 'grid' ? '1fr 1fr' : 'repeat(5, 1fr)',
          lg: layout === 'grid' ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
          xl: layout === 'grid' ? 'repeat(5, 1fr)' : 'repeat(5, 1fr)',
        }}
        gap="3"
      >
        {metrics?.map(({ id, label, value, change, formatValue, reverseColors }) => {
          const isPositive = change > 0;
          const isNegative = change < 0;
          const shouldReverseColor = reverseColors ? !isPositive : isPositive;
          const changeColor =
            change !== 0
              ? shouldReverseColor && !isNegative
                ? positiveColor
                : negativeColor
              : undefined;

          return (
            <Panel key={id} padding="0" style={getCardStyle()}>
              <Column gap="1">
                <Text size="1" color="gray" weight="500">
                  {label}
                </Text>
                <Heading size="4">{formatValue(value)}</Heading>
                {!isAllTime && change !== undefined && (
                  <Row gap="1" alignItems="center">
                    {isPositive && (
                      <ArrowUp width={12} height={12} style={{ color: changeColor }} />
                    )}
                    {isNegative && (
                      <ArrowDown width={12} height={12} style={{ color: changeColor }} />
                    )}
                    <Text size="1" style={{ color: changeColor }} weight="500">
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
