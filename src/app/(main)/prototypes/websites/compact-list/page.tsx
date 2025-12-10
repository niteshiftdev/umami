'use client';

import Link from 'next/link';
import { Row, Text, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { useLoginQuery } from '@/components/hooks';
import { SquarePen } from '@/components/icons';
import { LinkButton } from '@/components/common/LinkButton';
import styles from './page.module.css';

export default function WebsitesCompactPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId } = useNavigation();
  const { user } = useLoginQuery();
  const { data: websites = [], isLoading } = useUserWebsitesQuery({ userId: user?.id, teamId });
  const { renderUrl } = useNavigation();

  if (isLoading) {
    return (
      <PageBody>
        <div className={styles.container}>
          <PageHeader title={formatMessage(labels.websites)}>
            <WebsiteAddButton teamId={teamId} />
          </PageHeader>
          <Text>{formatMessage(labels.loading)}</Text>
        </div>
      </PageBody>
    );
  }

  return (
    <PageBody>
      <div className={styles.container}>
        <PageHeader title={formatMessage(labels.websites)}>
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>

        {websites.length === 0 ? (
          <div className={styles.emptyState}>
            <Text className={styles.emptyText}>{formatMessage(labels.noData)}</Text>
          </div>
        ) : (
          <div className={styles.listContainer}>
            <div className={styles.listHeader}>
              <div className={styles.nameColumn}>{formatMessage(labels.name)}</div>
              <div className={styles.domainColumn}>{formatMessage(labels.domain)}</div>
              <div className={styles.actionsColumn}></div>
            </div>

            <div className={styles.listBody}>
              {websites.map((website) => (
                <Link
                  key={website.id}
                  href={renderUrl(`/websites/${website.id}`, false)}
                  className={styles.row}
                >
                  <div className={styles.nameColumn}>
                    <Text weight="600" size="0" className={styles.name}>
                      {website.name}
                    </Text>
                  </div>
                  <div className={styles.domainColumn}>
                    <Text size="-1" className={styles.domain}>
                      {website.domain}
                    </Text>
                  </div>
                  <div className={styles.actionsColumn}>
                    <LinkButton
                      href={renderUrl(`/websites/${website.id}/settings`)}
                      variant="quiet"
                      onClick={(e) => e.stopPropagation()}
                      className={styles.actionButton}
                    >
                      <Icon>
                        <SquarePen />
                      </Icon>
                    </LinkButton>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageBody>
  );
}
