'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Icon, DataTable, DataColumn, DataTableProps, Row, Column, Button, Text } from '@umami/react-zen';
import { DataGrid } from '@/components/common/DataGrid';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { LinkButton } from '@/components/common/LinkButton';
import { useLoginQuery, useMessages, useNavigation, useUserWebsitesQuery } from '@/components/hooks';
import { SquarePen, Trash2 } from '@/components/icons';
import { formatDate } from '@/lib/date';
import { WebsiteAddButton } from '../../../(main)/websites/WebsiteAddButton';

export function WebsitesDenseTablePage() {
  const { teamId } = useNavigation();
  const { formatMessage, labels } = useMessages();
  const { user } = useLoginQuery();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });
  const { renderUrl } = useNavigation();
  const [sortField, setSortField] = useState<'name' | 'domain' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'name' | 'domain' | 'created') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderLink = (row: any) => (
    <Link href={renderUrl(`/websites/${row.id}`, false)}>{row.name}</Link>
  );

  const sortedData = (data: any[]) => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle date sorting
      if (sortField === 'created') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // Handle string sorting
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title={formatMessage(labels.websites)}>
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>
        <Panel>
          <DataGrid query={queryResult} allowSearch allowPaging>
            {({ data }) => (
              <Column gap="0">
                {/* Dense Table Header */}
                <Row
                  paddingX="4"
                  paddingY="3"
                  border="bottom"
                  backgroundColor="var(--color-background-inverted-05, rgba(0, 0, 0, 0.02))"
                  gap="6"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1.2fr 0.8fr',
                    alignItems: 'center',
                    fontSize: '11px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <Column
                    gap="0"
                    onClick={() => handleSort('name')}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                    }}
                  >
                    <span>{formatMessage(labels.name)}</span>
                    {sortField === 'name' && (
                      <span style={{ fontSize: '10px' }}>
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </Column>
                  <Column
                    gap="0"
                    onClick={() => handleSort('domain')}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                    }}
                  >
                    <span>{formatMessage(labels.domain)}</span>
                    {sortField === 'domain' && (
                      <span style={{ fontSize: '10px' }}>
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </Column>
                  <Column
                    gap="0"
                    onClick={() => handleSort('created')}
                    style={{
                      cursor: 'pointer',
                      userSelect: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                    }}
                  >
                    <span>{formatMessage(labels.created)}</span>
                    {sortField === 'created' && (
                      <span style={{ fontSize: '10px' }}>
                        {sortOrder === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </Column>
                  <Column gap="0" style={{ textAlign: 'center' }}>
                    {formatMessage(labels.actions)}
                  </Column>
                </Row>

                {/* Dense Table Rows */}
                {sortedData(data?.results || []).map((row, index) => (
                  <Row
                    key={row.id}
                    paddingX="4"
                    paddingY="3"
                    border="bottom"
                    gap="6"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1.5fr 1.2fr 0.8fr',
                      alignItems: 'center',
                      fontSize: '13px',
                      backgroundColor:
                        index % 2 === 0
                          ? 'transparent'
                          : 'var(--color-background-inverted-05, rgba(0, 0, 0, 0.01))',
                      transition: 'background-color 200ms ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.backgroundColor =
                          'var(--color-background-inverted-10, rgba(0, 0, 0, 0.04))';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (e.currentTarget instanceof HTMLElement) {
                        e.currentTarget.style.backgroundColor =
                          index % 2 === 0
                            ? 'transparent'
                            : 'var(--color-background-inverted-05, rgba(0, 0, 0, 0.01))';
                      }
                    }}
                  >
                    {/* Name Column */}
                    <Column gap="0" style={{ overflow: 'hidden' }}>
                      <Link
                        href={renderUrl(`/websites/${row.id}`, false)}
                        style={{
                          color: 'var(--color-primary, #147af3)',
                          textDecoration: 'none',
                          fontWeight: '500',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        {row.name}
                      </Link>
                    </Column>

                    {/* Domain Column */}
                    <Column gap="0" style={{ overflow: 'hidden' }}>
                      <Text
                        color="muted"
                        size="xs"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={row.domain}
                      >
                        {row.domain}
                      </Text>
                    </Column>

                    {/* Created Date Column */}
                    <Column gap="0">
                      <Text
                        color="muted"
                        size="xs"
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={row.createdAt ? formatDate(row.createdAt, 'PPp') : ''}
                      >
                        {row.createdAt ? formatDate(row.createdAt, 'PP') : '-'}
                      </Text>
                    </Column>

                    {/* Actions Column */}
                    <Row
                      justifyContent="center"
                      gap="2"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <LinkButton
                        href={renderUrl(`/websites/${row.id}/settings`)}
                        variant="quiet"
                        size="sm"
                        style={{
                          padding: 'var(--spacing-1) var(--spacing-2)',
                          minWidth: 'unset',
                        }}
                      >
                        <Icon size="sm">
                          <SquarePen />
                        </Icon>
                      </LinkButton>
                      <Button
                        variant="quiet"
                        size="sm"
                        style={{
                          padding: 'var(--spacing-1) var(--spacing-2)',
                          minWidth: 'unset',
                          color: 'var(--color-danger, #e5484d)',
                        }}
                        onPress={() => {
                          // Delete action placeholder
                          console.log('Delete website:', row.id);
                        }}
                      >
                        <Icon size="sm">
                          <Trash2 />
                        </Icon>
                      </Button>
                    </Row>
                  </Row>
                ))}
              </Column>
            )}
          </DataGrid>
        </Panel>
      </Column>
    </PageBody>
  );
}
