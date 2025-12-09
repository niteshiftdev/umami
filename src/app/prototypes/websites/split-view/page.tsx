'use client';
import { useState } from 'react';
import { Row, Column, Text, Heading, Button, Icon, Grid } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { LinkButton } from '@/components/common/LinkButton';
import { SquarePen, Eye, Copy, Trash2 } from '@/components/icons';

// Sample data
const websites = [
  { id: '1', name: 'acme-corp.com', domain: 'acme-corp.com', views: 125400, visitors: 34200, bounceRate: 42.5, avgDuration: 287, created: '2024-01-15' },
  { id: '2', name: 'startup-hub.io', domain: 'startup-hub.io', views: 89200, visitors: 28100, bounceRate: 51.2, avgDuration: 165, created: '2024-02-20' },
  { id: '3', name: 'design-studio.net', domain: 'design-studio.net', views: 156800, visitors: 45600, bounceRate: 38.9, avgDuration: 412, created: '2024-01-08' },
  { id: '4', name: 'tech-blog.dev', domain: 'tech-blog.dev', views: 203400, visitors: 52100, bounceRate: 35.4, avgDuration: 523, created: '2023-11-12' },
  { id: '5', name: 'ecommerce-hub.shop', domain: 'ecommerce-hub.shop', views: 421600, visitors: 98200, bounceRate: 28.7, avgDuration: 651, created: '2023-10-05' },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export default function SplitViewPage() {
  const [selectedId, setSelectedId] = useState(websites[0].id);
  const selected = websites.find(w => w.id === selectedId) || websites[0];

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites - Master-Detail View">
          <Button variant="primary">Add Website</Button>
        </PageHeader>

        <Row gap="4" alignItems="stretch">
          {/* Master List */}
          <Panel style={{ flex: '0 0 320px' }}>
            <Column gap="1">
              {websites.map((website) => (
                <Row
                  key={website.id}
                  gap="3"
                  paddingY="3"
                  paddingX="3"
                  borderRadius="2"
                  onClick={() => setSelectedId(website.id)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedId === website.id
                      ? 'var(--color-background-accent)'
                      : 'transparent',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedId !== website.id) {
                      e.currentTarget.style.backgroundColor = 'var(--color-background-hover)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedId !== website.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Column gap="1" flex="1">
                    <Text weight="500" truncate>{website.name}</Text>
                    <Text color="muted" size="xs" truncate>{website.domain}</Text>
                  </Column>
                </Row>
              ))}
            </Column>
          </Panel>

          {/* Detail Panel */}
          <Panel style={{ flex: 1 }}>
            <Column gap="6">
              {/* Header */}
              <Column gap="2">
                <Row justifyContent="space-between" alignItems="flex-start">
                  <Column gap="2" flex="1">
                    <Heading size="3">{selected.name}</Heading>
                    <Text color="muted">{selected.domain}</Text>
                  </Column>
                  <Row gap="2">
                    <LinkButton href={`/websites/${selected.id}`} variant="primary" size="sm">
                      <Icon><Eye /></Icon>
                    </LinkButton>
                    <LinkButton href={`/websites/${selected.id}/settings`} variant="secondary" size="sm">
                      <Icon><SquarePen /></Icon>
                    </LinkButton>
                  </Row>
                </Row>
              </Column>

              {/* Stats Grid */}
              <Grid columns="1fr 1fr" gap="4">
                <Column gap="2">
                  <Text color="muted" size="sm">Page Views</Text>
                  <Heading size="3">{formatNumber(selected.views)}</Heading>
                </Column>
                <Column gap="2">
                  <Text color="muted" size="sm">Visitors</Text>
                  <Heading size="3">{formatNumber(selected.visitors)}</Heading>
                </Column>
                <Column gap="2">
                  <Text color="muted" size="sm">Bounce Rate</Text>
                  <Heading size="3">{selected.bounceRate}%</Heading>
                </Column>
                <Column gap="2">
                  <Text color="muted" size="sm">Avg Duration</Text>
                  <Heading size="3">{selected.avgDuration}s</Heading>
                </Column>
              </Grid>

              {/* Additional Info */}
              <Column gap="3" borderTop paddingTop="4">
                <Row justifyContent="space-between" alignItems="center">
                  <Column gap="1">
                    <Text color="muted" size="sm">Created</Text>
                    <Text>{selected.created}</Text>
                  </Column>
                </Row>

                {/* Actions */}
                <Row gap="2" borderTop paddingTop="4">
                  <Button variant="secondary" size="sm">
                    <Icon size="sm"><Copy /></Icon>
                    Duplicate
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Icon size="sm"><Trash2 /></Icon>
                    Delete
                  </Button>
                </Row>
              </Column>
            </Column>
          </Panel>
        </Row>
      </Column>
    </PageBody>
  );
}
