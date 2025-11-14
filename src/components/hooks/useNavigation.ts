import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { buildPath } from '@/lib/url';

/**
 * Custom navigation hook that provides URL manipulation utilities
 *
 * This hook wraps Next.js navigation primitives and adds convenient helpers for:
 * - Managing query parameters
 * - Extracting IDs from URL paths (teamId, websiteId)
 * - Building URLs with merged or replaced parameters
 *
 * IMPORTANT: The update/replace functions return URL strings - you must call
 * router.replace() or router.push() to actually navigate!
 *
 * @example
 * const { router, updateParams } = useNavigation();
 * // CORRECT: Build URL then navigate
 * router.replace(updateParams({ filter: 'active' }));
 *
 * // WRONG: updateParams doesn't navigate automatically
 * updateParams({ filter: 'active' }); // Does nothing!
 */
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract team/website IDs from current path using regex
  const [, teamId] = pathname.match(/\/teams\/([a-f0-9-]+)/) || [];
  const [, websiteId] = pathname.match(/\/websites\/([a-f0-9-]+)/) || [];

  // Track query params in state for easy access
  const [queryParams, setQueryParams] = useState(Object.fromEntries(searchParams));

  /**
   * Merges new params with existing query parameters
   * Returns a new URL string - does NOT navigate automatically
   */
  const updateParams = (params?: Record<string, string | number>) => {
    return buildPath(pathname, { ...queryParams, ...params });
  };

  /**
   * Replaces all query parameters with the provided ones
   * Returns a new URL string - does NOT navigate automatically
   */
  const replaceParams = (params?: Record<string, string | number>) => {
    return buildPath(pathname, params);
  };

  /**
   * Renders a URL with optional team context and query params
   * Useful for generating links with team-aware paths
   */
  const renderUrl = (path: string, params?: Record<string, string | number> | false) => {
    return buildPath(
      teamId ? `/teams/${teamId}${path}` : path,
      params === false ? {} : { ...queryParams, ...params },
    );
  };

  // Sync local state with URL search params whenever they change
  useEffect(() => {
    setQueryParams(Object.fromEntries(searchParams));
  }, [searchParams.toString()]);

  return {
    router,              // Next.js router instance for navigation
    pathname,            // Current path without query params
    searchParams,        // Raw URLSearchParams object
    query: queryParams,  // Query params as plain object
    teamId,              // Extracted team ID from URL (if present)
    websiteId,           // Extracted website ID from URL (if present)
    updateParams,        // Merge new params with existing (returns URL)
    replaceParams,       // Replace all params (returns URL)
    renderUrl,           // Build team-aware URLs
  };
}
