'use client';

import { Column, Row, Text, Heading, Icon, Button } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { LinkButton } from '@/components/common/LinkButton';
import { Favicon } from '@/components/common/Favicon';
import { Settings, BarChart3, Globe, ChevronRight, Star, TrendingUp, Users, Clock } from '@/components/icons';
import styles from './page.module.css';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: Date;
  pageviews?: number;
  visitors?: number;
  trending?: boolean;
}

const sampleWebsites: Website[] = [
  {
    id: '1',
    name: 'Marketing Site',
    domain: 'marketing.example.com',
    createdAt: new Date('2024-01-15'),
    pageviews: 145283,
    visitors: 42891,
    trending: true,
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'shop.example.com',
    createdAt: new Date('2024-02-20'),
    pageviews: 89421,
    visitors: 28103,
  },
  {
    id: '3',
    name: 'Developer Blog',
    domain: 'blog.dev.io',
    createdAt: new Date('2024-03-10'),
    pageviews: 34567,
    visitors: 12453,
  },
  {
    id: '4',
    name: 'Customer Portal',
    domain: 'portal.company.com',
    createdAt: new Date('2024-04-05'),
    pageviews: 23891,
    visitors: 8742,
  },
  {
    id: '5',
    name: 'Documentation',
    domain: 'docs.example.com',
    createdAt: new Date('2024-05-18'),
    pageviews: 67234,
    visitors: 19876,
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

function HeroCard({ website }: { website: Website }) {
  return (
    <div className={styles.heroCard}>
      <div className={styles.heroGlow} />
      <div className={styles.heroContent}>
        <Row alignItems="flex-start" justifyContent="space-between" gap="6">
          <Column gap="5" style={{ flex: 1 }}>
            <Row alignItems="center" gap="3">
              <div className={styles.heroFavicon}>
                <Favicon domain={website.domain} width={32} height={32} />
              </div>
              <div className={styles.heroBadge}>
                <Icon size="xs">
                  <Star />
                </Icon>
                <span>Primary</span>
              </div>
            </Row>

            <Column gap="2">
              <Heading size="5" className={styles.heroTitle}>
                {website.name}
              </Heading>
              <Row alignItems="center" gap="2">
                <Icon size="sm" color="muted">
                  <Globe />
                </Icon>
                <Text color="muted" size="2">
                  {website.domain}
                </Text>
              </Row>
            </Column>

            <Row gap="6" className={styles.heroStats}>
              <Column gap="1">
                <Row alignItems="center" gap="2">
                  <Icon size="sm" style={{ color: 'var(--primary-color)' }}>
                    <BarChart3 />
                  </Icon>
                  <Text size="4" weight="semi-bold">
                    {formatNumber(website.pageviews || 0)}
                  </Text>
                </Row>
                <Text size="1" color="muted">
                  Pageviews
                </Text>
              </Column>
              <Column gap="1">
                <Row alignItems="center" gap="2">
                  <Icon size="sm" style={{ color: 'var(--color-success)' }}>
                    <Users />
                  </Icon>
                  <Text size="4" weight="semi-bold">
                    {formatNumber(website.visitors || 0)}
                  </Text>
                </Row>
                <Text size="1" color="muted">
                  Visitors
                </Text>
              </Column>
              {website.trending && (
                <Column gap="1">
                  <Row alignItems="center" gap="2">
                    <Icon size="sm" style={{ color: 'var(--color-warning)' }}>
                      <TrendingUp />
                    </Icon>
                    <Text size="4" weight="semi-bold" style={{ color: 'var(--color-warning)' }}>
                      +12.4%
                    </Text>
                  </Row>
                  <Text size="1" color="muted">
                    vs last week
                  </Text>
                </Column>
              )}
            </Row>
          </Column>

          <Column gap="3" alignItems="flex-end">
            <LinkButton href={`/websites/${website.id}`} variant="primary" size="lg">
              <Icon>
                <BarChart3 />
              </Icon>
              View Analytics
            </LinkButton>
            <LinkButton href={`/websites/${website.id}/settings`} variant="quiet">
              <Icon>
                <Settings />
              </Icon>
              Settings
            </LinkButton>
          </Column>
        </Row>
      </div>
    </div>
  );
}

function WebsiteListItem({ website, index }: { website: Website; index: number }) {
  return (
    <div
      className={styles.listItem}
      style={{ animationDelay: `${(index + 1) * 100}ms` }}
    >
      <Row alignItems="center" justifyContent="space-between" gap="4">
        <Row alignItems="center" gap="4" style={{ flex: 1 }}>
          <div className={styles.listFavicon}>
            <Favicon domain={website.domain} width={20} height={20} />
          </div>
          <Column gap="1" style={{ minWidth: 0 }}>
            <Text weight="medium" className={styles.listItemName}>
              {website.name}
            </Text>
            <Text size="1" color="muted" truncate>
              {website.domain}
            </Text>
          </Column>
        </Row>

        <Row alignItems="center" gap="6">
          <Column alignItems="flex-end" gap="1" className={styles.listStats}>
            <Text size="2" weight="medium">
              {formatNumber(website.pageviews || 0)}
            </Text>
            <Text size="1" color="muted">
              pageviews
            </Text>
          </Column>
          <Column alignItems="flex-end" gap="1" className={styles.listStats}>
            <Text size="2" weight="medium">
              {formatNumber(website.visitors || 0)}
            </Text>
            <Text size="1" color="muted">
              visitors
            </Text>
          </Column>
          <Row gap="2">
            <LinkButton
              href={`/websites/${website.id}`}
              variant="quiet"
              size="sm"
              className={styles.listAction}
            >
              <Icon size="sm">
                <BarChart3 />
              </Icon>
            </LinkButton>
            <LinkButton
              href={`/websites/${website.id}/settings`}
              variant="quiet"
              size="sm"
              className={styles.listAction}
            >
              <Icon size="sm">
                <Settings />
              </Icon>
            </LinkButton>
          </Row>
        </Row>
      </Row>
    </div>
  );
}

export default function FeaturedHeroPage() {
  const websites = sampleWebsites;
  const [heroWebsite, ...otherWebsites] = websites;

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <Button variant="primary">Add website</Button>
        </PageHeader>

        {heroWebsite && <HeroCard website={heroWebsite} />}

        {otherWebsites.length > 0 && (
          <Column gap="4" className={styles.otherSection}>
            <Row alignItems="center" justifyContent="space-between">
              <Row alignItems="center" gap="3">
                <Icon size="sm" color="muted">
                  <Clock />
                </Icon>
                <Text size="2" color="muted" weight="medium">
                  Other Websites
                </Text>
                <span className={styles.countBadge}>{otherWebsites.length}</span>
              </Row>
            </Row>

            <Column gap="0" className={styles.listContainer}>
              {otherWebsites.map((website, index) => (
                <WebsiteListItem key={website.id} website={website} index={index} />
              ))}
            </Column>
          </Column>
        )}
      </Column>
    </PageBody>
  );
}
