'use client';

import { useState } from 'react';
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
  Users,
  Eye,
  MousePointer,
  Clock,
} from 'lucide-react';

// Mock data representing websites with analytics
const mockWebsites = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    visitors: 12847,
    pageviews: 45231,
    bounceRate: 42,
    avgDuration: '2m 34s',
    trend: 12.5,
    isOnline: 3,
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    visitors: 8934,
    pageviews: 28476,
    bounceRate: 38,
    avgDuration: '3m 12s',
    trend: -4.2,
    isOnline: 7,
  },
  {
    id: '3',
    name: 'E-Commerce Store',
    domain: 'shop.example.org',
    visitors: 34521,
    pageviews: 98234,
    bounceRate: 55,
    avgDuration: '1m 48s',
    trend: 28.3,
    isOnline: 15,
  },
  {
    id: '4',
    name: 'Portfolio Site',
    domain: 'designer.me',
    visitors: 2341,
    pageviews: 5672,
    bounceRate: 31,
    avgDuration: '4m 05s',
    trend: 8.7,
    isOnline: 0,
  },
  {
    id: '5',
    name: 'SaaS Dashboard',
    domain: 'app.saasproduct.com',
    visitors: 18234,
    pageviews: 67843,
    bounceRate: 22,
    avgDuration: '8m 23s',
    trend: 15.1,
    isOnline: 42,
  },
  {
    id: '6',
    name: 'Documentation Hub',
    domain: 'docs.opensource.dev',
    visitors: 6723,
    pageviews: 21345,
    bounceRate: 48,
    avgDuration: '5m 17s',
    trend: -1.8,
    isOnline: 8,
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

function WebsiteCard({ website }: { website: (typeof mockWebsites)[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Column
      backgroundColor
      border
      borderRadius="3"
      padding="5"
      gap="4"
      position="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Header with name and domain */}
      <Row justifyContent="space-between" alignItems="flex-start">
        <Column gap="1">
          <Row alignItems="center" gap="2">
            <Icon size="sm" color="muted">
              <Globe />
            </Icon>
            <Link
              href={`/websites/${website.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <Text size="4" weight="bold">
                {website.name}
              </Text>
            </Link>
          </Row>
          <Text size="2" color="muted">
            {website.domain}
          </Text>
        </Column>
        {website.isOnline > 0 && (
          <StatusLight variant="success">
            <Text size="1" weight="medium">
              {website.isOnline} online
            </Text>
          </StatusLight>
        )}
      </Row>

      {/* Stats Grid */}
      <Grid columns="2" gap="3">
        <Column gap="1" padding="3" backgroundColor="2" borderRadius="2">
          <Row alignItems="center" gap="1">
            <Icon size="sm" color="muted">
              <Users />
            </Icon>
            <Text size="1" color="muted">
              Visitors
            </Text>
          </Row>
          <Text size="5" weight="bold">
            {formatNumber(website.visitors)}
          </Text>
        </Column>

        <Column gap="1" padding="3" backgroundColor="2" borderRadius="2">
          <Row alignItems="center" gap="1">
            <Icon size="sm" color="muted">
              <Eye />
            </Icon>
            <Text size="1" color="muted">
              Pageviews
            </Text>
          </Row>
          <Text size="5" weight="bold">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>

        <Column gap="1" padding="3" backgroundColor="2" borderRadius="2">
          <Row alignItems="center" gap="1">
            <Icon size="sm" color="muted">
              <MousePointer />
            </Icon>
            <Text size="1" color="muted">
              Bounce Rate
            </Text>
          </Row>
          <Text size="5" weight="bold">
            {website.bounceRate}%
          </Text>
        </Column>

        <Column gap="1" padding="3" backgroundColor="2" borderRadius="2">
          <Row alignItems="center" gap="1">
            <Icon size="sm" color="muted">
              <Clock />
            </Icon>
            <Text size="1" color="muted">
              Avg. Duration
            </Text>
          </Row>
          <Text size="5" weight="bold">
            {website.avgDuration}
          </Text>
        </Column>
      </Grid>

      {/* Trend indicator */}
      <Row justifyContent="space-between" alignItems="center" paddingTop="2" border="top">
        <Row alignItems="center" gap="2">
          <Icon size="sm" style={{ color: website.trend >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {website.trend >= 0 ? <TrendingUp /> : <TrendingDown />}
          </Icon>
          <Text size="2" weight="medium" style={{ color: website.trend >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {website.trend >= 0 ? '+' : ''}
            {website.trend}% vs last period
          </Text>
        </Row>
        <Link href={`/websites/${website.id}/settings`}>
          <Button variant="quiet" size="sm">
            <Icon size="sm">
              <SquarePen />
            </Icon>
          </Button>
        </Link>
      </Row>
    </Column>
  );
}

export default function CardGridWebsitesPage() {
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
            <Text size="6" weight="bold">
              Websites
            </Text>
            <Text color="muted">{mockWebsites.length} websites tracked</Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </Button>
        </Row>

        {/* Search */}
        <Row alignItems="center" gap="4">
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search websites..."
            style={{ maxWidth: '320px' }}
          />
        </Row>

        {/* Card Grid */}
        <Grid
          columns={{ xs: '1', sm: '1', md: '2', lg: '3' }}
          gap="4"
          style={{
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {filteredWebsites.map((website, index) => (
            <div
              key={website.id}
              style={{
                animation: `slideUp 0.4s ease-out ${index * 0.05}s both`,
              }}
            >
              <WebsiteCard website={website} />
            </div>
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
