'use client';

import { useMessages } from '@/components/hooks';
import { DialogButton } from '@/components/input/DialogButton';
import { Plus } from '@/components/icons';
import { AnnotationForm } from './AnnotationForm';

interface AnnotationAddButtonProps {
  websiteId: string;
}

export function AnnotationAddButton({ websiteId }: AnnotationAddButtonProps) {
  const { formatMessage, labels } = useMessages();

  return (
    <DialogButton
      icon={<Plus />}
      label={formatMessage(labels.addAnnotation)}
      width="420px"
      variant="outline"
    >
      {({ close }) => <AnnotationForm websiteId={websiteId} onSuccess={close} onCancel={close} />}
    </DialogButton>
  );
}
