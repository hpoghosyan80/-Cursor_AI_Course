#!/usr/bin/env bash
# Placeholder frontend deploy — GitHub Actions uses upload-pages-artifact instead.
# Use this script for manual or custom hosting (S3, Netlify, Vercel, etc.).

set -euo pipefail

DIST_DIR="${1:-Module-6-AI-Frontend-Development/dist}"
ENVIRONMENT="${2:-staging}"

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Error: build output not found at $DIST_DIR"
  echo "Run: cd Module-6-AI-Frontend-Development && npm run build"
  exit 1
fi

echo "==> Deploying frontend to: $ENVIRONMENT"
echo "    Source: $DIST_DIR"
echo "    Files:  $(find "$DIST_DIR" -type f | wc -l | tr -d ' ') files"

# Example: aws s3 sync "$DIST_DIR" s3://my-bucket/ --delete
# Example: netlify deploy --prod --dir="$DIST_DIR"

echo "==> Frontend deploy complete (placeholder)."
