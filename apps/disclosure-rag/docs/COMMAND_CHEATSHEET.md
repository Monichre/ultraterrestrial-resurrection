# Disclosure RAG - Command Cheatsheet

**Quick Reference Guide - Updated June 25, 2025**

## 🚀 Quick Start Commands

### Launch Main Interfaces

```bash
# Web Dashboard (Recommended - Full Featured)
./launch_dashboard.sh
# Access: http://localhost:8501

# Enhanced CLI Interface
python cli.py

# Knowledge Base UI
python knowledge_base_ui.py

# Basic Chat Interface
python disclosure_chat.py
```

---

## 📥 Content Processing Commands

### Process URLs (YouTube/Web)

```bash
# Main processing script (enhanced)
python main.py "https://youtube.com/watch?v=VIDEO_ID"
python main.py "https://example.com/article" --upload
python main.py "https://example.com/article" --no-kb

# Shell script wrapper
./main.sh process-url "https://example.com/article"

# Direct YouTube processing
python -c "from lib.youtube import generate_transcript; generate_transcript('URL')"
```

### Process Local Files

```bash
# Main processing
python main.py "/path/to/document.pdf" --upload
python main.py "/path/to/file.txt"

# Shell script wrapper  
./main.sh process-file "/path/to/document.pdf"
```

### Command Options

- `--upload`: Upload to OpenAI vector store
- `--no-kb`: Skip adding to local knowledge base
- `--status`: Show integration status

---

## 🎛️ Interface Launch Commands

### Web Dashboard (Streamlit)

```bash
# Quick launch
./launch_dashboard.sh

# Manual launch
streamlit run streamlit_app.py
streamlit run streamlit_app.py --server.port 8502  # Custom port

# Access URLs
http://localhost:8501  # Default
http://localhost:8502  # Custom port
```

### CLI Interfaces

```bash
# Enhanced CLI (with Charm tools if available)
python cli.py

# Charm tools demo
python charm_demo.py

# Basic knowledge base CLI
python knowledge_base_ui.py

# Entity extraction CLI
python entity_extraction_cli.py
```

### Chat Interfaces

```bash
# Local knowledge base chat
python disclosure_chat.py

# Note: Agno chat files referenced but may need setup
# python agno_disclosure_chat.py
# python agno_disclosure_chat_with_files.py
```

---

## 🔍 Search & Query Commands

### Knowledge Base Search

```bash
# Shell script search
./main.sh search "search query"

# Direct Python search
python -c "from lib.knowledge_base_crud import KnowledgeBaseCRUD; kb = KnowledgeBaseCRUD(); print(kb.search_documents('query'))"
```

### Database Queries

```bash
# PostgreSQL direct queries
python -c "from lib.connectors.ultraterrestrial_db import UltraterrestrialDatabase; db = UltraterrestrialDatabase(); db.connect()"
```

---

## 📊 Analytics & Visualization Commands

### System Statistics

```bash
# Shell script stats
./main.sh stats

# Knowledge base statistics
python -c "from lib.knowledge_base_crud import KnowledgeBaseCRUD; kb = KnowledgeBaseCRUD(); print(kb.get_statistics())"
```

### Geographic Analysis

```bash
# Launch dashboard for geographic features
./launch_dashboard.sh
# Navigate to: Geographic Analysis tab
```

### Entity Extraction Analysis

```bash
# Process with real-time visualization (via dashboard)
./launch_dashboard.sh
# Upload files in: Entity Extraction tab

# CLI entity extraction
python agents/entity_extraction_agent.py
```

---

## 🛠️ Setup & Configuration Commands

### Initial Setup

```bash
# Complete setup script
./setup.sh

# Manual dependency installation
pip install -r requirements.txt

# Environment configuration
cp .env.template .env
# Edit .env with your API keys
```

### Database Setup

```bash
# PostgreSQL setup (if needed)
# Follow instructions in setup.sh

# Test database connections
python -c "from lib.connectors.ultraterrestrial_db import UltraterrestrialDatabase; db = UltraterrestrialDatabase(); print('Connection:', db.test_connection())"
```

### Dependency Management

```bash
# Install optional Charm CLI tools (for enhanced experience)
brew install gum huh glow glamour  # macOS
# or follow Go installation instructions

# Update Python dependencies
pip install -r requirements.txt --upgrade
```

---

## 🔧 Agent System Commands

### Individual Agents

```bash
# Entity extraction agent
python agents/entity_extraction_agent.py

# Content analysis agent
python agents/content_analysis_agent.py

# Claims and evidence agent
python agents/claims_evidence_agent.py

# Historical timeline agent
python agents/historical_timeline_agent.py

# Geographic agent
python agents/geospatial_agent.py

# Network analysis agent
python agents/network_agent.py

# Theory development agent
python agents/theory_agent.py

# Documentation agent
python agents/documentation_agent.py
```

### Research Crew (Multi-Agent)

```bash
# Research crew orchestration
python agents/research_crew.py

# Note: This is currently in development
```

---

## 💾 Data Management Commands

### Knowledge Base Operations

```bash
# Export documents
python -c "from lib.knowledge_base_crud import KnowledgeBaseCRUD; kb = KnowledgeBaseCRUD(); kb.export_document('DOC_ID', '/export/path')"

# Bulk import
python -c "from lib.knowledge_base_crud import KnowledgeBaseCRUD; kb = KnowledgeBaseCRUD(); kb.bulk_import('/import/path', 'article')"

# List documents
python -c "from lib.knowledge_base_crud import KnowledgeBaseCRUD; kb = KnowledgeBaseCRUD(); print(kb.list_documents())"
```

### Database Synchronization

```bash
# Upstash sync (manual)
python lib/sync_to_upstash_search_integrated.py

# Note: Automated sync plans documented but not yet implemented
```

---

## 🎨 Visualization Commands

### Terminal Visualizations

```bash
# All processing commands show enhanced terminal display automatically
python main.py "URL"  # Shows UFO-themed processing animation
```

### Web Visualizations

```bash
# Launch dashboard for all visualization features
./launch_dashboard.sh

# Available visualizations:
# - Real-time entity extraction
# - Geographic UFO analysis
# - Content analytics
# - Interactive charts
```

---

## 🔍 Debug & Development Commands

### Logging & Debug

```bash
# Enable debug logging
export PYTHON_LOG_LEVEL=DEBUG
python main.py "URL"

# Test specific components
python -c "from lib.terminal_display import display; display.print_header()"
```

### Integration Status

```bash
# Check integration status
python main.py --status

# Test individual components
python -c "from lib.knowledge_base_service import kb_service; print(kb_service.get_integration_status())"
```

### File Structure Check

```bash
# View knowledge base structure
ls -la packages/knowledge-base/
tree packages/knowledge-base/  # if tree is installed

# Check metadata index
cat packages/knowledge-base/metadata/index.json | jq .  # if jq is installed
python -c "import json; print(json.dumps(json.load(open('packages/knowledge-base/metadata/index.json')), indent=2))"
```

---

## 📱 Environment-Specific Commands

### Development Environment

```bash
# Development server with auto-reload
streamlit run streamlit_app.py --server.runOnSave true

# Run with development settings
export ENVIRONMENT=development
python main.py "URL"
```

### Production Environment

```bash
# Production streamlit (more stable)
streamlit run streamlit_app.py --server.headless true

# Production logging
export PYTHON_LOG_LEVEL=INFO
python main.py "URL" --upload
```

---

## 🆘 Troubleshooting Commands

### Common Issues

```bash
# Check API key configuration
python -c "import os; print('OpenAI:', bool(os.getenv('OPENAI_API_KEY'))); print('Anthropic:', bool(os.getenv('ANTHROPIC_API_KEY')))"

# Test OpenAI connection
python -c "from lib.openai_client.upload import upload_file_to_openai; print('OpenAI connection test')"

# Test Anthropic connection  
python -c "from anthropic import Anthropic; client = Anthropic(); print('Anthropic connection OK')"

# Check knowledge base integrity
python -c "from lib.knowledge_base_crud import KnowledgeBaseCRUD; kb = KnowledgeBaseCRUD(); print('KB Status:', len(kb.list_documents()), 'documents')"
```

### Reset Commands

```bash
# Reset knowledge base (careful!)
rm -rf packages/knowledge-base/metadata/index.json
python -c "from lib.knowledge_base_crud import KnowledgeBaseCRUD; KnowledgeBaseCRUD()"

# Clear cache/temp files
rm -rf __pycache__/
rm -rf .streamlit/
```

---

## 🎯 Common Workflows

### Research Workflow

```bash
# 1. Process content
python main.py "https://youtube.com/watch?v=VIDEO_ID" --upload

# 2. Launch dashboard for analysis
./launch_dashboard.sh

# 3. Search and explore
./main.sh search "relevant terms"
```

### Content Analysis Workflow

```bash
# 1. Upload document via dashboard
./launch_dashboard.sh
# Use upload interface in Entity Extraction tab

# 2. View real-time analysis
# Watch entities being extracted live

# 3. Explore geographic patterns
# Switch to Geographic Analysis tab
```

### Chat & Research Workflow

```bash
# 1. Process multiple sources
python main.py "URL1" --upload
python main.py "URL2" --upload

# 2. Launch chat interface
python disclosure_chat.py

# 3. Query knowledge base interactively
```

---

## 💡 Pro Tips

### Performance Optimization

- Use `--no-kb` flag when testing to skip knowledge base operations
- Launch dashboard first, then upload files through the interface for real-time visualization
- Use shell scripts for batch operations
- Monitor system resources during large file processing

### Best Practices

- Always check `--status` before processing to ensure integrations are working
- Use the web dashboard for interactive analysis and the CLI for automation
- Keep API keys secure and rotate them regularly
- Regularly check the knowledge base statistics with `./main.sh stats`

### Feature Discovery

- Explore all tabs in the Streamlit dashboard for full feature set
- Try the enhanced CLI with Charm tools for the best terminal experience
- Use the geographic analysis for spatial pattern detection
- Experiment with different agents for specialized analysis

---

*This cheatsheet covers all major commands and workflows in the Disclosure RAG system. For detailed explanations, refer to the individual documentation files and the comprehensive status report.*
