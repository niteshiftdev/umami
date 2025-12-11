'use client';

import { Grid, Column, Row, Heading, Text, Icon, Button } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Favicon } from '@/components/common/Favicon';
import { LinkButton } from '@/components/common/LinkButton';
import { Empty } from '@/components/common/Empty';
import { useMessages, useNavigation } from '@/components/hooks';
import { useUserWebsitesQuery } from '@/components/hooks';
import { Eye, Settings, ExternalLink, Plus, Globe } from '@/components/icons';
import styles from './page.module.css';

interface Website {
  id: string;
  name: string;
  domain: string;
  shareId?: string;
  teamId?: string;
  createdAt: Date;
}

const sampleWebsites: Website[] = [
  {
    id: 'ws-001',
    name: 'E-commerce Store',
    domain: 'shop.meridiangoods.com',
    createdAt: new Date('2024-09-15'),
  },
  {
    id: 'ws-002',
    name: 'Company Blog',
    domain: 'blog.techforward.io',
    createdAt: new Date('2024-08-22'),
  },
  {
    id: 'ws-003',
    name: 'SaaS Dashboard',
    domain: 'app.cloudmetrics.dev',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 'ws-004',
    name: 'Marketing Site',
    domain: 'www.brightwave.agency',
    createdAt: new Date('2024-07-10'),
  },
  {
    id: 'ws-005',
    name: 'Documentation Portal',
    domain: 'docs.openapi.tools',
    createdAt: new Date('2024-11-03'),
  },
  {
    id: 'ws-006',
    name: 'Developer Community',
    domain: 'community.devhub.net',
    createdAt: new Date('2024-06-28'),
  },
];

function WebsiteCard({ website, index }: { website: Website; index: number }) {
  const { renderUrl } = useNavigation();
  const { formatMessage, labels } = useMessages();

  return (
    <Column
      className={styles.card}
      style={{ animationDelay: `${index * 60}ms` }}
      gap="4"
      padding="5"
      border
      borderRadius="3"
      backgroundColor
    >
      <Row alignItems="flex-start" justifyContent="space-between" gap="3">
        <Row alignItems="center" gap="3" style={{ minWidth: 0, flex: 1 }}>
          <div className={styles.faviconWrapper}>
            <Favicon domain={website.domain} />
            <div className={styles.faviconFallback}>
              <Icon size="sm" color="muted">
                <Globe />
              </Icon>
            </div>
          </div>
          <Column gap="1" style={{ minWidth: 0, flex: 1 }}>
            <Heading size="1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {website.name}
            </Heading>
            <Row alignItems="center" gap="2">
              <Text size="1" color="muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {website.domain}
              </Text>
              <a
                href={`https://${website.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                <Icon size="xs" color="muted">
                  <ExternalLink />
                </Icon>
              </a>
            </Row>
          </Column>
        </Row>
      </Row>

      <Row gap="2" className={styles.actions}>
        <LinkButton
          href={renderUrl(`/websites/${website.id}`)}
          variant="primary"
          size="sm"
          style={{ flex: 1 }}
        >
          <Icon size="sm">
            <Eye />
          </Icon>
          {formatMessage(labels.view)}
        </LinkButton>
        <LinkButton
          href={renderUrl(`/websites/${website.id}/settings`)}
          variant="secondary"
          size="sm"
        >
          <Icon size="sm">
            <Settings />
          </Icon>
        </LinkButton>
      </Row>
    </Column>
  );
}

export default function CardGridPage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels } = useMessages();
  const { data, isLoading, error } = useUserWebsitesQuery({ teamId });

  const websites: Website[] = data?.data?.length > 0 ? data.data : sampleWebsites;

  return (
    <PageBody isLoading={isLoading} error={error}>
      <Column gap="6">
        <PageHeader title={formatMessage(labels.websites)}>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            {formatMessage(labels.addWebsite)}
          </Button>
        </PageHeader>

        {websites.length === 0 ? (
          <Empty message={formatMessage(labels.noWebsitesConfigured)} />
        ) : (
          <Grid
            columns={{ xs: '1', sm: '2', lg: '3' }}
            gap="4"
            className={styles.grid}
          >
            {websites.map((website, index) => (
              <WebsiteCard key={website.id} website={website} index={index} />
            ))}
          </Grid>
        )}
      </Column>
    </PageBody>
  );
}
