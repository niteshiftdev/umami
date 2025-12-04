'use client';

import { useMemo, useState } from 'react';
import { Column, Row, Grid, Text, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { MetricCard } from '@/components/metrics/MetricCard';
import { Globe, Clock, Activity, TrendingUp, ExternalLink } from '@/components/icons';

// Sample website data - realistic portfolio of sites
const SAMPLE_WEBSITES = [
  {
    id: 'ws-001',
    name: 'Acme Corporation',
    domain: 'acme.com',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-12-03T14:22:00'),
  },
  {
    id: 'ws-002',
    name: 'TechFlow Blog',
    domain: 'blog.techflow.io',
    createdAt: new Date('2024-06-22'),
    updatedAt: new Date('2024-12-04T09:15:00'),
  },
  {
    id: 'ws-003',
    name: 'GreenLeaf Store',
    domain: 'greenleaf.shop',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-12-02T18:45:00'),
  },
  {
    id: 'ws-004',
    name: 'DevDocs Portal',
    domain: 'docs.devtools.dev',
    createdAt: new Date('2024-08-05'),
    updatedAt: new Date('2024-11-28T11:30:00'),
  },
  {
    id: 'ws-005',
    name: 'Horizon Analytics',
    domain: 'horizon-analytics.com',
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2024-12-01T16:00:00'),
  },
  {
    id: 'ws-006',
    name: 'Creative Studio',
    domain: 'creativestudio.co',
    createdAt: new Date('2024-09-12'),
    updatedAt: new Date('2024-11-15T10:20:00'),
  },
  {
    id: 'ws-007',
    name: 'Fitness Tracker',
    domain: 'app.fittrack.health',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-10-22T08:00:00'),
  },
  {
    id: 'ws-008',
    name: 'Local News Hub',
    domain: 'localnews.city',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-12-04T06:30:00'),
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isWithinDays(date: Date, days: number): boolean {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return diffMs <= days * 24 * 60 * 60 * 1000;
}

export default function StatsOverviewPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = SAMPLE_WEBSITES.length;
    const recentlyUpdated = SAMPLE_WEBSITES.filter(w => isWithinDays(w.updatedAt, 7)).length;
    const activeThisMonth = SAMPLE_WEBSITES.filter(w => isWithinDays(w.updatedAt, 30)).length;
    const newThisQuarter = SAMPLE_WEBSITES.filter(w => isWithinDays(w.createdAt, 90)).length;

    return { total, recentlyUpdated, activeThisMonth, newThisQuarter };
  }, []);

  const sortedWebsites = useMemo(() => {
    return [...SAMPLE_WEBSITES].sort(
      (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
    );
  }, []);

  return (
    <PageBody>
      <Column gap="6" style={{ margin: '8px' }}>
        <PageHeader
          title="Website Portfolio"
          description="Overview of all tracked websites and their activity"
        />

        {/* Stats Overview Section */}
        <Grid
          columns={{ xs: '1fr 1fr', md: 'repeat(4, 1fr)' }}
          gap="4"
          style={{
            animation: 'fadeInUp 0.5s ease-out forwards',
          }}
        >
          <Column
            paddingX="6"
            paddingY="5"
            borderRadius="3"
            backgroundColor
            border
            gap="2"
            style={{
              animationDelay: '0ms',
              animation: 'fadeInUp 0.4s ease-out forwards',
              opacity: 0,
            }}
          >
            <Row alignItems="center" gap="2">
              <Icon size="sm" color="muted">
                <Globe size={16} />
              </Icon>
              <Text size="1" weight="semibold" color="muted">
                Total Websites
              </Text>
            </Row>
            <MetricCard value={stats.total} showLabel={false} valueSize="7" />
          </Column>

          <Column
            paddingX="6"
            paddingY="5"
            borderRadius="3"
            backgroundColor
            border
            gap="2"
            style={{
              animationDelay: '100ms',
              animation: 'fadeInUp 0.4s ease-out forwards',
              animationFillMode: 'both',
              opacity: 0,
            }}
          >
            <Row alignItems="center" gap="2">
              <Icon size="sm" color="muted">
                <Clock size={16} />
              </Icon>
              <Text size="1" weight="semibold" color="muted">
                Updated (7d)
              </Text>
            </Row>
            <MetricCard value={stats.recentlyUpdated} showLabel={false} valueSize="7" />
          </Column>

          <Column
            paddingX="6"
            paddingY="5"
            borderRadius="3"
            backgroundColor
            border
            gap="2"
            style={{
              animationDelay: '200ms',
              animation: 'fadeInUp 0.4s ease-out forwards',
              animationFillMode: 'both',
              opacity: 0,
            }}
          >
            <Row alignItems="center" gap="2">
              <Icon size="sm" color="muted">
                <Activity size={16} />
              </Icon>
              <Text size="1" weight="semibold" color="muted">
                Active (30d)
              </Text>
            </Row>
            <MetricCard value={stats.activeThisMonth} showLabel={false} valueSize="7" />
          </Column>

          <Column
            paddingX="6"
            paddingY="5"
            borderRadius="3"
            backgroundColor
            border
            gap="2"
            style={{
              animationDelay: '300ms',
              animation: 'fadeInUp 0.4s ease-out forwards',
              animationFillMode: 'both',
              opacity: 0,
            }}
          >
            <Row alignItems="center" gap="2">
              <Icon size="sm" color="muted">
                <TrendingUp size={16} />
              </Icon>
              <Text size="1" weight="semibold" color="muted">
                New (90d)
              </Text>
            </Row>
            <MetricCard value={stats.newThisQuarter} showLabel={false} valueSize="7" />
          </Column>
        </Grid>

        {/* Website List Section */}
        <Panel title="All Websites">
          <Column gap="1">
            {sortedWebsites.map((website, index) => {
              const isActive = isWithinDays(website.updatedAt, 7);
              const isHovered = hoveredId === website.id;

              return (
                <Row
                  key={website.id}
                  alignItems="center"
                  justifyContent="space-between"
                  paddingX="4"
                  paddingY="3"
                  borderRadius="2"
                  gap="4"
                  onMouseEnter={() => setHoveredId(website.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    backgroundColor: isHovered ? 'var(--base3)' : 'transparent',
                    animation: 'fadeInUp 0.3s ease-out forwards',
                    animationDelay: `${400 + index * 50}ms`,
                    animationFillMode: 'both',
                    opacity: 0,
                  }}
                >
                  <Row alignItems="center" gap="3" flexGrow={1}>
                    <Favicon domain={website.domain} />
                    <Column gap="1">
                      <Text weight="semibold" size="2">
                        {website.name}
                      </Text>
                      <Text size="1" color="muted">
                        {website.domain}
                      </Text>
                    </Column>
                  </Row>

                  <Row alignItems="center" gap="4">
                    {/* Activity Indicator */}
                    <Row alignItems="center" gap="2">
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: isActive
                            ? 'var(--color-green-9, #30a46c)'
                            : 'var(--base8)',
                          transition: 'background-color 0.2s ease',
                        }}
                      />
                      <Text size="1" color="muted" style={{ minWidth: 60, textAlign: 'right' }}>
                        {formatTimeAgo(website.updatedAt)}
                      </Text>
                    </Row>

                    {/* View Link */}
                    <LinkButton
                      href={`/websites/${website.id}`}
                      variant="quiet"
                      size="sm"
                      style={{
                        opacity: isHovered ? 1 : 0.5,
                        transition: 'opacity 0.15s ease',
                      }}
                    >
                      <Icon size="sm">
                        <ExternalLink size={14} />
                      </Icon>
                      View
                    </LinkButton>
                  </Row>
                </Row>
              );
            })}
          </Column>
        </Panel>

        {/* Activity Legend */}
        <Row alignItems="center" gap="6" paddingX="2">
          <Row alignItems="center" gap="2">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--color-green-9, #30a46c)',
              }}
            />
            <Text size="1" color="muted">
              Active in last 7 days
            </Text>
          </Row>
          <Row alignItems="center" gap="2">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--base8)',
              }}
            />
            <Text size="1" color="muted">
              Inactive
            </Text>
          </Row>
        </Row>
      </Column>

      <style jsx global>{`
        @keyframes fadeInUp {
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
    </PageBody>
  );
}
