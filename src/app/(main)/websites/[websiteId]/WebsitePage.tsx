'use client';
import { Column } from '@umami/react-zen';
import { Panel } from '@/components/common/Panel';
import { WebsiteChart } from './WebsiteChart';
import { WebsiteMetricsBar } from './WebsiteMetricsBar';
import { WebsitePanels } from './WebsitePanels';
import { WebsiteControls } from './WebsiteControls';
import { ExpandedViewModal } from '@/app/(main)/websites/[websiteId]/ExpandedViewModal';
import { useDynamicVariant, useDynamicColor } from '@niteshift/dials';
import { createContext } from 'react';

export const TypographyContext = createContext<{
  metricLabelSize?: string;
  metricValueSize?: string;
  metricLabelWeight?: string;
  metricValueWeight?: string;
  metricLabelColor?: string;
  metricValueColor?: string;
  sectionHeadingSize?: string;
  sectionHeadingWeight?: string;
  sectionHeadingColor?: string;
}>({});

export function WebsitePage({ websiteId }: { websiteId: string }) {
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

  // Page Layout Preset
  const pageLayout = useDynamicVariant('page-layout', {
    label: 'Page Layout',
    description: 'Choose different arrangements of page components',
    default: 'default',
    options: [
      'default',
      'metrics-first',
      'chart-first',
      'panels-first',
      'minimal',
    ] as const,
    group: 'Component Order',
  });

  // Define order based on selected layout
  const layoutPresets = {
    default: { controls: 1, metrics: 2, chart: 3, panels: 4 },
    'metrics-first': { metrics: 1, controls: 2, chart: 3, panels: 4 },
    'chart-first': { controls: 1, chart: 2, metrics: 3, panels: 4 },
    'panels-first': { controls: 1, panels: 2, metrics: 3, chart: 4 },
    minimal: { controls: 1, chart: 2, panels: 3, metrics: 4 },
  };

  const currentLayout = layoutPresets[pageLayout];

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

  // Container style with theme and language
  const containerStyle = {
    backgroundColor: currentTheme.background,
    color: currentTheme.text,
    minHeight: '100vh',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  // Language labels (Note: This is a demo - in production use proper i18n)
  const languageLabels = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語',
    zh: '中文',
    ko: '한국어',
    pt: 'Português',
    ru: 'Русский',
    ar: 'العربية',
    hi: 'हिन्दी',
    it: 'Italiano',
  };

  // Metric Typography Controls
  const metricLabelSize = useDynamicVariant('metric-label-size', {
    label: 'Metric Label Size',
    description: 'Font size for metric labels (Visitors, Views, etc.)',
    default: '',
    options: ['', '0', '1', '2', '3', '4'] as const,
    group: 'Typography - Metrics',
  });

  const metricValueSize = useDynamicVariant('metric-value-size', {
    label: 'Metric Value Size',
    description: 'Font size for metric values (numbers)',
    default: '8',
    options: ['4', '5', '6', '7', '8', '9'] as const,
    group: 'Typography - Metrics',
  });

  const metricLabelWeight = useDynamicVariant('metric-label-weight', {
    label: 'Metric Label Weight',
    description: 'Font weight for metric labels',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Metrics',
  });

  const metricValueWeight = useDynamicVariant('metric-value-weight', {
    label: 'Metric Value Weight',
    description: 'Font weight for metric values',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Metrics',
  });

  const metricLabelColor = useDynamicColor('metric-label-color', {
    label: 'Metric Label Color',
    description: 'Text color for metric labels',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  const metricValueColor = useDynamicColor('metric-value-color', {
    label: 'Metric Value Color',
    description: 'Text color for metric values',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Metrics',
  });

  // Section Heading Controls
  const sectionHeadingSize = useDynamicVariant('section-heading-size', {
    label: 'Section Heading Size',
    description: 'Font size for section headings (Pages, Sources, etc.)',
    default: '2',
    options: ['1', '2', '3', '4', '5'] as const,
    group: 'Typography - Headings',
  });

  const sectionHeadingWeight = useDynamicVariant('section-heading-weight', {
    label: 'Section Heading Weight',
    description: 'Font weight for section headings',
    default: 'bold',
    options: ['normal', 'medium', 'semibold', 'bold'] as const,
    group: 'Typography - Headings',
  });

  const sectionHeadingColor = useDynamicColor('section-heading-color', {
    label: 'Section Heading Color',
    description: 'Text color for section headings',
    default: '',
    options: ['', '#000000', '#333333', '#666666', '#999999', '#3e63dd', '#30a46c', '#e5484d'],
    allowCustom: true,
    group: 'Typography - Headings',
  });

  const typographyConfig = {
    metricLabelSize,
    metricValueSize,
    metricLabelWeight,
    metricValueWeight,
    metricLabelColor,
    metricValueColor,
    sectionHeadingSize,
    sectionHeadingWeight,
    sectionHeadingColor,
  };

  // Create components array with their order values from preset
  const components = [
    {
      order: currentLayout.controls,
      component: <WebsiteControls key="controls" websiteId={websiteId} />,
    },
    {
      order: currentLayout.metrics,
      component: <WebsiteMetricsBar key="metrics" websiteId={websiteId} showChange={true} />,
    },
    {
      order: currentLayout.chart,
      component: (
        <Panel key="chart" minHeight="520px">
          <WebsiteChart websiteId={websiteId} />
        </Panel>
      ),
    },
    {
      order: currentLayout.panels,
      component: <WebsitePanels key="panels" websiteId={websiteId} />,
    },
  ];

  // Sort components by order
  const sortedComponents = components.sort((a, b) => a.order - b.order);

  // Background animation component
  const BackgroundAnimation = () => {
    if (backgroundAnimation === 'none') return null;

    const animationStyles: Record<string, React.CSSProperties> = {
      'gradient-wave': {
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(45deg, ${currentTheme.primary || '#3e63dd'}, ${currentTheme.secondary || '#30a46c'})`,
        backgroundSize: '400% 400%',
        animation: 'gradientWave 15s ease infinite',
        opacity: 0.1,
        zIndex: -1,
      },
      particles: {
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle, ${currentTheme.primary || '#3e63dd'} 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        animation: 'particlesFloat 20s linear infinite',
        opacity: 0.15,
        zIndex: -1,
      },
      'mesh-gradient': {
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(at 20% 30%, ${currentTheme.primary || '#3e63dd'} 0%, transparent 50%),
                     radial-gradient(at 80% 70%, ${currentTheme.secondary || '#30a46c'} 0%, transparent 50%),
                     radial-gradient(at 50% 50%, ${currentTheme.accent || '#f7768e'} 0%, transparent 50%)`,
        backgroundSize: '200% 200%',
        animation: 'meshMove 20s ease infinite',
        opacity: 0.2,
        zIndex: -1,
      },
      aurora: {
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(135deg, ${currentTheme.primary || '#3e63dd'}, ${currentTheme.secondary || '#30a46c'}, ${currentTheme.accent || '#f7768e'})`,
        backgroundSize: '400% 400%',
        animation: 'aurora 25s ease infinite',
        opacity: 0.15,
        filter: 'blur(60px)',
        zIndex: -1,
      },
      'grid-lines': {
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(${currentTheme.primary || '#3e63dd'} 1px, transparent 1px),
                          linear-gradient(90deg, ${currentTheme.primary || '#3e63dd'} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        animation: 'gridScroll 15s linear infinite',
        opacity: 0.1,
        zIndex: -1,
      },
      'floating-orbs': {
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 30% 40%, ${currentTheme.primary || '#3e63dd'} 0%, transparent 40%),
                     radial-gradient(circle at 70% 60%, ${currentTheme.secondary || '#30a46c'} 0%, transparent 40%),
                     radial-gradient(circle at 50% 80%, ${currentTheme.accent || '#f7768e'} 0%, transparent 40%)`,
        animation: 'orbsFloat 18s ease-in-out infinite',
        opacity: 0.2,
        filter: 'blur(40px)',
        zIndex: -1,
      },
      matrix: {
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(0deg, ${currentTheme.primary || '#3e63dd'} 0px, transparent 2px, transparent 4px)`,
        animation: 'matrixRain 10s linear infinite',
        opacity: 0.08,
        zIndex: -1,
      },
      stars: {
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle, ${currentTheme.text || '#fff'} 1px, transparent 1px)`,
        backgroundSize: '100px 100px',
        animation: 'starsTwinkle 5s ease-in-out infinite',
        opacity: 0.3,
        zIndex: -1,
      },
    };

    return <div style={animationStyles[backgroundAnimation] || {}} />;
  };

  return (
    <TypographyContext.Provider value={typographyConfig}>
      <div style={containerStyle}>
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
        <Column gap style={{ position: 'relative', zIndex: 1 }}>
          {sortedComponents.map(item => item.component)}
          <ExpandedViewModal websiteId={websiteId} />
        </Column>
      </div>
    </TypographyContext.Provider>
  );
}
