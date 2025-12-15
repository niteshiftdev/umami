'use client';
import { LoginForm } from './LoginForm';
import styles from './LoginPage.module.css';

export function LoginPage() {
  return (
    <div className={styles.sithContainer}>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
}
