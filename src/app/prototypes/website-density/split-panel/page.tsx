'use client';
import { Column, Row, Text, Heading, Grid } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';

// Sample data
const sampleMetrics = {
  visitors: 45231,
  views: 67892,
  visits: 52104,
  bounceRate: 42,
  duration: '3m 24s',
};

const sampleCountries = [
  { name: 'United States', code: 'US', percentage: 45, visitors: 20354 },
  { name: 'United Kingdom', code: 'UK', percentage: 12, visitors: 5428 },
  { name: 'Germany', code: 'DE', percentage: 8, visitors: 3618 },
  { name: 'France', code: 'FR', percentage: 6, visitors: 2714 },
  { name: 'Canada', code: 'CA', percentage: 5, visitors: 2262 },
];

const samplePages = [
  { path: '/home', visitors: 12543, views: 18234, bounce: 38 },
  { path: '/products', visitors: 8921, views: 15432, bounce: 45 },
  { path: '/about', visitors: 5234, views: 7123, bounce: 52 },
  { path: '/pricing', visitors: 4123, views: 6234, bounce: 41 },
  { path: '/contact', visitors: 3456, views: 4567, bounce: 48 },
  { path: '/blog', visitors: 2987, views: 5234, bounce: 35 },
  { path: '/features', visitors: 2145, views: 3456, bounce: 43 },
  { path: '/docs', visitors: 1876, views: 4123, bounce: 28 },
];

const sampleReferrers = [
  { source: 'google.com', visitors: 15234, views: 23456 },
  { source: 'Direct', visitors: 12456, views: 18234 },
  { source: 'facebook.com', visitors: 8234, views: 12456 },
  { source: 'twitter.com', visitors: 4567, views: 7123 },
  { source: 'linkedin.com', visitors: 3456, views: 5234 },
  { source: 'reddit.com', visitors: 2345, views: 3456 },
];

const sampleBrowsers = [
  { name: 'Chrome', visitors: 28456, percentage: 63 },
  { name: 'Safari', visitors: 9046, percentage: 20 },
  { name: 'Firefox', visitors: 4523, percentage: 10 },
  { name: 'Edge', visitors: 2262, percentage: 5 },
  { name: 'Other', visitors: 904, percentage: 2 },
];

const sampleDevices = [
  { name: 'Desktop', visitors: 31639, percentage: 70 },
  { name: 'Mobile', visitors: 11308, percentage: 25 },
  { name: 'Tablet', visitors: 2262, percentage: 5 },
];

// Metric Card Component
function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Column
      paddingX="4"
      paddingY="3"
      borderRadius="2"
      backgroundColor
      border
      gap="1"
    >
      <Text size="1" weight="medium" style={{ opacity: 0.7 }}>
        {label}
      </Text>
      <Text size="6" weight="bold">
        {value.toLocaleString()}
      </Text>
    </Column>
  );
}

// Country List Item Component
function CountryItem({ name, code, percentage, visitors }: any) {
  return (
    <Row justifyContent="space-between" alignItems="center" paddingY="2">
      <Row gap="2" alignItems="center">
        <Text size="2" weight="medium">{code}</Text>
        <Text size="1" style={{ opacity: 0.8 }}>{name}</Text>
      </Row>
      <Row gap="3" alignItems="center">
        <Text size="1" weight="medium">{percentage}%</Text>
        <Text size="1" style={{ opacity: 0.7 }}>{visitors.toLocaleString()}</Text>
      </Row>
    </Row>
  );
}

// Table Component
function DataTable({ title, columns, data }: any) {
  return (
    <Panel>
      <Heading size="3" weight="bold" style={{ marginBottom: '16px' }}>
        {title}
      </Heading>
      <Column gap="0">
        {/* Header */}
        <Row
          paddingY="2"
          paddingX="3"
          style={{
            borderBottom: '1px solid var(--base6)',
            backgroundColor: 'var(--base2)'
          }}
        >
          {columns.map((col: any) => (
            <Text
              key={col.key}
              size="1"
              weight="bold"
              style={{
                flex: col.flex || 1,
                opacity: 0.7,
                textAlign: col.align || 'left'
              }}
            >
              {col.label}
            </Text>
          ))}
        </Row>
        {/* Rows */}
        {data.map((row: any, idx: number) => (
          <Row
            key={idx}
            paddingY="2"
            paddingX="3"
            style={{
              borderBottom: idx < data.length - 1 ? '1px solid var(--base4)' : 'none'
            }}
          >
            {columns.map((col: any) => (
              <Text
                key={col.key}
                size="2"
                style={{
                  flex: col.flex || 1,
                  textAlign: col.align || 'left'
                }}
              >
                {col.render ? col.render(row[col.key]) : row[col.key]}
              </Text>
            ))}
          </Row>
        ))}
      </Column>
    </Panel>
  );
}

// Chart Placeholder Component
function ChartPlaceholder() {
  return (
    <Column
      style={{
        height: '300px',
        backgroundColor: 'var(--base2)',
        border: '1px solid var(--base6)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Text size="4" weight="medium" style={{ opacity: 0.5 }}>
        Chart Area
      </Text>
      <Text size="2" style={{ opacity: 0.4, marginTop: '8px' }}>
        Traffic visualization over time
      </Text>
    </Column>
  );
}

export default function SplitPanelPage() {
  return (
    <Row
      style={{
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Fixed Sidebar */}
      <Column
        style={{
          width: '300px',
          minWidth: '300px',
          backgroundColor: 'var(--base2)',
          borderRight: '1px solid var(--base6)',
          height: '100vh',
          overflow: 'auto',
          padding: '24px 16px'
        }}
        gap="3"
      >
        {/* KPI Metrics */}
        <Column gap="3">
          <Heading size="2" weight="bold" style={{ marginBottom: '8px' }}>
            Key Metrics
          </Heading>
          <MetricCard label="Visitors" value={sampleMetrics.visitors} />
          <MetricCard label="Views" value={sampleMetrics.views} />
          <MetricCard label="Visits" value={sampleMetrics.visits} />
          <MetricCard label="Bounce Rate" value={`${sampleMetrics.bounceRate}%`} />
          <MetricCard label="Avg. Duration" value={sampleMetrics.duration} />
        </Column>

        {/* Top Countries */}
        <Column
          gap="2"
          style={{
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--base6)'
          }}
        >
          <Heading size="2" weight="bold" style={{ marginBottom: '8px' }}>
            Top Countries
          </Heading>
          <Column gap="0">
            {sampleCountries.map((country) => (
              <CountryItem key={country.code} {...country} />
            ))}
          </Column>
        </Column>

        {/* Map Placeholder */}
        <Column
          style={{
            marginTop: '24px',
            padding: '24px',
            backgroundColor: 'var(--base3)',
            borderRadius: '8px',
            border: '1px solid var(--base6)',
            height: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text size="2" weight="medium" style={{ opacity: 0.5 }}>
            World Map
          </Text>
          <Text size="1" style={{ opacity: 0.4, marginTop: '8px' }}>
            Geographic distribution
          </Text>
        </Column>
      </Column>

      {/* Main Content Area */}
      <Column
        style={{
          flex: 1,
          height: '100vh',
          overflow: 'auto',
          padding: '24px 32px'
        }}
        gap="4"
      >
        {/* Header */}
        <Column gap="2" style={{ marginBottom: '8px' }}>
          <Heading size="6" weight="bold">
            Website Analytics
          </Heading>
          <Text size="2" style={{ opacity: 0.7 }}>
            Split-panel layout with persistent KPI sidebar
          </Text>
        </Column>

        {/* Chart */}
        <ChartPlaceholder />

        {/* Tables in 2-column grid */}
        <Grid columns={{ xs: 1, md: 2 }} gap="4">
          {/* Pages Table */}
          <DataTable
            title="Pages"
            columns={[
              { key: 'path', label: 'Path', flex: 2 },
              { key: 'visitors', label: 'Visitors', align: 'right', render: (v: number) => v.toLocaleString() },
              { key: 'views', label: 'Views', align: 'right', render: (v: number) => v.toLocaleString() },
            ]}
            data={samplePages}
          />

          {/* Referrers Table */}
          <DataTable
            title="Referrers"
            columns={[
              { key: 'source', label: 'Source', flex: 2 },
              { key: 'visitors', label: 'Visitors', align: 'right', render: (v: number) => v.toLocaleString() },
              { key: 'views', label: 'Views', align: 'right', render: (v: number) => v.toLocaleString() },
            ]}
            data={sampleReferrers}
          />

          {/* Browsers Table */}
          <DataTable
            title="Browsers"
            columns={[
              { key: 'name', label: 'Browser', flex: 2 },
              { key: 'visitors', label: 'Visitors', align: 'right', render: (v: number) => v.toLocaleString() },
              { key: 'percentage', label: 'Share', align: 'right', render: (v: number) => `${v}%` },
            ]}
            data={sampleBrowsers}
          />

          {/* Devices Table */}
          <DataTable
            title="Devices"
            columns={[
              { key: 'name', label: 'Device', flex: 2 },
              { key: 'visitors', label: 'Visitors', align: 'right', render: (v: number) => v.toLocaleString() },
              { key: 'percentage', label: 'Share', align: 'right', render: (v: number) => `${v}%` },
            ]}
            data={sampleDevices}
          />
        </Grid>

        {/* Footer spacing */}
        <Column style={{ height: '24px' }} />
      </Column>
    </Row>
  );
}
