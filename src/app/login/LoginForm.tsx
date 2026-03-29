import { useQueryClient } from '@tanstack/react-query';
import {
  Column,
  Form,
  FormButtons,
  FormField,
  FormSubmitButton,
  Heading,
  Icon,
  PasswordField,
  TextField,
} from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { Logo } from '@/components/svg';
import { setClientAuthToken } from '@/lib/client';
import { setUser } from '@/store/app';

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
    <Column
      justifyContent="center"
      alignItems="center"
      gap="6"
      style={{
        color: '#eeeeee',
      }}
    >
      <Icon size="lg" style={{ color: '#0090ff' }}>
        <Logo />
      </Icon>
      <Heading style={{ color: '#eeeeee', fontSize: '2.5rem', fontWeight: '700' }}>
        umami
      </Heading>
      <Form
        onSubmit={handleSubmit}
        error={getErrorMessage(error)}
        style={{
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #313131',
          minWidth: '320px',
        }}
      >
        <FormField
          label={formatMessage(labels.username)}
          data-test="input-username"
          name="username"
          rules={{ required: formatMessage(labels.required) }}
          style={{
            color: '#eeeeee',
          }}
        >
          <TextField
            autoComplete="username"
            style={{
              backgroundColor: '#222222',
              color: '#eeeeee',
              borderColor: '#313131',
              padding: '10px 12px',
            }}
          />
        </FormField>

        <FormField
          label={formatMessage(labels.password)}
          data-test="input-password"
          name="password"
          rules={{ required: formatMessage(labels.required) }}
          style={{
            color: '#eeeeee',
          }}
        >
          <PasswordField
            autoComplete="current-password"
            style={{
              backgroundColor: '#222222',
              color: '#eeeeee',
              borderColor: '#313131',
              padding: '10px 12px',
            }}
          />
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
      </Form>
    </Column>
  );
}
