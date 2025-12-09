'use client';

import Link from 'next/link';
import { Button, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { SquarePen } from '@/components/icons';
import { DataGrid } from '@/components/common/DataGrid';
import styles from './page.module.css';

export default function WebsitesCompactListPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId, renderUrl } = useNavigation();
  const queryResult = useUserWebsitesQuery({ teamId });

  return (
    <PageBody>
      <div style={{ padding: '2rem' }}>
        <PageHeader title={formatMessage(labels.websites)}>
          <Button variant="primary">{formatMessage(labels.add)}</Button>
        </PageHeader>

        <div style={{ marginTop: '2rem' }}>
          <DataGrid query={queryResult} allowSearch allowPaging>
            {({ data }) => (
              <div className={styles.listContainer}>
                {data?.map((website, index) => (
                  <Link
                    key={website.id}
                    href={renderUrl(`/websites/${website.id}`, false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={styles.compactRow}>
                      <div className={styles.rowIcon}>{website.name.charAt(0).toUpperCase()}</div>
                      <div className={styles.rowContent}>
                        <div className={styles.rowName}>{website.name}</div>
                        <div className={styles.rowDomain}>{website.domain}</div>
                      </div>
                      <div className={styles.rowActions}>
                        <Link
                          href={renderUrl(`/websites/${website.id}`, false)}
                          onClick={(e) => e.stopPropagation()}
                          className={styles.actionLink}
                        >
                          View
                        </Link>
                        <Link
                          href={renderUrl(`/websites/${website.id}/settings`, false)}
                          onClick={(e) => e.stopPropagation()}
                          className={styles.actionButton}
                        >
                          <Icon style={{ width: '1rem', height: '1rem' }}>
                            <SquarePen />
                          </Icon>
                        </Link>
                      </div>
                    </div>
                    {index < (data?.length || 0) - 1 && <div className={styles.divider} />}
                  </Link>
                ))}
              </div>
            )}
          </DataGrid>
        </div>
      </div>
    </PageBody>
  );
}
