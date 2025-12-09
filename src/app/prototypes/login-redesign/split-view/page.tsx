'use client';
import { Column, Row, TextField, PasswordField, Form, FormField, FormSubmitButton, Icon, Text, Box, Heading } from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import styles from './SplitView.module.css';

export default function SplitViewLogin() {
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
    <div className={styles.container}>
      {/* Left Panel - Branding */}
      <div className={styles.brandingPanel}>
        <Column justifyContent="center" alignItems="flex-start" height="100%" gap="8" padding="12">
          <div className={styles.logoContainer}>
            <Icon size="lg">
              <Logo />
            </Icon>
          </div>
          <Column gap="4">
            <Heading className={styles.brandTitle}>umami</Heading>
            <Text className={styles.description}>
              Simple, fast, and privacy-focused analytics. No cookies. No tracking. No BS.
            </Text>
          </Column>
          <Column gap="2" className={styles.features}>
            <Row alignItems="flex-start" gap="3">
              <Text className={styles.checkmark}>✓</Text>
              <Text className={styles.feature}>Self-hosted, fully open source</Text>
            </Row>
            <Row alignItems="flex-start" gap="3">
              <Text className={styles.checkmark}>✓</Text>
              <Text className={styles.feature}>GDPR compliant, no data collection</Text>
            </Row>
            <Row alignItems="flex-start" gap="3">
              <Text className={styles.checkmark}>✓</Text>
              <Text className={styles.feature}>Real-time analytics dashboard</Text>
            </Row>
          </Column>
        </Column>
      </div>

      {/* Right Panel - Form */}
      <div className={styles.formPanel}>
        <Column justifyContent="center" alignItems="center" height="100%" gap="8" padding="8">
          <Column alignItems="center" gap="3">
            <Heading className={styles.formTitle}>Sign In</Heading>
            <Text className={styles.subtitle}>Enter your credentials to access your analytics</Text>
          </Column>

          <Box className={styles.formContainer}>
            <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
              <FormField
                label={formatMessage(labels.username)}
                data-test="input-username"
                name="username"
                rules={{ required: formatMessage(labels.required) }}
              >
                <TextField autoComplete="off" className={styles.input} />
              </FormField>
              <FormField
                label={formatMessage(labels.password)}
                data-test="input-password"
                name="password"
                rules={{ required: formatMessage(labels.required) }}
              >
                <PasswordField className={styles.input} />
              </FormField>
              <FormSubmitButton
                data-test="button-submit"
                variant="primary"
                className={styles.button}
              >
                {formatMessage(labels.login)}
              </FormSubmitButton>
            </Form>
          </Box>
        </Column>
      </div>
    </div>
  );
}
