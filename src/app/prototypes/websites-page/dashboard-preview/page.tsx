'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Grid,
  Text,
  Icon,
  Button,
  SearchField,
  StatusLight,
} from '@umami/react-zen';
import {
  Globe,
  SquarePen,
  Plus,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';

// Mock websites with chart data
const mockWebsites = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    visitors: 12847,
    pageviews: 45231,
    sessions: 18234,
    trend: 12.5,
    isOnline: 3,
    chartData: [45, 52, 38, 65, 72, 58, 85, 92, 78, 95, 88, 102],
    topPages: ['/home', '/products', '/about'],
    topCountries: ['US', 'UK', 'DE'],
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    visitors: 8934,
    pageviews: 28476,
    sessions: 12453,
    trend: -4.2,
    isOnline: 7,
    chartData: [72, 68, 75, 62, 58, 65, 55, 52, 48, 45, 50, 47],
    topPages: ['/articles', '/guides', '/tutorials'],
    topCountries: ['IN', 'US', 'BR'],
  },
  {
    id: '3',
    name: 'E-Commerce Store',
    domain: 'shop.example.org',
    visitors: 34521,
    pageviews: 98234,
    sessions: 42187,
    trend: 28.3,
    isOnline: 15,
    chartData: [30, 35, 42, 55, 68, 75, 82, 95, 108, 125, 142, 158],
    topPages: ['/products', '/cart', '/checkout'],
    topCountries: ['US', 'CA', 'UK'],
  },
  {
    id: '4',
    name: 'Portfolio Site',
    domain: 'designer.me',
    visitors: 2341,
    pageviews: 5672,
    sessions: 3124,
    trend: 8.7,
    isOnline: 0,
    chartData: [12, 15, 18, 22, 19, 25, 28, 32, 29, 35, 38, 42],
    topPages: ['/work', '/about', '/contact'],
    topCountries: ['US', 'FR', 'JP'],
  },
  {
    id: '5',
    name: 'SaaS Dashboard',
    domain: 'app.saasproduct.com',
    visitors: 18234,
    pageviews: 67843,
    sessions: 28976,
    trend: 15.1,
    isOnline: 42,
    chartData: [85, 88, 92, 95, 102, 108, 115, 122, 128, 135, 142, 148],
    topPages: ['/dashboard', '/settings', '/reports'],
    topCountries: ['US', 'UK', 'AU'],
  },
  {
    id: '6',
    name: 'Documentation Hub',
    domain: 'docs.opensource.dev',
    visitors: 6723,
    pageviews: 21345,
    sessions: 9876,
    trend: -1.8,
    isOnline: 8,
    chartData: [55, 58, 52, 48, 55, 52, 58, 55, 52, 50, 48, 52],
    topPages: ['/getting-started', '/api', '/examples'],
    topCountries: ['US', 'DE', 'IN'],
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Mini sparkline chart component
function MiniChart({ data, trend }: { data: number[]; trend: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 60;
  const width = 200;
  const color = trend >= 0 ? 'var(--color-green-500)' : 'var(--color-red-500)';

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`gradient-${trend >= 0 ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={areaPoints}
        fill={`url(#gradient-${trend >= 0 ? 'up' : 'down'})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardCard({ website, index }: { website: (typeof mockWebsites)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Column
      backgroundColor
      border
      borderRadius="3"
      overflow="hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {/* Header Bar */}
      <Row
        justifyContent="space-between"
        alignItems="center"
        padding="4"
        backgroundColor="2"
        border="bottom"
      >
        <Row alignItems="center" gap="3">
          <Row
            alignItems="center"
            justifyContent="center"
            backgroundColor="3"
            borderRadius="2"
            style={{ width: 36, height: 36 }}
          >
            <Icon color="muted">
              <Globe />
            </Icon>
          </Row>
          <Column gap="0">
            <Link
              href={`/websites/${website.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Text size="3" weight="bold">
                {website.name}
              </Text>
            </Link>
            <Row alignItems="center" gap="1">
              <Text size="1" color="muted">
                {website.domain}
              </Text>
              <Icon size="xs" color="muted">
                <ExternalLink />
              </Icon>
            </Row>
          </Column>
        </Row>
        <Row alignItems="center" gap="2">
          {website.isOnline > 0 && (
            <StatusLight variant="success">
              <Text size="1">{website.isOnline}</Text>
            </StatusLight>
          )}
          <Link href={`/websites/${website.id}/settings`}>
            <Button variant="quiet" size="sm">
              <Icon size="sm">
                <SquarePen />
              </Icon>
            </Button>
          </Link>
        </Row>
      </Row>

      {/* Main Stats Row */}
      <Row padding="4" gap="4" justifyContent="space-between">
        <Column gap="1">
          <Text size="1" color="muted" weight="medium">
            VISITORS
          </Text>
          <Text size="6" weight="bold">
            {formatNumber(website.visitors)}
          </Text>
        </Column>
        <Column gap="1">
          <Text size="1" color="muted" weight="medium">
            PAGEVIEWS
          </Text>
          <Text size="6" weight="bold">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>
        <Column gap="1">
          <Text size="1" color="muted" weight="medium">
            SESSIONS
          </Text>
          <Text size="6" weight="bold">
            {formatNumber(website.sessions)}
          </Text>
        </Column>
      </Row>

      {/* Chart Section */}
      <Column padding="4" paddingTop="0">
        <Row justifyContent="space-between" alignItems="flex-end" marginBottom="2">
          <Text size="1" color="muted">
            Last 12 hours
          </Text>
          <Row alignItems="center" gap="1">
            <Icon size="sm" style={{ color: website.trend >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
              {website.trend >= 0 ? <TrendingUp /> : <TrendingDown />}
            </Icon>
            <Text size="2" weight="bold" style={{ color: website.trend >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
              {website.trend >= 0 ? '+' : ''}
              {website.trend}%
            </Text>
          </Row>
        </Row>
        <MiniChart data={website.chartData} trend={website.trend} />
      </Column>

      {/* Quick Stats Footer */}
      <Row
        padding="3"
        backgroundColor="2"
        border="top"
        gap="4"
        justifyContent="space-between"
      >
        <Column gap="1">
          <Text size="1" color="muted">
            Top Pages
          </Text>
          <Row gap="1">
            {website.topPages.slice(0, 2).map((page, i) => (
              <Text
                key={i}
                size="1"
                style={{
                  backgroundColor: 'var(--base-color-100)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {page}
              </Text>
            ))}
          </Row>
        </Column>
        <Column gap="1" alignItems="flex-end">
          <Text size="1" color="muted">
            Top Regions
          </Text>
          <Row gap="1">
            {website.topCountries.map((country, i) => (
              <Text
                key={i}
                size="1"
                style={{
                  backgroundColor: 'var(--base-color-100)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                }}
              >
                {country}
              </Text>
            ))}
          </Row>
        </Column>
      </Row>

      {/* View Dashboard Link */}
      <Link
        href={`/websites/${website.id}`}
        style={{ textDecoration: 'none' }}
      >
        <Row
          padding="3"
          justifyContent="center"
          alignItems="center"
          gap="2"
          backgroundColor="3"
          style={{
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
        >
          <Icon size="sm">
            <BarChart3 />
          </Icon>
          <Text size="2" weight="medium">
            View Full Dashboard
          </Text>
          <Icon size="sm">
            <ArrowUpRight />
          </Icon>
        </Row>
      </Link>
    </Column>
  );
}

export default function DashboardPreviewWebsitesPage() {
  const [search, setSearch] = useState('');

  const filteredWebsites = mockWebsites.filter(
    website =>
      website.name.toLowerCase().includes(search.toLowerCase()) ||
      website.domain.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Column
      width="100%"
      paddingBottom="6"
      maxWidth="1320px"
      paddingX={{ xs: '3', md: '6' }}
      style={{ margin: '0 auto' }}
    >
      <Column gap="6" margin="2">
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="6"
          border="bottom"
          width="100%"
        >
          <Column gap="2">
            <Row alignItems="center" gap="3">
              <Icon size="lg" color="muted">
                <BarChart3 />
              </Icon>
              <Text size="6" weight="bold">
                Websites
              </Text>
            </Row>
            <Text color="muted">
              Dashboard previews for {mockWebsites.length} tracked websites
            </Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </Button>
        </Row>

        {/* Search and Filter Row */}
        <Row alignItems="center" justifyContent="space-between" gap="4">
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search websites..."
            style={{ maxWidth: '320px' }}
          />
          <Row gap="2">
            <Button variant="outline" size="sm">
              <Text size="2">Sort by Traffic</Text>
            </Button>
          </Row>
        </Row>

        {/* Dashboard Cards Grid */}
        <Grid columns={{ xs: '1', md: '2' }} gap="5">
          {filteredWebsites.map((website, index) => (
            <DashboardCard key={website.id} website={website} index={index} />
          ))}
        </Grid>

        {filteredWebsites.length === 0 && (
          <Row
            color="muted"
            alignItems="center"
            justifyContent="center"
            width="100%"
            height="200px"
          >
            No websites found matching your search.
          </Row>
        )}
      </Column>
    </Column>
  );
}
