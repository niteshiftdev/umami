# Development Environment Architecture: niteshiftdev/umami

---

## Architecture Overview

### Summary
Umami is a privacy-focused, open-source web analytics platform built as an alternative to Google Analytics. It provides website traffic analytics, event tracking, custom reports, and team collaboration features while respecting user privacy by not using cookies or collecting personal data.

The application is built with **Next.js 15** using the App Router pattern, **React 19** for the frontend, and **PostgreSQL** as the primary database with **Prisma ORM**. The codebase is written in **TypeScript** with pnpm as the package manager. The system supports optional **ClickHouse** for high-performance analytics at scale, **Redis** for session caching/auth tokens, and **Kafka** for event streaming in distributed deployments.

The application consists of a single Next.js monolith that handles both the dashboard UI and the analytics collection API. The tracking script (`/script.js`) is served by the same application and can be embedded on external websites to collect pageview and event data. Authentication is handled via JWT tokens with bcrypt password hashing, with no external OAuth providers required by default.

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Niteshift Preview                              │
│                    https://ns-3001-<taskId>.preview.niteshift.dev       │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Next.js 15 Application                            │
│                         http://localhost:3001 ★ PRIMARY                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   Dashboard UI  │  │  Analytics API  │  │   Tracker Script        │  │
│  │   /websites     │  │  /api/send      │  │   /script.js            │  │
│  │   /reports      │  │  /api/websites  │  │   (embedded on sites)   │  │
│  │   /teams        │  │  /api/auth      │  │                         │  │
│  │   /settings     │  │  /api/reports   │  │                         │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
        ┌───────────────────┐ ┌────────────────┐ ┌────────────────┐
        │    PostgreSQL     │ │     Redis      │ │   GeoIP DB     │
        │   localhost:5432  │ │  (optional)    │ │  (local file)  │
        │                   │ │ localhost:6379 │ │  /geo/*.mmdb   │
        │   Primary DB      │ │ Session cache  │ │  IP → Location │
        └───────────────────┘ └────────────────┘ └────────────────┘
                    │
                    ▼ (optional, for scale)
        ┌───────────────────┐ ┌────────────────┐
        │    ClickHouse     │ │     Kafka      │
        │   (optional)      │ │   (optional)   │
        │   Analytics DB    │ │ Event streaming│
        └───────────────────┘ └────────────────┘
```

---

## Dependencies

### Infrastructure Dependencies (ONLY)

| Dependency | Version | What It Is | How It's Used | Dev Environment Setup |
|------------|---------|------------|---------------|----------------------|
| **PostgreSQL** | 12.14+ (15 recommended) | Relational database | Primary data store for users, websites, sessions, events, reports, teams | `docker run -d --name umami-db -p 5432:5432 -e POSTGRES_DB=umami -e POSTGRES_USER=umami -e POSTGRES_PASSWORD=umami postgres:15-alpine` |
| **Redis** | 6.x+ (optional) | In-memory data store | Session caching, auth token storage (improves performance but not required) | `docker run -d --name umami-redis -p 6379:6379 redis:7-alpine` |
| **GeoIP Database** | GeoLite2-City | MaxMind geo database | IP-to-location mapping for visitor geography | Auto-downloaded during build via `pnpm build-geo` |
| **ClickHouse** | 22.x+ (optional) | Column-oriented OLAP DB | High-performance analytics at scale (alternative to PostgreSQL for events) | Not required for local dev |
| **Kafka** | 2.x+ (optional) | Message streaming | Distributed event collection in high-scale deployments | Not required for local dev |

---

## Environment Variables

### Core Configuration
| Variable | Required | Description | Example/Default |
|----------|----------|-------------|-----------------|
| `DATABASE_URL` | **Yes** | PostgreSQL connection string | `postgresql://umami:umami@localhost:5432/umami` |
| `APP_SECRET` | No | Secret for JWT encryption (falls back to DATABASE_URL hash) | Random 32+ char string |
| `BASE_PATH` | No | Base path if app is not at root | `/analytics` |
| `DEFAULT_LOCALE` | No | Default UI language | `en-US` |
| `DISABLE_AUTH` | No | Disable authentication (dev only) | `false` |
| `FORCE_SSL` | No | Force HTTPS headers | `false` |

### Database
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | **Yes** | Primary PostgreSQL connection | `postgresql://user:pass@host:5432/dbname` |
| `DATABASE_REPLICA_URL` | No | Read replica for queries | `postgresql://user:pass@replica:5432/dbname` |
| `SKIP_DB_CHECK` | No | Skip DB connection/migration check | `false` |
| `SKIP_DB_MIGRATION` | No | Skip auto-migration on startup | `false` |

### Optional Services
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `REDIS_URL` | No | Redis connection for caching | `redis://localhost:6379` |
| `CLICKHOUSE_URL` | No | ClickHouse for analytics at scale | `http://localhost:8123` |
| `KAFKA_URL` | No | Kafka authentication URL | `kafka://user:pass@localhost:9092` |
| `KAFKA_BROKER` | No | Kafka broker addresses | `localhost:9092` |

### GeoIP Configuration
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEO_DATABASE_URL` | No | Custom GeoIP database URL | URL to .mmdb or .tar.gz |
| `MAXMIND_LICENSE_KEY` | No | MaxMind API key for official DB | MaxMind license key |
| `GEOLITE_DB_PATH` | No | Custom path to .mmdb file | `/path/to/GeoLite2-City.mmdb` |

### Tracker Configuration
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `TRACKER_SCRIPT_NAME` | No | Alternative tracker script names | `custom.js,analytics.js` |
| `TRACKER_SCRIPT_URL` | No | External tracker script URL | `https://cdn.example.com/script.js` |
| `COLLECT_API_ENDPOINT` | No | Alternative collection endpoint | `/api/collect` |
| `ALLOWED_FRAME_URLS` | No | CSP frame-ancestors whitelist | `https://example.com` |

### Development/Debug
| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `LOG_QUERY` | No | Log all database queries | `true` |
| `CLIENT_IP_HEADER` | No | Custom header for client IP | `x-real-ip` |
| `IGNORE_IP` | No | IP addresses to ignore | `192.168.1.1,10.0.0.0/8` |
| `USE_UUIDV7` | No | Use UUIDv7 instead of v4 | `true` |

---

## Runtimes

### Backend Runtime
| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | 18.18+ (22.x LTS recommended) | ES2022 target, ESM modules |
| pnpm | 10.22.0 | Package manager (corepack) |
| TypeScript | 5.9.x | Strict mode (except strictNullChecks) |

### Frontend Runtime
| Component | Version | Notes |
|-----------|---------|-------|
| Next.js | 15.x | App Router, Turbo bundler |
| React | 19.x | Server and client components |
| React Query | 5.x | Data fetching/caching |
| Zustand | 5.x | Client state management |

### Container Runtime (if applicable)
| Component | Version | Notes |
|-----------|---------|-------|
| Docker | 20.x+ | Optional for PostgreSQL/Redis |
| Docker Compose | 2.x+ | For full stack with `docker-compose.yml` |

---

## Data Required

### Database Initialization
1. **Run Migrations**
   ```bash
   # Migrations run automatically during build or check-db
   pnpm build-db-client  # Generate Prisma client
   pnpm update-db        # Apply migrations (prisma migrate deploy)
   ```

2. **Default Admin User**
   The first migration creates a default admin user:
   - Username: `admin`
   - Password: `umami`
   - UUID: `41e2b680-648e-4b09-bcd7-3e2b10c06264`

3. **Seed Data Script** (optional)
   ```bash
   # Generate demo websites with sample analytics data
   pnpm seed-data              # 30 days of data
   pnpm seed-data -- --days 90 # 90 days of data
   pnpm seed-data -- --clear   # Clear existing demo data first
   ```

### Required Seed Data
| Data Type | Description | Source |
|-----------|-------------|--------|
| Admin User | Default admin account | Created by migration (admin/umami) |
| Demo Websites | Sample sites for testing | Optional via `pnpm seed-data` |

### Build Steps
1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Generate Prisma client**
   ```bash
   pnpm build-db-client
   ```

3. **Build tracker script**
   ```bash
   pnpm build-tracker
   ```

4. **Download GeoIP database**
   ```bash
   pnpm build-geo
   ```

5. **Build Next.js application** (production only)
   ```bash
   pnpm build-app
   ```

6. **Run development server**
   ```bash
   pnpm dev  # Starts on port 3001 with Turbo
   ```

---

## Authentication

### Authentication Method
Umami uses **JWT-based authentication** with bcrypt password hashing. There is no external OAuth/SSO provider required by default.

- **Password Storage**: bcrypt with salt rounds
- **Token Type**: JWT (JSON Web Token) encrypted with AES-256-GCM
- **Token Storage**:
  - Without Redis: JWT stored client-side, verified server-side
  - With Redis: Auth key stored in Redis, reference token client-side
- **Secret Key**: Derived from `APP_SECRET` env var, or hashed from `DATABASE_URL` as fallback

### Authentication Flow
1. User submits username/password to `/api/auth/login`
2. Server validates credentials against bcrypt hash in database
3. Server creates JWT with `userId` and `role` payload
4. Token is encrypted and returned to client
5. Client stores token and sends with `Authorization: Bearer <token>` header
6. Server validates token on each request via `parseSecureToken()`

### SSO Endpoint
An `/api/auth/sso` endpoint exists for programmatic auth (requires Redis enabled) but no external OAuth providers are configured by default.

### Dev Setup Requirements
- No external auth provider configuration needed
- Default credentials work out of the box: `admin` / `umami`
- `DISABLE_AUTH=true` bypasses auth entirely (dev only)

---

## Open Questions / Unknowns

### High Priority Issues
| Issue | Description | Impact | Potential Solution |
|-------|-------------|--------|-------------------|
| None identified | The app works with minimal config | N/A | N/A |

### Configuration Uncertainties
| Question | Context | Recommendation |
|----------|---------|----------------|
| Redis for production? | Redis improves auth token handling and caching | Optional for local dev, recommended for production |
| ClickHouse setup | Complex configuration for high-scale analytics | Not needed for local dev or moderate traffic |
| GeoIP accuracy | Free GeoLite2 database has limited accuracy | Sufficient for dev; MaxMind license for production if needed |

---

## Quick Start Commands

```bash
# Development (minimal setup)
export DATABASE_URL="postgresql://umami:umami@localhost:5432/umami"
pnpm install
pnpm build-db-client
pnpm build-tracker
pnpm build-geo
pnpm dev  # http://localhost:3001

# Login with: admin / umami
```

## Port Summary

| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| **3001** | Next.js Dev Server | HTTP | Primary application (dashboard + API) |
| 5432 | PostgreSQL | TCP | Database |
| 6379 | Redis (optional) | TCP | Session cache |
