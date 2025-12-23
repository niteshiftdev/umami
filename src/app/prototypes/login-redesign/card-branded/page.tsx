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

export default function CardBrandedLoginPage() {
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
        backgroundColor: 'var(--base900)',
        padding: '1.5rem',
      }}
    >
      {/* Main Card */}
      <Column
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header Section with Gradient */}
        <Column
          alignItems="center"
          gap="3"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, #4f46e5 100%)',
            padding: '2.5rem 2rem',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Icon size="lg" style={{ color: 'white' }}>
              <Logo />
            </Icon>
          </div>
          <Heading size="2" style={{ color: 'white', margin: 0 }}>
            umami
          </Heading>
          <Text style={{ color: 'rgba(255, 255, 255, 0.85)', textAlign: 'center' }}>
            Privacy-focused web analytics
          </Text>
        </Column>

        {/* Form Section */}
        <Column gap="6" style={{ padding: '2rem' }}>
          <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
            <FormField
              label={formatMessage(labels.username)}
              name="username"
              rules={{ required: formatMessage(labels.required) }}
            >
              <TextField autoComplete="off" />
            </FormField>
            <FormField
              label={formatMessage(labels.password)}
              name="password"
              rules={{ required: formatMessage(labels.required) }}
            >
              <PasswordField />
            </FormField>
            <FormButtons style={{ marginTop: '0.5rem' }}>
              <FormSubmitButton
                variant="primary"
                style={{
                  flex: 1,
                  height: '44px',
                  fontWeight: 600,
                }}
              >
                {formatMessage(labels.login)}
              </FormSubmitButton>
            </FormButtons>
          </Form>

          {/* Trust Indicators */}
          <Column gap="3" style={{ paddingTop: '1rem', borderTop: '1px solid var(--base200)' }}>
            <Row justifyContent="center" gap="6">
              <Column alignItems="center" gap="1">
                <Text size="3" weight="bold" style={{ color: 'var(--primary-color)' }}>
                  100K+
                </Text>
                <Text size="0" style={{ color: 'var(--base500)' }}>
                  Active Users
                </Text>
              </Column>
              <Column alignItems="center" gap="1">
                <Text size="3" weight="bold" style={{ color: 'var(--primary-color)' }}>
                  50M+
                </Text>
                <Text size="0" style={{ color: 'var(--base500)' }}>
                  Events/Day
                </Text>
              </Column>
              <Column alignItems="center" gap="1">
                <Text size="3" weight="bold" style={{ color: 'var(--primary-color)' }}>
                  99.9%
                </Text>
                <Text size="0" style={{ color: 'var(--base500)' }}>
                  Uptime
                </Text>
              </Column>
            </Row>
          </Column>
        </Column>
      </Column>

      {/* Footer */}
      <Row gap="4" style={{ marginTop: '2rem' }}>
        <Text size="1" style={{ color: 'var(--base500)' }}>
          Open Source
        </Text>
        <Text size="1" style={{ color: 'var(--base600)' }}>
          •
        </Text>
        <Text size="1" style={{ color: 'var(--base500)' }}>
          Self-Hosted
        </Text>
        <Text size="1" style={{ color: 'var(--base600)' }}>
          •
        </Text>
        <Text size="1" style={{ color: 'var(--base500)' }}>
          GDPR Ready
        </Text>
      </Row>
    </Column>
  );
}
