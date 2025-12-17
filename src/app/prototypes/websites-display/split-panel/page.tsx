'use client';

import { useState } from 'react';
import { Grid, Column, Row, Text, Button, Icon, SearchField } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { SquarePen, ExternalLink, Calendar, Globe } from '@/components/icons';
import Link from 'next/link';

const websites = [
  {
    id: '1',
    name: 'Acme Analytics',
    domain: 'analytics.acme.com',
    createdAt: '2024-01-15',
    description: 'Main analytics dashboard for Acme Corp',
  },
  {
    id: '2',
    name: 'TechCorp Blog',
    domain: 'blog.techcorp.io',
    createdAt: '2024-02-20',
    description: 'Engineering blog and tech articles',
  },
  {
    id: '3',
    name: 'Startup Hub',
    domain: 'startuphub.co',
    createdAt: '2024-03-10',
    description: 'Community platform for founders',
  },
  {
    id: '4',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    createdAt: '2024-04-05',
    description: 'Online retail storefront',
  },
  {
    id: '5',
    name: 'Developer Docs',
    domain: 'docs.devtools.dev',
    createdAt: '2024-05-12',
    description: 'API documentation and guides',
  },
  {
    id: '6',
    name: 'Marketing Site',
    domain: 'marketing.brand.com',
    createdAt: '2024-06-18',
    description: 'Brand marketing and landing pages',
  },
];

export default function SplitPanelPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWebsite, setSelectedWebsite] = useState<typeof websites[0] | null>(null);

  const filteredWebsites = websites.filter(
    website =>
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.domain.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" />
        <Grid columns={{ xs: 1, md: '1fr 2fr' }} gap="4">
          {/* Left Panel - Website List */}
          <Panel>
            <Column gap="2">
              <SearchField
                placeholder="Filter..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <Column gap="1" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {filteredWebsites.map(website => (
                  <Row
                    key={website.id}
                    alignItems="center"
                    gap="2"
                    padding="2"
                    borderRadius="2"
                    style={{
                      cursor: 'pointer',
                      backgroundColor:
                        selectedWebsite?.id === website.id ? 'var(--gray-a3)' : 'transparent',
                      transition: 'background-color 0.2s ease',
                    }}
                    onClick={() => setSelectedWebsite(website)}
                    onMouseEnter={(e: any) => {
                      if (selectedWebsite?.id !== website.id) {
                        e.currentTarget.style.backgroundColor = 'var(--gray-a2)';
                      }
                    }}
                    onMouseLeave={(e: any) => {
                      if (selectedWebsite?.id !== website.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Favicon domain={website.domain} />
                    <Column gap="0" style={{ flex: 1 }}>
                      <Text size="2" weight="medium">
                        {website.name}
                      </Text>
                      <Text size="1" color="muted" truncate>
                        {website.domain}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Column>
            </Column>
          </Panel>

          {/* Right Panel - Website Details */}
          <Panel>
            {!selectedWebsite ? (
              <Column
                gap="3"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '400px' }}
              >
                <Icon size="lg" color="muted">
                  <Globe />
                </Icon>
                <Text size="4" color="muted">
                  Select a website
                </Text>
                <Text size="2" color="muted">
                  Choose a website from the list to view details
                </Text>
              </Column>
            ) : (
              <Column gap="6">
                {/* Header with Favicon and Name */}
                <Row alignItems="center" gap="4">
                  <Favicon domain={selectedWebsite.domain} style={{ width: 48, height: 48 }} />
                  <Column gap="1">
                    <Text size="5" weight="bold">
                      {selectedWebsite.name}
                    </Text>
                    <Row alignItems="center" gap="2">
                      <Icon size="xs" color="muted">
                        <Globe />
                      </Icon>
                      <Text size="2" color="muted">
                        {selectedWebsite.domain}
                      </Text>
                    </Row>
                  </Column>
                </Row>

                {/* Description */}
                <Column gap="2">
                  <Text size="2" weight="bold">
                    Description
                  </Text>
                  <Text size="2" color="muted">
                    {selectedWebsite.description}
                  </Text>
                </Column>

                {/* Created Date */}
                <Column gap="2">
                  <Text size="2" weight="bold">
                    Created
                  </Text>
                  <Row alignItems="center" gap="2">
                    <Icon size="xs" color="muted">
                      <Calendar />
                    </Icon>
                    <Text size="2" color="muted">
                      {new Date(selectedWebsite.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Row>
                </Column>

                {/* Action Buttons */}
                <Row gap="3" style={{ marginTop: '16px' }}>
                  <Button variant="primary" asChild>
                    <Link href={`/websites/${selectedWebsite.id}`}>View Analytics</Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link href={`/websites/${selectedWebsite.id}/settings`}>
                      <Icon size="xs">
                        <SquarePen />
                      </Icon>
                      Edit Settings
                    </Link>
                  </Button>
                  <Button variant="secondary" asChild>
                    <Link
                      href={`https://${selectedWebsite.domain}`}
                      target="_blank"
                      rel="noopener"
                    >
                      <Icon size="xs">
                        <ExternalLink />
                      </Icon>
                      Visit Site
                    </Link>
                  </Button>
                </Row>
              </Column>
            )}
          </Panel>
        </Grid>
      </Column>
    </PageBody>
  );
}
