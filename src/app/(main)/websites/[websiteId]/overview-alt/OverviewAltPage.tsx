'use client';
import { Column, Grid, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteControls } from '../WebsiteControls';
import { OverviewAltMetrics } from './OverviewAltMetrics';
import { OverviewAltChart } from './OverviewAltChart';
import { OverviewAltRealtimePreview } from './OverviewAltRealtimePreview';
import { OverviewAltTopContent } from './OverviewAltTopContent';
import { OverviewAltEvents } from './OverviewAltEvents';
import { OverviewAltWorldMap } from './OverviewAltWorldMap';
import { useDynamicVariant, useDynamicColor, useDynamicNumber } from '@niteshift/dials';

export function OverviewAltPage({ websiteId }: { websiteId: string }) {
  // Border Treatment Controls
  const borderRadius = useDynamicVariant('panel-border-radius', {
    label: 'Border Radius',
    description: 'Corner rounding for all panels',
    default: '8px',
    options: ['0px', '2px', '4px', '8px', '12px', '16px', '24px'] as const,
    group: 'Border Treatment',
  });

  const borderWidth = useDynamicNumber('panel-border-width', {
    label: 'Border Width',
    description: 'Thickness of panel borders',
    default: 1,
    min: 0,
    max: 4,
    step: 1,
    unit: 'px',
    options: [0, 1, 2, 3, 4],
    group: 'Border Treatment',
  });

  const borderColor = useDynamicColor('panel-border-color', {
    label: 'Border Color',
    description: 'Color of panel borders',
    default: 'var(--base-border-color)',
    options: [
      'var(--base-border-color)',
      '#e0e0e0',
      '#d0d0d0',
      '#b0b0b0',
      '#404040',
      '#303030',
      '#3e63dd',
      '#30a46c',
    ],
    allowCustom: true,
    group: 'Border Treatment',
  });

  const borderStyle = useDynamicVariant('panel-border-style', {
    label: 'Border Style',
    description: 'Style of panel borders',
    default: 'solid',
    options: ['solid', 'dashed', 'dotted', 'none'] as const,
    group: 'Border Treatment',
  });

  const panelStyle = {
    borderRadius,
    border: borderStyle === 'none' ? 'none' : `${borderWidth}px ${borderStyle} ${borderColor}`,
  };

  return (
    <Column gap="3">
      <WebsiteControls websiteId={websiteId} />

      <OverviewAltRealtimePreview websiteId={websiteId} panelStyle={panelStyle} />

      <OverviewAltMetrics websiteId={websiteId} panelStyle={panelStyle} />

      <Panel style={panelStyle}>
        <OverviewAltChart websiteId={websiteId} />
      </Panel>

      <OverviewAltTopContent websiteId={websiteId} panelStyle={panelStyle} />

      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel style={panelStyle}>
          <Heading size="2" marginBottom="4">
            Top Events
          </Heading>
          <OverviewAltEvents websiteId={websiteId} />
        </Panel>
        <Panel padding="0" style={panelStyle}>
          <OverviewAltWorldMap websiteId={websiteId} />
        </Panel>
      </Grid>
    </Column>
  );
}
