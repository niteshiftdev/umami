'use client';

import { Column, Grid, Row, Text, Heading } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { WorldMap } from '@/components/metrics/WorldMap';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { MetricCard } from '@/components/metrics/MetricCard';
import { WebsiteChart } from '../../WebsiteChart';
import { WebsiteControls } from '../../WebsiteControls';
import { useMessages, useDateRange } from '@/components/hooks';
import { useWebsiteStatsQuery } from '@/components/hooks/queries/useWebsiteStatsQuery';
import { formatShortTime, formatLongNumber } from '@/lib/format';
import { useParams } from 'next/navigation';

function CompactMetricsRow({ websiteId }: { websiteId: string }) {
  const { isAllTime } = useDateRange();
  const { formatMessage, labels } = useMessages();
  const { data } = useWebsiteStatsQuery(websiteId);

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
          change:
            (Math.min(visits, bounces) / visits) * 100 -
            (Math.min(comparison.visits, comparison.bounces) / comparison.visits) * 100,
          formatValue: (n: number) => Math.round(+n) + '%',
          reverseColors: true,
        },
        {
          label: formatMessage(labels.visitDuration),
          value: totaltime / visits,
          change: totaltime / visits - comparison.totaltime / comparison.visits,
          formatValue: (n: number) =>
            `${+n < 0 ? '-' : ''}${formatShortTime(Math.abs(~~n), ['m', 's'], ' ')}`,
        },
      ]
    : null;

  if (!metrics) {
    return (
      <Grid columns="repeat(5, 1fr)" gap="2">
        {[...Array(5)].map((_, i) => (
          <Column
            key={i}
            paddingX="3"
            paddingY="2"
            borderRadius="2"
            backgroundColor
            border
            style={{
              minHeight: '70px',
              animation: 'pulse 1.5s ease-in-out infinite',
              opacity: 0.6,
            }}
          />
        ))}
      </Grid>
    );
  }

  return (
    <Grid columns={{ xs: 'repeat(2, 1fr)', md: 'repeat(5, 1fr)' }} gap="2">
      {metrics.map(({ label, value, change, formatValue, reverseColors }, index) => (
        <Column
          key={label}
          paddingX="3"
          paddingY="2"
          borderRadius="2"
          backgroundColor
          border
          style={{
            animation: `fadeSlideIn 0.3s ease-out ${index * 0.05}s both`,
          }}
        >
          <Text size="1" weight="medium" color="muted">
            {label}
          </Text>
          <Text size="5" weight="bold">
            {formatValue(value)}
          </Text>
          {!isAllTime && change !== 0 && (
            <Text
              size="1"
              style={{
                color: reverseColors
                  ? change > 0
                    ? 'var(--color-red-500)'
                    : 'var(--color-green-500)'
                  : change > 0
                    ? 'var(--color-green-500)'
                    : 'var(--color-red-500)',
              }}
            >
              {change > 0 ? '+' : ''}
              {Math.round(((change) / (value - change)) * 100) || 0}%
            </Text>
          )}
        </Column>
      ))}
    </Grid>
  );
}

function CompactPanel({
  title,
  children,
  delay = 0,
  minHeight = '280px',
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
  minHeight?: string;
}) {
  return (
    <Column
      paddingY="3"
      paddingX="3"
      border
      borderRadius="2"
      backgroundColor
      gap="2"
      style={{
        minHeight,
        animation: `fadeSlideIn 0.4s ease-out ${delay}s both`,
      }}
    >
      <Row alignItems="center" justifyContent="space-between">
        <Heading size="1" weight="semibold">
          {title}
        </Heading>
      </Row>
      <Row border="bottom" style={{ marginBottom: '4px' }} />
      {children}
    </Column>
  );
}

export default function CompactGridDashboard() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const { formatMessage, labels } = useMessages();

  const compactTableProps = {
    websiteId,
    limit: 5,
    allowDownload: false,
    showMore: true,
    metric: formatMessage(labels.visitors),
  };

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
      <Column gap="3" paddingY="4" paddingX={{ xs: '2', md: '4' }}>
        {/* Header Controls */}
        <Row
          style={{
            animation: 'fadeSlideIn 0.3s ease-out both',
          }}
        >
          <WebsiteControls websiteId={websiteId} />
        </Row>

        {/* Compact Metrics Bar */}
        <CompactMetricsRow websiteId={websiteId} />

        {/* Compact Chart - Reduced Height */}
        <Column
          border
          borderRadius="2"
          backgroundColor
          paddingX="3"
          paddingY="2"
          style={{
            height: '180px',
            animation: 'fadeSlideIn 0.35s ease-out 0.1s both',
          }}
        >
          <WebsiteChart websiteId={websiteId} />
        </Column>

        {/* Main 4-Column Grid */}
        <Grid
          columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap="2"
        >
          {/* Pages */}
          <CompactPanel title={formatMessage(labels.pages)} delay={0.15}>
            <MetricsTable
              type="path"
              title={formatMessage(labels.path)}
              {...compactTableProps}
            />
          </CompactPanel>

          {/* Referrers */}
          <CompactPanel title={formatMessage(labels.referrers)} delay={0.2}>
            <MetricsTable
              type="referrer"
              title={formatMessage(labels.referrer)}
              {...compactTableProps}
            />
          </CompactPanel>

          {/* Browsers */}
          <CompactPanel title={formatMessage(labels.browsers)} delay={0.25}>
            <MetricsTable
              type="browser"
              title={formatMessage(labels.browser)}
              {...compactTableProps}
            />
          </CompactPanel>

          {/* Countries */}
          <CompactPanel title={formatMessage(labels.countries)} delay={0.3}>
            <MetricsTable
              type="country"
              title={formatMessage(labels.country)}
              {...compactTableProps}
            />
          </CompactPanel>
        </Grid>

        {/* Secondary 3-Column Grid */}
        <Grid
          columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap="2"
        >
          {/* Entry Pages */}
          <CompactPanel title={formatMessage(labels.entry)} delay={0.35} minHeight="240px">
            <MetricsTable
              type="entry"
              title={formatMessage(labels.path)}
              {...compactTableProps}
            />
          </CompactPanel>

          {/* Exit Pages */}
          <CompactPanel title={formatMessage(labels.exit)} delay={0.4} minHeight="240px">
            <MetricsTable
              type="exit"
              title={formatMessage(labels.path)}
              {...compactTableProps}
            />
          </CompactPanel>

          {/* Devices */}
          <CompactPanel title={formatMessage(labels.devices)} delay={0.45} minHeight="240px">
            <MetricsTable
              type="device"
              title={formatMessage(labels.device)}
              {...compactTableProps}
            />
          </CompactPanel>
        </Grid>

        {/* Bottom Row - Map and Traffic Heatmap */}
        <Grid
          columns={{ xs: '1fr', md: '1fr 1fr' }}
          gap="2"
        >
          {/* Compact World Map */}
          <Column
            border
            borderRadius="2"
            backgroundColor
            style={{
              height: '300px',
              overflow: 'hidden',
              animation: 'fadeSlideIn 0.4s ease-out 0.5s both',
            }}
          >
            <WorldMap websiteId={websiteId} />
          </Column>

          {/* Weekly Traffic Heatmap - Compact */}
          <CompactPanel title={formatMessage(labels.traffic)} delay={0.55} minHeight="300px">
            <Column style={{ transform: 'scale(0.85)', transformOrigin: 'top left' }}>
              <WeeklyTraffic websiteId={websiteId} />
            </Column>
          </CompactPanel>
        </Grid>

        {/* Tertiary Row - OS, Regions, Cities, Channels */}
        <Grid
          columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap="2"
        >
          <CompactPanel title={formatMessage(labels.os)} delay={0.6} minHeight="220px">
            <MetricsTable
              type="os"
              title={formatMessage(labels.os)}
              {...compactTableProps}
            />
          </CompactPanel>

          <CompactPanel title={formatMessage(labels.regions)} delay={0.65} minHeight="220px">
            <MetricsTable
              type="region"
              title={formatMessage(labels.region)}
              {...compactTableProps}
            />
          </CompactPanel>

          <CompactPanel title={formatMessage(labels.cities)} delay={0.7} minHeight="220px">
            <MetricsTable
              type="city"
              title={formatMessage(labels.city)}
              {...compactTableProps}
            />
          </CompactPanel>

          <CompactPanel title={formatMessage(labels.channels)} delay={0.75} minHeight="220px">
            <MetricsTable
              type="channel"
              title={formatMessage(labels.channel)}
              {...compactTableProps}
            />
          </CompactPanel>
        </Grid>
      </Column>
    </>
  );
}
