'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Text,
  Heading,
  Icon,
  Button,
  SearchField,
} from '@umami/react-zen';
import {
  Globe,
  Settings,
  BarChart3,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Favicon } from '@/components/common/Favicon';

// Mock data for the prototype
const mockWebsites = [
  {
    id: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    name: 'Acme Corporation',
    domain: 'acme-corp.com',
    visitors: 45892,
    pageviews: 128453,
    bounceRate: 32,
    avgDuration: '2m 45s',
    trend: 12.5,
    createdAt: '2024-01-15',
  },
  {
    id: '2b3c4d5e-6f78-90ab-cdef-123456789012',
    name: 'TechStart Blog',
    domain: 'blog.techstart.io',
    visitors: 12340,
    pageviews: 34567,
    bounceRate: 45,
    avgDuration: '1m 32s',
    trend: -3.2,
    createdAt: '2024-02-20',
  },
  {
    id: '3c4d5e6f-7890-abcd-ef12-345678901234',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    visitors: 78234,
    pageviews: 245678,
    bounceRate: 28,
    avgDuration: '4m 12s',
    trend: 24.8,
    createdAt: '2023-11-08',
  },
  {
    id: '4d5e6f78-90ab-cdef-1234-567890123456',
    name: 'Marketing Landing',
    domain: 'landing.marketing.co',
    visitors: 5678,
    pageviews: 8901,
    bounceRate: 65,
    avgDuration: '0m 48s',
    trend: 8.1,
    createdAt: '2024-03-10',
  },
  {
    id: '5e6f7890-abcd-ef12-3456-789012345678',
    name: 'Developer Docs',
    domain: 'docs.devtools.dev',
    visitors: 23456,
    pageviews: 89012,
    bounceRate: 22,
    avgDuration: '5m 20s',
    trend: 15.3,
    createdAt: '2023-09-22',
  },
  {
    id: '6f789012-cdef-1234-5678-901234567890',
    name: 'SaaS Dashboard',
    domain: 'app.saasproduct.io',
    visitors: 34567,
    pageviews: 156789,
    bounceRate: 18,
    avgDuration: '8m 15s',
    trend: 31.2,
    createdAt: '2023-08-05',
  },
  {
    id: '7f890123-def0-2345-6789-012345678901',
    name: 'Community Forum',
    domain: 'forum.community.org',
    visitors: 8901,
    pageviews: 45678,
    bounceRate: 35,
    avgDuration: '3m 40s',
    trend: 5.7,
    createdAt: '2024-04-01',
  },
  {
    id: '8f901234-ef01-3456-7890-123456789012',
    name: 'Portfolio Site',
    domain: 'portfolio.designer.me',
    visitors: 2345,
    pageviews: 5678,
    bounceRate: 52,
    avgDuration: '1m 15s',
    trend: -8.4,
    createdAt: '2024-05-12',
  },
];

type SortField = 'name' | 'visitors' | 'pageviews' | 'bounceRate' | 'trend';
type SortDir = 'asc' | 'desc';

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function SortHeader({
  label,
  field,
  currentField,
  currentDir,
  onSort,
  align = 'left',
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}) {
  const isActive = currentField === field;

  return (
    <Row
      as="button"
      alignItems="center"
      gap="1"
      justifyContent={align === 'right' ? 'flex-end' : 'flex-start'}
      onClick={() => onSort(field)}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 0',
        color: isActive ? 'var(--font-color)' : 'var(--font-color-muted)',
        fontWeight: isActive ? 600 : 500,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {label}
      <Icon size="xs" style={{ opacity: isActive ? 1 : 0.3 }}>
        {isActive && currentDir === 'asc' ? <ChevronUp /> : <ChevronDown />}
      </Icon>
    </Row>
  );
}

function TableRow({
  website,
  index,
}: {
  website: (typeof mockWebsites)[0];
  index: number;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <Row
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      alignItems="center"
      padding="4"
      gap="4"
      style={{
        borderBottom: '1px solid var(--base-color-3)',
        backgroundColor: showActions ? 'var(--base-color-2)' : 'transparent',
        transition: 'background-color 0.15s ease',
        animation: `fadeIn 0.3s ease-out ${index * 0.04}s both`,
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Website Name & Domain */}
      <Row alignItems="center" gap="3" style={{ flex: 2, minWidth: 200 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            backgroundColor: 'var(--base-color-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Favicon domain={website.domain} />
          {!website.domain && (
            <Icon size="sm" color="muted">
              <Globe />
            </Icon>
          )}
        </div>
        <Column gap="0">
          <Link
            href={`/websites/${website.id}`}
            style={{
              textDecoration: 'none',
              color: 'var(--font-color)',
            }}
          >
            <Text size="2" weight="medium" style={{ lineHeight: 1.3 }}>
              {website.name}
            </Text>
          </Link>
          <Row alignItems="center" gap="1">
            <Text size="1" color="muted">
              {website.domain}
            </Text>
            <a
              href={`https://${website.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Icon
                size="xs"
                color="muted"
                style={{ opacity: showActions ? 1 : 0 }}
              >
                <ExternalLink />
              </Icon>
            </a>
          </Row>
        </Column>
      </Row>

      {/* Visitors */}
      <Column style={{ width: 100 }} alignItems="flex-end">
        <Text size="2" weight="medium">
          {formatNumber(website.visitors)}
        </Text>
        <Text size="1" color="muted">
          visitors
        </Text>
      </Column>

      {/* Pageviews */}
      <Column style={{ width: 100 }} alignItems="flex-end">
        <Text size="2" weight="medium">
          {formatNumber(website.pageviews)}
        </Text>
        <Text size="1" color="muted">
          views
        </Text>
      </Column>

      {/* Bounce Rate */}
      <Column style={{ width: 80 }} alignItems="flex-end">
        <Text
          size="2"
          weight="medium"
          style={{
            color:
              website.bounceRate > 50
                ? '#e5484d'
                : website.bounceRate < 30
                  ? '#30a46c'
                  : 'var(--font-color)',
          }}
        >
          {website.bounceRate}%
        </Text>
        <Text size="1" color="muted">
          bounce
        </Text>
      </Column>

      {/* Trend */}
      <Row style={{ width: 80 }} alignItems="center" justifyContent="flex-end" gap="1">
        <Icon
          size="xs"
          style={{
            color: website.trend >= 0 ? '#30a46c' : '#e5484d',
          }}
        >
          {website.trend >= 0 ? <ArrowUpRight /> : <ArrowDownRight />}
        </Icon>
        <Text
          size="2"
          weight="medium"
          style={{
            color: website.trend >= 0 ? '#30a46c' : '#e5484d',
          }}
        >
          {Math.abs(website.trend)}%
        </Text>
      </Row>

      {/* Actions */}
      <Row
        gap="1"
        style={{
          width: 140,
          justifyContent: 'flex-end',
          opacity: showActions ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}
      >
        <Button variant="quiet" size="sm" asChild>
          <Link href={`/websites/${website.id}`}>
            <Icon size="sm">
              <BarChart3 />
            </Icon>
          </Link>
        </Button>
        <Button variant="quiet" size="sm" asChild>
          <Link href={`/websites/${website.id}/settings`}>
            <Icon size="sm">
              <Settings />
            </Icon>
          </Link>
        </Button>
        <Button variant="quiet" size="sm">
          <Icon size="sm">
            <Copy />
          </Icon>
        </Button>
        <Button variant="quiet" size="sm">
          <Icon size="sm" color="muted">
            <MoreHorizontal />
          </Icon>
        </Button>
      </Row>
    </Row>
  );
}

export default function WebsitesCompactTablePage() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('visitors');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filteredWebsites = useMemo(() => {
    let result = mockWebsites;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(lower) ||
          w.domain.toLowerCase().includes(lower)
      );
    }

    result = [...result].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase() as any;
        bVal = (bVal as string).toLowerCase() as any;
      }

      if (sortDir === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [search, sortField, sortDir]);

  return (
    <Column
      width="100%"
      paddingBottom="6"
      maxWidth="1320px"
      paddingX={{ xs: '3', md: '6' }}
      style={{ margin: '0 auto' }}
    >
      <Column gap="6" margin="2">
        {/* Header */}
        <Row
          justifyContent="space-between"
          alignItems="center"
          paddingY="6"
          marginBottom="6"
          style={{ borderBottom: '1px solid var(--base-color-4)' }}
          width="100%"
        >
          <Column gap="2">
            <Heading size={{ xs: '2', md: '3', lg: '4' }}>Websites</Heading>
            <Text color="muted" size="2">
              Manage and monitor your website analytics
            </Text>
          </Column>
          <Button variant="primary">
            <Icon>
              <Plus />
            </Icon>
            Add website
          </Button>
        </Row>

        {/* Search & Filters */}
        <Row alignItems="center" justifyContent="space-between" gap="4">
          <SearchField
            value={search}
            onSearch={setSearch}
            placeholder="Search by name or domain..."
            style={{ maxWidth: 320 }}
          />
          <Text size="1" color="muted">
            {filteredWebsites.length} of {mockWebsites.length} websites
          </Text>
        </Row>

        {/* Table */}
        <Column
          style={{
            backgroundColor: 'var(--base-color-1)',
            border: '1px solid var(--base-color-4)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <Row
            alignItems="center"
            padding="4"
            gap="4"
            style={{
              backgroundColor: 'var(--base-color-2)',
              borderBottom: '1px solid var(--base-color-4)',
            }}
          >
            <Row style={{ flex: 2, minWidth: 200 }}>
              <SortHeader
                label="Website"
                field="name"
                currentField={sortField}
                currentDir={sortDir}
                onSort={handleSort}
              />
            </Row>
            <Row style={{ width: 100 }} justifyContent="flex-end">
              <SortHeader
                label="Visitors"
                field="visitors"
                currentField={sortField}
                currentDir={sortDir}
                onSort={handleSort}
                align="right"
              />
            </Row>
            <Row style={{ width: 100 }} justifyContent="flex-end">
              <SortHeader
                label="Views"
                field="pageviews"
                currentField={sortField}
                currentDir={sortDir}
                onSort={handleSort}
                align="right"
              />
            </Row>
            <Row style={{ width: 80 }} justifyContent="flex-end">
              <SortHeader
                label="Bounce"
                field="bounceRate"
                currentField={sortField}
                currentDir={sortDir}
                onSort={handleSort}
                align="right"
              />
            </Row>
            <Row style={{ width: 80 }} justifyContent="flex-end">
              <SortHeader
                label="Trend"
                field="trend"
                currentField={sortField}
                currentDir={sortDir}
                onSort={handleSort}
                align="right"
              />
            </Row>
            <Row style={{ width: 140 }}>
              <Text
                size="1"
                color="muted"
                weight="medium"
                style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
              >
                Actions
              </Text>
            </Row>
          </Row>

          {/* Table Body */}
          <Column>
            {filteredWebsites.map((website, index) => (
              <TableRow key={website.id} website={website} index={index} />
            ))}
          </Column>

          {filteredWebsites.length === 0 && (
            <Row
              color="muted"
              alignItems="center"
              justifyContent="center"
              width="100%"
              padding="6"
              minHeight="150px"
            >
              No websites found matching your search.
            </Row>
          )}
        </Column>
      </Column>
    </Column>
  );
}
