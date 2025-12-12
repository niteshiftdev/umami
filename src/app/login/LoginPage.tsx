'use client';
import { Column } from '@umami/react-zen';
import { LoginForm } from './LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <Column alignItems="center" height="100vh" className={styles.page}>
      <LoginForm />
    </Column>
  );
}
