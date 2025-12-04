'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  SearchField,
  Button,
  Icon,
  Text,
  Heading,
  Loading,
} from '@umami/react-zen';
import { Settings, ExternalLink, Globe, BarChart2 } from '@/components/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Favicon } from '@/components/common/Favicon';
import { Empty } from '@/components/common/Empty';

// Sample websites data with realistic details
const sampleWebsites = [
  {
    id: '1',
    name: 'Marketing Site',
    domain: 'marketing.acmecorp.com',
    createdAt: '2024-08-15T10:30:00Z',
    pageviews: 45230,
    visitors: 12840,
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'shop.brandhaus.io',
    createdAt: '2024-06-22T14:15:00Z',
    pageviews: 128450,
    visitors: 34560,
  },
  {
    id: '3',
    name: 'Developer Blog',
    domain: 'blog.devstack.dev',
    createdAt: '2024-09-01T08:00:00Z',
    pageviews: 23100,
    visitors: 8920,
  },
  {
    id: '4',
    name: 'Customer Portal',
    domain: 'portal.servicenow.app',
    createdAt: '2024-03-10T16:45:00Z',
    pageviews: 67890,
    visitors: 15670,
  },
  {
    id: '5',
    name: 'Documentation Hub',
    domain: 'docs.openplatform.io',
    createdAt: '2024-07-05T11:20:00Z',
    pageviews: 89200,
    visitors: 28340,
  },
  {
    id: '6',
    name: 'Landing Pages',
    domain: 'landing.growthlab.co',
    createdAt: '2024-10-12T09:00:00Z',
    pageviews: 15670,
    visitors: 6230,
  },
  {
    id: '7',
    name: 'SaaS Dashboard',
    domain: 'app.cloudmetrics.io',
    createdAt: '2024-04-18T13:30:00Z',
    pageviews: 234500,
    visitors: 45000,
  },
  {
    id: '8',
    name: 'Support Center',
    domain: 'help.techsolutions.com',
    createdAt: '2024-05-25T10:00:00Z',
    pageviews: 56780,
    visitors: 19200,
  },
];

const ITEMS_PER_PAGE = 6;

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

interface WebsiteCardProps {
  website: (typeof sampleWebsites)[0];
  index: number;
}

function WebsiteCard({ website, index }: WebsiteCardProps) {
  return (
    <Column
      border
      borderRadius="3"
      backgroundColor
      padding="5"
      gap="4"
      style={{
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: 'pointer',
        animation: `cardFadeIn 0.4s ease forwards`,
        animationDelay: `${index * 60}ms`,
        opacity: 0,
      }}
      className="website-card"
    >
      {/* Header with favicon and name */}
      <Row alignItems="flex-start" justifyContent="space-between" gap="3">
        <Row alignItems="center" gap="3" style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--border-radius-2)',
              backgroundColor: 'var(--base-color-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Favicon domain={website.domain} />
            {!website.domain && (
              <Icon size="sm" color="muted">
                <Globe />
              </Icon>
            )}
          </div>
          <Column gap="1" style={{ minWidth: 0 }}>
            <Link
              href={`/websites/${website.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <Text weight="600" truncate style={{ display: 'block' }}>
                {website.name}
              </Text>
            </Link>
            <Text size="1" color="muted" truncate style={{ display: 'block' }}>
              {website.domain}
            </Text>
          </Column>
        </Row>
      </Row>

      {/* Stats row */}
      <Row
        gap="4"
        style={{
          padding: 'var(--spacing-3)',
          backgroundColor: 'var(--base-color-2)',
          borderRadius: 'var(--border-radius-2)',
        }}
      >
        <Column gap="1" style={{ flex: 1 }}>
          <Text size="1" color="muted">
            Pageviews
          </Text>
          <Text weight="600" size="3">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>
        <div
          style={{
            width: 1,
            backgroundColor: 'var(--base-color-5)',
          }}
        />
        <Column gap="1" style={{ flex: 1 }}>
          <Text size="1" color="muted">
            Visitors
          </Text>
          <Text weight="600" size="3">
            {formatNumber(website.visitors)}
          </Text>
        </Column>
      </Row>

      {/* Action buttons */}
      <Row gap="2" justifyContent="flex-end">
        <Button variant="quiet" size="sm" asChild>
          <Link href={`/websites/${website.id}`}>
            <Icon size="sm">
              <BarChart2 />
            </Icon>
            <span style={{ marginLeft: 'var(--spacing-1)' }}>Analytics</span>
          </Link>
        </Button>
        <Button variant="quiet" size="sm" asChild>
          <Link href={`/websites/${website.id}/settings`}>
            <Icon size="sm">
              <Settings />
            </Icon>
            <span style={{ marginLeft: 'var(--spacing-1)' }}>Settings</span>
          </Link>
        </Button>
        <Button variant="quiet" size="sm" asChild>
          <a
            href={`https://${website.domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon size="sm">
              <ExternalLink />
            </Icon>
          </a>
        </Button>
      </Row>
    </Column>
  );
}

export default function CardGridPrototypePage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);

  // Filter websites based on search
  const filteredWebsites = useMemo(() => {
    if (!search.trim()) return sampleWebsites;
    const searchLower = search.toLowerCase();
    return sampleWebsites.filter(
      w =>
        w.name.toLowerCase().includes(searchLower) ||
        w.domain.toLowerCase().includes(searchLower),
    );
  }, [search]);

  // Paginate
  const totalPages = Math.ceil(filteredWebsites.length / ITEMS_PER_PAGE);
  const paginatedWebsites = filteredWebsites.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

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
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: var(--spacing-4);
        }

        @media (min-width: 640px) {
          .card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .card-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .page-button {
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--base-color-5);
          border-radius: var(--border-radius-2);
          background: var(--base-color-1);
          cursor: pointer;
          transition: all 0.15s ease;
          font-size: var(--font-size-2);
          color: var(--base-color-11);
        }

        .page-button:hover:not(:disabled) {
          background: var(--base-color-3);
          border-color: var(--base-color-6);
        }

        .page-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-button.active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }
      `}</style>

      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader title="Websites">
            <Button variant="primary">Add website</Button>
          </PageHeader>

          <Column
            paddingY="6"
            paddingX={{ xs: '3', md: '6' }}
            border
            borderRadius="3"
            backgroundColor
            gap="5"
          >
            {/* Search bar */}
            <Row alignItems="center" justifyContent="space-between" gap="4">
              <SearchField
                value={search}
                onSearch={handleSearch}
                delay={300}
                placeholder="Search websites..."
                style={{ maxWidth: 320 }}
              />
              <Text size="2" color="muted">
                {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
              </Text>
            </Row>

            {/* Loading state */}
            {isLoading && <Loading placement="center" />}

            {/* Empty state */}
            {!isLoading && filteredWebsites.length === 0 && (
              <Empty message={search ? 'No websites match your search' : 'No websites found'} />
            )}

            {/* Cards grid */}
            {!isLoading && paginatedWebsites.length > 0 && (
              <div className="card-grid">
                {paginatedWebsites.map((website, index) => (
                  <WebsiteCard key={website.id} website={website} index={index} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Row justifyContent="center" alignItems="center" gap="2" marginTop="4">
                <button
                  className="page-button"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className={`page-button ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="page-button"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </Row>
            )}
          </Column>
        </Column>
      </PageBody>
    </>
  );
}
