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
  // Typography Controls
  const baseFontSize = useDynamicNumber('base-font-size', {
    label: 'Base Font Size',
    description: 'Root font size for all text',
    default: 16,
    min: 12,
    max: 24,
    step: 1,
    unit: 'px',
    options: [12, 14, 16, 18, 20, 22, 24],
    group: 'Typography',
  });

  const headingFontWeight = useDynamicVariant('heading-font-weight', {
    label: 'Heading Weight',
    description: 'Font weight for headings',
    default: '600',
    options: ['400', '500', '600', '700', '800'] as const,
    group: 'Typography',
  });

  const bodyFontWeight = useDynamicVariant('body-font-weight', {
    label: 'Body Weight',
    description: 'Font weight for body text',
    default: '400',
    options: ['300', '400', '500', '600'] as const,
    group: 'Typography',
  });

  const lineHeight = useDynamicNumber('line-height', {
    label: 'Line Height',
    description: 'Vertical spacing between lines',
    default: 1.5,
    min: 1.2,
    max: 2.0,
    step: 0.1,
    options: [1.2, 1.3, 1.4, 1.5, 1.6, 1.8, 2.0],
    group: 'Typography',
  });

  const letterSpacing = useDynamicNumber('letter-spacing', {
    label: 'Letter Spacing',
    description: 'Space between characters',
    default: 0,
    min: -0.05,
    max: 0.1,
    step: 0.01,
    unit: 'em',
    options: [-0.05, -0.02, 0, 0.02, 0.05, 0.1],
    group: 'Typography',
  });

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

  const typographyStyle = {
    fontSize: `${baseFontSize}px`,
    lineHeight: `${lineHeight}`,
    letterSpacing: `${letterSpacing}em`,
    '--heading-font-weight': headingFontWeight,
    '--body-font-weight': bodyFontWeight,
  } as React.CSSProperties;

  return (
    <Column gap="3" style={typographyStyle}>
      <WebsiteControls websiteId={websiteId} />

      <OverviewAltRealtimePreview websiteId={websiteId} panelStyle={panelStyle} />

      <OverviewAltMetrics websiteId={websiteId} panelStyle={panelStyle} />

      <Panel style={panelStyle}>
        <OverviewAltChart websiteId={websiteId} />
      </Panel>

      <OverviewAltTopContent websiteId={websiteId} panelStyle={panelStyle} />

      <Grid columns={{ xs: '1fr', lg: '1fr 1fr' }} gap="3">
        <Panel style={panelStyle}>
          <Heading size="2" marginBottom="4" style={{ fontWeight: headingFontWeight }}>
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
