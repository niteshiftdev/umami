'use client';

import { LivePulsePage } from './LivePulsePage';

export default async function ({ params }: { params: Promise<{ websiteId: string }> }) {
  const { websiteId } = await params;
  return <LivePulsePage websiteId={websiteId} />;
}
