// Authentication and Authorization Module
// Handles JWT token validation, session management, permission checks, and share token parsing
// Supports multiple auth modes: JWT tokens, Redis-backed sessions, and disabled auth (dev mode)

import debug from 'debug';
import { ROLE_PERMISSIONS, ROLES, SHARE_TOKEN_HEADER } from '@/lib/constants';
import { secret } from '@/lib/crypto';
import { getRandomChars } from '@/lib/generate';
import { createSecureToken, parseSecureToken, parseToken } from '@/lib/jwt';
import { ensureArray } from '@/lib/utils';
import redis from '@/lib/redis';
import { getUser } from '@/queries/prisma/user';

const log = debug('umami:auth');

export function getBearerToken(request: Request) {
  const auth = request.headers.get('authorization');

  return auth?.split(' ')[1];
}

// Check authentication status of incoming request
// Validates JWT token or Redis session, returns authenticated user or share token
//
// @param request - NextJS Request object with headers
// @returns Object with {token, authKey, shareToken, user} or null if unauthorized
//
// Authentication modes (in priority order):
// 1. JWT token in Authorization header
// 2. Redis session key (if Redis enabled)
// 3. Share token (for public report access)
// 4. Disabled auth mode (dev/docker default)
export async function checkAuth(request: Request) {
  // Development mode: auth disabled returns default admin user
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

  // Extract JWT token from Authorization: Bearer header
  const token = getBearerToken(request);
  // Decrypt and validate JWT token using crypto secret
  const payload = parseSecureToken(token, secret());
  // Extract share token for public report access
  const shareToken = await parseShareToken(request);

  let user = null;
  const { userId, authKey } = payload || {};

  // Try JWT authentication: token payload contains userId
  if (userId) {
    user = await getUser(userId);
  }
  // Try Redis session authentication: authKey points to Redis session with userId
  else if (redis.enabled && authKey) {
    const key = await redis.client.get(authKey);

    if (key?.userId) {
      user = await getUser(key.userId);
    }
  }

  log({ token, payload, authKey, shareToken, user });

  // Reject if no user AND no share token (public access requires share token)
  if (!user?.id && !shareToken) {
    log('User not authorized');
    return null;
  }

  // Mark as admin if user role is admin
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
