#!/usr/bin/env bash
# Automated rollback to the previous blue-green slot on deploy failure.

set -euo pipefail

STATE_DIR="${STATE_DIR:-.deploy}"
MANIFEST="$STATE_DIR/deployment-state.json"
REASON="${1:-deploy failure}"

if [[ ! -f "$MANIFEST" ]]; then
  echo "No deployment state found — nothing to roll back"
  exit 0
fi

echo "==> ROLLBACK triggered: $REASON"

python3 - <<PY
import json
from pathlib import Path

reason = """$REASON"""
manifest = Path(".deploy/deployment-state.json")
state = json.loads(manifest.read_text())
previous = state.get("previous_slot") or ("blue" if state.get("active_slot") == "green" else "green")
active = state.get("active_slot", "blue")

state["active_slot"] = previous
state["rollback"] = {"from_slot": active, "to_slot": previous, "reason": reason}
state["pending_slot"] = ""
if previous in state:
    state[previous]["status"] = "active"
if active in state:
    state[active]["status"] = "rolled_back"

manifest.write_text(json.dumps(state, indent=2))
print(f"Rolled back: {active} → {previous}")
PY

# Restore previous frontend artifact if available
if [[ -d "$STATE_DIR/$previous-dist" ]]; then
  echo "==> Restoring frontend from $previous slot"
  rm -rf dist-rollback && cp -r "$STATE_DIR/$previous-dist" dist-rollback
fi

echo "==> Rollback complete"
