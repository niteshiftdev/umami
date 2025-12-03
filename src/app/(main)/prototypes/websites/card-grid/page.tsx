'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Grid,
  Row,
  Text,
  SearchField,
  Icon,
} from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Favicon } from '@/components/common/Favicon';
import { Empty } from '@/components/common/Empty';
import { Globe, Users, Eye, Clock, ExternalLink, Activity } from '@/components/icons';

// Sample website data with realistic domains and names
const SAMPLE_WEBSITES = [
  { id: 'w1', name: 'Acme Corporation', domain: 'acme.com' },
  { id: 'w2', name: 'TechStart Blog', domain: 'techstart.io' },
  { id: 'w3', name: 'Green Market', domain: 'greenmarket.co' },
  { id: 'w4', name: 'CloudSync Dashboard', domain: 'app.cloudsync.dev' },
  { id: 'w5', name: 'Mountain Gear Shop', domain: 'mountaingear.shop' },
  { id: 'w6', name: 'Design Studio Pro', domain: 'designstudio.pro' },
  { id: 'w7', name: 'FinTrack Analytics', domain: 'fintrack.finance' },
  { id: 'w8', name: 'Local Bites', domain: 'localbites.restaurant' },
];

// Generate consistent pseudo-random stats based on website id
function generateStats(websiteId: string) {
  const hash = websiteId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = hash % 100;

  const visitors = 1000 + Math.floor((seed * 490) + (hash * 17) % 49000);
  const pageviews = visitors * (2 + (seed % 5));
  const bounceRate = 25 + (seed % 45);
  const avgDuration = 45 + (seed * 3) % 300;

  return {
    visitors,
    pageviews,
    bounceRate,
    avgDuration,
  };
}

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
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface WebsiteCardProps {
  website: {
    id: string;
    name: string;
    domain: string;
  };
  stats: {
    visitors: number;
    pageviews: number;
    bounceRate: number;
    avgDuration: number;
  };
  index: number;
}

function WebsiteCard({ website, stats, index }: WebsiteCardProps) {
  return (
    <Link href={`/websites/${website.id}`} style={{ textDecoration: 'none' }}>
      <Column
        backgroundColor
        border
        borderRadius="3"
        padding="5"
        gap="4"
        style={{
          cursor: 'pointer',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          animation: `cardFadeIn 0.4s ease-out ${index * 0.05}s both`,
        }}
        className="website-card"
      >
        {/* Header with favicon and name */}
        <Row alignItems="center" gap="3" justifyContent="space-between">
          <Row alignItems="center" gap="3" style={{ minWidth: 0, flex: 1 }}>
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
              <Favicon domain={website.domain} style={{ width: 20, height: 20 }} />
            </Column>
            <Column gap="1" style={{ minWidth: 0 }}>
              <Text weight="semibold" size="3" truncate>
                {website.name}
              </Text>
              <Text color="muted" size="1" truncate>
                {website.domain}
              </Text>
            </Column>
          </Row>
          <Icon size="sm" color="muted">
            <ExternalLink />
          </Icon>
        </Row>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: 'var(--border-color)',
            margin: '0 -4px',
          }}
        />

        {/* Stats grid */}
        <Grid columns="1fr 1fr" gap="4">
          <Column gap="1">
            <Row alignItems="center" gap="2">
              <Icon size="xs" color="muted">
                <Users />
              </Icon>
              <Text size="1" color="muted">
                Visitors
              </Text>
            </Row>
            <Text size="4" weight="bold">
              {formatNumber(stats.visitors)}
            </Text>
          </Column>

          <Column gap="1">
            <Row alignItems="center" gap="2">
              <Icon size="xs" color="muted">
                <Eye />
              </Icon>
              <Text size="1" color="muted">
                Pageviews
              </Text>
            </Row>
            <Text size="4" weight="bold">
              {formatNumber(stats.pageviews)}
            </Text>
          </Column>

          <Column gap="1">
            <Row alignItems="center" gap="2">
              <Icon size="xs" color="muted">
                <Activity />
              </Icon>
              <Text size="1" color="muted">
                Bounce Rate
              </Text>
            </Row>
            <Text size="4" weight="bold">
              {stats.bounceRate}%
            </Text>
          </Column>

          <Column gap="1">
            <Row alignItems="center" gap="2">
              <Icon size="xs" color="muted">
                <Clock />
              </Icon>
              <Text size="1" color="muted">
                Avg. Duration
              </Text>
            </Row>
            <Text size="4" weight="bold">
              {formatDuration(stats.avgDuration)}
            </Text>
          </Column>
        </Grid>
      </Column>
    </Link>
  );
}

export default function CardGridWebsitesPage() {
  const [search, setSearch] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!search) return SAMPLE_WEBSITES;
    const lowerSearch = search.toLowerCase();
    return SAMPLE_WEBSITES.filter(
      (w) =>
        w.name.toLowerCase().includes(lowerSearch) ||
        w.domain.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  const websitesWithStats = useMemo(() => {
    return filteredWebsites.map((website) => ({
      ...website,
      stats: generateStats(website.id),
    }));
  }, [filteredWebsites]);

  return (
    <>
      <style>{`
        @keyframes cardFadeIn {
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
          box-shadow: var(--box-shadow-3);
          transform: translateY(-2px);
        }
      `}</style>

      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader
            title="Websites"
            icon={<Globe />}
            description="Monitor and analyze traffic across all your websites"
          />

          <Column gap="5">
            {/* Search and controls */}
            <Row alignItems="center" justifyContent="space-between" gap="4" wrap="wrap">
              <SearchField
                value={search}
                onSearch={setSearch}
                placeholder="Search websites..."
                delay={300}
              />
              <Text color="muted" size="2">
                {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
              </Text>
            </Row>

            {/* Website cards grid */}
            {websitesWithStats.length > 0 ? (
              <Grid
                columns={{ xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }}
                gap="5"
              >
                {websitesWithStats.map((website, index) => (
                  <WebsiteCard
                    key={website.id}
                    website={website}
                    stats={website.stats}
                    index={index}
                  />
                ))}
              </Grid>
            ) : (
              <Column
                backgroundColor
                border
                borderRadius="3"
                padding="8"
                alignItems="center"
                justifyContent="center"
                minHeight="300px"
              >
                <Empty message={search ? 'No websites match your search' : undefined} />
              </Column>
            )}
          </Column>
        </Column>
      </PageBody>
    </>
  );
}
