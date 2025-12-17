'use client';

import { useState } from 'react';
import { Grid, Column, Row, Text, Button, Icon, SearchField } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { SquarePen } from '@/components/icons';
import Link from 'next/link';

const websites = [
  { id: '1', name: 'Acme Analytics', domain: 'analytics.acme.com' },
  { id: '2', name: 'TechCorp Blog', domain: 'blog.techcorp.io' },
  { id: '3', name: 'Startup Hub', domain: 'startuphub.co' },
  { id: '4', name: 'E-Commerce Store', domain: 'shop.example.com' },
  { id: '5', name: 'Developer Docs', domain: 'docs.devtools.dev' },
  { id: '6', name: 'Marketing Site', domain: 'marketing.brand.com' },
];

export default function CardGridPage() {
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
          <Column gap="4">
            <Row>
              <SearchField
                placeholder="Search websites..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </Row>
            <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="4">
              {filteredWebsites.map(website => (
                <Link
                  key={website.id}
                  href={`/websites/${website.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Column
                    border
                    borderRadius="3"
                    backgroundColor
                    padding="4"
                    gap="3"
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      height: '100%',
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.borderColor = 'var(--gray-a7)';
                      e.currentTarget.style.boxShadow = '0 2px 8px var(--gray-a4)';
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <Row alignItems="center" gap="3">
                      <Favicon domain={website.domain} style={{ width: 32, height: 32 }} />
                      <Text size="3" weight="bold" truncate>
                        {website.name}
                      </Text>
                    </Row>
                    <Text size="1" color="muted" truncate>
                      {website.domain}
                    </Text>
                    <Row justifyContent="flex-end">
                      <Button
                        variant="quiet"
                        size="sm"
                        asChild
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <Link href={`/websites/${website.id}/settings`}>
                          <Icon size="xs">
                            <SquarePen />
                          </Icon>
                        </Link>
                      </Button>
                    </Row>
                  </Column>
                </Link>
              ))}
            </Grid>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
