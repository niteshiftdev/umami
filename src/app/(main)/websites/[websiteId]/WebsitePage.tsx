'use client';
import { useState } from 'react';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';
import { WebsitePanels } from './WebsitePanels';
import { WebsiteControls } from './WebsiteControls';
import { ExpandedViewModal } from '@/app/(main)/websites/[websiteId]/ExpandedViewModal';
import { PaddingDials, type PaddingValues } from './PaddingDials';

export function WebsitePage({ websiteId }: { websiteId: string }) {
  const [paddingValues, setPaddingValues] = useState<PaddingValues>({
    pageBodyPaddingX: 6,
    pageBodyPaddingY: 6,
    panelPaddingX: 6,
    panelPaddingY: 6,
    columnGap: 3,
  });

  const PADDING_SCALE = {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    10: '40px',
    12: '48px',
  } as const;

  const pageBodyPaddingXValue = PADDING_SCALE[paddingValues.pageBodyPaddingX as keyof typeof PADDING_SCALE];
  const columnGapValue = PADDING_SCALE[paddingValues.columnGap as keyof typeof PADDING_SCALE];

  return (
    <>
      <Column
        gap={columnGapValue}
        paddingX={pageBodyPaddingXValue}
        paddingBottom={PADDING_SCALE[paddingValues.pageBodyPaddingY as keyof typeof PADDING_SCALE]}
      >
        <WebsiteControls websiteId={websiteId} />
        <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
        <Panel
          minHeight="520px"
          paddingX={PADDING_SCALE[paddingValues.panelPaddingX as keyof typeof PADDING_SCALE]}
          paddingY={PADDING_SCALE[paddingValues.panelPaddingY as keyof typeof PADDING_SCALE]}
        >
          <WebsiteChart websiteId={websiteId} />
        </Panel>
        <WebsitePanels websiteId={websiteId} />
        <ExpandedViewModal websiteId={websiteId} />
      </Column>
      <PaddingDials
        paddingValues={paddingValues}
        onPaddingChange={setPaddingValues}
      />
    </>
  );
}
