'use client';
import { Grid, Loading, Column, Row } from '@umami/react-zen';
import Script from 'next/script';
import { UpdateNotice } from './UpdateNotice';
import { SideNav } from '@/app/(main)/SideNav';
import { useLoginQuery, useConfig, useNavigation } from '@/components/hooks';
import { MobileNav } from '@/app/(main)/MobileNav';

export function App({ children }) {
  const { user, isLoading, error } = useLoginQuery();
  const config = useConfig();
  const { pathname, router } = useNavigation();

  console.log(`[App.tsx] Render`, {
    hasUser: !!user,
    userId: user?.id,
    isLoading,
    hasError: !!error,
    errorMessage: error?.message,
    hasConfig: !!config,
    pathname,
    isInIframe: typeof window !== 'undefined' && window.self !== window.top,
    cloudMode: process.env.cloudMode,
  });

  if (isLoading || !config) {
    console.log(`[App.tsx] Showing loading state`, { isLoading, hasConfig: !!config });
    return <Loading placement="absolute" />;
  }

  if (error) {
    console.error(`[App.tsx] Auth error detected - redirecting to login`, {
      error,
      errorStatus: error?.status,
      errorMessage: error?.message,
      cloudMode: process.env.cloudMode,
      willUseWindowLocation: !!process.env.cloudMode,
    });

    if (process.env.cloudMode) {
      console.log(`[App.tsx] Redirecting via window.location.href (cloudMode)`);
      window.location.href = '/login';
    } else {
      console.log(`[App.tsx] Redirecting via router.push`);
      router.push('/login');
    }
    return null;
  }

  if (!user || !config) {
    console.log(`[App.tsx] No user or config - returning null`, {
      hasUser: !!user,
      hasConfig: !!config,
    });
    return null;
  }

  console.log(`[App.tsx] Rendering app content for authenticated user`);



  return (
    <Grid
      columns={{ xs: '1fr', lg: 'auto 1fr' }}
      rows={{ xs: 'auto 1fr', lg: '1fr' }}
      height={{ xs: 'auto', lg: '100vh' }}
      width="100%"
    >
      <Row display={{ xs: 'flex', lg: 'none' }} alignItems="center" gap padding="3">
        <MobileNav />
      </Row>
      <Column display={{ xs: 'none', lg: 'flex' }}>
        <SideNav />
      </Column>
      <Column alignItems="center" overflowY="auto" overflowX="hidden" position="relative">
        {children}
      </Column>
      <UpdateNotice user={user} config={config} />
      {process.env.NODE_ENV === 'production' && !pathname.includes('/share/') && (
        <Script src={`${process.env.basePath || ''}/telemetry.js`} />
      )}
    </Grid>
  );
}
