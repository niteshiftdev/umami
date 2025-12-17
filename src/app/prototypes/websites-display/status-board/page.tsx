'use client';

import { useState } from 'react';
import { Column, Row, Text, Grid, Icon, SearchField } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Favicon } from '@/components/common/Favicon';
import { CheckCircle, AlertCircle, XCircle } from '@/components/icons';

const websites = [
  { id: '1', name: 'Acme Analytics', domain: 'analytics.acme.com', status: 'healthy', uptime: '99.9%' },
  { id: '2', name: 'TechCorp Blog', domain: 'blog.techcorp.io', status: 'healthy', uptime: '99.8%' },
  { id: '3', name: 'Startup Hub', domain: 'startuphub.co', status: 'warning', uptime: '98.2%' },
  { id: '4', name: 'E-Commerce Store', domain: 'shop.example.com', status: 'healthy', uptime: '99.95%' },
  { id: '5', name: 'Developer Docs', domain: 'docs.devtools.dev', status: 'error', uptime: '94.1%' },
  { id: '6', name: 'Marketing Site', domain: 'marketing.brand.com', status: 'healthy', uptime: '99.7%' },
];

type WebsiteStatus = 'healthy' | 'warning' | 'error';

const statusConfig = {
  healthy: {
    icon: CheckCircle,
    color: '#22c55e',
    label: 'Healthy',
  },
  warning: {
    icon: AlertCircle,
    color: '#f59e0b',
    label: 'Warning',
  },
  error: {
    icon: XCircle,
    color: '#ef4444',
    label: 'Issues',
  },
};

export default function StatusBoardPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWebsites = websites.filter(
    website =>
      website.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      website.domain.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const groupedWebsites = {
    healthy: filteredWebsites.filter(w => w.status === 'healthy'),
    warning: filteredWebsites.filter(w => w.status === 'warning'),
    error: filteredWebsites.filter(w => w.status === 'error'),
  };

  const renderStatusColumn = (status: WebsiteStatus) => {
    const config = statusConfig[status];
    const StatusIcon = config.icon;
    const sites = groupedWebsites[status];

    return (
      <Column gap="3">
        <Row alignItems="center" gap="2" style={{ color: config.color }}>
          <Icon>
            <StatusIcon />
          </Icon>
          <Text weight="bold">
            {config.label} ({sites.length})
          </Text>
        </Row>
        <Column gap="2">
          {sites.map(website => (
            <Column
              key={website.id}
              paddingY="3"
              paddingX="4"
              border
              borderRadius="2"
              backgroundColor
              gap="2"
              style={{
                borderLeft: `3px solid ${config.color}`,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e: any) => {
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e: any) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <Row alignItems="center" justifyContent="space-between" gap="3">
                <Row alignItems="center" gap="2" style={{ flex: 1, minWidth: 0 }}>
                  <Favicon domain={website.domain} />
                  <Text weight="medium" size="2" truncate>
                    {website.name}
                  </Text>
                </Row>
                <Column
                  paddingX="2"
                  paddingY="1"
                  borderRadius="2"
                  style={{
                    backgroundColor: config.color,
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {website.uptime}
                </Column>
              </Row>
              <Text size="1" color="muted" truncate>
                {website.domain}
              </Text>
            </Column>
          ))}
          {sites.length === 0 && (
            <Column
              paddingY="6"
              paddingX="4"
              border
              borderRadius="2"
              style={{
                borderStyle: 'dashed',
                borderColor: 'var(--gray-a4)',
              }}
            >
              <Text size="1" color="muted" style={{ textAlign: 'center' }}>
                No websites
              </Text>
            </Column>
          )}
        </Column>
      </Column>
    );
  };

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" />
        <Row>
          <SearchField
            placeholder="Search websites..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </Row>
        <Grid columns={{ xs: 1, md: 3 }} gap="4">
          {renderStatusColumn('healthy')}
          {renderStatusColumn('warning')}
          {renderStatusColumn('error')}
        </Grid>
      </Column>
    </PageBody>
  );
}
