'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Grid,
  Text,
  Heading,
  SearchField,
  Button,
  Icon,
  TooltipTrigger,
  Tooltip,
} from '@umami/react-zen';
import { Globe, Plus, Settings, ExternalLink, BarChart3 } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
}

const sampleWebsites: Website[] = [
  { id: '1', name: 'Marketing Site', domain: 'marketing.example.com', createdAt: '2024-06-15T10:00:00Z' },
  { id: '2', name: 'E-commerce Store', domain: 'shop.example.com', createdAt: '2024-08-20T14:30:00Z' },
  { id: '3', name: 'Developer Blog', domain: 'blog.devteam.io', createdAt: '2024-09-01T09:15:00Z' },
  { id: '4', name: 'Customer Portal', domain: 'portal.example.com', createdAt: '2024-10-10T16:45:00Z' },
  { id: '5', name: 'Landing Pages', domain: 'pages.example.com', createdAt: '2024-11-05T11:20:00Z' },
  { id: '6', name: 'Documentation', domain: 'docs.example.com', createdAt: '2024-11-20T08:00:00Z' },
];

export default function CardGridPage() {
  const [search, setSearch] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!search) return sampleWebsites;
    const searchLower = search.toLowerCase();
    return sampleWebsites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchLower) ||
        site.domain.toLowerCase().includes(searchLower)
    );
  }, [search]);

  return (
    <Column
      width="100%"
      paddingBottom="6"
      maxWidth="1320px"
      paddingX={{ xs: '3', md: '6' }}
      style={{ margin: '0 auto' }}
    >
      <Column gap="6" style={{ paddingTop: 8 }}>
        {/* Page Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="6"
          style={{ borderBottom: '1px solid var(--border-color)' }}
          width="100%"
        >
          <Column gap="2">
            <Row alignItems="center" gap="3">
              <Icon size="md" color="muted">
                <Globe />
              </Icon>
              <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
            </Row>
          </Column>
          <Row justifyContent="flex-end">
            <Button variant="primary">
              <Icon size="sm">
                <Plus />
              </Icon>
              Add Website
            </Button>
          </Row>
        </Row>

        {/* Search Bar */}
        <Row alignItems="center" gap="4">
          <SearchField
            value={search}
            onSearch={setSearch}
            delay={300}
            placeholder="Search websites..."
          />
          <Text size="2" color="muted">
            {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
          </Text>
        </Row>

        {/* Card Grid */}
        {filteredWebsites.length > 0 ? (
          <Grid columns={{ xs: 1, sm: 2, lg: 3 }} gap="4">
            {filteredWebsites.map((website, index) => (
              <Column
                key={website.id}
                padding="5"
                borderRadius="3"
                gap="4"
                style={{
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  animation: `cardFadeIn 0.3s ease-out ${index * 0.05}s both`,
                }}
                className="website-card"
              >
                {/* Card Header */}
                <Row alignItems="flex-start" justifyContent="space-between">
                  <Row
                    alignItems="center"
                    justifyContent="center"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      backgroundColor: 'var(--primary-color)',
                      color: 'white',
                    }}
                  >
                    <Globe size={24} />
                  </Row>
                  <TooltipTrigger delay={0}>
                    <Button variant="quiet" size="sm" asChild>
                      <a
                        href={`https://${website.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon size="sm">
                          <ExternalLink />
                        </Icon>
                      </a>
                    </Button>
                    <Tooltip>Visit Site</Tooltip>
                  </TooltipTrigger>
                </Row>

                {/* Card Content */}
                <Column gap="1">
                  <Heading size="2">{website.name}</Heading>
                  <Row alignItems="center" gap="1">
                    <Icon size="sm" color="muted">
                      <Globe />
                    </Icon>
                    <Text size="2" color="muted">
                      {website.domain}
                    </Text>
                  </Row>
                </Column>

                {/* Card Actions */}
                <Row gap="2" style={{ marginTop: 'auto' }}>
                  <Button variant="primary" style={{ flex: 1 }} asChild>
                    <Link href={`/websites/${website.id}`}>
                      <Icon size="sm">
                        <BarChart3 />
                      </Icon>
                      Analytics
                    </Link>
                  </Button>
                  <TooltipTrigger delay={0}>
                    <Button variant="outline" asChild>
                      <Link href={`/websites/${website.id}/settings`}>
                        <Icon size="sm">
                          <Settings />
                        </Icon>
                      </Link>
                    </Button>
                    <Tooltip>Settings</Tooltip>
                  </TooltipTrigger>
                </Row>
              </Column>
            ))}
          </Grid>
        ) : (
          /* Empty State */
          <Column
            alignItems="center"
            justifyContent="center"
            padding="10"
            gap="4"
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              backgroundColor: 'var(--background-color)',
              minHeight: 300,
            }}
          >
            <Row
              alignItems="center"
              justifyContent="center"
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'var(--base-color-3)',
              }}
            >
              <Icon size="lg" color="muted">
                <Globe />
              </Icon>
            </Row>
            <Column alignItems="center" gap="2">
              <Heading size="2">No websites found</Heading>
              <Text color="muted" align="center">
                {search
                  ? `No websites match "${search}"`
                  : 'Add your first website to get started'}
              </Text>
            </Column>
            {!search && (
              <Button variant="primary">
                <Icon size="sm">
                  <Plus />
                </Icon>
                Add Website
              </Button>
            )}
          </Column>
        )}
      </Column>

      <style jsx global>{`
        @keyframes cardFadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .website-card:hover {
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </Column>
  );
}
