#!/usr/bin/env bash
# Master QA orchestrator — runs all quality gates and generates dashboard + recommendations.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
SCRIPTS="$MODULE_ROOT/qa/scripts"

export QA_START_TIME
QA_START_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$REPORTS_DIR"

echo "=============================================="
echo "  QA Automation System — Module 8"
echo "  Started: $QA_START_TIME"
echo "=============================================="

STEPS=(
  "run-e2e-pom.sh:Playwright E2E (POM)"
  "run-pytest.sh:Pytest (Module 7 + 8)"
  "run-pylint.sh:Pylint"
  "run-jest-eslint.sh:Jest + ESLint"
  "run-snyk.sh:Snyk"
  "run-zap.sh:OWASP ZAP"
  "run-k6.sh:k6 Load Test"
)

for step in "${STEPS[@]}"; do
  script="${step%%:*}"
  label="${step##*:}"
  echo ""
  echo "--- $label ---"
  bash "$SCRIPTS/$script" || true
done

echo ""
echo "--- Generating Dashboard ---"
cd "$MODULE_ROOT"
source venv/bin/activate 2>/dev/null || true
python qa/scripts/generate_dashboard.py
python qa/scripts/generate_recommendations.py
python qa/scripts/generate_report.py

echo ""
echo "=============================================="
echo "  QA run complete"
echo "  Dashboard:  qa/reports/dashboard.html"
echo "  Full report: qa/reports/QA_REPORT.html"
echo "  Recommendations: qa/reports/recommendations.md"
echo "=============================================="
