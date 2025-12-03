'use client';
import { Column } from '@umami/react-zen';
import { LoginForm } from './LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <div className={styles.starWarsContainer}>
      <div className={styles.stars}></div>
      <Column alignItems="center" height="100vh" backgroundColor="2" paddingTop="12">
        <LoginForm />
      </Column>
    </div>
  );
}
