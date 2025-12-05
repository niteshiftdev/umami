import { useState } from 'react';
import {
  Column,
  type ColumnProps,
  Row,
  Icon,
  Button,
  TooltipTrigger,
  Tooltip,
  Heading,
} from '@umami/react-zen';
import { Maximize, X } from '@/components/icons';
import { useMessages } from '@/components/hooks';
import { useDynamicVariant } from '@niteshift/dials';

export interface PanelProps extends ColumnProps {
  title?: string;
  allowFullscreen?: boolean;
}

const fullscreenStyles = {
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  border: 'none',
  zIndex: 9999,
} as any;

export function Panel({ title, allowFullscreen, style, children, ...props }: PanelProps) {
  const { formatMessage, labels } = useMessages();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const panelPaddingY = useDynamicVariant('panel-padding-vertical', {
    label: 'Vertical Padding',
    description: 'Vertical padding inside panels',
    default: '6',
    options: ['2', '3', '4', '5', '6', '7', '8'] as const,
    group: 'Panel Layout',
  });

  const panelPaddingX = useDynamicVariant('panel-padding-horizontal', {
    label: 'Horizontal Padding',
    description: 'Horizontal padding inside panels',
    default: '6',
    options: ['2', '3', '4', '5', '6', '7', '8'] as const,
    group: 'Panel Layout',
  });

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Column
      paddingY={panelPaddingY}
      paddingX={{ xs: '3', md: panelPaddingX }}
      border
      borderRadius="3"
      backgroundColor
      position="relative"
      gap
      {...props}
      style={{ ...style, ...(isFullscreen ? fullscreenStyles : {}) }}
    >
      {title && <Heading>{title}</Heading>}
      {allowFullscreen && (
        <Row justifyContent="flex-end" alignItems="center">
          <TooltipTrigger delay={0} isDisabled={isFullscreen}>
            <Button size="sm" variant="quiet" onPress={handleFullscreen}>
              <Icon>{isFullscreen ? <X /> : <Maximize />}</Icon>
            </Button>
            <Tooltip>{formatMessage(labels.maximize)}</Tooltip>
          </TooltipTrigger>
        </Row>
      )}
      {children}
    </Column>
  );
}
