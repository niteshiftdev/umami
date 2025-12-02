'use client';

import { useState } from 'react';
import { Row, Column, Text, Button, Icon, SearchField } from '@umami/react-zen';
import { Globe, ExternalLink, Clock, Users, Eye, TrendingUp } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  domain: string;
  pageviews: number;
  sessions: number;
  avgDuration: string;
  bounceRate: number;
  createdAt: string;
}

const sampleWebsites: Website[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    pageviews: 124892,
    sessions: 45231,
    avgDuration: '3m 42s',
    bounceRate: 38.2,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'TechCrunch Blog',
    domain: 'blog.techcrunch.io',
    pageviews: 892341,
    sessions: 234567,
    avgDuration: '2m 18s',
    bounceRate: 52.1,
    createdAt: '2023-11-02',
  },
  {
    id: '3',
    name: 'Startup Weekly',
    domain: 'startupweekly.com',
    pageviews: 56723,
    sessions: 18942,
    avgDuration: '4m 55s',
    bounceRate: 29.8,
    createdAt: '2024-03-20',
  },
  {
    id: '4',
    name: 'Design Systems Hub',
    domain: 'designsystems.io',
    pageviews: 234891,
    sessions: 78234,
    avgDuration: '5m 12s',
    bounceRate: 24.3,
    createdAt: '2023-09-10',
  },
  {
    id: '5',
    name: 'Cloud Metrics',
    domain: 'app.cloudmetrics.dev',
    pageviews: 67832,
    sessions: 23456,
    avgDuration: '6m 08s',
    bounceRate: 18.7,
    createdAt: '2024-02-28',
  },
  {
    id: '6',
    name: 'Nordic E-commerce',
    domain: 'nordic-shop.se',
    pageviews: 456123,
    sessions: 134567,
    avgDuration: '2m 34s',
    bounceRate: 45.6,
    createdAt: '2023-12-05',
  },
  {
    id: '7',
    name: 'Developer Docs',
    domain: 'docs.openapi.org',
    pageviews: 789234,
    sessions: 312456,
    avgDuration: '7m 23s',
    bounceRate: 15.2,
    createdAt: '2023-08-18',
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

function StatBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Column
      gap="1"
      style={{
        padding: 'var(--spacing-4)',
        backgroundColor: 'var(--base-color-2)',
        borderRadius: 'var(--border-radius-3)',
      }}
    >
      <Row gap="2" alignItems="center">
        <Icon size="sm" color="muted">
          {icon}
        </Icon>
        <Text size="1" color="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </Text>
      </Row>
      <Text size="4" weight="semi-bold">
        {value}
      </Text>
    </Column>
  );
}

export default function CompactListPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = sampleWebsites.filter(
    site =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedWebsite = sampleWebsites.find(w => w.id === selectedId);

  return (
    <Column
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--base-color-2)',
        padding: 'var(--spacing-6)',
      }}
    >
      <Column
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          style={{
            paddingBottom: 'var(--spacing-6)',
            marginBottom: 'var(--spacing-6)',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <Column gap="1">
            <Text size="5" weight="semi-bold">
              Websites
            </Text>
            <Text size="2" color="muted">
              {sampleWebsites.length} sites tracked
            </Text>
          </Column>
          <Button variant="primary">Add Website</Button>
        </Row>

        {/* Main Content - Two Panel Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 400px) 1fr',
            gap: 'var(--spacing-5)',
            minHeight: '600px',
          }}
        >
          {/* Left Panel - Compact List */}
          <Column
            style={{
              backgroundColor: 'var(--base-color-1)',
              borderRadius: 'var(--border-radius-3)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
            }}
          >
            {/* Search */}
            <div
              style={{
                padding: 'var(--spacing-4)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search websites..."
                style={{ width: '100%' }}
              />
            </div>

            {/* List */}
            <Column
              style={{
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {filteredWebsites.map((website, index) => (
                <div
                  key={website.id}
                  onClick={() => setSelectedId(website.id)}
                  style={{
                    padding: 'var(--spacing-4)',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor:
                      selectedId === website.id
                        ? 'var(--base-color-3)'
                        : 'transparent',
                    borderLeft:
                      selectedId === website.id
                        ? '3px solid var(--primary-color)'
                        : '3px solid transparent',
                    transition: 'all 0.15s ease',
                    animation: `fadeSlideIn 0.3s ease ${index * 0.05}s both`,
                  }}
                  onMouseEnter={e => {
                    if (selectedId !== website.id) {
                      e.currentTarget.style.backgroundColor = 'var(--highlight-color)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedId !== website.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Row gap="3" alignItems="center">
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--border-radius-2)',
                        backgroundColor: 'var(--base-color-4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`https://icons.duckduckgo.com/ip3/${website.domain}.ico`}
                        width={16}
                        height={16}
                        alt=""
                        style={{ borderRadius: '2px' }}
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML =
                            '<span style="color: var(--font-color-muted); font-size: 14px;">' +
                            website.name.charAt(0).toUpperCase() +
                            '</span>';
                        }}
                      />
                    </div>
                    <Column gap="0" style={{ minWidth: 0, flex: 1 }}>
                      <Text
                        size="2"
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
                    <Text size="1" color="muted" style={{ flexShrink: 0 }}>
                      {formatNumber(website.pageviews)}
                    </Text>
                  </Row>
                </div>
              ))}
            </Column>
          </Column>

          {/* Right Panel - Details */}
          <Column
            style={{
              backgroundColor: 'var(--base-color-1)',
              borderRadius: 'var(--border-radius-3)',
              border: '1px solid var(--border-color)',
              padding: 'var(--spacing-6)',
            }}
          >
            {selectedWebsite ? (
              <Column gap="5" style={{ animation: 'fadeIn 0.2s ease' }}>
                {/* Website Header */}
                <Row gap="4" alignItems="flex-start" justifyContent="space-between">
                  <Row gap="4" alignItems="center">
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: 'var(--border-radius-3)',
                        backgroundColor: 'var(--base-color-3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={`https://icons.duckduckgo.com/ip3/${selectedWebsite.domain}.ico`}
                        width={28}
                        height={28}
                        alt=""
                        style={{ borderRadius: '4px' }}
                        onError={e => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML =
                            '<span style="color: var(--font-color-muted); font-size: 24px; font-weight: 600;">' +
                            selectedWebsite.name.charAt(0).toUpperCase() +
                            '</span>';
                        }}
                      />
                    </div>
                    <Column gap="1">
                      <Text size="4" weight="semi-bold">
                        {selectedWebsite.name}
                      </Text>
                      <Row gap="2" alignItems="center">
                        <Icon size="xs" color="muted">
                          <Globe size={12} />
                        </Icon>
                        <Text size="2" color="muted">
                          {selectedWebsite.domain}
                        </Text>
                      </Row>
                    </Column>
                  </Row>
                  <Button variant="quiet" size="sm">
                    <Icon>
                      <ExternalLink size={16} />
                    </Icon>
                  </Button>
                </Row>

                {/* Stats Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 'var(--spacing-4)',
                  }}
                >
                  <StatBlock
                    icon={<Eye size={14} />}
                    label="Pageviews"
                    value={formatNumber(selectedWebsite.pageviews)}
                  />
                  <StatBlock
                    icon={<Users size={14} />}
                    label="Sessions"
                    value={formatNumber(selectedWebsite.sessions)}
                  />
                  <StatBlock
                    icon={<Clock size={14} />}
                    label="Avg. Duration"
                    value={selectedWebsite.avgDuration}
                  />
                  <StatBlock
                    icon={<TrendingUp size={14} />}
                    label="Bounce Rate"
                    value={`${selectedWebsite.bounceRate}%`}
                  />
                </div>

                {/* Additional Info */}
                <Column
                  gap="3"
                  style={{
                    padding: 'var(--spacing-4)',
                    backgroundColor: 'var(--base-color-2)',
                    borderRadius: 'var(--border-radius-3)',
                  }}
                >
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="2" color="muted">
                      Added on
                    </Text>
                    <Text size="2">
                      {new Date(selectedWebsite.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </Row>
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: 'var(--border-color)',
                    }}
                  />
                  <Row justifyContent="space-between" alignItems="center">
                    <Text size="2" color="muted">
                      Status
                    </Text>
                    <Row gap="2" alignItems="center">
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                        }}
                      />
                      <Text size="2">Active</Text>
                    </Row>
                  </Row>
                </Column>

                {/* Action Button */}
                <Button
                  variant="primary"
                  style={{ marginTop: 'auto' }}
                  onPress={() => {
                    // Placeholder action
                  }}
                >
                  View Dashboard
                </Button>
              </Column>
            ) : (
              <Column
                alignItems="center"
                justifyContent="center"
                style={{ flex: 1, minHeight: '400px' }}
              >
                <Column gap="3" alignItems="center" style={{ maxWidth: '240px', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--border-radius-3)',
                      backgroundColor: 'var(--base-color-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size="lg" color="muted">
                      <Globe size={28} />
                    </Icon>
                  </div>
                  <Text size="3" weight="medium">
                    Select a website
                  </Text>
                  <Text size="2" color="muted">
                    Choose a website from the list to view its details and statistics
                  </Text>
                </Column>
              </Column>
            )}
          </Column>
        </div>
      </Column>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: minmax(280px, 400px) 1fr"] {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr;
          }
        }
      `}</style>
    </Column>
  );
}
