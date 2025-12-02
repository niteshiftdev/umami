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
  DataTable,
  DataColumn,
  Loading,
} from '@umami/react-zen';
import { Globe, Plus, Clock, TrendingUp, ExternalLink, SquarePen } from 'lucide-react';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { Empty } from '@/components/common/Empty';
import { LinkButton } from '@/components/common/LinkButton';

// Sample data for the prototype
const sampleWebsites = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: '3',
    name: 'E-Commerce Pro',
    domain: 'shop.ecommercepro.net',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
  {
    id: '4',
    name: 'Analytics Hub',
    domain: 'analytics.hubplatform.com',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    id: '5',
    name: 'Marketing Dashboard',
    domain: 'dashboard.marketingsite.co',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
  },
  {
    id: '6',
    name: 'Developer Portal',
    domain: 'developers.codebase.dev',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: '7',
    name: 'Support Center',
    domain: 'support.helpdesk.io',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
  },
  {
    id: '8',
    name: 'Community Forum',
    domain: 'community.devforum.org',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  return `${Math.floor(diffDays / 30)} months ago`;
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  delay?: number;
}) {
  return (
    <Column
      backgroundColor
      border
      borderRadius="3"
      paddingY="5"
      paddingX="5"
      gap="3"
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${delay}ms both`,
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
        {subtext && (
          <Text size="2" color="muted">
            {subtext}
          </Text>
        )}
      </Row>
    </Column>
  );
}

function RecentWebsiteCard({
  website,
  delay = 0,
}: {
  website: (typeof sampleWebsites)[0];
  delay?: number;
}) {
  return (
    <Column
      backgroundColor
      border
      borderRadius="3"
      padding="5"
      gap="4"
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${delay}ms both`,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      className="recent-card"
    >
      <Row alignItems="center" gap="3">
        <Favicon domain={website.domain} />
        <Column gap="1" style={{ flex: 1, minWidth: 0 }}>
          <Text weight="medium" truncate>
            {website.name}
          </Text>
          <Text size="2" color="muted" truncate>
            {website.domain}
          </Text>
        </Column>
      </Row>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center" gap="1">
          <Icon size="xs" color="muted">
            <Clock />
          </Icon>
          <Text size="1" color="muted">
            Added {formatTimeAgo(website.createdAt)}
          </Text>
        </Row>
        <Row gap="1">
          <LinkButton href={`/websites/${website.id}`} variant="quiet" size="sm">
            <Icon size="sm">
              <ExternalLink />
            </Icon>
          </LinkButton>
          <LinkButton href={`/websites/${website.id}/settings`} variant="quiet" size="sm">
            <Icon size="sm">
              <SquarePen />
            </Icon>
          </LinkButton>
        </Row>
      </Row>
    </Column>
  );
}

export default function StatsDashboardPage() {
  const [search, setSearch] = useState('');
  const [isLoading] = useState(false);

  const websites = sampleWebsites;

  const stats = useMemo(() => {
    const total = websites.length;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentCount = websites.filter(w => w.createdAt >= sevenDaysAgo).length;
    const sortedByDate = [...websites].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const mostRecent = sortedByDate[0];

    return {
      total,
      recentCount,
      mostRecent,
      recentlyAdded: sortedByDate.slice(0, 3),
    };
  }, [websites]);

  const filteredWebsites = useMemo(() => {
    if (!search) return websites;
    const lowerSearch = search.toLowerCase();
    return websites.filter(
      w =>
        w.name.toLowerCase().includes(lowerSearch) ||
        w.domain.toLowerCase().includes(lowerSearch),
    );
  }, [websites, search]);

  if (isLoading) {
    return (
      <PageBody>
        <Loading placement="center" />
      </PageBody>
    );
  }

  return (
    <PageBody>
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
        .recent-card:hover {
          box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
          transform: translateY(-2px);
        }
      `}</style>

      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add website</Text>
          </Button>
        </PageHeader>

        {/* Stats Row */}
        <Grid columns={{ xs: '1', sm: '2', lg: '3' }} gap="4">
          <StatCard
            icon={<Globe />}
            label="Total Websites"
            value={stats.total}
            subtext="tracked"
            delay={0}
          />
          <StatCard
            icon={<TrendingUp />}
            label="Added This Week"
            value={stats.recentCount}
            subtext={stats.recentCount === 1 ? 'website' : 'websites'}
            delay={80}
          />
          <StatCard
            icon={<Clock />}
            label="Most Recent"
            value={stats.mostRecent ? formatTimeAgo(stats.mostRecent.createdAt) : '-'}
            subtext={stats.mostRecent?.name}
            delay={160}
          />
        </Grid>

        {/* Recently Added Section */}
        {stats.recentlyAdded.length > 0 && (
          <Column gap="4" style={{ animation: 'fadeSlideIn 0.4s ease-out 200ms both' }}>
            <Row alignItems="center" gap="2">
              <Icon size="sm" color="muted">
                <Clock />
              </Icon>
              <Heading size="2">Recently Added</Heading>
            </Row>
            <Grid columns={{ xs: '1', md: '3' }} gap="4">
              {stats.recentlyAdded.map((website, index) => (
                <RecentWebsiteCard key={website.id} website={website} delay={280 + index * 60} />
              ))}
            </Grid>
          </Column>
        )}

        {/* All Websites Section */}
        <Panel style={{ animation: 'fadeSlideIn 0.4s ease-out 450ms both' }}>
          <Column gap="4">
            <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap="3">
              <Heading size="2">All Websites</Heading>
              <SearchField
                value={search}
                onSearch={setSearch}
                placeholder="Search websites..."
                delay={300}
              />
            </Row>

            {filteredWebsites.length === 0 ? (
              <Empty message={search ? 'No websites match your search' : 'No websites yet'} />
            ) : (
              <DataTable data={filteredWebsites}>
                <DataColumn id="name" label="Name">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Row alignItems="center" gap="3">
                      <Favicon domain={row.domain} />
                      <Link
                        href={`/websites/${row.id}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        <Text weight="medium">{row.name}</Text>
                      </Link>
                    </Row>
                  )}
                </DataColumn>
                <DataColumn id="domain" label="Domain">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Text color="muted">{row.domain}</Text>
                  )}
                </DataColumn>
                <DataColumn id="createdAt" label="Created">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Text color="muted">{formatTimeAgo(row.createdAt)}</Text>
                  )}
                </DataColumn>
                <DataColumn id="actions" label=" " align="end">
                  {(row: (typeof sampleWebsites)[0]) => (
                    <Row gap="1">
                      <LinkButton href={`/websites/${row.id}`} variant="quiet" size="sm">
                        <Icon size="sm">
                          <ExternalLink />
                        </Icon>
                      </LinkButton>
                      <LinkButton href={`/websites/${row.id}/settings`} variant="quiet" size="sm">
                        <Icon size="sm">
                          <SquarePen />
                        </Icon>
                      </LinkButton>
                    </Row>
                  )}
                </DataColumn>
              </DataTable>
            )}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
