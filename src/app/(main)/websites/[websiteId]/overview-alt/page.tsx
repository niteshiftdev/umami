import { OverviewAltPage } from './OverviewAltPage';
import { Metadata } from 'next';

export default async function ({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;

  return <OverviewAltPage websiteId={websiteId} />;
}

export const metadata: Metadata = {
  title: 'Overview Alt',
};
