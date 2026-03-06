import {
  DEFAULT_REPOSITORY_CONFIG,
  DEFAULT_REPOSITORY_LAST_USED,
  LAST_WEBSITE_CONFIG,
} from '@/lib/constants';
import { getItem, setItem } from '@/lib/storage';

export function useDefaultRepository() {
  const defaultRepository: string =
    getItem(DEFAULT_REPOSITORY_CONFIG) || DEFAULT_REPOSITORY_LAST_USED;
  const lastUsedWebsiteId: string | undefined = getItem(LAST_WEBSITE_CONFIG) || undefined;

  const saveDefaultRepository = (value: string) => {
    setItem(DEFAULT_REPOSITORY_CONFIG, value);
  };

  /**
   * Resolves the effective default website ID.
   * If the setting is "last-used", returns the last used website ID.
   * Otherwise returns the explicitly configured website ID.
   */
  const resolveDefaultWebsiteId = (): string | undefined => {
    if (defaultRepository === DEFAULT_REPOSITORY_LAST_USED) {
      return lastUsedWebsiteId;
    }
    return defaultRepository;
  };

  /**
   * Resolves the default website ID for integration linking (Slack, Linear).
   * "Last used" is not valid for integrations, so it resolves to the actual
   * last used website ID. If a specific website is configured, returns that.
   */
  const resolveDefaultForIntegration = (): string | undefined => {
    if (defaultRepository === DEFAULT_REPOSITORY_LAST_USED) {
      return lastUsedWebsiteId;
    }
    return defaultRepository;
  };

  return {
    defaultRepository,
    lastUsedWebsiteId,
    saveDefaultRepository,
    resolveDefaultWebsiteId,
    resolveDefaultForIntegration,
  };
}
