#!/bin/bash

# Disclosure RAG Run Script
# This script provides convenient commands for common operations

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_command() {
    echo -e "${BLUE}[CMD]${NC} $1"
}

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    print_error "Virtual environment not found. Please run ./setup.sh first"
    exit 1
fi

# Activate virtual environment
source .venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_error ".env file not found. Please create one based on .env.template"
    exit 1
fi

# Load environment variables
source .env

# Function to show usage
show_usage() {
    echo "Disclosure RAG Runner"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  setup              Install/update dependencies"
    echo "  chat               Launch local chat interface"
    echo "  agno-chat          Launch Agno chat interface"
    echo "  agno-chat-files    Launch Agno chat with file upload"
    echo "  process-url        Process a web article"
    echo "  process-yt         Process a YouTube video"
    echo "  process-file       Process URLs from a file"
    echo "  test               Run tests"
    echo "  lint               Run linters"
    echo "  format             Format code with black"
    echo "  clean              Clean temporary files"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 process-url --url https://example.com/article --upload"
    echo "  $0 process-yt --url https://youtube.com/watch?v=... --upload"
    echo "  $0 chat"
}

# Parse command
COMMAND=${1:-help}
shift || true

case $COMMAND in
    setup)
        print_status "Updating dependencies..."
        pip install --upgrade pip
        pip install -e ".[dev]"
        print_status "Dependencies updated successfully"
        ;;
        
    chat)
        print_status "Launching local chat interface..."
        python disclosure_chat.py "$@"
        ;;
        
    agno-chat)
        print_status "Launching Agno chat interface..."
        python agno_disclosure_chat.py "$@"
        ;;
        
    agno-chat-files)
        print_status "Launching Agno chat with file upload..."
        python agno_disclosure_chat_with_files.py "$@"
        ;;
        
    process-url)
        print_status "Processing web content..."
        python main.py --scrape "$@"
        ;;
        
    process-yt)
        print_status "Processing YouTube video..."
        python main.py "$@"
        ;;
        
    process-file)
        print_status "Processing URLs from file..."
        python main.py --file "$@"
        ;;
        
    test)
        print_status "Running tests..."
        pytest tests/ -v "$@"
        ;;
        
    lint)
        print_status "Running linters..."
        print_command "Running flake8..."
        flake8 . --exclude=.venv,build,dist
        print_command "Running mypy..."
        mypy . --exclude=.venv
        ;;
        
    format)
        print_status "Formatting code..."
        print_command "Running black..."
        black . --exclude=.venv
        print_command "Running isort..."
        isort . --skip=.venv
        ;;
        
    clean)
        print_status "Cleaning temporary files..."
        find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
        find . -type f -name "*.pyc" -delete 2>/dev/null || true
        find . -type f -name "*.pyo" -delete 2>/dev/null || true
        find . -type f -name ".DS_Store" -delete 2>/dev/null || true
        rm -rf .pytest_cache 2>/dev/null || true
        rm -rf .mypy_cache 2>/dev/null || true
        rm -rf *.egg-info 2>/dev/null || true
        print_status "Cleanup complete"
        ;;
        
    help|--help|-h)
        show_usage
        ;;
        
    *)
        print_error "Unknown command: $COMMAND"
        echo ""
        show_usage
        exit 1
        ;;
esac