# Development Environment Architecture: niteshiftdev/umami

---

## Architecture Overview

### Summary

Umami is a privacy-focused web analytics platform built as an alternative to Google Analytics. The application is a monolithic Next.js 15 application with TypeScript that provides both the analytics dashboard UI and the data collection API endpoints.

The tech stack centers on:
- **Next.js 15** (App Router) for the full-stack framework with React 19
- **PostgreSQL** (v12.14+) as the primary database via Prisma ORM
- **Optional Redis** for session caching and improved performance
- **Optional ClickHouse** for high-performance analytics at scale (enterprise/cloud mode)
- **pnpm** as the package manager with a monorepo structure (includes `@niteshift/dials` package)

The application has three main operational modes:
1. **Standard mode**: PostgreSQL-only, suitable for most self-hosted deployments
2. **Redis-enhanced mode**: PostgreSQL + Redis for improved auth token caching
3. **Cloud mode**: PostgreSQL + ClickHouse + Redis for high-scale analytics

For local development, only PostgreSQL is required. The authentication system uses JWT tokens stored either directly in the token (stateless) or via Redis keys (stateful, when Redis is configured). A default admin user (`admin`/`umami`) is created during the initial database migration.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Niteshift Preview                                 │
│                    https://ns-3001-<previewId>.preview.niteshift.dev        │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Next.js 15 Application                              │
│                         http://localhost:3001 (PRIMARY)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────┐   │
│  │   App Router      │  │   API Routes      │  │   Tracker Script      │   │
│  │   (Dashboard UI)  │  │   /api/*          │  │   /script.js          │   │
│  │                   │  │                   │  │                       │   │
│  │  - Login          │  │  - /api/auth/*    │  │  - Pageview events    │   │
│  │  - Websites       │  │  - /api/websites  │  │  - Custom events      │   │
│  │  - Analytics      │  │  - /api/send      │  │  - Session tracking   │   │
│  │  - Teams          │  │  - /api/reports   │  │                       │   │
│  │  - Settings       │  │  - /api/admin/*   │  │                       │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────────┘   │
├─────────────────────────────────────────────────────────────────────────────┤
│                              Data Layer                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Prisma ORM + @prisma/adapter-pg                                    │    │
│  │  └─► runQuery() dispatches to Prisma or ClickHouse                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└──────────────────────┬──────────────────────────────┬───────────────────────┘
                       │                              │
                       ▼                              ▼
        ┌──────────────────────────┐    ┌──────────────────────────┐
        │      PostgreSQL          │    │     Redis (Optional)     │
        │      localhost:5432      │    │     localhost:6379       │
        │                          │    │                          │
        │  - Users                 │    │  - Auth tokens           │
        │  - Websites              │    │  - Session cache         │
        │  - Sessions              │    │                          │
        │  - Events                │    │                          │
        │  - Teams                 │    │                          │
        │  - Reports               │    │                          │
        └──────────────────────────┘    └──────────────────────────┘
```

---

## Dependencies

### Infrastructure Dependencies (ONLY)

| Dependency | Version | What It Is | How It's Used | Dev Environment Setup |
|------------|---------|------------|---------------|----------------------|
| **PostgreSQL** | 15.x (min 12.14+) | Relational database | Primary data store for users, websites, sessions, events, teams, reports | `docker run -d --name umami-postgres -p 5432:5432 -e POSTGRES_DB=umami -e POSTGRES_USER=umami -e POSTGRES_PASSWORD=umami postgres:15-alpine` |
| **Redis** | 7.x | In-memory cache | Optional - auth token storage, session caching | `docker run -d --name umami-redis -p 6379:6379 redis:7-alpine` |
| **Node.js** | 20.x LTS (min 18.18+) | JavaScript runtime | Application runtime | Pre-installed in Niteshift sandbox |
| **pnpm** | 10.22.0 | Package manager | Dependency management | Pre-installed in Niteshift sandbox |

**Note**: Redis is optional for local development. Without Redis, auth tokens are encoded directly in JWTs (stateless mode).

---

## Environment Variables

### Core Configuration
| Variable | Required | Description | Example/Default |
|----------|----------|-------------|-----------------|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string | `postgresql://umami:umami@localhost:5432/umami` |
| `APP_SECRET` | No | Secret for JWT encryption (falls back to hashing DATABASE_URL) | `replace-me-with-a-random-string` |
| `BASE_PATH` | No | URL base path for deployment behind a subdirectory | (empty) |
| `DEFAULT_LOCALE` | No | Default UI locale | `en-US` |
| `DISABLE_AUTH` | No | Disable authentication (all requests use admin user) | `false` |
| `DISABLE_LOGIN` | No | Hide the login page | `false` |

### Database
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string | `postgresql://umami:umami@localhost:5432/umami` |
| `SKIP_DB_CHECK` | No | Skip database connection check on startup | `false` |
| `SKIP_DB_MIGRATION` | No | Skip automatic migration on startup | `false` |

### Caching (Optional)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `REDIS_URL` | No | Redis connection URL for auth caching | `redis://localhost:6379` |

### Analytics Backend (Optional - Enterprise)
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `CLICKHOUSE_URL` | No | ClickHouse connection URL for high-scale analytics | `http://localhost:8123/umami` |

### Cloud Mode (Not for local dev)
| Variable | Required | Description | Notes |
|----------|----------|-------------|-------|
| `CLOUD_MODE` | No | Enable cloud mode features | Do not use for local dev |
| `CLOUD_URL` | No | Cloud service URL | Do not use for local dev |

### Tracker Configuration
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `COLLECT_API_HOST` | No | Override host for tracker script | (empty) |
| `COLLECT_API_ENDPOINT` | No | Custom endpoint for data collection | `/api/send` |
| `TRACKER_SCRIPT_NAME` | No | Alternative names for tracker script | `analytics.js,stats.js` |
| `TRACKER_SCRIPT_URL` | No | External URL for tracker script | (empty) |

### Geo Database
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MAXMIND_LICENSE_KEY` | No | MaxMind license for GeoLite2 database | (uses public redistribution if not set) |
| `GEO_DATABASE_URL` | No | Custom URL for geo database download | (empty) |

### Security Headers
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `FORCE_SSL` | No | Add HSTS header | `false` |
| `ALLOWED_FRAME_URLS` | No | Additional frame-ancestors for CSP | (empty) |
| `CORS_MAX_AGE` | No | CORS preflight cache duration | `86400` |

---

## Runtimes

### Backend Runtime
| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 20.x LTS (min 18.18) | Required for Next.js 15 |
| pnpm | 10.22.0 | Package manager (specified in packageManager field) |

### Frontend Runtime
| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 15.5.9 | App Router with Turbo |
| React | 19.2.3 | With React Compiler babel plugin |
| TypeScript | 5.9.3 | ES2022 target |

### Component Library
| Component | Version | Notes |
|-----------|---------|-------|
| @umami/react-zen | 0.211.0 | UI component library |
| @tanstack/react-query | 5.90.11 | Data fetching |
| Zustand | 5.0.9 | State management |

---

## Data Required

### Database Initialization

1. **Run Migrations**
   ```bash
   # Migrations run automatically via check-db.js during build/start
   # Manual command if needed:
   pnpm update-db
   # Or directly:
   prisma migrate deploy
   ```

2. **Default Admin User**
   The initial migration (`01_init/migration.sql`) creates a default admin user:
   - Username: `admin`
   - Password: `umami`
   - User ID: `41e2b680-648e-4b09-bcd7-3e2b10c06264`

3. **Seed Data (Optional)**
   ```bash
   # Generate sample analytics data for testing
   pnpm seed-data
   # Options:
   pnpm seed-data -- --days 90    # Generate 90 days of data
   pnpm seed-data -- --clear      # Clear existing demo data first
   pnpm seed-data -- --verbose    # Show detailed progress
   ```

### Required Seed Data
| Data Type | Description | Source |
|-----------|-------------|--------|
| Admin User | Default admin account | Created by migration |
| GeoIP Database | MaxMind GeoLite2-City | Downloaded during build via `pnpm build-geo` |
| Tracker Script | Client-side analytics script | Built via `pnpm build-tracker` |

### Build Steps

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Build database client**
   ```bash
   pnpm build-db        # Runs build-db-client + build-prisma-client
   ```

3. **Build tracker script**
   ```bash
   pnpm build-tracker   # Compiles src/tracker/index.js to public/script.js
   ```

4. **Build geo database**
   ```bash
   pnpm build-geo       # Downloads GeoLite2-City.mmdb to geo/
   ```

5. **Build application**
   ```bash
   pnpm build-app       # Next.js build with Turbo
   ```

**Full build command:**
```bash
pnpm build   # Runs: check-env → build-db → check-db → build-tracker → build-geo → build-app
```

**Development mode:**
```bash
pnpm dev     # Runs Next.js dev server on port 3001 with Turbo
```

---

## Authentication

### Authentication Method

Umami uses a **custom JWT-based authentication** system:

1. **Stateless mode** (default, no Redis): JWT tokens are encrypted with AES-256-GCM using a secret derived from `APP_SECRET` or `DATABASE_URL`. The encrypted token contains the user ID and role.

2. **Stateful mode** (with Redis): Auth data is stored in Redis with a random key. The JWT contains only the Redis key reference. This allows for token revocation.

### Authentication Flow

1. **Login**: POST to `/api/auth/login` with `username` and `password`
2. **Token Generation**:
   - Without Redis: Creates encrypted JWT with `{userId, role}`
   - With Redis: Stores `{userId, role}` in Redis, returns encrypted JWT with `{authKey}`
3. **Token Validation**: On each request, `checkAuth()` validates the Bearer token
4. **Secret Derivation**: `secret()` function uses SHA-512 hash of `APP_SECRET` or `DATABASE_URL`

### Dev Setup Requirements

**No external OAuth/SSO providers required for local development.** Authentication is fully self-contained using username/password stored in the PostgreSQL database.

Default credentials:
- Username: `admin`
- Password: `umami`

To change the admin password:
```bash
node scripts/change-password.js
```

### Disable Auth Mode

For rapid prototyping, set `DISABLE_AUTH=true` to bypass authentication entirely (all requests use the admin user).

---

## Open Questions / Unknowns

### High Priority Issues

| Issue | Description | Impact | Potential Solution |
|-------|-------------|--------|-------------------|
| None | All configuration is documented and can be defaulted | Low | N/A |

### Configuration Uncertainties

| Question | Context | Recommendation |
|----------|---------|----------------|
| Redis usage | Redis is optional but improves token management | Skip for local dev unless testing caching behavior |
| ClickHouse usage | Enterprise feature for high-scale analytics | Not needed for local development |
| GeoIP accuracy | Free GeoLite2 database has limited accuracy | Acceptable for development/testing |

### Notes for Niteshift Integration

1. **Dev server port**: The application runs on port **3001** in dev mode (`next dev -p 3001`)
2. **No external auth providers**: All auth is self-contained, no OAuth configuration needed
3. **Database migrations**: Run automatically on startup via `check-db.js`
4. **Tracker script**: Must be built (`pnpm build-tracker`) for analytics collection to work
5. **Geo database**: Must be downloaded (`pnpm build-geo`) for location tracking to work
