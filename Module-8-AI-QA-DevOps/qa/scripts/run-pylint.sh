#!/usr/bin/env bash
# Run Pylint on Module 7, Module 8 Python sources; output JSON report.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
mkdir -p "$REPORTS_DIR"

cd "$MODULE_ROOT"
source venv/bin/activate 2>/dev/null || true

TARGETS=(
  "$MODULE_ROOT/src"
  "$MODULE_ROOT/../Module-7-AI-Backend-Development/app"
)

echo "==> Pylint"
pylint "${TARGETS[@]}" \
  --rcfile="$MODULE_ROOT/.pylintrc" \
  --jobs=1 \
  --output-format=json \
  > "$REPORTS_DIR/pylint-results.json" 2>&1 || true

pylint "${TARGETS[@]}" \
  --rcfile="$MODULE_ROOT/.pylintrc" \
  --jobs=1 \
  --score=y \
  2>&1 | tee "$REPORTS_DIR/pylint.log" || true

echo "Pylint report: $REPORTS_DIR/pylint-results.json"
