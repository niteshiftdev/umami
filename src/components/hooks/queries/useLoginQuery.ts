import { useApp, setUser } from '@/store/app';
import { useApi } from '../useApi';

const selector = (state: { user: any }) => state.user;

export function useLoginQuery() {
  const { post, useQuery } = useApi();
  const user = useApp(selector);

  console.log(`[useLoginQuery.ts] Hook initialized`, {
    hasExistingUser: !!user,
    userId: user?.id,
    queryWillRun: !user,
  });

  const query = useQuery({
    queryKey: ['login'],
    queryFn: async () => {
      console.log(`[useLoginQuery.ts] queryFn called - verifying auth with /auth/verify`);

      try {
        const data = await post('/auth/verify');
        console.log(`[useLoginQuery.ts] ✓ /auth/verify SUCCESS`, {
          hasData: !!data,
          userId: data?.id,
          username: data?.username,
        });

        setUser(data);
        console.log(`[useLoginQuery.ts] ✓ setUser completed`);

        return data;
      } catch (error) {
        console.error(`[useLoginQuery.ts] ✗ /auth/verify FAILED`, {
          error,
          errorStatus: error?.status,
          errorMessage: error?.message,
        });
        throw error;
      }
    },
    enabled: !user,
  });

  console.log(`[useLoginQuery.ts] Query state:`, {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    hasData: !!query.data,
  });

  return { user, setUser, ...query };
}
