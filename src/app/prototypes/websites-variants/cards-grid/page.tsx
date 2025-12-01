'use client';
import Link from 'next/link';
import { useLoginQuery, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { DataGrid } from '@/components/common/DataGrid';
import { useMessages } from '@/components/hooks';
import { Column } from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { Icon, Button } from '@umami/react-zen';
import { SquarePen } from '@/components/icons';
import styles from './cards-grid.module.css';

export default function CardsGridVariant() {
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
              <div className={styles.grid}>
                {data?.map((website: any) => (
                  <div key={website.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>
                        <Link href={renderUrl(`/websites/${website.id}`, false)}>
                          {website.name}
                        </Link>
                      </h3>
                      <Link
                        href={renderUrl(`/websites/${website.id}/settings`)}
                        className={styles.editButton}
                      >
                        <Icon>
                          <SquarePen />
                        </Icon>
                      </Link>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.field}>
                        <label className={styles.label}>Domain</label>
                        <p className={styles.value}>{website.domain}</p>
                      </div>
                    </div>
                    <Link
                      href={renderUrl(`/websites/${website.id}`, false)}
                      className={styles.viewButton}
                    >
                      {formatMessage(labels.view)}
                    </Link>
                  </div>
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
