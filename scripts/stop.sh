#!/usr/bin/env bash

# Stop the local development environment started by scripts/start.sh
# Usage: ./scripts/stop.sh

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$PROJECT_ROOT/scripts/.devserver.pid"

is_running() {
  local pid="$1"
  [[ -n "$pid" ]] || return 1
  if kill -0 "$pid" 2>/dev/null; then
    return 0
  fi
  return 1
}

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" || true)"
  if is_running "$PID"; then
    echo "🛑 Stopping dev server (PID: $PID)…"
    kill "$PID" || true
    # Give it a moment to exit gracefully
    sleep 1
    if is_running "$PID"; then
      echo "⚠️  Process still running; sending SIGKILL"
      kill -9 "$PID" || true
    fi
    echo "✅ Dev server stopped"
  else
    echo "ℹ️  No running dev server found (stale PID file)"
  fi
  rm -f "$PID_FILE"
else
  # Fallback: try to stop common vite dev processes
  VITE_PIDS=$(pgrep -f "vite\s" || true)
  if [[ -n "$VITE_PIDS" ]]; then
    echo "🛑 Stopping Vite processes: $VITE_PIDS"
    kill $VITE_PIDS || true
  else
    echo "ℹ️  No dev server PID file or Vite process found"
  fi
fi

exit 0


