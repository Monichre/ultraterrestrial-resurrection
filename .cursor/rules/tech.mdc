# Technology Stack

## Build System & Package Management
- **Runtime**: Bun (JavaScript/TypeScript), Python 3.9+
- **Monorepo**: Turborepo with workspace configuration
- **Package Manager**: Bun for JS/TS, pip/conda for Python

## Frontend Stack
- **Framework**: Next.js 15.3.5 with App Router
- **React**: 19.1.0 with React Server Components
- **Styling**: Tailwind CSS 4.1.11 + Radix UI components
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animations**: Framer Motion, GSAP
- **State Management**: Zustand, React Context
- **Real-time**: Liveblocks, PartySocket

## Backend & Data
- **Database**: Xata (PostgreSQL) with vector search capabilities
- **Vector Storage**: Multi-backend (Upstash Vector, FAISS, pgvector)
- **AI/ML**: OpenAI, Anthropic, Groq via Vercel AI SDK
- **Authentication**: Clerk
- **File Storage**: Vercel Blob, Xata file attachments

## Python RAG System
- **Framework**: FastAPI, Streamlit
- **AI/ML**: LangChain, sentence-transformers, torch
- **Vector DBs**: FAISS, Upstash Vector, CocoIndex (pgvector)
- **Document Processing**: PyPDF2, PyMuPDF, BeautifulSoup4
- **CLI**: Charm CLI tools (gum, huh, glow, glamour)

## Development Tools
- **TypeScript**: 5.8+ with strict configuration
- **Linting**: ESLint 9.30+ with Next.js config
- **Component Development**: Storybook 8.6+
- **Testing**: Jest, Storybook testing utilities
- **Code Generation**: Plop for component scaffolding

## Common Commands

### Development
```bash
# Start main app
bun run dev:app

# Start Storybook
bun run storybook

# Python RAG system
cd apps/disclosure-rag
python streamlit_app.py    # Dashboard
python api_server.py       # API server
python cli.py             # Interactive CLI
```

### Build & Deploy
```bash
# Build main app
bun run build:app

# Start production
bun run start:app

# Component audit
bun run audit:components
```

### Data Operations
```bash
# Export Xata data
bun run export:xata

# Import data
bun run import:data
bun run import:events
bun run import:sightings
```

### Code Generation
```bash
# Generate new components
bun run new
bun run bun:new

# Parse PRD for tasks
bun run parse-prd
```

## Key Libraries & Integrations
- **Visualization**: D3.js, Recharts, react-force-graph
- **Maps**: Mapbox GL, react-map-gl, dotted-map
- **Editor**: TipTap with collaboration extensions
- **File Processing**: react-pdf, mammoth (Word docs)
- **UI Effects**: @tsparticles, rough-notation, react-spring
- **External APIs**: Firecrawl, Tavily, EXA search

## Environment Configuration
Projects use `.env` files with extensive configuration for:
- AI API keys (OpenAI, Anthropic, Groq)
- Database connections (Xata, PostgreSQL)
- Vector storage credentials
- Authentication providers
- External service integrations

## Architecture Patterns
- **Monorepo**: Apps and packages with shared dependencies
- **Component-driven**: Storybook documentation for all UI components
- **Type-safe**: Full TypeScript coverage with generated types
- **AI-first**: RAG integration throughout the application stack
- **Real-time**: WebSocket connections for collaborative features