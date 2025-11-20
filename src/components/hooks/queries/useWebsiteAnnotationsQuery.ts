import { useApi } from '../useApi';
import { useModified } from '../useModified';
import { useDateParameters } from '../useDateParameters';
import { ReactQueryOptions } from '@/lib/types';

export interface WebsiteAnnotation {
  id: string;
  websiteId: string;
  createdBy: string;
  timestamp: string;
  title: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
}

export function useWebsiteAnnotationsQuery(
  websiteId: string,
  options?: ReactQueryOptions<WebsiteAnnotation[]>,
) {
  const { get, useQuery } = useApi();
  const { startAt, endAt, timezone } = useDateParameters();
  const { modified } = useModified('annotations');

  return useQuery<WebsiteAnnotation[]>({
    queryKey: ['website:annotations', { websiteId, startAt, endAt, timezone, modified }],
    queryFn: () =>
      get(`/websites/${websiteId}/annotations`, {
        startAt,
        endAt,
        timezone,
      }),
    enabled: !!websiteId,
    ...options,
  });
}
