#!/bin/bash
# Waits for the Homebrew postgresql@16 install to finish, then provisions a
# self-contained local Postgres (port 5433), creates the DB, pushes the Prisma
# schema and seeds it. Safe to re-run.
set -uo pipefail
cd "/Users/oracle/Desktop/work/capitalchain website/capitalchain-v2" || exit 1

echo "[db-autosetup] waiting for postgresql@16 binaries…"
PGBIN=""
for i in $(seq 1 180); do
  PGBIN=$(ls -d /usr/local/opt/postgresql@16/bin /opt/homebrew/opt/postgresql@16/bin 2>/dev/null | head -1)
  if [ -n "$PGBIN" ] && [ -x "$PGBIN/initdb" ] && "$PGBIN/postgres" --version >/dev/null 2>&1; then
    echo "[db-autosetup] postgres ready: $("$PGBIN/postgres" --version)"
    break
  fi
  sleep 5
done
if [ -z "$PGBIN" ] || [ ! -x "$PGBIN/initdb" ]; then
  echo "[db-autosetup] TIMEOUT: postgres never became available"; exit 1
fi
export PATH="$PGBIN:$PATH"

# 1. init cluster (superuser = oracle, trust auth for local dev)
if [ ! -f .pgdata/PG_VERSION ]; then
  echo "[db-autosetup] initdb…"
  initdb -D .pgdata -U oracle --auth=trust >/dev/null 2>&1 || { echo "initdb failed"; exit 1; }
fi

# 2. start on port 5433 (restart cleanly if already running)
pg_ctl -D .pgdata -o "-p 5433" -l .pgdata/server.log stop >/dev/null 2>&1
sleep 1
echo "[db-autosetup] starting postgres on :5433…"
pg_ctl -D .pgdata -o "-p 5433" -l .pgdata/server.log start || { echo "pg_ctl start failed"; cat .pgdata/server.log; exit 1; }

# wait until accepting connections
for i in $(seq 1 30); do
  "$PGBIN/pg_isready" -h localhost -p 5433 -U oracle >/dev/null 2>&1 && break
  sleep 1
done

# 3. create database (ignore if it already exists)
createdb -h localhost -p 5433 -U oracle capitalchain 2>/dev/null && echo "[db-autosetup] created db 'capitalchain'" || echo "[db-autosetup] db 'capitalchain' already exists"

# 4. push schema + seed
echo "[db-autosetup] prisma db push…"
TMPDIR=/var/tmp npx prisma db push --skip-generate 2>&1 | tail -4
echo "[db-autosetup] seeding…"
TMPDIR=/var/tmp npm run db:seed 2>&1 | tail -5

echo "[db-autosetup] DB-SETUP-DONE"
