#!/usr/bin/env bash
# Start every parallel-eligible task (see ready.sh), each in its own worktree, up to a limit.
# Usage: scripts/task/start-ready.sh [max-parallel=3] [--dry-run]
set -euo pipefail
dir="$(dirname "$0")"
source "$dir/lib.sh"

max="${1:-3}"; dry="${2:-}"
running="$(gh project item-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json -L 500 |
  jq '[.items[] | select(.status=="In progress")] | length')"
slots=$((max - running))
echo "In progress: $running, limit: $max, free slots: $slots"
[ "$slots" -gt 0 ] || exit 0

"$dir/ready.sh" | head -n "$slots" | while read -r _rank num _rest; do
  issue="${num#\#}"
  if [ "$dry" = "--dry-run" ]; then echo "would start #$issue"; else "$dir/start.sh" "$issue"; fi
done

