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
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    await mutateAsync(data, {
      onSuccess: async ({ token, user }) => {
        setClientAuthToken(token);
        setUser(user);

        router.push('/websites');
      },
    });
  };

  return (
    <Column justifyContent="center" alignItems="center" gap="6">
      <div className={styles.crawlContainer}>
        <div className={styles.crawl}>
          <div className={styles.title}>
            UMAMI
          </div>
          <div className={styles.subtitle}>
            DATA ANALYTICS EMPIRE
          </div>
          <div className={styles.text}>
            May the metrics be with you.
            <br />
            <br />
            To access the Empire's secret analytics,
            you must authenticate yourself.
            <br />
            <br />
            Enter your credentials and prepare
            to unlock the power of data.
          </div>
        </div>
      </div>
      <Icon size="lg">
        <Logo />
      </Icon>
      <Heading className={styles.heading}>UMAMI</Heading>
      <Form onSubmit={handleSubmit} error={getErrorMessage(error)}>
        <FormField
          label={formatMessage(labels.username)}
          data-test="input-username"
          name="username"
          rules={{ required: formatMessage(labels.required) }}
        >
          <TextField autoComplete="off" placeholder="Rebel Alliance Member" />
        </FormField>
        <FormField
          label={formatMessage(labels.password)}
          data-test="input-password"
          name="password"
          rules={{ required: formatMessage(labels.required) }}
        >
          <PasswordField placeholder="Secret Passcode" />
        </FormField>
        <FormButtons>
          <FormSubmitButton
            data-test="button-submit"
            variant="primary"
            style={{ flex: 1 }}
            isDisabled={false}
            className={styles.submitButton}
          >
            {formatMessage(labels.login)} 🚀
          </FormSubmitButton>
        </FormButtons>
      </Form>
    </Column>
  );
}
