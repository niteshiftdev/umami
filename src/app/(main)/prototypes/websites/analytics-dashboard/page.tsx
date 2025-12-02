'use client';

import { Column, Row, Text, Heading, Icon, Box } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { Empty } from '@/components/common/Empty';
import { Eye, Settings, TrendingUp, Users, MousePointer, Plus, Star } from '@/components/icons';

// Realistic mock data for the analytics dashboard
const mockWebsites = [
  {
    id: 'ws-001-primary',
    name: 'Acme Corp',
    domain: 'acmecorp.com',
    createdAt: '2024-03-15T10:30:00Z',
    metrics: {
      views: 12453,
      visitors: 3891,
      bounceRate: 42.3,
      avgDuration: 185,
    },
  },
  {
    id: 'ws-002',
    name: 'Tech Blog',
    domain: 'blog.acmecorp.com',
    createdAt: '2024-05-22T14:15:00Z',
  },
  {
    id: 'ws-003',
    name: 'Developer Docs',
    domain: 'docs.acmecorp.com',
    createdAt: '2024-06-10T09:00:00Z',
  },
  {
    id: 'ws-004',
    name: 'Support Portal',
    domain: 'support.acmecorp.com',
    createdAt: '2024-08-03T16:45:00Z',
  },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export default function AnalyticsDashboardPage() {
  const primaryWebsite = mockWebsites[0];
  const otherWebsites = mockWebsites.slice(1);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <LinkButton href="#" variant="primary">
            <Icon>
              <Plus />
            </Icon>
            <Text>Add Website</Text>
          </LinkButton>
        </PageHeader>

        {/* Hero Section - Primary Website */}
        <Column gap="4" style={{ animation: 'fadeIn 0.4s ease-out' }}>
          <SectionHeader title="Primary Website" icon={<Star />} />
          <Panel>
            <Column gap="6">
              {/* Website Header */}
              <Row gap="4" alignItems="center" justifyContent="space-between" wrap="wrap">
                <Row gap="4" alignItems="center">
                  <Box
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 'var(--border-radius-3)',
                      backgroundColor: 'var(--base-color-3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <Favicon domain={primaryWebsite.domain} style={{ width: 32, height: 32 }} />
                  </Box>
                  <Column gap="1">
                    <Heading size="4">{primaryWebsite.name}</Heading>
                    <Text color="muted" size="2">
                      {primaryWebsite.domain}
                    </Text>
                  </Column>
                </Row>
                <Row gap="3">
                  <LinkButton href={`/websites/${primaryWebsite.id}`} variant="primary">
                    <Icon>
                      <Eye />
                    </Icon>
                    <Text>View Dashboard</Text>
                  </LinkButton>
                  <LinkButton href={`/settings/websites/${primaryWebsite.id}`} variant="quiet">
                    <Icon>
                      <Settings />
                    </Icon>
                    <Text>Settings</Text>
                  </LinkButton>
                </Row>
              </Row>

              {/* Metrics Grid */}
              <MetricsBar>
                <MetricCard
                  value={primaryWebsite.metrics.views}
                  label="Page Views"
                  showLabel
                  showChange
                  change={1842}
                />
                <MetricCard
                  value={primaryWebsite.metrics.visitors}
                  label="Unique Visitors"
                  showLabel
                  showChange
                  change={567}
                />
                <MetricCard
                  value={primaryWebsite.metrics.bounceRate}
                  label="Bounce Rate"
                  showLabel
                  formatValue={formatPercentage}
                  reverseColors
                />
                <MetricCard
                  value={primaryWebsite.metrics.avgDuration}
                  label="Avg. Duration"
                  showLabel
                  formatValue={formatDuration}
                />
              </MetricsBar>
            </Column>
          </Panel>
        </Column>

        {/* Other Websites Section */}
        <Column gap="4" style={{ animation: 'fadeIn 0.4s ease-out 0.15s backwards' }}>
          <SectionHeader
            title="Other Websites"
            description={`${otherWebsites.length} sites`}
            icon={<TrendingUp />}
          />
          <Panel>
            {otherWebsites.length === 0 ? (
              <Empty message="No other websites configured" />
            ) : (
              <Column gap="0">
                {otherWebsites.map((website, index) => (
                  <Row
                    key={website.id}
                    alignItems="center"
                    justifyContent="space-between"
                    paddingY="4"
                    paddingX="2"
                    style={{
                      borderBottom:
                        index < otherWebsites.length - 1 ? '1px solid var(--base-color-4)' : 'none',
                      animation: `fadeIn 0.3s ease-out ${0.2 + index * 0.08}s backwards`,
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <Row gap="4" alignItems="center">
                      <Box
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 'var(--border-radius-2)',
                          backgroundColor: 'var(--base-color-3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Favicon domain={website.domain} style={{ width: 20, height: 20 }} />
                      </Box>
                      <Column gap="1">
                        <Text weight="semibold">{website.name}</Text>
                        <Text color="muted" size="1">
                          {website.domain}
                        </Text>
                      </Column>
                    </Row>
                    <LinkButton href={`/websites/${website.id}`} variant="quiet" size="sm">
                      <Icon>
                        <Eye />
                      </Icon>
                      <Text>View</Text>
                    </LinkButton>
                  </Row>
                ))}
              </Column>
            )}
          </Panel>
        </Column>

        {/* Quick Stats Footer */}
        <Row
          gap="6"
          justifyContent="center"
          paddingY="4"
          style={{ animation: 'fadeIn 0.4s ease-out 0.4s backwards' }}
        >
          <Row gap="2" alignItems="center">
            <Icon size="sm" color="muted">
              <TrendingUp />
            </Icon>
            <Text color="muted" size="1">
              {mockWebsites.length} websites tracked
            </Text>
          </Row>
          <Row gap="2" alignItems="center">
            <Icon size="sm" color="muted">
              <Users />
            </Icon>
            <Text color="muted" size="1">
              4,458 total visitors today
            </Text>
          </Row>
          <Row gap="2" alignItems="center">
            <Icon size="sm" color="muted">
              <MousePointer />
            </Icon>
            <Text color="muted" size="1">
              14,891 total page views
            </Text>
          </Row>
        </Row>
      </Column>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </PageBody>
  );
}
