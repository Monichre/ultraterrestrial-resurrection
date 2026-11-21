#!/bin/bash

# Setup Local UFO Document Library
echo "🛸 Setting up Local UFO Document Library..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo -e "${BLUE}📍 Working directory: $SCRIPT_DIR${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Error: python3 is required but not installed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Python3 found${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}🔧 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${YELLOW}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Install local dependencies
echo -e "${YELLOW}📦 Installing local storage dependencies...${NC}"
pip install -r requirements_local.txt

# Create library directory structure
echo -e "${YELLOW}📁 Creating library directory structure...${NC}"
mkdir -p unified_ufo_library/{documents,metadata,vectors,exports}

echo -e "${GREEN}✅ Directory structure created:${NC}"
echo -e "  📂 unified_ufo_library/"
echo -e "  ├── 📄 documents/     (Full document content)"
echo -e "  ├── 🏷️  metadata/      (Document metadata)"  
echo -e "  ├── 🔍 vectors/       (Vector indices)"
echo -e "  └── 📤 exports/       (Export files)"

# Show available commands
echo ""
echo -e "${BLUE}🚀 Local Library Setup Complete!${NC}"
echo ""
echo -e "${YELLOW}Available Commands:${NC}"
echo ""
echo -e "1. ${GREEN}Interactive Consolidation:${NC}"
echo -e "   ./consolidate_libraries.py --interactive"
echo ""
echo -e "2. ${GREEN}Auto-find Libraries:${NC}"
echo -e "   ./consolidate_libraries.py --auto-find"
echo ""
echo -e "3. ${GREEN}Manual Consolidation:${NC}"
echo -e "   ./consolidate_libraries.py --sources /path/to/lib1 /path/to/lib2"
echo ""
echo -e "4. ${GREEN}Python Usage:${NC}"
echo -e "   python3 -c \"from lib.storage.local_vector_library import setup_local_library; setup_local_library()\""
echo ""

# Check if user wants to run consolidation now
echo -e "${YELLOW}Would you like to consolidate your existing libraries now? (y/n)${NC}"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}🔄 Starting interactive consolidation...${NC}"
    python3 consolidate_libraries.py --interactive
else
    echo -e "${BLUE}💡 Run consolidation later with: ./consolidate_libraries.py --interactive${NC}"
fi

echo ""
echo -e "${GREEN}✨ Your local library is ready!${NC}"
echo -e "${BLUE}📍 Location: $SCRIPT_DIR/unified_ufo_library${NC}"