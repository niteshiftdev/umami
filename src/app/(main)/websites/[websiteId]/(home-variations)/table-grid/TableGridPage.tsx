'use client';

import { Column, Grid, Heading, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { PageBody } from '@/components/common/PageBody';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useMessages, useDateRange } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { MetricCard } from '@/components/metrics/MetricCard';
import { formatShortTime, formatLongNumber } from '@/lib/format';
import { createContext, useContext } from 'react';
import { WebsiteControls } from '../../WebsiteControls';

// Typography context for consistent styling
const TypographyContext = createContext<{
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

function CompactMetricsBar({ websiteId }: { websiteId: string }) {
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
          formatValue: n => Math.round(+n) + '%',
          reverseColors: true,
        },
        {
          label: formatMessage(labels.visitDuration),
          value: totaltime / visits,
          prev: comparison.totaltime / comparison.visits,
          change: totaltime / visits - comparison.totaltime / comparison.visits,
          formatValue: n =>
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
      minHeight="auto"
    >
      <Grid columns="repeat(auto-fit, minmax(120px, 1fr))" gap="2">
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
              labelSize="0"
              valueSize="6"
              labelWeight="medium"
              valueWeight="semibold"
            />
          );
        })}
      </Grid>
    </LoadingPanel>
  );
}

function TableSection({
  title,
  websiteId,
  defaultTab,
  tabs,
}: {
  title: string;
  websiteId: string;
  defaultTab: string;
  tabs: Array<{
    id: string;
    label: string;
    type: string;
  }>;
}) {
  const { formatMessage, labels } = useMessages();

  return (
    <Panel>
      <Column gap="3">
        <Heading size="2">{title}</Heading>
        {tabs.length > 1 ? (
          <Tabs defaultValue={defaultTab}>
            <TabList>
              {tabs.map(tab => (
                <Tab key={tab.id} id={tab.id}>
                  {tab.label}
                </Tab>
              ))}
            </TabList>
            {tabs.map(tab => (
              <TabPanel key={tab.id} id={tab.id}>
                <MetricsTable
                  websiteId={websiteId}
                  type={tab.type}
                  title={tab.label}
                  limit={5}
                  allowDownload={false}
                  showMore={false}
                  metric={formatMessage(labels.visitors)}
                />
              </TabPanel>
            ))}
          </Tabs>
        ) : (
          <MetricsTable
            websiteId={websiteId}
            type={tabs[0].type}
            title={tabs[0].label}
            limit={5}
            allowDownload={false}
            showMore={false}
            metric={formatMessage(labels.visitors)}
          />
        )}
      </Column>
    </Panel>
  );
}

export function TableGridPage({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();

  return (
    <TypographyContext.Provider value={{}}>
      <PageBody gap="3">
        {/* Filter and controls */}
        <WebsiteControls websiteId={websiteId} />

        {/* Compact metrics header */}
        <CompactMetricsBar websiteId={websiteId} />

        {/* Main grid of tables - 3 columns on desktop, responsive */}
        <Grid
          columns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
          gap="3"
        >
          {/* Pages section */}
          <TableSection
            title={formatMessage(labels.pages)}
            websiteId={websiteId}
            defaultTab="path"
            tabs={[
              {
                id: 'path',
                label: formatMessage(labels.path),
                type: 'path',
              },
              {
                id: 'entry',
                label: formatMessage(labels.entry),
                type: 'entry',
              },
              {
                id: 'exit',
                label: formatMessage(labels.exit),
                type: 'exit',
              },
            ]}
          />

          {/* Sources section */}
          <TableSection
            title={formatMessage(labels.sources)}
            websiteId={websiteId}
            defaultTab="referrer"
            tabs={[
              {
                id: 'referrer',
                label: formatMessage(labels.referrers),
                type: 'referrer',
              },
              {
                id: 'channel',
                label: formatMessage(labels.channels),
                type: 'channel',
              },
            ]}
          />

          {/* Environment (Browser) section */}
          <TableSection
            title={formatMessage(labels.environment)}
            websiteId={websiteId}
            defaultTab="browser"
            tabs={[
              {
                id: 'browser',
                label: formatMessage(labels.browsers),
                type: 'browser',
              },
              {
                id: 'os',
                label: formatMessage(labels.os),
                type: 'os',
              },
              {
                id: 'device',
                label: formatMessage(labels.devices),
                type: 'device',
              },
            ]}
          />

          {/* Location (Countries) section */}
          <TableSection
            title={formatMessage(labels.location)}
            websiteId={websiteId}
            defaultTab="country"
            tabs={[
              {
                id: 'country',
                label: formatMessage(labels.countries),
                type: 'country',
              },
              {
                id: 'region',
                label: formatMessage(labels.regions),
                type: 'region',
              },
              {
                id: 'city',
                label: formatMessage(labels.cities),
                type: 'city',
              },
            ]}
          />
        </Grid>
      </PageBody>
    </TypographyContext.Provider>
  );
}
