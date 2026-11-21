#!/usr/bin/env bash
# Suggest /compact at logical intervals via additionalContext (stderr is invisible on exit 0).
set -euo pipefail

cat >/dev/null

project="${CLAUDE_PROJECT_DIR:-$PWD}"
safe=$(printf '%s' "$project" | tr '/ ' '__')
counter_file="${TMPDIR:-/tmp}/claude-compact-count-${safe}"
threshold="${COMPACT_THRESHOLD:-50}"

if [[ -f "$counter_file" ]]; then
  count=$(cat "$counter_file")
  count=$((count + 1))
else
  count=1
fi
printf '%s\n' "$count" >"$counter_file"

msg=""
if [[ "$count" -eq "$threshold" ]]; then
  msg="${threshold} file edits this session — consider /compact if you are leaving exploration for implementation."
elif [[ "$count" -gt "$threshold" && $((count % 25)) -eq 0 ]]; then
  msg="${count} file edits — checkpoint for /compact if context is stale."
fi

if [[ -n "$msg" ]]; then
  jq -n --arg ctx "$msg" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext: $ctx
    }
  }'
fi

exit 0
