#!/usr/bin/env bash
# k6 load test against backend health endpoint.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
mkdir -p "$REPORTS_DIR"

BASE_URL="${K6_BASE_URL:-http://localhost:5000}"

if ! curl -sf --max-time 5 "$BASE_URL/health" &>/dev/null; then
  echo "{\"skipped\": true, \"reason\": \"backend unreachable\", \"url\": \"$BASE_URL\"}" \
    > "$REPORTS_DIR/k6-summary.json"
  echo "k6 skipped: $BASE_URL/health not reachable (start backend first)"
  exit 0
fi

echo "==> k6 load test: $BASE_URL"
cd "$MODULE_ROOT"

if command -v k6 &>/dev/null; then
  BASE_URL="$BASE_URL" k6 run qa/k6/api-load-test.js \
    2>&1 | tee "$REPORTS_DIR/k6.log" || true
elif command -v docker &>/dev/null; then
  docker run --rm \
    -v "$MODULE_ROOT/qa/k6:/scripts:ro" \
    -v "$REPORTS_DIR:/reports" \
    -w /reports \
    --add-host=host.docker.internal:host-gateway \
    -e BASE_URL="http://host.docker.internal:5000" \
    -e K6_OUT_DIR=/reports \
    grafana/k6 run /scripts/api-load-test.js \
    2>&1 | tee "$REPORTS_DIR/k6.log" || true
else
  echo '{"skipped": true, "reason": "k6 and docker not available"}' > "$REPORTS_DIR/k6-summary.json"
fi

echo "k6 report: $REPORTS_DIR/k6-summary.json"
