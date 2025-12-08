'use client';

import { useMemo } from 'react';
import { Row, Column, Text, Icon, Button, Grid } from '@umami/react-zen';
import { BarChart2, ExternalLink, Globe, Settings, TrendingUp, Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { MetricCard } from '@/components/metrics/MetricCard';
import { useUserWebsitesQuery, useMessages } from '@/components/hooks';

interface Website {
  id: string;
  name: string;
  domain: string | null;
  teamId: string | null;
}

// Sample data for demonstration
const sampleWebsites: Website[] = [
  { id: '1', name: 'Acme Commerce', domain: 'acme-commerce.com', teamId: null },
  { id: '2', name: 'Developer Blog', domain: 'devblog.io', teamId: null },
  { id: '3', name: 'Product Docs', domain: 'docs.acme-commerce.com', teamId: null },
  { id: '4', name: 'Marketing Site', domain: 'marketing.acme.co', teamId: null },
  { id: '5', name: 'Community Forum', domain: 'community.acme.co', teamId: null },
];

// Mock stats for the featured website
const featuredStats = {
  views: 124892,
  visitors: 45231,
  bounceRate: 42.3,
  avgDuration: 185,
};

// Mock mini stats for other websites
const getWebsiteStats = (id: string) => {
  const stats: Record<string, { views: number; visitors: number }> = {
    '2': { views: 8420, visitors: 3210 },
    '3': { views: 15780, visitors: 5940 },
    '4': { views: 6320, visitors: 2180 },
    '5': { views: 3240, visitors: 1120 },
  };
  return stats[id] || { views: Math.floor(Math.random() * 10000), visitors: Math.floor(Math.random() * 5000) };
};

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function DashboardOverviewPage() {
  const { formatMessage, labels, messages } = useMessages();
  const { data, isLoading, error } = useUserWebsitesQuery({});

  const websites = useMemo(() => {
    const fetchedWebsites = data?.data || [];
    return fetchedWebsites.length > 0 ? fetchedWebsites : sampleWebsites;
  }, [data]);

  const featuredWebsite = websites[0];
  const otherWebsites = websites.slice(1);

  return (
    <PageBody isLoading={isLoading} error={error}>
      <Column gap="6">
        <PageHeader title="Websites Overview" icon={<Globe />}>
          <LinkButton href="/websites/add" variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>{formatMessage(labels.addWebsite)}</Text>
          </LinkButton>
        </PageHeader>

        {websites.length === 0 ? (
          <Panel>
            <Column alignItems="center" justifyContent="center" gap="4" paddingY="12">
              <Icon size="lg" color="muted">
                <Globe />
              </Icon>
              <Text color="muted">{formatMessage(messages.noWebsitesConfigured)}</Text>
              <LinkButton href="/websites/add" variant="primary">
                {formatMessage(labels.addWebsite)}
              </LinkButton>
            </Column>
          </Panel>
        ) : (
          <>
            {/* Featured Website Section */}
            <Panel
              style={{
                background: 'linear-gradient(135deg, var(--base-color-2) 0%, var(--base-color-1) 100%)',
                animation: 'fadeSlideIn 0.4s ease-out',
              }}
            >
              <Column gap="6">
                {/* Featured Header */}
                <Row alignItems="center" justifyContent="space-between">
                  <Row alignItems="center" gap="4">
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 'var(--border-radius-3)',
                        backgroundColor: 'var(--base-color-1)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      {featuredWebsite.domain ? (
                        <Favicon
                          domain={featuredWebsite.domain}
                          style={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <Icon size="lg" color="muted">
                          <Globe />
                        </Icon>
                      )}
                    </div>
                    <Column gap="1">
                      <Text size="6" weight="bold">
                        {featuredWebsite.name}
                      </Text>
                      <Row alignItems="center" gap="2">
                        <Text size="2" color="muted">
                          {featuredWebsite.domain || 'No domain'}
                        </Text>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: 'var(--success-color)',
                            animation: 'pulse 2s infinite',
                          }}
                        />
                        <Text size="1" color="muted" style={{ color: 'var(--success-color)' }}>
                          Active
                        </Text>
                      </Row>
                    </Column>
                  </Row>
                  <Row gap="2">
                    <LinkButton
                      href={`/websites/${featuredWebsite.id}/settings`}
                      variant="secondary"
                    >
                      <Icon>
                        <Settings />
                      </Icon>
                      <Text>{formatMessage(labels.settings)}</Text>
                    </LinkButton>
                    <LinkButton href={`/websites/${featuredWebsite.id}`} variant="primary">
                      <Icon>
                        <BarChart2 />
                      </Icon>
                      <Text>View Analytics</Text>
                    </LinkButton>
                  </Row>
                </Row>

                {/* Stats Grid */}
                <Grid
                  columns={{ xs: '2', md: '4' }}
                  gap="4"
                  style={{
                    animation: 'fadeSlideIn 0.5s ease-out 0.1s both',
                  }}
                >
                  <MetricCard
                    value={featuredStats.views}
                    label={formatMessage(labels.pageViews)}
                    valueSize="6"
                    labelSize="1"
                  />
                  <MetricCard
                    value={featuredStats.visitors}
                    label={formatMessage(labels.visitors)}
                    valueSize="6"
                    labelSize="1"
                  />
                  <MetricCard
                    value={featuredStats.bounceRate}
                    label={formatMessage(labels.bounceRate)}
                    formatValue={formatPercent}
                    valueSize="6"
                    labelSize="1"
                  />
                  <MetricCard
                    value={featuredStats.avgDuration}
                    label={formatMessage(labels.visitDuration)}
                    formatValue={formatDuration}
                    valueSize="6"
                    labelSize="1"
                  />
                </Grid>

                {/* Quick Trends Indicator */}
                <Row
                  alignItems="center"
                  gap="3"
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    backgroundColor: 'var(--base-color-1)',
                    borderRadius: 'var(--border-radius-2)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <Icon size="sm" style={{ color: 'var(--success-color)' }}>
                    <TrendingUp />
                  </Icon>
                  <Text size="2" color="muted">
                    <Text as="span" weight="medium" style={{ color: 'var(--success-color)' }}>
                      +12.4%
                    </Text>{' '}
                    more visitors compared to last week
                  </Text>
                </Row>
              </Column>
            </Panel>

            {/* Other Websites Section */}
            {otherWebsites.length > 0 && (
              <Column gap="4" style={{ animation: 'fadeSlideIn 0.5s ease-out 0.2s both' }}>
                <Row alignItems="center" justifyContent="space-between">
                  <Text size="4" weight="bold">
                    Other Websites
                  </Text>
                  <Text size="2" color="muted">
                    {otherWebsites.length} {otherWebsites.length === 1 ? 'website' : 'websites'}
                  </Text>
                </Row>

                <Column gap="2">
                  {otherWebsites.map((website, index) => {
                    const stats = getWebsiteStats(website.id);
                    return (
                      <Panel
                        key={website.id}
                        style={{
                          padding: 'var(--spacing-4) var(--spacing-5)',
                          animation: `fadeSlideIn 0.4s ease-out ${0.3 + index * 0.05}s both`,
                          transition: 'background-color 0.15s ease, transform 0.15s ease',
                        }}
                        className="website-row"
                      >
                        <Row alignItems="center" justifyContent="space-between">
                          <Row alignItems="center" gap="4" style={{ flex: 1 }}>
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 'var(--border-radius-2)',
                                backgroundColor: 'var(--base-color-2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {website.domain ? (
                                <Favicon domain={website.domain} />
                              ) : (
                                <Icon size="sm" color="muted">
                                  <Globe />
                                </Icon>
                              )}
                            </div>
                            <Column gap="0">
                              <Text weight="medium">{website.name}</Text>
                              <Text size="1" color="muted">
                                {website.domain || 'No domain'}
                              </Text>
                            </Column>
                          </Row>

                          {/* Compact Stats */}
                          <Row alignItems="center" gap="6" style={{ marginRight: 'var(--spacing-6)' }}>
                            <Column alignItems="flex-end" gap="0">
                              <Text size="3" weight="medium">
                                {stats.views.toLocaleString()}
                              </Text>
                              <Text size="1" color="muted">
                                views
                              </Text>
                            </Column>
                            <Column alignItems="flex-end" gap="0">
                              <Text size="3" weight="medium">
                                {stats.visitors.toLocaleString()}
                              </Text>
                              <Text size="1" color="muted">
                                visitors
                              </Text>
                            </Column>
                          </Row>

                          {/* Actions */}
                          <Row gap="2">
                            <LinkButton
                              href={`/websites/${website.id}`}
                              variant="quiet"
                              size="sm"
                            >
                              <Icon size="sm">
                                <BarChart2 />
                              </Icon>
                            </LinkButton>
                            {website.domain && (
                              <Button
                                variant="quiet"
                                size="sm"
                                onPress={() => window.open(`https://${website.domain}`, '_blank')}
                              >
                                <Icon size="sm">
                                  <ExternalLink />
                                </Icon>
                              </Button>
                            )}
                          </Row>
                        </Row>
                      </Panel>
                    );
                  })}
                </Column>
              </Column>
            )}
          </>
        )}
      </Column>

      <style>{`
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .website-row:hover {
          background-color: var(--base-color-2) !important;
        }
      `}</style>
    </PageBody>
  );
}
