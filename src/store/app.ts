import { create } from 'zustand';
import {
  DATE_RANGE_CONFIG,
  DEFAULT_DATE_RANGE_VALUE,
  DEFAULT_LOCALE,
  DEFAULT_THEME,
  LOCALE_CONFIG,
  THEME_CONFIG,
  TIMEZONE_CONFIG,
} from '@/lib/constants';
import { getItem } from '@/lib/storage';
import { getTimezone } from '@/lib/date';

/**
 * Global Application State Store (Zustand)
 *
 * Manages application-wide state including:
 * - User preferences (locale, theme, timezone)
 * - Date range selection for analytics
 * - Current user session data
 * - App configuration
 *
 * State is persisted to localStorage where applicable
 * and initialized from stored values on app load.
 */

// Initialize state from localStorage or defaults
const initialState = {
  locale: getItem(LOCALE_CONFIG) || process.env.defaultLocale || DEFAULT_LOCALE,
  theme: getItem(THEME_CONFIG) || DEFAULT_THEME,
  timezone: getItem(TIMEZONE_CONFIG) || getTimezone(),
  dateRangeValue: getItem(DATE_RANGE_CONFIG) || DEFAULT_DATE_RANGE_VALUE,
  shareToken: null,
  user: null,
  config: null,
};

// Create Zustand store with initial state
const store = create(() => ({ ...initialState }));

// State updater functions - call these to modify global app state

/** Updates the user's timezone preference */
export function setTimezone(timezone: string) {
  store.setState({ timezone });
}

/** Updates the application locale (language) */
export function setLocale(locale: string) {
  store.setState({ locale });
}

/** Sets the share token for public dashboard access */
export function setShareToken(shareToken: string) {
  store.setState({ shareToken });
}

/** Updates the current authenticated user */
export function setUser(user: object) {
  store.setState({ user });
}

/** Updates the application configuration */
export function setConfig(config: object) {
  store.setState({ config });
}

/** Updates the selected date range for analytics views */
export function setDateRangeValue(dateRangeValue: string) {
  store.setState({ dateRangeValue });
}

/**
 * Main hook to access app state
 *
 * @example
 * const user = useApp(state => state.user);
 * const locale = useApp(state => state.locale);
 */
export const useApp = store;
