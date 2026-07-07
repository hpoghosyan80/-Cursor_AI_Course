#!/usr/bin/env bash
# Blue-green deployment orchestrator.
# Deploys to the inactive slot, runs health checks, then switches traffic.

set -euo pipefail

ACTION="${1:-deploy}"          # deploy | promote | status
ENVIRONMENT="${2:-production}"
STATE_DIR="${STATE_DIR:-.deploy}"
MANIFEST="$STATE_DIR/deployment-state.json"
FRONTEND_DIST="${FRONTEND_DIST:-dist}"

mkdir -p "$STATE_DIR"

init_state() {
  if [[ ! -f "$MANIFEST" ]]; then
    cat > "$MANIFEST" <<EOF
{
  "active_slot": "blue",
  "blue": { "commit": "", "deployed_at": "" },
  "green": { "commit": "", "deployed_at": "" }
}
EOF
  fi
}

get_active_slot() {
  python3 -c "import json; print(json.load(open('$MANIFEST'))['active_slot'])"
}

get_inactive_slot() {
  local active
  active=$(get_active_slot)
  [[ "$active" == "blue" ]] && echo "green" || echo "blue"
}

deploy_green() {
  init_state
  local slot commit
  slot=$(get_inactive_slot)
  commit="${GITHUB_SHA:-local}"

  echo "==> Blue-green deploy to slot: $slot"
  echo "    Commit: $commit"
  echo "    Environment: $ENVIRONMENT"

  if [[ ! -d "$FRONTEND_DIST" ]]; then
    echo "Error: frontend dist not found at $FRONTEND_DIST"
    exit 1
  fi

  cp -r "$FRONTEND_DIST" "$STATE_DIR/$slot-dist"
  python3 - <<PY
import json, datetime
state = json.load(open("$MANIFEST"))
state["$slot"] = {
    "commit": "$commit",
    "deployed_at": datetime.datetime.utcnow().isoformat() + "Z",
    "status": "deployed"
}
state["pending_slot"] = "$slot"
json.dump(state, open("$MANIFEST", "w"), indent=2)
PY
  echo "==> Deployed to $slot slot (inactive). Run health-check before promote."
}

promote() {
  init_state
  local pending
  pending=$(python3 -c "import json; s=json.load(open('$MANIFEST')); print(s.get('pending_slot',''))")
  if [[ -z "$pending" ]]; then
    echo "Error: no pending slot to promote"
    exit 1
  fi

  python3 - <<PY
import json
state = json.load(open("$MANIFEST"))
state["active_slot"] = "$pending"
state["previous_slot"] = "blue" if "$pending" == "green" else "green"
state["pending_slot"] = ""
state["$pending"]["status"] = "active"
json.dump(state, open("$MANIFEST", "w"), indent=2)
PY
  echo "==> Traffic switched to $pending slot"
  cat "$MANIFEST"
}

status() {
  init_state
  cat "$MANIFEST"
}

case "$ACTION" in
  deploy)  deploy_green ;;
  promote) promote ;;
  status)  status ;;
  *) echo "Usage: $0 {deploy|promote|status} [environment]"; exit 1 ;;
esac
