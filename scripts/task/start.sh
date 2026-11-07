#!/usr/bin/env bash
# Pick a task: move the issue to "In progress" and check it out in a new worktree from origin/main.
# Usage: scripts/task/start.sh <issue-number> [branch-prefix=feat]
set -euo pipefail
source "$(dirname "$0")/lib.sh"

issue="${1:?usage: start.sh <issue-number> [branch-prefix]}"
prefix="${2:-feat}"

root="$(git rev-parse --show-toplevel)"
title="$(gh issue view "$issue" --json title -q .title)"
slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' | cut -c1-40 | sed -E 's/-+$//')"
branch="$prefix/$issue-$slug"
dir="$root/.worktrees/$issue-$slug" # .worktrees/ is gitignored

git fetch origin main --quiet
if git worktree list --porcelain | grep -q "branch refs/heads/$branch$"; then
  echo "Worktree for $branch already exists" >&2
else
  git worktree add -b "$branch" "$dir" origin/main
fi

set_status "$issue" "In progress"
echo "Worktree: $dir"
echo "Branch:   $branch  (open the PR with 'Closes #$issue' in the body)"

