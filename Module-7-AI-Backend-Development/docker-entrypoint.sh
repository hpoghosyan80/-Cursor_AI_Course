#!/bin/bash
set -euo pipefail
# Initialize SQLite tables before starting gunicorn (Docker / production).
python -c "from app import create_app; create_app()"
exec gunicorn -w 2 -b 0.0.0.0:5000 "run:app"
