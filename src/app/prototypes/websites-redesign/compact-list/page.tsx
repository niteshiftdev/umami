'use client';

import { useState } from 'react';
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Icon,
  SearchField,
  Badge,
} from '@umami/react-zen';
import {
  Plus,
  Globe,
  ExternalLink,
  Settings,
  ChevronRight,
  Activity,
  Circle,
} from '@/components/icons';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';

// Sample data representing realistic website analytics
const sampleWebsites = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    pageviews: 45230,
    visitors: 12450,
    lastVisit: '2 min ago',
    status: 'active',
  },
  {
    id: '2',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    pageviews: 28750,
    visitors: 8920,
    lastVisit: '5 min ago',
    status: 'active',
  },
  {
    id: '3',
    name: 'E-Commerce Store',
    domain: 'shop.mystore.com',
    pageviews: 156800,
    visitors: 42300,
    lastVisit: '1 min ago',
    status: 'active',
  },
  {
    id: '4',
    name: 'Marketing Landing',
    domain: 'promo.acme.com',
    pageviews: 8450,
    visitors: 3200,
    lastVisit: '1 hour ago',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Developer Docs',
    domain: 'docs.techstart.io',
    pageviews: 67200,
    visitors: 15800,
    lastVisit: '3 min ago',
    status: 'active',
  },
  {
    id: '6',
    name: 'Support Portal',
    domain: 'support.acme.com',
    pageviews: 12300,
    visitors: 4500,
    lastVisit: '15 min ago',
    status: 'active',
  },
  {
    id: '7',
    name: 'Company Intranet',
    domain: 'internal.acme.com',
    pageviews: 5200,
    visitors: 890,
    lastVisit: '30 min ago',
    status: 'active',
  },
  {
    id: '8',
    name: 'API Documentation',
    domain: 'api.techstart.io',
    pageviews: 34500,
    visitors: 7800,
    lastVisit: '8 min ago',
    status: 'active',
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

function WebsiteRow({ website }: { website: (typeof sampleWebsites)[0] }) {
  const isActive = website.status === 'active';

  return (
    <Row
      alignItems="center"
      paddingY="3"
      paddingX="4"
      gap="4"
      style={{
        borderBottom: '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
    >
      {/* Status indicator */}
      <Icon size="xs" style={{ color: isActive ? 'var(--color-success)' : 'var(--color-muted)' }}>
        <Circle fill="currentColor" />
      </Icon>

      {/* Website info */}
      <Column gap="0" style={{ flex: 1, minWidth: 0 }}>
        <Text weight="medium" truncate>
          {website.name}
        </Text>
        <Text size="1" color="muted" truncate>
          {website.domain}
        </Text>
      </Column>

      {/* Stats - hidden on mobile */}
      <Row gap="6" display={{ xs: 'none', md: 'flex' }}>
        <Column alignItems="flex-end" style={{ width: '80px' }}>
          <Text size="1" color="muted">
            Views
          </Text>
          <Text size="2" weight="medium">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>

        <Column alignItems="flex-end" style={{ width: '80px' }}>
          <Text size="1" color="muted">
            Visitors
          </Text>
          <Text size="2" weight="medium">
            {formatNumber(website.visitors)}
          </Text>
        </Column>

        <Column alignItems="flex-end" style={{ width: '100px' }}>
          <Text size="1" color="muted">
            Last visit
          </Text>
          <Text size="2">{website.lastVisit}</Text>
        </Column>
      </Row>

      {/* Actions */}
      <Row gap="1">
        <Button variant="quiet" size="sm">
          <Icon size="sm">
            <Activity />
          </Icon>
        </Button>
        <Button variant="quiet" size="sm">
          <Icon size="sm">
            <Settings />
          </Icon>
        </Button>
        <Icon size="sm" color="muted">
          <ChevronRight />
        </Icon>
      </Row>
    </Row>
  );
}

export default function CompactListWebsitesPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredWebsites = sampleWebsites.filter(website => {
    const matchesSearch =
      website.name.toLowerCase().includes(search.toLowerCase()) ||
      website.domain.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && website.status === 'active') ||
      (filter === 'inactive' && website.status === 'inactive');
    return matchesSearch && matchesFilter;
  });

  const activeCount = sampleWebsites.filter(w => w.status === 'active').length;
  const inactiveCount = sampleWebsites.filter(w => w.status === 'inactive').length;

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            Add Website
          </Button>
        </PageHeader>

        <Column border borderRadius="3" backgroundColor>
          {/* Toolbar */}
          <Row
            alignItems="center"
            justifyContent="space-between"
            wrap="wrap"
            gap="3"
            padding="4"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <Row gap="3" alignItems="center">
              <SearchField
                value={search}
                onSearch={setSearch}
                placeholder="Search..."
                delay={300}
              />
              <Row gap="1" display={{ xs: 'none', sm: 'flex' }}>
                <Button
                  variant={filter === 'all' ? 'primary' : 'quiet'}
                  size="sm"
                  onPress={() => setFilter('all')}
                >
                  All ({sampleWebsites.length})
                </Button>
                <Button
                  variant={filter === 'active' ? 'primary' : 'quiet'}
                  size="sm"
                  onPress={() => setFilter('active')}
                >
                  Active ({activeCount})
                </Button>
                <Button
                  variant={filter === 'inactive' ? 'primary' : 'quiet'}
                  size="sm"
                  onPress={() => setFilter('inactive')}
                >
                  Inactive ({inactiveCount})
                </Button>
              </Row>
            </Row>
            <Text color="muted" size="1">
              {filteredWebsites.length} result{filteredWebsites.length !== 1 ? 's' : ''}
            </Text>
          </Row>

          {/* Header row */}
          <Row
            alignItems="center"
            paddingY="2"
            paddingX="4"
            gap="4"
            style={{
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-background-subtle)',
            }}
          >
            <div style={{ width: '16px' }} />
            <Text size="1" color="muted" weight="medium" style={{ flex: 1 }}>
              Website
            </Text>
            <Row gap="6" display={{ xs: 'none', md: 'flex' }}>
              <Text size="1" color="muted" weight="medium" style={{ width: '80px', textAlign: 'right' }}>
                Views
              </Text>
              <Text size="1" color="muted" weight="medium" style={{ width: '80px', textAlign: 'right' }}>
                Visitors
              </Text>
              <Text size="1" color="muted" weight="medium" style={{ width: '100px', textAlign: 'right' }}>
                Last visit
              </Text>
            </Row>
            <div style={{ width: '100px' }} />
          </Row>

          {/* Website list */}
          <Column style={{ minHeight: '300px' }}>
            {filteredWebsites.map(website => (
              <WebsiteRow key={website.id} website={website} />
            ))}

            {filteredWebsites.length === 0 && (
              <Column alignItems="center" justifyContent="center" padding="10" gap="3">
                <Icon size="lg" color="muted">
                  <Globe />
                </Icon>
                <Text color="muted">No websites found</Text>
              </Column>
            )}
          </Column>

          {/* Footer */}
          <Row
            padding="3"
            justifyContent="space-between"
            alignItems="center"
            style={{
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-background-subtle)',
            }}
          >
            <Text size="1" color="muted">
              Showing {filteredWebsites.length} of {sampleWebsites.length} websites
            </Text>
            <Row gap="2">
              <Button variant="quiet" size="sm" isDisabled>
                Previous
              </Button>
              <Button variant="quiet" size="sm" isDisabled>
                Next
              </Button>
            </Row>
          </Row>
        </Column>
      </Column>
    </PageBody>
  );
}
