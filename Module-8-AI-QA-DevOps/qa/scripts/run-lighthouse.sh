#!/usr/bin/env bash
# Lighthouse performance audit against frontend dev/preview URL.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
mkdir -p "$REPORTS_DIR"

TARGET="${LIGHTHOUSE_URL:-http://localhost:5173}"

cd "$MODULE_ROOT"

if ! curl -sf --max-time 5 "$TARGET" &>/dev/null; then
  echo "{\"skipped\": true, \"reason\": \"target unreachable\", \"url\": \"$TARGET\"}" \
    > "$REPORTS_DIR/lighthouse-results.json"
  echo "Lighthouse skipped: $TARGET not reachable (start frontend with npm run dev)"
  exit 0
fi

echo "==> Lighthouse audit: $TARGET"
if [[ -d node_modules ]]; then
  npx lighthouse "$TARGET" \
    --only-categories=performance,accessibility,best-practices,seo \
    --output=json \
    --output-path="$REPORTS_DIR/lighthouse-results.json" \
    --chrome-flags='--headless --no-sandbox --disable-gpu' \
    --quiet \
    2>&1 | tee "$REPORTS_DIR/lighthouse.log" || true
else
  echo '{"skipped": true, "reason": "run npm install first"}' > "$REPORTS_DIR/lighthouse-results.json"
fi

echo "Lighthouse report: $REPORTS_DIR/lighthouse-results.json"
