// Annotation style configuration with presets for colors, typography, and hover states

export type AnnotationColorScheme = {
  primary: string;
  background: string;
  text: string;
  muted: string;
  border: string;
};

export type AnnotationTypography = {
  titleSize: string;
  titleWeight: string;
  descriptionSize: string;
  countSize: string;
  fontFamily: string;
};

export type AnnotationIndicatorStyle = {
  shape: 'circle' | 'diamond' | 'square' | 'flag';
  size: number;
  strokeWidth: number;
  filled: boolean;
  glowEffect: boolean;
};

export type AnnotationHoverStyle = {
  animation: 'none' | 'fade' | 'slide' | 'scale';
  shadow: 'none' | 'soft' | 'medium' | 'strong';
  borderRadius: string;
  padding: string;
};

export type AnnotationStylePreset = {
  name: string;
  colors: AnnotationColorScheme;
  typography: AnnotationTypography;
  indicator: AnnotationIndicatorStyle;
  hover: AnnotationHoverStyle;
};

// Color scheme presets
export const colorSchemes: Record<string, AnnotationColorScheme> = {
  orange: {
    primary: '#f97316',
    background: 'rgba(249, 115, 22, 0.15)',
    text: '#111',
    muted: 'var(--text-muted)',
    border: 'rgba(249, 115, 22, 0.3)',
  },
  blue: {
    primary: '#3b82f6',
    background: 'rgba(59, 130, 246, 0.15)',
    text: '#111',
    muted: 'var(--text-muted)',
    border: 'rgba(59, 130, 246, 0.3)',
  },
  purple: {
    primary: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.15)',
    text: '#111',
    muted: 'var(--text-muted)',
    border: 'rgba(139, 92, 246, 0.3)',
  },
  green: {
    primary: '#22c55e',
    background: 'rgba(34, 197, 94, 0.15)',
    text: '#111',
    muted: 'var(--text-muted)',
    border: 'rgba(34, 197, 94, 0.3)',
  },
  pink: {
    primary: '#ec4899',
    background: 'rgba(236, 72, 153, 0.15)',
    text: '#111',
    muted: 'var(--text-muted)',
    border: 'rgba(236, 72, 153, 0.3)',
  },
  teal: {
    primary: '#14b8a6',
    background: 'rgba(20, 184, 166, 0.15)',
    text: '#111',
    muted: 'var(--text-muted)',
    border: 'rgba(20, 184, 166, 0.3)',
  },
};

// Typography presets
export const typographyPresets: Record<string, AnnotationTypography> = {
  default: {
    titleSize: '1rem',
    titleWeight: '600',
    descriptionSize: '0.85em',
    countSize: '10px',
    fontFamily: 'Inter',
  },
  compact: {
    titleSize: '0.875rem',
    titleWeight: '600',
    descriptionSize: '0.75em',
    countSize: '9px',
    fontFamily: 'Inter',
  },
  bold: {
    titleSize: '1.1rem',
    titleWeight: '700',
    descriptionSize: '0.9em',
    countSize: '11px',
    fontFamily: 'Inter',
  },
  mono: {
    titleSize: '0.9rem',
    titleWeight: '500',
    descriptionSize: '0.8em',
    countSize: '10px',
    fontFamily: 'ui-monospace, monospace',
  },
};

// Indicator style presets
export const indicatorPresets: Record<string, AnnotationIndicatorStyle> = {
  circle: {
    shape: 'circle',
    size: 4,
    strokeWidth: 0,
    filled: true,
    glowEffect: false,
  },
  circleOutline: {
    shape: 'circle',
    size: 5,
    strokeWidth: 2,
    filled: false,
    glowEffect: false,
  },
  circleGlow: {
    shape: 'circle',
    size: 4,
    strokeWidth: 0,
    filled: true,
    glowEffect: true,
  },
  diamond: {
    shape: 'diamond',
    size: 5,
    strokeWidth: 0,
    filled: true,
    glowEffect: false,
  },
  square: {
    shape: 'square',
    size: 6,
    strokeWidth: 0,
    filled: true,
    glowEffect: false,
  },
  flag: {
    shape: 'flag',
    size: 8,
    strokeWidth: 0,
    filled: true,
    glowEffect: false,
  },
};

// Hover style presets
export const hoverPresets: Record<string, AnnotationHoverStyle> = {
  default: {
    animation: 'none',
    shadow: 'soft',
    borderRadius: '4px',
    padding: '8px',
  },
  elevated: {
    animation: 'scale',
    shadow: 'strong',
    borderRadius: '8px',
    padding: '12px',
  },
  minimal: {
    animation: 'fade',
    shadow: 'none',
    borderRadius: '2px',
    padding: '6px',
  },
  card: {
    animation: 'slide',
    shadow: 'medium',
    borderRadius: '12px',
    padding: '16px',
  },
};

// Complete style presets combining all options
export const stylePresets: Record<string, AnnotationStylePreset> = {
  classic: {
    name: 'Classic',
    colors: colorSchemes.orange,
    typography: typographyPresets.default,
    indicator: indicatorPresets.circle,
    hover: hoverPresets.default,
  },
  modern: {
    name: 'Modern',
    colors: colorSchemes.blue,
    typography: typographyPresets.bold,
    indicator: indicatorPresets.circleGlow,
    hover: hoverPresets.elevated,
  },
  minimal: {
    name: 'Minimal',
    colors: colorSchemes.teal,
    typography: typographyPresets.compact,
    indicator: indicatorPresets.circleOutline,
    hover: hoverPresets.minimal,
  },
  vibrant: {
    name: 'Vibrant',
    colors: colorSchemes.purple,
    typography: typographyPresets.bold,
    indicator: indicatorPresets.diamond,
    hover: hoverPresets.card,
  },
  nature: {
    name: 'Nature',
    colors: colorSchemes.green,
    typography: typographyPresets.default,
    indicator: indicatorPresets.flag,
    hover: hoverPresets.elevated,
  },
  playful: {
    name: 'Playful',
    colors: colorSchemes.pink,
    typography: typographyPresets.bold,
    indicator: indicatorPresets.square,
    hover: hoverPresets.card,
  },
};

// Default preset
export const defaultStylePreset = stylePresets.classic;
