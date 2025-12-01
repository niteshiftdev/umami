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
import { Logo, BarChart, Visitor, Website } from '@/components/svg';

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
      {/* Left Panel - Branding & Illustration */}
      <Column
        alignItems="center"
        justifyContent="center"
        gap="8"
        style={{
          flex: 1,
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          padding: 'var(--spacing-8)',
          display: 'none',
        }}
        className="split-screen-left"
      >
        <style>{`
          @media (min-width: 768px) {
            .split-screen-left {
              display: flex !important;
            }
          }
        `}</style>
        <Column alignItems="center" gap="4">
          <Row
            alignItems="center"
            justifyContent="center"
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: 'rgba(20, 122, 243, 0.15)',
              borderRadius: 'var(--border-radius-4)',
              border: '2px solid rgba(20, 122, 243, 0.3)',
            }}
          >
            <Icon size="xl" style={{ color: '#147af3' }}>
              <Logo />
            </Icon>
          </Row>
          <Column alignItems="center" gap="2">
            <Heading size="4" style={{ color: 'white' }}>
              umami
            </Heading>
            <Text style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
              Privacy-focused analytics for modern websites
            </Text>
          </Column>
        </Column>

        {/* Feature Highlights */}
        <Column gap="5" style={{ maxWidth: '320px' }}>
          <Row gap="4" alignItems="flex-start">
            <Row
              alignItems="center"
              justifyContent="center"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(48, 164, 108, 0.15)',
                borderRadius: 'var(--border-radius-3)',
                flexShrink: 0,
              }}
            >
              <Icon style={{ color: '#30a46c' }}>
                <BarChart />
              </Icon>
            </Row>
            <Column gap="1">
              <Text style={{ color: 'white', fontWeight: '600' }}>Real-time Analytics</Text>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Track visitors, pageviews, and events as they happen
              </Text>
            </Column>
          </Row>

          <Row gap="4" alignItems="flex-start">
            <Row
              alignItems="center"
              justifyContent="center"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                borderRadius: 'var(--border-radius-3)',
                flexShrink: 0,
              }}
            >
              <Icon style={{ color: '#8b5cf6' }}>
                <Visitor />
              </Icon>
            </Row>
            <Column gap="1">
              <Text style={{ color: 'white', fontWeight: '600' }}>Privacy First</Text>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                GDPR compliant, no cookies required
              </Text>
            </Column>
          </Row>

          <Row gap="4" alignItems="flex-start">
            <Row
              alignItems="center"
              justifyContent="center"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(20, 122, 243, 0.15)',
                borderRadius: 'var(--border-radius-3)',
                flexShrink: 0,
              }}
            >
              <Icon style={{ color: '#147af3' }}>
                <Website />
              </Icon>
            </Row>
            <Column gap="1">
              <Text style={{ color: 'white', fontWeight: '600' }}>Multi-site Support</Text>
              <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Monitor all your websites from one dashboard
              </Text>
            </Column>
          </Row>
        </Column>

        {/* Stats Preview */}
        <Row gap="6" style={{ marginTop: 'var(--spacing-4)' }}>
          <Column alignItems="center">
            <Text size="lg" style={{ color: '#147af3', fontWeight: '700' }}>
              50K+
            </Text>
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Installations
            </Text>
          </Column>
          <Column alignItems="center">
            <Text size="lg" style={{ color: '#30a46c', fontWeight: '700' }}>
              18K+
            </Text>
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              GitHub Stars
            </Text>
          </Column>
          <Column alignItems="center">
            <Text size="lg" style={{ color: '#8b5cf6', fontWeight: '700' }}>
              100%
            </Text>
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Open Source
            </Text>
          </Column>
        </Row>
      </Column>

      {/* Right Panel - Login Form */}
      <Column
        alignItems="center"
        justifyContent="center"
        style={{
          flex: 1,
          backgroundColor: 'var(--base-color-50)',
          padding: 'var(--spacing-8)',
          minWidth: '360px',
        }}
      >
        <Column alignItems="center" gap="8" style={{ width: '100%', maxWidth: '360px' }}>
          {/* Mobile Logo - only visible on small screens */}
          <Row
            alignItems="center"
            gap="3"
            style={{ marginBottom: 'var(--spacing-4)' }}
            className="mobile-logo"
          >
            <style>{`
              @media (min-width: 768px) {
                .mobile-logo {
                  display: none !important;
                }
              }
            `}</style>
            <Icon size="md" style={{ color: 'var(--primary-color)' }}>
              <Logo />
            </Icon>
            <Heading size="2">umami</Heading>
          </Row>

          <Column alignItems="center" gap="2">
            <Heading size="3">Sign in to your account</Heading>
            <Text color="muted">Enter your credentials to continue</Text>
          </Column>

          <Form onSubmit={handleSubmit} error={getErrorMessage(error)} style={{ width: '100%' }}>
            <Column gap="5">
              <FormField
                label={formatMessage(labels.username)}
                data-test="input-username"
                name="username"
                rules={{ required: formatMessage(labels.required) }}
              >
                <TextField autoComplete="off" placeholder="admin" />
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

          <Column alignItems="center" gap="4" style={{ marginTop: 'var(--spacing-4)' }}>
            <Row
              style={{
                width: '100%',
                height: '1px',
                background:
                  'linear-gradient(to right, transparent, var(--base-color-300), transparent)',
              }}
            />
            <Text size="sm" color="muted">
              Secure, self-hosted analytics
            </Text>
          </Column>
        </Column>
      </Column>
    </Row>
  );
}
