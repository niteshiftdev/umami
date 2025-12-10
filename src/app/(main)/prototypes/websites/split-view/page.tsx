'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Column, Text, Icon, Row } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { useLoginQuery } from '@/components/hooks';
import { Favicon } from '@/components/common/Favicon';
import { SquarePen } from '@/components/icons';
import { LinkButton } from '@/components/common/LinkButton';
import styles from './page.module.css';

export default function WebsitesSplitViewPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId } = useNavigation();
  const { user } = useLoginQuery();
  const { data: websites = [], isLoading } = useUserWebsitesQuery({ userId: user?.id, teamId });
  const { renderUrl } = useNavigation();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(websites[0]?.id || null);

  const selectedWebsite = websites.find((w) => w.id === selectedWebsiteId);

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
          <div className={styles.splitContainer}>
            {/* Left sidebar - List */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <Text weight="bold" size="0">
                  {websites.length} {formatMessage(labels.websites)}
                </Text>
              </div>

              <div className={styles.sidebarList}>
                {websites.map((website) => (
                  <button
                    key={website.id}
                    onClick={() => setSelectedWebsiteId(website.id)}
                    className={`${styles.sidebarItem} ${selectedWebsiteId === website.id ? styles.active : ''}`}
                  >
                    <div className={styles.sidebarItemFavicon}>
                      <Favicon domain={website.domain} />
                    </div>
                    <div className={styles.sidebarItemContent}>
                      <Text weight="600" size="0" className={styles.sidebarItemName}>
                        {website.name}
                      </Text>
                      <Text size="-1" className={styles.sidebarItemDomain}>
                        {website.domain}
                      </Text>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right panel - Details */}
            <div className={styles.detailsPanel}>
              {selectedWebsite ? (
                <Column gap="4">
                  <div className={styles.detailsHeader}>
                    <Row gap="2" align="center">
                      <div className={styles.detailsFavicon}>
                        <Favicon domain={selectedWebsite.domain} />
                      </div>
                      <Column gap="1">
                        <Text weight="bold" size="3">
                          {selectedWebsite.name}
                        </Text>
                        <Text size="0" className={styles.detailsDomain}>
                          {selectedWebsite.domain}
                        </Text>
                      </Column>
                    </Row>
                    <LinkButton
                      href={renderUrl(`/websites/${selectedWebsite.id}/settings`)}
                      variant="quiet"
                    >
                      <Icon>
                        <SquarePen />
                      </Icon>
                    </LinkButton>
                  </div>

                  <div className={styles.detailsContent}>
                    <div className={styles.detailsRow}>
                      <Text weight="600" size="0" className={styles.detailsLabel}>
                        Domain
                      </Text>
                      <Text size="0" className={styles.detailsValue}>
                        {selectedWebsite.domain}
                      </Text>
                    </div>

                    <div className={styles.detailsRow}>
                      <Text weight="600" size="0" className={styles.detailsLabel}>
                        Created
                      </Text>
                      <Text size="0" className={styles.detailsValue}>
                        {new Date(selectedWebsite.createdAt).toLocaleDateString()}
                      </Text>
                    </div>

                    <div className={styles.detailsRow}>
                      <Text weight="600" size="0" className={styles.detailsLabel}>
                        ID
                      </Text>
                      <Text size="-1" className={styles.detailsValueCode}>
                        {selectedWebsite.id}
                      </Text>
                    </div>
                  </div>

                  <div className={styles.detailsActions}>
                    <Link
                      href={renderUrl(`/websites/${selectedWebsite.id}`, false)}
                      className={styles.viewLink}
                    >
                      View Analytics
                    </Link>
                  </div>
                </Column>
              ) : (
                <div className={styles.noSelection}>
                  <Text className={styles.noSelectionText}>
                    Select a website to view details
                  </Text>
                </div>
              )}
            </div>
          </div>
        )}
      </Column>
    </PageBody>
  );
}
