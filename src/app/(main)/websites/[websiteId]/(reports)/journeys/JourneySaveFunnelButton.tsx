'use client';
import { Button, Icon, Text, Row, DialogTrigger, Modal, Dialog } from '@umami/react-zen';
import { Filter, X } from '@/components/icons';
import { useMessages } from '@/components/hooks';
import { FunnelEditForm } from '../funnels/FunnelEditForm';

export interface JourneySaveFunnelButtonProps {
  isActive: boolean;
  selectedCount: number;
  selectedSteps: { name: string; columnIndex: number }[];
  websiteId: string;
  onEnterSelectionMode: () => void;
  onCancel: () => void;
  onFunnelSave: () => void;
}

export function JourneySaveFunnelButton({
  isActive,
  selectedCount,
  selectedSteps,
  websiteId,
  onEnterSelectionMode,
  onCancel,
  onFunnelSave,
}: JourneySaveFunnelButtonProps) {
  const { formatMessage, labels } = useMessages();

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  if (!isActive) {
    // Not in selection mode - just a button to enter selection mode
    return (
      <Button variant="outline" onPress={onEnterSelectionMode}>
        <Row alignItems="center" gap>
          <Icon>
            <Filter />
          </Icon>
          <Text>Save as Funnel</Text>
        </Row>
      </Button>
    );
  }

  // In selection mode - show DialogTrigger if we have enough steps
  if (selectedCount >= 2) {
    return (
      <DialogTrigger>
        <Button variant="primary">
          <Row alignItems="center" gap>
            <div onClick={handleCancelClick} style={{ cursor: 'pointer', display: 'flex' }}>
              <Icon>
                <X />
              </Icon>
            </div>
            <Text>Creating Funnel ({selectedCount})</Text>
          </Row>
        </Button>
        <Modal>
          <Dialog title={formatMessage(labels.funnel)}>
            {({ close }) => (
              <FunnelEditForm
                websiteId={websiteId}
                onClose={() => {
                  close();
                  onCancel();
                }}
                onSave={() => {
                  close();
                  onFunnelSave();
                }}
                initialSteps={selectedSteps.map(step => ({
                  type: 'path',
                  value: step.name,
                }))}
              />
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>
    );
  }

  // In selection mode but not enough steps - disabled button
  return (
    <Button variant="primary" isDisabled>
      <Row alignItems="center" gap>
        <div onClick={handleCancelClick} style={{ cursor: 'pointer', display: 'flex' }}>
          <Icon>
            <X />
          </Icon>
        </div>
        <Text>Creating Funnel</Text>
      </Row>
    </Button>
  );
}
