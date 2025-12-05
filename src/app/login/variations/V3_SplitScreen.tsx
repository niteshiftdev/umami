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
} from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import styles from './V3_SplitScreen.module.css';

export function V3SplitScreenLogin() {
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
      {/* Left side - Brand showcase */}
      <div className={styles.leftPanel}>
        <div className={styles.content}>
          <h1 className={styles.brandTitle}>umami</h1>
          <p className={styles.brandSubtitle}>Simple • Elegant • Powerful</p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📊</span>
              <span className={styles.featureText}>Real-time Analytics</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔒</span>
              <span className={styles.featureText}>Privacy First</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <span className={styles.featureText}>Lightning Fast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <Column justifyContent="center" alignItems="center" gap="6">
            <div className={styles.logoWrapper}>
              <Icon size="lg">
                <Logo />
              </Icon>
            </div>
            <Heading className={styles.heading}>Sign In</Heading>
            <p className={styles.formSubtitle}>Access your analytics dashboard</p>

            <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
              <FormField
                label={formatMessage(labels.username)}
                data-test="input-username"
                name="username"
                rules={{ required: formatMessage(labels.required) }}
              >
                <TextField autoComplete="off" className={styles.input} placeholder="username" />
              </FormField>
              <FormField
                label={formatMessage(labels.password)}
                data-test="input-password"
                name="password"
                rules={{ required: formatMessage(labels.required) }}
              >
                <PasswordField className={styles.input} placeholder="••••••••" />
              </FormField>
              <FormButtons>
                <FormSubmitButton
                  data-test="button-submit"
                  variant="primary"
                  style={{ flex: 1 }}
                  isDisabled={false}
                  className={styles.submitButton}
                >
                  {formatMessage(labels.login)}
                </FormSubmitButton>
              </FormButtons>
            </Form>

            <div className={styles.divider}></div>
            <p className={styles.helpText}>Don't have an account? Contact support</p>
          </Column>
        </div>
      </div>
    </div>
  );
}
