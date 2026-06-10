#!/usr/bin/env bash
# Start/stop the project's local Postgres (port 5433, data in ./.pgdata).
# Created automatically during dynamic-content setup.
set -e

PGPREFIX="$(brew --prefix postgresql@16 2>/dev/null || true)"
[ -n "$PGPREFIX" ] && export PATH="$PGPREFIX/bin:$PATH"
export LC_ALL=C LANG=C

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$ROOT/.pgdata"

case "$1" in
  start)
    pg_ctl -D "$DATA" -o "-p 5433 -k /tmp" -l "$DATA/server.log" start
    ;;
  stop)
    pg_ctl -D "$DATA" stop
    ;;
  status)
    pg_isready -h localhost -p 5433 -U oracle
    ;;
  *)
    echo "usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
