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
  Text,
  Heading,
} from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import { useQueryClient } from '@tanstack/react-query';
import styles from './centered-card.module.css';

export default function CenteredCardLoginPage() {
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
      backgroundColor="2"
      padding="8"
      className={styles.container}
    >
      <Column
        gap="8"
        width="100%"
        maxWidth="420px"
        className={styles.card}
        padding="8"
      >
        {/* Header Section */}
        <Column alignItems="center" gap="4">
          <div className={styles.logoContainer}>
            <Icon size="lg">
              <Logo />
            </Icon>
          </div>
          <Column alignItems="center" gap="1">
            <Heading size="md">Sign In</Heading>
            <Text size="sm" color="8">
              Enter your credentials to access your account
            </Text>
          </Column>
        </Column>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Form Section */}
        <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
          <Column gap="5">
            <FormField
              label={formatMessage(labels.username)}
              data-test="input-username"
              name="username"
              rules={{ required: formatMessage(labels.required) }}
            >
              <TextField
                autoComplete="off"
                placeholder="admin@example.com"
              />
            </FormField>
            <FormField
              label={formatMessage(labels.password)}
              data-test="input-password"
              name="password"
              rules={{ required: formatMessage(labels.required) }}
            >
              <PasswordField placeholder="Enter your password" />
            </FormField>
            <FormButtons>
              <FormSubmitButton
                data-test="button-submit"
                variant="primary"
                style={{ flex: 1 }}
                isDisabled={false}
              >
                {formatMessage(labels.login)}
              </FormSubmitButton>
            </FormButtons>
          </Column>
        </Form>

        {/* Footer */}
        <Row justifyContent="center" padding="3" gap="2">
          <Text size="xs" color="9">
            © 2024 Umami Analytics
          </Text>
        </Row>
      </Column>
    </Column>
  );
}
