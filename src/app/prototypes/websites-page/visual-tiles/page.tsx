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
  Users,
  Eye,
  Star,
  StarOff,
} from 'lucide-react';

// Mock websites with visual data
const mockWebsites = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    visitors: 12847,
    pageviews: 45231,
    trend: 12.5,
    isOnline: 3,
    isFavorite: true,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'Business',
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    visitors: 8934,
    pageviews: 28476,
    trend: -4.2,
    isOnline: 7,
    isFavorite: false,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    category: 'Blog',
  },
  {
    id: '3',
    name: 'E-Commerce Store',
    domain: 'shop.example.org',
    visitors: 34521,
    pageviews: 98234,
    trend: 28.3,
    isOnline: 15,
    isFavorite: true,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    category: 'E-Commerce',
  },
  {
    id: '4',
    name: 'Portfolio Site',
    domain: 'designer.me',
    visitors: 2341,
    pageviews: 5672,
    trend: 8.7,
    isOnline: 0,
    isFavorite: false,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    category: 'Portfolio',
  },
  {
    id: '5',
    name: 'SaaS Dashboard',
    domain: 'app.saasproduct.com',
    visitors: 18234,
    pageviews: 67843,
    trend: 15.1,
    isOnline: 42,
    isFavorite: true,
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    category: 'SaaS',
  },
  {
    id: '6',
    name: 'Documentation Hub',
    domain: 'docs.opensource.dev',
    visitors: 6723,
    pageviews: 21345,
    trend: -1.8,
    isOnline: 8,
    isFavorite: false,
    color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    category: 'Documentation',
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function VisualTile({ website, index }: { website: (typeof mockWebsites)[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(website.isFavorite);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Column
      position="relative"
      borderRadius="4"
      overflow="hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.2s ease',
        boxShadow: isHovered
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : '0 4px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
    >
      {/* Gradient Background Header */}
      <Row
        position="relative"
        padding="5"
        style={{
          background: website.color,
          minHeight: 140,
        }}
      >
        {/* Decorative pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: isHovered ? 0.5 : 0.3,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Favorite Button */}
        <Row position="absolute" style={{ top: 12, right: 12, zIndex: 2 }}>
          <Button
            variant="quiet"
            size="sm"
            onPress={() => setIsFavorite(!isFavorite)}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Icon style={{ color: isFavorite ? '#ffd700' : 'rgba(255,255,255,0.8)' }}>
              {isFavorite ? <Star fill="currentColor" /> : <StarOff />}
            </Icon>
          </Button>
        </Row>

        {/* Online indicator */}
        {website.isOnline > 0 && (
          <Row
            position="absolute"
            style={{
              top: 12,
              left: 12,
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
              borderRadius: 20,
              padding: '4px 10px',
            }}
          >
            <StatusLight variant="success">
              <Text size="1" style={{ color: 'white' }}>
                {website.isOnline} online
              </Text>
            </StatusLight>
          </Row>
        )}

        {/* Large Icon */}
        <Row
          alignItems="center"
          justifyContent="center"
          style={{
            position: 'absolute',
            bottom: -30,
            left: 24,
            width: 60,
            height: 60,
            borderRadius: 16,
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 2,
          }}
        >
          <Icon size="lg" color="muted">
            <Globe />
          </Icon>
        </Row>
      </Row>

      {/* Content Section */}
      <Column backgroundColor padding="5" paddingTop="6" style={{ paddingLeft: 100 }}>
        {/* Category Badge */}
        <Row marginBottom="2">
          <Text
            size="1"
            weight="medium"
            style={{
              backgroundColor: 'var(--base-color-100)',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            {website.category}
          </Text>
        </Row>

        {/* Website Name */}
        <Link
          href={`/websites/${website.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Text size="4" weight="bold">
            {website.name}
          </Text>
        </Link>

        {/* Domain with external link */}
        <Row alignItems="center" gap="1" marginTop="1">
          <Text size="2" color="muted">
            {website.domain}
          </Text>
          <a
            href={`https://${website.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
          >
            <Icon size="xs" color="muted">
              <ExternalLink />
            </Icon>
          </a>
        </Row>
      </Column>

      {/* Stats Section */}
      <Row
        padding="4"
        backgroundColor="2"
        justifyContent="space-between"
        alignItems="center"
        border="top"
      >
        <Row gap="5">
          <Column gap="0">
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Users />
              </Icon>
              <Text size="1" color="muted">
                Visitors
              </Text>
            </Row>
            <Text size="3" weight="bold">
              {formatNumber(website.visitors)}
            </Text>
          </Column>
          <Column gap="0">
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Eye />
              </Icon>
              <Text size="1" color="muted">
                Pageviews
              </Text>
            </Row>
            <Text size="3" weight="bold">
              {formatNumber(website.pageviews)}
            </Text>
          </Column>
        </Row>

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

      {/* Hover Actions Overlay */}
      <Row
        position="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          opacity: isHovered ? 1 : 0,
          pointerEvents: isHovered ? 'auto' : 'none',
          transition: 'opacity 0.2s ease',
          backdropFilter: 'blur(2px)',
        }}
        alignItems="center"
        justifyContent="center"
        gap="3"
      >
        <Link href={`/websites/${website.id}`}>
          <Button variant="primary" size="lg">
            <Icon>
              <BarChart3 />
            </Icon>
            <Text>View Dashboard</Text>
          </Button>
        </Link>
        <Link href={`/websites/${website.id}/settings`}>
          <Button
            variant="outline"
            size="lg"
            style={{ backgroundColor: 'white' }}
          >
            <Icon>
              <SquarePen />
            </Icon>
            <Text>Settings</Text>
          </Button>
        </Link>
      </Row>
    </Column>
  );
}

export default function VisualTilesWebsitesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredWebsites = mockWebsites
    .filter(
      website =>
        website.name.toLowerCase().includes(search.toLowerCase()) ||
        website.domain.toLowerCase().includes(search.toLowerCase()),
    )
    .filter(website => (filter === 'favorites' ? website.isFavorite : true));

  return (
    <Column
      width="100%"
      paddingBottom="6"
      maxWidth="1400px"
      paddingX={{ xs: '3', md: '6' }}
      style={{ margin: '0 auto' }}
    >
      <Column gap="6" margin="2">
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="4"
          border="bottom"
          width="100%"
        >
          <Column gap="2">
            <Text size="7" weight="bold">
              Websites
            </Text>
            <Text color="muted" size="3">
              Your tracked websites at a glance
            </Text>
          </Column>
          <Button variant="primary" size="lg">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </Button>
        </Row>

        {/* Search and Filters */}
        <Row alignItems="center" justifyContent="space-between" gap="4" wrap="wrap">
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search websites..."
            style={{ maxWidth: '320px' }}
          />
          <Row gap="2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setFilter('all')}
            >
              <Text size="2">All Sites</Text>
            </Button>
            <Button
              variant={filter === 'favorites' ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setFilter('favorites')}
            >
              <Icon size="sm">
                <Star />
              </Icon>
              <Text size="2">Favorites</Text>
            </Button>
          </Row>
        </Row>

        {/* Visual Tiles Grid */}
        <Grid columns={{ xs: '1', md: '2', lg: '2' }} gap="6">
          {filteredWebsites.map((website, index) => (
            <VisualTile key={website.id} website={website} index={index} />
          ))}
        </Grid>

        {filteredWebsites.length === 0 && (
          <Column
            alignItems="center"
            justifyContent="center"
            padding="8"
            backgroundColor="2"
            borderRadius="3"
          >
            <Icon size="xl" color="muted">
              <Globe />
            </Icon>
            <Text size="4" weight="medium" style={{ marginTop: '16px' }}>
              No websites found
            </Text>
            <Text color="muted" style={{ marginTop: '8px' }}>
              {filter === 'favorites'
                ? 'No favorite websites yet. Star some websites to see them here.'
                : 'Try adjusting your search query.'}
            </Text>
          </Column>
        )}
      </Column>
    </Column>
  );
}
