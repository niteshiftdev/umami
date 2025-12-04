'use client';

import { Column, Grid, Row, Text, Heading, Badge } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { MetricCard } from '@/components/metrics/MetricCard';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { WebsiteChart } from '../../WebsiteChart';
import { WebsiteControls } from '../../WebsiteControls';
import { useDateRange, useMessages } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { formatShortTime, formatLongNumber } from '@/lib/format';
import { useParams } from 'next/navigation';

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
          formatValue: (n: number) => Math.round(+n) + '%',
          reverseColors: true,
        },
        {
          label: formatMessage(labels.visitDuration),
          value: totaltime / visits,
          prev: comparison.totaltime / comparison.visits,
          change: totaltime / visits - comparison.totaltime / comparison.visits,
          formatValue: (n: number) =>
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
      minHeight="80px"
    >
      <MetricsBar>
        {metrics?.map(({ label, value, prev, change, formatValue, reverseColors }) => (
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
            labelWeight="semibold"
            valueWeight="bold"
          />
        ))}
      </MetricsBar>
    </LoadingPanel>
  );
}

function TableSection({
  title,
  count,
  children,
  delay = 0,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Column
      gap="3"
      style={{
        animation: 'fadeSlideUp 0.4s ease-out forwards',
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      <Row alignItems="center" gap="2" paddingBottom="2" style={{ borderBottom: '2px solid var(--base-color-3)' }}>
        <Heading size="3" style={{ fontWeight: 600 }}>
          {title}
        </Heading>
        {count !== undefined && (
          <Badge variant="outline" style={{ fontSize: 'var(--font-size-1)' }}>
            {count} rows
          </Badge>
        )}
      </Row>
      {children}
    </Column>
  );
}

function DataTablePanel({
  websiteId,
  type,
  title,
  metric,
}: {
  websiteId: string;
  type: string;
  title: string;
  metric: string;
}) {
  return (
    <Panel paddingY="4" paddingX="4" style={{ minHeight: '480px' }}>
      <MetricsTable
        websiteId={websiteId}
        type={type}
        title={title}
        limit={20}
        showMore={true}
        metric={metric}
      />
    </Panel>
  );
}

export default function DataTableFocusPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const { formatMessage, labels } = useMessages();

  const tableProps = {
    websiteId,
    limit: 20,
    showMore: true,
    metric: formatMessage(labels.visitors),
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .chart-strip {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .metrics-compact {
          animation: fadeIn 0.3s ease-out 0.1s forwards;
          opacity: 0;
        }

        .table-row:hover {
          background: var(--base-color-2);
        }
      `}</style>

      <Column gap="4">
        {/* Controls */}
        <WebsiteControls websiteId={websiteId} />

        {/* Compact Metrics Bar */}
        <div className="metrics-compact">
          <Panel paddingY="3" paddingX="4">
            <CompactMetricsBar websiteId={websiteId} />
          </Panel>
        </div>

        {/* Minimized Chart Strip */}
        <div className="chart-strip">
          <Panel paddingY="3" paddingX="4" style={{ maxHeight: '180px', overflow: 'hidden' }}>
            <Row alignItems="center" gap="3" marginBottom="2">
              <Text size="1" style={{ color: 'var(--base-color-8)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Traffic Overview
              </Text>
              <div style={{ flex: 1, height: '1px', background: 'var(--base-color-3)' }} />
            </Row>
            <div style={{ height: '120px' }}>
              <WebsiteChart websiteId={websiteId} />
            </div>
          </Panel>
        </div>

        {/* Main Data Tables Grid */}
        <Column gap="6">
          {/* Pages Section - Full Width */}
          <TableSection title="Page Analytics" count={20} delay={100}>
            <Grid columns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }} gap="3">
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.path)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="path"
                  title={formatMessage(labels.path)}
                  {...tableProps}
                />
              </Panel>
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.entry)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="entry"
                  title={formatMessage(labels.entry)}
                  {...tableProps}
                />
              </Panel>
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.exit)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="exit"
                  title={formatMessage(labels.exit)}
                  {...tableProps}
                />
              </Panel>
            </Grid>
          </TableSection>

          {/* Sources Section */}
          <TableSection title="Traffic Sources" count={20} delay={200}>
            <Grid columns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap="3">
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.referrers)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="referrer"
                  title={formatMessage(labels.referrer)}
                  {...tableProps}
                />
              </Panel>
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.channels)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="channel"
                  title={formatMessage(labels.channel)}
                  {...tableProps}
                />
              </Panel>
            </Grid>
          </TableSection>

          {/* Environment Section */}
          <TableSection title="Visitor Environment" count={20} delay={300}>
            <Grid columns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }} gap="3">
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.browsers)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="browser"
                  title={formatMessage(labels.browser)}
                  {...tableProps}
                />
              </Panel>
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.os)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="os"
                  title={formatMessage(labels.os)}
                  {...tableProps}
                />
              </Panel>
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.devices)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="device"
                  title={formatMessage(labels.device)}
                  {...tableProps}
                />
              </Panel>
            </Grid>
          </TableSection>

          {/* Location Section */}
          <TableSection title="Geographic Distribution" count={20} delay={400}>
            <Grid columns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }} gap="3">
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.countries)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="country"
                  title={formatMessage(labels.country)}
                  {...tableProps}
                />
              </Panel>
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.regions)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="region"
                  title={formatMessage(labels.region)}
                  {...tableProps}
                />
              </Panel>
              <Panel paddingY="4" paddingX="4">
                <Row alignItems="center" gap="2" marginBottom="3">
                  <Text size="2" style={{ fontWeight: 600, color: 'var(--base-color-10)' }}>
                    {formatMessage(labels.cities)}
                  </Text>
                </Row>
                <MetricsTable
                  websiteId={websiteId}
                  type="city"
                  title={formatMessage(labels.city)}
                  {...tableProps}
                />
              </Panel>
            </Grid>
          </TableSection>
        </Column>
      </Column>
    </>
  );
}
