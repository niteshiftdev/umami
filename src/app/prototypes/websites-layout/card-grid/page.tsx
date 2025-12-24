'use client';

import Link from 'next/link';
import { Grid, Button, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { SquarePen } from '@/components/icons';
import { DataGrid } from '@/components/common/DataGrid';
import styles from './page.module.css';

export default function WebsitesCardGridPage() {
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
              <Grid gap="4" columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
                {data?.map((website) => (
                  <Link
                    key={website.id}
                    href={renderUrl(`/websites/${website.id}`, false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div className={styles.siteIcon}>{website.name.charAt(0).toUpperCase()}</div>
                        <Link
                          href={renderUrl(`/websites/${website.id}/settings`, false)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.5rem',
                            opacity: 0.6,
                            transition: 'opacity 0.2s',
                          }}
                        >
                          <Icon style={{ cursor: 'pointer' }}>
                            <SquarePen />
                          </Icon>
                        </Link>
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.siteName}>{website.name}</h3>
                        <p className={styles.siteDomain}>{website.domain}</p>
                      </div>
                      <div className={styles.cardMeta}>
                        <span className={styles.label}>Analytics Site</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </Grid>
            )}
          </DataGrid>
        </div>
      </div>
    </PageBody>
  );
}
