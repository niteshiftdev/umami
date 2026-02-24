import type { UseQueryOptions } from '@tanstack/react-query';
import { useDateParameters } from '@/components/hooks/useDateParameters';
import { useApi } from '../useApi';
import { useFilterParameters } from '../useFilterParameters';

export interface ComparisonPageviewsData {
  websiteId: string;
  websiteName: string;
  pageviews: { x: string; y: number }[];
  sessions: { x: string; y: number }[];
}

export function useWebsiteComparisonPageviewsQuery(
  websites: { id: string; name: string }[],
  options?: UseQueryOptions<ComparisonPageviewsData[], Error, ComparisonPageviewsData[]>,
) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useQuery<ComparisonPageviewsData[]>({
    queryKey: [
      'websites:comparison:pageviews',
      {
        websiteIds: websites.map(w => w.id).join(','),
        startAt,
        endAt,
        unit,
        timezone,
        ...filters,
      },
    ],
    queryFn: async () => {
      const results = await Promise.allSettled(
        websites.map(async website => {
          const data = await get(`/websites/${website.id}/pageviews`, {
            startAt,
            endAt,
            unit,
            timezone,
            ...filters,
          });

          return {
            websiteId: website.id,
            websiteName: website.name,
            pageviews: data.pageviews || [],
            sessions: data.sessions || [],
          };
        }),
      );

      return results
        .filter(
          (result): result is PromiseFulfilledResult<ComparisonPageviewsData> =>
            result.status === 'fulfilled',
        )
        .map(result => result.value);
    },
    enabled: websites.length > 0,
    ...options,
  });
}
