/**
 * React context provider for dials
 * Provides access to the design manifest and configuration
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loadManifest } from '../utils/manifest';
import { getDialRegistry } from '../registry';
import type { DesignManifest } from '../types';

interface DialsContextValue {
  manifest: DesignManifest | null;
  loading: boolean;
}

const DialsContext = createContext<DialsContextValue>({
  manifest: null,
  loading: true,
});

export interface DialsProviderProps {
  children: ReactNode;
  /** Optional custom manifest path */
  manifestPath?: string;
  /** Optional project ID for scoping localStorage */
  projectId?: string;
}

/**
 * Provider component for dials
 * Should wrap your app at the root level
 *
 * @example
 * ```typescript
 * <DialsProvider>
 *   <App />
 *   <DialsOverlay />
 * </DialsProvider>
 * ```
 */
export function DialsProvider({ children, manifestPath, projectId }: DialsProviderProps) {
  const [manifest, setManifest] = useState<DesignManifest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set project ID if provided
    if (projectId) {
      const registry = getDialRegistry();
      registry.setProjectId(projectId);
    }

    // Load manifest
    loadManifest(manifestPath)
      .then(m => {
        setManifest(m);
        setLoading(false);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn('[Dials] Failed to load manifest:', err);
        setLoading(false);
      });
  }, [manifestPath, projectId]);

  return <DialsContext.Provider value={{ manifest, loading }}>{children}</DialsContext.Provider>;
}

/**
 * Hook to access the dials context
 * @returns The dials context value (manifest, loading state)
 */
export function useDialsContext(): DialsContextValue {
  return useContext(DialsContext);
}
