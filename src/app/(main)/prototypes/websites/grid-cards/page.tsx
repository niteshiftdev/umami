'use client';

import Link from 'next/link';
import { Column, Row, Grid, Text, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { useLoginQuery } from '@/components/hooks';
import { Favicon } from '@/components/common/Favicon';
import { SquarePen } from '@/components/icons';
import { LinkButton } from '@/components/common/LinkButton';
import styles from './page.module.css';

export default function WebsitesGridPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId } = useNavigation();
  const { user } = useLoginQuery();
  const { data: websites = [], isLoading } = useUserWebsitesQuery({ userId: user?.id, teamId });
  const { renderUrl } = useNavigation();

  if (isLoading) {
    return (
      <PageBody>
        <Column gap="6" margin="2">
          <PageHeader title={formatMessage(labels.websites)}>
            <WebsiteAddButton teamId={teamId} />
          </PageHeader>
          <Text>{formatMessage(labels.loading)}</Text>
        </Column>
      </PageBody>
    );
  }

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)}>
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>

        {websites.length === 0 ? (
          <div className={styles.emptyState}>
            <Text className={styles.emptyText}>{formatMessage(labels.noData)}</Text>
          </div>
        ) : (
          <Grid columns={3} gap="4" className={styles.cardGrid}>
            {websites.map((website) => (
              <Link
                key={website.id}
                href={renderUrl(`/websites/${website.id}`, false)}
                className={styles.cardLink}
              >
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.faviconArea}>
                      <Favicon domain={website.domain} />
                    </div>
                    <LinkButton
                      href={renderUrl(`/websites/${website.id}/settings`)}
                      variant="quiet"
                      onClick={(e) => e.stopPropagation()}
                      className={styles.editButton}
                    >
                      <Icon>
                        <SquarePen />
                      </Icon>
                    </LinkButton>
                  </div>

                  <div className={styles.cardContent}>
                    <Text weight="bold" className={styles.websiteName}>
                      {website.name}
                    </Text>
                    <Text size="0" className={styles.domain}>
                      {website.domain}
                    </Text>
                  </div>

                  <div className={styles.cardFooter}>
                    <Text size="0" className={styles.meta}>
                      Created {new Date(website.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                </div>
              </Link>
            ))}
          </Grid>
        )}
      </Column>
    </PageBody>
  );
}
