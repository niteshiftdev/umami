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
import styles from './V1_ModernGradient.module.css';

export function V1ModernGradientLogin() {
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
      {/* Animated background elements */}
      <div className={styles.background}>
        <div className={styles.blob1}></div>
        <div className={styles.blob2}></div>
        <div className={styles.blob3}></div>
      </div>

      {/* Main content */}
      <div className={styles.content}>
        <Column justifyContent="center" alignItems="center" gap="6">
          <div className={styles.logoWrapper}>
            <Icon size="lg">
              <Logo />
            </Icon>
          </div>
          <Heading className={styles.heading}>umami</Heading>
          <p className={styles.subtitle}>Analytics Simplified</p>

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
        </Column>
      </div>
    </div>
  );
}
