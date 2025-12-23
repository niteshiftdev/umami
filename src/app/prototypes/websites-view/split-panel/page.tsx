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
} from '@umami/react-zen';
import {
  Globe,
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Settings,
  Clock,
  MapPin,
  Monitor,
  ChevronRight,
  ExternalLink,
  Activity,
} from '@/components/icons';
import { Favicon } from '@/components/common/Favicon';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';

// Sample data
const sampleWebsites = [
  {
    id: '1',
    name: 'Acme Corp',
    domain: 'acme.com',
    visitors: 12847,
    pageviews: 45230,
    trend: 12.5,
    status: 'active',
    activeNow: 42,
    topPages: [
      { path: '/products', views: 8234 },
      { path: '/pricing', views: 5621 },
      { path: '/about', views: 3412 },
    ],
    topCountries: [
      { name: 'United States', visitors: 5234 },
      { name: 'Germany', visitors: 2341 },
      { name: 'United Kingdom', visitors: 1823 },
    ],
    recentEvents: [
      { type: 'pageview', path: '/checkout', time: '2 sec ago' },
      { type: 'event', name: 'button_click', time: '15 sec ago' },
      { type: 'pageview', path: '/products/item-123', time: '23 sec ago' },
      { type: 'pageview', path: '/cart', time: '45 sec ago' },
      { type: 'event', name: 'add_to_cart', time: '1 min ago' },
    ],
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'techstart.io',
    visitors: 8934,
    pageviews: 28104,
    trend: -3.2,
    status: 'active',
    activeNow: 18,
    topPages: [
      { path: '/blog/react-tips', views: 4521 },
      { path: '/blog/nextjs-guide', views: 3892 },
      { path: '/about', views: 1234 },
    ],
    topCountries: [
      { name: 'India', visitors: 3421 },
      { name: 'United States', visitors: 2134 },
      { name: 'Brazil', visitors: 987 },
    ],
    recentEvents: [
      { type: 'pageview', path: '/blog/react-tips', time: '5 sec ago' },
      { type: 'pageview', path: '/blog', time: '18 sec ago' },
      { type: 'event', name: 'newsletter_signup', time: '2 min ago' },
    ],
  },
  {
    id: '3',
    name: 'E-Shop Store',
    domain: 'eshop.store',
    visitors: 34521,
    pageviews: 156780,
    trend: 28.7,
    status: 'active',
    activeNow: 156,
    topPages: [
      { path: '/sale', views: 23456 },
      { path: '/new-arrivals', views: 18234 },
      { path: '/checkout', views: 12345 },
    ],
    topCountries: [
      { name: 'United States', visitors: 12345 },
      { name: 'Canada', visitors: 8234 },
      { name: 'Australia', visitors: 5432 },
    ],
    recentEvents: [
      { type: 'event', name: 'purchase', time: '1 sec ago' },
      { type: 'pageview', path: '/thank-you', time: '3 sec ago' },
      { type: 'event', name: 'checkout_start', time: '8 sec ago' },
      { type: 'pageview', path: '/cart', time: '12 sec ago' },
    ],
  },
  {
    id: '4',
    name: 'Portfolio Site',
    domain: 'jane-doe.dev',
    visitors: 2341,
    pageviews: 5892,
    trend: 5.1,
    status: 'inactive',
    activeNow: 0,
    topPages: [
      { path: '/projects', views: 2134 },
      { path: '/contact', views: 1234 },
      { path: '/resume', views: 987 },
    ],
    topCountries: [
      { name: 'United States', visitors: 1234 },
      { name: 'Germany', visitors: 432 },
      { name: 'France', visitors: 234 },
    ],
    recentEvents: [
      { type: 'pageview', path: '/projects', time: '3 hours ago' },
      { type: 'event', name: 'contact_form', time: '5 hours ago' },
    ],
  },
  {
    id: '5',
    name: 'SaaS Dashboard',
    domain: 'app.saasify.com',
    visitors: 18923,
    pageviews: 89234,
    trend: -1.8,
    status: 'active',
    activeNow: 89,
    topPages: [
      { path: '/dashboard', views: 34521 },
      { path: '/settings', views: 12345 },
      { path: '/reports', views: 8923 },
    ],
    topCountries: [
      { name: 'United States', visitors: 8234 },
      { name: 'United Kingdom', visitors: 4321 },
      { name: 'Germany', visitors: 2345 },
    ],
    recentEvents: [
      { type: 'pageview', path: '/dashboard', time: '1 sec ago' },
      { type: 'event', name: 'export_report', time: '12 sec ago' },
      { type: 'pageview', path: '/reports', time: '25 sec ago' },
    ],
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function WebsiteListItem({
  website,
  isSelected,
  onSelect,
}: {
  website: (typeof sampleWebsites)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isActive = website.status === 'active';

  return (
    <Row
      padding="4"
      gap="3"
      alignItems="center"
      borderRadius="2"
      onClick={onSelect}
      style={{
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--primary-color-100)' : 'transparent',
        borderLeft: isSelected ? '3px solid var(--primary-color)' : '3px solid transparent',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: 'var(--base-color-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Favicon domain={website.domain} />
      </div>
      <Column gap="1" style={{ flex: 1, minWidth: 0 }}>
        <Row alignItems="center" gap="2">
          <Text weight="medium" truncate>
            {website.name}
          </Text>
          {isActive && website.activeNow > 0 && (
            <Row
              alignItems="center"
              gap="1"
              padding="1"
              paddingX="2"
              borderRadius="full"
              style={{ backgroundColor: 'var(--green-color-100)' }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: 'var(--green-color-600)',
                }}
              />
              <Text size="0" color="success">
                {website.activeNow}
              </Text>
            </Row>
          )}
        </Row>
        <Text color="muted" size="0" truncate>
          {website.domain}
        </Text>
      </Column>
      <Icon color="muted" size="sm">
        <ChevronRight />
      </Icon>
    </Row>
  );
}

function DetailPanel({ website }: { website: (typeof sampleWebsites)[0] }) {
  const isPositive = website.trend >= 0;

  return (
    <Column gap="5" padding="5" style={{ height: '100%', overflow: 'auto' }}>
      {/* Header */}
      <Row justifyContent="space-between" alignItems="flex-start">
        <Row alignItems="center" gap="3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: 'var(--base-color-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Favicon domain={website.domain} />
          </div>
          <Column gap="1">
            <Heading size="3">{website.name}</Heading>
            <Row alignItems="center" gap="2">
              <Text color="muted">{website.domain}</Text>
              <a href={`https://${website.domain}`} target="_blank" rel="noopener noreferrer">
                <Icon size="sm" color="muted">
                  <ExternalLink />
                </Icon>
              </a>
            </Row>
          </Column>
        </Row>
        <Row gap="2">
          <Link href={`/websites/${website.id}`}>
            <Button variant="primary">
              <Icon size="sm">
                <Eye />
              </Icon>
              <Text>View Analytics</Text>
            </Button>
          </Link>
          <Link href={`/websites/${website.id}/settings`}>
            <Button variant="secondary">
              <Icon size="sm">
                <Settings />
              </Icon>
            </Button>
          </Link>
        </Row>
      </Row>

      {/* Quick Stats */}
      <Row gap="3">
        <Column
          padding="4"
          border
          borderRadius="2"
          backgroundColor
          style={{ flex: 1 }}
        >
          <Row alignItems="center" gap="2" marginBottom="2">
            <Icon size="sm" color="muted">
              <Users />
            </Icon>
            <Text color="muted" size="1">
              Visitors (7d)
            </Text>
          </Row>
          <Row alignItems="baseline" gap="2">
            <Text weight="bold" size="5">
              {formatNumber(website.visitors)}
            </Text>
            <Row alignItems="center" gap="1">
              <Icon size="xs" color={isPositive ? 'success' : 'error'}>
                {isPositive ? <TrendingUp /> : <TrendingDown />}
              </Icon>
              <Text size="0" color={isPositive ? 'success' : 'error'}>
                {isPositive ? '+' : ''}
                {website.trend}%
              </Text>
            </Row>
          </Row>
        </Column>
        <Column
          padding="4"
          border
          borderRadius="2"
          backgroundColor
          style={{ flex: 1 }}
        >
          <Row alignItems="center" gap="2" marginBottom="2">
            <Icon size="sm" color="muted">
              <Eye />
            </Icon>
            <Text color="muted" size="1">
              Pageviews (7d)
            </Text>
          </Row>
          <Text weight="bold" size="5">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>
        <Column
          padding="4"
          border
          borderRadius="2"
          backgroundColor
          style={{ flex: 1 }}
        >
          <Row alignItems="center" gap="2" marginBottom="2">
            <Icon size="sm" color="muted">
              <Activity />
            </Icon>
            <Text color="muted" size="1">
              Active Now
            </Text>
          </Row>
          <Row alignItems="center" gap="2">
            <Text weight="bold" size="5">
              {website.activeNow}
            </Text>
            {website.activeNow > 0 && (
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'var(--green-color-600)',
                  animation: 'pulse 2s infinite',
                }}
              />
            )}
          </Row>
        </Column>
      </Row>

      {/* Content Grid */}
      <Row gap="4" style={{ flex: 1 }}>
        {/* Top Pages */}
        <Column border borderRadius="2" backgroundColor style={{ flex: 1 }}>
          <Row padding="4" border="bottom">
            <Text weight="medium">Top Pages</Text>
          </Row>
          <Column padding="2">
            {website.topPages.map((page, i) => (
              <Row
                key={i}
                padding="3"
                justifyContent="space-between"
                alignItems="center"
                borderRadius="2"
                style={{ backgroundColor: i % 2 === 0 ? 'var(--base-color-50)' : 'transparent' }}
              >
                <Text size="1" truncate style={{ maxWidth: 180 }}>
                  {page.path}
                </Text>
                <Text size="1" color="muted">
                  {formatNumber(page.views)}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>

        {/* Top Countries */}
        <Column border borderRadius="2" backgroundColor style={{ flex: 1 }}>
          <Row padding="4" border="bottom">
            <Text weight="medium">Top Countries</Text>
          </Row>
          <Column padding="2">
            {website.topCountries.map((country, i) => (
              <Row
                key={i}
                padding="3"
                justifyContent="space-between"
                alignItems="center"
                borderRadius="2"
                style={{ backgroundColor: i % 2 === 0 ? 'var(--base-color-50)' : 'transparent' }}
              >
                <Row alignItems="center" gap="2">
                  <Icon size="sm" color="muted">
                    <MapPin />
                  </Icon>
                  <Text size="1">{country.name}</Text>
                </Row>
                <Text size="1" color="muted">
                  {formatNumber(country.visitors)}
                </Text>
              </Row>
            ))}
          </Column>
        </Column>
      </Row>

      {/* Recent Activity */}
      <Column border borderRadius="2" backgroundColor>
        <Row padding="4" border="bottom" justifyContent="space-between" alignItems="center">
          <Text weight="medium">Recent Activity</Text>
          <Link href={`/websites/${website.id}/realtime`}>
            <Button variant="quiet" size="sm">
              View Realtime
            </Button>
          </Link>
        </Row>
        <Column padding="2" style={{ maxHeight: 200, overflow: 'auto' }}>
          {website.recentEvents.map((event, i) => (
            <Row key={i} padding="3" gap="3" alignItems="center">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor:
                    event.type === 'pageview'
                      ? 'var(--primary-color)'
                      : 'var(--purple-color-600)',
                }}
              />
              <Text size="1" style={{ flex: 1 }}>
                {event.type === 'pageview' ? (
                  <>
                    Viewed <Text weight="medium">{event.path}</Text>
                  </>
                ) : (
                  <>
                    Event <Text weight="medium">{event.name}</Text>
                  </>
                )}
              </Text>
              <Text size="0" color="muted">
                {event.time}
              </Text>
            </Row>
          ))}
        </Column>
      </Column>
    </Column>
  );
}

export default function SplitPanelVariation() {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(sampleWebsites[0].id);

  const filteredWebsites = sampleWebsites.filter(
    (w) =>
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.domain.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedWebsite = sampleWebsites.find((w) => w.id === selectedId) || sampleWebsites[0];

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
            <Text color="muted">Select a website to view quick insights</Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add website</Text>
          </Button>
        </Row>

        {/* Split View */}
        <Row gap="4" style={{ minHeight: 600 }}>
          {/* Left Panel - Website List */}
          <Column
            border
            borderRadius="3"
            backgroundColor
            style={{ width: 320, flexShrink: 0 }}
          >
            <Column padding="4" border="bottom">
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder="Search..."
              />
            </Column>
            <Column padding="2" gap="1" style={{ overflow: 'auto' }}>
              {filteredWebsites.map((website) => (
                <WebsiteListItem
                  key={website.id}
                  website={website}
                  isSelected={website.id === selectedId}
                  onSelect={() => setSelectedId(website.id)}
                />
              ))}
              {filteredWebsites.length === 0 && (
                <Column alignItems="center" padding="6" gap="3">
                  <Icon color="muted">
                    <Globe />
                  </Icon>
                  <Text color="muted" size="1">
                    No websites found
                  </Text>
                </Column>
              )}
            </Column>
          </Column>

          {/* Right Panel - Details */}
          <Panel style={{ flex: 1 }}>
            <DetailPanel website={selectedWebsite} />
          </Panel>
        </Row>
      </Column>
    </PageBody>
  );
}
