import type { UseQueryOptions } from '@tanstack/react-query';
import { startOfDay, subDays } from 'date-fns';
import { useApi } from '../useApi';
import { useDateRange } from '../useDateRange';
import { useFilterParameters } from '../useFilterParameters';
import { useTimezone } from '../useTimezone';

export interface WebsiteStatsSeriesData {
  x: string;
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

/**
 * Daily stats for the `days` days ending on the selected date range's end date.
 */
export function useWebsiteStatsSeriesQuery(
  websiteId: string,
  days: number = 7,
  options?: UseQueryOptions<WebsiteStatsSeriesData[], Error, WebsiteStatsSeriesData[]>,
) {
  const { get, useQuery } = useApi();
  const {
    dateRange: { endDate },
  } = useDateRange();
  const { timezone, localToUtc, canonicalizeTimezone } = useTimezone();
  const filters = useFilterParameters();

  const startAt = +localToUtc(startOfDay(subDays(endDate, days - 1)));
  const endAt = +localToUtc(endDate);
  const params = { startAt, endAt, unit: 'day', timezone: canonicalizeTimezone(timezone) };

  return useQuery<WebsiteStatsSeriesData[]>({
    queryKey: ['websites:stats:series', { websiteId, ...params, ...filters }],
    queryFn: () => get(`/websites/${websiteId}/stats/series`, { ...params, ...filters }),
    enabled: !!websiteId,
    ...options,
  });
}
