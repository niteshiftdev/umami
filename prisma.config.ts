import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

process.env.DATABASE_URL ??= process.env.NEON_DATABASE_URL;

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
});
