#!/usr/bin/env bash
# Send deployment events to monitoring (Datadog, Grafana, Slack webhook, etc.).

set -euo pipefail

EVENT="${1:-deploy}"
STATUS="${2:-success}"
COMMIT="${GITHUB_SHA:-local}"
REF="${GITHUB_REF_NAME:-local}"
RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-local}/actions/runs/${GITHUB_RUN_ID:-0}"

PAYLOAD=$(cat <<EOF
{
  "event": "$EVENT",
  "status": "$STATUS",
  "commit": "$COMMIT",
  "ref": "$REF",
  "repository": "${GITHUB_REPOSITORY:-cursor-ai-course}",
  "workflow_run": "$RUN_URL",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
)

echo "==> Monitoring event: $EVENT ($STATUS)"
echo "$PAYLOAD" | python3 -m json.tool

# Optional: Datadog events API
if [[ -n "${DATADOG_API_KEY:-}" ]]; then
  curl -s -X POST "https://api.datadoghq.com/api/v1/events" \
    -H "DD-API-KEY: $DATADOG_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"CI/CD $EVENT: $STATUS\",
      \"text\": \"Commit $COMMIT on $REF\",
      \"alert_type\": \"$([ \"$STATUS\" = success ] && echo success || echo error)\",
      \"source_type_name\": \"github_actions\"
    }" || true
fi

# Optional: generic monitoring webhook
if [[ -n "${MONITORING_WEBHOOK_URL:-}" ]]; then
  curl -s -X POST "$MONITORING_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" || true
fi

# Optional: Slack
if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
  curl -s -X POST "$SLACK_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"[$STATUS] $EVENT — $REF @ ${COMMIT:0:7} — $RUN_URL\"}" || true
fi

echo "==> Monitoring notification sent"
