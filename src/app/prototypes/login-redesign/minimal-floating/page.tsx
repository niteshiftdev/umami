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

export default function MinimalFloatingLoginPage() {
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
      style={{
        minHeight: '100vh',
        background: 'var(--base-color-100)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(20, 122, 243, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-15%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(48, 164, 108, 0.06) 0%, rgba(20, 122, 243, 0.04) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Row
        alignItems="center"
        justifyContent="space-between"
        style={{
          padding: 'var(--spacing-5) var(--spacing-8)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Row alignItems="center" gap="3">
          <Icon size="md" style={{ color: 'var(--primary-color)' }}>
            <Logo />
          </Icon>
          <Text style={{ fontWeight: '600', fontSize: 'var(--font-size-5)' }}>umami</Text>
        </Row>
        <Text size="sm" color="muted">
          Privacy-focused analytics
        </Text>
      </Row>

      {/* Main Content */}
      <Column
        alignItems="center"
        justifyContent="center"
        style={{
          flex: 1,
          padding: 'var(--spacing-6)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Column
          alignItems="stretch"
          gap="6"
          style={{
            width: '100%',
            maxWidth: '380px',
            backgroundColor: 'var(--base-color-50)',
            borderRadius: 'var(--border-radius-4)',
            boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            padding: 'var(--spacing-8)',
          }}
        >
          <Column alignItems="center" gap="2">
            <Heading size="3">Welcome back</Heading>
            <Text color="muted" style={{ textAlign: 'center' }}>
              Sign in to access your analytics dashboard
            </Text>
          </Column>

          <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
            <Column gap="5">
              <FormField
                label={formatMessage(labels.username)}
                data-test="input-username"
                name="username"
                rules={{ required: formatMessage(labels.required) }}
              >
                <TextField
                  autoComplete="off"
                  placeholder="Enter username"
                  style={{
                    backgroundColor: 'var(--base-color-100)',
                    border: '1px solid var(--base-color-200)',
                  }}
                />
              </FormField>
              <FormField
                label={formatMessage(labels.password)}
                data-test="input-password"
                name="password"
                rules={{ required: formatMessage(labels.required) }}
              >
                <PasswordField
                  placeholder="Enter password"
                  style={{
                    backgroundColor: 'var(--base-color-100)',
                    border: '1px solid var(--base-color-200)',
                  }}
                />
              </FormField>

              <Row justifyContent="flex-end">
                <Text
                  size="sm"
                  style={{
                    color: 'var(--primary-color)',
                    cursor: 'pointer',
                  }}
                >
                  Forgot password?
                </Text>
              </Row>

              <FormButtons>
                <FormSubmitButton
                  data-test="button-submit"
                  variant="primary"
                  style={{
                    flex: 1,
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    fontWeight: '500',
                    borderRadius: 'var(--border-radius-3)',
                  }}
                  isDisabled={false}
                >
                  {formatMessage(labels.login)}
                </FormSubmitButton>
              </FormButtons>
            </Column>
          </Form>

          <Row alignItems="center" gap="3">
            <div
              style={{
                flex: 1,
                height: '1px',
                backgroundColor: 'var(--base-color-200)',
              }}
            />
            <Text size="sm" color="muted">
              or
            </Text>
            <div
              style={{
                flex: 1,
                height: '1px',
                backgroundColor: 'var(--base-color-200)',
              }}
            />
          </Row>

          <Column alignItems="center" gap="3">
            <Row
              alignItems="center"
              justifyContent="center"
              gap="3"
              style={{
                width: '100%',
                padding: 'var(--spacing-3)',
                border: '1px solid var(--base-color-200)',
                borderRadius: 'var(--border-radius-3)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Text size="sm" style={{ fontWeight: '500' }}>
                Continue with SSO
              </Text>
            </Row>
          </Column>
        </Column>

        {/* Trust Badges */}
        <Row gap="6" style={{ marginTop: 'var(--spacing-8)' }}>
          <Row alignItems="center" gap="2">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#30a46c',
              }}
            />
            <Text size="sm" color="muted">
              GDPR Compliant
            </Text>
          </Row>
          <Row alignItems="center" gap="2">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#147af3',
              }}
            />
            <Text size="sm" color="muted">
              Self-hosted
            </Text>
          </Row>
          <Row alignItems="center" gap="2">
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#8b5cf6',
              }}
            />
            <Text size="sm" color="muted">
              Open Source
            </Text>
          </Row>
        </Row>
      </Column>

      {/* Footer */}
      <Row
        alignItems="center"
        justifyContent="center"
        style={{
          padding: 'var(--spacing-5)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Text size="sm" color="muted">
          © 2024 umami. All rights reserved.
        </Text>
      </Row>
    </Column>
  );
}
