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
  Text,
  Heading,
} from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import { useQueryClient } from '@tanstack/react-query';

export default function SplitPanelLoginPage() {
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
    <Row height="100vh" backgroundColor="2">
      {/* Left Panel - Branding */}
      <Column
        flex="1"
        alignItems="center"
        justifyContent="center"
        backgroundColor="1"
        padding="8"
      >
        <Column gap="6" maxWidth="400px">
          <Column gap="4">
            <Heading size="lg">Welcome to Umami</Heading>
            <Text size="md" color="7">
              Privacy-focused web analytics. Simple, fast, and reliable insights without external dependencies.
            </Text>
          </Column>
          <Column gap="3">
            <Row gap="3">
              <Text size="sm" color="8">✓</Text>
              <Text size="sm">GDPR & CCPA compliant</Text>
            </Row>
            <Row gap="3">
              <Text size="sm" color="8">✓</Text>
              <Text size="sm">No cookies or tracking pixels</Text>
            </Row>
            <Row gap="3">
              <Text size="sm" color="8">✓</Text>
              <Text size="sm">Real-time analytics</Text>
            </Row>
          </Column>
        </Column>
      </Column>

      {/* Right Panel - Login Form */}
      <Column
        flex="1"
        alignItems="center"
        justifyContent="center"
        padding="8"
      >
        <Column gap="8" width="100%" maxWidth="320px">
          {/* Logo Section */}
          <Column alignItems="center" gap="2">
            <Icon size="lg">
              <Logo />
            </Icon>
            <Text size="sm" color="8">Sign in to your account</Text>
          </Column>

          {/* Form Section */}
          <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
            <Column gap="5">
              <FormField
                label={formatMessage(labels.username)}
                data-test="input-username"
                name="username"
                rules={{ required: formatMessage(labels.required) }}
              >
                <TextField autoComplete="off" />
              </FormField>
              <FormField
                label={formatMessage(labels.password)}
                data-test="input-password"
                name="password"
                rules={{ required: formatMessage(labels.required) }}
              >
                <PasswordField />
              </FormField>
              <FormButtons>
                <FormSubmitButton
                  data-test="button-submit"
                  variant="primary"
                  style={{ flex: 1 }}
                  isDisabled={false}
                >
                  {formatMessage(labels.login)}
                </FormSubmitButton>
              </FormButtons>
            </Column>
          </Form>
        </Column>
      </Column>
    </Row>
  );
}
