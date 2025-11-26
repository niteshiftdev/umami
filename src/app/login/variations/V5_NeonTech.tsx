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
import styles from './V5_NeonTech.module.css';

export function V5NeonTechLogin() {
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
      {/* Animated background grid */}
      <div className={styles.background}>
        <div className={styles.gridBackground}></div>
        <div className={styles.codeBlock1}></div>
        <div className={styles.codeBlock2}></div>
        <div className={styles.codeBlock3}></div>
      </div>

      {/* Main card */}
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <Column justifyContent="center" alignItems="center" gap="6">
            <div className={styles.logoWrapper}>
              <div className={styles.glowRing}></div>
              <Icon size="lg">
                <Logo />
              </Icon>
            </div>
            <Heading className={styles.heading}>umami</Heading>
            <div className={styles.topBorder}></div>
            <p className={styles.subtitle}>// Enter Access Portal</p>

            <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
              <div className={styles.fieldWrapper}>
                <p className={styles.fieldLabel}>$ username</p>
                <FormField
                  label={formatMessage(labels.username)}
                  data-test="input-username"
                  name="username"
                  rules={{ required: formatMessage(labels.required) }}
                >
                  <TextField autoComplete="off" className={styles.input} />
                </FormField>
              </div>

              <div className={styles.fieldWrapper}>
                <p className={styles.fieldLabel}>$ password</p>
                <FormField
                  label={formatMessage(labels.password)}
                  data-test="input-password"
                  name="password"
                  rules={{ required: formatMessage(labels.required) }}
                >
                  <PasswordField className={styles.input} />
                </FormField>
              </div>

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

            <div className={styles.bottomBorder}></div>
            <p className={styles.statusText}>
              <span className={styles.statusDot}></span>
              System Online • Ready
            </p>
          </Column>
        </div>
      </div>
    </div>
  );
}
