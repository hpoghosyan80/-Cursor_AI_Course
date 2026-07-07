#!/usr/bin/env bash
# Post-deploy health checks with retries and exit codes for CI.

set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-}"
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
MAX_RETRIES="${MAX_RETRIES:-8}"
RETRY_DELAY="${RETRY_DELAY:-5}"
TIMEOUT_SEC="${TIMEOUT_SEC:-10}"

check_http() {
  local name="$1" url="$2" expected="${3:-200}"
  local attempt=1 status elapsed

  while [[ $attempt -le $MAX_RETRIES ]]; do
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT_SEC" "$url" 2>/dev/null || echo "000")
    if [[ "$status" == "$expected" ]]; then
      elapsed=$((attempt * RETRY_DELAY))
      echo "OK  $name ($url) status=$status attempts=$attempt"
      return 0
    fi
    echo "WAIT $name attempt $attempt/$MAX_RETRIES status=$status url=$url"
    sleep "$RETRY_DELAY"
    attempt=$((attempt + 1))
  done
  echo "FAIL $name ($url) expected=$expected after $MAX_RETRIES attempts"
  return 1
}

check_docker_health() {
  local container="$1"
  local status
  status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "unknown")
  if [[ "$status" == "healthy" ]]; then
    echo "OK  docker health ($container) = healthy"
    return 0
  fi
  echo "FAIL docker health ($container) = $status"
  return 1
}

echo "==> Deployment health checks"
FAILED=0

if [[ -n "$BACKEND_URL" ]]; then
  check_http "backend-health" "${BACKEND_URL%/}/health" || FAILED=1
fi

if [[ -n "$FRONTEND_URL" ]]; then
  check_http "frontend-root" "$FRONTEND_URL" || FAILED=1
  check_http "frontend-health" "${FRONTEND_URL%/}/health" 200 || FAILED=1
fi

if [[ -n "${BACKEND_CONTAINER:-}" ]]; then
  check_docker_health "$BACKEND_CONTAINER" || FAILED=1
fi

if [[ -n "${FRONTEND_CONTAINER:-}" ]]; then
  check_docker_health "$FRONTEND_CONTAINER" || FAILED=1
fi

# In-process smoke when no live URLs (CI default)
if [[ -z "$FRONTEND_URL" && -z "${SKIP_INPROCESS_CHECK:-}" ]]; then
  echo "==> In-process API smoke test"
  cd Module-8-AI-QA-DevOps
  python3 -c "
from src.rest_app import create_rest_app
c = create_rest_app().test_client()
r = c.get('/api/products')
assert r.status_code == 200, r.status_code
print('OK  in-process REST API smoke test')
" || FAILED=1
fi

if [[ $FAILED -ne 0 ]]; then
  echo "==> Health checks FAILED"
  exit 1
fi

echo "==> All health checks passed"
