'use client';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';
import { WebsitePanels } from './WebsitePanels';
import { WebsiteControls } from './WebsiteControls';
import { ExpandedViewModal } from '@/app/(main)/websites/[websiteId]/ExpandedViewModal';
import { useDynamicVariant, useDynamicColor } from '@niteshift/dials';
import { createContext } from 'react';
import type { Spacing } from '@umami/react-zen';

export const TypographyContext = createContext<{
  metricLabelSize?: string;
  metricValueSize?: string;
  metricLabelWeight?: string;
  metricValueWeight?: string;
  metricLabelColor?: string;
  metricValueColor?: string;
  sectionHeadingSize?: string;
  sectionHeadingWeight?: string;
  sectionHeadingColor?: string;
  // Spacing controls
  mainGap?: Spacing;
  panelPadding?: Spacing;
  chartMinHeight?: string;
  gridGap?: Spacing;
  // Chart color controls
  chartPrimaryColor?: string;
}>({});

export function WebsitePage({ websiteId }: { websiteId: string }) {
  // Metric Typography Controls
  const metricLabelSize = useDynamicVariant('metric-label-size', {
    label: 'Metric Label Size',
    description: 'Font size for metric labels (Visitors, Views, etc.)',
    default: '',
    options: ['', '0', '1', '2', '3', '4'] as const,
    group: 'Typography - Metrics',
  });

  const metricValueSize = useDynamicVariant('metric-value-size', {
    label: 'Metric Value Size',
    description: 'Font size for metric values (numbers)',
    default: '8',
    options: ['4', '5', '6', '7', '8', '9'] as const,
    group: 'Typography - Metrics',
  });

  const metricLabelWeight = useDynamicVariant('metric-label-weight', {
    label: 'Metric Label Weight',
    description: 'Font weight for metric labels',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Metrics',
  });

  const metricValueWeight = useDynamicVariant('metric-value-weight', {
    label: 'Metric Value Weight',
    description: 'Font weight for metric values',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Metrics',
  });

  const metricLabelColor = useDynamicColor('metric-label-color', {
    label: 'Metric Label Color',
    description: 'Text color for metric labels',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  const metricValueColor = useDynamicColor('metric-value-color', {
    label: 'Metric Value Color',
    description: 'Text color for metric values',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  // Section Heading Controls
  const sectionHeadingSize = useDynamicVariant('section-heading-size', {
    label: 'Section Heading Size',
    description: 'Font size for section headings (Pages, Sources, etc.)',
    default: '2',
    options: ['1', '2', '3', '4', '5'] as const,
    group: 'Typography - Headings',
  });

  const sectionHeadingWeight = useDynamicVariant('section-heading-weight', {
    label: 'Section Heading Weight',
    description: 'Font weight for section headings',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Headings',
  });

  const sectionHeadingColor = useDynamicColor('section-heading-color', {
    label: 'Section Heading Color',
    description: 'Text color for section headings',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Headings',
  });

  // Spacing & Layout Controls
  const mainGap = useDynamicVariant('main-gap', {
    label: 'Main Column Gap',
    description: 'Vertical spacing between main sections (controls, metrics, chart, panels)',
    default: '3',
    options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const,
    group: 'Spacing & Layout',
  });

  const panelPadding = useDynamicVariant('panel-padding', {
    label: 'Panel Padding',
    description: 'Inner padding for all panels',
    default: '',
    options: ['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const,
    group: 'Spacing & Layout',
  });

  const chartMinHeight = useDynamicVariant('chart-min-height', {
    label: 'Chart Min Height',
    description: 'Minimum height for the main chart panel',
    default: '520px',
    options: ['300px', '400px', '520px', '600px', '700px', '800px'] as const,
    group: 'Spacing & Layout',
  });

  const gridGap = useDynamicVariant('grid-gap', {
    label: 'Grid Gap',
    description: 'Spacing between panels in the metrics grid',
    default: '3',
    options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const,
    group: 'Spacing & Layout',
  });

  // Chart Color Controls
  const chartPrimaryColor = useDynamicColor('chart-primary-color', {
    label: 'Bar Chart Color',
    description: 'Primary color for bar charts (Views & Visitors bars)',
    default: '',
    options: [
      '', // Default (theme color: #2680eb)
      '#2680eb', // Original Blue (Adobe Spectrum)
      '#9256d9', // Purple (from CHART_COLORS)
      '#44b556', // Green (from CHART_COLORS)
      '#e68619', // Orange (from CHART_COLORS)
      '#e34850', // Red (from CHART_COLORS)
      '#01bad7', // Cyan (from CHART_COLORS)
      '#6734bc', // Deep Purple (from CHART_COLORS)
      '#ec1562', // Pink (from CHART_COLORS)
      '#0d9488', // Teal (complementary)
      '#8b5cf6', // Violet (complementary)
      '#f59e0b', // Amber (complementary)
      '#10b981', // Emerald (complementary)
      '#ef4444', // Bright Red (complementary)
      '#06b6d4', // Sky Blue (complementary)
      '#a855f7', // Purple (complementary)
    ],
    allowCustom: true,
    group: 'Chart Colors',
  });

  const typographyConfig = {
    metricLabelSize,
    metricValueSize,
    metricLabelWeight,
    metricValueWeight,
    metricLabelColor,
    metricValueColor,
    sectionHeadingSize,
    sectionHeadingWeight,
    sectionHeadingColor,
    mainGap,
    panelPadding,
    chartMinHeight,
    gridGap,
    chartPrimaryColor,
  };

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <Column gap={mainGap as Spacing}>
        <WebsiteControls websiteId={websiteId} />
        <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
        <Panel minHeight={chartMinHeight} padding={panelPadding as Spacing}>
          <WebsiteChart websiteId={websiteId} />
        </Panel>
        <WebsitePanels websiteId={websiteId} />
        <ExpandedViewModal websiteId={websiteId} />
      </Column>
    </TypographyContext.Provider>
  );
}
