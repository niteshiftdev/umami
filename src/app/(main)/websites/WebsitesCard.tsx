'use client';
import Link from 'next/link';
import { Column, Row, Text, Icon } from '@umami/react-zen';
import { LinkButton } from '@/components/common/LinkButton';
import { useNavigation } from '@/components/hooks';
import { SquarePen, Globe } from '@/components/icons';

export interface WebsitesCardProps {
  data: any[];
  renderLink?: (row: any) => any;
  showActions?: boolean;
}

export function WebsitesCard({ data, renderLink, showActions }: WebsitesCardProps) {
  const { renderUrl } = useNavigation();

  if (!data || data.length === 0) {
    return (
      <Column alignItems="center" justifyContent="center" gap="4" padding="8">
        <Text color="muted" size="lg">
          No websites found
        </Text>
      </Column>
    );
  }

  return (
    <Column gap="3">
      {data.map((website) => (
        <Column
          key={website.id}
          padding="4"
          border
          borderRadius="2"
          backgroundColor
          gap="0"
        >
          <Row justifyContent="space-between" alignItems="start" gap="4">
            <Row alignItems="start" gap="3" flex={1}>
              <Icon size="lg" color="muted" style={{ marginTop: '2px' }}>
                <Globe />
              </Icon>
              <Column gap="2" flex={1} minWidth={0}>
                <Row gap="2" alignItems="center" wrap="wrap">
                  <Text weight="bold" truncate>
                    {renderLink ? renderLink(website) : website.name}
                  </Text>
                </Row>
                <Text size="sm" color="muted" truncate title={website.domain}>
                  {website.domain}
                </Text>
              </Column>
            </Row>
            {showActions && (
              <LinkButton
                href={renderUrl(`/websites/${website.id}/settings`)}
                variant="quiet"
                style={{ flexShrink: 0 }}
              >
                <Icon>
                  <SquarePen />
                </Icon>
              </LinkButton>
            )}
          </Row>
        </Column>
      ))}
    </Column>
  );
}
