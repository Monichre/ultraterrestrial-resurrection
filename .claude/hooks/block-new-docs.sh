#!/usr/bin/env bash
# Deny Write of a brand-new .md/.txt unless it is a living canon filename.
# Existing files are always allowed (Write used as overwrite).
set -euo pipefail

input=$(cat)
file_path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

if [[ -z "$file_path" ]]; then
  exit 0
fi

if [[ -e "$file_path" ]]; then
  exit 0
fi

base=$(basename "$file_path")
case "$base" in
  README.md | CLAUDE.md | AGENTS.md | CONTRIBUTING.md | TODO.md | FEATURES.md | DAILY_WORK_PLAN.md | PRODUCT.md | DESIGN.md | CONTEXT.md | CONTEXT-MAP.md | GOAL.md)
    exit 0
    ;;
esac

if [[ "$file_path" =~ \.(md|txt)$ ]]; then
  jq -n --arg reason "Blocked new documentation file: ${file_path}. Edit an existing living doc instead of creating a new .md/.txt." '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
fi

exit 0
