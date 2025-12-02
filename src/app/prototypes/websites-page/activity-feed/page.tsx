'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Text,
  Heading,
  Icon,
  Button,
  SearchField,
  StatusLight,
  Grid,
} from '@umami/react-zen';
import {
  Globe,
  Plus,
  Users,
  Eye,
  MousePointer,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';

// Mock data with activity information
const mockWebsites = [
  {
    id: '1',
    name: 'Marketing Site',
    domain: 'marketing.example.com',
    visitors: 12847,
    pageviews: 45231,
    activeNow: 47,
    status: 'active',
    recentActivity: [
      {
        type: 'pageview',
        path: '/pricing',
        country: 'US',
        device: 'desktop',
        time: '2 min ago',
      },
      {
        type: 'event',
        name: 'signup_click',
        country: 'UK',
        device: 'mobile',
        time: '3 min ago',
      },
      {
        type: 'pageview',
        path: '/features',
        country: 'DE',
        device: 'desktop',
        time: '5 min ago',
      },
      {
        type: 'pageview',
        path: '/blog/launch',
        country: 'FR',
        device: 'tablet',
        time: '7 min ago',
      },
    ],
  },
  {
    id: '2',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    visitors: 8934,
    pageviews: 67823,
    activeNow: 123,
    status: 'active',
    recentActivity: [
      {
        type: 'event',
        name: 'add_to_cart',
        country: 'US',
        device: 'mobile',
        time: '1 min ago',
      },
      {
        type: 'event',
        name: 'purchase',
        country: 'CA',
        device: 'desktop',
        time: '2 min ago',
      },
      {
        type: 'pageview',
        path: '/products/shoes',
        country: 'US',
        device: 'mobile',
        time: '3 min ago',
      },
      {
        type: 'pageview',
        path: '/checkout',
        country: 'MX',
        device: 'desktop',
        time: '4 min ago',
      },
    ],
  },
  {
    id: '3',
    name: 'Documentation Portal',
    domain: 'docs.example.com',
    visitors: 5621,
    pageviews: 23456,
    activeNow: 89,
    status: 'active',
    recentActivity: [
      {
        type: 'pageview',
        path: '/api/authentication',
        country: 'IN',
        device: 'desktop',
        time: '1 min ago',
      },
      {
        type: 'pageview',
        path: '/guides/quickstart',
        country: 'US',
        device: 'desktop',
        time: '2 min ago',
      },
      {
        type: 'event',
        name: 'copy_code',
        country: 'BR',
        device: 'desktop',
        time: '4 min ago',
      },
    ],
  },
  {
    id: '4',
    name: 'Developer Blog',
    domain: 'blog.example.com',
    visitors: 3412,
    pageviews: 8934,
    activeNow: 15,
    status: 'active',
    recentActivity: [
      {
        type: 'pageview',
        path: '/posts/nextjs-tips',
        country: 'JP',
        device: 'mobile',
        time: '5 min ago',
      },
      {
        type: 'event',
        name: 'share_article',
        country: 'US',
        device: 'desktop',
        time: '12 min ago',
      },
    ],
  },
  {
    id: '5',
    name: 'Support Center',
    domain: 'support.example.com',
    visitors: 2156,
    pageviews: 12345,
    activeNow: 34,
    status: 'active',
    recentActivity: [
      {
        type: 'pageview',
        path: '/tickets/new',
        country: 'AU',
        device: 'desktop',
        time: '3 min ago',
      },
      {
        type: 'event',
        name: 'ticket_submit',
        country: 'US',
        device: 'mobile',
        time: '8 min ago',
      },
    ],
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function ActivityItem({
  activity,
  index,
}: {
  activity: (typeof mockWebsites)[0]['recentActivity'][0];
  index: number;
}) {
  const isEvent = activity.type === 'event';

  return (
    <Row
      gap="3"
      alignItems="center"
      paddingY="2"
      style={{
        animation: `activitySlide 0.3s ease-out ${index * 0.05}s both`,
      }}
    >
      <Column
        backgroundColor={isEvent ? 'violet' : '3'}
        borderRadius="full"
        padding="1"
        alignItems="center"
        justifyContent="center"
        style={{ width: 24, height: 24, flexShrink: 0 }}
      >
        <Icon size="xs" color={isEvent ? '12' : 'muted'}>
          {isEvent ? <Zap size={12} /> : <Eye size={12} />}
        </Icon>
      </Column>
      <Column gap="0" flexGrow="1" style={{ minWidth: 0 }}>
        <Text size="1" weight="medium" truncate>
          {isEvent ? activity.name : activity.path}
        </Text>
        <Row gap="2" alignItems="center">
          <Text size="1" color="muted">
            {activity.country}
          </Text>
          <Icon size="xs" color="muted">
            {activity.device === 'mobile' ? (
              <Smartphone size={10} />
            ) : (
              <Monitor size={10} />
            )}
          </Icon>
        </Row>
      </Column>
      <Text size="1" color="muted" style={{ flexShrink: 0 }}>
        {activity.time}
      </Text>
    </Row>
  );
}

function WebsiteActivityCard({
  website,
  index,
}: {
  website: (typeof mockWebsites)[0];
  index: number;
}) {
  return (
    <Column
      backgroundColor
      border
      borderRadius="3"
      style={{
        animation: `cardFade 0.4s ease-out ${index * 0.1}s both`,
        overflow: 'hidden',
      }}
    >
      {/* Header with live indicator */}
      <Row
        justifyContent="space-between"
        alignItems="flex-start"
        padding="4"
        paddingBottom="3"
        backgroundColor="2"
      >
        <Row gap="3" alignItems="center">
          <Column
            backgroundColor="primary"
            borderRadius="2"
            padding="2"
            alignItems="center"
            justifyContent="center"
            style={{ width: 36, height: 36 }}
          >
            <Icon color="12">
              <Globe size={18} />
            </Icon>
          </Column>
          <Column gap="0">
            <Text weight="medium" size="2">
              {website.name}
            </Text>
            <Text color="muted" size="1">
              {website.domain}
            </Text>
          </Column>
        </Row>
        <Row
          gap="2"
          alignItems="center"
          backgroundColor="green"
          paddingX="2"
          paddingY="1"
          borderRadius="full"
        >
          <StatusLight variant="active" />
          <Text size="1" color="12" weight="medium">
            {website.activeNow} live
          </Text>
        </Row>
      </Row>

      {/* Quick Stats */}
      <Row padding="3" gap="4" backgroundColor="2" border="bottom">
        <Row gap="2" alignItems="center">
          <Icon size="xs" color="muted">
            <Users size={14} />
          </Icon>
          <Text size="1" color="muted">
            {formatNumber(website.visitors)} visitors
          </Text>
        </Row>
        <Row gap="2" alignItems="center">
          <Icon size="xs" color="muted">
            <Eye size={14} />
          </Icon>
          <Text size="1" color="muted">
            {formatNumber(website.pageviews)} pageviews
          </Text>
        </Row>
      </Row>

      {/* Activity Feed */}
      <Column padding="4" gap="1">
        <Row gap="2" alignItems="center" marginBottom="2">
          <Icon size="xs" color="muted">
            <Activity size={14} />
          </Icon>
          <Text size="1" weight="medium" color="muted">
            Recent Activity
          </Text>
        </Row>
        {website.recentActivity.map((activity, i) => (
          <ActivityItem
            key={i}
            activity={activity}
            index={i}
          />
        ))}
      </Column>

      {/* Footer */}
      <Row
        padding="3"
        justifyContent="space-between"
        alignItems="center"
        border="top"
        backgroundColor="2"
        style={{ cursor: 'pointer' }}
        className="card-footer"
      >
        <Text size="1" weight="medium" color="primary">
          View Details
        </Text>
        <Icon size="sm" color="primary">
          <ChevronRight size={16} />
        </Icon>
      </Row>
    </Column>
  );
}

export default function ActivityFeedWebsitesPage() {
  const [searchValue, setSearchValue] = useState('');

  const filteredWebsites = mockWebsites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalActive = mockWebsites.reduce((sum, site) => sum + site.activeNow, 0);

  return (
    <>
      <style>{`
        @keyframes cardFade {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes activitySlide {
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
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .card-footer:hover {
          background-color: var(--base-color-3);
        }
        .live-badge {
          animation: pulse 2s ease-in-out infinite;
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
          marginBottom="4"
          border="bottom"
          width="100%"
        >
          <Column gap="2">
            <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
            <Row gap="3" alignItems="center">
              <Row
                gap="2"
                alignItems="center"
                className="live-badge"
              >
                <StatusLight variant="active" />
                <Text color="green" weight="medium" size="2">
                  {totalActive} visitors online now
                </Text>
              </Row>
            </Row>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus size={16} />
            </Icon>
            Add Website
          </Button>
        </Row>

        {/* Search */}
        <Row marginBottom="5" gap="3">
          <SearchField
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search websites..."
            style={{ maxWidth: 320 }}
          />
        </Row>

        {/* Live Stats Banner */}
        <Row
          backgroundColor="primary"
          borderRadius="3"
          padding="4"
          marginBottom="5"
          gap="6"
          alignItems="center"
          wrap="wrap"
        >
          <Row gap="3" alignItems="center">
            <Column
              backgroundColor="transparent"
              borderRadius="2"
              padding="2"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <Icon color="12">
                <Activity size={20} />
              </Icon>
            </Column>
            <Column gap="0">
              <Text size="1" color="12" style={{ opacity: 0.8 }}>
                Live Activity
              </Text>
              <Text size="4" weight="bold" color="12">
                Real-time monitoring across all sites
              </Text>
            </Column>
          </Row>
          <Row gap="6" style={{ marginLeft: 'auto' }}>
            <Column gap="0" alignItems="center">
              <Text size="5" weight="bold" color="12">
                {mockWebsites.length}
              </Text>
              <Text size="1" color="12" style={{ opacity: 0.8 }}>
                Active Sites
              </Text>
            </Column>
            <Column gap="0" alignItems="center">
              <Text size="5" weight="bold" color="12">
                {totalActive}
              </Text>
              <Text size="1" color="12" style={{ opacity: 0.8 }}>
                Online Now
              </Text>
            </Column>
            <Column gap="0" alignItems="center">
              <Text size="5" weight="bold" color="12">
                {formatNumber(
                  mockWebsites.reduce((sum, s) => sum + s.pageviews, 0)
                )}
              </Text>
              <Text size="1" color="12" style={{ opacity: 0.8 }}>
                Total Views
              </Text>
            </Column>
          </Row>
        </Row>

        {/* Activity Cards Grid */}
        <Grid
          columns={{ xs: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' }}
          gap="4"
        >
          {filteredWebsites.map((website, index) => (
            <WebsiteActivityCard
              key={website.id}
              website={website}
              index={index}
            />
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
