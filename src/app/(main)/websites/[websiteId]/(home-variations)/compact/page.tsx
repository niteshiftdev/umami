'use client';
import { Column, Grid, Heading, Row, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { WebsiteChart } from '@/app/(main)/websites/[websiteId]/WebsiteChart';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useDateRange, useMessages } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { formatShortTime, formatLongNumber } from '@/lib/format';
import { createContext, useState, useContext } from 'react';

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

export default function CompactMetricsDashboardPage({ params: { websiteId } }: PageProps) {
  const [activeTableTab, setActiveTableTab] = useState('path');
  const { isAllTime } = useDateRange();
  const { formatMessage, labels } = useMessages();
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
          formatValue: (n) => Math.round(+n) + '%',
          reverseColors: true,
        },
        {
          label: formatMessage(labels.visitDuration),
          value: totaltime / visits,
          prev: comparison.totaltime / comparison.visits,
          change: totaltime / visits - comparison.totaltime / comparison.visits,
          formatValue: (n) =>
            `${+n < 0 ? '-' : ''}${formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}`,
        },
      ]
    : null;

  const typographyConfig = {
    metricLabelSize: '0',
    metricValueSize: '6',
    metricLabelWeight: 'bold',
    metricValueWeight: 'bold',
    metricLabelColor: '',
    metricValueColor: '',
    sectionHeadingSize: '1',
    sectionHeadingWeight: 'bold',
    sectionHeadingColor: '',
  };

  const tableProps = {
    websiteId,
    limit: 8,
    allowDownload: false,
    showMore: true,
    metric: formatMessage(labels.visitors),
  };

  const headingStyle = {
    fontWeight: 700,
    fontSize: '14px',
    color: typographyConfig.sectionHeadingColor || 'inherit',
  };

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <PageBody>
        <Column gap="1">
          {/* Controls */}
          <WebsiteControls websiteId={websiteId} />

          {/* Compact Metrics Row - All 5 metrics in one horizontal line */}
          <LoadingPanel
            data={metrics}
            isLoading={isLoading}
            isFetching={isFetching}
            error={error}
            minHeight="100px"
          >
            <Grid
              columns="repeat(5, 1fr)"
              gap="1"
              width="100%"
            >
              {metrics?.map(({ label, value, prev, change, formatValue, reverseColors }) => {
                return (
                  <MetricCard
                    key={label}
                    value={value}
                    previousValue={prev}
                    label={label}
                    change={change}
                    formatValue={formatValue}
                    reverseColors={reverseColors}
                    showChange={!isAllTime}
                    labelSize={typographyConfig.metricLabelSize as any}
                    valueSize={typographyConfig.metricValueSize as any}
                    labelWeight={typographyConfig.metricLabelWeight as any}
                    valueWeight={typographyConfig.metricValueWeight as any}
                    labelColor={typographyConfig.metricLabelColor}
                    valueColor={typographyConfig.metricValueColor}
                  />
                );
              })}
            </Grid>
          </LoadingPanel>

          {/* Chart Panel */}
          <Panel minHeight="280px" paddingY="4" paddingX={{ xs: '3', md: '4' }}>
            <WebsiteChart websiteId={websiteId} />
          </Panel>

          {/* Two-Column Data Panels */}
          <Grid
            columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
            gap="3"
          >
            {/* Left Panel - Tables with Tabs */}
            <Panel paddingY="4" paddingX={{ xs: '3', md: '4' }}>
              <Heading size="1" style={headingStyle} marginBottom="2">
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

            {/* Right Panel - Sources */}
            <Panel paddingY="4" paddingX={{ xs: '3', md: '4' }}>
              <Heading size="1" style={headingStyle} marginBottom="2">
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
                  <MetricsTable type="channel" title={formatMessage(labels.channel)} {...tableProps} />
                </TabPanel>
              </Tabs>
            </Panel>
          </Grid>

          {/* Environment & Location Panels */}
          <Grid
            columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }}
            gap="3"
          >
            {/* Left Panel - Environment */}
            <Panel paddingY="4" paddingX={{ xs: '3', md: '4' }}>
              <Heading size="1" style={headingStyle} marginBottom="2">
                {formatMessage(labels.environment)}
              </Heading>
              <Tabs>
                <TabList>
                  <Tab id="browser">{formatMessage(labels.browsers)}</Tab>
                  <Tab id="os">{formatMessage(labels.os)}</Tab>
                  <Tab id="device">{formatMessage(labels.devices)}</Tab>
                </TabList>
                <TabPanel id="browser">
                  <MetricsTable type="browser" title={formatMessage(labels.browser)} {...tableProps} />
                </TabPanel>
                <TabPanel id="os">
                  <MetricsTable type="os" title={formatMessage(labels.os)} {...tableProps} />
                </TabPanel>
                <TabPanel id="device">
                  <MetricsTable type="device" title={formatMessage(labels.device)} {...tableProps} />
                </TabPanel>
              </Tabs>
            </Panel>

            {/* Right Panel - Location */}
            <Panel paddingY="4" paddingX={{ xs: '3', md: '4' }}>
              <Heading size="1" style={headingStyle} marginBottom="2">
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
                  <MetricsTable
                    type="region"
                    title={formatMessage(labels.region)}
                    {...tableProps}
                  />
                </TabPanel>
                <TabPanel id="city">
                  <MetricsTable
                    type="city"
                    title={formatMessage(labels.city)}
                    {...tableProps}
                  />
                </TabPanel>
              </Tabs>
            </Panel>
          </Grid>
        </Column>
      </PageBody>
    </TypographyContext.Provider>
  );
}
