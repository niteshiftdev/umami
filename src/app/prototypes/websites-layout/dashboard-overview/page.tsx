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
import {
  Globe,
  Settings,
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Favicon } from '@/components/common/Favicon';

// Mock data for the prototype
const mockWebsites = [
  {
    id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    name: 'Acme Corporation',
    domain: 'acme-corp.com',
    visitors: 45892,
    pageviews: 128453,
    bounceRate: 32,
    activeNow: 127,
    trend: 12.5,
    sparkline: [65, 72, 68, 80, 74, 85, 92],
  },
  {
    id: '2b3c4d5e-6f78-90ab-cdef-123456789012',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    visitors: 12340,
    pageviews: 34567,
    bounceRate: 45,
    activeNow: 34,
    trend: -3.2,
    sparkline: [45, 42, 48, 40, 38, 42, 35],
  },
  {
    id: '3c4d5e6f-7890-abcd-ef12-345678901234',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    visitors: 78234,
    pageviews: 245678,
    bounceRate: 28,
    activeNow: 312,
    trend: 24.8,
    sparkline: [50, 55, 62, 70, 75, 82, 95],
  },
  {
    id: '4d5e6f78-90ab-cdef-1234-567890123456',
    name: 'Marketing Landing',
    domain: 'landing.marketing.co',
    visitors: 5678,
    pageviews: 8901,
    bounceRate: 65,
    activeNow: 8,
    trend: 8.1,
    sparkline: [20, 25, 22, 28, 24, 30, 32],
  },
  {
    id: '5e6f7890-abcd-ef12-3456-789012345678',
    name: 'Developer Docs',
    domain: 'docs.devtools.dev',
    visitors: 23456,
    pageviews: 89012,
    bounceRate: 22,
    activeNow: 89,
    trend: 15.3,
    sparkline: [40, 45, 50, 48, 55, 60, 65],
  },
  {
    id: '6f789012-cdef-1234-5678-901234567890',
    name: 'SaaS Dashboard',
    domain: 'app.saasproduct.io',
    visitors: 34567,
    pageviews: 156789,
    bounceRate: 18,
    activeNow: 156,
    trend: 31.2,
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
  const height = 32;
  const width = 80;
  const color = trend >= 0 ? '#30a46c' : '#e5484d';

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
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

function SummaryCard({
  icon,
  label,
  value,
  subValue,
  trend,
  index,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
  index: number;
}) {
  return (
    <Column
      padding="5"
      gap="3"
      style={{
        backgroundColor: 'var(--base-color-1)',
        border: '1px solid var(--base-color-4)',
        borderRadius: '12px',
        animation: `slideUp 0.4s ease-out ${index * 0.1}s both`,
      }}
    >
      <style>{`
        @keyframes slideUp {
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
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center" gap="2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: 'var(--base-color-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size="sm" color="muted">
              {icon}
            </Icon>
          </div>
          <Text size="1" color="muted" weight="medium">
            {label}
          </Text>
        </Row>
        {trend !== undefined && (
          <Row
            alignItems="center"
            gap="1"
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor:
                trend >= 0
                  ? 'rgba(48, 164, 108, 0.1)'
                  : 'rgba(229, 72, 77, 0.1)',
            }}
          >
            <Icon
              size="xs"
              style={{ color: trend >= 0 ? '#30a46c' : '#e5484d' }}
            >
              {trend >= 0 ? <TrendingUp /> : <TrendingDown />}
            </Icon>
            <Text
              size="1"
              weight="medium"
              style={{ color: trend >= 0 ? '#30a46c' : '#e5484d' }}
            >
              {Math.abs(trend)}%
            </Text>
          </Row>
        )}
      </Row>
      <Column gap="0">
        <Text size="6" weight="bold">
          {value}
        </Text>
        {subValue && (
          <Text size="1" color="muted">
            {subValue}
          </Text>
        )}
      </Column>
    </Column>
  );
}

function WebsiteRow({
  website,
  index,
}: {
  website: (typeof mockWebsites)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/websites/${website.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Row
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        alignItems="center"
        padding="4"
        gap="4"
        style={{
          backgroundColor: isHovered ? 'var(--base-color-2)' : 'transparent',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          animation: `fadeSlide 0.35s ease-out ${0.3 + index * 0.06}s both`,
        }}
      >
        <style>{`
          @keyframes fadeSlide {
            from {
              opacity: 0;
              transform: translateX(-8px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>

        {/* Website Info */}
        <Row alignItems="center" gap="3" style={{ flex: 1, minWidth: 180 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
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
            <Text size="2" weight="medium">
              {website.name}
            </Text>
            <Text size="1" color="muted">
              {website.domain}
            </Text>
          </Column>
        </Row>

        {/* Active Users */}
        <Row alignItems="center" gap="2" style={{ width: 90 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#30a46c',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}</style>
          <Text size="2" weight="medium">
            {website.activeNow}
          </Text>
          <Text size="1" color="muted">
            now
          </Text>
        </Row>

        {/* Stats */}
        <Column style={{ width: 80 }} alignItems="flex-end">
          <Text size="2" weight="medium">
            {formatNumber(website.visitors)}
          </Text>
          <Text size="1" color="muted">
            visitors
          </Text>
        </Column>

        <Column style={{ width: 80 }} alignItems="flex-end">
          <Text size="2" weight="medium">
            {formatNumber(website.pageviews)}
          </Text>
          <Text size="1" color="muted">
            views
          </Text>
        </Column>

        {/* Sparkline */}
        <Row style={{ width: 100 }} justifyContent="flex-end">
          <MiniSparkline data={website.sparkline} trend={website.trend} />
        </Row>

        {/* Trend */}
        <Row style={{ width: 70 }} alignItems="center" justifyContent="flex-end" gap="1">
          <Icon
            size="xs"
            style={{ color: website.trend >= 0 ? '#30a46c' : '#e5484d' }}
          >
            {website.trend >= 0 ? <TrendingUp /> : <TrendingDown />}
          </Icon>
          <Text
            size="2"
            weight="medium"
            style={{ color: website.trend >= 0 ? '#30a46c' : '#e5484d' }}
          >
            {Math.abs(website.trend)}%
          </Text>
        </Row>

        {/* Actions */}
        <Row
          gap="1"
          style={{
            width: 80,
            justifyContent: 'flex-end',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.15s ease',
          }}
        >
          <Button
            variant="quiet"
            size="sm"
            onPress={(e: any) => e?.preventDefault?.()}
            asChild
          >
            <Link
              href={`/websites/${website.id}/settings`}
              onClick={(e) => e.stopPropagation()}
            >
              <Icon size="sm">
                <Settings />
              </Icon>
            </Link>
          </Button>
          <Icon size="sm" color="muted">
            <ArrowRight />
          </Icon>
        </Row>
      </Row>
    </Link>
  );
}

export default function WebsitesDashboardOverviewPage() {
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

  // Aggregate stats
  const totalVisitors = mockWebsites.reduce((sum, w) => sum + w.visitors, 0);
  const totalPageviews = mockWebsites.reduce((sum, w) => sum + w.pageviews, 0);
  const totalActiveNow = mockWebsites.reduce((sum, w) => sum + w.activeNow, 0);
  const avgBounceRate = Math.round(
    mockWebsites.reduce((sum, w) => sum + w.bounceRate, 0) / mockWebsites.length
  );
  const avgTrend =
    mockWebsites.reduce((sum, w) => sum + w.trend, 0) / mockWebsites.length;

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
          marginBottom="2"
          style={{ borderBottom: '1px solid var(--base-color-4)' }}
          width="100%"
        >
          <Column gap="2">
            <Heading size={{ xs: '2', md: '3', lg: '4' }}>
              Websites Overview
            </Heading>
            <Text color="muted" size="2">
              Monitor all your websites from one dashboard
            </Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            Add website
          </Button>
        </Row>

        {/* Summary Cards */}
        <Grid columns={{ xs: '2', md: '4' }} gap="4">
          <SummaryCard
            icon={<Globe />}
            label="Total Websites"
            value={mockWebsites.length.toString()}
            subValue="Active tracking"
            index={0}
          />
          <SummaryCard
            icon={<Zap />}
            label="Active Now"
            value={formatNumber(totalActiveNow)}
            subValue="Real-time visitors"
            index={1}
          />
          <SummaryCard
            icon={<Users />}
            label="Total Visitors"
            value={formatNumber(totalVisitors)}
            subValue="Last 30 days"
            trend={avgTrend}
            index={2}
          />
          <SummaryCard
            icon={<Eye />}
            label="Total Pageviews"
            value={formatNumber(totalPageviews)}
            subValue="Last 30 days"
            trend={avgTrend * 1.2}
            index={3}
          />
        </Grid>

        {/* Websites List */}
        <Column
          gap="2"
          style={{
            backgroundColor: 'var(--base-color-1)',
            border: '1px solid var(--base-color-4)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <Row
            alignItems="center"
            justifyContent="space-between"
            paddingX="2"
            paddingY="2"
          >
            <Row alignItems="center" gap="2">
              <Icon size="sm" color="muted">
                <Activity />
              </Icon>
              <Text size="2" weight="semi-bold">
                All Websites
              </Text>
              <div
                style={{
                  backgroundColor: 'var(--base-color-4)',
                  borderRadius: '12px',
                  padding: '2px 8px',
                }}
              >
                <Text size="1" color="muted" weight="medium">
                  {filteredWebsites.length}
                </Text>
              </div>
            </Row>
            <SearchField
              value={search}
              onSearch={setSearch}
              placeholder="Filter websites..."
              style={{ maxWidth: 240 }}
            />
          </Row>

          {/* List Header */}
          <Row
            alignItems="center"
            paddingX="4"
            paddingY="2"
            gap="4"
            style={{ borderBottom: '1px solid var(--base-color-3)' }}
          >
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                flex: 1,
                minWidth: 180,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Website
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{ width: 90, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Live
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                width: 80,
                textAlign: 'right',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Visitors
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                width: 80,
                textAlign: 'right',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Views
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                width: 100,
                textAlign: 'right',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              7 Days
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                width: 70,
                textAlign: 'right',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Trend
            </Text>
            <div style={{ width: 80 }} />
          </Row>

          {/* Website Rows */}
          <Column gap="1">
            {filteredWebsites.map((website, index) => (
              <WebsiteRow key={website.id} website={website} index={index} />
            ))}
          </Column>

          {filteredWebsites.length === 0 && (
            <Row
              color="muted"
              alignItems="center"
              justifyContent="center"
              width="100%"
              padding="6"
              minHeight="150px"
            >
              No websites found matching your search.
            </Row>
          )}
        </Column>
      </Column>
    </Column>
  );
}
