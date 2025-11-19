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

export function WebsitePage({ websiteId }: { websiteId: string }) {
  // Component Order Controls
  const controlsOrder = useDynamicVariant('controls-order', {
    label: 'Controls Position',
    description: 'Display order for date/filter controls',
    default: '1',
    options: ['1', '2', '3', '4'] as const,
    group: 'Component Order',
  });

  const metricsOrder = useDynamicVariant('metrics-order', {
    label: 'Metrics Bar Position',
    description: 'Display order for metrics bar (Visitors, Views, etc.)',
    default: '2',
    options: ['1', '2', '3', '4'] as const,
    group: 'Component Order',
  });

  const chartOrder = useDynamicVariant('chart-order', {
    label: 'Chart Position',
    description: 'Display order for main chart',
    default: '3',
    options: ['1', '2', '3', '4'] as const,
    group: 'Component Order',
  });

  const panelsOrder = useDynamicVariant('panels-order', {
    label: 'Panels Position',
    description: 'Display order for dashboard panels',
    default: '4',
    options: ['1', '2', '3', '4'] as const,
    group: 'Component Order',
  });

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

  // Create components array with their order values
  const components = [
    {
      order: parseInt(controlsOrder),
      component: <WebsiteControls key="controls" websiteId={websiteId} />,
    },
    {
      order: parseInt(metricsOrder),
      component: <WebsiteMetricsBar key="metrics" websiteId={websiteId} showChange={true} />,
    },
    {
      order: parseInt(chartOrder),
      component: (
        <Panel key="chart" minHeight="520px">
          <WebsiteChart websiteId={websiteId} />
        </Panel>
      ),
    },
    {
      order: parseInt(panelsOrder),
      component: <WebsitePanels key="panels" websiteId={websiteId} />,
    },
  ];

  // Sort components by order
  const sortedComponents = components.sort((a, b) => a.order - b.order);

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <Column gap>
        {sortedComponents.map(item => item.component)}
        <ExpandedViewModal websiteId={websiteId} />
      </Column>
    </TypographyContext.Provider>
  );
}
