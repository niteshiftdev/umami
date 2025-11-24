import { WorldMap } from '@/components/metrics/WorldMap';

export function OverviewAltWorldMap({ websiteId }: { websiteId: string }) {
  return <WorldMap websiteId={websiteId} />;
}
