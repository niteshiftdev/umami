'use client';

import { Column, Row, Text, Heading, Box } from '@umami/react-zen';
import Link from 'next/link';

export default function PrototypesLayout({ children }: { children: React.ReactNode }) {
  return (
    <Column width="100%" minHeight="100vh" backgroundColor="1">
      {/* Navigation Bar */}
      <Row
        padding="3"
        paddingX="6"
        backgroundColor
        borderBottom
        justifyContent="space-between"
        alignItems="center"
        position="sticky"
        top="0"
        style={{ zIndex: 100 }}
      >
        <Row gap="4" alignItems="center">
          <Link href="/prototypes/persona-dashboards/product-analytics" style={{ textDecoration: 'none' }}>
            <Text size="1" color="muted" style={{ cursor: 'pointer' }}>Product Analytics</Text>
          </Link>
          <Link href="/prototypes/persona-dashboards/marketing-attribution" style={{ textDecoration: 'none' }}>
            <Text size="1" color="muted" style={{ cursor: 'pointer' }}>Marketing Attribution</Text>
          </Link>
          <Link href="/prototypes/persona-dashboards/revenue-operations" style={{ textDecoration: 'none' }}>
            <Text size="1" color="muted" style={{ cursor: 'pointer' }}>Revenue Operations</Text>
          </Link>
          <Link href="/prototypes/persona-dashboards/hybrid" style={{ textDecoration: 'none' }}>
            <Text size="1" color="muted" style={{ cursor: 'pointer' }}>Hybrid Dashboard</Text>
          </Link>
        </Row>
        <Text size="0" color="muted">Persona Dashboard Prototypes</Text>
      </Row>

      {/* Main Content */}
      <Column alignItems="center" flex="1" overflowY="auto">
        {children}
      </Column>
    </Column>
  );
}
