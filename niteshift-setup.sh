#!/usr/bin/env bash
set -euo pipefail

# niteshift-setup.sh
# Idempotent setup script for umami repository
# Detects and installs only required dependencies

# ============================================================================
# Configuration
# ============================================================================

LOG_FILE="${NITESHIFT_LOG_FILE:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ============================================================================
# Logging utilities
# ============================================================================

log() {
  local msg="$1"
  if [[ -n "$LOG_FILE" ]]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $msg" | tee -a "$LOG_FILE"
  else
    echo "$msg"
  fi
}

error() {
  log "ERROR: $1" >&2
  exit 1
}

# ============================================================================
# Dependency detection and installation
# ============================================================================

check_command() {
  command -v "$1" >/dev/null 2>&1
}

setup_nodejs() {
  log "==> Setting up Node.js environment..."

  if ! check_command node; then
    error "Node.js is not installed. Please install Node.js (v18 or higher) first."
  fi

  local node_version
  node_version=$(node --version | sed 's/v//')
  log "Found Node.js version: $node_version"

  # Enable corepack for pnpm (preferred method)
  if check_command corepack; then
    log "Enabling corepack for pnpm..."
    corepack enable || log "Warning: Could not enable corepack (may need sudo)"
  fi

  # Check if pnpm is available
  if ! check_command pnpm; then
    if check_command corepack; then
      log "Installing pnpm via corepack..."
      corepack prepare pnpm@latest --activate || error "Failed to install pnpm via corepack"
    else
      error "pnpm is not installed and corepack is not available. Please install pnpm: npm install -g pnpm"
    fi
  fi

  log "Found pnpm version: $(pnpm --version)"
}

install_dependencies() {
  log "==> Installing project dependencies..."

  if [[ ! -f "$SCRIPT_DIR/pnpm-lock.yaml" ]]; then
    error "pnpm-lock.yaml not found"
  fi

  # Run pnpm install (idempotent)
  cd "$SCRIPT_DIR"
  pnpm install --frozen-lockfile || error "Failed to install dependencies"

  log "Dependencies installed successfully"
}

setup_database() {
  log "==> Setting up database..."

  # Check if DATABASE_URL is set
  if [[ -z "${DATABASE_URL:-}" ]]; then
    error "DATABASE_URL environment variable is required but not set"
  fi

  log "DATABASE_URL is set"

  # Generate Prisma client
  log "Generating Prisma client..."
  cd "$SCRIPT_DIR"
  pnpm run build-db-client || error "Failed to generate Prisma client"

  # Run database migrations
  log "Running database migrations..."
  pnpm run update-db || error "Failed to run database migrations"
}

setup_environment() {
  log "==> Checking environment variables..."

  # We rely on environment variables being set by Niteshift
  # No .env file creation or loading needed
  log "Using environment variables from Niteshift"
}

build_application() {
  log "==> Building application assets..."

  cd "$SCRIPT_DIR"

  # Build tracker (required for the application)
  if [[ -f "$SCRIPT_DIR/rollup.tracker.config.js" ]]; then
    log "Building tracker..."
    pnpm run build-tracker || error "Failed to build tracker"
  fi

  # Build geo database (optional but recommended)
  log "Building geo database..."
  pnpm run build-geo || log "Warning: Failed to build geo database (non-critical)"

  log "Application assets built successfully"
}

# ============================================================================
# Main setup flow
# ============================================================================

main() {
  log "============================================"
  log "Umami Setup Script"
  log "============================================"
  log ""

  setup_nodejs
  install_dependencies
  setup_environment
  setup_database
  build_application

  log ""
  log "============================================"
  log "Setup completed successfully!"
  log "============================================"
  log ""
  log "Next steps:"
  log "  1. Review and update .env file with your configuration"
  log "  2. Run 'pnpm run dev' to start the development server"
  log "  3. Run 'pnpm run build' to build for production"
  log ""
  log "For more information, visit: https://umami.is/docs"
}

main "$@"
