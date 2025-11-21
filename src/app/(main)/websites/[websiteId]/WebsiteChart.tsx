import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange } from '@/components/hooks';
import { useWebsitePageviewsQuery } from '@/components/hooks/queries/useWebsitePageviewsQuery';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';
import { ChartTypeSelector, ChartType } from '@/components/charts/ChartTypeSelector';
import { useMemo, useState } from 'react';

export function WebsiteChart({
  websiteId,
  compareMode,
}: {
  websiteId: string;
  compareMode?: boolean;
}) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const { dateRange, dateCompare } = useDateRange();
  const { startDate, endDate, unit, value } = dateRange;
  const { data, isLoading, isFetching, error } = useWebsitePageviewsQuery({
    websiteId,
    compare: compareMode ? dateCompare?.compare : undefined,
  });
  const { pageviews, sessions, compare } = (data || {}) as any;

  const chartData = useMemo(() => {
    if (data) {
      const result = {
        pageviews,
        sessions,
      };

      if (compare) {
        result['compare'] = {
          pageviews: result.pageviews.map(({ x }, i) => ({
            x,
            y: compare.pageviews[i]?.y,
            d: compare.pageviews[i]?.x,
          })),
          sessions: result.sessions.map(({ x }, i) => ({
            x,
            y: compare.sessions[i]?.y,
            d: compare.sessions[i]?.x,
          })),
        };
      }

      return result;
    }
    return { pageviews: [], sessions: [] };
  }, [data, startDate, endDate, unit]);

  return (
    <LoadingPanel data={data} isFetching={isFetching} isLoading={isLoading} error={error}>
      <ChartTypeSelector chartType={chartType} onChange={setChartType} />
      <PageviewsChart
        key={value}
        data={chartData}
        minDate={startDate}
        maxDate={endDate}
        unit={unit}
        chartType={chartType}
      />
    </LoadingPanel>
  );
}
