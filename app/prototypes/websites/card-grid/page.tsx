'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Grid,
  Text,
  SearchField,
  Icon,
} from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Favicon } from '@/components/common/Favicon';
import { Eye, Users, TrendingUp } from '@/components/icons';

interface WebsiteData {
  id: string;
  name: string;
  domain: string;
  pageviews: number;
  sessions: number;
  bounceRate: number;
}

const sampleWebsites: WebsiteData[] = [
  {
    id: '1',
    name: 'Acme Dashboard',
    domain: 'dashboard.acme.io',
    pageviews: 84523,
    sessions: 12847,
    bounceRate: 32,
  },
  {
    id: '2',
    name: 'TechCrunch Blog',
    domain: 'techcrunch.com',
    pageviews: 156789,
    sessions: 45231,
    bounceRate: 28,
  },
  {
    id: '3',
    name: 'Startup Landing',
    domain: 'launchpad.io',
    pageviews: 23456,
    sessions: 8934,
    bounceRate: 45,
  },
  {
    id: '4',
    name: 'E-Commerce Store',
    domain: 'shopify.com',
    pageviews: 234567,
    sessions: 67890,
    bounceRate: 22,
  },
  {
    id: '5',
    name: 'Developer Docs',
    domain: 'docs.stripe.com',
    pageviews: 98765,
    sessions: 34567,
    bounceRate: 18,
  },
  {
    id: '6',
    name: 'Marketing Site',
    domain: 'hubspot.com',
    pageviews: 67890,
    sessions: 23456,
    bounceRate: 35,
  },
  {
    id: '7',
    name: 'News Portal',
    domain: 'reuters.com',
    pageviews: 189234,
    sessions: 56789,
    bounceRate: 41,
  },
  {
    id: '8',
    name: 'SaaS Platform',
    domain: 'notion.so',
    pageviews: 145678,
    sessions: 43210,
    bounceRate: 25,
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

function WebsiteCard({
  website,
  index,
}: {
  website: WebsiteData;
  index: number;
}) {
  return (
    <Link href="#" style={{ textDecoration: 'none' }}>
      <Column
        gap="4"
        padding="5"
        border
        borderRadius="3"
        backgroundColor
        style={{
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          animation: `fadeSlideIn 0.4s ease ${index * 0.05}s both`,
        }}
        className="website-card"
      >
        <Row alignItems="center" gap="3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--border-radius-2)',
              backgroundColor: 'var(--base-color-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Favicon domain={website.domain} />
          </div>
          <Column gap="1" style={{ minWidth: 0, flex: 1 }}>
            <Text weight="semibold" size="3" truncate>
              {website.name}
            </Text>
            <Text color="muted" size="1" truncate>
              {website.domain}
            </Text>
          </Column>
        </Row>

        <div
          style={{
            height: 1,
            backgroundColor: 'var(--base-color-4)',
            margin: '0 calc(-1 * var(--spacing-5))',
          }}
        />

        <Grid columns="1fr 1fr 1fr" gap="3">
          <Column gap="1">
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Eye size={12} />
              </Icon>
              <Text size="1" color="muted">
                Views
              </Text>
            </Row>
            <Text weight="bold" size="3">
              {formatNumber(website.pageviews)}
            </Text>
          </Column>

          <Column gap="1">
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <Users size={12} />
              </Icon>
              <Text size="1" color="muted">
                Sessions
              </Text>
            </Row>
            <Text weight="bold" size="3">
              {formatNumber(website.sessions)}
            </Text>
          </Column>

          <Column gap="1">
            <Row alignItems="center" gap="1">
              <Icon size="xs" color="muted">
                <TrendingUp size={12} />
              </Icon>
              <Text size="1" color="muted">
                Bounce
              </Text>
            </Row>
            <Text weight="bold" size="3">
              {website.bounceRate}%
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
    if (!search) return sampleWebsites;
    const lowerSearch = search.toLowerCase();
    return sampleWebsites.filter(
      (site) =>
        site.name.toLowerCase().includes(lowerSearch) ||
        site.domain.toLowerCase().includes(lowerSearch)
    );
  }, [search]);

  return (
    <>
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

        .website-card:hover {
          border-color: var(--base-color-8) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
      `}</style>
      <PageBody>
        <Column gap="6">
          <PageHeader title="Websites" description="Monitor your websites at a glance">
            <SearchField
              placeholder="Search websites..."
              value={search}
              onChange={setSearch}
              style={{ width: 280 }}
            />
          </PageHeader>

          {filteredWebsites.length === 0 ? (
            <Column
              alignItems="center"
              justifyContent="center"
              padding="8"
              style={{ minHeight: 200 }}
            >
              <Text color="muted">No websites found matching your search</Text>
            </Column>
          ) : (
            <Grid
              columns={{
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap="5"
            >
              {filteredWebsites.map((website, index) => (
                <WebsiteCard key={website.id} website={website} index={index} />
              ))}
            </Grid>
          )}

          <Row justifyContent="center" padding="4">
            <Text size="1" color="muted">
              Showing {filteredWebsites.length} of {sampleWebsites.length} websites
            </Text>
          </Row>
        </Column>
      </PageBody>
    </>
  );
}
