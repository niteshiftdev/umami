'use client';

import { useState } from 'react';
import {
  Column,
  Grid,
  Row,
  Text,
  Heading,
  Icon,
  Button,
  SearchField,
  StatusLight,
} from '@umami/react-zen';
import {
  Globe,
  Users,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  LayoutGrid,
  List,
} from 'lucide-react';

// Mock data for prototype - realistic analytics data
const mockWebsites = [
  {
    id: '1',
    name: 'Marketing Site',
    domain: 'marketing.example.com',
    visitors: 12847,
    pageviews: 45231,
    bounceRate: 42.3,
    avgDuration: '2m 34s',
    trend: 12.5,
    status: 'active',
    lastActivity: '2 min ago',
  },
  {
    id: '2',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    visitors: 8934,
    pageviews: 67823,
    bounceRate: 35.8,
    avgDuration: '4m 12s',
    trend: 8.2,
    status: 'active',
    lastActivity: '5 min ago',
  },
  {
    id: '3',
    name: 'Documentation Portal',
    domain: 'docs.example.com',
    visitors: 5621,
    pageviews: 23456,
    bounceRate: 28.1,
    avgDuration: '5m 45s',
    trend: -3.4,
    status: 'active',
    lastActivity: '12 min ago',
  },
  {
    id: '4',
    name: 'Developer Blog',
    domain: 'blog.example.com',
    visitors: 3412,
    pageviews: 8934,
    bounceRate: 52.6,
    avgDuration: '3m 21s',
    trend: 24.1,
    status: 'active',
    lastActivity: '1 hour ago',
  },
  {
    id: '5',
    name: 'Support Center',
    domain: 'support.example.com',
    visitors: 2156,
    pageviews: 12345,
    bounceRate: 31.2,
    avgDuration: '6m 08s',
    trend: -1.2,
    status: 'active',
    lastActivity: '3 hours ago',
  },
  {
    id: '6',
    name: 'Landing Pages',
    domain: 'landing.example.com',
    visitors: 987,
    pageviews: 2341,
    bounceRate: 68.4,
    avgDuration: '1m 15s',
    trend: 45.3,
    status: 'inactive',
    lastActivity: '1 day ago',
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function WebsiteCard({
  website,
  index,
}: {
  website: (typeof mockWebsites)[0];
  index: number;
}) {
  const isPositiveTrend = website.trend >= 0;

  return (
    <Column
      backgroundColor
      border
      borderRadius="3"
      padding="5"
      gap="4"
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.08}s both`,
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="website-card"
    >
      {/* Header */}
      <Row justifyContent="space-between" alignItems="flex-start">
        <Row gap="3" alignItems="center">
          <Column
            backgroundColor="primary"
            borderRadius="2"
            padding="2"
            alignItems="center"
            justifyContent="center"
            style={{ width: 40, height: 40 }}
          >
            <Icon color="12">
              <Globe size={20} />
            </Icon>
          </Column>
          <Column gap="1">
            <Text weight="medium" size="3">
              {website.name}
            </Text>
            <Text color="muted" size="1">
              {website.domain}
            </Text>
          </Column>
        </Row>
        <StatusLight variant={website.status === 'active' ? 'success' : 'inactive'} />
      </Row>

      {/* Metrics Grid */}
      <Grid columns="1fr 1fr" gap="3">
        <Column
          backgroundColor="2"
          borderRadius="2"
          padding="3"
          gap="1"
        >
          <Row gap="2" alignItems="center">
            <Icon size="xs" color="muted">
              <Users size={14} />
            </Icon>
            <Text size="1" color="muted">
              Visitors
            </Text>
          </Row>
          <Text weight="semi-bold" size="4">
            {formatNumber(website.visitors)}
          </Text>
        </Column>

        <Column
          backgroundColor="2"
          borderRadius="2"
          padding="3"
          gap="1"
        >
          <Row gap="2" alignItems="center">
            <Icon size="xs" color="muted">
              <Eye size={14} />
            </Icon>
            <Text size="1" color="muted">
              Pageviews
            </Text>
          </Row>
          <Text weight="semi-bold" size="4">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>
      </Grid>

      {/* Footer */}
      <Row justifyContent="space-between" alignItems="center" paddingTop="2">
        <Row gap="2" alignItems="center">
          <Icon
            size="xs"
            color={isPositiveTrend ? 'green' : 'red'}
          >
            {isPositiveTrend ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          </Icon>
          <Text
            size="1"
            color={isPositiveTrend ? 'green' : 'red'}
            weight="medium"
          >
            {isPositiveTrend ? '+' : ''}
            {website.trend}%
          </Text>
          <Text size="1" color="muted">
            vs last period
          </Text>
        </Row>
        <Icon size="sm" color="muted">
          <ArrowRight size={16} />
        </Icon>
      </Row>
    </Column>
  );
}

export default function CardGridWebsitesPage() {
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredWebsites = mockWebsites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
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
        .website-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-3);
        }
      `}</style>
      <Column
        width="100%"
        maxWidth="1320px"
        paddingX={{ xs: '3', md: '6' }}
        paddingBottom="6"
        style={{ margin: '0 auto' }}
      >
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
            <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
            <Text color="muted">
              {filteredWebsites.length} sites tracked
            </Text>
          </Column>
          <Row gap="3">
            <Row
              backgroundColor="2"
              borderRadius="2"
              padding="1"
            >
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'quiet'}
                size="sm"
                onPress={() => setViewMode('grid')}
              >
                <Icon size="sm">
                  <LayoutGrid size={16} />
                </Icon>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'quiet'}
                size="sm"
                onPress={() => setViewMode('list')}
              >
                <Icon size="sm">
                  <List size={16} />
                </Icon>
              </Button>
            </Row>
            <Button variant="primary">
              <Icon>
                <Plus size={16} />
              </Icon>
              Add Website
            </Button>
          </Row>
        </Row>

        {/* Search and Filters */}
        <Row marginBottom="6" gap="3">
          <SearchField
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search websites..."
            style={{ maxWidth: 320 }}
          />
        </Row>

        {/* Cards Grid */}
        <Grid
          columns={{ xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }}
          gap="4"
        >
          {filteredWebsites.map((website, index) => (
            <WebsiteCard key={website.id} website={website} index={index} />
          ))}
        </Grid>

        {filteredWebsites.length === 0 && (
          <Column
            alignItems="center"
            justifyContent="center"
            padding="12"
            gap="3"
          >
            <Icon size="lg" color="muted">
              <Globe size={48} />
            </Icon>
            <Text color="muted">No websites found</Text>
          </Column>
        )}
      </Column>
    </>
  );
}
