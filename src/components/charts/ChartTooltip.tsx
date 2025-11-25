'use client';

import { ReactNode } from 'react';
import { Column, Row, StatusLight, FloatingTooltip, Text } from '@umami/react-zen';
import { useAnnotationDials } from '@/components/annotations';

type AnnotationData = { title: string; description?: string | null; color?: string };

function AnnotationIndicatorIcon({ shape, color }: { shape: string; color: string }) {
  switch (shape) {
    case 'diamond':
      return (
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
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
            width: '8px',
            height: '8px',
            backgroundColor: color,
            borderRadius: '2px',
            flexShrink: 0,
          }}
        />
      );
    case 'flag':
      return (
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill={color}
          style={{ flexShrink: 0 }}
        >
          <path d="M4 3v18M4 3l12 4.5L4 12" stroke={color} strokeWidth="2" />
        </svg>
      );
    case 'circleOutline':
      return (
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
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
            width: '8px',
            height: '8px',
            backgroundColor: color,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${color}`,
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
            width: '8px',
            height: '8px',
            backgroundColor: color,
            borderRadius: '50%',
            flexShrink: 0,
          }}
        />
      );
  }
}

function StyledAnnotationSection({
  annotations,
}: {
  annotations: AnnotationData[];
}) {
  const { currentStyle } = useAnnotationDials();
  const { colors, typography, indicator, hover } = currentStyle;

  const getShadowStyle = () => {
    switch (hover.shadow) {
      case 'soft':
        return '0 1px 4px rgba(0, 0, 0, 0.08)';
      case 'medium':
        return '0 2px 8px rgba(0, 0, 0, 0.12)';
      case 'strong':
        return '0 4px 12px rgba(0, 0, 0, 0.18)';
      default:
        return 'none';
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: hover.padding,
    borderRadius: hover.borderRadius,
    borderLeft: `3px solid ${colors.primary}`,
    backgroundColor: colors.background,
    boxShadow: getShadowStyle(),
    marginTop: '4px',
  };

  return (
    <Column gap="2" style={containerStyle}>
      {annotations.map((annotation, index) => (
        <Column key={`${annotation.title}-${index}`} gap="1">
          <Row gap="2" alignItems="center">
            <AnnotationIndicatorIcon
              shape={indicator.shape}
              color={annotation.color || colors.primary}
            />
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
          {annotation.description && (
            <Text
              style={{
                fontSize: typography.descriptionSize,
                fontFamily: typography.fontFamily,
                color: colors.muted,
                paddingLeft: '16px',
              }}
            >
              {annotation.description}
            </Text>
          )}
        </Column>
      ))}
    </Column>
  );
}

export function ChartTooltip({
  title,
  color,
  value,
  annotations,
}: {
  title?: string;
  color?: string;
  value?: ReactNode;
  annotations?: AnnotationData[];
}) {
  return (
    <FloatingTooltip>
      <Column gap="3" fontSize="1">
        {title && <Row alignItems="center">{title}</Row>}
        <Row alignItems="center">
          <StatusLight color={color}>{value}</StatusLight>
        </Row>
        {annotations && annotations.length > 0 && (
          <StyledAnnotationSection annotations={annotations} />
        )}
      </Column>
    </FloatingTooltip>
  );
}
