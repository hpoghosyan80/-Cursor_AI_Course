#!/usr/bin/env bash
# Run every QA check: POM E2E, pytest, Jest, ESLint, Pylint, Snyk, ZAP, k6, reports.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "$SCRIPT_DIR/../run-qa.sh" "$@"
