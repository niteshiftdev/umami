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
  Row,
  Heading,
  Text,
} from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';

export default function ModernCardLoginPage() {
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 'var(--spacing-4)',
      }}
    >
      <Column
        alignItems="center"
        gap="6"
        style={{
          backgroundColor: 'var(--base-color-50)',
          borderRadius: 'var(--border-radius-4)',
          boxShadow: 'var(--box-shadow-6)',
          padding: 'var(--spacing-10)',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <Column alignItems="center" gap="3">
          <Row
            alignItems="center"
            justifyContent="center"
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 'var(--border-radius-full)',
              boxShadow: 'var(--box-shadow-4)',
            }}
          >
            <Icon size="lg" style={{ color: 'white' }}>
              <Logo />
            </Icon>
          </Row>
          <Column alignItems="center" gap="1">
            <Heading size="3">Welcome back</Heading>
            <Text color="muted">Sign in to your umami dashboard</Text>
          </Column>
        </Column>

        <Form onSubmit={handleSubmit} error={getErrorMessage(error)} style={{ width: '100%' }}>
          <Column gap="5">
            <FormField
              label={formatMessage(labels.username)}
              data-test="input-username"
              name="username"
              rules={{ required: formatMessage(labels.required) }}
            >
              <TextField autoComplete="off" placeholder="Enter your username" />
            </FormField>
            <FormField
              label={formatMessage(labels.password)}
              data-test="input-password"
              name="password"
              rules={{ required: formatMessage(labels.required) }}
            >
              <PasswordField placeholder="Enter your password" />
            </FormField>
            <FormButtons>
              <FormSubmitButton
                data-test="button-submit"
                variant="primary"
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  padding: 'var(--spacing-3) var(--spacing-4)',
                  fontWeight: '600',
                }}
                isDisabled={false}
              >
                {formatMessage(labels.login)}
              </FormSubmitButton>
            </FormButtons>
          </Column>
        </Form>

        <Row gap="2" style={{ marginTop: 'var(--spacing-2)' }}>
          <Text size="sm" color="muted">
            Need help?
          </Text>
          <Text
            size="sm"
            style={{
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Contact support
          </Text>
        </Row>
      </Column>

      <Text size="sm" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 'var(--spacing-6)' }}>
        Privacy-focused web analytics
      </Text>
    </Column>
  );
}
