import { Metadata } from 'next';
import { TableGridPage } from './TableGridPage';

export default async function Page({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;

  return <TableGridPage websiteId={websiteId} />;
}

export const metadata: Metadata = {
  title: 'Analytics - Table Grid View',
};
