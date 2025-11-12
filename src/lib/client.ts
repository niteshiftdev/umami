import { getItem, setItem, removeItem } from '@/lib/storage';
import { AUTH_TOKEN } from './constants';

export function getClientAuthToken() {
  console.log(`[client.ts] getClientAuthToken called`);
  const token = getItem(AUTH_TOKEN);
  console.log(`[client.ts] getClientAuthToken result:`, {
    hasToken: !!token,
    tokenPreview: token ? String(token).substring(0, 20) + '...' : 'null',
  });
  return token;
}

export function setClientAuthToken(token: string) {
  console.log(`[client.ts] setClientAuthToken called`, {
    hasToken: !!token,
    tokenPreview: token ? String(token).substring(0, 20) + '...' : 'null',
  });
  try {
    setItem(AUTH_TOKEN, token);
    console.log(`[client.ts] ✓ setClientAuthToken completed successfully`);
  } catch (error) {
    console.error(`[client.ts] ✗ setClientAuthToken FAILED:`, {
      error,
      errorName: error?.name,
      errorMessage: error?.message,
    });
    throw error;
  }
}

export function removeClientAuthToken() {
  console.log(`[client.ts] removeClientAuthToken called`);
  removeItem(AUTH_TOKEN);
  console.log(`[client.ts] ✓ removeClientAuthToken completed`);
}
