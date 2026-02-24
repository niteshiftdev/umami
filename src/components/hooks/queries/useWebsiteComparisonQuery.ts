import type { UseQueryOptions } from '@tanstack/react-query';
import { useDateParameters } from '@/components/hooks/useDateParameters';
import { useApi } from '../useApi';
import { useFilterParameters } from '../useFilterParameters';
import type { WebsiteStatsData } from './useWebsiteStatsQuery';

export interface WebsiteComparisonData {
  websiteId: string;
  websiteName: string;
  websiteDomain: string;
  stats: WebsiteStatsData | null;
  error?: string;
}

export function useWebsiteComparisonQuery(
  websiteIds: string[],
  options?: UseQueryOptions<WebsiteComparisonData[], Error, WebsiteComparisonData[]>,
) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useQuery<WebsiteComparisonData[]>({
    queryKey: [
      'websites:comparison',
      { websiteIds: websiteIds.join(','), startAt, endAt, unit, timezone, ...filters },
    ],
    queryFn: async () => {
      const results = await Promise.allSettled(
        websiteIds.map(async websiteId => {
          const [websiteInfo, stats] = await Promise.all([
            get(`/websites/${websiteId}`),
            get(`/websites/${websiteId}/stats`, { startAt, endAt, unit, timezone, ...filters }),
          ]);

          return {
            websiteId,
            websiteName: websiteInfo.name,
            websiteDomain: websiteInfo.domain,
            stats,
          };
        }),
      );

      return results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return {
          websiteId: websiteIds[index],
          websiteName: 'Unknown',
          websiteDomain: '',
          stats: null,
          error: result.reason?.message || 'Failed to fetch data',
        };
      });
    },
    enabled: websiteIds.length > 0,
    ...options,
  });
}
