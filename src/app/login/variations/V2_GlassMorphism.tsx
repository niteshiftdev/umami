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
import styles from './V2_GlassMorphism.module.css';

export function V2GlassMorphismLogin() {
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
      {/* Dark background */}
      <div className={styles.background}></div>

      {/* Grid pattern overlay */}
      <div className={styles.gridPattern}></div>

      {/* Floating particles */}
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Glass card */}
      <div className={styles.glassCard}>
        <Column justifyContent="center" alignItems="center" gap="6">
          <div className={styles.logoWrapper}>
            <Icon size="lg">
              <Logo />
            </Icon>
          </div>
          <Heading className={styles.heading}>umami</Heading>
          <div className={styles.divider}></div>
          <p className={styles.subtitle}>Enterprise Analytics</p>

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

          <p className={styles.footer}>Secure • Private • Fast</p>
        </Column>
      </div>
    </div>
  );
}
