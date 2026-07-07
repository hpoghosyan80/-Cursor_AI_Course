#!/usr/bin/env bash
# Send rich Slack notification when CI jobs fail.

set -euo pipefail

FAILED_JOBS="${FAILED_JOBS:-unknown}"
WORKFLOW="${GITHUB_WORKFLOW:-CI/CD}"
REF="${GITHUB_REF_NAME:-local}"
COMMIT="${GITHUB_SHA:-local}"
ACTOR="${GITHUB_ACTOR:-ci}"
RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-repo}/actions/runs/${GITHUB_RUN_ID:-0}"

if [[ -z "${SLACK_WEBHOOK_URL:-}" ]]; then
  echo "SLACK_WEBHOOK_URL not set — skipping Slack notification"
  exit 0
fi

PAYLOAD=$(cat <<EOF
{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "CI Pipeline Failed", "emoji": true }
    },
    {
      "type": "section",
      "fields": [
        { "type": "mrkdwn", "text": "*Workflow:*\n${WORKFLOW}" },
        { "type": "mrkdwn", "text": "*Branch:*\n${REF}" },
        { "type": "mrkdwn", "text": "*Commit:*\n\`${COMMIT:0:7}\`" },
        { "type": "mrkdwn", "text": "*Author:*\n${ACTOR}" }
      ]
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "*Failed jobs:*\n\`\`\`${FAILED_JOBS}\`\`\`" }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View Run" },
          "url": "${RUN_URL}"
        }
      ]
    }
  ]
}
EOF
)

curl -s -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

echo "==> Slack failure notification sent"
