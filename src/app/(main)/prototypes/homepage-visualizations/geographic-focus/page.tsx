'use client';

import { Column, Row, Grid, Text, Heading, Tab, TabList, TabPanel, Tabs } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { GridRow } from '@/components/common/GridRow';
import { WorldMap } from '@/components/metrics/WorldMap';
import { WeeklyTraffic } from '@/components/metrics/WeeklyTraffic';
import { MetricsTable } from '@/components/metrics/MetricsTable';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { formatLongNumber } from '@/lib/format';

// Prototype demo website ID
const DEMO_WEBSITE_ID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

// Sample geographic metrics data for the prototype
const geoMetrics = {
  totalCountries: 47,
  topCountryPercent: 32,
  geographicDiversity: 0.78,
  uniqueRegions: 156,
  uniqueCities: 892,
  internationalPercent: 68,
};

// Sample visitor metrics
const visitorMetrics = {
  visitors: 28439,
  visits: 41256,
  pageviews: 124892,
  bounceRate: 42,
  avgDuration: 185,
};

export default function GeographicFocusPage() {
  return (
    <Column gap="4" style={{ padding: 'var(--spacing-4)' }}>
      {/* Page Header */}
      <Row
        justifyContent="space-between"
        alignItems="center"
        style={{
          animation: 'fadeSlideIn 0.4s ease-out forwards',
          opacity: 0,
        }}
      >
        <Column gap="1">
          <Heading size="6">Geographic Analytics</Heading>
          <Text color="muted" size="2">
            Visitor distribution and regional traffic patterns
          </Text>
        </Column>
        <Row gap="3">
          <Text size="1" color="muted">
            Last 30 days
          </Text>
        </Row>
      </Row>

      {/* Compact Geographic Metrics Bar */}
      <div
        style={{
          animation: 'fadeSlideIn 0.4s ease-out forwards',
          animationDelay: '0.1s',
          opacity: 0,
        }}
      >
        <MetricsBar>
          <MetricCard
            value={geoMetrics.totalCountries}
            label="Countries"
            formatValue={n => `${Math.round(n)}`}
          />
          <MetricCard
            value={geoMetrics.uniqueRegions}
            label="Regions"
            formatValue={n => `${Math.round(n)}`}
          />
          <MetricCard
            value={geoMetrics.uniqueCities}
            label="Cities"
            formatValue={n => formatLongNumber(n)}
          />
          <MetricCard
            value={geoMetrics.topCountryPercent}
            label="Top Country"
            formatValue={n => `${Math.round(n)}%`}
          />
          <MetricCard
            value={geoMetrics.internationalPercent}
            label="International"
            formatValue={n => `${Math.round(n)}%`}
          />
        </MetricsBar>
      </div>

      {/* Main Geographic Layout: Map Hero + Location Sidebar */}
      <Grid
        columns={{ xs: '1fr', lg: '2fr 1fr' }}
        gap="3"
        style={{
          animation: 'fadeSlideIn 0.5s ease-out forwards',
          animationDelay: '0.2s',
          opacity: 0,
        }}
      >
        {/* Large World Map - Hero Element */}
        <Panel
          title="Visitor Distribution"
          allowFullscreen
          minHeight="520px"
          style={{
            gridRow: { xs: 'auto', lg: 'span 2' } as any,
          }}
        >
          <Column style={{ flex: 1, minHeight: '460px' }}>
            <WorldMap websiteId={DEMO_WEBSITE_ID} />
          </Column>
          {/* Map Legend */}
          <Row gap="4" justifyContent="center" paddingY="3">
            <Row gap="2" alignItems="center">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 'var(--border-radius-1)',
                  backgroundColor: 'var(--base-color-3)',
                }}
              />
              <Text size="1" color="muted">
                No visitors
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 'var(--border-radius-1)',
                  backgroundColor: 'var(--color-blue)',
                  opacity: 0.4,
                }}
              />
              <Text size="1" color="muted">
                Low traffic
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 'var(--border-radius-1)',
                  backgroundColor: 'var(--color-blue)',
                  opacity: 0.7,
                }}
              />
              <Text size="1" color="muted">
                Medium traffic
              </Text>
            </Row>
            <Row gap="2" alignItems="center">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 'var(--border-radius-1)',
                  backgroundColor: 'var(--color-blue)',
                }}
              />
              <Text size="1" color="muted">
                High traffic
              </Text>
            </Row>
          </Row>
        </Panel>

        {/* Location Breakdown Sidebar */}
        <Panel minHeight="520px">
          <Heading size="2">Location Breakdown</Heading>
          <Tabs>
            <TabList>
              <Tab id="country">Countries</Tab>
              <Tab id="region">Regions</Tab>
              <Tab id="city">Cities</Tab>
            </TabList>
            <TabPanel id="country">
              <MetricsTable
                websiteId={DEMO_WEBSITE_ID}
                type="country"
                title="Country"
                limit={10}
                showMore={true}
                metric="Visitors"
              />
            </TabPanel>
            <TabPanel id="region">
              <MetricsTable
                websiteId={DEMO_WEBSITE_ID}
                type="region"
                title="Region"
                limit={10}
                showMore={true}
                metric="Visitors"
              />
            </TabPanel>
            <TabPanel id="city">
              <MetricsTable
                websiteId={DEMO_WEBSITE_ID}
                type="city"
                title="City"
                limit={10}
                showMore={true}
                metric="Visitors"
              />
            </TabPanel>
          </Tabs>
        </Panel>
      </Grid>

      {/* Traffic Patterns Section */}
      <GridRow
        layout="two"
        style={{
          animation: 'fadeSlideIn 0.5s ease-out forwards',
          animationDelay: '0.35s',
          opacity: 0,
        }}
      >
        {/* Weekly Traffic Heatmap */}
        <Panel minHeight="450px">
          <Heading size="2">Global Activity Patterns</Heading>
          <Text size="1" color="muted" style={{ marginBottom: 'var(--spacing-3)' }}>
            When visitors from around the world are most active
          </Text>
          <Row border="bottom" marginBottom="4" />
          <WeeklyTraffic websiteId={DEMO_WEBSITE_ID} />
        </Panel>

        {/* Regional Summary Stats */}
        <Panel minHeight="450px">
          <Heading size="2">Regional Summary</Heading>
          <Text size="1" color="muted" style={{ marginBottom: 'var(--spacing-3)' }}>
            Traffic distribution by continent
          </Text>
          <Row border="bottom" marginBottom="4" />
          <Column gap="3" style={{ flex: 1 }}>
            <RegionRow name="North America" visitors={9123} percent={32} color="var(--color-blue)" />
            <RegionRow name="Europe" visitors={7954} percent={28} color="var(--color-indigo)" />
            <RegionRow name="Asia" visitors={5688} percent={20} color="var(--color-green)" />
            <RegionRow
              name="South America"
              visitors={2844}
              percent={10}
              color="var(--color-orange, #f76707)"
            />
            <RegionRow
              name="Oceania"
              visitors={1706}
              percent={6}
              color="var(--color-pink, #e64980)"
            />
            <RegionRow
              name="Africa"
              visitors={853}
              percent={3}
              color="var(--color-cyan, #0ea5e9)"
            />
            <RegionRow name="Other" visitors={271} percent={1} color="var(--base-color-7)" />
          </Column>
        </Panel>
      </GridRow>

      {/* Standard Metrics (De-emphasized) */}
      <div
        style={{
          animation: 'fadeSlideIn 0.5s ease-out forwards',
          animationDelay: '0.5s',
          opacity: 0,
        }}
      >
        <Column gap="2" style={{ opacity: 0.85 }}>
          <Text size="1" color="muted" weight="semibold" style={{ textTransform: 'uppercase' }}>
            Overall Metrics
          </Text>
          <MetricsBar>
            <MetricCard
              value={visitorMetrics.visitors}
              label="Visitors"
              formatValue={formatLongNumber}
            />
            <MetricCard
              value={visitorMetrics.visits}
              label="Visits"
              formatValue={formatLongNumber}
            />
            <MetricCard
              value={visitorMetrics.pageviews}
              label="Pageviews"
              formatValue={formatLongNumber}
            />
            <MetricCard
              value={visitorMetrics.bounceRate}
              label="Bounce Rate"
              formatValue={n => `${Math.round(n)}%`}
            />
          </MetricsBar>
        </Column>
      </div>

      {/* Supporting Data Tables (Minimized) */}
      <GridRow
        layout="three"
        style={{
          animation: 'fadeSlideIn 0.5s ease-out forwards',
          animationDelay: '0.6s',
          opacity: 0,
        }}
      >
        <Panel minHeight="320px">
          <Heading size="2">Pages</Heading>
          <MetricsTable
            websiteId={DEMO_WEBSITE_ID}
            type="path"
            title="Path"
            limit={5}
            showMore={true}
            metric="Visitors"
          />
        </Panel>
        <Panel minHeight="320px">
          <Heading size="2">Referrers</Heading>
          <MetricsTable
            websiteId={DEMO_WEBSITE_ID}
            type="referrer"
            title="Referrer"
            limit={5}
            showMore={true}
            metric="Visitors"
          />
        </Panel>
        <Panel minHeight="320px">
          <Heading size="2">Browsers</Heading>
          <MetricsTable
            websiteId={DEMO_WEBSITE_ID}
            type="browser"
            title="Browser"
            limit={5}
            showMore={true}
            metric="Visitors"
          />
        </Panel>
      </GridRow>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Column>
  );
}

// Regional breakdown row component
function RegionRow({
  name,
  visitors,
  percent,
  color,
}: {
  name: string;
  visitors: number;
  percent: number;
  color: string;
}) {
  return (
    <Column gap="1">
      <Row justifyContent="space-between" alignItems="center">
        <Row gap="2" alignItems="center">
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 'var(--border-radius-1)',
              backgroundColor: color,
            }}
          />
          <Text size="2" weight="medium">
            {name}
          </Text>
        </Row>
        <Row gap="3">
          <Text size="2" color="muted">
            {formatLongNumber(visitors)}
          </Text>
          <Text size="2" weight="semibold" style={{ minWidth: '40px', textAlign: 'right' }}>
            {percent}%
          </Text>
        </Row>
      </Row>
      <div
        style={{
          height: 6,
          borderRadius: 'var(--border-radius-1)',
          backgroundColor: 'var(--base-color-3)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            backgroundColor: color,
            borderRadius: 'var(--border-radius-1)',
            transition: 'width 0.6s ease-out',
          }}
        />
      </div>
    </Column>
  );
}
