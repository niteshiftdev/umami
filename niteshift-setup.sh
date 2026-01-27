#!/bin/bash
set -euo pipefail

# niteshift-setup.sh - Runtime setup script for niteshiftdev/umami
#
# This script is minimal because the heavy lifting is done at image build time:
# - Repository already cloned to /root/umami
# - Dependencies already installed (pnpm install)
# - Prisma client already generated (build-db)
# - Tracker script already built (build-tracker)
# - Geo database already built (build-geo)
#
# At runtime, we only need to:
# 1. Apply database migrations (requires runtime DATABASE_URL)
# 2. Start the dev server

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

# Track timing for benchmarking
SCRIPT_START_SECONDS=${SECONDS:-0}
DB_MIGRATE_DURATION_S=0
DEV_SERVER_TO_PREVIEW_DURATION_S=0

log "Starting niteshift setup for umami..."

# 1. Check DATABASE_URL is set (only runtime requirement)
if [ -z "${DATABASE_URL:-}" ]; then
  log_error "DATABASE_URL environment variable is not set"
  exit 1
fi
log "✓ DATABASE_URL is set"

# 2. Apply database migrations
# This must happen at runtime because it needs the actual database connection
DB_MIGRATE_START_SECONDS=$SECONDS
log "Applying database migrations..."
if ! pnpm run check-db; then
  log_error "Database migration failed"
  exit 1
fi
DB_MIGRATE_DURATION_S=$((SECONDS - DB_MIGRATE_START_SECONDS))
log "✓ Database migrations applied (${DB_MIGRATE_DURATION_S}s)"

# 3. Start the dev server in the background
DEV_PHASE_START_SECONDS=$SECONDS
log "Starting development server on port 3001..."
pnpm run dev >> "$LOG_FILE" 2>&1 &
SERVER_PID=$!
log "✓ Dev server started with PID $SERVER_PID"

# 4. Warm up the main application routes
MAX_DEV_WAIT_SECONDS=${UMAMI_DEV_WAIT_SECONDS:-60}
log "Warming up main application routes (max ${MAX_DEV_WAIT_SECONDS}s)..."
DEV_SERVER_READY=0
for ((i=1; i<=MAX_DEV_WAIT_SECONDS; i++)); do
  if curl -s -o /dev/null --max-time 5 http://localhost:3001/ 2>/dev/null; then
    DEV_SERVER_READY=1
    break
  fi
  sleep 1
done

DEV_SERVER_TO_PREVIEW_DURATION_S=$((SECONDS - DEV_PHASE_START_SECONDS))
if [[ "$DEV_SERVER_READY" -eq 1 ]]; then
  log "✓ Server ready (${DEV_SERVER_TO_PREVIEW_DURATION_S}s)"
else
  log "Warning: Route warm-up timed out after ${DEV_SERVER_TO_PREVIEW_DURATION_S}s (non-critical)"
fi

log ""
log "================================================================"
log "Setup complete! Umami dev server is running on http://localhost:3001"
log "================================================================"
log ""
log "Default credentials:"
log "  Username: admin"
log "  Password: umami"
log ""
log "Server PID: $SERVER_PID"
if [ "$LOG_FILE" != "/dev/stdout" ]; then
  log "Server logs: $LOG_FILE"
fi
log ""

# Emit timing summary for benchmarking tools
SCRIPT_TOTAL_DURATION_S=$((SECONDS - SCRIPT_START_SECONDS))
TIMING_JSON=$(printf '{"db_migrate_s":%s,"dev_run_to_preview_s":%s,"script_total_s":%s}' \
  "${DB_MIGRATE_DURATION_S:-0}" \
  "${DEV_SERVER_TO_PREVIEW_DURATION_S:-0}" \
  "${SCRIPT_TOTAL_DURATION_S}")
log "NITESHIFT_TIMING_JSON=${TIMING_JSON}"
