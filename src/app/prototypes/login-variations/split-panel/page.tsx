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

export default function SplitPanelLoginPage() {
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
    <Row height="100vh" className={styles.container}>
      {/* Left panel - Hero/Value proposition */}
      <Column
        alignItems="center"
        justifyContent="center"
        className={styles.heroPanel}
      >
        <Column alignItems="center" gap="6" className={styles.heroContent}>
          <Icon size="xl" className={styles.heroLogo}>
            <Logo />
          </Icon>
          <Heading className={styles.heroTitle}>umami</Heading>
          <Text className={styles.heroDescription}>
            Privacy-focused analytics that respects your users
          </Text>

          {/* Feature highlights */}
          <Column gap="4" className={styles.features}>
            <Row gap="2" alignItems="flex-start">
              <div className={styles.checkmark}>✓</div>
              <Text className={styles.featureText}>No cookies, fully GDPR compliant</Text>
            </Row>
            <Row gap="2" alignItems="flex-start">
              <div className={styles.checkmark}>✓</div>
              <Text className={styles.featureText}>Real-time analytics dashboard</Text>
            </Row>
            <Row gap="2" alignItems="flex-start">
              <div className={styles.checkmark}>✓</div>
              <Text className={styles.featureText}>Lightweight, fast tracking script</Text>
            </Row>
          </Column>
        </Column>
      </Column>

      {/* Right panel - Login form */}
      <Column
        alignItems="center"
        justifyContent="center"
        className={styles.formPanel}
      >
        <Column gap="6" className={styles.formWrapper}>
          <Column gap="2">
            <Heading className={styles.formTitle}>Welcome back</Heading>
            <Text className={styles.formSubtitle}>Sign in to your account to continue</Text>
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

          <Text className={styles.legal}>
            By signing in, you agree to our Terms of Service
          </Text>
        </Column>
      </Column>
    </Row>
  );
}
