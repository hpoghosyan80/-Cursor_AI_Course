#!/usr/bin/env bash
# Placeholder backend deploy for Flask API (Module 7).
# Replace with your platform CLI: gunicorn on Railway, Render, Fly.io, etc.

set -euo pipefail

ENVIRONMENT="${1:-staging}"
APP_DIR="${2:-Module-7-AI-Backend-Development}"

echo "==> Deploying Flask API to: $ENVIRONMENT"
echo "    Source: $APP_DIR"

if [[ ! -f "$APP_DIR/requirements.txt" ]]; then
  echo "Error: backend not found at $APP_DIR"
  exit 1
fi

# Example production commands:
#   pip install -r requirements.txt
#   flask db upgrade
#   gunicorn -w 4 -b 0.0.0.0:5000 run:app

if [[ -n "${DEPLOY_API_URL:-}" ]]; then
  echo "    Webhook: $DEPLOY_API_URL"
fi

echo "==> Backend deploy complete (placeholder)."
echo "    Health check: curl \${API_URL:-http://localhost:5000}/health"
