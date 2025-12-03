'use client';

import { Column } from '@umami/react-zen';
import { LoginForm } from '../../LoginForm';
import styles from './GradientMesh.module.css';

export default function GradientMeshLoginPage() {
  return (
    <div className={styles.container}>
      {/* Animated mesh background shapes */}
      <div className={styles.meshBackground}>
        <div className={styles.meshShape + ' ' + styles.shape1} />
        <div className={styles.meshShape + ' ' + styles.shape2} />
        <div className={styles.meshShape + ' ' + styles.shape3} />
        <div className={styles.meshShape + ' ' + styles.shape4} />
        <div className={styles.meshShape + ' ' + styles.shape5} />
      </div>

      {/* Overlay to darken background */}
      <div className={styles.overlay} />

      {/* Login form container */}
      <Column
        alignItems="center"
        justifyContent="center"
        height="100vh"
        className={styles.formContainer}
      >
        <LoginForm />
      </Column>
    </div>
  );
}
