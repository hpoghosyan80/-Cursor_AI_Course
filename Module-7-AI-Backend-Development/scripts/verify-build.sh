#!/usr/bin/env bash
# Local CI verification for Module 7 — mirrors GitHub Actions test-backend job.
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Module 7 build verification"

python3 -m venv .venv
source .venv/bin/activate
pip install -q --upgrade pip
pip install -q -r requirements.txt

export FLASK_APP=run.py
export SECRET_KEY=ci-secret-key-minimum-32-characters-long
export JWT_SECRET_KEY=ci-jwt-secret-key-minimum-32-chars

echo "==> pytest (parallel, 85% coverage gate)"
pytest -n auto --dist loadgroup

echo "==> import check"
python -c "from app import create_app; app = create_app(); print('App OK:', app.name)"

echo "✅ Module 7 verification passed"
