'use client';

import { useState, useMemo } from 'react';
import { Row, Column, Heading, Text, Button, Icon, SearchField } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import {
  Globe,
  Plus,
  BarChart3,
  Calendar,
  Link2,
  Users,
  Eye,
  Settings,
  Code,
  ExternalLink,
} from 'lucide-react';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  pageviews: number;
  visitors: number;
}

const sampleWebsites: Website[] = [
  {
    id: '1',
    name: 'Marketing Site',
    domain: 'marketing.example.com',
    createdAt: '2024-06-15T10:00:00Z',
    pageviews: 45230,
    visitors: 12450,
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'shop.example.com',
    createdAt: '2024-08-20T14:30:00Z',
    pageviews: 128500,
    visitors: 34200,
  },
  {
    id: '3',
    name: 'Developer Blog',
    domain: 'blog.devteam.io',
    createdAt: '2024-09-01T09:15:00Z',
    pageviews: 67800,
    visitors: 23100,
  },
  {
    id: '4',
    name: 'Customer Portal',
    domain: 'portal.example.com',
    createdAt: '2024-10-10T16:45:00Z',
    pageviews: 23400,
    visitors: 8900,
  },
  {
    id: '5',
    name: 'Landing Pages',
    domain: 'pages.example.com',
    createdAt: '2024-11-05T11:20:00Z',
    pageviews: 89200,
    visitors: 41500,
  },
  {
    id: '6',
    name: 'Documentation',
    domain: 'docs.example.com',
    createdAt: '2024-11-20T08:00:00Z',
    pageviews: 156000,
    visitors: 52300,
  },
  {
    id: '7',
    name: 'Support Center',
    domain: 'support.example.com',
    createdAt: '2024-11-25T13:00:00Z',
    pageviews: 34500,
    visitors: 15600,
  },
  {
    id: '8',
    name: 'API Gateway',
    domain: 'api.example.com',
    createdAt: '2024-11-28T15:30:00Z',
    pageviews: 12300,
    visitors: 4500,
  },
];

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function WebsiteListItem({
  website,
  isSelected,
  onClick,
  animationDelay,
}: {
  website: Website;
  isSelected: boolean;
  onClick: () => void;
  animationDelay: number;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 16px',
        cursor: 'pointer',
        borderRadius: '4px',
        backgroundColor: isSelected ? 'var(--base-color-3)' : 'transparent',
        borderLeft: isSelected ? '3px solid var(--primary-color)' : '3px solid transparent',
        transition: 'all 0.15s ease',
        opacity: 0,
        animation: `fadeSlideIn 0.3s ease forwards`,
        animationDelay: `${animationDelay}ms`,
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'var(--base-color-2)';
        }
      }}
      onMouseLeave={e => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <Row alignItems="center" gap="3">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '6px',
            backgroundColor: isSelected ? 'var(--primary-color)' : 'var(--base-color-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.15s ease',
            flexShrink: 0,
          }}
        >
          <Icon size="sm" color={isSelected ? undefined : 'muted'}>
            <Globe
              size={16}
              style={{ color: isSelected ? 'white' : undefined }}
            />
          </Icon>
        </div>
        <Column gap="1" style={{ minWidth: 0, flex: 1 }}>
          <Text
            weight="medium"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {website.name}
          </Text>
          <Text
            size="1"
            color="muted"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {website.domain}
          </Text>
        </Column>
      </Row>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'var(--base-color-2)',
        flex: 1,
        minWidth: '140px',
        opacity: 0,
        animation: `fadeScaleIn 0.4s ease forwards`,
        animationDelay: `${delay}ms`,
      }}
    >
      <Row alignItems="center" gap="2" style={{ marginBottom: '8px' }}>
        <Icon size="sm" color="muted">
          {icon}
        </Icon>
        <Text size="1" color="muted">
          {label}
        </Text>
      </Row>
      <Text size="4" weight="bold">
        {value}
      </Text>
    </div>
  );
}

function PreviewPanel({ website }: { website: Website | null }) {
  if (!website) {
    return (
      <Column
        alignItems="center"
        justifyContent="center"
        gap="4"
        style={{
          height: '100%',
          minHeight: '400px',
          opacity: 0,
          animation: 'fadeIn 0.3s ease forwards',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: 'var(--base-color-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size="lg" color="muted">
            <Globe size={32} />
          </Icon>
        </div>
        <Column alignItems="center" gap="2">
          <Text size="2" color="muted">
            Select a website to view details
          </Text>
          <Text size="1" color="muted">
            Click on any website in the list
          </Text>
        </Column>
      </Column>
    );
  }

  return (
    <Column gap="6" style={{ height: '100%' }}>
      <Row
        alignItems="flex-start"
        justifyContent="space-between"
        style={{
          opacity: 0,
          animation: 'fadeSlideIn 0.3s ease forwards',
        }}
      >
        <Column gap="3">
          <Row alignItems="center" gap="3">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '10px',
                backgroundColor: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Globe size={24} color="white" />
            </div>
            <Column gap="1">
              <Heading size="3">{website.name}</Heading>
              <Row alignItems="center" gap="2">
                <Icon size="xs" color="muted">
                  <Link2 size={14} />
                </Icon>
                <Text size="2" color="muted">
                  {website.domain}
                </Text>
              </Row>
            </Column>
          </Row>
        </Column>
        <Button variant="quiet" size="sm">
          <Icon size="sm">
            <ExternalLink size={16} />
          </Icon>
        </Button>
      </Row>

      <Row
        alignItems="center"
        gap="2"
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          backgroundColor: 'var(--base-color-2)',
          opacity: 0,
          animation: 'fadeSlideIn 0.3s ease forwards',
          animationDelay: '50ms',
        }}
      >
        <Icon size="xs" color="muted">
          <Calendar size={14} />
        </Icon>
        <Text size="1" color="muted">
          Created {formatDate(website.createdAt)}
        </Text>
      </Row>

      <Column gap="3">
        <Text size="1" weight="medium" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Analytics Overview
        </Text>
        <Row gap="4" wrap="wrap">
          <StatCard
            icon={<Eye size={16} />}
            label="Page Views"
            value={formatNumber(website.pageviews)}
            delay={100}
          />
          <StatCard
            icon={<Users size={16} />}
            label="Visitors"
            value={formatNumber(website.visitors)}
            delay={150}
          />
          <StatCard
            icon={<BarChart3 size={16} />}
            label="Avg. Views/Visit"
            value={(website.pageviews / website.visitors).toFixed(1)}
            delay={200}
          />
        </Row>
      </Column>

      <Column
        gap="3"
        style={{
          marginTop: 'auto',
          paddingTop: '24px',
          borderTop: '1px solid var(--base-color-4)',
          opacity: 0,
          animation: 'fadeSlideIn 0.3s ease forwards',
          animationDelay: '250ms',
        }}
      >
        <Text size="1" weight="medium" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Quick Actions
        </Text>
        <Row gap="3" wrap="wrap">
          <Button variant="primary">
            <Icon size="sm">
              <BarChart3 size={16} />
            </Icon>
            <span>View Analytics</span>
          </Button>
          <Button variant="secondary">
            <Icon size="sm">
              <Settings size={16} />
            </Icon>
            <span>Edit Settings</span>
          </Button>
          <Button variant="quiet">
            <Icon size="sm">
              <Code size={16} />
            </Icon>
            <span>Tracking Code</span>
          </Button>
        </Row>
      </Column>
    </Column>
  );
}

export default function CompactListPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = useMemo(() => {
    if (!searchQuery.trim()) return sampleWebsites;
    const query = searchQuery.toLowerCase();
    return sampleWebsites.filter(
      website =>
        website.name.toLowerCase().includes(query) || website.domain.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedWebsite = useMemo(() => {
    return sampleWebsites.find(w => w.id === selectedId) || null;
  }, [selectedId]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeScaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader title="Websites" icon={<Globe />}>
            <Button variant="primary">
              <Icon size="sm">
                <Plus size={16} />
              </Icon>
              <span>Add Website</span>
            </Button>
          </PageHeader>

          <Row
            gap="6"
            style={{
              minHeight: '500px',
            }}
          >
            <Panel
              style={{
                width: '380px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Column gap="4" style={{ height: '100%' }}>
                <SearchField
                  value={searchQuery}
                  onSearch={setSearchQuery}
                  placeholder="Search websites..."
                  style={{
                    opacity: 0,
                    animation: 'fadeIn 0.3s ease forwards',
                  }}
                />

                <Column
                  gap="1"
                  style={{
                    flex: 1,
                    overflow: 'auto',
                    marginRight: '-12px',
                    paddingRight: '12px',
                  }}
                >
                  {filteredWebsites.length === 0 ? (
                    <Column
                      alignItems="center"
                      justifyContent="center"
                      gap="2"
                      style={{ padding: '32px 16px' }}
                    >
                      <Text size="2" color="muted">
                        No websites found
                      </Text>
                      <Text size="1" color="muted">
                        Try a different search term
                      </Text>
                    </Column>
                  ) : (
                    filteredWebsites.map((website, index) => (
                      <WebsiteListItem
                        key={website.id}
                        website={website}
                        isSelected={website.id === selectedId}
                        onClick={() => setSelectedId(website.id)}
                        animationDelay={index * 40}
                      />
                    ))
                  )}
                </Column>

                <Row
                  justifyContent="space-between"
                  alignItems="center"
                  style={{
                    paddingTop: '12px',
                    borderTop: '1px solid var(--base-color-4)',
                    opacity: 0,
                    animation: 'fadeIn 0.4s ease forwards',
                    animationDelay: '300ms',
                  }}
                >
                  <Text size="1" color="muted">
                    {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
                  </Text>
                </Row>
              </Column>
            </Panel>

            <Panel style={{ flex: 1 }}>
              <PreviewPanel website={selectedWebsite} />
            </Panel>
          </Row>
        </Column>
      </PageBody>
    </>
  );
}
