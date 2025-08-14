#!/usr/bin/env python3
"""
Custom to-do command for the Ultraterrestrial project.
Appends entries to NOTES.md with timestamps.

Usage:
  python scripts/todo-command.py todo "Fix the database connection issue"
  python scripts/todo-command.py note "Meeting notes from today's call"
  python scripts/todo-command.py todo "Review PR #123" --refs "https://github.com/..."
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path

def get_notes_file_path():
    """Get the path to NOTES.md in project root."""
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    return project_root / "NOTES.md"

def format_timestamp():
    """Format current timestamp for entry."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def append_todo_entry(content, refs=None):
    """Append a to-do entry to NOTES.md."""
    timestamp = format_timestamp()
    notes_file = get_notes_file_path()
    
    entry = f"\n## To-Do [{timestamp}]\n\n"
    entry += f"- [ ] {content}\n"
    
    if refs:
        entry += f"  - **References:** {refs}\n"
    
    entry += "\n"
    
    with open(notes_file, 'a', encoding='utf-8') as f:
        f.write(entry)
    
    print(f"✅ Added to-do: {content}")

def append_note_entry(content, refs=None):
    """Append a note entry to NOTES.md."""
    timestamp = format_timestamp()
    notes_file = get_notes_file_path()
    
    entry = f"\n## Note [{timestamp}]\n\n"
    entry += f"{content}\n"
    
    if refs:
        entry += f"\n**References:** {refs}\n"
    
    entry += "\n"
    
    with open(notes_file, 'a', encoding='utf-8') as f:
        f.write(entry)
    
    print(f"📝 Added note: {content[:50]}{'...' if len(content) > 50 else ''}")

def main():
    parser = argparse.ArgumentParser(description='Add to-do items or notes to NOTES.md')
    parser.add_argument('type', choices=['todo', 'note'], help='Type of entry (todo or note)')
    parser.add_argument('content', help='Content of the entry')
    parser.add_argument('--refs', '--references', help='Additional references or links')
    
    args = parser.parse_args()
    
    # Ensure NOTES.md exists
    notes_file = get_notes_file_path()
    if not notes_file.exists():
        with open(notes_file, 'w', encoding='utf-8') as f:
            f.write("# NOTES.md\n\nPersonal notes and to-do items for the Ultraterrestrial project.\n\n---\n")
    
    if args.type == 'todo':
        append_todo_entry(args.content, args.refs)
    elif args.type == 'note':
        append_note_entry(args.content, args.refs)

if __name__ == '__main__':
    main()