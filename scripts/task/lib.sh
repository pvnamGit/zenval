#!/usr/bin/env bash
# Shared helpers for the task lifecycle (GitHub Issue + Project board + worktree).
# Requires: gh (with `project` scope), jq, git.
set -euo pipefail

PROJECT_OWNER="${PROJECT_OWNER:-pvnamGit}"
PROJECT_NUMBER="${PROJECT_NUMBER:-4}" # "Zenval Board"

repo_slug() { gh repo view --json nameWithOwner -q .nameWithOwner; }

# set_status <issue-number> <Status option name, e.g. "In progress">
set_status() {
  local issue="$1" status="$2" repo owner name project_id field_id option_id item_id
  repo="$(repo_slug)"; owner="${repo%/*}"; name="${repo#*/}"

  project_id="$(gh project view "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json -q .id)"
  read -r field_id option_id < <(
    gh project field-list "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" --format json |
      jq -r --arg s "$status" '.fields[] | select(.name=="Status") | "\(.id) \(.options[] | select(.name==$s) | .id)"'
  )
  [ -n "${option_id:-}" ] || { echo "Status option '$status' not found" >&2; return 1; }

  item_id="$(gh api graphql -f query='
    query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){issue(number:$n){
      projectItems(first:20){nodes{id project{id}}}}}}' \
    -f o="$owner" -f r="$name" -F n="$issue" |
    jq -r --arg p "$project_id" '.data.repository.issue.projectItems.nodes[] | select(.project.id==$p) | .id')"

  if [ -z "$item_id" ]; then
    item_id="$(gh project item-add "$PROJECT_NUMBER" --owner "$PROJECT_OWNER" \
      --url "https://github.com/$repo/issues/$issue" --format json -q .id)"
  fi
  gh project item-edit --id "$item_id" --project-id "$project_id" \
    --field-id "$field_id" --single-select-option-id "$option_id" >/dev/null
  echo "Issue #$issue -> $status"
}

