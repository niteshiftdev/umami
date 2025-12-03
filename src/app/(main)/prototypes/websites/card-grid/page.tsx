'use client';
import { useState, useMemo } from 'react';
import { Column, Row, Grid, Button, Icon, Text, Heading, SearchField } from '@umami/react-zen';
import { Eye, SquarePen, Globe, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Sample data - realistic websites for demonstration
const SAMPLE_WEBSITES = [
  {
    id: 'ws-001',
    name: 'Marketing Site',
    domain: 'marketing.acmecorp.com',
    createdAt: '2024-08-15T10:30:00Z',
    visitors: 12847,
    pageviews: 45231,
  },
  {
    id: 'ws-002',
    name: 'Developer Portal',
    domain: 'developers.acmecorp.com',
    createdAt: '2024-06-22T14:15:00Z',
    visitors: 8432,
    pageviews: 28901,
  },
  {
    id: 'ws-003',
    name: 'E-commerce Store',
    domain: 'shop.acmecorp.com',
    createdAt: '2024-09-01T09:00:00Z',
    visitors: 34521,
    pageviews: 156789,
  },
  {
    id: 'ws-004',
    name: 'Company Blog',
    domain: 'blog.acmecorp.com',
    createdAt: '2024-05-10T16:45:00Z',
    visitors: 6721,
    pageviews: 19456,
  },
  {
    id: 'ws-005',
    name: 'Support Center',
    domain: 'support.acmecorp.com',
    createdAt: '2024-07-08T11:20:00Z',
    visitors: 4523,
    pageviews: 12890,
  },
  {
    id: 'ws-006',
    name: 'Landing Pages',
    domain: 'go.acmecorp.com',
    createdAt: '2024-10-05T08:30:00Z',
    visitors: 21098,
    pageviews: 67432,
  },
  {
    id: 'ws-007',
    name: 'Partner Portal',
    domain: 'partners.acmecorp.com',
    createdAt: '2024-04-18T13:00:00Z',
    visitors: 2341,
    pageviews: 8765,
  },
  {
    id: 'ws-008',
    name: 'Product Documentation',
    domain: 'docs.acmecorp.com',
    createdAt: '2024-03-25T10:00:00Z',
    visitors: 15678,
    pageviews: 89234,
  },
];

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  visitors: number;
  pageviews: number;
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

function WebsiteCard({ website, index }: { website: Website; index: number }) {
  const faviconUrl = `https://icons.duckduckgo.com/ip3/${website.domain}.ico`;

  return (
    <Column
      style={{
        backgroundColor: 'var(--base-color-3)',
        borderRadius: 'var(--border-radius-3)',
        border: '1px solid var(--base-color-5)',
        padding: 'var(--spacing-5)',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        animation: `cardFadeIn 0.4s ease-out ${index * 0.05}s both`,
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'translateY(-4px)';
        target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        target.style.borderColor = 'var(--primary-color)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'translateY(0)';
        target.style.boxShadow = 'none';
        target.style.borderColor = 'var(--base-color-5)';
      }}
      gap="4"
    >
      {/* Header with favicon and domain */}
      <Row alignItems="flex-start" justifyContent="space-between">
        <Row alignItems="center" gap="3">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--border-radius-2)',
              backgroundColor: 'var(--base-color-1)',
              border: '1px solid var(--base-color-5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={faviconUrl}
              alt=""
              width={28}
              height={28}
              style={{ borderRadius: 'var(--border-radius-1)' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.removeAttribute('style');
              }}
            />
            <Icon size="md" style={{ display: 'none', color: 'var(--base-color-8)' }}>
              <Globe />
            </Icon>
          </div>
          <Column gap="1">
            <Heading size="2" style={{ lineHeight: 1.2 }}>
              {website.name}
            </Heading>
            <Row alignItems="center" gap="1">
              <Text size="2" color="muted" style={{ wordBreak: 'break-all' }}>
                {website.domain}
              </Text>
              <a
                href={`https://${website.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--base-color-8)', display: 'flex' }}
              >
                <ExternalLink size={12} />
              </a>
            </Row>
          </Column>
        </Row>
      </Row>

      {/* Stats row */}
      <Row
        gap="4"
        style={{
          borderTop: '1px solid var(--base-color-5)',
          paddingTop: 'var(--spacing-4)',
          marginTop: 'var(--spacing-1)',
        }}
      >
        <Column gap="1">
          <Text size="1" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Visitors
          </Text>
          <Text size="3" weight="bold" style={{ color: 'var(--primary-color)' }}>
            {formatNumber(website.visitors)}
          </Text>
        </Column>
        <Column gap="1">
          <Text size="1" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Pageviews
          </Text>
          <Text size="3" weight="bold">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>
      </Row>

      {/* Action buttons */}
      <Row gap="2" style={{ marginTop: 'auto' }}>
        <Link href={`/websites/${website.id}`} style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
          <Button variant="primary" style={{ width: '100%' }}>
            <Icon>
              <Eye />
            </Icon>
            <span>View</span>
          </Button>
        </Link>
        <Link href={`/websites/${website.id}/settings`} onClick={(e) => e.stopPropagation()}>
          <Button variant="quiet">
            <Icon>
              <SquarePen />
            </Icon>
          </Button>
        </Link>
      </Row>
    </Column>
  );
}

function EmptyState() {
  return (
    <Column
      alignItems="center"
      justifyContent="center"
      gap="4"
      style={{
        padding: 'var(--spacing-10)',
        backgroundColor: 'var(--base-color-2)',
        borderRadius: 'var(--border-radius-3)',
        border: '2px dashed var(--base-color-5)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 'var(--border-radius-full)',
          backgroundColor: 'var(--base-color-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size="xl" style={{ color: 'var(--base-color-8)' }}>
          <Globe />
        </Icon>
      </div>
      <Column alignItems="center" gap="2">
        <Text size="4" weight="bold">
          No websites yet
        </Text>
        <Text color="muted" style={{ textAlign: 'center' }}>
          Add your first website to start tracking analytics
        </Text>
      </Column>
      <Button variant="primary">
        <Icon>
          <Plus />
        </Icon>
        <span>Add Website</span>
      </Button>
    </Column>
  );
}

export default function WebsitesCardGridPage() {
  const [search, setSearch] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!search.trim()) return SAMPLE_WEBSITES;
    const query = search.toLowerCase();
    return SAMPLE_WEBSITES.filter(
      (site) =>
        site.name.toLowerCase().includes(query) || site.domain.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <>
      <style>{`
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes headerFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <Column
        width="100%"
        paddingBottom="6"
        maxWidth="1320px"
        paddingX={{ xs: '3', md: '6' }}
        style={{ margin: '0 auto' }}
      >
        <Column gap="6" style={{ padding: 'var(--spacing-2)' }}>
          {/* Page Header */}
          <Row
            justifyContent="space-between"
            alignItems="center"
            paddingY="6"
            marginBottom="6"
            style={{
              borderBottom: '1px solid var(--base-color-5)',
              animation: 'headerFadeIn 0.3s ease-out',
            }}
            width="100%"
          >
            <Column gap="2">
              <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
              <Text color="muted">
                {filteredWebsites.length} {filteredWebsites.length === 1 ? 'website' : 'websites'}
              </Text>
            </Column>
            <Row gap="3">
              <Button variant="primary">
                <Icon>
                  <Plus />
                </Icon>
                <span>Add Website</span>
              </Button>
            </Row>
          </Row>

          {/* Search and filters */}
          <Row
            alignItems="center"
            justifyContent="space-between"
            gap="4"
            style={{ animation: 'headerFadeIn 0.3s ease-out 0.1s both' }}
          >
            <SearchField
              value={search}
              onSearch={setSearch}
              delay={300}
              placeholder="Search websites..."
              style={{ maxWidth: 320 }}
            />
            <Text size="2" color="muted">
              Showing {filteredWebsites.length} of {SAMPLE_WEBSITES.length}
            </Text>
          </Row>

          {/* Card Grid */}
          {filteredWebsites.length > 0 ? (
            <Grid
              columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
              gap="4"
            >
              {filteredWebsites.map((website, index) => (
                <WebsiteCard key={website.id} website={website} index={index} />
              ))}
            </Grid>
          ) : (
            <EmptyState />
          )}
        </Column>
      </Column>
    </>
  );
}
