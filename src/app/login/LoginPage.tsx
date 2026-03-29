'use client';
import { Column } from '@umami/react-zen';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  return (
    <Column
      alignItems="center"
      height="100vh"
      backgroundColor="#111111"
      paddingTop="12"
      style={{
        color: '#eeeeee',
        background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)'
      }}
    >
      <LoginForm />
    </Column>
  );
}
