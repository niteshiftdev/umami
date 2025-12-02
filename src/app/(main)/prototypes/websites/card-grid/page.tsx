'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Column, Row, Grid, Text, Heading, SearchField, Icon, Button, Loading } from '@umami/react-zen';
import { SquarePen, Globe } from '@/components/icons';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Favicon } from '@/components/common/Favicon';
import { Empty } from '@/components/common/Empty';

// Realistic sample website data
const sampleWebsites = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Acme Corporation', domain: 'acme.com' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'TechFlow Blog', domain: 'blog.techflow.io' },
  { id: 'c3d4e5f6-a7b8-9012-cdef-123456789012', name: 'Stellar Analytics', domain: 'stellar-analytics.co' },
  { id: 'd4e5f6a7-b8c9-0123-def0-234567890123', name: 'CloudNine SaaS', domain: 'app.cloudnine.dev' },
  { id: 'e5f6a7b8-c9d0-1234-ef01-345678901234', name: 'Urban Market', domain: 'urbanmarket.store' },
  { id: 'f6a7b8c9-d0e1-2345-f012-456789012345', name: 'HealthPulse', domain: 'healthpulse.health' },
  { id: 'a7b8c9d0-e1f2-3456-0123-567890123456', name: 'Mindful Academy', domain: 'learn.mindfulacademy.org' },
  { id: 'b8c9d0e1-f2a3-4567-1234-678901234567', name: 'Portfolio Pro', domain: 'portfoliopro.design' },
];

interface Website {
  id: string;
  name: string;
  domain: string;
}

function WebsiteCard({ website, index }: { website: Website; index: number }) {
  return (
    <Link
      href={`/websites/${website.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        animation: `cardFadeIn 0.4s ease-out ${index * 0.05}s both`,
      }}
    >
      <Column
        padding="5"
        border
        borderRadius="3"
        backgroundColor
        gap="3"
        position="relative"
        style={{
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          cursor: 'pointer',
        }}
        className="website-card"
      >
        <Row alignItems="flex-start" justifyContent="space-between" gap="3">
          <Row alignItems="center" gap="3" style={{ minWidth: 0, flex: 1 }}>
            <Column
              alignItems="center"
              justifyContent="center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--border-radius-3)',
                backgroundColor: 'var(--base-color-3)',
                flexShrink: 0,
              }}
            >
              <Favicon domain={website.domain} style={{ width: 24, height: 24 }} />
            </Column>
            <Column gap="1" style={{ minWidth: 0 }}>
              <Heading size="2" style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {website.name}
              </Heading>
              <Row alignItems="center" gap="1">
                <Icon size="xs" color="muted">
                  <Globe />
                </Icon>
                <Text color="muted" size="2" truncate title={website.domain}>
                  {website.domain}
                </Text>
              </Row>
            </Column>
          </Row>
          <Button
            variant="quiet"
            size="sm"
            onPress={(e) => {
              e.stopPropagation();
            }}
            asChild
          >
            <Link
              href={`/websites/${website.id}/settings`}
              onClick={(e) => e.stopPropagation()}
              style={{ flexShrink: 0 }}
            >
              <Icon color="muted">
                <SquarePen />
              </Icon>
            </Link>
          </Button>
        </Row>
      </Column>
    </Link>
  );
}

export default function CardGridWebsitesPage() {
  const [search, setSearch] = useState('');
  const [isLoading] = useState(false);

  const filteredWebsites = useMemo(() => {
    if (!search.trim()) return sampleWebsites;
    const query = search.toLowerCase();
    return sampleWebsites.filter(
      (website) =>
        website.name.toLowerCase().includes(query) ||
        website.domain.toLowerCase().includes(query)
    );
  }, [search]);

  if (isLoading) {
    return <Loading placement="absolute" />;
  }

  return (
    <PageBody>
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
        .website-card:active {
          transform: translateY(0);
        }
      `}</style>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" />
        <Column gap="5">
          <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap="3">
            <SearchField
              value={search}
              onSearch={setSearch}
              delay={300}
              placeholder="Search websites..."
              style={{ maxWidth: 320 }}
            />
            <Text color="muted" size="2">
              {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
            </Text>
          </Row>
          {filteredWebsites.length === 0 ? (
            <Column padding="6" alignItems="center" justifyContent="center" minHeight="200px">
              <Empty message={search ? 'No websites match your search' : 'No websites found'} />
            </Column>
          ) : (
            <Grid
              columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
              gap="4"
            >
              {filteredWebsites.map((website, index) => (
                <WebsiteCard key={website.id} website={website} index={index} />
              ))}
            </Grid>
          )}
        </Column>
      </Column>
    </PageBody>
  );
}
