/**
 * React hook for creating a color dial
 */

import { useDial } from './useDial';
import type { ColorDialConfig } from '../types';

/**
 * Create a dynamic color dial
 *
 * @example
 * ```typescript
 * const bgColor = useDynamicColor('hero-bg', {
 *   label: 'Background Color',
 *   default: '#1a1a1a',
 *   options: ['#1a1a1a', '#2d2d2d', '#404040'],
 *   allowCustom: true,
 *   group: 'Hero Section'
 * });
 *
 * <div style={{ backgroundColor: bgColor }}>...</div>
 * ```
 */
export function useDynamicColor(id: string, config: Omit<ColorDialConfig, 'type'>): string {
  return useDial<string>(id, 'color', { ...config, type: 'color' });
}
