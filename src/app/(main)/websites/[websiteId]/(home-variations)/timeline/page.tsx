'use client';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { WebsiteChart } from '@/app/(main)/websites/[websiteId]/WebsiteChart';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { ExpandedViewModal } from '@/app/(main)/websites/[websiteId]/ExpandedViewModal';
import { useDynamicVariant, useDynamicColor } from '@niteshift/dials';
import { createContext } from 'react';
import { MetricCard } from '@/components/metrics/MetricCard';
import { useMessages, useDateRange } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { formatShortTime, formatLongNumber } from '@/lib/format';
import { Grid, Heading, Row, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { WorldMap } from '@/components/metrics/WorldMap';
import { useNavigation } from '@/components/hooks';

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

interface PageProps {
  params: { websiteId: string };
}

export default function TimelineViewPage({ params: { websiteId } }: PageProps) {
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

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <PageBody>
        <Column gap="5">
          {/* Controls */}
          <WebsiteControls websiteId={websiteId} />

          {/* Large Hero Chart - Timeline Focused */}
          <Panel minHeight="600px">
            <WebsiteChart websiteId={websiteId} />
          </Panel>

          {/* Vertical Metrics Stack - Full Width */}
          <TimelineMetricsStack websiteId={websiteId} />

          {/* Pages Section - Full Width */}
          <TimelineSection
            title="Pages"
            websiteId={websiteId}
            renderContent={() => (
              <Tabs>
                <TabList>
                  <Tab id="path">Path</Tab>
                  <Tab id="entry">Entry</Tab>
                  <Tab id="exit">Exit</Tab>
                </TabList>
                <TabPanel id="path">
                  <MetricsTable
                    type="path"
                    title="Path"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
                <TabPanel id="entry">
                  <MetricsTable
                    type="entry"
                    title="Path"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
                <TabPanel id="exit">
                  <MetricsTable
                    type="exit"
                    title="Path"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
              </Tabs>
            )}
          />

          {/* Sources Section - Full Width */}
          <TimelineSection
            title="Sources"
            websiteId={websiteId}
            renderContent={() => (
              <Tabs>
                <TabList>
                  <Tab id="referrer">Referrers</Tab>
                  <Tab id="channel">Channels</Tab>
                </TabList>
                <TabPanel id="referrer">
                  <MetricsTable
                    type="referrer"
                    title="Referrer"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
                <TabPanel id="channel">
                  <MetricsTable
                    type="channel"
                    title="Channel"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
              </Tabs>
            )}
          />

          {/* Environment Section - Full Width */}
          <TimelineSection
            title="Environment"
            websiteId={websiteId}
            renderContent={() => (
              <Tabs>
                <TabList>
                  <Tab id="browser">Browsers</Tab>
                  <Tab id="os">OS</Tab>
                  <Tab id="device">Devices</Tab>
                </TabList>
                <TabPanel id="browser">
                  <MetricsTable
                    type="browser"
                    title="Browser"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
                <TabPanel id="os">
                  <MetricsTable
                    type="os"
                    title="OS"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
                <TabPanel id="device">
                  <MetricsTable
                    type="device"
                    title="Device"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
              </Tabs>
            )}
          />

          {/* Location Section - Full Width */}
          <TimelineSection
            title="Location"
            websiteId={websiteId}
            renderContent={() => (
              <Tabs>
                <TabList>
                  <Tab id="country">Countries</Tab>
                  <Tab id="region">Regions</Tab>
                  <Tab id="city">Cities</Tab>
                </TabList>
                <TabPanel id="country">
                  <MetricsTable
                    type="country"
                    title="Country"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
                <TabPanel id="region">
                  <MetricsTable
                    type="region"
                    title="Region"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
                <TabPanel id="city">
                  <MetricsTable
                    type="city"
                    title="City"
                    websiteId={websiteId}
                    limit={10}
                    allowDownload={false}
                    showMore={true}
                  />
                </TabPanel>
              </Tabs>
            )}
          />

          {/* World Map Section - Full Width */}
          <Panel minHeight="500px">
            <Heading size="3">Geographic Distribution</Heading>
            <Row border="bottom" marginBottom="4" />
            <WorldMap websiteId={websiteId} />
          </Panel>

          {/* Weekly Traffic Section - Full Width */}
          <Panel>
            <Heading size="3">Traffic Trend</Heading>
            <Row border="bottom" marginBottom="4" />
            <WeeklyTraffic websiteId={websiteId} />
          </Panel>

          {/* Modal for expanded views */}
          <ExpandedViewModal websiteId={websiteId} />
        </Column>
      </PageBody>
    </TypographyContext.Provider>
  );
}

/**
 * TimelineMetricsStack - Displays metrics in a vertical stack
 */
function TimelineMetricsStack({ websiteId }: { websiteId: string }) {
  const { isAllTime } = useDateRange();
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const { data, isLoading, isFetching, error } = useWebsiteStatsQuery(websiteId);

  const { pageviews, visitors, visits, bounces, totaltime, comparison } = data || {};

  const metrics = data
    ? [
        {
          value: visitors,
          label: formatMessage(labels.visitors),
          change: visitors - comparison.visitors,
          formatValue: formatLongNumber,
        },
        {
          value: visits,
          label: formatMessage(labels.visits),
          change: visits - comparison.visits,
          formatValue: formatLongNumber,
        },
        {
          value: pageviews,
          label: formatMessage(labels.views),
          change: pageviews - comparison.pageviews,
          formatValue: formatLongNumber,
        },
        {
          label: formatMessage(labels.bounceRate),
          value: (Math.min(visits, bounces) / visits) * 100,
          prev: (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100,
          change:
            (Math.min(visits, bounces) / visits) * 100 -
            (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100,
          formatValue: (n: any) => Math.round(+n) + '%',
          reverseColors: true,
        },
        {
          label: formatMessage(labels.visitDuration),
          value: totaltime / visits,
          prev: comparison.totaltime / comparison.visits,
          change: totaltime / visits - comparison.totaltime / comparison.visits,
          formatValue: (n: any) =>
            `${+n < 0 ? '-' : ''}${formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}`,
        },
      ]
    : null;

  return (
    <LoadingPanel
      data={metrics}
      isLoading={isLoading}
      isFetching={isFetching}
      error={getErrorMessage(error)}
    >
      <Column gap="4">
        {metrics?.map(({ label, value, prev, change, formatValue, reverseColors }) => {
          return (
            <Panel key={label} paddingY="5" paddingX="6">
              <MetricCard
                value={value}
                previousValue={prev}
                label={label}
                change={change}
                formatValue={formatValue}
                reverseColors={reverseColors}
                showChange={!isAllTime}
                labelSize={undefined}
                valueSize="9"
                labelWeight="bold"
                valueWeight="bold"
                showLabel={true}
              />
            </Panel>
          );
        })}
      </Column>
    </LoadingPanel>
  );
}

/**
 * TimelineSection - Wrapper for data sections with consistent styling
 */
function TimelineSection({
  title,
  websiteId,
  renderContent,
}: {
  title: string;
  websiteId: string;
  renderContent: () => React.ReactNode;
}) {
  const typography = {
    sectionHeadingSize: '3' as const,
    sectionHeadingWeight: 'bold' as const,
    sectionHeadingColor: undefined,
  };

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

  return (
    <Panel minHeight="500px">
      <Heading size={typography.sectionHeadingSize} style={headingStyle}>
        {title}
      </Heading>
      <Row border="bottom" marginBottom="4" />
      {renderContent()}
    </Panel>
  );
}
