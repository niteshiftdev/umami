'use client';
import Link from 'next/link';
import { useLoginQuery, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { DataGrid } from '@/components/common/DataGrid';
import { useMessages } from '@/components/hooks';
import { Column } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { Icon } from '@umami/react-zen';
import { SquarePen } from '@/components/icons';
import styles from './compact-cards.module.css';

export default function CompactCardsVariant() {
  const { user } = useLoginQuery();
  const { teamId } = useNavigation();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });
  const { formatMessage, labels } = useMessages();
  const { renderUrl } = useNavigation();

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)}>
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>

        <DataGrid query={queryResult} allowSearch>
          {({ data }) => (
            <div className={styles.container}>
              <div className={styles.list}>
                {data?.map((website: any) => (
                  <Link
                    key={website.id}
                    href={renderUrl(`/websites/${website.id}`, false)}
                    className={styles.item}
                  >
                    <div className={styles.itemContent}>
                      <div className={styles.itemName}>{website.name}</div>
                      <div className={styles.itemDomain}>{website.domain}</div>
                    </div>
                    <div className={styles.itemActions}>
                      <Link
                        href={renderUrl(`/websites/${website.id}/settings`)}
                        className={styles.actionButton}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon>
                          <SquarePen />
                        </Icon>
                      </Link>
                    </div>
                  </Link>
                ))}
              </div>
              {data?.length === 0 && (
                <div className={styles.empty}>
                  <p>{formatMessage(labels.noData)}</p>
                </div>
              )}
            </div>
          )}
        </DataGrid>
      </Column>
    </PageBody>
  );
}
