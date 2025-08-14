#!/bin/bash
# Setup script for the to-do command alias

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Create the alias function
TODO_FUNCTION="
# Ultraterrestrial to-do command
to-do() {
    if [ \$# -eq 0 ]; then
        echo \"Usage: to-do todo 'Your task here' [--refs 'references']\"
        echo \"       to-do note 'Your note here' [--refs 'references']\"
        return 1
    fi
    python3 \"$PROJECT_ROOT/scripts/todo-command.py\" \"\$@\"
}
"

# Add to various shell configurations
for shell_config in ~/.bashrc ~/.zshrc ~/.bash_profile; do
    if [ -f "$shell_config" ]; then
        # Check if already exists
        if ! grep -q "# Ultraterrestrial to-do command" "$shell_config"; then
            echo "" >> "$shell_config"
            echo "$TODO_FUNCTION" >> "$shell_config"
            echo "✅ Added to-do function to $shell_config"
        else
            echo "⚠️  to-do function already exists in $shell_config"
        fi
    fi
done

echo ""
echo "🎉 Setup complete! Restart your terminal or run:"
echo "   source ~/.bashrc    # or ~/.zshrc"
echo ""
echo "Then you can use:"
echo "   to-do todo 'Fix the database issue'"
echo "   to-do note 'Meeting notes from today'"
echo "   to-do todo 'Review PR #123' --refs 'https://github.com/...'"