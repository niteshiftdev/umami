'use client';
import { Column, Row, TextField, PasswordField, Form, FormField, FormSubmitButton, Icon, Text, Box, Heading } from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import styles from './FormForward.module.css';

export default function FormForwardLogin() {
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
      <Column alignItems="stretch" justifyContent="flex-start" height="100vh">
        {/* Header */}
        <div className={styles.header}>
          <Row alignItems="center" gap="3" padding="6">
            <Icon size="base">
              <Logo />
            </Icon>
            <Text className={styles.headerBrand}>umami</Text>
          </Row>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          <Column alignItems="center" justifyContent="center" height="100%" gap="10">
            {/* Hero Section */}
            <Column alignItems="center" gap="4" className={styles.heroSection}>
              <Heading className={styles.mainHeading}>Welcome back</Heading>
              <Text className={styles.supportingText}>
                Sign in to your analytics dashboard
              </Text>
            </Column>

            {/* Form Card */}
            <div className={styles.formCard}>
              <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
                <div className={styles.formGroup}>
                  <FormField
                    label={formatMessage(labels.username)}
                    data-test="input-username"
                    name="username"
                    rules={{ required: formatMessage(labels.required) }}
                    layout="vertical"
                  >
                    <TextField
                      autoComplete="username"
                      className={styles.largeInput}
                      placeholder="your-email@example.com"
                    />
                  </FormField>
                </div>

                <div className={styles.formGroup}>
                  <Row justifyContent="space-between" alignItems="flex-start" gap="4" className={styles.passwordHeader}>
                    <label className={styles.passwordLabel}>{formatMessage(labels.password)}</label>
                    <a href="#" className={styles.forgotLink}>Forgot?</a>
                  </Row>
                  <FormField
                    data-test="input-password"
                    name="password"
                    rules={{ required: formatMessage(labels.required) }}
                    layout="vertical"
                  >
                    <PasswordField
                      className={styles.largeInput}
                      autoComplete="current-password"
                    />
                  </FormField>
                </div>

                <FormSubmitButton
                  data-test="button-submit"
                  variant="primary"
                  className={styles.largeButton}
                >
                  {formatMessage(labels.login)}
                </FormSubmitButton>

                <div className={styles.securityNotice}>
                  <span>🔒</span>
                  <span className={styles.securityText}>Your login is secure and encrypted</span>
                </div>
              </Form>
            </div>

            {/* Trust Indicators */}
            <Row className={styles.trustRow} gap="6">
              <Column alignItems="center" gap="2">
                <Text className={styles.trustLabel}>Privacy First</Text>
                <Text className={styles.trustDescription}>No tracking cookies</Text>
              </Column>
              <div className={styles.divider} />
              <Column alignItems="center" gap="2">
                <Text className={styles.trustLabel}>Self-Hosted</Text>
                <Text className={styles.trustDescription}>Own your data</Text>
              </Column>
              <div className={styles.divider} />
              <Column alignItems="center" gap="2">
                <Text className={styles.trustLabel}>Open Source</Text>
                <Text className={styles.trustDescription}>Community built</Text>
              </Column>
            </Row>
          </Column>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Text className={styles.footerText}>
            © 2024 umami. All rights reserved.
          </Text>
        </div>
      </Column>
    </div>
  );
}
