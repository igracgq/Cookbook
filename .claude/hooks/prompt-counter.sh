#!/bin/bash
# UserPromptSubmit hook: counts how many prompts the user has sent in this chat session.
# Keeps one counter file per session id and tells Claude the running total, so
# asking "how many times have I prompted you?" gets an exact answer.
input=$(cat)
sid=$(printf '%s' "$input" | jq -r '.session_id // empty' 2>/dev/null)
[ -z "$sid" ] && exit 0
dir="${PROMPT_COUNT_DIR:-$HOME/.claude/prompt-counts}"
mkdir -p "$dir" || exit 0
f="$dir/$sid.count"
n=$(cat "$f" 2>/dev/null)
n=$(( ${n:-0} + 1 ))
printf '%s' "$n" > "$f"
printf '%s\t%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$n" >> "$dir/$sid.log"
jq -n --argjson n "$n" '{hookSpecificOutput:{hookEventName:"UserPromptSubmit",additionalContext:("Prompt counter: the user has sent \($n) prompt(s) in this chat session so far, including this one. Log: ~/.claude/prompt-counts/. Mention the count only if asked.")}}'
