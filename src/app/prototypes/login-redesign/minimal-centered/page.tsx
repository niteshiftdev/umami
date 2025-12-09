'use client';
import { Column, Row, TextField, PasswordField, Form, FormField, FormSubmitButton, Icon, Text, Box } from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import styles from './MinimalCentered.module.css';

export default function MinimalCenteredLogin() {
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
      <Column alignItems="center" gap="8">
        {/* Logo and Brand */}
        <Column alignItems="center" gap="4">
          <div className={styles.logoCircle}>
            <Icon size="lg">
              <Logo />
            </Icon>
          </div>
          <Text className={styles.brand}>umami</Text>
          <Text className={styles.tagline}>Analytics simplified</Text>
        </Column>

        {/* Form Container */}
        <div className={styles.formContainer}>
          <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
            <FormField
              label={formatMessage(labels.username)}
              data-test="input-username"
              name="username"
              rules={{ required: formatMessage(labels.required) }}
            >
              <TextField
                autoComplete="off"
                className={styles.input}
                placeholder="your-email@example.com"
              />
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

            <div className={styles.securityBadge}>
              <span className={styles.securityIcon}>🔒</span>
              <span>Your login is secure and encrypted</span>
            </div>
          </Form>
        </div>

        {/* Footer */}
        <Text className={styles.footer}>Self-hosted analytics for modern teams</Text>
      </Column>
    </div>
  );
}
