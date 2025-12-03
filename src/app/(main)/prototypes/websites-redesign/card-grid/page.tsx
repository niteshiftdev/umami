'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  SearchField,
  Loading,
} from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Favicon } from '@/components/common/Favicon';
import { Empty } from '@/components/common/Empty';
import { Globe, Calendar, ExternalLink, TrendingUp, Users, Eye } from '@/components/icons';
import styles from './page.module.css';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  teamId?: string;
  shareId?: string;
}

// Realistic sample data for prototype
const sampleWebsites: Website[] = [
  {
    id: 'w1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    createdAt: '2024-01-15T10:30:00Z',
    teamId: 't1',
  },
  {
    id: 'w2',
    name: 'Developer Blog',
    domain: 'devblog.io',
    createdAt: '2024-02-22T14:45:00Z',
    shareId: 'share123',
  },
  {
    id: 'w3',
    name: 'E-Commerce Store',
    domain: 'shop.techmart.com',
    createdAt: '2024-03-10T09:15:00Z',
    teamId: 't2',
  },
  {
    id: 'w4',
    name: 'Marketing Landing',
    domain: 'launch.startup.io',
    createdAt: '2024-04-05T16:20:00Z',
  },
  {
    id: 'w5',
    name: 'Documentation Portal',
    domain: 'docs.openapi.dev',
    createdAt: '2024-05-18T11:00:00Z',
    teamId: 't1',
    shareId: 'docshare',
  },
  {
    id: 'w6',
    name: 'Analytics Dashboard',
    domain: 'analytics.datawise.co',
    createdAt: '2024-06-01T08:30:00Z',
    teamId: 't3',
  },
  {
    id: 'w7',
    name: 'Community Forum',
    domain: 'community.devhub.net',
    createdAt: '2024-07-12T13:45:00Z',
  },
  {
    id: 'w8',
    name: 'SaaS Platform',
    domain: 'app.cloudflow.io',
    createdAt: '2024-08-20T10:00:00Z',
    teamId: 't2',
  },
  {
    id: 'w9',
    name: 'Portfolio Site',
    domain: 'design.janesmith.me',
    createdAt: '2024-09-08T15:30:00Z',
    shareId: 'portfolio',
  },
];

// Simulated metrics for visual interest
const sampleMetrics: Record<string, { views: number; visitors: number; trend: number }> = {
  w1: { views: 145892, visitors: 42567, trend: 12.5 },
  w2: { views: 28934, visitors: 8923, trend: 8.2 },
  w3: { views: 89234, visitors: 31245, trend: -2.1 },
  w4: { views: 12456, visitors: 5678, trend: 45.3 },
  w5: { views: 67890, visitors: 23456, trend: 5.7 },
  w6: { views: 34567, visitors: 12890, trend: 18.9 },
  w7: { views: 56789, visitors: 19234, trend: -0.8 },
  w8: { views: 178234, visitors: 56789, trend: 22.4 },
  w9: { views: 8923, visitors: 3456, trend: 31.2 },
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function WebsiteCard({ website, index }: { website: Website; index: number }) {
  const metrics = sampleMetrics[website.id];
  const trendPositive = metrics?.trend >= 0;

  return (
    <Link
      href={`/websites/${website.id}`}
      className={styles.card}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.faviconWrapper}>
          <Favicon domain={website.domain} />
          <div className={styles.faviconFallback}>
            <Globe size={20} />
          </div>
        </div>
        <div className={styles.headerInfo}>
          <Text weight="600" size="4" className={styles.siteName}>
            {website.name}
          </Text>
          <Row alignItems="center" gap="1">
            <Text color="muted" size="2" className={styles.domain}>
              {website.domain}
            </Text>
            <ExternalLink size={12} className={styles.externalIcon} />
          </Row>
        </div>
      </div>

      <div className={styles.metricsRow}>
        <div className={styles.metric}>
          <Eye size={14} className={styles.metricIcon} />
          <span className={styles.metricValue}>{formatNumber(metrics?.views || 0)}</span>
          <span className={styles.metricLabel}>views</span>
        </div>
        <div className={styles.metric}>
          <Users size={14} className={styles.metricIcon} />
          <span className={styles.metricValue}>{formatNumber(metrics?.visitors || 0)}</span>
          <span className={styles.metricLabel}>visitors</span>
        </div>
        <div className={`${styles.trend} ${trendPositive ? styles.trendUp : styles.trendDown}`}>
          <TrendingUp size={14} style={{ transform: trendPositive ? 'none' : 'rotate(180deg)' }} />
          <span>{Math.abs(metrics?.trend || 0).toFixed(1)}%</span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <Row alignItems="center" gap="2">
          <Calendar size={12} />
          <Text size="1" color="muted">
            Added {formatDate(website.createdAt)}
          </Text>
        </Row>
        {website.teamId && (
          <div className={styles.badge}>Team</div>
        )}
        {website.shareId && (
          <div className={`${styles.badge} ${styles.badgeShared}`}>Shared</div>
        )}
      </div>
    </Link>
  );
}

export default function WebsitesCardGridPage() {
  const [search, setSearch] = useState('');
  const [isLoading] = useState(false);

  const filteredWebsites = useMemo(() => {
    if (!search.trim()) return sampleWebsites;
    const query = search.toLowerCase();
    return sampleWebsites.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.domain.toLowerCase().includes(query)
    );
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <PageBody>
      <Column gap="6">
        <PageHeader title="Websites" description="Manage and monitor your tracked websites">
          <Link href="/websites/add" className={styles.addButton}>
            <span className={styles.addIcon}>+</span>
            Add Website
          </Link>
        </PageHeader>

        <Row alignItems="center" justifyContent="space-between" gap="4" wrap="wrap">
          <SearchField
            value={search}
            onSearch={handleSearch}
            placeholder="Search websites..."
            delay={300}
          />
          <Text color="muted" size="2">
            {filteredWebsites.length} website{filteredWebsites.length !== 1 ? 's' : ''}
          </Text>
        </Row>

        {isLoading ? (
          <Column alignItems="center" justifyContent="center" minHeight="400px">
            <Loading placement="center" />
          </Column>
        ) : filteredWebsites.length === 0 ? (
          <Empty message={search ? 'No websites match your search' : 'No websites found'} />
        ) : (
          <div className={styles.grid}>
            {filteredWebsites.map((website, index) => (
              <WebsiteCard key={website.id} website={website} index={index} />
            ))}
          </div>
        )}
      </Column>
    </PageBody>
  );
}
