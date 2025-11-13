'use client';
import { Button, Icon, Row, Text } from '@umami/react-zen';
import { Funnel, X } from '@/components/icons';
import { useMessages } from '@/components/hooks';

export function FunnelCreationButton({
  isActive,
  stepCount,
  onEnter,
  onCancel,
  onSave,
}: {
  isActive: boolean;
  stepCount: number;
  onEnter: () => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  const { formatMessage, labels } = useMessages();

  if (!isActive) {
    return (
      <Button variant="outline" onClick={onEnter}>
        <Icon>
          <Funnel />
        </Icon>
        <Text>{formatMessage(labels.createFunnel)}</Text>
      </Button>
    );
  }

  const canSave = stepCount >= 2 && stepCount <= 8;

  return (
    <Row gap alignItems="center">
      <Button
        variant="primary"
        onClick={onSave}
        disabled={!canSave}
        title={!canSave ? 'Select at least 2 steps' : undefined}
      >
        <Icon>
          <Funnel />
        </Icon>
        <Text>
          {formatMessage(labels.createFunnel)} ({stepCount}/8)
        </Text>
      </Button>
      <Button variant="ghost" onClick={onCancel} style={{ marginLeft: -8 }}>
        <Icon>
          <X />
        </Icon>
      </Button>
    </Row>
  );
}
