'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Column, Row, Text, Icon, SearchField, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Favicon } from '@/components/common/Favicon';
import { Eye, Settings, ExternalLink } from '@/components/icons';

interface Website {
  id: string;
  name: string;
  domain: string;
}

const sampleWebsites: Website[] = [
  { id: '1', name: 'Acme Corporation', domain: 'acme.com' },
  { id: '2', name: 'TechStartup Blog', domain: 'blog.techstartup.io' },
  { id: '3', name: 'E-commerce Store', domain: 'shop.example.com' },
  { id: '4', name: 'Marketing Landing', domain: 'marketing.company.co' },
  { id: '5', name: 'Developer Portal', domain: 'developers.api.io' },
  { id: '6', name: 'Support Center', domain: 'help.service.com' },
  { id: '7', name: 'Product Documentation', domain: 'docs.product.dev' },
  { id: '8', name: 'Customer Dashboard', domain: 'app.saasplatform.com' },
  { id: '9', name: 'Analytics Demo', domain: 'demo.analytics.io' },
  { id: '10', name: 'News Portal', domain: 'news.media.net' },
  { id: '11', name: 'Community Forum', domain: 'forum.community.org' },
  { id: '12', name: 'Learning Platform', domain: 'learn.education.co' },
  { id: '13', name: 'Event Ticketing', domain: 'tickets.events.com' },
  { id: '14', name: 'Restaurant Booking', domain: 'book.dineout.app' },
  { id: '15', name: 'Travel Agency', domain: 'travel.vacation.com' },
  { id: '16', name: 'Real Estate Listings', domain: 'homes.property.io' },
  { id: '17', name: 'Fitness Tracker', domain: 'app.fitjourney.com' },
  { id: '18', name: 'Recipe Collection', domain: 'recipes.cookbook.net' },
  { id: '19', name: 'Photography Portfolio', domain: 'photos.creative.studio' },
  { id: '20', name: 'Music Streaming', domain: 'play.musicapp.fm' },
];

function CompactWebsiteRow({ website }: { website: Website }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Row
      alignItems="center"
      gap="3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '8px 12px',
        backgroundColor: isHovered ? 'var(--highlight-color)' : 'transparent',
        borderBottom: '1px solid var(--border-color)',
        transition: 'background-color 0.15s ease',
        cursor: 'pointer',
        minHeight: '36px',
      }}
    >
      <Favicon domain={website.domain} />

      <Link
        href={`/websites/${website.id}`}
        style={{
          textDecoration: 'none',
          fontWeight: 'var(--font-weight-medium)',
          fontSize: 'var(--font-size-3)',
          color: 'var(--font-color)',
          whiteSpace: 'nowrap',
        }}
      >
        {website.name}
      </Link>

      <Text
        color="muted"
        size="2"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {website.domain}
      </Text>

      <Row
        alignItems="center"
        gap="1"
        style={{
          marginLeft: 'auto',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <Link href={`/websites/${website.id}`}>
          <Button variant="quiet" size="sm">
            <Icon size="sm">
              <Eye />
            </Icon>
          </Button>
        </Link>
        <Link href={`/websites/${website.id}/settings`}>
          <Button variant="quiet" size="sm">
            <Icon size="sm">
              <Settings />
            </Icon>
          </Button>
        </Link>
        <a
          href={`https://${website.domain}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="quiet" size="sm">
            <Icon size="sm">
              <ExternalLink />
            </Icon>
          </Button>
        </a>
      </Row>
    </Row>
  );
}

export default function CompactListPage() {
  const [search, setSearch] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!search) return sampleWebsites;
    const query = search.toLowerCase();
    return sampleWebsites.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.domain.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <PageBody>
      <Column gap="4" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">Add website</Button>
        </PageHeader>

        <Column
          border
          borderRadius="3"
          backgroundColor
          style={{ overflow: 'hidden' }}
        >
          <Row
            alignItems="center"
            justifyContent="space-between"
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--base-color-1)',
            }}
          >
            <Text size="2" color="muted" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
            </Text>
            <SearchField
              value={search}
              onSearch={setSearch}
              delay={150}
              style={{ width: '240px' }}
            />
          </Row>

          <Column style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredWebsites.length === 0 ? (
              <Row
                justifyContent="center"
                alignItems="center"
                style={{ padding: '32px', color: 'var(--font-color-muted)' }}
              >
                <Text color="muted">No websites found</Text>
              </Row>
            ) : (
              filteredWebsites.map((website) => (
                <CompactWebsiteRow key={website.id} website={website} />
              ))
            )}
          </Column>
        </Column>
      </Column>
    </PageBody>
  );
}
