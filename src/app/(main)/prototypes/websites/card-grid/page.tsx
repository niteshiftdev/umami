'use client';

import { useState, useMemo } from 'react';
import {
  Column,
  Row,
  Heading,
  Text,
  Icon,
  Button,
  SearchField,
  Loading,
} from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { Empty } from '@/components/common/Empty';
import { Plus, Settings, ExternalLink, BarChart3, Globe } from '@/components/icons';

// Realistic sample data for the prototype
const sampleWebsites = [
  {
    id: 'ws-001-acme',
    name: 'Acme Corporation',
    domain: 'acme-corp.com',
    createdAt: '2024-09-15T10:30:00Z',
  },
  {
    id: 'ws-002-bloom',
    name: 'Bloom & Grow',
    domain: 'bloomandgrow.io',
    createdAt: '2024-10-22T14:45:00Z',
  },
  {
    id: 'ws-003-nexus',
    name: 'Nexus Analytics',
    domain: 'nexus-analytics.dev',
    createdAt: '2024-11-03T09:15:00Z',
  },
  {
    id: 'ws-004-craft',
    name: 'CraftBrew Shop',
    domain: 'craftbrewshop.co',
    createdAt: '2024-11-18T16:00:00Z',
  },
  {
    id: 'ws-005-stellar',
    name: 'Stellar Design Studio',
    domain: 'stellar.design',
    createdAt: '2024-11-28T11:20:00Z',
  },
];

interface Website {
  id: string;
  name: string;
  domain?: string;
  createdAt: string;
}

function WebsiteCard({
  website,
  index,
}: {
  website: Website;
  index: number;
}) {
  return (
    <Column
      gap="4"
      padding="5"
      border
      borderRadius="3"
      backgroundColor
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${index * 0.08}s both`,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        cursor: 'pointer',
      }}
      className="website-card"
    >
      {/* Top section with favicon and domain */}
      <Row alignItems="flex-start" justifyContent="space-between" gap="3">
        <Row alignItems="center" gap="3" style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--border-radius-3)',
              backgroundColor: 'var(--base-color-3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {website.domain ? (
              <Favicon
                domain={website.domain}
                style={{ width: 24, height: 24 }}
              />
            ) : (
              <Icon size="lg" color="muted">
                <Globe />
              </Icon>
            )}
          </div>
          <Column gap="1" style={{ minWidth: 0 }}>
            <Heading size="2" style={{ margin: 0 }}>
              {website.name}
            </Heading>
            {website.domain && (
              <Text size="2" color="muted" truncate title={website.domain}>
                {website.domain}
              </Text>
            )}
          </Column>
        </Row>
      </Row>

      {/* Actions row */}
      <Row gap="2" marginTop="2">
        <LinkButton
          href={`/websites/${website.id}`}
          variant="primary"
          size="sm"
          style={{ flex: 1 }}
        >
          <Icon size="sm">
            <BarChart3 />
          </Icon>
          <Text>View Analytics</Text>
        </LinkButton>
        <LinkButton
          href={`/websites/${website.id}/settings`}
          variant="secondary"
          size="sm"
        >
          <Icon size="sm">
            <Settings />
          </Icon>
        </LinkButton>
        {website.domain && (
          <Button
            variant="quiet"
            size="sm"
            onPress={() => window.open(`https://${website.domain}`, '_blank')}
          >
            <Icon size="sm">
              <ExternalLink />
            </Icon>
          </Button>
        )}
      </Row>
    </Column>
  );
}

export default function CardGridPage() {
  const [search, setSearch] = useState('');
  const [isLoading] = useState(false);

  // Filter websites based on search
  const filteredWebsites = useMemo(() => {
    if (!search.trim()) return sampleWebsites;
    const searchLower = search.toLowerCase();
    return sampleWebsites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchLower) ||
        site.domain?.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  if (isLoading) {
    return (
      <PageBody>
        <Loading placement="absolute" />
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

        .website-card:hover {
          box-shadow: var(--box-shadow-3);
          transform: translateY(-2px);
        }

        .website-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: var(--spacing-5);
        }

        @media (min-width: 640px) {
          .website-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .website-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </Button>
        </PageHeader>

        {/* Search bar */}
        <Row alignItems="center" justifyContent="space-between" gap="4">
          <SearchField
            value={search}
            onSearch={handleSearch}
            delay={300}
            placeholder="Search websites..."
            style={{ maxWidth: 320 }}
          />
          <Text color="muted" size="2">
            {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
          </Text>
        </Row>

        {/* Website grid */}
        {filteredWebsites.length === 0 ? (
          <Column
            alignItems="center"
            justifyContent="center"
            padding="10"
            border
            borderRadius="3"
            backgroundColor
            style={{
              animation: 'fadeSlideIn 0.4s ease-out both',
            }}
          >
            <Empty message={search ? 'No websites match your search' : 'No websites found'} />
          </Column>
        ) : (
          <div className="website-grid">
            {filteredWebsites.map((website, index) => (
              <WebsiteCard
                key={website.id}
                website={website}
                index={index}
              />
            ))}
          </div>
        )}
      </Column>
    </PageBody>
  );
}
