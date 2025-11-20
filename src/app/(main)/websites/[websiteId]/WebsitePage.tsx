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

export const PaddingContext = createContext<{
  pageBodyPaddingX?: string;
  pageBodyPaddingBottom?: string;
  panelPaddingX?: string;
  panelPaddingY?: string;
  mainColumnGap?: string;
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

  // Padding Controls
  const pageBodyPaddingX = useDynamicVariant('page-body-padding-x', {
    label: 'Page Body Horizontal Padding',
    description: 'Horizontal padding for main content area (left/right)',
    default: '3',
    options: ['0', '1', '2', '3', '4', '5', '6', '7', '8'] as const,
    group: 'Layout - Padding',
  });

  const pageBodyPaddingBottom = useDynamicVariant('page-body-padding-bottom', {
    label: 'Page Body Bottom Padding',
    description: 'Bottom padding for main content area',
    default: '6',
    options: ['0', '2', '4', '6', '8', '10', '12'] as const,
    group: 'Layout - Padding',
  });

  const panelPaddingX = useDynamicVariant('panel-padding-x', {
    label: 'Panel Horizontal Padding',
    description: 'Horizontal padding for card/panel components (left/right)',
    default: '3',
    options: ['0', '1', '2', '3', '4', '5', '6', '7', '8'] as const,
    group: 'Layout - Padding',
  });

  const panelPaddingY = useDynamicVariant('panel-padding-y', {
    label: 'Panel Vertical Padding',
    description: 'Vertical padding for card/panel components (top/bottom)',
    default: '6',
    options: ['0', '2', '4', '6', '8', '10', '12'] as const,
    group: 'Layout - Padding',
  });

  const mainColumnGap = useDynamicVariant('main-column-gap', {
    label: 'Main Content Gap',
    description: 'Gap/spacing between main content sections',
    default: '3',
    options: ['0', '1', '2', '3', '4', '5', '6'] as const,
    group: 'Layout - Padding',
  });

  const paddingConfig = {
    pageBodyPaddingX,
    pageBodyPaddingBottom,
    panelPaddingX,
    panelPaddingY,
    mainColumnGap,
  };

  return (
    <PaddingContext.Provider value={paddingConfig}>
      <TypographyContext.Provider value={typographyConfig}>
        <Column gap={mainColumnGap}>
          <WebsiteControls websiteId={websiteId} />
          <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
          <Panel minHeight="520px" paddingX={panelPaddingX} paddingY={panelPaddingY}>
            <WebsiteChart websiteId={websiteId} />
          </Panel>
          <WebsitePanels websiteId={websiteId} />
          <ExpandedViewModal websiteId={websiteId} />
        </Column>
      </TypographyContext.Provider>
    </PaddingContext.Provider>
  );
}
