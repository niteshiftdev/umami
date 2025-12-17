'use client';

import { useState } from 'react';
import { Column, Row, Text, SearchField, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { ChevronRight } from '@/components/icons';
import Link from 'next/link';

const websites = [
  { id: '1', name: 'Acme Analytics', domain: 'analytics.acme.com' },
  { id: '2', name: 'TechCorp Blog', domain: 'blog.techcorp.io' },
  { id: '3', name: 'Startup Hub', domain: 'startuphub.co' },
  { id: '4', name: 'E-Commerce Store', domain: 'shop.example.com' },
  { id: '5', name: 'Developer Docs', domain: 'docs.devtools.dev' },
  { id: '6', name: 'Marketing Site', domain: 'marketing.brand.com' },
];

export default function MinimalRowsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredWebsites = websites.filter(
    website =>
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.domain.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" />
        <Panel style={{ padding: 0 }}>
          <Column>
            <Row paddingX="6" paddingY="4">
              <SearchField
                placeholder="Search..."
                value={searchQuery}
                onChange={setSearchQuery}
                style={{ maxWidth: 300 }}
              />
            </Row>
            <Column>
              {filteredWebsites.map((website, index) => (
                <Link
                  key={website.id}
                  href={`/websites/${website.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onMouseEnter={() => setHoveredId(website.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Row
                    paddingX="6"
                    paddingY="5"
                    alignItems="center"
                    gap="4"
                    style={{
                      borderBottom:
                        index < filteredWebsites.length - 1
                          ? '1px solid var(--gray-a3)'
                          : undefined,
                      backgroundColor:
                        hoveredId === website.id ? 'var(--gray-a2)' : 'transparent',
                      transition: 'background-color 0.15s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <Favicon domain={website.domain} style={{ width: 20, height: 20 }} />
                    <Column gap="1" style={{ flex: 1 }}>
                      <Text size="3" weight="medium">
                        {website.name}
                      </Text>
                      <Text size="1" color="muted" style={{ opacity: 0.7 }}>
                        {website.domain}
                      </Text>
                    </Column>
                    <Icon size="xs" color="muted" style={{ opacity: 0.4 }}>
                      <ChevronRight />
                    </Icon>
                  </Row>
                </Link>
              ))}
            </Column>
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
