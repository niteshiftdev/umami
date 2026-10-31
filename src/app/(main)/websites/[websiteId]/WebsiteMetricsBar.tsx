import { format, subDays } from 'date-fns';
import { useContext } from 'react';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange, useMessages } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { useWebsiteStatsSeriesQuery } from '@/components/hooks/queries/useWebsiteStatsSeriesQuery';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { formatLongNumber, formatShortTime } from '@/lib/format';
import { TypographyContext } from './WebsitePage';

const SPARKLINE_DAYS = 7;

export function WebsiteMetricsBar({
  websiteId,
}: {
  websiteId: string;
  showChange?: boolean;
  compareMode?: boolean;
}) {
  const typography = useContext(TypographyContext);
  const {
    isAllTime,
    dateRange: { endDate },
  } = useDateRange();
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const { data, isLoading, isFetching, error } = useWebsiteStatsQuery(websiteId);
  const { data: seriesData } = useWebsiteStatsSeriesQuery(websiteId, SPARKLINE_DAYS);

  // One entry per day ending on the selected end date, zero-filled for days with no data
  const days = seriesData
    ? Array.from({ length: SPARKLINE_DAYS }, (_, i) => {
        const key = format(subDays(endDate, SPARKLINE_DAYS - 1 - i), 'yyyy-MM-dd');
        const row = seriesData.find(({ x }) => x?.startsWith(key));
        return {
          pageviews: Number(row?.pageviews) || 0,
          visitors: Number(row?.visitors) || 0,
          visits: Number(row?.visits) || 0,
          bounces: Number(row?.bounces) || 0,
          totaltime: Number(row?.totaltime) || 0,
        };
      })
    : null;

  const sparkline = (fn: (day: (typeof days)[number]) => number) => days?.map(fn);
  const sparklineTitle = formatMessage(labels.lastDays, { x: SPARKLINE_DAYS });

  const { pageviews, visitors, visits, bounces, totaltime, comparison } = data || {};

  const metrics = data
    ? [
        {
          value: visitors,
          label: formatMessage(labels.visitors),
          change: visitors - comparison.visitors,
          formatValue: formatLongNumber,
          sparkline: sparkline(d => d.visitors),
        },
        {
          value: visits,
          label: formatMessage(labels.visits),
          change: visits - comparison.visits,
          formatValue: formatLongNumber,
          sparkline: sparkline(d => d.visits),
        },
        {
          value: pageviews,
          label: formatMessage(labels.views),
          change: pageviews - comparison.pageviews,
          formatValue: formatLongNumber,
          sparkline: sparkline(d => d.pageviews),
        },
        {
          label: formatMessage(labels.bounceRate),
          value: (Math.min(visits, bounces) / visits) * 100,
          prev: (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100,
          change:
            (Math.min(visits, bounces) / visits) * 100 -
            (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100,
          formatValue: n => `${Math.round(+n)}%`,
          reverseColors: true,
          sparkline: sparkline(d =>
            d.visits ? (Math.min(d.visits, d.bounces) / d.visits) * 100 : 0,
          ),
        },
        {
          label: formatMessage(labels.visitDuration),
          value: totaltime / visits,
          prev: comparison.totaltime / comparison.visits,
          change: totaltime / visits - comparison.totaltime / comparison.visits,
          formatValue: n =>
            `${+n < 0 ? '-' : ''}${formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}`,
          sparkline: sparkline(d => (d.visits ? d.totaltime / d.visits : 0)),
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
      <MetricsBar>
        {metrics?.map(({ label, value, prev, change, formatValue, reverseColors, sparkline }) => {
          return (
            <MetricCard
              key={label}
              value={value}
              previousValue={prev}
              label={label}
              change={change}
              formatValue={formatValue}
              reverseColors={reverseColors}
              showChange={!isAllTime}
              labelSize={typography.metricLabelSize as any}
              valueSize={typography.metricValueSize as any}
              labelWeight={typography.metricLabelWeight as any}
              valueWeight={typography.metricValueWeight as any}
              labelColor={typography.metricLabelColor}
              valueColor={typography.metricValueColor}
              sparkline={sparkline}
              sparklineTitle={sparklineTitle}
            />
          );
        })}
      </MetricsBar>
    </LoadingPanel>
  );
}
