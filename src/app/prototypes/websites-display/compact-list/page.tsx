'use client';

import { useState } from 'react';
import { Column, Row, Text, Button, Icon, SearchField } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { SquarePen, ExternalLink } from '@/components/icons';
import Link from 'next/link';

const websites = [
  { id: '1', name: 'Acme Analytics', domain: 'analytics.acme.com', createdAt: '2024-01-15' },
  { id: '2', name: 'TechCorp Blog', domain: 'blog.techcorp.io', createdAt: '2024-02-20' },
  { id: '3', name: 'Startup Hub', domain: 'startuphub.co', createdAt: '2024-03-10' },
  { id: '4', name: 'E-Commerce Store', domain: 'shop.example.com', createdAt: '2024-04-05' },
  { id: '5', name: 'Developer Docs', domain: 'docs.devtools.dev', createdAt: '2024-05-12' },
  { id: '6', name: 'Marketing Site', domain: 'marketing.brand.com', createdAt: '2024-06-18' },
  { id: '7', name: 'Support Portal', domain: 'support.company.org', createdAt: '2024-07-22' },
  { id: '8', name: 'Admin Dashboard', domain: 'admin.internal.net', createdAt: '2024-08-30' },
];

export default function CompactListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = websites.filter(
    website =>
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.domain.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" />
        <Panel>
          <Column gap="2">
            <Row justifyContent="space-between" alignItems="center">
              <SearchField
                placeholder="Filter websites..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <Text size="1" color="muted">
                {filteredWebsites.length} websites
              </Text>
            </Row>
            <Column>
              {filteredWebsites.map((website, index) => (
                <Row
                  key={website.id}
                  alignItems="center"
                  paddingY="2"
                  gap="3"
                  style={{
                    borderBottom:
                      index < filteredWebsites.length - 1
                        ? '1px solid var(--gray-a4)'
                        : undefined,
                  }}
                >
                  <Favicon domain={website.domain} />
                  <Row alignItems="center" gap="2" style={{ flex: 1 }}>
                    <Text weight="medium" size="2">
                      {website.name}
                    </Text>
                    <Text size="1" color="muted">
                      {website.domain}
                    </Text>
                  </Row>
                  <Text size="1" color="muted" style={{ marginLeft: 'auto', marginRight: '16px' }}>
                    {new Date(website.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Row gap="1" alignItems="center">
                    <Button variant="quiet" size="sm" asChild>
                      <Link href={`/websites/${website.id}/settings`}>
                        <Icon size="xs">
                          <SquarePen />
                        </Icon>
                      </Link>
                    </Button>
                    <Button variant="quiet" size="sm" asChild>
                      <Link href={`https://${website.domain}`} target="_blank" rel="noopener">
                        <Icon size="xs">
                          <ExternalLink />
                        </Icon>
                      </Link>
                    </Button>
                  </Row>
                </Row>
              ))}
            </Column>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
