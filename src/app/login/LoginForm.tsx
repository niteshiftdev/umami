import {
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  TextField,
  PasswordField,
  Column,
} from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import styles from './LoginPage.module.css';

export function LoginForm() {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async ({ token, user }) => {
        setClientAuthToken(token);
        setUser(user);

        // Seed React Query cache to prevent race condition
        queryClient.setQueryData(['login'], user);

        router.push('/websites');
      },
    });
  };

  return (
    <Column justifyContent="center" alignItems="center" gap="6">
      <div className={styles.sithLogo}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
          <path d="M50 30 L50 70 M30 50 L70 50" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </div>
      <h1 className={styles.sithTitle}>umami</h1>
      <p className={styles.sithSubtitle}>The Dark Side of Analytics</p>
      <div className={styles.formWrapper}>
        <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
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
              className={styles.submitButton}
            >
              {formatMessage(labels.login)}
            </FormSubmitButton>
          </FormButtons>
        </Form>
      </div>
      <p className={styles.quote}>"Peace is a lie. There is only passion."</p>
    </Column>
  );
}
