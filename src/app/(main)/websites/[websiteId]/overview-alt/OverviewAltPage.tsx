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
import {
  useDynamicVariant,
  useDynamicNumber,
  useDynamicBoolean,
  useDynamicSpacing,
} from '@niteshift/dials';

export function OverviewAltPage({ websiteId }: { websiteId: string }) {
  // Layout Controls
  const metricsLayout = useDynamicVariant('metrics-layout', {
    label: 'Metrics Layout',
    description: 'Display metrics in a grid or compact row',
    default: 'grid',
    options: ['grid', 'row'] as const,
    group: 'Overview Alt - Layout',
  });

  const showRealtimePreview = useDynamicBoolean('show-realtime-preview', {
    label: 'Show Realtime Activity',
    description: 'Display live visitor activity at the top',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Sections',
  });

  const showEvents = useDynamicBoolean('show-events', {
    label: 'Show Top Events',
    description: 'Display most popular events',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Sections',
  });

  const showTopContent = useDynamicBoolean('show-top-content', {
    label: 'Show Top Content Section',
    description: 'Display top pages and sources section',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Sections',
  });

  const showWorldMap = useDynamicBoolean('show-world-map', {
    label: 'Show World Map',
    description: 'Display geographic distribution',
    default: true,
    trueLabel: 'Visible',
    falseLabel: 'Hidden',
    group: 'Overview Alt - Sections',
  });

  // Chart Controls
  const chartHeight = useDynamicNumber('chart-height', {
    label: 'Chart Height',
    description: 'Height of the main analytics chart',
    default: 400,
    min: 200,
    max: 800,
    step: 50,
    unit: 'px',
    options: [300, 400, 500, 600],
    group: 'Overview Alt - Chart',
  });

  const chartPadding = useDynamicSpacing('chart-padding', {
    label: 'Chart Padding',
    description: 'Internal padding of chart panel',
    default: '24px',
    options: ['12px', '16px', '24px', '32px', '48px'],
    group: 'Overview Alt - Chart',
  });

  // Spacing Controls
  const sectionGap = useDynamicSpacing('section-gap', {
    label: 'Section Spacing',
    description: 'Gap between major sections',
    default: '24px',
    options: ['12px', '16px', '24px', '32px', '48px'],
    group: 'Overview Alt - Layout',
  });

  // Page Styling Controls
  const pageMaxWidth = useDynamicVariant('page-max-width', {
    label: 'Page Max Width',
    description: 'Maximum width constraint for page content',
    default: 'none',
    options: ['none', '1200px', '1400px', '1600px', '1800px'] as const,
    group: 'Overview Alt - Layout',
  });

  const chartBorderRadius = useDynamicVariant('chart-border-radius', {
    label: 'Chart Panel Radius',
    description: 'Corner rounding of chart panel',
    default: '8px',
    options: ['2px', '4px', '8px', '16px'] as const,
    group: 'Overview Alt - Chart',
  });

  const bottomGridGap = useDynamicSpacing('bottom-grid-gap', {
    label: 'Bottom Grid Spacing',
    description: 'Gap between events and world map',
    default: '24px',
    options: ['12px', '16px', '24px', '32px', '48px'],
    group: 'Overview Alt - Layout',
  });

  return (
    <Column
      gap
      style={{
        gap: sectionGap,
        maxWidth: pageMaxWidth === 'none' ? undefined : pageMaxWidth,
        margin: pageMaxWidth !== 'none' ? '0 auto' : undefined,
        width: '100%',
      }}
    >
      <WebsiteControls websiteId={websiteId} />

      {showRealtimePreview && <OverviewAltRealtimePreview websiteId={websiteId} />}

      <OverviewAltMetrics websiteId={websiteId} layout={metricsLayout} />

      <Panel
        style={{
          minHeight: `${chartHeight}px`,
          padding: chartPadding,
          borderRadius: chartBorderRadius,
        }}
      >
        <OverviewAltChart websiteId={websiteId} />
      </Panel>

      {showTopContent && <OverviewAltTopContent websiteId={websiteId} />}

      <Grid
        columns={{ xs: '1fr', lg: showEvents && showWorldMap ? '1fr 1fr' : '1fr' }}
        gap={bottomGridGap}
      >
        {showEvents && (
          <Panel>
            <Heading size="2" marginBottom="4">
              Top Events
            </Heading>
            <OverviewAltEvents websiteId={websiteId} />
          </Panel>
        )}
        {showWorldMap && (
          <Panel padding="0">
            <OverviewAltWorldMap websiteId={websiteId} />
          </Panel>
        )}
      </Grid>
    </Column>
  );
}
