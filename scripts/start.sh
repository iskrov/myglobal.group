#!/usr/bin/env bash

# Start the local development server (Vite) in the background and track its PID
# Usage: ./scripts/start.sh [--port 5173]

set -euo pipefail

# Resolve project root (one level up from this scripts directory)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Parse optional args
PORT_ENV=${PORT:-}
PORT_FLAG=${1:-}
if [[ "$PORT_FLAG" == "--port" && -n ${2:-} ]]; then
  PORT="$2"
elif [[ -n "$PORT_ENV" ]]; then
  PORT="$PORT_ENV"
else
  PORT=5173
fi

PID_FILE="$PROJECT_ROOT/scripts/.devserver.pid"
LOG_DIR="$PROJECT_ROOT/logs"
LOG_FILE="$LOG_DIR/dev-server.log"

mkdir -p "$LOG_DIR"

is_running() {
  local pid="$1"
  [[ -n "$pid" ]] || return 1
  if kill -0 "$pid" 2>/dev/null; then
    return 0
  fi
  return 1
}

echo "🔧 Checking dependencies…"
if [[ ! -d node_modules ]]; then
  echo "📦 Installing node modules (first run)…"
  npm install --silent
else
  echo "✅ Dependencies present"
fi

if [[ -f "$PID_FILE" ]]; then
  EXISTING_PID="$(cat "$PID_FILE" || true)"
  if is_running "$EXISTING_PID"; then
    echo "✅ Dev server already running (PID: $EXISTING_PID)"
    echo "🌐 http://localhost:$PORT"
    exit 0
  else
    echo "ℹ️  Found stale PID file; cleaning up"
    rm -f "$PID_FILE"
  fi
fi

echo "🚀 Starting Vite dev server on port $PORT…"
nohup npm run dev -- --host 0.0.0.0 --port "$PORT" >"$LOG_FILE" 2>&1 &
DEV_PID=$!
echo "$DEV_PID" > "$PID_FILE"

# Wait briefly for server to be responsive
if command -v curl >/dev/null 2>&1; then
  for _ in {1..30}; do
    if curl -sf "http://localhost:$PORT" >/dev/null 2>&1; then
      break
    fi
    sleep 0.5
  done
else
  sleep 1
fi

echo "✅ Dev server started (PID: $DEV_PID)"
echo "📜 Logs: $LOG_FILE"
echo "🌐 Open: http://localhost:$PORT"

exit 0


