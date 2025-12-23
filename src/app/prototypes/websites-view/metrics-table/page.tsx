'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  Button,
  Icon,
  SearchField,
  Heading,
  DataTable,
  DataColumn,
} from '@umami/react-zen';
import {
  Globe,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Circle,
} from '@/components/icons';
import { Favicon } from '@/components/common/Favicon';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';

// Sample data with richer metrics
const sampleWebsites = [
  {
    id: '1',
    name: 'Acme Corp',
    domain: 'acme.com',
    visitors: 12847,
    pageviews: 45230,
    bounceRate: 42.3,
    avgDuration: 245,
    trend: 12.5,
    status: 'active',
    lastActivity: '2 min ago',
    sparkline: [30, 45, 38, 52, 48, 60, 55],
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'techstart.io',
    visitors: 8934,
    pageviews: 28104,
    bounceRate: 38.7,
    avgDuration: 312,
    trend: -3.2,
    status: 'active',
    lastActivity: '5 min ago',
    sparkline: [50, 48, 45, 42, 40, 38, 35],
  },
  {
    id: '3',
    name: 'E-Shop Store',
    domain: 'eshop.store',
    visitors: 34521,
    pageviews: 156780,
    bounceRate: 28.1,
    avgDuration: 423,
    trend: 28.7,
    status: 'active',
    lastActivity: '1 min ago',
    sparkline: [20, 25, 35, 45, 55, 70, 85],
  },
  {
    id: '4',
    name: 'Portfolio Site',
    domain: 'jane-doe.dev',
    visitors: 2341,
    pageviews: 5892,
    bounceRate: 55.2,
    avgDuration: 134,
    trend: 5.1,
    status: 'inactive',
    lastActivity: '3 hours ago',
    sparkline: [15, 18, 20, 19, 22, 24, 25],
  },
  {
    id: '5',
    name: 'SaaS Dashboard',
    domain: 'app.saasify.com',
    visitors: 18923,
    pageviews: 89234,
    bounceRate: 22.4,
    avgDuration: 534,
    trend: -1.8,
    status: 'active',
    lastActivity: '30 sec ago',
    sparkline: [60, 58, 62, 55, 58, 56, 54],
  },
  {
    id: '6',
    name: 'News Portal',
    domain: 'dailynews.net',
    visitors: 67234,
    pageviews: 234567,
    bounceRate: 65.8,
    avgDuration: 98,
    trend: 15.3,
    status: 'active',
    lastActivity: '10 sec ago',
    sparkline: [40, 50, 55, 65, 70, 80, 90],
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function MiniSparkline({ data, trend }: { data: number[]; trend: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;
  const isPositive = trend >= 0;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        fill="none"
        stroke={isPositive ? 'var(--green-color-600)' : 'var(--red-color-600)'}
        strokeWidth="1.5"
        points={points}
      />
    </svg>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const isActive = status === 'active';
  return (
    <Row alignItems="center" gap="2">
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: isActive ? 'var(--green-color-600)' : 'var(--base-color-400)',
        }}
      />
      <Text size="1" color={isActive ? 'success' : 'muted'}>
        {isActive ? 'Live' : 'Inactive'}
      </Text>
    </Row>
  );
}

function TrendBadge({ trend }: { trend: number }) {
  const isPositive = trend >= 0;
  return (
    <Row
      alignItems="center"
      gap="1"
      padding="1"
      paddingX="2"
      borderRadius="2"
      style={{
        backgroundColor: isPositive ? 'var(--green-color-100)' : 'var(--red-color-100)',
      }}
    >
      <Icon size="xs" color={isPositive ? 'success' : 'error'}>
        {isPositive ? <TrendingUp /> : <TrendingDown />}
      </Icon>
      <Text size="0" color={isPositive ? 'success' : 'error'} weight="medium">
        {isPositive ? '+' : ''}
        {trend}%
      </Text>
    </Row>
  );
}

export default function MetricsTableVariation() {
  const [search, setSearch] = useState('');

  const filteredWebsites = sampleWebsites.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.domain.toLowerCase().includes(search.toLowerCase()),
  );

  // Calculate totals
  const totalVisitors = sampleWebsites.reduce((sum, w) => sum + w.visitors, 0);
  const totalPageviews = sampleWebsites.reduce((sum, w) => sum + w.pageviews, 0);
  const avgBounceRate =
    sampleWebsites.reduce((sum, w) => sum + w.bounceRate, 0) / sampleWebsites.length;

  return (
    <PageBody>
      <Column gap="6" margin="2">
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="2"
          border="bottom"
        >
          <Column gap="2">
            <Heading size="4">Websites</Heading>
            <Text color="muted">Monitor all your tracked websites in one view</Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add website</Text>
          </Button>
        </Row>

        {/* Summary Stats */}
        <Row gap="4">
          <Column
            padding="4"
            border
            borderRadius="2"
            backgroundColor
            style={{ flex: 1 }}
          >
            <Text color="muted" size="1">
              Total Visitors (7d)
            </Text>
            <Text weight="bold" size="5">
              {formatNumber(totalVisitors)}
            </Text>
          </Column>
          <Column
            padding="4"
            border
            borderRadius="2"
            backgroundColor
            style={{ flex: 1 }}
          >
            <Text color="muted" size="1">
              Total Pageviews (7d)
            </Text>
            <Text weight="bold" size="5">
              {formatNumber(totalPageviews)}
            </Text>
          </Column>
          <Column
            padding="4"
            border
            borderRadius="2"
            backgroundColor
            style={{ flex: 1 }}
          >
            <Text color="muted" size="1">
              Avg Bounce Rate
            </Text>
            <Text weight="bold" size="5">
              {avgBounceRate.toFixed(1)}%
            </Text>
          </Column>
          <Column
            padding="4"
            border
            borderRadius="2"
            backgroundColor
            style={{ flex: 1 }}
          >
            <Text color="muted" size="1">
              Active Sites
            </Text>
            <Text weight="bold" size="5">
              {sampleWebsites.filter((w) => w.status === 'active').length}
            </Text>
          </Column>
        </Row>

        {/* Table */}
        <Panel>
          <Column gap="4">
            <Row alignItems="center" justifyContent="space-between">
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Search websites..."
                style={{ maxWidth: 300 }}
              />
            </Row>

            <DataTable data={filteredWebsites}>
              <DataColumn id="status" label="Status" width="80px">
                {(row: any) => <StatusIndicator status={row.status} />}
              </DataColumn>
              <DataColumn id="name" label="Website">
                {(row: any) => (
                  <Row alignItems="center" gap="3">
                    <Favicon domain={row.domain} />
                    <Column gap="0">
                      <Link href={`/websites/${row.id}`}>
                        <Text weight="medium">{row.name}</Text>
                      </Link>
                      <Text color="muted" size="0">
                        {row.domain}
                      </Text>
                    </Column>
                  </Row>
                )}
              </DataColumn>
              <DataColumn id="visitors" label="Visitors" width="100px" align="end">
                {(row: any) => <Text weight="medium">{formatNumber(row.visitors)}</Text>}
              </DataColumn>
              <DataColumn id="pageviews" label="Pageviews" width="100px" align="end">
                {(row: any) => <Text weight="medium">{formatNumber(row.pageviews)}</Text>}
              </DataColumn>
              <DataColumn id="bounce" label="Bounce" width="80px" align="end">
                {(row: any) => (
                  <Text color={row.bounceRate > 50 ? 'error' : undefined}>
                    {row.bounceRate}%
                  </Text>
                )}
              </DataColumn>
              <DataColumn id="duration" label="Avg Duration" width="100px" align="end">
                {(row: any) => <Text>{formatDuration(row.avgDuration)}</Text>}
              </DataColumn>
              <DataColumn id="trend" label="7d Trend" width="120px" align="center">
                {(row: any) => (
                  <Row alignItems="center" gap="3" justifyContent="center">
                    <MiniSparkline data={row.sparkline} trend={row.trend} />
                    <TrendBadge trend={row.trend} />
                  </Row>
                )}
              </DataColumn>
              <DataColumn id="activity" label="Last Activity" width="100px" align="end">
                {(row: any) => (
                  <Text color="muted" size="1">
                    {row.lastActivity}
                  </Text>
                )}
              </DataColumn>
              <DataColumn id="action" label="" width="40px" align="end">
                {(row: any) => (
                  <Link href={`/websites/${row.id}`}>
                    <Button variant="quiet" size="sm">
                      <Icon size="sm">
                        <ArrowUpRight />
                      </Icon>
                    </Button>
                  </Link>
                )}
              </DataColumn>
            </DataTable>

            {filteredWebsites.length === 0 && (
              <Column alignItems="center" justifyContent="center" padding="8" gap="4">
                <Icon size="xl" color="muted">
                  <Globe />
                </Icon>
                <Text color="muted">No websites found</Text>
              </Column>
            )}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
