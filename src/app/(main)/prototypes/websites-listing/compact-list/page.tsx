'use client';
import Link from 'next/link';
import { Column, Row, Heading, Text, Icon } from '@umami/react-zen';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { useLoginQuery, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { DataGrid } from '@/components/common/DataGrid';
import { SquarePen, ChevronRight } from '@/components/icons';
import { LinkButton } from '@/components/common/LinkButton';

export default function WebsitesCompactListPage() {
  const { user } = useLoginQuery();
  const { teamId, renderUrl } = useNavigation();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites">
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>
        
        <Panel padding="0">
          <DataGrid query={queryResult} allowSearch allowPaging>
            {({ data }) => (
              <Column gap="0">
                {data?.map((website: any, index: number) => (
                  <div key={website.id}>
                    <Link href={renderUrl(`/websites/${website.id}`, false)} style={{ textDecoration: 'none' }}>
                      <Row
                        padding="4"
                        alignItems="center"
                        gap="4"
                        style={{
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gray-2)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        }}
                      >
                        <Column gap="1" flex="1">
                          <Heading size="1" style={{ color: '#3e63dd' }}>
                            {website.name}
                          </Heading>
                          <Text size="0" color="var(--gray-9)">
                            {website.domain}
                          </Text>
                        </Column>
                        <Icon style={{ color: 'var(--gray-8)' }}>
                          <ChevronRight />
                        </Icon>
                      </Row>
                    </Link>
                    {index < data.length - 1 && (
                      <div style={{ height: '1px', backgroundColor: 'var(--gray-4)' }} />
                    )}
                  </div>
                ))}
              </Column>
            )}
          </DataGrid>
        </Panel>
      </Column>
    </PageBody>
  );
}
