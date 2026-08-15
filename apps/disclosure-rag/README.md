# Disclosure RAG - AI-Powered UAP Research Platform

**Enhanced AI Research System for UFO/UAP Investigation**  
**Version**: 2.0 - Quinuple RAG Architecture  
**Status**: ✅ Production Ready with AGNO Enhancement  
**Last Updated**: September 18, 2025

---

## 🎯 Overview

Disclosure RAG is a comprehensive AI-powered research platform designed specifically for UFO/UAP investigation and analysis. Built on a sophisticated **Quinuple RAG architecture**, it combines the world's largest specialized UAP database with advanced AI agents for intelligent research synthesis.

**Key Capabilities**:
- **233,932+ searchable items** across 5 specialized vector systems
- **448 curated documents** with **130K+ UFO sightings** database
- **AI-powered entity extraction** with 85-95% accuracy
- **Multi-interface access** (Web, API, CLI, Chat)
- **Intelligent research agents** for comprehensive analysis

---

## 🚀 Quick Start

### **1. Environment Setup**

Create `.env` file in `apps/disclosure-rag/`:
```bash
# Core AI Services
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-...

# Database Systems
DATABASE_URL=postgresql://...        # Neon; falls back to packages/db/.env
UPSTASH_VECTOR_REST_URL=https://...
UPSTASH_VECTOR_REST_TOKEN=...

# Optional Enhancements
MEM0_API_KEY=your_mem0_key
COCOINDEX_BACKEND=postgresql
```

### **2. Installation**
```bash
# Setup virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# or .venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

### **3. Launch System**
```bash
# Interactive Web Dashboard (Recommended)
./launch_dashboard.sh
# → http://localhost:8501

# API Server
python api_server.py
# → http://localhost:8000

# Enhanced CLI
python cli.py

# Quick system check
python main.py --status
```

---

## 🏗️ Quinuple RAG Architecture

### **5-Layer Vector Search System**

**Primary Systems** (Always Active):
- **🧠 OpenAI Vector Store**: 2,426 research files - foundational knowledge
- **🗄️ Neon Postgres + pgvector**: structured entities and relationships via `@db/postgres`

**Weighted Systems** (Intelligent Load Balancing):
- **☁️ Upstash Vector (30%)**: Cloud scalability and backup
- **🏠 Local FAISS (20%)**: High-performance local search  
- **📊 CocoIndex PostgreSQL (20%)**: Advanced analytics and complex queries

### **Unified Search Process**
```python
# Single query searches across all 5 systems
search_result = await quinuple_search(
    query="Phoenix Lights witness testimony",
    max_results=20
)
# Returns ranked results from all systems with source attribution
```

---

## 🎨 Multiple Access Interfaces

### **🌐 Web Dashboard** (Primary Interface)
- **Real-time processing** with UFO-themed animations
- **Interactive visualizations** using Plotly
- **Entity extraction** with confidence scoring
- **Geographic analysis** of 130K+ sightings
- **Document management** and search

### **🔧 API Server** (Programmatic Access)
```bash
# RESTful endpoints for integration
GET /documents          # Browse knowledge base
GET /search            # Semantic search
POST /rag/search       # Multi-system RAG queries
GET /stats             # System statistics
```

### **💻 CLI Interface** (Batch Processing)
```bash
# Process various content types
python main.py "https://youtube.com/watch?v=VIDEO_ID"
python main.py "https://news-article.com/uap-disclosure"
python main.py "/path/to/classified-document.pdf"

# Interactive search
python cli.py
```

### **🤖 Chat Interfaces** (Conversational AI)
- **Disclosure Bot**: Direct chat with knowledge base
- **Research Assistant**: Multi-step investigation support
- **Entity Q&A**: Query specific people, events, locations

---

## 🧠 AI Enhancement Features

### **🎥 Intelligent YouTube Processing**
- **Transcript extraction** (multiple languages, auto-translation)
- **Content classification** (witness testimony, expert analysis, news)
- **Temporal entity extraction** with timestamp precision
- **Credibility assessment** for witnesses and sources

### **📄 Advanced Document Analysis**
- **Multi-format support**: PDF, DOCX, TXT, Markdown, RTF
- **Entity extraction**: People, organizations, events, locations, technologies
- **Relationship mapping** between extracted entities
- **Cross-document correlation** and validation

### **🌍 Geographic Intelligence**
- **130,445+ UFO sightings** with precise coordinates
- **Military base proximity analysis** and correlation
- **Temporal pattern recognition** in sighting data
- **Interactive mapping** with clustering and heatmaps

---

## 🤖 AGNO AI Agents (Enhanced Intelligence)

### **🎯 UFO YouTube Agent** (Active)
Specialized analysis for UFO-related video content:
```python
analysis = await ufo_youtube_agent.analyze_content(video_url)
# Returns: content classification, witness credibility, 
#          temporal entities, key claims, evidence assessment
```

### **🔬 Deep Research Agent** (In Development)
Multi-source investigation and synthesis:
- Cross-references multiple documents and databases
- Generates academic-grade research reports
- Provides evidence strength assessment
- Identifies research gaps and contradictions

### **🗃️ Cross-Agent Entity Store**
Coordinated intelligence across all AI agents:
- Shared entity validation and confidence scoring
- Temporal relationship mapping
- Cross-agent verification and conflict resolution

---

## 📊 System Capabilities

### **Content Processing**
| Content Type | Processing Time | Features |
|--------------|----------------|----------|
| **YouTube Videos** | 30-60 seconds | Transcript + AI analysis |
| **Web Articles** | 10-30 seconds | Content extraction + entities |
| **PDF Documents** | 5-15 seconds | Text extraction + classification |
| **Batch Processing** | Parallel | Multiple files simultaneously |

### **Search & Analysis**
| Feature | Performance | Accuracy |
|---------|-------------|----------|
| **Entity Extraction** | 2-5 seconds | 85-95% |
| **Semantic Search** | <1 second | High relevance |
| **Cross-Reference** | 1-3 seconds | Multi-source |
| **Geographic Query** | <2 seconds | 130K+ sightings |

### **Knowledge Base Statistics**
- **448 Total Documents**: Fully indexed and searchable
- **31 Case Files**: CIA documents, official reports
- **407 Transcripts**: Video content, interviews, testimonies  
- **10 Research Articles**: Academic and investigative content
- **130K+ Sightings**: Geographic database with coordinates

---

## 🔧 Advanced Usage

### **Content Processing Examples**
```bash
# YouTube video analysis
python main.py "https://youtube.com/watch?v=dQw4w9WgXcQ" --upload

# Web article processing
python main.py "https://example.com/ufo-disclosure" --upload

# PDF document analysis
python main.py "/path/to/classified-file.pdf" --upload

# Batch processing directory
python main.py "/path/to/documents/" --batch --upload
```

### **Advanced Search Queries**
```python
# Multi-system search with filtering
results = await search_system.unified_search(
    query="Commander David Fravor Nimitz encounter",
    systems=["openai", "postgres", "upstash"],
    filters={
        "content_type": "testimony",
        "date_range": "2000-2010",
        "credibility_min": 0.8
    }
)

# Geographic analysis
sightings = await geo_analysis.find_patterns(
    query="triangular craft near nuclear facilities",
    radius_km=50,
    time_period="2004-2004"
)
```

### **Entity Analysis**
```python
# Extract and analyze entities from content
entities = await entity_system.extract_and_analyze(
    content=document_text,
    include_relationships=True,
    confidence_threshold=0.7
)

# Cross-reference with existing database
matches = await entity_system.find_related_entities(
    entity="Luis Elizondo",
    relationship_types=["colleague", "organization", "events"]
)
```

---

## 📈 Performance & Quality

### **System Performance**
- **Search Response Time**: <3 seconds for comprehensive results
- **Processing Throughput**: 100+ documents/hour
- **Concurrent Users**: Supports multiple simultaneous sessions
- **System Uptime**: 99%+ availability target

### **Data Quality Metrics**
- **Entity Extraction Accuracy**: 85-95% (AI-powered)
- **Search Relevance**: High user satisfaction for UAP queries
- **Document Coverage**: 100% of knowledge base searchable
- **Cross-System Consistency**: Automated validation and sync

### **Scalability Features**
- **Cloud Integration**: Upstash Vector for unlimited scale
- **Local Performance**: FAISS for high-speed local operations
- **Intelligent Caching**: Optimized response times for common queries
- **Parallel Processing**: Concurrent operations across all systems

---

## 🛠️ Development & Integration

### **API Integration**
```python
import requests

# Search the knowledge base
response = requests.get(
    "http://localhost:8000/search",
    params={"q": "Phoenix Lights 1997", "limit": 10}
)

# Get document details
doc = requests.get("http://localhost:8000/documents/doc_123")

# Perform RAG search across all systems
rag_results = requests.post(
    "http://localhost:8000/rag/search",
    json={"query": "UFO technology reverse engineering", "max_results": 20}
)
```

### **Python SDK Usage**
```python
from lib.knowledge_base_service import KnowledgeBaseService
from lib.quinuple_rag_adapter import QuinupleRAGAdapter

# Initialize services
kb = KnowledgeBaseService()
rag = QuinupleRAGAdapter()

# Process new content
result = await kb.process_content(
    url="https://example.com/ufo-article",
    upload_to_systems=True
)

# Perform intelligent search
search_results = await rag.search_unified(
    query="Naval aviator UAP encounters"
)
```

### **Custom Agent Development**
```python
from agents.base import Agent

class CustomUAPAgent(Agent):
    def __init__(self, config):
        super().__init__(config)
        self.knowledge_base = KnowledgeBaseService()
        
    async def analyze_claim(self, claim_text):
        # Custom analysis logic
        entities = await self.extract_entities(claim_text)
        validation = await self.cross_reference(entities)
        return self.generate_assessment(validation)
```

---

## 🔐 Security & Privacy

### **Data Security**
- **Local-First Processing**: Core functionality works without cloud dependencies
- **API Key Management**: Secure environment-based configuration
- **Input Validation**: Comprehensive sanitization of all user inputs
- **Error Handling**: Graceful degradation without data exposure

### **Privacy Features**
- **Optional Cloud Services**: Choose your level of cloud integration
- **Local Vector Storage**: Keep sensitive analysis completely local
- **Configurable Logging**: Control what information is logged
- **Data Retention**: Configurable policies for different data types

---

## 📚 Documentation & Support

### **Complete Documentation**
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: Detailed system architecture
- **[AGNO_ROADMAP.md](AGNO_ROADMAP.md)**: AI agent enhancement strategy
- **[STATUS.md](STATUS.md)**: Current system status and metrics
- **API Documentation**: Comprehensive endpoint specifications

### **Getting Help**
- **System Status**: `python main.py --status`
- **Health Check**: `GET http://localhost:8000/health`
- **Interactive CLI**: `python cli.py` for guided operations
- **Dashboard**: Visual system monitoring and control

### **Community & Contribution**
- **Issue Reporting**: Detailed error logging and reporting
- **Feature Requests**: Extensible architecture for custom enhancements
- **Development Guide**: Contributing to system enhancement

---

## 🎯 Use Cases

### **Researchers & Investigators**
- **Document Analysis**: Process classified files and witness testimonies
- **Pattern Recognition**: Identify trends across thousands of sighting reports
- **Cross-Reference Validation**: Verify claims against multiple sources
- **Report Generation**: Create comprehensive research documentation

### **Media & Journalists**
- **Fact Checking**: Validate UFO-related claims and stories
- **Source Discovery**: Find relevant documents and testimonies
- **Timeline Analysis**: Track disclosure events and their relationships
- **Interview Preparation**: Research subjects and their connections

### **Academic Research**
- **Literature Review**: Comprehensive analysis of UAP research
- **Data Mining**: Extract insights from large document collections
- **Statistical Analysis**: Geographic and temporal pattern analysis
- **Citation Management**: Track sources and evidence chains

### **Government & Policy**
- **Information Management**: Organize and analyze disclosure documents
- **Public Transparency**: Provide accessible interface to released materials  
- **Policy Research**: Understand historical context and implications
- **Stakeholder Analysis**: Map relationships between key figures

---

## 🚀 Future Roadmap

### **Phase 2: Enhanced Interfaces** (Next 4 weeks)
- **Natural Language SQL**: Query 130K sightings conversationally
- **Multi-Agent Workflows**: Orchestrated research methodologies
- **Advanced Visualizations**: Interactive data exploration

### **Phase 3: Advanced Intelligence** (8-12 weeks)
- **Media Monitoring**: Real-time UAP disclosure tracking
- **Predictive Analysis**: Trend identification and forecasting
- **Academic Integration**: Automated research report generation
- **Cross-System Optimization**: Enhanced performance and accuracy

### **Long-Term Vision**
Transform Disclosure RAG into the premier UAP research intelligence platform, combining the world's most comprehensive specialized database with cutting-edge AI analysis capabilities. The goal is to accelerate UFO/UAP research while maintaining the highest standards of academic rigor and evidence-based investigation.

---

**🎯 Ready to explore the ultimate UFO research platform? Launch the dashboard and discover what 233,932+ searchable items can reveal about UAP phenomena.**

*System Status: ✅ Production Ready - Enhanced with AI Agents*

---

## Quick Commands Cheatsheet

```bash
# System Status & Health
python main.py --status
curl http://localhost:8000/health

# Launch Interfaces  
./launch_dashboard.sh        # Web interface
python api_server.py         # API server
python cli.py               # Interactive CLI

# Content Processing
python main.py "URL_OR_FILE_PATH" --upload

# Search & Analysis
# Use web dashboard or API endpoints for advanced search
```

**Start with**: `./launch_dashboard.sh` for the full interactive experience.
