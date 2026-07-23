#!/bin/bash

# Disclosure RAG Main Script
# Enhanced functionality for processing various content types

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Load environment variables
if [ -f "$SCRIPT_DIR/.env" ]; then
    set -a  # Enable auto-export
    source "$SCRIPT_DIR/.env"
    set +a  # Disable auto-export
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
  ui                 Launch the Knowledge Base UI
  chat               Launch the chat interface
  sync-rag          Sync knowledge base to local RAG
  search            Search the knowledge base
  stats             Show knowledge base statistics

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
launch_ui() {
    echo -e "${BLUE}Launching Knowledge Base UI...${NC}"
    echo -e "${YELLOW}Access the UI at: http://localhost:8501${NC}"
    "$VENV_PYTHON" "$SCRIPT_DIR/main.py" --ui
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
sync_rag() {
    echo -e "${BLUE}Syncing knowledge base to local RAG...${NC}"
    "$VENV_PYTHON" "$SCRIPT_DIR/main.py" --sync-rag
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
from lib.knowledge_base_crud import KnowledgeBaseCRUD

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
from lib.knowledge_base_crud import KnowledgeBaseCRUD

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
        launch_ui
        ;;
    chat)
        launch_chat
        ;;
    sync-rag)
        sync_rag
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
        # Auto-detect URL or file path for direct processing
        if [[ "$1" == http* && ( "$1" == *"/playlist"* || "$1" == *"list="* ) ]]; then
            # Playlist URLs would be treated as a single (id-less) video by
            # main.py — route them to the playlist pipeline instead.
            echo -e "${BLUE}Auto-detected YouTube playlist: $1${NC}"
            process_playlist "$@"
        elif [[ "$1" == http* ]]; then
            echo -e "${BLUE}Auto-detected URL: $1${NC}"
            "$VENV_PYTHON" "$SCRIPT_DIR/main.py" "$@"
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