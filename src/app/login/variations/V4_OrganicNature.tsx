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
import styles from './V4_OrganicNature.module.css';

export function V4OrganicNatureLogin() {
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
      {/* Organic background shapes */}
      <div className={styles.background}>
        <svg className={styles.waveTop} viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,60 Q300,0 600,60 T1200,60 L1200,0 L0,0 Z"
            fill="rgba(76, 175, 80, 0.1)"
          ></path>
        </svg>

        <div className={styles.leaf1}></div>
        <div className={styles.leaf2}></div>
        <div className={styles.leaf3}></div>
        <div className={styles.flower}></div>

        <svg className={styles.waveBottom} viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,60 Q300,120 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="rgba(76, 175, 80, 0.08)"
          ></path>
        </svg>
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
          <p className={styles.subtitle}>Grow Your Insights</p>

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
