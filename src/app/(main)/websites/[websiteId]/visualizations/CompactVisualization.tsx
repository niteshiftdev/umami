'use client';
import { GridRow } from '@/components/common/GridRow';
import { Panel } from '@/components/common/Panel';
import { useMessages, useNavigation } from '@/components/hooks';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { Grid, Heading, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { useContext } from 'react';
import { TypographyContext } from '../WebsitePage';

export function CompactVisualization({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();
  const { pathname } = useNavigation();
  const typography = useContext(TypographyContext);
  const tableProps = {
    websiteId,
    limit: 5,
    allowDownload: false,
    showMore: true,
    metric: formatMessage(labels.visitors),
  };
  const rowProps = { minHeight: '400px' };
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

  return (
    <Grid gap="3">
      <GridRow layout="two" {...rowProps}>
        <Panel>
          <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
            {formatMessage(labels.pages)}
          </Heading>
          <MetricsTable type="path" title={formatMessage(labels.path)} {...tableProps} />
        </Panel>
        <Panel>
          <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
            {formatMessage(labels.sources)}
          </Heading>
          <MetricsTable type="referrer" title={formatMessage(labels.referrer)} {...tableProps} />
        </Panel>
      </GridRow>

      <GridRow layout="two" {...rowProps}>
        <Panel>
          <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
            {formatMessage(labels.environment)}
          </Heading>
          <MetricsTable type="browser" title={formatMessage(labels.browser)} {...tableProps} />
        </Panel>

        <Panel>
          <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
            {formatMessage(labels.location)}
          </Heading>
          <MetricsTable type="country" title={formatMessage(labels.country)} {...tableProps} />
        </Panel>
      </GridRow>
      {isSharePage && (
        <GridRow layout="one" {...rowProps}>
          <Panel>
            <Heading size={typography.sectionHeadingSize as any} style={headingStyle}>
              {formatMessage(labels.events)}
            </Heading>
            <MetricsTable
              websiteId={websiteId}
              type="event"
              title={formatMessage(labels.event)}
              metric={formatMessage(labels.count)}
              limit={5}
              filterLink={false}
            />
          </Panel>
        </GridRow>
      )}
    </Grid>
  );
}
