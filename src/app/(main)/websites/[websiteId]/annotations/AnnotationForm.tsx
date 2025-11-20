'use client';

import { useMemo } from 'react';
import {
  Button,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  TextField,
} from '@umami/react-zen';
import { format } from 'date-fns';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { messages } from '@/components/messages';

interface AnnotationFormProps {
  websiteId: string;
  defaultTimestamp?: Date | string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AnnotationForm({
  websiteId,
  defaultTimestamp,
  onSuccess,
  onCancel,
}: AnnotationFormProps) {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const { mutateAsync, error, isPending, touch, toast } = useUpdateQuery(
    `/websites/${websiteId}/annotations`,
  );

  const defaultValues = useMemo(() => {
    const now = defaultTimestamp ? new Date(defaultTimestamp) : new Date();
    return {
      title: '',
      timestamp: format(now, "yyyy-MM-dd'T'HH:mm"),
      description: '',
    };
  }, [defaultTimestamp]);

  const handleSubmit = async (values: Record<string, any>) => {
    await mutateAsync(
      {
        ...values,
        timestamp: new Date(values.timestamp),
      },
      {
        onSuccess: () => {
          toast(formatMessage(messages.saved));
          touch('annotations');
          onSuccess?.();
        },
      },
    );
  };

  return (
    <Form defaultValues={defaultValues} error={getErrorMessage(error)} onSubmit={handleSubmit}>
      <FormField
        name="title"
        label={formatMessage(labels.title)}
        rules={{ required: formatMessage(labels.required) }}
      >
        <TextField autoFocus maxLength={200} />
      </FormField>
      <FormField
        name="timestamp"
        label={formatMessage(labels.date)}
        rules={{ required: formatMessage(labels.required) }}
      >
        <TextField type="datetime-local" />
      </FormField>
      <FormField name="description" label={formatMessage(labels.description)}>
        <TextField asTextArea rows={4} resize="vertical" />
      </FormField>
      <FormButtons>
        <Button onPress={onCancel} isDisabled={isPending}>
          {formatMessage(labels.cancel)}
        </Button>
        <FormSubmitButton variant="primary" isLoading={isPending}>
          {formatMessage(labels.save)}
        </FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
