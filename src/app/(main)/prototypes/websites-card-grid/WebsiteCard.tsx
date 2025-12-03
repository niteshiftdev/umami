'use client';
import Link from 'next/link';
import { Icon, Column, Row, Text, Button } from '@umami/react-zen';
import { LinkButton } from '@/components/common/LinkButton';
import { Favicon } from '@/components/common/Favicon';
import { DateDistance } from '@/components/common/DateDistance';
import { useNavigation } from '@/components/hooks';
import { SquarePen, ExternalLink } from '@/components/icons';

interface WebsiteCardProps {
  website: {
    id: string;
    name: string;
    domain: string;
    createdAt: string;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  const { renderUrl } = useNavigation();
  const createdDate = new Date(website.createdAt);

  return (
    <Column
      gap="4"
      padding="5"
      border
      borderRadius="3"
      backgroundColor="var(--color-background-secondary, transparent)"
      style={{
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideInUp 0.4s ease-out forwards',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header with favicon and name */}
      <Row gap="3" alignItems="flex-start">
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <Favicon domain={website.domain} />
        </div>
        <Column gap="1" flex={1} minWidth="0">
          <Link
            href={renderUrl(`/websites/${website.id}`, false)}
            style={{
              textDecoration: 'none',
              color: 'var(--color-text)',
              fontWeight: 600,
              fontSize: '15px',
              lineHeight: '1.4',
              display: 'block',
              wordBreak: 'break-word',
            }}
            title={website.name}
          >
            {website.name}
          </Link>
        </Column>
      </Row>

      {/* Domain */}
      <Text
        color="muted"
        style={{
          fontSize: '13px',
          wordBreak: 'break-all',
        }}
        title={website.domain}
      >
        {website.domain}
      </Text>

      {/* Created date */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--color-text-muted)',
        }}
      >
        <DateDistance date={createdDate} />
      </div>

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: '8px' }} />

      {/* Action buttons */}
      <Row gap="3" justifyContent="flex-end">
        <LinkButton
          href={renderUrl(`/websites/${website.id}`, false)}
          variant="secondary"
          size="sm"
          style={{
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
        >
          <Row gap="2" alignItems="center">
            <Icon size="sm">
              <ExternalLink />
            </Icon>
            View
          </Row>
        </LinkButton>
        <LinkButton
          href={renderUrl(`/websites/${website.id}/settings`, false)}
          variant="quiet"
          size="sm"
          style={{
            fontSize: '13px',
            transition: 'all 0.2s ease',
          }}
        >
          <Icon size="sm">
            <SquarePen />
          </Icon>
        </LinkButton>
      </Row>
    </Column>
  );
}

// Add animation styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}
