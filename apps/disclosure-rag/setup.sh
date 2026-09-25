#!/bin/bash

# Disclosure RAG Setup Script
# This script sets up the development environment for the disclosure-rag app

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_status "Setting up Disclosure RAG development environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.9"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    print_error "Python $REQUIRED_VERSION or higher is required. Found Python $PYTHON_VERSION"
    exit 1
fi

print_status "Python $PYTHON_VERSION detected"

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    print_status "Creating virtual environment..."
    python3 -m venv .venv
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source .venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip setuptools wheel

# Install the package in editable mode with dev dependencies
print_status "Installing disclosure-rag and dependencies..."
pip install -e ".[dev]"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p knowledge
mkdir -p data/raw
mkdir -p data/processed
mkdir -p logs
mkdir -p tests

# Check for .env file
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating template..."
    cat > .env.template << EOF
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=your_assistant_id
OPENAI_VECTOR_STORE_ID=your_vector_store_id

# Anthropic Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key

# Groq Configuration (optional)
GROQ_API_KEY=your_groq_api_key

# Database Configuration
UPSTASH_REDIS_URL=your_upstash_redis_url
UPSTASH_REDIS_TOKEN=your_upstash_redis_token
UPSTASH_VECTOR_URL=your_upstash_vector_url
UPSTASH_VECTOR_TOKEN=your_upstash_vector_token
XATA_API_KEY=your_xata_api_key
XATA_DATABASE_URL=your_xata_database_url

# Application Configuration
KNOWLEDGE_BASE_PATH=./knowledge
LOG_LEVEL=INFO
DEBUG=false

# Agno Configuration (optional)
AGNO_API_KEY=your_agno_api_key
EOF
    print_warning "Please copy .env.template to .env and fill in your API keys"
else
    print_status ".env file found"
fi

# Install pre-commit hooks if in dev mode
if command -v pre-commit &> /dev/null; then
    print_status "Installing pre-commit hooks..."
    pre-commit install
fi

# Install Charm CLI tools
print_status "Installing Charm CLI tools..."

# Check if Homebrew is available (macOS/Linux)
if command -v brew &> /dev/null; then
    print_status "Installing via Homebrew..."
    brew install gum glow glamour
    
    # Note: huh is not available via Homebrew, install via Go if available
    if command -v go &> /dev/null; then
        print_status "Installing huh via Go..."
        go install github.com/charmbracelet/huh@latest
    else
        print_warning "huh requires Go to install. Install Go first, then run: go install github.com/charmbracelet/huh@latest"
    fi
elif command -v go &> /dev/null; then
    print_status "Installing via Go..."
    go install github.com/charmbracelet/gum@latest
    go install github.com/charmbracelet/huh@latest  
    go install github.com/charmbracelet/glow@latest
    go install github.com/charmbracelet/glamour@latest
else
    print_warning "Neither Homebrew nor Go found. Please install Charm CLI tools manually:"
    print_warning "  - macOS: brew install gum huh glow glamour"
    print_warning "  - Linux: Download from GitHub releases or use package manager"
    print_warning "  - Or install Go and run: go install github.com/charmbracelet/[tool]@latest"
fi

print_status "Setup complete!"
print_status ""
print_status "To activate the virtual environment, run:"
print_status "  source .venv/bin/activate"
print_status ""
print_status "Available commands:"
print_status "  disclosure-rag --help        # Main CLI tool"
print_status "  disclosure-chat             # Local chat interface"
print_status "  agno-chat                   # Agno chat interface"
print_status "  agno-chat-files            # Agno chat with file upload"
print_status "  python cli.py               # Enhanced interactive CLI with Charm tools"
print_status ""
print_status "Or use the run.sh script for common operations"