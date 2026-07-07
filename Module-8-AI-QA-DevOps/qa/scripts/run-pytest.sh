#!/usr/bin/env bash
# Run pytest suites for Module 7 (backend) and Module 8 (QA API) with JSON reports.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
mkdir -p "$REPORTS_DIR"

cd "$MODULE_ROOT"
source venv/bin/activate 2>/dev/null || true

echo "==> pytest: Module 8 QA suite (unittest via pytest)"
python -m pytest tests/ \
  --json-report \
  --json-report-file="$REPORTS_DIR/pytest-module8.json" \
  -q \
  --tb=short 2>&1 | tee "$REPORTS_DIR/pytest-module8.log" || true

MODULE7="$MODULE_ROOT/../Module-7-AI-Backend-Development"
if [[ -d "$MODULE7/tests" ]]; then
  echo "==> pytest: Module 7 backend suite"
  cd "$MODULE7"
  python -m pytest tests/ \
    --json-report \
    --json-report-file="$REPORTS_DIR/pytest-module7.json" \
    -q \
    --tb=short 2>&1 | tee "$REPORTS_DIR/pytest-module7.log" || true
fi

echo "pytest reports written to $REPORTS_DIR"
