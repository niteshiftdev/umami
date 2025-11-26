'use client';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';
import { WebsitePanels } from './WebsitePanels';
import { WebsiteControls } from './WebsiteControls';
import { ExpandedViewModal } from '@/app/(main)/websites/[websiteId]/ExpandedViewModal';
import { GridRow } from '@/components/common/GridRow';
import { useMessages } from '@/components/hooks';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { WorldMap } from '@/components/metrics/WorldMap';
import { Heading, Row } from '@umami/react-zen';

export function WebsitePage({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();

  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />
      <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
      <Panel minHeight="520px">
        <WebsiteChart websiteId={websiteId} />
      </Panel>
      <GridRow layout="two-one" minHeight="570px">
        <Panel gridColumn={{ xs: 'span 1', md: 'span 2' }} paddingX="0" paddingY="0">
          <WorldMap websiteId={websiteId} />
        </Panel>
        <Panel>
          <Heading size="2">{formatMessage(labels.traffic)}</Heading>
          <Row border="bottom" marginBottom="4" />
          <WeeklyTraffic websiteId={websiteId} />
        </Panel>
      </GridRow>
      <WebsitePanels websiteId={websiteId} />
      <ExpandedViewModal websiteId={websiteId} />
    </Column>
  );
}
