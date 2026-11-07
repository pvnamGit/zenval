#!/usr/bin/env bash
# Delete worktrees (and local branches) whose PR has been merged.
# Usage: scripts/task/cleanup.sh [--dry-run]
# Run after a PR is merged: `pnpm task:cleanup`.
set -euo pipefail

dry=0; [ "${1:-}" = "--dry-run" ] && dry=1
root="$(git rev-parse --path-format=absolute --git-common-dir)"; root="${root%/.git}"
cd "$root"
git fetch origin --prune --quiet

git worktree list --porcelain | awk '/^worktree /{p=$2} /^branch /{sub("refs/heads/","",$2); print p"\t"$2}' |
while IFS=$'\t' read -r path branch; do
  [ "$path" = "$root" ] && continue
  [ "$branch" = "main" ] && continue
  merged="$(gh pr list --head "$branch" --state merged --json number -q '.[0].number // empty')"
  [ -n "$merged" ] || continue
  if [ -n "$(git -C "$path" status --porcelain)" ]; then
    echo "SKIP $path (PR #$merged merged but worktree has uncommitted changes)"; continue
  fi
  echo "REMOVE $path ($branch, PR #$merged)"
  if [ "$dry" = 0 ]; then
    git worktree remove "$path"
    git branch -D "$branch" >/dev/null
  fi
done
git worktree prune
