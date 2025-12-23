'use client';

import {
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  TextField,
  PasswordField,
  Icon,
  Column,
  Heading,
  Text,
} from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';

export default function MinimalFocusedLoginPage() {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async ({ token, user }) => {
        setClientAuthToken(token);
        setUser(user);
        queryClient.setQueryData(['login'], user);
        router.push('/websites');
      },
    });
  };

  return (
    <Column
      alignItems="center"
      justifyContent="center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, var(--base100) 0%, var(--base200) 100%)',
        padding: '1.5rem',
      }}
    >
      <Column
        gap="8"
        alignItems="center"
        style={{
          width: '100%',
          maxWidth: '320px',
        }}
      >
        {/* Minimal Logo Mark */}
        <Column alignItems="center" gap="3">
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
          >
            <Icon size="md" style={{ color: 'white' }}>
              <Logo />
            </Icon>
          </div>
        </Column>

        {/* Clean Form */}
        <Column gap="6" style={{ width: '100%' }}>
          <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
            <Column gap="4">
              <FormField
                label={formatMessage(labels.username)}
                name="username"
                rules={{ required: formatMessage(labels.required) }}
              >
                <TextField
                  autoComplete="off"
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--base300)',
                  }}
                />
              </FormField>
              <FormField
                label={formatMessage(labels.password)}
                name="password"
                rules={{ required: formatMessage(labels.required) }}
              >
                <PasswordField
                  style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--base300)',
                  }}
                />
              </FormField>
            </Column>
            <FormButtons style={{ marginTop: '1.5rem' }}>
              <FormSubmitButton
                variant="primary"
                style={{
                  flex: 1,
                  height: '48px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                }}
              >
                {formatMessage(labels.login)}
              </FormSubmitButton>
            </FormButtons>
          </Form>
        </Column>

        {/* Subtle Footer */}
        <Text size="1" style={{ color: 'var(--base500)' }}>
          umami analytics
        </Text>
      </Column>
    </Column>
  );
}
