'use client';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  Column,
  Row,
  Heading,
  Text,
  Icon,
  Button,
  SearchField,
} from '@umami/react-zen';
import {
  Globe,
  SquarePen,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  Activity,
  Eye,
  Users,
  MousePointer,
  Clock,
  Sparkles,
  Zap,
  BarChart3,
  Star,
  StarOff,
} from '@/components/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';

// Mock realistic data with richer information
const mockWebsites = [
  {
    id: '1',
    name: 'Marketing Website',
    domain: 'marketing.acme.com',
    stats: {
      pageviews: 45230,
      visitors: 12840,
      trend: 12.5,
      isUp: true,
      activeNow: 47,
      avgSessionDuration: '2m 34s',
    },
    status: 'active',
    lastVisit: '2 min ago',
    isFavorite: true,
    tags: ['marketing', 'main'],
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'shop.acme.com',
    stats: {
      pageviews: 128450,
      visitors: 34210,
      trend: 8.3,
      isUp: true,
      activeNow: 234,
      avgSessionDuration: '4m 12s',
    },
    status: 'active',
    lastVisit: '1 min ago',
    isFavorite: true,
    tags: ['commerce', 'revenue'],
  },
  {
    id: '3',
    name: 'Developer Documentation',
    domain: 'docs.acme.com',
    stats: {
      pageviews: 67890,
      visitors: 18230,
      trend: 3.2,
      isUp: false,
      activeNow: 89,
      avgSessionDuration: '6m 45s',
    },
    status: 'active',
    lastVisit: '5 min ago',
    isFavorite: false,
    tags: ['docs'],
  },
  {
    id: '4',
    name: 'Company Blog',
    domain: 'blog.acme.com',
    stats: {
      pageviews: 23560,
      visitors: 8940,
      trend: 15.7,
      isUp: true,
      activeNow: 23,
      avgSessionDuration: '3m 18s',
    },
    status: 'active',
    lastVisit: '12 min ago',
    isFavorite: false,
    tags: ['content', 'seo'],
  },
  {
    id: '5',
    name: 'Support Portal',
    domain: 'support.acme.com',
    stats: {
      pageviews: 15670,
      visitors: 5230,
      trend: 2.1,
      isUp: false,
      activeNow: 0,
      avgSessionDuration: '5m 02s',
    },
    status: 'inactive',
    lastVisit: '3 hours ago',
    isFavorite: false,
    tags: ['support'],
  },
  {
    id: '6',
    name: 'Landing Pages',
    domain: 'go.acme.com',
    stats: {
      pageviews: 89120,
      visitors: 41560,
      trend: 24.8,
      isUp: true,
      activeNow: 156,
      avgSessionDuration: '1m 23s',
    },
    status: 'active',
    lastVisit: 'Just now',
    isFavorite: true,
    tags: ['campaigns', 'ads'],
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

// Mini sparkline component
function MiniSparkline({ trend, isUp }: { trend: number; isUp: boolean }) {
  const color = isUp ? 'var(--color-green-500)' : 'var(--color-red-500)';
  // Generate a simple visual representation
  const points = isUp
    ? 'M0,20 L5,18 L10,15 L15,16 L20,12 L25,10 L30,8 L35,5 L40,3'
    : 'M0,5 L5,7 L10,6 L15,10 L20,12 L25,15 L30,14 L35,18 L40,20';

  return (
    <svg width="40" height="24" viewBox="0 0 40 24" style={{ marginLeft: '8px' }}>
      <path
        d={points}
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
  onToggleFavorite,
}: {
  website: (typeof mockWebsites)[0];
  onToggleFavorite: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Column
      gap="0"
      border
      borderRadius="3"
      backgroundColor
      style={{
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card header with gradient accent */}
      <div
        style={{
          height: '4px',
          background:
            website.status === 'active'
              ? 'linear-gradient(90deg, var(--color-primary-500), var(--color-primary-400))'
              : 'var(--color-gray-300)',
        }}
      />

      <Column gap="4" paddingX="5" paddingY="4">
        {/* Top row: Icon, Name, Actions */}
        <Row justifyContent="space-between" alignItems="flex-start">
          <Row alignItems="center" gap="3">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--color-primary-100), var(--color-primary-50))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-primary-200)',
              }}
            >
              <Icon size="md" color="primary">
                <Globe />
              </Icon>
            </div>
            <Column gap="0">
              <Row alignItems="center" gap="2">
                <Heading size="2">{website.name}</Heading>
                {website.stats.activeNow > 0 && (
                  <Row
                    alignItems="center"
                    gap="1"
                    paddingX="2"
                    paddingY="1"
                    borderRadius="2"
                    style={{ backgroundColor: 'var(--color-green-100)' }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-green-500)',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <Text size="0" style={{ color: 'var(--color-green-700)' }}>
                      {website.stats.activeNow} live
                    </Text>
                  </Row>
                )}
              </Row>
              <Text size="1" color="muted">
                {website.domain}
              </Text>
            </Column>
          </Row>
          <Row gap="1">
            <Button
              variant="quiet"
              size="sm"
              onPress={() => onToggleFavorite(website.id)}
            >
              <Icon
                size="sm"
                style={{
                  color: website.isFavorite
                    ? 'var(--color-yellow-500)'
                    : 'var(--color-gray-400)',
                }}
              >
                {website.isFavorite ? <Star /> : <StarOff />}
              </Icon>
            </Button>
          </Row>
        </Row>

        {/* Stats grid */}
        <Row
          gap="0"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          <Column
            gap="1"
            paddingX="3"
            paddingY="3"
            borderRadius="2"
            style={{ backgroundColor: 'var(--color-gray-50)' }}
          >
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Users />
              </Icon>
              <Text size="0" color="muted">
                Visitors
              </Text>
            </Row>
            <Text size="3" weight="bold">
              {formatNumber(website.stats.visitors)}
            </Text>
          </Column>
          <Column
            gap="1"
            paddingX="3"
            paddingY="3"
            borderRadius="2"
            style={{ backgroundColor: 'var(--color-gray-50)' }}
          >
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Eye />
              </Icon>
              <Text size="0" color="muted">
                Pageviews
              </Text>
            </Row>
            <Text size="3" weight="bold">
              {formatNumber(website.stats.pageviews)}
            </Text>
          </Column>
        </Row>

        {/* Trend row */}
        <Row
          alignItems="center"
          justifyContent="space-between"
          paddingX="3"
          paddingY="3"
          borderRadius="2"
          style={{
            backgroundColor: website.stats.isUp
              ? 'var(--color-green-50)'
              : 'var(--color-red-50)',
          }}
        >
          <Row alignItems="center" gap="2">
            <Icon
              size="sm"
              style={{
                color: website.stats.isUp
                  ? 'var(--color-green-600)'
                  : 'var(--color-red-600)',
              }}
            >
              {website.stats.isUp ? <TrendingUp /> : <TrendingDown />}
            </Icon>
            <Column gap="0">
              <Text
                size="2"
                weight="bold"
                style={{
                  color: website.stats.isUp
                    ? 'var(--color-green-700)'
                    : 'var(--color-red-700)',
                }}
              >
                {website.stats.isUp ? '+' : '-'}
                {website.stats.trend}%
              </Text>
              <Text size="0" color="muted">
                vs last 7 days
              </Text>
            </Column>
          </Row>
          <MiniSparkline trend={website.stats.trend} isUp={website.stats.isUp} />
        </Row>

        {/* Tags */}
        <Row gap="2" wrap="wrap">
          {website.tags.map((tag) => (
            <Text
              key={tag}
              size="0"
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--color-gray-100)',
                color: 'var(--color-gray-600)',
              }}
            >
              {tag}
            </Text>
          ))}
        </Row>
      </Column>

      {/* Card footer */}
      <Row
        justifyContent="space-between"
        alignItems="center"
        paddingX="5"
        paddingY="3"
        style={{
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--color-gray-25)',
        }}
      >
        <Row alignItems="center" gap="2">
          <Icon size="xs" color="muted">
            <Clock />
          </Icon>
          <Text size="0" color="muted">
            {website.lastVisit}
          </Text>
          <Text size="0" color="muted">
            ·
          </Text>
          <Text size="0" color="muted">
            Avg. {website.stats.avgSessionDuration}
          </Text>
        </Row>
        <Row gap="1">
          <Link href={`/websites/${website.id}/settings`}>
            <Button variant="quiet" size="sm">
              <Icon size="sm">
                <SquarePen />
              </Icon>
            </Button>
          </Link>
          <Link href={`/websites/${website.id}`}>
            <Button variant="primary" size="sm">
              <Icon size="sm">
                <BarChart3 />
              </Icon>
              <Text size="1">View</Text>
            </Button>
          </Link>
        </Row>
      </Row>
    </Column>
  );
}

export default function GridCardsPrototype() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'favorites'>(
    'all'
  );
  const [websites, setWebsites] = useState(mockWebsites);

  const handleToggleFavorite = (id: string) => {
    setWebsites((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w))
    );
  };

  const filteredWebsites = useMemo(() => {
    let result = websites;

    if (filter === 'favorites') {
      result = result.filter((w) => w.isFavorite);
    } else if (filter !== 'all') {
      result = result.filter((w) => w.status === filter);
    }

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(lowerSearch) ||
          w.domain.toLowerCase().includes(lowerSearch) ||
          w.tags.some((t) => t.toLowerCase().includes(lowerSearch))
      );
    }

    return result;
  }, [search, filter, websites]);

  const activeCount = websites.filter((w) => w.status === 'active').length;
  const inactiveCount = websites.filter((w) => w.status === 'inactive').length;
  const favoritesCount = websites.filter((w) => w.isFavorite).length;
  const totalActiveNow = websites.reduce((sum, w) => sum + w.stats.activeNow, 0);

  return (
    <PageBody>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </Button>
        </PageHeader>

        {/* Enhanced live stats bar */}
        <Row
          gap="0"
          border
          borderRadius="3"
          backgroundColor
          style={{ overflow: 'hidden' }}
        >
          {/* Live indicator section */}
          <Column
            gap="2"
            paddingX="5"
            paddingY="4"
            alignItems="center"
            justifyContent="center"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))',
              minWidth: '140px',
            }}
          >
            <Row alignItems="center" gap="2">
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              <Text size="1" weight="bold" style={{ color: '#fff' }}>
                LIVE NOW
              </Text>
            </Row>
            <Text size="6" weight="bold" style={{ color: '#fff' }}>
              {totalActiveNow}
            </Text>
            <Text size="0" style={{ color: 'rgba(255,255,255,0.8)' }}>
              active visitors
            </Text>
          </Column>

          {/* Stats section */}
          <Row gap="6" paddingX="6" paddingY="4" flex="1" alignItems="center">
            <Column gap="1">
              <Text size="0" color="muted" weight="medium">
                Total Visitors
              </Text>
              <Row alignItems="baseline" gap="2">
                <Text size="5" weight="bold">
                  {formatNumber(
                    websites.reduce((sum, w) => sum + w.stats.visitors, 0)
                  )}
                </Text>
                <Row alignItems="center" gap="1">
                  <Icon size="xs" style={{ color: 'var(--color-green-600)' }}>
                    <TrendingUp />
                  </Icon>
                  <Text size="1" style={{ color: 'var(--color-green-600)' }}>
                    +12.4%
                  </Text>
                </Row>
              </Row>
            </Column>
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: 'var(--border-color)',
              }}
            />
            <Column gap="1">
              <Text size="0" color="muted" weight="medium">
                Total Pageviews
              </Text>
              <Row alignItems="baseline" gap="2">
                <Text size="5" weight="bold">
                  {formatNumber(
                    websites.reduce((sum, w) => sum + w.stats.pageviews, 0)
                  )}
                </Text>
                <Row alignItems="center" gap="1">
                  <Icon size="xs" style={{ color: 'var(--color-green-600)' }}>
                    <TrendingUp />
                  </Icon>
                  <Text size="1" style={{ color: 'var(--color-green-600)' }}>
                    +8.7%
                  </Text>
                </Row>
              </Row>
            </Column>
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: 'var(--border-color)',
              }}
            />
            <Column gap="1">
              <Text size="0" color="muted" weight="medium">
                Avg. Session
              </Text>
              <Text size="5" weight="bold">
                3m 52s
              </Text>
            </Column>
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: 'var(--border-color)',
              }}
            />
            <Column gap="1">
              <Text size="0" color="muted" weight="medium">
                Active Sites
              </Text>
              <Row alignItems="baseline" gap="1">
                <Text size="5" weight="bold">
                  {activeCount}
                </Text>
                <Text size="2" color="muted">
                  / {websites.length}
                </Text>
              </Row>
            </Column>
          </Row>
        </Row>

        {/* Filters and search */}
        <Row justifyContent="space-between" alignItems="center" gap="4">
          <Row gap="2">
            <Button
              variant={filter === 'all' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setFilter('all')}
            >
              All ({websites.length})
            </Button>
            <Button
              variant={filter === 'favorites' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setFilter('favorites')}
            >
              <Icon size="sm" style={{ color: 'var(--color-yellow-500)' }}>
                <Star />
              </Icon>
              Favorites ({favoritesCount})
            </Button>
            <Button
              variant={filter === 'active' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setFilter('active')}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-green-500)',
                }}
              />
              Active ({activeCount})
            </Button>
            <Button
              variant={filter === 'inactive' ? 'secondary' : 'quiet'}
              size="sm"
              onPress={() => setFilter('inactive')}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-gray-400)',
                }}
              />
              Inactive ({inactiveCount})
            </Button>
          </Row>
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search by name, domain, or tag..."
          />
        </Row>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredWebsites.map((website) => (
            <WebsiteCard
              key={website.id}
              website={website}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>

        {filteredWebsites.length === 0 && (
          <Column alignItems="center" paddingY="10" gap="3">
            <Icon size="lg" color="muted">
              <Globe />
            </Icon>
            <Text color="muted">No websites found matching your criteria.</Text>
            <Button variant="quiet" size="sm" onPress={() => setFilter('all')}>
              Clear filters
            </Button>
          </Column>
        )}
      </Column>
    </PageBody>
  );
}
