'use client';

import { useEffect, useRef, useState } from 'react';
import { Column } from '@umami/react-zen';
import { LoginForm } from '../../LoginForm';
import styles from './ParticleConstellation.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number;
  maxLife: number;
}

export default function ParticleConstellationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    const colors = ['#3e63dd', '#5b5bd6', '#0090ff', '#6e56cf'];

    const createParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          maxLife: 1,
        });
      }
      return particles;
    };

    particlesRef.current = createParticles();
    setIsInitialized(true);

    // Animation loop
    const animate = () => {
      // Clear canvas with slight fade effect for trails
      ctx.fillStyle = 'rgba(17, 17, 17, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Physics: drift with slow acceleration
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Boundary conditions - wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Draw particle with glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      // Draw connecting lines for constellation effect
      const connectionDistance = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            // Fade based on distance
            const opacity = Math.max(0, 1 - distance / connectionDistance) * 0.2;

            ctx.strokeStyle = `rgba(62, 99, 221, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <Column
        alignItems="center"
        height="100vh"
        className={styles.formContainer}
      >
        <div className={styles.formWrapper}>
          <LoginForm />
        </div>
      </Column>
    </div>
  );
}
