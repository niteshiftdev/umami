'use client';
import { Grid, Loading, Column, Row } from '@umami/react-zen';
import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { UpdateNotice } from './UpdateNotice';
import { SideNav } from '@/app/(main)/SideNav';
import { useLoginQuery, useConfig, useNavigation } from '@/components/hooks';
import { MobileNav } from '@/app/(main)/MobileNav';
import { useDynamicVariant } from '@niteshift/dials';

export function App({ children }) {
  const { user, isLoading, error } = useLoginQuery();
  const config = useConfig();
  const { pathname, router } = useNavigation();

  // Theme Selection
  const theme = useDynamicVariant('theme', {
    label: 'Theme',
    description: 'Choose a color theme for the dashboard',
    default: 'default',
    options: [
      'default',
      'tokyo-night',
      'dracula',
      'nord',
      'solarized-dark',
      'solarized-light',
      'monokai',
      'github-dark',
      'github-light',
      'catppuccin',
    ] as const,
    group: 'Appearance',
  });

  // Background Animation Style
  const backgroundAnimation = useDynamicVariant('background-animation', {
    label: 'Background Animation',
    description: 'Add animated backgrounds to the dashboard',
    default: 'none',
    options: [
      'none',
      'gradient-wave',
      'particles',
      'mesh-gradient',
      'aurora',
      'grid-lines',
      'floating-orbs',
      'matrix',
      'stars',
    ] as const,
    group: 'Appearance',
  });

  // Language Selection
  const language = useDynamicVariant('language', {
    label: 'Language',
    description: 'Choose display language',
    default: 'en',
    options: [
      'en',
      'es',
      'fr',
      'de',
      'ja',
      'zh',
      'ko',
      'pt',
      'ru',
      'ar',
      'hi',
      'it',
    ] as const,
    group: 'Appearance',
  });

  // Theme color palettes
  const themeColors = {
    default: {
      background: 'transparent',
      text: 'inherit',
      primary: 'inherit',
      secondary: 'inherit',
    },
    'tokyo-night': {
      background: '#1a1b26',
      text: '#c0caf5',
      primary: '#7aa2f7',
      secondary: '#bb9af7',
      accent: '#f7768e',
    },
    dracula: {
      background: '#282a36',
      text: '#f8f8f2',
      primary: '#bd93f9',
      secondary: '#ff79c6',
      accent: '#50fa7b',
    },
    nord: {
      background: '#2e3440',
      text: '#eceff4',
      primary: '#88c0d0',
      secondary: '#81a1c1',
      accent: '#8fbcbb',
    },
    'solarized-dark': {
      background: '#002b36',
      text: '#839496',
      primary: '#268bd2',
      secondary: '#2aa198',
      accent: '#b58900',
    },
    'solarized-light': {
      background: '#fdf6e3',
      text: '#657b83',
      primary: '#268bd2',
      secondary: '#2aa198',
      accent: '#b58900',
    },
    monokai: {
      background: '#272822',
      text: '#f8f8f2',
      primary: '#66d9ef',
      secondary: '#a6e22e',
      accent: '#f92672',
    },
    'github-dark': {
      background: '#0d1117',
      text: '#c9d1d9',
      primary: '#58a6ff',
      secondary: '#79c0ff',
      accent: '#f85149',
    },
    'github-light': {
      background: '#ffffff',
      text: '#24292f',
      primary: '#0969da',
      secondary: '#1f883d',
      accent: '#cf222e',
    },
    catppuccin: {
      background: '#1e1e2e',
      text: '#cdd6f4',
      primary: '#89b4fa',
      secondary: '#cba6f7',
      accent: '#f38ba8',
    },
  };

  const currentTheme = themeColors[theme];

  // Background animation component
  const BackgroundAnimation = () => {
    if (backgroundAnimation === 'none') return null;

    const animationStyles: Record<string, React.CSSProperties> = {
      'gradient-wave': {
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(45deg, ${currentTheme.primary || '#3e63dd'}, ${currentTheme.secondary || '#30a46c'})`,
        backgroundSize: '400% 400%',
        animation: 'gradientWave 15s ease infinite',
        opacity: 0.1,
        zIndex: 0,
        pointerEvents: 'none',
      },
      particles: {
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle, ${currentTheme.primary || '#3e63dd'} 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        animation: 'particlesFloat 20s linear infinite',
        opacity: 0.15,
        zIndex: 0,
        pointerEvents: 'none',
      },
      'mesh-gradient': {
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(at 20% 30%, ${currentTheme.primary || '#3e63dd'} 0%, transparent 50%),
                     radial-gradient(at 80% 70%, ${currentTheme.secondary || '#30a46c'} 0%, transparent 50%),
                     radial-gradient(at 50% 50%, ${currentTheme.accent || '#f7768e'} 0%, transparent 50%)`,
        backgroundSize: '200% 200%',
        animation: 'meshMove 20s ease infinite',
        opacity: 0.2,
        zIndex: 0,
        pointerEvents: 'none',
      },
      aurora: {
        position: 'fixed',
        inset: 0,
        background: `linear-gradient(135deg, ${currentTheme.primary || '#3e63dd'}, ${currentTheme.secondary || '#30a46c'}, ${currentTheme.accent || '#f7768e'})`,
        backgroundSize: '400% 400%',
        animation: 'aurora 25s ease infinite',
        opacity: 0.15,
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none',
      },
      'grid-lines': {
        position: 'fixed',
        inset: 0,
        backgroundImage: `linear-gradient(${currentTheme.primary || '#3e63dd'} 1px, transparent 1px),
                          linear-gradient(90deg, ${currentTheme.primary || '#3e63dd'} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        animation: 'gridScroll 15s linear infinite',
        opacity: 0.1,
        zIndex: 0,
        pointerEvents: 'none',
      },
      'floating-orbs': {
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle at 30% 40%, ${currentTheme.primary || '#3e63dd'} 0%, transparent 40%),
                     radial-gradient(circle at 70% 60%, ${currentTheme.secondary || '#30a46c'} 0%, transparent 40%),
                     radial-gradient(circle at 50% 80%, ${currentTheme.accent || '#f7768e'} 0%, transparent 40%)`,
        animation: 'orbsFloat 18s ease-in-out infinite',
        opacity: 0.2,
        filter: 'blur(40px)',
        zIndex: 0,
        pointerEvents: 'none',
      },
      matrix: {
        position: 'fixed',
        inset: 0,
        background: `repeating-linear-gradient(0deg, ${currentTheme.primary || '#3e63dd'} 0px, transparent 2px, transparent 4px)`,
        animation: 'matrixRain 10s linear infinite',
        opacity: 0.08,
        zIndex: 0,
        pointerEvents: 'none',
      },
      stars: {
        position: 'fixed',
        inset: 0,
        background: `radial-gradient(circle, ${currentTheme.text || '#fff'} 1px, transparent 1px)`,
        backgroundSize: '100px 100px',
        animation: 'starsTwinkle 5s ease-in-out infinite',
        opacity: 0.3,
        zIndex: 0,
        pointerEvents: 'none',
      },
    };

    return <div style={animationStyles[backgroundAnimation] || {}} />;
  };

  // Avoid navigation during render; perform redirect after commit.
  const redirectedRef = useRef(false);
  useEffect(() => {
    if (redirectedRef.current) return;
    if (isLoading) return;
    if (error) {
      redirectedRef.current = true;
      if (process.env.cloudMode) {
        window.location.assign('/login');
      } else {
        router.replace('/login');
      }
    }
  }, [isLoading, error, router]);

  if (isLoading || !config) {
    return <Loading placement="absolute" />;
  }

  if (error) {
    // Navigation handled in effect to prevent React warning in dev.
    return null;
  }

  if (!user || !config) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <BackgroundAnimation />
      <style jsx>{`
        @keyframes gradientWave {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes particlesFloat {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100px);
          }
        }
        @keyframes meshMove {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes aurora {
          0%,
          100% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 50% 100%;
          }
          50% {
            background-position: 100% 50%;
          }
          75% {
            background-position: 50% 0%;
          }
        }
        @keyframes gridScroll {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }
        @keyframes orbsFloat {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.9);
          }
        }
        @keyframes matrixRain {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(40px);
          }
        }
        @keyframes starsTwinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
      <Grid
        columns={{ xs: '1fr', lg: 'auto 1fr' }}
        rows={{ xs: 'auto 1fr', lg: '1fr' }}
        height={{ xs: 'auto', lg: '100vh' }}
        width="100%"
        style={{ position: 'relative', zIndex: 1 }}
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
    </div>
  );
}
