'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  DataTable,
  DataColumn,
  Icon,
  SearchField,
} from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { LinkButton } from '@/components/common/LinkButton';
import { Favicon } from '@/components/common/Favicon';
import { SquarePen, Users, Eye, Clock, Circle } from '@/components/icons';

interface Website {
  id: string;
  name: string;
  domain: string;
}

interface EnhancedWebsite extends Website {
  visitors: number;
  pageviews: number;
  lastActivityMinutes: number;
  isActive: boolean;
}

// Seeded random number generator based on string
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) / 2147483647;
}

// Generate deterministic stats based on website id
function generateStats(website: Website): EnhancedWebsite {
  const rand1 = seededRandom(website.id + 'visitors');
  const rand2 = seededRandom(website.id + 'pageviews');
  const rand3 = seededRandom(website.id + 'activity');
  const rand4 = seededRandom(website.id + 'status');

  const visitors = Math.floor(500 + rand1 * 74500);
  const pageviews = Math.floor(2000 + rand2 * 298000);
  const lastActivityMinutes = Math.floor(1 + rand3 * 1440); // up to 24 hours
  const isActive = rand4 < 0.8; // 80% active

  return {
    ...website,
    visitors,
    pageviews,
    lastActivityMinutes,
    isActive,
  };
}

// Format numbers with K/M suffix
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 10000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

// Format relative time
function formatRelativeTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

// Sample website data
const sampleWebsites: Website[] = [
  { id: 'ws-001-acme', name: 'Acme Corporation', domain: 'acme.com' },
  { id: 'ws-002-tech', name: 'TechStart Blog', domain: 'blog.techstart.io' },
  { id: 'ws-003-shop', name: 'Urban Threads', domain: 'urbanthreads.co' },
  { id: 'ws-004-saas', name: 'CloudSync Dashboard', domain: 'app.cloudsync.dev' },
  { id: 'ws-005-media', name: 'Pixel Perfect Media', domain: 'pixelperfect.media' },
  { id: 'ws-006-edu', name: 'LearnHub Academy', domain: 'learnhub.academy' },
  { id: 'ws-007-fin', name: 'FinanceTracker Pro', domain: 'financetracker.pro' },
  { id: 'ws-008-health', name: 'WellnessFirst', domain: 'wellnessfirst.health' },
];

export default function WebsitesTableStatsPage() {
  const [search, setSearch] = useState('');

  const enhancedWebsites = useMemo(() => {
    return sampleWebsites.map(generateStats);
  }, []);

  const filteredWebsites = useMemo(() => {
    if (!search) return enhancedWebsites;
    const searchLower = search.toLowerCase();
    return enhancedWebsites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchLower) ||
        site.domain.toLowerCase().includes(searchLower)
    );
  }, [enhancedWebsites, search]);

  // Calculate totals for summary
  const totals = useMemo(() => {
    return enhancedWebsites.reduce(
      (acc, site) => ({
        visitors: acc.visitors + site.visitors,
        pageviews: acc.pageviews + site.pageviews,
        activeSites: acc.activeSites + (site.isActive ? 1 : 0),
      }),
      { visitors: 0, pageviews: 0, activeSites: 0 }
    );
  }, [enhancedWebsites]);

  return (
    <PageBody>
      <Column gap="6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
        <PageHeader title="Websites">
          <LinkButton href="#" variant="primary">
            Add website
          </LinkButton>
        </PageHeader>

        {/* Summary Stats Row */}
        <Row gap="4" wrap="wrap">
          <Panel
            style={{
              flex: '1 1 200px',
              minWidth: 180,
              animation: 'slideUp 0.4s ease-out',
              animationFillMode: 'backwards',
              animationDelay: '0.1s',
            }}
          >
            <Row gap="3" alignItems="center">
              <Icon size="lg" color="muted">
                <Users />
              </Icon>
              <Column gap="1">
                <Text size="sm" color="muted">
                  Total Visitors
                </Text>
                <Text size="xl" weight="semi-bold">
                  {formatNumber(totals.visitors)}
                </Text>
              </Column>
            </Row>
          </Panel>

          <Panel
            style={{
              flex: '1 1 200px',
              minWidth: 180,
              animation: 'slideUp 0.4s ease-out',
              animationFillMode: 'backwards',
              animationDelay: '0.15s',
            }}
          >
            <Row gap="3" alignItems="center">
              <Icon size="lg" color="muted">
                <Eye />
              </Icon>
              <Column gap="1">
                <Text size="sm" color="muted">
                  Total Pageviews
                </Text>
                <Text size="xl" weight="semi-bold">
                  {formatNumber(totals.pageviews)}
                </Text>
              </Column>
            </Row>
          </Panel>

          <Panel
            style={{
              flex: '1 1 200px',
              minWidth: 180,
              animation: 'slideUp 0.4s ease-out',
              animationFillMode: 'backwards',
              animationDelay: '0.2s',
            }}
          >
            <Row gap="3" alignItems="center">
              <Icon size="lg" color="muted">
                <Circle style={{ fill: 'var(--success-color)', color: 'var(--success-color)' }} />
              </Icon>
              <Column gap="1">
                <Text size="sm" color="muted">
                  Active Sites
                </Text>
                <Text size="xl" weight="semi-bold">
                  {totals.activeSites} / {enhancedWebsites.length}
                </Text>
              </Column>
            </Row>
          </Panel>
        </Row>

        {/* Data Table */}
        <Panel
          style={{
            animation: 'slideUp 0.4s ease-out',
            animationFillMode: 'backwards',
            animationDelay: '0.25s',
          }}
        >
          <Column gap="4">
            <Row alignItems="center" justifyContent="space-between">
              <SearchField
                value={search}
                onSearch={setSearch}
                placeholder="Search websites..."
              />
              <Text size="sm" color="muted">
                {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
              </Text>
            </Row>

            <DataTable data={filteredWebsites}>
              <DataColumn id="name" label="Website">
                {(row: EnhancedWebsite) => (
                  <Row gap="3" alignItems="center">
                    <Favicon domain={row.domain} />
                    <Link
                      href={`/websites/${row.id}`}
                      style={{
                        color: 'var(--primary-color)',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                    >
                      {row.name}
                    </Link>
                  </Row>
                )}
              </DataColumn>

              <DataColumn id="domain" label="Domain">
                {(row: EnhancedWebsite) => (
                  <Text color="muted">{row.domain}</Text>
                )}
              </DataColumn>

              <DataColumn id="visitors" label="Visitors" align="end">
                {(row: EnhancedWebsite) => (
                  <Row gap="2" alignItems="center" justifyContent="flex-end">
                    <Icon size="sm" color="muted">
                      <Users size={14} />
                    </Icon>
                    <Text weight="medium">{formatNumber(row.visitors)}</Text>
                  </Row>
                )}
              </DataColumn>

              <DataColumn id="pageviews" label="Pageviews" align="end">
                {(row: EnhancedWebsite) => (
                  <Row gap="2" alignItems="center" justifyContent="flex-end">
                    <Icon size="sm" color="muted">
                      <Eye size={14} />
                    </Icon>
                    <Text weight="medium">{formatNumber(row.pageviews)}</Text>
                  </Row>
                )}
              </DataColumn>

              <DataColumn id="lastActivity" label="Last Activity" align="end">
                {(row: EnhancedWebsite) => (
                  <Row gap="2" alignItems="center" justifyContent="flex-end">
                    <Icon size="sm" color="muted">
                      <Clock size={14} />
                    </Icon>
                    <Text size="sm" color="muted">
                      {formatRelativeTime(row.lastActivityMinutes)}
                    </Text>
                  </Row>
                )}
              </DataColumn>

              <DataColumn id="status" label="Status" align="center">
                {(row: EnhancedWebsite) => (
                  <Row alignItems="center" justifyContent="center" gap="2">
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: row.isActive
                          ? 'var(--success-color)'
                          : 'var(--base-color-6)',
                        boxShadow: row.isActive
                          ? '0 0 6px var(--success-color)'
                          : 'none',
                      }}
                    />
                    <Text size="sm" color={row.isActive ? undefined : 'muted'}>
                      {row.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </Row>
                )}
              </DataColumn>

              <DataColumn id="action" label=" " align="end">
                {(row: EnhancedWebsite) => (
                  <LinkButton
                    href={`/websites/${row.id}/settings`}
                    variant="quiet"
                    size="sm"
                  >
                    <Icon>
                      <SquarePen size={16} />
                    </Icon>
                  </LinkButton>
                )}
              </DataColumn>
            </DataTable>
          </Column>
        </Panel>
      </Column>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
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
