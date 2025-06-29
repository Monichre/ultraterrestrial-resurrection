#!/bin/bash

# Disclosure RAG Interactive Dashboard Launcher
echo "🛸 Starting Disclosure RAG Interactive Dashboard..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Check for python3
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: python3 is required but not installed.${NC}"
    exit 1
fi

# Check for pip3
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}Error: pip3 is required but not installed.${NC}"
    exit 1
fi

# Load environment variables
if [ -f ".env" ]; then
    set -a; source .env; set +a
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
else
    echo -e "${YELLOW}⚠️  Warning: .env file not found. Some features may not work.${NC}"
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install/upgrade Streamlit dependencies
echo -e "${YELLOW}Installing/upgrading dependencies...${NC}"
pip3 install -r requirements_streamlit.txt

# Check if streamlit is installed
if ! python3 -c "import streamlit" &> /dev/null; then
    echo -e "${RED}Error: Failed to install Streamlit dependencies${NC}"
    exit 1
fi

# Create temp directory for visualizations
mkdir -p streamlit_temp

# Start Streamlit app
echo -e "${GREEN}🚀 Launching Interactive Dashboard...${NC}"
echo -e "${GREEN}📱 Your dashboard will open in your browser${NC}"
echo -e "${GREEN}🔗 URL: http://localhost:8501${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the dashboard${NC}"
echo ""

# Launch with custom config
streamlit run streamlit_app.py \
    --server.port 8501 \
    --server.address 0.0.0.0 \
    --theme.base dark \
    --theme.primaryColor "#60a5fa" \
    --theme.backgroundColor "#0e1117" \
    --theme.secondaryBackgroundColor "#1f2937" \
    --theme.textColor "#fafafa"