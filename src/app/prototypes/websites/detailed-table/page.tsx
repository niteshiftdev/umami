'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  Heading,
  SearchField,
  Button,
  Icon,
  DataTable,
  DataColumn,
  StatusLight,
  TooltipTrigger,
  Tooltip,
} from '@umami/react-zen';
import {
  Globe,
  Plus,
  Settings,
  SquarePen,
  ExternalLink,
  Eye,
  BarChart3,
  ChevronRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import styles from './page.module.css';

interface Website {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

const sampleWebsites: Website[] = [
  { id: '1', name: 'Marketing Site', domain: 'marketing.example.com', createdAt: '2024-06-15T10:00:00Z', status: 'active' },
  { id: '2', name: 'E-commerce Store', domain: 'shop.example.com', createdAt: '2024-08-20T14:30:00Z', status: 'active' },
  { id: '3', name: 'Developer Blog', domain: 'blog.devteam.io', createdAt: '2024-09-01T09:15:00Z', status: 'active' },
  { id: '4', name: 'Customer Portal', domain: 'portal.example.com', createdAt: '2024-10-10T16:45:00Z', status: 'active' },
  { id: '5', name: 'Landing Pages', domain: 'pages.example.com', createdAt: '2024-11-05T11:20:00Z', status: 'active' },
  { id: '6', name: 'Documentation', domain: 'docs.example.com', createdAt: '2024-11-20T08:00:00Z', status: 'active' },
  { id: '7', name: 'Support Center', domain: 'support.example.com', createdAt: '2024-11-25T13:00:00Z', status: 'active' },
  { id: '8', name: 'API Gateway', domain: 'api.example.com', createdAt: '2024-11-28T15:30:00Z', status: 'active' },
  { id: '9', name: 'Admin Dashboard', domain: 'admin.example.com', createdAt: '2024-11-29T09:00:00Z', status: 'active' },
  { id: '10', name: 'Mobile App Backend', domain: 'mobile-api.example.com', createdAt: '2024-11-30T11:45:00Z', status: 'active' },
];

const PAGE_SIZE = 8;

export default function DetailedTablePage() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!search) return sampleWebsites;
    const searchLower = search.toLowerCase();
    return sampleWebsites.filter(
      (site) =>
        site.name.toLowerCase().includes(searchLower) ||
        site.domain.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const showingStart = (currentPage - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(currentPage * PAGE_SIZE, filteredData.length);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (delta: number) => {
    const nextPage = currentPage + delta;
    if (nextPage >= 1 && nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  return (
    <Column
      width="100%"
      paddingBottom="6"
      maxWidth="1320px"
      paddingX={{ xs: '3', md: '6' }}
      style={{ margin: '0 auto' }}
    >
      <Column gap="6" style={{ paddingTop: 8 }}>
        {/* Page Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="6"
          style={{ borderBottom: '1px solid var(--border-color)' }}
          width="100%"
        >
          <Column gap="2">
            <Row alignItems="center" gap="3">
              <Icon size="md" color="muted">
                <Globe />
              </Icon>
              <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
            </Row>
          </Column>
          <Row justifyContent="flex-end">
            <Button variant="primary">
              <Icon size="sm">
                <Plus />
              </Icon>
              Add Website
            </Button>
          </Row>
        </Row>

        {/* Panel Container */}
        <Column
          paddingY="6"
          paddingX={{ xs: '3', md: '6' }}
          borderRadius="3"
          gap="4"
          style={{
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--background-color)',
            minHeight: '300px',
          }}
        >
          {/* Search and Info Row */}
          <Row alignItems="center" justifyContent="space-between" wrap="wrap" gap="3">
            <SearchField
              value={search}
              onSearch={handleSearch}
              delay={300}
              placeholder="Search websites..."
            />
            <Text size="2" color="muted">
              Showing {showingStart}-{showingEnd} of {filteredData.length} websites
            </Text>
          </Row>

          {/* Data Table */}
          <Column style={{ overflow: 'auto' }} className={styles.tableContainer}>
            <DataTable data={paginatedData}>
              <DataColumn id="name" label="Name">
                {(row: Website) => (
                  <Link href={`/websites/${row.id}`} className={styles.nameLink}>
                    {row.name}
                  </Link>
                )}
              </DataColumn>
              <DataColumn id="domain" label="Domain">
                {(row: Website) => (
                  <Row alignItems="center" gap="2">
                    <Text size="2" color="muted">
                      {row.domain}
                    </Text>
                    <a
                      href={`https://${row.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.externalLink}
                    >
                      <ExternalLink size={14} />
                    </a>
                  </Row>
                )}
              </DataColumn>
              <DataColumn id="status" label="Status">
                {(row: Website) => (
                  <StatusLight variant={row.status === 'active' ? 'success' : 'inactive'}>
                    <Text size="2">
                      {row.status === 'active' ? 'Active' : 'Inactive'}
                    </Text>
                  </StatusLight>
                )}
              </DataColumn>
              <DataColumn id="createdAt" label="Created">
                {(row: Website) => (
                  <Text size="2" color="muted" title={new Date(row.createdAt).toLocaleString()}>
                    {formatDistanceToNow(new Date(row.createdAt), { addSuffix: true })}
                  </Text>
                )}
              </DataColumn>
              <DataColumn id="actions" label=" " align="end">
                {(row: Website) => (
                  <Row gap="1" alignItems="center">
                    <TooltipTrigger delay={0}>
                      <Button size="sm" variant="quiet" asChild>
                        <Link href={`/websites/${row.id}`}>
                          <Icon size="sm">
                            <BarChart3 />
                          </Icon>
                        </Link>
                      </Button>
                      <Tooltip>View Analytics</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0}>
                      <Button size="sm" variant="quiet" asChild>
                        <a href={`https://${row.domain}`} target="_blank" rel="noopener noreferrer">
                          <Icon size="sm">
                            <Eye />
                          </Icon>
                        </a>
                      </Button>
                      <Tooltip>Visit Site</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0}>
                      <Button size="sm" variant="quiet" asChild>
                        <Link href={`/websites/${row.id}/settings`}>
                          <Icon size="sm">
                            <SquarePen />
                          </Icon>
                        </Link>
                      </Button>
                      <Tooltip>Edit</Tooltip>
                    </TooltipTrigger>
                    <TooltipTrigger delay={0}>
                      <Button size="sm" variant="quiet" asChild>
                        <Link href={`/websites/${row.id}/settings`}>
                          <Icon size="sm">
                            <Settings />
                          </Icon>
                        </Link>
                      </Button>
                      <Tooltip>Settings</Tooltip>
                    </TooltipTrigger>
                  </Row>
                )}
              </DataColumn>
            </DataTable>
          </Column>

          {/* Pagination */}
          {totalPages > 1 && (
            <Row alignItems="center" justifyContent="space-between" gap="3" style={{ marginTop: 16 }}>
              <Text size="2" color="muted">
                {filteredData.length} websites total
              </Text>
              <Row alignItems="center" justifyContent="flex-end" gap="3">
                <Text size="2">
                  Page {currentPage} of {totalPages}
                </Text>
                <Row gap="1">
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handlePageChange(-1)}
                    isDisabled={currentPage === 1}
                  >
                    <Icon size="sm" rotate={180}>
                      <ChevronRight />
                    </Icon>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => handlePageChange(1)}
                    isDisabled={currentPage === totalPages}
                  >
                    <Icon size="sm">
                      <ChevronRight />
                    </Icon>
                  </Button>
                </Row>
              </Row>
            </Row>
          )}
        </Column>
      </Column>
    </Column>
  );
}
