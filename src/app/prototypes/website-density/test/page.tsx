'use client';

import { Column, Text, Heading } from '@umami/react-zen';

export default function TestPage() {
  return (
    <Column gap="4" style={{ padding: '40px' }}>
      <Heading size="4">Test Prototype Page</Heading>
      <Text>This is a simple test page to verify prototypes work.</Text>
    </Column>
  );
}
