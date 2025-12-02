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
  Clock,
  MapPin,
  BarChart2,
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
    avgSessionDuration: '3m 24s',
    topCountry: 'US',
    topCountryPercent: 42,
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
    avgSessionDuration: '2m 15s',
    topCountry: 'UK',
    topCountryPercent: 31,
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
    avgSessionDuration: '4m 52s',
    topCountry: 'US',
    topCountryPercent: 38,
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
    avgSessionDuration: '1m 02s',
    topCountry: 'CA',
    topCountryPercent: 28,
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
    avgSessionDuration: '5m 38s',
    topCountry: 'DE',
    topCountryPercent: 25,
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
    avgSessionDuration: '8m 12s',
    topCountry: 'US',
    topCountryPercent: 52,
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

function MiniBarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const height = 24;
  const barWidth = 6;
  const gap = 2;

  return (
    <svg width={(barWidth + gap) * data.length - gap} height={height}>
      {data.map((val, i) => {
        const barHeight = (val / max) * height;
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={height - barHeight}
            width={barWidth}
            height={barHeight}
            rx="2"
            fill={color}
            opacity={0.6 + (i / data.length) * 0.4}
          />
        );
      })}
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
  chartData,
  chartColor,
  secondaryStats,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  trend?: number;
  index: number;
  chartData?: number[];
  chartColor?: string;
  secondaryStats?: { label: string; value: string }[];
}) {
  return (
    <Column
      padding="4"
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
              width: 32,
              height: 32,
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
              {Math.abs(trend).toFixed(1)}%
            </Text>
          </Row>
        )}
      </Row>
      <Row alignItems="flex-end" justifyContent="space-between">
        <Column gap="0">
          <Text size="5" weight="bold">
            {value}
          </Text>
          {subValue && (
            <Text size="1" color="muted">
              {subValue}
            </Text>
          )}
        </Column>
        {chartData && chartColor && (
          <MiniBarChart data={chartData} color={chartColor} />
        )}
      </Row>
      {secondaryStats && secondaryStats.length > 0 && (
        <Row
          gap="3"
          style={{
            paddingTop: 8,
            borderTop: '1px solid var(--base-color-3)',
          }}
        >
          {secondaryStats.map((stat, i) => (
            <Column key={i} gap="0">
              <Text size="1" color="muted">
                {stat.label}
              </Text>
              <Text size="2" weight="medium">
                {stat.value}
              </Text>
            </Column>
          ))}
        </Row>
      )}
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
        padding="3"
        gap="3"
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
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>

        {/* Website Info */}
        <Row alignItems="center" gap="3" style={{ flex: 1, minWidth: 160 }}>
          <div
            style={{
              width: 36,
              height: 36,
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
            <Text size="2" weight="medium">
              {website.name}
            </Text>
            <Text size="1" color="muted">
              {website.domain}
            </Text>
          </Column>
        </Row>

        {/* Active Users */}
        <Row
          alignItems="center"
          gap="1"
          style={{
            width: 70,
            padding: '4px 8px',
            backgroundColor: 'rgba(48, 164, 108, 0.08)',
            borderRadius: '6px',
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
            {website.activeNow}
          </Text>
        </Row>

        {/* Stats - Visitors */}
        <Column
          style={{
            width: 75,
            padding: '4px 8px',
            backgroundColor: 'var(--base-color-2)',
            borderRadius: '6px',
          }}
          alignItems="center"
        >
          <Text size="2" weight="semi-bold">
            {formatNumber(website.visitors)}
          </Text>
          <Text size="1" color="muted">
            visitors
          </Text>
        </Column>

        {/* Stats - Pageviews */}
        <Column
          style={{
            width: 75,
            padding: '4px 8px',
            backgroundColor: 'var(--base-color-2)',
            borderRadius: '6px',
          }}
          alignItems="center"
        >
          <Text size="2" weight="semi-bold">
            {formatNumber(website.pageviews)}
          </Text>
          <Text size="1" color="muted">
            views
          </Text>
        </Column>

        {/* Bounce Rate */}
        <Column
          style={{
            width: 60,
            padding: '4px 8px',
            backgroundColor: 'var(--base-color-2)',
            borderRadius: '6px',
          }}
          alignItems="center"
        >
          <Text
            size="2"
            weight="semi-bold"
            style={{
              color:
                website.bounceRate < 30
                  ? '#30a46c'
                  : website.bounceRate > 50
                    ? '#e5484d'
                    : 'inherit',
            }}
          >
            {website.bounceRate}%
          </Text>
          <Text size="1" color="muted">
            bounce
          </Text>
        </Column>

        {/* Session Duration */}
        <Row
          alignItems="center"
          gap="1"
          style={{
            width: 70,
            padding: '4px 8px',
            backgroundColor: 'var(--base-color-2)',
            borderRadius: '6px',
          }}
        >
          <Icon size="xs" color="muted">
            <Clock />
          </Icon>
          <Text size="1" weight="medium">
            {website.avgSessionDuration}
          </Text>
        </Row>

        {/* Sparkline */}
        <Row style={{ width: 85 }} justifyContent="flex-end">
          <MiniSparkline data={website.sparkline} trend={website.trend} />
        </Row>

        {/* Trend */}
        <Row
          style={{
            width: 65,
            padding: '4px 8px',
            backgroundColor:
              website.trend >= 0
                ? 'rgba(48, 164, 108, 0.1)'
                : 'rgba(229, 72, 77, 0.1)',
            borderRadius: '6px',
          }}
          alignItems="center"
          justifyContent="center"
          gap="1"
        >
          <Icon
            size="xs"
            style={{ color: website.trend >= 0 ? '#30a46c' : '#e5484d' }}
          >
            {website.trend >= 0 ? <TrendingUp /> : <TrendingDown />}
          </Icon>
          <Text
            size="1"
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
            width: 60,
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
        <Grid columns={{ xs: '2', md: '4' }} gap="3">
          <SummaryCard
            icon={<Globe />}
            label="Total Websites"
            value={mockWebsites.length.toString()}
            subValue="Active tracking"
            index={0}
            chartData={[3, 4, 4, 5, 5, 6, 6]}
            chartColor="var(--base-color-8)"
            secondaryStats={[
              { label: 'New this month', value: '2' },
              { label: 'Avg. uptime', value: '99.9%' },
            ]}
          />
          <SummaryCard
            icon={<Zap />}
            label="Active Now"
            value={formatNumber(totalActiveNow)}
            subValue="Real-time visitors"
            index={1}
            chartData={[120, 145, 178, 156, 189, 210, 234]}
            chartColor="#30a46c"
            secondaryStats={[
              { label: 'Peak today', value: '892' },
              { label: 'Avg. session', value: '4m 12s' },
            ]}
          />
          <SummaryCard
            icon={<Users />}
            label="Total Visitors"
            value={formatNumber(totalVisitors)}
            subValue="Last 30 days"
            trend={avgTrend}
            index={2}
            chartData={[45, 52, 48, 61, 58, 72, 85]}
            chartColor="#3b82f6"
            secondaryStats={[
              { label: 'New visitors', value: '68%' },
              { label: 'Returning', value: '32%' },
            ]}
          />
          <SummaryCard
            icon={<Eye />}
            label="Total Pageviews"
            value={formatNumber(totalPageviews)}
            subValue="Last 30 days"
            trend={avgTrend * 1.2}
            index={3}
            chartData={[120, 135, 128, 155, 148, 172, 195]}
            chartColor="#8b5cf6"
            secondaryStats={[
              { label: 'Pages/session', value: '3.2' },
              { label: 'Avg. bounce', value: `${avgBounceRate}%` },
            ]}
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
            paddingX="3"
            paddingY="2"
            gap="3"
            style={{ borderBottom: '1px solid var(--base-color-3)' }}
          >
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                flex: 1,
                minWidth: 160,
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
              style={{ width: 70, textTransform: 'uppercase', letterSpacing: '0.5px' }}
            >
              Live
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                width: 75,
                textAlign: 'center',
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
                width: 75,
                textAlign: 'center',
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
                width: 60,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Bounce
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                width: 70,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Duration
            </Text>
            <Text
              size="1"
              color="muted"
              weight="medium"
              style={{
                width: 85,
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
                width: 65,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Trend
            </Text>
            <div style={{ width: 60 }} />
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
