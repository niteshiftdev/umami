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

export default function ElevatedCardLoginPage() {
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
      {/* Decorative background pattern */}
      <div className={styles.bgPattern}></div>

      <Column alignItems="center" gap="8" className={styles.pageContent}>
        {/* Top branding section */}
        <Column alignItems="center" gap="2">
          <Icon size="lg" className={styles.logo}>
            <Logo />
          </Icon>
          <Heading className={styles.brandTitle}>umami</Heading>
        </Column>

        {/* Main card */}
        <Column className={styles.card} gap="6">
          <Column gap="2" alignItems="center">
            <Heading className={styles.cardTitle}>Sign in</Heading>
            <Text className={styles.cardDescription}>
              Access your analytics dashboard
            </Text>
          </Column>

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
        </Column>

        {/* Feature cards below */}
        <Row gap="4" className={styles.statsRow}>
          <Column alignItems="center" gap="1" className={styles.stat}>
            <Text className={styles.statNumber}>1M+</Text>
            <Text className={styles.statLabel}>Events tracked daily</Text>
          </Column>
          <Column alignItems="center" gap="1" className={styles.stat}>
            <Text className={styles.statNumber}>99.9%</Text>
            <Text className={styles.statLabel}>Uptime SLA</Text>
          </Column>
          <Column alignItems="center" gap="1" className={styles.stat}>
            <Text className={styles.statNumber}>GDPR</Text>
            <Text className={styles.statLabel}>Fully compliant</Text>
          </Column>
        </Row>
      </Column>
    </Column>
  );
}
