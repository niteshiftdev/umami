'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Column, Row, Text, Icon, Button, Heading, Grid } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { Empty } from '@/components/common/Empty';
import { useMessages, useNavigation, useLoginQuery, useUserWebsitesQuery } from '@/components/hooks';
import {
  Globe,
  Clock,
  Share2,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Plus,
  ExternalLink,
} from '@/components/icons';

// Realistic sample data for demonstration
const sampleWebsites = [
  {
    id: 'ws-001',
    name: 'Acme Corporation',
    domain: 'acmecorp.com',
    shareId: 'sh-abc123',
    teamId: null,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-002',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    shareId: null,
    teamId: 'team-001',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-003',
    name: 'E-Commerce Store',
    domain: 'shop.mystore.com',
    shareId: 'sh-def456',
    teamId: 'team-001',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-004',
    name: 'Developer Docs',
    domain: 'docs.devplatform.dev',
    shareId: null,
    teamId: null,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-005',
    name: 'Marketing Landing',
    domain: 'promo.brandsite.co',
    shareId: 'sh-ghi789',
    teamId: 'team-002',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-006',
    name: 'Customer Portal',
    domain: 'portal.saasapp.io',
    shareId: null,
    teamId: null,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-007',
    name: 'Analytics Dashboard',
    domain: 'analytics.internal.net',
    shareId: null,
    teamId: 'team-001',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ws-008',
    name: 'Mobile App Site',
    domain: 'app.mobileproduct.com',
    shareId: 'sh-jkl012',
    teamId: null,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accentColor: string;
  delay: number;
}

function StatCard({ icon, label, value, accentColor, delay }: StatCardProps) {
  return (
    <Column
      gap="3"
      paddingY="5"
      paddingX="5"
      border
      borderRadius="3"
      backgroundColor
      style={{
        animation: `fadeSlideUp 0.5s ease-out ${delay}ms both`,
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <Row alignItems="center" gap="2">
        <Icon size="sm" style={{ color: accentColor }}>
          {icon}
        </Icon>
        <Text size="2" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Text>
      </Row>
      <Text size="8" weight="bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </Text>
    </Column>
  );
}

interface WebsiteRowProps {
  website: (typeof sampleWebsites)[0];
  index: number;
}

function WebsiteRow({ website, index }: WebsiteRowProps) {
  const { renderUrl } = useNavigation();

  const formattedDate = useMemo(() => {
    const date = new Date(website.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [website.createdAt]);

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      paddingY="4"
      paddingX="4"
      gap="4"
      style={{
        animation: `fadeSlideUp 0.4s ease-out ${200 + index * 80}ms both`,
        borderBottom: '1px solid var(--base-color-4)',
        transition: 'background-color 0.15s ease',
      }}
      className="website-row"
    >
      <Row alignItems="center" gap="4" style={{ flex: 1, minWidth: 0 }}>
        <Column
          alignItems="center"
          justifyContent="center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--border-radius-2)',
            backgroundColor: 'var(--base-color-3)',
            flexShrink: 0,
          }}
        >
          <Favicon domain={website.domain} />
        </Column>
        <Column gap="1" style={{ minWidth: 0, flex: 1 }}>
          <Link
            href={renderUrl(`/websites/${website.id}`, false)}
            style={{
              color: 'var(--base-color-12)',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            <Text weight="medium" truncate>
              {website.name}
            </Text>
          </Link>
          <Row alignItems="center" gap="2">
            <Text size="1" color="muted" truncate>
              {website.domain}
            </Text>
            {website.shareId && (
              <Row
                alignItems="center"
                gap="1"
                style={{
                  padding: '1px 6px',
                  borderRadius: 'var(--border-radius-1)',
                  backgroundColor: 'var(--base-color-3)',
                }}
              >
                <Icon size="xs" color="muted">
                  <Share2 />
                </Icon>
                <Text size="1" color="muted">
                  Shared
                </Text>
              </Row>
            )}
          </Row>
        </Column>
      </Row>
      <Row alignItems="center" gap="4">
        <Text size="1" color="muted" style={{ whiteSpace: 'nowrap' }}>
          {formattedDate}
        </Text>
        <LinkButton
          href={renderUrl(`/websites/${website.id}`, false)}
          variant="secondary"
          size="sm"
        >
          <Icon size="sm">
            <BarChart3 />
          </Icon>
          <Text>Analytics</Text>
        </LinkButton>
      </Row>
    </Row>
  );
}

export default function StatsDashboardPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId, renderUrl } = useNavigation();
  const { user } = useLoginQuery();

  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });

  // Use real data if available, otherwise use sample data
  const websites = queryResult?.data?.data?.length > 0 ? queryResult.data.data : sampleWebsites;
  const isLoading = queryResult?.isLoading;
  const error = queryResult?.error;

  // Compute stats
  const stats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const total = websites.length;
    const recentlyAdded = websites.filter(
      (w: any) => new Date(w.createdAt) >= sevenDaysAgo
    ).length;
    const shared = websites.filter((w: any) => w.shareId).length;
    const teamSites = websites.filter((w: any) => w.teamId).length;

    return { total, recentlyAdded, shared, teamSites };
  }, [websites]);

  // Get most recent 6 websites
  const recentWebsites = useMemo(() => {
    return [...websites]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [websites]);

  return (
    <PageBody isLoading={isLoading} error={error}>
      <style>
        {`
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
          .website-row:hover {
            background-color: var(--base-color-2);
          }
          .website-row:last-child {
            border-bottom: none;
          }
        `}
      </style>

      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)}>
          <LinkButton href={renderUrl('/websites/add', false)} variant="primary">
            <Icon>
              <Plus />
            </Icon>
            {formatMessage(labels.addWebsite)}
          </LinkButton>
        </PageHeader>

        {/* Stats Hero Section */}
        <Grid
          columns={{ xs: '2', md: '4' }}
          gap="4"
          style={{
            animation: 'fadeSlideUp 0.5s ease-out both',
          }}
        >
          <StatCard
            icon={<Globe />}
            label="Total Websites"
            value={stats.total}
            accentColor="var(--blue-9)"
            delay={0}
          />
          <StatCard
            icon={<Clock />}
            label="Added This Week"
            value={stats.recentlyAdded}
            accentColor="var(--green-9)"
            delay={60}
          />
          <StatCard
            icon={<Share2 />}
            label="Shared Publicly"
            value={stats.shared}
            accentColor="var(--orange-9)"
            delay={120}
          />
          <StatCard
            icon={<TrendingUp />}
            label="Team Sites"
            value={stats.teamSites}
            accentColor="var(--violet-9)"
            delay={180}
          />
        </Grid>

        {/* Recent Websites Section */}
        <Panel>
          <Row alignItems="center" justifyContent="space-between" marginBottom="2">
            <Heading size="2">Recent Websites</Heading>
            <LinkButton href={renderUrl('/websites', false)} variant="quiet" size="sm">
              <Text size="2">View All</Text>
              <Icon size="sm">
                <ArrowRight />
              </Icon>
            </LinkButton>
          </Row>

          {recentWebsites.length === 0 ? (
            <Empty message="No websites yet. Add your first website to get started." />
          ) : (
            <Column>
              {recentWebsites.map((website: any, index: number) => (
                <WebsiteRow key={website.id} website={website} index={index} />
              ))}
            </Column>
          )}
        </Panel>

        {/* Quick Actions Footer */}
        <Row
          justifyContent="center"
          gap="4"
          paddingY="4"
          style={{
            animation: 'fadeSlideUp 0.5s ease-out 600ms both',
          }}
        >
          <LinkButton href={renderUrl('/websites', false)} variant="secondary">
            <Icon>
              <Globe />
            </Icon>
            Browse All Websites
          </LinkButton>
          <LinkButton href={renderUrl('/settings/websites', false)} variant="quiet">
            <Icon>
              <ExternalLink />
            </Icon>
            Website Settings
          </LinkButton>
        </Row>
      </Column>
    </PageBody>
  );
}
