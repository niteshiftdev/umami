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
}>({});

export const VisualizationContext = createContext<{
  chartType?: 'bar' | 'line' | 'area';
  colorScheme?: string;
  layoutStyle?: 'one' | 'two' | 'three' | 'one-two' | 'two-one';
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
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d', '#9256d9', '#e68619', '#00a2c7', '#d6409f', '#46a758'],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  const metricValueColor = useDynamicColor('metric-value-color', {
    label: 'Metric Value Color',
    description: 'Text color for metric values',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d', '#9256d9', '#e68619', '#00a2c7', '#d6409f', '#46a758'],
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
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d', '#9256d9', '#e68619', '#00a2c7', '#d6409f', '#46a758'],
    allowCustom: true,
    group: 'Typography - Headings',
  });

  // Visualization Controls
  const chartType = useDynamicVariant('chart-type', {
    label: 'Chart Type',
    description: 'Visualization type for the main pageviews chart',
    default: 'bar',
    options: ['bar', 'line', 'area'] as const,
    group: 'Visualization',
  });

  const colorScheme = useDynamicVariant('color-scheme', {
    label: 'Color Scheme',
    description: 'Color palette for chart visualizations',
    default: 'default',
    options: ['default', 'vibrant', 'pastel', 'monochrome', 'warm', 'cool'] as const,
    group: 'Visualization',
  });

  const layoutStyle = useDynamicVariant('layout-style', {
    label: 'Component Layout',
    description: 'Grid layout style for dashboard panels',
    default: 'two',
    options: ['one', 'two', 'three'] as const,
    group: 'Layout',
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
  };

  const visualizationConfig = {
    chartType,
    colorScheme,
    layoutStyle,
  };

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <VisualizationContext.Provider value={visualizationConfig}>
        <Column gap>
          <WebsiteControls websiteId={websiteId} />
          <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
          <Panel minHeight="520px">
            <WebsiteChart websiteId={websiteId} />
          </Panel>
          <WebsitePanels websiteId={websiteId} />
          <ExpandedViewModal websiteId={websiteId} />
        </Column>
      </VisualizationContext.Provider>
    </TypographyContext.Provider>
  );
}
