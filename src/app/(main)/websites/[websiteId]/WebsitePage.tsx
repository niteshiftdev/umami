'use client';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';
import { WebsitePanels } from './WebsitePanels';
import { WebsiteControls } from './WebsiteControls';
import { ExpandedViewModal } from '@/app/(main)/websites/[websiteId]/ExpandedViewModal';

export function WebsitePage({ websiteId }: { websiteId: string }) {
  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />
      <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
      <WebsitePanels websiteId={websiteId} />
      <Panel minHeight="520px">
        <WebsiteChart websiteId={websiteId} />
      </Panel>
      <ExpandedViewModal websiteId={websiteId} />
    </Column>
  );
}
