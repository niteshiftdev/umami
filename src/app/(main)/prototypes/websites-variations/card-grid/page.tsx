'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Grid,
  Text,
  Icon,
  Button,
  SearchField,
} from '@umami/react-zen';
import { SquarePen, ExternalLink, BarChart2, Plus, Globe } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { Empty } from '@/components/common/Empty';
import styles from './CardGrid.module.css';

interface Website {
  id: string;
  name: string;
  domain: string | null;
  teamId: string | null;
}

// Realistic sample websites for demonstration
const sampleWebsites: Website[] = [
  {
    id: 'w1',
    name: 'TechCrunch Blog',
    domain: 'techcrunch.com',
    teamId: null,
  },
  {
    id: 'w2',
    name: 'E-Commerce Store',
    domain: 'shopify.com',
    teamId: 't1',
  },
  {
    id: 'w3',
    name: 'Marketing Landing',
    domain: 'hubspot.com',
    teamId: null,
  },
  {
    id: 'w4',
    name: 'Developer Docs',
    domain: 'stripe.com',
    teamId: 't2',
  },
  {
    id: 'w5',
    name: 'SaaS Dashboard',
    domain: 'notion.so',
    teamId: null,
  },
  {
    id: 'w6',
    name: 'Community Forum',
    domain: 'discord.com',
    teamId: 't1',
  },
];

function WebsiteCard({ website }: { website: Website }) {
  return (
    <div className={styles.card}>
      <Column gap="4" height="100%">
        <Row alignItems="center" gap="3">
          <div className={styles.faviconWrapper}>
            {website.domain ? (
              <Favicon domain={website.domain} />
            ) : (
              <Icon size="sm" color="muted">
                <Globe />
              </Icon>
            )}
          </div>
          <Column gap="1" flexGrow={1} style={{ minWidth: 0 }}>
            <Link href={`/websites/${website.id}`} className={styles.nameLink}>
              <Text weight="bold" size="4" truncate>
                {website.name}
              </Text>
            </Link>
            <Text color="muted" size="2" truncate>
              {website.domain || 'No domain configured'}
            </Text>
          </Column>
        </Row>

        <Row gap="2" marginTop="auto">
          <LinkButton
            href={`/websites/${website.id}`}
            variant="outline"
            size="sm"
            style={{ flex: 1 }}
          >
            <Icon size="xs">
              <BarChart2 />
            </Icon>
            <Text size="2">Analytics</Text>
          </LinkButton>
          <LinkButton
            href={`/websites/${website.id}/settings`}
            variant="quiet"
            size="sm"
          >
            <Icon size="xs">
              <SquarePen />
            </Icon>
          </LinkButton>
          {website.domain && (
            <Button
              variant="quiet"
              size="sm"
              onPress={() => window.open(`https://${website.domain}`, '_blank')}
            >
              <Icon size="xs">
                <ExternalLink />
              </Icon>
            </Button>
          )}
        </Row>
      </Column>
    </div>
  );
}

export default function CardGridPage() {
  const [search, setSearch] = useState('');

  // In a real implementation, this would use useUserWebsitesQuery
  // For prototype, using sample data
  const websites = sampleWebsites;
  const isLoading = false;
  const error = null;

  const filteredWebsites = useMemo(() => {
    if (!search) return websites;
    const searchLower = search.toLowerCase();
    return websites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchLower) ||
        site.domain?.toLowerCase().includes(searchLower)
    );
  }, [websites, search]);

  return (
    <PageBody isLoading={isLoading} error={error}>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <LinkButton href="/websites?add=true" variant="primary">
            <Icon size="sm">
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </LinkButton>
        </PageHeader>

        <Panel>
          <Column gap="6">
            <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap="3">
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

            {filteredWebsites.length === 0 ? (
              <Empty message={search ? 'No websites match your search' : 'No websites yet'} />
            ) : (
              <Grid
                columns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap="4"
                className={styles.grid}
              >
                {filteredWebsites.map((website, index) => (
                  <div
                    key={website.id}
                    className={styles.gridItem}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <WebsiteCard website={website} />
                  </div>
                ))}
              </Grid>
            )}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
