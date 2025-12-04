'use client';

import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { useMessages, useWebsiteMetricsQuery, useCountryNames, useLocale } from '@/components/hooks';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { WorldMap } from '@/components/metrics/WorldMap';
import { Grid, Heading, Row, Column, Tab, TabList, TabPanel, Tabs, Text } from '@umami/react-zen';
import { WebsiteControls } from '../../WebsiteControls';
import { WebsiteMetricsBar } from '../../WebsiteMetricsBar';
import { WebsiteChart } from '../../WebsiteChart';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { percentFilter } from '@/lib/filters';
import { formatLongNumber } from '@/lib/format';

// Inline styles for animations
const fadeInStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(20, 122, 243, 0);
    }
    50% {
      box-shadow: 0 0 20px 4px rgba(20, 122, 243, 0.15);
    }
  }

  .map-hero-animate-1 {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
  }

  .map-hero-animate-2 {
    animation: fadeInUp 0.5s ease-out 0.1s forwards;
    opacity: 0;
  }

  .map-hero-animate-3 {
    animation: fadeInUp 0.5s ease-out 0.2s forwards;
    opacity: 0;
  }

  .map-hero-animate-4 {
    animation: fadeInUp 0.5s ease-out 0.3s forwards;
    opacity: 0;
  }

  .map-hero-animate-5 {
    animation: fadeInUp 0.5s ease-out 0.4s forwards;
    opacity: 0;
  }

  .map-hero-glow {
    animation: pulseGlow 3s ease-in-out infinite;
  }

  .country-row {
    transition: background-color 0.2s ease, transform 0.15s ease;
    cursor: pointer;
  }

  .country-row:hover {
    background-color: var(--base-color-3);
    transform: translateX(4px);
  }
`;

// Country flag emoji helper
function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Country overlay component showing top countries
function CountryOverlay({ websiteId }: { websiteId: string }) {
  const { formatMessage, labels } = useMessages();
  const { locale } = useLocale();
  const { countryNames } = useCountryNames(locale);

  const { data } = useWebsiteMetricsQuery(websiteId, {
    type: 'country',
    limit: 8,
  });

  const metrics = useMemo(() => {
    if (!data) return [];
    return percentFilter(data as any[]).map((item: any) => ({
      code: item.x,
      name: countryNames[item.x] || item.x,
      visitors: item.y,
      percent: item.z,
    }));
  }, [data, countryNames]);

  const totalVisitors = useMemo(() => {
    return metrics.reduce((sum, item) => sum + item.visitors, 0);
  }, [metrics]);

  return (
    <Column
      gap="3"
      style={{
        position: 'absolute',
        top: 'var(--spacing-4)',
        right: 'var(--spacing-4)',
        width: '280px',
        backgroundColor: 'var(--base-color-1)',
        border: '1px solid var(--base-color-5)',
        borderRadius: 'var(--border-radius-3)',
        padding: 'var(--spacing-4)',
        zIndex: 10,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}
    >
      <Row justifyContent="space-between" alignItems="center">
        <Text size="2" weight="bold" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {formatMessage(labels.countries)}
        </Text>
        <Text size="1" style={{
          backgroundColor: 'var(--base-color-3)',
          padding: '2px 8px',
          borderRadius: 'var(--border-radius-2)',
          fontWeight: 500
        }}>
          {formatLongNumber(totalVisitors)} total
        </Text>
      </Row>

      <Column gap="1">
        {metrics.map((country, index) => (
          <Row
            key={country.code}
            className="country-row"
            justifyContent="space-between"
            alignItems="center"
            paddingY="2"
            paddingX="2"
            borderRadius="2"
            style={{
              animationDelay: `${0.3 + index * 0.05}s`,
            }}
          >
            <Row gap="2" alignItems="center">
              <Text size="4">{getCountryFlag(country.code)}</Text>
              <Text size="2" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {country.name}
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <Text size="2" weight="medium">
                {formatLongNumber(country.visitors)}
              </Text>
              <div
                style={{
                  width: '40px',
                  height: '4px',
                  backgroundColor: 'var(--base-color-4)',
                  borderRadius: 'var(--border-radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${country.percent}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: 'var(--border-radius-full)',
                    transition: 'width 0.5s ease-out',
                  }}
                />
              </div>
            </Row>
          </Row>
        ))}
      </Column>
    </Column>
  );
}

// Live traffic indicator
function LiveIndicator() {
  return (
    <Row
      gap="2"
      alignItems="center"
      style={{
        position: 'absolute',
        top: 'var(--spacing-4)',
        left: 'var(--spacing-4)',
        backgroundColor: 'var(--base-color-1)',
        border: '1px solid var(--base-color-5)',
        borderRadius: 'var(--border-radius-full)',
        padding: 'var(--spacing-2) var(--spacing-4)',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#30a46c',
          animation: 'pulseGlow 2s ease-in-out infinite',
        }}
      />
      <Text size="1" weight="medium" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Live Traffic
      </Text>
    </Row>
  );
}

export default function MapHeroPage() {
  const params = useParams();
  const websiteId = params.websiteId as string;
  const { formatMessage, labels } = useMessages();

  const tableProps = {
    websiteId,
    limit: 8,
    allowDownload: false,
    showMore: true,
    metric: formatMessage(labels.visitors),
  };

  return (
    <>
      <style>{fadeInStyles}</style>
      <Column gap="4">
        {/* Controls */}
        <div className="map-hero-animate-1">
          <WebsiteControls websiteId={websiteId} />
        </div>

        {/* Metrics summary bar */}
        <div className="map-hero-animate-2">
          <WebsiteMetricsBar websiteId={websiteId} />
        </div>

        {/* Hero Map Section - Full width, prominent */}
        <div className="map-hero-animate-3 map-hero-glow">
          <Panel
            paddingX="0"
            paddingY="0"
            style={{
              position: 'relative',
              minHeight: '520px',
              overflow: 'hidden',
            }}
          >
            <LiveIndicator />
            <CountryOverlay websiteId={websiteId} />
            <div style={{ height: '520px' }}>
              <WorldMap websiteId={websiteId} />
            </div>
          </Panel>
        </div>

        {/* Chart + Weekly Traffic side by side below map */}
        <div className="map-hero-animate-4">
          <GridRow layout="two-one">
            <Panel gridColumn={{ xs: 'span 1', md: 'span 2' }}>
              <Heading size="3" style={{ fontWeight: 600 }}>
                {formatMessage(labels.pageviews)}
              </Heading>
              <Row border="bottom" marginBottom="4" />
              <WebsiteChart websiteId={websiteId} />
            </Panel>
            <Panel>
              <Heading size="3" style={{ fontWeight: 600 }}>
                {formatMessage(labels.traffic)}
              </Heading>
              <Row border="bottom" marginBottom="4" />
              <WeeklyTraffic websiteId={websiteId} />
            </Panel>
          </GridRow>
        </div>

        {/* Compact 3-column grid for remaining tables */}
        <div className="map-hero-animate-5">
          <Grid
            columns={{ xs: '1fr', lg: 'repeat(3, 1fr)' }}
            gap="3"
          >
            {/* Pages Panel */}
            <Panel style={{ minHeight: '450px' }}>
              <Heading size="3" style={{ fontWeight: 600 }}>
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

            {/* Sources Panel */}
            <Panel style={{ minHeight: '450px' }}>
              <Heading size="3" style={{ fontWeight: 600 }}>
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

            {/* Environment Panel */}
            <Panel style={{ minHeight: '450px' }}>
              <Heading size="3" style={{ fontWeight: 600 }}>
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
          </Grid>
        </div>

        {/* Location breakdown - more prominent since this is geo-focused */}
        <div className="map-hero-animate-5" style={{ animationDelay: '0.5s' }}>
          <GridRow layout="two">
            <Panel style={{ minHeight: '450px' }}>
              <Row justifyContent="space-between" alignItems="center" marginBottom="3">
                <Heading size="3" style={{ fontWeight: 600 }}>
                  {formatMessage(labels.regions)}
                </Heading>
                <Text size="1" style={{
                  backgroundColor: 'var(--base-color-3)',
                  padding: '2px 8px',
                  borderRadius: 'var(--border-radius-2)',
                  fontWeight: 500
                }}>Geographic Detail</Text>
              </Row>
              <MetricsTable
                websiteId={websiteId}
                type="region"
                title={formatMessage(labels.region)}
                limit={12}
                showMore={true}
                metric={formatMessage(labels.visitors)}
              />
            </Panel>
            <Panel style={{ minHeight: '450px' }}>
              <Row justifyContent="space-between" alignItems="center" marginBottom="3">
                <Heading size="3" style={{ fontWeight: 600 }}>
                  {formatMessage(labels.cities)}
                </Heading>
                <Text size="1" style={{
                  backgroundColor: 'var(--base-color-3)',
                  padding: '2px 8px',
                  borderRadius: 'var(--border-radius-2)',
                  fontWeight: 500
                }}>Geographic Detail</Text>
              </Row>
              <MetricsTable
                websiteId={websiteId}
                type="city"
                title={formatMessage(labels.city)}
                limit={12}
                showMore={true}
                metric={formatMessage(labels.visitors)}
              />
            </Panel>
          </GridRow>
        </div>
      </Column>
    </>
  );
}
