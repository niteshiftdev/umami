import { useTheme } from '@umami/react-zen';
import { useCallback, useMemo } from 'react';
import { BarChart } from '@/components/charts/BarChart';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange, useLocale, useMessages, useTimezone } from '@/components/hooks';
import { useWebsiteComparisonPageviewsQuery } from '@/components/hooks/queries/useWebsiteComparisonPageviewsQuery';
import { renderDateLabels } from '@/lib/charts';
import { generateTimeSeries } from '@/lib/date';

// Color palette for up to 6 websites in comparison
const COMPARISON_COLORS = [
  { backgroundColor: 'rgba(20, 122, 243, 0.5)', borderColor: 'rgba(20, 122, 243, 0.8)' },
  { backgroundColor: 'rgba(241, 91, 181, 0.5)', borderColor: 'rgba(241, 91, 181, 0.8)' },
  { backgroundColor: 'rgba(46, 204, 113, 0.5)', borderColor: 'rgba(46, 204, 113, 0.8)' },
  { backgroundColor: 'rgba(243, 156, 18, 0.5)', borderColor: 'rgba(243, 156, 18, 0.8)' },
  { backgroundColor: 'rgba(155, 89, 182, 0.5)', borderColor: 'rgba(155, 89, 182, 0.8)' },
  { backgroundColor: 'rgba(52, 152, 219, 0.5)', borderColor: 'rgba(52, 152, 219, 0.8)' },
];

export function ComparisonChart({
  websites,
  metric = 'pageviews',
}: {
  websites: { id: string; name: string }[];
  metric?: 'pageviews' | 'sessions';
}) {
  const { formatMessage, labels } = useMessages();
  const { locale, dateLocale } = useLocale();
  const { timezone } = useTimezone();
  const { dateRange } = useDateRange({ timezone });
  const { startDate, endDate, unit, value } = dateRange;
  const { theme } = useTheme();

  const { data, isLoading, isFetching, error } = useWebsiteComparisonPageviewsQuery(websites);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return undefined;

    const datasets = data.map((websiteData, index) => {
      const colorIndex = index % COMPARISON_COLORS.length;
      const colors = COMPARISON_COLORS[colorIndex];
      const seriesData = metric === 'pageviews' ? websiteData.pageviews : websiteData.sessions;

      return {
        type: 'bar' as const,
        label: websiteData.websiteName,
        data: generateTimeSeries(seriesData, startDate, endDate, unit, dateLocale),
        borderWidth: 1,
        barPercentage: 0.8,
        categoryPercentage: 0.9,
        ...colors,
        hoverBackgroundColor: colors.borderColor,
        hoverBorderColor: colors.borderColor,
        order: index + 1,
      };
    });

    return {
      __id: Date.now(),
      datasets,
    };
  }, [data, startDate, endDate, unit, locale, metric]);

  const renderXLabel = useCallback(renderDateLabels(unit, locale), [unit, locale]);

  return (
    <LoadingPanel data={chartData} isLoading={isLoading} isFetching={isFetching} error={error}>
      <BarChart
        key={`${value}-${metric}`}
        chartData={chartData}
        unit={unit}
        minDate={startDate}
        maxDate={endDate}
        renderXLabel={renderXLabel}
        height="420px"
        stacked={false}
      />
    </LoadingPanel>
  );
}
