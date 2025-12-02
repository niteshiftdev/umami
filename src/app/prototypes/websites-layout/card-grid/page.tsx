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
import { Globe, Settings, BarChart3, ExternalLink, Plus, TrendingUp } from 'lucide-react';
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
  },
  {
    id: '2b3c4d5e-6f78-90ab-cdef-123456789012',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    visitors: 12340,
    pageviews: 34567,
    bounceRate: 45,
    trend: -3.2,
  },
  {
    id: '3c4d5e6f-7890-abcd-ef12-345678901234',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    visitors: 78234,
    pageviews: 245678,
    bounceRate: 28,
    trend: 24.8,
  },
  {
    id: '4d5e6f78-90ab-cdef-1234-567890123456',
    name: 'Marketing Landing',
    domain: 'landing.marketing.co',
    visitors: 5678,
    pageviews: 8901,
    bounceRate: 65,
    trend: 8.1,
  },
  {
    id: '5e6f7890-abcd-ef12-3456-789012345678',
    name: 'Developer Docs',
    domain: 'docs.devtools.dev',
    visitors: 23456,
    pageviews: 89012,
    bounceRate: 22,
    trend: 15.3,
  },
  {
    id: '6f789012-cdef-1234-5678-901234567890',
    name: 'SaaS Dashboard',
    domain: 'app.saasproduct.io',
    visitors: 34567,
    pageviews: 156789,
    bounceRate: 18,
    trend: 31.2,
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
        padding: '24px',
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
      `}</style>
      <Link
        href={`/websites/${website.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Row alignItems="flex-start" justifyContent="space-between" gap="4">
          <Row alignItems="center" gap="3">
            <div
              style={{
                width: 48,
                height: 48,
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
                <Icon size="md" color="muted">
                  <Globe />
                </Icon>
              )}
            </div>
            <Column gap="1">
              <Text size="3" weight="semi-bold">
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
          <Row
            alignItems="center"
            gap="1"
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
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

        <Grid columns="3" gap="4" style={{ marginTop: 20 }}>
          <Column gap="1">
            <Text size="1" color="muted" weight="medium">
              Visitors
            </Text>
            <Text size="4" weight="bold">
              {formatNumber(website.visitors)}
            </Text>
          </Column>
          <Column gap="1">
            <Text size="1" color="muted" weight="medium">
              Pageviews
            </Text>
            <Text size="4" weight="bold">
              {formatNumber(website.pageviews)}
            </Text>
          </Column>
          <Column gap="1">
            <Text size="1" color="muted" weight="medium">
              Bounce
            </Text>
            <Text size="4" weight="bold">
              {website.bounceRate}%
            </Text>
          </Column>
        </Grid>
      </Link>

      <Row
        gap="2"
        style={{
          marginTop: 20,
          paddingTop: 16,
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
