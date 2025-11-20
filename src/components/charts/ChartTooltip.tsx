import { ReactNode } from 'react';
import { Column, Row, StatusLight, FloatingTooltip, Text } from '@umami/react-zen';

export function ChartTooltip({
  title,
  color,
  value,
  annotations,
}: {
  title?: string;
  color?: string;
  value?: ReactNode;
  annotations?: { title: string; description?: string | null }[];
}) {
  return (
    <FloatingTooltip>
      <Column gap="3" fontSize="1">
        {title && <Row alignItems="center">{title}</Row>}
        <Row alignItems="center">
          <StatusLight color={color}>{value}</StatusLight>
        </Row>
        {annotations && annotations.length > 0 && (
          <Column gap="1">
            {annotations.map(annotation => (
              <Column key={annotation.title} gap="0">
                <Text fontWeight="600">{annotation.title}</Text>
                {annotation.description && (
                  <Text color="var(--text-muted)" fontSize="0.85em">
                    {annotation.description}
                  </Text>
                )}
              </Column>
            ))}
          </Column>
        )}
      </Column>
    </FloatingTooltip>
  );
}
