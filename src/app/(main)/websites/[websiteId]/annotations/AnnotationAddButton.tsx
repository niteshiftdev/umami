'use client';

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
import { DialogButton } from '@/components/input/DialogButton';
import { Plus } from '@/components/icons';
import { useMemo } from 'react';

interface AnnotationAddButtonProps {
  websiteId: string;
}

export function AnnotationAddButton({ websiteId }: AnnotationAddButtonProps) {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const { mutateAsync, error, isPending, touch, toast } = useUpdateQuery(
    `/websites/${websiteId}/annotations`,
  );

  const defaultValues = useMemo(() => {
    const now = new Date();
    const dateValue = format(now, "yyyy-MM-dd'T'HH:mm");
    return {
      title: '',
      timestamp: dateValue,
      description: '',
    };
  }, []);

  const handleSubmit = async (values: Record<string, any>, close: () => void) => {
    await mutateAsync(
      {
        ...values,
        timestamp: new Date(values.timestamp),
      },
      {
        onSuccess: () => {
          toast(formatMessage(messages.saved));
          touch('annotations');
          close();
        },
      },
    );
  };

  return (
    <DialogButton
      icon={<Plus />}
      label={formatMessage(labels.addAnnotation)}
      width="420px"
      variant="outline"
    >
      {({ close }) => (
        <Form
          defaultValues={defaultValues}
          error={getErrorMessage(error)}
          onSubmit={values => handleSubmit(values, close)}
        >
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
            <Button onPress={close} isDisabled={isPending}>
              {formatMessage(labels.cancel)}
            </Button>
            <FormSubmitButton variant="primary" isLoading={isPending}>
              {formatMessage(labels.save)}
            </FormSubmitButton>
          </FormButtons>
        </Form>
      )}
    </DialogButton>
  );
}
