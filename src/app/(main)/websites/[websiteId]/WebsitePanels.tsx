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
import { useDynamicVariant } from '@niteshift/dials';

export function WebsitePanels({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();
  const { pathname } = useNavigation();
  const typography = useContext(TypographyContext);

  // Panel Layout Preset
  const panelLayout = useDynamicVariant('panel-layout', {
    label: 'Panel Layout',
    description: 'Choose different arrangements of dashboard panels',
    default: 'default',
    options: [
      'default',
      'location-first',
      'map-first',
      'sources-first',
      'traffic-focused',
    ] as const,
    group: 'Panel Order',
  });

  // Define panel order based on selected layout
  const panelPresets = {
    default: { pagesSources: 1, environmentLocation: 2, worldMapTraffic: 3, events: 4 },
    'location-first': {
      environmentLocation: 1,
      pagesSources: 2,
      worldMapTraffic: 3,
      events: 4,
    },
    'map-first': { worldMapTraffic: 1, pagesSources: 2, environmentLocation: 3, events: 4 },
    'sources-first': {
      pagesSources: 1,
      worldMapTraffic: 2,
      environmentLocation: 3,
      events: 4,
    },
    'traffic-focused': {
      worldMapTraffic: 1,
      environmentLocation: 2,
      pagesSources: 3,
      events: 4,
    },
  };

  const currentPanelLayout = panelPresets[panelLayout];

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

  // Create panel rows array with their order values from preset
  const panelRows = [
    {
      order: currentPanelLayout.pagesSources,
      component: (
        <GridRow key="pages-sources" layout="two" {...rowProps}>
          <Panel>
            <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
              {formatMessage(labels.pages)}
            </Heading>
            <Tabs>
              <TabList>
                <Tab id="path">{formatMessage(labels.path)}</Tab>
                <Tab id="entry">{formatMessage(labels.entry)}</Tab>
                <Tab id="exit">{formatMessage(labels.exit)}</Tab>
              </TabList>
              <TabPanel id="path">
                <MetricsTable type="path" title={formatMessage(labels.path)} {...tableProps} />
              </TabPanel>
              <TabPanel id="entry">
                <MetricsTable type="entry" title={formatMessage(labels.path)} {...tableProps} />
              </TabPanel>
              <TabPanel id="exit">
                <MetricsTable type="exit" title={formatMessage(labels.path)} {...tableProps} />
              </TabPanel>
            </Tabs>
          </Panel>
          <Panel>
            <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
              {formatMessage(labels.sources)}
            </Heading>
            <Tabs>
              <TabList>
                <Tab id="referrer">{formatMessage(labels.referrers)}</Tab>
                <Tab id="channel">{formatMessage(labels.channels)}</Tab>
              </TabList>
              <TabPanel id="referrer">
                <MetricsTable
                  type="referrer"
                  title={formatMessage(labels.referrer)}
                  {...tableProps}
                />
              </TabPanel>
              <TabPanel id="channel">
                <MetricsTable
                  type="channel"
                  title={formatMessage(labels.channel)}
                  {...tableProps}
                />
              </TabPanel>
            </Tabs>
          </Panel>
        </GridRow>
      ),
    },
    {
      order: currentPanelLayout.environmentLocation,
      component: (
        <GridRow key="environment-location" layout="two" {...rowProps}>
          <Panel>
            <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
              {formatMessage(labels.environment)}
            </Heading>
            <Tabs>
              <TabList>
                <Tab id="browser">{formatMessage(labels.browsers)}</Tab>
                <Tab id="os">{formatMessage(labels.os)}</Tab>
                <Tab id="device">{formatMessage(labels.devices)}</Tab>
              </TabList>
              <TabPanel id="browser">
                <MetricsTable
                  type="browser"
                  title={formatMessage(labels.browser)}
                  {...tableProps}
                />
              </TabPanel>
              <TabPanel id="os">
                <MetricsTable type="os" title={formatMessage(labels.os)} {...tableProps} />
              </TabPanel>
              <TabPanel id="device">
                <MetricsTable type="device" title={formatMessage(labels.device)} {...tableProps} />
              </TabPanel>
            </Tabs>
          </Panel>

          <Panel>
            <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
              {formatMessage(labels.location)}
            </Heading>
            <Tabs>
              <TabList>
                <Tab id="country">{formatMessage(labels.countries)}</Tab>
                <Tab id="region">{formatMessage(labels.regions)}</Tab>
                <Tab id="city">{formatMessage(labels.cities)}</Tab>
              </TabList>
              <TabPanel id="country">
                <MetricsTable
                  type="country"
                  title={formatMessage(labels.country)}
                  {...tableProps}
                />
              </TabPanel>
              <TabPanel id="region">
                <MetricsTable type="region" title={formatMessage(labels.region)} {...tableProps} />
              </TabPanel>
              <TabPanel id="city">
                <MetricsTable type="city" title={formatMessage(labels.city)} {...tableProps} />
              </TabPanel>
            </Tabs>
          </Panel>
        </GridRow>
      ),
    },
    {
      order: currentPanelLayout.worldMapTraffic,
      component: (
        <GridRow key="worldmap-traffic" layout="two-one" {...rowProps}>
          <Panel gridColumn={{ xs: 'span 1', md: 'span 2' }} paddingX="0" paddingY="0">
            <WorldMap websiteId={websiteId} />
          </Panel>

          <Panel>
            <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
              {formatMessage(labels.traffic)}
            </Heading>
            <Row border="bottom" marginBottom="4" />
            <WeeklyTraffic websiteId={websiteId} />
          </Panel>
        </GridRow>
      ),
    },
  ];

  // Add Events row conditionally
  if (isSharePage) {
    panelRows.push({
      order: currentPanelLayout.events,
      component: (
        <GridRow key="events" layout="two-one" {...rowProps}>
          <Panel>
            <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
              {formatMessage(labels.events)}
            </Heading>
            <Row border="bottom" marginBottom="4" />
            <MetricsTable
              websiteId={websiteId}
              type="event"
              title={formatMessage(labels.event)}
              metric={formatMessage(labels.count)}
              limit={15}
              filterLink={false}
            />
          </Panel>
          <Panel gridColumn={{ xs: 'span 1', md: 'span 2' }}>
            <EventsChart websiteId={websiteId} />
          </Panel>
        </GridRow>
      ),
    });
  }

  // Sort panel rows by order
  const sortedPanelRows = panelRows.sort((a, b) => a.order - b.order);

  return <Grid gap="3">{sortedPanelRows.map(item => item.component)}</Grid>;
}
