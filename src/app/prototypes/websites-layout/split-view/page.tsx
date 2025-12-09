'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Icon, Column, Row } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { SquarePen } from '@/components/icons';
import { DataGrid } from '@/components/common/DataGrid';
import styles from './page.module.css';

export default function WebsitesSplitViewPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId, renderUrl } = useNavigation();
  const queryResult = useUserWebsitesQuery({ teamId });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <PageBody>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid #e5e5e5' }}>
          <PageHeader title={formatMessage(labels.websites)}>
            <Button variant="primary">{formatMessage(labels.add)}</Button>
          </PageHeader>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <DataGrid query={queryResult} allowSearch allowPaging>
            {({ data }) => (
              <Row style={{ width: '100%', height: '100%' }}>
                {/* Left panel: list */}
                <div className={styles.listPanel}>
                  <div className={styles.listContainer}>
                    {data?.map((website) => (
                      <div
                        key={website.id}
                        className={`${styles.listItem} ${selectedId === website.id ? styles.active : ''}`}
                        onClick={() => setSelectedId(website.id)}
                      >
                        <div className={styles.listItemContent}>
                          <div className={styles.listItemIcon}>{website.name.charAt(0)}</div>
                          <div className={styles.listItemText}>
                            <div className={styles.listItemName}>{website.name}</div>
                            <div className={styles.listItemDomain}>{website.domain}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right panel: details */}
                {selectedId && data?.find((w) => w.id === selectedId) ? (
                  <div className={styles.detailPanel}>
                    {(() => {
                      const site = data.find((w) => w.id === selectedId);
                      return (
                        <Column gap="4" margin="3">
                          <div>
                            <div className={styles.detailIcon}>{site?.name.charAt(0)}</div>
                          </div>
                          <div>
                            <h2 className={styles.detailName}>{site?.name}</h2>
                            <p className={styles.detailDomain}>{site?.domain}</p>
                          </div>
                          <div className={styles.actionGroup}>
                            <Link href={renderUrl(`/websites/${selectedId}`, false)}>
                              <Button variant="primary" style={{ width: '100%' }}>
                                {formatMessage(labels.view)}
                              </Button>
                            </Link>
                            <Link href={renderUrl(`/websites/${selectedId}/settings`, false)}>
                              <Button variant="secondary" style={{ width: '100%' }}>
                                <Icon>
                                  <SquarePen />
                                </Icon>
                                {formatMessage(labels.settings)}
                              </Button>
                            </Link>
                          </div>
                        </Column>
                      );
                    })()}
                  </div>
                ) : (
                  <div className={styles.detailPanel} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-secondary, #666)' }}>Select a website to view details</p>
                  </div>
                )}
              </Row>
            )}
          </DataGrid>
        </div>
      </div>
    </PageBody>
  );
}
