#!/usr/bin/env bash
# List tasks that can run in parallel: board status "Ready", open, no open blockers, and every
# hard dependency from docs/backlog/execution-order.json is closed.
# Usage: scripts/task/ready.sh [--json]     (prints "<rank> #<issue> <task> <title>" by rank)
# Live GitHub state is the authority; the JSON file only supplies task-id -> issue mapping and ranks.
# Tasks touching the same files/contracts are NOT detected: review the list before starting.
set -euo pipefail
source "$(dirname "$0")/lib.sh"

order="$(git rev-parse --show-toplevel)/docs/backlog/execution-order.json"
repo="$(repo_slug)"

items="$(gh project item-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json -L 500)"
closed_state() { gh api "repos/$repo/issues/$1" --jq .state; }

out=""
while IFS=$'\t' read -r rank task issue deps; do
  status="$(jq -r --argjson n "$issue" '.items[] | select(.content.number==$n) | .status // ""' <<<"$items")"
  [ "$status" = "Ready" ] || continue
  [ "$(closed_state "$issue")" = "open" ] || continue

  # native GitHub blockers (issue dependencies)
  open_blockers="$(gh api "repos/$repo/issues/$issue/dependencies/blocked_by" --jq '[.[]|select(.state=="open")]|length' 2>/dev/null || echo 0)"
  [ "$open_blockers" = "0" ] || continue

  # task-level hard dependencies; unknown task => treat as blocked
  ok=1
  for d in $deps; do
    dep_issue="$(jq -r --arg t "$d" '.entries[] | select(.task==$t) | .issue' "$order")"
    if [ -z "$dep_issue" ] || [ "$(closed_state "$dep_issue")" != "closed" ]; then ok=0; break; fi
  done
  [ "$ok" = 1 ] || continue

  title="$(jq -r --argjson n "$issue" '.items[] | select(.content.number==$n) | .title' <<<"$items")"
  out+="$rank #$issue $task $title"$'\n'
done < <(jq -r '.entries[] | [.rank, .task, .issue, (.hard_dependencies|join(" "))] | @tsv' "$order")

if [ "${1:-}" = "--json" ]; then
  printf '%s' "$out" | awk 'NF{gsub("#","",$2); print $2}' | jq -Rn '[inputs|tonumber]'
else
  printf '%s' "$out"
fi

