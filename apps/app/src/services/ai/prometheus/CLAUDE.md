# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## Project Overview

Prometheus AI is a Next.js research assistant application specialized in UFO/UAP (Unidentified Aerial Phenomena) information. The application provides an interactive AI agent interface with advanced document processing capabilities and immersive visual effects.

### Key Features

- Conversational AI agent with file upload and analysis capabilities
- Two distinct AI personalities: Prometheus and Daedalus frameworks
- Document processing tools (summarization, topic extraction, contextualization)
- Three.js background visualization with custom shader effects
- Modern UI built with Radix UI and Tailwind CSS

## Development Setup

### Installation & Commands

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Code linting
bun run lint
```

### Environment Variables

The following environment variables are required for full Prometheus functionality:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=your_assistant_id  
OPENAI_VECTOR_STORE_ID=your_vector_store_id

# Exa AI Configuration (for external web resources)
EXA_API_KEY=your_exa_api_key

# Other configurations...
```

**New in External Resources RAG Integration:**
- `EXA_API_KEY`: Required for searching trusted external UFO/UAP websites
- Enables real-time access to MUFON, The Black Vault, Open Minds, and other research sources
- Provides neural semantic search capabilities with domain restrictions

## Architecture Overview

### Core Technologies

- **Next.js**: React framework with TypeScript
- **Anthropic Claude**: AI model integration via AI SDK
- **React Three Fiber**: 3D visualization and shader effects
- **Framer Motion**: UI animations and transitions
- **Tailwind CSS + Radix UI**: Styling and component system
- **Storybook**: Component development environment

### Project Structure

```
app/
├── api/agent/           # AI agent API endpoints
├── layout.tsx           # Application layout
└── page.tsx            # Main landing page

components/
├── ui/                 # Reusable UI components
├── agent.tsx           # Main chat interface
├── CirclesShader.tsx   # Three.js visual effects
├── document-*.tsx      # Document processing components
└── error-boundary.tsx  # Error handling

lib/
├── prometheus.prompts.ts # Prometheus AI framework
├── daedalus.prompt.ts   # Daedalus AI framework
└── build-prompt.ts      # Prompt construction utilities

utils/
├── file-processing.ts   # Document analysis utilities
└── pdf-fallback.ts      # PDF processing fallbacks
```

## Core Components

### AI Agent Interface (`components/agent.tsx`)

The primary chat interface handling:
- User input and conversation management
- File upload and processing workflows
- Command palette with slash commands (`/analyze`, `/ingest`, `/research`, `/connect`)
- Real-time document analysis features

### API Integration (`app/api/prometheus/chat/route.ts`)

Server endpoint managing:
- OpenAI Assistant API communication with vector store search
- **NEW: Exa AI integration for external web resources**
- Framework switching between Prometheus and other AI personalities
- Custom tools for comprehensive UAP/UFO research:
  - `searchUAP`: Local knowledge base via OpenAI Assistant
  - `searchExternalResources`: External trusted sources via Exa AI
  - `processDocument`: Document analysis (illuminate, summarize, contextualize)
- Error handling and response formatting

### External Resources Integration (NEW)

Comprehensive external web search capabilities:
- **Neural Search**: Semantic understanding of UFO/UAP content
- **Domain Restrictions**: 13 trusted research sources (MUFON, Black Vault, etc.)
- **Content Filtering**: Excludes social media and unreliable sources  
- **Real-time Access**: Live search of current external content
- **Hybrid Intelligence**: Combines local knowledge with external research

## Testing Guide & Usage Examples

### Quick Start Testing

1. **Install Dependencies**: `bun install` (exa-js should now be included)
2. **Environment Setup**: Add `EXA_API_KEY=your_exa_api_key` to `.env.local`
3. **Start Development**: `bun run dev`
4. **Navigate to Prometheus**: Visit `/prometheus` page

### Command Palette Usage

**Available Commands**:
- `/search` - Search local knowledge base (OpenAI Assistant)
- `/external` - Search external websites (Exa AI neural search)
- `/research` - Deep research analysis (Exa AI Research Pro)
- `/analyze` - Analyze uploaded documents
- `/connect` - Find connections in knowledge base

### Example Queries

**Basic External Search**:
```
/external Pentagon UAP report 2024
Search for recent MUFON triangle sightings
Find Black Vault documents about Roswell
```

**Deep Research Examples**:
```
/research Analyze the correlation between nuclear facilities and UAP sightings
Research the evolution of government UAP disclosure from 2017 to 2024
Comprehensive analysis of pilot UAP encounters and official responses
```

**Hybrid Research Workflow**:
```
1. "Search local knowledge for Nimitz incident details"
2. "/external latest analysis of Nimitz UAP encounter"  
3. "/research comprehensive analysis of Nimitz incident including recent developments"
```

### Advanced Features

**Livecrawl Options** (automatic, can be specified):
- `always` - Get the most current content (slower, most up-to-date)
- `fallback` - Use cached then live if needed (balanced, default)
- `never` - Use only cached content (faster, may be outdated)

**Research Depth Levels**:
- `summary` - Quick overview and key points
- `comprehensive` - Detailed analysis with multiple perspectives (default)
- `academic` - Scholarly depth with extensive source analysis

**Domain Targeting**:
```
Focus search on specific sources:
"Search MUFON and CUFOS for recent triangle UAP reports"
"Research using only government and scientific sources"
```

### Testing Scenarios

**Scenario 1: Current Events**
```
Query: "What are the latest UAP developments from Congress?"
Expected: Recent congressional hearings, bills, statements
Tools Used: searchExternalResources with livecrawl 'always'
```

**Scenario 2: Historical Analysis**
```
Query: "Analyze patterns in UAP sightings near nuclear facilities"
Expected: Historical data + recent analysis + research connections
Tools Used: searchUAP + searchExternalResources + researchExternalTopic
```

**Scenario 3: Document Analysis**
```
Upload: Recent UAP report PDF
Expected: Summary + connections to known cases + external verification
Tools Used: processDocument + searchUAP + searchExternalResources
```

### Performance Expectations

**Response Times**:
- Local search: 2-5 seconds
- External search: 5-15 seconds (depending on livecrawl)
- Deep research: 2-5 minutes (comprehensive analysis)

**Quality Indicators**:
- Source citations from trusted domains
- Real-time content when using livecrawl
- Cross-referenced information between local and external sources
- Structured research output with academic rigor

### Document Processing System

Comprehensive file handling supporting:
- **Text formats**: Plain text, Markdown
- **Documents**: PDF (with PDF.js and fallback support)
- **Images**: Various formats with analysis capabilities
- **Processing tools**: Text extraction, summarization, topic identification

## AI Framework Design

### Prometheus Framework (`lib/prometheus.prompts.ts`)
Research-focused personality designed for "illuminating the unknown" with:
- Structured knowledge organization
- Analytical approach to UAP/UFO information
- Systematic information categorization

### Daedalus Framework (`lib/daedalus.prompt.ts`)
Navigation-oriented personality for "traversing information labyrinths" with:
- Complex information synthesis
- Contextual relationship mapping
- Strategic research guidance

## User Interface Features

### Interactive Elements
- **Command Palette**: Quick access to specialized functions
- **Document Options**: Context menus for file analysis
- **Loading States**: Visual feedback with typewriter animations
- **Error Handling**: Graceful degradation with toast notifications

### Visual Design
- **Three.js Background**: Custom shader effects and animations
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: ARIA compliance and keyboard navigation
- **Theme System**: Consistent styling with Tailwind CSS

## Implementation Details

### File Processing Pipeline
1. **Upload Detection**: Automatic file type identification
2. **Content Extraction**: Text parsing with PDF.js integration and fallbacks
3. **Analysis Tools**: Summarization, topic extraction, contextualization
4. **Response Integration**: Seamless incorporation into chat interface

### Error Handling Strategy
- **Boundary Components**: React error boundaries for component-level failures
- **API Resilience**: Graceful degradation for service interruptions
- **User Feedback**: Clear error messages and recovery suggestions
- **Fallback Systems**: Alternative processing methods for critical features

### Performance Optimizations
- **Build Configuration**: TypeScript and ESLint warnings suppressed in production
- **Asset Management**: Optimized Three.js rendering and shader compilation
- **Component Lazy Loading**: Strategic code splitting for faster initial loads

## Development Notes

### Current State
- Uses mock data for some responses (designed for extension with real data sources)
- Infrastructure prepared for URL ingestion functionality
- Storybook configured for component development and testing

### Configuration Files
- **Build Settings**: `next.config.mjs` with error suppression for production
- **Styling**: `tailwind.config.ts` with custom theme extensions
- **TypeScript**: `tsconfig.json` with strict type checking
- **Git Management**: Custom `.gitignore` for development artifacts

### Future Considerations
- Real data source integration for UAP/UFO information
- Enhanced document processing capabilities
- Additional AI framework personalities
- Extended visualization features


TO DO: 

1. Read @PROGRESS_REPORT.md - [PROGRESS REPORT](./PROGRESS_REPORT.md)
2. Read @STATUS.md - [STATUS REPORT](./STATUS.md)