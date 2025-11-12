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
import { useQueryClient } from '@tanstack/react-query';
import { useMessages, useUpdateQuery } from '@/components/hooks';
import { setUser } from '@/store/app';
import { setClientAuthToken } from '@/lib/client';
import { Logo } from '@/components/svg';

export function LoginForm() {
  const { formatMessage, labels, getErrorMessage } = useMessages();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, error } = useUpdateQuery('/auth/login');

  const handleSubmit = async (data: any) => {
    console.log(`[LoginForm.tsx] handleSubmit called`, {
      username: data?.username,
      isInIframe: typeof window !== 'undefined' && window.self !== window.top,
    });

    await mutateAsync(data, {
      onSuccess: async ({ token, user }) => {
        console.log(`[LoginForm.tsx] onSuccess callback triggered`, {
          hasToken: !!token,
          hasUser: !!user,
          userId: user?.id,
          username: user?.username,
          isInIframe: typeof window !== 'undefined' && window.self !== window.top,
        });

        try {
          console.log(`[LoginForm.tsx] Step 1: Calling setClientAuthToken...`);
          setClientAuthToken(token);
          console.log(`[LoginForm.tsx] ✓ Step 1 complete: Token set`);
        } catch (error) {
          console.error(`[LoginForm.tsx] ✗ Step 1 FAILED: setClientAuthToken threw error`, error);
          throw error;
        }

        try {
          console.log(`[LoginForm.tsx] Step 2: Calling setUser...`);
          setUser(user);
          console.log(`[LoginForm.tsx] ✓ Step 2 complete: User set`);
        } catch (error) {
          console.error(`[LoginForm.tsx] ✗ Step 2 FAILED: setUser threw error`, error);
        }

        try {
          console.log(`[LoginForm.tsx] Step 3: Resetting 'login' query cache...`);
          // Reset the 'login' query to clear any stale error state
          queryClient.resetQueries({ queryKey: ['login'] });
          console.log(`[LoginForm.tsx] ✓ Step 3 complete: Query cache reset`);
        } catch (error) {
          console.error(`[LoginForm.tsx] ✗ Step 3 FAILED: queryClient.resetQueries threw error`, error);
        }

        try {
          console.log(`[LoginForm.tsx] Step 4: Calling router.push('/websites')...`);
          router.push('/websites');
          console.log(`[LoginForm.tsx] ✓ Step 4 complete: Navigation initiated`);
        } catch (error) {
          console.error(`[LoginForm.tsx] ✗ Step 4 FAILED: router.push threw error`, error);
        }

        console.log(`[LoginForm.tsx] onSuccess callback completed`);
      },
    });
  };

  return (
    <Column justifyContent="center" alignItems="center" gap="6">
      <Icon size="lg">
        <Logo />
      </Icon>
      <Heading>umami</Heading>
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
          >
            {formatMessage(labels.login)}
          </FormSubmitButton>
        </FormButtons>
      </Form>
    </Column>
  );
}
