#!/usr/bin/env bash
# Jest unit tests and ESLint for Module 6 frontend.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
mkdir -p "$REPORTS_DIR"

cd "$MODULE_ROOT"

if [[ ! -d node_modules ]]; then
  echo "Installing npm dependencies..."
  npm install --silent
fi

echo "==> Jest unit tests"
npm run test:jest 2>&1 | tee "$REPORTS_DIR/jest.log" || true

echo "==> ESLint"
npm run lint:eslint 2>&1 | tee "$REPORTS_DIR/eslint.log" || true

echo "Jest/ESLint reports in $REPORTS_DIR"
