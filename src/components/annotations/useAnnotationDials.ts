'use client';

import { useDynamicVariant, useDynamicColor } from '@niteshift/dials';
import {
  colorSchemes,
  typographyPresets,
  indicatorPresets,
  hoverPresets,
  AnnotationStylePreset,
} from './annotationStyles';

/**
 * Hook that creates dials for controlling annotation styles
 * Uses the dials SDK for runtime design parameter control
 */
export function useAnnotationDials() {
  // Color scheme dial
  const colorScheme = useDynamicVariant('annotation-color-scheme', {
    label: 'Color Scheme',
    default: 'orange',
    options: ['orange', 'blue', 'purple', 'green', 'pink', 'teal'] as const,
    group: 'Annotations',
    description: 'Primary color theme for annotations',
  });

  // Custom primary color dial (for fine-tuning)
  const customColor = useDynamicColor('annotation-custom-color', {
    label: 'Custom Color',
    default: '#f97316',
    options: [
      '#f97316', // orange
      '#3b82f6', // blue
      '#8b5cf6', // purple
      '#22c55e', // green
      '#ec4899', // pink
      '#14b8a6', // teal
      '#ef4444', // red
      '#eab308', // yellow
    ],
    group: 'Annotations',
    description: 'Override the color scheme with a custom color',
  });

  // Typography dial
  const typography = useDynamicVariant('annotation-typography', {
    label: 'Typography',
    default: 'default',
    options: ['default', 'compact', 'bold', 'mono'] as const,
    group: 'Annotations',
    description: 'Text style for annotation labels',
  });

  // Indicator shape dial
  const indicator = useDynamicVariant('annotation-indicator', {
    label: 'Indicator Shape',
    default: 'circle',
    options: ['circle', 'circleOutline', 'circleGlow', 'diamond', 'square', 'flag'] as const,
    group: 'Annotations',
    description: 'Shape of the annotation marker on charts',
  });

  // Hover style dial
  const hoverStyle = useDynamicVariant('annotation-hover-style', {
    label: 'Hover Effect',
    default: 'default',
    options: ['default', 'elevated', 'minimal', 'card'] as const,
    group: 'Annotations',
    description: 'Style for annotation hover states and tooltips',
  });

  // Build the current style object from dial values
  const currentStyle: AnnotationStylePreset = {
    name: 'Custom (Dials)',
    colors: colorSchemes[colorScheme] || colorSchemes.orange,
    typography: typographyPresets[typography] || typographyPresets.default,
    indicator: indicatorPresets[indicator] || indicatorPresets.circle,
    hover: hoverPresets[hoverStyle] || hoverPresets.default,
  };

  // Override primary color if custom color differs from scheme
  const schemeColor = colorSchemes[colorScheme]?.primary;
  if (customColor !== schemeColor) {
    currentStyle.colors = {
      ...currentStyle.colors,
      primary: customColor,
      background: `${customColor}26`, // 15% opacity
      border: `${customColor}4d`, // 30% opacity
    };
  }

  return {
    currentStyle,
    // Individual dial values for direct use
    colorScheme,
    customColor,
    typography,
    indicator,
    hoverStyle,
  };
}
