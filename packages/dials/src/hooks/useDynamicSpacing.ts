/**
 * React hook for creating a spacing dial
 */

import { useDial } from './useDial';
import type { SpacingDialConfig } from '../types';

/**
 * Create a dynamic spacing dial
 *
 * @example
 * ```typescript
 * const padding = useDynamicSpacing('card-padding', {
 *   label: 'Card Padding',
 *   default: '1rem',
 *   options: ['0.5rem', '1rem', '1.5rem', '2rem'],
 *   allowCustom: true,
 *   group: 'Card'
 * });
 *
 * <div style={{ padding }}>...</div>
 * ```
 */
export function useDynamicSpacing(id: string, config: Omit<SpacingDialConfig, 'type'>): string {
  return useDial<string>(id, 'spacing', { ...config, type: 'spacing' });
}
