'use client';

import { Column, Row, Text, Button, Icon, Spinner } from '@umami/react-zen';
import { useLocale, useMessages } from '@/components/hooks';
import type { WebsiteAnnotation } from '@/components/hooks/queries/useWebsiteAnnotationsQuery';
import { formatDate, DATE_FORMATS } from '@/lib/date';
import { Trash2, Flag } from '@/components/icons';

interface AnnotationListProps {
  annotations: WebsiteAnnotation[];
  isLoading?: boolean;
  deletingId?: string | null;
  onDelete?: (annotationId: string) => void;
}

export function AnnotationList({
  annotations,
  isLoading,
  deletingId,
  onDelete,
}: AnnotationListProps) {
  const { formatMessage, messages } = useMessages();
  const { locale } = useLocale();

  if (isLoading) {
    return (
      <Row justifyContent="center" paddingY="6">
        <Spinner size="2" />
      </Row>
    );
  }

  if (!annotations?.length) {
    return (
      <Row paddingY="2">
        <Text color="var(--text-muted)">{formatMessage(messages.noAnnotations)}</Text>
      </Row>
    );
  }

  return (
    <Column gap="3">
      {annotations.map(annotation => {
        const formatted = formatDate(new Date(annotation.timestamp), DATE_FORMATS['day'], locale);
        return (
          <Row
            key={annotation.id}
            justifyContent="space-between"
            gap="4"
            paddingY="2"
            border="bottom"
          >
            <Column gap="1">
              <Row gap="2" alignItems="center">
                <Icon color={annotation.color || '#f97316'}>
                  <Flag />
                </Icon>
                <Text fontWeight="600">{annotation.title}</Text>
              </Row>
              <Text fontSize="1" color="var(--text-muted)">
                {formatted}
              </Text>
              {annotation.description && <Text fontSize="1">{annotation.description}</Text>}
            </Column>
            {onDelete && (
              <Button
                variant="quiet"
                isDisabled={deletingId === annotation.id}
                onPress={() => onDelete(annotation.id)}
              >
                {deletingId === annotation.id ? (
                  <Spinner size="1" />
                ) : (
                  <Icon size="1.2">
                    <Trash2 />
                  </Icon>
                )}
              </Button>
            )}
          </Row>
        );
      })}
    </Column>
  );
}
