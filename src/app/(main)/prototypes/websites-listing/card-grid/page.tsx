'use client';
import Link from 'next/link';
import { Grid, Column, Row, Heading, Text, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { useLoginQuery, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { DataGrid } from '@/components/common/DataGrid';
import { SquarePen } from '@/components/icons';
import { LinkButton } from '@/components/common/LinkButton';

export default function WebsitesCardGridPage() {
  const { user } = useLoginQuery();
  const { teamId, renderUrl } = useNavigation();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>
        
        <DataGrid query={queryResult} allowSearch allowPaging>
          {({ data }) => (
            <Grid columns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap="4">
              {data?.map((website: any) => (
                <Panel key={website.id} padding="4">
                  <Column gap="3">
                    <Row justifyContent="space-between" alignItems="flex-start">
                      <Column gap="1" flex="1">
                        <Link href={renderUrl(`/websites/${website.id}`, false)}>
                          <Heading size="2" style={{ cursor: 'pointer', color: '#3e63dd', textDecoration: 'none' }}>
                            {website.name}
                          </Heading>
                        </Link>
                        <Text size="1" color="var(--gray-9)">
                          {website.domain}
                        </Text>
                      </Column>
                      <LinkButton href={renderUrl(`/websites/${website.id}/settings`)} variant="quiet">
                        <Icon>
                          <SquarePen />
                        </Icon>
                      </LinkButton>
                    </Row>
                    <Row
                      gap="4"
                      padding="3"
                      backgroundColor="var(--gray-2)"
                      style={{ borderRadius: '6px' }}
                    >
                      <Column gap="1" flex="1">
                        <Text size="0" color="var(--gray-9)" style={{ fontWeight: 500 }}>
                          Domain
                        </Text>
                        <Text size="1" style={{ fontWeight: 600 }}>
                          {website.domain.split('/')[2]}
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Panel>
              ))}
            </Grid>
          )}
        </DataGrid>
      </Column>
    </PageBody>
  );
}
