/**
 * Mints a preview session for the seeded `admin` user and writes it in Playwright
 * storage-state format, so preview viewers land on the dashboard already logged in.
 *
 * Umami keeps its auth token in localStorage under `umami.auth` (src/lib/client.ts) and
 * signs it with a secret derived from DATABASE_URL (src/lib/crypto.ts), so the token can
 * be minted here from the app's own helpers without the dev server running.
 */
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { PrismaPg } from '@prisma/adapter-pg';
import { AUTH_TOKEN } from '@/lib/constants';
import { secret } from '@/lib/crypto';
import { createSecureToken } from '@/lib/jwt';
import { PrismaClient } from '../src/generated/prisma/client.js';

const PORT = process.env.UMAMI_PORT || '3001';
const USERNAME = process.env.UMAMI_USERNAME || 'admin';
const STATE_FILE = '/tmp/agent-browser-state.json';

function origins(token: string) {
  const urls = [`http://localhost:${PORT}`];
  const previewUrl = process.env[`NITESHIFT_PORT_${PORT}_URL`];

  if (previewUrl) {
    urls.push(previewUrl);
  }

  return urls.map(url => ({
    origin: new URL(url).origin,
    localStorage: [{ name: AUTH_TOKEN, value: JSON.stringify(token) }],
  }));
}

const url = new URL(process.env.DATABASE_URL as string);
const prisma = new PrismaClient({
  adapter: new PrismaPg(
    { connectionString: url.toString() },
    { schema: url.searchParams.get('schema') },
  ),
});

const user = await prisma.user.findFirst({ where: { username: USERNAME } });

if (!user) {
  throw new Error(`User "${USERNAME}" not found; the migrations should have created it.`);
}

const token = createSecureToken({ userId: user.id, role: user.role }, secret());

writeFileSync(STATE_FILE, JSON.stringify({ cookies: [], origins: origins(token) }, null, 2));

await prisma.$disconnect();

console.log(`Wrote preview session for "${USERNAME}" to ${STATE_FILE}`);
