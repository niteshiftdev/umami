'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Grid,
  Text,
  Heading,
  Icon,
  Button,
  SearchField,
} from '@umami/react-zen';
import { Globe, Settings, BarChart3, ExternalLink, Plus, TrendingUp, Clock, Users, FileText } from 'lucide-react';
import { Favicon } from '@/components/common/Favicon';

// Mock data for the prototype - realistic analytics data
const mockWebsites = [
  {
    id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    name: 'Acme Corporation',
    domain: 'acme-corp.com',
    visitors: 45892,
    pageviews: 128453,
    bounceRate: 32,
    trend: 12.5,
    activeNow: 127,
    avgSessionDuration: '3m 24s',
    topPage: '/products',
    topPageViews: 12453,
    sparkline: [65, 72, 68, 80, 74, 85, 92],
  },
  {
    id: '2b3c4d5e-6f78-90ab-cdef-123456789012',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    visitors: 12340,
    pageviews: 34567,
    bounceRate: 45,
    trend: -3.2,
    activeNow: 34,
    avgSessionDuration: '2m 15s',
    topPage: '/how-to-scale',
    topPageViews: 5621,
    sparkline: [45, 42, 48, 40, 38, 42, 35],
  },
  {
    id: '3c4d5e6f-7890-abcd-ef12-345678901234',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    visitors: 78234,
    pageviews: 245678,
    bounceRate: 28,
    trend: 24.8,
    activeNow: 312,
    avgSessionDuration: '4m 52s',
    topPage: '/checkout',
    topPageViews: 34521,
    sparkline: [50, 55, 62, 70, 75, 82, 95],
  },
  {
    id: '4d5e6f78-90ab-cdef-1234-567890123456',
    name: 'Marketing Landing',
    domain: 'landing.marketing.co',
    visitors: 5678,
    pageviews: 8901,
    bounceRate: 65,
    trend: 8.1,
    activeNow: 8,
    avgSessionDuration: '1m 02s',
    topPage: '/signup',
    topPageViews: 2341,
    sparkline: [20, 25, 22, 28, 24, 30, 32],
  },
  {
    id: '5e6f7890-abcd-ef12-3456-789012345678',
    name: 'Developer Docs',
    domain: 'docs.devtools.dev',
    visitors: 23456,
    pageviews: 89012,
    bounceRate: 22,
    trend: 15.3,
    activeNow: 89,
    avgSessionDuration: '5m 38s',
    topPage: '/api-reference',
    topPageViews: 18234,
    sparkline: [40, 45, 50, 48, 55, 60, 65],
  },
  {
    id: '6f789012-cdef-1234-5678-901234567890',
    name: 'SaaS Dashboard',
    domain: 'app.saasproduct.io',
    visitors: 34567,
    pageviews: 156789,
    bounceRate: 18,
    trend: 31.2,
    activeNow: 156,
    avgSessionDuration: '8m 12s',
    topPage: '/dashboard',
    topPageViews: 45231,
    sparkline: [55, 60, 68, 75, 80, 88, 98],
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

function MiniSparkline({ data, trend }: { data: number[]; trend: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 120;
  const color = trend >= 0 ? '#30a46c' : '#e5484d';

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  // Create gradient fill path
  const fillPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`gradient-${trend >= 0 ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
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

function WebsiteCard({
  website,
  index,
}: {
  website: (typeof mockWebsites)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Column
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--base-color-1)',
        border: '1px solid var(--base-color-4)',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-out',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 24px -8px rgba(0, 0, 0, 0.15)'
          : '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.08}s both`,
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <Link
        href={`/websites/${website.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {/* Header with favicon, name, and live users */}
        <Row alignItems="flex-start" justifyContent="space-between" gap="3">
          <Row alignItems="center" gap="3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                backgroundColor: 'var(--base-color-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Favicon domain={website.domain} />
              {!website.domain && (
                <Icon size="sm" color="muted">
                  <Globe />
                </Icon>
              )}
            </div>
            <Column gap="0">
              <Text size="2" weight="semi-bold">
                {website.name}
              </Text>
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
          {/* Live users indicator */}
          <Row
            alignItems="center"
            gap="1"
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(48, 164, 108, 0.1)',
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#30a46c',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <Text size="1" weight="medium" style={{ color: '#30a46c' }}>
              {website.activeNow} live
            </Text>
          </Row>
        </Row>

        {/* Sparkline chart */}
        <Row alignItems="center" justifyContent="space-between" style={{ marginTop: 12 }}>
          <MiniSparkline data={website.sparkline} trend={website.trend} />
          <Row
            alignItems="center"
            gap="1"
            style={{
              padding: '3px 6px',
              borderRadius: '4px',
              backgroundColor:
                website.trend >= 0
                  ? 'rgba(48, 164, 108, 0.1)'
                  : 'rgba(229, 72, 77, 0.1)',
            }}
          >
            <Icon
              size="xs"
              style={{
                color: website.trend >= 0 ? '#30a46c' : '#e5484d',
                transform: website.trend < 0 ? 'rotate(180deg)' : undefined,
              }}
            >
              <TrendingUp />
            </Icon>
            <Text
              size="1"
              weight="medium"
              style={{ color: website.trend >= 0 ? '#30a46c' : '#e5484d' }}
            >
              {Math.abs(website.trend)}%
            </Text>
          </Row>
        </Row>

        {/* Main stats grid */}
        <Grid columns="2" gap="3" style={{ marginTop: 12 }}>
          <Column
            gap="0"
            style={{
              padding: '10px',
              backgroundColor: 'var(--base-color-2)',
              borderRadius: '8px',
            }}
          >
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Users />
              </Icon>
              <Text size="1" color="muted" weight="medium">
                Visitors
              </Text>
            </Row>
            <Text size="3" weight="bold">
              {formatNumber(website.visitors)}
            </Text>
          </Column>
          <Column
            gap="0"
            style={{
              padding: '10px',
              backgroundColor: 'var(--base-color-2)',
              borderRadius: '8px',
            }}
          >
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <FileText />
              </Icon>
              <Text size="1" color="muted" weight="medium">
                Pageviews
              </Text>
            </Row>
            <Text size="3" weight="bold">
              {formatNumber(website.pageviews)}
            </Text>
          </Column>
        </Grid>

        {/* Secondary stats row */}
        <Row
          alignItems="center"
          justifyContent="space-between"
          style={{
            marginTop: 10,
            padding: '8px 10px',
            backgroundColor: 'var(--base-color-2)',
            borderRadius: '8px',
          }}
        >
          <Row alignItems="center" gap="2">
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Clock />
              </Icon>
              <Text size="1" color="muted">
                Avg. {website.avgSessionDuration}
              </Text>
            </Row>
          </Row>
          <Text
            size="1"
            weight="medium"
            style={{
              color:
                website.bounceRate < 30
                  ? '#30a46c'
                  : website.bounceRate > 50
                    ? '#e5484d'
                    : 'var(--font-color-2)',
            }}
          >
            {website.bounceRate}% bounce
          </Text>
        </Row>

        {/* Top page */}
        <Row
          alignItems="center"
          justifyContent="space-between"
          style={{
            marginTop: 8,
            padding: '8px 10px',
            backgroundColor: 'var(--base-color-2)',
            borderRadius: '8px',
          }}
        >
          <Row alignItems="center" gap="1" style={{ flex: 1, minWidth: 0 }}>
            <Text size="1" color="muted">
              Top:
            </Text>
            <Text
              size="1"
              weight="medium"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {website.topPage}
            </Text>
          </Row>
          <Text size="1" color="muted">
            {formatNumber(website.topPageViews)} views
          </Text>
        </Row>
      </Link>

      {/* Action buttons */}
      <Row
        gap="2"
        style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid var(--base-color-4)',
        }}
      >
        <Button variant="quiet" size="sm" asChild style={{ flex: 1 }}>
          <Link href={`/websites/${website.id}`}>
            <Icon size="sm">
              <BarChart3 />
            </Icon>
            <span>Analytics</span>
          </Link>
        </Button>
        <Button variant="quiet" size="sm" asChild style={{ flex: 1 }}>
          <Link href={`/websites/${website.id}/settings`}>
            <Icon size="sm">
              <Settings />
            </Icon>
            <span>Settings</span>
          </Link>
        </Button>
      </Row>
    </Column>
  );
}

export default function WebsitesCardGridPage() {
  const [search, setSearch] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!search) return mockWebsites;
    const lower = search.toLowerCase();
    return mockWebsites.filter(
      (w) =>
        w.name.toLowerCase().includes(lower) ||
        w.domain.toLowerCase().includes(lower)
    );
  }, [search]);

  const totalVisitors = mockWebsites.reduce((sum, w) => sum + w.visitors, 0);
  const totalPageviews = mockWebsites.reduce((sum, w) => sum + w.pageviews, 0);

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
          style={{ borderBottom: '1px solid var(--base-color-4)' }}
          width="100%"
        >
          <Column gap="2">
            <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
            <Text color="muted" size="2">
              {mockWebsites.length} websites - {formatNumber(totalVisitors)} total
              visitors - {formatNumber(totalPageviews)} pageviews
            </Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            Add website
          </Button>
        </Row>

        {/* Search */}
        <Row alignItems="center" justifyContent="space-between" gap="4">
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search websites..."
            style={{ maxWidth: 320 }}
          />
        </Row>

        {/* Card Grid */}
        <Grid
          columns={{ xs: '1', md: '2', lg: '3' }}
          gap="5"
          style={{ minHeight: 300 }}
        >
          {filteredWebsites.map((website, index) => (
            <WebsiteCard key={website.id} website={website} index={index} />
          ))}
        </Grid>

        {filteredWebsites.length === 0 && (
          <Row
            color="muted"
            alignItems="center"
            justifyContent="center"
            width="100%"
            minHeight="200px"
          >
            No websites found matching your search.
          </Row>
        )}
      </Column>
    </Column>
  );
}
