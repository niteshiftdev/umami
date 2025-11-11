#!/bin/bash
set -euo pipefail

# niteshift-setup.sh - Setup script for niteshiftdev/umami
# This script sets up the Umami analytics application with all required dependencies

# Logging setup
LOG_FILE="${NITESHIFT_LOG_FILE:-/dev/stdout}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE" >/dev/null
  echo "$*"
}

log_error() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $*" | tee -a "$LOG_FILE" >&2
  echo "ERROR: $*" >&2
}

# Pre-flight checks
log "Starting niteshift setup for umami..."

# 1. Check DATABASE_URL is set
if [ -z "${DATABASE_URL:-}" ]; then
  log_error "DATABASE_URL environment variable is not set"
  log_error "This script assumes DATABASE_URL is already configured"
  exit 1
fi
log "✓ DATABASE_URL is set"

# 2. Check Node.js version
if ! command -v node &> /dev/null; then
  log_error "Node.js is not installed"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
  log_error "Node.js 18.18+ is required, found version $NODE_VERSION"
  exit 1
fi
log "✓ Node.js $NODE_VERSION is installed"

# 3. Enable corepack for pnpm
if ! command -v pnpm &> /dev/null; then
  log "Enabling corepack for pnpm..."
  corepack enable
  if ! command -v pnpm &> /dev/null; then
    log_error "Failed to enable pnpm via corepack"
    exit 1
  fi
fi
log "✓ pnpm is available"

# 4. Install dependencies
log "Installing dependencies with pnpm..."
if ! pnpm install --frozen-lockfile; then
  log_error "Failed to install dependencies"
  exit 1
fi
log "✓ Dependencies installed"

# 5. Build the application
# The build script includes:
# - check-env: validates environment variables
# - build-db: generates Prisma client and builds database
# - check-db: verifies database connection and applies migrations
# - build-tracker: bundles tracker script
# - build-geo: processes geographic data
# - build-app: builds Next.js application
log "Building application (this may take a few minutes)..."
if ! pnpm run build; then
  log_error "Build failed"
  exit 1
fi
log "✓ Build completed successfully"

# 6. Database is ready (migrations applied during build)
log "✓ Database migrations applied"

# 7. Start the application in the background
log "Starting application on port 3000..."
pnpm run start > /tmp/umami-server.log 2>&1 &
SERVER_PID=$!
log "✓ Server started with PID $SERVER_PID"

# 8. Wait for server to be ready
log "Waiting for server to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/heartbeat | grep -q "200"; then
    log "✓ Server is ready and responding"
    break
  fi
  ATTEMPT=$((ATTEMPT + 1))
  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    log_error "Server failed to start within 30 seconds"
    log_error "Server logs:"
    cat /tmp/umami-server.log
    kill $SERVER_PID 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

log ""
log "================================================================"
log "Setup complete! Umami is running on http://localhost:3000"
log "================================================================"
log ""
log "Default credentials:"
log "  Username: admin"
log "  Password: umami"
log ""
log "Server PID: $SERVER_PID"
log "Server logs: /tmp/umami-server.log"
log ""
log "To stop the server: kill $SERVER_PID"
log ""
