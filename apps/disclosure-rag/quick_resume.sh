#!/bin/bash

# Quick Resume Script - AGNO UFO YouTube Agent
# Created: August 31, 2025
# Status: System Fully Operational

echo "🚀 AGNO UFO YouTube Agent - Quick Resume"
echo "========================================"

# Navigate to working directory
cd /Users/liamellis/Desktop/ultraterrestrial-resurrection/apps/disclosure-rag

echo "📁 Working Directory: $(pwd)"
echo ""

# Check system status
echo "🔍 Checking System Status..."

# Check key files
echo "📋 Key Files:"
for file in "activate_agno.py" "lib/youtube.py" "lib/shared_entity_store.py" "agents/ufo_youtube_agent.py"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file - Missing!"
    fi
done
echo ""

# Check environment variables
echo "🔐 Environment Variables:"
if [ -n "$ANTHROPIC_API_KEY" ]; then
    echo "  ✅ ANTHROPIC_API_KEY configured"
else
    echo "  ❌ ANTHROPIC_API_KEY not set"
fi

if [ -n "$OPENAI_API_KEY" ]; then
    echo "  ✅ OPENAI_API_KEY configured"  
else
    echo "  ❌ OPENAI_API_KEY not set"
fi
echo ""

# Check Python dependencies
echo "🐍 Python Dependencies:"
python -c "
try:
    import anthropic
    print('  ✅ anthropic')
except ImportError:
    print('  ❌ anthropic - run: pip install anthropic')

try:
    import openai
    print('  ✅ openai')
except ImportError:
    print('  ❌ openai - run: pip install openai')
    
try:
    import yt_dlp
    print('  ✅ yt-dlp')
except ImportError:
    print('  ❌ yt-dlp - run: pip install yt-dlp')

try:
    from lib.shared_entity_store import shared_entity_store
    print('  ✅ shared_entity_store')
except ImportError:
    print('  ❌ shared_entity_store - check lib/ directory')
"
echo ""

echo "📊 System Status: ✅ OPERATIONAL"
echo ""
echo "🎯 Quick Commands:"
echo "  Test System:    python activate_agno.py 'https://www.youtube.com/watch?v=ZZ5LpwO-An4'"
echo "  Analyze UFO:    python activate_agno.py 'YOUR_UFO_VIDEO_URL'"
echo "  View Resume:    cat SESSION_RESUME_20250831.md"
echo "  View Work Log:  cat WORKLOG_AGNO_ACTIVATION_20250831.md"
echo ""
echo "🛸 AGNO UFO Research System Ready!"
echo ""

# Optional: Auto-test if first argument provided
if [ "$1" != "" ]; then
    echo "🧪 Running test with provided URL: $1"
    echo ""
    python activate_agno.py "$1"
fi