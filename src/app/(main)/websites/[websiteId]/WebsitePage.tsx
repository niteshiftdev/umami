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
  tableHeaderSize?: string;
  tableHeaderWeight?: string;
  tableHeaderColor?: string;
  tableRowLabelSize?: string;
  tableRowLabelWeight?: string;
  tableRowLabelColor?: string;
  tableRowValueSize?: string;
  tableRowValueWeight?: string;
  tableRowValueColor?: string;
  tabTextSize?: string;
  tabTextWeight?: string;
  tabTextColor?: string;
}>({});

export function WebsitePage({ websiteId }: { websiteId: string }) {
  // Metric Typography Controls
  const metricLabelSize = useDynamicVariant('metric-label-size', {
    label: 'Metric Label Size',
    description: 'Font size for metric labels (Visitors, Views, etc.)',
    default: '1',
    options: ['0', '1', '2', '3', '4'] as const,
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
    default: 'inherit',
    options: [
      'inherit',
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#3e63dd',
      '#30a46c',
      '#e5484d',
    ],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  const metricValueColor = useDynamicColor('metric-value-color', {
    label: 'Metric Value Color',
    description: 'Text color for metric values',
    default: 'inherit',
    options: [
      'inherit',
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#3e63dd',
      '#30a46c',
      '#e5484d',
    ],
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
    default: 'inherit',
    options: [
      'inherit',
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#3e63dd',
      '#30a46c',
      '#e5484d',
    ],
    allowCustom: true,
    group: 'Typography - Headings',
  });

  // Table Header Controls
  const tableHeaderSize = useDynamicVariant('table-header-size', {
    label: 'Table Header Size',
    description: 'Font size for table column headers',
    default: '2',
    options: ['1', '2', '3', '4'] as const,
    group: 'Typography - Tables',
  });

  const tableHeaderWeight = useDynamicVariant('table-header-weight', {
    label: 'Table Header Weight',
    description: 'Font weight for table column headers',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Tables',
  });

  const tableHeaderColor = useDynamicColor('table-header-color', {
    label: 'Table Header Color',
    description: 'Text color for table column headers',
    default: 'inherit',
    options: [
      'inherit',
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#3e63dd',
      '#30a46c',
      '#e5484d',
    ],
    allowCustom: true,
    group: 'Typography - Tables',
  });

  // Table Row Label Controls
  const tableRowLabelSize = useDynamicVariant('table-row-label-size', {
    label: 'Table Row Label Size',
    description: 'Font size for table row labels',
    default: '2',
    options: ['1', '2', '3', '4'] as const,
    group: 'Typography - Tables',
  });

  const tableRowLabelWeight = useDynamicVariant('table-row-label-weight', {
    label: 'Table Row Label Weight',
    description: 'Font weight for table row labels',
    default: 'normal',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Tables',
  });

  const tableRowLabelColor = useDynamicColor('table-row-label-color', {
    label: 'Table Row Label Color',
    description: 'Text color for table row labels',
    default: 'inherit',
    options: [
      'inherit',
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#3e63dd',
      '#30a46c',
      '#e5484d',
    ],
    allowCustom: true,
    group: 'Typography - Tables',
  });

  // Table Row Value Controls
  const tableRowValueSize = useDynamicVariant('table-row-value-size', {
    label: 'Table Row Value Size',
    description: 'Font size for table row values',
    default: '2',
    options: ['1', '2', '3', '4'] as const,
    group: 'Typography - Tables',
  });

  const tableRowValueWeight = useDynamicVariant('table-row-value-weight', {
    label: 'Table Row Value Weight',
    description: 'Font weight for table row values',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Tables',
  });

  const tableRowValueColor = useDynamicColor('table-row-value-color', {
    label: 'Table Row Value Color',
    description: 'Text color for table row values',
    default: 'inherit',
    options: [
      'inherit',
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#3e63dd',
      '#30a46c',
      '#e5484d',
    ],
    allowCustom: true,
    group: 'Typography - Tables',
  });

  // Tab Navigation Controls
  const tabTextSize = useDynamicVariant('tab-text-size', {
    label: 'Tab Text Size',
    description: 'Font size for tab navigation text',
    default: '2',
    options: ['1', '2', '3'] as const,
    group: 'Typography - Tabs',
  });

  const tabTextWeight = useDynamicVariant('tab-text-weight', {
    label: 'Tab Text Weight',
    description: 'Font weight for tab navigation text',
    default: 'normal',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Tabs',
  });

  const tabTextColor = useDynamicColor('tab-text-color', {
    label: 'Tab Text Color',
    description: 'Text color for tab navigation text',
    default: 'inherit',
    options: [
      'inherit',
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#3e63dd',
      '#30a46c',
      '#e5484d',
    ],
    allowCustom: true,
    group: 'Typography - Tabs',
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
    tableHeaderSize,
    tableHeaderWeight,
    tableHeaderColor,
    tableRowLabelSize,
    tableRowLabelWeight,
    tableRowLabelColor,
    tableRowValueSize,
    tableRowValueWeight,
    tableRowValueColor,
    tabTextSize,
    tabTextWeight,
    tabTextColor,
  };

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <Column gap>
        <WebsiteControls websiteId={websiteId} />
        <WebsiteMetricsBar websiteId={websiteId} showChange={true} />
        <Panel minHeight="520px">
          <WebsiteChart websiteId={websiteId} />
        </Panel>
        <WebsitePanels websiteId={websiteId} />
        <ExpandedViewModal websiteId={websiteId} />
      </Column>
    </TypographyContext.Provider>
  );
}
