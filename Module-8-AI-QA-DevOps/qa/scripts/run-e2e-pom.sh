#!/usr/bin/env bash
# Run Playwright E2E tests using the Page Object Model framework.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
FRAMEWORK_DIR="$MODULE_ROOT/qa/framework"

mkdir -p "$REPORTS_DIR"

cd "$MODULE_ROOT"

if [[ ! -d node_modules ]]; then
  echo "Installing npm dependencies..."
  npm install --silent
fi

FRONTEND="$MODULE_ROOT/../Module-6-AI-Frontend-Development"
if [[ ! -d "$FRONTEND/node_modules" ]]; then
  echo "Installing frontend dependencies..."
  (cd "$FRONTEND" && npm install --silent)
fi

echo "==> Playwright E2E (Page Object Model)"
npx playwright test --config "$FRAMEWORK_DIR/playwright.config.ts" \
  2>&1 | tee "$REPORTS_DIR/playwright.log" || true

echo "Playwright report: $REPORTS_DIR/playwright-results.json"
