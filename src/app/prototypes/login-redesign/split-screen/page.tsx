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

export default function SplitScreenLoginPage() {
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
    <Row style={{ minHeight: '100vh' }}>
      {/* Left Panel - Branding & Value Proposition */}
      <Column
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, var(--primary-color) 0%, #1a365d 100%)',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <Column gap="6" style={{ maxWidth: '480px' }}>
          <Row alignItems="center" gap="3">
            <Icon size="lg" style={{ color: 'white' }}>
              <Logo />
            </Icon>
            <Heading style={{ color: 'white', margin: 0 }}>umami</Heading>
          </Row>

          <Text size="4" style={{ color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.6 }}>
            Privacy-focused web analytics that gives you powerful insights without compromising your visitors&apos; data.
          </Text>

          <Column gap="4" style={{ marginTop: '2rem' }}>
            <Row alignItems="center" gap="3">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}>
                📊
              </div>
              <Column gap="1">
                <Text weight="bold" style={{ color: 'white' }}>Real-time Analytics</Text>
                <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Monitor your traffic as it happens
                </Text>
              </Column>
            </Row>

            <Row alignItems="center" gap="3">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}>
                🔒
              </div>
              <Column gap="1">
                <Text weight="bold" style={{ color: 'white' }}>Privacy First</Text>
                <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  GDPR compliant, no cookies required
                </Text>
              </Column>
            </Row>

            <Row alignItems="center" gap="3">
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
              }}>
                ⚡
              </div>
              <Column gap="1">
                <Text weight="bold" style={{ color: 'white' }}>Lightweight Script</Text>
                <Text size="1" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Under 2KB, no impact on performance
                </Text>
              </Column>
            </Row>
          </Column>
        </Column>
      </Column>

      {/* Right Panel - Login Form */}
      <Column
        alignItems="center"
        justifyContent="center"
        style={{
          flex: 1,
          backgroundColor: 'var(--base50)',
          padding: '3rem',
        }}
      >
        <Column gap="6" style={{ width: '100%', maxWidth: '360px' }}>
          <Column gap="2">
            <Heading size="3">Welcome back</Heading>
            <Text style={{ color: 'var(--base600)' }}>
              Sign in to access your analytics dashboard
            </Text>
          </Column>

          <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
            <FormField
              label={formatMessage(labels.username)}
              name="username"
              rules={{ required: formatMessage(labels.required) }}
            >
              <TextField autoComplete="off" placeholder="Enter your username" />
            </FormField>
            <FormField
              label={formatMessage(labels.password)}
              name="password"
              rules={{ required: formatMessage(labels.required) }}
            >
              <PasswordField placeholder="Enter your password" />
            </FormField>
            <FormButtons>
              <FormSubmitButton variant="primary" style={{ flex: 1 }}>
                {formatMessage(labels.login)}
              </FormSubmitButton>
            </FormButtons>
          </Form>

          <Text size="1" style={{ color: 'var(--base500)', textAlign: 'center' }}>
            Secure login powered by Umami Analytics
          </Text>
        </Column>
      </Column>
    </Row>
  );
}
