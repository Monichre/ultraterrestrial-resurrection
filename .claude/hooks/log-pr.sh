#!/usr/bin/env bash
# After `gh pr create`, inject the PR URL into Claude's context.
set -euo pipefail

input=$(cat)
output=$(printf '%s' "$input" | jq -r '
  .tool_response as $r
  | if ($r | type) == "string" then $r
    elif ($r | type) == "object" then ($r.output // $r.stdout // empty)
    else empty
    end
')

pr_url=$(printf '%s' "$output" | grep -oE 'https://github.com/[^/]+/[^/]+/pull/[0-9]+' | head -1 || true)
if [[ -z "$pr_url" ]]; then
  exit 0
fi

pr_num=$(printf '%s' "$pr_url" | grep -oE '[0-9]+$')
jq -n --arg ctx "PR created: ${pr_url}. Review with: gh pr review ${pr_num}" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'
