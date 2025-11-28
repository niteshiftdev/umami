import { GridRow } from '@/components/common/GridRow';
import { Panel } from '@/components/common/Panel';
import { useMessages, useNavigation } from '@/components/hooks';
import { EventsChart } from '@/components/metrics/EventsChart';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { WorldMap } from '@/components/metrics/WorldMap';
import { Grid, Heading, Row, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { useContext } from 'react';
import { TypographyContext } from './WebsitePage';
import { CompactVisualization } from './visualizations/CompactVisualization';
import { DetailedVisualization } from './visualizations/DetailedVisualization';
import { DefaultVisualization } from './visualizations/DefaultVisualization';

export function WebsitePanels({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();
  const { pathname } = useNavigation();
  const typography = useContext(TypographyContext);
  const tableProps = {
    websiteId,
    limit: 10,
    allowDownload: false,
    showMore: true,
    metric: formatMessage(labels.visitors),
  };
  const rowProps = { minHeight: '570px' };
  const isSharePage = pathname.includes('/share/');

  const headingStyle = {
    fontWeight:
      typography.sectionHeadingWeight === 'normal'
        ? 400
        : typography.sectionHeadingWeight === 'medium'
          ? 500
          : typography.sectionHeadingWeight === 'semibold'
            ? 600
            : 700,
    color: typography.sectionHeadingColor,
  };

  // Render different visualization based on mode
  if (typography.visualizationMode === 'compact') {
    return <CompactVisualization websiteId={websiteId} />;
  }

  if (typography.visualizationMode === 'detailed') {
    return <DetailedVisualization websiteId={websiteId} />;
  }

  return <DefaultVisualization websiteId={websiteId} />;
}
