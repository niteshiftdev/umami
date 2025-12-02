'use client';

import { Column, Row, Grid, Heading, Text, Icon, Button, Loading } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { Empty } from '@/components/common/Empty';
import { useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { ArrowRight, Users, Eye, BarChart3, TrendingUp, TrendingDown, ExternalLink } from '@/components/icons';

// Mock stats data for demonstration
const MOCK_STATS: Record<string, {
  visitors: number;
  pageviews: number;
  bounceRate: number;
  avgDuration: string;
  visitorsChange: number;
  pageviewsChange: number;
  bounceRateChange: number;
  todayVisitors: string;
}> = {
  default: {
    visitors: 12847,
    pageviews: 45231,
    bounceRate: 42,
    avgDuration: '2m 34s',
    visitorsChange: 12.4,
    pageviewsChange: 8.7,
    bounceRateChange: -3.2,
    todayVisitors: '1.2k',
  },
  secondary: {
    visitors: 4521,
    pageviews: 18432,
    bounceRate: 38,
    avgDuration: '3m 12s',
    visitorsChange: 5.2,
    pageviewsChange: -2.1,
    bounceRateChange: 1.8,
    todayVisitors: '892',
  },
  tertiary: {
    visitors: 2134,
    pageviews: 7821,
    bounceRate: 55,
    avgDuration: '1m 48s',
    visitorsChange: -4.3,
    pageviewsChange: 3.9,
    bounceRateChange: 6.1,
    todayVisitors: '421',
  },
};

// Sample websites for when no real data is available
const SAMPLE_WEBSITES = [
  { id: '1', name: 'Acme Corp', domain: 'acme-corp.com', createdAt: new Date('2024-01-15') },
  { id: '2', name: 'TechStart Blog', domain: 'techstart.io', createdAt: new Date('2024-03-22') },
  { id: '3', name: 'Creative Studio', domain: 'creativestudio.design', createdAt: new Date('2024-02-10') },
  { id: '4', name: 'E-Shop Plus', domain: 'eshopplus.store', createdAt: new Date('2024-04-05') },
  { id: '5', name: 'Dev Portal', domain: 'devportal.dev', createdAt: new Date('2024-05-18') },
];

function StatCard({
  label,
  value,
  change,
  icon,
  reverseColors = false,
  delay = 0,
}: {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  reverseColors?: boolean;
  delay?: number;
}) {
  const isPositive = reverseColors ? change < 0 : change >= 0;
  const changeColor = isPositive ? 'var(--success-color)' : 'var(--danger-color)';
  const changeBackground = isPositive
    ? 'color-mix(in srgb, var(--success-color), var(--background-color) 92%)'
    : 'color-mix(in srgb, var(--danger-color), var(--background-color) 92%)';

  return (
    <Column
      gap="2"
      style={{
        animation: `fadeSlideIn 0.5s ease-out ${delay}ms both`,
      }}
    >
      <Row alignItems="center" gap="2">
        <Icon size="sm" color="muted">
          {icon}
        </Icon>
        <Text color="muted" size="2">
          {label}
        </Text>
      </Row>
      <Row alignItems="baseline" gap="3">
        <Text weight="bold" style={{ fontSize: 'var(--heading-size-3)' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <Row
          alignItems="center"
          gap="1"
          paddingX="2"
          paddingY="1"
          style={{
            background: changeBackground,
            color: changeColor,
            borderRadius: 'var(--border-radius-2)',
          }}
        >
          <Icon size="xs">
            {change >= 0 ? <TrendingUp /> : <TrendingDown />}
          </Icon>
          <Text size="1" style={{ color: 'inherit' }}>
            {change >= 0 ? '+' : ''}{change}%
          </Text>
        </Row>
      </Row>
    </Column>
  );
}

function HeroWebsite({
  website,
  renderUrl,
}: {
  website: { id: string; name: string; domain: string };
  renderUrl: (path: string, params?: Record<string, string | number> | false) => string;
}) {
  const stats = MOCK_STATS.default;

  return (
    <Panel
      style={{
        background: 'linear-gradient(135deg, var(--background-color-2) 0%, var(--background-color-1) 100%)',
        animation: 'fadeSlideIn 0.4s ease-out both',
      }}
    >
      <Column gap="6">
        {/* Header */}
        <Row justifyContent="space-between" alignItems="flex-start">
          <Row alignItems="center" gap="4">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--border-radius-3)',
                background: 'var(--background-color-1)',
                border: '1px solid var(--border-color-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Favicon domain={website.domain} style={{ width: 32, height: 32 }} />
            </div>
            <Column gap="1">
              <Row alignItems="center" gap="2">
                <Heading size="3">{website.name}</Heading>
                <div
                  style={{
                    padding: '2px 8px',
                    background: 'color-mix(in srgb, var(--primary-color), var(--background-color) 85%)',
                    color: 'var(--primary-color)',
                    borderRadius: 'var(--border-radius-2)',
                    fontSize: 'var(--font-size-1)',
                    fontWeight: 500,
                  }}
                >
                  Primary
                </div>
              </Row>
              <Text color="muted">{website.domain}</Text>
            </Column>
          </Row>
          <LinkButton href={renderUrl(`/websites/${website.id}`, false)} variant="primary">
            <Row alignItems="center" gap="2">
              View Dashboard
              <Icon size="sm">
                <ArrowRight />
              </Icon>
            </Row>
          </LinkButton>
        </Row>

        {/* Stats Grid */}
        <Grid columns={{ xs: '2', md: '4' }} gap="6">
          <StatCard
            label="Visitors"
            value={stats.visitors}
            change={stats.visitorsChange}
            icon={<Users />}
            delay={100}
          />
          <StatCard
            label="Pageviews"
            value={stats.pageviews}
            change={stats.pageviewsChange}
            icon={<Eye />}
            delay={150}
          />
          <StatCard
            label="Bounce Rate"
            value={`${stats.bounceRate}%`}
            change={stats.bounceRateChange}
            icon={<BarChart3 />}
            reverseColors
            delay={200}
          />
          <StatCard
            label="Avg. Duration"
            value={stats.avgDuration}
            change={8.3}
            icon={<TrendingUp />}
            delay={250}
          />
        </Grid>

        {/* Quick Stats Bar */}
        <Row
          paddingY="3"
          paddingX="4"
          gap="6"
          style={{
            background: 'var(--background-color-1)',
            borderRadius: 'var(--border-radius-2)',
            borderTop: '1px solid var(--border-color-1)',
          }}
        >
          <Text color="muted" size="2">
            Last 30 days
          </Text>
          <Text size="2">
            <Text weight="medium" style={{ color: 'var(--font-color)' }}>247</Text>{' '}
            <Text color="muted">unique pages</Text>
          </Text>
          <Text size="2">
            <Text weight="medium" style={{ color: 'var(--font-color)' }}>18</Text>{' '}
            <Text color="muted">countries</Text>
          </Text>
          <Text size="2">
            <Text weight="medium" style={{ color: 'var(--font-color)' }}>4.2k</Text>{' '}
            <Text color="muted">events tracked</Text>
          </Text>
        </Row>
      </Column>
    </Panel>
  );
}

function WebsiteCard({
  website,
  renderUrl,
  index,
}: {
  website: { id: string; name: string; domain: string };
  renderUrl: (path: string, params?: Record<string, string | number> | false) => string;
  index: number;
}) {
  const statsVariants = [MOCK_STATS.secondary, MOCK_STATS.tertiary];
  const stats = statsVariants[index % 2];
  const isPositive = stats.visitorsChange >= 0;

  return (
    <Panel
      style={{
        animation: `fadeSlideIn 0.4s ease-out ${300 + index * 80}ms both`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      className="website-card"
    >
      <Column gap="4" height="100%">
        <Row justifyContent="space-between" alignItems="flex-start">
          <Row alignItems="center" gap="3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--border-radius-2)',
                background: 'var(--background-color-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Favicon domain={website.domain} style={{ width: 20, height: 20 }} />
            </div>
            <Column gap="0">
              <Text weight="medium">{website.name}</Text>
              <Text color="muted" size="1">
                {website.domain}
              </Text>
            </Column>
          </Row>
          <LinkButton
            href={renderUrl(`/websites/${website.id}`, false)}
            variant="quiet"
            size="sm"
          >
            <Icon size="sm">
              <ExternalLink />
            </Icon>
          </LinkButton>
        </Row>

        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingTop="2"
          style={{ borderTop: '1px solid var(--border-color-1)', marginTop: 'auto' }}
        >
          <Row alignItems="baseline" gap="2">
            <Text weight="bold" size="4">
              {stats.todayVisitors}
            </Text>
            <Text color="muted" size="1">
              visitors today
            </Text>
          </Row>
          <Row
            alignItems="center"
            gap="1"
            paddingX="2"
            paddingY="1"
            style={{
              background: isPositive
                ? 'color-mix(in srgb, var(--success-color), var(--background-color) 92%)'
                : 'color-mix(in srgb, var(--danger-color), var(--background-color) 92%)',
              color: isPositive ? 'var(--success-color)' : 'var(--danger-color)',
              borderRadius: 'var(--border-radius-2)',
            }}
          >
            <Icon size="xs">
              {isPositive ? <TrendingUp /> : <TrendingDown />}
            </Icon>
            <Text size="1" style={{ color: 'inherit' }}>
              {isPositive ? '+' : ''}{stats.visitorsChange}%
            </Text>
          </Row>
        </Row>
      </Column>
    </Panel>
  );
}

export default function StatsOverviewPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId, renderUrl } = useNavigation();
  const { data, isLoading, error } = useUserWebsitesQuery({ teamId });

  // Use real data if available, otherwise use sample data
  const websites = data?.data?.length ? data.data : SAMPLE_WEBSITES;
  const heroWebsite = websites[0];
  const otherWebsites = websites.slice(1);

  return (
    <PageBody isLoading={isLoading} error={error}>
      <style>{`
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

        .website-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px color-mix(in srgb, var(--font-color), transparent 92%);
        }
      `}</style>

      <Column gap="6">
        <PageHeader title={formatMessage(labels.websites) || 'Websites'} />

        {websites.length === 0 ? (
          <Panel>
            <Empty message="No websites found. Add your first website to get started." />
          </Panel>
        ) : (
          <>
            {/* Hero Section */}
            <HeroWebsite website={heroWebsite} renderUrl={renderUrl} />

            {/* Other Websites Grid */}
            {otherWebsites.length > 0 && (
              <Column gap="4">
                <Row alignItems="center" gap="2">
                  <Heading size="2">Other Websites</Heading>
                  <Text color="muted" size="2">
                    ({otherWebsites.length})
                  </Text>
                </Row>
                <Grid columns={{ xs: '1', sm: '2', lg: '3' }} gap="4">
                  {otherWebsites.map((website, index) => (
                    <WebsiteCard
                      key={website.id}
                      website={website}
                      renderUrl={renderUrl}
                      index={index}
                    />
                  ))}
                </Grid>
              </Column>
            )}
          </>
        )}
      </Column>
    </PageBody>
  );
}
