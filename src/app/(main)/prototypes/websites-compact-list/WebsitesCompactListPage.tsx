'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Column,
  Row,
  Button,
  Icon,
  Text,
  SearchField,
  Box,
} from '@umami/react-zen';
import { ChevronRight, ChevronDown, Edit, Copy, Trash2, ExternalLink } from '@/components/icons';
import { useMessages, useNavigation, useUserWebsitesQuery, useLoginQuery } from '@/components/hooks';
import { PageBody } from '@/components/common/PageBody';
import { PageHeader } from '@/components/common/PageHeader';
import { Panel } from '@/components/common/Panel';
import { DataGrid } from '@/components/common/DataGrid';
import { DateDistance } from '@/components/common/DateDistance';
import { WebsiteAddButton } from '@/app/(main)/websites/WebsiteAddButton';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Empty } from '@/components/common/Empty';

// Mock data for demonstration
const MOCK_WEBSITES = [
  {
    id: '1',
    name: 'Tech Blog',
    domain: 'techblog.example.com',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
  },
  {
    id: '2',
    name: 'E-Commerce Store',
    domain: 'shop.example.com',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
  },
  {
    id: '3',
    name: 'Portfolio',
    domain: 'portfolio.example.com',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: '4',
    name: 'SaaS Dashboard',
    domain: 'app.example.com',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
  },
  {
    id: '5',
    name: 'Marketing Site',
    domain: 'marketing.example.com',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
  },
  {
    id: '6',
    name: 'Community Forum',
    domain: 'forum.example.com',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
  },
];

interface ExpandedState {
  [key: string]: boolean;
}

interface WebsiteItemProps {
  website: any;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onDelete?: (id: string) => void;
}

function WebsiteListItem({ website, isExpanded, onToggleExpand, onDelete }: WebsiteItemProps) {
  const { renderUrl } = useNavigation();
  const { formatMessage, labels } = useMessages();

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(website.domain);
  };

  const handleToggle = () => {
    onToggleExpand(website.id);
  };

  return (
    <Column
      gap="0"
      border="bottom"
      paddingY="4"
      paddingX="4"
      style={{
        transition: 'background-color 0.15s ease-out',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-bg-secondary)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
      }}
    >
      {/* Header Row: Name and Domain */}
      <Row
        alignItems="center"
        justifyContent="space-between"
        gap="3"
        onClick={handleToggle}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Row alignItems="center" gap="3" flexGrow={1} minWidth="0">
          {/* Toggle Icon */}
          <Icon
            size="sm"
            color="muted"
            style={{
              transition: 'transform 0.2s ease-out',
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            }}
          >
            <ChevronDown />
          </Icon>

          {/* Name and Domain */}
          <Column gap="1" minWidth="0" flexGrow={1}>
            <Link href={renderUrl(`/websites/${website.id}`, false)}>
              <Text
                weight="medium"
                style={{
                  color: 'var(--color-text-link)',
                  textDecoration: 'none',
                  wordBreak: 'break-word',
                }}
              >
                {website.name}
              </Text>
            </Link>
            <Text
              size="xs"
              color="muted"
              truncate
              title={website.domain}
              style={{
                maxWidth: '100%',
              }}
            >
              {website.domain}
            </Text>
          </Column>
        </Row>

        {/* Indicator Icon on Right */}
        <Icon size="sm" color="muted">
          {isExpanded ? <ChevronDown /> : <ChevronRight />}
        </Icon>
      </Row>

      {/* Expanded Content */}
      {isExpanded && (
        <Column
          gap="4"
          marginTop="4"
          paddingTop="4"
          border="top"
          style={{
            animation: 'fadeInDown 0.2s ease-out',
            '@keyframes fadeInDown': {
              from: {
                opacity: 0,
                transform: 'translateY(-8px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          {/* Created Date */}
          <Row alignItems="center" gap="3">
            <Text size="xs" color="muted" width="80px">
              {formatMessage(labels.created)}:
            </Text>
            <DateDistance date={new Date(website.createdAt)} />
          </Row>

          {/* Action Buttons */}
          <Row gap="2" alignItems="center">
            {/* Visit Website */}
            <Button
              variant="outline"
              size="sm"
              onPress={() => window.open(`https://${website.domain}`, '_blank')}
              title="Visit website"
            >
              <Icon size="sm">
                <ExternalLink />
              </Icon>
            </Button>

            {/* Copy Domain */}
            <Button
              variant="outline"
              size="sm"
              onPress={handleCopyDomain}
              title="Copy domain"
            >
              <Icon size="sm">
                <Copy />
              </Icon>
            </Button>

            {/* Edit Settings */}
            <Button
              variant="outline"
              size="sm"
              onPress={() =>
                window.location.href = renderUrl(`/websites/${website.id}/settings`)
              }
              title="Edit settings"
            >
              <Icon size="sm">
                <Edit />
              </Icon>
            </Button>

            {/* Delete */}
            <Button
              variant="outline"
              size="sm"
              onPress={() => onDelete?.(website.id)}
              title="Delete website"
            >
              <Icon size="sm" color="danger">
                <Trash2 />
              </Icon>
            </Button>
          </Row>
        </Column>
      )}
    </Column>
  );
}

interface CompactListRendererProps {
  data: any;
}

function CompactListRenderer({ data }: CompactListRendererProps) {
  const { formatMessage, labels } = useMessages();
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const handleToggleExpand = useCallback((id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  if (!data?.data || data.data.length === 0) {
    return <Empty />;
  }

  return (
    <Column
      gap="0"
      border
      borderRadius="2"
      backgroundColor
      overflow="hidden"
    >
      {data.data.map((website: any, index: number) => (
        <WebsiteListItem
          key={website.id}
          website={website}
          isExpanded={expanded[website.id] || false}
          onToggleExpand={handleToggleExpand}
        />
      ))}
    </Column>
  );
}

export function WebsitesCompactListPage() {
  const { formatMessage, labels } = useMessages();
  const { teamId } = useNavigation();
  const { user } = useLoginQuery();
  const queryResult = useUserWebsitesQuery({ userId: user?.id, teamId });
  const { data, isLoading, isFetching, error } = queryResult;

  // Use real data if available, otherwise use mock data
  const displayData = data?.data && data.data.length > 0
    ? data
    : { data: MOCK_WEBSITES, count: MOCK_WEBSITES.length };

  // Create a modified query result that uses mock data as fallback
  const effectiveQueryResult = {
    ...queryResult,
    data: displayData,
  };

  return (
    <PageBody>
      <Column gap="6" margin="2">
        {/* Header with Add Button */}
        <PageHeader title={formatMessage(labels.websites)}>
          <WebsiteAddButton teamId={teamId} />
        </PageHeader>

        {/* Content Panel */}
        <Panel>
          <DataGrid
            query={effectiveQueryResult}
            allowSearch
            allowPaging
            renderEmpty={() => (
              <Empty message={formatMessage(labels.noData || 'No websites found')} />
            )}
          >
            {(data) => <CompactListRenderer data={data} />}
          </DataGrid>
        </Panel>
      </Column>
    </PageBody>
  );
}
