import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange } from '@/components/hooks';
import { useWebsitePageviewsQuery } from '@/components/hooks/queries/useWebsitePageviewsQuery';
import { PageviewsChart } from '@/components/metrics/PageviewsChart';

export function OverviewAltChart({ websiteId }: { websiteId: string }) {
  const { dateRange } = useDateRange();
  const { startDate, endDate, unit, value } = dateRange;
  const { data, isLoading, isFetching, error } = useWebsitePageviewsQuery({
    websiteId,
    compare: undefined,
  });

  return (
    <LoadingPanel data={data} isFetching={isFetching} isLoading={isLoading} error={error}>
      <PageviewsChart key={value} data={data} minDate={startDate} maxDate={endDate} unit={unit} />
    </LoadingPanel>
  );
}
