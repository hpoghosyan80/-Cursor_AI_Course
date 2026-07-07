#!/usr/bin/env bash
# Snyk security scan for npm (Module 6) and Python (Module 7/8).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORTS_DIR="$MODULE_ROOT/qa/reports"
mkdir -p "$REPORTS_DIR"

if ! command -v snyk &>/dev/null; then
  echo '{"skipped": true, "reason": "snyk CLI not installed"}' > "$REPORTS_DIR/snyk-results.json"
  echo "Snyk skipped: install with npm i -g snyk"
  exit 0
fi

if [[ -z "${SNYK_TOKEN:-}" ]]; then
  echo '{"skipped": true, "reason": "SNYK_TOKEN not set"}' > "$REPORTS_DIR/snyk-results.json"
  echo "Snyk skipped: set SNYK_TOKEN environment variable"
  exit 0
fi

echo "==> Snyk scans"
RESULTS=()

FRONTEND="$MODULE_ROOT/../Module-6-AI-Frontend-Development"
if [[ -f "$FRONTEND/package.json" ]]; then
  cd "$FRONTEND"
  snyk test --json > "$REPORTS_DIR/snyk-npm.json" 2>&1 || true
  RESULTS+=("npm")
fi

cd "$MODULE_ROOT"
snyk test --file=requirements.txt --json > "$REPORTS_DIR/snyk-python-module8.json" 2>&1 || true
RESULTS+=("python-module8")

MODULE7="$MODULE_ROOT/../Module-7-AI-Backend-Development"
if [[ -f "$MODULE7/requirements.txt" ]]; then
  cd "$MODULE7"
  snyk test --file=requirements.txt --json > "$REPORTS_DIR/snyk-python-module7.json" 2>&1 || true
  RESULTS+=("python-module7")
fi

python3 -c "
import json, pathlib
reports = pathlib.Path('$REPORTS_DIR')
merged = {'scans': [], 'vulnerabilities': 0}
for name in ['snyk-npm.json', 'snyk-python-module8.json', 'snyk-python-module7.json']:
    p = reports / name
    if p.exists():
        try:
            data = json.loads(p.read_text())
            merged['scans'].append(name)
            merged['vulnerabilities'] += len(data.get('vulnerabilities', []))
        except json.JSONDecodeError:
            pass
(reports / 'snyk-results.json').write_text(json.dumps(merged, indent=2))
"

echo "Snyk reports in $REPORTS_DIR"
