# 🤖 Project Agents Overview

Visual directory of all specialized agents in the Ultraterrestrial project, organized by function and color-coded for easy identification.

## 🏗️ Infrastructure & Core Systems
*Foundation layer agents managing data, context, and knowledge*

| Agent | Icon | Color | Role | Workspace |
|-------|------|-------|------|-----------|
| **context-manager** | 🧠 | <span style="color: #2563eb">**#2563eb**</span> | Cross-agent coordination | Global |
| **packages-db-agent** | 🗄️ | <span style="color: #1e40af">**#1e40af**</span> | Database operations & Xata | `/packages/db/` |
| **packages-knowledge-base** | 📚 | <span style="color: #3730a3">**#3730a3**</span> | Knowledge management | `/packages/knowledge-base/` |

## ⚡ Application Layer
*User-facing application and processing systems*

| Agent | Icon | Color | Role | Workspace |
|-------|------|-------|------|-----------|
| **apps-app-agent** | 🎯 | <span style="color: #16a34a">**#16a34a**</span> | Main UI & UX | `/apps/app/` |
| **apps-disclosure-rag-agent** | 🔍 | <span style="color: #059669">**#059669**</span> | RAG processing | `/apps/disclosure-rag/` |

## 📝 Content & Documentation
*Documentation, design, and content creation*

| Agent | Icon | Color | Role | Workspace |
|-------|------|-------|------|-----------|
| **documentation-agent** | 📋 | <span style="color: #ea580c">**#ea580c**</span> | Technical docs | Global |
| **archival-design-agent** | 🎨 | <span style="color: #dc2626">**#dc2626**</span> | Vintage UI & archival design | Design assets |

---

## Agent Interaction Flow

```mermaid
graph TD
    A[🧠 Context Manager] --> B[🎯 Main App]
    A --> C[🔍 RAG System]
    B --> D[🗄️ Database]
    C --> D
    B --> E[📚 Knowledge Base]
    C --> E
    F[📋 Documentation] --> B
    F --> C
    G[🎨 UI Design] --> B
```

## Color Palette Reference

### Infrastructure & Core (Blue Family)
- `#2563eb` - Context management (blue-600)
- `#1e40af` - Database operations (blue-700)
- `#3730a3` - Knowledge systems (indigo-700)

### Application Layer (Green Family)
- `#16a34a` - Main application (green-600)
- `#059669` - RAG processing (emerald-600)

### Content & Documentation (Warm Family)
- `#ea580c` - Documentation (orange-600)
- `#dc2626` - Design specialist (red-600)

---

## Usage Guidelines

### Agent Selection
- **🧠 Context Manager**: For multi-agent coordination and complex workflows
- **🗄️ Database**: For schema changes, queries, and data operations
- **📚 Knowledge Base**: For document management and knowledge synthesis
- **🎯 Main App**: For UI/UX, React components, and user features
- **🔍 RAG System**: For AI processing, vector operations, and search
- **📋 Documentation**: For technical writing and project documentation
- **🎨 Archival Design**: For authentic vintage UI components and classified aesthetics

### Color Usage
- Use agent colors in commit messages: `🎯 feat(app): new mindmap feature`
- Reference colors in documentation for clarity
- Apply color coding in development tools and dashboards
- Use for visual project organization and team communication

---

*Last updated: $(date)*