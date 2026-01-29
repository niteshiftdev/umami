import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

/**
 * Core type definitions for the Dials SDK
 */
type DialType = 'color' | 'spacing' | 'variant' | 'boolean' | 'number';
/**
 * Base configuration shared by all dial types
 */
interface BaseDialConfig<T> {
    /** Human-readable label for the dial */
    label: string;
    /** Optional description/help text */
    description?: string;
    /** Group/category for organization in overlay UI */
    group?: string;
    /** Default value */
    default: T;
}
/**
 * Color dial configuration
 * For any color value (backgrounds, text, borders, etc.)
 */
interface ColorDialConfig extends BaseDialConfig<string> {
    type?: 'color';
    /** Predefined color options (from design system) */
    options?: string[];
    /** Allow custom hex input */
    allowCustom?: boolean;
    /** Color format hint */
    format?: 'hex' | 'rgb' | 'hsl' | 'var';
}
/**
 * Spacing dial configuration
 * For padding, margin, gap, width, height, etc.
 */
interface SpacingDialConfig extends BaseDialConfig<string> {
    type?: 'spacing';
    /** Predefined spacing options (e.g., '4px', '8px', 'var(--spacing-3)') */
    options?: string[];
    /** Allow custom values */
    allowCustom?: boolean;
    /** Unit for custom values */
    unit?: 'px' | 'rem' | 'em' | '%';
    /** Min value for custom input */
    min?: number;
    /** Max value for custom input */
    max?: number;
}
/**
 * Variant dial configuration
 * For discrete choices (layouts, styles, chart types, etc.)
 */
interface VariantDialConfig<T extends string = string> extends BaseDialConfig<T> {
    type?: 'variant';
    /** Array of allowed values (enum-like) */
    options: readonly T[];
    /** Optional labels for each option (if different from value) */
    optionLabels?: Record<T, string>;
}
/**
 * Boolean dial configuration
 * For toggles, feature flags, show/hide, etc.
 */
interface BooleanDialConfig extends BaseDialConfig<boolean> {
    type?: 'boolean';
    /** Label for "true" state */
    trueLabel?: string;
    /** Label for "false" state */
    falseLabel?: string;
}
/**
 * Number dial configuration
 * For numeric values with constraints
 */
interface NumberDialConfig extends BaseDialConfig<number> {
    type?: 'number';
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step increment */
    step?: number;
    /** Unit to display (e.g., 'px', '%', 'ms') */
    unit?: string;
    /** Predefined number options */
    options?: number[];
}
/**
 * Union type for all dial configurations
 */
type DialConfig = ColorDialConfig | SpacingDialConfig | VariantDialConfig<any> | BooleanDialConfig | NumberDialConfig;
/**
 * Internal dial registration stored in registry
 */
interface DialRegistration {
    /** Unique identifier for the dial */
    id: string;
    /** Type of dial */
    type: DialType;
    /** Configuration */
    config: DialConfig;
    /** Current value (user override or default) */
    currentValue: any;
    /** Timestamp of last update */
    updatedAt?: number;
}
/**
 * Design system manifest structure
 */
interface DesignManifest {
    name?: string;
    version?: string;
    colors?: {
        [category: string]: {
            label?: string;
            values: string[] | Record<string, string>;
        };
    };
    spacing?: {
        label?: string;
        values: string[];
        variables?: string[];
    };
    typography?: {
        fontFamilies?: {
            label?: string;
            values: string[];
        };
        fontSizes?: {
            label?: string;
            values: string[];
            variables?: string[];
        };
        fontWeights?: {
            label?: string;
            values: string[];
            labels?: string[];
        };
        headingSizes?: {
            label?: string;
            values: string[];
            variables?: string[];
        };
    };
    borderRadius?: {
        label?: string;
        values: string[];
        variables?: string[];
        labels?: string[];
    };
    shadows?: {
        label?: string;
        values: string[];
        variables?: string[];
        labels?: string[];
    };
    [key: string]: any;
}
/**
 * Event types for dial changes
 */
type DialChangeListener = (id: string, value: any) => void;
type DialRegistryListener = () => void;

/**
 * React hook for creating a color dial
 */

/**
 * Create a dynamic color dial
 *
 * When options are not provided, automatically pulls color values from the
 * design manifest (if available). Supports manifest categories like 'primary',
 * 'accent', 'semantic', etc.
 *
 * @example
 * ```typescript
 * // With explicit options:
 * const bgColor = useDynamicColor('hero-bg', {
 *   label: 'Background Color',
 *   default: '#1a1a1a',
 *   options: ['#1a1a1a', '#2d2d2d', '#404040'],
 *   group: 'Hero Section'
 * });
 *
 * // With manifest defaults (auto-populated from designManifest.colors.accent):
 * const accentColor = useDynamicColor('accent', {
 *   label: 'Accent Color',
 *   default: '#3e63dd',
 *   manifestCategory: 'accent', // pulls from manifest
 * });
 * ```
 */
declare function useDynamicColor(id: string, config: Omit<ColorDialConfig, 'type'>): string;

/**
 * React hook for creating a spacing dial
 */

/**
 * Create a dynamic spacing dial
 *
 * When options are not provided, automatically pulls spacing values from the
 * design manifest's spacing scale (if available).
 *
 * @example
 * ```typescript
 * // With explicit options:
 * const padding = useDynamicSpacing('card-padding', {
 *   label: 'Card Padding',
 *   default: '1rem',
 *   options: ['0.5rem', '1rem', '1.5rem', '2rem'],
 *   group: 'Card'
 * });
 *
 * // With manifest defaults (auto-populated from designManifest.spacing):
 * const margin = useDynamicSpacing('section-margin', {
 *   label: 'Section Margin',
 *   default: '24px', // pulls options from manifest.spacing.values
 * });
 * ```
 */
declare function useDynamicSpacing(id: string, config: Omit<SpacingDialConfig, 'type'>): string;

/**
 * React hook for creating a variant dial
 */

/**
 * Create a dynamic variant dial for discrete choices
 *
 * @example
 * ```typescript
 * const layout = useDynamicVariant('dashboard-layout', {
 *   label: 'Layout Style',
 *   default: 'grid',
 *   options: ['grid', 'list', 'compact'] as const,
 *   group: 'Dashboard'
 * });
 *
 * {layout === 'grid' && <GridView />}
 * {layout === 'list' && <ListView />}
 * ```
 */
declare function useDynamicVariant<T extends string>(id: string, config: Omit<VariantDialConfig<T>, 'type'>): T;

/**
 * React hook for creating a boolean dial (toggle)
 */

/**
 * Create a dynamic boolean dial for toggles and feature flags
 *
 * @example
 * ```typescript
 * const showMetrics = useDynamicBoolean('show-metrics', {
 *   label: 'Show Metrics',
 *   default: true,
 *   trueLabel: 'Visible',
 *   falseLabel: 'Hidden',
 *   group: 'Dashboard'
 * });
 *
 * {showMetrics && <MetricsPanel />}
 * ```
 */
declare function useDynamicBoolean(id: string, config: Omit<BooleanDialConfig, 'type'>): boolean;

/**
 * React hook for creating a number dial
 */

/**
 * Create a dynamic number dial
 *
 * @example
 * ```typescript
 * const chartHeight = useDynamicNumber('chart-height', {
 *   label: 'Chart Height',
 *   default: 400,
 *   min: 200,
 *   max: 800,
 *   step: 50,
 *   unit: 'px',
 *   group: 'Chart'
 * });
 *
 * <Chart height={chartHeight} />
 * ```
 */
declare function useDynamicNumber(id: string, config: Omit<NumberDialConfig, 'type'>): number;

interface DialsContextValue {
    manifest: DesignManifest | null;
}
interface DialsProviderProps {
    children: ReactNode;
    /** Design system manifest (imported from config) */
    manifest?: DesignManifest | null;
    /** Optional project ID for scoping localStorage */
    projectId?: string;
}
/**
 * Provider component for dials
 * Should wrap your app at the root level
 *
 * @example
 * ```typescript
 * import { designManifest } from '@/config/niteshift-manifest';
 *
 * <DialsProvider manifest={designManifest}>
 *   <App />
 *   <DialsOverlay />
 * </DialsProvider>
 * ```
 */
declare function DialsProvider({ children, manifest, projectId }: DialsProviderProps): react_jsx_runtime.JSX.Element;
/**
 * Hook to access the dials context
 * @returns The dials context value (manifest)
 */
declare function useDialsContext(): DialsContextValue;

/**
 * Main overlay UI component for displaying and controlling dials
 */
interface DialsOverlayProps {
    /** Initial visibility state */
    defaultVisible?: boolean;
    /** Position of the overlay */
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
/**
 * Overlay UI for controlling dials
 * Should be rendered at the root level of your app
 *
 * @example
 * ```typescript
 * <DialsProvider>
 *   <App />
 *   <DialsOverlay defaultVisible={false} toggleKey="k" position="bottom-right" />
 * </DialsProvider>
 * ```
 */
declare function DialsOverlay({ defaultVisible, position, }: DialsOverlayProps): react_jsx_runtime.JSX.Element | null;

/**
 * Global dial registry - singleton that manages all dials
 * Survives hot reloads by using a singleton pattern
 * Persists values to localStorage
 */

/**
 * Singleton registry for all dials
 */
declare class DialRegistry {
    /** All registered dials */
    private dials;
    /** Listeners for specific dial changes */
    private changeListeners;
    /** Listeners for any registry change (for overlay UI) */
    private registryListeners;
    /** Project ID for storage scoping */
    private projectId?;
    constructor();
    /**
     * Set the project ID for storage scoping
     */
    setProjectId(projectId: string): void;
    /**
     * Register a new dial or get existing value
     * Returns the current value (persisted or default)
     */
    register<T>(id: string, type: DialType, config: DialConfig): T;
    /**
     * Update a dial's value
     */
    setValue(id: string, value: any): void;
    /**
     * Get a dial's current value
     */
    getValue(id: string): any;
    /**
     * Get a dial's registration
     */
    getDial(id: string): DialRegistration | undefined;
    /**
     * Get all registered dials
     */
    getAllDials(): DialRegistration[];
    /**
     * Get dials by group
     */
    getDialsByGroup(): Map<string, DialRegistration[]>;
    /**
     * Reset a dial to its default value
     */
    reset(id: string): void;
    /**
     * Reset all dials to their default values
     */
    resetAll(): void;
    /**
     * Subscribe to changes for a specific dial
     */
    subscribe(id: string, listener: DialChangeListener): () => void;
    /**
     * Subscribe to any registry change (for overlay UI)
     */
    subscribeToRegistry(listener: DialRegistryListener): () => void;
    /**
     * Notify listeners of a dial value change
     */
    private notifyChangeListeners;
    /**
     * Notify registry listeners (for overlay UI updates)
     * Deferred to avoid React "setState during render" errors
     */
    private notifyRegistryListeners;
    /**
     * Load persisted values from localStorage
     */
    private loadFromStorage;
    /**
     * Get a persisted value for a dial
     */
    private getPersistedValue;
    /**
     * Persist a dial value to localStorage
     */
    private persistValue;
    /**
     * Export all current values as an object
     */
    exportValues(): Record<string, any>;
    /**
     * Export all dials with their configurations
     */
    exportDials(): DialRegistration[];
    /**
     * Clear all persisted values
     */
    clearStorage(): void;
}
/**
 * Get the singleton registry instance
 * Uses window storage to survive HMR module re-evaluation
 */
declare function getGlobalRegistry(): DialRegistry;
declare const getDialRegistry: typeof getGlobalRegistry;

/**
 * Utilities for loading and working with the design system manifest
 */

/**
 * Load the design system manifest from .niteshift-manifest
 * Caches the result for subsequent calls
 */
declare function loadManifest(manifestPath?: string): Promise<DesignManifest | null>;
/**
 * Get color options from the manifest
 * @param category - Optional category (e.g., 'primary', 'accent', 'semantic')
 * @returns Array of color values
 */
declare function getManifestColors(manifest: DesignManifest, category?: string): string[];
/**
 * Get spacing options from the manifest
 * @param useVariables - If true, returns CSS variable names instead of pixel values
 * @returns Array of spacing values
 */
declare function getManifestSpacing(manifest: DesignManifest, useVariables?: boolean): string[];
/**
 * Get typography options from the manifest
 */
declare function getManifestTypography(manifest: DesignManifest, type: 'fontFamilies' | 'fontSizes' | 'fontWeights' | 'headingSizes', useVariables?: boolean): string[];
/**
 * Get border radius options from the manifest
 */
declare function getManifestBorderRadius(manifest: DesignManifest, useVariables?: boolean): string[];
/**
 * Get shadow options from the manifest
 */
declare function getManifestShadows(manifest: DesignManifest, useVariables?: boolean): string[];
/**
 * Helper to build color options with categories
 * Returns a flat array with all colors from specified categories
 */
declare function buildColorOptions(manifest: DesignManifest, categories: string[]): string[];

export { type BooleanDialConfig, type ColorDialConfig, type DesignManifest, type DialConfig, type DialRegistration, type DialType, DialsOverlay, DialsProvider, type NumberDialConfig, type SpacingDialConfig, type VariantDialConfig, buildColorOptions, getDialRegistry, getManifestBorderRadius, getManifestColors, getManifestShadows, getManifestSpacing, getManifestTypography, loadManifest, useDialsContext, useDynamicBoolean, useDynamicColor, useDynamicNumber, useDynamicSpacing, useDynamicVariant };
