'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  Icon,
  DataTable,
  DataColumn,
  SearchField,
  StatusLight,
  Button,
  TooltipTrigger,
  Tooltip,
  CopyButton,
} from '@umami/react-zen';
import { PageHeader } from '@/components/common/PageHeader';
import { PageBody } from '@/components/common/PageBody';
import { Panel } from '@/components/common/Panel';
import { Favicon } from '@/components/common/Favicon';
import { Empty } from '@/components/common/Empty';
import { Eye, Settings, Code, Users, User, Globe } from '@/components/icons';
import { formatDistanceToNow } from 'date-fns';

// Realistic sample website data
const SAMPLE_WEBSITES = [
  {
    id: 'ws-001',
    name: 'Marketing Site',
    domain: 'marketing.acme.com',
    teamId: 'team-001',
    teamName: 'Marketing',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active',
    shareId: 'share-abc123',
  },
  {
    id: 'ws-002',
    name: 'Developer Portal',
    domain: 'developers.acme.com',
    teamId: null,
    teamName: null,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'active',
    shareId: 'share-def456',
  },
  {
    id: 'ws-003',
    name: 'E-commerce Store',
    domain: 'shop.acme.com',
    teamId: 'team-002',
    teamName: 'Sales',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    status: 'active',
    shareId: 'share-ghi789',
  },
  {
    id: 'ws-004',
    name: 'Blog',
    domain: 'blog.acme.com',
    teamId: 'team-001',
    teamName: 'Marketing',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    status: 'active',
    shareId: 'share-jkl012',
  },
  {
    id: 'ws-005',
    name: 'Support Center',
    domain: 'support.acme.com',
    teamId: 'team-003',
    teamName: 'Support',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    status: 'paused',
    shareId: 'share-mno345',
  },
  {
    id: 'ws-006',
    name: 'Customer Dashboard',
    domain: 'dashboard.acme.com',
    teamId: 'team-002',
    teamName: 'Sales',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    shareId: 'share-pqr678',
  },
  {
    id: 'ws-007',
    name: 'Landing Pages',
    domain: 'pages.acme.com',
    teamId: 'team-001',
    teamName: 'Marketing',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: 'active',
    shareId: 'share-stu901',
  },
  {
    id: 'ws-008',
    name: 'Internal Tools',
    domain: 'tools.internal.acme.com',
    teamId: null,
    teamName: null,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
    status: 'paused',
    shareId: 'share-vwx234',
  },
];

function getTrackingCode(websiteId: string) {
  return `<script defer src="/script.js" data-website-id="${websiteId}"></script>`;
}

export default function DataTableWebsitesPage() {
  const [search, setSearch] = useState('');

  const filteredData = useMemo(() => {
    if (!search) return SAMPLE_WEBSITES;
    const lowercaseSearch = search.toLowerCase();
    return SAMPLE_WEBSITES.filter(
      website =>
        website.name.toLowerCase().includes(lowercaseSearch) ||
        website.domain.toLowerCase().includes(lowercaseSearch) ||
        (website.teamName && website.teamName.toLowerCase().includes(lowercaseSearch)),
    );
  }, [search]);

  return (
    <PageBody>
      <Column gap="6" margin="2">
        <PageHeader title="Websites" icon={<Globe />}>
          <Button variant="primary">
            <Text>Add website</Text>
          </Button>
        </PageHeader>

        <Panel>
          <Column gap="4" minHeight="300px">
            <Row alignItems="center" justifyContent="space-between" gap>
              <SearchField
                value={search}
                onSearch={setSearch}
                delay={300}
                placeholder="Search websites..."
              />
              <Row gap="2" alignItems="center">
                <Text size="2" color="muted">
                  {filteredData.length} website{filteredData.length !== 1 ? 's' : ''}
                </Text>
              </Row>
            </Row>

            {filteredData.length === 0 ? (
              <Empty message="No websites found" />
            ) : (
              <div
                style={{
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                <style>
                  {`
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(4px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes rowReveal {
                      from { opacity: 0; }
                      to { opacity: 1; }
                    }
                    .data-table-row {
                      animation: rowReveal 0.2s ease-out forwards;
                      transition: background-color 0.15s ease;
                    }
                    .data-table-row:hover {
                      background-color: var(--base-color-3);
                    }
                  `}
                </style>
                <DataTable data={filteredData}>
                  <DataColumn id="name" label="Name" width="280px">
                    {(row: (typeof SAMPLE_WEBSITES)[0]) => (
                      <Row alignItems="center" gap="3">
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Favicon domain={row.domain} />
                        </div>
                        <Column gap="1">
                          <Link
                            href={`/websites/${row.id}`}
                            style={{
                              color: 'var(--font-color)',
                              fontWeight: 500,
                              textDecoration: 'none',
                            }}
                          >
                            {row.name}
                          </Link>
                        </Column>
                      </Row>
                    )}
                  </DataColumn>

                  <DataColumn id="domain" label="Domain" width="220px">
                    {(row: (typeof SAMPLE_WEBSITES)[0]) => (
                      <Text size="2" color="muted" truncate>
                        {row.domain}
                      </Text>
                    )}
                  </DataColumn>

                  <DataColumn id="team" label="Owner" width="150px">
                    {(row: (typeof SAMPLE_WEBSITES)[0]) => (
                      <Row alignItems="center" gap="2">
                        <Icon size="sm" color="muted">
                          {row.teamId ? <Users /> : <User />}
                        </Icon>
                        <Text size="2" truncate>
                          {row.teamName || 'Personal'}
                        </Text>
                      </Row>
                    )}
                  </DataColumn>

                  <DataColumn id="created" label="Created" width="140px">
                    {(row: (typeof SAMPLE_WEBSITES)[0]) => (
                      <Text size="2" color="muted">
                        {formatDistanceToNow(row.createdAt, { addSuffix: true })}
                      </Text>
                    )}
                  </DataColumn>

                  <DataColumn id="status" label="Status" width="100px">
                    {(row: (typeof SAMPLE_WEBSITES)[0]) => (
                      <StatusLight variant={row.status === 'active' ? 'success' : 'warning'}>
                        <Text size="2">{row.status === 'active' ? 'Active' : 'Paused'}</Text>
                      </StatusLight>
                    )}
                  </DataColumn>

                  <DataColumn id="actions" label="" align="end" width="130px">
                    {(row: (typeof SAMPLE_WEBSITES)[0]) => (
                      <Row gap="1" justifyContent="flex-end">
                        <TooltipTrigger delay={0}>
                          <Button
                            variant="quiet"
                            size="sm"
                            onPress={() => (window.location.href = `/websites/${row.id}`)}
                          >
                            <Icon size="sm">
                              <Eye />
                            </Icon>
                          </Button>
                          <Tooltip>View analytics</Tooltip>
                        </TooltipTrigger>

                        <TooltipTrigger delay={0}>
                          <Button
                            variant="quiet"
                            size="sm"
                            onPress={() => {
                              window.location.href = `/websites/${row.id}/settings`;
                            }}
                          >
                            <Icon size="sm">
                              <Settings />
                            </Icon>
                          </Button>
                          <Tooltip>Settings</Tooltip>
                        </TooltipTrigger>

                        <TooltipTrigger delay={0}>
                          <CopyButton value={getTrackingCode(row.id)} size="sm" variant="quiet">
                            <Icon size="sm">
                              <Code />
                            </Icon>
                          </CopyButton>
                          <Tooltip>Copy tracking code</Tooltip>
                        </TooltipTrigger>
                      </Row>
                    )}
                  </DataColumn>
                </DataTable>
              </div>
            )}
          </Column>
        </Panel>
      </Column>
    </PageBody>
  );
}
