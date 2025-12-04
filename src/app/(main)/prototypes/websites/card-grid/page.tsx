'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Column, Row, Button, Text, Icon, Grid } from '@umami/react-zen';
import { PageBody, PageHeader, Favicon, LinkButton, Empty } from '@/components/common';
import { useMessages, useNavigation } from '@/components/hooks';
import { Globe, Eye, Settings, ExternalLink, BarChart3, Clock } from '@/components/icons';

// Sample website data for prototype demonstration
const sampleWebsites = [
  {
    id: 'ws-001',
    name: 'Acme Corporation',
    domain: 'acme.com',
    createdAt: '2024-01-15T10:00:00Z',
    pageviews: 45230,
    visitors: 12450,
  },
  {
    id: 'ws-002',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    createdAt: '2024-02-20T14:30:00Z',
    pageviews: 28940,
    visitors: 8320,
  },
  {
    id: 'ws-003',
    name: 'E-Commerce Store',
    domain: 'shop.mystore.com',
    createdAt: '2024-03-05T09:15:00Z',
    pageviews: 156780,
    visitors: 42100,
  },
  {
    id: 'ws-004',
    name: 'Portfolio Site',
    domain: 'jsmith.design',
    createdAt: '2024-04-12T16:45:00Z',
    pageviews: 8920,
    visitors: 3450,
  },
  {
    id: 'ws-005',
    name: 'SaaS Dashboard',
    domain: 'app.cloudmetrics.io',
    createdAt: '2024-05-08T11:20:00Z',
    pageviews: 89450,
    visitors: 15890,
  },
  {
    id: 'ws-006',
    name: 'Documentation Hub',
    domain: 'docs.openapi.dev',
    createdAt: '2024-06-22T08:00:00Z',
    pageviews: 34560,
    visitors: 11200,
  },
  {
    id: 'ws-007',
    name: 'Marketing Site',
    domain: 'www.brandlaunch.co',
    createdAt: '2024-07-10T13:30:00Z',
    pageviews: 67890,
    visitors: 22340,
  },
  {
    id: 'ws-008',
    name: 'Community Forum',
    domain: 'forum.devtalk.net',
    createdAt: '2024-08-01T07:45:00Z',
    pageviews: 112340,
    visitors: 28900,
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface WebsiteCardProps {
  website: (typeof sampleWebsites)[0];
  index: number;
}

function WebsiteCard({ website, index }: WebsiteCardProps) {
  const { renderUrl } = useNavigation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Column
      border
      borderRadius="3"
      backgroundColor
      padding="5"
      gap="4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transition: 'transform 150ms ease, box-shadow 150ms ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 4px 12px rgba(0, 0, 0, 0.08)'
          : '0 1px 3px rgba(0, 0, 0, 0.04)',
        animation: `fadeSlideIn 300ms ease-out ${index * 50}ms both`,
      }}
    >
      {/* Header with favicon and name */}
      <Row alignItems="center" gap="3">
        <Row
          alignItems="center"
          justifyContent="center"
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--border-radius-2)',
            backgroundColor: 'var(--base3)',
            flexShrink: 0,
          }}
        >
          <Favicon domain={website.domain} style={{ width: 20, height: 20 }} />
        </Row>
        <Column gap="1" style={{ minWidth: 0, flex: 1 }}>
          <Link
            href={renderUrl(`/websites/${website.id}`, false)}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 'var(--font-size-3)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {website.name}
          </Link>
          <Row alignItems="center" gap="2">
            <Icon size="xs" color="muted">
              <Globe />
            </Icon>
            <Text size="1" color="muted" truncate>
              {website.domain}
            </Text>
          </Row>
        </Column>
      </Row>

      {/* Stats row */}
      <Row gap="4" paddingY="2" style={{ borderTop: '1px solid var(--base4)', paddingTop: 12 }}>
        <Column gap="1" style={{ flex: 1 }}>
          <Row alignItems="center" gap="1">
            <Icon size="xs" color="muted">
              <BarChart3 />
            </Icon>
            <Text size="1" color="muted">
              Pageviews
            </Text>
          </Row>
          <Text size="2" weight="500">
            {formatNumber(website.pageviews)}
          </Text>
        </Column>
        <Column gap="1" style={{ flex: 1 }}>
          <Row alignItems="center" gap="1">
            <Icon size="xs" color="muted">
              <Eye />
            </Icon>
            <Text size="1" color="muted">
              Visitors
            </Text>
          </Row>
          <Text size="2" weight="500">
            {formatNumber(website.visitors)}
          </Text>
        </Column>
      </Row>

      {/* Footer with date and actions */}
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={{ borderTop: '1px solid var(--base4)', paddingTop: 12 }}
      >
        <Row alignItems="center" gap="2">
          <Icon size="xs" color="muted">
            <Clock />
          </Icon>
          <Text size="1" color="muted">
            Added {formatDate(website.createdAt)}
          </Text>
        </Row>
        <Row gap="2">
          <LinkButton
            href={renderUrl(`/websites/${website.id}`, false)}
            variant="primary"
            size="sm"
          >
            <Icon>
              <Eye />
            </Icon>
            View
          </LinkButton>
          <LinkButton
            href={renderUrl(`/websites/${website.id}/settings`, false)}
            variant="quiet"
            size="sm"
          >
            <Icon>
              <Settings />
            </Icon>
          </LinkButton>
        </Row>
      </Row>
    </Column>
  );
}

export default function CardGridWebsitesPage() {
  const { formatMessage, labels } = useMessages();
  const websites = sampleWebsites;

  return (
    <>
      <style>
        {`
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
        `}
      </style>
      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader title={formatMessage(labels.websites)}>
            <Button variant="primary">
              <Icon>
                <Globe />
              </Icon>
              Add Website
            </Button>
          </PageHeader>

          {websites.length === 0 ? (
            <Empty message="No websites found. Add your first website to get started." />
          ) : (
            <Grid
              gap="4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              }}
            >
              {websites.map((website, index) => (
                <WebsiteCard key={website.id} website={website} index={index} />
              ))}
            </Grid>
          )}
        </Column>
      </PageBody>
    </>
  );
}
