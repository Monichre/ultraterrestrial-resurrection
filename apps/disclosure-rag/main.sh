#!/bin/bash

# Disclosure RAG Main Script
# Enhanced functionality for processing various content types

# Color codes for output.
#
# $'...' makes bash interpret the escapes at assignment time, so these hold real
# ESC bytes. With plain '...' they held the 7 literal characters \033[0;34m, which
# `echo -e` re-interpreted but the show_help heredoc did not — help output printed
# raw escape text (DY-BENCH B1.1). Real ESC bytes render correctly in both.
RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[1;33m'
BLUE=$'\033[0;34m'
NC=$'\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Check for python3
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 is required but not installed.${NC}"
    exit 1
fi

VENV_DIR="$SCRIPT_DIR/.venv"
VENV_PYTHON="$VENV_DIR/bin/python"

# Check if virtual environment exists
if [ ! -x "$VENV_PYTHON" ]; then
    echo -e "${YELLOW}Virtual environment not found or missing python. Creating...${NC}"
    python3 -m venv "$VENV_DIR"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create virtual environment${NC}"
        exit 1
    fi
    "$VENV_PYTHON" -m pip install --upgrade pip
    "$VENV_PYTHON" -m pip install -r "$SCRIPT_DIR/requirements.txt"
fi

# Do not rely on .venv/bin/activate here: this repo has been moved before, and
# activate scripts hard-code absolute paths. Route every Python call through the
# venv interpreter directly so shell aliases/conda cannot hijack execution.
export VIRTUAL_ENV="$VENV_DIR"
export PATH="$VENV_DIR/bin:$PATH"

# Load environment variables.
#
# .env supplies DEFAULTS, not overrides. Previously this sourced .env with
# `set -a` and nothing else, so every value in the file clobbered whatever the
# caller had exported — `OPENAI_API_KEY=... dy <url>` silently ran with the .env
# key instead, and no per-invocation override of any credential or setting was
# possible. This snapshots the caller's exported environment first and re-applies
# it after sourcing, so explicit caller values win (python-dotenv's own default
# is override=False for the same reason).
if [ -f "$SCRIPT_DIR/.env" ]; then
    _CALLER_ENV="$(export -p)"
    set -a  # Enable auto-export
    source "$SCRIPT_DIR/.env"
    set +a  # Disable auto-export
    eval "$_CALLER_ENV" 2>/dev/null
    unset _CALLER_ENV
else
    echo -e "${YELLOW}Warning: .env file not found. Some features may not work.${NC}"
    echo -e "${YELLOW}Create a .env file with your API keys:${NC}"
    echo -e "${YELLOW}  OPENAI_API_KEY=your_key${NC}"
    echo -e "${YELLOW}  UFO_DATA_STORE_ID=your_vector_store_id${NC}"
fi

# Verify critical environment variables
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${YELLOW}Warning: OPENAI_API_KEY not set${NC}"
fi

if [ -z "$UFO_DATA_STORE_ID" ]; then
    echo -e "${YELLOW}Warning: UFO_DATA_STORE_ID not set (vector store uploads will not work)${NC}"
fi

# Function to display help
show_help() {
    cat << EOF
${BLUE}Disclosure RAG - UFO/UAP Research Toolkit${NC}

Usage: $0 [command] [options]

${GREEN}Commands:${NC}
  setup              Install/update dependencies
  process-url        Process a web article or YouTube video
  process-file       Process a local file
  process-urls       Process multiple URLs from a file
  process-playlist   Ingest every episode of YouTube playlist(s) (fidelity-gated)
  playlist           Alias for process-playlist
  ui                 Launch the Knowledge Base UI
  chat               Launch the chat interface
  sync-rag           Sync knowledge base to local RAG
  search             Search the knowledge base
  stats              Show knowledge base statistics
  help               Show this help message

${GREEN}Examples:${NC}
  $0 process-url https://example.com/ufo-article
  $0 process-url https://youtube.com/watch?v=... --upload
  $0 process-file /path/to/document.md
  $0 process-urls urls.txt --upload
  $0 process-playlist "https://youtube.com/playlist?list=..." --upload
  $0 process-playlist "https://youtube.com/playlist?list=..." --limit 5 --dry-run
  $0 ui
  $0 search "Phoenix Lights"

${GREEN}Options:${NC}
  --upload          Upload to OpenAI after processing
  --no-kb           Don't add to knowledge base
  --help            Show this help message

EOF
}

# Function to setup/update dependencies
setup() {
    echo -e "${BLUE}Setting up Disclosure RAG...${NC}"
    
    # Update pip
    "$VENV_PYTHON" -m pip install --upgrade pip
    
    # Install requirements
    "$VENV_PYTHON" -m pip install -r "$SCRIPT_DIR/requirements.txt"
    
    # Install additional dependencies for new features
    "$VENV_PYTHON" -m pip install streamlit sentence-transformers faiss-cpu
    
    echo -e "${GREEN}Setup complete!${NC}"
}

# Function to process URL
process_url() {
    local url=$1
    shift
    
    if [ -z "$url" ]; then
        echo -e "${RED}Error: URL required${NC}"
        echo "Usage: $0 process-url <URL> [options]"
        exit 1
    fi
    
    echo -e "${BLUE}Processing URL: $url${NC}"
    "$VENV_PYTHON" "$SCRIPT_DIR/main.py" "$url" "$@"
}

# Function to process file
process_file() {
    local file=$1
    shift
    
    if [ -z "$file" ]; then
        echo -e "${RED}Error: File path required${NC}"
        echo "Usage: $0 process-file <FILE> [options]"
        exit 1
    fi
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}Error: File not found: $file${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Processing file: $file${NC}"
    "$VENV_PYTHON" "$SCRIPT_DIR/main.py" "$file" "$@"
}

# Function to process multiple URLs
process_urls() {
    local file=$1
    shift

    if [ -z "$file" ]; then
        echo -e "${RED}Error: URL file required${NC}"
        echo "Usage: $0 process-urls <FILE> [options]"
        exit 1
    fi

    if [ ! -f "$file" ]; then
        echo -e "${RED}Error: File not found: $file${NC}"
        exit 1
    fi

    # main.py takes one input per invocation (no --url-file flag), so loop
    # over the file, skipping blank lines and # comments.
    echo -e "${BLUE}Processing URLs from: $file${NC}"
    local url
    while IFS= read -r url || [ -n "$url" ]; do
        url="${url%%#*}"
        url="$(echo "$url" | xargs)"
        [ -z "$url" ] && continue
        echo -e "${BLUE}--- $url${NC}"
        "$VENV_PYTHON" "$SCRIPT_DIR/main.py" "$url" "$@"
    done < "$file"
}

# Function to ingest YouTube playlist(s) through the fidelity-gated pipeline
process_playlist() {
    if [ -z "$1" ]; then
        echo -e "${RED}Error: Playlist URL required${NC}"
        echo "Usage: $0 process-playlist <PLAYLIST_URL> [PLAYLIST_URL...] [--upload] [--limit N] [--dry-run] [--force] [--min-fidelity 0.45] [--llm-review]"
        exit 1
    fi

    echo -e "${BLUE}Processing playlist(s) via fidelity-gated pipeline...${NC}"
    "$VENV_PYTHON" "$SCRIPT_DIR/scripts/playlist_ingestion.py" "$@"
}

# Function to launch UI
#
# Previously called `main.py --ui`, a flag main.py's argparse never defined, so
# this printed "Access the UI at ..." and then died on argument parsing without
# ever starting a server (DY-BENCH B1.7). The UI is a Streamlit app; launch it.
launch_ui() {
    if [ ! -f "$SCRIPT_DIR/knowledge_base_ui.py" ]; then
        echo -e "${RED}Error: knowledge_base_ui.py not found${NC}" >&2
        return 1
    fi
    if ! "$VENV_PYTHON" -c "import streamlit" 2>/dev/null; then
        echo -e "${RED}Error: streamlit is not installed in the venv.${NC}" >&2
        echo -e "${YELLOW}Install it with: $0 setup${NC}" >&2
        return 1
    fi
    echo -e "${BLUE}Launching Knowledge Base UI...${NC}"
    echo -e "${YELLOW}Access the UI at: http://localhost:8501${NC}"
    "$VENV_PYTHON" -m streamlit run "$SCRIPT_DIR/knowledge_base_ui.py" \
        --server.port 8501 "$@"
}

# Function to launch chat
launch_chat() {
    echo -e "${BLUE}Launching chat interface...${NC}"
    
    # Check if disclosure_chat.py exists
    if [ -f "$SCRIPT_DIR/disclosure_chat.py" ]; then
        "$VENV_PYTHON" "$SCRIPT_DIR/disclosure_chat.py"
    else
        echo -e "${YELLOW}Chat interface not found. Using UI chat instead...${NC}"
        launch_ui
    fi
}

# Function to sync RAG
#
# Previously called `main.py --sync-rag`, a flag main.py never defined, so this
# always died on argument parsing (DY-BENCH B1.7). The real implementation is
# lib/sync_to_upstash_search_integrated.py, which has its own argparse main().
sync_rag() {
    echo -e "${BLUE}Syncing knowledge base to search index...${NC}"
    "$VENV_PYTHON" -m lib.sync_to_upstash_search_integrated "$@"
}

# Function to search knowledge base
search_kb() {
    local query=$1
    
    if [ -z "$query" ]; then
        echo -e "${RED}Error: Search query required${NC}"
        echo "Usage: $0 search <QUERY>"
        exit 1
    fi
    
    echo -e "${BLUE}Searching for: $query${NC}"
    
    # Create a temporary Python script for search
    "$VENV_PYTHON" << EOF
import sys
sys.path.append("$SCRIPT_DIR")
from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD

kb = KnowledgeBaseCRUD()
results = kb.search_documents("$query")

if results:
    print(f"\nFound {len(results)} results:\n")
    for i, result in enumerate(results, 1):
        print(f"{i}. {result['title']} (Score: {result['score']})")
        print(f"   Type: {result['doc_type']}")
        print(f"   {result['snippet']}\n")
else:
    print("No results found.")
EOF
}

# Function to show statistics
show_stats() {
    echo -e "${BLUE}Knowledge Base Statistics${NC}"
    
    "$VENV_PYTHON" << EOF
import sys
sys.path.append("$SCRIPT_DIR")
from lib.kb.knowledge_base_crud import KnowledgeBaseCRUD

kb = KnowledgeBaseCRUD()
stats = kb.get_statistics()

print(f"\nTotal Documents: {stats['total_documents']}")
print(f"Total Tags: {stats['total_tags']}")
print(f"Last Updated: {stats['last_updated'][:19] if stats['last_updated'] else 'Never'}")

print("\nDocuments by Type:")
for doc_type, count in stats['documents_by_type'].items():
    print(f"  {doc_type}: {count}")

if stats['popular_tags']:
    print("\nPopular Tags:")
    for tag, count in stats['popular_tags'][:5]:
        print(f"  {tag}: {count}")
EOF
}

# Main command handling
case "$1" in
    setup)
        setup
        ;;
    process-url)
        shift
        process_url "$@"
        ;;
    process-file)
        shift
        process_file "$@"
        ;;
    process-urls)
        shift
        process_urls "$@"
        ;;
    process-playlist|playlist)
        shift
        process_playlist "$@"
        ;;
    ui)
        shift
        launch_ui "$@"
        ;;
    chat)
        launch_chat
        ;;
    sync-rag)
        shift
        sync_rag "$@"
        ;;
    search)
        shift
        search_kb "$@"
        ;;
    stats)
        show_stats
        ;;
    --help|help)
        show_help
        ;;
    *)
        # ═══ YT-CHAIN-01 · main.sh :: case fallback arm ════════════════════
        # Entry point for `dy <youtube-url>`. Matches http*, no `list=`, so
        # it is a single video and routes straight to main.py.
        # NEXT → YT-CHAIN-02  main.py :: main()
        # ═══════════════════════════════════════════════════════════════════
        # Auto-detect URL or file path for direct processing
        if [[ "$1" == http* && ( "$1" == *"/playlist"* || "$1" == *"list="* ) ]]; then
            # Playlist URLs would be treated as a single (id-less) video by
            # main.py — route them to the playlist pipeline instead.
            echo -e "${BLUE}Auto-detected YouTube playlist: $1${NC}"
            process_playlist "$@"
        elif [[ "$1" == http* ]]; then
            echo -e "${BLUE}Auto-detected URL: $1${NC}"
            "$VENV_PYTHON" "$SCRIPT_DIR/main.py" "$@"
        # ═══ FILE-CHAIN-01 · main.sh :: case fallback arm, file branch ═════
        # Entry point for `dy <path>`. Sibling of YT-CHAIN-01 in the same
        # case arm: that branch matches http*, this one matches an existing
        # file on disk. Note the ordering — the http* tests run FIRST, so a
        # local file whose name looks like a URL can never reach here.
        # NEXT → FILE-CHAIN-02  main.py :: main(), file arm
        # ═══════════════════════════════════════════════════════════════════
        elif [[ -f "$1" ]]; then
            echo -e "${BLUE}Auto-detected file: $1${NC}"
            "$VENV_PYTHON" "$SCRIPT_DIR/main.py" "$@"
        elif [[ "$1" == --* ]]; then
            # Legacy support - if first argument looks like a flag, pass to main.py
            "$VENV_PYTHON" "$SCRIPT_DIR/main.py" "$@"
        else
            echo -e "${RED}Unknown command: $1${NC}"
            show_help
            exit 1
        fi
        ;;
esac