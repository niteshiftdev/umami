'use client';

import { CSSProperties } from 'react';
import { Column } from '@umami/react-zen';
import { LoginForm } from '../../LoginForm';
import styles from './page.module.css';

// SVG Blob Component with animated morphing paths
const AnimatedBlob = ({
  id,
  cx,
  cy,
  size,
  duration,
  delay,
  opacity,
}: {
  id: string;
  cx: number;
  cy: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}) => {
  const paths = [
    // Blob 1
    'M150,100 C200,50 300,75 300,150 C300,200 250,280 150,300 C75,310 50,250 50,150 C50,75 100,50 150,100 Z',
    // Blob 2
    'M160,120 C210,70 310,90 320,170 C330,240 260,300 140,320 C60,330 30,270 40,140 C50,60 110,80 160,120 Z',
    // Blob 3
    'M140,110 C190,60 290,80 290,160 C290,210 240,290 140,310 C70,325 40,260 60,130 C80,50 90,40 140,110 Z',
  ];

  return (
    <svg
      className={styles.blob}
      style={{
        position: 'absolute',
        left: `${cx}%`,
        top: `${cy}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: opacity,
        animationDelay: `${delay}s`,
        transform: 'translate(-50%, -50%)',
      }}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f76b15', stopOpacity: 0.6 }} />
          <stop offset="50%" style={{ stopColor: '#ffc53d', stopOpacity: 0.4 }} />
          <stop offset="100%" style={{ stopColor: '#e5484d', stopOpacity: 0.3 }} />
        </linearGradient>
        <filter id={`blur-${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>
      <path
        d={paths[Number(id.split('-')[1]) % paths.length]}
        fill={`url(#gradient-${id})`}
        filter={`url(#blur-${id})`}
        style={{
          animation: `morph-${id} ${duration}s ease-in-out infinite`,
          transformOrigin: 'center',
        }}
      />
      <style>{`
        @keyframes morph-${id} {
          0% {
            d: path('${paths[0]}');
            transform: scale(1) rotate(0deg);
          }
          25% {
            d: path('${paths[1]}');
            transform: scale(1.05) rotate(-15deg);
          }
          50% {
            d: path('${paths[2]}');
            transform: scale(0.95) rotate(10deg);
          }
          75% {
            d: path('${paths[1]}');
            transform: scale(1.08) rotate(-8deg);
          }
          100% {
            d: path('${paths[0]}');
            transform: scale(1) rotate(0deg);
          }
        }
      `}</style>
    </svg>
  );
};

// Background container with blobs
const BlobBackground = () => {
  return (
    <div className={styles.blobContainer}>
      <AnimatedBlob id="blob-0" cx={15} cy={20} size={280} duration={8} delay={0} opacity={0.7} />
      <AnimatedBlob id="blob-1" cx={85} cy={75} size={320} duration={10} delay={1} opacity={0.5} />
      <AnimatedBlob id="blob-2" cx={50} cy={85} size={250} duration={9} delay={2} opacity={0.4} />
    </div>
  );
};

// Glassmorphism card wrapper
const GlassmorphismCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.glassmorphismCard}>
      {children}
    </div>
  );
};

export default function FluidBlobLoginPage() {
  return (
    <div className={styles.pageContainer}>
      <BlobBackground />
      <Column alignItems="center" height="100vh" paddingTop="12" className={styles.content}>
        <GlassmorphismCard>
          <LoginForm />
        </GlassmorphismCard>
      </Column>
    </div>
  );
}
