'use client';

import { Column, Row, Grid, Text, Heading, Icon, Button } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import {
  Globe,
  TrendingUp,
  Users,
  MousePointerClick,
  Clock,
  ArrowUpRight,
  Settings,
  ExternalLink,
  BarChart3,
  Eye,
  Plus,
} from '@/components/icons';

// Realistic sample website data
const sampleWebsites = [
  {
    id: 'ws-001',
    name: 'TechCrunch Clone',
    domain: 'techcrunch-clone.vercel.app',
    createdAt: '2024-08-15T10:30:00Z',
    stats: {
      pageviews: 45892,
      visitors: 12847,
      bounceRate: 34.2,
      avgDuration: 185,
    },
  },
  {
    id: 'ws-002',
    name: 'Portfolio Site',
    domain: 'sarah-chen.dev',
    createdAt: '2024-09-22T14:15:00Z',
    stats: {
      pageviews: 8234,
      visitors: 3421,
      bounceRate: 42.8,
      avgDuration: 124,
    },
  },
  {
    id: 'ws-003',
    name: 'E-commerce Store',
    domain: 'modern-furniture.shop',
    createdAt: '2024-10-05T09:00:00Z',
    stats: {
      pageviews: 23156,
      visitors: 8932,
      bounceRate: 38.5,
      avgDuration: 267,
    },
  },
  {
    id: 'ws-004',
    name: 'SaaS Landing',
    domain: 'cloudmetrics.io',
    createdAt: '2024-10-18T16:45:00Z',
    stats: {
      pageviews: 15678,
      visitors: 6234,
      bounceRate: 29.1,
      avgDuration: 198,
    },
  },
  {
    id: 'ws-005',
    name: 'Developer Blog',
    domain: 'devnotes.engineering',
    createdAt: '2024-11-02T11:20:00Z',
    stats: {
      pageviews: 5421,
      visitors: 2156,
      bounceRate: 51.3,
      avgDuration: 342,
    },
  },
  {
    id: 'ws-006',
    name: 'Recipe App',
    domain: 'tastybites.recipes',
    createdAt: '2024-11-10T08:30:00Z',
    stats: {
      pageviews: 31245,
      visitors: 11234,
      bounceRate: 35.7,
      avgDuration: 215,
    },
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

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function HeroStatCard({
  icon,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Column
      gap="2"
      padding="4"
      borderRadius="3"
      style={{
        backgroundColor: 'var(--base-color-3)',
        minWidth: 140,
        animation: 'fadeSlideUp 0.5s ease-out backwards',
      }}
    >
      <Row alignItems="center" gap="2">
        <Icon size="sm" color="muted">
          {icon}
        </Icon>
        <Text size="2" color="muted">
          {label}
        </Text>
      </Row>
      <Row alignItems="baseline" gap="2">
        <Text size="6" weight="bold">
          {value}
        </Text>
        {trend && (
          <Text size="1" color="10" style={{ color: 'var(--primary-color)' }}>
            {trend}
          </Text>
        )}
      </Row>
    </Column>
  );
}

function HeroWebsiteCard({ website }: { website: (typeof sampleWebsites)[0] }) {
  return (
    <Column
      gap="5"
      padding="6"
      borderRadius="3"
      style={{
        background: 'linear-gradient(135deg, var(--base-color-2) 0%, var(--base-color-3) 100%)',
        border: '1px solid var(--base-color-5)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      <Row justifyContent="space-between" alignItems="flex-start">
        <Row alignItems="center" gap="4">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 'var(--border-radius-3)',
              backgroundColor: 'var(--base-color-4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Favicon domain={website.domain} style={{ width: 32, height: 32 }} />
          </div>
          <Column gap="1">
            <Row alignItems="center" gap="2">
              <Heading size="4">{website.name}</Heading>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  animation: 'pulse 2s infinite',
                }}
              />
            </Row>
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Globe />
              </Icon>
              <Text color="muted">{website.domain}</Text>
            </Row>
          </Column>
        </Row>
        <Row gap="2">
          <LinkButton href={`/websites/${website.id}`} variant="primary">
            <Icon>
              <BarChart3 />
            </Icon>
            View Dashboard
          </LinkButton>
          <LinkButton href={`/websites/${website.id}/settings`} variant="quiet">
            <Icon>
              <Settings />
            </Icon>
          </LinkButton>
        </Row>
      </Row>

      <Grid columns={{ xs: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="4">
        <HeroStatCard
          icon={<Eye />}
          label="Pageviews"
          value={formatNumber(website.stats.pageviews)}
          trend="+12.5%"
        />
        <HeroStatCard
          icon={<Users />}
          label="Visitors"
          value={formatNumber(website.stats.visitors)}
          trend="+8.3%"
        />
        <HeroStatCard
          icon={<MousePointerClick />}
          label="Bounce Rate"
          value={`${website.stats.bounceRate}%`}
        />
        <HeroStatCard
          icon={<Clock />}
          label="Avg. Duration"
          value={formatDuration(website.stats.avgDuration)}
        />
      </Grid>

      <Row alignItems="center" gap="3" style={{ marginTop: 'var(--spacing-2)' }}>
        <Row alignItems="center" gap="1">
          <Icon size="xs" color="muted">
            <TrendingUp />
          </Icon>
          <Text size="2" color="muted">
            Last 30 days
          </Text>
        </Row>
        <Text size="2" color="muted">
          |
        </Text>
        <Text size="2" color="muted">
          Most recently active
        </Text>
      </Row>
    </Column>
  );
}

function CompactWebsiteRow({
  website,
  index,
}: {
  website: (typeof sampleWebsites)[0];
  index: number;
}) {
  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      padding="4"
      style={{
        borderBottom: '1px solid var(--base-color-4)',
        transition: 'background-color 0.15s ease',
        animation: `fadeSlideUp 0.4s ease-out ${0.1 + index * 0.05}s backwards`,
      }}
      className="compact-row"
    >
      <Row alignItems="center" gap="4" style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--border-radius-2)',
            backgroundColor: 'var(--base-color-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Favicon domain={website.domain} style={{ width: 20, height: 20 }} />
        </div>
        <Column gap="1" style={{ minWidth: 0 }}>
          <Text weight="600" truncate>
            {website.name}
          </Text>
          <Text size="2" color="muted" truncate>
            {website.domain}
          </Text>
        </Column>
      </Row>

      <Row alignItems="center" gap="6" display={{ xs: 'none', md: 'flex' }}>
        <Column alignItems="flex-end" style={{ minWidth: 80 }}>
          <Text size="2" color="muted">
            Pageviews
          </Text>
          <Text weight="600">{formatNumber(website.stats.pageviews)}</Text>
        </Column>
        <Column alignItems="flex-end" style={{ minWidth: 80 }}>
          <Text size="2" color="muted">
            Visitors
          </Text>
          <Text weight="600">{formatNumber(website.stats.visitors)}</Text>
        </Column>
      </Row>

      <Row gap="2" style={{ marginLeft: 'var(--spacing-4)' }}>
        <LinkButton href={`/websites/${website.id}`} variant="quiet" size="sm">
          <Icon size="sm">
            <BarChart3 />
          </Icon>
        </LinkButton>
        <LinkButton
          href={`https://${website.domain}`}
          target="_blank"
          variant="quiet"
          size="sm"
        >
          <Icon size="sm">
            <ExternalLink />
          </Icon>
        </LinkButton>
      </Row>
    </Row>
  );
}

export default function FeaturedHeroPage() {
  const featuredWebsite = sampleWebsites[0];
  const otherWebsites = sampleWebsites.slice(1);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .compact-row:hover {
          background-color: var(--base-color-2);
        }

        .compact-row:last-child {
          border-bottom: none;
        }
      `}</style>
      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader title="Websites" icon={<Globe />}>
            <Button variant="primary">
              <Icon>
                <Plus />
              </Icon>
              Add Website
            </Button>
          </PageHeader>

          <Column gap="5">
            <Column gap="3">
              <Row alignItems="center" gap="2">
                <Icon size="sm" color="muted">
                  <TrendingUp />
                </Icon>
                <Text size="2" weight="600" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Featured Website
                </Text>
              </Row>
              <HeroWebsiteCard website={featuredWebsite} />
            </Column>

            <Column gap="3" style={{ marginTop: 'var(--spacing-4)' }}>
              <Row alignItems="center" justifyContent="space-between">
                <Row alignItems="center" gap="2">
                  <Icon size="sm" color="muted">
                    <Globe />
                  </Icon>
                  <Text size="2" weight="600" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Other Websites
                  </Text>
                  <Text size="2" color="muted">
                    ({otherWebsites.length})
                  </Text>
                </Row>
              </Row>
              <Panel style={{ padding: 0, overflow: 'hidden' }}>
                <Column>
                  {otherWebsites.map((website, index) => (
                    <CompactWebsiteRow key={website.id} website={website} index={index} />
                  ))}
                </Column>
              </Panel>
            </Column>
          </Column>
        </Column>
      </PageBody>
    </>
  );
}
