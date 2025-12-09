'use client';
import Link from 'next/link';
import { Grid, Column, Row, Heading, Text, Icon, Divider } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { useLoginQuery, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { DataGrid } from '@/components/common/DataGrid';
import { SquarePen, ExternalLink } from '@/components/icons';
import { LinkButton } from '@/components/common/LinkButton';
import { useState } from 'react';

export default function WebsitesSplitViewPage() {
  const { user } = useLoginQuery();
  const { teamId, renderUrl } = useNavigation();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>
        
        <DataGrid query={queryResult} allowSearch={false} allowPaging={false}>
          {({ data }) => (
            <Grid columns="300px 1fr" gap="4" height="600px">
              {/* Left sidebar - Website list */}
              <Panel padding="0" style={{ overflowY: 'auto' }}>
                <Column gap="0">
                  {data?.map((website: any) => (
                    <div
                      key={website.id}
                      onClick={() => setSelectedWebsite(website)}
                      style={{
                        padding: '16px',
                        borderBottom: '1px solid var(--gray-4)',
                        cursor: 'pointer',
                        backgroundColor: selectedWebsite?.id === website.id ? 'var(--gray-3)' : 'transparent',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <Text style={{ fontWeight: 600, marginBottom: '4px' }}>
                        {website.name}
                      </Text>
                      <Text size="0" color="var(--gray-9)">
                        {website.domain}
                      </Text>
                    </div>
                  ))}
                </Column>
              </Panel>

              {/* Right side - Website details */}
              <Panel padding="6">
                {selectedWebsite ? (
                  <Column gap="6">
                    <Row justifyContent="space-between" alignItems="center">
                      <Column gap="2">
                        <Heading size="3">{selectedWebsite.name}</Heading>
                        <Text color="var(--gray-9)">{selectedWebsite.domain}</Text>
                      </Column>
                      <LinkButton href={renderUrl(`/websites/${selectedWebsite.id}/settings`)} variant="quiet">
                        <Icon>
                          <SquarePen />
                        </Icon>
                      </LinkButton>
                    </Row>

                    <Divider />

                    <Column gap="4">
                      <Column gap="2">
                        <Text style={{ fontWeight: 600 }}>Quick Actions</Text>
                        <Row gap="2">
                          <LinkButton href={renderUrl(`/websites/${selectedWebsite.id}`, false)}>
                            <Icon>
                              <ExternalLink />
                            </Icon>
                            <Text>View Analytics</Text>
                          </LinkButton>
                          <LinkButton href={renderUrl(`/websites/${selectedWebsite.id}/settings`)} variant="secondary">
                            <Icon>
                              <SquarePen />
                            </Icon>
                            <Text>Edit</Text>
                          </LinkButton>
                        </Row>
                      </Column>
                    </Column>
                  </Column>
                ) : (
                  <Column alignItems="center" justifyContent="center" height="100%">
                    <Text color="var(--gray-9)">Select a website to view details</Text>
                  </Column>
                )}
              </Panel>
            </Grid>
          )}
        </DataGrid>
      </Column>
    </PageBody>
  );
}
