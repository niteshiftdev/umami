'use client';

import { ReactNode } from 'react';
import { Column, Row, Heading, Text, Code } from '@umami/react-zen';

export interface ShowcaseSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  code?: string;
}

export function ShowcaseSection({ title, description, children, code }: ShowcaseSectionProps) {
  return (
    <Column gap="4" paddingY="6" borderBottom="top" borderColor="muted">
      <Column gap="2">
        <Heading size="5">{title}</Heading>
        {description && (
          <Text color="muted" size="3">
            {description}
          </Text>
        )}
      </Column>

      <Column
        gap="4"
        padding="6"
        border
        borderRadius="3"
        backgroundColor="1"
      >
        {children}
      </Column>

      {code && (
        <Column
          as="pre"
          padding="4"
          backgroundColor="2"
          borderRadius="2"
          overflow="auto"
        >
          <Code>
            <Text size="2" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {code}
            </Text>
          </Code>
        </Column>
      )}
    </Column>
  );
}
