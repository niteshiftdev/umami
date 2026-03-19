import type { Metadata } from 'next';
import { Suspense } from 'react';
import { App } from './App';

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <App>{children}</App>
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Umami',
    default: 'Umami',
  },
};
