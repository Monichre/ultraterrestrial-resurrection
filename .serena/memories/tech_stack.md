# Technology Stack

## Frontend Technologies

### Core Framework
- **Next.js 15.3.5** - React framework with App Router
- **React 19.1.0** - UI library with latest features
- **TypeScript** - Type-safe JavaScript

### Styling & UI
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Primitive components for design system
- **class-variance-authority (cva)** - Component variant management
- **Framer Motion** - Animation library

### 3D & Visualization
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **D3.js** - Data visualization

### State Management
- **Zustand** - Lightweight state management
- **React Context** - Built-in state management
- **React Query/SWR** - Server state management

### Real-time & Collaboration
- **Liveblocks** - Real-time collaboration
- **PartySocket** - WebSocket connections

## Backend Technologies

### Database & Storage
- **Xata (PostgreSQL)** - Primary database with vector search
- **pgvector** - PostgreSQL vector extension
- **Multiple Vector Storage**:
  - Upstash Vector (cloud vector search)
  - FAISS (local vector storage) 
  - CocoIndex PostgreSQL (advanced analytics)

### AI & Machine Learning
- **Vercel AI SDK** - AI integration framework
- **OpenAI** - GPT models and embeddings
- **Anthropic** - Claude models
- **Groq** - Fast inference
- **LangChain** - LLM application framework
- **sentence-transformers** - Text embeddings

### Python RAG System
- **FastAPI** - Modern Python web framework
- **Streamlit** - Interactive dashboard framework
- **Python 3.9+** - Core language
- **PyPDF2 / PyMuPDF** - PDF processing
- **BeautifulSoup4** - HTML parsing
- **pandas & numpy** - Data processing

### Authentication & Security
- **Clerk** - Authentication and user management
- **Next.js middleware** - Route protection

## Development Tools

### Package Management
- **Bun** - Fast JavaScript runtime and package manager (primary)
- **npm** - Alternative package manager
- **pip** - Python package manager

### Code Quality
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

### Testing
- **Jest** - JavaScript testing framework
- **pytest** - Python testing framework

### Component Development
- **Storybook** - Component development environment
- **Plop** - Component generation tool

### Build & Deployment
- **Next.js Build System** - Production builds
- **Vercel** - Deployment platform (assumed)

## External Integrations

### AI Services
- **OpenAI API** - GPT models, embeddings, assistants
- **Anthropic API** - Claude models
- **Groq API** - Fast LLM inference

### Vector Storage Services
- **Upstash Vector** - Cloud vector database
- **Upstash Redis** - Redis for caching

### Document Processing
- **PyMuPDF** - Advanced PDF processing
- **youtube-transcript-api** - YouTube transcript extraction
- **yt-dlp** - YouTube video processing

### Search & Research
- **EXA** - Search API integration
- **Tavily** - Research API
- **Firecrawl** - Web scraping service

## Data Architecture

### Database Models (29 entities)
- **Primary Entities**: Events, Testimonies, Personnel, Organizations
- **Supporting Data**: Locations, Documents, Topics, Artifacts
- **Relationships**: Event-personnel connections, topic associations
- **Metadata**: User collections, saved items

### Vector Storage Strategy
- **Primary**: OpenAI Vector Store (2,426+ files) + Xata Database (230,998+ records)
- **Secondary**: Upstash Vector, Local FAISS, PostgreSQL pgvector
- **Total**: 233,932+ searchable items across 5 systems

### Data Processing Pipeline
- **Document Ingestion**: Multi-format support (PDF, TXT, DOCX, MD, RTF)
- **Text Extraction**: PyMuPDF/PyPDF2 with error handling
- **Vector Generation**: OpenAI embeddings (1536 dimensions)
- **Storage Distribution**: Intelligent routing across multiple backends

## Performance Considerations

### Frontend Optimization
- **Next.js App Router** - Modern routing with streaming
- **React 19** - Latest performance improvements
- **Three.js** - Hardware-accelerated 3D rendering
- **Tailwind CSS** - Optimized CSS delivery

### Backend Performance
- **FastAPI** - High-performance Python web framework
- **Vector Search** - Multiple backends for optimal query performance
- **Database Indexing** - Optimized queries with Xata
- **Caching** - Redis for frequently accessed data

### Development Performance
- **Bun** - Fast JavaScript runtime (2-10x faster than Node.js)
- **Hot Reloading** - Instant development feedback
- **TypeScript** - Compile-time error detection