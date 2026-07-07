#!/usr/bin/env bash
# OWASP ZAP baseline scan via Docker (DAST).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
mkdir -p "$REPORTS_DIR"

TARGET="${ZAP_TARGET:-http://host.docker.internal:5000}"
TIMEOUT="${ZAP_TIMEOUT:-120}"

if ! command -v docker &>/dev/null; then
  echo '{"skipped": true, "reason": "docker not available"}' > "$REPORTS_DIR/zap-results.json"
  echo "ZAP skipped: Docker not installed"
  exit 0
fi

echo "==> OWASP ZAP baseline scan against $TARGET"
docker run --rm \
  -v "$REPORTS_DIR:/zap/wrk:rw" \
  --add-host=host.docker.internal:host-gateway \
  owasp/zap2docker-stable \
  zap-baseline.py \
    -t "$TARGET" \
    -J zap-results.json \
    -r zap-report.html \
    -m "$TIMEOUT" \
    -I \
  2>&1 | tee "$REPORTS_DIR/zap.log" || true

if [[ ! -f "$REPORTS_DIR/zap-results.json" ]]; then
  echo '{"skipped": true, "reason": "scan did not produce output"}' > "$REPORTS_DIR/zap-results.json"
fi

echo "ZAP report: $REPORTS_DIR/zap-results.json"
