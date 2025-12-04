'use client';
import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Column, Row, SearchField, Text, Heading, Grid } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Favicon } from '@/components/common/Favicon';
import { Pager } from '@/components/common/Pager';
import { Empty } from '@/components/common/Empty';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useMessages } from '@/components/hooks';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

// Realistic sample websites for prototype display
const sampleWebsites: Website[] = [
  {
    id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    name: 'Acme Corporation',
    domain: 'acme.com',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2b3c4d5e-6f78-90ab-cdef-123456789012',
    name: 'TechFlow Platform',
    domain: 'techflow.io',
    createdAt: '2024-02-20T14:45:00Z',
  },
  {
    id: '3c4d5e6f-7890-abcd-ef12-345678901234',
    name: 'GreenLeaf Organics',
    domain: 'greenleaf-organics.com',
    createdAt: '2024-03-10T09:15:00Z',
  },
  {
    id: '4d5e6f78-90ab-cdef-1234-567890123456',
    name: 'CloudSync Solutions',
    domain: 'cloudsync.dev',
    createdAt: '2024-04-05T16:20:00Z',
  },
  {
    id: '5e6f7890-abcd-ef12-3456-789012345678',
    name: 'Urban Eats Delivery',
    domain: 'urbaneats.co',
    createdAt: '2024-04-22T11:00:00Z',
  },
  {
    id: '6f789012-cdef-1234-5678-901234567890',
    name: 'Fitness Pro App',
    domain: 'fitnesspro.app',
    createdAt: '2024-05-08T08:30:00Z',
  },
  {
    id: '78901234-ef12-3456-7890-123456789abc',
    name: 'Nordic Design Studio',
    domain: 'nordicdesign.studio',
    createdAt: '2024-05-25T13:45:00Z',
  },
  {
    id: '89012345-1234-5678-90ab-cdef12345678',
    name: 'Quantum Analytics',
    domain: 'quantum-analytics.io',
    createdAt: '2024-06-12T15:10:00Z',
  },
  {
    id: '90123456-3456-7890-abcd-ef1234567890',
    name: 'Artisan Coffee Co',
    domain: 'artisancoffee.shop',
    createdAt: '2024-07-01T07:00:00Z',
  },
  {
    id: 'a1234567-5678-90ab-cdef-123456789012',
    name: 'EduPath Learning',
    domain: 'edupath.edu',
    createdAt: '2024-07-18T12:30:00Z',
  },
];

const PAGE_SIZE = 8;
const SEARCH_DELAY = 400;

function WebsiteCard({ website, index }: { website: Website; index: number }) {
  return (
    <Link
      href={`/websites/${website.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both`,
      }}
    >
      <Column
        padding="5"
        backgroundColor
        border
        borderRadius="3"
        gap="4"
        style={{
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          minHeight: '140px',
        }}
        className="website-card"
      >
        <Row alignItems="center" gap="3">
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--border-radius-2)',
              backgroundColor: 'var(--base-color-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Favicon domain={website.domain} style={{ width: 24, height: 24 }} />
          </div>
          <Column gap="1" style={{ overflow: 'hidden', flex: 1 }}>
            <Text
              weight="bold"
              style={{
                fontSize: '1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {website.name}
            </Text>
            <Text
              color="muted"
              size="sm"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {website.domain}
            </Text>
          </Column>
        </Row>
        <Row alignItems="center" justifyContent="space-between" marginTop="auto">
          <Text color="muted" size="xs">
            Added {new Date(website.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-color)',
              opacity: 0.7,
            }}
          />
        </Row>
      </Column>
    </Link>
  );
}

export default function CardGridPage() {
  const { formatMessage, labels } = useMessages();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  // Filter websites based on search
  const filteredWebsites = useMemo(() => {
    if (!search) return sampleWebsites;
    const searchLower = search.toLowerCase();
    return sampleWebsites.filter(
      (website) =>
        website.name.toLowerCase().includes(searchLower) ||
        website.domain.toLowerCase().includes(searchLower)
    );
  }, [search]);

  // Paginate
  const paginatedWebsites = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredWebsites.slice(start, start + PAGE_SIZE);
  }, [filteredWebsites, page]);

  const totalCount = filteredWebsites.length;
  const showPager = totalCount > PAGE_SIZE;

  return (
    <>
      <style jsx global>{`
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
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .website-card:active {
          transform: translateY(0);
        }
      `}</style>
      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader title={formatMessage(labels.websites)} />
          <Column gap="5">
            <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap="3">
              <SearchField
                value={search}
                onSearch={handleSearch}
                delay={SEARCH_DELAY}
                placeholder={formatMessage(labels.search)}
              />
              <Text color="muted" size="sm">
                {totalCount} {totalCount === 1 ? 'website' : 'websites'}
              </Text>
            </Row>

            {paginatedWebsites.length === 0 ? (
              <Empty message="No websites found" />
            ) : (
              <Grid
                columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
                gap="4"
              >
                {paginatedWebsites.map((website, index) => (
                  <WebsiteCard key={website.id} website={website} index={index} />
                ))}
              </Grid>
            )}

            {showPager && (
              <Row marginTop="4">
                <Pager
                  page={page}
                  pageSize={PAGE_SIZE}
                  count={totalCount}
                  onPageChange={handlePageChange}
                />
              </Row>
            )}
          </Column>
        </Column>
      </PageBody>
    </>
  );
}
