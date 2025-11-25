'use client';

import { Column, Row, Text, Button, Icon, Spinner } from '@umami/react-zen';
import { useLocale, useMessages } from '@/components/hooks';
import type { WebsiteAnnotation } from '@/components/hooks/queries/useWebsiteAnnotationsQuery';
import { formatDate, DATE_FORMATS } from '@/lib/date';
import { Trash2, Flag } from '@/components/icons';
import { useAnnotationDials } from '@/components/annotations';

interface AnnotationListProps {
  annotations: WebsiteAnnotation[];
  isLoading?: boolean;
  deletingId?: string | null;
  onDelete?: (annotationId: string) => void;
}

function AnnotationIndicatorIcon({ shape, color }: { shape: string; color: string }) {
  switch (shape) {
    case 'diamond':
      return (
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            backgroundColor: color,
            transform: 'rotate(45deg)',
            flexShrink: 0,
          }}
        />
      );
    case 'square':
      return (
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            backgroundColor: color,
            borderRadius: '2px',
            flexShrink: 0,
          }}
        />
      );
    case 'flag':
      return (
        <Icon color={color}>
          <Flag />
        </Icon>
      );
    case 'circleOutline':
      return (
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            border: `2px solid ${color}`,
            borderRadius: '50%',
            flexShrink: 0,
          }}
        />
      );
    case 'circleGlow':
      return (
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            backgroundColor: color,
            borderRadius: '50%',
            boxShadow: `0 0 8px ${color}`,
            flexShrink: 0,
          }}
        />
      );
    case 'circle':
    default:
      return (
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            backgroundColor: color,
            borderRadius: '50%',
            flexShrink: 0,
          }}
        />
      );
  }
}

export function AnnotationList({
  annotations,
  isLoading,
  deletingId,
  onDelete,
}: AnnotationListProps) {
  const { formatMessage, messages } = useMessages();
  const { locale } = useLocale();
  const { currentStyle } = useAnnotationDials();
  const { colors, typography, indicator, hover } = currentStyle;

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

  const getShadowStyle = () => {
    switch (hover.shadow) {
      case 'soft':
        return '0 1px 4px rgba(0, 0, 0, 0.08)';
      case 'medium':
        return '0 2px 8px rgba(0, 0, 0, 0.12)';
      case 'strong':
        return '0 4px 12px rgba(0, 0, 0, 0.16)';
      default:
        return 'none';
    }
  };

  return (
    <Column gap="3">
      {annotations.map(annotation => {
        const formatted = formatDate(new Date(annotation.timestamp), DATE_FORMATS['day'], locale);
        const itemColor = annotation.color || colors.primary;

        const itemStyle: React.CSSProperties = {
          padding: hover.padding,
          borderRadius: hover.borderRadius,
          borderLeft: `3px solid ${itemColor}`,
          backgroundColor: colors.background,
          boxShadow: getShadowStyle(),
          transition: 'all 0.2s ease',
        };

        return (
          <Row
            key={annotation.id}
            justifyContent="space-between"
            gap="4"
            style={itemStyle}
          >
            <Column gap="1">
              <Row gap="2" alignItems="center">
                <AnnotationIndicatorIcon shape={indicator.shape} color={itemColor} />
                <Text
                  style={{
                    fontSize: typography.titleSize,
                    fontWeight: typography.titleWeight,
                    fontFamily: typography.fontFamily,
                  }}
                >
                  {annotation.title}
                </Text>
              </Row>
              <Text
                style={{
                  fontSize: typography.descriptionSize,
                  fontFamily: typography.fontFamily,
                  color: colors.muted,
                  paddingLeft: '18px',
                }}
              >
                {formatted}
              </Text>
              {annotation.description && (
                <Text
                  style={{
                    fontSize: typography.descriptionSize,
                    fontFamily: typography.fontFamily,
                    paddingLeft: '18px',
                  }}
                >
                  {annotation.description}
                </Text>
              )}
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
