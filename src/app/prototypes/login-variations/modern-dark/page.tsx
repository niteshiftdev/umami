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
  Heading,
  Text,
} from '@umami/react-zen';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import styles from './page.module.css';

export default function ModernDarkLoginPage() {
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
    <Column
      alignItems="center"
      justifyContent="center"
      height="100vh"
      className={styles.container}
    >
      {/* Background gradient effect */}
      <div className={styles.bgGradient}></div>

      <Column alignItems="center" gap="8" className={styles.formWrapper}>
        {/* Header with logo and branding */}
        <Column alignItems="center" gap="3">
          <Icon size="lg" className={styles.logo}>
            <Logo />
          </Icon>
          <Heading className={styles.title}>umami</Heading>
          <Text className={styles.subtitle}>Analytics simplified</Text>
        </Column>

        {/* Login form */}
        <Form onSubmit={handleSubmit} error={getErrorMessage(error)} className={styles.form}>
          <FormField
            label={formatMessage(labels.username)}
            data-test="input-username"
            name="username"
            rules={{ required: formatMessage(labels.required) }}
          >
            <TextField className={styles.input} autoComplete="off" />
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
              className={styles.submitButton}
              isDisabled={false}
            >
              {formatMessage(labels.login)}
            </FormSubmitButton>
          </FormButtons>
        </Form>

        {/* Footer text */}
        <Text className={styles.footerText}>
          Secure analytics platform for your website
        </Text>
      </Column>
    </Column>
  );
}
