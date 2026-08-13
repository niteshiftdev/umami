#!/usr/bin/env bash
# Start (or restart) the PostgreSQL container Umami uses and wait until it accepts
# connections. Shared by .niteshift/setup and .niteshift/resume.
#
# Docker owns the container lifecycle: `--restart unless-stopped` brings it back after
# a resume, and the named volume keeps the data. Host networking is required because
# Docker bridge networking does not work in the sandbox.
set -euo pipefail

CONTAINER=umami-db
IMAGE=postgres:15-alpine
VOLUME=umami-db-data

if [ -n "$(docker ps -q -f "name=^${CONTAINER}$")" ]; then
  echo "PostgreSQL container already running"
elif [ -n "$(docker ps -aq -f "name=^${CONTAINER}$")" ]; then
  echo "Starting existing PostgreSQL container"
  docker start "$CONTAINER" >/dev/null
else
  echo "Creating PostgreSQL container"
  docker run -d \
    --name "$CONTAINER" \
    --restart unless-stopped \
    --network=host \
    -e POSTGRES_DB=umami \
    -e POSTGRES_USER=umami \
    -e POSTGRES_PASSWORD=umami \
    -v "${VOLUME}:/var/lib/postgresql/data" \
    "$IMAGE" >/dev/null
fi

for _ in $(seq 1 60); do
  if docker exec "$CONTAINER" pg_isready -U umami -d umami >/dev/null 2>&1; then
    echo "PostgreSQL is ready on localhost:5432"
    exit 0
  fi
  sleep 1
done

echo "PostgreSQL did not become ready within 60s" >&2
docker logs --tail 50 "$CONTAINER" >&2 || true
exit 1
