import debug from 'debug';
import { ROLE_PERMISSIONS, ROLES, SHARE_TOKEN_HEADER } from '@/lib/constants';
import { secret } from '@/lib/crypto';
import { getRandomChars } from '@/lib/generate';
import { createSecureToken, parseSecureToken, parseToken } from '@/lib/jwt';
import { ensureArray } from '@/lib/utils';
import redis from '@/lib/redis';
import { getUser } from '@/queries/prisma/user';

// Debug logger for authentication operations
const log = debug('umami:auth');

/**
 * Extracts the Bearer token from the Authorization header
 *
 * @param request - The incoming HTTP request
 * @returns The token string without the "Bearer " prefix, or undefined if not present
 */
export function getBearerToken(request: Request) {
  const auth = request.headers.get('authorization');

  // Split "Bearer <token>" and return just the token part
  return auth?.split(' ')[1];
}

/**
 * Checks authentication for an incoming request
 *
 * Supports multiple authentication methods:
 * 1. Disabled auth mode (development) - returns hardcoded admin user
 * 2. JWT bearer token authentication
 * 3. Redis-based auth key lookup (for session management)
 * 4. Share token authentication (for public sharing)
 *
 * @param request - The incoming HTTP request
 * @returns Object containing token, authKey, shareToken, and user, or null if unauthorized
 */
export async function checkAuth(request: Request) {
  // Development mode: bypass authentication and use admin user
  if (process.env.disableAuth) {
    const adminUser = await getUser('41e2b680-648e-4b09-bcd7-3e2b10c06264');
    if (adminUser) {
      adminUser.isAdmin = true;
      log('Auth disabled, returning admin user');
      return {
        token: null,
        authKey: null,
        shareToken: null,
        user: adminUser,
      };
    }
  }

  // Extract and parse authentication tokens
  const token = getBearerToken(request);
  const payload = parseSecureToken(token, secret());
  const shareToken = await parseShareToken(request);

  let user = null;
  const { userId, authKey } = payload || {};

  // Attempt to load user from JWT payload
  if (userId) {
    user = await getUser(userId);
  }
  // Fallback: Load user from Redis session store (if enabled)
  else if (redis.enabled && authKey) {
    const key = await redis.client.get(authKey);

    if (key?.userId) {
      user = await getUser(key.userId);
    }
  }

  log({ token, payload, authKey, shareToken, user });

  // Deny access if no valid user or share token found
  if (!user?.id && !shareToken) {
    log('User not authorized');
    return null;
  }

  // Set admin flag based on user role
  if (user) {
    user.isAdmin = user.role === ROLES.admin;
  }

  return {
    token,
    authKey,
    shareToken,
    user,
  };
}

export async function saveAuth(data: any, expire = 0) {
  const authKey = `auth:${getRandomChars(32)}`;

  if (redis.enabled) {
    await redis.client.set(authKey, data);

    if (expire) {
      await redis.client.expire(authKey, expire);
    }
  }

  return createSecureToken({ authKey }, secret());
}

export async function hasPermission(role: string, permission: string | string[]) {
  return ensureArray(permission).some(e => ROLE_PERMISSIONS[role]?.includes(e));
}

export function parseShareToken(request: Request) {
  try {
    return parseToken(request.headers.get(SHARE_TOKEN_HEADER), secret());
  } catch (e) {
    log(e);
    return null;
  }
}
